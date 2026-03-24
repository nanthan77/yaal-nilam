/**
 * User Service — Upsert WhatsApp users into database
 */
const { pool } = require('../config/database');

async function upsertUser(phone, data = {}) {
  try {
    await pool.query(`
      INSERT INTO users (phone_number, whatsapp_name, language_pref, last_active_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (phone_number) DO UPDATE SET
        whatsapp_name = COALESCE($2, users.whatsapp_name),
        last_active_at = NOW()
    `, [phone, data.whatsapp_name || null, data.language_pref || 'ta']);
  } catch (error) {
    console.error('User upsert error:', error.message);
  }
}

module.exports = { upsertUser };
