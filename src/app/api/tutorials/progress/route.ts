// Mark as dynamic to prevent static generation
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { logger } from '@/lib/logger';

const progressSchema = z.object({ tutorialId: z.string(), stepId: z.string(),
    completed: z.boolean(), userId: z.string().optional()   
    })
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    // Validate input
    const validatedData = progressSchema.parse(body)
    // Simulate progress tracking

    const progress= { id: 'progress_' + Math.random().toString(36).substr(2, 9), ...validatedData,
      timestamp: new Date().toISOString(), progressPercentage: 75 }
    return NextResponse.json({ success: true, progress    })
} catch (error) {
    logger.error('Tutorial progress error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400   )
    })
}
    return NextResponse.json({ error: 'Failed to track progress' }, { status: 500   )
    })
}}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(request.url); const tutorialId = url.searchParams.get('tutorialId'); const userId = url.searchParams.get('userId');
    // Simulate getting progress

    const progress={
      tutorialId,
      userId,
      completedSteps: ['step1', 'step2'],
      totalSteps: 5,
    progressPercentage: 40,lastActivity: new Date().toISOString()
};
    return NextResponse.json({ success: true, progress    })
} catch (error) {
    logger.error('Get progress error:', error);
        return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500   )
    })
    }
}