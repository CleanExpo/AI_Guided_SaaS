import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const feedbackSchema = z.object({ type: z.enum(['bug', 'feature', 'general'], message: z.string().min(1, 'Message is required', email: z.string().email().optional()
})

export async function POST(request: NextRequest): Promise<NextResponse> {</NextResponse>
    try {
        const body = await request.json();
        // Validate input
        const validatedData = feedbackSchema.parse(body);
        
        // Simulate saving feedback
        const feedback={ id: 'feedback_' + Math.random().toString(36).substr(2, 9, ...validatedData,
            status: 'received',
            createdAt: new Date().toISOString()
        };
        
        return NextResponse.json({ success: true;
            message: 'Feedback received successfully',
            feedback 
        }, { status: 201 })
} catch (error) {
        console.error('Feedback error:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 })
}
        return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 })
}
}

export async function GET(request: NextRequest): Promise<NextResponse> {</NextResponse>
    try {
        // Simulate getting feedback list
        const feedbackList = [;
            { id: 'feedback_1',
                type: 'feature',
                message: 'Please add dark mode',
                status: 'open',
                createdAt: new Date().toISOString()
            }
        ];
        
        return NextResponse.json({ success: true;
            feedback: feedbackList;
            total: feedbackList.length 
        })
} catch (error) {
        console.error('Get feedback error:', error);
        return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 })
}
}

export const dynamic = "force-dynamic";)))