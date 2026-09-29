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
exports.claimListingHandler = exports.respondListingConsent = exports.getListingPreview = exports.sendAgentWhatsAppConsent = exports.scheduledDailyAgentPipeline = exports.runDailyAgentPipeline = exports.processSocialPost = exports.onNewWhatsAppMessage = exports.runSocialLeadMonitor = exports.onWhatsAppBotJob = exports.sendWhatsApp = exports.whatsappWebhookHandler = exports.cancelPropertyAlert = exports.registerPropertyAlert = exports.onListingPublishedAlert = exports.onAnalyticsEvent = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const cors = require("cors");
const whatsapp_1 = require("./whatsapp");
const whatsapp_send_1 = require("./whatsapp-send");
const whatsapp_bot_1 = require("./whatsapp-bot");
const social_monitor_1 = require("./social-monitor");
admin.initializeApp();
// Server-side listing counters (views / whatsapp_clicks) driven off analytics_events.
var analytics_1 = require("./analytics");
Object.defineProperty(exports, "onAnalyticsEvent", { enumerable: true, get: function () { return analytics_1.onAnalyticsEvent; } });
// Property alerts: WhatsApp buyers when a newly-published listing matches the
// criteria they registered (collection `property_alerts`).
var alerts_1 = require("./alerts");
Object.defineProperty(exports, "onListingPublishedAlert", { enumerable: true, get: function () { return alerts_1.onListingPublishedAlert; } });
// Anonymous mobile/web buyer registration uses a private server-owned receipt so
// the device can cancel only the alert group it created.
var property_alert_registration_1 = require("./property-alert-registration");
Object.defineProperty(exports, "registerPropertyAlert", { enumerable: true, get: function () { return property_alert_registration_1.registerPropertyAlert; } });
Object.defineProperty(exports, "cancelPropertyAlert", { enumerable: true, get: function () { return property_alert_registration_1.cancelPropertyAlert; } });
const corsHandler = cors({ origin: true });
// WhatsApp Webhook - receives incoming messages from Meta Cloud API
// Must be publicly accessible for Meta to call it
exports.whatsappWebhookHandler = functions
    .runWith({
    memory: "512MB",
    timeoutSeconds: 60,
    secrets: [
        "WHATSAPP_APP_SECRET",
        "WHATSAPP_VERIFY_TOKEN",
        "WHATSAPP_ACCESS_TOKEN",
        "GEMINI_API_KEY",
    ],
})
    .https.onRequest(async (req, res) => {
    // Handle CORS preflight
    return corsHandler(req, res, async () => {
        if (req.method === "GET") {
            return (0, whatsapp_1.whatsappVerify)(req, res);
        }
        if (req.method === "POST") {
            return (0, whatsapp_1.whatsappWebhook)(req, res);
        }
        res.status(405).send("Method not allowed");
    });
});
// Admin gate for callable functions. Mirrors isAdmin() in firestore.rules —
// keep the role list and owner-email allowlist in sync with that file:
// admin custom claim, OR a staff role claim, OR the verified owner email
// bootstrap (Google verifies the email; same allowlist as the rules).
const ADMIN_ROLES = [
    "super_admin",
    "admin",
    "listing_manager",
    "lead_manager",
    "content_manager",
];
const OWNER_ADMIN_EMAILS = ["nanthan77@gmail.com"];
async function isAdminToken(token) {
    if (token.admin === true)
        return true;
    if (typeof token.role === "string" && ADMIN_ROLES.includes(token.role)) {
        return true;
    }
    if (token.email_verified === true &&
        typeof token.email === "string" &&
        OWNER_ADMIN_EMAILS.includes(token.email)) {
        return true;
    }
    if (typeof token.email === "string") {
        const snap = await admin
            .firestore()
            .collection("admin_users")
            .doc(token.email.toLowerCase())
            .get();
        const record = snap.data();
        if ((record === null || record === void 0 ? void 0 : record.status) === "active" &&
            typeof record.role === "string" &&
            ADMIN_ROLES.includes(record.role)) {
            return true;
        }
    }
    return false;
}
// Send WhatsApp message - called from admin dashboard
exports.sendWhatsApp = functions
    .runWith({
    memory: "256MB",
    timeoutSeconds: 60,
    secrets: ["WHATSAPP_ACCESS_TOKEN"],
})
    .https.onCall(async (data, context) => {
    // Verify admin auth (same admins firestore.rules isAdmin() accepts)
    if (!context.auth || !(await isAdminToken(context.auth.token))) {
        throw new functions.https.HttpsError("permission-denied", "Only admins can send WhatsApp messages");
    }
    return (0, whatsapp_send_1.sendWhatsAppMessage)(data);
});
// WhatsApp AI Bot Trigger: runs whenever a bot job is created/pending
exports.onWhatsAppBotJob = functions
    .runWith({
    memory: "512MB",
    timeoutSeconds: 120,
    failurePolicy: true,
    secrets: ["WHATSAPP_ACCESS_TOKEN", "GEMINI_API_KEY"],
})
    .firestore.document("whatsapp_conversations/{convId}/bot_jobs/{jobId}")
    .onWrite(async (change, context) => {
    if (!change.after.exists)
        return;
    const after = change.after.data() || {};
    const before = change.before.exists ? change.before.data() || {} : {};
    if (after.status !== "pending")
        return;
    if (change.before.exists && before.status === "pending" && before.wake_token === after.wake_token) {
        return;
    }
    await (0, whatsapp_bot_1.runWhatsAppBotJob)(change.after.ref, String(context.eventId || context.params.jobId));
});
// Run source-specific social lead monitors and save discovered property posts
// into `social_leads`. Triggered manually from the admin dashboard; scheduling
// should be enabled only after choosing approved API/search providers.
exports.runSocialLeadMonitor = functions
    .runWith({ memory: "512MB", timeoutSeconds: 180, secrets: ["GEMINI_API_KEY"] })
    .https.onCall(async (_data, context) => {
    if (!context.auth || !(await isAdminToken(context.auth.token))) {
        throw new functions.https.HttpsError("permission-denied", "Only admins can run the social lead monitor");
    }
    return (0, social_monitor_1.runSocialLeadMonitorJob)();
});
// Auto-create inquiry when WhatsApp message mentions a listing
exports.onNewWhatsAppMessage = functions.firestore
    .document("whatsapp_conversations/{convId}/messages/{msgId}")
    .onCreate(async (snap, context) => {
    const message = snap.data();
    const convId = context.params.convId;
    if (message.direction !== "inbound")
        return;
    // Update conversation last message
    const convRef = admin.firestore().collection("whatsapp_conversations").doc(convId);
    await convRef.update({
        last_message: message.content.substring(0, 100),
        last_message_time: message.timestamp,
        unread_count: admin.firestore.FieldValue.increment(1),
        updated_at: new Date().toISOString(),
    });
    console.log(`New inbound WhatsApp message in conversation ${convId}`);
});
// ============================================================================
// Multi-Agent Social Listing & Agency System Callables
// ============================================================================
const pipeline_1 = require("./agents/pipeline");
/**
 * AI Extractor + Directory Staging + WhatsApp Outreach for a single social post
 */
