import { Router } from 'express';
import { query } from '../lib/db.js';
import { extractJobMeta, isValidMeta } from '../lib/extractJobMeta.js';

const router = Router();

function displayMeta(row) {
  const stored = {
    job_title: row.job_title,
    company_name: row.company_name,
  };
  if (
    stored.job_title &&
    stored.company_name &&
    !/^(about|company|role)$/i.test(stored.job_title) &&
    stored.job_title.toLowerCase() !== 'about us'
  ) {
    return {
      jobTitle: stored.job_title,
      companyName: stored.company_name,
    };
  }

  const json = row.result_json;
  const parsed = typeof json === 'string' ? JSON.parse(json) : json;
  if (parsed?.job_meta && isValidMeta(parsed.job_meta)) {
    return {
      jobTitle: parsed.job_meta.job_title,
      companyName: parsed.job_meta.company_name,
    };
  }

  return extractJobMeta(row.job_description_snippet ?? '');
}

router.get('/', async (req, res) => {
  try {
    const result = await query(
      `SELECT id, job_title, company_name, job_description_snippet, result_json, created_at
       FROM tailorings
       WHERE clerk_id = $1
       ORDER BY created_at DESC
       LIMIT 50`,
      [req.auth.userId]
    );

    const items = result.rows.map((row) => {
      const { jobTitle, companyName } = displayMeta(row);
      return {
        id: row.id,
        job_title: jobTitle,
        company_name: companyName,
        created_at: row.created_at,
      };
    });

    res.json({ items });
  } catch (err) {
    console.error('History error:', err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

export default router;
