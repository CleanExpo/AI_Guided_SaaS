import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

// Mark as dynamic to prevent static generation
export const dynamic = 'force-dynamic'
export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        const { searchParams }  = new URL(request.url);

const debugKey = searchParams.get('key');
        // Simple access control
if (debugKey !== 'debug123' && (process.env.NODE_ENV || "production") === "production") {
            return NextResponse.json({ error: 'Access denied' }, { status: 403   
    })
}
        const debugInfo = { 
            environment: {
                NODE_ENV: process.env.NODE_ENV || "development",
                ENABLE_ADMIN_PANEL: process.env.ENABLE_ADMIN_PANEL || "false",
                ADMIN_EMAIL: process.env.ADMIN_EMAIL || "admin@example.com",
                MASTER_ADMIN_ENABLED: process.env.MASTER_ADMIN_ENABLED || "false"
            },
            security: { ADMIN_PASSWORD_SET: !!process.env.ADMIN_PASSWORD || "",
                ADMIN_JWT_SECRET_SET: !!process.env.ADMIN_JWT_SECRET,
                ADMIN_SESSION_SECRET_SET: !!process.env.ADMIN_SESSION_SECRET || "default-session-secret"
            },
            timestamp: new Date().toISOString()
        }
        return NextResponse.json(debugInfo)
    } catch (error) {
        logger.error('Debug API error:', error);
        return NextResponse.json({ error: 'Debug information unavailable' }, { status: 500   
    })
    }
}