-- Migration: 008_monitoring
-- Description: System monitoring, health checks, and performance tracking
-- Author: AI Guided SaaS Team
-- Date: 2025-07-26

-- System health checks
CREATE TABLE IF NOT EXISTS public.health_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_name TEXT NOT NULL,
    check_type TEXT NOT NULL CHECK (check_type IN ('api', 'database', 'cache', 'storage', 'external', 'custom')),
    status TEXT DEFAULT 'unknown' CHECK (status IN ('healthy', 'degraded', 'unhealthy', 'unknown')),
    response_time_ms INTEGER,
    status_code INTEGER,
    error_message TEXT,
    details JSONB DEFAULT '{}',
    checked_at TIMESTAMPTZ DEFAULT NOW()
);

-- System metrics
CREATE TABLE IF NOT EXISTS public.system_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_category TEXT NOT NULL CHECK (metric_category IN ('performance', 'resource', 'business', 'custom')),
    metric_name TEXT NOT NULL,
    metric_value NUMERIC NOT NULL,
    metric_unit TEXT,
    dimensions JSONB DEFAULT '{}',
    aggregation_type TEXT DEFAULT 'gauge' CHECK (aggregation_type IN ('gauge', 'counter', 'histogram', 'summary')),
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance traces
CREATE TABLE IF NOT EXISTS public.performance_traces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trace_id TEXT NOT NULL,
    span_id TEXT NOT NULL,
    parent_span_id TEXT,
    operation_name TEXT NOT NULL,
    service_name TEXT NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    duration_ms INTEGER,
    status TEXT DEFAULT 'ok' CHECK (status IN ('ok', 'error', 'cancelled')),
    attributes JSONB DEFAULT '{}',
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Error tracking
CREATE TABLE IF NOT EXISTS public.error_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    error_id TEXT NOT NULL, -- For grouping similar errors
    error_type TEXT NOT NULL,
    error_message TEXT NOT NULL,
    stack_trace TEXT,
    service_name TEXT,
    environment TEXT DEFAULT 'production',
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    session_id TEXT,
    request_id TEXT,
    url TEXT,
    method TEXT,
    ip_address INET,
    user_agent TEXT,
    context JSONB DEFAULT '{}',
    occurrence_count INTEGER DEFAULT 1,
    first_seen_at TIMESTAMPTZ DEFAULT NOW(),
    last_seen_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alert definitions
CREATE TABLE IF NOT EXISTS public.alert_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    rule_type TEXT NOT NULL CHECK (rule_type IN ('threshold', 'anomaly', 'absence', 'composite')),
    metric_name TEXT,
    condition JSONB NOT NULL, -- e.g., {"operator": ">", "value": 90, "duration": "5m"}
    severity TEXT DEFAULT 'warning' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
    notification_channels TEXT[] DEFAULT '{}', -- email, slack, webhook, etc.
    cooldown_minutes INTEGER DEFAULT 5,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alert instances
CREATE TABLE IF NOT EXISTS public.alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rule_id UUID NOT NULL REFERENCES public.alert_rules(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved', 'expired')),
    triggered_value NUMERIC,
    threshold_value NUMERIC,
    message TEXT,
    context JSONB DEFAULT '{}',
    triggered_at TIMESTAMPTZ DEFAULT NOW(),
    acknowledged_at TIMESTAMPTZ,
    acknowledged_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    resolved_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    resolution_note TEXT
);

-- Uptime monitoring
CREATE TABLE IF NOT EXISTS public.uptime_monitors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    check_type TEXT DEFAULT 'http' CHECK (check_type IN ('http', 'https', 'tcp', 'ping')),
    method TEXT DEFAULT 'GET',
    headers JSONB DEFAULT '{}',
    expected_status_code INTEGER DEFAULT 200,
    expected_response_time_ms INTEGER DEFAULT 3000,
    check_interval_seconds INTEGER DEFAULT 60,
    timeout_seconds INTEGER DEFAULT 30,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Uptime check results
