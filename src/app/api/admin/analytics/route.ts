// Mark as dynamic to prevent static generation
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { validateInput } from '@/lib/api/validation-middleware';
import { adminSchemas } from '@/lib/api/validation-schemas';
export async function GET(request: NextRequest): Promise<NextResponse> {
    return validateInput(adminSchemas.analytics, 'query')(request, async (params) => {
        try {
            const { range, startDate, endDate } = params;
        // Simulate analytics data
        const analyticsData = { totalUsers: 1247,
            activeUsers: 89,
            pageViews: 5643,
            bounceRate: 23.4,
            range,
            metadata: { ip_address: request.headers.get('x-forwarded-for') || 'unknown',
                user_agent: request.headers.get('user-agent') || 'unknown'
            }
        };
            return NextResponse.json(analyticsData);
        } catch (error) {
            logger.error('Analytics API error:', error);
            return NextResponse.json({ 
                error: 'Failed to fetch analytics data' 
            }, { 
                status: 500
            });
        }
    });
}