// Mark as dynamic to prevent static generation
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { validateInput } from '@/lib/api/validation-middleware';
import { z } from 'zod';
import { handleError } from '@/lib/error-handling';

const supportChatSchema = z.object({ 
    message: z.string().min(1, 'Message is required').max(1000, 'Message too long'),
    context: z.record(z.unknown()).optional(),
    sessionId: z.string().optional(),
    userId: z.string().optional(),
    category: z.enum(['technical', 'billing', 'general', 'feedback']).optional().default('general')
});
export async function POST(request: NextRequest): Promise<NextResponse> {
  return validateInput(supportChatSchema)(request, async (data) => {
    try {
      const { message, context, sessionId, userId, category } = data;
      
      // Generate or use existing session ID
      const chatSessionId = sessionId || 'session_' + Math.random().toString(36).substr(2, 9);
      
      // Log support request
      logger.info('Support chat request', {
        sessionId: chatSessionId,
        userId,
        category,
        messageLength: message.length
      });
      
      // Simulate AI support response based on category
      let responseMessage = '';
      let suggestions = [];
      
      switch (category) {
        case 'technical':
          responseMessage = `I see you're having a technical issue. Let me help you with: "${message.substring(0, 50)}..."`;
          suggestions = [
            'Check system status',
            'Review error logs',
            'Try clearing cache',
            'Contact technical support'
          ];
          break;
        case 'billing':
          responseMessage = `I understand you have a billing question about: "${message.substring(0, 50)}..."`;
          suggestions = [
            'View billing history',
            'Update payment method',
            'Download invoices',
            'Contact billing support'
          ];
          break;
        default:
          responseMessage = `I understand you're asking about: "${message.substring(0, 50)}...". Here's how I can help...`;
          suggestions = [
            'Check our documentation',
            'View FAQs',
            'Watch video tutorials',
            'Contact support team'
          ];
      }
      
      const response = {
        id: 'msg_' + Math.random().toString(36).substr(2, 9),
        message: responseMessage,
        suggestions,
        sessionId: chatSessionId,
        category,
        timestamp: new Date().toISOString()
      };
      
      return NextResponse.json({
        success: true,
        response
      });
    } catch (error) {
      handleError(error, {
        operation: 'processSupportChat',
        module: 'support/chat',
        metadata: { 
          sessionId: data.sessionId,
          category: data.category
        }
      });
      
      return NextResponse.json({
        error: 'Support chat failed'
      }, {
        status: 500
      });
    }
  });
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(request.url); const sessionId = url.searchParams.get('sessionId'); // Simulate getting chat history

    const chatHistory = [
      { id: 'msg_1',
        message: 'Hello! How can I help you today?',
        type: 'bot',
        timestamp: new Date().toISOString()}
    ];
    return NextResponse.json({ success: true, chatHistory,
      sessionId: sessionId || 'session_new'   
    })
  } catch (error) {
    handleError(error, {
      operation: 'getChatHistory',
      module: 'support/chat'
    });
    
    return NextResponse.json({
      error: 'Failed to get chat history'
    }, {
      status: 500
    });
  }
}