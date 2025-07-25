import { EventEmitter } from 'events';

// Analytics event types
export type AnalyticsEvent = 
  | UserEvent
  | PageViewEvent
  | FeatureEvent
  | ConversionEvent
  | PerformanceEvent
  | ErrorEvent
  | CustomEvent;

interface BaseEvent {
  id: string;
  timestamp: Date;
  sessionId: string;
  userId?: string;
  deviceInfo?: DeviceInfo;
  location?: LocationInfo;
}

interface UserEvent extends BaseEvent {
  type: 'user';
  action: 'signup' | 'login' | 'logout' | 'profile_update' | 'subscription_change';
  metadata?: Record<string, any>;
}

interface PageViewEvent extends BaseEvent {
  type: 'pageview';
  url: string;
  referrer?: string;
  duration?: number;
  exitUrl?: string;
}

interface FeatureEvent extends BaseEvent {
  type: 'feature';
  feature: string;
  action: string;
  value?: any;
  metadata?: Record<string, any>;
}

interface ConversionEvent extends BaseEvent {
  type: 'conversion';
  goal: string;
  value?: number;
  currency?: string;
  metadata?: Record<string, any>;
}

interface PerformanceEvent extends BaseEvent {
  type: 'performance';
  metric: 'page_load' | 'api_response' | 'render_time' | 'interaction_delay';
  value: number;
  unit: 'ms' | 's';
  metadata?: Record<string, any>;
}

interface ErrorEvent extends BaseEvent {
  type: 'error';
  error: {
    message: string;
    stack?: string;
    code?: string;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: Record<string, any>;
}

interface CustomEvent extends BaseEvent {
  type: 'custom';
  name: string;
  data: Record<string, any>;
}

interface DeviceInfo {
  type: 'desktop' | 'mobile' | 'tablet';
  os: string;
  browser: string;
  screenResolution: string;
  language: string;
}

interface LocationInfo {
  country?: string;
  region?: string;
  city?: string;
  timezone?: string;
}

// Analytics metrics
export interface AnalyticsMetrics {
  users: UserMetrics;
  engagement: EngagementMetrics;
  performance: PerformanceMetrics;
  conversion: ConversionMetrics;
  revenue: RevenueMetrics;
}

interface UserMetrics {
  total: number;
  active: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  new: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  retention: {
    day1: number;
    day7: number;
    day30: number;
  };
  churn: number;
}

interface EngagementMetrics {
  sessions: {
    total: number;
    average: number;
    duration: number;
  };
  pageViews: {
    total: number;
    perSession: number;
    unique: number;
  };
  bounceRate: number;
  features: {
    [key: string]: {
      usage: number;
      uniqueUsers: number;
      avgTime: number;
    };
  };
}

interface PerformanceMetrics {
  pageLoad: {
    average: number;
    median: number;
    p95: number;
  };
  apiLatency: {
    average: number;
    median: number;
    p95: number;
  };
  errors: {
    total: number;
    rate: number;
    bySeverity: Record<string, number>;
  };
  uptime: number;
}

interface ConversionMetrics {
  funnel: {
    [stage: string]: {
      visitors: number;
      conversions: number;
      rate: number;
    };
  };
  goals: {
    [goal: string]: {
      conversions: number;
      value: number;
      rate: number;
    };
  };
}

interface RevenueMetrics {
  total: number;
  mrr: number;
  arr: number;
  arpu: number;
  ltv: number;
  byPlan: Record<string, number>;
  growth: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}

// Analytics configuration
interface AnalyticsConfig {
  enabled: boolean;
  providers: AnalyticsProvider[];
  sampling: {
    enabled: boolean;
    rate: number;
  };
  privacy: {
    anonymizeIp: boolean;
    respectDnt: boolean;
    cookieless: boolean;
  };
  retention: {
    raw: number; // Days to keep raw events
    aggregated: number; // Days to keep aggregated data
  };
}

interface AnalyticsProvider {
  name: string;
  enabled: boolean;
  config: Record<string, any>;
  send: (event: AnalyticsEvent) => Promise<void>;
}

// Main Analytics Engine
export class AnalyticsEngine extends EventEmitter {
  private config: AnalyticsConfig;
  private providers: Map<string, AnalyticsProvider> = new Map();
  private sessionId: string;
  private userId?: string;
  private eventQueue: AnalyticsEvent[] = [];
  private metrics: AnalyticsMetrics;
  private isInitialized: boolean = false;

