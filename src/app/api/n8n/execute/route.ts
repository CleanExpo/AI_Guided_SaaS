// Mark as dynamic to prevent static generation
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const ExecuteWorkflowSchema = z.object({
  workflowId: z.string(),
  data: z.record(z.any()).optional(),
  mode: z.enum(['manual', 'trigger']).optional()
});

const ExecutionQuerySchema = z.object({
  workflowId: z.string(),
  status: z.enum(['running', 'completed', 'failed']).optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = ExecuteWorkflowSchema.parse(body);
    
    // Simulate workflow execution
    const execution = {
      id: 'exec_' + Math.random().toString(36).substr(2, 9),
      workflowId: validatedData.workflowId,
      status: 'running',
      startTime: new Date().toISOString(),
      data: validatedData.data || {}
    };
    
    return NextResponse.json({
      success: true,
      execution
    }, { status: 201 });
    
  } catch (error) {
    console.error('N8N execution error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Workflow execution failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const workflowId = url.searchParams.get('workflowId');
    
    if (!workflowId) {
      return NextResponse.json(
        { error: 'Workflow ID is required' },
        { status: 400 }
      );
    }
    
    // Simulate getting executions
    const executions = [
      {
        id: 'exec_1',
        workflowId,
        status: 'completed',
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString()
      }
    ];
    
    return NextResponse.json({
      success: true,
      executions
    });
  } catch (error) {
    console.error('Get executions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch executions' },
      { status: 500 }
    );
  }
}