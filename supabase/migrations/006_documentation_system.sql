-- Documentation sections table
CREATE TABLE IF NOT EXISTS public.documentation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}',
    related_sections TEXT[] DEFAULT '{}',
    interactive_elements JSONB[] DEFAULT '{}',
    code_examples JSONB[] DEFAULT '{}',
    category TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- User documentation progress
CREATE TABLE IF NOT EXISTS public.user_documentation_progress (
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    sections_completed TEXT[] DEFAULT '{}',
    interactive_elements_completed TEXT[] DEFAULT '{}',
    quiz_scores JSONB DEFAULT '{}',
    total_points INTEGER DEFAULT 0,
    current_path TEXT[] DEFAULT '{}',
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    PRIMARY KEY (user_id)
);

-- Tutorial progress table
CREATE TABLE IF NOT EXISTS public.tutorial_progress (
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    tutorial_id TEXT NOT NULL,
    current_step INTEGER DEFAULT 0,
    completed_steps TEXT[] DEFAULT '{}',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    completed_at TIMESTAMP WITH TIME ZONE,
    score INTEGER DEFAULT 0,
    hints_used INTEGER DEFAULT 0,
    attempts JSONB DEFAULT '{}',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    PRIMARY KEY (user_id, tutorial_id)
);

-- User feedback table
CREATE TABLE IF NOT EXISTS public.user_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    feedback_text TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('bug', 'feature', 'improvement', 'praise', 'other')),
    sentiment TEXT NOT NULL CHECK (sentiment IN ('positive', 'negative', 'neutral')),
    feature TEXT,
    context JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Feedback analysis table
CREATE TABLE IF NOT EXISTS public.feedback_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    feedback_id UUID NOT NULL REFERENCES public.user_feedback(id) ON DELETE CASCADE,
    sentiment_score NUMERIC,
    categories TEXT[] DEFAULT '{}',
    actionable_insights TEXT[] DEFAULT '{}',
    priority TEXT CHECK (priority IN ('low', 'medium', 'high')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- System alerts table
CREATE TABLE IF NOT EXISTS public.system_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    title TEXT NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}',
    resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- API endpoints table (for auto-documentation)
CREATE TABLE IF NOT EXISTS public.api_endpoints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    path TEXT NOT NULL,
    method TEXT NOT NULL,
    description TEXT,
    category TEXT,
    parameters JSONB[] DEFAULT '{}',
    response JSONB,
    example_body JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Error logs table (for troubleshooting guide)
CREATE TABLE IF NOT EXISTS public.error_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    error_type TEXT NOT NULL,
    count INTEGER DEFAULT 1,
    last_occurrence TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT,
    action_url TEXT,
    metadata JSONB DEFAULT '{}',
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Roadmap validations table
CREATE TABLE IF NOT EXISTS public.roadmap_validations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    validation_result JSONB NOT NULL,
    status TEXT NOT NULL,
    completion_percentage NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Create indexes
CREATE INDEX idx_documentation_category ON public.documentation(category);
CREATE INDEX idx_user_feedback_type ON public.user_feedback(type);
CREATE INDEX idx_user_feedback_sentiment ON public.user_feedback(sentiment);
CREATE INDEX idx_system_alerts_severity ON public.system_alerts(severity);
CREATE INDEX idx_system_alerts_resolved ON public.system_alerts(resolved);
CREATE INDEX idx_notifications_user_read ON public.notifications(user_id, read);

-- Enable RLS
ALTER TABLE public.documentation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_documentation_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutorial_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_validations ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Documentation is public read
CREATE POLICY "Documentation is publicly readable" ON public.documentation
    FOR SELECT USING (true);

-- User progress is private
CREATE POLICY "Users can manage their own documentation progress" ON public.user_documentation_progress
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own tutorial progress" ON public.tutorial_progress
    FOR ALL USING (auth.uid() = user_id);

-- User feedback
CREATE POLICY "Users can create their own feedback" ON public.user_feedback
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own feedback" ON public.user_feedback
    FOR SELECT USING (auth.uid() = user_id);

-- Feedback analysis is viewable by feedback owner
CREATE POLICY "Users can view analysis of their feedback" ON public.feedback_analysis
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_feedback
            WHERE user_feedback.id = feedback_analysis.feedback_id
            AND user_feedback.user_id = auth.uid()
        )
    );

-- System alerts are public read
CREATE POLICY "System alerts are publicly readable" ON public.system_alerts
    FOR SELECT USING (true);

-- API endpoints are public read
CREATE POLICY "API endpoints are publicly readable" ON public.api_endpoints
    FOR SELECT USING (true);

-- Error logs are public read
CREATE POLICY "Error logs are publicly readable" ON public.error_logs
    FOR SELECT USING (true);

-- Notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Roadmap validations
CREATE POLICY "Users can view their own roadmap validations" ON public.roadmap_validations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create roadmap validations for their projects" ON public.roadmap_validations
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE projects.id = project_id
            AND projects.user_id = auth.uid()
        )
    );

-- Insert some initial documentation
INSERT INTO public.documentation (title, content, category, metadata) VALUES
('Getting Started', '# Getting Started with AI Guided SaaS\n\nWelcome to AI Guided SaaS!', 'getting-started', 
 '{"tags": ["beginner", "introduction"], "difficulty": "beginner", "estimatedTime": "10 minutes", "version": "1.0.0"}'::jsonb),
('API Overview', '# API Reference\n\nOur API provides programmatic access to all features.', 'reference',
 '{"tags": ["api", "reference"], "difficulty": "intermediate", "estimatedTime": "30 minutes", "version": "1.0.0"}'::jsonb),
('Troubleshooting Common Issues', '# Troubleshooting Guide\n\nFind solutions to common problems.', 'troubleshooting',
 '{"tags": ["troubleshooting", "errors"], "difficulty": "intermediate", "estimatedTime": "15 minutes", "version": "1.0.0"}'::jsonb);