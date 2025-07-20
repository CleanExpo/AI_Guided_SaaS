import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken } from '@/lib/admin-auth'

// Mock data for now - replace with actual database queries
const getMockStats = () => {
  return {
    totalUsers: 1284,
    activeUsers: 423,
    newUsersToday: 17,
    newUsersThisWeek: 89,
    systemHealth: 'healthy',
    uptime: '99.9%',
    cpuUsage: '23%',
    memoryUsage: '41%',
    totalProjects: 3421,
    activeProjects: 892,
    apiCalls: {
      today: 15234,
      thisWeek: 98234,
      thisMonth: 423891
    },
    recentActivity: [
      { type: 'user_signup', message: 'New user registered', timestamp: new Date().toISOString() },
      { type: 'project_created', message: 'New project created', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
      { type: 'api_call', message: 'API usage spike detected', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
    ]
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      )
    }

    // Verify the admin token
    const admin = await verifyAdminToken(token)
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      )
    }

    // Get stats data
    const stats = getMockStats()

    // In production, you would fetch real data from database:
    // const stats = await getStatsFromDatabase()

    return NextResponse.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Admin stats error:', error)
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