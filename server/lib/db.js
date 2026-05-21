import pg from 'pg';

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;
const isRemote =
  connectionString?.includes('supabase.co') ||
  connectionString?.includes('sslmode=require');

const pool = new Pool({
  connectionString,
  ssl: isRemote ? { rejectUnauthorized: false } : undefined,
});

export async function query(text, params) {
  const result = await pool.query(text, params);
  return result;
}

export async function getOrCreateUser(clerkId, email = null) {
  await query(
    `INSERT INTO users (clerk_id, email) VALUES ($1, $2)
     ON CONFLICT (clerk_id) DO NOTHING`,
    [clerkId, email]
  );

  const result = await query('SELECT * FROM users WHERE clerk_id = $1', [clerkId]);
  return result.rows[0];
}

export default pool;
