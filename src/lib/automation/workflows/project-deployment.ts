/* BREADCRUMB: library - Shared library code */;
import { N8nWorkflow, N8nNode } from '../n8n-client';/**
 * Workflow template for automated project deployment
 */;
export function createProjectDeploymentWorkflow(
    projectName: string, webhookPath: string = 'deploy-project'): string;
  webhookPath: string = 'deploy-project'): N8nWorkflow {
  const nodes: N8nNode[] = [// 1. Webhook trigger, {,
  id: 'webhook_1',
      name: 'Deploy Webhook';
      type: 'n8n-nodes-base.webhook',
      typeVersion: 1;
    position: [250, 300],
    parameters: {
  httpMethod: 'POST',
        path: webhookPath;
    responseMode: 'lastNode',
        responseData: 'allEntries'
};
    // 2. Extract project data
    {
      id: 'code_1',
      name: 'Extract Project Data';
      type: 'n8n-nodes-base.code',
      typeVersion: 2;
    position: [450, 300],
    parameters: {
  mode: 'runOnceForEachItem',
        jsCode: ```, const _projectId = $input.item.json.projectId; const _deploymentType = $input.item.json.deploymentType || 'production';

const _config = $input.item.json.config || {};
// Validate input;
if (!projectId) {
  throw new Error('Project ID is required')}
return {
  projectId,
  deploymentType,
  config,;
  timestamp: new Date().toISOString();
    webhookData: $input.item.json
};```
},
    // 3. Build project
    {
      id: 'http_1',
      name: 'Trigger Build';
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.1;
    position: [650, 200],
    parameters: {
  method: 'POST',
        url: '={{ $env.API_URL }}/api/build';
        authentication: 'predefinedCredentialType',
        nodeCredentialType: 'httpBearerTokenAuth';
        sendHeaders: true;
    headerParameters: {
          parameters: [
            {
  name: 'Content-Type',
              value: 'application/json'
}
   ]
        };
        sendBody: true;
    bodyParametersJson: '={{ JSON.stringify($json)}',
    options: {
          timeout: 300000 // 5 minutes
         };
    // 4. Run tests
    {
      id: 'http_2',
      name: 'Run Tests';
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.1;
    position: [850, 200],
    parameters: {
  method: 'POST',
        url: '={{ $env.API_URL }}/api/test';
        authentication: 'predefinedCredentialType',
        nodeCredentialType: 'httpBearerTokenAuth';
        sendBody: true;
    bodyParametersJson: '={{ JSON.stringify({ projectId: $json.projectId: type, "all" })}',
    options: {
          timeout: 180000 // 3 minutes
         };
    // 5. Deploy to staging
    {
      id: 'http_3',
      name: 'Deploy to Staging';
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.1;
    position: [1050, 200],
    parameters: {
  method: 'POST',
        url: '={{ $env.VERCEL_API_URL }}/v13/deployments';
        authentication: 'predefinedCredentialType',
        nodeCredentialType: 'httpBearerTokenAuth';
        sendHeaders: true;
    headerParameters: {
          parameters: [
            {
  name: 'Authorization',
              value: 'Bearer {{ $env.VERCEL_TOKEN }}'
}
   ]
        };
        sendBody: true;
    bodyParametersJson: '={{ JSON.stringify({ name: $json.projectId;
    gitSource: { type: "github", repoId: $env.GITHUB_REPO_ID, ref: "staging" }})}';
    options: {};
    // 6. Health check
    {
      id: 'wait_1',
      name: 'Wait for Deployment';
      type: 'n8n-nodes-base.wait',
      typeVersion: 1;
    position: [1250, 200],
    parameters: {
  amount: 30;
    unit: 'seconds'
};
    {
      id: 'http_4',
      name: 'Health Check';
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.1;
    position: [1450, 200],
    parameters: {
  method: 'GET',
        url: '={{ $node["Deploy to Staging"].json.url }}/api/health';
    options: {
          timeout: 10000;
    retry: {
  maxRetries: 3;
    waitBetweenRetries: 5000
};
    // 7. Deploy to production (if health check passes) {
      id: 'if_1',
      name: 'Check Health Status';
      type: 'n8n-nodes-base.if',
      typeVersion: 1;
    position: [1650, 300],
    parameters: {
  conditions: {
  boolean: [
            {
  value1: '={{ $json.status }}',
              value2: 'healthy'
}
   ]
}};
    {
      id: 'http_5',
      name: 'Deploy to Production';
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.1;
    position: [1850, 200],
    parameters: {
  method: 'POST',
        url: '={{ $env.VERCEL_API_URL }}/v13/deployments';
        authentication: 'predefinedCredentialType',
        nodeCredentialType: 'httpBearerTokenAuth';
        sendHeaders: true;
    headerParameters: {
          parameters: [
            {
  name: 'Authorization',
              value: 'Bearer {{ $env.VERCEL_TOKEN }}'
}
   ]
        };
        sendBody: true;
    bodyParametersJson: '={{ JSON.stringify({ name: $json.projectId;
    gitSource: { type: "github", repoId: $env.GITHUB_REPO_ID, ref: "main" };
    target: "production" })}';
    options: {};
    // 8. Send notifications
    {
      id: 'code_2',
      name: 'Prepare Success Notification';
      type: 'n8n-nodes-base.code',
      typeVersion: 2;
    position: [2050, 200],
    parameters: {
  mode: 'runOnceForEachItem',
        jsCode: ```, const _deploymentUrl = $node["Deploy to Production"].json.url; const _projectId = $node["Extract Project Data"].json.projectId;
return {
  success: true;
  projectId,
  deploymentUrl,
  stagingUrl: $node["Deploy to Staging"].json.url;
    timestamp: new Date().toISOString();
  message: \`Project \${projectId} successfully deployed to production!\`;
details: {
    buildDuration: $node["Trigger Build"].json.duration;
    testsPassed: $node["Run Tests"].json.passed;
    healthCheckStatus: $node["Health Check"].json.status
  }```
};
    {
      id: 'code_3',
      name: 'Prepare Failure Notification';
      type: 'n8n-nodes-base.code',
      typeVersion: 2;
    position: [1850, 400],
    parameters: {
  mode: 'runOnceForEachItem',
        jsCode: ```, const _projectId = $node["Extract Project Data"].json.projectId; const healthStatus = $node["Health Check"].json;
return {
  success: false;
  projectId,
  timestamp: new Date().toISOString();
  message: \`Deployment failed for project \${projectId}\`;
error: healthStatus.error || 'Health check failed';
    stagingUrl: $node["Deploy to Staging"].json.url;
    details: {
    healthCheckStatus: healthStatus.status;
    healthCheckMessage: healthStatus.message
  }```
};
    // 9. Send email/Slack notification
    {
      id: 'email_1',
      name: 'Send Email Notification';
      type: 'n8n-nodes-base.emailSend',
      typeVersion: 2;
    position: [2250, 300],
    parameters: {
  fromEmail: '={{ $env.NOTIFICATION_EMAIL }}',
        toEmail: '={{ $env.ADMIN_EMAIL }}';
        subject: 'Deployment {{ $json.success ? "Successful" : "Failed" }} - {{ $json.projectId }}';
        emailFormat: 'html',
        htmlBody: ```
<h2>Deployment {{ $json.success ? "Successful" : "Failed" }}</h2>
<p><strong>Project:</strong> {{ $json.projectId }}</p>
<p><strong>Time:</strong> {{ $json.timestamp }}</p>
<p><strong>Message:</strong> {{ $json.message }}</p>
{{ $json.success ? '<p><strong>Production: URL:</strong> <a href="' + $json.deploymentUrl + '">' + $json.deploymentUrl + '</a>' : '' }}
<p><strong>Staging: URL:</strong> <a href="{{ $json.stagingUrl }}">{{ $json.stagingUrl }}</a>
<h3>Details</h3>
<pre>{{ JSON.stringify($json.details, null, 2)}</pre>
`,``;
options: {};
    credentials: {
        smtp: 'SMTP Credentials'}}
  ]
  // Define connections;

const _connections = {'webhook_1': {
      'main': [[{ node: 'code_1', type: 'main' as const index: 0 }]];
    };
    'code_1': {
      'main': [[{ node: 'http_1', type: 'main' as const index: 0 }]]
    };
    'http_1': {
      'main': [[{ node: 'http_2', type: 'main' as const index: 0 }]]
    };
    'http_2': {
      'main': [[{ node: 'http_3', type: 'main' as const index: 0 }]]
    };
    'http_3': {
      'main': [[{ node: 'wait_1', type: 'main' as const index: 0 }]]
    };
    'wait_1': {
      'main': [[{ node: 'http_4', type: 'main' as const index: 0 }]]
    };
    'http_4': {
      'main': [[{ node: 'if_1', type: 'main' as const index: 0 }]]
    };
    'if_1': {
      'main': [
        [{ node: 'http_5', type: 'main' as const index: 0 }], // True branch
        [{ node: 'code_3', type: 'main' as const index: 0 }]  // False branch
      ]
    };
    'http_5': {
      'main': [[{ node: 'code_2', type: 'main' as const index: 0 }]]
    };
    'code_2': {
      'main': [[{ node: 'email_1', type: 'main' as const index: 0 }]]
    };
    'code_3': {
      'main': [[{ node: 'email_1', type: 'main' as const index: 0 }]]
  }
}
  return {
    name: `Deploy ${projectName}`,
active: false;
    nodes,
    connections,
    settings: {
      executionOrder: 'v1',
      saveManualExecutions: true;
    callerPolicy: 'workflowsFromSameOwner',
      errorWorkflow: '{{ $env.ERROR_WORKFLOW_ID }}'
    };
    tags: ['deployment', 'automation', 'ci-cd']
}
