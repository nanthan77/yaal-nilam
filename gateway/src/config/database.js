const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/yaalnilam',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

async function connectDB() {
  const client = await pool.connect();
  await client.query('SELECT NOW()');
  client.release();
}

module.exports = { pool, connectDB };
