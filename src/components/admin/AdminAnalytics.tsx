'use client'

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Users, Activity, BarChart3, TrendingUp, TrendingDown, Clock, PieChart, LineChart, Globe, Zap, DollarSign, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalyticsData {
  overview: {
    totalUsers: number;
    totalProjects: number;
    totalApiCalls: number;
    revenue: number;
    activeSubscriptions: number;
    churnRate: number;
    apiRateLimit: number;
    activeProjects: number;
  };
  userMetrics: {
    newUsers: Array<{ date: string, count: number }>;
    activeUsers: Array<{ date: string, count: number }>;
    retentionRate: number;
    avgSessionDuration: string;
  };
  projectMetrics: {
    projectsCreated: Array<{ date: string, count: number }>;
    projectTypes: Array<{ type: string, count: number, percentage: number }>;
    avgCompletionTime: string;
    successRate: number;
  };
  apiMetrics: {
    apiCalls: Array<{ date: string, count: number }>;
    apiLatency: Array<{ date: string, avg: number, p95: number, p99: number }>;
    errorRate: number;
    topEndpoints: Array<{ endpoint: string, calls: number, avgTime: number }>;
  };
  platformHealth: {
    uptime: number;
    avgResponseTime: number;
    errorRate: number;
    satisfaction: number;
  };
}

interface AdminAnalyticsProps {
  data: AnalyticsData;
  timeRange: string;
}

export function AdminAnalytics({ data, timeRange }: AdminAnalyticsProps) {
  const [selectedMetric, setSelectedMetric] = useState('users');

  // Simple chart component
  const SimpleLineChart = ({ data, height = 200 }: { data: Array<{ date: string, count: number }>, height?: number }) => {
    const maxValue = Math.max(...data.map(d => d.count));
    const width = 100 / data.length;

    return (
    <div className="relative" style={{ height }}>
        <div className="absolute inset-0 flex items-end justify-between gap-1">
          {data.map((point, index) => {
            const heightPercent = (point.count / maxValue) * 100;
            return (
    <div
                key={index}
                className="bg-gradient-to-t from-purple-500 to-purple-400 rounded-t hover:from-purple-600 hover:to-purple-500 transition-colors relative group"
                style={{ width: `${width}%`, height: `${heightPercent}%` }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {point.count.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-slate-200"></div>
        <div className="absolute bottom-0 left-0 text-xs text-slate-500 -mb-6">
          {data[0]?.date}
        </div>
        <div className="absolute bottom-0 right-0 text-xs text-slate-500 -mb-6">
          {data[data.length - 1]?.date}
        </div>
      </div>
    );
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.overview.revenue)}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-600">+23% from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.overview.activeSubscriptions)}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <span>Churn rate: {data.overview.churnRate}%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total API Calls</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.overview.totalApiCalls)}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <Activity className="h-3 w-3 text-purple-500 mr-1" />
              <span>Error rate: {data.apiMetrics.errorRate}%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Health</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.platformHealth.uptime}%</div>
            <Progress 
              value={data.platformHealth.uptime} 
              className="h-2 mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Metric Selector */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-lg w-fit">
        {['users', 'projects', 'api', 'revenue'].map((metric) => (
          <Button
            key={metric}
            variant={selectedMetric === metric ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedMetric(metric)}
            className="capitalize"
          >
            {metric}
          </Button>
        ))}
      </div>

      {/* User Metrics */}
      {selectedMetric === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>New and active users over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h4 className="text-sm font-medium mb-4">New Users</h4>
                  <SimpleLineChart data={data.userMetrics.newUsers} />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Retention Rate</p>
                    <p className="text-2xl font-bold">{data.userMetrics.retentionRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Session</p>
                    <p className="text-2xl font-bold">{data.userMetrics.avgSessionDuration}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Users</CardTitle>
              <CardDescription>Daily active users trend</CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleLineChart data={data.userMetrics.activeUsers} />
              <div className="mt-6 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Peak Users</span>
                  <span className="font-medium">
                    {Math.max(...data.userMetrics.activeUsers.map(d => d.count)).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Average Users</span>
                  <span className="font-medium">
                    {Math.round(data.userMetrics.activeUsers.reduce((a, b) => a + b.count, 0) / data.userMetrics.activeUsers.length).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Project Metrics */}
      {selectedMetric === 'projects' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Projects Created</CardTitle>
              <CardDescription>Project creation over time</CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleLineChart data={data.projectMetrics.projectsCreated} />
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold">{data.projectMetrics.successRate}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Completion</p>
                  <p className="text-2xl font-bold">{data.projectMetrics.avgCompletionTime}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Types</CardTitle>
              <CardDescription>Distribution of project categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.projectMetrics.projectTypes.map((type) => (
                  <div key={type.type}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium capitalize">{type.type}</span>
                      <span className="text-sm text-muted-foreground">
                        {type.count} ({type.percentage}%)
                      </span>
                    </div>
                    <Progress value={type.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* API Metrics */}
      {selectedMetric === 'api' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Performance</CardTitle>
              <CardDescription>Request volume and latency metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h4 className="text-sm font-medium mb-4">API Calls Volume</h4>
                  <SimpleLineChart data={data.apiMetrics.apiCalls} />
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-4">Top Endpoints</h4>
                  <div className="space-y-3">
                    {data.apiMetrics.topEndpoints.map((endpoint) => (
                      <div key={endpoint.endpoint} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{endpoint.endpoint}</p>
                          <p className="text-xs text-muted-foreground">
                            {endpoint.calls.toLocaleString()} calls • {endpoint.avgTime}ms avg
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="w-32">
                            <Progress 
                              value={(endpoint.calls / Math.max(...data.apiMetrics.topEndpoints.map(e => e.calls))) * 100} 
                              className="h-2"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Average Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{data.platformHealth.avgResponseTime}ms</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {data.platformHealth.avgResponseTime < 200 ? 'Excellent' : 'Good'} performance
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Error Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{data.platformHealth.errorRate}%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {data.platformHealth.errorRate < 1 ? 'Very low' : 'Acceptable'} error rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">User Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{data.platformHealth.satisfaction}%</p>
                <Progress value={data.platformHealth.satisfaction} className="h-2 mt-2" />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Revenue Metrics */}
      {selectedMetric === 'revenue' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Monthly recurring revenue and growth</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">MRR</p>
                    <p className="text-2xl font-bold">{formatCurrency(data.overview.revenue / 12)}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">ARR</p>
                    <p className="text-2xl font-bold">{formatCurrency(data.overview.revenue)}</p>
                  </div>
                </div>
                <div className="pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Revenue Growth</span>
                    <span className="text-sm font-medium text-green-600">+23%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subscription Metrics</CardTitle>
              <CardDescription>Active subscriptions and churn analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Free Tier</span>
                    <span className="text-sm font-medium">842 users</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pro Tier</span>
                    <span className="text-sm font-medium">312 users</span>
                  </div>
                  <Progress value={25} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Enterprise</span>
                    <span className="text-sm font-medium">48 users</span>
                  </div>
                  <Progress value={10} className="h-2" />
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Churn Rate</span>
                    <span className="text-sm font-medium">{data.overview.churnRate}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default AdminAnalytics;
