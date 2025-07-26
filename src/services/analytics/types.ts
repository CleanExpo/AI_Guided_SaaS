// Analytics event types
export type AnalyticsEvent = 
  | UserEvent
  | PageViewEvent
  | FeatureEvent
  | ConversionEvent
  | PerformanceEvent
  | ErrorEvent
  | CustomEvent;

export interface BaseEvent {
  id: string;
  timestamp: Date;
  sessionId: string;
  userId?: string;
  deviceInfo?: DeviceInfo;
  location?: LocationInfo;
}

export interface UserEvent extends BaseEvent {
  type: 'user';
  action: 'signup' | 'login' | 'logout' | 'profile_update' | 'subscription_change';
  metadata?: Record<string, unknown>;
}

export interface PageViewEvent extends BaseEvent {
  type: 'pageview';
  url: string;
  referrer?: string;
  duration?: number;
  exitUrl?: string;
}

export interface FeatureEvent extends BaseEvent {
  type: 'feature';
  feature: string;
  action: string;
  value?: number | string | boolean;
  metadata?: Record<string, unknown>;
}

export interface ConversionEvent extends BaseEvent {
  type: 'conversion';
  goal: string;
  value?: number;
  currency?: string;
  metadata?: Record<string, unknown>;
}

export interface PerformanceEvent extends BaseEvent {
  type: 'performance';
  metric: 'page_load' | 'api_response' | 'render_time' | 'interaction_delay';
  value: number;
  unit: 'ms' | 's';
  metadata?: Record<string, unknown>;
}

export interface ErrorEvent extends BaseEvent {
  type: 'error';
  error: {
    message: string;
    stack?: string;
    code?: string;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: Record<string, unknown>;
}

export interface CustomEvent extends BaseEvent {
  type: 'custom';
  name: string;
  data: Record<string, unknown>;
}

export interface DeviceInfo {
  type: 'desktop' | 'mobile' | 'tablet';
  os: string;
  browser: string;
  screenResolution: string;
  language: string;
}

export interface LocationInfo {
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

export interface UserMetrics {
  total: number;
  active: number;
  new: number;
  returning: number;
  churn: number;
  retention: number;
}

export interface EngagementMetrics {
  sessions: number;
  pageViews: number;
  avgSessionDuration: number;
  bounceRate: number;
  pagesPerSession: number;
  events: number;
}

export interface PerformanceMetrics {
  avgPageLoadTime: number;
  avgApiResponseTime: number;
  errorRate: number;
  uptime: number;
  apdex: number;
}

export interface ConversionMetrics {
  goals: Record<string, GoalMetric>;
  funnels: Record<string, FunnelMetric>;
  overallRate: number;
}

export interface GoalMetric {
  completions: number;
  conversionRate: number;
  value: number;
}

export interface FunnelMetric {
  steps: FunnelStep[];
  overallConversion: number;
  dropoffRates: number[];
}

export interface FunnelStep {
  name: string;
  users: number;
  conversionRate: number;
}

export interface RevenueMetrics {
  total: number;
  mrr: number;
  arr: number;
  arpu: number;
  ltv: number;
  churnRate: number;
}

// Configuration
export interface AnalyticsConfig {
  enabled: boolean;
  debug: boolean;
  endpoint?: string;
  apiKey?: string;
  batchSize: number;
  flushInterval: number;
  sessionTimeout: number;
  cookieName: string;
  anonymizeIp: boolean;
  respectDNT: boolean;
  samplingRate: number;
  customDimensions?: Record<string, string>;
  excludeUrls?: RegExp[];
  excludeEvents?: string[];
}

// Dashboard data
export interface DashboardData {
  overview: {
    users: number;
    sessions: number;
    pageViews: number;
    bounceRate: number;
    avgSessionDuration: number;
  };
  trends: {
    users: number[];
    revenue: number[];
    conversions: number[];
  };
  top: {
    pages: Array<{ url: string; views: number }>;
    referrers: Array<{ source: string; visits: number }>;
    countries: Array<{ country: string; users: number }>;
    features: Array<{ name: string; usage: number }>;
    errors: Array<{ message: string; count: number }>;
  };
  realtime: {
    activeUsers: number;
    currentPageViews: Record<string, number>;
    recentEvents: AnalyticsEvent[];
  };
}

export interface AnalyticsProvider {
  name: string;
  initialize(config: Record<string, unknown>): Promise<void>;
  track(event: AnalyticsEvent): Promise<void>;
  identify(userId: string, traits?: Record<string, unknown>): Promise<void>;
  page(properties?: Record<string, unknown>): Promise<void>;
  flush(): Promise<void>;
}