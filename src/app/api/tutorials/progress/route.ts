// Mark as dynamic to prevent static generation
export const _dynamic = 'force-dynamic';import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
const progressSchema = z.object({
  tutorialId: z.string(),
    stepId: z.string(),
    completed: z.boolean(),
    userId: z.string().optional()
});
export async function POST(request: NextRequest): Promise {
  try {
    const _body = await request.json();
    // Validate input
    const _validatedData = progressSchema.parse(body);
    // Simulate progress tracking
    const _progress = {
      id: 'progress_' + Math.random().toString(36).substr(2, 9),
      ...validatedData,
      timestamp: new Date().toISOString(),
    progressPercentage: 75
    };
    return NextResponse.json({;
      success: true;
      // progress
    });
  } catch (error) {
    console.error('Tutorial progress, error:', error);
    if(error instanceof z.ZodError) {
      return NextResponse.json(;
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
}
    return NextResponse.json(;
      { error: 'Failed to track progress' },
      { status: 500 }
    );
}
}
export async function GET(request: NextRequest): Promise {
  try {
    const url = new URL(request.url);
    const _tutorialId = url.searchParams.get('tutorialId');
    const _userId = url.searchParams.get('userId');
    // Simulate getting progress
    const _progress = {
      tutorialId,
      userId,
      completedSteps: ['step1', 'step2'],
      totalSteps: 5,
    progressPercentage: 40,
    lastActivity: new Date().toISOString()
    };
    return NextResponse.json({;
      success: true;
      // progress
    });
  } catch (error) {
    console.error('Get progress, error:', error);
    return NextResponse.json(;
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
}
}