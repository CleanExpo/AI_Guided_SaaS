// Mark as dynamic to prevent static generation
export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';

function getFeatureStatus(feature: string): boolean {
    const features: Record<string, boolean> = {
        authentication: true,
        collaboration: true,
        analytics: false,
        notifications: true
    };
    return features[feature] || false
}

export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        const url = new URL(request.url);
        const feature = url.searchParams.get('feature');
        
        // Return specific feature flag status
        if (feature) {
            const enabled = getFeatureStatus(feature)
            return NextResponse.json({
                feature,
                enabled    })
}
        
        // Return all configuration
        const config = { features: {
                authentication: true,
                collaboration: true,
                analytics: false,
                notifications: true
            },
            version: '1.0.0',
            environment: process.env.NODE_ENV || 'development'
        };
        
        return NextResponse.json(config)
} catch (error) {
        console.error('Config API error:', error);
        return NextResponse.json({ error: 'Failed to fetch configuration' }, { status: 500   
    })
}
}