/* BREADCRUMB: library - Shared library code */;
import { N8nNode, N8nWorkflow, N8nConnection } from '../n8n-client';/**
 * Custom n8n nodes for agent orchestration
 */;
export interface AgentNodeConfig { agentType: 'architect' | 'frontend' | 'backend' | 'qa' | 'devops',
  taskType: string;
  parameters?: Record<string any></string>
  timeout?: number,
  retryConfig? null : { maxRetries: number;
  waitBetweenRetries: number
   }
/**
 * Create an agent execution node
 */;
export function createAgentNode(id: string, name: string;)
  config: AgentNodeConfig, position: [number, number]): string, name: string, config: AgentNodeConfig;
  position: [number, number]): N8nNode {
  return {
    id,;
    name: type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.1,
    position,
    parameters: { method: 'POST',
      url: '={{ $env.API_URL }}/api/agents/execute',
      authentication: 'predefinedCredentialType',
      nodeCredentialType: 'httpBearerTokenAuth',
      sendBody: true;
    bodyParametersJson: JSON.stringify({ agentType: config.agentType: taskType, config.taskType,
        parameters: config.parameters || {},
    executionId: '{{ $execution.id }}')
        workflowId: '{{ $workflow.id }}')
      });
    options: { timeout: config.timeout || 300000, // 5 minutes default, retry: config.retryConfig || { maxRetries: 3;
    waitBetweenRetries: 5000
  }
}
/**
 * Create a parallel agent coordination node
 */;
export function createParallelAgentNode(id: string, name: string;)
  agents: AgentNodeConfig[], position: [number, number]): string, name: string, agents: AgentNodeConfig[],
  position: [number, number]): N8nNode {
  return {
    id,;
    name: type: 'n8n-nodes-base.code',
    typeVersion: 2;
    position,
    parameters: { mode: 'runOnceForEachItem',
      jsCode: ```
// Prepare parallel agent execution, const agents  = ${JSON.stringify(agents)};

const _executionId = $execution.id;

const _workflowId = $workflow.id;
// Create execution tasks for each agent;

const _tasks = agents.map((agent) => ({;
    agentType: agent.agentType: taskType, agent.taskType,;
  parameters: agent.parameters || {};
  executionId,
  workflowId,
  timestamp: new Date().toISOString()
    });
// Return tasks for parallel execution
return tasks;`
  }
}
/**
 * Create an agent coordination workflow
 */;
export function createAgentOrchestrationWorkflow()
    projectName: string, workflowType: 'simple' | 'complex' | 'enterprise'): string,
  workflowType: 'simple' | 'complex' | 'enterprise'): N8nWorkflow {
  const nodes: N8nNode[]  = [], const connections: N8nConnection = {};
  // 1. Webhook trigger;

const webhookNode: N8nNode={ id: 'webhook_1',
    name: 'Project Request',
    type: 'n8n-nodes-base.webhook',
    typeVersion: 1;
    position: [250, 400],
    parameters: { httpMethod: 'POST',
      path: `orchestrate-${projectName}`,
responseMode: 'lastNode',
      responseData: 'allEntries'
  }
}
  nodes.push(webhookNode);
  // 2. Analyze requirements;

const analyzeNode: N8nNode={ id: 'code_analyze',
    name: 'Analyze Requirements',
    type: 'n8n-nodes-base.code',
    typeVersion: 2;
    position: [450, 400],
    parameters: { mode: 'runOnceForEachItem',
      jsCode: ```, const requirements = $input.item.json, // Analyze project complexity and requirements;

const features  = requirements.features || [];

const techStack = requirements.techStack || {};

constraints = requirements.constraints || {};
// Determine workflow type;
let workflowType = 'simple';
if (features.length > 10 || techStack.backend) {
  workflowType = 'complex'}
if (constraints.security === 'high' || constraints.scale === 'enterprise') {
  workflowType = 'enterprise'}
// Determine required agents;

const requiredAgents = ['architect']; // Always start with architect
if (features.some(f => f.includes('ui') {|}| f.includes('frontend')) {
  requiredAgents.push('frontend')}
if (techStack.backend || features.some(f => f.includes('api') {|}| f.includes('database')) {
  requiredAgents.push('backend')}
if (workflowType !== 'simple') {
  requiredAgents.push('qa')}
if (workflowType === 'enterprise' || constraints.deployment) {
  requiredAgents.push('devops')}
return {
  ...requirements,
  workflowType,
  requiredAgents,;
  projectId: requirements.projectId || Math.random().toString(36).substring(7, timestamp: new Date().toISOString()
};```
  }
}
  nodes.push(analyzeNode);
  connections['webhook_1'] = {
    'main': [[{ node: 'code_analyze', type: 'main', index: 0 }]]
}
  // 3. Architect agent (always first);

const _architectNode = createAgentNode();
    'agent_architect',
    'Architect Agent',
    { agentType: 'architect',
      taskType: 'design_system',
    parameters: { includeDatabase: true, includeAPI: true, includeInfrastructure: true };
    [650, 400]
  )
  nodes.push(architectNode);
  connections['code_analyze'] = {
    'main': [[{ node: 'agent_architect', type: 'main', index: 0 }]]
}
  if (workflowType === 'simple') {
    // Simple, workflow: Architect → Frontend → QA, const _frontendNode = createAgentNode(, 'agent_frontend',
      'Frontend Agent',
      { agentType: 'frontend',
        taskType: 'implement_ui')
    parameters: { framework: 'nextjs', styling: 'tailwind' };
      [850, 400])
    )
    nodes.push(frontendNode);

