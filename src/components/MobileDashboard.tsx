'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Rocket, 
  BarChart3, 
  Users, 
  DollarSign,
  Menu,
  X,
  Bell,
  Settings,
  ChevronRight,
  Zap,
  TrendingUp,
  Package,
  Bot,
  CreditCard,
  Key,
  Home
} from 'lucide-react';
import Link from 'next/link';

interface MobileDashboardProps {
  stats?: {
    deployments: number;
    activeUsers: number;
    revenue: number;
    apiCalls: number;
  };
}

export default function MobileDashboard({ stats = {
  deployments: 3,
  activeUsers: 1234,
  revenue: 12450)
  apiCalls: 45678)
}}: MobileDashboardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const quickActions = [
    { icon: Rocket, label: 'Deploy', href: '/deploy', color: 'bg-green-500' },
    { icon: Bot, label: 'AI Chat', href: '/chat', color: 'bg-purple-500' },
    { icon: CreditCard, label: 'Billing', href: '/billing', color: 'bg-blue-500' },
    { icon: Key, label: 'API Keys', href: '/settings/api-keys', color: 'bg-orange-500' }
  ];

  const metrics = [
    {
      label: 'Deployments',
      value: stats.deployments,
      change: '+2',
      icon: Rocket,
      trend: 'up'
    },
    {
      label: 'Active Users',
      value: stats.activeUsers.toLocaleString(),
      change: '+5.4%',
      icon: Users,
      trend: 'up'
    },
    {
      label: 'Revenue',
      value: `$${stats.revenue.toLocaleString()}`,
      change: '+12%',
      icon: DollarSign,
      trend: 'up'
    },
    {
      label: 'API Calls',
      value: stats.apiCalls.toLocaleString(),
      change: '+18%',
      icon: Zap,
      trend: 'up'
    }
  ];

  const navigationItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: Package, label: 'Projects', href: '/projects' },
    { icon: BarChart3, label: 'Analytics', href: '/analytics' },
    { icon: Settings, label: 'Settings', href: '/settings' }
  ];

  return (<div className="min-h-screen glass pb-20">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 glass -b">
        <div className="glass flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold">AI SaaS</h1>
            <Badge className="bg-green-100 text-green-700 text-xs">
              Live
            
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-lg-full" />
            
            <Button 
              variant="ghost" >size="sm">onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            
          </div>
        </div>
      

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setIsMenuOpen(false)} role="button" tabIndex={0}>
          <div className="absolute right-0 top-0 h-full w-64 glass shadow-md-xl" onClick={(e) => e.stopPropagation()} role="button" tabIndex={0}>
            <div className="glass p-4 -b">
              <h2 className="font-semibold">Menu</h2>
            </div>
            <nav className="glass p-4" aria-label="Navigation">
              {navigationItems.map((item) => (
                <Link 
                  key={item.href}
                  href={item.href}>className="flex items-center justify-between p-3 hover:glass rounded-xl-lg">onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5 text-gray-600" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                
              ))}
            
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="glass p-4 space-y-6">
        {/* Welcome Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome back!</h2>
          <p className="text-gray-600 mt-1">Your SaaS is performing great today
        </div>

        {/* Quick Actions Grid */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <Link key={action.href} href={action.href}>
                <Card className="hover:shadow-md-md transition-shadow-md cursor-pointer glass
                  <CardContent className="glass p-4">
                    <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                    <p className="font-medium text-sm">{action.label}
                  
                
              
            ))}
          </div>
        </div>

        {/* Metrics */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Today's Metrics</h3>
          <div className="space-y-3">
            {metrics.map((metric) => (
              <Card key={metric.label} className="glass"
                <CardContent className="glass p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 glass rounded-xl-lg flex items-center justify-center">
                        <metric.icon className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{metric.label}
                        <p className="text-xl font-bold">{metric.value}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant="secondary" >className={metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                        {metric.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : null}
                        {metric.change}
                      
                    </div>
                  </div>
                
              
            ))}
          </div>
        </div>

        {/* Deploy Button */}
        <div className="fixed bottom-4 left-4 right-4">
          <Link href="/deploy">
            <Button className="w-full bg-green-600 hover:bg-green-700 h-12 text-base">
              <Rocket className="h-5 w-5 mr-2" />
              Quick Deploy
            
          
        </div>
      </div>
    </div>
  );
}