import { Router } from 'express';
import { query } from '../lib/db.js';
import { extractJobMeta, isValidMeta } from '../lib/extractJobMeta.js';

const router = Router();

function parseResultJson(raw) {
  if (!raw) return null;
  if (typeof raw === 'object') return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

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

  const parsed = parseResultJson(row.result_json);
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

router.get('/:id', async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid tailoring id' });
    }

    const result = await query(
      `SELECT id, job_title, company_name, job_description_snippet, result_json, created_at
       FROM tailorings
       WHERE id = $1 AND clerk_id = $2`,
      [id, req.auth.userId]
    );

    const row = result.rows[0];
    if (!row) {
      return res.status(404).json({ error: 'Tailoring not found' });
    }

    const saved = parseResultJson(row.result_json);
    if (!saved?.tailored_sections) {
      return res.status(404).json({ error: 'Tailoring result unavailable' });
    }

    const { jobTitle, companyName } = displayMeta(row);

    res.json({
      id: row.id,
      created_at: row.created_at,
      job_title: jobTitle,
      company_name: companyName,
      result: saved,
    });
  } catch (err) {
    console.error('History detail error:', err);
    res.status(500).json({ error: 'Failed to fetch tailoring' });
  }
});

export default router;
