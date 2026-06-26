-- Fillyfy Database Schema
-- Initial migration: users and usage tables

-- Users table
CREATE TABLE IF NOT EXISTS users (
  clerk_user_id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  plan_status TEXT NOT NULL DEFAULT 'free' CHECK (plan_status IN ('free', 'starter', 'pro', 'business')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Usage tracking table
CREATE TABLE IF NOT EXISTS usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL REFERENCES users(clerk_user_id) ON DELETE CASCADE,
  count INTEGER NOT NULL DEFAULT 0,
  period_month INTEGER NOT NULL CHECK (period_month BETWEEN 1 AND 12),
  period_year INTEGER NOT NULL CHECK (period_year >= 2024),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (clerk_user_id, period_month, period_year)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_usage_user_period ON usage(clerk_user_id, period_month, period_year);
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON users(stripe_customer_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER usage_updated_at BEFORE UPDATE ON usage
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies: users can read their own records
CREATE POLICY "Users read own record" ON users
  FOR SELECT USING (clerk_user_id = current_setting('request.jwt.claims', true)::json ->> 'sub');

CREATE POLICY "Users read own usage" ON usage
  FOR SELECT USING (clerk_user_id = current_setting('request.jwt.claims', true)::json ->> 'sub');

-- Note: Service role key bypasses RLS, which is used for all server-side operations
