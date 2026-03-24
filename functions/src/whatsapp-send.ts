import * as admin from "firebase-admin";
import axios from "axios";

function getDb() {
  return admin.firestore();
}

interface SendMessageData {
  conversation_id: string;
  to: string;
  message: string;
  content_type?: string;
}

/**
 * Send a WhatsApp message via Meta Cloud API
 */
export async function sendWhatsAppMessage(data: SendMessageData): Promise<any> {
  const db = getDb();
  const { conversation_id, to, message, content_type = "text" } = data;

  const configDoc = await db.collection("config").doc("whatsapp").get();
  const config = configDoc.data();
  if (!config?.phone_number_id || !config?.access_token) {
    console.warn("WhatsApp API not configured, saving message locally only");

    const savedMessage = await db
      .collection("whatsapp_conversations")
      .doc(conversation_id)
      .collection("messages")
      .add({
        conversation_id,
        direction: "outbound",
        content: message,
        content_type,
        status: "pending",
        sender_name: "Yaal Nilam",
        timestamp: new Date().toISOString(),
      });

    await db.collection("whatsapp_conversations").doc(conversation_id).update({
      last_message: message.substring(0, 100),
      last_message_time: new Date().toISOString(),
      unread_count: 0,
      updated_at: new Date().toISOString(),
    });

    return { success: true, local_only: true, message_id: savedMessage.id };
  }
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${config.phone_number_id}/messages`,
      {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: message },
      },
      {
        headers: {
          Authorization: `Bearer ${config.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const waMessageId = response.data?.messages?.[0]?.id;

    const savedMessage = await db
      .collection("whatsapp_conversations")
      .doc(conversation_id)
      .collection("messages")
      .add({
        conversation_id,
        direction: "outbound",
        content: message,
        content_type,
        status: "sent",
        sender_name: "Yaal Nilam",
        timestamp: new Date().toISOString(),
        wa_message_id: waMessageId,
      });
    await db.collection("whatsapp_conversations").doc(conversation_id).update({
      last_message: message.substring(0, 100),
      last_message_time: new Date().toISOString(),
      unread_count: 0,
      updated_at: new Date().toISOString(),
    });

    return { success: true, message_id: savedMessage.id, wa_message_id: waMessageId };
  } catch (error: any) {
    console.error("Failed to send WhatsApp message:", error.response?.data || error.message);

    await db
      .collection("whatsapp_conversations")
      .doc(conversation_id)
      .collection("messages")
      .add({
        conversation_id,
        direction: "outbound",
        content: message,
        content_type,
        status: "failed",
        sender_name: "Yaal Nilam",
        timestamp: new Date().toISOString(),
      });

    throw new Error(`Failed to send WhatsApp message: ${error.message}`);
  }
}