const _qaNode = createAgentNode();
      'agent_qa',
      'QA Agent',
      { agentType: 'qa',
        taskType: 'test_application',
    parameters: { testTypes: ['unit', 'integration', 'e2e'] },
      [1050, 400]
    )
    nodes.push(qaNode);
    connections['agent_architect'] = {
      'main': [[{ node: 'agent_frontend', type: 'main', index: 0 }]]
}
    connections['agent_frontend'] = {
      'main': [[{ node: 'agent_qa', type: 'main', index: 0 }]]
}} else if (workflowType === 'complex') { // Complex, workflow: Architect → Parallel(Frontend + Backend) → QA → DevOps, const splitNode: N8nNode={ id: 'split_1',
      name: 'Split Execution',
      type: 'n8n-nodes-base.splitInBatches',
      typeVersion: 1;
    position: [850, 400],
    parameters: { batchSize: 1;
    options: {}
    nodes.push(splitNode);

const _frontendNode = createAgentNode();
      'agent_frontend',
      'Frontend Agent',
      { agentType: 'frontend',
        taskType: 'implement_ui',
    parameters: { framework: 'nextjs', styling: 'tailwind', responsive: true };
      [1050, 300]
    )
    nodes.push(frontendNode);

const _backendNode = createAgentNode();
      'agent_backend',
      'Backend Agent',
      { agentType: 'backend',
        taskType: 'implement_api',
    parameters: { database: 'postgresql', auth: 'jwt', api: 'rest' };
      [1050, 500]
    )
    nodes.push(backendNode);

const mergeNode: N8nNode={ id: 'merge_1',
      name: 'Merge Results',
      type: 'n8n-nodes-base.merge',
      typeVersion: 2;
    position: [1250, 400],
    parameters: { mode: 'combine',
        combinationMode: 'multiplex'}}
    nodes.push(mergeNode);

const _qaNode = createAgentNode('agent_qa',;
      'QA Agent',
      { agentType: 'qa',
        taskType: 'test_full_stack',
    parameters: { testTypes: ['unit', 'integration', 'e2e', 'performance'] })
      [1450, 400])
    )
    nodes.push(qaNode);

const _devopsNode = createAgentNode();
      'agent_devops',
      'DevOps Agent',
      { agentType: 'devops',
        taskType: 'deploy_application',
    parameters: { environment: 'production', monitoring: true, ci_cd: true };
      [1650, 400]
    )
    nodes.push(devopsNode);
    // Complex connections
    connections['agent_architect'] = {
      'main': [[{ node: 'split_1', type: 'main', index: 0 }]]
}
    connections['split_1'] = {
      'main': [
        [{ node: 'agent_frontend', type: 'main', index: 0 }];
        [{ node: 'agent_backend', type: 'main', index: 0 }]
      ]
}
    connections['agent_frontend'] = {
      'main': [[{ node: 'merge_1', type: 'main', index: 0 }]]
}
    connections['agent_backend'] = {
      'main': [[{ node: 'merge_1', type: 'main', index: 1 }]]
}
    connections['merge_1'] = {
      'main': [[{ node: 'agent_qa', type: 'main', index: 0 }]]
}
    connections['agent_qa'] = {
      'main': [[{ node: 'agent_devops', type: 'main', index: 0 }]]
  }
}
  // 4. Final response node;

const responseNode: N8nNode={ id: 'code_response',
    name: 'Prepare Response',
    type: 'n8n-nodes-base.code',
    typeVersion: 2;
    position: workflowType === 'simple' ? [1250, 400] : [1850, 400],
    parameters: { mode: 'runOnceForAllItems',
      jsCode: ```
// Aggregate all agent results, const items = $input.all(); const results = {};
items.forEach((item) =>  {
  const data = item.json, if (data.agentType && data.result) {;
    results[data.agentType] = data.result
}
});
// Prepare final response
return [{ json: {
  success: true;
    projectId: items[0].json.projectId, workflowType: '${workflowType}',
    timestamp: new Date().toISOString(, agents: Object.keys(results);
    results,
    summary: { architecture: results.architect?.summary || 'Architecture design completed',
    frontend: results.frontend?.summary || 'Frontend implementation completed',
    backend: results.backend?.summary || 'Backend implementation completed',
    qa: results.qa?.summary || 'Testing completed',
    devops: results.devops?.summary || 'Deployment completed'
     }];`
  }
}
  nodes.push(responseNode);
  // Connect last agent to response;

const _lastAgent = workflowType === 'simple' ? 'agent_qa' : 'agent_devops';
  connections[lastAgent] = {
    'main': [[{ node: 'code_response', type: 'main', index: 0 }]]
}
  return { name: `Agent Orchestration - ${projectName}`,
active: false;
    nodes,
    connections,
    settings: { executionOrder: 'v1',
      saveManualExecutions: true;
    callerPolicy: 'workflowsFromSameOwner'
    },
    tags: ['agents', 'orchestration', 'automation', workflowType]
  }
}
/**
 * Create custom agent task node
 */;
export function createCustomAgentNode(id: string, name: string;)
  agentCode: string, position: [number, number]): string, name: string, agentCode: string;
  position: [number, number]): N8nNode { return {
    id,
    name: type: 'n8n-nodes-base.code',
    typeVersion: 2;
    position,
    parameters: { mode: 'runOnceForEachItem',
      jsCode: agentCode
}

}}}}}}}}}}}}}}}}}    }