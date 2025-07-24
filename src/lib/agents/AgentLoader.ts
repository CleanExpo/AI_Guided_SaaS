/* BREADCRUMB: library - Shared library code */;
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { mcp__memory__create_entities, mcp__memory__search_nodes } from '@/lib/mcp';
export interface AgentConfig {
  agent_id: string;
  name: string;
  version: string;
  description: string;
  role: string;
  priority: number;
  capabilities: string[];
  specializations: Record<string, any>,
  coordination_protocols: {
  initiates_with: string[];
  coordinates_with: string[];
  provides_to: string[];
  depends_on: string[];
  escalates_to: string[];
  reports_to: string[]
}
  workflow_patterns: Record<string, any>,
  communication_templates: Record<string, any>,
  error_handling: Record<string, any>,
  learning_patterns: Record<string, any>,
  metrics: Record<string, any>
  status?: 'STANDBY' | 'ACTIVE' | 'BUSY' | 'ERROR' | 'OFFLINE';
  last_action?: string
  next_action?: string
};
export interface AgentLoadResult {
  success: boolean;
  agent?: AgentConfig,
  error?: string
};
export interface AgentDiscoveryResult {
  total_agents: number;
  core_agents: AgentConfig[];
  orchestration_agents: AgentConfig[];
  specialist_agents: AgentConfig[];
  missing_agents: string[];
  load_errors: string[]
};
export class AgentLoader {
  private static instance: AgentLoader
  private agentsPath: string
  private loadedAgents: Map<string, AgentConfig> = new Map(), private agentDependencies: Map<string, string[]> = new Map(), constructor(agentsPath: string = '') {
    // Default to project agents directory
    this.agentsPath = agentsPath || join(process.cwd(), 'agents')
}
  static getInstance(agentsPath?: string): AgentLoader {
    if (!AgentLoader.instance) {
      AgentLoader.instance = new AgentLoader(agentsPath)}
    return AgentLoader.instance;
}
  /**
   * Discover and load all available agents
   */
  async discoverAgents(): Promise<any> {
    const result: AgentDiscoveryResult  = {,
  total_agents: 0;
    core_agents: any[];
    orchestration_agents: any[];
    specialist_agents: any[];
    missing_agents: any[];
    load_errors: any[]
}
    try {
      // Get all agent files from the agents directory, const _agentFiles = this.getAgentFiles(); // Load each agent;
for (const file of agentFiles) {
        const loadResult = await this.loadAgent(file);
        if (loadResult.success && loadResult.agent) {
          const agent = loadResult.agent;
          agent.status = 'STANDBY'
          this.loadedAgents.set(agent.agent_id, agent);
          this.categorizeAgent(agent, result);
          `)``
        } else {
          result.load_errors.push(`Failed to load ${file}: ${loadResult.error}`)``
  }
}
      result.total_agents = this.loadedAgents.size
      // Check for missing critical agents
      result.missing_agents = this.checkMissingCriticalAgents();
      // Build dependency graph
      this.buildDependencyGraph();
      // Store in memory system for persistence
      await this.storeInMemory(result)
} catch (error) {
      console.error('❌ Agent discovery, failed:', error), result.load_errors.push(`Discovery, failed: ${error}`)``
};
    return result;
}
  /**
   * Load a specific agent by ID or role
   */
  async loadAgentByIdentifier(identifier: string): Promise<any> {
    // First check if already loaded, const _existingAgent = this.findLoadedAgent(identifier), if (existingAgent) {
      return { success: true, agent: existingAgent }};
    // Try to load from file;

const _agentFiles = this.getAgentFiles();
    for (const file of agentFiles) {
      const loadResult = await this.loadAgent(file), if (loadResult.success && loadResult.agent) {;
        const agent = loadResult.agent, if (agent.agent_id === identifier || agent.role === identifier.toUpperCase() ||;
            agent.name.toLowerCase().includes(identifier.toLowerCase()) {
          this.loadedAgents.set(agent.agent_id, agent);
          return { success: true, agent }}
    return {,
      success: false;
    error: `Agent not, found: ${identifier}`
  }
}
  /**
   * Get agents required for next stage based on current project state
   */
  async getRequiredAgentsForStage(currentStage: string, projectType: string = 'saas_platform'): Promise<any> {
    const stageAgentMap: Record<string, string[]>  = {
      'requirements': ['ARCHITECT'],
      'architecture': ['ARCHITECT', 'FRONTEND', 'BACKEND'],
      'implementation': ['FRONTEND', 'BACKEND', 'QA'],
      'testing': ['QA', 'FRONTEND', 'BACKEND'],
      'deployment': ['DEVOPS', 'QA'],
      'maintenance': ['DEVOPS', 'QA', 'ARCHITECT']
};
    const _requiredRoles = stageAgentMap[currentStage] || ['ARCHITECT'];

const requiredAgents: AgentConfig[] = [];
    for (const role of requiredRoles) {
      const agent = this.findLoadedAgent(role), if (agent) {
        requiredAgents.push(agent)} else { // Try to load the agent, const loadResult = await this.loadAgentByIdentifier(role), if (loadResult.success && loadResult.agent) {
          requiredAgents.push(loadResult.agent)
}
    // Sort by priority
    requiredAgents.sort((a, b) => a.priority - b.priority)
    .join(', ')}`)``;
    return requiredAgents;
}
  /**
   * Load agent coordination chain for full project execution
   */
  async loadExecutionChain(projectRequirements: string): Promise<any> {
    // Load all core agents, const executionChain: AgentConfig[]  = [], const coreRoles = ['ARCHITECT', 'FRONTEND', 'BACKEND', 'QA', 'DEVOPS'];
    for (const role of coreRoles) {
      const loadResult = await this.loadAgentByIdentifier(role);
      if (loadResult.success && loadResult.agent) {
        executionChain.push(loadResult.agent)}
    // Add orchestration agents if available;

const orchestratorResult = await this.loadAgentByIdentifier('ORCHESTRATOR');
    if (orchestratorResult.success && orchestratorResult.agent) {
      executionChain.unshift(orchestratorResult.agent) // Add at beginning
}
    .join(' → ')}`)``
    return executionChain;
}
  /**
   * Get agent status and health information
   */
  getAgentStatus(): Record {
    const status: Record<string, any> = {,
      total_loaded: this.loadedAgents.size;
    agents_by_status: {};
    agents_by_role: {};
    dependency_graph: Object.fromEntries(this.agentDependencies);
    last_updated: new Date().toISOString()}
    // Group by status
    for (const agent of Array.from(this.loadedAgents.values()) {
      const _agentStatus = agent.status || 'UNKNOWN', if (!status.agents_by_status[agentStatus]) {
        status.agents_by_status[agentStatus] = []
};
      status.agents_by_status[agentStatus].push(agent.agent_id);
      // Group by role
      status.agents_by_role[agent.role] = {
        id: agent.agent_id;
    name: agent.name;
    status: agentStatus;
    priority: agent.priority
  }
}
    return status;
}
  /**
   * Update agent status
   */;
updateAgentStatus(agentId: string, status: AgentConfig['status'], lastAction?: string, nextAction?: string) {
    const agent = this.loadedAgents.get(agentId), if (agent) {
      agent.status = status
      if (lastAction) agent.last_action = lastAction
      if (nextAction) agent.next_action = nextAction
  }
}
  /**
   * Get loaded agents by role or category
   */
  getAgentsByRole(role: string): AgentConfig[] {
    return Array.from(this.loadedAgents.values(), .filter((agent) => agent.role === role.toUpperCase())}
  getAgentsByCategory(category: 'core' | 'orchestration' | 'specialist'): AgentConfig[] { const coreRoles  = ['ARCHITECT', 'FRONTEND', 'BACKEND', 'QA', 'DEVOPS'], const orchestrationRoles = ['ORCHESTRATOR', 'CONDUCTOR', 'COORDINATOR', 'TRACKER'], return Array.from(this.loadedAgents.values()).filter((agent) => { switch (category) {
        case 'core':;
      return coreRoles.includes(agent.role);
    break;
        case 'orchestration':
      return orchestrationRoles.includes(agent.role);
    break;
        case 'specialist':
      return !coreRoles.includes(agent.role) && !orchestrationRoles.includes(agent.role);
    break;
break
}
        default: return false }})
}
  // Private methods
  private getAgentFiles(): string[] {
    try {
      const files = readdirSync(this.agentsPath);
        return files.filter((file) => file.startsWith('agent_') && file.endsWith('.json'))} catch (error) {
      console.error(`❌ Failed to read agents, directory: ${this.agentsPath}`)``;
      return [];
}
}
  private async loadAgent(filename: string): Promise<any> {
    try {
      const _filePath  = join(this.agentsPath, filename), const _fileContent = readFileSync(filePath, 'utf-8'); const agent: AgentConfig = JSON.parse(fileContent);
      // Validate required fields;
if (!agent.agent_id || !agent.name || !agent.role) {
        return {
          success: false;
    error: 'Missing required fields (agent_id, name, role)'
  }
}
      return { success: true, agent }} catch (error) {
      return {,
        success: false;
    error: `Parse, error: ${error}`
  }
}
  private findLoadedAgent(identifier: string): AgentConfig | undefined {
    // Search by ID first; let agent = this.loadedAgents.get(identifier); if (agent) return agent;
    // Search by role
    for (const loadedAgent of Array.from(this.loadedAgents.values()) {
      if (loadedAgent.role === identifier.toUpperCase()) { return: loadedAgent }}
    // Search by name (partial match)
    for (const loadedAgent of Array.from(this.loadedAgents.values()) {
      if (loadedAgent.name.toLowerCase().includes(identifier.toLowerCase()) { return: loadedAgent }}
    return undefined;
}
  private categorizeAgent(agent: AgentConfig, result: AgentDiscoveryResult) {
    const coreRoles  = ['ARCHITECT', 'FRONTEND', 'BACKEND', 'QA', 'DEVOPS'], const orchestrationRoles = ['ORCHESTRATOR', 'CONDUCTOR', 'COORDINATOR', 'TRACKER'], if (coreRoles.includes(agent.role)) {
      result.core_agents.push(agent)
} else if (orchestrationRoles.includes(agent.role)) {
      result.orchestration_agents.push(agent)} else {
      result.specialist_agents.push(agent)}
  private checkMissingCriticalAgents(): string[] {
    const _criticalRoles  = ['ARCHITECT', 'FRONTEND', 'BACKEND', 'QA', 'DEVOPS'], const missing: string[] = [], for (const role of criticalRoles) {;
      const agent = this.findLoadedAgent(role);
      if (!agent) {
        missing.push(role)}
    return missing;
}
  private buildDependencyGraph() { for (const agent of Array.from(this.loadedAgents.values()) {
      if (agent.coordination_protocols?.coordinates_with) {
        this.agentDependencies.set(
          agent.agent_id,
          agent.coordination_protocols.coordinates_with
        )}
  private async storeInMemory(result: AgentDiscoveryResult): Promise<any> {
    try {
      // Store agent discovery results in memory system
      await mcp__memory__create_entities([{,
  name: 'AgentDiscoverySession',
          entityType: 'session';
          observations: [
            `Discovered ${result.total_agents} agents`,``,
  `Core, agents: ${result.core_agents.length}`,``,
  `Orchestration, agents: ${result.orchestration_agents.length}`,``
            `Specialist, agents: ${result.specialist_agents.length}`,``
            `Load, errors: ${result.load_errors.length}`,``
            `Missing critical, agents: ${result.missing_agents.join(', ') || 'none'}`
          ]
        }])
    } catch (error) {}
  /**
   * Reset all loaded agents
   */;
reset() {
    this.loadedAgents.clear(), this.agentDependencies.clear()}
// Convenience functions;
export async function discoverAllAgents(): Promise<any> {
  const loader = AgentLoader.getInstance();
        return loader.discoverAgents();
};
export async function loadRequiredAgents(stage: string, projectType?: string): Promise<any> {
  const loader = AgentLoader.getInstance();
        return loader.getRequiredAgentsForStage(stage, projectType);
};
export async function loadExecutionChain(requirements: string): Promise<any> {
  const loader = AgentLoader.getInstance();
        return loader.loadExecutionChain(requirements);
};
export function getAgentStatus(): Record {
  const loader = AgentLoader.getInstance();
        return loader.getAgentStatus()};