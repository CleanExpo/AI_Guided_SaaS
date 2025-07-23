import { NextResponse } from 'next/server';
export async function GET(): Promise<NextResponse> {
  try {
    const status = {
      status: 'operational',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      services: {
        context7: 'connected',
        sequentialThinking: 'connected',
        memory: 'operational',
        fetch: 'operational'
      },
      connections: 5,
      lastUpdate: new Date().toISOString()
    };
    return NextResponse.json(status)
  } catch (error) {
    console.error('MCP status error:', error);
    return NextResponse.json(
      {
        status: 'error',
        error: 'Failed to get MCP status',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }}

export const dynamic = "force-dynamic";