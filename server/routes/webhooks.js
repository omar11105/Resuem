import { EventName } from '@paddle/paddle-node-sdk';
import { getPaddle } from '../lib/paddle.js';
import { query } from '../lib/db.js';

export async function handlePaddleWebhook(req, res) {
  const paddle = getPaddle();
  if (!paddle) {
    return res.status(503).json({ error: 'Paddle is not configured' });
  }

  const signature = req.headers['paddle-signature'];
  if (!signature) {
    return res.status(400).json({ error: 'No signature' });
  }

  let event;
  try {
    event = await paddle.webhooks.unmarshal(
      JSON.stringify(req.body),
      process.env.PADDLE_WEBHOOK_SECRET,
      signature
    );
  } catch (err) {
    console.error('[webhook] Paddle signature verification failed:', err.message);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  try {
    switch (event.eventType) {
      case EventName.SubscriptionActivated:
      case EventName.SubscriptionUpdated: {
        const sub = event.data;
        const clerkId = sub.customData?.clerk_id;
        if (!clerkId) {
          console.error(
            '[webhook] Subscription event missing clerk_id in customData:',
            event.eventType,
            sub.id
          );
          break;
        }
        if (sub.status === 'active') {
          await query(
            `UPDATE users
             SET plan = 'pro',
                 paddle_customer_id = $2,
                 paddle_subscription_id = $3
             WHERE clerk_id = $1`,
            [clerkId, sub.customerId, sub.id]
          );
        }
        break;
      }

      case EventName.SubscriptionCanceled: {
        const sub = event.data;
        await query(
          `UPDATE users SET plan = 'free', paddle_subscription_id = NULL
           WHERE paddle_subscription_id = $1`,
          [sub.id]
        );
        break;
      }

      case EventName.SubscriptionPastDue: {
        const sub = event.data;
        await query(
          `UPDATE users SET plan = 'free'
           WHERE paddle_subscription_id = $1`,
          [sub.id]
        );
        console.warn('[webhook] Subscription past due, user downgraded:', sub.id);
        break;
      }

      default:
        console.log('[webhook] Unhandled event type:', event.eventType);
    }
  } catch (err) {
    console.error('[webhook] DB error processing event:', event.eventType, err);
  }

  res.status(200).json({ received: true });
}
