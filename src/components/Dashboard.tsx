'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { usePWA } from '@/hooks/usePWA';
import MobileDashboard from '@/components/MobileDashboard';
import { useAnalytics, usePerformanceTracking } from '@/hooks/useAnalytics';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Activity,
  Plus,
  Settings,
  Bell,
  Search,
  Rocket,
  Code2,
  Terminal,
  GitBranch,
  Package,
  Zap,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Github,
  Play,
  Database,
  Bot,
  CreditCard
} from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [deploymentStatus, setDeploymentStatus] = useState('ready');
  const { isMobile } = usePWA();
  const { trackFeature, trackConversion } = useAnalytics();
  usePerformanceTracking('Dashboard');

  // Use mobile dashboard for mobile devices
  if (isMobile) {
    return <MobileDashboard />;
  }

  // Speed-focused metrics for Sam
  const stats = [
    { 
      title: 'Time to Deploy',
      value: '< 5 min',
      change: 'One-click ready',
      trend: 'up',
      icon: Rocket,
      color: 'text-green-600'
    },
    { 
      title: 'Active Features',
      value: '24/24',
      change: 'All systems go',
      trend: 'up',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    { 
      title: 'API Latency',
      value: '45ms',
      change: 'Blazing fast',
      trend: 'up',
      icon: Zap,
      color: 'text-blue-600'
    },
    { 
      title: 'Dev Velocity',
      value: '10x',
      change: 'vs traditional',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-purple-600'
    }
  ];

  // Quick action cards for developers
  const quickActions = [
    {
      title: 'Deploy to Production',
      description: 'Push your app live in one click',
      icon: Rocket,
      action: '/deploy',
      color: 'bg-green-500',
      time: '< 1 min'
    },
    {
      title: 'Add AI Chat',
      description: 'Enable GPT-4 chat interface',
      icon: Bot,
      action: '/settings/ai',
      color: 'bg-purple-500',
      time: '2 mins'
    },
    {
      title: 'Setup Payments',
      description: 'Connect Stripe checkout',
      icon: CreditCard,
      action: '/settings/payments',
      color: 'bg-blue-500',
      time: '5 mins'
    },
    {
      title: 'Configure Auth',
      description: 'Enable OAuth & magic links',
      icon: Users,
      action: '/settings/auth',
      color: 'bg-orange-500',
      time: '3 mins'
    }
  ];

  // Recent activity focused on development speed
  const recentActivity = [
    { 
      id: 1, 
      action: 'Database migrations completed',
      time: '2 minutes ago',
      icon: Database,
      status: 'success'
    },
    { 
      id: 2, 
      action: 'CI/CD pipeline configured',
      time: '5 minutes ago',
      icon: GitBranch,
      status: 'success'
    },
    { 
      id: 3, 
      action: 'Environment variables set',
      time: '10 minutes ago',
      icon: Settings,
      status: 'success'
    },
    { 
      id: 4, 
      action: 'Dependencies installed (247 packages)',
      time: '15 minutes ago',
      icon: Package,
      status: 'success'
    }
  ];

  const handleQuickDeploy = () => {
    setDeploymentStatus('deploying');
    trackFeature('dashboard', 'quick_deploy', 'initiated');
    setTimeout(() => {
      setDeploymentStatus('deployed');
      trackConversion('quick_deploy_success');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header - Developer focused */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Speed Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Ship faster. Every boilerplate component is production-ready.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-100 text-green-700">
                <Clock className="h-3 w-3 mr-1" />
                Ready to ship
              </Badge>
              <Button variant="outline" size="sm">
                <Terminal className="h-4 w-4 mr-2" />
                Terminal
              </Button>
              <Button 
                data-testid="refresh-button" 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setIsLoading(true);
                  setLastRefresh(new Date());
                  setTimeout(() => setIsLoading(false), 1000);
                }}
              >
                <Bell className="h-4 w-4" />
              </Button>
              <Button onClick={handleQuickDeploy} className="bg-green-600 hover:bg-green-700">
                <Play className="h-4 w-4 mr-2" />
                Quick Deploy
              </Button>
            </div>
          </div>
        </div>

        {/* Filter Dropdown */}
        <div className="mb-6">
          <select
            data-testid="filter-dropdown"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-white"
          >
            <option value="all">All Activities</option>
            <option value="deployments">Deployments</option>
            <option value="features">Features</option>
            <option value="settings">Settings</option>
          </select>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-center mb-4">
            <div data-testid="loading-spinner" className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Deployment Status Banner */}
        {deploymentStatus === 'deploying' && (
          <Card className="mb-6 border-blue-500 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
                  <span className="font-medium">Deploying to production...</span>
                </div>
                <span className="text-sm text-gray-600">This usually takes less than 60 seconds</span>
              </div>
            </CardContent>
          </Card>
        )}

        {deploymentStatus === 'deployed' && (
          <Card className="mb-6 border-green-500 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Successfully deployed!</span>
                </div>
                <Button variant="outline" size="sm">
                  View Live Site →
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Speed Metrics */}
        <div data-testid="dashboard-metrics" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-sm font-medium text-gray-600">{stat.change}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Setup Actions</CardTitle>
                <p className="text-sm text-gray-600">Get your SaaS live in minutes, not months</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action) => (
                    <Link href={action.action} key={action.title} onClick={() => trackFeature('dashboard', 'quick_action', action.title)}>
                      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-start justify-between mb-2">
                          <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}>
                            <action.icon className="h-5 w-5 text-white" />
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {action.time}
                          </Badge>
                        </div>
                        <h3 className="font-medium text-gray-900 mb-1">{action.title}</h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Developer Resources */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Developer Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link href="/docs" className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Code2 className="h-5 w-5 text-gray-600" />
                      <span className="font-medium">Documentation</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </Link>
                  
                  <Link href="https://github.com" className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Github className="h-5 w-5 text-gray-600" />
                      <span className="font-medium">GitHub Repo</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </Link>
                  
                  <Link href="/api/playground" className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Terminal className="h-5 w-5 text-gray-600" />
                      <span className="font-medium">API Playground</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </Link>
                  
                  <Link href="/discord" className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-gray-600" />
                      <span className="font-medium">Discord Community</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Setup Progress</CardTitle>
              <Badge variant="outline">4/4 Complete</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.status === 'success' ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <activity.icon className={`h-4 w-4 ${
                        activity.status === 'success' ? 'text-green-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                  {activity.status === 'success' && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-gray-600">100%</span>
              </div>
              <Progress value={100} className="h-2" />
              <p className="text-sm text-gray-600 mt-2">
                🎉 Your app is fully configured and ready to ship!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}