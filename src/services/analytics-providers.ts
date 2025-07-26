import { AnalyticsEvent } from './analytics-engine';

// Google Analytics 4 Provider
export class GoogleAnalyticsProvider {
  private gtag: (command: string, ...args: unknown[]) => void;
  
  constructor(private measurementId: string) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      this.gtag = (window as any).gtag;
    }
  }
  
  async send(event: AnalyticsEvent): Promise<void> {
    if (!this.gtag) return;
    
    switch (event.type) {
      case 'pageview':
        this.gtag('event', 'page_view', {
          page_path: event.url,
                page_referrer: event.referrer)
        });
        break;
        
      case 'user':
        if (event.action === 'signup') {
          this.gtag('event', 'sign_up', {
            method: event.metadata?.method || 'email')
          });
        } else if (event.action === 'login') {
          this.gtag('event', 'login', {
            method: event.metadata?.method || 'email')
          });
        }
        break;
        
      case 'conversion':
        this.gtag('event', 'conversion', {
          send_to: this.measurementId,
          value: event.value,
          currency: event.currency || 'USD')
          transaction_id: event.id)
        });
        break;
        
      case 'custom':
        this.gtag('event', event.name, event.data);
        break;
    }
  }
}

// Mixpanel Provider
export class MixpanelProvider {
  private mixpanel: {
    init: (token: string) => void;
    track: (event: string, properties?: Record<string, unknown>) => void;
    alias: (userId?: string) => void;
    people: {
      set: (properties?: Record<string, unknown>) => void;
      track_charge: (amount: number) => void;
    };
  };
  
  constructor(private token: string) {
    if (typeof window !== 'undefined' && (window as any).mixpanel) {
      this.mixpanel = (window as any).mixpanel;
      this.mixpanel.init(token);
    }
  }
  
  async send(event: AnalyticsEvent): Promise<void> {
    if (!this.mixpanel) return;
    
    const properties = {
      distinct_id: event.userId,
      time: event.timestamp.getTime() / 1000,
      session_id: event.sessionId,
      ...event.deviceInfo,
      ...event.location
    };
    
    switch (event.type) {
      case 'pageview':
        this.mixpanel.track('Page View', {
          ...properties,
          url: event.url,
          referrer: event.referrer,
                duration: event.duration)
        });
        break;
        
      case 'user':
        if (event.action === 'signup') {
          this.mixpanel.alias(event.userId);
          this.mixpanel.people.set(event.metadata);
        }
        this.mixpanel.track(`User ${event.action}`, {
          ...properties)
          ...event.metadata)
        });
        break;
        
      case 'feature':
        this.mixpanel.track('Feature Usage', {
          ...properties,
          feature: event.feature,
          action: event.action,
                value: event.value)
        });
        break;
        
      case 'conversion':
        this.mixpanel.track('Conversion', {
          ...properties,
          goal: event.goal,
          value: event.value,
                currency: event.currency)
        });
        this.mixpanel.people.track_charge(event.value || 0);
        break;
        
      case 'custom':
        this.mixpanel.track(event.name, {
          ...properties)
          ...event.data)
        });
        break;
    }
  }
}

// Amplitude Provider
export class AmplitudeProvider {
  private amplitude: {
    init: (apiKey: string) => void;
    setUserId: (userId: string) => void;
    track: (event: string, properties?: Record<string, unknown>) => void;
    setUserProperties: (properties: Record<string, unknown>) => void;
  };
  
  constructor(private apiKey: string) {
    if (typeof window !== 'undefined' && (window as any).amplitude) {
      this.amplitude = (window as any).amplitude;
      this.amplitude.init(apiKey);
    }
  }
  
