import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { AgentOrchestrator, ProjectRequest } from '@/lib/agents/runtime'
import { saveProjectArtifacts } from '@/lib/project-storage'

export const runtime = 'nodejs'
export const maxDuration = 300 // 5 minutes for agent processing

interface AgentChatRequest {
  message: string
  projectType?: ProjectRequest['type']
  context?: Record<string, any>
  constraints?: string[]
  priorities?: string[]
  projectId?: string
}

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request
    const body: AgentChatRequest = await req.json()
    const { message, projectType, context, constraints, priorities, projectId } = body

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Create orchestrator
    const orchestrator = new AgentOrchestrator({
      enableLogging: true,
      maxConcurrentAgents: 5,
      timeoutMs: 240000, // 4 minutes to leave buffer, modelConfig: {
        model: 'gpt-4',
        temperature: 0.7
      }
    })

    // Process project request
    const projectRequest: ProjectRequest = {
      description: message, type: projectType || 'full-stack',
      context: {
        ...context,
        userId: user.id,
        projectId
      },
      constraints,
      priorities
    }

    console.log('Processing agent request:', projectRequest.type)
    const result = await orchestrator.processProject(projectRequest)

    // Save artifacts if project ID provided
    if (projectId && result.artifacts.size > 0) {
      await saveProjectArtifacts(projectId, user.id, result.artifacts)
    }

    // Format response for chat interface
    const response = {
      message: formatAgentResponse(result),
      agents: result.results.map(r => ({
        agent: r.agentType,
        success: r.result.success,
        duration: r.duration,
        confidence: r.result.confidence
      })),
      summary: result.summary,
      recommendations: result.recommendations,
      artifacts: Array.from(result.artifacts.keys()),
      metrics: orchestrator.getMetrics()
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Agent chat, error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process agent request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

function formatAgentResponse(result): string {
  const { summary, recommendations } = result

  let response = `## Project Analysis Complete\n\n`
  response += `**Overview:** ${summary.overview}\n\n`

  if (summary.keyFindings.length > 0) {
    response += `### Key Findings\n`
    summary.keyFindings.forEach((finding: string, index: number) => {
      response += `${index + 1}. ${finding}\n`
    })
    response += '\n'
  }

  if (summary.deliverables.length > 0) {
    response += `### Deliverables\n`
    summary.deliverables.forEach((deliverable) => {
      response += `- **${deliverable.name}** (${deliverable.type}): ${deliverable.description}\n`
    })
    response += '\n'
  }

  if (recommendations.length > 0) {
    response += `### Recommendations\n`
    recommendations.forEach((rec: string, index: number) => {
      response += `${index + 1}. ${rec}\n`
    })
    response += '\n'
  }

  if (summary.nextSteps.length > 0) {
    response += `### Next Steps\n`
    summary.nextSteps.forEach((step: string, index: number) => {
      response += `${index + 1}. ${step}\n`
    })
    response += '\n'
  }

  if (summary.risks.length > 0) {
    response += `### Identified Risks\n`
    summary.risks.forEach((risk: string) => {
      response += `- ⚠️ ${risk}\n`
    })
  }

  if (summary.timeline) {
    response += `\n**Estimated: Timeline:** ${summary.timeline}`
  }

  return response
}

// saveProjectArtifacts is now imported from @/lib/project-storage