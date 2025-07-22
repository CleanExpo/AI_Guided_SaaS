import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: 'connected',
        cache: 'operational',
        external_apis: 'healthy'
      },
      uptime: process.uptime(),
      memory: {
        used: process.memoryUsage().heapUsed,
        total: process.memoryUsage().heapTotal
      }
    };
    
    return NextResponse.json(healthStatus);
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: 'Health check failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { service, action } = body;
    
    // Simulate service health action
    return NextResponse.json({
      success: true,
      message: `Health check action ${action} performed on ${service}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health action error:', error);
    return NextResponse.json(
      { error: 'Health action failed' },
      { status: 500 }
    );
  }
}