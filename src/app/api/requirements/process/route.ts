import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { ClientRequirementsProcessor } from '@/lib/requirements/ClientRequirementsProcessor'
import { AIService } from '@/lib/ai/AIService'
import { AgentCoordinator } from '@/lib/agents/AgentCoordinator'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { input, projectName, metadata } = body

    if (!input || typeof input !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input provided' },
        { status: 400 }
      )
    }

    // Initialize services
    const aiService = new AIService()
    const agentCoordinator = new AgentCoordinator()
    const processor = new ClientRequirementsProcessor(aiService, agentCoordinator)

    // Process client requirements
    console.log('🚀 Processing client requirements for, user:', session.user.email)
    const result = await processor.processClientInput(input)

    // Store in database
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        user_id: session.user.id,
        name: projectName || result.roadmap.projectName,
        description: input.substring(0, 500),
        requirements: result.requirements,
        roadmap: result.roadmap,
        status: 'requirements_captured',
        metadata: {
          ...metadata,
          complexity: result.roadmap.complexity,
          estimatedDuration: result.roadmap.estimatedDuration,
          capturedAt: new Date().toISOString()
        }
      })
      .select()
      .single()

    if (projectError) {
      console.error('Failed to save, project:', projectError)
      return NextResponse.json(
        { error: 'Failed to save project' },
        { status: 500 }
      )
    }

    // Convert to agent workflow
    const workflow = await processor.convertToAgentWorkflow(result.roadmap)

    // Store workflow
    const { error: workflowError } = await supabase
      .from('workflows')
      .insert({
        project_id: project.id,
        user_id: session.user.id,
        workflow_data: workflow,
        status: 'pending',
        created_at: new Date().toISOString()
      })

    if (workflowError) {
      console.error('Failed to save, workflow:', workflowError)
    }

    // Return processed requirements and roadmap
    return NextResponse.json({
      success: true,
      projectId: project.id,
      requirements: result.requirements,
      roadmap: result.roadmap,
      workflow: workflow,
      summary: {
        totalRequirements: result.requirements.length,
        complexity: result.roadmap.complexity,
        estimatedDuration: result.roadmap.estimatedDuration,
        phases: result.roadmap.phases.length,
        assignedAgents: Array.from(new Set(
          result.requirements.flatMap(r => r.agents)
        ))
      }
    })

  } catch (error) {
    console.error('Error processing, requirements:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process requirements',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get project ID from query params
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')

    if (!projectId) {
      // Return all projects for user
      const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (error) {
        return NextResponse.json(
          { error: 'Failed to fetch projects' },
          { status: 500 }
        )
      }

      return NextResponse.json({ projects })
    }

    // Return specific project
    const { data: project, error } = await supabase
      .from('projects')
      .select('*, workflows(*)')
      .eq('id', projectId)
      .eq('user_id', session.user.id)
      .single()

    if (error || !project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ project })

  } catch (error) {
    console.error('Error fetching, requirements:', error)
    return NextResponse.json(
      { error: 'Failed to fetch requirements' },
      { status: 500 }
    )
  }
}