  constructor(config: AnalyticsConfig) {
    super();
    this.config = config;
    this.sessionId = this.generateSessionId();
    this.metrics = this.initializeMetrics();
  }

  async initialize(): Promise<void> {
    if (!this.config.enabled) {
      console.log('Analytics disabled');
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

  // Track events
  track(event: Omit<AnalyticsEvent, 'id' | 'timestamp' | 'sessionId'>): void {
    if (!this.config.enabled || !this.shouldSample()) {
      return;
    }

    const fullEvent: AnalyticsEvent = {
      ...event,
      id: this.generateEventId(),
      timestamp: new Date(),
      sessionId: this.sessionId,
      userId: this.userId,
      deviceInfo: this.getDeviceInfo(),
      location: this.getLocationInfo()
    } as AnalyticsEvent;

    this.eventQueue.push(fullEvent);
    this.updateMetrics(fullEvent);
    this.emit('event', fullEvent);
  }

  // Convenience methods
  trackPageView(url: string, referrer?: string): void {
    this.track({
      type: 'pageview',
      url,
      referrer
    });
  }

  trackFeature(feature: string, action: string, value?: any): void {
    this.track({
      type: 'feature',
      feature,
      action,
      value
    });
  }

  trackConversion(goal: string, value?: number, currency?: string): void {
    this.track({
      type: 'conversion',
      goal,
      value,
      currency
    });
  }

  trackError(error: Error, severity: 'low' | 'medium' | 'high' | 'critical', context?: Record<string, any>): void {
    this.track({
      type: 'error',
      error: {
        message: error.message,
        stack: error.stack,
        code: (error as any).code
      },
      severity,
      context
    });
  }

  // User identification
  identify(userId: string, traits?: Record<string, any>): void {
    this.userId = userId;
    this.track({
      type: 'user',
      action: 'profile_update',
      metadata: traits
    });
  }

  // Get current metrics
  getMetrics(): AnalyticsMetrics {
    return { ...this.metrics };
  }

  // Get specific metric
  getMetric(path: string): any {
    const parts = path.split('.');
    let current: any = this.metrics;
    
    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        return undefined;
      }
    }
    
    return current;
  }

