import { query, getOrCreateUser } from '../lib/db.js';

const FREE_DAILY_LIMIT = 1;

export async function enforceFreeTier(req, res, next) {
  if (!req.auth?.userId) {
    return res.status(401).json({ error: 'Sign in required' });
  }

  const user = await getOrCreateUser(req.auth.userId);
  if (user.plan === 'pro') {
    req.user = user;
    return next();
  }

  const today = new Date().toISOString().slice(0, 10);
  const usageResult = await query(
    `SELECT count FROM usage WHERE user_id = $1 AND date = $2`,
    [user.id, today]
  );

  const count = usageResult.rows[0]?.count ?? 0;
  if (count >= FREE_DAILY_LIMIT) {
    return res.status(429).json({
      error: 'Daily limit reached',
      limit: FREE_DAILY_LIMIT,
      count,
    });
  }

  req.user = user;
  req.usageCount = count;
  next();
}

export async function incrementUsage(userId) {
  const today = new Date().toISOString().slice(0, 10);
  await query(
    `INSERT INTO usage (user_id, date, count)
     VALUES ($1, $2, 1)
     ON CONFLICT (user_id, date)
     DO UPDATE SET count = usage.count + 1`,
    [userId, today]
  );
}
