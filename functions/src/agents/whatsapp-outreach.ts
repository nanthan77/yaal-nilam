import * as admin from "firebase-admin";
import axios from "axios";
import { AgentDirectoryResult } from "./directory";

function db() {
  return admin.firestore();
}

export interface OutreachSendResult {
  success: boolean;
  status: "sent" | "saved_local" | "failed" | "missing_phone";
  conversation_id: string;
  wa_message_id?: string;
  message_preview: string;
  error?: string;
}

/**
 * Builds the bilingual WhatsApp consent message
 */
export function buildConsentMessage(data: {
  agent_name: string;
  property_title: string;
  area_name: string;
  preview_url: string;
}): string {
  const name = data.agent_name && data.agent_name !== "Real Estate Advisor" ? data.agent_name : "நண்பரே";
  return `வணக்கம் ${name}!

யாழ் நிலம் (yaalnilam.com) சொத்துச் சந்தையிலிருந்து தொடர்பு கொள்கிறோம். 

நீங்கள் சமூக வலைத்தளத்தில் பகிர்ந்த *${data.property_title}* (${data.area_name}) விளம்பரத்தை எங்கள் தளத்தில் முற்றிலும் *இலவசமாக (FREE OF CHARGE)* பதிவேற்ற விரும்புகிறோம். உள்ளூர் மற்றும் புலம்பெயர் வாங்குபவர்கள் உங்களை நேரடியாகத் தொடர்பு கொள்ள இது உதவும்.

🔗 *வரைவு முன்னோட்டம் (Preview Link):*
${data.preview_url}

இதை நாங்கள் இலவசமாக பதிவேற்ற உங்கள் ஒப்புதல் உள்ளதா?

1️⃣ *1* — ஆம், இலவசமாக பதிவேற்றலாம் (Yes, publish free)
2️⃣ *2* — விவரங்களில் திருத்தம் தேவை (Needs edit)
3️⃣ *3* — வேண்டாம் (No, do not post)

பதிலளிக்க 1, 2, அல்லது 3 என இச்செய்திக்கு பதிலளிக்கவும்.
நன்றி!
— யாழ் நிலம் குழு (Yaal Nilam Team)`;
}

/**
 * Sends or logs the WhatsApp consent message to the agent/seller
 */
export async function sendAgentConsentOutreach(
  agentResult: AgentDirectoryResult
): Promise<OutreachSendResult> {
  const firestore = db();
  const phone = agentResult.agent_phone;

  if (!phone) {
    return {
      success: false,
      status: "missing_phone",
      conversation_id: "",
      message_preview: "",
      error: "No phone number available for agent outreach",
    };
  }

  const messageBody = buildConsentMessage({
    agent_name: agentResult.agent_name,
    property_title: agentResult.property_title,
    area_name: agentResult.area_name,
    preview_url: agentResult.preview_url,
  });

  const cleanDigits = phone.replace(/[^\d]/g, "");
  const conversationId = `conv-${cleanDigits}`;

  // 1. Fetch WhatsApp configuration
  const configDoc = await firestore.collection("config").doc("whatsapp").get();
  const config = configDoc.data();

  // 2. Prepare conversation document
  const convRef = firestore.collection("whatsapp_conversations").doc(conversationId);
  const convUpdateData = {
    id: conversationId,
    customer_name: agentResult.agent_name,
    customer_phone: phone,
    customer_whatsapp: phone,
    last_message: messageBody.slice(0, 100),
    last_message_time: new Date().toISOString(),
    status: "active",
    unread_count: 0,
    tags: ["agent_outreach", "consent_pending"],
    pending_consent_listing_id: agentResult.listing_id,
    pending_consent_token: agentResult.claim_token,
    pending_consent_agent_id: agentResult.agent_id,
    outreach_sent_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // If WhatsApp API credentials are not set, save locally for staging/testing
  if (!config?.phone_number_id || !config?.access_token) {
    console.warn("WhatsApp API credentials missing. Logging consent outreach locally to Firestore.");

    await convRef.set(convUpdateData, { merge: true });
    await convRef.collection("messages").add({
      conversation_id: conversationId,
      direction: "outbound",
      content: messageBody,
      content_type: "text",
      status: "pending_meta_credentials",
      sender_name: "Yaal Nilam AI Agent",
      timestamp: new Date().toISOString(),
    });

    // Update listing outreach timestamp
    await firestore.collection("listings").doc(agentResult.listing_id).update({
      consent_status: "outreach_sent",
      outreach_sent_at: new Date().toISOString(),
    });

    return {
      success: true,
      status: "saved_local",
      conversation_id: conversationId,
      message_preview: messageBody.slice(0, 120),
    };
  }

  // 3. Send via Meta Graph API v21.0
  try {
    const apiVersion = config.api_version || "v21.0";
    const response = await axios.post(
      `https://graph.facebook.com/${apiVersion}/${config.phone_number_id}/messages`,
      {
        messaging_product: "whatsapp",
        to: phone,
        type: "text",
        text: { body: messageBody },
      },
      {
        headers: {
          Authorization: `Bearer ${config.access_token}`,
          "Content-Type": "application/json",
        },
        timeout: 12000,
      }
    );

    const waMessageId = response.data?.messages?.[0]?.id;

    await convRef.set(convUpdateData, { merge: true });
    await convRef.collection("messages").add({
      conversation_id: conversationId,
      direction: "outbound",
      content: messageBody,
      content_type: "text",
      status: "sent",
      wa_message_id: waMessageId,
      sender_name: "Yaal Nilam AI Agent",
      timestamp: new Date().toISOString(),
    });

    await firestore.collection("listings").doc(agentResult.listing_id).update({
      consent_status: "outreach_sent",
      outreach_sent_at: new Date().toISOString(),
    });

    return {
      success: true,
      status: "sent",
      conversation_id: conversationId,
      wa_message_id: waMessageId,
      message_preview: messageBody.slice(0, 120),
    };
  } catch (err: any) {
    const errMsg = err.response?.data?.error?.message || err.message;
    console.error("Meta WhatsApp outreach send failed:", errMsg);

    await convRef.set(convUpdateData, { merge: true });
    await convRef.collection("messages").add({
      conversation_id: conversationId,
      direction: "outbound",
      content: messageBody,
      content_type: "text",
      status: "failed",
      error_detail: errMsg,
      sender_name: "Yaal Nilam AI Agent",
      timestamp: new Date().toISOString(),
    });

    return {
      success: false,
      status: "failed",
      conversation_id: conversationId,
      message_preview: messageBody.slice(0, 120),
      error: errMsg,
    };
  }
}
