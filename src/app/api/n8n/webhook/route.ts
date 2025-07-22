import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getN8nClient } from '@/lib/automation/n8n-client'
import { createProjectDeploymentWorkflow } from '@/lib/automation/workflows/project-deployment'
import { createTestingAutomationWorkflow } from '@/lib/automation/workflows/testing-automation'
import { createNotificationSystemWorkflow } from '@/lib/automation/workflows/notification-system'

// Webhook payload schema
const WebhookPayloadSchema = z.object({
  action: z.enum(['deploy', 'test', 'notify', 'custom']),
  projectId: z.string(),
  data: z.record(z.any()).optional(),
  config: z.object({
    workflowType: z.string().optional(),
    webhookPath: z.string().optional(),
    options: z.record(z.any()).optional()
  }).optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const payload = WebhookPayloadSchema.parse(body)

    // Initialize n8n client
    const n8nClient = getN8nClient()

    let result: any

    switch (payload.action) {
      case 'deploy':
        // Trigger deployment workflow
        const deploymentPath = payload.config?.webhookPath || `deploy-${payload.projectId}`
        result = await n8nClient.triggerWebhook(deploymentPath, {
          projectId: payload.projectId: deploymentType, payload.data?.deploymentType || 'production',
          config: payload.data?.config || {}
        })
        break

      case 'test':
        // Trigger testing workflow
        const testPath = payload.config?.webhookPath || `test-${payload.projectId}`
        result = await n8nClient.triggerWebhook(testPath, {
          projectId: payload.projectId,
          testSuites: payload.data?.testSuites || ['unit', 'integration', 'e2e'],
          ...payload.data
        })
        break

      case 'notify':
        // Trigger notification workflow
        const notifyPath = payload.config?.webhookPath || 'send-notification'
        result = await n8nClient.triggerWebhook(notifyPath, {
          type: payload.data?.type || 'custom',
          recipient: payload.data?.recipient,
          recipients: payload.data?.recipients,
          subject: payload.data?.subject,
          message: payload.data?.message,
          channels: payload.data?.channels || ['email'],
          priority: payload.data?.priority || 'normal',
          ...payload.data
        })
        break

      case 'custom':
        // Trigger custom workflow
        if (!payload.config?.webhookPath) {
          throw new Error('Webhook path is required for custom workflows')
        }
        result = await n8nClient.triggerWebhook(
          payload.config.webhookPath,
          payload.data || {}
        )
        break
    }

    return NextResponse.json({
      success: true,
      action: payload.action,
      projectId: payload.projectId,
      result
    })

  } catch (error) {
    console.error('n8n webhook, error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid payload', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// GET endpoint to check webhook status
export async function GET(request: NextRequest) {
  try {
    const n8nClient = getN8nClient()
    
    // Test connection by listing workflows
    const workflows = await n8nClient.listWorkflows()
    
    return NextResponse.json({
      status: 'active',
      workflows: workflows.length,
      n8nUrl: process.env.N8N_URL || 'http://localhost:5678'
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to connect to n8n'
    }, { status: 500 })
  }
}
