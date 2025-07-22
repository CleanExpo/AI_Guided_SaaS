'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminAnalytics } from '@/components/admin/AdminAnalytics';
import { cn } from '@/lib/utils';
import { BarChart3, LogOut, RefreshCw, ArrowLeft, Download, Calendar, Filter } from 'lucide-react';
interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
}

export default function AdminAnalyticsPage() {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [timeRange, setTimeRange] = useState('7d')
  const [analyticsData, setAnalyticsData] = useState<any>(null)
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
        loadAnalyticsData()
      } catch (error) {
        console.error('Error parsing admin user:', error)
        router.push('/admin/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router, timeRange])

  const loadAnalyticsData = async () => {
    try {
      const token = localStorage.getItem('admin-token')
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data) {
          setAnalyticsData(result.data)
        }
      }
    } catch (error) {
      console.error('Error loading analytics:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin-token')
    localStorage.removeItem('admin-user')
    router.push('/admin/login')
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadAnalyticsData()
    setTimeout(() => setRefreshing(false), 500)
  }

  const handleExport = () => {
    // TODO: Implement export functionality
  }

  if (loading) {
    return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!adminUser) { return null; }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-slate-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                onClick={() => router.push('/admin/dashboard')}
                variant="ghost"
                size="sm"
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <BarChart3 className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <h1 className="text-xl font-semibold text-slate-900">Analytics</h1>
                <p className="text-xs text-slate-500">Platform insights & performance metrics</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="text-sm border border-slate-200 rounded-md px-3 py-1"
              >
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <Button
                onClick={handleExport}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button
                onClick={handleRefresh}
                variant="ghost"
                size="sm"
                className={cn("flex items-center gap-2", refreshing && "animate-spin")}
                disabled={refreshing}
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <div className="border-l border-slate-200 h-8 mx-2" />
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {analyticsData ? (
          <AdminAnalytics 
            data={analyticsData}
            timeRange={timeRange}
          />
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <p className="text-slate-500">Loading analytics data...</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
