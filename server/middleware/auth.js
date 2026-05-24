import { createRequire } from 'module';
import { query } from '../lib/db.js';

const require = createRequire(import.meta.url);
const { ClerkExpressRequireAuth, ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');

/** Protected routes — 401 if not signed in */
export const requireUser = ClerkExpressRequireAuth();

/** Public routes that may read auth context when a token is present */
export const withOptionalUser = ClerkExpressWithAuth();

function getEmailFromAuth(auth) {
  const claims = auth?.sessionClaims;
  if (!claims) return null;
  return claims.email ?? claims.primary_email_address ?? null;
}

/** Upsert user on every authed request (avoids webhook race on first login) */
export async function ensureUser(req, res, next) {
  const userId = req.auth?.userId;
  if (!userId) {
    return next();
  }

  const email = getEmailFromAuth(req.auth);

  try {
    await query(
      `INSERT INTO users (clerk_id, email) VALUES ($1, $2)
       ON CONFLICT (clerk_id) DO NOTHING`,
      [userId, email]
    );
    const row = await query('SELECT plan, lemon_customer_id FROM users WHERE clerk_id = $1', [
      userId,
    ]);
    const dbUser = row.rows[0];
    req.user = {
      clerkId: userId,
      email,
      plan: dbUser?.plan ?? 'free',
      lemonCustomerId: dbUser?.lemon_customer_id ?? null,
    };
    next();
  } catch (err) {
    console.error('ensureUser error:', err);
    res.status(500).json({ error: 'Failed to sync user' });
  }
}
