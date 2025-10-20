-- Create subscriptions table
CREATE TABLE subscriptions (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'trial',
  current_period_start TIMESTAMP NOT NULL,
  current_period_end TIMESTAMP NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  trial_end_date TIMESTAMP,
  stripe_subscription_id TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for user_id lookups
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);

-- Create index for stripe_subscription_id lookups
CREATE INDEX idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own subscription"
  ON subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription"
  ON subscriptions
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert subscriptions"
  ON subscriptions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can update subscriptions"
  ON subscriptions
  FOR UPDATE
  USING (true);

