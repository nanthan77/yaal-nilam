/**
 * Message Logging Service
 * Saves all inbound/outbound messages for audit trail
 */
const { pool } = require('../config/database');

async function saveMessage(msg) {
  try {
    await pool.query(`
      INSERT INTO messages (user_phone, direction, message_type, raw_text, transcribed_text,
                           extracted_json, media_url, wa_message_id, wa_timestamp,
                           intent_detected, confidence_score)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `, [
      msg.user_phone, msg.direction, msg.message_type,
      msg.raw_text, msg.transcribed_text || null,
      msg.extracted_json ? JSON.stringify(msg.extracted_json) : null,
      msg.media_url, msg.wa_message_id || null, msg.wa_timestamp || null,
      msg.intent_detected || null, msg.confidence_score || null
    ]);
  } catch (error) {
    console.error('Message save error:', error.message);
  }
}

module.exports = { saveMessage };
