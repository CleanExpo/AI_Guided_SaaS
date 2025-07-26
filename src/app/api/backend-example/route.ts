import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { logger } from '@/lib/logger';

const CreateProjectSchema = z.object({
    name: z.string().min(1).max(200),
    description: z.string().max(1000),
    type: z.string(),
    config: z.record(z.any()).optional()   
})
export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const body = await request.json();
        // Validate input
        const validatedData = CreateProjectSchema.parse(body)
        
        // Simulate project creation
        const project = { id: 'proj_' + Math.random().toString(36).substr(2, 9), ...validatedData,
            status: 'created',
            createdAt: new Date().toISOString()
        }
        
        return NextResponse.json({ success: true,
            message: 'Project created successfully',
            project 
        }, { status: 201 });
} catch (error) {
        logger.error('Create project error:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to create project' }, { status: 500
    })
    }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        // Simulate getting projects list
        const projects = [
            { id: 'proj_1',
                name: 'Example Project 1',
                description: 'First example project',
                type: 'web-app',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            { id: 'proj_2',
                name: 'Example Project 2',
                description: 'Second example project',
                type: 'api',
                status: 'active',
                createdAt: new Date().toISOString()
            }
        ]
        
        return NextResponse.json({ success: true,
            projects,
                total: projects.length   )
    })
} catch (error) {
        logger.error('Get projects error:', error);
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500
    })
    }
}

export const dynamic = "force-dynamic";