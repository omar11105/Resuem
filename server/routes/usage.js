import { Router } from 'express';
import { query } from '../lib/db.js';

const router = Router();
const FREE_DAILY_LIMIT = 1;

router.get('/', async (req, res) => {
  try {
    const userResult = await query(
      'SELECT plan FROM users WHERE clerk_id = $1',
      [req.auth.userId]
    );
    const plan = userResult.rows[0]?.plan ?? 'free';
    const limit = plan === 'pro' ? 999 : FREE_DAILY_LIMIT;

    const countResult = await query(
      `SELECT COUNT(*)::int AS count
       FROM tailorings
       WHERE clerk_id = $1 AND created_at >= CURRENT_DATE`,
      [req.auth.userId]
    );

    res.json({
      count: countResult.rows[0]?.count ?? 0,
      limit,
      plan,
    });
  } catch (err) {
    console.error('Usage error:', err);
    res.status(500).json({ error: 'Failed to fetch usage' });
  }
});

export default router;
