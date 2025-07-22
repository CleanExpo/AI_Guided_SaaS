// Mark as dynamic to prevent static generation
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const chatSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  context: z.record(z.any()).optional(),
  sessionId: z.string().optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = chatSchema.parse(body);
    
    // Simulate AI support response
    const response = {
      id: 'msg_' + Math.random().toString(36).substr(2, 9),
      message: `I understand you're asking about: "${validatedData.message}". Here's how I can help...`,
      suggestions: [
        'Check our documentation',
        'Contact technical support',
        'View video tutorials'
      ],
      sessionId: validatedData.sessionId || 'session_' + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json({
      success: true,
      response
    });
    
  } catch (error) {
    console.error('Support chat error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Support chat failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('sessionId');
    
    // Simulate getting chat history
    const chatHistory = [
      {
        id: 'msg_1',
        message: 'Hello! How can I help you today?',
        type: 'bot',
        timestamp: new Date().toISOString()
      }
    ];
    
    return NextResponse.json({
      success: true,
      chatHistory,
      sessionId: sessionId || 'session_new'
    });
  } catch (error) {
    console.error('Get chat history error:', error);
    return NextResponse.json(
      { error: 'Failed to get chat history' },
      { status: 500 }
    );
  }
}