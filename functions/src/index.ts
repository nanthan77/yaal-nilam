import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import cors = require("cors");
import { whatsappWebhook, whatsappVerify } from "./whatsapp";
import { sendWhatsAppMessage } from "./whatsapp-send";

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

// Send WhatsApp message - called from admin dashboard
export const sendWhatsApp = functions.https.onCall(async (data, context) => {
  // Verify admin auth
  if (!context.auth || !context.auth.token.admin) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Only admins can send WhatsApp messages"
    );
  }
  return sendWhatsAppMessage(data);
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
