-- db/schema.sql

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  clerk_id VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255),
  plan VARCHAR(10) DEFAULT 'free',
  paddle_customer_id VARCHAR(100),
  paddle_subscription_id VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tailorings (
  id SERIAL PRIMARY KEY,
  clerk_id VARCHAR(100) REFERENCES users(clerk_id),
  job_description_snippet TEXT,
  job_title VARCHAR(255),
  company_name VARCHAR(255),
  sections_tailored TEXT[],
  result_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tailorings_clerk_date ON tailorings(clerk_id, created_at);
