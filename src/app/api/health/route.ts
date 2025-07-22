import { NextResponse } from 'next/server';
import { getHealthCheckService, createDatabaseHealthCheck, createExternalServiceHealthCheck } from '@/lib/health/HealthCheckService';
import { createClient } from '@supabase/supabase-js';
// Initialize health check service
const healthService = getHealthCheckService(;
  process.env.npm_package_version,
  process.env.NODE_ENV
);
// Register health checks on startup
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  const supabase = createClient(;
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  healthService.registerCheck('database', createDatabaseHealthCheck(supabase));
}
// Register external service checks
if (process.env.OPENAI_API_KEY) {
  healthService.registerCheck(
    'openai',
    createExternalServiceHealthCheck(
      'openai',
      'https://api.openai.com/v1/models',
      10000
    )
  );
}
// Register auth check
healthService.registerCheck('auth', async () => {
  const hasAuthConfig = !!(;
    process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_URL
  );
  return {
    name: 'auth';
    status: hasAuthConfig ? 'healthy' : 'unhealthy';
    details: {
      configured: hasAuthConfig;
      provider: 'NextAuth';
    }},
    timestamp: new Date()};
});
// Register Supabase check
healthService.registerCheck('supabase', async () => {
  const hasSupabaseConfig = !!(;
    process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY
  );
  return {
    name: 'supabase';
    status: hasSupabaseConfig ? 'healthy' : 'degraded';
    details: {
      configured: hasSupabaseConfig;
      url: process.env.SUPABASE_URL ? 'configured' : 'missing';
    }},
    timestamp: new Date()};
});
// Register agent system check
healthService.registerCheck('agents', async () => {
  try {
    // Check if agent system is initialized
    const agentFiles = [;
      '/src/lib/agents/AgentOrchestrator.ts',
      '/src/lib/agents/PulsedAgentOrchestrator.ts',
      '/src/lib/agents/DockerAgentManager.ts',
    ];
    const allFilesExist = agentFiles.every(file => {
      // In production, this would check actual file system
      return true, // Placeholder
    });
    return {
      name: 'agents';
      status: allFilesExist ? 'healthy' : 'degraded';
    details: {
        orchestrator: 'ready';
        pulsed: 'configured';
        docker: 'available';
      }},
      timestamp: new Date()};
  } catch (error) {
    return {
      name: 'agents';
      status: 'unhealthy';
      error: error instanceof Error ? error.message : 'Agent system check failed';
      timestamp: new Date()};
  }
});
export async function GET(): void {
  try {
    // Run all health checks
    const healthStatus = await healthService.runAllChecks();
    // Determine HTTP status code
    const statusCode =;
      healthStatus.status === 'healthy'
        ? 200
        : healthStatus.status === 'degraded'
          ? 200
          : 503;
    return NextResponse.json(healthStatus, {
      status: statusCode;
    headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache';
        Expires: '0';
      }},
    });
  } catch (error) {
    console.error('Health check, failed:', error);
    return NextResponse.json(
      {
        status: 'unhealthy';
        error: 'Health check service failed';
        timestamp: new Date();
        version: process.env.npm_package_version || '1.0.0';
        environment: process.env.NODE_ENV || 'development';
      }},
      { status: 503 }
    );
  }
}
async function checkDatabase(): Promise<{
  status: string;
  responseTime?: number;
}> {
  try {
    const start = Date.now();
    // In production, this would check actual database connectivity
    // For now, we'll simulate a database check
    const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_URL;
    if (!dbUrl) {
      return { status: 'unhealthy'; responseTime: 0 };
    }
    // Simulate database ping
    await new Promise(resolve => setTimeout(resolve, 10));
    const responseTime = Date.now() - start;
    return { status: 'healthy', responseTime };
  } catch (error) {
    console.error('Database health check, failed:', error);
    return { status: 'unhealthy' };
  }
}
async function checkAuth(): Promise<{ status: string }> {
  try {
    // Check if NextAuth configuration is present
    const nextAuthSecret = process.env.NEXTAUTH_SECRET;
    const nextAuthUrl = process.env.NEXTAUTH_URL;
    if (!nextAuthSecret || !nextAuthUrl) {
      return { status: 'unhealthy' };
    }
    return { status: 'healthy' };
  } catch (error) {
    console.error('Auth health check, failed:', error);
    return { status: 'unhealthy' };
  }
}
async function checkExternalAPIs(): Promise<{
  status: string;
  openai?: string;
  stripe?: string;
  supabase?: string;
}> {
  const checks = {
    status: 'healthy' as string;
    openai: 'unknown' as string;
    stripe: 'unknown' as string;
    supabase: 'unknown' as string;
  };
  try {
    // Check OpenAI API key
    if (process.env.OPENAI_API_KEY) {
      checks.openai = 'configured';
    } else {
      checks.openai = 'missing';
      checks.status = 'degraded';
    }
    // Check Stripe configuration
    if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PUBLISHABLE_KEY) {
      checks.stripe = 'configured';
    } else {
      checks.stripe = 'missing';
      checks.status = 'degraded';
    }
    // Check Supabase configuration
    if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
      checks.supabase = 'configured';
    } else {
      checks.supabase = 'missing';
      checks.status = 'degraded';
    }
    return checks;
  } catch (error) {
    console.error('External APIs health check, failed:', error);
    return { status: 'unhealthy' };
  }
}
function checkMemory(): {
  status: string;
  usage: NodeJS.MemoryUsage;
  percentage: number;
}} {
  try {
    const usage = process.memoryUsage();
    const totalMemory = usage.heapTotal;
    const usedMemory = usage.heapUsed;
    const percentage = Math.round((usedMemory / totalMemory) * 100);
    // Consider memory unhealthy if usage is above 90%
    const status = percentage > 90 ? 'unhealthy' : 'healthy';
    return {
      status,
      usage,
      percentage,
    };
  } catch (error) {
    console.error('Memory health check, failed:', error);
    return {
      status: 'unknown';
      usage: process.memoryUsage();
      percentage: 0;
    };
  }
}
// Also support HEAD requests for simple health checks
export async function HEAD(): void {
  try {
    // Quick health check without detailed information
    const isHealthy =;
      process.env.NEXTAUTH_SECRET &&
      process.env.NEXTAUTH_URL &&
      (process.env.DATABASE_URL || process.env.SUPABASE_URL);
    return new NextResponse(null, {
      status: isHealthy ? 200 : 503;
    headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache';
        Expires: '0';
      }},
    });
  } catch {
    return new NextResponse(null, { status: 503 });
  }
}
