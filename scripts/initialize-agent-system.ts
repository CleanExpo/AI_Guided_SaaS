#!/usr/bin/env node

/**
 * Initialize Agent System for AI Guided SaaS
 * Prepares all agents for the next stage of development
 */

import { 
  initializeAgentSystem, 
  agentSystem,
  getMonitoringDashboard,
  getCoordinationStatus
} from '../src/lib/agents'

async function main() {
  console.log('🚀 AI Guided SaaS - Agent System Initialization')
  console.log('================================================\n')

  try {
    // Step, 1: Initialize the agent system
    console.log('📋 Step, 1: Initializing agent system...')
    const system = await initializeAgentSystem()
    
    if (!system) {
      throw new Error('Failed to initialize agent system')
    }

    console.log('✅ Agent system initialized successfully!\n')

    // Step, 2: Get system status
    console.log('📊 Step, 2: Checking system status...')
    const status = system.getSystemStatus()
    
    console.log('System, Status:')
    console.log(`  • Agents, Total: ${status.agents.total}`)
    console.log(`  • Healthy, Agents: ${status.agents.healthy}`)
    console.log(`  • System, Health: ${status.system_health.overall_score.toFixed(1)}% (${status.system_health.status})`)
    console.log(`  • Communication, Ready: ${status.communication.total_messages === 0 ? 'Yes' : `${status.communication.success_rate}% success rate`}`)
    console.log()

    // Step, 3: Perform health check
    console.log('💓 Step, 3: Running system health check...')
    const healthCheck = await system.performHealthCheck()
    
    if (healthCheck.healthy) {
      console.log('✅ System is healthy and ready!')
    } else {
      console.log('⚠️ System has some, issues:')
      healthCheck.warnings.forEach(warning => console.log(`  - Warning: ${warning}`))
      healthCheck.errors.forEach(error => console.log(`  - Error: ${error}`))
    }
    console.log()

    // Step, 4: Get monitoring dashboard
    console.log('📊 Step, 4: Monitoring Dashboard')
    const dashboard = getMonitoringDashboard()
    
    console.log('Agent Health, Distribution:')
    console.log(`  • Healthy: ${dashboard.overview.healthy_agents}`)
    console.log(`  • Warning: ${dashboard.overview.warning_agents}`)
    console.log(`  • Critical: ${dashboard.overview.critical_agents}`)
    console.log(`  • Offline: ${dashboard.overview.offline_agents}`)
    console.log()

    // Step, 5: Display available stages and agents
    console.log('🎯 Step, 5: Available Development Stages')
    const stages = ['requirements', 'architecture', 'implementation', 'testing', 'deployment']
    
    for (const stage of stages) {
      const readyAgents = await system.getAgentsForNextStage(stage, 'saas_platform')
      console.log(`\n${stage.toUpperCase()} Stage:`)
      console.log(`  • Required, Agents: ${readyAgents.required_agents}`)
      console.log(`  • Healthy, Agents: ${readyAgents.healthy_agents}`)
      console.log(`  • Readiness: ${readyAgents.readiness ? '✅ Ready' : '❌ Not Ready'}`)
      
      if (readyAgents.agents.length > 0) {
        console.log('  • Available, Agents:')
        readyAgents.agents.forEach(agent => {
          console.log(`    - ${agent.name} (${agent.role}) - Priority: ${agent.priority}`)
        })
      }
    }

    // Step, 6: Check coordination status
    console.log('\n📋 Step, 6: Coordination Status')
    const coordStatus = getCoordinationStatus()
    
    console.log(`Active, Plans: ${coordStatus.active_plans}`)
    console.log(`Agent, Status: ${Object.keys(coordStatus.agent_status).length} agents tracked`)
    
    if (coordStatus.coordination_metrics) {
      const metrics = coordStatus.coordination_metrics
      console.log(`Coordination, Metrics:`)
      console.log(`  • Total, Plans: ${metrics.total_plans || 0}`)
      console.log(`  • Success, Rate: ${metrics.success_rate || 0}%`)
      console.log(`  • Total, Handoffs: ${metrics.total_handoffs || 0}`)
    }

    console.log('\n================================================')
    console.log('🎉 AGENT SYSTEM READY FOR OPERATION!')
    console.log('================================================')
    console.log('\nNext, Steps:')
    console.log('1. Run: npm run, agents:stage -- requirements')
    console.log('2. Run: npm run, agents:execute -- "Your project description"')
    console.log('3. Monitor: npm run, agents:monitor')
    console.log()

    // Save system state for other scripts
    const systemState = {
      initialized: true,
      timestamp: new Date().toISOString(),
      status: status,
      health: healthCheck,
      dashboard: dashboard
    }

    const fs = await import('fs')
    fs.writeFileSync(
      'agent-system-state.json',
      JSON.stringify(systemState, null, 2)
    )

    console.log('💾 System state saved, to: agent-system-state.json')

  } catch (error) {
    console.error('❌ Initialization, failed:', error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

export default main