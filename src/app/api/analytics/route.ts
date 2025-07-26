// Mark as dynamic to prevent static generation
export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { validateInput } from '@/lib/api/validation-middleware';
import { analyticsSchemas } from '@/lib/api/validation-schemas';

export async function GET(request: NextRequest): Promise<NextResponse> {
    return validateInput(analyticsSchemas.query, 'query')(request, async (params) => {
        try {
            const { type, startDate, endDate, metrics } = params;
        let data;
        
        switch (type) {
            case 'general':
                data = { totalUsers: 1247,
                    activeUsers: 89,
                    pageViews: 5643,
                    bounceRate: 23.4
                 };
                break;
            case 'traffic':
                data = { visits: 2341,
                    uniqueVisitors: 1567,
                    averageSession: '3m 45s'
                 };
                break;
            case 'content':
                data = { topPages: [
                        { path: '/', views: 2341 },
                        { path: '/dashboard', views: 1567 }
                    ]
                };
                break;
            default:
                return NextResponse.json({ error: 'Invalid analytics type' }, { status: 400 });
}
        
            return NextResponse.json({
                type,
                data,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            logger.error('Analytics API error:', error);
            return NextResponse.json({ 
                error: 'Failed to fetch analytics' 
            }, { 
                status: 500 });;
        }
    });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    return validateInput(analyticsSchemas.trackEvent)(request, async (data) => {
        try {
            const { event, properties, timestamp, userId } = data;
            
            // Log the analytics event
            logger.info('Analytics event tracked', { event,
                properties,
                timestamp, userId  });
            
            // In production, this would send to analytics service
            // await sendToAnalyticsService({ event, properties, timestamp, userId });
            
            return NextResponse.json({
                success: true,
                event)
                tracked: true,)
                timestamp: timestamp || new Date().toISOString()
            });
        } catch (error) {
            logger.error('Analytics tracking error:', error);
            return NextResponse.json({ 
                error: 'Failed to track event' 
            }, { 
                status: 500 });;
        }
    });
}