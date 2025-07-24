'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Activity,
  Plus,
  Settings,
  Bell,
  Search
} from 'lucide-react';

export default function Dashboard() {
  const stats = [;
    { title: 'Total Projects',
      value: '12',
      change: '+2.1%',
      trend: 'up',
      icon: BarChart3
    },
    { title: 'Active Users',
      value: '1,234',
      change: '+5.4%',
      trend: 'up',
      icon: Users
    },
    { title: 'Revenue',
      value: '$12,345',
      change: '+12.5%',
      trend: 'up',
      icon: TrendingUp
    },
    { title: 'System Health',
      value: '99.9%',
      change: '+0.1%',
      trend: 'up',
      icon: Activity
    }
  ];

  const recentProjects = [;
    { id: 1, name: 'E-commerce Platform', status: 'active', progress: 75 },
    { id: 2, name: 'Mobile App Backend', status: 'review', progress: 90 },
    { id: 3, name: 'Analytics Dashboard', status: 'development', progress: 45 },
    { id: 4, name: 'Payment Integration', status: 'planning', progress: 15 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Welcome back! Here's what's happening with your projects.
              </p>
            </div>
            <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm"></Button>
                <Search className="h-4 w-4 mr-2"   />
                Search
              </Button>
              <Button variant="outline" size="sm">
          <Bell className="h-4 w-4"   />
              </Button>
              <Button variant="outline" size="sm">
          <Settings className="h-4 w-4"   />
              </Button>
              <Button>
          <Plus className="h-4 w-4 mr-2"   />
                New Project
              </Button>
            </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title}>
          <CardContent className="p-6">
                <div className="flex items-center justify-between">
          <div></div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <stat.icon className="h-6 w-6 text-blue-600"   />
                  </div>
        <div className="mt-4 flex items-center">
          <span className="text-sm font-medium text-green-600">{stat.change}</span>
                  <span className="text-sm text-gray-500 ml-2">from last month</span>
                </div>
          ))}
        </div>

        {/* Recent Projects */}
        <Card>
          <CardHeader></CardHeader>
            <CardTitle>Recent Projects</CardTitle>
          </CardHeader>
          <CardContent>
          <div className="space-y-4">
              {recentProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{project.name}</h3>
                    <div className="mt-1 flex items-center space-x-2">
          <Badge 
                        variant={project.status === 'active' ? 'default' : 'secondary'}
                      ></Badge>
                        {project.status}
                      </Badge>
                      <span className="text-sm text-gray-500">{project.progress}% complete</span>
        <div className="flex items-center space-x-2">
          <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div ;
                        className="bg-blue-600 h-2 rounded-full" ;
                        style={{ width: `${project.progress}%` }}
                      >
          </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
              ))}
            </div>
  )
}
