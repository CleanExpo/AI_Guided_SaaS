'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  CardEnhanced,
  CardEnhancedContent,
  CardEnhancedDescription,
  CardEnhancedHeader,
  CardEnhancedTitle,
} from '@/components/ui/card-enhanced';
import { ButtonPremium } from '@/components/ui/button-premium';
import { ThemeToggle } from '@/lib/theme/dark-mode';
import {
  BarChart3,
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  Zap,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Download,
  Filter,
  Calendar,
  Bell,
  Settings,
  Plus,
} from 'lucide-react';

// Mock data for demonstration
const generateMockData = () => ({
  metrics: {
    totalUsers: Math.floor(Math.random() * 10000) + 5000,
    revenue: Math.floor(Math.random() * 50000) + 25000,
    conversionRate: (Math.random() * 5 + 2).toFixed(1),
    activeProjects: Math.floor(Math.random() * 100) + 50,
  },
  trends: {
    users: Math.random() > 0.5 ? 'up' : 'down',
    revenue: Math.random() > 0.3 ? 'up' : 'down',
    conversion: Math.random() > 0.4 ? 'up' : 'down',
    projects: Math.random() > 0.6 ? 'up' : 'down',
  },
  chartData: Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    users: Math.floor(Math.random() * 1000) + 500,
    revenue: Math.floor(Math.random() * 5000) + 2000,
  })),
  recentActivity: [
    { id: 1, action: 'New user registered', time: '2 minutes ago', type: 'user' },
    { id: 2, action: 'Payment received', time: '5 minutes ago', type: 'payment' },
    { id: 3, action: 'Project created', time: '12 minutes ago', type: 'project' },
    { id: 4, action: 'API call made', time: '18 minutes ago', type: 'api' },
    { id: 5, action: 'User upgraded plan', time: '25 minutes ago', type: 'upgrade' },
  ],
});

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down';
  icon: React.ElementType;
  delay: number;
}

function MetricCard({ title, value, change, trend, icon: Icon, delay }: MetricCardProps) {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      <CardEnhanced variant="glass" hover className="relative overflow-hidden">
        <CardEnhancedHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardEnhancedTitle className="text-sm font-medium">
            {title}
          </CardEnhancedTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardEnhancedHeader>
        <CardEnhancedContent>
          <div className="text-2xl font-bold">{value}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            {trend === 'up' ? (
              <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
            ) : (
              <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
            )}
            <span className={trend === 'up' ? 'text-green-500' : 'text-red-500'}>
              {change}
            </span>
            <span className="ml-1">from last month</span>
          </div>
        </CardEnhancedContent>
        
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </CardEnhanced>
    </motion.div>
  );
}

