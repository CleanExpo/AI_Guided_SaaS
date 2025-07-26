import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { logger } from '@/lib/logger';

function validateOrThrow<T>(schema: z.ZodType<T>, data: unknown): T {
  return schema.parse(data)
}
const chatRequestSchema = z.object({ 
    message: z.string().min(1, 'Message is required'),
    conversationId: z.string().optional(),
    context: z.record(z.any()).optional()   
    })
const chatResponseSchema = z.object({ 
    id: z.string(), 
    message: z.string(),
    conversationId: z.string(), 
    timestamp: z.string()   
    })
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    // Validate input
    const validatedRequest = validateOrThrow(chatRequestSchema, body)
    // Simulate AI response generation

    const response= { id: 'msg_' + Math.random().toString(36).substr(2, 9), message: `You said: "${validatedRequest.message}". Here's my response...`,
      conversationId: validatedRequest.conversationId || 'conv_' + Math.random().toString(36).substr(2, 9), timestamp: new Date().toISOString()
};
    // Validate output using type-safe validation

const validatedResponse = validateOrThrow(chatResponseSchema, response);
    return NextResponse.json({ success: true, response: validatedResponse   
    })
} catch (error) {
    logger.error('Validated chat error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400   
    })
}
    return NextResponse.json({ error: 'Chat failed' }, { status: 500   
    })
}
}
export const dynamic = "force-dynamic";