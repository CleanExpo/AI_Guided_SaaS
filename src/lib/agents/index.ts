// Base Agent Classes
export { Agent, AgentContext } from './base/Agent'

import { AgentLoader } from './AgentLoader'
import { AgentRegistry } from './AgentRegistry'
import { AgentCoordinator } from './AgentCoordinator'
import { AgentMonitor } from './AgentMonitor'
import { AgentCommunication } from './AgentCommunication'
export type { AgentConfig, AgentResult, AgentMessage, AgentArtifact } from './base/Agent'

// BMAD-METHOD Agents
export { AnalystAgent } from './bmad/AnalystAgent'
export { ProjectManagerAgent } from './bmad/ProjectManagerAgent'
export { ArchitectAgent } from './bmad/ArchitectAgent'

// Archon Refinement Agents
export { PromptRefinerAgent } from './archon/PromptRefinerAgent'
export { ToolsRefinerAgent } from './archon/ToolsRefinerAgent'
export { AgentRefinerAgent } from './archon/AgentRefinerAgent'
export { AdvisorAgent } from './archon/AdvisorAgent'

// NEW: Agent Orchestration System
export { 
  AgentLoader, 
  type AgentConfig as OrchestratorAgentConfig, 
  type AgentLoadResult, 
  type AgentDiscoveryResult,
  discoverAllAgents,
  loadRequiredAgents,
  loadExecutionChain,
  getAgentStatus
} from './AgentLoader'

export {
  AgentRegistry,
  type AgentRegistration,
  type AgentMetrics,
  type RegistryQuery,
  type RegistryEvent,
  initializeAgentRegistry,
  findBestAgent,
  getRegistryStatus
} from './AgentRegistry'

export {
  AgentCoordinator,
  type CoordinationTask,
  type CoordinationPlan,
  type AgentHandoff,
  type CoordinationResult,
  createProjectCoordination,
  executeProjectCoordination,
  getCoordinationStatus
} from './AgentCoordinator'

export {
  AgentMonitor,
  type HealthCheck,
  type MonitoringAlert,
  type MonitoringMetrics,
  type MonitoringDashboard,
  startAgentMonitoring,
  getMonitoringDashboard,
  getAgentHealth
} from './AgentMonitor'

export {
  AgentCommunication,
  type AgentMessage as CommunicationMessage,
  type CommunicationChannel,
  type MessageQueue,
  type HandoffProtocol,
  type CommunicationStats,
  initializeAgentCommunication,
  sendAgentMessage,
  performAgentHandoff
} from './AgentCommunication'

// Main Agent System Integration
export class AgentSystem {
  private static instance: AgentSystem
  private initialized: boolean = false
  private loader: AgentLoader
  private registry: AgentRegistry
  private coordinator: AgentCoordinator
  private monitor: AgentMonitor
  private communication: AgentCommunication

  constructor() {
    this.loader = AgentLoader.getInstance()
    this.registry = AgentRegistry.getInstance()
    this.coordinator = AgentCoordinator.getInstance()
    this.monitor = AgentMonitor.getInstance()
    this.communication = AgentCommunication.getInstance()
  }

  static getInstance(): AgentSystem {
    if (!AgentSystem.instance) {
      AgentSystem.instance = new AgentSystem()
    }
    return AgentSystem.instance
  }

  async initialize(): Promise<boolean> {
    if (this.initialized) {
      console.log('⚠️ Agent system already initialized')
      return true
    }

    console.log('🚀 Initializing AI Guided SaaS Agent System...')

    try {
      const discovery = await this.loader.discoverAgents()
      if (discovery.total_agents === 0) {
        throw new Error('No agents discovered - check agents directory')
      }

      const registeredCount = await this.registry.autoRegisterAgents()
      if (registeredCount === 0) {
        throw new Error('No agents registered')
      }

      this.monitor.startMonitoring()
      await new Promise(resolve => setTimeout(resolve, 1000))

      this.initialized = true
      console.log('🎉 Agent system initialization complete!')
      
      return true
    } catch (error) {
      console.error('❌ Agent system initialization failed:', error)
      return false
    }
  }

