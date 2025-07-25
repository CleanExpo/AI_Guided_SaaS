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
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics</h1>
              <p className="mt-1 text-gray-600">Deep insights into your SaaS performance</p>
            </div>
            <div className="flex items-center gap-3">
              <select 
                className="px-4 py-2 border rounded-lg"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button onClick={() => setShowExport(!showExport)}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Real-time Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700">Active Now</p>
                    <p className="text-2xl font-bold text-green-900">
                      {realtimeMetrics.get('activeUsers')?.value || dashboardData.realtime.activeUsers}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {wsConnected && <span className="text-xs text-green-600">Live</span>}
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Page Views</p>
                    <p className="text-2xl font-bold">{dashboardData.realtime.pageViews}</p>
                  </div>
                  <Eye className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Events</p>
                    <p className="text-2xl font-bold">{dashboardData.realtime.events}</p>
                  </div>
                  <MousePointer className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Analytics Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => {
          setActiveTab(value);
          trackFeature('advanced_analytics', 'tab_switch', value);
        }}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <Badge variant="secondary" className="text-green-600">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      12%
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold">24,567</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <Badge variant="secondary" className="text-green-600">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      23%
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">MRR</p>
                  <p className="text-2xl font-bold">$45,678</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <ShoppingCart className="h-5 w-5 text-purple-600" />
                    <Badge variant="secondary" className="text-green-600">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      8%
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-bold">3.4%</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Clock className="h-5 w-5 text-orange-600" />
                    <Badge variant="secondary" className="text-red-600">
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                      5%
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">Avg Session</p>
                  <p className="text-2xl font-bold">4m 32s</p>
                </CardContent>
              </Card>
            </div>

            {/* Trends Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Growth Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={userTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="users" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Users"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      name="Revenue ($)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="conversions" 
                      stroke="#f59e0b" 
                      strokeWidth={2}
                      name="Conversions"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Conversion Funnel */}
              <Card>
                <CardHeader>
                  <CardTitle>Conversion Funnel</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={funnelData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Revenue by Plan */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={revenueByPlan}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {revenueByPlan.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* User Acquisition */}
              <Card>
                <CardHeader>
                  <CardTitle>User Acquisition</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Organic Search</span>
                        <span className="text-sm font-medium">45%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Direct</span>
                        <span className="text-sm font-medium">25%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '25%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Social Media</span>
                        <span className="text-sm font-medium">20%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '20%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Referral</span>
                        <span className="text-sm font-medium">10%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-600 h-2 rounded-full" style={{ width: '10%' }} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* User Segments */}
              <Card>
                <CardHeader>
                  <CardTitle>User Segments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Power Users</p>
                        <p className="text-sm text-gray-600">Daily active</p>
                      </div>
                      <Badge>2,456</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Regular Users</p>
                        <p className="text-sm text-gray-600">Weekly active</p>
                      </div>
                      <Badge>8,234</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">At Risk</p>
                        <p className="text-sm text-gray-600">Not seen 30+ days</p>
                      </div>
                      <Badge variant="secondary">1,234</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cohort Retention */}
              <Card>
                <CardHeader>
                  <CardTitle>Retention Cohorts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Week 1</span>
                        <span className="text-sm font-medium">85%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Week 2</span>
                        <span className="text-sm font-medium">72%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '72%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Week 4</span>
                        <span className="text-sm font-medium">64%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-600 h-2 rounded-full" style={{ width: '64%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Week 8</span>
                        <span className="text-sm font-medium">58%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-red-600 h-2 rounded-full" style={{ width: '58%' }} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-gray-600">MRR</p>
                  <p className="text-2xl font-bold">$45,678</p>
                  <p className="text-sm text-green-600 mt-1">+23% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-gray-600">ARR</p>
                  <p className="text-2xl font-bold">$548,136</p>
                  <p className="text-sm text-green-600 mt-1">+18% YoY</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-gray-600">ARPU</p>
                  <p className="text-2xl font-bold">$186</p>
                  <p className="text-sm text-green-600 mt-1">+$12 from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-gray-600">LTV</p>
                  <p className="text-2xl font-bold">$2,232</p>
                  <p className="text-sm text-green-600 mt-1">3.8 months payback</p>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={userTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#10b981" 
                      fill="#10b98133"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Engagement Tab */}
          <TabsContent value="engagement" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Pages */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Pages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardData.top.pages.map((page: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium">{index + 1}</span>
                          <span className="text-sm">{page.url}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{page.views.toLocaleString()}</span>
                          <span className="text-xs text-gray-500">views</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Feature Usage */}
              <Card>
                <CardHeader>
                  <CardTitle>Feature Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardData.top.features.map((feature: any, index: number) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">{feature.name}</span>
                          <span className="text-sm font-medium">{feature.usage}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(feature.usage / 543) * 100}%` }} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Page Load Times */}
              <Card>
                <CardHeader>
                  <CardTitle>Page Load Times</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Average</span>
                      <span className="text-sm font-medium">1.2s</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Median</span>
                      <span className="text-sm font-medium">0.9s</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">95th Percentile</span>
                      <span className="text-sm font-medium">2.8s</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* API Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>API Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Avg Response Time</span>
                      <span className="text-sm font-medium">45ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Success Rate</span>
                      <span className="text-sm font-medium text-green-600">99.8%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Requests/min</span>
                      <span className="text-sm font-medium">1,234</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Error Tracking */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Errors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardData.top.errors.map((error: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-red-600">{error.message}</span>
                        <Badge variant="secondary">{error.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <PredictiveInsights />
          </TabsContent>
        </Tabs>

        {/* Export Modal */}
        {showExport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-lg w-full mx-4">
              <div className="p-6">
                <AnalyticsExport />
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => setShowExport(false)}
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