exports.processSocialPost = functions
    .runWith({ memory: "512MB", timeoutSeconds: 120, secrets: ["GEMINI_API_KEY", "WHATSAPP_ACCESS_TOKEN"] })
    .https.onCall(async (data, context) => {
    if (!context.auth || !(await isAdminToken(context.auth.token))) {
        throw new functions.https.HttpsError("permission-denied", "Only admins can run the social post processor");
    }
    return (0, pipeline_1.processSocialPostPipeline)(data);
});
/**
 * Daily Multi-Agent Pipeline Job:
 * Ingests new leads from `social_leads`, parses with Gemini 3.8 Flash,
 * creates/updates agent profiles, stages draft listings, and sends WhatsApp consent links.
 */
exports.runDailyAgentPipeline = functions
    .runWith({ memory: "512MB", timeoutSeconds: 300, secrets: ["GEMINI_API_KEY", "WHATSAPP_ACCESS_TOKEN"] })
    .https.onCall(async (data, context) => {
    if (!context.auth || !(await isAdminToken(context.auth.token))) {
        throw new functions.https.HttpsError("permission-denied", "Only admins can run the daily agent pipeline");
    }
    return (0, pipeline_1.runDailyAgentPipelineJob)(data);
});
/**
 * Scheduled Daily Multi-Agent Ingestion Job (9:00 AM Colombo time daily)
 */
