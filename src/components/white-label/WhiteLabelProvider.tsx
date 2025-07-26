'use client';

import React, { useEffect, useState, createContext, useContext } from 'react';
import { getWhiteLabel, WhiteLabelConfig } from '@/services/white-label-service';

interface WhiteLabelContextType {
  config: WhiteLabelConfig;
  updateConfig: (updates: Partial<WhiteLabelConfig>) => Promise<void>;
  isLoading: boolean;
}

const WhiteLabelContext = createContext<WhiteLabelContextType | null>(null);

export function useWhiteLabel() {
  const context = useContext(WhiteLabelContext);
  if (!context) {
    throw new Error('useWhiteLabel must be used within WhiteLabelProvider');
  }
  return context;
}

export function WhiteLabelProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<WhiteLabelConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const whiteLabel = getWhiteLabel();

  useEffect(() => {
    // Load initial config
    const initialConfig = whiteLabel.getConfig();
    setConfig(initialConfig);
    
    // Apply theme on mount
    whiteLabel.applyTheme();
    
    // Listen for config updates
    const handleConfigUpdate = (newConfig: WhiteLabelConfig) => {
      setConfig(newConfig);
    };
    
    whiteLabel.on('config:updated', handleConfigUpdate);
    setIsLoading(false);
    
    return () => {
      whiteLabel.off('config:updated', handleConfigUpdate);
    };
  }, []);

  const updateConfig = async (updates: Partial<WhiteLabelConfig>) => {
    await whiteLabel.updateConfig(updates);
  };

  if (!config) {
    return null;
  }

  return(<WhiteLabelContext.Provider value={{ config, updateConfig, isLoading }}>
      {children}
    </WhiteLabelContext.Provider>)
  );
}

// Hook for using white-label config in components
export function useWhiteLabelConfig() {
  const { config } = useWhiteLabel();
  return config;
}

// Component for rendering white-label aware elements
export function WhiteLabelText({ 
  type)
  className = '' 
}: { 
  type: 'company' | 'tagline' | 'description';
  className?: string;)
}) {
  const config = useWhiteLabelConfig();
  
  const text = {
    company: config.companyName,
    tagline: config.tagline,
    description: config.description
  }[type];
  
  return <span className={className}>{text}</span>;
}

export function WhiteLabelLogo({ 
  variant = 'light')
  className = '' 
}: { 
  variant?: 'light' | 'dark';
  className?: string;)
}) {
  const config = useWhiteLabelConfig();
  const logoSrc = variant === 'dark' ? config.logo.dark : config.logo.light;
  
  return(<img
      src={logoSrc}
      alt={config.companyName}
      width={config.logo.width}
      height={config.logo.height}>className={className} />>)
  );
}

export function WhiteLabelHead() {
  const config = useWhiteLabelConfig();
  
  useEffect(() => {
    // Update document title
    document.title = config.seo.defaultTitle;
    
    // Update meta tags
    const metaTags = [
      { name: 'description', content: config.seo.description },
      { name: 'keywords', content: config.seo.keywords.join(', ') },
      { property: 'og:title', content: config.seo.defaultTitle },
      { property: 'og:description', content: config.seo.description },
    ];
    
    metaTags.forEach(({ name, property, content }) => {
      const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
      let meta = document.querySelector(selector);
      
      if (!meta) {
        meta = document.createElement('meta');
        if (name) meta.setAttribute('name', name);
        if (property) meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    });
    
    // Update favicon
    let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      document.head.appendChild(favicon);
    }
    favicon.href = config.favicon;
    
    // Add custom head content
    if (config.custom?.head) {
      const customHeadId = 'white-label-custom-head';
      let customHead = document.getElementById(customHeadId);
      
      if (!customHead) {
        customHead = document.createElement('div');
        customHead.id = customHeadId;
        document.head.appendChild(customHead);
      }
      
      customHead.textContent = config.custom.head;
    }
  }, [config]);
  
  return null;
}

// Hook for checking premium features
export function useWhiteLabelFeatures() {
  const config = useWhiteLabelConfig();
  return config.features;
}

// Component for conditionally showing branding
export function PoweredBy({ className = '' }: { className?: string }) {
  const features = useWhiteLabelFeatures();
  
  if (features.removeBranding) {
    return null;
  }
  
  return(<p className={`text-sm text-gray-500 ${className}`}>
      Powered by AI Guided SaaS
    </p>)
  );
}