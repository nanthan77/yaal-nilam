import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

function getDb() {
  return admin.firestore();
}

/**
 * Verify webhook - Meta sends a GET request to verify the webhook URL
 */
export async function whatsappVerify(
  req: functions.https.Request,
  res: functions.Response
): Promise<void> {
  const db = getDb();
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  const configDoc = await db.collection("config").doc("whatsapp").get();
  const config = configDoc.data();

  if (mode === "subscribe" && token === config?.webhook_verify_token) {
    console.log("WhatsApp webhook verified");
    res.status(200).send(challenge);
  } else {
    console.error("WhatsApp webhook verification failed");
    res.status(403).send("Forbidden");
  }
}

/**
 * Handle incoming WhatsApp messages from Meta Cloud API
 */
export async function whatsappWebhook(
  req: functions.https.Request,
  res: functions.Response
): Promise<void> {
  try {
    const body = req.body;

    if (body.object !== "whatsapp_business_account") {
      res.status(404).send("Not found");
      return;
    }

    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        if (change.field !== "messages") continue;

        const value = change.value;
        const messages = value.messages || [];
        const contacts = value.contacts || [];

        for (let i = 0; i < messages.length; i++) {
          const message = messages[i];
          const contact = contacts[i] || {};
          await processIncomingMessage(message, contact);
        }
      }
    }

    res.status(200).send("OK");
  } catch (error) {
    console.error("Error processing WhatsApp webhook:", error);
    res.status(200).send("OK");
  }
}

async function processIncomingMessage(
  message: any,
  contact: any
): Promise<void> {
  const db = getDb();
  const phone = message.from;
  const customerName = contact.profile?.name || phone;
  const timestamp = new Date(parseInt(message.timestamp) * 1000).toISOString();

  let content = "";
  let contentType = "text";
  let mediaUrl = "";

  switch (message.type) {
    case "text":
      content = message.text?.body || "";
      break;
    case "image":
      content = message.image?.caption || "[Image]";
      contentType = "image";
      mediaUrl = message.image?.id || "";
      break;
    case "document":
      content = message.document?.caption || "[Document]";
      contentType = "document";
      mediaUrl = message.document?.id || "";
      break;
    case "location":
      content = `[Location: ${message.location?.latitude}, ${message.location?.longitude}]`;
      contentType = "location";
      break;
    default:
      content = `[${message.type}]`;
  }

  // Find or create conversation
  const conversationsRef = db.collection("whatsapp_conversations");
  const existingConv = await conversationsRef
    .where("customer_whatsapp", "==", phone)
    .where("status", "in", ["active"])
    .limit(1)
    .get();

  let conversationId: string;

  if (existingConv.empty) {
    const newConv = await conversationsRef.add({
      customer_name: customerName,
      customer_phone: phone,
      customer_whatsapp: phone,
      last_message: content.substring(0, 100),
      last_message_time: timestamp,
      unread_count: 1,
      status: "active",
      assigned_to: "",
      tags: [],
      created_at: timestamp,
      updated_at: timestamp,
    });
    conversationId = newConv.id;
    console.log(`Created new WhatsApp conversation: ${conversationId}`);
  } else {
    conversationId = existingConv.docs[0].id;
  }

  // Add message to conversation
  await db
    .collection("whatsapp_conversations")
    .doc(conversationId)
    .collection("messages")
    .add({
      conversation_id: conversationId,
      direction: "inbound",
      content,
      content_type: contentType,
      media_url: mediaUrl,
      status: "delivered",
      sender_name: customerName,
      timestamp,
      wa_message_id: message.id,
    });

  // Send auto-reply if enabled
  await handleAutoReply(conversationId, phone);
}

async function handleAutoReply(
  conversationId: string,
  customerPhone: string
): Promise<void> {
  const db = getDb();
  const configDoc = await db.collection("config").doc("whatsapp").get();
  const config = configDoc.data();

  if (!config?.auto_reply_enabled) return;

  const recentMessages = await db
    .collection("whatsapp_conversations")
    .doc(conversationId)
    .collection("messages")
    .where("direction", "==", "outbound")
    .orderBy("timestamp", "desc")
    .limit(1)
    .get();

  if (!recentMessages.empty) {
    const lastOutbound = recentMessages.docs[0].data();
    const lastTime = new Date(lastOutbound.timestamp).getTime();
    const now = Date.now();
    if (now - lastTime < 24 * 60 * 60 * 1000) return;
  }

  console.log(`Auto-reply queued for conversation ${conversationId}`);
}