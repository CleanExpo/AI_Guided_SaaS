import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes for agent processing
interface AgentChatRequest {
  message: string,
  projectType?: string,
  context?: Record<string, any>
}
interface AgentChatResponse {
  response: string,
  suggestions?: string[],
  artifacts?: any[]
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const body: AgentChatRequest = await request.json();
        const { message, projectType, context } = body;
        if (!message) {
            return NextResponse.json(
                { error: 'Message is required' }, { status: 400 }
            )
        }
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
        return NextResponse.json(response)
    } catch (error) {
        console.error('Agent chat error:', error);
        return NextResponse.json(
            { error: 'Agent chat failed' }, { status: 500 }
        )
    }}

export const dynamic = "force-dynamic";