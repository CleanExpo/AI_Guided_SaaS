import { Redis } from '../redis/client';
import { logger } from '../logger';

/**
 * Core Web Vitals Metrics
 */
export interface WebVitalMetric {
  name: 'CLS' | 'FID' | 'FCP' | 'LCP' | 'TTFB' | 'INP';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType: 'navigate' | 'reload' | 'back-forward';
}

/**
 * Performance Metrics Interface
 */
export interface PerformanceMetrics {
  pageLoad: number;
  domContentLoaded: number;
  firstPaint: number;
  firstContentfulPaint: number;
  largestContentfulPaint?: number;
  cumulativeLayoutShift?: number;
  firstInputDelay?: number;
  interactionToNextPaint?: number;
  timeToFirstByte: number;
  resourceCount: number;
  jsHeapSize?: number;
  connectionType?: string;
  effectiveType?: string;
  url: string;
  userAgent: string;
  timestamp: number;
}

/**
 * Bundle Analysis Data
 */
export interface BundleAnalysis {
  totalSize: number;
  gzippedSize: number;
  chunkCount: number;
  largestChunks: Array<{
    name: string;
    size: number;
    gzippedSize: number;
  }>;
  duplicateModules: string[];
  unusedExports: string[];
  analysisDate: number;
}

/**
 * Performance Budget Thresholds
 */
