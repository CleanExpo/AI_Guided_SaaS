import { logger } from '@/lib/logger';
import { EventEmitter } from 'events';
import { 
  AnalyticsEvent, 
  AnalyticsMetrics, 
  AnalyticsConfig,
  AnalyticsProvider,
  DashboardData
} from './analytics/types';
import { EventTracker } from './analytics/event-tracker';
import { MetricsCalculator } from './analytics/metrics-calculator';
import { DashboardGenerator } from './analytics/dashboard-generator';

export * from './analytics/types';

export class AnalyticsEngine extends EventEmitter {
  private config: AnalyticsConfig;
  private providers: Map<string, AnalyticsProvider> = new Map();
  private eventTracker: EventTracker;
  private metricsCalculator: MetricsCalculator;
  private dashboardGenerator: DashboardGenerator;
  private isInitialized: boolean = false;
  private realtimeEvents: AnalyticsEvent[] = [];
  private processInterval?: NodeJS.Timeout;

  constructor(config: AnalyticsConfig) {
    super();
    this.config = config;
    const sessionId = this.generateSessionId();
    this.eventTracker = new EventTracker(sessionId);
    this.metricsCalculator = new MetricsCalculator();
    this.dashboardGenerator = new DashboardGenerator();
  }

  async initialize(): Promise<void> {
    if (!this.config.enabled) {
      return;
    }

    // Initialize providers
    for (const provider of this.config.providers) {
      if (provider.enabled) {
        this.providers.set(provider.name, provider);
      }
    }

    // Start processing queue
    this.startQueueProcessor();
    
    // Set up automatic tracking
    this.setupAutoTracking();
    
    this.isInitialized = true;
    this.emit('initialized');
  }

  track(eventData: AnalyticsEvent): void {
    if (!this.config.enabled || !this.shouldSample()) {
      return;
    }

    let event: AnalyticsEvent;

    // Use appropriate tracker method based on event type
    switch (eventData.type) {
      case 'pageview':
        event = this.eventTracker.trackPageView(eventData.url, eventData.referrer);
        break;
      case 'feature':
        event = this.eventTracker.trackFeature(
          eventData.feature, 
          eventData.action, 
          eventData.value, 
          eventData.metadata
        );
        break;
      case 'conversion':
        event = this.eventTracker.trackConversion(
          eventData.goal, 
          eventData.value, 
          eventData.currency, 
          eventData.metadata
        );
        break;
      case 'performance':
        event = this.eventTracker.trackPerformance(
          eventData.metric, 
          eventData.value, 
          eventData.unit, 
          eventData.metadata
        );
        break;
      case 'error':
        event = this.eventTracker.trackError(
          eventData.error, 
          eventData.severity, 
          eventData.context
        );
        break;
      case 'user':
        event = this.eventTracker.trackUser(
          eventData.action, 
          eventData.metadata
        );
        break;
      case 'custom':
        event = this.eventTracker.trackCustom(
          eventData.name, 
          eventData.data
        );
        break;
      default:
        throw new Error(`Unknown event type: ${eventData.type}`);
    }

    this.eventTracker.addToQueue(event);
    this.metricsCalculator.updateMetrics(event);
    this.updateRealtimeEvents(event);
    this.emit('event', event);
  }

  trackPageView(url: string, referrer?: string): void {
    this.track({ type: 'pageview', url, referrer });
  }

  trackFeature(feature: string, action: string, value?: number | string | boolean, metadata?: Record<string, unknown>): void {
    this.track({ type: 'feature', feature, action, value, metadata });
  }

  trackConversion(goal: string, value?: number, currency?: string, metadata?: Record<string, any>): void {
    this.track({ type: 'conversion', goal, value, currency, metadata });
  }

  trackError(error: Error | string, severity: 'low' | 'medium' | 'high' | 'critical', context?: Record<string, any>): void {
    this.track({ type: 'error', error, severity, context });
  }

  trackPerformance(
    metric: 'page_load' | 'api_response' | 'render_time' | 'interaction_delay',
    value: number,
    unit: 'ms' | 's' = 'ms',
    metadata?: Record<string, any>
  ): void {
    this.track({ type: 'performance', metric, value, unit, metadata });
  }