function SimpleChart({ data }: { data: any[] }) {
  const maxValue = Math.max(...data.map(d => d.users));
  
  return (
    <div className="flex items-end justify-between h-32 gap-2">
      {data.map((item, index) => (
        <motion.div
          key={item.day}
          className="flex flex-col items-center flex-1"
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          transition={{ duration: 0.8, delay: index * 0.1 }}
        >
          <motion.div
            className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-sm"
            initial={{ height: 0 }}
            animate={{ height: `${(item.users / maxValue) * 100}%` }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
          />
          <span className="text-xs text-muted-foreground mt-2">{item.day}</span>
        </motion.div>
      ))}
    </div>
  );
}

function ActivityFeed({ activities }: { activities: any[] }) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user': return Users;
      case 'payment': return DollarSign;
      case 'project': return Target;
      case 'api': return Zap;
      case 'upgrade': return TrendingUp;
      default: return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'user': return 'text-blue-500';
      case 'payment': return 'text-green-500';
      case 'project': return 'text-purple-500';
      case 'api': return 'text-yellow-500';
      case 'upgrade': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {activities.map((activity, index) => {
          const Icon = getActivityIcon(activity.type);
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center space-x-3 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
            >
              <div className={`p-2 rounded-full bg-gray-100 dark:bg-gray-700 ${getActivityColor(activity.type)}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.action}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export default function DashboardEnhanced() {
  const [data, setData] = useState(generateMockData());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateMockData());
      setLastUpdated(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setData(generateMockData());
    setLastUpdated(new Date());
    setIsRefreshing(false);
  };

  const metrics = [
    {
      title: 'Total Users',
      value: data.metrics.totalUsers.toLocaleString(),
      change: '+12.5%',
      trend: data.trends.users,
      icon: Users,
    },
    {
      title: 'Revenue',
      value: `$${data.metrics.revenue.toLocaleString()}`,
      change: '+8.2%',
      trend: data.trends.revenue,
      icon: DollarSign,
    },
    {
      title: 'Conversion Rate',
      value: `${data.metrics.conversionRate}%`,
      change: '+2.1%',
      trend: data.trends.conversion,
      icon: TrendingUp,
    },
    {
      title: 'Active Projects',
      value: data.metrics.activeProjects.toString(),
      change: '+15.3%',
      trend: data.trends.projects,
      icon: Target,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <ButtonPremium
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              loading={isRefreshing}
              icon={<RefreshCw className="h-4 w-4" />}
              iconPosition="left"
            >
              Refresh
            </ButtonPremium>
            
            <ButtonPremium
              variant="outline"
              size="sm"
              icon={<Download className="h-4 w-4" />}
              iconPosition="left"
            >
              Export
            </ButtonPremium>
            
            <ThemeToggle />
            
            <ButtonPremium
              variant="outline"
              size="sm"
              icon={<Settings className="h-4 w-4" />}
            />
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <MetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            trend={metric.trend as 'up' | 'down'}
            icon={metric.icon}
            delay={index * 0.1}
          />
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Chart */}
        <div className="lg:col-span-2">
          <CardEnhanced variant="glass">
            <CardEnhancedHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardEnhancedTitle>User Activity</CardEnhancedTitle>
                  <CardEnhancedDescription>
                    Daily active users over the past week
                  </CardEnhancedDescription>
                </div>
                <div className="flex items-center gap-2">
                  <ButtonPremium
                    variant="outline"
                    size="sm"
                    icon={<Filter className="h-4 w-4" />}
                  />
                  <ButtonPremium
                    variant="outline"
                    size="sm"
                    icon={<Calendar className="h-4 w-4" />}
                  />
                </div>
              </div>
            </CardEnhancedHeader>
            <CardEnhancedContent>
              <SimpleChart data={data.chartData} />
            </CardEnhancedContent>
          </CardEnhanced>
        </div>

        {/* Activity Feed */}
        <div>
          <CardEnhanced variant="glass">
            <CardEnhancedHeader>
              <div className="flex items-center justify-between">
                <CardEnhancedTitle>Recent Activity</CardEnhancedTitle>
                <ButtonPremium
                  variant="outline"
                  size="sm"
                  icon={<Bell className="h-4 w-4" />}
                />
              </div>
            </CardEnhancedHeader>
            <CardEnhancedContent>
              <ActivityFeed activities={data.recentActivity} />
            </CardEnhancedContent>
          </CardEnhanced>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <CardEnhanced variant="glass" hover className="cursor-pointer">
          <CardEnhancedContent className="flex items-center justify-center p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold">New Project</h3>
              <p className="text-sm text-muted-foreground">Create a new project</p>
            </div>
          </CardEnhancedContent>
        </CardEnhanced>

        <CardEnhanced variant="glass" hover className="cursor-pointer">
          <CardEnhancedContent className="flex items-center justify-center p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold">Invite Team</h3>
              <p className="text-sm text-muted-foreground">Add team members</p>
            </div>
          </CardEnhancedContent>
        </CardEnhanced>

        <CardEnhanced variant="glass" hover className="cursor-pointer">
          <CardEnhancedContent className="flex items-center justify-center p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold">Analytics</h3>
              <p className="text-sm text-muted-foreground">View detailed reports</p>
            </div>
          </CardEnhancedContent>
        </CardEnhanced>

        <CardEnhanced variant="glass" hover className="cursor-pointer">
          <CardEnhancedContent className="flex items-center justify-center p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold">API Keys</h3>
              <p className="text-sm text-muted-foreground">Manage integrations</p>
            </div>
          </CardEnhancedContent>
        </CardEnhanced>
      </div>
    </div>
  );
}
