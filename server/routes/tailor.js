import '../loadEnv.js';
import { Router } from 'express';
import multer from 'multer';
import Anthropic from '@anthropic-ai/sdk';
import { extractPDFText } from '../middleware/parsePDF.js';
import { buildTailoringPrompt } from '../lib/claudePrompt.js';

const router = Router();

let _client = null;

function getAnthropicClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey.includes('...')) {
    throw new Error('ANTHROPIC_API_KEY is not configured in server/.env');
  }
  if (!_client) _client = new Anthropic({ apiKey });
  return _client;
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
});

const uploadResume = upload.single('resume');

function handleUpload(req, res, next) {
  if (!req.is('multipart/form-data')) {
    return next();
  }

  uploadResume(req, res, (err) => {
    if (!err) return next();

    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'Resume file must be 5MB or less' });
      }
      return res.status(400).json({ error: err.message });
    }

    return res.status(400).json({ error: err.message });
  });
}

const ALLOWED_SECTIONS = ['experience', 'projects', 'summary'];

function parseSections(raw) {
  let list = [];
  if (Array.isArray(raw)) list = raw;
  else if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) list = parsed;
      else list = raw.split(',').map((s) => s.trim()).filter(Boolean);
    } catch {
      list = raw.split(',').map((s) => s.trim()).filter(Boolean);
    }
  }

  return [...new Set(list.filter((s) => ALLOWED_SECTIONS.includes(s)))];
}

function filterTailoredSections(tailoredSections, sections) {
  if (!tailoredSections || typeof tailoredSections !== 'object') {
    return {};
  }
  const filtered = {};
  for (const key of sections) {
    if (tailoredSections[key] !== undefined && tailoredSections[key] !== null) {
      filtered[key] = tailoredSections[key];
    }
  }
  return filtered;
}

async function resolveResumeInput(req) {
  if (req.file?.buffer) {
    const extracted = await extractPDFText(req.file.buffer);
    return { resumeText: extracted.text, warning: extracted.warning };
  }

  const resumeText =
    typeof req.body?.resumeText === 'string' ? req.body.resumeText.trim() : '';

  if (!resumeText) {
    return { error: 'resumeText or resume PDF file is required' };
  }

  return { resumeText, warning: null };
}

function parseClaudeResponse(rawText) {
  const cleaned = rawText
    .replace(/^```json\n?/, '')
    .replace(/\n?```$/, '')
    .trim();

  return JSON.parse(cleaned);
}

router.post('/', handleUpload, async (req, res) => {
  try {
    const jobDescription =
      typeof req.body?.jobDescription === 'string'
        ? req.body.jobDescription.trim()
        : '';

    if (!jobDescription) {
      return res.status(400).json({ error: 'jobDescription is required' });
    }

    const resumeResult = await resolveResumeInput(req);
    if (resumeResult.error) {
      return res.status(400).json({ error: resumeResult.error });
    }

    const { resumeText, warning: pdfWarning } = resumeResult;
    const sections = parseSections(req.body?.sections);

    if (sections.length === 0) {
      return res.status(400).json({ error: 'sections must include at least one item' });
    }

    const prompt = buildTailoringPrompt(resumeText, jobDescription, sections);

    const model =
      process.env.ANTHROPIC_MODEL?.trim() || 'claude-sonnet-4-6';

    const response = await getAnthropicClient().messages.create({
      model,
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    });

    const rawText = response.content[0].text;
    const result = parseClaudeResponse(rawText);

    const warnings = [...(result.warnings ?? [])];
    if (pdfWarning) warnings.unshift(pdfWarning);

    res.json({
      ...result,
      tailored_sections: filterTailoredSections(
        result.tailored_sections,
        sections
      ),
      sections_tailored: sections,
      warnings,
    });
  } catch (err) {
    console.error('Tailor error:', err);

    if (err.message?.includes('PDF appears to be empty')) {
      return res.status(400).json({ error: err.message });
    }

    if (err.message?.includes('ANTHROPIC_API_KEY')) {
      return res.status(503).json({ error: err.message });
    }

    if (err.status === 404 && err.message?.includes('model')) {
      return res.status(502).json({
        error: `Model not found. Set ANTHROPIC_MODEL in server/.env (tried "${process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6'}").`,
      });
    }

    res.status(500).json({ error: 'Failed to tailor resume' });
  }
});

export default router;
