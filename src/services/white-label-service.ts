import { EventEmitter } from 'events';

export interface WhiteLabelConfig {
  // Basic Info
  companyName: string;
  tagline: string;
  description: string;
  
  // Visual Identity
  logo: {
    light: string;
    dark: string;
    format: 'png' | 'svg';
    width: number;
    height: number;
  };
  favicon: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    // Computed shades
    primaryShades?: Record<number, string>;
    secondaryShades?: Record<number, string>;
  };
  
  // Typography
  fonts: {
    header: string;
    body: string;
    mono: string;
    // Font imports
    imports?: string[];
  };
  
  // Contact & Legal
  contact: {
    supportEmail: string;
    supportUrl: string;
    salesEmail?: string;
    phone?: string;
    address?: string;
  };
  legal: {
    privacyUrl: string;
    termsUrl: string;
    cookiesUrl?: string;
    gdprEmail?: string;
  };
  
  // Social Media
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    discord?: string;
    youtube?: string;
    facebook?: string;
  };
  
  // SEO & Meta
  seo: {
    defaultTitle: string;
    titleTemplate: string;
    description: string;
    keywords: string[];
    ogImage?: string;
    twitterCard?: 'summary' | 'summary_large_image';
  };
  
  // Custom Code
  custom?: {
    css?: string;
    js?: string;
    head?: string;
    bodyStart?: string;
    bodyEnd?: string;
  };
  
  // Feature Flags
  features: {
    removeBranding: boolean;
    customDomain: boolean;
    customEmails: boolean;
    apiWhiteLabel: boolean;
    customAnalytics: boolean;
  };
  
  // Domain Configuration
  domains?: {
    primary: string;
    aliases: string[];
    ssl: boolean;
  };
  
  // Email Templates
  emailTemplates?: {
    welcome: EmailTemplate;
    resetPassword: EmailTemplate;
    invitation: EmailTemplate;
    notification: EmailTemplate;
  };
}

export interface EmailTemplate {
  subject: string;
  header: string;
  body: string;
  footer: string;
  styles: Record<string, string>;
}

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  colors: WhiteLabelConfig['colors'];
  fonts: WhiteLabelConfig['fonts'];
  preview: string;
}

export class WhiteLabelService extends EventEmitter {
  private config: WhiteLabelConfig;
  private originalConfig: WhiteLabelConfig;
  private appliedTheme: boolean = false;

  constructor() {
    super();
    this.config = this.getDefaultConfig();
    this.originalConfig = { ...this.config };
    this.loadConfig();
  }

  // Get current configuration
  getConfig(): WhiteLabelConfig {
    return { ...this.config };
  }

  // Update configuration
  async updateConfig(updates: Partial<WhiteLabelConfig>): Promise<void> {
    this.config = { ...this.config, ...updates };
    
    // Generate color shades if primary colors changed
    if (updates.colors) {
      this.config.colors.primaryShades = this.generateColorShades(this.config.colors.primary);
      this.config.colors.secondaryShades = this.generateColorShades(this.config.colors.secondary);
    }
    
    await this.saveConfig();
    this.emit('config:updated', this.config);
    
    // Apply theme if in browser
    if (typeof window !== 'undefined') {
      this.applyTheme();
    }
  }

  // Apply theme to DOM
  applyTheme(): void {
    if (typeof window === 'undefined') return;
    
    const root = document.documentElement;
    
    // Apply colors
    root.style.setProperty('--color-primary', this.config.colors.primary);
    root.style.setProperty('--color-secondary', this.config.colors.secondary);
    root.style.setProperty('--color-accent', this.config.colors.accent);
    root.style.setProperty('--color-success', this.config.colors.success);
    root.style.setProperty('--color-warning', this.config.colors.warning);
    root.style.setProperty('--color-error', this.config.colors.error);
    
    // Apply color shades
    if (this.config.colors.primaryShades) {
      Object.entries(this.config.colors.primaryShades).forEach(([shade, color]) => {
        root.style.setProperty(`--color-primary-${shade}`, color);
      });
    }
    
    // Apply fonts
    root.style.setProperty('--font-header', this.config.fonts.header);
    root.style.setProperty('--font-body', this.config.fonts.body);
    root.style.setProperty('--font-mono', this.config.fonts.mono);
    
    // Apply custom CSS
    if (this.config.custom?.css) {
      this.applyCustomCSS(this.config.custom.css);
    }
    
    // Update meta tags
    this.updateMetaTags();
    
    this.appliedTheme = true;
    this.emit('theme:applied');
  }

  // Generate CSS variables
  generateCSSVariables(): string {
    const vars: string[] = [':root {'];
    
    // Colors
    vars.push(`  --color-primary: ${this.config.colors.primary};`);
    vars.push(`  --color-secondary: ${this.config.colors.secondary};`);
    vars.push(`  --color-accent: ${this.config.colors.accent};`);
    vars.push(`  --color-success: ${this.config.colors.success};`);
    vars.push(`  --color-warning: ${this.config.colors.warning};`);
    vars.push(`  --color-error: ${this.config.colors.error};`);
    
    // Color shades
    if (this.config.colors.primaryShades) {
      Object.entries(this.config.colors.primaryShades).forEach(([shade, color]) => {
        vars.push(`  --color-primary-${shade}: ${color};`);
      });
    }
    
    // Fonts
    vars.push(`  --font-header: ${this.config.fonts.header};`);
    vars.push(`  --font-body: ${this.config.fonts.body};`);
    vars.push(`  --font-mono: ${this.config.fonts.mono};`);
    
    vars.push('}');
    
    return vars.join('\n');
  }

