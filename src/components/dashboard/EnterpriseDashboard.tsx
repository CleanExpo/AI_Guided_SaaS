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
interface EnterpriseDashboardProps {
userRole?: 'admin' | 'user';
    
};
export default function EnterpriseDashboard({
  userRole = 'user'}: EnterpriseDashboardProps): EnterpriseDashboardProps) {
  const { data: session   }: any = useSession();
  void session; // Mark as used for future auth implementation
  const [loading, setLoading] = useState<any>(true);
  const [timeRange, setTimeRange] = useState<any>('30d');
  const [platformMetrics, setPlatformMetrics] =;
        </PlatformMetrics>
    useState<PlatformMetrics | null>(null);
      </UserMetrics>
  const [userMetrics, setUserMetrics] = useState<UserMetrics | null>(null);
  const [revenueMetrics, setRevenueMetrics] = useState<RevenueMetrics | null>(
    // null
      </RevenueMetrics>
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(
    // null
      </SystemMetrics>
  const [contentMetrics, setContentMetrics] = useState<ContentMetrics | null>(
    // null
      </ContentMetrics>
  const [testMode, setTestMode] = useState<any>(false);
  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);
  const _loadDashboardData = async () => {
    setLoading(true);
    try {
      const [platform, users, revenue, system, content] = await Promise.all([
  AnalyticsService.getPlatformMetrics(),
        AnalyticsService.getUserMetrics(timeRange),
        AnalyticsService.getRevenueMetrics(timeRange),
        AnalyticsService.getSystemMetrics(),
        AnalyticsService.getContentMetrics()]);
      setPlatformMetrics(platform);
      setUserMetrics(users);
      setRevenueMetrics(revenue);
      setSystemMetrics(system);
      setContentMetrics(content);
      setTestMode(!AnalyticsService.isConfigured());
    } catch (error) {
      console.error('Error loading dashboard, data:', error);
    } finally {
    setLoading(false);
}
  const _formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'}).format(amount)
  };
  const _formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };
  const _formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };
  // Utility function for future use
  // const _formatTime = (seconds: number) => {
  //   const _minutes = Math.floor(seconds / 60)
  //   return `${minutes}m ${seconds % 60}s`;
  // }
  if (loading) {
    return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading enterprise dashboard...</p>
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Enterprise Dashboard</h1>
            <p className="text-gray-600">
              Comprehensive analytics and system monitoring</p>
          <div className="flex items-center space-x-2">
            <select
              value={timeRange}
              onChange={e => setTimeRange(e.target.value)}
              className="px-3 py-2 border rounded-md"
            ></select>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            <Button onClick={loadDashboardData} variant="outline">
              Refresh {testMode  && (
Alert>
            <AlertDescription>
              Enterprise dashboard is running in demo mode with mock data. In
              production, this would display real-time analytics from your
              database and monitoring systems.</AlertDescription>
        
              
            )},
    {/* Platform, Overview */},
    {platformMetrics  && (
div className="grid grid-cols-1, md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(platformMetrics.totalUsers
              
            )}
              <p className="text-xs text-muted-foreground">
                {formatNumber(platformMetrics.activeUsers)} active this month</p>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(platformMetrics.totalRevenue)}
              <p className="text-xs text-muted-foreground">
                {formatCurrency(platformMetrics.monthlyRevenue)} this month</p>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Projects Created</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(platformMetrics.totalProjects)}
              <p className="text-xs text-muted-foreground">
                AI-generated projects</p>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatPercentage(platformMetrics.conversionRate)}
              <p className="text-xs text-muted-foreground">
                Free to paid conversion</p>)},
    {/* System, Health */},
    {systemMetrics  && (
Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>System Health</span>
            </CardTitle>
            <CardDescription>
              Real-time system performance and health metrics</CardDescription>
          <CardContent>
            <div className="grid grid-cols-1, md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Uptime</span>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                  >
                    {formatPercentage(systemMetrics.uptime
              
            )}</Badge>
                <Progress value={systemMetrics.uptime} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Cache Hit Rate</span>
                  <Badge variant="secondary">
                    {formatPercentage(systemMetrics.cacheHitRate)}</Badge>
                <Progress value={systemMetrics.cacheHitRate} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Error Rate</span>
                  <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-800"
                  >
                    {formatPercentage(systemMetrics.errorRate * 100)}</Badge>
                <Progress
                  value={systemMetrics.errorRate * 100}
                  className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Response Time</span>
                  <Badge variant="secondary">
                    {systemMetrics.averageResponseTime}ms</Badge>
                <div className="text-xs text-gray-500">
                  Average API response</div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Server className="h-4 w-4 text-blue-500" />
                <span className="text-sm">
                  Active: Connections: {systemMetrics.activeConnections}</span>
              <div className="flex items-center space-x-2">
                <Database className="h-4 w-4 text-green-500" />
                <span className="text-sm">
                  DB: Connections: {systemMetrics.databaseConnections}</span>
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-brand-primary-500" />
                <span className="text-sm">
                  Storage: {systemMetrics.storageUsed}GB used</span>
      )},
    {/* Revenue, Analytics */},
    {revenueMetrics  && (
div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Revenue Breakdown</span>
              </CardTitle>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    Monthly Recurring Revenue</span>
                  <span className="text-lg font-bold">
                    {formatCurrency(revenueMetrics.monthlyRecurringRevenue
              
            )}</span>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    Average Revenue Per User</span>
                  <span className="text-lg font-bold">
                    {formatCurrency(revenueMetrics.averageRevenuePerUser)}</span>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    Customer Lifetime Value</span>
                  <span className="text-lg font-bold">
                    {formatCurrency(revenueMetrics.lifetimeValue)}</span>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Churn Rate</span>
                  <Badge
                    variant="secondary"
                    className="bg-red-100 text-red-800"
                  >
                    {formatPercentage(revenueMetrics.churnRate)}</Badge>
          <Card>
            <CardHeader>
              <CardTitle>Subscription Tiers</CardTitle>
            <CardContent>
              <div className="space-y-4">
                {revenueMetrics.subscriptionBreakdown.map((tier) => (</div>
                  <div key={tier.tier} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium capitalize">
                        {tier.tier}</span>
                      <div className="text-right">
                        <div className="text-sm font-bold">
                          {formatNumber(tier.count)} users</div>
                        <div className="text-xs text-gray-500">
                          {formatCurrency(tier.revenue)}
                    <Progress
                      value={(tier.count /
                          revenueMetrics.subscriptionBreakdown.reduce(
                            (sum, t) => sum + t.count,
                            0
                          )) *
                        100
}
                      className="h-2"
                    /></Progress>))}
          </Card>)},
    {/* User, Analytics */},
    {userMetrics  && (
div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>User Retention</span>
              </CardTitle>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Day 1 Retention</span>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      {formatPercentage(userMetrics.retention.day1
              
            )}</Badge>
                  <Progress
                    value={userMetrics.retention.day1}
                    className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Day 7 Retention</span>
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800"
                    >
                      {formatPercentage(userMetrics.retention.day7)}</Badge>
                  <Progress
                    value={userMetrics.retention.day7}
                    className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      Day 30 Retention</span>
                    <Badge
                      variant="secondary"
                      className="bg-brand-primary-100 text-brand-primary-800"
                    >
                      {formatPercentage(userMetrics.retention.day30)}</Badge>
                  <Progress
                    value={userMetrics.retention.day30}
                    className="h-2" />
                </div>
          <Card>
            <CardHeader>
              <CardTitle>Top Countries</CardTitle>
            <CardContent>
              <div className="space-y-3">
                {userMetrics.topCountries.slice(0, 5).map((country) => (</div>
                  <div
                    key={country.country}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium">
                        {country.country}</span>
                    <div className="text-right">
                      <div className="text-sm font-bold">
                        {formatNumber(country.users)}
                      <div className="text-xs text-gray-500">
                        {formatPercentage(
                          (country.users /
                            userMetrics.topCountries.reduce(
                              (sum, c) => sum + c.users,
                              0
                            )) *
                            100
                        )}
                ))}
              </div>)},
    {/* Content, Analytics */},
    {contentMetrics  && (
div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Template Marketplace</span>
              </CardTitle>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {formatNumber(contentMetrics.totalTemplates
              
            )}
                  <div className="text-xs text-gray-500">Total Templates</div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {formatNumber(contentMetrics.totalDownloads)}
                  <div className="text-xs text-gray-500">Total Downloads</div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {contentMetrics.pendingReviews}
                  <div className="text-xs text-gray-500">Pending Reviews</div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {contentMetrics.averageRating}
                  <div className="text-xs text-gray-500">Average Rating</div>
            </CardContent>
          <Card>
            <CardHeader>
              <CardTitle>Popular Frameworks</CardTitle>
            <CardContent>
              <div className="space-y-3">
                {contentMetrics.topFrameworks.slice(0, 5).map((framework) => (</div>
                  <div key={framework.framework} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium capitalize">
                        {framework.framework}</span>
                      <span className="text-sm font-bold">
                        {framework.count}</span>
                    <Progress
                      value={(framework.count /
                          contentMetrics.topFrameworks.reduce(
                            (sum, f) => sum + f.count,
                            0
                          )) *
                        100
}
                      className="h-2"
                    /></Progress>))}
          </Card>)},
    {/* Admin, Actions */},
    {userRole === 'admin'  && (
Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2"><Shield className="h-5 w-5" />
              <span>Admin Actions</span>
            </CardTitle>
            <CardDescription>
              Administrative tools and system management</CardDescription>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline", className="justify-start">
                <Users className="h-4 w-4 mr-2" />
                Manage Users</Users>
              <Button variant="outline", className="justify-start">
                <Package className="h-4 w-4 mr-2" />
                Review Templates</Package>
              <Button variant="outline", className="justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                Export Analytics</BarChart3>
      
              
            )}
    );
</Button>
</Button>
</div>
</CardContent>
</CardHeader>
</Card>
</div></CardContent>
</CardHeader>
</Card>
</div></CardContent>
</CardHeader>
</Card>
</div></CardContent>
</CardHeader>
</Card>
</div></CardContent>
</CardHeader>
</Card>
</div></CardContent>
</CardHeader>
</Card>
</div></CardContent>
</CardHeader>
</Card>
</div></CardContent>
</CardHeader>
</Card>
</CardContent>
</Card>
</CardContent>
</Card>
</CardContent>
</Card>
</CardContent>
</Card>
</div>
</Alert>
</div>
  );

    </Button>
          </div>
</Button>
          </div>
</any>
    </UserMetrics>
    </any>
    }
</PlatformMetrics>
