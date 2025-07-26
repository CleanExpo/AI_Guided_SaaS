/* BREADCRUMB: library - Shared library code */

/**
 * Custom nodes for agent orchestration
 * NOTE: N8N integration has been removed. This file contains legacy workflow definitions
 * that need to be migrated to a new automation solution.
 */

export interface AgentNodeConfig {
  agentType: 'architect' | 'frontend' | 'backend' | 'qa' | 'devops';
  taskType: string;
  parameters?: Record<string, any>;
  timeout?: number;
  retryConfig?: {
    maxRetries: number;
    waitBetweenRetries: number;
  };
}

/**
 * Create an agent execution node
 * Legacy function - needs migration to new automation system
 */
export function createAgentNode(
  id: string,
  name: string,
  config: AgentNodeConfig,
  position: [number, number]
): any {
  console.warn('N8N integration has been removed. This function needs migration.');
  return null;
}

/**
 * Create a parallel agent coordination node
 * Legacy function - needs migration to new automation system
 */
export function createParallelAgentNode(
  id: string,
  name: string,
  agents: AgentNodeConfig[],
  position: [number, number]
): any {
  console.warn('N8N integration has been removed. This function needs migration.');
  return null;
}

/**
 * Create an agent coordination workflow
 * Legacy function - needs migration to new automation system
 */
export function createAgentOrchestrationWorkflow(
  projectName: string,
  workflowType: 'simple' | 'complex' | 'enterprise'
): any {
  console.warn('N8N integration has been removed. This function needs migration.');
  return null;
}

/**
 * Create custom agent task node
 * Legacy function - needs migration to new automation system
 */
export function createCustomAgentNode(
  id: string,
  name: string,
  agentCode: string,
  position: [number, number]
): any {
  console.warn('N8N integration has been removed. This function needs migration.');
  return null;
}