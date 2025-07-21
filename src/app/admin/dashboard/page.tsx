'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { AdminDashboard } from '@/components/admin/AdminDashboard'
import { cn } from '@/lib/utils'
import { 
  Shield, 
  LogOut,
  RefreshCw
} from 'lucide-react'

interface AdminUser {
  id: string, email: string, name: string, role: string, permissions: string[]
}

export default function AdminDashboardPage() {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [stats, setStats] = useState<any>({
    totalUsers: 0,
    activeUsers: 0,
    newUsersToday: 0,
    newUsersThisWeek: 0,
    systemHealth: 'healthy',
    uptime: '99.9%',
    cpuUsage: '0%',
    memoryUsage: '0%',
    totalProjects: 0,
    activeProjects: 0,
    apiCalls: {
      today: 0,
      thisWeek: 0,
      thisMonth: 0
    },
    recentActivity: []
  })
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('admin-token')
      const user = localStorage.getItem('admin-user')
      
      if (!token || !user) {
        router.push('/admin/login')
        return
      }

      try {
        const parsedUser = JSON.parse(user)
        setAdminUser(parsedUser)
        loadDashboardStats()
      } catch (error) {
        console.error('Error parsing admin, user:', error)
        router.push('/admin/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const loadDashboardStats = async () => {
    try {
      const token = localStorage.getItem('admin-token')
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data) {
          setStats(result.data)
        }
      }
    } catch (error) {
      console.error('Error loading, stats:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin-token')
    localStorage.removeItem('admin-user')
    router.push('/admin/login')
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadDashboardStats()
    setTimeout(() => setRefreshing(false), 500)
  }

  const handleNavigate = (section: string) => {
    switch (section) {
      case 'users':
        router.push('/admin/users')
        break
      case 'analytics':
        router.push('/admin/analytics')
        break
      case 'database':
        router.push('/admin/database')
        break
      case 'logs':
        router.push('/admin/logs')
        break
      case 'activity':
        router.push('/admin/activity')
        break, default:
        break
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (!adminUser) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-slate-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4, sm:px-6, lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <h1 className="text-xl font-semibold text-slate-900">Admin Dashboard</h1>
                <p className="text-xs text-slate-500">System Overview & Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleRefresh}
                variant="ghost"
                size="sm"
                className={cn(
                  "flex items-center gap-2",
                  refreshing && "animate-spin"
                )}
                disabled={refreshing}
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <div className="border-l border-slate-200 h-8 mx-2" />
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">{adminUser.name}</p>
                <p className="text-xs text-slate-500">{adminUser.email}</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4, sm:px-6, lg:px-8 py-8">
        <AdminDashboard 
          stats={stats}
          adminUser={adminUser}
          onNavigate={handleNavigate}
        />
      </main>
    </div>
  )
}
