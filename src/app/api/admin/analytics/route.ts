import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/admin-auth'

// Generate mock analytics data based on time range
const generateAnalyticsData = (range: string) => {
  const days = range === '24h' ? 1 : range === '7d' ? 7 : range === '30d' ? 30 : 90
  
  // Generate date labels
  const dates = []
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    dates.push(date.toISOString().split('T')[0])
  }

  // Generate user metrics
  const newUsers = dates.map(date => ({
    date: date.split('-').slice(1).join('/'),
    count: Math.floor(Math.random() * 50) + 20
  }))

  const activeUsers = dates.map(date => ({
    date: date.split('-').slice(1).join('/'),
    count: Math.floor(Math.random() * 200) + 300
  }))

  // Generate project metrics
  const projectsCreated = dates.map(date => ({
    date: date.split('-').slice(1).join('/'),
    count: Math.floor(Math.random() * 30) + 10
  }))

  // Generate API metrics
  const apiCalls = dates.map(date => ({
    date: date.split('-').slice(1).join('/'),
    count: Math.floor(Math.random() * 5000) + 10000
  }))

  const apiLatency = dates.map(date => ({
    date: date.split('-').slice(1).join('/'),
    avg: Math.floor(Math.random() * 50) + 100,
    p95: Math.floor(Math.random() * 100) + 200,
    p99: Math.floor(Math.random() * 150) + 300
  }))

  return {
    overview: {
      totalUsers: 12847,
      totalProjects: 3421,
      totalApiCalls: 2450000,
      revenue: 128500,
      activeSubscriptions: 412,
      churnRate: 2.8
    },
    userMetrics: {
      newUsers,
      activeUsers,
      retentionRate: 78.5,
      avgSessionDuration: '12m 34s'
    },
    projectMetrics: {
      projectsCreated,
      projectTypes: [
        { type: 'Web App', count: 1234, percentage: 36 },
        { type: 'Mobile App', count: 890, percentage: 26 },
        { type: 'API', count: 756, percentage: 22 },
        { type: 'Dashboard', count: 541, percentage: 16 }
      ],
      avgCompletionTime: '2h 15m',
      successRate: 92.3
    },
    apiMetrics: {
      apiCalls,
      apiLatency,
      errorRate: 0.12,
      topEndpoints: [
        { endpoint: '/api/chat', calls: 823000, avgTime: 145 },
        { endpoint: '/api/generate', calls: 412000, avgTime: 2340 },
        { endpoint: '/api/projects', calls: 234000, avgTime: 89 },
        { endpoint: '/api/auth', calls: 198000, avgTime: 56 },
        { endpoint: '/api/export', calls: 87000, avgTime: 1240 }
      ]
    },
    platformHealth: {
      uptime: 99.95,
      avgResponseTime: 178,
      errorRate: 0.12,
      satisfaction: 94.7
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const auth = await requireAdminAuth(request, 'view_analytics')
    if (!auth.authorized) {
      return NextResponse.json(
        { error: auth.error || 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get time range from query params
    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '7d'

    // Generate analytics data
    const analyticsData = generateAnalyticsData(range)

    return NextResponse.json({
      success: true,
      data: analyticsData,
      range
    })

  } catch (error) {
    console.error('Admin analytics error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// OPTIONS for CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}