import * as admin from "firebase-admin";
import * as crypto from "crypto";
import { FieldValue } from "firebase-admin/firestore";
import {
  BotDecision,
  BotLanguage,
  BotPreferencePatch,
  PublicListingForBot,
  commandReply,
  composeGroundedBotReply,
  deterministicBotDecision,
  generateBotDecision,
  mergeBotPreferences,
  rankListingsForBot,
} from "./whatsapp-ai";
import {
  WhatsAppSendError,
  sendAutomatedWhatsAppReply,
} from "./whatsapp-send";
import {
  assertWhatsAppInquiryLink,
  buildWhatsAppInquiry,
  buildWhatsAppQualificationPatch,
  whatsappInquiryId,
} from "./inquiry-crm";

const PUBLISHED_STATUSES = [
  "available",
  "approved",
  "published",
  "active",
  "Available",
  "Published",
];
const BOT_LEASE_MS = 90_000;
const MAX_ALERT_OPTOUT_ATTEMPTS = 3;
const MAX_PUBLISHED_LISTINGS_SCAN = 100;
const MODEL_NAME = /^gemini-[a-z0-9][a-z0-9._-]{1,100}$/;

export class WhatsAppBotLeaseBusyError extends Error {
  constructor() {
    super("WhatsApp bot job has an active processing lease");
    this.name = "WhatsAppBotLeaseBusyError";
  }
}

interface BotJobClaim {
  claimed: boolean;
  waiting?: boolean;
  complete?: boolean;
  attemptId?: string;
  conversationId?: string;
  inboundMessageId?: string;
  inboundProviderMessageId?: string;
  sequence?: number;
  contentType?: string;
  controlCommand?: "stop" | "start" | "help" | "human";
  attemptCount?: number;
}

interface WhatsAppBotDependencies {
  cancelActiveAlerts?: (phone: string) => Promise<void>;
  generateDecision?: typeof generateBotDecision;
  sendAutomatedReply?: typeof sendAutomatedWhatsAppReply;
}

function getDb() {
  return admin.firestore();
}

function timestampMillis(value: unknown): number {
  if (value && typeof value === "object" && "toMillis" in value) {
    const method = (value as { toMillis?: unknown }).toMillis;
    if (typeof method === "function") return Number(method.call(value)) || 0;
  }
  const parsed = new Date(typeof value === "string" ? value : "").getTime();
  return Number.isFinite(parsed) ? parsed : 0;
}

function safeNumber(value: unknown): number {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : 0;
}

