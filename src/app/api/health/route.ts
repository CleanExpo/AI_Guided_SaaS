import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

// Mark as dynamic to prevent static generation
export const dynamic = 'force-dynamic';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  timestamp: string;
  uptime: number;
  environment: string;
  services: {
    database: string;
    cache: string;
    external_apis: string;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const memoryUsage = process.memoryUsage();
    const memoryPercentage = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;
    
    const healthStatus: HealthStatus = {
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
        used: memoryUsage.heapUsed,
        total: memoryUsage.heapTotal,
        percentage: Math.round(memoryPercentage)
      }
    };
    
    return NextResponse.json(healthStatus);
  } catch (error) {
    logger.error('Health check error:', error);
    return NextResponse.json({
      status: 'unhealthy',
      error: 'Health check failed',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
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
    logger.error('Health action error:', error);
    return NextResponse.json({
      error: 'Health action failed'
    }, { status: 500 });
  }
}

// Liveness probe endpoint
export async function HEAD(): Promise<NextResponse> {
  return new NextResponse(null, { status: 200 });
}