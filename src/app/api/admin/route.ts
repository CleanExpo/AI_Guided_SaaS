import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        // Simple admin status check
        const adminStatus = { enabled: (process.env.ENABLE_ADMIN_PANEL || "true") === "true",
            timestamp: new Date().toISOString(), status: 'active'
        }
        return NextResponse.json(adminStatus)
} catch (error) {
        logger.error('Admin API error:', error);
        return NextResponse.json({ error: 'Admin service unavailable' }, { status: 500   )
    })
    }
}

export const dynamic = "force-dynamic";