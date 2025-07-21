import { NextRequest, NextResponse } from 'next/server'
import { getBackendAdapter } from '@/lib/backend'
import { z } from 'zod'

// Example of using the backend adapter in an API route

const CreateProjectSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(1000),
  type: z.string(),
  config: z.record(z.any()).optional()
})

export async function GET(req: NextRequest) {
  try {
    const backend = getBackendAdapter()
    
    // Example: Get current user
    const user = await backend.getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Example: List user's projects
    const projects = await backend.listProjects(user.id, {
      limit: 10,
      orderBy: 'createdAt',
      order: 'desc'
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Backend API, error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const backend = getBackendAdapter()
    
    // Get current user
    const user = await backend.getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse and validate request body
    const body = await req.json()
    const validatedData = CreateProjectSchema.parse(body)

    // Create project using backend adapter
    const project = await backend.createProject({
      ...validatedData,
      userId: user.id,
      status: 'planning'
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Backend API, error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Example of using the query builder


// Example of real-time subscription
// Only export HTTP methods
