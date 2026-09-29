import * as admin from "firebase-admin";
import * as crypto from "crypto";

export const WHATSAPP_OUTBOUND_RECEIPTS = "whatsapp_outbound_receipts";
export const WHATSAPP_STATUS_RECEIPTS = "whatsapp_status_receipts";

export type WhatsAppProviderStatus = "sent" | "delivered" | "read" | "failed" | "deleted";

const STATUS_RANK: Record<WhatsAppProviderStatus, number> = {
  sent: 1,
  delivered: 2,
  read: 3,
  failed: 4,
  deleted: 5,
};

export function whatsAppProviderIdKey(value: unknown): string {
  const id = typeof value === "string" ? value.trim() : "";
  if (!id || id.length > 4096) throw new Error("Invalid WhatsApp provider message ID");
  return crypto.createHash("sha256").update(id).digest("hex");
}

function normalizeProviderStatus(value: unknown): WhatsAppProviderStatus | null {
  const status = String(value || "").trim().toLowerCase();
  return Object.prototype.hasOwnProperty.call(STATUS_RANK, status)
    ? status as WhatsAppProviderStatus
    : null;
}

function providerTimestamp(value: unknown): string {
  const seconds = Number(value);
  if (!Number.isSafeInteger(seconds) || seconds <= 0) return new Date().toISOString();
  const date = new Date(seconds * 1000);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function timestampMillis(value: unknown): number {
  if (value && typeof value === "object" && "toMillis" in value) {
    const method = (value as { toMillis?: unknown }).toMillis;
    if (typeof method === "function") return Number(method.call(value)) || 0;
  }
  const parsed = new Date(typeof value === "string" ? value : "").getTime();
  return Number.isFinite(parsed) ? parsed : 0;
}

export function shouldApplyWhatsAppStatus(
  currentValue: unknown,
  incomingValue: unknown,
  currentAt?: unknown,
  incomingAt?: unknown
): boolean {
  const current = normalizeProviderStatus(currentValue);
  const incoming = normalizeProviderStatus(incomingValue);
  if (!incoming) return false;
  if (!current) return true;

  // A late failure notification must not downgrade a message Meta already
  // confirmed as delivered/read. Meta explicitly warns that callbacks can be
  // out of order.
  if (incoming === "failed" && (current === "delivered" || current === "read")) {
    return false;
  }
  // A positive delivery/read confirmation is stronger than an earlier
  // failure callback. Treat failure as a branch, not as a higher delivery
  // rank, so an out-of-order callback cannot leave a delivered message failed.
  if (current === "failed" && (incoming === "delivered" || incoming === "read")) {
    return true;
  }
  if (STATUS_RANK[incoming] > STATUS_RANK[current]) return true;
  if (STATUS_RANK[incoming] < STATUS_RANK[current]) return false;
  return timestampMillis(incomingAt) >= timestampMillis(currentAt);
}

function safeProviderErrorCode(status: any): number | null {
  const errors = Array.isArray(status?.errors) ? status.errors : [];
  const code = Number(errors[0]?.code || 0);
  return Number.isSafeInteger(code) && code > 0 ? code : null;
}

function validMessagePath(value: unknown): string | null {
  const path = typeof value === "string" ? value.trim() : "";
  const parts = path.split("/");
  if (
    parts.length !== 4 ||
    parts[0] !== "whatsapp_conversations" ||
    parts[2] !== "messages" ||
    parts.some((part) => !part || part === "." || part === "..")
  ) {
    return null;
  }
  return path;
}

export async function processWhatsAppMessageStatus(status: any): Promise<"updated" | "queued" | "ignored"> {
  const providerStatus = normalizeProviderStatus(status?.status);
  if (!providerStatus) return "ignored";
  const providerMessageId = typeof status?.id === "string" ? status.id.trim() : "";
  const key = whatsAppProviderIdKey(providerMessageId);
  const statusAt = providerTimestamp(status?.timestamp);
  const providerErrorCode = safeProviderErrorCode(status);
  const db = admin.firestore();
  const mappingRef = db.collection(WHATSAPP_OUTBOUND_RECEIPTS).doc(key);
  const statusRef = db.collection(WHATSAPP_STATUS_RECEIPTS).doc(key);

  const outcome = await db.runTransaction(async (transaction) => {
    const [mappingSnapshot, statusSnapshot] = await Promise.all([
      transaction.get(mappingRef),
      transaction.get(statusRef),
    ]);
    const queued = statusSnapshot.data() || {};
    const shouldReplaceQueued = shouldApplyWhatsAppStatus(
      queued.status,
      providerStatus,
      queued.status_at,
      statusAt
    );
    if (!mappingSnapshot.exists) {
      if (shouldReplaceQueued || !statusSnapshot.exists) {
        transaction.set(statusRef, {
          wa_message_id: providerMessageId,
          status: providerStatus,
          status_at: statusAt,
          provider_error_code: providerErrorCode,
          reconciled: false,
          updated_at: new Date().toISOString(),
        }, { merge: true });
      }
      return "queued" as const;
    }

    const messagePath = validMessagePath(mappingSnapshot.data()?.message_path);
    if (!messagePath) {
      transaction.set(statusRef, {
        wa_message_id: providerMessageId,
        status: providerStatus,
        status_at: statusAt,
        provider_error_code: providerErrorCode,
        reconciled: false,
        mapping_invalid: true,
        updated_at: new Date().toISOString(),
      }, { merge: true });
      return "queued" as const;
    }

    const messageRef = db.doc(messagePath);
    const messageSnapshot = await transaction.get(messageRef);
    if (!messageSnapshot.exists) {
      transaction.set(statusRef, {
        wa_message_id: providerMessageId,
        status: providerStatus,
        status_at: statusAt,
        provider_error_code: providerErrorCode,
        reconciled: false,
        message_missing: true,
        updated_at: new Date().toISOString(),
      }, { merge: true });
      return "queued" as const;
    }

    const message = messageSnapshot.data() || {};
    if (shouldApplyWhatsAppStatus(message.status, providerStatus, message.provider_status_at, statusAt)) {
      transaction.update(messageRef, {
        status: providerStatus,
        dispatch_state: providerStatus === "failed" ? "failed" : "confirmed",
        provider_status_at: statusAt,
        provider_error_code: providerErrorCode,
        updated_at: new Date().toISOString(),
      });
    }
    transaction.set(statusRef, {
      ...(shouldReplaceQueued || !statusSnapshot.exists
        ? {
            wa_message_id: providerMessageId,
            status: providerStatus,
            status_at: statusAt,
            provider_error_code: providerErrorCode,
          }
        : {}),
      reconciled: true,
      message_path: messagePath,
      updated_at: new Date().toISOString(),
    }, { merge: true });
    return "updated" as const;
  });

  console.log(`whatsapp_status_${outcome} correlation=${key.slice(0, 12)} status=${providerStatus}`);
  return outcome;
}

/** Replays a status that arrived before the send response/mapping commit. */
export async function reconcileQueuedWhatsAppStatus(providerMessageId: string): Promise<void> {
  const key = whatsAppProviderIdKey(providerMessageId);
  const snapshot = await admin.firestore().collection(WHATSAPP_STATUS_RECEIPTS).doc(key).get();
  if (!snapshot.exists || snapshot.data()?.reconciled === true) return;
  const queued = snapshot.data() || {};
  await processWhatsAppMessageStatus({
    id: providerMessageId,
    status: queued.status,
    timestamp: Math.floor(timestampMillis(queued.status_at) / 1000),
    ...(queued.provider_error_code ? { errors: [{ code: queued.provider_error_code }] } : {}),
  });
}