  // Export configuration
  exportConfig(): string {
    return JSON.stringify(this.config, null, 2);
  }

  // Import configuration
  async importConfig(jsonString: string): Promise<void> {
    try {
      const imported = JSON.parse(jsonString);
      await this.updateConfig(imported);
    } catch (error) {
      throw new Error('Invalid configuration format');
    }
  }

  // Reset to defaults
  async resetConfig(): Promise<void> {
    this.config = this.getDefaultConfig();
    await this.saveConfig();
    this.emit('config:reset');
    this.applyTheme();
  }

  // Get theme presets
  getThemePresets(): ThemePreset[] {
    return [
      {
        id: 'default',
        name: 'Default',
        description: 'Modern blue and purple theme',
        colors: {
          primary: '#3B82F6',
          secondary: '#8B5CF6',
          accent: '#F97316',
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6'
        },
        fonts: {
          header: 'Inter',
          body: 'Inter',
          mono: 'Fira Code'
        },
        preview: '/themes/default.png'
      },
      {
        id: 'dark-pro',
        name: 'Dark Professional',
        description: 'Sleek dark theme for professionals',
        colors: {
          primary: '#000000',
          secondary: '#6B7280',
          accent: '#EF4444',
          success: '#10B981',
          warning: '#F59E0B',
          error: '#DC2626',
          info: '#6B7280'
        },
        fonts: {
          header: 'Roboto',
          body: 'Roboto',
          mono: 'Roboto Mono'
        },
        preview: '/themes/dark-pro.png'
      },
      {
        id: 'nature',
        name: 'Nature',
        description: 'Fresh green and earth tones',
        colors: {
          primary: '#10B981',
          secondary: '#6366F1',
          accent: '#F59E0B',
          success: '#059669',
          warning: '#D97706',
          error: '#DC2626',
          info: '#0EA5E9'
        },
        fonts: {
          header: 'Poppins',
          body: 'Open Sans',
          mono: 'Source Code Pro'
        },
        preview: '/themes/nature.png'
      }
    ];
  }

  // Apply preset theme
  async applyPreset(presetId: string): Promise<void> {
    const preset = this.getThemePresets().find(p => p.id === presetId);
    if (!preset) throw new Error('Preset not found');
    
    await this.updateConfig({
      colors: preset.colors,
      fonts: preset.fonts
    });
  }

  // Validate custom domain
  async validateDomain(domain: string): Promise<{ valid: boolean; error?: string }> {
    // Basic domain validation
    const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i;
    
    if (!domainRegex.test(domain)) {
      return { valid: false, error: 'Invalid domain format' };
    }
    
    // Check if domain is available (mock implementation)
    // In production, this would check DNS records
    return { valid: true };
  }

  // Private methods
  private getDefaultConfig(): WhiteLabelConfig {
    return {
      companyName: 'AI Guided SaaS',
      tagline: 'Ship Your SaaS 10x Faster',
      description: 'The fastest way to build and deploy your SaaS',
      logo: {
        light: '/logo-light.png',
        dark: '/logo-dark.png',
        format: 'png',
        width: 150,
        height: 40
      },
      favicon: '/favicon.ico',
      colors: {
        primary: '#3B82F6',
        secondary: '#8B5CF6',
        accent: '#F97316',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6'
      },
      fonts: {
        header: 'Inter',
        body: 'Inter',
        mono: 'Fira Code'
      },
      contact: {
        supportEmail: 'support@aiguidedsaas.com',
        supportUrl: 'https://support.aiguidedsaas.com'
      },
      legal: {
        privacyUrl: '/privacy',
        termsUrl: '/terms'
      },
      seo: {
        defaultTitle: 'AI Guided SaaS',
        titleTemplate: '%s | AI Guided SaaS',
        description: 'Build and deploy your SaaS 10x faster',
        keywords: ['saas', 'ai', 'startup', 'development']
      },
      features: {
        removeBranding: false,
        customDomain: false,
        customEmails: false,
        apiWhiteLabel: false,
        customAnalytics: false
      }
    };
  }

  private generateColorShades(baseColor: string): Record<number, string> {
    // Simple shade generation (in production, use a proper color library)
    const shades: Record<number, string> = {};
    const base = parseInt(baseColor.slice(1), 16);
    
    [50, 100, 200, 300, 400, 500, 600, 700, 800, 900].forEach(shade => {
      const factor = shade / 500;
      const adjusted = Math.round(base * factor);
      shades[shade] = '#' + adjusted.toString(16).padStart(6, '0');
    });
    
    return shades;
  }

  private applyCustomCSS(css: string): void {
    // Remove existing custom style if any
    const existingStyle = document.getElementById('white-label-custom-css');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    // Add new custom style
    const style = document.createElement('style');
    style.id = 'white-label-custom-css';
    style.textContent = css;
    document.head.appendChild(style);
  }

  private updateMetaTags(): void {
    // Update title
    document.title = this.config.seo.defaultTitle;
    
    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', this.config.seo.description);
    
    // Update favicon
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (favicon) {
      favicon.href = this.config.favicon;
    }
  }

  private saveConfig(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('white-label-config', JSON.stringify(this.config));
    }
  }

  private loadConfig(): void {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('white-label-config');
      if (saved) {
        try {
          this.config = { ...this.config, ...JSON.parse(saved) };
        } catch (error) {
          console.error('Failed to load white-label config:', error);
        }
      }
    }
  }
}

// Singleton instance
let whiteLabelInstance: WhiteLabelService | null = null;

export function getWhiteLabel(): WhiteLabelService {
  if (!whiteLabelInstance) {
    whiteLabelInstance = new WhiteLabelService();
  }
  return whiteLabelInstance;
}