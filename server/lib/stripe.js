import Stripe from 'stripe';

let _stripe = null;

function isConfigured(key) {
  return Boolean(key && key.startsWith('sk_') && !key.includes('...'));
}

/** Returns Stripe client when STRIPE_SECRET_KEY is set; null in Phase 1 dev. */
export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!isConfigured(key)) return null;
  if (!_stripe) _stripe = new Stripe(key);
  return _stripe;
}
