import * as admin from "firebase-admin";
import * as crypto from "crypto";
import axios from "axios";
import {
  reconcileQueuedWhatsAppStatus,
  WHATSAPP_OUTBOUND_RECEIPTS,
  whatsAppProviderIdKey,
} from "./whatsapp-status";

function getDb() {
  return admin.firestore();
}

export interface SendMessageData {
  conversation_id: string;
  message: string;
  client_request_id?: string;
  to?: unknown;
}

export interface AutomatedReplyData {
  conversationId: string;
  inboundMessageId: string;
  inboundProviderMessageId?: string;
  customerMessageAt: string;
  sequence: number;
  content: string;
  allowControlCommand?: boolean;
}

export type WhatsAppSendKind =
  | "configuration"
  | "outside_window"
  | "suppressed"
  | "rejected"
  | "ambiguous"
  | "invalid";

export class WhatsAppSendError extends Error {
  constructor(
    public readonly kind: WhatsAppSendKind,
    message: string,
    public readonly providerCode: number | null = null
  ) {
    super(message);
    this.name = "WhatsAppSendError";
  }
}

interface ProviderConfig {
  phoneNumberId: string;
  graphApiVersion: string;
  accessToken: string;
}

interface ReservedTextOptions {
  conversationId: string;
  content: string;
  idempotencyKey: string;
  senderName: string;
  origin: "bot" | "manual";
  customerMessageAt: string;
  sequence?: number;
  allowControlCommand?: boolean;
  replyToProviderMessageId?: string;
  clearUnread?: boolean;
}

interface ProviderResponse {
  waMessageId: string;
}

type ProviderAdapter = (args: {
  config: ProviderConfig;
  to: string;
  content: string;
  replyToProviderMessageId?: string;
}) => Promise<ProviderResponse>;

const CUSTOMER_SERVICE_WINDOW_MS = 24 * 60 * 60 * 1000;
const MAX_TEXT_LENGTH = 4096;

function safeDocumentId(value: unknown, label: string): string {
  const id = typeof value === "string" ? value.trim() : "";
  if (!id || id.length > 500 || id.includes("/")) {
    throw new WhatsAppSendError("invalid", `${label} is invalid`);
  }
  return id;
}

function safeText(value: unknown): string {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text || text.length > MAX_TEXT_LENGTH) {
    throw new WhatsAppSendError(
      "invalid",
      `WhatsApp text must contain 1-${MAX_TEXT_LENGTH} characters`
    );
  }
  return text;
}

function safeRecipient(value: unknown): string {
  const digits = typeof value === "string" ? value.trim() : "";
  if (!/^\d{6,20}$/.test(digits)) {
    throw new WhatsAppSendError("invalid", "Conversation has no valid WhatsApp recipient");
  }
  return digits;
}

function timestampMillis(value: unknown): number {
  if (value && typeof value === "object" && "toMillis" in value) {
    const method = (value as { toMillis?: unknown }).toMillis;
    if (typeof method === "function") return Number(method.call(value)) || 0;
  }
  const parsed = new Date(typeof value === "string" ? value : "").getTime();
  return Number.isFinite(parsed) ? parsed : 0;
}

export function isWithinWhatsAppCustomerServiceWindow(
  lastCustomerMessageAt: unknown,
  nowMs = Date.now()
): boolean {
  const inboundMs = timestampMillis(lastCustomerMessageAt);
  return inboundMs > 0 && nowMs >= inboundMs && nowMs - inboundMs < CUSTOMER_SERVICE_WINDOW_MS;
}

export function requireGraphApiVersion(value: unknown): string {
  const version = String(value || "").trim();
  if (!/^v\d+\.\d+$/.test(version)) {
    throw new WhatsAppSendError(
      "configuration",
      "config/whatsapp.graph_api_version is required"
    );
  }
  return version;
}

function outboundMessageId(idempotencyKey: string): string {
  return `out_${crypto.createHash("sha256").update(idempotencyKey).digest("hex")}`;
}

