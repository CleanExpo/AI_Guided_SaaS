-- Migration: 003_analytics_tables
-- Description: Analytics and tracking tables for user behavior and system metrics
-- Author: AI Guided SaaS Team
-- Date: 2025-07-26

-- Page views tracking
CREATE TABLE IF NOT EXISTS public.analytics_page_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    session_id TEXT,
    page_path TEXT NOT NULL,
    page_title TEXT,
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    device_type TEXT,
    browser TEXT,
    os TEXT,
    country TEXT,
    duration_seconds INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Custom events tracking
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    session_id TEXT,
    event_name TEXT NOT NULL,
    event_category TEXT NOT NULL,
    event_label TEXT,
    event_value NUMERIC,
    properties JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Feature usage tracking
CREATE TABLE IF NOT EXISTS public.feature_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    feature_name TEXT NOT NULL,
    usage_count INTEGER DEFAULT 1,
    last_used_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, feature_name)
);

-- API usage tracking
CREATE TABLE IF NOT EXISTS public.api_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    api_key_id UUID REFERENCES public.api_keys(id) ON DELETE SET NULL,
    endpoint TEXT NOT NULL,
    method TEXT NOT NULL,
    status_code INTEGER,
    response_time_ms INTEGER,
    request_size_bytes INTEGER,
    response_size_bytes INTEGER,
    ip_address INET,
    user_agent TEXT,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversion tracking
CREATE TABLE IF NOT EXISTS public.conversions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    conversion_type TEXT NOT NULL, -- signup, subscription, project_created, etc.
    conversion_value NUMERIC,
    attribution_source TEXT,
    attribution_medium TEXT,
    attribution_campaign TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User cohorts
CREATE TABLE IF NOT EXISTS public.user_cohorts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    criteria JSONB NOT NULL, -- Dynamic criteria for cohort membership
    user_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cohort memberships
CREATE TABLE IF NOT EXISTS public.cohort_memberships (
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    cohort_id UUID NOT NULL REFERENCES public.user_cohorts(id) ON DELETE CASCADE,
    added_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, cohort_id)
);

-- A/B test experiments
CREATE TABLE IF NOT EXISTS public.experiments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    hypothesis TEXT,
    variants JSONB NOT NULL, -- Array of variant configurations
    traffic_allocation JSONB NOT NULL, -- Percentage per variant
    metrics JSONB NOT NULL, -- Metrics to track
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'running', 'paused', 'completed')),
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Experiment assignments
CREATE TABLE IF NOT EXISTS public.experiment_assignments (
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    experiment_id UUID NOT NULL REFERENCES public.experiments(id) ON DELETE CASCADE,
    variant TEXT NOT NULL,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, experiment_id)
);

-- Create indexes for performance
CREATE INDEX idx_analytics_page_views_user_id ON public.analytics_page_views(user_id);
CREATE INDEX idx_analytics_page_views_created_at ON public.analytics_page_views(created_at);
CREATE INDEX idx_analytics_page_views_page_path ON public.analytics_page_views(page_path);

CREATE INDEX idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX idx_analytics_events_name ON public.analytics_events(event_name);
CREATE INDEX idx_analytics_events_created_at ON public.analytics_events(created_at);

CREATE INDEX idx_feature_usage_feature ON public.feature_usage(feature_name);
CREATE INDEX idx_feature_usage_last_used ON public.feature_usage(last_used_at);

CREATE INDEX idx_api_usage_user_id ON public.api_usage(user_id);
CREATE INDEX idx_api_usage_endpoint ON public.api_usage(endpoint);
CREATE INDEX idx_api_usage_created_at ON public.api_usage(created_at);

CREATE INDEX idx_conversions_user_id ON public.conversions(user_id);
CREATE INDEX idx_conversions_type ON public.conversions(conversion_type);
CREATE INDEX idx_conversions_created_at ON public.conversions(created_at);

-- Materialized view for daily analytics
CREATE MATERIALIZED VIEW IF NOT EXISTS public.daily_analytics AS
SELECT 
    DATE(created_at) as date,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(*) as total_page_views,
    COUNT(DISTINCT session_id) as total_sessions,
    AVG(duration_seconds) as avg_session_duration
FROM public.analytics_page_views
GROUP BY DATE(created_at);

CREATE INDEX idx_daily_analytics_date ON public.daily_analytics(date);

-- Function to refresh materialized view
CREATE OR REPLACE FUNCTION refresh_daily_analytics()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.daily_analytics;
END;
$$ LANGUAGE plpgsql;

-- Function to increment feature usage
CREATE OR REPLACE FUNCTION increment_feature_usage(
    p_user_id UUID,
    p_feature_name TEXT,
    p_metadata JSONB DEFAULT '{}'
)
RETURNS void AS $$
BEGIN
    INSERT INTO public.feature_usage (user_id, feature_name, metadata)
    VALUES (p_user_id, p_feature_name, p_metadata)
    ON CONFLICT (user_id, feature_name)
    DO UPDATE SET 
        usage_count = feature_usage.usage_count + 1,
        last_used_at = NOW(),
        metadata = feature_usage.metadata || p_metadata;
END;
$$ LANGUAGE plpgsql;

-- Enable RLS
ALTER TABLE public.analytics_page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cohort_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiment_assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own analytics
CREATE POLICY "Users can view own page views" ON public.analytics_page_views
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own events" ON public.analytics_events
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own feature usage" ON public.feature_usage
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own API usage" ON public.api_usage
    FOR SELECT USING (auth.uid() = user_id);

-- Admins can view all analytics
CREATE POLICY "Admins can view all analytics" ON public.analytics_page_views
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'master')
        )
    );

-- Similar admin policies for other tables...

-- Triggers
CREATE TRIGGER update_user_cohorts_updated_at BEFORE UPDATE ON public.user_cohorts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_experiments_updated_at BEFORE UPDATE ON public.experiments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Rollback:
-- DROP MATERIALIZED VIEW public.daily_analytics CASCADE;
-- DROP TABLE public.experiment_assignments CASCADE;
-- DROP TABLE public.experiments CASCADE;
-- DROP TABLE public.cohort_memberships CASCADE;
-- DROP TABLE public.user_cohorts CASCADE;
-- DROP TABLE public.conversions CASCADE;
-- DROP TABLE public.api_usage CASCADE;
-- DROP TABLE public.feature_usage CASCADE;
-- DROP TABLE public.analytics_events CASCADE;
-- DROP TABLE public.analytics_page_views CASCADE;
-- DROP FUNCTION refresh_daily_analytics();
-- DROP FUNCTION increment_feature_usage(UUID, TEXT, JSONB);