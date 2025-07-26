-- Migration: 005_marketplace
-- Description: Template marketplace and plugin system
-- Author: AI Guided SaaS Team
-- Date: 2025-07-26

-- Template categories
CREATE TABLE IF NOT EXISTS public.template_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    parent_id UUID REFERENCES public.template_categories(id) ON DELETE CASCADE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Templates
CREATE TABLE IF NOT EXISTS public.templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.template_categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    short_description TEXT,
    version TEXT NOT NULL DEFAULT '1.0.0',
    tags TEXT[] DEFAULT '{}',
    preview_url TEXT,
    thumbnail_url TEXT,
    demo_url TEXT,
    source_code JSONB NOT NULL, -- Template structure and code
    config JSONB DEFAULT '{}', -- Configuration options
    dependencies JSONB DEFAULT '{}', -- Required packages/libraries
    is_public BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    price_cents INTEGER DEFAULT 0, -- 0 = free
    license TEXT DEFAULT 'MIT',
    download_count INTEGER DEFAULT 0,
    star_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Template versions (for version history)
CREATE TABLE IF NOT EXISTS public.template_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID NOT NULL REFERENCES public.templates(id) ON DELETE CASCADE,
    version TEXT NOT NULL,
    changelog TEXT,
    source_code JSONB NOT NULL,
    config JSONB DEFAULT '{}',
    dependencies JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(template_id, version)
);

