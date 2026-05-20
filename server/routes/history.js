import { Router } from 'express';
import { query } from '../lib/db.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const result = await query(
      `SELECT id, job_description_snippet, sections_tailored, created_at
       FROM tailorings
       WHERE clerk_id = $1
       ORDER BY created_at DESC
       LIMIT 50`,
      [req.auth.userId]
    );

    res.json({ items: result.rows });
  } catch (err) {
    console.error('History error:', err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

export default router;