exports.scheduledDailyAgentPipeline = functions
    .runWith({ memory: "512MB", timeoutSeconds: 300, secrets: ["GEMINI_API_KEY", "WHATSAPP_ACCESS_TOKEN"] })
    .pubsub
    .schedule("0 9 * * *")
    .timeZone("Asia/Colombo")
    .onRun(async () => {
    console.log("Running scheduled daily agent pipeline for Jaffna property leads");
    return (0, pipeline_1.runDailyAgentPipelineJob)({ limit: 25 });
});
/**
 * Trigger or re-send WhatsApp consent request for an existing staged draft listing
 */
exports.sendAgentWhatsAppConsent = functions
    .runWith({ memory: "256MB", timeoutSeconds: 60, secrets: ["WHATSAPP_ACCESS_TOKEN"] })
    .https.onCall(async (data, context) => {
    if (!context.auth || !(await isAdminToken(context.auth.token))) {
        throw new functions.https.HttpsError("permission-denied", "Only admins can send WhatsApp consent requests");
    }
    const listingId = data === null || data === void 0 ? void 0 : data.listing_id;
    if (!listingId) {
        throw new functions.https.HttpsError("invalid-argument", "listing_id is required");
    }
    return (0, pipeline_1.sendListingConsentOutreach)(listingId, data === null || data === void 0 ? void 0 : data.site_url);
});
// ============================================================================
// Agent Preview & Claim Verification Endpoints
// ============================================================================
const claim_1 = require("./agents/claim");
/**
 * Callable: Fetch preview details for an agent using claim token
 */
exports.getListingPreview = functions
    .runWith({ memory: "256MB", timeoutSeconds: 30 })
    .https.onCall(async (data) => {
    const token = data === null || data === void 0 ? void 0 : data.token;
    return (0, claim_1.getListingByClaimToken)(token);
});
/**
 * Callable: Approve, edit, or decline listing via claim token
 */
exports.respondListingConsent = functions
    .runWith({ memory: "256MB", timeoutSeconds: 30 })
    .https.onCall(async (data) => {
    const { token, action, notes, site_url } = data || {};
    if (!token || !action) {
        throw new functions.https.HttpsError("invalid-argument", "Token and action are required");
    }
    return (0, claim_1.processListingClaimAction)(token, action, notes, site_url);
});
/**
 * HTTP Endpoint for agent 1-click preview and approval from browser
 */
exports.claimListingHandler = functions
    .runWith({ memory: "256MB", timeoutSeconds: 30 })
    .https.onRequest(async (req, res) => {
    return corsHandler(req, res, async () => {
        try {
            if (req.method === "GET") {
                const token = String(req.query.token || "").trim();
                const result = await (0, claim_1.getListingByClaimToken)(token);
                if (!result.found) {
                    res.status(404).json(result);
                    return;
                }
                res.status(200).json(result);
                return;
            }
            if (req.method === "POST") {
                const { token, action, notes, site_url } = req.body || {};
                if (!token || !action) {
                    res.status(400).json({ error: "Token and action are required" });
                    return;
                }
                const result = await (0, claim_1.processListingClaimAction)(token, action, notes, site_url);
                res.status(result.success ? 200 : 400).json(result);
                return;
            }
            res.status(405).send("Method Not Allowed");
        }
        catch (err) {
            console.error("claimListingHandler error:", err);
            res.status(500).json({ error: (err === null || err === void 0 ? void 0 : err.message) || "Internal server error" });
        }
    });
});
//# sourceMappingURL=index.js.map