import {
  AnalyticsEvent,
  AnalyticsMetrics,
  UserMetrics,
  EngagementMetrics,
  PerformanceMetrics,
  ConversionMetrics,
  RevenueMetrics,
  GoalMetric,
  FunnelMetric
} from './types';

export class MetricsCalculator {
  private events: AnalyticsEvent[] = [];
  private metrics: AnalyticsMetrics;

  constructor() {
    this.metrics = this.initializeMetrics();
  }

  private initializeMetrics(): AnalyticsMetrics {
    return {
      users: {
        total: 0,
        active: 0,
        new: 0,
        returning: 0,
        churn: 0,
        retention: 0
      },
      engagement: {
        sessions: 0,
        pageViews: 0,
        avgSessionDuration: 0,
        bounceRate: 0,
        pagesPerSession: 0,
        events: 0
      },
      performance: {
        avgPageLoadTime: 0,
        avgApiResponseTime: 0,
        errorRate: 0,
        uptime: 99.9,
        apdex: 0.9
      },
      conversion: {
        goals: {},
        funnels: {},
        overallRate: 0
      },
      revenue: {
        total: 0,
        mrr: 0,
        arr: 0,
        arpu: 0,
        ltv: 0,
        churnRate: 0
      }
    };
  }

  updateMetrics(event: AnalyticsEvent): void {
    this.events.push(event);

    switch (event.type) {
      case 'user':
        this.updateUserMetrics(event);
        break;
      case 'pageview':
        this.updateEngagementMetrics(event);
        break;
      case 'performance':
        this.updatePerformanceMetrics(event);
        break;
      case 'conversion':
        this.updateConversionMetrics(event);
        break;
      case 'feature':
        this.metrics.engagement.events++;
        break;
      case 'error':
        this.updateErrorMetrics(event);
        break;
    }
  }

  private updateUserMetrics(event: AnalyticsEvent): void {
    if (event.type !== 'user') return;

    if (event.action === 'signup') {
      this.metrics.users.new++;
      this.metrics.users.total++;
    } else if (event.action === 'login') {
      this.metrics.users.active++;
    }
  }

  private updateEngagementMetrics(event: AnalyticsEvent): void {
    if (event.type !== 'pageview') return;

    this.metrics.engagement.pageViews++;
    
    // Update session metrics
    const sessionEvents = this.getSessionEvents(event.sessionId);
    if (sessionEvents.length === 1) {
      this.metrics.engagement.sessions++;
    }

    // Calculate pages per session
    const uniqueSessions = new Set(this.events.map(e => e.sessionId)).size;
    this.metrics.engagement.pagesPerSession = 
      this.metrics.engagement.pageViews / Math.max(uniqueSessions, 1);
  }

  private updatePerformanceMetrics(event: AnalyticsEvent): void {
    if (event.type !== 'performance') return;

    const value = event.unit === 's' ? event.value * 1000 : event.value;

    switch (event.metric) {
      case 'page_load':
        this.updateAverageMetric('avgPageLoadTime', value);
        break;
      case 'api_response':
        this.updateAverageMetric('avgApiResponseTime', value);
        break;
    }

    // Update APDEX score
    this.updateApdex(value);
  }

  private updateConversionMetrics(event: AnalyticsEvent): void {
    if (event.type !== 'conversion') return;

    const goal = event.goal;
    if (!this.metrics.conversion.goals[goal]) {
      this.metrics.conversion.goals[goal] = {
        completions: 0,
        conversionRate: 0,
        value: 0
      };
    }

    this.metrics.conversion.goals[goal].completions++;
    if (event.value) {
      this.metrics.conversion.goals[goal].value += event.value;
    }

    // Update overall conversion rate
    this.updateOverallConversionRate();

    // Update revenue if applicable
    if (event.value) {
      this.metrics.revenue.total += event.value;
      this.updateRevenueMetrics();
    }
  }

