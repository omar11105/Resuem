import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getOrCreateUser, query } from '../lib/db.js';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const user = await getOrCreateUser(req.auth.userId);

    const result = await query(
      `SELECT id, job_title, created_at
       FROM tailorings
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 50`,
      [user.id]
    );

    res.json({ items: result.rows });
  } catch (err) {
    console.error('History error:', err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

export default router;
