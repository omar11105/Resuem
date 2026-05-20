import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getOrCreateUser, query } from '../lib/db.js';

const router = Router();
const FREE_DAILY_LIMIT = 1;

router.get('/', requireAuth, async (req, res) => {
  try {
    const user = await getOrCreateUser(req.auth.userId);
    const limit = user.plan === 'pro' ? 999 : FREE_DAILY_LIMIT;
    const today = new Date().toISOString().slice(0, 10);

    const result = await query(
      `SELECT count FROM usage WHERE user_id = $1 AND date = $2`,
      [user.id, today]
    );

    res.json({
      count: result.rows[0]?.count ?? 0,
      limit,
      plan: user.plan,
    });
  } catch (err) {
    console.error('Usage error:', err);
    res.status(500).json({ error: 'Failed to fetch usage' });
  }
});

export default router;
