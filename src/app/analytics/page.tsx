/* BREADCRUMB: pages - Application pages and routes */
'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, Activity, TrendingUp } from 'lucide-react';

interface AnalyticsData { totalUsers: number
  activeUsers: number
  pageViews: number
  bounceRate: number
  topPages: Array<{ path: string
    views: number
    percentage: number;
  }>
  userActivity: Array<{ date: string
    users: number}>
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() =>  {
    // Simulate loading analytics data
    setTimeout(() => {
      setData({ totalUsers: 1247,
        activeUsers: 89,
        pageViews: 5643,
        bounceRate: 34.2,
        topPages: [
          { path: '/', views: 1543, percentage: 27.3 },
          { path: '/features', views: 987, percentage: 17.5 },
          { path: '/pricing', views: 543, percentage: 9.6 }
        ],
        userActivity: [
          { date: '2025-01-01', users: 45 },
          { date: '2025-01-02', users: 52 },
          { date: '2025-01-03', users: 48 }
        ]
      });
      setIsLoading(false)
}, 1000)
}, []);

  if (isLoading) {
    return (
      <div className="glass container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
        <div>Loading analytics data...</div>
      </div>
    );
  }

  return (
    <div className="glass container mx-auto p-6 space-y-6">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
      
      <div className="glass grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 glass">
            <CardTitle className="text-sm font-medium glass">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="glass">
            <div className="text-2xl font-bold">{data?.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Total registered users</p>
          </CardContent>
        </Card>
        
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 glass">
            <CardTitle className="text-sm font-medium glass">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="glass">
            <div className="text-2xl font-bold">{data?.activeUsers}</div>
            <p className="text-xs text-muted-foreground">Active in last 24h</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