  // Query historical data
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
      summary: this.metrics
    };
  }

  // Real-time dashboard data
  getDashboardData(): {
    realtime: {
      activeUsers: number;
      pageViews: number;
      events: number;
    };
    trends: {
      users: number[];
      revenue: number[];
      conversions: number[];
    };
    top: {
      pages: Array<{ url: string; views: number }>;
      features: Array<{ name: string; usage: number }>;
      errors: Array<{ message: string; count: number }>;
    };
  } {
    return {
      realtime: {
        activeUsers: Math.floor(Math.random() * 100) + 50,
        pageViews: Math.floor(Math.random() * 1000) + 500,
        events: Math.floor(Math.random() * 5000) + 2000
      },
      trends: {
        users: Array(7).fill(0).map(() => Math.floor(Math.random() * 1000) + 500),
        revenue: Array(7).fill(0).map(() => Math.floor(Math.random() * 10000) + 5000),
        conversions: Array(7).fill(0).map(() => Math.floor(Math.random() * 100) + 50)
      },
      top: {
        pages: [
          { url: '/dashboard', views: 1234 },
          { url: '/projects', views: 987 },
          { url: '/settings', views: 654 }
        ],
        features: [
          { name: 'Deploy', usage: 543 },
          { name: 'AI Chat', usage: 432 },
          { name: 'Analytics', usage: 321 }
        ],
        errors: [
          { message: 'API timeout', count: 12 },
          { message: 'Invalid input', count: 8 },
          { message: 'Auth failed', count: 5 }
        ]
      }
    };
  }

  // Private methods
  private initializeMetrics(): AnalyticsMetrics {
    return {
      users: {
        total: 0,
        active: { daily: 0, weekly: 0, monthly: 0 },
        new: { today: 0, thisWeek: 0, thisMonth: 0 },
        retention: { day1: 0, day7: 0, day30: 0 },
        churn: 0
      },
      engagement: {
        sessions: { total: 0, average: 0, duration: 0 },
        pageViews: { total: 0, perSession: 0, unique: 0 },
        bounceRate: 0,
        features: {}
      },
      performance: {
        pageLoad: { average: 0, median: 0, p95: 0 },
        apiLatency: { average: 0, median: 0, p95: 0 },
        errors: { total: 0, rate: 0, bySeverity: {} },
        uptime: 99.9
      },
      conversion: {
        funnel: {},
        goals: {}
      },
      revenue: {
        total: 0,
        mrr: 0,
        arr: 0,
        arpu: 0,
        ltv: 0,
        byPlan: {},
        growth: { daily: 0, weekly: 0, monthly: 0 }
      }
    };
  }

  private updateMetrics(event: AnalyticsEvent): void {
    // Update metrics based on event type
    switch (event.type) {
      case 'pageview':
        this.metrics.engagement.pageViews.total++;
        break;
      case 'user':
        if (event.action === 'signup') {
          this.metrics.users.new.today++;
        }
        break;
      case 'conversion':
        if (!this.metrics.conversion.goals[event.goal]) {
          this.metrics.conversion.goals[event.goal] = {
            conversions: 0,
            value: 0,
            rate: 0
          };
        }
        this.metrics.conversion.goals[event.goal].conversions++;
        if (event.value) {
          this.metrics.conversion.goals[event.goal].value += event.value;
        }
        break;
      case 'error':
        this.metrics.performance.errors.total++;
        this.metrics.performance.errors.bySeverity[event.severity] =
          (this.metrics.performance.errors.bySeverity[event.severity] || 0) + 1;
        break;
    }
  }

  private async startQueueProcessor(): Promise<void> {
    setInterval(async () => {
      if (this.eventQueue.length === 0) return;

      const events = [...this.eventQueue];
      this.eventQueue = [];

      for (const provider of this.providers.values()) {
        try {
          await Promise.all(events.map(event => provider.send(event)));
        } catch (error) {
          console.error(`Analytics provider ${provider.name} failed:`, error);
        }
      }
    }, 5000); // Process every 5 seconds
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
            this.track({
              type: 'performance',
              metric: 'page_load',
              value: entry.duration,
              unit: 'ms'
            });
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
    if (!this.config.sampling.enabled) return true;
    return Math.random() < this.config.sampling.rate;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getDeviceInfo(): DeviceInfo {
    if (typeof window === 'undefined') {
      return {
        type: 'desktop',
        os: 'unknown',
        browser: 'unknown',
        screenResolution: 'unknown',
        language: 'en'
      };
    }

    const ua = window.navigator.userAgent;
    const isMobile = /Mobile|Android|iPhone/i.test(ua);
    const isTablet = /Tablet|iPad/i.test(ua);

    return {
      type: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
      os: this.detectOS(ua),
      browser: this.detectBrowser(ua),
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      language: window.navigator.language
    };
  }

  private getLocationInfo(): LocationInfo {
    // This would typically use IP geolocation
    return {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  }

  private detectOS(ua: string): string {
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Mac')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS')) return 'iOS';
    return 'Unknown';
  }

  private detectBrowser(ua: string): string {
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Unknown';
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