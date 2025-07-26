'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react';

interface AnalyticsData { overview: {
    totalUsers: number
    activeUsers: number
    totalProjects: number
    totalApiCalls: number
    revenue: number
    activeSubscriptions: number
 };
  userMetrics: { newUsers: Array<{ date: string, count: number }>;
    activeUsers: Array<{ date: string, count: number }>
}
}

interface AdminAnalyticsProps {
  data?: AnalyticsData
  timeRange?: string
}

export function AdminAnalytics({ data, timeRange = '7d' }: AdminAnalyticsProps = {}) {
  const [selectedMetric, setSelectedMetric] = useState<string>('users')
  
  // Default data if none provided
  const defaultData: AnalyticsData = { 
    overview: {
      totalUsers: 1234,
      activeUsers: 456,
      totalProjects: 789,
      totalApiCalls: 123456,
      revenue: 9876,
      activeSubscriptions: 234
    },
    userMetrics: { newUsers: [
        { date: 'Mon', count: 10 },
        { date: 'Tue', count: 15 },
        { date: 'Wed', count: 12 },
        { date: 'Thu', count: 18 },
        { date: 'Fri', count: 25 },
        { date: 'Sat', count: 20 },
        { date: 'Sun', count: 15 }
      ],
      activeUsers: [
        { date: 'Mon', count: 100 },
        { date: 'Tue', count: 120 },
        { date: 'Wed', count: 110 },
        { date: 'Thu', count: 130 },
        { date: 'Fri', count: 140 },
        { date: 'Sat', count: 125 },
        { date: 'Sun', count: 115 }
      ]
    }
  };
  
  const analyticsData = data || defaultData;
  
  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="glass grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="glass"
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" className="glass
          <CardTitle className="text-sm font-medium" className="glassTotal Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground"  />
          </CardHeader>
          <CardContent className="glass"
          <div className="text-2xl font-bold">{analyticsData.overview.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        
        <Card className="glass"
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" className="glass
            <CardTitle className="text-sm font-medium" className="glassActive Users</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground"  />
          </CardHeader>
          <CardContent className="glass"
          <div className="text-2xl font-bold">{analyticsData.overview.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+15% from last week</p>
          </CardContent>
        </Card>
        
        <Card className="glass"
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" className="glass
            <CardTitle className="text-sm font-medium" className="glassTotal Projects</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground"  />
          </CardHeader>
          <CardContent className="glass"
          <div className="text-2xl font-bold">{analyticsData.overview.totalProjects.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12 new today</p>
          </CardContent>
        </Card>
        
        <Card className="glass"
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" className="glass
            <CardTitle className="text-sm font-medium" className="glassRevenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground"  />
          </CardHeader>
          <CardContent className="glass"
          <div className="text-2xl font-bold">${analyticsData.overview.revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+25% from last month</p>
          </CardContent>
        </Card>
      </div>
      
      {/* User Activity Chart */}
      <Card className="glass"
          <CardHeader className="glass"
          <CardTitle className="glass"User Activity - Last 7 Days</CardTitle>
        </CardHeader>
        <CardContent className="glass"
          <div className="h-[200px] flex items-end justify-between gap-2">
            {analyticsData.userMetrics.activeUsers.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full glass-button primary rounded-lg-t"
                  style={ height: `${(day.count / 150) * 100}%` }
                />
                <span className="text-xs text-gray-600">{day.date}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}