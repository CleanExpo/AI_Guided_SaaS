import { supabase } from '@/lib/database';
import { logger } from '@/lib/logger';
import type { AnalyticsData, TimeRange } from '../types';

export class AnalyticsQueries {
  static async getAnalytics(range: TimeRange = '7d'): Promise<AnalyticsData> {
    if (!supabase) {
      throw new Error('Database not configured');
    }

    const days = range === '24h' ? 1 : range === '7d' ? 7 : range === '30d' ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    try {
      const [userMetrics, projectMetrics, apiMetrics, revenueMetrics, platformHealth] = 
        await Promise.all([
          this.getUserMetrics(startDate, days),
          this.getProjectMetrics(startDate, days),
          this.getApiMetrics(startDate, days),
          this.getRevenueMetrics(),
          this.getPlatformHealth()
        ]);

      return {
        overview: {
          totalUsers: userMetrics.totalUsers,
          totalProjects: projectMetrics.totalProjects,
          totalApiCalls: apiMetrics.totalCalls,
          revenue: revenueMetrics.totalRevenue,
          activeSubscriptions: revenueMetrics.activeSubscriptions,
          churnRate: revenueMetrics.churnRate
        },
        userMetrics: {
          newUsers: userMetrics.newUsersByDate,
          activeUsers: userMetrics.activeUsersByDate,
          retentionRate: userMetrics.retentionRate,
          avgSessionDuration: userMetrics.avgSessionDuration
        },
        projectMetrics: {
          projectsCreated: projectMetrics.projectsByDate,
          projectTypes: projectMetrics.projectTypes,
          avgCompletionTime: projectMetrics.avgCompletionTime,
          successRate: projectMetrics.successRate
        },
        apiMetrics: {
          apiCalls: apiMetrics.callsByDate,
          apiLatency: apiMetrics.latencyByDate,
          errorRate: apiMetrics.errorRate,
          topEndpoints: apiMetrics.topEndpoints
        },
        platformHealth
      };
    } catch (error) {
      logger.error('Failed to get analytics:', error);
      throw error;
    }
  }

  private static async getUserMetrics(startDate: Date, days: number) {
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    const newUsersByDate = await this.getCountByDate('users', 'created_at', startDate, days);
    const activeUsersByDate = await this.getActiveUsersByDate(startDate, days);
    
    // Calculate retention rate
    const { count: returningUsers } = await supabase
      .from('sessions')
      .select('user_id', { count: 'exact', head: true })
      .gte('created_at', startDate.toISOString());

    const retentionRate = totalUsers ? (returningUsers || 0) / totalUsers * 100 : 0;

    // Get average session duration
    const { data: sessions } = await supabase
      .from('sessions')
      .select('created_at, expires')
      .gte('created_at', startDate.toISOString());

    const avgSessionDuration = this.calculateAvgSessionDuration(sessions || []);

    return {
      totalUsers: totalUsers || 0,
      newUsersByDate,
      activeUsersByDate,
      retentionRate,
      avgSessionDuration
    };
  }

