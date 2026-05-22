import { query, getOrCreateUser } from '../lib/db.js';

const FREE_DAILY_LIMIT = 1;

async function getTodayTailoringCount(clerkId) {
  const result = await query(
    `SELECT COUNT(*)::int AS count
     FROM tailorings
     WHERE clerk_id = $1 AND created_at >= CURRENT_DATE`,
    [clerkId]
  );
  return result.rows[0]?.count ?? 0;
}

/** Blocks free users after daily tailoring limit (counts saved tailorings). */
export async function enforceFreeTier(req, res, next) {
  if (!req.auth?.userId) {
    return res.status(401).json({ error: 'Sign in required' });
  }

  try {
    const user = await getOrCreateUser(req.auth.userId);
    req.user = {
      clerkId: user.clerk_id,
      email: user.email,
      plan: user.plan ?? 'free',
      id: user.id,
    };

    if (user.plan === 'pro') {
      return next();
    }

    const count = await getTodayTailoringCount(req.auth.userId);
    if (count >= FREE_DAILY_LIMIT) {
      return res.status(429).json({
        error: 'Daily limit reached',
        code: 'PAYWALL',
        limit: FREE_DAILY_LIMIT,
        count,
        plan: user.plan ?? 'free',
      });
    }

    req.usageCount = count;
    next();
  } catch (err) {
    console.error('enforceFreeTier error:', err);
    res.status(500).json({ error: 'Failed to check usage limit' });
  }
}
