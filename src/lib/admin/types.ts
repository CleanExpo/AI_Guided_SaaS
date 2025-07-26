export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
  uptime: string;
  cpuUsage: string;
  memoryUsage: string;
  totalProjects: number;
  activeProjects: number;
  apiCalls: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  recentActivity: Array<{
    type: string;
    message: string;
    timestamp: string;
  }>;
}

export interface AnalyticsData {
  overview: {
    totalUsers: number;
    totalProjects: number;
    totalApiCalls: number;
    revenue: number;
    activeSubscriptions: number;
    churnRate: number;
  };
  userMetrics: {
    newUsers: Array<{ date: string; count: number }>;
    activeUsers: Array<{ date: string; count: number }>;
    retentionRate: number;
    avgSessionDuration: string;
  };
  projectMetrics: {
    projectsCreated: Array<{ date: string; count: number }>;
    projectTypes: Array<{ type: string; count: number; percentage: number }>;
    avgCompletionTime: string;
    successRate: number;
  };
  apiMetrics: {
    apiCalls: Array<{ date: string; count: number }>;
    apiLatency: Array<{ date: string; avg: number; p95: number; p99: number }>;
    errorRate: number;
    topEndpoints: Array<{ endpoint: string; calls: number; avgTime: number }>;
  };
  platformHealth: {
    uptime: number;
    avgResponseTime: number;
    errorRate: number;
    satisfaction: number;
  };
}

export interface UserSearchParams {
  query?: string;
  role?: string;
  status?: 'active' | 'inactive' | 'suspended';
  plan?: string;
  sortBy?: 'created_at' | 'last_login' | 'name' | 'email';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface UserDetails {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  plan: string;
  createdAt: string;
  lastLogin: string;
  projects: number;
  apiCalls: number;
  storage: number;
  subscription?: {
    plan: string;
    status: string;
    nextBilling: string;
    amount: number;
  };
}

export interface SystemDebugInfo {
  environment: {
    nodeVersion: string;
    npmVersion: string;
    platform: string;
    env: string;
  };
  database: {
    connected: boolean;
    latency: number;
    poolSize: number;
    activeConnections: number;
  };
  cache: {
    type: string;
    connected: boolean;
    memory: number;
    hits: number;
    misses: number;
  };
  services: Array<{
    name: string;
    status: 'operational' | 'degraded' | 'down';
    latency: number;
    lastCheck: string;
  }>;
  errors: Array<{
    timestamp: string;
    message: string;
    stack?: string;
    count: number;
  }>;
}

export type TimeRange = '24h' | '7d' | '30d' | '90d';