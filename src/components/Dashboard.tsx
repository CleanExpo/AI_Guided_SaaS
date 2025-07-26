'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSession, signOut } from 'next-auth/react';
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
  CreditCard,
  LogOut,
  Home,
  FolderOpen,
  MessageSquare,
  FileCode,
  Cpu,
  HardDrive,
  Layers,
  Cloud
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [projects, setProjects] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({
    apiCalls: 0,
    deployments: 0,
    activeProjects: 0,
    teamMembers: 1
  });
  
  const { data: session } = useSession();
  const router = useRouter();

  // Simulate real-time data updates
  useEffect(() => {
    const loadProjects = () => {
      setProjects([
        {
          id: 1,
          name: 'My First AI App',
          status: 'active',
          framework: 'Next.js',
          lastDeploy: '2 hours ago',
          url: 'https://my-first-app.vercel.app',
          metrics: {
            users: 248,
            apiCalls: 12500,
            uptime: 99.9
          }
        },
        {
          id: 2,
          name: 'E-Commerce Platform',
          status: 'building',
          framework: 'React',
          lastDeploy: 'In progress',
          url: null,
          metrics: {
            users: 0,
            apiCalls: 0,
            uptime: 0
          }
        },
        {
          id: 3,
          name: 'API Dashboard',
          status: 'active',
          framework: 'Vue.js',
          lastDeploy: '1 day ago',
          url: 'https://api-dashboard.netlify.app',
          metrics: {
            users: 1024,
            apiCalls: 89000,
            uptime: 99.7
          }
        }
      ]);

      setMetrics({
        apiCalls: 101500,
        deployments: 47,
        activeProjects: 3,
        teamMembers: 5
      });
    };

    loadProjects();
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        apiCalls: prev.apiCalls + Math.floor(Math.random() * 100)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleCreateProject = () => {
    router.push('/projects/new');
  };

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  const stats = [
    { 
      title: 'Total API Calls',
      value: metrics.apiCalls.toLocaleString(),
      change: '+12.5%',
      icon: Activity,
      color: 'text-blue-600'
    },
    { 
      title: 'Deployments',
      value: metrics.deployments,
      change: '+8 this week',
      icon: Rocket,
      color: 'text-green-600'
    },
    { 
      title: 'Active Projects',
      value: metrics.activeProjects,
      change: '2 building',
      icon: FolderOpen,
      color: 'text-purple-600'
    },
    { 
      title: 'Team Members',
      value: metrics.teamMembers,
      change: 'Pro plan',
      icon: Users,
      color: 'text-orange-600'
    }
  ];

  const quickActions = [
    { 
      title: 'Create New Project',
      description: 'Start building with AI assistance',
      icon: Plus,
      action: () => router.push('/projects/new'),
      color: 'bg-blue-600'
    },
    { 
      title: 'Deploy to Production',
      description: 'One-click deployment',
      icon: Cloud,
      action: () => router.push('/deploy'),
      color: 'bg-green-600'
    },
    { 
      title: 'View Documentation',
      description: 'Learn best practices',
      icon: FileCode,
      action: () => window.open('/docs', '_blank'),
      color: 'bg-purple-600'
    },
    { 
      title: 'Invite Team',
      description: 'Collaborate with others',
      icon: Users,
      action: () => router.push('/team/invite'),
      color: 'bg-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center gap-2">
                <Rocket className="w-6 h-6 text-blue-600" />
                <span className="text-xl font-bold">AI Platform
              
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/projects" className="text-gray-600 hover:text-gray-900">
                Projects
              
              <Link href="/deployments" className="text-gray-600 hover:text-gray-900">
                Deployments
              
              <Link href="/analytics" className="text-gray-600 hover:text-gray-900">
                Analytics
              
              <Link href="/settings" className="text-gray-600 hover:text-gray-900">
                Settings
              
            

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Search className="w-5 h-5" />
              
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-sm font-medium">{session?.user?.name || 'User'}</div>
                  <div className="text-xs text-gray-500">{session?.user?.email}</div>
                </div>
                <Button variant="ghost" size="icon" onClick={handleSignOut}>
                  <LogOut className="w-5 h-5" />
                
              </div>
            </div>
          </div>
        </div>
      

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
            <p className="text-gray-600 mt-1">Here's what's happening with your projects today.
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  
                  <stat.icon className={cn("w-4 h-4", stat.color)} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-gray-600 mt-1">{stat.change}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Card 
                  key={index} 
                  className="cursor-pointer hover:shadow-lg transition-all"
                  onClick={action.action}>
                  <CardContent className="p-6">
                    <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center mb-4", action.color)}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-1">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Projects Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Your Projects</h2>
              <Button onClick={handleCreateProject}>
                <Plus className="w-4 h-4 mr-2" />
                New Project
              
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{project.name}
                      <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                        {project.status}
                      
                    </div>
                    <CardDescription>{project.framework}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Last deploy:
                        <span className="font-medium">{project.lastDeploy}
                      </div>
                      
                      {project.status === 'active' && (
                        <>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Users
                              <span className="font-medium">{project.metrics.users}
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">API Calls
                              <span className="font-medium">{project.metrics.apiCalls.toLocaleString()}
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Uptime
                              <span className="font-medium">{project.metrics.uptime}%
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button size="sm" className="flex-1" onClick={() => window.open(project.url, '_blank')}>
                              <Play className="w-4 h-4 mr-2" />
                              View Live
                            
                            <Button size="sm" variant="outline" className="flex-1">
                              <Settings className="w-4 h-4 mr-2" />
                              Settings
                            
                          </div>
                        </>
                      )}
                      
                      {project.status === 'building' && (
                        <div className="space-y-2">
                          <Progress value={45} className="w-full" />
                          <p className="text-sm text-gray-600 text-center">Building... 45%
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Resource Usage */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Resource Usage</h2>
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">CPU Usage
                      <span className="text-sm font-medium">32%
                    </div>
                    <Progress value={32} className="w-full" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Memory
                      <span className="text-sm font-medium">2.4GB / 8GB
                    </div>
                    <Progress value={30} className="w-full" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Storage
                      <span className="text-sm font-medium">45GB / 100GB
                    </div>
                    <Progress value={45} className="w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      
    </div>
  );
}