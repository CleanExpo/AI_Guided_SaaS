import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const updates = body.updates || {};
    
    // Simulate pulse configuration update
    return NextResponse.json({
      success: true,
      message: 'Pulse configuration updated',
      config: updates
    });
  } catch (error) {
    console.error('Pulse config error:', error);
    return NextResponse.json(
      { error: 'Failed to update pulse configuration' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const config = {
      interval: 30000,
      enabled: true,
      metrics: ['cpu', 'memory', 'requests']
    };
    
    return NextResponse.json(config);
  } catch (error) {
    console.error('Get pulse config error:', error);
    return NextResponse.json(
      { error: 'Failed to get pulse configuration' },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";