import { Router } from 'express';
import express from 'express';
import { getStripe } from '../lib/stripe.js';
import { query } from '../lib/db.js';

const router = Router();

router.post(
  '/stripe',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const stripe = getStripe();
    if (!stripe) {
      return res.status(503).json({ error: 'Stripe is not configured' });
    }

    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const customerId = session.customer;
        const clerkId = session.metadata?.clerk_id;
        if (clerkId) {
          await query(
            `UPDATE users SET plan = 'pro', stripe_customer_id = $1 WHERE clerk_id = $2`,
            [customerId, clerkId]
          );
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        await query(
          `UPDATE users SET plan = 'free' WHERE stripe_customer_id = $1`,
          [subscription.customer]
        );
        break;
      }
      default:
        break;
    }

    res.json({ received: true });
  }
);

export default router;
