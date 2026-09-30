"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsAppBotLeaseBusyError = void 0;
exports.getWhatsAppBotConfigStatus = getWhatsAppBotConfigStatus;
exports.isWhatsAppBotRolloutAllowed = isWhatsAppBotRolloutAllowed;
exports.isSafePublicListingForBot = isSafePublicListingForBot;
exports.normalizePublicListingForBot = normalizePublicListingForBot;
exports.selectFallbackListings = selectFallbackListings;
exports.shouldSkipWhatsAppBotGeneration = shouldSkipWhatsAppBotGeneration;
exports.runWhatsAppBotJob = runWhatsAppBotJob;
exports.setWhatsAppAutomationMode = setWhatsAppAutomationMode;
const admin = __importStar(require("firebase-admin"));
const crypto = __importStar(require("crypto"));
const firestore_1 = require("firebase-admin/firestore");
const whatsapp_ai_1 = require("./whatsapp-ai");
const whatsapp_send_1 = require("./whatsapp-send");
const inquiry_crm_1 = require("./inquiry-crm");
const PUBLISHED_STATUSES = [
    "available",
    "approved",
    "published",
    "active",
    "Available",
    "Published",
];
const BOT_LEASE_MS = 90000;
const MAX_ALERT_OPTOUT_ATTEMPTS = 3;
const MAX_PUBLISHED_LISTINGS_SCAN = 100;
const MODEL_NAME = /^gemini-[a-z0-9][a-z0-9._-]{1,100}$/;
class WhatsAppBotLeaseBusyError extends Error {
    constructor() {
        super("WhatsApp bot job has an active processing lease");
        this.name = "WhatsAppBotLeaseBusyError";
    }
}
exports.WhatsAppBotLeaseBusyError = WhatsAppBotLeaseBusyError;
function getDb() {
    return admin.firestore();
}
function timestampMillis(value) {
    if (value && typeof value === "object" && "toMillis" in value) {
        const method = value.toMillis;
        if (typeof method === "function")
            return Number(method.call(value)) || 0;
    }
    const parsed = new Date(typeof value === "string" ? value : "").getTime();
    return Number.isFinite(parsed) ? parsed : 0;
}
function safeNumber(value) {
    const number = Number(value);
    return Number.isFinite(number) && number >= 0 ? number : 0;
}
function safeText(value, max) {
    return typeof value === "string" ? value.trim().slice(0, max) : "";
}
function getWhatsAppBotConfigStatus(config, hasAccessToken, hasGeminiKey) {
    const hasPhoneNumberId = /^\d{5,40}$/.test(String((config === null || config === void 0 ? void 0 : config.phone_number_id) || ""));
    const hasGraphApiVersion = /^v\d+\.\d+$/.test(String((config === null || config === void 0 ? void 0 : config.graph_api_version) || ""));
    const autoReplyEnabled = (config === null || config === void 0 ? void 0 : config.auto_reply_enabled) === true;
    const aiEnabled = (config === null || config === void 0 ? void 0 : config.ai_enabled) === true;
    const aiModel = String((config === null || config === void 0 ? void 0 : config.ai_model) || "").trim();
    const hasAiModel = MODEL_NAME.test(aiModel);
    const rolloutMode = (config === null || config === void 0 ? void 0 : config.bot_rollout_mode) === "live"
        ? "live"
        : (config === null || config === void 0 ? void 0 : config.bot_rollout_mode) === "test"
            ? "test"
            : "off";
    const hasTestAllowlist = Array.isArray(config === null || config === void 0 ? void 0 : config.bot_test_sender_hashes) &&
        config.bot_test_sender_hashes.some((value) => /^[a-f0-9]{64}$/.test(String(value)));
    const outboundConfigured = hasPhoneNumberId && hasGraphApiVersion && hasAccessToken;
    const rolloutConfigured = rolloutMode === "live" ||
        (rolloutMode === "test" && hasTestAllowlist);
    return {
        botConfigured: outboundConfigured &&
            autoReplyEnabled &&
            aiEnabled &&
            hasGeminiKey &&
            hasAiModel &&
            rolloutConfigured,
        deterministicFallbackConfigured: outboundConfigured &&
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
function isWhatsAppBotRolloutAllowed(config, customerWhatsApp) {
    if ((config === null || config === void 0 ? void 0 : config.bot_rollout_mode) === "live")
        return true;
    if ((config === null || config === void 0 ? void 0 : config.bot_rollout_mode) !== "test")
        return false;
    const phone = String(customerWhatsApp || "").replace(/\D/g, "");
    if (!phone)
        return false;
    const hash = crypto.createHash("sha256").update(phone).digest("hex");
    return Array.isArray(config === null || config === void 0 ? void 0 : config.bot_test_sender_hashes) &&
        config.bot_test_sender_hashes.some((value) => String(value) === hash);
}
async function claimBotJob(jobRef, eventId) {
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
        if (sequence > nextSequence)
            return { claimed: false, waiting: true };
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
            attempt_count: firestore_1.FieldValue.increment(1),
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
async function wakeNextBotJob(jobRef, sequence) {
    var _a;
    const next = await jobRef.parent.where("sequence", "==", sequence + 1).limit(1).get();
    if (next.empty || ((_a = next.docs[0].data()) === null || _a === void 0 ? void 0 : _a.status) !== "pending")
        return;
    await next.docs[0].ref.update({
        wake_token: crypto.randomUUID(),
        updated_at: new Date().toISOString(),
    });
}
async function finishBotJob(args) {
    const db = getDb();
    const conversationRef = args.jobRef.parent.parent;
    const inboundRef = conversationRef.collection("messages").doc(args.jobRef.id);
    const inquiryRef = db.collection("inquiries").doc((0, inquiry_crm_1.whatsappInquiryId)(conversationRef.id));
    const now = new Date().toISOString();
    let advanced = false;
    await db.runTransaction(async (transaction) => {
        var _a, _b, _c, _d;
        const [jobSnapshot, conversationSnapshot, inboundSnapshot, inquirySnapshot] = await Promise.all([
            transaction.get(args.jobRef),
            transaction.get(conversationRef),
            transaction.get(inboundRef),
            transaction.get(inquiryRef),
        ]);
        if (!jobSnapshot.exists ||
            ((_a = jobSnapshot.data()) === null || _a === void 0 ? void 0 : _a.status) !== "processing" ||
            ((_b = jobSnapshot.data()) === null || _b === void 0 ? void 0 : _b.attempt_id) !== args.attemptId) {
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
            const preferences = (0, whatsapp_ai_1.mergeBotPreferences)((conversation.bot_preferences && typeof conversation.bot_preferences === "object")
                ? conversation.bot_preferences
                : {}, ((_c = args.decision) === null || _c === void 0 ? void 0 : _c.preferences) || {});
            if (args.decision) {
                const conversationId = conversationRef.id;
                if (inquirySnapshot.exists) {
                    (0, inquiry_crm_1.assertWhatsAppInquiryLink)(inquirySnapshot.data() || {}, conversationId);
                }
                const inbound = inboundSnapshot.data() || {};
                const baseInquiry = inquirySnapshot.exists
                    ? {}
                    : (0, inquiry_crm_1.buildWhatsAppInquiry)({
                        conversationId,
                        customerName: conversation.customer_name,
                        customerWhatsApp: conversation.customer_whatsapp,
                        message: inbound.content || conversation.last_message,
                        occurredAt: inbound.timestamp || conversation.last_customer_message_at,
                        createdAt: now,
                    }).create;
                transaction.set(inquiryRef, {
                    ...baseInquiry,
                    ...(0, inquiry_crm_1.buildWhatsAppQualificationPatch)({
                        decisionIntent: args.decision.intent,
                        preferences,
                        updatedAt: now,
                    }),
                    updated_at: now,
                }, { merge: true });
            }
            const canApplyHandoff = ((_d = args.decision) === null || _d === void 0 ? void 0 : _d.handoffRequested) === true &&
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
    if (advanced)
        await wakeNextBotJob(args.jobRef, args.sequence);
}
function humanizeArea(value) {
    const text = safeText(value, 100);
    if (!text)
        return "Northern Province";
    if (!/^[a-z0-9_-]+$/.test(text))
        return text;
    return text
        .replace(/[_-]+/g, " ")
        .replace(/\b[a-z]/g, (letter) => letter.toLocaleUpperCase("en-US"));
}
function normalizeListingIntent(value) {
    const intent = safeText(value, 40).toLocaleLowerCase("en-US");
    if (["rent", "rental", "lease"].includes(intent))
        return "rent";
    if (["short_rent", "short-term", "short term", "short stay"].includes(intent))
        return "short_rent";
    return "sell";
}
/** Mirror Firestore's public moderated-contact gate before Admin SDK data is used. */
function isSafePublicListingForBot(raw) {
    const submissionSource = typeof (raw === null || raw === void 0 ? void 0 : raw.submission_source) === "string"
        ? raw.submission_source
        : "";
    const source = submissionSource !== ""
        ? submissionSource
        : typeof (raw === null || raw === void 0 ? void 0 : raw.source) === "string"
            ? raw.source
            : "";
    if (!["listing_submission", "mobile_app", "public_listing_form"].includes(source)) {
        return true;
    }
    return ["owner_name", "owner_phone", "owner_email", "agent_email"].every((field) => (raw === null || raw === void 0 ? void 0 : raw[field]) === undefined || (raw === null || raw === void 0 ? void 0 : raw[field]) === "");
}
function normalizePublicListingForBot(id, raw) {
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
async function loadPublishedListings() {
    const snapshot = await getDb()
        .collection("listings")
        .where("status", "in", PUBLISHED_STATUSES)
        .limit(MAX_PUBLISHED_LISTINGS_SCAN)
        .get();
    return snapshot.docs
        .filter((doc) => isSafePublicListingForBot(doc.data() || {}))
        .map((doc) => normalizePublicListingForBot(doc.id, doc.data() || {}));
}
async function loadConversationHistory(conversationId) {
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
        direction: message.direction === "outbound" ? "outbound" : "inbound",
        content: safeText(message.content, 600),
    }));
}
function selectFallbackListings(decision, message, listings) {
    if (decision.source !== "fallback" || decision.intent !== "property_search")
        return decision;
    const preferences = decision.preferences;
    // Do not spray generic listing links while we are still qualifying a lead.
    // A deterministic match needs the four core filters to be present.
    if (!["buy", "rent"].includes(String(preferences.purpose || "")) ||
        !preferences.area ||
        !preferences.propertyType ||
        !preferences.maxBudgetLkr) {
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
        const budgetMatches = listing.price > 0 && listing.price <= preferences.maxBudgetLkr;
        return typeMatches && purposeMatches && areaMatches && budgetMatches;
    });
    return { ...decision, listingIds: matching.slice(0, 3).map((listing) => listing.id) };
}
function unsupportedMediaReply(contentType, language) {
    const tamil = language !== "en";
    const type = contentType === "audio" ? "voice note" : contentType;
    return tamil
        ? `உங்கள் ${type} பெறப்பட்டது. இப்போது பாதுகாப்பான தானியங்கி தேடலுக்கு பகுதி, சொத்து வகை மற்றும் வரவு செலவுத் தொகையை text ஆக அனுப்புங்கள்; அல்லது HUMAN என்று அனுப்புங்கள்.`
        : `Your ${type} was received. For a safe automated search, please type the area, property type, and budget, or send HUMAN for the team.`;
}
function whatsappVariants(phone) {
    const digits = phone.replace(/\D/g, "");
    const values = new Set([digits, `+${digits}`]);
    if (digits.startsWith("94") && digits.length === 11)
        values.add(`0${digits.slice(2)}`);
    return [...values];
}
async function cancelActiveAlertsForStop(phone) {
    const refs = new Map();
    for (const value of whatsappVariants(phone)) {
        const snapshot = await getDb()
            .collection("property_alerts")
            .where("whatsapp", "==", value)
            .limit(100)
            .get();
        snapshot.docs
            .filter((doc) => { var _a; return ((_a = doc.data()) === null || _a === void 0 ? void 0 : _a.status) === "active"; })
            .forEach((doc) => refs.set(doc.ref.path, doc.ref));
    }
    if (!refs.size)
        return;
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
function shouldSkipWhatsAppBotGeneration(conversation, sequence, controlCommand) {
    if (controlCommand)
        return false;
    const barrierSequence = Number((conversation === null || conversation === void 0 ? void 0 : conversation.automation_barrier_sequence) || 0);
    const enabledFromSequence = Number((conversation === null || conversation === void 0 ? void 0 : conversation.automation_enabled_from_sequence) || 0);
    return (conversation === null || conversation === void 0 ? void 0 : conversation.automation_mode) !== "ai" ||
        (conversation === null || conversation === void 0 ? void 0 : conversation.bot_opted_out) === true ||
        (barrierSequence > 0 && sequence < barrierSequence) ||
        (enabledFromSequence > 0 && sequence < enabledFromSequence);
}
async function releaseBotJobForRetry(args) {
    await getDb().runTransaction(async (transaction) => {
        var _a, _b;
        const snapshot = await transaction.get(args.jobRef);
        if (!snapshot.exists ||
            ((_a = snapshot.data()) === null || _a === void 0 ? void 0 : _a.status) !== "processing" ||
            ((_b = snapshot.data()) === null || _b === void 0 ? void 0 : _b.attempt_id) !== args.attemptId) {
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
function alertOptOutFailureReply(language) {
    return language !== "en"
        ? "தானியங்கி chat பதில்கள் நிறுத்தப்பட்டன. ஆனால் சொத்து alert cancellation-ஐ உறுதிப்படுத்த முடியவில்லை; Yaal Nilam குழு இதைப் பரிசோதிக்க வேண்டும்."
        : "Automated chat replies are paused, but I could not confirm cancellation of property alerts. The Yaal Nilam team needs to check this.";
}
async function runWhatsAppBotJob(jobRef, eventId, dependencies = {}) {
    const claim = await claimBotJob(jobRef, eventId);
    if (!claim.claimed)
        return;
    const attemptId = claim.attemptId;
    const sequence = claim.sequence;
    const conversationId = claim.conversationId;
    const conversationRef = getDb().collection("whatsapp_conversations").doc(conversationId);
    try {
        const [configSnapshot, conversationSnapshot, inboundSnapshot] = await Promise.all([
            getDb().collection("config").doc("whatsapp").get(),
            conversationRef.get(),
            conversationRef.collection("messages").doc(claim.inboundMessageId).get(),
        ]);
        const config = configSnapshot.data() || {};
        const conversation = conversationSnapshot.data() || {};
        const inbound = inboundSnapshot.data() || {};
        const configStatus = getWhatsAppBotConfigStatus(config, Boolean(process.env.WHATSAPP_ACCESS_TOKEN), Boolean(process.env.GEMINI_API_KEY));
        if (!conversationSnapshot.exists || !inboundSnapshot.exists) {
            await finishBotJob({ jobRef, attemptId, sequence, status: "failed", reason: "source_missing" });
            return;
        }
        const command = claim.controlCommand;
        const language = /[\u0B80-\u0BFF]/u.test(String(inbound.content || ""))
            ? "ta"
            : "en";
        const cancelAlerts = dependencies.cancelActiveAlerts || cancelActiveAlertsForStop;
        const generateDecision = dependencies.generateDecision || whatsapp_ai_1.generateBotDecision;
        const sendAutomatedReply = dependencies.sendAutomatedReply || whatsapp_send_1.sendAutomatedWhatsAppReply;
        let alertOptOutNeedsReview = false;
        if (command === "stop") {
            try {
                await cancelAlerts(String(conversation.customer_whatsapp || ""));
                await conversationRef.set({
                    alert_optout_review_required: false,
                    alert_optout_confirmed_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                }, { merge: true });
            }
            catch (_a) {
                if ((claim.attemptCount || 1) < MAX_ALERT_OPTOUT_ATTEMPTS) {
                    await releaseBotJobForRetry({
                        jobRef,
                        attemptId,
                        reason: "alert_optout_retry",
                    });
                    console.error(`whatsapp_bot_alert_optout_retry correlation=${jobRef.id.slice(0, 12)} ` +
                        `attempt=${claim.attemptCount || 1}`);
                    return;
                }
                alertOptOutNeedsReview = true;
                await conversationRef.set({
                    alert_optout_review_required: true,
                    alert_optout_failed_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                }, { merge: true });
                console.error(`whatsapp_bot_alert_optout_review_required correlation=${jobRef.id.slice(0, 12)} ` +
                    `attempt=${claim.attemptCount || MAX_ALERT_OPTOUT_ATTEMPTS}`);
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
        let decision;
        let reply;
        if (command) {
            decision = {
                ...(0, whatsapp_ai_1.deterministicBotDecision)(String(inbound.content || command)),
                language,
                intent: command === "human" ? "human" : "general",
                reply: command === "stop" && alertOptOutNeedsReview
                    ? alertOptOutFailureReply(language)
                    : (0, whatsapp_ai_1.commandReply)(command, language),
                handoffRequested: command === "human",
            };
            reply = decision.reply;
        }
        else if (!["text", "interactive"].includes(String(claim.contentType || ""))) {
            decision = (0, whatsapp_ai_1.deterministicBotDecision)(String(inbound.content || ""));
            reply = unsupportedMediaReply(String(claim.contentType || "message"), decision.language);
        }
        else {
            const [listings, history] = await Promise.all([
                loadPublishedListings(),
                loadConversationHistory(conversationId),
            ]);
            const customerMessage = String(inbound.content || "");
            const existingPreferences = conversation.bot_preferences || {};
            const modelListings = (0, whatsapp_ai_1.rankListingsForBot)(listings, customerMessage, existingPreferences);
            decision = await generateDecision({
                message: customerMessage,
                history,
                listings: modelListings,
                existingPreferences,
            }, {
                apiKey: config.ai_enabled === true ? (process.env.GEMINI_API_KEY || "") : "",
                model: String(config.ai_model || "gemini-3.8-flash"),
            });
            decision = selectFallbackListings(decision, customerMessage, listings);
            reply = (0, whatsapp_ai_1.composeGroundedBotReply)(decision, listings);
        }
        if (decision.source === "fallback" && decision.aiFallbackReason) {
            console.warn(`whatsapp_ai_fallback correlation=${jobRef.id.slice(0, 12)} ` +
                `reason=${decision.aiFallbackReason} attempts=${decision.aiAttemptCount || 0}`);
        }
        const sendResult = await sendAutomatedReply({
            conversationId,
            inboundMessageId: claim.inboundMessageId,
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
    }
    catch (error) {
        const kind = error instanceof whatsapp_send_1.WhatsAppSendError ? error.kind : "ambiguous";
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
async function setWhatsAppAutomationMode(args) {
    const id = safeText(args.conversationId, 500);
    if (!id || id.includes("/"))
        throw new Error("Invalid conversation ID");
    const conversationRef = getDb().collection("whatsapp_conversations").doc(id);
    const auditRef = getDb().collection("audit_logs").doc();
    const now = new Date().toISOString();
    await getDb().runTransaction(async (transaction) => {
        const snapshot = await transaction.get(conversationRef);
        if (!snapshot.exists)
            throw new Error("WhatsApp conversation does not exist");
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
//# sourceMappingURL=whatsapp-bot.js.map