-- Template installations
CREATE TABLE IF NOT EXISTS public.template_installations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID NOT NULL REFERENCES public.templates(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    version TEXT NOT NULL,
    installed_at TIMESTAMPTZ DEFAULT NOW(),
    last_updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Template ratings and reviews
CREATE TABLE IF NOT EXISTS public.template_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID NOT NULL REFERENCES public.templates(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    review TEXT,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(template_id, user_id)
);

-- Template stars (favorites)
CREATE TABLE IF NOT EXISTS public.template_stars (
    template_id UUID NOT NULL REFERENCES public.templates(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    starred_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (template_id, user_id)
);

-- Plugins
CREATE TABLE IF NOT EXISTS public.plugins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    version TEXT NOT NULL DEFAULT '1.0.0',
    type TEXT CHECK (type IN ('integration', 'ui-component', 'utility', 'ai-agent', 'other')),
    manifest JSONB NOT NULL, -- Plugin configuration and metadata
    entry_point TEXT NOT NULL, -- Main file or function
    permissions TEXT[] DEFAULT '{}', -- Required permissions
    is_public BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    install_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Plugin installations
CREATE TABLE IF NOT EXISTS public.plugin_installations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plugin_id UUID NOT NULL REFERENCES public.plugins(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT TRUE,
    settings JSONB DEFAULT '{}',
    installed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(plugin_id, user_id, project_id)
);

-- Marketplace transactions
CREATE TABLE IF NOT EXISTS public.marketplace_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    item_type TEXT NOT NULL CHECK (item_type IN ('template', 'plugin')),
    item_id UUID NOT NULL,
    price_cents INTEGER NOT NULL,
    platform_fee_cents INTEGER NOT NULL,
    seller_revenue_cents INTEGER NOT NULL,
    payment_method TEXT,
    payment_id TEXT, -- Stripe payment ID
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Template collections (curated lists)
CREATE TABLE IF NOT EXISTS public.template_collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    curator_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    is_official BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Collection items
CREATE TABLE IF NOT EXISTS public.collection_items (
    collection_id UUID NOT NULL REFERENCES public.template_collections(id) ON DELETE CASCADE,
    template_id UUID NOT NULL REFERENCES public.templates(id) ON DELETE CASCADE,
    display_order INTEGER DEFAULT 0,
    added_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (collection_id, template_id)
);

-- Create indexes
CREATE INDEX idx_templates_author ON public.templates(author_id);
CREATE INDEX idx_templates_category ON public.templates(category_id);
CREATE INDEX idx_templates_slug ON public.templates(slug);
CREATE INDEX idx_templates_public ON public.templates(is_public);
CREATE INDEX idx_templates_featured ON public.templates(is_featured);
CREATE INDEX idx_templates_tags ON public.templates USING GIN(tags);

CREATE INDEX idx_template_installations_user ON public.template_installations(user_id);
CREATE INDEX idx_template_installations_template ON public.template_installations(template_id);

CREATE INDEX idx_template_reviews_template ON public.template_reviews(template_id);
CREATE INDEX idx_template_reviews_user ON public.template_reviews(user_id);

CREATE INDEX idx_plugins_author ON public.plugins(author_id);
CREATE INDEX idx_plugins_slug ON public.plugins(slug);
CREATE INDEX idx_plugins_type ON public.plugins(type);

CREATE INDEX idx_marketplace_transactions_buyer ON public.marketplace_transactions(buyer_id);
CREATE INDEX idx_marketplace_transactions_seller ON public.marketplace_transactions(seller_id);
CREATE INDEX idx_marketplace_transactions_status ON public.marketplace_transactions(status);

-- Functions
-- Update template star count
CREATE OR REPLACE FUNCTION update_template_star_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.templates 
        SET star_count = star_count + 1 
        WHERE id = NEW.template_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.templates 
        SET star_count = star_count - 1 
        WHERE id = OLD.template_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_star_count
AFTER INSERT OR DELETE ON public.template_stars
FOR EACH ROW EXECUTE FUNCTION update_template_star_count();

-- Update template download count
CREATE OR REPLACE FUNCTION increment_template_downloads()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.templates 
    SET download_count = download_count + 1 
    WHERE id = NEW.template_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_downloads
AFTER INSERT ON public.template_installations
FOR EACH ROW EXECUTE FUNCTION increment_template_downloads();

-- Enable RLS
ALTER TABLE public.template_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_installations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_stars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plugins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plugin_installations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Categories are public
CREATE POLICY "Categories are publicly readable" ON public.template_categories
    FOR SELECT USING (true);

-- Public templates are readable by all
CREATE POLICY "Public templates are readable" ON public.templates
    FOR SELECT USING (is_public = true);

-- Authors can manage their templates
CREATE POLICY "Authors can manage own templates" ON public.templates
    FOR ALL USING (author_id = auth.uid());

-- Users can view their installations
CREATE POLICY "Users can view own installations" ON public.template_installations
    FOR SELECT USING (user_id = auth.uid());

-- Users can install templates
CREATE POLICY "Users can install templates" ON public.template_installations
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Reviews are public
CREATE POLICY "Reviews are publicly readable" ON public.template_reviews
    FOR SELECT USING (true);

-- Users can manage their reviews
CREATE POLICY "Users can manage own reviews" ON public.template_reviews
    FOR ALL USING (user_id = auth.uid());

-- Triggers
CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON public.templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_template_reviews_updated_at BEFORE UPDATE ON public.template_reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plugins_updated_at BEFORE UPDATE ON public.plugins
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_template_collections_updated_at BEFORE UPDATE ON public.template_collections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Rollback:
-- DROP TABLE public.collection_items CASCADE;
-- DROP TABLE public.template_collections CASCADE;
-- DROP TABLE public.marketplace_transactions CASCADE;
-- DROP TABLE public.plugin_installations CASCADE;
-- DROP TABLE public.plugins CASCADE;
-- DROP TABLE public.template_stars CASCADE;
-- DROP TABLE public.template_reviews CASCADE;
-- DROP TABLE public.template_installations CASCADE;
-- DROP TABLE public.template_versions CASCADE;
-- DROP TABLE public.templates CASCADE;
-- DROP TABLE public.template_categories CASCADE;
-- DROP FUNCTION update_template_star_count();
-- DROP FUNCTION increment_template_downloads();