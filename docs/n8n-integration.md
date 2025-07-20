# n8n Workflow Automation Integration

## Overview

AI Guided SaaS includes comprehensive n8n integration for workflow automation, enabling:
- Automated deployment pipelines
- Testing automation
- Multi-channel notifications
- Agent orchestration
- Custom workflow creation

## Setup

### 1. Docker Setup

n8n is included in the Docker Compose configuration:

```bash
# Start all services including n8n
docker-compose up -d

# Access n8n at http://localhost:5678
# Default credentials: admin / n8npassword
```

### 2. Environment Configuration

Add to your `.env` file:

```env
# n8n Configuration
N8N_URL=http://localhost:5678
N8N_API_KEY=your-api-key
N8N_USER=admin
N8N_PASSWORD=n8npassword
N8N_ENCRYPTION_KEY=your-encryption-key

# Notification Settings
NOTIFICATION_EMAIL=notifications@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
SLACK_CHANNEL=#notifications
TWILIO_PHONE_NUMBER=+1234567890
```

### 3. API Key Generation

1. Access n8n UI at http://localhost:5678
2. Go to Settings → API
3. Generate a new API key
4. Add to your `.env` file

## Pre-built Workflows

### 1. Project Deployment Workflow

Automated CI/CD pipeline for project deployment:

```typescript
// Create deployment workflow
const workflow = await createProjectDeploymentWorkflow(
  'my-project',
  'deploy-webhook-path'
)

// Trigger deployment
await triggerWebhook('deploy', 'project-id', {
  deploymentType: 'production',
  config: {
    skipTests: false,
    notifyOnSuccess: true
  }
})
```

**Workflow Steps:**
1. Build project
2. Run tests
3. Deploy to staging
4. Health check
5. Deploy to production
6. Send notifications

### 2. Testing Automation Workflow

Comprehensive test execution and reporting:

```typescript
// Create testing workflow
const workflow = await createTestingAutomationWorkflow(
  'my-project',
  'test-webhook-path'
)

// Trigger tests
await triggerWebhook('test', 'project-id', {
  testSuites: ['unit', 'integration', 'e2e'],
  coverage: true,
  reporters: ['json', 'html']
})
```

**Features:**
- Parallel test execution
- Coverage reporting
- HTML report generation
- Slack notifications
- Scheduled test runs

### 3. Notification System Workflow

Multi-channel notification delivery:

```typescript
// Create notification workflow
const workflow = await createNotificationSystemWorkflow(
  'notification-webhook'
)

// Send notification
await triggerWebhook('notify', 'project-id', {
  type: 'deployment_success',
  recipients: ['user@example.com', '#slack-channel'],
  channels: ['email', 'slack'],
  priority: 'normal'
})
```

**Supported Channels:**
- Email (SMTP)
- Slack
- SMS (Twilio)
- Webhooks

**Notification Types:**
- `deployment_success`
- `deployment_failure`
- `test_complete`
- `user_signup`
- `project_created`
- `error_alert`
- `custom`

## Agent Orchestration

### Creating Agent Workflows

```typescript
import { createAgentOrchestrationWorkflow } from '@/lib/automation/nodes/agent-orchestration'

// Simple workflow: Architect → Frontend → QA
const simpleWorkflow = createAgentOrchestrationWorkflow(
  'simple-project',
  'simple'
)

// Complex workflow: Architect → Parallel(Frontend + Backend) → QA → DevOps
const complexWorkflow = createAgentOrchestrationWorkflow(
  'complex-project',
  'complex'
)
```

### Agent Types

1. **Architect Agent**
   - System design
   - Technology selection
   - Integration planning

2. **Frontend Agent**
   - UI implementation
   - React/Next.js development
   - Responsive design

3. **Backend Agent**
   - API development
   - Database design
   - Authentication

4. **QA Agent**
   - Test automation
   - Performance testing
   - Security audits

5. **DevOps Agent**
   - Deployment automation
   - Infrastructure setup
   - Monitoring

## Using the n8n Hook

