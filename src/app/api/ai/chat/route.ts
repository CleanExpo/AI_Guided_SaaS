import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

// Schema for chat messages
const chatSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string()
  })),
  model: z.enum(['gpt-4', 'gpt-3.5-turbo', 'claude-3', 'claude-2']).optional(),
  stream: z.boolean().optional()
});

// Mock AI response for demo
const generateAIResponse = (messages: any[]) => {
  const lastMessage = messages[messages.length - 1];
  const userQuery = lastMessage.content.toLowerCase();

  // Simple response logic for demo
  if (userQuery.includes('hello') || userQuery.includes('hi')) {
    return "Hello! I'm your AI assistant. I can help you build amazing applications. What would you like to create today?";
  }
  
  if (userQuery.includes('help')) {
    return "I can help you with:\n\n1. Creating new projects\n2. Writing code\n3. Debugging issues\n4. Deploying applications\n5. Best practices and architecture\n\nWhat specific help do you need?";
  }
  
  if (userQuery.includes('create') || userQuery.includes('build')) {
    return "I'd be happy to help you create a new project! Here are some popular options:\n\n• SaaS Application with authentication and payments\n• AI-powered chatbot\n• E-commerce platform\n• Analytics dashboard\n\nWhich type of application interests you?";
  }
  
  if (userQuery.includes('deploy')) {
    return "I can help you deploy your application! We support:\n\n• Vercel (recommended for Next.js)\n• Netlify\n• AWS\n• Custom servers\n\nThe deployment process is simple - just click the 'Deploy' button in your project dashboard!";
  }

  // Default response
  return `I understand you're asking about "${lastMessage.content}". Let me help you with that.\n\nBased on your query, I can assist with code generation, debugging, or architectural decisions. Could you provide more specific details about what you're trying to achieve?`;
};

// POST /api/ai/chat - Handle AI chat requests
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate request
    const { messages, model = 'gpt-4', stream = false } = chatSchema.parse(body);

    // In a real app, this would:
    // 1. Check user's API limits
    // 2. Call OpenAI/Anthropic API
    // 3. Stream response if requested
    // 4. Log usage for billing

    // For demo, return mock response
    const aiResponse = generateAIResponse(messages);

    if (stream) {
      // For streaming responses, we'd use Server-Sent Events or similar
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          // Simulate streaming
          const words = aiResponse.split(' ');
          for (const word of words) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: word + ' ' })}\n\n`));
            await new Promise(resolve => setTimeout(resolve, 50)); // Simulate delay
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        }
      });

      return new NextResponse(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        }
      });
    }

    // Non-streaming response
    return NextResponse.json({
      message: {
        role: 'assistant',
        content: aiResponse
      },
      usage: {
        prompt_tokens: 50,
        completion_tokens: 100,
        total_tokens: 150
      },
      model
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error in AI chat:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}

// GET /api/ai/chat - Get chat history
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // In a real app, fetch from database
    const chatHistory = [
      {
        id: '1',
        messages: [
          { role: 'user', content: 'Hello!' },
          { role: 'assistant', content: 'Hello! How can I help you build something amazing today?' }
        ],
        createdAt: new Date().toISOString()
      }
    ];

    return NextResponse.json({ chats: chatHistory });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat history' },
      { status: 500 }
    );
  }
}