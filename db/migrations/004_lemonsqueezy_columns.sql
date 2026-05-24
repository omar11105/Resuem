-- LemonSqueezy customer/subscription columns (drops legacy payment columns if present)
ALTER TABLE users DROP COLUMN IF EXISTS paddle_customer_id;
ALTER TABLE users DROP COLUMN IF EXISTS paddle_subscription_id;
ALTER TABLE users ADD COLUMN IF NOT EXISTS lemon_customer_id VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS lemon_subscription_id VARCHAR(100);