```typescript
import { useN8nAutomation } from '@/hooks/useN8nAutomation'

function AutomationComponent() {
  const {
    listWorkflows,
    createWorkflow,
    executeWorkflow,
    triggerWebhook,
    loading,
    error
  } = useN8nAutomation()

  // List all workflows
  const workflows = await listWorkflows()

  // Create new workflow
  const workflow = await createWorkflow('deployment', {
    projectId: 'my-project',
    name: 'My Deployment Pipeline'
  })

  // Execute workflow
  const execution = await executeWorkflow(workflow.id, {
    environment: 'production'
  })

  // Trigger webhook
  const result = await triggerWebhook('deploy', 'my-project', {
    branch: 'main'
  })
}
```

## API Endpoints

### Webhook Endpoint
- **POST** `/api/n8n/webhook`
  - Actions: `deploy`, `test`, `notify`, `custom`

### Workflow Management
- **GET** `/api/n8n/workflows` - List workflows
- **POST** `/api/n8n/workflows` - Create workflow
- **PUT** `/api/n8n/workflows?id={id}` - Update workflow
- **DELETE** `/api/n8n/workflows?id={id}` - Delete workflow

### Execution Management
- **POST** `/api/n8n/execute` - Execute workflow
- **GET** `/api/n8n/execute` - List executions
- **PUT** `/api/n8n/execute?id={id}` - Get execution details
- **PUT** `/api/n8n/execute?id={id}&action=retry` - Retry execution

## Custom Workflows

### Creating Custom Nodes

```typescript
import { createCustomAgentNode } from '@/lib/automation/nodes/agent-orchestration'

const customNode = createCustomAgentNode(
  'custom_1',
  'Custom Processing',
  `
  // Custom JavaScript code
  const input = $input.item.json;
  
  // Process data
  const result = {
    processed: true,
    data: input.data,
    timestamp: new Date().toISOString()
  };
  
  return result;
  `,
  [650, 400] // Position
)
```

### Workflow Builder Example

```typescript
import { N8nClient } from '@/lib/automation/n8n-client'

const client = new N8nClient({
  url: process.env.N8N_URL,
  apiKey: process.env.N8N_API_KEY
})

// Create nodes
const webhook = client.createWebhookNode(
  'Start',
  'my-webhook',
  'POST'
)

const httpRequest = client.createHttpRequestNode(
  'Call API',
  'https://api.example.com/process',
  'POST',
  [450, 300]
)

const code = client.createCodeNode(
  'Process Data',
  'return { processed: true, data: $json }',
  [650, 300]
)

// Connect nodes
const connections = {
  ...client.connectNodes('Start', 'Call API'),
  ...client.connectNodes('Call API', 'Process Data')
}

// Create workflow
const workflow = await client.createWorkflow({
  name: 'My Custom Workflow',
  active: false,
  nodes: [webhook, httpRequest, code],
  connections
})
```

## Best Practices

1. **Webhook Security**
   - Use authentication tokens
   - Validate input data
   - Implement rate limiting

2. **Error Handling**
   - Add error nodes
   - Configure retry policies
   - Set up error notifications

3. **Performance**
   - Use parallel execution
   - Implement caching
   - Monitor execution times

4. **Monitoring**
   - Enable n8n metrics
   - Set up health checks
   - Configure alerts

## Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check n8n service is running
   - Verify API key is correct
   - Check network connectivity

2. **Webhook Not Triggering**
   - Ensure workflow is active
   - Check webhook path matches
   - Verify request format

3. **Execution Failures**
   - Check node configurations
   - Review error logs
   - Verify credentials

### Debug Mode

Enable debug logging:

```typescript
// In n8n node
console.log('Debug:', JSON.stringify($input.all(), null, 2))

// In API endpoint
console.log('n8n webhook:', { action, projectId, data })
```

## Security Considerations

1. **API Key Management**
   - Store in environment variables
   - Rotate regularly
   - Use different keys per environment

2. **Webhook Security**
   - Implement webhook signatures
   - Use HTTPS in production
   - Validate payloads

3. **Data Protection**
   - Encrypt sensitive data
   - Limit data retention
   - Implement access controls