import { Paddle, Environment } from '@paddle/paddle-node-sdk';

let _paddle = null;

function isConfigured(key) {
  return Boolean(key && !key.includes('...'));
}

/** Returns Paddle client when PADDLE_API_KEY is set; null otherwise. */
export function getPaddle() {
  const key = process.env.PADDLE_API_KEY;
  if (!isConfigured(key)) return null;
  if (!_paddle) {
    const envSetting = (process.env.PADDLE_ENVIRONMENT ?? '').toLowerCase();
    const useProduction =
      envSetting === 'production' ||
      (envSetting !== 'sandbox' && process.env.NODE_ENV === 'production');
    _paddle = new Paddle(key, {
      environment: useProduction ? Environment.production : Environment.sandbox,
    });
  }
  return _paddle;
}
