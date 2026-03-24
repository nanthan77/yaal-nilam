/**
 * Session Manager
 * Manages WhatsApp conversation state via Redis + PostgreSQL
 * Handles multi-image buffering with timeout grouping
 */

const { pool } = require('../config/database');
const { getRedis } = require('../config/redis');

const SESSION_TTL = parseInt(process.env.SESSION_TIMEOUT_MS) || 120000; // 2 minutes

/**
 * Get or create a conversation session for a WhatsApp user
 */
async function getOrCreateSession(phone) {
  const redis = getRedis();

  // Check Redis first (fast path)
  if (redis) {
    const cached = await redis.get(`session:${phone}`);
    if (cached) return JSON.parse(cached);
  }

  // Check PostgreSQL
  const result = await pool.query(
    'SELECT * FROM conversations WHERE user_phone = $1 ORDER BY last_message_at DESC LIMIT 1',
    [phone]
  );

  if (result.rows.length > 0) {
    const session = result.rows[0];
    // Cache in Redis
    if (redis) {
      await redis.setEx(`session:${phone}`, 300, JSON.stringify(session));
    }
    return session;
  }

  // Create new session
  const newSession = await pool.query(`
    INSERT INTO conversations (user_phone, current_flow, flow_state, pending_fields)
    VALUES ($1, 'general', '{}', '{}')
    RETURNING *
  `, [phone]);

  const session = newSession.rows[0];
  if (redis) {
    await redis.setEx(`session:${phone}`, 300, JSON.stringify(session));
  }

  return session;
}

/**
 * Update session state (flow, collected data, media buffer)
 */
async function updateSession(phone, updates) {
  const redis = getRedis();

  const setClauses = [];
  const params = [phone];
  let paramIdx = 1;

  if (updates.current_flow !== undefined) {
    setClauses.push(`current_flow = $${++paramIdx}`);
    params.push(updates.current_flow);
  }
  if (updates.flow_state !== undefined) {
    setClauses.push(`flow_state = $${++paramIdx}`);
    params.push(JSON.stringify(updates.flow_state));
  }
  if (updates.pending_fields !== undefined) {
    setClauses.push(`pending_fields = $${++paramIdx}`);
    params.push(updates.pending_fields);
  }
  if (updates.media_buffer !== undefined) {
    setClauses.push(`media_buffer = $${++paramIdx}`);
    params.push(updates.media_buffer);
  }
  if (updates.media_buffer_started_at !== undefined) {
    setClauses.push(`media_buffer_started_at = $${++paramIdx}`);
    params.push(updates.media_buffer_started_at);
  }

  setClauses.push('last_message_at = NOW()');
  setClauses.push('message_count = message_count + 1');

  if (setClauses.length > 0) {
    await pool.query(
      `UPDATE conversations SET ${setClauses.join(', ')} WHERE user_phone = $1`,
      params
    );
  }

  // Invalidate Redis cache
  if (redis) {
    await redis.del(`session:${phone}`);
  }
}

module.exports = { getOrCreateSession, updateSession };
