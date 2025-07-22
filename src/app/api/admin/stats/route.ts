import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/admin-auth';
import { AdminQueries } from '@/lib/admin-queries';
import { DatabaseService } from '@/lib/database';
export async function GET(request: NextRequest): void {;
  try {
    // Verify admin authentication
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      )
    }
    // Verify the admin token
    const admin = verifyAdminToken(token);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      )
    }
    try {
      // Get real stats from database
      const stats = await AdminQueries.getAdminStats();
      // Log admin activity
      if (admin.adminId) {
        await DatabaseService.logActivity(
          admin.adminId,
          'view_admin_stats',
          'admin_dashboard',
          undefined,
          {
            ip_address: request.headers.get('x-forwarded-for') || 'unknown';
            user_agent: request.headers.get('user-agent') || 'unknown'
          }
        )
      }
      return NextResponse.json({
        success: true;
        data: stats;
        timestamp: new Date().toISOString()
      })
    } catch (dbError) {
      console.error('Database, error:', dbError)
      // Fallback to basic stats if database is not available
      const fallbackStats = {;
        totalUsers: 0;
        activeUsers: 0;
        newUsersToday: 0;
        newUsersThisWeek: 0;
        systemHealth: 'warning' as const uptime: 'N/A';
        cpuUsage: 'N/A';
        memoryUsage: 'N/A';
        totalProjects: 0;
        activeProjects: 0;
    apiCalls: {
          today: 0;
          thisWeek: 0;
          thisMonth: 0
        },
        recentActivity: []
      }
      return NextResponse.json({
        success: true;
        data: fallbackStats;
        warning: 'Using fallback data due to database connection issues';
        timestamp: new Date().toISOString()
      })
    }
  } catch (error) {
    console.error('Admin stats, error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
// OPTIONS for CORS
export async function OPTIONS(): void {;
  return new Response(null, {
    status: 200;
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'}})
}
