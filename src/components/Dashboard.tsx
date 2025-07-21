'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Wrench,
  BarChart3,
  Users,
  FileText,
  TrendingUp,
  Clock,
  Rocket,
  Plus,
  Github,
  Palette,
  Code,
  Zap,
  Star,
  ArrowRight,
  Calendar,
  Activity} from 'lucide-react';
import Link from 'next/link';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'draft';
  lastUpdated: string;
  type: 'repository' | 'ui-component' | 'form' | 'template';
  progress?: number;
}

interface DashboardStats {
  projectsCreated: number;
  componentsBuilt: number;
  deploymentsThisWeek: number;
  timesSaved: string;
}

const quickActions = [
  {
    title: 'Analyze Repository',
    description: 'Upload or connect your GitHub repo for AI analysis',
    href: '/analyze',
    icon: Github,
    color: 'bg-gradient-to-br from-blue-500 to-blue-600',
    featured: true},
  {
    title: 'UI Builder',
    description: 'Create beautiful components with drag & drop',
    href: '/ui-builder',
    icon: Palette,
    color: 'bg-gradient-to-br from-purple-500 to-purple-600',
    featured: true},
  {
    title: 'Form Builder',
    description: 'Build dynamic forms in minutes',
    href: '/form-builder',
    icon: Wrench,
    color: 'bg-gradient-to-br from-green-500 to-green-600',
    featured: true},
  {
    title: 'Browse Templates',
    description: 'Start with pre-built project templates',
    href: '/templates',
    icon: FileText,
    color: 'bg-gradient-to-br from-orange-500 to-orange-600',
    featured: false},
  {
    title: 'Team Collaboration',
    description: 'Invite team members and collaborate',
    href: '/collaborate',
    icon: Users,
    color: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
    featured: false},
  {
    title: 'Analytics',
    description: 'View your project insights',
    href: '/analytics',
    icon: BarChart3,
    color: 'bg-gradient-to-br from-teal-500 to-teal-600',
    featured: false}];

const recentProjects: Project[] = [
  {
    id: '1',
    name: 'E-commerce Dashboard',
    description: 'Modern React dashboard with analytics',
    status: 'active',
    lastUpdated: '2 hours ago',
    type: 'repository',
    progress: 75},
  {
    id: '2',
    name: 'Contact Form Component',
    description: 'Reusable contact form with validation',
    status: 'completed',
    lastUpdated: '1 day ago',
    type: 'ui-component'},
  {
    id: '3',
    name: 'Landing Page Template',
    description: 'SaaS landing page with modern design',
    status: 'draft',
    lastUpdated: '3 days ago',
    type: 'template',
    progress: 30}];

