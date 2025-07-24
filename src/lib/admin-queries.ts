/* BREADCRUMB: library - Shared library code */;
import { supabase } from './database';
import { User, Project, Subscription, ActivityLog, UsageRecord, DatabaseService } from './database';
export interface AdminStats {
  totalUsers: number,
  activeUsers: number,
  newUsersToday: number,
  newUsersThisWeek: number,
  systemHealth: 'healthy' | 'warning' | 'critical',
  uptime: string,
  cpuUsage: string,
  memoryUsage: string,
  totalProjects: number,
  activeProjects: number,
  apiCalls: {
    today: number,
  thisWeek: number,
  thisMonth: number
  },
  recentActivity: Array<{
    type: string,
    message: string,
    timestamp: string
  }>
}

export interface AnalyticsData {
  overview: {
    totalUsers: number,
  totalProjects: number,
  totalApiCalls: number,
  revenue: number,
  activeSubscriptions: number,
  churnRate: number
  },
  userMetrics: {
    newUsers: Array<{ date: string, count: number }>,
    activeUsers: Array<{ date: string, count: number }>,
    retentionRate: number,
    avgSessionDuration: string
  },
  projectMetrics: {
    projectsCreated: Array<{ date: string, count: number }>,
    projectTypes: Array<{ type: string, count: number, percentage: number }>,
    avgCompletionTime: string,
    successRate: number
  },
  apiMetrics: {
    apiCalls: Array<{ date: string, count: number }>,
    apiLatency: Array<{ date: string, avg: number, p95: number, p99: number }>,
    errorRate: number,
    topEndpoints: Array<{ endpoint: string, calls: number, avgTime: number }>
  },
  platformHealth: {
    uptime: number,
    avgResponseTime: number,
    errorRate: number,
    satisfaction: number
  }
}
export class AdminQueries {
  // Get admin dashboard statistics
  static async getAdminStats(): Promise<AdminStats> {
    if (!supabase) {
      throw new Error('Database not configured')}
    try {
      // Get total users, const { count: totalUsers } = await supabase;
        .from('users');
        .select('*', { count: 'exact', head: true });
      // Get active users (logged in within last 30 days);

const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
const { data: activeSessions }  = await supabase;
        .from('sessions');
        .select('user_id');
        .gte('expires', thirtyDaysAgo.toISOString();

const activeUsers = new Set(activeSessions?.map((s: any) => s.user_id) || []).size;
      // Get new users today;

const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      
const { count: newUsersToday } = await supabase;
        .from('users');
        .select('*', { count: 'exact', head: true });
        .gte('created_at', todayStart.toISOString();
      // Get new users this week;

const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - 7);
      
const { count: newUsersThisWeek } = await supabase;
        .from('users');
        .select('*', { count: 'exact', head: true });
        .gte('created_at', weekStart.toISOString();
      // Get total projects;

const { count: totalProjects } = await supabase;
        .from('projects');
        .select('*', { count: 'exact', head: true });
      // Get active projects (updated within last 7 days);

const { count: activeProjects } = await supabase;
        .from('projects');
        .select('*', { count: 'exact', head: true });
        .gte('updated_at', weekStart.toISOString();
      // Get API calls (from activity logs);

const { count: apiCallsToday }  = await supabase;
        .from('activity_logs');
        .select('*', { count: 'exact', head: true });
        .eq('action', 'api_call');
        .gte('created_at', todayStart.toISOString();

const { count: apiCallsThisWeek } = await supabase;
        .from('activity_logs');
        .select('*', { count: 'exact', head: true });
        .eq('action', 'api_call');
        .gte('created_at', weekStart.toISOString();
      
const monthStart = new Date();
      monthStart.setDate(monthStart.getDate() - 30);
      
const { count: apiCallsThisMonth } = await supabase;
        .from('activity_logs');
        .select('*', { count: 'exact', head: true });
        .eq('action', 'api_call');
        .gte('created_at', monthStart.toISOString();
      // Get recent activity;

const { data: recentActivityData }  = await supabase;
        .from('activity_logs');
        .select('*');
        .order('created_at', { ascending: false });
        .limit(10);

const recentActivity = (recentActivityData || []).map((activity: any) => ({
        type: activity.action,
        message: this.formatActivityMessage(activity),
        timestamp: activity.created_at
      });
      // Calculate system health (simplified for now);

const systemHealth = 'healthy' as const; // TODO: Implement real health checks;

const uptime = '99.9%'; // TODO: Calculate from monitoring data;

const cpuUsage = '45%'; // TODO: Get from system metrics;

const memoryUsage = '62%'; // TODO: Get from system metrics
      return {
        totalUsers: totalUsers || 0;
        activeUsers,
        newUsersToday: newUsersToday || 0,
        newUsersThisWeek: newUsersThisWeek || 0;
        systemHealth,
        uptime,
        cpuUsage,
        memoryUsage,
        totalProjects: totalProjects || 0,
        activeProjects: activeProjects || 0,
        apiCalls: {
          today: apiCallsToday || 0,
          thisWeek: apiCallsThisWeek || 0,
          thisMonth: apiCallsThisMonth || 0
        };
        recentActivity
      }} catch (error) {
      console.error('Error fetching admin stats:', error), throw error}
}
  // Get analytics data for specified time range
  static async getAnalytics(range: string): Promise<any> {
    if (!supabase) {
      throw new Error('Database not configured')};
    const days =;
      range === '24h' ? 1 : range === '7d' ? 7 : range === '30d' ? 30 : 90;
    
const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    try {
      // Get user metrics, const userMetrics = await this.getUserMetrics(startDate, days); // Get project metrics;

const projectMetrics = await this.getProjectMetrics(startDate, days);
      // Get API metrics;

const apiMetrics = await this.getApiMetrics(startDate, days);
      // Get revenue metrics;

const revenueMetrics = await this.getRevenueMetrics();
      // Get platform health;

const platformHealth = await this.getPlatformHealth();
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
        };
        platformHealth
      }} catch (error) {
      console.error('Error fetching, analytics:', error), throw error}
}
  // Get paginated users list with filters
  static async getUsers(params: { page: number, limit: number, search?: string, status?: string, sortBy?: string, sortOrder?: 'asc' | 'desc' }): Promise<any> {
    if (!supabase) {
      throw new Error('Database not configured')}
    const { page,
      limit,
      search,
      status,;
      sortBy  = 'created_at', sortOrder = 'desc'} = params;

const offset = (page - 1) * limit;
    try {
      let query = supabase.from('users').select('*', { count: 'exact' });
      // Apply search filter;
if (search) {
        query = query.or(`email.ilike.%${search}%,name.ilike.%${search}%`)
}
      // Apply status filter (active = has valid session);
if (status && status !== 'all') {
        // This is simplified - in production, you'd join with sessions table
        // For now, we'll use a placeholder
}
      // Apply sorting;
query = query.order(sortBy, { ascending: sortOrder === 'asc' });
      // Apply pagination;
query = query.range(offset, offset + limit - 1);
      
const { data: users, count, error   }: any = await query;
      if (error) throw error;
      // Enrich user data with additional information;

const enrichedUsers = await Promise.all(
        (users || []).map(async (user: any) => {
          // Get user's project count, const { count: projectsCount   }: any = await supabase!;
            .from('projects');
            .select('*', { count: 'exact', head: true });
            .eq('user_id', user.id);
          // Get user's API usage;

const { count: apiCalls   }: any = await supabase!;
            .from('activity_logs');
            .select('*', { count: 'exact', head: true });
            .eq('user_id', user.id);
            .eq('action', 'api_call');
          // Get subscription status;

const { data: subscription   }: any = await supabase!;
            .from('subscriptions');
            .select('status, price_id');
            .eq('user_id', user.id);
            .single();
          // Determine user status and role;

const lastSession = await supabase!;
            .from('sessions');
            .select('expires');
            .eq('user_id', user.id);
            .order('expires', { ascending: false });
            .limit(1);
            .single();
          
const sessionData  = lastSession?.data;

const isActive =;
            sessionData?.expires && new Date(sessionData.expires) > new Date();
          return {
            id: user.id,
    email: user.email,
    name: user.name || 'Unnamed User',
    status: isActive ? 'active' : 'inactive',
            role: subscription?.status === 'active' ? 'premium' : 'free',
            createdAt: user.created_at,
    lastLogin: sessionData?.expires || user.created_at,
    projectsCount: projectsCount || 0,
    apiCalls: apiCalls || 0
          }});
      return {
        users: enrichedUsers,
            pagination: {
                    page;
                    limit,
          total: count || 0,
              totalPages: Math.ceil((count || 0) / limit)} catch (error) {
      console.error('Error fetching, users:', error), throw error}
}
  // Get single user details
  static async getUserById(userId: string): Promise<any> {
    if (!supabase) {
      throw new Error('Database not configured')}
    try {
      // Get user data, const { data: user, error }: any = await supabase;
        .from('users');
        .select('*');
        .eq('id', userId);
        .single();
      if (error || !user) throw error || new Error('User not found');
      // Get user's projects;

const { data: projects   }: any = await supabase;
        .from('projects');
        .select('*');
        .eq('user_id', userId);
        .order('created_at', { ascending: false });
        .limit(5);
      // Get subscription details;

const { data: subscription   }: any = await supabase;
        .from('subscriptions');
        .select('*');
        .eq('user_id', userId);
        .single();
      // Get recent activity;

const { data: recentActivity   }: any = await supabase;
        .from('activity_logs');
        .select('*');
        .eq('user_id', userId);
        .order('created_at', { ascending: false });
        .limit(10);
      // Get usage stats;

const { count: totalApiCalls   }: any = await supabase;
        .from('activity_logs');
        .select('*', { count: 'exact', head: true });
        .eq('user_id', userId);
        .eq('action', 'api_call');
      return {
        ...user,
            profile: {
            bio: user.bio || 'No bio provided',
              avatar: user.image,
              location: user.location || 'Not specified',
              company: user.company || 'Not specified'
            },
        subscription: subscription?.data || {
          plan: 'free',
          status: 'active',
          expiresAt: null
        },
        projects: projects || [],
    recentActivity: recentActivity || [],
            stats: {
                    totalProjects: projects?.length || 0,
              totalApiCalls: totalApiCalls || 0
                 }} catch (error) {
      console.error('Error fetching user details:', error), throw error}
}
  // Helper methods
  private static formatActivityMessage(activity: ActivityLog) {
    const messages: Record<string, string> = {
      user_signup: 'New user signed up',
      project_created: 'Created a new project',
      api_call: 'Made an API call',
      subscription_updated: 'Updated subscription',
      project_exported: 'Exported a project',
      template_used: 'Used a template'
    };
    return messages[activity.action] || activity.action;
}
  private static async getUserMetrics(startDate: Date, days: number): Promise<any> {
    // Generate daily user metrics, const dates = []; const newUsersByDate = [];
    
const activeUsersByDate = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
const dateStr  = date.toISOString().split('T')[0];

const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      // Get new users for this date;

const { count: newUsers }: any = await supabase!;
        .from('users');
        .select('*', { count: 'exact', head: true });
        .gte('created_at', date.toISOString())
        .lt('created_at', nextDate.toISOString();
      // Get active users for this date;

const { data: sessions }: any  = await supabase!;
        .from('sessions');
        .select('user_id');
        .gte('expires', date.toISOString())
        .lt('expires', nextDate.toISOString();

const activeCount = new Set(sessions?.map((s) => s.user_id) || []).size;
      dates.push(dateStr);
      newUsersByDate.push({
        date: date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
        count: newUsers || 0
      });
      activeUsersByDate.push({
        date: date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
        count: activeCount
  }
}
    // Calculate retention rate (simplified);

const { count: totalUsers }: any  = await supabase!;
      .from('users');
      .select('*', { count: 'exact', head: true });

const retentionRate = totalUsers;
      ? (activeUsersByDate[activeUsersByDate.length - 1].count / totalUsers) *;
100
      : 0,
        return {
      totalUsers: totalUsers || 0;
      newUsersByDate,
      activeUsersByDate,
      retentionRate: Math.round(retentionRate * 10) / 10,
    avgSessionDuration: '12m 34s' // TODO: Calculate from real session data
  }
}
  private static async getProjectMetrics(startDate: Date, days: number): Promise<any> {
    // Get total projects, const { count: totalProjects   }: any = await supabase!
      .from('projects');
      .select('*', { count: 'exact', head: true });
    // Generate daily project creation metrics;

const projectsByDate = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate), date.setDate(date.getDate() + i), const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
const { count   }: any = await supabase!;
        .from('projects');
        .select('*', { count: 'exact', head: true });
        .gte('created_at', date.toISOString())
        .lt('created_at', nextDate.toISOString();
      projectsByDate.push({
        date: date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
        count: count || 0
      })
}
    // Get project types distribution;

const { data: projects   }: any  = await supabase!.from('projects').select('type');

const typeCounts: Record<string, any> = {};
    projects?.forEach((p) => {
      const type = p.type || 'web', typeCounts[type] = (typeCounts[type] || 0) + 1});
    
const projectTypes = Object.entries(typeCounts).map(([type, count]) => ({
      type: type.charAt(0).toUpperCase() + type.slice(1), count,
      percentage: totalProjects ? Math.round((count / totalProjects) * 100) : 0;
    }});
    // Calculate success rate (completed projects);

const { count: completedProjects   }: any  = await supabase!;
      .from('projects');
      .select('*', { count: 'exact', head: true });
      .eq('status', 'completed');

const successRate = totalProjects;
      ? Math.round((completedProjects! / totalProjects) * 100)
      : 0;
    return {
            totalProjects: totalProjects || 0;
      projectsByDate,
      projectTypes,
      avgCompletionTime: '2h 15m', // TODO: Calculate from real data
      successRate
  }
}
  private static async getApiMetrics(startDate: Date, days: number): Promise<any> {
    // Generate daily API call metrics, const callsByDate = []; const latencyByDate = [];
    let totalCalls = 0;
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
const { count   }: any  = await supabase!;
        .from('activity_logs');
        .select('*', { count: 'exact', head: true });
        .eq('action', 'api_call');
        .gte('created_at', date.toISOString())
        .lt('created_at', nextDate.toISOString();

const callCount = count || 0;
      totalCalls += callCount;
      callsByDate.push({
        date: date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
        count: callCount
      }};
      // Mock latency data for now
      latencyByDate.push({
        date: date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
},
        avg: Math.floor(Math.random() * 50) + 100,
    p95: Math.floor(Math.random() * 100) + 200,
    p99: Math.floor(Math.random() * 150) + 300
      })
}
    // Get top endpoints (mock for now);

const topEndpoints = [
  {
  endpoint: '/api/chat',
        calls: Math.floor(totalCalls * 0.4),
    avgTime: 145
      },
      {
        endpoint: '/api/generate',
        calls: Math.floor(totalCalls * 0.25),
    avgTime: 2340
      },
      {
        endpoint: '/api/projects',
        calls: Math.floor(totalCalls * 0.15),
    avgTime: 89
      },
      {
        endpoint: '/api/auth',
        calls: Math.floor(totalCalls * 0.12),
    avgTime: 56
      },
      {
        endpoint: '/api/export',
        calls: Math.floor(totalCalls * 0.08),
    avgTime: 1240
      }}];
    return {
      totalCalls,
      callsByDate,
      latencyByDate,
      errorRate: 0.12, // TODO: Calculate from real error logs
      topEndpoints
  }
}
  private static async getRevenueMetrics(): Promise<any> {
    // Get active subscriptions, const { count: activeSubscriptions   }: any = await supabase!;
      .from('subscriptions');
      .select('*', { count: 'exact', head: true });
      .eq('status', 'active');
    // Get total revenue (simplified calculation);

const { data: payments   }: any  = await supabase!;
      .from('payments');
      .select('amount');
      .eq('status', 'succeeded');

const totalRevenue =;
      payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
    // Calculate churn rate (simplified);

const { count: canceledSubscriptions   }: any  = await supabase!;
      .from('subscriptions');
      .select('*', { count: 'exact', head: true });
      .eq('status', 'canceled');
      .gte(
        'canceled_at',
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

const totalSubs = (activeSubscriptions || 0) + (canceledSubscriptions || 0);
    
const churnRate = totalSubs;
      ? Math.round((canceledSubscriptions! / totalSubs) * 100 * 10) / 10
      : 0;
    return {
            totalRevenue: totalRevenue / 100, // Convert from cents, activeSubscriptions: activeSubscriptions || 0;
            churnRate
  }
}
  private static async getPlatformHealth(): Promise<any> {
    // These would come from real monitoring systems in production
    return {
      uptime: 99.95,
    avgResponseTime: 178,
    errorRate: 0.12,
          satisfaction: 94.7
  }
}
