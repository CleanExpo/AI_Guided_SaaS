-- Migration: 001_initial_setup
-- Description: Initial database setup with extensions and basic tables
-- Author: AI Guided SaaS Team
-- Date: 2025-07-26

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Create custom types
CREATE TYPE user_role AS ENUM ('user', 'admin', 'superadmin');
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'past_due', 'trialing', 'inactive');
CREATE TYPE subscription_tier AS ENUM ('free', 'starter', 'pro', 'enterprise');

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User profiles
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    bio TEXT,
    company TEXT,
    website TEXT,
    location TEXT,
    timezone TEXT DEFAULT 'UTC',
    language TEXT DEFAULT 'en',
    theme TEXT DEFAULT 'light',
    notifications_email BOOLEAN DEFAULT TRUE,
    notifications_push BOOLEAN DEFAULT TRUE,
    public_profile BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    status subscription_status DEFAULT 'trialing',
    tier subscription_tier DEFAULT 'free',
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    stripe_price_id TEXT,
    trial_ends_at TIMESTAMPTZ,
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Feature flags
CREATE TABLE IF NOT EXISTS public.feature_flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flag_key TEXT UNIQUE NOT NULL,
    description TEXT,
    is_enabled BOOLEAN DEFAULT FALSE,
    rollout_percentage INTEGER DEFAULT 0 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
    user_whitelist UUID[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- System settings
CREATE TABLE IF NOT EXISTS public.system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_created ON public.users(created_at);

CREATE INDEX idx_user_profiles_user ON public.user_profiles(user_id);

CREATE INDEX idx_subscriptions_user ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX idx_subscriptions_tier ON public.subscriptions(tier);
CREATE INDEX idx_subscriptions_stripe_customer ON public.subscriptions(stripe_customer_id);

CREATE INDEX idx_feature_flags_key ON public.feature_flags(flag_key);
CREATE INDEX idx_system_settings_key ON public.system_settings(key);

-- Functions
-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Check feature flag for user
CREATE OR REPLACE FUNCTION is_feature_enabled(p_flag_key TEXT, p_user_id UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
    v_flag RECORD;
    v_random_value INTEGER;
BEGIN
    -- Get the feature flag
    SELECT * INTO v_flag 
    FROM public.feature_flags 
    WHERE flag_key = p_flag_key;
    
    -- If flag doesn't exist, return false
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- If flag is disabled, return false
    IF NOT v_flag.is_enabled THEN
        RETURN FALSE;
    END IF;
    
    -- Check if user is in whitelist
    IF p_user_id IS NOT NULL AND p_user_id = ANY(v_flag.user_whitelist) THEN
        RETURN TRUE;
    END IF;
    
    -- Check rollout percentage
    IF v_flag.rollout_percentage = 100 THEN
        RETURN TRUE;
    ELSIF v_flag.rollout_percentage = 0 THEN
        RETURN FALSE;
    ELSE
        -- Use a deterministic hash of user_id and flag_key for consistent rollout
        IF p_user_id IS NOT NULL THEN
            v_random_value := abs(hashtext(p_user_id::TEXT || p_flag_key)) % 100;
            RETURN v_random_value < v_flag.rollout_percentage;
        ELSE
            -- For anonymous users, always follow the rollout percentage
            RETURN FALSE;
        END IF;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Get user's subscription tier
CREATE OR REPLACE FUNCTION get_user_tier(p_user_id UUID)
RETURNS subscription_tier AS $$
DECLARE
    v_tier subscription_tier;
BEGIN
    SELECT tier INTO v_tier
    FROM public.subscriptions
    WHERE user_id = p_user_id
    AND status IN ('active', 'trialing');
    
    RETURN COALESCE(v_tier, 'free');
END;
$$ LANGUAGE plpgsql;

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own data
CREATE POLICY "Users can view own data" ON public.users
    FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update own data" ON public.users
    FOR UPDATE USING (id = auth.uid());

-- User profiles
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Public profiles are viewable" ON public.user_profiles
    FOR SELECT USING (public_profile = TRUE);

-- Subscriptions
CREATE POLICY "Users can view own subscription" ON public.subscriptions
    FOR SELECT USING (user_id = auth.uid());

-- Feature flags (public read for enabled flags)
CREATE POLICY "Public can view enabled flags" ON public.feature_flags
    FOR SELECT USING (is_enabled = TRUE);

-- System settings (public read for public settings)
CREATE POLICY "Public can view public settings" ON public.system_settings
    FOR SELECT USING (is_public = TRUE);

-- Triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feature_flags_updated_at BEFORE UPDATE ON public.feature_flags
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON public.system_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default data
-- Default feature flags
INSERT INTO public.feature_flags (flag_key, description, is_enabled, rollout_percentage)
VALUES 
    ('new_ui', 'New UI design', FALSE, 0),
    ('ai_chat', 'AI Chat feature', TRUE, 100),
    ('collaboration', 'Real-time collaboration', TRUE, 50),
    ('marketplace', 'Template marketplace', TRUE, 100)
ON CONFLICT (flag_key) DO NOTHING;

-- Default system settings
INSERT INTO public.system_settings (key, value, description, is_public)
VALUES 
    ('app_name', '"AI Guided SaaS"', 'Application name', TRUE),
    ('app_version', '"1.0.0"', 'Application version', TRUE),
    ('maintenance_mode', 'false', 'Maintenance mode flag', TRUE),
    ('max_projects_free', '3', 'Max projects for free tier', FALSE),
    ('max_projects_starter', '10', 'Max projects for starter tier', FALSE),
    ('max_projects_pro', '50', 'Max projects for pro tier', FALSE),
    ('max_projects_enterprise', '999', 'Max projects for enterprise tier', FALSE)
ON CONFLICT (key) DO NOTHING;

-- Rollback:
-- DROP TABLE public.system_settings CASCADE;
-- DROP TABLE public.feature_flags CASCADE;
-- DROP TABLE public.subscriptions CASCADE;
-- DROP TABLE public.user_profiles CASCADE;
-- DROP TABLE public.users CASCADE;
-- DROP TYPE subscription_tier;
-- DROP TYPE subscription_status;
-- DROP TYPE user_role;
-- DROP FUNCTION update_updated_at_column();
-- DROP FUNCTION is_feature_enabled(TEXT, UUID);
-- DROP FUNCTION get_user_tier(UUID);
-- DROP EXTENSION "pg_stat_statements";
-- DROP EXTENSION "pgcrypto";
-- DROP EXTENSION "uuid-ossp";