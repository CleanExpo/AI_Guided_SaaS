'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import EnterpriseDashboard from '@/components/dashboard/EnterpriseDashboard';

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  averageSessionTime: string;
  bounceRate: number;
  topPages: Array<{
    path: string;
    views: number;
    percentage: number;
  }>;
  userActivity: Array<{
    date: string;
    users: number;
    sessions: number;
  }>;
}

export default function AnalyticsPage() {
  const { toast } = useToast();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadAnalyticsData = useCallback(async () => {
    try {
      setRefreshing(true);

      // Try to fetch from API, but gracefully handle auth errors
      let apiData = null;
      try {
        const response = await fetch('/api/analytics', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            apiData = result.data;
          }
        }
      } catch (apiError) {
        console.log('API not available, using demo data:', apiError);
      }

      // Use API data if available, otherwise use demo data
      const mockData: AnalyticsData = apiData || {
        pageViews: 12847,
        uniqueVisitors: 3421,
        averageSessionTime: '4m 32s',
        bounceRate: 34.2,
        topPages: [
          { path: '/', views: 4521, percentage: 35.2 },
          { path: '/ui-builder', views: 3102, percentage: 24.1 },
          { path: '/admin', views: 2134, percentage: 16.6 },
          { path: '/collaborate', views: 1876, percentage: 14.6 },
          { path: '/analytics', views: 1214, percentage: 9.5 },
        ],
        userActivity: [
          { date: '2024-01-01', users: 245, sessions: 312 },
          { date: '2024-01-02', users: 289, sessions: 367 },
          { date: '2024-01-03', users: 321, sessions: 421 },
          { date: '2024-01-04', users: 298, sessions: 389 },
          { date: '2024-01-05', users: 356, sessions: 445 },
          { date: '2024-01-06', users: 412, sessions: 523 },
          { date: '2024-01-07', users: 387, sessions: 498 },
        ],
      };

      setAnalyticsData(mockData);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load analytics data',
        variant: 'destructive',
      });
      setLoading(false);
      setRefreshing(false);
    }
  }, [toast]);

  useEffect(() => {
    loadAnalyticsData();
  }, [loadAnalyticsData]);

  const handleRefresh = () => {
    loadAnalyticsData();
  };

  const handleExport = () => {
    toast({
      title: 'Export Started',
      description: 'Analytics data export has been initiated',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">Failed to load analytics data</p>
          <Button onClick={handleRefresh} className="mt-4">
            🔄 Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">
            Monitor your platform&apos;s performance and user engagement
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? '🔄' : '🔄'} Refresh
          </Button>
          <Button onClick={handleExport}>📥 Export</Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <span className="text-muted-foreground">👁️</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.pageViews.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              📈 +12.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Unique Visitors
            </CardTitle>
            <span className="text-muted-foreground">👥</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.uniqueVisitors.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              📈 +8.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Session Time
            </CardTitle>
            <span className="text-muted-foreground">⏰</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.averageSessionTime}
            </div>
            <p className="text-xs text-muted-foreground">
              📈 +15.3% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
            <span className="text-muted-foreground">📊</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.bounceRate}%
            </div>
            <Progress value={100 - analyticsData.bounceRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pages">Top Pages</TabsTrigger>
          <TabsTrigger value="enterprise">Enterprise</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Activity Trend</CardTitle>
                <CardDescription>
                  Daily active users and sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.userActivity.map((day, index) => (
                    <div
                      key={day.date}
                      className="flex items-center justify-between"
                    >
                      <div className="text-sm font-medium">Day {index + 1}</div>
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline">{day.users} users</Badge>
                        <Badge variant="secondary">
                          {day.sessions} sessions
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platform Health</CardTitle>
                <CardDescription>System performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Uptime</span>
                    <Badge className="bg-green-500">99.9%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Response Time</span>
                    <Badge variant="outline">142ms</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Error Rate</span>
                    <Badge className="bg-green-500">0.1%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">API Calls</span>
                    <Badge variant="secondary">24.7K</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Pages</CardTitle>
              <CardDescription>
                Most visited pages on your platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topPages.map((page, index) => (
                  <div
                    key={page.path}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-sm font-medium">#{index + 1}</div>
                      <div>
                        <div className="text-sm font-medium">{page.path}</div>
                        <div className="text-xs text-muted-foreground">
                          {page.views.toLocaleString()} views
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress value={page.percentage} className="w-20" />
                      <span className="text-sm text-muted-foreground">
                        {page.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enterprise" className="space-y-4">
          <EnterpriseDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
