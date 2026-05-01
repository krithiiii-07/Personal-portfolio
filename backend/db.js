// db.js — PostgreSQL connection pool
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }   // required by Render / Supabase / Neon
    : false,
});

// Create the table if it doesn't exist yet
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id          SERIAL PRIMARY KEY,
      name        VARCHAR(100)  NOT NULL,
      email       VARCHAR(150)  NOT NULL,
      subject     VARCHAR(200)  NOT NULL,
      message     TEXT          NOT NULL,
      created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
    );
  `);
  console.log('✅  Database initialised — contact_messages table ready.');
}

module.exports = { pool, initDB };
