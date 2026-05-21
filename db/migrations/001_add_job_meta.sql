-- Run once on existing Supabase/local DBs created before job_title/company_name columns
ALTER TABLE tailorings ADD COLUMN IF NOT EXISTS job_title VARCHAR(255);
ALTER TABLE tailorings ADD COLUMN IF NOT EXISTS company_name VARCHAR(255);