  private static async getProjectMetrics(startDate: Date, days: number) {
    const { count: totalProjects } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true });

    const projectsByDate = await this.getCountByDate('projects', 'created_at', startDate, days);
    
    // Get project types distribution
    const { data: projects } = await supabase
      .from('projects')
      .select('type')
      .gte('created_at', startDate.toISOString());

    const projectTypes = this.calculateTypeDistribution(projects || []);

    // Calculate success rate and completion time
    const { data: completedProjects } = await supabase
      .from('projects')
      .select('created_at, updated_at, status')
      .in('status', ['completed', 'deployed']);

    const avgCompletionTime = this.calculateAvgCompletionTime(completedProjects || []);
    const successRate = totalProjects ? (completedProjects?.length || 0) / totalProjects * 100 : 0;

    return {
      totalProjects: totalProjects || 0,
      projectsByDate,
      projectTypes,
      avgCompletionTime,
      successRate
    };
  }

  private static async getApiMetrics(startDate: Date, days: number) {
    const { count: totalCalls } = await supabase
      .from('activity_logs')
      .select('*', { count: 'exact', head: true })
      .eq('action', 'api_call')
      .gte('created_at', startDate.toISOString());

    const callsByDate = await this.getCountByDate(
      'activity_logs', 
      'created_at', 
      startDate, 
      days,
      { action: 'api_call' }
    );

    // Get latency metrics
    const { data: apiLogs } = await supabase
      .from('activity_logs')
      .select('created_at, details')
      .eq('action', 'api_call')
      .gte('created_at', startDate.toISOString());

    const latencyByDate = this.calculateLatencyMetrics(apiLogs || [], days);

    // Calculate error rate
    const { count: errorCount } = await supabase
      .from('activity_logs')
      .select('*', { count: 'exact', head: true })
      .eq('action', 'api_error')
      .gte('created_at', startDate.toISOString());

    const errorRate = totalCalls ? (errorCount || 0) / totalCalls * 100 : 0;

    // Get top endpoints
    const topEndpoints = await this.getTopEndpoints(startDate);

    return {
      totalCalls: totalCalls || 0,
      callsByDate,
      latencyByDate,
      errorRate,
      topEndpoints
    };
  }

  private static async getRevenueMetrics() {
    const { data: subscriptions } = await supabase
      .from('subscriptions')
      .select('status, plan, amount');

    const activeSubscriptions = subscriptions?.filter(s => s.status === 'active').length || 0;
    const totalRevenue = subscriptions?.reduce((sum, s) => sum + (s.amount || 0), 0) || 0;

    // Calculate churn rate
    const { count: canceledCount } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'canceled');

    const totalSubs = subscriptions?.length || 1;
    const churnRate = (canceledCount || 0) / totalSubs * 100;

    return {
      totalRevenue,
      activeSubscriptions,
      churnRate
    };
  }

  private static async getPlatformHealth() {
    // Simplified platform health metrics
    return {
      uptime: 99.9,
      avgResponseTime: 145,
      errorRate: 0.5,
      satisfaction: 4.5
    };
  }

  // Helper methods
  private static async getCountByDate(
    table: string,
    dateColumn: string,
    startDate: Date,
    days: number,
    filters?: Record<string, any>
  ) {
    const counts = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      let query = supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
        .gte(dateColumn, date.toISOString())
        .lt(dateColumn, nextDate.toISOString());

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      const { count } = await query;
      
      counts.push({
        date: date.toISOString().split('T')[0],
        count: count || 0
      });
    }

    return counts;
  }

  private static async getActiveUsersByDate(startDate: Date, days: number) {
    const counts = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const { data: sessions } = await supabase
        .from('sessions')
        .select('user_id')
        .gte('created_at', date.toISOString())
        .lt('created_at', nextDate.toISOString());

      const uniqueUsers = new Set(sessions?.map(s => s.user_id) || []).size;
      
      counts.push({
        date: date.toISOString().split('T')[0],
        count: uniqueUsers
      });
    }

    return counts;
  }

  private static calculateAvgSessionDuration(sessions: any[]): string {
    if (sessions.length === 0) return '0m';

    const durations = sessions.map(s => {
      const start = new Date(s.created_at).getTime();
      const end = new Date(s.expires).getTime();
      return end - start;
    });

    const avgMs = durations.reduce((sum, d) => sum + d, 0) / durations.length;
    const avgMinutes = Math.floor(avgMs / 60000);
    
    if (avgMinutes < 60) return `${avgMinutes}m`;
    const hours = Math.floor(avgMinutes / 60);
    const minutes = avgMinutes % 60;
    return `${hours}h ${minutes}m`;
  }

  private static calculateTypeDistribution(projects: any[]) {
    const typeCounts: Record<string, number> = {};
    
    projects.forEach(p => {
      const type = p.type || 'other';
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    const total = projects.length || 1;
    
    return Object.entries(typeCounts).map(([type, count]) => ({
      type,
      count,
      percentage: Math.round(count / total * 100)
    }));
  }

  private static calculateAvgCompletionTime(projects: any[]): string {
    if (projects.length === 0) return '0d';

    const times = projects.map(p => {
      const start = new Date(p.created_at).getTime();
      const end = new Date(p.updated_at).getTime();
      return end - start;
    });

    const avgMs = times.reduce((sum, t) => sum + t, 0) / times.length;
    const avgDays = Math.floor(avgMs / 86400000);
    
    if (avgDays === 0) {
      const avgHours = Math.floor(avgMs / 3600000);
      return `${avgHours}h`;
    }
    return `${avgDays}d`;
  }

  private static calculateLatencyMetrics(apiLogs: any[], days: number) {
    const metrics = [];
    const msPerDay = 86400000;
    const startTime = Date.now() - (days * msPerDay);

    for (let i = 0; i < days; i++) {
      const dayStart = startTime + (i * msPerDay);
      const dayEnd = dayStart + msPerDay;
      
      const dayLogs = apiLogs.filter(log => {
        const time = new Date(log.created_at).getTime();
        return time >= dayStart && time < dayEnd;
      });

      const latencies = dayLogs
        .map(log => log.details?.latency || 0)
        .filter(l => l > 0)
        .sort((a, b) => a - b);

      if (latencies.length > 0) {
        metrics.push({
          date: new Date(dayStart).toISOString().split('T')[0],
          avg: Math.round(latencies.reduce((sum, l) => sum + l, 0) / latencies.length),
          p95: latencies[Math.floor(latencies.length * 0.95)] || 0,
          p99: latencies[Math.floor(latencies.length * 0.99)] || 0
        });
      } else {
        metrics.push({
          date: new Date(dayStart).toISOString().split('T')[0],
          avg: 0,
          p95: 0,
          p99: 0
        });
      }
    }

    return metrics;
  }

  private static async getTopEndpoints(startDate: Date) {
    const { data: apiLogs } = await supabase
      .from('activity_logs')
      .select('details')
      .eq('action', 'api_call')
      .gte('created_at', startDate.toISOString());

    const endpointStats: Record<string, { calls: number; totalTime: number }> = {};

    apiLogs?.forEach(log => {
      const endpoint = log.details?.endpoint || 'unknown';
      const latency = log.details?.latency || 0;
      
      if (!endpointStats[endpoint]) {
        endpointStats[endpoint] = { calls: 0, totalTime: 0 };
      }
      
      endpointStats[endpoint].calls++;
      endpointStats[endpoint].totalTime += latency;
    });

    return Object.entries(endpointStats)
      .map(([endpoint, stats]) => ({
        endpoint,
        calls: stats.calls,
        avgTime: Math.round(stats.totalTime / stats.calls)
      }))
      .sort((a, b) => b.calls - a.calls)
      .slice(0, 10);
  }
}