export interface BrandingConfig {
  // Basic Info
  companyName: string;
  tagline: string;
  description: string;
  
  // Visual Identity
  logo: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  
  // Typography
  headerFont: string;
  bodyFont: string;
  
  // Contact Info
  supportEmail: string;
  supportUrl: string;
  privacyUrl: string;
  termsUrl: string;
  
  // Social Media
  twitter?: string;
  linkedin?: string;
  github?: string;
  discord?: string;
  
  // Advanced
  customCSS?: string;
  customJS?: string;
  customHead?: string;
  
  // Features
  removeBranding: boolean;
  customDomain: string;
  customEmails: boolean;
}

export const fontOptions = [
  'Inter', 'Roboto', 'Open Sans', 'Lato', 'Poppins', 
  'Montserrat', 'Playfair Display', 'Raleway', 'Ubuntu'
];

export const defaultConfig: BrandingConfig = {
  companyName: 'AI Guided SaaS',
  tagline: 'Ship Your SaaS 10x Faster',
  description: 'The fastest way to build and deploy your SaaS',
  logo: '/logo.png',
  favicon: '/favicon.ico',
  primaryColor: '#3B82F6',
  secondaryColor: '#8B5CF6',
  accentColor: '#F97316',
  headerFont: 'Inter',
  bodyFont: 'Inter',
  supportEmail: 'support@example.com',
  supportUrl: 'https://support.example.com',
  privacyUrl: '/privacy',
  termsUrl: '/terms',
  removeBranding: false,
  customDomain: '',
  customEmails: false
};