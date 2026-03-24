/**
 * WhatsApp Cloud API Service
 * Handles outbound messages to users via Meta Cloud API
 */

const axios = require('axios');

const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v19.0';
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

/**
 * Send a plain text message to a WhatsApp user
 */
async function sendWhatsAppMessage(to, text) {
  // Remove leading '+' for Meta API format
  const recipientPhone = to.replace('+', '');

  try {
    const response = await axios.post(
      `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: recipientPhone,
        type: 'text',
        text: { body: text }
      },
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`📤 Message sent to ${to}: ${text.substring(0, 50)}...`);
    return response.data;
  } catch (error) {
    console.error('WhatsApp send error:', error.response?.data || error.message);

    // MOCK MODE: Log instead of throwing when no API key
    if (!ACCESS_TOKEN || ACCESS_TOKEN === 'your_access_token') {
      console.log(`🔧 MOCK MODE — Would send to ${to}: "${text}"`);
      return { mock: true, to, text };
    }

    throw error;
  }
}

/**
 * Send a template message (for outbound alerts outside 24-hour window)
 * Required for: match alerts, listing confirmations, follow-ups
 */
async function sendTemplateMessage(to, templateName, components = []) {
  const recipientPhone = to.replace('+', '');

  try {
    const response = await axios.post(
      `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: recipientPhone,
        type: 'template',
        template: {
          name: templateName,
          language: { code: 'ta' }, // Tamil template
          components: components
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`📤 Template "${templateName}" sent to ${to}`);
    return response.data;
  } catch (error) {
    console.error('Template send error:', error.response?.data || error.message);

    if (!ACCESS_TOKEN || ACCESS_TOKEN === 'your_access_token') {
      console.log(`🔧 MOCK — Template "${templateName}" to ${to}`);
      return { mock: true };
    }

    throw error;
  }
}

/**
 * Download media from WhatsApp (voice notes, images)
 */
async function downloadWhatsAppMedia(mediaId) {
  try {
    // Step 1: Get media URL
    const mediaInfo = await axios.get(
      `${WHATSAPP_API_URL}/${mediaId}`,
      { headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` } }
    );

    // Step 2: Download the actual file
    const mediaResponse = await axios.get(mediaInfo.data.url, {
      headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` },
      responseType: 'arraybuffer'
    });

    return {
      data: mediaResponse.data,
      mimeType: mediaInfo.data.mime_type,
      fileSize: mediaInfo.data.file_size
    };
  } catch (error) {
    console.error('Media download error:', error.message);
    throw error;
  }
}

/**
 * Send an audio/voice message to a WhatsApp user.
 * The audio must first be uploaded to Meta's media endpoint,
 * then sent as an audio message referencing the media ID.
 *
 * Flow: Text response → ElevenLabs TTS → upload to Meta → send audio message
 */
async function sendWhatsAppVoiceMessage(to, audioBuffer, mimeType = 'audio/mpeg') {
  const recipientPhone = to.replace('+', '');

  try {
    // Step 1: Upload audio to Meta media endpoint
    const FormData = require('form-data');
    const form = new FormData();
    form.append('messaging_product', 'whatsapp');
    form.append('type', mimeType);
    form.append('file', audioBuffer, {
      filename: 'voice_reply.mp3',
      contentType: mimeType,
    });

    const uploadResponse = await axios.post(
      `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/media`,
      form,
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          ...form.getHeaders(),
        },
      }
    );

    const mediaId = uploadResponse.data.id;

    // Step 2: Send audio message referencing the uploaded media
    const response = await axios.post(
      `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: recipientPhone,
        type: 'audio',
        audio: { id: mediaId },
      },
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(`🔊 Voice message sent to ${to}`);
    return response.data;
  } catch (error) {
    console.error('Voice send error:', error.response?.data || error.message);

    if (!ACCESS_TOKEN || ACCESS_TOKEN === 'your_access_token') {
      console.log(`🔧 MOCK — Voice message to ${to} (${audioBuffer.length} bytes)`);
      return { mock: true, to, type: 'audio' };
    }

    throw error;
  }
}

/**
 * Generate TTS audio via AI service and send as WhatsApp voice message.
 * Combines ElevenLabs TTS + WhatsApp audio sending in one call.
 */
async function sendVoiceReply(to, text, language = 'en') {
  const AI_SERVICE_URL = process.env.PYTHON_AI_URL || 'http://localhost:8000';

  try {
    // Call our Python AI service TTS endpoint
    const ttsResponse = await axios.post(
      `${AI_SERVICE_URL}/api/tts/speak`,
      { text, language },
      { responseType: 'arraybuffer', timeout: 30000 }
    );

    const audioBuffer = Buffer.from(ttsResponse.data);
    const contentType = ttsResponse.headers['content-type'] || 'audio/mpeg';

    // Send the audio as a WhatsApp voice message
    return await sendWhatsAppVoiceMessage(to, audioBuffer, contentType);
  } catch (error) {
    console.error('Voice reply error:', error.message);

    // Fallback: send as text if voice fails
    console.log(`⚡ Falling back to text message for ${to}`);
    return await sendWhatsAppMessage(to, text);
  }
}

module.exports = {
  sendWhatsAppMessage,
  sendTemplateMessage,
  downloadWhatsAppMedia,
  sendWhatsAppVoiceMessage,
  sendVoiceReply,
};
