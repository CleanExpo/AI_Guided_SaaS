// Base Agent Classes
export { Agent, AgentContext } from './base/Agent'
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