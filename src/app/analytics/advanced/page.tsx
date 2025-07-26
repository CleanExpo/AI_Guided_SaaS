'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign,
  Activity,
  Target,
  Zap,
  Clock,
  AlertCircle,
  Download,
  Filter,
  Calendar,
  Eye,
  MousePointer,
  ShoppingCart,
  CreditCard,
  UserCheck,
  ArrowUpRight,
  ArrowDownRight,
  Brain
} from 'lucide-react';
import { getAnalytics } from '@/services/analytics-engine';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useAnalyticsWebSocket } from '@/services/analytics-websocket';
import PredictiveInsights from '@/components/analytics/PredictiveInsights';
import AnalyticsExport from '@/components/analytics/AnalyticsExport';
import {
  OverviewTab,
  UsersTab,
  RevenueTab,
  EngagementTab,
  PerformanceTab
} from '@/components/analytics/advanced';

export default function AdvancedAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');
  const [metrics, setMetrics] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showExport, setShowExport] = useState(false);
  const analytics = getAnalytics();
  const { track, trackFeature } = useAnalytics();
  const { connected: wsConnected, metrics: realtimeMetrics } = useAnalyticsWebSocket();

  useEffect(() => {
    // Load analytics data
    const loadData = () => {
      setMetrics(analytics.getMetrics());
      setDashboardData(analytics.getDashboardData());
    };

    loadData();
    const interval = setInterval(loadData, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [timeRange]);

  if (!metrics || !dashboardData) {
    return <div>Loading analytics...</div>;
  }

  // Prepare chart data
  const userTrendData = dashboardData.trends.users.map((value: number, index: number) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index],
    users: value,
    revenue: dashboardData.trends.revenue[index],
    conversions: dashboardData.trends.conversions[index]
  }));

  const funnelData = [
    { name: 'Visitors', value: 10000, fill: '#3b82f6' },
    { name: 'Signups', value: 2500, fill: '#8b5cf6' },
    { name: 'Trial', value: 1200, fill: '#f59e0b' },
    { name: 'Paid', value: 300, fill: '#10b981' }
  ];

  const revenueByPlan = [
    { name: 'Free', value: 0, fill: '#94a3b8' },
    { name: 'Starter', value: 4500, fill: '#3b82f6' },
    { name: 'Pro', value: 12300, fill: '#8b5cf6' },
    { name: 'Enterprise', value: 28900, fill: '#f59e0b' }
  ];

  return(<div className="min-h-screen glass py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics</h1>
              <p className="mt-1 text-gray-600">
                Deep insights and AI-powered predictions for your SaaS
              </p>
            </div>
            <div className="flex items-center gap-3">)
              <Button variant="outline" onClick={() => trackFeature('analytics', 'filter')}>
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" onClick={() => setShowExport(true)}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <select
                className="px-4 py-2  rounded-xl-lg">value={timeRange}>onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Real-time Stats */}
        <Card className="mb-6 glass">
          <CardContent className="glass p-4">
            <div className="flex items-center justify-between">
              <div className="glass flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${wsConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                  <span className="text-sm text-gray-600">
                    {wsConnected ? 'Real-time Connected' : 'Offline Mode'}
                  </span>
                </div>
                {wsConnected && realtimeMetrics && (
                  <>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium">{realtimeMetrics.activeUsers} active now</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium">{realtimeMetrics.requestsPerMinute} req/min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium">${realtimeMetrics.revenueToday} today</span>
                    </div>
                  </>
                )}
              </div>
              <Badge variant="secondary">
                <Clock className="h-3 w-3 mr-1" />
                Updated just now
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Main Analytics Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab
              metrics={metrics}
              dashboardData={dashboardData}
              userTrendData={userTrendData}
              funnelData={funnelData}>revenueByPlan={revenueByPlan} />>
          </TabsContent>

          <TabsContent value="users">
            <UsersTab />
          </TabsContent>

          <TabsContent value="revenue">
            <RevenueTab userTrendData={userTrendData} />
          </TabsContent>

          <TabsContent value="engagement">
            <EngagementTab dashboardData={dashboardData} />
          </TabsContent>

          <TabsContent value="performance">
            <PerformanceTab dashboardData={dashboardData} />
          </TabsContent>

          <TabsContent value="insights">
            <PredictiveInsights />
          </TabsContent>
        </Tabs>

        {/* Export Modal */}
        {showExport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="glass rounded-xl-lg max-w-lg w-full mx-4">
              <div className="glass p-6">
                <AnalyticsExport />
                <Button 
                  variant="outline" >className="w-full mt-4">onClick={() => setShowExport(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}