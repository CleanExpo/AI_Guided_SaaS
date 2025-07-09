'use client'

// Force deployment trigger - 2025-01-09
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Zap, 
  Wrench, 
  BarChart3, 
  Users, 
  FileText, 
  Settings,
  TrendingUp,
  Activity,
  CheckCircle,
  AlertTriangle,
  Clock,
  Rocket
} from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'

interface DashboardStats {
  totalProjects: number
  activeUsers: number
  systemHealth: number
  deploymentsToday: number
}

interface RecentActivity {
  id: string
  type: 'project' | 'deployment' | 'collaboration' | 'health'
  title: string
  description: string
  timestamp: string
  status: 'success' | 'warning' | 'error' | 'info'
}

const quickActions = [
  {
    title: 'UI Builder',
    description: 'Create and design UI components',
    href: '/ui-builder',
    icon: Wrench,
    color: 'bg-blue-500'
  },
  {
    title: 'Analytics',
    description: 'View platform analytics',
    href: '/analytics',
    icon: BarChart3,
    color: 'bg-green-500'
  },
  {
    title: 'Collaboration',
    description: 'Work with your team',
    href: '/collaborate',
    icon: Users,
    color: 'bg-purple-500'
  },
  {
    title: 'Templates',
    description: 'Browse project templates',
    href: '/templates',
    icon: FileText,
    color: 'bg-orange-500'
  },
  {
    title: 'Admin Panel',
    description: 'System administration',
    href: '/admin',
    icon: Settings,
    color: 'bg-red-500'
  },
  {
    title: 'Health Check',
    description: 'System diagnostics',
    href: '/admin/causal',
    icon: Activity,
    color: 'bg-teal-500'
  }
]

export default function Dashboard() {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeUsers: 0,
    systemHealth: 0,
    deploymentsToday: 0
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Simulate API calls
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setStats({
          totalProjects: 12,
          activeUsers: 8,
          systemHealth: 98,
          deploymentsToday: 5
        })

        setRecentActivity([
          {
            id: '1',
            type: 'project',
            title: 'New UI Component Created',
            description: 'Button component added to design system',
            timestamp: '2 minutes ago',
            status: 'success'
          },
          {
            id: '2',
            type: 'deployment',
            title: 'Production Deployment',
            description: 'Successfully deployed to production',
            timestamp: '15 minutes ago',
            status: 'success'
          },
          {
            id: '3',
            type: 'health',
            title: 'System Health Check',
            description: 'All systems operational',
            timestamp: '1 hour ago',
            status: 'info'
          },
          {
            id: '4',
            type: 'collaboration',
            title: 'Team Member Joined',
            description: 'New team member added to workspace',
            timestamp: '2 hours ago',
            status: 'info'
          }
        ])

        setLoading(false)
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data',
          variant: 'destructive'
        })
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [toast])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-blue-500" />
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
          Welcome back{session?.user?.name ? `, ${session.user.name}` : ""}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your AI-guided SaaS platform today.
          </p>
        </div>
        <Button asChild>
          <Link href="/ui-builder">
            <Rocket className="mr-2 h-4 w-4" />
            Start Building
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +1 from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.systemHealth}%</div>
            <Progress value={stats.systemHealth} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deployments Today</CardTitle>
            <Rocket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.deploymentsToday}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +3 from yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Card key={action.title} className="hover:shadow-md transition-shadow cursor-pointer">
              <Link href={action.href}>
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${action.color}`}>
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{action.title}</CardTitle>
                      <CardDescription>{action.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Link>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Recent Activity</h2>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="p-4 flex items-center space-x-4">
                  {getStatusIcon(activity.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {activity.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{activity.type}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {activity.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Welcome Message for New Users */}
      {!session && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-primary" />
              <span>Welcome to AI Guided SaaS Platform</span>
            </CardTitle>
            <CardDescription>
              Get started by signing in to access all features and begin building your next project.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/auth/signin">
                Sign In to Get Started
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
