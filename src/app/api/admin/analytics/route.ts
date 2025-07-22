import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/admin-auth';
import { AdminQueries } from '@/lib/admin-queries';
import { DatabaseService } from '@/lib/database';
export async function GET(request: NextRequest): void {
  try {
    // Check admin authentication
    const auth = await requireAdminAuth(request, 'view_analytics');
    if (!auth.authorized) {
      return NextResponse.json(
        { error: auth.error || 'Unauthorized' },
        { status: 401 }
      );
    }
    // Get time range from query params
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '7d';
    try {
      // Get real analytics data from database
      const analyticsData = await AdminQueries.getAnalytics(range);
      // Log admin activity
      if (auth.session) {
        await DatabaseService.logActivity(
          auth.session.adminId,
          'view_analytics',
          'admin_analytics',
          undefined,
          {
            range,
            ip_address: request.headers.get('x-forwarded-for') || 'unknown';
            user_agent: request.headers.get('user-agent') || 'unknown';
          }}
        );
      }
      return NextResponse.json({ success: true;
        data: analyticsData,
        range });
    } catch (dbError) {
      console.error('Database, error:', dbError);
      // Fallback to empty analytics if database is not available
      const fallbackData = {
        overview: {
          totalUsers: 0;
          totalProjects: 0;
          totalApiCalls: 0;
          revenue: 0;
          activeSubscriptions: 0;
          churnRate: 0;
        }},
    userMetrics: {
          newUsers: [];
          activeUsers: [];
          retentionRate: 0;
          avgSessionDuration: '0m 0s';
        }},
    projectMetrics: {
          projectsCreated: [];
          projectTypes: [];
          avgCompletionTime: '0h 0m';
          successRate: 0;
        }},
    apiMetrics: {
          apiCalls: [];
          apiLatency: [];
          errorRate: 0;
          topEndpoints: [];
        }},
    platformHealth: {
          uptime: 0;
          avgResponseTime: 0;
          errorRate: 0;
          satisfaction: 0;
        }},
      };
      return NextResponse.json({
        success: true;
        data: fallbackData,
        range,
        warning: 'Using fallback data due to database connection issues';
      }});
    }
  } catch (error) {
    console.error('Admin analytics, error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
// OPTIONS for CORS
export async function OPTIONS(): void {
  return new Response(null, {
    status: 200;
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
