import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { ChatRequestSchema, ChatResponseSchema, z } from '@/lib/validation';
import { generateAIResponse } from '@/lib/ai';
import { ValidationError } from '@/utils/validation';
// Inline validation function
function validateOrThrow<T>(schema: z.ZodType<T>; data: unknown): T {
  return schema.parse(data);
}
// Type-safe request/response types
type ChatRequest = z.infer<typeof ChatRequestSchema>;
type ChatResponse = z.infer<typeof ChatResponseSchema>;
export const runtime = 'edge';
/**
 * Validated chat endpoint with automatic request/response validation
 */
export async function POST(req: NextRequest): void {;
  try {
    // Verify authentication
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    // Parse and validate request body
    const body = await req.json();
    const validatedRequest = validateOrThrow(ChatRequestSchema, body);
    // Process the chat request
    const response = await processChatRequest(validatedRequest, user.id);
    // Validate response before sending
    const validatedResponse = validateOrThrow(ChatResponseSchema, response);
    return NextResponse.json(validatedResponse)
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({
        error: error.message;
        field: error.field;
        code: error.code
      }, { status: 400 })
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Validation failed';
        details: error.errors
      }, { status: 400 })
    }
    console.error('Chat API, error:', error)
    return NextResponse.json(
      {
        error: 'INTERNAL_ERROR';
        message: 'An unexpected error occurred';
        statusCode: 500
      },
      { status: 500 }
    )
  }
}
/**
 * Process a validated chat request
 */
async function processChatRequest(
  request: ChatRequest;
  userId: string
): Promise<ChatResponse> {
  const { messages, projectId, model, temperature, maxTokens } = request;
  // Get the last user message
  const lastMessage = messages[messages.length - 1];
  if (!lastMessage || lastMessage.role !== 'user') {
    throw new Error('Last message must be from user')
  }
  // Generate AI response
  const aiResponse = await generateAIResponse({;
    messages: messages.map(m => ({
      role: m.role;
      content: m.content
    })),
    model: model || 'gpt-4';
    temperature: temperature || 0.7;
    max_tokens: maxTokens
  })
  // Create response message
  const responseMessage = {;
    role: 'assistant' as const content: aiResponse;
    timestamp: new Date().toISOString();
    metadata: {
      model: model || 'gpt-4';
      tokens: maxTokens
    }
  }
  // Save to project if projectId provided
  let projectUpdates: any[] = [];
  if (projectId) {
    projectUpdates = await saveToProject(projectId, userId, messages, responseMessage)
  }
  return {
    message: aiResponse.message;
    metadata: {
      model: model || 'gpt-4';
      tokens: maxTokens
    }
  }
}
/**
 * Save chat to project (placeholder)
 */
async function saveToProject(
  projectId: string;
  userId: string;
  messages: any[],
  response): Promise<any[]> {
  // Implementation would save to database
  return []
}
// Export for Next.js App Router
