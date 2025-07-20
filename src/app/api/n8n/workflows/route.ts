import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getN8nClient } from '@/lib/automation/n8n-client'
import { createProjectDeploymentWorkflow } from '@/lib/automation/workflows/project-deployment'
import { createTestingAutomationWorkflow } from '@/lib/automation/workflows/testing-automation'
import { createNotificationSystemWorkflow } from '@/lib/automation/workflows/notification-system'

// Workflow creation schema
const CreateWorkflowSchema = z.object({
  type: z.enum(['deployment', 'testing', 'notification', 'custom']),
  projectId: z.string().optional(),
  name: z.string().optional(),
  webhookPath: z.string().optional(),
  customWorkflow: z.object({
    name: z.string(),
    nodes: z.array(z.any()),
    connections: z.record(z.any())
  }).optional()
})

export async function GET(request: NextRequest) {
  try {
    const n8nClient = getN8nClient()
    const workflows = await n8nClient.listWorkflows()
    
    return NextResponse.json({
      success: true,
      workflows: workflows.map(w => ({
        id: w.id,
        name: w.name,
        active: w.active,
        tags: w.tags,
        createdAt: w.createdAt,
        updatedAt: w.updatedAt
      }))
    })
  } catch (error) {
    console.error('Failed to list workflows:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to list workflows' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const payload = CreateWorkflowSchema.parse(body)
    
    const n8nClient = getN8nClient()
    let workflow: any

    switch (payload.type) {
      case 'deployment':
        const projectName = payload.name || payload.projectId || 'project'
        const deployPath = payload.webhookPath || `deploy-${projectName}`
        workflow = createProjectDeploymentWorkflow(projectName, deployPath)
        break

      case 'testing':
        const testProjectName = payload.name || payload.projectId || 'project'
        const testPath = payload.webhookPath || `test-${testProjectName}`
        workflow = createTestingAutomationWorkflow(testProjectName, testPath)
        break

      case 'notification':
        const notifyPath = payload.webhookPath || 'send-notification'
        workflow = createNotificationSystemWorkflow(notifyPath)
        break

      case 'custom':
        if (!payload.customWorkflow) {
          throw new Error('Custom workflow data is required')
        }
        workflow = payload.customWorkflow
        break
    }

    // Create workflow in n8n
    const created = await n8nClient.createWorkflow(workflow)
    
    return NextResponse.json({
      success: true,
      workflow: {
        id: created.id,
        name: created.name,
        active: created.active,
        webhookUrl: payload.webhookPath ? 
          `${process.env.N8N_URL || 'http://localhost:5678'}/webhook/${payload.webhookPath}` : 
          null
      }
    })

  } catch (error) {
    console.error('Failed to create workflow:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid payload', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create workflow' },
      { status: 500 }
    )
  }
}

// Update workflow
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const workflowId = searchParams.get('id')
    
    if (!workflowId) {
      return NextResponse.json(
        { error: 'Workflow ID is required' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const n8nClient = getN8nClient()
    
    const updated = await n8nClient.updateWorkflow(workflowId, body)
    
    return NextResponse.json({
      success: true,
      workflow: {
        id: updated.id,
        name: updated.name,
        active: updated.active
      }
    })

  } catch (error) {
    console.error('Failed to update workflow:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update workflow' },
      { status: 500 }
    )
  }
}

// Delete workflow
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const workflowId = searchParams.get('id')
    
    if (!workflowId) {
      return NextResponse.json(
        { error: 'Workflow ID is required' },
        { status: 400 }
      )
    }

    const n8nClient = getN8nClient()
    await n8nClient.deleteWorkflow(workflowId)
    
    return NextResponse.json({
      success: true,
      message: 'Workflow deleted successfully'
    })

  } catch (error) {
    console.error('Failed to delete workflow:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete workflow' },
      { status: 500 }
    )
  }
}