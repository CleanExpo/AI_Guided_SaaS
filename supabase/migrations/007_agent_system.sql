-- Migration: 007_agent_system
-- Description: Agent orchestration and monitoring tables
-- Author: AI Guided SaaS Team
-- Date: 2025-07-26

-- Agent definitions
CREATE TABLE IF NOT EXISTS public.agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL CHECK (type IN ('core', 'specialist', 'orchestration', 'utility')),
    description TEXT,
    version TEXT DEFAULT '1.0.0',
    capabilities TEXT[] DEFAULT '{}',
    config JSONB DEFAULT '{}',
    container_image TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent instances (running agents)
CREATE TABLE IF NOT EXISTS public.agent_instances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
    container_id TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'starting', 'running', 'paused', 'stopping', 'stopped', 'failed')),
    health_status TEXT DEFAULT 'unknown' CHECK (health_status IN ('healthy', 'unhealthy', 'unknown')),
    host_name TEXT,
    ip_address INET,
    port INTEGER,
    started_at TIMESTAMPTZ,
    stopped_at TIMESTAMPTZ,
    last_heartbeat TIMESTAMPTZ,
    error_message TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent tasks
CREATE TABLE IF NOT EXISTS public.agent_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    instance_id UUID NOT NULL REFERENCES public.agent_instances(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    task_type TEXT NOT NULL,
    priority INTEGER DEFAULT 5 CHECK (priority >= 1 AND priority <= 10),
    status TEXT DEFAULT 'queued' CHECK (status IN ('queued', 'assigned', 'running', 'completed', 'failed', 'cancelled')),
    input_data JSONB DEFAULT '{}',
    output_data JSONB,
    error_data JSONB,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    timeout_seconds INTEGER DEFAULT 300,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent metrics
CREATE TABLE IF NOT EXISTS public.agent_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    instance_id UUID NOT NULL REFERENCES public.agent_instances(id) ON DELETE CASCADE,
    metric_type TEXT NOT NULL CHECK (metric_type IN ('cpu', 'memory', 'disk', 'network', 'custom')),
    metric_name TEXT NOT NULL,
    metric_value NUMERIC NOT NULL,
    metric_unit TEXT,
    tags JSONB DEFAULT '{}',
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent logs
CREATE TABLE IF NOT EXISTS public.agent_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    instance_id UUID NOT NULL REFERENCES public.agent_instances(id) ON DELETE CASCADE,
    task_id UUID REFERENCES public.agent_tasks(id) ON DELETE CASCADE,
    log_level TEXT DEFAULT 'info' CHECK (log_level IN ('debug', 'info', 'warn', 'error', 'fatal')),
    message TEXT NOT NULL,
    context JSONB DEFAULT '{}',
    stack_trace TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent communication
CREATE TABLE IF NOT EXISTS public.agent_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES public.agent_instances(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES public.agent_instances(id) ON DELETE CASCADE,
    message_type TEXT NOT NULL CHECK (message_type IN ('request', 'response', 'event', 'broadcast')),
    protocol TEXT DEFAULT 'internal' CHECK (protocol IN ('internal', 'http', 'grpc', 'websocket')),
    payload JSONB NOT NULL,
    correlation_id UUID,
    is_processed BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent resource limits
CREATE TABLE IF NOT EXISTS public.agent_resource_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
    cpu_limit NUMERIC DEFAULT 0.5, -- CPU cores
    memory_limit_mb INTEGER DEFAULT 512,
    disk_limit_mb INTEGER DEFAULT 1024,
    network_bandwidth_mbps INTEGER DEFAULT 100,
    max_concurrent_tasks INTEGER DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(agent_id)
);

-- Agent scheduling rules
CREATE TABLE IF NOT EXISTS public.agent_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
    schedule_type TEXT DEFAULT 'cron' CHECK (schedule_type IN ('cron', 'interval', 'manual')),
    cron_expression TEXT,
    interval_seconds INTEGER,
    max_instances INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    last_run_at TIMESTAMPTZ,
    next_run_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent dependencies
CREATE TABLE IF NOT EXISTS public.agent_dependencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
    depends_on_agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
    dependency_type TEXT DEFAULT 'required' CHECK (dependency_type IN ('required', 'optional')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(agent_id, depends_on_agent_id)
);

-- Create indexes
CREATE INDEX idx_agent_instances_agent ON public.agent_instances(agent_id);
CREATE INDEX idx_agent_instances_status ON public.agent_instances(status);
CREATE INDEX idx_agent_instances_health ON public.agent_instances(health_status);

CREATE INDEX idx_agent_tasks_instance ON public.agent_tasks(instance_id);
CREATE INDEX idx_agent_tasks_project ON public.agent_tasks(project_id);
CREATE INDEX idx_agent_tasks_user ON public.agent_tasks(user_id);
CREATE INDEX idx_agent_tasks_status ON public.agent_tasks(status);
CREATE INDEX idx_agent_tasks_created ON public.agent_tasks(created_at);

CREATE INDEX idx_agent_metrics_instance ON public.agent_metrics(instance_id);
CREATE INDEX idx_agent_metrics_type ON public.agent_metrics(metric_type);
CREATE INDEX idx_agent_metrics_recorded ON public.agent_metrics(recorded_at);

CREATE INDEX idx_agent_logs_instance ON public.agent_logs(instance_id);
CREATE INDEX idx_agent_logs_task ON public.agent_logs(task_id);
CREATE INDEX idx_agent_logs_level ON public.agent_logs(log_level);
CREATE INDEX idx_agent_logs_created ON public.agent_logs(created_at);

CREATE INDEX idx_agent_messages_sender ON public.agent_messages(sender_id);
CREATE INDEX idx_agent_messages_receiver ON public.agent_messages(receiver_id);
CREATE INDEX idx_agent_messages_type ON public.agent_messages(message_type);
CREATE INDEX idx_agent_messages_correlation ON public.agent_messages(correlation_id);

-- Functions
-- Calculate agent health score
CREATE OR REPLACE FUNCTION calculate_agent_health_score(p_instance_id UUID)
RETURNS INTEGER AS $$
DECLARE
    v_cpu_usage NUMERIC;
    v_memory_usage NUMERIC;
    v_error_rate NUMERIC;
    v_task_success_rate NUMERIC;
    v_health_score INTEGER;
BEGIN
    -- Get latest CPU usage
    SELECT metric_value INTO v_cpu_usage
    FROM public.agent_metrics
    WHERE instance_id = p_instance_id 
    AND metric_type = 'cpu'
    ORDER BY recorded_at DESC
    LIMIT 1;
    
    -- Get latest memory usage
    SELECT metric_value INTO v_memory_usage
    FROM public.agent_metrics
    WHERE instance_id = p_instance_id 
    AND metric_type = 'memory'
    ORDER BY recorded_at DESC
    LIMIT 1;
    
    -- Calculate error rate (last hour)
    SELECT 
        COUNT(CASE WHEN log_level IN ('error', 'fatal') THEN 1 END)::NUMERIC / 
        NULLIF(COUNT(*)::NUMERIC, 0) * 100
    INTO v_error_rate
    FROM public.agent_logs
    WHERE instance_id = p_instance_id
    AND created_at > NOW() - INTERVAL '1 hour';
    
    -- Calculate task success rate (last hour)
    SELECT 
        COUNT(CASE WHEN status = 'completed' THEN 1 END)::NUMERIC / 
        NULLIF(COUNT(CASE WHEN status IN ('completed', 'failed') THEN 1 END)::NUMERIC, 0) * 100
    INTO v_task_success_rate
    FROM public.agent_tasks
    WHERE instance_id = p_instance_id
    AND completed_at > NOW() - INTERVAL '1 hour';
    
    -- Calculate health score (0-100)
    v_health_score := 100;
    
    -- Deduct for high CPU usage
    IF v_cpu_usage > 80 THEN
        v_health_score := v_health_score - 20;
    ELSIF v_cpu_usage > 60 THEN
        v_health_score := v_health_score - 10;
    END IF;
    
    -- Deduct for high memory usage
    IF v_memory_usage > 80 THEN
        v_health_score := v_health_score - 20;
    ELSIF v_memory_usage > 60 THEN
        v_health_score := v_health_score - 10;
    END IF;
    
    -- Deduct for error rate
    IF v_error_rate > 10 THEN
        v_health_score := v_health_score - 30;
    ELSIF v_error_rate > 5 THEN
        v_health_score := v_health_score - 15;
    END IF;
    
    -- Deduct for low task success rate
    IF v_task_success_rate < 80 THEN
        v_health_score := v_health_score - 20;
    ELSIF v_task_success_rate < 90 THEN
        v_health_score := v_health_score - 10;
    END IF;
    
    RETURN GREATEST(0, v_health_score);
END;
$$ LANGUAGE plpgsql;

-- Clean up old metrics
CREATE OR REPLACE FUNCTION cleanup_old_agent_metrics()
RETURNS void AS $$
BEGIN
    -- Keep only last 7 days of metrics
    DELETE FROM public.agent_metrics 
    WHERE recorded_at < NOW() - INTERVAL '7 days';
    
    -- Keep only last 30 days of logs
    DELETE FROM public.agent_logs 
    WHERE created_at < NOW() - INTERVAL '30 days';
    
    -- Clean up completed tasks older than 90 days
    DELETE FROM public.agent_tasks 
    WHERE status IN ('completed', 'failed', 'cancelled')
    AND completed_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Enable RLS
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_resource_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_dependencies ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Agents are readable by authenticated users
CREATE POLICY "Authenticated users can view agents" ON public.agents
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Users can view their own tasks
CREATE POLICY "Users can view own tasks" ON public.agent_tasks
    FOR SELECT USING (user_id = auth.uid());

-- Admin-only policies for other tables (implement based on your admin system)
CREATE POLICY "Admins can manage agent instances" ON public.agent_instances
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Triggers
CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON public.agents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agent_resource_limits_updated_at BEFORE UPDATE ON public.agent_resource_limits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Rollback:
-- DROP TABLE public.agent_dependencies CASCADE;
-- DROP TABLE public.agent_schedules CASCADE;
-- DROP TABLE public.agent_resource_limits CASCADE;
-- DROP TABLE public.agent_messages CASCADE;
-- DROP TABLE public.agent_logs CASCADE;
-- DROP TABLE public.agent_metrics CASCADE;
-- DROP TABLE public.agent_tasks CASCADE;
-- DROP TABLE public.agent_instances CASCADE;
-- DROP TABLE public.agents CASCADE;
-- DROP FUNCTION calculate_agent_health_score(UUID);
-- DROP FUNCTION cleanup_old_agent_metrics();