// Mark as dynamic to prevent static generation
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const range = url.searchParams.get('range') || '7d';

    // Simulate analytics data
    const analyticsData = {
      totalUsers: 1247,
      activeUsers: 89,
      pageViews: 5643,
      bounceRate: 23.4,
      range,
      metadata: {
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown'
      }
    };

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}