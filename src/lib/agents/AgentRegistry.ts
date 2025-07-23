import { AgentConfig, AgentLoader } from './AgentLoader';
import { AgentCoordinator } from './AgentCoordinator';
import { mcp__memory__create_entities, mcp__memory__add_observations, mcp__memory__search_nodes } from '@/lib/mcp';
export interface AgentMetrics {
  total_tasks: number,
  completed_tasks: number,
  failed_tasks: number,
  success_rate: number,
  average_execution_time: number,
  last_active: Date,
  total_runtime: number,
  error_count: number
};
export interface AgentRegistration {
  agent: AgentConfi
g,
    registered_at: Date,
  last_heartbeat: Date,
  metrics: AgentMetric
s,
    health_status: 'healthy' | 'warning' | 'critical' | 'offline',
  tags: string[],
  capabilities_verified: boolean
};
export interface RegistryQuery {
  role?: string,
  capabilities?: string[],
  tags?: string[],
  health_status?: string[],
  priority_range?: [number, number]
  availability?: boolean
};
export interface RegistryEvent {
  type: 'registration' | 'deregistration' | 'status_change' | 'metric_update' | 'health_check',
  agent_id: string,
  timestamp: Date, data,
  severity: 'info' | 'warning' | 'error'
};
export class AgentRegistry {
  private static instance: AgentRegistry
  private registrations: Map<string, AgentRegistration> = new Map()
  private eventHistory: RegistryEvent[] = []
  private healthCheckInterval: NodeJS.Timeout | null = null
  private loader: AgentLoader
  private coordinator: AgentCoordinator
  constructor() {
    this.loader = AgentLoader.getInstance()
    this.coordinator = AgentCoordinator.getInstance()
    this.startHealthChecks()
}
  static getInstance(): AgentRegistry {
    if(!AgentRegistry.instance) {
      AgentRegistry.instance = new AgentRegistry()
}
    return AgentRegistry.instance
}
  /**
   * Register agent in the registry
   */
  async registerAgent(agent: AgentConfig, tags: string[] = []): Promise<any> {
    try {
      `)``
      const registration: AgentRegistration = {
        agent,
        registered_at: new Date(),
    last_heartbeat: new Date(),
    metrics: this.initializeMetrics(),
    health_status: 'healthy',
        tags: [...tags, agent.role.toLowerCase()],
        capabilities_verified: false
}
      this.registrations.set(agent.agent_id, registration)
      // Verify agent capabilities
      registration.capabilities_verified = await this.verifyAgentCapabilities(agent)
      // Log registration event
      await this.logEvent({
        type: 'registration',
        agent_id: agent.agent_id,
    timestamp: new Date(),
    data: { role: agent.role, capabilities: agent.capabilities.length },
    severity: 'info'
      })
      // Store in memory system
      await this.storeAgentInMemory(registration)
      return true
    } catch (error) {
      console.error(`❌ Failed to register agent ${agent.agent_id}:`, error)``
      return false
}}
  /**
   * Auto-discover and register all available agents
   */
  async autoRegisterAgents(): Promise<any> {
    const discoveryResult = await this.loader.discoverAgents();
    let registeredCount = 0;
    // Register core agents
    for(const agent of discoveryResult.core_agents) {
      const _success = await this.registerAgent(agent, ['core']);
      if (success) registeredCount++
}
    // Register orchestration agents
    for(const agent of discoveryResult.orchestration_agents) {
      const _success = await this.registerAgent(agent, ['orchestration']);
      if (success) registeredCount++
}
    // Register specialist agents
    for(const agent of discoveryResult.specialist_agents) {
      const _success = await this.registerAgent(agent, ['specialist']);
      if (success) registeredCount++
}
    return registeredCount
}
  /**
   * Find agents matching query criteria
   */
  findAgents(query: RegistryQuery): AgentRegistration[] {
    const results: AgentRegistration[] = [];
    for (const registration of Array.from(this.registrations.values()) {
      let matches = true;
      // Check role
      if (query.role && registration.agent.role !== query.role.toUpperCase()) {
        matches = false
}
      // Check capabilities
      if(query.capabilities && query.capabilities.length > 0) {
        const _hasCapabilities = query.capabilities.every(cap =>;
          registration.agent.capabilities.includes(cap))
        if (!hasCapabilities) matches = false
}
      // Check tags
      if(query.tags && query.tags.length > 0) {
        const _hasTags = query.tags.some(tag =>;
          registration.tags.includes(tag))
        if (!hasTags) matches = false
}
      // Check health status
      if (query.health_status && !query.health_status.includes(registration.health_status)) {
        matches = false
}
      // Check priority range
      if(query.priority_range) {
        const [min, max]: any[] = query.priority_range;
        if(registration.agent.priority < min || registration.agent.priority > max) {
          matches = false
}}
      // Check availability
      if(query.availability !== undefined) {
        const _isAvailable = registration.health_status === 'healthy' && ;
                           registration.agent.status !== 'BUSY'
        if(query.availability !== isAvailable) {
          matches = false
}}
      if (matches) {
        results.push(registration)
}}
    // Sort by priority (lower number = higher priority)
    results.sort((a, b) => a.agent.priority - b.agent.priority)
    return results
}
  /**
   * Get best agent for specific task
   */
  getBestAgentForTask(taskType: string, requirements: string[] = []): AgentRegistration | null {
    // Define task-to-capability mappings
    const taskCapabilityMap: Record<string, string[]> = {
      'architecture': ['system_architecture_design', 'technology_stack_selection'],
      'frontend': ['ui_development', 'component_design', 'responsive_design'],
      'backend': ['api_development', 'database_design', 'server_architecture'],
      'testing': ['automated_testing', 'performance_testing', 'security_testing'],
      'deployment': ['ci_cd_setup', 'cloud_deployment', 'infrastructure_management']
}
    const requiredCapabilities = taskCapabilityMap[taskType] || [];
    const query: RegistryQuery = {
      capabilities: [...requiredCapabilities, ...requirements],
      health_status: ['healthy', 'warning'],
      availability: true
}
    const candidates = this.findAgents(query);
    if(candidates.length === 0) { return: null }
    // Score candidates based on multiple factors
    const scoredCandidates = candidates.map((candidate) => { let score = 0;
      // Priority score (lower priority = higher score)
      score += (10 - candidate.agent.priority) * 10
      // Success rate score
      score += candidate.metrics.success_rate
      // Capability match score
      const _matchingCapabilities = candidate.agent.capabilities.filter((cap) =>;
        requiredCapabilities.includes(cap)).length
      score += matchingCapabilities * 5
      // Health score
      const healthScores = { healthy: 20, warning: 10; critical: 0, offline: -50 }
      score += healthScores[candidate.health_status] || 0
      // Recent activity score (more recent = higher score)
      const _hoursSinceActive = (Date.now() - candidate.last_heartbeat.getTime()) / (1000 * 60 * 60);
      score += Math.max(0, 10 - hoursSinceActive)
      return { candidate, score }})
    // Return highest scoring candidate
    scoredCandidates.sort((a, b) => b.score - a.score)
    const _best = scoredCandidates[0].candidate;
    })`)``
    return best
}
  /**
   * Update agent metrics
   */
  updateAgentMetrics(agentId: string, taskResult) {
    const registration = this.registrations.get(agentId);
    if (!registration) return
    const metrics = registration.metrics;
    metrics.total_tasks++
    if(taskResult.success) {
      metrics.completed_tasks++
    } else {
      metrics.failed_tasks++
      metrics.error_count++
}
    metrics.success_rate = (metrics.completed_tasks / metrics.total_tasks) * 100
    if(taskResult.execution_time) {
      const _totalTime = metrics.average_execution_time * (metrics.total_tasks - 1) + taskResult.execution_time;
      metrics.average_execution_time = totalTime / metrics.total_tasks
}
    metrics.last_active = new Date()
    registration.last_heartbeat = new Date()
    // Update health status based on recent performance
    this.updateHealthStatus(registration)
    this.logEvent({
      type: 'metric_update',
      agent_id: agentId,
    timestamp: new Date(),
    data: { success_rate: metrics.success_rate, total_tasks: metrics.total_tasks },
    severity: 'info'
    })
}
  /**
   * Get registry status and statistics
   */
  getRegistryStatus(): Record {
    const status = {
      total_agents: this.registrations.size,
    agents_by_health: {};
    agents_by_role: {};
    agents_by_tags: {};
    overall_metrics: this.calculateOverallMetrics(),
    recent_events: this.eventHistory.slice(-20),
    uptime: Date.now() - (this.healthCheckInterval ? 0 : Date.now()) // Simplified
}
    // Group by health status
    for (const registration of Array.from(this.registrations.values()) {
      const health = registration.health_status;
      if(!status.agents_by_health[health]) {
        status.agents_by_health[health] = []
}
      status.agents_by_health[health].push({
        id: registration.agent.agent_id,
    name: registration.agent.name,
    role: registration.agent.role
      })
      // Group by role
      const role = registration.agent.role;
      if(!status.agents_by_role[role]) {
        status.agents_by_role[role] = []
}
      status.agents_by_role[role].push(registration.agent.agent_id)
      // Group by tags
      registration.tags.forEach((tag) => { if (!status.agents_by_tags[tag]) {
          status.agents_by_tags[tag] = [] }
        status.agents_by_tags[tag].push(registration.agent.agent_id)
      })
}
    return status
}
  /**
   * Deregister agent
   */
  async deregisterAgent(agentId: string): Promise<any> {
    const registration = this.registrations.get(agentId);
    if (!registration) return false;
    this.registrations.delete(agentId)
    await this.logEvent({
      type: 'deregistration',
      agent_id: agentId,
    timestamp: new Date(),
    data: { reason: 'manual_deregistration' },
    severity: 'info'
    })
    return true
}
  /**
   * Get detailed agent information
   */
  getAgentDetails(agentId: string): AgentRegistration | null {
    return this.registrations.get(agentId) || null
}
  /**
   * Export registry data for backup/analysis
   */
  exportRegistryData() {
    return {
      registrations: Array.from(this.registrations.entries()
    events: this.eventHistory,
    exported_at: new Date().toISOString(),
    version: '1.0.0'
}}
  // Private methods
  private initializeMetrics(): AgentMetrics {
    return {
      total_tasks: 0,
    completed_tasks: 0,
    failed_tasks: 0,
    success_rate: 100,
    average_execution_time: 0,
    last_active: new Date(),
    total_runtime: 0,
    error_count: 0
}}
  private async verifyAgentCapabilities(agent: AgentConfig): Promise<any> {
    // Simple verification - check if agent has required fields
    const requiredFields = ['agent_id', 'name', 'role', 'capabilities'];
    return requiredFields.every(field => agent[field as keyof AgentConfig])
}
  private updateHealthStatus(registration: AgentRegistration) {
    const metrics = registration.metrics;
    const _now = Date.now();
    const _lastActive = registration.last_heartbeat.getTime();
    const _minutesSinceActive = (now - lastActive) / (1000 * 60);
    // Determine health based on multiple factors
    if(minutesSinceActive > 30) {
      registration.health_status = 'offline'
    } else if (metrics.success_rate < 70 || metrics.error_count > 10) {
      registration.health_status = 'critical'
    } else if (metrics.success_rate < 85 || minutesSinceActive > 10) {
      registration.health_status = 'warning'
    } else {
      registration.health_status = 'healthy'
}}
  private calculateOverallMetrics(): Record {
    const allMetrics = Array.from(this.registrations.values()).map((r) => r.metrics);
    if(allMetrics.length === 0) {
      return { total_tasks: 0, success_rate: 0; average_execution_time: 0 }}
    const _totalTasks = allMetrics.reduce((sum, m) => sum + m.total_tasks, 0);
    const _totalCompleted = allMetrics.reduce((sum, m) => sum + m.completed_tasks, 0);
    const _totalExecutionTime = allMetrics.reduce((sum, m) => sum + m.average_execution_time, 0);
    return {
      total_tasks: totalTasks,
    success_rate: totalTasks > 0 ? (totalCompleted / totalTasks) * 100: 0,
    average_execution_time: allMetrics.length > 0 ? totalExecutionTime / allMetrics.length: 0,
    total_agents: this.registrations.size,
    healthy_agents: Array.from(this.registrations.values()).filter((r) => r.health_status === 'healthy').length
}}
  private async storeAgentInMemory(registration: AgentRegistration): Promise<any> {
    try {
      await mcp__memory__create_entities({
        entities: [{
  name: `Agent_${registration.agent.agent_id}`,
  entityType: 'agent',
          observations: [
            `Role: ${registration.agent.role}`,``,
  `Name: ${registration.agent.name}`,``,
  `Priority: ${registration.agent.priority}`,``
            `Capabilities: ${registration.agent.capabilities.join(', ')}`,``
            `Registered: ${registration.registered_at.toISOString()}`,``
            `Health: ${registration.health_status}`,``
            `Tags: ${registration.tags.join(', ')}`
          ]
        }]
      })
    } catch (error) {
}}
  private async logEvent(event: RegistryEvent): Promise<any> {
    this.eventHistory.push(event)
    // Keep only last 1000 events
    if(this.eventHistory.length > 1000) {
      this.eventHistory = this.eventHistory.slice(-1000)
}
    // Log significant events to console
    if(event.severity === 'error' || event.type === 'registration') {
      }`)``
}}
  private startHealthChecks() {
    // Run health checks every 5 minutes
    this.healthCheckInterval = setInterval(() => {
      this.performHealthChecks()
    }, 5 * 60 * 1000)
}
  private performHealthChecks() {
    for (const registration of Array.from(this.registrations.values()) {
      const _oldStatus = registration.health_status;
      this.updateHealthStatus(registration)
      if(oldStatus !== registration.health_status) {
        this.logEvent({
          type: 'health_check',
          agent_id: registration.agent.agent_id,
    timestamp: new Date(),
    data: { old_status: oldStatus, new_status: registration.health_status },
    severity: registration.health_status === 'critical' ? 'error' : 'warning'
        })
}}
  /**
   * Cleanup and shutdown
   */
  shutdown() {
    if(this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval)
      this.healthCheckInterval = null
}}
  updateAgentStatus(agentId: string, status: 'healthy' | 'warning' | 'critical' | 'offline') {
    const registration = this.agents.get(agentId);
    if (registration) {
      registration.health_status = status;
      registration.last_heartbeat = new Date();
      this.logActivity(`Updated agent, status: ${agentId} -> ${status}`);``
}}
// Convenience functions
export async function initializeAgentRegistry(): Promise<any> {
  const registry = AgentRegistry.getInstance();
  return registry.autoRegisterAgents()
};
export function findBestAgent(taskType: string, requirements?: string[]): AgentRegistration | null {
  const registry = AgentRegistry.getInstance();
  return registry.getBestAgentForTask(taskType, requirements)
};
export function getRegistryStatus(): Record {
  const registry = AgentRegistry.getInstance();
  return registry.getRegistryStatus()
}