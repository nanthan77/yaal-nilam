/**
 * YAAL NILAM — Node.js WhatsApp API Gateway
 *
 * Responsibilities:
 * 1. Receive WhatsApp webhooks from Meta/Twilio
 * 2. Download & convert voice notes (.ogg → .mp3)
 * 3. Manage user sessions via Redis
 * 4. Route AI requests to Python microservice
 * 5. Send responses back via WhatsApp API
 * 6. JWT authentication for web portal API
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const whatsappRoutes = require('./routes/whatsapp');
const apiRoutes = require('./routes/api');
const { connectDB } = require('./config/database');
const { connectRedis } = require('./config/redis');

const app = express();
const PORT = process.env.NODE_PORT || 3001;

// ─────────────────────────────────────
// MIDDLEWARE
// ─────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// ─────────────────────────────────────
// ROUTES
// ─────────────────────────────────────

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'yaalnilam-gateway',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// WhatsApp webhook routes (Meta Cloud API)
app.use('/webhook', whatsappRoutes);

// REST API routes (for web portal & admin)
app.use('/api', apiRoutes);

// ─────────────────────────────────────
// ERROR HANDLING
// ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ─────────────────────────────────────
// STARTUP
// ─────────────────────────────────────
async function start() {
  try {
    await connectDB();
    console.log('✅ PostgreSQL connected');

    await connectRedis();
    console.log('✅ Redis connected');

    app.listen(PORT, () => {
      console.log(`\n🏠 Yaal Nilam Gateway running on port ${PORT}`);
      console.log(`📱 WhatsApp webhook: http://localhost:${PORT}/webhook`);
      console.log(`🌐 REST API: http://localhost:${PORT}/api`);
      console.log(`❤️  Health: http://localhost:${PORT}/health\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

start();

module.exports = app;
