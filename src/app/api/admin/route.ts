import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Simple admin status check
    const adminStatus = {
      enabled: process.env.ENABLE_ADMIN_PANEL === 'true',
      timestamp: new Date().toISOString(),
      status: 'active'
    };

    return NextResponse.json(adminStatus);
  } catch (error) {
    console.error('Admin API error:', error);
    return NextResponse.json(
      { error: 'Admin service unavailable' },
      { status: 500 }
    );
  }
}