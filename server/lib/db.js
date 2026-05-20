import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function query(text, params) {
  const result = await pool.query(text, params);
  return result;
}

export async function getOrCreateUser(clerkId, email) {
  const existing = await query(
    'SELECT * FROM users WHERE clerk_id = $1',
    [clerkId]
  );
  if (existing.rows[0]) return existing.rows[0];

  const inserted = await query(
    `INSERT INTO users (clerk_id, email) VALUES ($1, $2) RETURNING *`,
    [clerkId, email]
  );
  return inserted.rows[0];
}

export default pool;
