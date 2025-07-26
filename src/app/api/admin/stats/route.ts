// Mark as dynamic to prevent static generation
export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        // Simulate stats data
        const stats = { totalUsers: 1247,
            activeUsers: 89,
            totalProjects: 456,
            deployments: 234,
            metadata: { ip_address: request.headers.get('x-forwarded-for') || 'unknown',
                user_agent: request.headers.get('user-agent') || 'unknown'
            },
            timestamp: new Date().toISOString()
}
        return NextResponse.json(stats)
} catch (error) {
        logger.error('Admin stats error:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500   
    })
    }
}