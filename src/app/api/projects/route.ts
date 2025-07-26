import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

// Schema for project creation
const createProjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  framework: z.enum(['nextjs', 'react', 'vue', 'angular', 'node']),
  template: z.enum(['saas', 'marketplace', 'ai-chat', 'dashboard']),
  features: z.array(z.string()),
  database: z.enum(['postgresql', 'mysql', 'mongodb', 'sqlite']),
  auth: z.enum(['nextauth', 'clerk', 'auth0', 'supabase']),
  payment: z.enum(['stripe', 'paddle', 'lemonsqueezy', 'none']),
  deployment: z.enum(['vercel', 'netlify', 'aws', 'custom'])
});

// GET /api/projects - Get all projects for the user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // In a real app, this would fetch from database
    const projects = [
      {
        id: '1',
        name: 'My First AI App',
        description: 'AI-powered application',
        status: 'active',
        framework: 'nextjs',
        createdAt: new Date().toISOString(),
        url: 'https://my-first-app.vercel.app',
        metrics: {
          users: 248,
          apiCalls: 12500,
          uptime: 99.9
        }
      },
      {
        id: '2',
        name: 'E-Commerce Platform',
        description: 'Modern online store',
        status: 'building',
        framework: 'react',
        createdAt: new Date().toISOString(),
        url: null,
        metrics: {
          users: 0,
          apiCalls: 0,
          uptime: 0
        }
      }
    ];

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate request body
    const validatedData = createProjectSchema.parse(body);

    // In a real app, this would:
    // 1. Create project in database
    // 2. Set up Git repository
    // 3. Configure deployment
    // 4. Initialize project structure
    
    const project = {
      id: Date.now().toString(),
      ...validatedData,
      userId: session.user.id || session.user.email,
      status: 'initializing',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Simulate async project creation
    setTimeout(() => {
      console.log('Project created:', project);
    }, 1000);

    return NextResponse.json({ 
      project,
      message: 'Project created successfully'
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}