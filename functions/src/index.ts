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
