/**
 * WhatsApp Webhook Routes
 * Handles Meta Cloud API webhooks for incoming messages
 */

const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const { downloadMedia, convertOggToMp3 } = require('../services/media');
const { sendToAIService } = require('../services/ai-bridge');
const { sendWhatsAppMessage, sendVoiceReply } = require('../services/whatsapp-api');
const { getOrCreateSession, updateSession } = require('../services/session');
const { saveMessage } = require('../services/messages');
const { upsertUser } = require('../services/users');

// ─────────────────────────────────────
// WEBHOOK VERIFICATION (GET)
// Meta sends a GET request to verify the webhook URL
// ─────────────────────────────────────
router.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    console.log('✅ Webhook verified successfully');
    return res.status(200).send(challenge);
  }

  console.warn('⚠️ Webhook verification failed');
  return res.sendStatus(403);
});

// ─────────────────────────────────────
// SIGNATURE VERIFICATION
// Meta signs every webhook POST with X-Hub-Signature-256 = HMAC-SHA256(rawBody, appSecret).
// Without this, anyone who knows the URL can inject fake messages.
// ─────────────────────────────────────
function verifyMetaSignature(req) {
  const appSecret = process.env.WHATSAPP_APP_SECRET;
  if (!appSecret) {
    console.warn('⚠️ WHATSAPP_APP_SECRET not set — skipping signature verification (NOT for production).');
    return true; // fail-open only when unconfigured
  }
  const header = req.get('x-hub-signature-256') || '';
  if (!header || !req.rawBody) return false;
  const expected = 'sha256=' + crypto.createHmac('sha256', appSecret).update(req.rawBody).digest('hex');
  const a = Buffer.from(header);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// ─────────────────────────────────────
// INCOMING MESSAGES (POST)
// ─────────────────────────────────────
router.post('/', async (req, res) => {
  // Reject forged requests before doing any work.
  if (!verifyMetaSignature(req)) {
    console.warn('⚠️ WhatsApp webhook signature verification failed');
    return res.sendStatus(403);
  }

  // Immediately acknowledge receipt (Meta requires 200 within 20s)
  res.sendStatus(200);

  try {
    const body = req.body;

    // Validate webhook payload structure
    if (!body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
      return; // Not a message event (could be status update)
    }

    const change = body.entry[0].changes[0].value;
    const message = change.messages[0];
    const contact = change.contacts?.[0];
    const phoneNumber = message.from; // E.164 format: 94771234567
    const formattedPhone = `+${phoneNumber}`;

    console.log(`📩 Message from ${formattedPhone}: type=${message.type}`);

    // Ensure user exists in database
    await upsertUser(formattedPhone, {
      whatsapp_name: contact?.profile?.name,
      language_pref: 'ta' // Default to Tamil for Jaffna
    });

    // Get or create conversation session
    const session = await getOrCreateSession(formattedPhone);

    // ─── Process by message type ───
    let processedContent = {};

    switch (message.type) {
      case 'text':
        processedContent = {
          type: 'text',
          text: message.text.body,
          raw: message.text.body
        };
        break;

      case 'audio':
        // Voice note pipeline: download → convert → (will be sent to Whisper by AI service)
        try {
          const mediaUrl = await downloadMedia(message.audio.id);
          const mp3Path = await convertOggToMp3(mediaUrl, message.id);
          processedContent = {
            type: 'voice',
            audioPath: mp3Path,
            mimeType: message.audio.mime_type,
            raw: '[Voice Note]'
          };
        } catch (audioErr) {
          console.error('Audio processing error:', audioErr);
          await sendWhatsAppMessage(formattedPhone,
            'Sorry, I had trouble processing your voice note. Please send it again or type your message instead. / மன்னிக்கவும், உங்கள் குரல் குறிப்பை செயலாக்க சிக்கல் ஏற்பட்டது. மீண்டும் அனுப்பவும் அல்லது தட்டச்சு செய்து அனுப்பவும்.'
          );
          return;
        }
        break;

      case 'image':
        // Image handling: download and add to session media buffer
        try {
          const imageUrl = await downloadMedia(message.image.id);
          // Add to session's media buffer (for grouping multiple images)
          session.media_buffer = session.media_buffer || [];
          session.media_buffer.push(imageUrl);
          await updateSession(formattedPhone, {
            media_buffer: session.media_buffer,
            media_buffer_started_at: session.media_buffer_started_at || new Date()
          });

          // Don't process yet — wait for text/voice with description
          // Set a timeout to process after SESSION_TIMEOUT_MS
          console.log(`📸 Image buffered (${session.media_buffer.length} total) for ${formattedPhone}`);

          // If caption included with image
          if (message.image.caption) {
            processedContent = {
              type: 'text',
              text: message.image.caption,
              raw: message.image.caption,
              attachedImages: session.media_buffer
            };
          } else {
            // Just acknowledge the image, wait for more
            if (session.media_buffer.length === 1) {
              await sendWhatsAppMessage(formattedPhone,
                '📸 Photo received.\nYou can send more photos or describe the property details next.\n\n📸 படம் கிடைத்தது.\nமேலும் படங்கள் அனுப்பலாம் அல்லது சொத்து விவரத்தை அடுத்த செய்தியில் சொல்லலாம்.'
              );
            }
            return;
          }
        } catch (imgErr) {
          console.error('Image processing error:', imgErr);
          return;
        }
        break;

      case 'location':
        processedContent = {
          type: 'location',
          latitude: message.location.latitude,
          longitude: message.location.longitude,
          raw: `Location: ${message.location.latitude}, ${message.location.longitude}`
        };
        break;

      default:
        console.log(`Unsupported message type: ${message.type}`);
        return;
    }

    // Save inbound message to database
    await saveMessage({
      user_phone: formattedPhone,
      direction: 'inbound',
      message_type: processedContent.type,
      raw_text: processedContent.raw,
      media_url: processedContent.audioPath || null,
      wa_message_id: message.id,
      wa_timestamp: new Date(parseInt(message.timestamp) * 1000)
    });

    // ─── Send to Python AI Microservice ───
    const aiPayload = {
      phone: formattedPhone,
      message: processedContent,
      session: {
        current_flow: session.current_flow,
        flow_state: session.flow_state,
        pending_fields: session.pending_fields,
        media_buffer: session.media_buffer || []
      }
    };

    const aiResponse = await sendToAIService(aiPayload);

    // ─── Process AI Response ───
    if (aiResponse) {
      // Update session state
      if (aiResponse.session_update) {
        await updateSession(formattedPhone, aiResponse.session_update);
      }

      // Clear media buffer if listing was created
      if (aiResponse.listing_created) {
        await updateSession(formattedPhone, { media_buffer: [], media_buffer_started_at: null });
      }

      // Send reply to user — voice or text based on user's input mode
      if (aiResponse.reply) {
        const userLanguage = session.language_pref || 'ta';
        const userSentVoice = processedContent.type === 'voice';
        const voiceReplyEnabled = process.env.ELEVENLABS_API_KEY && process.env.VOICE_REPLY_ENABLED !== 'false';

        // If user sent a voice note AND ElevenLabs is configured, reply with voice
        if (userSentVoice && voiceReplyEnabled) {
          try {
            await sendVoiceReply(formattedPhone, aiResponse.reply, userLanguage);
            console.log(`🔊 Voice reply sent to ${formattedPhone}`);
          } catch (voiceErr) {
            console.error('Voice reply failed, falling back to text:', voiceErr.message);
            await sendWhatsAppMessage(formattedPhone, aiResponse.reply);
          }
        } else {
          await sendWhatsAppMessage(formattedPhone, aiResponse.reply);
        }

        // Always send text version too if voice reply was sent (for accessibility)
        if (userSentVoice && voiceReplyEnabled && process.env.VOICE_REPLY_ALSO_TEXT !== 'false') {
          await sendWhatsAppMessage(formattedPhone, aiResponse.reply);
        }

        // Save outbound message
        await saveMessage({
          user_phone: formattedPhone,
          direction: 'outbound',
          message_type: userSentVoice && voiceReplyEnabled ? 'voice' : 'text',
          raw_text: aiResponse.reply,
          intent_detected: aiResponse.intent,
          extracted_json: aiResponse.extracted_data,
          confidence_score: aiResponse.confidence
        });
      }

      // Trigger match alerts if new listing was created
      if (aiResponse.listing_created && aiResponse.listing_id) {
        // This is handled asynchronously by the AI service
        console.log(`🔔 Match alerts will be triggered for listing ${aiResponse.listing_id}`);
      }
    }

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
  }
});

module.exports = router;
