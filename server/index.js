import './loadEnv.js';
import express from 'express';
import cors from 'cors';
import tailorRouter from './routes/tailor.js';
import usageRouter from './routes/usage.js';
import historyRouter from './routes/history.js';
import webhooksRouter from './routes/webhooks.js';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());

// Stripe webhooks require raw body — mount BEFORE json parser
app.use('/webhooks', webhooksRouter);

app.use(express.json({ limit: '2mb' }));

app.use('/api/tailor', tailorRouter);
app.use('/api/usage', usageRouter);
app.use('/api/history', historyRouter);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