export const PERFORMANCE_BUDGETS = {
  // Core Web Vitals thresholds (Google recommended,
                LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint (ms,
                FID: { good: 100, poor: 300 }, // First Input Delay (ms,
                CLS: { good: 0.1, poor: 0.25 }, // Cumulative Layout Shift
  FCP: { good: 1800, poor: 3000 }, // First Contentful Paint (ms,
                TTFB: { good: 600, poor: 1500 }, // Time to First Byte (ms,
                INP: { good: 200, poor: 500 }, // Interaction to Next Paint (ms)

  // Bundle size budgets
  BUNDLE_SIZE: {
    total: 250 * 1024, // 250KB total
    individual: 50 * 1024, // 50KB per chunk
    css: 30 * 1024, // 30KB CSS
    images: 100 * 1024, // 100KB images
  },

  // Resource budgets
  RESOURCE_COUNT: 50,
  JS_HEAP_SIZE: 50 * 1024 * 1024, // 50MB
} as const;

/**
 * Performance Monitoring Service
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metricsBuffer: PerformanceMetrics[] = [];
  private bufferSize = 100;
  private flushInterval = 30000; // 30 seconds
  private flushTimer?: NodeJS.Timeout;

  private constructor() {
    this.startFlushTimer();
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  /**
   * Record performance metrics
   */
  async recordMetrics(metrics: PerformanceMetrics): Promise<void> {
    try {
      // Add to buffer
      this.metricsBuffer.push(metrics);

      // Flush if buffer is full
      if (this.metricsBuffer.length >= this.bufferSize) {
        await this.flushMetrics();
      }

      // Analyze and alert if metrics are poor
      await this.analyzeMetrics(metrics);
    } catch (error) {
      logger.error('Failed to record performance metrics:', error);
    }
  }

  /**
   * Record Core Web Vitals
   */
  async recordWebVital(metric: WebVitalMetric): Promise<void> {
    try {
      const key = `web_vital:${metric.name}:${new Date().toISOString().slice(0, 10)}`;

      // Store in Redis with TTL of 30 days
      await Redis.lpush(
        key,
        JSON.stringify({
          ...metric,
          timestamp: Date.now(),
        })
      );

      await Redis.expire(key, 30 * 24 * 60 * 60); // 30 days

      // Alert if metric is poor
      if (metric.rating === 'poor') {
        logger.warn(
          `Poor Core Web Vital detected: ${metric.name} = ${metric.value}`,
          {
            metric: metric.name,
            value: metric.value,
            rating: metric.rating,
            id: metric.id,
          }
        );
      }
    } catch (error) {
      logger.error('Failed to record web vital:', error);
    }
  }

  /**
   * Get performance analytics
   */
  async getPerformanceAnalytics(
    timeframe: 'hour' | 'day' | 'week' = 'day'
  ): Promise<{
    averages: Record<string, number>;
    trends: Record<string, Array<{ timestamp: number; value: number }>>;
    alerts: Array<{ type: string; message: string; timestamp: number }>;
    budget: Record<string, 'good' | 'needs-improvement' | 'poor'>;
  }> {
    try {
      const now = Date.now();
      const timeRanges = {
        hour: 60 * 60 * 1000,
        day: 24 * 60 * 60 * 1000,
        week: 7 * 24 * 60 * 60 * 1000,
      };

      const timeRange = timeRanges[timeframe];
      const startTime = now - timeRange;

      // Get metrics from Redis
      const metrics = await this.getMetricsFromRedis(startTime, now);

      // Calculate averages
      const averages = this.calculateAverages(metrics);

      // Generate trends
      const trends = this.generateTrends(metrics, timeframe);

      // Get alerts
      const alerts = await this.getAlerts(startTime, now);

      // Check budget compliance
      const budget = this.checkBudgetCompliance(averages);

      return { averages, trends, alerts, budget };
    } catch (error) {
      logger.error('Failed to get performance analytics:', error);
      return {
        averages: {},
        trends: {},
        alerts: [],
        budget: {},
      };
    }
  }

  /**
   * Optimize bundle based on analysis
   */
  async optimizeBundle(): Promise<{
    recommendations: string[];
    potentialSavings: number;
    actions: Array<{
      type: string;
      description: string;
      impact: 'high' | 'medium' | 'low';
    }>;
  }> {
    try {
      const bundleAnalysis = await this.getBundleAnalysis();
      const recommendations: string[] = [];
      const actions: Array<{
        type: string;
        description: string;
        impact: 'high' | 'medium' | 'low';
      }> = [];
      let potentialSavings = 0;

      // Check for large chunks
      const largeChunks = bundleAnalysis.largestChunks.filter(
        chunk => chunk.size > PERFORMANCE_BUDGETS.BUNDLE_SIZE.individual
      );

      if (largeChunks.length > 0) {
        recommendations.push('Split large chunks using dynamic imports');
        actions.push({
          type: 'code-splitting',
          description: `Split ${largeChunks.length} large chunks`,
          impact: 'high',
        });
        potentialSavings += largeChunks.reduce(
          (sum, chunk) => sum + chunk.size * 0.3,
          0
        );
      }

      // Check for duplicate modules
      if (bundleAnalysis.duplicateModules.length > 0) {
        recommendations.push(
          'Remove duplicate modules using webpack optimization'
        );
        actions.push({
          type: 'deduplication',
          description: `Remove ${bundleAnalysis.duplicateModules.length} duplicate modules`,
          impact: 'medium',
        });
        potentialSavings += bundleAnalysis.duplicateModules.length * 5000; // Estimate
      }

      // Check for unused exports
      if (bundleAnalysis.unusedExports.length > 0) {
        recommendations.push('Remove unused exports with tree shaking');
        actions.push({
          type: 'tree-shaking',
          description: `Remove ${bundleAnalysis.unusedExports.length} unused exports`,
          impact: 'medium',
        });
        potentialSavings += bundleAnalysis.unusedExports.length * 1000; // Estimate
      }

      // Check total bundle size
      if (bundleAnalysis.totalSize > PERFORMANCE_BUDGETS.BUNDLE_SIZE.total) {
        recommendations.push(
          'Enable gzip compression and consider lazy loading'
        );
        actions.push({
          type: 'compression',
          description: 'Enable better compression and lazy loading',
          impact: 'high',
        });
        potentialSavings += bundleAnalysis.totalSize * 0.4; // Gzip typically saves 40%
      }

      return { recommendations, potentialSavings, actions };
    } catch (error) {
      logger.error('Failed to optimize bundle:', error);
      return {
        recommendations: [
          'Unable to analyze bundle - check build configuration',
        ],
        potentialSavings: 0,
        actions: [],
      };
    }
  }

  /**
   * Generate performance report
   */
  async generateReport(): Promise<{
    summary: {
      score: number;
      grade: 'A' | 'B' | 'C' | 'D' | 'F';
      issues: number;
      improvements: number;
    };
    coreWebVitals: Record<
      string,
      { value: number; rating: string; threshold: any }
    >;
    recommendations: string[];
    trends: 'improving' | 'stable' | 'declining';
  }> {
    try {
      const analytics = await this.getPerformanceAnalytics('day');
      const bundleOptimization = await this.optimizeBundle();

      // Calculate performance score (0-100)
      let score = 100;
      const issues: string[] = [];
      const improvements: string[] = [];

      // Check Core Web Vitals
      const coreWebVitals: Record<
        string,
        { value: number; rating: string; threshold: any }
      > = {};

      for (const [metric, threshold] of Object.entries(PERFORMANCE_BUDGETS)) {
        if (typeof threshold === 'object' && 'good' in threshold) {
          const value = analytics.averages[metric.toLowerCase()] || 0;
          let rating = 'good';

          if (value > threshold.poor) {
            rating = 'poor';
            score -= 20;
            issues.push(`${metric} needs improvement`);
          } else if (value > threshold.good) {
            rating = 'needs-improvement';
            score -= 10;
            improvements.push(`Optimize ${metric}`);
          }

          coreWebVitals[metric] = { value, rating, threshold };
        }
      }

      // Determine grade
      let grade: 'A' | 'B' | 'C' | 'D' | 'F';
      if (score >= 90) grade = 'A';
      else if (score >= 80) grade = 'B';
      else if (score >= 70) grade = 'C';
      else if (score >= 60) grade = 'D';
      else grade = 'F';

      // Determine trends
      const currentAvg =
        Object.values(analytics.averages).reduce((a, b) => a + b, 0) /
        Object.keys(analytics.averages).length;
      const trends: 'improving' | 'stable' | 'declining' = 'stable'; // Simplified for now

      return {
        summary: {
          score: Math.max(0, score),
          grade,
          issues: issues.length,
          improvements: improvements.length,
        },
        coreWebVitals,
        recommendations: [
          ...bundleOptimization.recommendations,
          ...improvements,
        ],
        trends,
      };
    } catch (error) {
      logger.error('Failed to generate performance report:', error);
      return {
        summary: { score: 0, grade: 'F', issues: 1, improvements: 0 },
        coreWebVitals: {},
        recommendations: ['Unable to generate report - check monitoring setup'],
        trends: 'stable',
      };
    }
  }

  // Private methods

  private startFlushTimer(): void {
    this.flushTimer = setInterval(() => {
      this.flushMetrics().catch(error =>
        logger.error('Failed to flush metrics:', error)
      );
    }, this.flushInterval);
  }

  private async flushMetrics(): Promise<void> {
    if (this.metricsBuffer.length === 0) return;

    try {
      const metrics = [...this.metricsBuffer];
      this.metricsBuffer = [];

      // Store in Redis
      const key = `performance_metrics:${new Date().toISOString().slice(0, 10)}`;
      await Redis.lpush(key, ...metrics.map(m => JSON.stringify(m)));
      await Redis.expire(key, 7 * 24 * 60 * 60); // 7 days TTL

      logger.debug(`Flushed ${metrics.length} performance metrics`);
    } catch (error) {
      logger.error('Failed to flush metrics to Redis:', error);
    }
  }

  private async analyzeMetrics(metrics: PerformanceMetrics): Promise<void> {
    // Check against performance budgets
    const alerts: string[] = [];

    if (
      metrics.largestContentfulPaint &&
      metrics.largestContentfulPaint > PERFORMANCE_BUDGETS.LCP.poor
    ) {
      alerts.push(
        `LCP is ${metrics.largestContentfulPaint}ms (threshold: ${PERFORMANCE_BUDGETS.LCP.poor}ms)`
      );
    }

    if (
      metrics.firstInputDelay &&
      metrics.firstInputDelay > PERFORMANCE_BUDGETS.FID.poor
    ) {
      alerts.push(
        `FID is ${metrics.firstInputDelay}ms (threshold: ${PERFORMANCE_BUDGETS.FID.poor}ms)`
      );
    }

    if (metrics.timeToFirstByte > PERFORMANCE_BUDGETS.TTFB.poor) {
      alerts.push(
        `TTFB is ${metrics.timeToFirstByte}ms (threshold: ${PERFORMANCE_BUDGETS.TTFB.poor}ms)`
      );
    }

    // Log alerts
    if (alerts.length > 0) {
      logger.warn('Performance budget exceeded:', { alerts, url: metrics.url });
    }
  }

  private async getMetricsFromRedis(
    startTime: number,
    endTime: number
  ): Promise<PerformanceMetrics[]> {
    // Simplified implementation - in production, you'd query by timestamp range
    const keys = await this.getMetricKeys(startTime, endTime);
    const metrics: PerformanceMetrics[] = [];

    for (const key of keys) {
      const rawMetrics = await Redis.llen(key);
      if (rawMetrics) {
        // In practice, you'd use LRANGE to get the actual data
        // This is a simplified implementation
      }
    }

    return metrics;
  }

  private async getMetricKeys(
    startTime: number,
    endTime: number
  ): Promise<string[]> {
    // Generate date-based keys for the time range
    const keys: string[] = [];
    const start = new Date(startTime);
    const end = new Date(endTime);

    for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
      keys.push(`performance_metrics:${date.toISOString().slice(0, 10)}`);
    }

    return keys;
  }

  private calculateAverages(
    metrics: PerformanceMetrics[]
  ): Record<string, number> {
    if (metrics.length === 0) return {};

    const sums: Record<string, number> = {};
    const counts: Record<string, number> = {};

    for (const metric of metrics) {
      for (const [key, value] of Object.entries(metric)) {
        if (typeof value === 'number') {
          sums[key] = (sums[key] || 0) + value;
          counts[key] = (counts[key] || 0) + 1;
        }
      }
    }

    const averages: Record<string, number> = {};
    for (const key of Object.keys(sums)) {
      averages[key] = sums[key] / counts[key];
    }

    return averages;
  }

  private generateTrends(
    metrics: PerformanceMetrics[],
    timeframe: string
  ): Record<string, Array<{ timestamp: number; value: number }>> {
    // Simplified trend generation
    return {};
  }

  private async getAlerts(
    startTime: number,
    endTime: number
  ): Promise<Array<{ type: string; message: string; timestamp: number }>> {
    // Get alerts from Redis
    return [];
  }

  private checkBudgetCompliance(
    averages: Record<string, number>
  ): Record<string, 'good' | 'needs-improvement' | 'poor'> {
    const compliance: Record<string, 'good' | 'needs-improvement' | 'poor'> =
      {};

    for (const [metric, thresholds] of Object.entries(PERFORMANCE_BUDGETS)) {
      if (typeof thresholds === 'object' && 'good' in thresholds) {
        const value = averages[metric.toLowerCase()] || 0;

        if (value <= thresholds.good) {
          compliance[metric] = 'good';
        } else if (value <= thresholds.poor) {
          compliance[metric] = 'needs-improvement';
        } else {
          compliance[metric] = 'poor';
        }
      }
    }

    return compliance;
  }

  private async getBundleAnalysis(): Promise<BundleAnalysis> {
    // In a real implementation, this would analyze the actual bundle
    // For now, return mock data
    return {
      totalSize: 150000,
      gzippedSize: 45000,
      chunkCount: 5,
      largestChunks: [],
      duplicateModules: [],
      unusedExports: [],
      analysisDate: Date.now(),
    };
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();

/**
 * Client-side performance monitoring utilities
 */
export const createPerformanceObserver = () => {
  if (typeof window === 'undefined') return null;

  // Web Vitals observer
  const observeWebVitals = (callback: (metric: WebVitalMetric) => void) => {
    // This would integrate with web-vitals library
    // For now, it's a placeholder
  };

  // Resource timing observer
  const observeResourceTiming = (
    callback: (entries: PerformanceResourceTiming[]) => void
  ) => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver(list => {
        callback(list.getEntries() as PerformanceResourceTiming[]);
      });
      observer.observe({ entryTypes: ['resource'] });
      return observer;
    }
    return null;
  };

  return {
    observeWebVitals,
    observeResourceTiming,
  };
};
