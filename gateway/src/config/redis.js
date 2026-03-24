const { createClient } = require('redis');

let redisClient = null;

async function connectRedis() {
  try {
    redisClient = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
    redisClient.on('error', (err) => console.warn('Redis warning:', err.message));
    await redisClient.connect();
  } catch (error) {
    console.warn('⚠️ Redis not available — sessions will use DB only');
    redisClient = null;
  }
}

function getRedis() { return redisClient; }

module.exports = { connectRedis, getRedis };