function safeText(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function getWhatsAppBotConfigStatus(
  config: any,
  hasAccessToken: boolean,
  hasGeminiKey: boolean
) {
  const hasPhoneNumberId = /^\d{5,40}$/.test(String(config?.phone_number_id || ""));
  const hasGraphApiVersion = /^v\d+\.\d+$/.test(String(config?.graph_api_version || ""));
  const autoReplyEnabled = config?.auto_reply_enabled === true;
  const aiEnabled = config?.ai_enabled === true;
  const aiModel = String(config?.ai_model || "").trim();
  const hasAiModel = MODEL_NAME.test(aiModel);
  const rolloutMode = config?.bot_rollout_mode === "live"
    ? "live"
    : config?.bot_rollout_mode === "test"
      ? "test"
      : "off";
  const hasTestAllowlist = Array.isArray(config?.bot_test_sender_hashes) &&
    config.bot_test_sender_hashes.some((value: unknown) => /^[a-f0-9]{64}$/.test(String(value)));
  const outboundConfigured = hasPhoneNumberId && hasGraphApiVersion && hasAccessToken;
  const rolloutConfigured = rolloutMode === "live" ||
    (rolloutMode === "test" && hasTestAllowlist);
  return {
    botConfigured:
      outboundConfigured &&
      autoReplyEnabled &&
      aiEnabled &&
      hasGeminiKey &&
      hasAiModel &&
      rolloutConfigured,
    deterministicFallbackConfigured:
      outboundConfigured &&
      autoReplyEnabled &&
      rolloutConfigured,
    outboundConfigured,
    hasPhoneNumberId,
    hasGraphApiVersion,
    hasAccessToken,
    autoReplyEnabled,
    aiEnabled,
    hasGeminiKey,
    hasAiModel,
    aiModel: hasAiModel ? aiModel : "",
    rolloutMode,
    hasTestAllowlist,
  };
}

export function isWhatsAppBotRolloutAllowed(config: any, customerWhatsApp: unknown): boolean {
  if (config?.bot_rollout_mode === "live") return true;
  if (config?.bot_rollout_mode !== "test") return false;
  const phone = String(customerWhatsApp || "").replace(/\D/g, "");
  if (!phone) return false;
  const hash = crypto.createHash("sha256").update(phone).digest("hex");
  return Array.isArray(config?.bot_test_sender_hashes) &&
    config.bot_test_sender_hashes.some((value: unknown) => String(value) === hash);
}

async function claimBotJob(
  jobRef: admin.firestore.DocumentReference,
  eventId: string
): Promise<BotJobClaim> {
  const db = getDb();
  const conversationRef = jobRef.parent.parent;
  if (!conversationRef || conversationRef.parent.id !== "whatsapp_conversations") {
    return { claimed: false, complete: true };
  }
  const nowMs = Date.now();
  const now = new Date(nowMs).toISOString();
  return db.runTransaction(async (transaction) => {
    const [jobSnapshot, conversationSnapshot] = await Promise.all([
      transaction.get(jobRef),
      transaction.get(conversationRef),
    ]);
    if (!jobSnapshot.exists || !conversationSnapshot.exists) {
      return { claimed: false, complete: true };
    }
    const job = jobSnapshot.data() || {};
    const conversation = conversationSnapshot.data() || {};
    const status = String(job.status || "");
    const sequence = Number(job.sequence || 0);
    const nextSequence = Number(conversation.bot_next_sequence || sequence);
    if ([
      "replied",
      "suppressed",
      "failed",
      "unknown",
      "skipped_configuration",
      "skipped_rollout",
      "skipped_human",
      "skipped_stale",
    ].includes(status)) {
      return { claimed: false, complete: true };
    }
    if (sequence > nextSequence) return { claimed: false, waiting: true };
    if (sequence < nextSequence) {
      transaction.update(jobRef, {
        status: "skipped_stale",
        completed_at: now,
        updated_at: now,
      });
      return { claimed: false, complete: true };
    }
    if (status === "processing" && timestampMillis(job.lease_until) > nowMs) {
      throw new WhatsAppBotLeaseBusyError();
    }

    const attemptId = crypto.randomUUID();
    transaction.update(jobRef, {
      status: "processing",
      attempt_id: attemptId,
      event_id_hash: crypto.createHash("sha256").update(eventId).digest("hex"),
      attempt_count: FieldValue.increment(1),
      lease_until: new Date(nowMs + BOT_LEASE_MS).toISOString(),
      started_at: now,
      updated_at: now,
    });
    return {
      claimed: true,
      attemptId,
      conversationId: conversationRef.id,
      inboundMessageId: String(job.inbound_message_id || jobRef.id),
      inboundProviderMessageId: String(job.inbound_wa_message_id || ""),
      sequence,
      contentType: String(job.content_type || "text"),
      controlCommand: ["stop", "start", "help", "human"].includes(job.control_command)
        ? job.control_command
        : undefined,
      attemptCount: Number(job.attempt_count || 0) + 1,
    };
  });
}

async function wakeNextBotJob(jobRef: admin.firestore.DocumentReference, sequence: number) {
  const next = await jobRef.parent.where("sequence", "==", sequence + 1).limit(1).get();
  if (next.empty || next.docs[0].data()?.status !== "pending") return;
  await next.docs[0].ref.update({
    wake_token: crypto.randomUUID(),
    updated_at: new Date().toISOString(),
  });
}

async function finishBotJob(args: {
  jobRef: admin.firestore.DocumentReference;
  attemptId: string;
  sequence: number;
  status: string;
  replyMessageId?: string;
  waMessageId?: string;
  decision?: BotDecision;
  reason?: string;
}) {
  const db = getDb();
  const conversationRef = args.jobRef.parent.parent!;
  const inboundRef = conversationRef.collection("messages").doc(args.jobRef.id);
  const inquiryRef = db.collection("inquiries").doc(whatsappInquiryId(conversationRef.id));
  const now = new Date().toISOString();
  let advanced = false;
  await db.runTransaction(async (transaction) => {
    const [jobSnapshot, conversationSnapshot, inboundSnapshot, inquirySnapshot] = await Promise.all([
      transaction.get(args.jobRef),
      transaction.get(conversationRef),
      transaction.get(inboundRef),
      transaction.get(inquiryRef),
    ]);
    if (
      !jobSnapshot.exists ||
      jobSnapshot.data()?.status !== "processing" ||
      jobSnapshot.data()?.attempt_id !== args.attemptId
    ) {
      return;
    }
    const conversation = conversationSnapshot.data() || {};
    const nextSequence = Number(conversation.bot_next_sequence || args.sequence);
    transaction.update(args.jobRef, {
      status: args.status,
      lease_until: "",
      completed_at: now,
      updated_at: now,
      ...(args.replyMessageId ? { reply_message_id: args.replyMessageId } : {}),
      ...(args.waMessageId ? { reply_wa_message_id: args.waMessageId } : {}),
      ...(args.reason ? { outcome_reason: safeText(args.reason, 120) } : {}),
      ...(args.decision
        ? {
            decision_source: args.decision.source,
            decision_intent: args.decision.intent,
            decision_language: args.decision.language,
            ...(Number.isSafeInteger(args.decision.aiAttemptCount)
              ? { ai_attempt_count: args.decision.aiAttemptCount }
              : {}),
            ...(args.decision.aiFallbackReason
              ? { ai_fallback_reason: args.decision.aiFallbackReason }
              : {}),
          }
        : {}),
    });
    if (inboundSnapshot.exists) {
      transaction.update(inboundRef, {
        bot_state: args.status,
        bot_processed_at: now,
        ...(args.replyMessageId ? { bot_reply_message_id: args.replyMessageId } : {}),
      });
    }
    if (conversationSnapshot.exists && nextSequence === args.sequence) {
      const preferences = mergeBotPreferences(
        (conversation.bot_preferences && typeof conversation.bot_preferences === "object")
          ? conversation.bot_preferences as BotPreferencePatch
          : {},
        args.decision?.preferences || {}
      );
      if (args.decision) {
        const conversationId = conversationRef.id;
        if (inquirySnapshot.exists) {
          assertWhatsAppInquiryLink(inquirySnapshot.data() || {}, conversationId);
        }
        const inbound = inboundSnapshot.data() || {};
        const baseInquiry = inquirySnapshot.exists
          ? {}
          : buildWhatsAppInquiry({
              conversationId,
              customerName: conversation.customer_name,
              customerWhatsApp: conversation.customer_whatsapp,
              message: inbound.content || conversation.last_message,
              occurredAt: inbound.timestamp || conversation.last_customer_message_at,
              createdAt: now,
            }).create;
        transaction.set(
          inquiryRef,
          {
            ...baseInquiry,
            ...buildWhatsAppQualificationPatch({
              decisionIntent: args.decision.intent,
              preferences,
              updatedAt: now,
            }),
            updated_at: now,
          },
          { merge: true }
        );
      }
      const canApplyHandoff =
        args.decision?.handoffRequested === true &&
        Number(conversation.automation_barrier_sequence || 0) <= args.sequence;
      transaction.update(conversationRef, {
        bot_next_sequence: args.sequence + 1,
        bot_last_processed_at: now,
        bot_last_outcome: args.status,
        bot_preferences: preferences,
        ...(canApplyHandoff
          ? {
              automation_mode: "human",
              automation_barrier_sequence: args.sequence,
              handoff_requested_at: now,
            }
          : {}),
        updated_at: now,
      });
      advanced = true;
    }
  });
  if (advanced) await wakeNextBotJob(args.jobRef, args.sequence);
}

function humanizeArea(value: unknown): string {
  const text = safeText(value, 100);
  if (!text) return "Northern Province";
  if (!/^[a-z0-9_-]+$/.test(text)) return text;
  return text
    .replace(/[_-]+/g, " ")
    .replace(/\b[a-z]/g, (letter) => letter.toLocaleUpperCase("en-US"));
}

function normalizeListingIntent(value: unknown): string {
  const intent = safeText(value, 40).toLocaleLowerCase("en-US");
  if (["rent", "rental", "lease"].includes(intent)) return "rent";
  if (["short_rent", "short-term", "short term", "short stay"].includes(intent)) return "short_rent";
  return "sell";
}

/** Mirror Firestore's public moderated-contact gate before Admin SDK data is used. */
export function isSafePublicListingForBot(raw: any): boolean {
  const submissionSource = typeof raw?.submission_source === "string"
    ? raw.submission_source
    : "";
  const source = submissionSource !== ""
    ? submissionSource
    : typeof raw?.source === "string"
      ? raw.source
      : "";
  if (!["listing_submission", "mobile_app", "public_listing_form"].includes(source)) {
    return true;
  }
  return ["owner_name", "owner_phone", "owner_email", "agent_email"].every(
    (field) => raw?.[field] === undefined || raw?.[field] === ""
  );
}

export function normalizePublicListingForBot(id: string, raw: any): PublicListingForBot {
  const area = humanizeArea(raw.area_name || raw.area || raw.area_slug);
  return {
    id,
    listingCode: safeText(raw.listing_code, 40) || `YN-${id.slice(-6).toLocaleUpperCase("en-US")}`,
    title: safeText(raw.title, 160) || "Property listing",
    titleTa: safeText(raw.title_ta, 160),
    description: safeText(raw.description, 320),
    descriptionTa: safeText(raw.description_ta, 320),
    area,
    areaTa: safeText(raw.area_name_ta || raw.area_ta, 100),
    propertyType: safeText(raw.property_type || raw.type, 80),
    intent: normalizeListingIntent(raw.intent),
    price: safeNumber(raw.price),
    currency: safeText(raw.currency, 10) || "LKR",
    bedrooms: safeNumber(raw.bedrooms),
    bathrooms: safeNumber(raw.bathrooms),
    landSizePerches: safeNumber(raw.land_size_perches),
    floorSizeSqft: safeNumber(raw.sqft || raw.floor_size_sqft),
    videoTourAvailable: Boolean(safeText(raw.video_tour_url, 500)),
    url: `https://yaalnilam.com/properties/${encodeURIComponent(id)}/`,
  };
}

async function loadPublishedListings(): Promise<PublicListingForBot[]> {
  const snapshot = await getDb()
    .collection("listings")
    .where("status", "in", PUBLISHED_STATUSES)
    .limit(MAX_PUBLISHED_LISTINGS_SCAN)
    .get();
  return snapshot.docs
    .filter((doc) => isSafePublicListingForBot(doc.data() || {}))
    .map((doc) => normalizePublicListingForBot(doc.id, doc.data() || {}));
}

async function loadConversationHistory(conversationId: string) {
  const snapshot = await getDb()
    .collection("whatsapp_conversations")
    .doc(conversationId)
    .collection("messages")
    .orderBy("timestamp", "desc")
    .limit(8)
    .get();
  return snapshot.docs
    .map((doc) => doc.data() || {})
    .reverse()
    .map((message) => ({
      direction: message.direction === "outbound" ? "outbound" as const : "inbound" as const,
      content: safeText(message.content, 600),
    }));
}

export function selectFallbackListings(
  decision: BotDecision,
  message: string,
  listings: PublicListingForBot[]
): BotDecision {
  if (decision.source !== "fallback" || decision.intent !== "property_search") return decision;
  const preferences = decision.preferences;
  // Do not spray generic listing links while we are still qualifying a lead.
  // A deterministic match needs the four core filters to be present.
  if (
    !["buy", "rent"].includes(String(preferences.purpose || "")) ||
    !preferences.area ||
    !preferences.propertyType ||
    !preferences.maxBudgetLkr
  ) {
    return { ...decision, listingIds: [] };
  }
  const preferredArea = preferences.area.toLocaleLowerCase("en-US");
  const preferredType = preferences.propertyType.toLocaleLowerCase("en-US");
  const matching = listings.filter((listing) => {
    const typeMatches = listing.propertyType.toLocaleLowerCase("en-US").includes(preferredType);
    const purpose = preferences.purpose;
    const listingIntent = listing.intent.toLocaleLowerCase("en-US");
    const purposeMatches = purpose === "rent"
      ? listingIntent.includes("rent")
      : !listingIntent.includes("rent");
    const areaMatches = [listing.area, listing.areaTa]
      .filter(Boolean)
      .some((area) => area.toLocaleLowerCase("en-US").includes(preferredArea) ||
        preferredArea.includes(area.toLocaleLowerCase("en-US")));
    const budgetMatches = listing.price > 0 && listing.price <= preferences.maxBudgetLkr!;
    return typeMatches && purposeMatches && areaMatches && budgetMatches;
  });
  return { ...decision, listingIds: matching.slice(0, 3).map((listing) => listing.id) };
}

function unsupportedMediaReply(contentType: string, language: BotLanguage): string {
  const tamil = language !== "en";
  const type = contentType === "audio" ? "voice note" : contentType;
  return tamil
    ? `உங்கள் ${type} பெறப்பட்டது. இப்போது பாதுகாப்பான தானியங்கி தேடலுக்கு பகுதி, சொத்து வகை மற்றும் வரவு செலவுத் தொகையை text ஆக அனுப்புங்கள்; அல்லது HUMAN என்று அனுப்புங்கள்.`
    : `Your ${type} was received. For a safe automated search, please type the area, property type, and budget, or send HUMAN for the team.`;
}

function whatsappVariants(phone: string): string[] {
  const digits = phone.replace(/\D/g, "");
  const values = new Set([digits, `+${digits}`]);
  if (digits.startsWith("94") && digits.length === 11) values.add(`0${digits.slice(2)}`);
  return [...values];
}

async function cancelActiveAlertsForStop(phone: string) {
  const refs = new Map<string, admin.firestore.DocumentReference>();
  for (const value of whatsappVariants(phone)) {
    const snapshot = await getDb()
      .collection("property_alerts")
      .where("whatsapp", "==", value)
      .limit(100)
      .get();
    snapshot.docs
      .filter((doc) => doc.data()?.status === "active")
      .forEach((doc) => refs.set(doc.ref.path, doc.ref));
  }
  if (!refs.size) return;
  const batch = getDb().batch();
  const now = new Date().toISOString();
  refs.forEach((ref) => batch.update(ref, {
    status: "cancelled",
    cancelled_at: now,
    cancellation_method: "whatsapp_stop",
    updated_at: now,
  }));
  await batch.commit();
}

export function shouldSkipWhatsAppBotGeneration(
  conversation: any,
  sequence: number,
  controlCommand?: BotJobClaim["controlCommand"]
): boolean {
  if (controlCommand) return false;
  const barrierSequence = Number(conversation?.automation_barrier_sequence || 0);
  const enabledFromSequence = Number(conversation?.automation_enabled_from_sequence || 0);
  return conversation?.automation_mode !== "ai" ||
    conversation?.bot_opted_out === true ||
    (barrierSequence > 0 && sequence < barrierSequence) ||
    (enabledFromSequence > 0 && sequence < enabledFromSequence);
}

async function releaseBotJobForRetry(args: {
  jobRef: admin.firestore.DocumentReference;
  attemptId: string;
  reason: string;
}) {
  await getDb().runTransaction(async (transaction) => {
    const snapshot = await transaction.get(args.jobRef);
    if (
      !snapshot.exists ||
      snapshot.data()?.status !== "processing" ||
      snapshot.data()?.attempt_id !== args.attemptId
    ) {
      return;
    }
    const now = new Date().toISOString();
    transaction.update(args.jobRef, {
      status: "pending",
      lease_until: "",
      retry_reason: safeText(args.reason, 120),
      retry_scheduled_at: now,
      wake_token: crypto.randomUUID(),
      updated_at: now,
    });
  });
}

function alertOptOutFailureReply(language: BotLanguage): string {
  return language !== "en"
    ? "தானியங்கி chat பதில்கள் நிறுத்தப்பட்டன. ஆனால் சொத்து alert cancellation-ஐ உறுதிப்படுத்த முடியவில்லை; Yaal Nilam குழு இதைப் பரிசோதிக்க வேண்டும்."
    : "Automated chat replies are paused, but I could not confirm cancellation of property alerts. The Yaal Nilam team needs to check this.";
}

export async function runWhatsAppBotJob(
  jobRef: admin.firestore.DocumentReference,
  eventId: string,
  dependencies: WhatsAppBotDependencies = {}
): Promise<void> {
  const claim = await claimBotJob(jobRef, eventId);
  if (!claim.claimed) return;

  const attemptId = claim.attemptId!;
  const sequence = claim.sequence!;
  const conversationId = claim.conversationId!;
  const conversationRef = getDb().collection("whatsapp_conversations").doc(conversationId);
  try {
    const [configSnapshot, conversationSnapshot, inboundSnapshot] = await Promise.all([
      getDb().collection("config").doc("whatsapp").get(),
      conversationRef.get(),
      conversationRef.collection("messages").doc(claim.inboundMessageId!).get(),
    ]);
    const config = configSnapshot.data() || {};
    const conversation = conversationSnapshot.data() || {};
    const inbound = inboundSnapshot.data() || {};
    const configStatus = getWhatsAppBotConfigStatus(
      config,
      Boolean(process.env.WHATSAPP_ACCESS_TOKEN),
      Boolean(process.env.GEMINI_API_KEY)
    );
    if (!conversationSnapshot.exists || !inboundSnapshot.exists) {
      await finishBotJob({ jobRef, attemptId, sequence, status: "failed", reason: "source_missing" });
      return;
    }

    const command = claim.controlCommand;
    const language: BotLanguage = /[\u0B80-\u0BFF]/u.test(String(inbound.content || ""))
      ? "ta"
      : "en";
    const cancelAlerts = dependencies.cancelActiveAlerts || cancelActiveAlertsForStop;
    const generateDecision = dependencies.generateDecision || generateBotDecision;
    const sendAutomatedReply = dependencies.sendAutomatedReply || sendAutomatedWhatsAppReply;
    let alertOptOutNeedsReview = false;
    if (command === "stop") {
      try {
        await cancelAlerts(String(conversation.customer_whatsapp || ""));
        await conversationRef.set({
          alert_optout_review_required: false,
          alert_optout_confirmed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, { merge: true });
      } catch {
        if ((claim.attemptCount || 1) < MAX_ALERT_OPTOUT_ATTEMPTS) {
          await releaseBotJobForRetry({
            jobRef,
            attemptId,
            reason: "alert_optout_retry",
          });
          console.error(
            `whatsapp_bot_alert_optout_retry correlation=${jobRef.id.slice(0, 12)} ` +
            `attempt=${claim.attemptCount || 1}`
          );
          return;
        }
        alertOptOutNeedsReview = true;
        await conversationRef.set({
          alert_optout_review_required: true,
          alert_optout_failed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, { merge: true });
        console.error(
          `whatsapp_bot_alert_optout_review_required correlation=${jobRef.id.slice(0, 12)} ` +
          `attempt=${claim.attemptCount || MAX_ALERT_OPTOUT_ATTEMPTS}`
        );
      }
    }

    // HUMAN, staff takeover, and STOP must prevent model access before we load
    // listings or conversation text into Gemini. Control commands themselves
    // may still receive their fixed acknowledgement.
    if (shouldSkipWhatsAppBotGeneration(conversation, sequence, command)) {
      await finishBotJob({
        jobRef,
        attemptId,
        sequence,
        status: "skipped_human",
        reason: conversation.bot_opted_out === true ? "automation_opted_out" : "automation_human",
      });
      return;
    }
    if (!configStatus.deterministicFallbackConfigured) {
      await finishBotJob({
        jobRef,
        attemptId,
        sequence,
        status: "skipped_configuration",
        reason: "bot_or_outbound_not_enabled",
      });
      return;
    }
    if (!isWhatsAppBotRolloutAllowed(config, conversation.customer_whatsapp)) {
      await finishBotJob({
        jobRef,
        attemptId,
        sequence,
        status: "skipped_rollout",
        reason: "sender_not_in_rollout",
      });
      return;
    }

    let decision: BotDecision;
    let reply: string;
    if (command) {
      decision = {
        ...deterministicBotDecision(String(inbound.content || command)),
        language,
        intent: command === "human" ? "human" : "general",
        reply: command === "stop" && alertOptOutNeedsReview
          ? alertOptOutFailureReply(language)
          : commandReply(command, language),
        handoffRequested: command === "human",
      };
      reply = decision.reply;
    } else if (!["text", "interactive"].includes(String(claim.contentType || ""))) {
      decision = deterministicBotDecision(String(inbound.content || ""));
      reply = unsupportedMediaReply(String(claim.contentType || "message"), decision.language);
    } else {
      const [listings, history] = await Promise.all([
        loadPublishedListings(),
        loadConversationHistory(conversationId),
      ]);
      const customerMessage = String(inbound.content || "");
      const existingPreferences = conversation.bot_preferences as BotPreferencePatch || {};
      const modelListings = rankListingsForBot(
        listings,
        customerMessage,
        existingPreferences
      );
      decision = await generateDecision(
        {
          message: customerMessage,
          history,
          listings: modelListings,
          existingPreferences,
        },
        {
          apiKey: config.ai_enabled === true ? (process.env.GEMINI_API_KEY || "") : "",
          model: String(config.ai_model || "gemini-3.8-flash"),
        }
      );
      decision = selectFallbackListings(decision, customerMessage, listings);
      reply = composeGroundedBotReply(decision, listings);
    }

    if (decision.source === "fallback" && decision.aiFallbackReason) {
      console.warn(
        `whatsapp_ai_fallback correlation=${jobRef.id.slice(0, 12)} ` +
        `reason=${decision.aiFallbackReason} attempts=${decision.aiAttemptCount || 0}`
      );
    }

    const sendResult = await sendAutomatedReply({
      conversationId,
      inboundMessageId: claim.inboundMessageId!,
      inboundProviderMessageId: claim.inboundProviderMessageId,
      customerMessageAt: String(inbound.timestamp || conversation.last_customer_message_at || ""),
      sequence,
      content: reply,
      allowControlCommand: Boolean(command),
    });
    await finishBotJob({
      jobRef,
      attemptId,
      sequence,
      status: sendResult.status === "suppressed" ? "suppressed" : "replied",
      replyMessageId: sendResult.messageId,
      waMessageId: sendResult.waMessageId,
      decision,
      ...(alertOptOutNeedsReview ? { reason: "alert_optout_review_required" } : {}),
    });
  } catch (error: any) {
    const kind = error instanceof WhatsAppSendError ? error.kind : "ambiguous";
    const status = kind === "suppressed"
      ? "suppressed"
      : kind === "ambiguous"
        ? "unknown"
        : "failed";
    await finishBotJob({
      jobRef,
      attemptId,
      sequence,
      status,
      reason: kind,
    });
    console.error(`whatsapp_bot_${status} correlation=${jobRef.id.slice(0, 12)} reason=${kind}`);
  }
}

export async function setWhatsAppAutomationMode(args: {
  conversationId: string;
  mode: "ai" | "human";
  actorUid: string;
}) {
  const id = safeText(args.conversationId, 500);
  if (!id || id.includes("/")) throw new Error("Invalid conversation ID");
  const conversationRef = getDb().collection("whatsapp_conversations").doc(id);
  const auditRef = getDb().collection("audit_logs").doc();
  const now = new Date().toISOString();
  await getDb().runTransaction(async (transaction) => {
    const snapshot = await transaction.get(conversationRef);
    if (!snapshot.exists) throw new Error("WhatsApp conversation does not exist");
    const conversation = snapshot.data() || {};
    if (args.mode === "ai" && conversation.bot_opted_out === true) {
      throw new Error("The customer opted out; only a new START message can resume automation");
    }
    const nextSequence = Number(conversation.bot_last_sequence || 0) + 1;
    transaction.update(conversationRef, {
      automation_mode: args.mode,
      ...(args.mode === "ai"
        ? { automation_enabled_from_sequence: nextSequence, assigned_to: "" }
        : { automation_barrier_sequence: nextSequence, assigned_to: args.actorUid }),
      updated_at: now,
    });
    transaction.create(auditRef, {
      action: "whatsapp_automation_mode_changed",
      entity_type: "whatsapp_conversation",
      entity_id: id,
      performed_by_uid: args.actorUid,
      changes: { mode: args.mode },
      created_at: now,
      timestamp: now,
    });
  });
  return { ok: true, mode: args.mode };
}
