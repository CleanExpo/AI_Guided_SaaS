import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { logger } from '@/lib/logger';

const WebhookPayloadSchema = z.object({ )
    action: z.enum(['deploy', 'test', 'notify', 'custom']),
    projectId: z.string(),
    data: z.record(z.unknown()).optional(),
    timestamp: z.string().optional()
    });

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const body = await request.json();
        // Validate input
        const validatedData = WebhookPayloadSchema.parse(body)
        
        // Process webhook based on action
        let result: Record<string, unknown>
        
        switch (validatedData.action) {
            case 'deploy':
                result= { action: 'deploy',
                    status: 'initiated',
                    deploymentId: 'deploy_' + Math.random().toString(36).substr(2, 9)
                };
                break;
            case 'test':
                result= { action: 'test',
                    status: 'running',
                    testId: 'test_' + Math.random().toString(36).substr(2, 9)
                };
                break;
            case 'notify':
                result= { action: 'notify',
                    status: 'sent',
                    recipients: ['admin@example.com']
                };
                break;
            default:
                result = { action: validatedData.action,
                    status: 'processed'
                }
        }
        
        return NextResponse.json({ success: true,)
            webhook: { id: 'webhook_' + Math.random().toString(36).substr(2, 9), projectId: validatedData.projectId,
                ...result,
                processedAt: new Date().toISOString()
            }    })
} catch (error) {
        logger.error('Webhook processing error:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid webhook payload', details: error.errors }, { status: 400   )
    })
}
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500   )
    })
}
}

export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        // Return webhook configuration info
        const webhookInfo= { endpoint: '/api/n8n/webhook',
            supportedActions: ['deploy', 'test', 'notify', 'custom'],
            method: 'POST',
            contentType: 'application/json',
            status: 'active'
        }
        
        return NextResponse.json(webhookInfo)
} catch (error) {
        logger.error('Webhook info error:', error);
        return NextResponse.json({ error: 'Failed to get webhook info' }, { status: 500   )
    })
}
}

export const dynamic = "force-dynamic";