-- Migration: 006_projects
-- Description: Core project management tables
-- Author: AI Guided SaaS Team
-- Date: 2025-07-26

-- Projects table (core entity)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    type TEXT DEFAULT 'web' CHECK (type IN ('web', 'mobile', 'desktop', 'api', 'other')),
    framework TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived', 'deleted')),
    visibility TEXT DEFAULT 'private' CHECK (visibility IN ('private', 'public', 'team')),
    settings JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    thumbnail_url TEXT,
    repository_url TEXT,
    live_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, slug)
);

-- Project files
CREATE TABLE IF NOT EXISTS public.project_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    content TEXT,
    content_type TEXT DEFAULT 'text/plain',
    size_bytes INTEGER,
    encoding TEXT DEFAULT 'utf-8',
    checksum TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, file_path)
);

-- Project versions
CREATE TABLE IF NOT EXISTS public.project_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    name TEXT,
    description TEXT,
    snapshot JSONB NOT NULL, -- Complete project state
    created_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, version_number)
);

-- Project builds
CREATE TABLE IF NOT EXISTS public.project_builds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    version_id UUID REFERENCES public.project_versions(id) ON DELETE SET NULL,
    build_number INTEGER NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'building', 'success', 'failed', 'cancelled')),
    build_type TEXT DEFAULT 'development' CHECK (build_type IN ('development', 'preview', 'production')),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    duration_seconds INTEGER,
    output_url TEXT,
    logs TEXT,
    error_message TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, build_number)
);

-- Project deployments
CREATE TABLE IF NOT EXISTS public.project_deployments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    build_id UUID NOT NULL REFERENCES public.project_builds(id) ON DELETE CASCADE,
    environment TEXT DEFAULT 'preview' CHECK (environment IN ('preview', 'staging', 'production')),
    deployment_url TEXT NOT NULL,
    status TEXT DEFAULT 'deploying' CHECK (status IN ('deploying', 'active', 'failed', 'inactive')),
    provider TEXT DEFAULT 'vercel' CHECK (provider IN ('vercel', 'netlify', 'aws', 'custom')),
    provider_deployment_id TEXT,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ready_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project dependencies
CREATE TABLE IF NOT EXISTS public.project_dependencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    package_manager TEXT DEFAULT 'npm' CHECK (package_manager IN ('npm', 'yarn', 'pnpm', 'bun')),
    name TEXT NOT NULL,
    version TEXT NOT NULL,
    type TEXT DEFAULT 'production' CHECK (type IN ('production', 'development', 'peer', 'optional')),
    resolved_version TEXT,
    integrity TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, name)
);

-- Project environment variables
CREATE TABLE IF NOT EXISTS public.project_env_vars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    key TEXT NOT NULL,
    value TEXT NOT NULL, -- Should be encrypted in production
    environment TEXT[] DEFAULT '{"development"}',
    is_secret BOOLEAN DEFAULT TRUE,
    created_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, key)
);

-- Project team members
CREATE TABLE IF NOT EXISTS public.project_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'viewer' CHECK (role IN ('owner', 'admin', 'developer', 'viewer')),
    permissions JSONB DEFAULT '{}',
    invited_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);

-- Project activity log
CREATE TABLE IF NOT EXISTS public.project_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id UUID,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_projects_user ON public.projects(user_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_created ON public.projects(created_at);

CREATE INDEX idx_project_files_project ON public.project_files(project_id);
CREATE INDEX idx_project_files_path ON public.project_files(file_path);

CREATE INDEX idx_project_versions_project ON public.project_versions(project_id);
CREATE INDEX idx_project_builds_project ON public.project_builds(project_id);
CREATE INDEX idx_project_builds_status ON public.project_builds(status);

CREATE INDEX idx_project_deployments_project ON public.project_deployments(project_id);
CREATE INDEX idx_project_deployments_environment ON public.project_deployments(environment);
CREATE INDEX idx_project_deployments_status ON public.project_deployments(status);

CREATE INDEX idx_project_members_project ON public.project_members(project_id);
CREATE INDEX idx_project_members_user ON public.project_members(user_id);

CREATE INDEX idx_project_activity_project ON public.project_activity(project_id);
CREATE INDEX idx_project_activity_user ON public.project_activity(user_id);
CREATE INDEX idx_project_activity_created ON public.project_activity(created_at);

-- Functions
-- Auto-increment build number
CREATE OR REPLACE FUNCTION increment_build_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.build_number := COALESCE(
        (SELECT MAX(build_number) + 1 FROM public.project_builds WHERE project_id = NEW.project_id),
        1
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_build_number
BEFORE INSERT ON public.project_builds
FOR EACH ROW
WHEN (NEW.build_number IS NULL)
EXECUTE FUNCTION increment_build_number();

-- Auto-increment version number
CREATE OR REPLACE FUNCTION increment_version_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.version_number := COALESCE(
        (SELECT MAX(version_number) + 1 FROM public.project_versions WHERE project_id = NEW.project_id),
        1
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_version_number
BEFORE INSERT ON public.project_versions
FOR EACH ROW
WHEN (NEW.version_number IS NULL)
EXECUTE FUNCTION increment_version_number();

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_builds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_env_vars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_activity ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Projects are viewable by members
CREATE POLICY "Members can view project" ON public.projects
    FOR SELECT USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.project_members
            WHERE project_id = projects.id AND user_id = auth.uid()
        ) OR
        (visibility = 'public')
    );

-- Owners can do everything
CREATE POLICY "Owners have full access" ON public.projects
    FOR ALL USING (user_id = auth.uid());

-- Project files follow project access
CREATE POLICY "Project file access" ON public.project_files
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = project_files.project_id
            AND (p.user_id = auth.uid() OR EXISTS (
                SELECT 1 FROM public.project_members pm
                WHERE pm.project_id = p.id AND pm.user_id = auth.uid()
            ))
        )
    );

-- Triggers
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_files_updated_at BEFORE UPDATE ON public.project_files
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_dependencies_updated_at BEFORE UPDATE ON public.project_dependencies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_env_vars_updated_at BEFORE UPDATE ON public.project_env_vars
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Rollback:
-- DROP TABLE public.project_activity CASCADE;
-- DROP TABLE public.project_members CASCADE;
-- DROP TABLE public.project_env_vars CASCADE;
-- DROP TABLE public.project_dependencies CASCADE;
-- DROP TABLE public.project_deployments CASCADE;
-- DROP TABLE public.project_builds CASCADE;
-- DROP TABLE public.project_versions CASCADE;
-- DROP TABLE public.project_files CASCADE;
-- DROP TABLE public.projects CASCADE;
-- DROP FUNCTION increment_build_number();
-- DROP FUNCTION increment_version_number();