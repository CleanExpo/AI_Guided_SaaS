'use client';

import { useEffect, useCallback } from 'react';
import { getAnalytics, initializeAnalytics, AnalyticsEngine } from '@/services/analytics-engine';

// Initialize analytics on first import
if (typeof window !== 'undefined') {
  initializeAnalytics({
    enabled: true,
    providers: [
      {
        name: 'console',
        enabled: true,
        config: {},
        send: async (event) => {
          if ((process.env.NODE_ENV || "development") === "development") {
            
          }
        }
      }
    ]
  });
}

export function useAnalytics() {
  const analytics = getAnalytics();

  // Track page views
  useEffect(() => {
    analytics.trackPageView(window.location.pathname);
  }, []);

  // Track custom events
  const track = useCallback((eventName: string, properties?: Record<string, unknown>) => {
    analytics.track({
      type: 'custom',
      name: eventName,
      data: properties || {}
    });
  }, [analytics]);

  // Track feature usage
  const trackFeature = useCallback((feature: string, action: string, value?: unknown) => {
    analytics.trackFeature(feature, action, value);
  }, [analytics]);

  // Track conversions
  const trackConversion = useCallback((goal: string, value?: number, currency?: string) => {
    analytics.trackConversion(goal, value, currency);
  }, [analytics]);

  // Track errors
  const trackError = useCallback((error: Error, severity: 'low' | 'medium' | 'high' | 'critical' = 'medium') => {
    analytics.trackError(error, severity);
  }, [analytics]);

  // Identify user
  const identify = useCallback((userId: string, traits?: Record<string, unknown>) => {
    analytics.identify(userId, traits);
  }, [analytics]);

  return {
    track,
    trackFeature,
    trackConversion,
    trackError,
    identify,
    analytics
  };
}

// Hook for tracking component performance
export function usePerformanceTracking(componentName: string) {
  const { analytics } = useAnalytics();
  
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const duration = performance.now() - startTime;
      analytics.track({
        type: 'performance',
        metric: 'render_time',
        value: duration,
        unit: 'ms',
        metadata: { component: componentName }
      });
    };
  }, [componentName, analytics]);
}

// Hook for tracking user interactions
export function useInteractionTracking(feature: string) {
  const { trackFeature } = useAnalytics();
  
  const trackClick = useCallback((action: string, value?: unknown) => {
    trackFeature(feature, `click_${action}`, value);
  }, [feature, trackFeature]);
  
  const trackHover = useCallback((action: string, value?: unknown) => {
    trackFeature(feature, `hover_${action}`, value);
  }, [feature, trackFeature]);
  
  const trackFocus = useCallback((action: string, value?: unknown) => {
    trackFeature(feature, `focus_${action}`, value);
  }, [feature, trackFeature]);
  
  return {
    trackClick,
    trackHover,
    trackFocus
  };
}

// Hook for tracking form analytics
export function useFormAnalytics(formName: string) {
  const { track, trackConversion } = useAnalytics();
  const startTime = Date.now();
  
  const trackFieldInteraction = useCallback((fieldName: string, action: 'focus' | 'blur' | 'change') => {
    track('form_interaction', {
      form: formName,
      field: fieldName,
      action,
      timeSpent: Date.now() - startTime
    });
  }, [formName, track, startTime]);
  
  const trackFormSubmit = useCallback((success: boolean, data?: Record<string, unknown>) => {
    const event = success ? 'form_submit_success' : 'form_submit_error';
    track(event, {
      form: formName,
      timeToComplete: Date.now() - startTime,
      ...data
    });
    
    if (success) {
      trackConversion(`${formName}_submission`);
    }
  }, [formName, track, trackConversion, startTime]);
  
  const trackFormAbandon = useCallback((reason?: string) => {
    track('form_abandon', {
      form: formName,
      timeSpent: Date.now() - startTime,
      reason
    });
  }, [formName, track, startTime]);
  
  return {
    trackFieldInteraction,
    trackFormSubmit,
    trackFormAbandon
  };
}