async function loadProviderConfig(): Promise<ProviderConfig> {
  const snapshot = await getDb().collection("config").doc("whatsapp").get();
  const data = snapshot.data() || {};
  const phoneNumberId = String(data.phone_number_id || "1245526575308526").trim();
  const accessToken = String(process.env.WHATSAPP_ACCESS_TOKEN || data.access_token || "").trim();
  if (!/^\d{5,40}$/.test(phoneNumberId) || !accessToken) {
    throw new WhatsAppSendError(
      "configuration",
      "WhatsApp provider configuration is incomplete"
    );
  }
  const rawVersion = String(data.graph_api_version || "v21.0").trim();
  const graphApiVersion = rawVersion === "v26.0" ? "v21.0" : requireGraphApiVersion(rawVersion);
  return {
    phoneNumberId,
    graphApiVersion,
    accessToken,
  };
}

function safeProviderCode(error: any): number | null {
  const code = Number(error?.response?.data?.error?.code || 0);
  return Number.isSafeInteger(code) && code > 0 ? code : null;
}

async function defaultProviderAdapter(args: {
  config: ProviderConfig;
  to: string;
  content: string;
  replyToProviderMessageId?: string;
}): Promise<ProviderResponse> {
  const response = await axios.post(
    `https://graph.facebook.com/${args.config.graphApiVersion}/${args.config.phoneNumberId}/messages`,
    {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: args.to,
      type: "text",
      text: { body: args.content, preview_url: false },
      ...(args.replyToProviderMessageId
        ? { context: { message_id: args.replyToProviderMessageId } }
        : {}),
    },
    {
      timeout: 15_000,
      headers: {
        Authorization: `Bearer ${args.config.accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  const waMessageId = String(response.data?.messages?.[0]?.id || "").trim();
  if (!waMessageId) {
    throw new WhatsAppSendError(
      "ambiguous",
      "Meta accepted the request without returning a message ID"
    );
  }
  return { waMessageId };
}

async function reserveOutboundText(options: ReservedTextOptions): Promise<{
  messageRef: admin.firestore.DocumentReference;
  recipient: string;
  state: "reserved" | "sent" | "suppressed" | "failed" | "unknown";
  waMessageId?: string;
}> {
  const db = getDb();
  const conversationId = safeDocumentId(options.conversationId, "conversation_id");
  const conversationRef = db.collection("whatsapp_conversations").doc(conversationId);
  const messageRef = conversationRef
    .collection("messages")
    .doc(outboundMessageId(options.idempotencyKey));
  const now = new Date().toISOString();

  return db.runTransaction(async (transaction) => {
    const [conversationSnapshot, messageSnapshot] = await Promise.all([
      transaction.get(conversationRef),
      transaction.get(messageRef),
    ]);
    if (!conversationSnapshot.exists) {
      throw new WhatsAppSendError("invalid", "WhatsApp conversation does not exist");
    }
    const conversation = conversationSnapshot.data() || {};
    const recipient = safeRecipient(conversation.customer_whatsapp);

    if (messageSnapshot.exists) {
      const message = messageSnapshot.data() || {};
      const status = String(message.status || "");
      const dispatchState = String(message.dispatch_state || "");
      if (["sent", "delivered", "read"].includes(status)) {
        return {
          messageRef,
          recipient,
          state: "sent" as const,
          waMessageId: String(message.wa_message_id || ""),
        };
      }
      if (dispatchState === "unknown" || dispatchState === "sending") {
        return { messageRef, recipient, state: "unknown" as const };
      }
      if (dispatchState === "failed" || status === "failed") {
        return { messageRef, recipient, state: "failed" as const };
      }
      return { messageRef, recipient, state: "reserved" as const };
    }

    const serviceWindowAt = options.customerMessageAt || conversation.last_customer_message_at;
    if (!isWithinWhatsAppCustomerServiceWindow(serviceWindowAt)) {
      throw new WhatsAppSendError(
        "outside_window",
        "Free-form WhatsApp replies require a customer message within the last 24 hours"
      );
    }

    if (options.origin === "bot" && !options.allowControlCommand) {
      const sequence = Number(options.sequence || 0);
      const barrierSequence = Number(conversation.automation_barrier_sequence || 0);
      const enabledFromSequence = Number(conversation.automation_enabled_from_sequence || 0);
      if (
        conversation.automation_mode !== "ai" ||
        conversation.bot_opted_out === true ||
        (barrierSequence > 0 && sequence < barrierSequence) ||
        (enabledFromSequence > 0 && sequence < enabledFromSequence)
      ) {
        return { messageRef, recipient, state: "suppressed" as const };
      }
    }

    transaction.create(messageRef, {
      conversation_id: conversationId,
      direction: "outbound",
      content: options.content,
      content_type: "text",
      status: "pending",
      dispatch_state: "reserved",
      sender_name: options.senderName,
      origin: options.origin,
      idempotency_key_hash: crypto
        .createHash("sha256")
        .update(options.idempotencyKey)
        .digest("hex"),
      timestamp: now,
      created_at: now,
      updated_at: now,
      ...(options.sequence ? { bot_sequence: options.sequence } : {}),
    });

    // A human send is an explicit takeover and must stop an AI reply already
    // being generated for the same conversation before it reaches Meta.
    if (options.origin === "manual") {
      transaction.update(conversationRef, {
        automation_mode: "human",
        automation_barrier_sequence: Number(conversation.bot_last_sequence || 0) + 1,
        assigned_to: conversation.assigned_to || "staff",
        updated_at: now,
      });
    }
    return { messageRef, recipient, state: "reserved" as const };
  });
}

async function markDispatchState(
  messageRef: admin.firestore.DocumentReference,
  expected: string[],
  patch: Record<string, unknown>
): Promise<boolean> {
  const db = getDb();
  return db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(messageRef);
    if (!snapshot.exists || !expected.includes(String(snapshot.data()?.dispatch_state || ""))) {
      return false;
    }
    transaction.update(messageRef, { ...patch, updated_at: new Date().toISOString() });
    return true;
  });
}

export async function sendReservedWhatsAppText(
  options: ReservedTextOptions,
  dependencies: { config?: ProviderConfig; provider?: ProviderAdapter } = {}
): Promise<{ status: "sent" | "duplicate" | "suppressed"; messageId: string; waMessageId?: string }> {
  const content = safeText(options.content);
  const config = dependencies.config || await loadProviderConfig();
  const provider = dependencies.provider || defaultProviderAdapter;
  const reservation = await reserveOutboundText({ ...options, content });

  if (reservation.state === "sent") {
    return {
      status: "duplicate",
      messageId: reservation.messageRef.id,
      waMessageId: reservation.waMessageId,
    };
  }
  if (reservation.state === "suppressed") {
    return { status: "suppressed", messageId: reservation.messageRef.id };
  }
  if (reservation.state === "unknown") {
    throw new WhatsAppSendError(
      "ambiguous",
      "A prior provider attempt has an unresolved outcome; automatic resend is blocked"
    );
  }
  if (reservation.state === "failed") {
    throw new WhatsAppSendError(
      "rejected",
      "A prior provider attempt was rejected; use a reviewed retry"
    );
  }

  const attemptId = crypto.randomUUID();
  const claimed = await markDispatchState(
    reservation.messageRef,
    ["reserved"],
    {
      dispatch_state: "sending",
      dispatch_attempt_id: attemptId,
      dispatch_started_at: new Date().toISOString(),
    }
  );
  if (!claimed) {
    throw new WhatsAppSendError(
      "ambiguous",
      "The outbound reservation is already being processed"
    );
  }

  try {
    const response = await provider({
      config,
      to: reservation.recipient,
      content,
      replyToProviderMessageId: options.replyToProviderMessageId,
    });
    const providerKey = whatsAppProviderIdKey(response.waMessageId);
    const mappingRef = getDb().collection(WHATSAPP_OUTBOUND_RECEIPTS).doc(providerKey);
    const conversationRef = reservation.messageRef.parent.parent!;
    const sentAt = new Date().toISOString();
    await getDb().runTransaction(async (transaction) => {
      const messageSnapshot = await transaction.get(reservation.messageRef);
      if (
        !messageSnapshot.exists ||
        messageSnapshot.data()?.dispatch_attempt_id !== attemptId ||
        messageSnapshot.data()?.dispatch_state !== "sending"
      ) {
        throw new Error("Outbound WhatsApp attempt lost its reservation");
      }
      transaction.update(reservation.messageRef, {
        status: "sent",
        dispatch_state: "sent",
        wa_message_id: response.waMessageId,
        provider_status_at: sentAt,
        sent_at: sentAt,
        updated_at: sentAt,
      });
      transaction.set(mappingRef, {
        wa_message_id: response.waMessageId,
        conversation_id: conversationRef.id,
        message_id: reservation.messageRef.id,
        message_path: reservation.messageRef.path,
        created_at: sentAt,
        updated_at: sentAt,
      }, { merge: true });
      transaction.update(conversationRef, {
        last_message: content.substring(0, 100),
        last_message_time: sentAt,
        ...(options.clearUnread ? { unread_count: 0 } : {}),
        updated_at: sentAt,
      });
    });
    await reconcileQueuedWhatsAppStatus(response.waMessageId);
    console.log(`whatsapp_send_sent correlation=${reservation.messageRef.id.slice(0, 16)}`);
    return {
      status: "sent",
      messageId: reservation.messageRef.id,
      waMessageId: response.waMessageId,
    };
  } catch (error: any) {
    if (error instanceof WhatsAppSendError && error.kind === "ambiguous") {
      await markDispatchState(reservation.messageRef, ["sending"], {
        status: "pending",
        dispatch_state: "unknown",
        provider_error_code: error.providerCode,
      });
      console.error(`whatsapp_send_unknown correlation=${reservation.messageRef.id.slice(0, 16)}`);
      throw error;
    }

    const httpStatus = Number(error?.response?.status || 0);
    const providerCode = safeProviderCode(error);
    const definiteRejection = httpStatus >= 400 && httpStatus < 500;
    await markDispatchState(reservation.messageRef, ["sending"], {
      status: definiteRejection ? "failed" : "pending",
      dispatch_state: definiteRejection ? "failed" : "unknown",
      provider_http_status: httpStatus || null,
      provider_error_code: providerCode,
    });
    console.error(
      `whatsapp_send_${definiteRejection ? "rejected" : "unknown"} ` +
      `correlation=${reservation.messageRef.id.slice(0, 16)} ` +
      `http=${httpStatus || 0} code=${providerCode || 0}`
    );
    throw new WhatsAppSendError(
      definiteRejection ? "rejected" : "ambiguous",
      definiteRejection
        ? "Meta rejected the WhatsApp message"
        : "The WhatsApp provider outcome is unresolved; automatic resend is blocked",
      providerCode
    );
  }
}

export async function sendAutomatedWhatsAppReply(
  data: AutomatedReplyData,
  dependencies: { config?: ProviderConfig; provider?: ProviderAdapter } = {}
) {
  return sendReservedWhatsAppText({
    conversationId: data.conversationId,
    content: data.content,
    idempotencyKey: `bot:${data.conversationId}:${data.inboundMessageId}`,
    senderName: "Yaal Nilam AI",
    origin: "bot",
    customerMessageAt: data.customerMessageAt,
    sequence: data.sequence,
    allowControlCommand: data.allowControlCommand,
    replyToProviderMessageId: data.inboundProviderMessageId,
  }, dependencies);
}

/** Send a staff or system reply. The recipient is resolved from the conversation. */
export async function sendWhatsAppMessage(data: SendMessageData): Promise<any> {
  const conversationId = safeDocumentId(data?.conversation_id, "conversation_id");
  const requestId = typeof data?.client_request_id === "string" && data.client_request_id.trim()
    ? safeDocumentId(data.client_request_id, "client_request_id")
    : crypto.randomUUID();
  const message = safeText(data?.message);
  const conversation = await getDb()
    .collection("whatsapp_conversations")
    .doc(conversationId)
    .get();
  if (!conversation.exists) {
    throw new WhatsAppSendError("invalid", "WhatsApp conversation does not exist");
  }
  const result = await sendReservedWhatsAppText({
    conversationId,
    content: message,
    idempotencyKey: `manual:${conversationId}:${requestId}`,
    senderName: "Yaal Nilam Team",
    origin: "manual",
    customerMessageAt: String(conversation.data()?.last_customer_message_at || ""),
    clearUnread: true,
  });
  return {
    success: true,
    duplicate: result.status === "duplicate",
    message_id: result.messageId,
    wa_message_id: result.waMessageId,
  };
}
