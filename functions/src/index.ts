import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import cors = require("cors");
import { whatsappWebhook, whatsappVerify } from "./whatsapp";
import { sendWhatsAppMessage } from "./whatsapp-send";
import { runSocialLeadMonitorJob } from "./social-monitor";

admin.initializeApp();

// Server-side listing counters (views / whatsapp_clicks) driven off analytics_events.
export { onAnalyticsEvent } from "./analytics";

// Property alerts: WhatsApp buyers when a newly-published listing matches the
// criteria they registered (collection `property_alerts`).
export { onListingPublishedAlert } from "./alerts";

const corsHandler = cors({ origin: true });

// WhatsApp Webhook - receives incoming messages from Meta Cloud API
// Must be publicly accessible for Meta to call it
export const whatsappWebhookHandler = functions
  .runWith({ memory: "256MB", timeoutSeconds: 60 })
  .https.onRequest(async (req, res) => {
    // Handle CORS preflight
    return corsHandler(req, res, async () => {
      if (req.method === "GET") {
        return whatsappVerify(req, res);
      }
      if (req.method === "POST") {
        return whatsappWebhook(req, res);
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

async function isAdminToken(token: admin.auth.DecodedIdToken): Promise<boolean> {
  if (token.admin === true) return true;
  if (typeof token.role === "string" && ADMIN_ROLES.includes(token.role)) {
    return true;
  }
  if (
    token.email_verified === true &&
    typeof token.email === "string" &&
    OWNER_ADMIN_EMAILS.includes(token.email)
  ) {
    return true;
  }
  if (typeof token.email === "string") {
    const snap = await admin
      .firestore()
      .collection("admin_users")
      .doc(token.email.toLowerCase())
      .get();
    const record = snap.data();
    if (
      record?.status === "active" &&
      typeof record.role === "string" &&
      ADMIN_ROLES.includes(record.role)
    ) {
      return true;
    }
  }
  return false;
}

// Send WhatsApp message - called from admin dashboard
export const sendWhatsApp = functions.https.onCall(async (data, context) => {
  // Verify admin auth (same admins firestore.rules isAdmin() accepts)
  if (!context.auth || !(await isAdminToken(context.auth.token))) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Only admins can send WhatsApp messages"
    );
  }
  return sendWhatsAppMessage(data);
});

// Run source-specific social lead monitors and save discovered property posts
// into `social_leads`. Triggered manually from the admin dashboard; scheduling
// should be enabled only after choosing approved API/search providers.
export const runSocialLeadMonitor = functions
  .runWith({ memory: "512MB", timeoutSeconds: 180 })
  .https.onCall(async (_data, context) => {
    if (!context.auth || !(await isAdminToken(context.auth.token))) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Only admins can run the social lead monitor"
      );
    }
    return runSocialLeadMonitorJob();
  });

// Auto-create inquiry when WhatsApp message mentions a listing
export const onNewWhatsAppMessage = functions.firestore
  .document("whatsapp_conversations/{convId}/messages/{msgId}")
  .onCreate(async (snap, context) => {
    const message = snap.data();
    const convId = context.params.convId;

    if (message.direction !== "inbound") return;

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
import {
  processSocialPostPipeline,
  runDailyAgentPipelineJob,
  sendListingConsentOutreach,
} from "./agents/pipeline";

/**
 * AI Extractor + Directory Staging + WhatsApp Outreach for a single social post
 */
export const processSocialPost = functions
  .runWith({ memory: "512MB", timeoutSeconds: 120 })
  .https.onCall(async (data, context) => {
    if (!context.auth || !(await isAdminToken(context.auth.token))) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Only admins can run the social post processor"
      );
    }
    return processSocialPostPipeline(data);
  });

/**
 * Daily Multi-Agent Pipeline Job:
 * Ingests new leads from `social_leads`, parses with Gemini 3.8 Flash,
 * creates/updates agent profiles, stages draft listings, and sends WhatsApp consent links.
 */
export const runDailyAgentPipeline = functions
  .runWith({ memory: "512MB", timeoutSeconds: 300 })
  .https.onCall(async (data, context) => {
    if (!context.auth || !(await isAdminToken(context.auth.token))) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Only admins can run the daily agent pipeline"
      );
    }
    return runDailyAgentPipelineJob(data);
  });

/**
 * Scheduled Daily Multi-Agent Ingestion Job (9:00 AM Colombo time daily)
 */
export const scheduledDailyAgentPipeline = functions.pubsub
  .schedule("0 9 * * *")
  .timeZone("Asia/Colombo")
  .onRun(async () => {
    console.log("Running scheduled daily agent pipeline for Jaffna property leads");
    return runDailyAgentPipelineJob({ limit: 25 });
  });

/**
 * Trigger or re-send WhatsApp consent request for an existing staged draft listing
 */
export const sendAgentWhatsAppConsent = functions
  .runWith({ memory: "256MB", timeoutSeconds: 60 })
  .https.onCall(async (data, context) => {
    if (!context.auth || !(await isAdminToken(context.auth.token))) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Only admins can send WhatsApp consent requests"
      );
    }
    const listingId = data?.listing_id;
    if (!listingId) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "listing_id is required"
      );
    }
    return sendListingConsentOutreach(listingId, data?.site_url);
  });

// ============================================================================
// Agent Preview & Claim Verification Endpoints
// ============================================================================
import {
  getListingByClaimToken,
  processListingClaimAction,
} from "./agents/claim";

/**
 * Callable: Fetch preview details for an agent using claim token
 */
export const getListingPreview = functions
  .runWith({ memory: "256MB", timeoutSeconds: 30 })
  .https.onCall(async (data) => {
    const token = data?.token;
    return getListingByClaimToken(token);
  });

/**
 * Callable: Approve, edit, or decline listing via claim token
 */
export const respondListingConsent = functions
  .runWith({ memory: "256MB", timeoutSeconds: 30 })
  .https.onCall(async (data) => {
    const { token, action, notes, site_url } = data || {};
    if (!token || !action) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Token and action are required"
      );
    }
    return processListingClaimAction(token, action, notes, site_url);
  });

/**
 * HTTP Endpoint for agent 1-click preview and approval from browser
 */
export const claimListingHandler = functions
  .runWith({ memory: "256MB", timeoutSeconds: 30 })
  .https.onRequest(async (req, res) => {
    return corsHandler(req, res, async () => {
      try {
        if (req.method === "GET") {
          const token = String(req.query.token || "").trim();
          const result = await getListingByClaimToken(token);
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
          const result = await processListingClaimAction(token, action, notes, site_url);
          res.status(result.success ? 200 : 400).json(result);
          return;
        }

        res.status(405).send("Method Not Allowed");
      } catch (err: any) {
        console.error("claimListingHandler error:", err);
        res.status(500).json({ error: err?.message || "Internal server error" });
      }
    });
  });
