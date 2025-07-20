-- AI Guided SaaS - Analytics Tables Setup
-- Run this script in Supabase SQL Editor to add analytics tables

-- Create activity_logs table for tracking all user actions
CREATE TABLE IF NOT EXISTS activity_logs (
  id TEXT NOT NULL DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create usage_records table for tracking resource usage
CREATE TABLE IF NOT EXISTS usage_records (
  id TEXT NOT NULL DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create api_metrics table for performance tracking
CREATE TABLE IF NOT EXISTS api_metrics (
  id TEXT NOT NULL DEFAULT gen_random_uuid(),
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INTEGER NOT NULL,
  response_time INTEGER NOT NULL, -- in milliseconds
  user_id TEXT,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create system_health table for platform monitoring
CREATE TABLE IF NOT EXISTS system_health (
  id TEXT NOT NULL DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_unit TEXT,
  category TEXT NOT NULL, -- 'cpu', 'memory', 'disk', 'network', etc.
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create feature_flags table for feature management
CREATE TABLE IF NOT EXISTS feature_flags (
  id TEXT NOT NULL DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  enabled BOOLEAN DEFAULT FALSE,
  rollout_percentage INTEGER DEFAULT 0 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
  target_users TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Add additional columns to users table for better analytics
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS company TEXT;

-- Add additional columns to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS error_message TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS framework TEXT;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_resource ON activity_logs(resource_type, resource_id);

CREATE INDEX IF NOT EXISTS idx_usage_records_user_id ON usage_records(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_records_resource_type ON usage_records(resource_type);
CREATE INDEX IF NOT EXISTS idx_usage_records_created_at ON usage_records(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_api_metrics_endpoint ON api_metrics(endpoint);
CREATE INDEX IF NOT EXISTS idx_api_metrics_status_code ON api_metrics(status_code);
CREATE INDEX IF NOT EXISTS idx_api_metrics_created_at ON api_metrics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_metrics_user_id ON api_metrics(user_id);

CREATE INDEX IF NOT EXISTS idx_system_health_metric_name ON system_health(metric_name);
CREATE INDEX IF NOT EXISTS idx_system_health_category ON system_health(category);
CREATE INDEX IF NOT EXISTS idx_system_health_created_at ON system_health(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_feature_flags_name ON feature_flags(name);
CREATE INDEX IF NOT EXISTS idx_feature_flags_enabled ON feature_flags(enabled);

-- Enable Row Level Security
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Activity logs - users can only see their own logs
CREATE POLICY "Users can view own activity logs" ON activity_logs
  FOR SELECT USING (auth.uid()::text = user_id);

-- Usage records - users can only see their own usage
CREATE POLICY "Users can view own usage records" ON usage_records
  FOR SELECT USING (auth.uid()::text = user_id);

-- API metrics - public read for authenticated users
CREATE POLICY "Authenticated users can view API metrics" ON api_metrics
  FOR SELECT USING (auth.role() = 'authenticated');

-- System health - public read for authenticated users
CREATE POLICY "Authenticated users can view system health" ON system_health
  FOR SELECT USING (auth.role() = 'authenticated');

-- Feature flags - public read for authenticated users
CREATE POLICY "Authenticated users can view feature flags" ON feature_flags
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create trigger for updated_at on feature_flags
CREATE TRIGGER update_feature_flags_updated_at BEFORE UPDATE ON feature_flags
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create materialized views for performance

-- Daily active users
CREATE MATERIALIZED VIEW IF NOT EXISTS daily_active_users AS
SELECT 
  DATE(created_at) as date,
  COUNT(DISTINCT user_id) as active_users
FROM activity_logs
WHERE created_at >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- API performance by endpoint
CREATE MATERIALIZED VIEW IF NOT EXISTS api_performance_summary AS
SELECT 
  endpoint,
  method,
  COUNT(*) as total_calls,
  AVG(response_time) as avg_response_time,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY response_time) as p95_response_time,
  PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY response_time) as p99_response_time,
  SUM(CASE WHEN status_code >= 400 THEN 1 ELSE 0 END)::FLOAT / COUNT(*) * 100 as error_rate
FROM api_metrics
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY endpoint, method;

-- Create indexes on materialized views
CREATE INDEX IF NOT EXISTS idx_daily_active_users_date ON daily_active_users(date);
CREATE INDEX IF NOT EXISTS idx_api_performance_endpoint ON api_performance_summary(endpoint);

-- Grant permissions
GRANT SELECT ON activity_logs TO authenticated;
GRANT SELECT ON usage_records TO authenticated;
GRANT SELECT ON api_metrics TO authenticated;
GRANT SELECT ON system_health TO authenticated;
GRANT SELECT ON feature_flags TO authenticated;
GRANT SELECT ON daily_active_users TO authenticated;
GRANT SELECT ON api_performance_summary TO authenticated;

-- Insert default feature flags
INSERT INTO feature_flags (name, description, enabled, rollout_percentage) VALUES
  ('ai_chat_enabled', 'Enable AI chat functionality', true, 100),
  ('template_marketplace', 'Enable template marketplace', true, 100),
  ('collaboration_features', 'Enable real-time collaboration', true, 100),
  ('advanced_analytics', 'Enable advanced analytics dashboard', true, 100),
  ('beta_features', 'Enable beta features for testing', true, 50)
ON CONFLICT (name) DO NOTHING;

-- Create function to refresh materialized views
CREATE OR REPLACE FUNCTION refresh_analytics_views()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY daily_active_users;
  REFRESH MATERIALIZED VIEW CONCURRENTLY api_performance_summary;
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to refresh materialized views (runs every hour)
-- Note: This requires pg_cron extension to be enabled in Supabase
-- SELECT cron.schedule('refresh-analytics-views', '0 * * * *', 'SELECT refresh_analytics_views();');

-- Verify the setup
DO $$
BEGIN
    RAISE NOTICE 'Analytics tables created successfully!';
    RAISE NOTICE 'Tables created: activity_logs, usage_records, api_metrics, system_health, feature_flags';
    RAISE NOTICE 'Materialized views created: daily_active_users, api_performance_summary';
    RAISE NOTICE 'Indexes and RLS policies have been applied';
END $$;