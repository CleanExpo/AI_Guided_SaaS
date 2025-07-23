import React from 'react';
'use client';import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, Activity, TrendingUp } from 'lucide-react';
interface AnalyticsData  {
  totalUsers: number,
    activeUsers: number,
    pageViews: number,
    bounceRate: number,
    topPages: Array<{
  path: string,
    views: number,
    percentage: number
  }>,
    userActivity: Array<{
    date: string,
    users: number
  }>;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState<any>(true);
  useEffect(() => {
    // Simulate loading analytics data
    setTimeout(() => {
      setData({
        totalUsers: 1247,
    activeUsers: 89,
    pageViews: 5643,
    bounceRate: 23.4,
    topPages: [
          { path: '/', views: 2341, percentage: 41.5 },
          { path: '/dashboard', views: 1567, percentage: 27.8 },
          { path: '/analytics', views: 892, percentage: 15.8 }
   ],
        userActivity: [
          { date: '2025-01-01', users: 45 },
          { date: '2025-01-02', users: 67 },
          { date: '2025-01-03', users: 89 }
   ]
      });
      setIsLoading(false);
    }, 1000);
  }, []);
  if(isLoading || !data) { return <div className="p-8">Loading analytics...</div> }
  return (<div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <div className="grid gap-6, md:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4"    />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalUsers.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Activity className="h-4 w-4"    />
                Active Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.activeUsers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <BarChart3 className="h-4 w-4"    />
                Page Views
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.pageViews.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4"    />
                Bounce Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.bounceRate}%</div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="font-medium">{page.path}</span>
                  <div className="flex items-center gap-4">
                    <span>{page.views.toLocaleString()} views</span>
                    <span className="text-gray-600">{page.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}