  private updateErrorMetrics(event: AnalyticsEvent): void {
    if (event.type !== 'error') return;

    const totalEvents = this.events.length;
    const errorEvents = this.events.filter(e => e.type === 'error').length;
    this.metrics.performance.errorRate = (errorEvents / totalEvents) * 100;
  }

  private updateAverageMetric(metric: keyof PerformanceMetrics, newValue: number): void {
    const currentAvg = this.metrics.performance[metric] as number;
    const count = this.getMetricCount(metric);
    
    this.metrics.performance[metric] = 
      ((currentAvg * count) + newValue) / (count + 1) as any;
  }

  private updateApdex(responseTime: number): void {
    const satisfiedThreshold = 500; // ms
    const toleratedThreshold = 2000; // ms

    let score: number;
    if (responseTime <= satisfiedThreshold) {
      score = 1;
    } else if (responseTime <= toleratedThreshold) {
      score = 0.5;
    } else {
      score = 0;
    }

    const currentApdex = this.metrics.performance.apdex;
    const count = this.getPerformanceEventCount();
    
    this.metrics.performance.apdex = 
      ((currentApdex * count) + score) / (count + 1);
  }

  private updateOverallConversionRate(): void {
    const totalGoals = Object.values(this.metrics.conversion.goals)
      .reduce((sum, goal) => sum + goal.completions, 0);
    
    const uniqueUsers = new Set(this.events.map(e => e.userId || e.sessionId)).size;
    
    this.metrics.conversion.overallRate = 
      uniqueUsers > 0 ? (totalGoals / uniqueUsers) * 100 : 0;
  }

  private updateRevenueMetrics(): void {
    const activeUsers = this.metrics.users.active || 1;
    
    this.metrics.revenue.arpu = this.metrics.revenue.total / activeUsers;
    this.metrics.revenue.mrr = this.metrics.revenue.total / 12; // Simplified
    this.metrics.revenue.arr = this.metrics.revenue.mrr * 12;
    
    // Simplified LTV calculation
    const avgChurnRate = this.metrics.revenue.churnRate || 5;
    this.metrics.revenue.ltv = this.metrics.revenue.arpu / (avgChurnRate / 100);
  }

  private getSessionEvents(sessionId: string): AnalyticsEvent[] {
    return this.events.filter(e => e.sessionId === sessionId);
  }

  private getMetricCount(metric: string): number {
    return this.events.filter(e => 
      e.type === 'performance' && e.metric === metric.replace('avg', '').toLowerCase()
    ).length;
  }

  private getPerformanceEventCount(): number {
    return this.events.filter(e => e.type === 'performance').length;
  }

  getMetrics(): AnalyticsMetrics {
    return this.metrics;
  }

  calculateFunnel(steps: string[]): FunnelMetric {
    const funnel: FunnelMetric = {
      steps: [],
      overallConversion: 0,
      dropoffRates: []
    };

    let previousUsers = 0;
    
    steps.forEach((step, index) => {
      const users = this.getUsersAtStep(step);
      const conversionRate = index === 0 ? 100 : 
        previousUsers > 0 ? (users / previousUsers) * 100 : 0;
      
      funnel.steps.push({
        name: step,
        users,
        conversionRate
      });

      if (index > 0) {
        const dropoffRate = 100 - conversionRate;
        funnel.dropoffRates.push(dropoffRate);
      }

      previousUsers = users;
    });

    // Overall conversion from first to last step
    if (funnel.steps.length > 0) {
      const firstStep = funnel.steps[0].users;
      const lastStep = funnel.steps[funnel.steps.length - 1].users;
      funnel.overallConversion = firstStep > 0 ? (lastStep / firstStep) * 100 : 0;
    }

    return funnel;
  }

  private getUsersAtStep(step: string): number {
    // Simplified: count unique users who triggered events related to this step
    const stepEvents = this.events.filter(e => 
      (e.type === 'feature' && e.feature === step) ||
      (e.type === 'pageview' && e.url.includes(step)) ||
      (e.type === 'conversion' && e.goal === step)
    );

    return new Set(stepEvents.map(e => e.userId || e.sessionId)).size;
  }
}