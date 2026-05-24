import crypto from 'crypto';
import { query } from '../lib/db.js';

export async function handleLemonSqueezyWebhook(req, res) {
  const rawBody = req.body;
  const signature = req.headers['x-signature'];

  if (!signature || !rawBody) {
    return res.status(400).json({ error: 'Missing signature or body' });
  }

  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[webhook] LEMONSQUEEZY_WEBHOOK_SECRET is not configured');
    return res.status(503).json({ error: 'Webhook secret not configured' });
  }

  const hmac = crypto.createHmac('sha256', secret);
  const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
  const sig = Buffer.from(signature, 'utf8');

  let isValid = false;
  try {
    isValid = crypto.timingSafeEqual(digest, sig);
  } catch (err) {
    console.error('[webhook] timingSafeEqual error:', err.message);
  }

  if (!isValid) {
    console.error('[webhook] Invalid LemonSqueezy signature');
    return res.status(400).json({ error: 'Invalid signature' });
  }

  let event;
  try {
    event = JSON.parse(rawBody.toString());
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  const eventName = event?.meta?.event_name;
  const attributes = event?.data?.attributes;
  const customData = event?.meta?.custom_data;

  console.log('[webhook] Received event:', eventName);

  try {
    switch (eventName) {
      case 'subscription_created':
      case 'subscription_updated': {
        const clerkId = customData?.clerk_id;
        if (!clerkId) {
          console.error('[webhook] Missing clerk_id in custom_data for event:', eventName);
          break;
        }
        const status = attributes?.status;
        const lemonCustomerId = String(attributes?.customer_id);
        const lemonSubscriptionId = String(event?.data?.id);

        if (status === 'active') {
          await query(
            `UPDATE users
             SET plan = 'pro',
                 lemon_customer_id = $2,
                 lemon_subscription_id = $3
             WHERE clerk_id = $1`,
            [clerkId, lemonCustomerId, lemonSubscriptionId]
          );
          console.log('[webhook] Upgraded user to pro:', clerkId);
        } else {
          await query(
            `UPDATE users SET plan = 'free'
             WHERE lemon_subscription_id = $1`,
            [lemonSubscriptionId]
          );
          console.log('[webhook] Downgraded user, status:', status);
        }
        break;
      }

      case 'subscription_cancelled':
      case 'subscription_expired': {
        const lemonSubscriptionId = String(event?.data?.id);
        await query(
          `UPDATE users SET plan = 'free'
           WHERE lemon_subscription_id = $1`,
          [lemonSubscriptionId]
        );
        console.log('[webhook] Subscription ended:', eventName, lemonSubscriptionId);
        break;
      }

      case 'subscription_payment_failed': {
        const lemonSubscriptionId = String(attributes?.subscription_id);
        await query(
          `UPDATE users SET plan = 'free'
           WHERE lemon_subscription_id = $1`,
          [lemonSubscriptionId]
        );
        console.warn('[webhook] Payment failed, user downgraded:', lemonSubscriptionId);
        break;
      }

      default:
        console.log('[webhook] Unhandled event type:', eventName);
    }
  } catch (err) {
    console.error('[webhook] DB error processing event:', eventName, err);
  }

  return res.status(200).json({ received: true });
}
