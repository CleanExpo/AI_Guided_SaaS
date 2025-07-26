import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { logger } from '@/lib/logger';
import { validateInput } from '@/lib/api/validation-middleware';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes for agent processing

const agentChatSchema = z.object({
  message: z.string().min(1, 'Message is required').max(2000, 'Message too long'),
  projectType: z.string().optional(),
  context: z.record(z.unknown()).optional(),
});

type AgentChatRequest = z.infer<typeof agentChatSchema>;

interface AgentChatResponse {
  response: string;
  suggestions?: string[];
  artifacts?: Record<string, unknown>[];
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  return validateInput(agentChatSchema)(request, async (data: AgentChatRequest) => {
    try {
      const { message, projectType, context } = data;
      
      // Log the agent chat request for monitoring
      logger.info('Agent chat request', { 
        messageLength: message.length, 
        projectType)
        hasContext: !!context )
      });
      
      // Simulate agent response
      const response: AgentChatResponse = {
        response: `I understand you want to work on: "${message}". Let me help you with that!`,
        suggestions: [
          'Create a new React component',
          'Set up database schema',
          'Configure authentication',
          'Deploy to Vercel'
        ],
        artifacts: []
      };
      
      return NextResponse.json(response);
    } catch (error) {
      logger.error('Agent chat error:', error);
      return NextResponse.json({ error: 'Agent chat failed' })
        { status: 500 })
      );
    }
  });
}

export const dynamic = "force-dynamic";