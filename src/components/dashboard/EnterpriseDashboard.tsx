'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, DollarSign, TrendingUp, Activity, Server, Database, BarChart3, Globe, Zap, Shield, Package } from 'lucide-react';
import { AnalyticsService, PlatformMetrics, UserMetrics, RevenueMetrics, SystemMetrics, ContentMetrics } from '@/lib/analytics';
import { logger } from '@/lib/logger';

interface EnterpriseDashboardProps {
  userRole?: 'admin' | 'user';
}

export default function EnterpriseDashboard({
  userRole = 'user')
}: EnterpriseDashboardProps) {
  const { data: session }: any = useSession();
  void session; // Mark as used for future auth implementation

  const [loading, setLoading] = useState<boolean>(false);
  const [timeRange, setTimeRange] = useState<string>('7d');
  
  const [platformMetrics, setPlatformMetrics] = useState<PlatformMetrics | null>(null);
  const [userMetrics, setUserMetrics] = useState<UserMetrics | null>(null);
  const [revenueMetrics, setRevenueMetrics] = useState<RevenueMetrics | null>(null);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [contentMetrics, setContentMetrics] = useState<ContentMetrics | null>(null);
  const [testMode, setTestMode] = useState<boolean>(false);

  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);
  
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [platform, users, revenue, system, content] = await Promise.all([)
        AnalyticsService.getPlatformMetrics(),
        AnalyticsService.getUserMetrics(timeRange),
        AnalyticsService.getRevenueMetrics(timeRange),
        AnalyticsService.getSystemMetrics(),
        AnalyticsService.getContentMetrics()
      ]);
      setPlatformMetrics(platform);
      setUserMetrics(users);
      setRevenueMetrics(revenue);
      setSystemMetrics(system);
      setContentMetrics(content);
      setTestMode(!AnalyticsService.isConfigured());
    } catch (error) {
      logger.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency')
      currency: 'USD')
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };
  
  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  if (loading) {
    return(<div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Loading enterprise dashboard...</p>
        </div>
      </div>)
    );
  }

  return(<div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold">Enterprise Dashboard</h1>
          <p className="text-gray-600">
            Comprehensive analytics and system monitoring
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <select)
            value={timeRange}>onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <Button onClick={loadDashboardData} variant="outline">
            Refresh
          </Button>
        </div>
      </div>

      {testMode && (
        <Alert>
          <AlertDescription>
            Enterprise dashboard is running in demo mode with mock data. In
            production, this would display real-time analytics from your
            database and monitoring systems.
          </AlertDescription>
        </Alert>
      )}

      {/* Platform Overview */}
      {platformMetrics && (
        <div className="glass grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 glass">
              <CardTitle className="text-sm font-medium glass">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="glass">
              <div className="text-2xl font-bold">
                {formatNumber(platformMetrics.totalUsers)}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatNumber(platformMetrics.activeUsers)} active this month
              </p>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 glass">
              <CardTitle className="text-sm font-medium glass">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="glass">
              <div className="text-2xl font-bold">
                {formatCurrency(platformMetrics.totalRevenue)}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(platformMetrics.monthlyRevenue)} this month
              </p>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 glass">
              <CardTitle className="text-sm font-medium glass">
                Projects Created
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="glass">
              <div className="text-2xl font-bold">
                {formatNumber(platformMetrics.totalProjects)}
              </div>
              <p className="text-xs text-muted-foreground">
                AI-generated projects
              </p>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 glass">
              <CardTitle className="text-sm font-medium glass">
                Conversion Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="glass">
              <div className="text-2xl font-bold">
                {formatPercentage(platformMetrics.conversionRate)}
              </div>
              <p className="text-xs text-muted-foreground">
                Free to paid conversion
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* System Health */}
      {systemMetrics && (
        <Card className="glass">
          <CardHeader className="glass">
            <CardTitle className="flex items-center space-x-2 glass">
              <Activity className="h-5 w-5" />
              <span>System Health</span>
            </CardTitle>
            <CardDescription className="glass">
              Real-time system performance and health metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="glass">
            <div className="glass grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Uptime</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {formatPercentage(systemMetrics.uptime)}
                  </Badge>
                </div>
                <Progress value={systemMetrics.uptime} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Cache Hit Rate</span>
                  <Badge variant="secondary">
                    {formatPercentage(systemMetrics.cacheHitRate)}
                  </Badge>
                </div>
                <Progress value={systemMetrics.cacheHitRate} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Error Rate</span>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    {formatPercentage(systemMetrics.errorRate * 100)}
                  </Badge>
                </div>
                <Progress value={systemMetrics.errorRate * 100} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Response Time</span>
                  <Badge variant="secondary">
                    {systemMetrics.averageResponseTime}ms
                  </Badge>
                </div>
                <div className="text-xs text-gray-500">
                  Average API response
                </div>
              </div>
            </div>

            <div className="glass mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Server className="h-4 w-4 text-blue-500" />
                <span className="text-sm">
                  Active Connections: {systemMetrics.activeConnections}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Database className="h-4 w-4 text-green-500" />
                <span className="text-sm">
                  DB Connections: {systemMetrics.databaseConnections}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-brand-primary-500" />
                <span className="text-sm">
                  Storage: {systemMetrics.storageUsed}GB used
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Admin Actions */}
      {userRole === 'admin' && (
        <Card className="glass">
          <CardHeader className="glass">
            <CardTitle className="flex items-center space-x-2 glass">
              <Shield className="h-5 w-5" />
              <span>Admin Actions</span>
            </CardTitle>
            <CardDescription className="glass">
              Administrative tools and system management
            </CardDescription>
          </CardHeader>
          <CardContent className="glass">
            <div className="glass grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="justify-start">
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
              <Button variant="outline" className="justify-start">
                <Package className="h-4 w-4 mr-2" />
                Review Templates
              </Button>
              <Button variant="outline" className="justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                Export Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}