  identify(userId: string, traits?: Record<string, any>): void {
    this.eventTracker.setUserId(userId);
    this.track({
      type: 'user',
      action: 'profile_update',
      metadata: traits
    });
  }

  getMetrics(): AnalyticsMetrics {
    return this.metricsCalculator.getMetrics();
  }

  getMetric(path: string): unknown {
    const parts = path.split('.');
    let current: unknown = this.getMetrics();
    
    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        return undefined;
      }
    }
    
    return current;
  }

  calculateFunnel(steps: string[]): Record<string, unknown> {
    return this.metricsCalculator.calculateFunnel(steps);
  }

  async query(params: {
    startDate: Date;
    endDate: Date;
    metrics?: string[];
    groupBy?: 'hour' | 'day' | 'week' | 'month';
    filters?: Record<string, any>;
  }): Promise<any> {
    // This would query from your analytics database
    // For now, return mock data
    return {
      data: [],
      summary: this.getMetrics()
    };
  }

  getDashboardData(): DashboardData {
    const allEvents = this.eventTracker.getQueue();
    const metrics = this.getMetrics();
    return this.dashboardGenerator.generateDashboardData(
      allEvents,
      metrics,
      this.realtimeEvents
    );
  }

  private updateRealtimeEvents(event: AnalyticsEvent): void {
    this.realtimeEvents.push(event);
    
    // Keep only last 1000 events for realtime display
    if (this.realtimeEvents.length > 1000) {
      this.realtimeEvents = this.realtimeEvents.slice(-1000);
    }
    
    // Clean up old events (older than 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    this.realtimeEvents = this.realtimeEvents.filter(
      e => e.timestamp >= fiveMinutesAgo
    );
  }

  private async startQueueProcessor(): Promise<void> {
    this.processInterval = setInterval(async () => {
      const queue = this.eventTracker.getQueue();
      if (queue.length === 0) return;

      const events = [...queue];
      this.eventTracker.clearQueue();

      for (const provider of this.providers.values()) {
        try {
          await Promise.all(events.map(event => provider.send(event)));
        } catch (error) {
          logger.error(`Analytics provider ${provider.name} failed:`, error);
        }
      }
    }, this.config.flushInterval || 5000);
  }

  private setupAutoTracking(): void {
    if (typeof window === 'undefined') return;

    // Page views
    let lastUrl = window.location.href;
    const observer = new MutationObserver(() => {
      if (window.location.href !== lastUrl) {
        this.trackPageView(window.location.href, lastUrl);
        lastUrl = window.location.href;
      }
    });
    observer.observe(document, { subtree: true, childList: true });

    // Performance metrics
    if ('PerformanceObserver' in window) {
      const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            this.trackPerformance('page_load', entry.duration, 'ms');
          }
        }
      });
      perfObserver.observe({ entryTypes: ['navigation'] });
    }

    // Errors
    window.addEventListener('error', (event) => {
      this.trackError(
        new Error(event.message),
        'high',
        {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      );
    });
  }

  private shouldSample(): boolean {
    if (!this.config.samplingRate) return true;
    return Math.random() < this.config.samplingRate;
  }

  private generateSessionId(): string {
    return `ses_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  destroy(): void {
    if (this.processInterval) {
      clearInterval(this.processInterval);
    }
    this.removeAllListeners();
  }
}

// Singleton instance
let analyticsInstance: AnalyticsEngine | null = null;

export function initializeAnalytics(config?: Partial<AnalyticsConfig>): AnalyticsEngine {
  if (!analyticsInstance) {
    analyticsInstance = new AnalyticsEngine({
      enabled: true,
      providers: [],
      sampling: { enabled: false, rate: 1 },
      privacy: {
        anonymizeIp: true,
        respectDnt: true,
        cookieless: false
      },
      retention: {
        raw: 90,
        aggregated: 365
      },
      ...config
    });
    analyticsInstance.initialize();
  }
  return analyticsInstance;
}

export function getAnalytics(): AnalyticsEngine {
  if (!analyticsInstance) {
    throw new Error('Analytics not initialized');
  }
  return analyticsInstance;
}