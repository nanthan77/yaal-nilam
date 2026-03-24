import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { whatsappWebhook, whatsappVerify } from "./whatsapp";
import { sendWhatsAppMessage } from "./whatsapp-send";

admin.initializeApp();

// WhatsApp Webhook - receives incoming messages from Meta Cloud API
export const whatsappWebhookHandler = functions.https.onRequest(async (req, res) => {
  if (req.method === "GET") {
    return whatsappVerify(req, res);
  }
  if (req.method === "POST") {
    return whatsappWebhook(req, res);
  }
  res.status(405).send("Method not allowed");
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
