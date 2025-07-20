import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { 
  ChatRequestSchema, 
  ChatResponseSchema,
  createValidatedApiHandler,
  validateOrThrow,
  ValidationError,
  z
} from '@/lib/validation'
import { generateAIResponse } from '@/lib/ai'

// Type-safe request/response types
type ChatRequest = z.infer<typeof ChatRequestSchema>
type ChatResponse = z.infer<typeof ChatResponseSchema>

export const runtime = 'edge'

/**
 * Validated chat endpoint with automatic request/response validation
 */
export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse and validate request body
    const body = await req.json()
    const validatedRequest = validateOrThrow(ChatRequestSchema, body)

    // Process the chat request
    const response = await processChatRequest(validatedRequest, user.id)

    // Validate response before sending
    const validatedResponse = validateOrThrow(ChatResponseSchema, response)

    return NextResponse.json(validatedResponse)

  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(error.toApiError(), { status: 400 })
    }

    console.error('Chat API error:', error)
    return NextResponse.json(
      { 
        error: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
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
  request: ChatRequest,
  userId: string
): Promise<ChatResponse> {
  const { messages, projectId, model, temperature, maxTokens, stream } = request

  // Get the last user message
  const lastMessage = messages[messages.length - 1]
  if (!lastMessage || lastMessage.role !== 'user') {
    throw new Error('Last message must be from user')
  }

  // Generate AI response
  const aiResponse = await generateAIResponse(lastMessage.content, {
    model: model || 'gpt-4',
    temperature: temperature || 0.7,
    maxTokens,
    messages: messages.map(m => ({
      role: m.role,
      content: m.content
    }))
  })

  // Create response message
  const responseMessage = {
    role: 'assistant' as const,
    content: aiResponse,
    timestamp: new Date().toISOString(),
    metadata: {
      model: model || 'gpt-4',
      tokens: maxTokens
    }
  }

  // Save to project if projectId provided
  let projectUpdates: any[] = []
  if (projectId) {
    projectUpdates = await saveToProject(projectId, userId, messages, responseMessage)
  }

  return {
    message: responseMessage,
    usage: {
      promptTokens: 0, // Would need to calculate from actual API response
      completionTokens: 0,
      totalTokens: 0
    },
    projectUpdates
  }
}

/**
 * Save chat to project (placeholder)
 */
async function saveToProject(
  projectId: string,
  userId: string,
  messages: any[],
  response: any
): Promise<any[]> {
  // Implementation would save to database
  console.log('Saving to project:', projectId)
  return []
}

/**
 * Alternative: Using createValidatedApiHandler helper
 */
export const validatedHandler = createValidatedApiHandler(
  ChatRequestSchema,
  ChatResponseSchema,
  async (request: ChatRequest) => {
    // Your handler logic here
    return {
      message: {
        role: 'assistant',
        content: 'Validated response'
      }
    }
  }
)