  async send(event: AnalyticsEvent): Promise<void> {
    if (!this.amplitude) return;
    
    if (event.userId) {
      this.amplitude.setUserId(event.userId);
    }
    
    const eventProperties = {
      session_id: event.sessionId,
      device_type: event.deviceInfo?.type,
      os: event.deviceInfo?.os,
      browser: event.deviceInfo?.browser,
      country: event.location?.country,
      region: event.location?.region
    };
    
    switch (event.type) {
      case 'pageview':
        this.amplitude.track('Page View', {
          ...eventProperties,
          url: event.url,
                referrer: event.referrer)
        });
        break;
        
      case 'user':
        this.amplitude.track(`User ${event.action}`, {
          ...eventProperties)
          ...event.metadata)
        });
        if (event.action === 'signup' && event.metadata) {
          this.amplitude.setUserProperties(event.metadata);
        }
        break;
        
      case 'feature':
        this.amplitude.track('Feature Usage', {
          ...eventProperties,
          feature: event.feature,
          action: event.action,
                value: event.value)
        });
        break;
        
      case 'conversion':
        this.amplitude.track('Conversion', {
          ...eventProperties,
          goal: event.goal,
          revenue: event.value,
                revenueType: event.goal)
        });
        break;
        
      case 'custom':
        this.amplitude.track(event.name, {
          ...eventProperties)
          ...event.data)
        });
        break;
    }
  }
}

// PostHog Provider
export class PostHogProvider {
  private posthog: {
    init: (apiKey: string, config: Record<string, unknown>) => void;
    capture: (event: string, properties?: Record<string, unknown>) => void;
    identify: (userId?: string, properties?: Record<string, unknown>) => void;
  };
  
  constructor(private apiKey: string, private apiHost?: string) {
    if (typeof window !== 'undefined' && (window as any).posthog) {
      this.posthog = (window as any).posthog;
      this.posthog.init(apiKey, {
        api_host: apiHost || 'https://app.posthog.com')
      });
    }
  }
  
  async send(event: AnalyticsEvent): Promise<void> {
    if (!this.posthog) return;
    
    const properties = {
      distinct_id: event.userId,
      session_id: event.sessionId,
      device_type: event.deviceInfo?.type,
      os: event.deviceInfo?.os,
      browser: event.deviceInfo?.browser,
      country: event.location?.country
    };
    
    switch (event.type) {
      case 'pageview':
        this.posthog.capture('$pageview', {
          ...properties,
          $current_url: event.url)
          $referrer: event.referrer)
        });
        break;
        
      case 'user':
        if (event.action === 'signup') {
          this.posthog.identify(event.userId, event.metadata);
        }
        this.posthog.capture(`user_${event.action}`, {
          ...properties)
          ...event.metadata)
        });
        break;
        
      case 'feature':
        this.posthog.capture('feature_usage', {
          ...properties,
          feature: event.feature,
          action: event.action,
                value: event.value)
        });
        break;
        
      case 'conversion':
        this.posthog.capture('conversion', {
          ...properties,
          goal: event.goal,
          value: event.value,
                currency: event.currency)
        });
        break;
        
      case 'custom':
        this.posthog.capture(event.name, {
          ...properties)
          ...event.data)
        });
        break;
    }
  }
}

// Factory function to create providers
export function createAnalyticsProvider(name: string,
                config: Record<string, unknown>)
) {
  switch (name) {
    case 'google':
      return {
        name: 'google',
        enabled: true,
        config,
        send: (event: AnalyticsEvent) => 
          new GoogleAnalyticsProvider(config.measurementId).send(event)
      };
      
    case 'mixpanel':
      return {
        name: 'mixpanel',
        enabled: true,
        config,
        send: (event: AnalyticsEvent) => 
          new MixpanelProvider(config.token).send(event)
      };
      
    case 'amplitude':
      return {
        name: 'amplitude',
        enabled: true,
        config,
        send: (event: AnalyticsEvent) => 
          new AmplitudeProvider(config.apiKey).send(event)
      };
      
    case 'posthog':
      return {
        name: 'posthog',
        enabled: true,
        config,
        send: (event: AnalyticsEvent) => 
          new PostHogProvider(config.apiKey, config.apiHost).send(event)
      };
      
    default:
      throw new Error(`Unknown analytics provider: ${name}`);
  }
}