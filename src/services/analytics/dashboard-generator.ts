import { 
  AnalyticsEvent, 
  DashboardData, 
  AnalyticsMetrics 
} from './types';

export class DashboardGenerator {
  generateDashboardData(
    events: AnalyticsEvent[], 
    metrics: AnalyticsMetrics,
    realtimeEvents: AnalyticsEvent[]
  ): DashboardData {
    return {
      overview: this.generateOverview(metrics),
      trends: this.generateTrends(events),
      top: this.generateTopStats(events),
      realtime: this.generateRealtimeStats(realtimeEvents)
    };
  }

  private generateOverview(metrics: AnalyticsMetrics): DashboardData['overview'] {
    return {
      users: metrics.users.active,
      sessions: metrics.engagement.sessions,
      pageViews: metrics.engagement.pageViews,
      bounceRate: metrics.engagement.bounceRate,
      avgSessionDuration: metrics.engagement.avgSessionDuration
    };
  }

  private generateTrends(events: AnalyticsEvent[]): DashboardData['trends'] {
    // Generate 7-day trends
    const days = 7;
    const users: number[] = [];
    const revenue: number[] = [];
    const conversions: number[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const dayStart = new Date();
      dayStart.setDate(dayStart.getDate() - i);
      dayStart.setHours(0, 0, 0, 0);
      
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const dayEvents = events.filter(e => 
        e.timestamp >= dayStart && e.timestamp <= dayEnd
      );

      // Count unique users
      const uniqueUsers = new Set(
        dayEvents.map(e => e.userId || e.sessionId)
      ).size;
      users.push(uniqueUsers);

      // Sum revenue
      const dayRevenue = dayEvents
        .filter(e => e.type === 'conversion' && e.value)
        .reduce((sum, e) => sum + (e.value || 0), 0);
      revenue.push(dayRevenue);

      // Count conversions
      const dayConversions = dayEvents
        .filter(e => e.type === 'conversion').length;
      conversions.push(dayConversions);
    }

    return { users, revenue, conversions };
  }

  private generateTopStats(events: AnalyticsEvent[]): DashboardData['top'] {
    return {
      pages: this.getTopPages(events),
      referrers: this.getTopReferrers(events),
      countries: this.getTopCountries(events),
      features: this.getTopFeatures(events),
      errors: this.getTopErrors(events)
    };
  }

  private getTopPages(events: AnalyticsEvent[]): Array<{ url: string; views: number }> {
    const pageViews = events.filter(e => e.type === 'pageview');
    const pageCounts = new Map<string, number>();

    pageViews.forEach(event => {
      if (event.type === 'pageview') {
        const count = pageCounts.get(event.url) || 0;
        pageCounts.set(event.url, count + 1);
      }
    });

    return Array.from(pageCounts.entries())
      .map(([url, views]) => ({ url, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);
  }

  private getTopReferrers(events: AnalyticsEvent[]): Array<{ source: string; visits: number }> {
    const pageViews = events.filter(e => e.type === 'pageview');
    const referrerCounts = new Map<string, number>();

    pageViews.forEach(event => {
      if (event.type === 'pageview' && event.referrer) {
        const source = this.extractDomain(event.referrer);
        const count = referrerCounts.get(source) || 0;
        referrerCounts.set(source, count + 1);
      }
    });

    return Array.from(referrerCounts.entries())
      .map(([source, visits]) => ({ source, visits }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 10);
  }

  private getTopCountries(events: AnalyticsEvent[]): Array<{ country: string; users: number }> {
    const countryCounts = new Map<string, Set<string>>();

    events.forEach(event => {
      const country = event.location?.country || 'Unknown';
      const userId = event.userId || event.sessionId;
      
      if (!countryCounts.has(country)) {
        countryCounts.set(country, new Set());
      }
      countryCounts.get(country)!.add(userId);
    });

    return Array.from(countryCounts.entries())
      .map(([country, userSet]) => ({ country, users: userSet.size }))
      .sort((a, b) => b.users - a.users)
      .slice(0, 10);
  }

  private getTopFeatures(events: AnalyticsEvent[]): Array<{ name: string; usage: number }> {
    const featureEvents = events.filter(e => e.type === 'feature');
    const featureCounts = new Map<string, number>();

    featureEvents.forEach(event => {
      if (event.type === 'feature') {
        const count = featureCounts.get(event.feature) || 0;
        featureCounts.set(event.feature, count + 1);
      }
    });

    return Array.from(featureCounts.entries())
      .map(([name, usage]) => ({ name, usage }))
      .sort((a, b) => b.usage - a.usage)
      .slice(0, 10);
  }

  private getTopErrors(events: AnalyticsEvent[]): Array<{ message: string; count: number }> {
    const errorEvents = events.filter(e => e.type === 'error');
    const errorCounts = new Map<string, number>();

    errorEvents.forEach(event => {
      if (event.type === 'error') {
        const message = event.error.message;
        const count = errorCounts.get(message) || 0;
        errorCounts.set(message, count + 1);
      }
    });

    return Array.from(errorCounts.entries())
      .map(([message, count]) => ({ message, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  private generateRealtimeStats(events: AnalyticsEvent[]): DashboardData['realtime'] {
    // Get events from last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const recentEvents = events.filter(e => e.timestamp >= fiveMinutesAgo);

    // Count active users
    const activeUsers = new Set(
      recentEvents.map(e => e.userId || e.sessionId)
    ).size;

    // Count current page views
    const currentPageViews: Record<string, number> = {};
    const pageViewEvents = recentEvents.filter(e => e.type === 'pageview');
    
    pageViewEvents.forEach(event => {
      if (event.type === 'pageview') {
        currentPageViews[event.url] = (currentPageViews[event.url] || 0) + 1;
      }
    });

    return {
      activeUsers,
      currentPageViews,
      recentEvents: recentEvents.slice(-20) // Last 20 events
    };
  }

  private extractDomain(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return 'direct';
    }
  }
}