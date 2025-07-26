-- Migration: 002_auth_extensions
-- Description: Extends authentication with sessions, API keys, and audit logging
-- Author: AI Guided SaaS Team
-- Date: 2025-07-26

-- User sessions table (extends auth.sessions)
CREATE TABLE IF NOT EXISTS public.user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    session_token TEXT UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- API keys table
CREATE TABLE IF NOT EXISTS public.api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    key_hash TEXT UNIQUE NOT NULL, -- Store hashed version only
    key_prefix TEXT NOT NULL, -- First 8 chars for identification
    scopes TEXT[] DEFAULT '{}',
    rate_limit INTEGER DEFAULT 1000, -- Requests per hour
    last_used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit log table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id UUID,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Password reset tokens
CREATE TABLE IF NOT EXISTS public.password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    token_hash TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Two-factor authentication
CREATE TABLE IF NOT EXISTS public.two_factor_auth (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    secret TEXT NOT NULL, -- Encrypted
    backup_codes TEXT[] DEFAULT '{}', -- Encrypted
    enabled BOOLEAN DEFAULT FALSE,
    enabled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX idx_user_sessions_expires_at ON public.user_sessions(expires_at);
CREATE INDEX idx_api_keys_user_id ON public.api_keys(user_id);
CREATE INDEX idx_api_keys_prefix ON public.api_keys(key_prefix);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);
CREATE INDEX idx_audit_logs_resource ON public.audit_logs(resource_type, resource_id);

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM public.user_sessions WHERE expires_at < NOW();
    DELETE FROM public.password_reset_tokens WHERE expires_at < NOW() AND used_at IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to log API key usage
CREATE OR REPLACE FUNCTION log_api_key_usage(key_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.api_keys 
    SET last_used_at = NOW() 
    WHERE id = key_id;
END;
$$ LANGUAGE plpgsql;

-- Enable RLS
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_reset_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.two_factor_auth ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- User sessions
CREATE POLICY "Users can view their own sessions" ON public.user_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions" ON public.user_sessions
    FOR DELETE USING (auth.uid() = user_id);

-- API keys
CREATE POLICY "Users can manage their own API keys" ON public.api_keys
    FOR ALL USING (auth.uid() = user_id);

-- Audit logs
CREATE POLICY "Users can view their own audit logs" ON public.audit_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all audit logs" ON public.audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'master')
        )
    );

-- Password reset tokens (no read policy for security)
CREATE POLICY "System can manage password reset tokens" ON public.password_reset_tokens
    FOR ALL USING (false); -- Only backend can access

-- Two-factor auth
CREATE POLICY "Users can manage their own 2FA" ON public.two_factor_auth
    FOR ALL USING (auth.uid() = user_id);

-- Triggers
CREATE TRIGGER update_api_keys_updated_at BEFORE UPDATE ON public.api_keys
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_two_factor_auth_updated_at BEFORE UPDATE ON public.two_factor_auth
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Rollback:
-- DROP TABLE public.two_factor_auth CASCADE;
-- DROP TABLE public.password_reset_tokens CASCADE;
-- DROP TABLE public.audit_logs CASCADE;
-- DROP TABLE public.api_keys CASCADE;
-- DROP TABLE public.user_sessions CASCADE;
-- DROP FUNCTION cleanup_expired_sessions();
-- DROP FUNCTION log_api_key_usage(UUID);