export default function Dashboard() {
  const { data: session } = useSession();
  const [stats] = useState<DashboardStats>({
    projectsCreated: 12,
    componentsBuilt: 34,
    deploymentsThisWeek: 8,
    timesSaved: '24 hours'});

  const getProjectIcon = (type: string) => {
    switch (type) {
      case 'repository':
        return <Github className="h-4 w-4" />;
      case 'ui-component':
        return <Palette className="h-4 w-4" />;
      case 'form':
        return <Wrench className="h-4 w-4" />;
      case 'template':
        return <FileText className="h-4 w-4" />;
      default:
        return <Code className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Active</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Completed</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100, dark:from-slate-900, dark:via-slate-800, dark:to-slate-900">
      <div className="container mx-auto py-8 px-4 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl, md:text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent, dark:from-white, dark:to-gray-300">
              Welcome back{session?.user?.name ? `, ${session.user.name.split(' ')[0]}` : ''}! 👋
            </h1>
            <p className="text-lg text-gray-600, dark:text-gray-300 mt-2">
              Ready to build something amazing today?
            </p>
          </div>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-blue-600 to-purple-600, hover:from-blue-700, hover:to-purple-700 text-white"
            asChild
          >
            <Link href="/analyze">
              <Plus className="mr-2 h-5 w-5" />
              New Project
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6, md:grid-cols-2, lg:grid-cols-4">
          <Card className="bg-white/50 backdrop-blur-sm border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Projects Created
              </CardTitle>
              <Rocket className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900, dark:text-white">{stats.projectsCreated}</div>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <TrendingUp className="inline h-3 w-3 mr-1 text-green-500" />
                +3 this week
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Components Built
              </CardTitle>
              <Palette className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900, dark:text-white">{stats.componentsBuilt}</div>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <TrendingUp className="inline h-3 w-3 mr-1 text-green-500" />
                +7 this week
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Deployments
              </CardTitle>
              <Zap className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900, dark:text-white">{stats.deploymentsThisWeek}</div>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <Calendar className="inline h-3 w-3 mr-1" />
                This week
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Time Saved
              </CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900, dark:text-white">{stats.timesSaved}</div>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <Star className="inline h-3 w-3 mr-1 text-yellow-500" />
                With AI assistance
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-6 text-gray-900, dark:text-white">
            Quick Actions
          </h2>
          
          {/* Featured Actions */}
          <div className="grid gap-6, md:grid-cols-3 mb-6">
            {quickActions.filter(action => action.featured).map(action => (
              <Card
                key={action.title}
                className="group, hover:shadow-xl transition-all duration-300 cursor-pointer bg-white/50 backdrop-blur-sm border-white/20, hover:scale-105"
              >
                <Link href={action.href}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-xl ${action.color} group-hover:scale-110 transition-transform`}>
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                    </div>
                    <CardTitle className="text-lg text-gray-900, dark:text-white group-hover:text-blue-600 transition-colors">
                      {action.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600, dark:text-gray-300">
                      {action.description}
                    </CardDescription>
                  </CardHeader>
                </Link>
              </Card>
            ))}
          </div>

          {/* Other Actions */}
          <div className="grid gap-4, md:grid-cols-2, lg:grid-cols-3">
            {quickActions.filter(action => !action.featured).map(action => (
              <Card
                key={action.title}
                className="group, hover:shadow-md transition-all duration-200 cursor-pointer bg-white/30 backdrop-blur-sm border-white/20"
              >
                <Link href={action.href}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${action.color}`}>
                        <action.icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-base text-gray-900, dark:text-white group-hover:text-blue-600 transition-colors">
                          {action.title}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-600, dark:text-gray-300">
                          {action.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Link>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Projects */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900, dark:text-white">
              Recent Projects
            </h2>
            <Button variant="outline" asChild>
              <Link href="/projects">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid gap-4, md:grid-cols-2, lg:grid-cols-3">
            {recentProjects.map(project => (
              <Card
                key={project.id}
                className="group, hover:shadow-lg transition-all duration-200 cursor-pointer bg-white/50 backdrop-blur-sm border-white/20"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-lg bg-gray-100, dark:bg-gray-800">
                        {getProjectIcon(project.type)}
                      </div>
                      <div>
                        <CardTitle className="text-base text-gray-900, dark:text-white group-hover:text-blue-600 transition-colors">
                          {project.name}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {project.description}
                        </CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(project.status)}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {project.progress && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="text-gray-900 font-medium">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Activity className="h-3 w-3" />
                      <span>Updated {project.lastUpdated}</span>
                    </div>
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Add New Project Card */}
            <Card className="group, hover:shadow-lg transition-all duration-200 cursor-pointer bg-white/30 backdrop-blur-sm border-white/20 border-dashed">
              <Link href="/analyze">
                <CardContent className="flex flex-col items-center justify-center h-full py-12 text-center">
                  <div className="p-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mb-4 group-hover:scale-110 transition-transform">
                    <Plus className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg text-gray-900, dark:text-white mb-2">
                    Start New Project
                  </CardTitle>
                  <CardDescription>
                    Analyze a repository or create something new
                  </CardDescription>
                </CardContent>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
