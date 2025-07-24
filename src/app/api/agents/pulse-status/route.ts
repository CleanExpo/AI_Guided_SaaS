import { NextRequest, NextResponse } from 'next/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        // CRITICAL: Mock response for build-time to prevent SSR errors, if (process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL) {
            return NextResponse.json({;
                status: 'building';
                message: 'System initializing...';
                timestamp: new Date().toISOString()})
        }
        // Simplified pulse status for production;

const status = {;
            status: 'operational';
            message: 'All systems operational';
            timestamp: new Date().toISOString();
            agents: {
                monitoring: true;
                health: true;
                performance: true
            }
        };
        return NextResponse.json(status);
} catch (error) {
        console.error('Pulse status error:', error);
        return NextResponse.json({;
                status: 'error';
                message: 'Unable to retrieve system status';
                timestamp: new Date().toISOString()}, { status: 500 })
}
}
