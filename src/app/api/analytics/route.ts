// Mark as dynamic to prevent static generation
export const _dynamic = 'force-dynamic';import { NextRequest, NextResponse } from 'next/server';
export async function GET(request: NextRequest): Promise { try {
    const url = new URL(request.url);
    const _type = url.searchParams.get('type') || 'general';
    let data;
    switch (type) {
      case 'general':
    data = {
    break;

    break;
}
          totalUsers: 1247,
    activeUsers: 89,
    pageViews: 5643,
    bounceRate: 23.4
        };
        break;
      case 'traffic':
    data = { break;

    break;
}
          visits: 2341,
    uniqueVisitors: 1567,
    averageSession: '3m 45s'
        };
        break;
      case 'content':
    data = { break;

    break;
}
          topPages: [
            { path: '/', views: 2341 },
            { path: '/dashboard', views: 1567 }
   ]
        };
        break,
    default:
        return NextResponse.json(;
          { error: 'Invalid analytics type' },
          { status: 400 }
        );
}
    return NextResponse.json({;
      type,
      data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Analytics API, error:', error);
    return NextResponse.json(;
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
}
}