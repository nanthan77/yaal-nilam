/**
 * REST API Routes — For Next.js web portal
 * Provides endpoints for property browsing, search, agents, auth
 */

const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// ─────────────────────────────────────
// PUBLIC: Property Listings
// ─────────────────────────────────────

// GET /api/properties — Browse all active listings
router.get('/properties', async (req, res) => {
  try {
    const {
      type, intent, division, min_price, max_price,
      min_beds, min_baths, sort = 'newest',
      page = 1, limit = 20, search
    } = req.query;

    let query = `
      SELECT l.*, d.name as division_name, d.name_ta as division_name_ta,
             ST_Y(l.location::geometry) as lat, ST_X(l.location::geometry) as lng,
             u.name as agent_name, u.avatar_url as agent_avatar
      FROM listings l
      LEFT JOIN divisions d ON l.division_id = d.id
      LEFT JOIN users u ON l.agent_phone = u.phone_number
      WHERE l.status = 'active'
    `;
    const params = [];
    let paramCount = 0;

    if (type && type !== 'all') {
      params.push(type);
      query += ` AND l.property_type = $${++paramCount}`;
    }
    if (intent && intent !== 'all') {
      params.push(intent);
      query += ` AND l.intent = $${++paramCount}`;
    }
    if (division) {
      params.push(parseInt(division));
      query += ` AND l.division_id = $${++paramCount}`;
    }
    if (min_price) {
      params.push(parseFloat(min_price));
      query += ` AND l.price >= $${++paramCount}`;
    }
    if (max_price) {
      params.push(parseFloat(max_price));
      query += ` AND l.price <= $${++paramCount}`;
    }
    if (min_beds) {
      params.push(parseInt(min_beds));
      query += ` AND l.bedrooms >= $${++paramCount}`;
    }
    if (min_baths) {
      params.push(parseInt(min_baths));
      query += ` AND l.bathrooms >= $${++paramCount}`;
    }
    if (search) {
      params.push(`%${search}%`);
      query += ` AND (l.title ILIKE $${++paramCount} OR l.title_ta ILIKE $${paramCount} OR l.address ILIKE $${paramCount})`;
    }

    // Sorting
    switch (sort) {
      case 'price_asc': query += ' ORDER BY l.price ASC'; break;
      case 'price_desc': query += ' ORDER BY l.price DESC'; break;
      case 'featured': query += ' ORDER BY l.is_featured DESC, l.listed_at DESC'; break;
      default: query += ' ORDER BY l.listed_at DESC';
    }

    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    params.push(parseInt(limit), offset);
    query += ` LIMIT $${++paramCount} OFFSET $${++paramCount}`;

    const result = await pool.query(query, params);

    // Count total
    let countQuery = `SELECT COUNT(*) FROM listings WHERE status = 'active'`;
    const countResult = await pool.query(countQuery);

    res.json({
      properties: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / parseInt(limit))
    });
  } catch (error) {
    console.error('Properties fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// GET /api/properties/:id — Single property detail
router.get('/properties/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT l.*, d.name as division_name, d.name_ta as division_name_ta,
             gn.name as gn_name, gn.name_ta as gn_name_ta,
             ST_Y(l.location::geometry) as lat, ST_X(l.location::geometry) as lng,
             u.name as agent_name, u.name_ta as agent_name_ta,
             u.phone_number as agent_phone, u.avatar_url as agent_avatar,
             u.rating as agent_rating, u.review_count as agent_reviews
      FROM listings l
      LEFT JOIN divisions d ON l.division_id = d.id
      LEFT JOIN gn_divisions gn ON l.gn_division_id = gn.id
      LEFT JOIN users u ON l.agent_phone = u.phone_number
      WHERE l.id = $1
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Increment view count
    await pool.query('UPDATE listings SET view_count = view_count + 1 WHERE id = $1', [req.params.id]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Property detail error:', error);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

// ─────────────────────────────────────
// PUBLIC: Geographic Data
// ─────────────────────────────────────

// GET /api/divisions — List all DS divisions
router.get('/divisions', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.id, d.name, d.name_ta,
             ST_Y(d.center_point::geometry) as lat, ST_X(d.center_point::geometry) as lng,
             COUNT(l.id) as listing_count
      FROM divisions d
      LEFT JOIN listings l ON l.division_id = d.id AND l.status = 'active'
      GROUP BY d.id ORDER BY d.name
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch divisions' });
  }
});

// GET /api/places/search — Fuzzy place name search
router.get('/places/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) return res.json([]);

    const result = await pool.query(`
      SELECT id, name, name_ta, place_type,
             ST_Y(location::geometry) as lat, ST_X(location::geometry) as lng,
             similarity(name, $1) as sim
      FROM places
      WHERE name % $1 OR name_ta ILIKE $2 OR $1 = ANY(aliases)
      ORDER BY sim DESC
      LIMIT 10
    `, [q, `%${q}%`]);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

// ─────────────────────────────────────
// PUBLIC: Agents
// ─────────────────────────────────────

router.get('/agents', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.id, u.name, u.name_ta, u.avatar_url, u.bio,
             u.rating, u.review_count, u.total_listings,
             u.phone_number, u.agency_name
      FROM users u WHERE u.is_agent = TRUE AND u.is_verified = TRUE
      ORDER BY u.rating DESC, u.total_listings DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
});

// ─────────────────────────────────────
// AUTH: Login / Register (Web Portal)
// ─────────────────────────────────────

router.post('/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password, user_type = 'buyer' } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await pool.query(`
      INSERT INTO users (phone_number, name, email, user_type, is_verified)
      VALUES ($1, $2, $3, $4, FALSE)
      RETURNING id, phone_number, name, email, user_type
    `, [phone, name, email, user_type]);

    // TODO: Store hashed password (add password column or use separate auth table)

    const token = jwt.sign(
      { userId: result.rows[0].id, phone },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ user: result.rows[0], token });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Phone number already registered' });
    }
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE phone_number = $1', [phone]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // TODO: Verify password hash
    const token = jwt.sign(
      { userId: result.rows[0].id, phone },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ user: result.rows[0], token });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// ─────────────────────────────────────
// PROTECTED: User Dashboard
// ─────────────────────────────────────

router.get('/me/saved', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT l.* FROM saved_searches ss
      JOIN listings l ON TRUE -- TODO: implement saved search matching
      WHERE ss.user_id = $1
      LIMIT 20
    `, [req.user.userId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch saved searches' });
  }
});

module.exports = router;
