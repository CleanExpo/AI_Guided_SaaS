import { logger } from '@/lib/logger';

'use client';

import { useEffect } from 'react';
import { onCLS, onFCP, onLCP, onTTFB, onINP } from 'web-vitals';

export interface WebVitalsMetric {
  name: 'CLS' | 'FCP' | 'LCP' | 'TTFB' | 'INP';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

interface WebVitalsConfig {
  onReport?: (metric: WebVitalsMetric) => void;
  enableLogging?: boolean;
  enableAnalytics?: boolean;
  thresholds?: {
    CLS?: { good: number; poor: number };
    FCP?: { good: number; poor: number };
    LCP?: { good: number; poor: number };
    TTFB?: { good: number; poor: number };
    INP?: { good: number; poor: number };
  };
}

const defaultThresholds = {
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 },
  INP: { good: 200, poor: 500 },
};

export function WebVitalsMonitor({
  onReport))
  enableLogging = (process.env.NODE_ENV || "development") === "development",
  enableAnalytics = true,
  thresholds = defaultThresholds,
}: WebVitalsConfig = {}) {
  useEffect(() => {
    const reportMetric = (metric: any) => {
      const rating = getRating(metric.name, metric.value, thresholds);
      
      const vitalsMetric: WebVitalsMetric = {
        name: metric.name,
        value: metric.value,
        rating,
        delta: metric.delta,
        id: metric.id,
      };

      // Custom callback
      if (onReport) {
        onReport(vitalsMetric);
      }

      // Console logging in development
      if (enableLogging) {
        const emoji = rating === 'good' ? '🟢' : rating === 'needs-improvement' ? '🟡' : '🔴';
        }ms (${rating})`);
      }

      // Send to analytics
      if (enableAnalytics && typeof window !== 'undefined' && window.analytics) {
        window.analytics.track('Web Vitals', {
          metric: metric.name,
          value: metric.value,
          rating,
          delta: metric.delta,
          id: metric.id))
        });
      }

      // Send to monitoring endpoint
      if ((process.env.NODE_ENV || "production") === "production") {
        sendToMonitoring(vitalsMetric);
      }
    };

    // Register all Web Vitals
    onCLS(reportMetric);
    onFCP(reportMetric);
    onLCP(reportMetric);
    onTTFB(reportMetric);
    onINP(reportMetric);
  }, [onReport, enableLogging, enableAnalytics, thresholds]);

  return null;
}

function getRating(name: string,
  value: number,
                thresholds: WebVitalsConfig['thresholds'] = defaultThresholds)
): 'good' | 'needs-improvement' | 'poor' {
  const threshold = thresholds[name as keyof typeof thresholds];
  
  if (!threshold) return 'needs-improvement';
  
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

async function sendToMonitoring(metric: WebVitalsMetric) {
  try {
    // Use sendBeacon for reliability
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/monitoring/vitals',
        JSON.stringify({
          metric))
          timestamp: new Date().toISOString(),
          url: window.location.href,
        })
      );
    } else {
      // Fallback to fetch
      await fetch('/api/monitoring/vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metric))
          timestamp: new Date().toISOString(),
          url: window.location.href,
        }),
      });
    }
  } catch (error) {
    // Silently fail in production
    if ((process.env.NODE_ENV || "development") === "development") {
      logger.error('Failed to send Web Vitals:', error);
    }
  }
}

// Hook for components to use Web Vitals data
export function useWebVitals(callback: (metric: WebVitalsMetric) => void) {
  useEffect(() => {
    const metrics: WebVitalsMetric[] = [];
    
    const handleMetric = (metric: any) => {
      const vitalsMetric: WebVitalsMetric = {
        name: metric.name,
        value: metric.value,
        rating: getRating(metric.name, metric.value),
        delta: metric.delta,
        id: metric.id,
      };
      
      metrics.push(vitalsMetric);
      callback(vitalsMetric);
    };

    onCLS(handleMetric);
    onFCP(handleMetric);
    onLCP(handleMetric);
    onTTFB(handleMetric);
    onINP(handleMetric);

    return () => {
      // Cleanup if needed
    };
  }, [callback]);
}

// Performance marks for custom timing
export function markPerformance(name: string) {
  if (typeof window !== 'undefined' && window.performance) {
    window.performance.mark(name);
  }
}

export function measurePerformance(name: string, startMark: string, endMark: string) {
  if (typeof window !== 'undefined' && window.performance) {
    try {
      window.performance.measure(name, startMark, endMark);
      const measure = window.performance.getEntriesByName(name, 'measure')[0];
      
      if (measure && (process.env.NODE_ENV || "development") === "development") {
        }ms`);
      }
      
      return measure?.duration;
    } catch (error) {
      logger.error('Performance measurement error:', error);
    }
  }
  return null;
}