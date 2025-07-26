import { 
  AnalyticsEvent, 
  BaseEvent, 
  DeviceInfo, 
  LocationInfo,
  PageViewEvent,
  FeatureEvent,
  ConversionEvent,
  PerformanceEvent,
  ErrorEvent,
  UserEvent,
  CustomEvent
} from './types';
import { logger } from '@/lib/logger';

export class EventTracker {
  private sessionId: string;
  private userId?: string;
  private eventQueue: AnalyticsEvent[] = [];
  private pageStartTime: number = Date.now();
  private currentUrl: string = '';

  constructor(sessionId: string, userId?: string) {
    this.sessionId = sessionId;
    this.userId = userId;
  }

  setUserId(userId: string): void {
    this.userId = userId;
  }

  trackPageView(url: string, referrer?: string): PageViewEvent {
    const duration = this.currentUrl ? Date.now() - this.pageStartTime : undefined;
    
    const event: PageViewEvent = {
      ...this.createBaseEvent(),
      type: 'pageview',
      url,
      referrer,
      duration,
      exitUrl: this.currentUrl || undefined
    };

    this.currentUrl = url;
    this.pageStartTime = Date.now();
    
    return event;
  }

  trackFeature(feature: string, action: string, value?: any, metadata?: Record<string, any>): FeatureEvent {
    return {
      ...this.createBaseEvent(),
      type: 'feature',
      feature,
      action,
      value,
      metadata
    };
  }

  trackConversion(goal: string, value?: number, currency?: string, metadata?: Record<string, any>): ConversionEvent {
    return {
      ...this.createBaseEvent(),
      type: 'conversion',
      goal,
      value,
      currency,
      metadata
    };
  }

  trackPerformance(metric: 'page_load' | 'api_response' | 'render_time' | 'interaction_delay',
    value: number,
    unit: 'ms' | 's' = 'ms')
    metadata?: Record<string, any>)
  ): PerformanceEvent {
    return {
      ...this.createBaseEvent(),
      type: 'performance',
      metric,
      value,
      unit,
      metadata
    };
  }

  trackError(error: Error | string,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium')
    context?: Record<string, any>)
  ): ErrorEvent {
    const errorObj = error instanceof Error ? {
      message: error.message,
      stack: error.stack,
      code: (error as any).code
    } : {
      message: error
    };

    return {
      ...this.createBaseEvent(),
      type: 'error',
      error: errorObj,
      severity,
      context
    };
  }

  trackUser(action: 'signup' | 'login' | 'logout' | 'profile_update' | 'subscription_change')
    metadata?: Record<string, any>)
  ): UserEvent {
    return {
      ...this.createBaseEvent(),
      type: 'user',
      action,
      metadata
    };
  }

  trackCustom(name: string, data: Record<string, any>): CustomEvent {
    return {
      ...this.createBaseEvent(),
      type: 'custom',
      name,
      data
    };
  }

  private createBaseEvent(): BaseEvent {
    return {
      id: this.generateEventId(),
      timestamp: new Date(),
      sessionId: this.sessionId,
      userId: this.userId,
      deviceInfo: this.getDeviceInfo(),
      location: this.getLocationInfo()
    };
  }

  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
    const isMobile = /Mobile|Android|iPhone|iPad/i.test(ua);
    const isTablet = /iPad|Tablet/i.test(ua);

    return {
      type: isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop',
      os: this.detectOS(ua),
      browser: this.detectBrowser(ua),
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      language: window.navigator.language
    };
  }

  private getLocationInfo(): LocationInfo {
    // In a real implementation, this would use IP geolocation
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

  addToQueue(event: AnalyticsEvent): void {
    this.eventQueue.push(event);
  }

  getQueue(): AnalyticsEvent[] {
    return this.eventQueue;
  }

  clearQueue(): void {
    this.eventQueue = [];
  }
}