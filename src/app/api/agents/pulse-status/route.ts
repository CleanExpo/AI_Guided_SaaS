import { NextResponse } from 'next/server';
import { getOrchestrator } from '@/lib/agents/AgentOrchestrator';

export async function GET() {
  try {
    const orchestrator = getOrchestrator();
    const status = await orchestrator.getSystemStatus();

    return NextResponse.json(status);
  } catch (error) {
    console.error('Error fetching pulse, status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agent pulse status' },
      { status: 500 }
    );
  }
}
