import './loadEnv.js';
import express from 'express';
import cors from 'cors';
import { requireUser, ensureUser } from './middleware/auth.js';
import tailorRouter from './routes/tailor.js';
import usageRouter from './routes/usage.js';
import historyRouter from './routes/history.js';
import { handlePaddleWebhook } from './routes/webhooks.js';
import { enforceFreeTier } from './middleware/rateLimit.js';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.post('/webhooks/paddle', handlePaddleWebhook);

app.use('/api/tailor', requireUser, ensureUser, enforceFreeTier, tailorRouter);
app.use('/api/usage', requireUser, ensureUser, usageRouter);
app.use('/api/history', requireUser, ensureUser, historyRouter);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
