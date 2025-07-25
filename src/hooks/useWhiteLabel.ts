'use client';

import { useState, useEffect } from 'react';
import { getWhiteLabel, WhiteLabelConfig } from '@/services/white-label-service';

// Hook for accessing white-label configuration
export function useWhiteLabel() {
  const [config, setConfig] = useState<WhiteLabelConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const whiteLabel = getWhiteLabel();

  useEffect(() => {
    // Load initial config
    const initialConfig = whiteLabel.getConfig();
    setConfig(initialConfig);
    setIsLoading(false);

    // Listen for config updates
    const handleConfigUpdate = (newConfig: WhiteLabelConfig) => {
      setConfig(newConfig);
    };

    whiteLabel.on('config:updated', handleConfigUpdate);

    return () => {
      whiteLabel.off('config:updated', handleConfigUpdate);
    };
  }, []);

  const updateConfig = async (updates: Partial<WhiteLabelConfig>) => {
    await whiteLabel.updateConfig(updates);
  };

  const resetConfig = async () => {
    await whiteLabel.resetConfig();
  };

  const exportConfig = () => {
    return whiteLabel.exportConfig();
  };

  const importConfig = async (jsonString: string) => {
    await whiteLabel.importConfig(jsonString);
  };

  const applyPreset = async (presetId: string) => {
    await whiteLabel.applyPreset(presetId);
  };

  return {
    config,
    isLoading,
    updateConfig,
    resetConfig,
    exportConfig,
    importConfig,
    applyPreset,
    presets: whiteLabel.getThemePresets()
  };
}

// Hook for dynamic styling based on white-label config
export function useWhiteLabelStyles() {
  const { config } = useWhiteLabel();

  if (!config) return {};

  return {
    primaryButton: {
      backgroundColor: config.colors.primary,
      color: 'white',
      fontFamily: config.fonts.body
    },
    secondaryButton: {
      backgroundColor: config.colors.secondary,
      color: 'white',
      fontFamily: config.fonts.body
    },
    accentButton: {
      backgroundColor: config.colors.accent,
      color: 'white',
      fontFamily: config.fonts.body
    },
    heading: {
      fontFamily: config.fonts.header,
      color: config.colors.primary
    },
    body: {
      fontFamily: config.fonts.body
    },
    link: {
      color: config.colors.primary,
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline'
      }
    }
  };
}

// Hook for checking if a premium feature is enabled
export function useWhiteLabelFeature(feature: keyof WhiteLabelConfig['features']) {
  const { config } = useWhiteLabel();
  return config?.features[feature] || false;
}

// Hook for SEO metadata
export function useWhiteLabelSEO(pageTitle?: string) {
  const { config } = useWhiteLabel();

  useEffect(() => {
    if (!config) return;

    // Update document title
    if (pageTitle) {
      document.title = config.seo.titleTemplate.replace('%s', pageTitle);
    } else {
      document.title = config.seo.defaultTitle;
    }
  }, [config, pageTitle]);

  return {
    title: pageTitle 
      ? config?.seo.titleTemplate.replace('%s', pageTitle)
      : config?.seo.defaultTitle,
    description: config?.seo.description,
    keywords: config?.seo.keywords
  };
}

// Hook for dynamic favicon
export function useWhiteLabelFavicon() {
  const { config } = useWhiteLabel();

  useEffect(() => {
    if (!config) return;

    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (link) {
      link.href = config.favicon;
    } else {
      const newLink = document.createElement('link');
      newLink.rel = 'icon';
      newLink.href = config.favicon;
      document.head.appendChild(newLink);
    }
  }, [config]);
}

// Hook for custom CSS injection
export function useWhiteLabelCSS() {
  const { config } = useWhiteLabel();

  useEffect(() => {
    if (!config?.custom?.css) return;

    const styleId = 'white-label-custom-css';
    let styleElement = document.getElementById(styleId);

    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = config.custom.css;

    return () => {
      if (styleElement && !config.custom?.css) {
        styleElement.remove();
      }
    };
  }, [config?.custom?.css]);
}