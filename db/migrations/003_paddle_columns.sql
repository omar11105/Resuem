-- Replace Stripe columns with Paddle (run in Supabase SQL Editor)
ALTER TABLE users DROP COLUMN IF EXISTS stripe_customer_id;
ALTER TABLE users DROP COLUMN IF EXISTS stripe_subscription_id;
ALTER TABLE users ADD COLUMN IF NOT EXISTS paddle_customer_id VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS paddle_subscription_id VARCHAR(100);