  async getAgentsForNextStage(currentStage: string, projectType?: string): Promise<any> {
    if (!this.initialized) {
      throw new Error('Agent system not initialized')
    }

    const requiredAgents = await this.loader.getRequiredAgentsForStage(currentStage, projectType)
    const healthyAgents = requiredAgents.filter(agent => {
      const registration = this.registry.getAgentDetails(agent.agent_id)
      return registration?.health_status === 'healthy'
    })

    return {
      stage: currentStage,
      project_type: projectType,
      required_agents: requiredAgents.length,
      healthy_agents: healthyAgents.length,
      agents: healthyAgents.map(agent => ({
        id: agent.agent_id,
        name: agent.name,
        role: agent.role,
        priority: agent.priority,
        capabilities: agent.capabilities,
        status: agent.status
      })),
      readiness: healthyAgents.length >= requiredAgents.length * 0.8
    }
  }

  getSystemStatus(): any {
    if (!this.initialized) {
      return { initialized: false, error: 'System not initialized' }
    }

    const registryStatus = this.registry.getRegistryStatus()
    const dashboard = this.monitor.getMonitoringDashboard()
    const commStats = this.communication.getCommunicationStats()

    return {
      initialized: this.initialized,
      timestamp: new Date().toISOString(),
      agents: {
        total: registryStatus.total_agents,
        healthy: dashboard.overview.healthy_agents,
        warning: dashboard.overview.warning_agents,
        critical: dashboard.overview.critical_agents,
        offline: dashboard.overview.offline_agents
      },
      system_health: {
        overall_score: dashboard.overview.system_health_score,
        status: dashboard.overview.system_health_score >= 90 ? 'excellent' :
                dashboard.overview.system_health_score >= 75 ? 'good' :
                dashboard.overview.system_health_score >= 50 ? 'fair' : 'poor'
      },
      communication: {
        total_messages: commStats.total_messages,
        success_rate: commStats.success_rate,
        active_channels: commStats.active_channels
      }
    }
  }

  async performHealthCheck(): Promise<{
    healthy: number;
    warnings: string[];
    errors: string[];
  }> {
    const health = await this.monitor.performHealthCheck();
    const warnings: string[] = [];
    const errors: string[] = [];
    
    // Collect warnings and errors from health checks
    for (const [agentId, check] of Object.entries(health)) {
      if (check.status === 'warning') {
        warnings.push(`${agentId}: ${check.details?.message || 'Warning'}`);
      } else if (check.status === 'critical') {
        errors.push(`${agentId}: ${check.details?.message || 'Critical error'}`);
      }
    }
    
    const healthy = Object.values(health).filter(h => h.status === 'healthy').length;
    
    return { healthy, warnings, errors };
  }

  shutdown(): void {
    console.log('📤 Shutting down agent system...')
    this.monitor.stopMonitoring()
    this.communication.shutdown()
    this.registry.shutdown()
    this.initialized = false
    console.log('✅ Agent system shutdown complete')
  }
}

// Convenience function for easy system initialization
export async function initializeAgentSystem(): Promise<AgentSystem> {
  const system = AgentSystem.getInstance()
  await system.initialize()
  return system
}

// Export the main system instance
export const agentSystem = AgentSystem.getInstance()

// Agent Factory
export function createAgent(type: string) {
  switch (type) {
    // BMAD Agents
    case 'analyst':
      return new (require('./bmad/AnalystAgent').AnalystAgent)()
    case 'project-manager':
      return new (require('./bmad/ProjectManagerAgent').ProjectManagerAgent)()
    case 'architect':
      return new (require('./bmad/ArchitectAgent').ArchitectAgent)()
    
    // Archon Agents
    case 'prompt-refiner':
      return new (require('./archon/PromptRefinerAgent').PromptRefinerAgent)()
    case 'tools-refiner':
      return new (require('./archon/ToolsRefinerAgent').ToolsRefinerAgent)()
    case 'agent-refiner':
      return new (require('./archon/AgentRefinerAgent').AgentRefinerAgent)()
    case 'advisor':
      return new (require('./archon/AdvisorAgent').AdvisorAgent)()
    
    default:
      throw new Error(`Unknown agent type: ${type}`)
  }
}

// Export all types
export * from './bmad'
export * from './archon'