CREATE TABLE IF NOT EXISTS public.uptime_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    monitor_id UUID NOT NULL REFERENCES public.uptime_monitors(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('up', 'down', 'timeout', 'error')),
    status_code INTEGER,
    response_time_ms INTEGER,
    error_message TEXT,
    checked_from TEXT, -- Location/server that performed the check
    ssl_valid BOOLEAN,
    ssl_expiry_date DATE,
    checked_at TIMESTAMPTZ DEFAULT NOW()
);

-- Resource usage tracking
CREATE TABLE IF NOT EXISTS public.resource_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resource_type TEXT NOT NULL CHECK (resource_type IN ('api_calls', 'storage', 'bandwidth', 'compute', 'database')),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    usage_amount NUMERIC NOT NULL,
    usage_unit TEXT NOT NULL,
    cost_amount NUMERIC DEFAULT 0,
    period_start TIMESTAMPTZ NOT NULL,
    period_end TIMESTAMPTZ NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit trail
CREATE TABLE IF NOT EXISTS public.audit_trail (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    session_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_health_checks_service ON public.health_checks(service_name);
CREATE INDEX idx_health_checks_status ON public.health_checks(status);
CREATE INDEX idx_health_checks_checked ON public.health_checks(checked_at);

CREATE INDEX idx_system_metrics_category ON public.system_metrics(metric_category);
CREATE INDEX idx_system_metrics_name ON public.system_metrics(metric_name);
CREATE INDEX idx_system_metrics_recorded ON public.system_metrics(recorded_at);

CREATE INDEX idx_performance_traces_trace ON public.performance_traces(trace_id);
CREATE INDEX idx_performance_traces_operation ON public.performance_traces(operation_name);
CREATE INDEX idx_performance_traces_start ON public.performance_traces(start_time);

CREATE INDEX idx_error_logs_error_id ON public.error_logs(error_id);
CREATE INDEX idx_error_logs_type ON public.error_logs(error_type);
CREATE INDEX idx_error_logs_user ON public.error_logs(user_id);
CREATE INDEX idx_error_logs_created ON public.error_logs(created_at);

CREATE INDEX idx_alerts_rule ON public.alerts(rule_id);
CREATE INDEX idx_alerts_status ON public.alerts(status);
CREATE INDEX idx_alerts_triggered ON public.alerts(triggered_at);

CREATE INDEX idx_uptime_checks_monitor ON public.uptime_checks(monitor_id);
CREATE INDEX idx_uptime_checks_status ON public.uptime_checks(status);
CREATE INDEX idx_uptime_checks_checked ON public.uptime_checks(checked_at);

CREATE INDEX idx_resource_usage_type ON public.resource_usage(resource_type);
CREATE INDEX idx_resource_usage_user ON public.resource_usage(user_id);
CREATE INDEX idx_resource_usage_project ON public.resource_usage(project_id);
CREATE INDEX idx_resource_usage_period ON public.resource_usage(period_start, period_end);

CREATE INDEX idx_audit_trail_user ON public.audit_trail(user_id);
CREATE INDEX idx_audit_trail_resource ON public.audit_trail(resource_type, resource_id);
CREATE INDEX idx_audit_trail_created ON public.audit_trail(created_at);

-- Functions
-- Calculate uptime percentage
CREATE OR REPLACE FUNCTION calculate_uptime_percentage(p_monitor_id UUID, p_hours INTEGER DEFAULT 24)
RETURNS NUMERIC AS $$
DECLARE
    v_total_checks INTEGER;
    v_up_checks INTEGER;
BEGIN
    SELECT 
        COUNT(*),
        COUNT(CASE WHEN status = 'up' THEN 1 END)
    INTO v_total_checks, v_up_checks
    FROM public.uptime_checks
    WHERE monitor_id = p_monitor_id
    AND checked_at > NOW() - (p_hours || ' hours')::INTERVAL;
    
    IF v_total_checks = 0 THEN
        RETURN 100; -- No checks yet, assume 100%
    END IF;
    
    RETURN ROUND((v_up_checks::NUMERIC / v_total_checks::NUMERIC) * 100, 2);
END;
$$ LANGUAGE plpgsql;

-- Aggregate metrics
CREATE OR REPLACE FUNCTION aggregate_metrics(
    p_metric_name TEXT,
    p_aggregation TEXT DEFAULT 'avg',
    p_interval TEXT DEFAULT '1 hour'
)
RETURNS TABLE (
    time_bucket TIMESTAMPTZ,
    aggregated_value NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        date_trunc('hour', recorded_at) as time_bucket,
        CASE p_aggregation
            WHEN 'avg' THEN AVG(metric_value)
            WHEN 'sum' THEN SUM(metric_value)
            WHEN 'min' THEN MIN(metric_value)
            WHEN 'max' THEN MAX(metric_value)
            WHEN 'count' THEN COUNT(*)::NUMERIC
            ELSE AVG(metric_value)
        END as aggregated_value
    FROM public.system_metrics
    WHERE metric_name = p_metric_name
    AND recorded_at > NOW() - p_interval::INTERVAL
    GROUP BY date_trunc('hour', recorded_at)
    ORDER BY time_bucket DESC;
END;
$$ LANGUAGE plpgsql;

-- Cleanup old monitoring data
CREATE OR REPLACE FUNCTION cleanup_monitoring_data()
RETURNS void AS $$
BEGIN
    -- Keep health checks for 7 days
    DELETE FROM public.health_checks 
    WHERE checked_at < NOW() - INTERVAL '7 days';
    
    -- Keep metrics for 30 days
    DELETE FROM public.system_metrics 
    WHERE recorded_at < NOW() - INTERVAL '30 days';
    
    -- Keep traces for 7 days
    DELETE FROM public.performance_traces 
    WHERE created_at < NOW() - INTERVAL '7 days';
    
    -- Keep error logs for 90 days
    DELETE FROM public.error_logs 
    WHERE created_at < NOW() - INTERVAL '90 days'
    AND resolved_at IS NOT NULL;
    
    -- Keep uptime checks for 30 days
    DELETE FROM public.uptime_checks 
    WHERE checked_at < NOW() - INTERVAL '30 days';
    
    -- Keep resolved alerts for 30 days
    DELETE FROM public.alerts 
    WHERE resolved_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Enable RLS
ALTER TABLE public.health_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_traces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uptime_monitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uptime_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_trail ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Admins can view all monitoring data
CREATE POLICY "Admins can view monitoring data" ON public.health_checks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Users can view their own resource usage
CREATE POLICY "Users can view own resource usage" ON public.resource_usage
    FOR SELECT USING (user_id = auth.uid());

-- Users can view their own audit trail
CREATE POLICY "Users can view own audit trail" ON public.audit_trail
    FOR SELECT USING (user_id = auth.uid());

-- Triggers
CREATE TRIGGER update_alert_rules_updated_at BEFORE UPDATE ON public.alert_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Scheduled job to cleanup old data
-- This would be run as a cron job or scheduled function
-- SELECT cleanup_monitoring_data();

-- Rollback:
-- DROP TABLE public.audit_trail CASCADE;
-- DROP TABLE public.resource_usage CASCADE;
-- DROP TABLE public.uptime_checks CASCADE;
-- DROP TABLE public.uptime_monitors CASCADE;
-- DROP TABLE public.alerts CASCADE;
-- DROP TABLE public.alert_rules CASCADE;
-- DROP TABLE public.error_logs CASCADE;
-- DROP TABLE public.performance_traces CASCADE;
-- DROP TABLE public.system_metrics CASCADE;
-- DROP TABLE public.health_checks CASCADE;
-- DROP FUNCTION calculate_uptime_percentage(UUID, INTEGER);
-- DROP FUNCTION aggregate_metrics(TEXT, TEXT, TEXT);
-- DROP FUNCTION cleanup_monitoring_data();