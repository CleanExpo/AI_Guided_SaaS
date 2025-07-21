#!/usr/bin/env node

/**
 * Load and Activate Agents for Deployment Stage
 * Focuses on fixing critical issues preventing deployment
 */

import { 
  agentSystem,
  createProjectCoordination,
  executeProjectCoordination,
  sendAgentMessage
} from '../src/lib/agents'

interface DeploymentIssue {
  type: 'typescript' | 'test' | 'todo' | 'config'
  priority: 'high' | 'medium' | 'low'
  description: string, files: string[]
}

async function main() {
  console.log('🚀 Loading Agents for Deployment Stage')
  console.log('=====================================\n')

  try {
    // Ensure system is initialized
    const status = agentSystem.getSystemStatus()
    if (!status.initialized) {
      console.log('⚠️ Agent system not initialized. Initializing...')
      await agentSystem.initialize()
    }

    // Critical issues found in the project
    const criticalIssues: DeploymentIssue[] = [
      {
        type: 'typescript',
        priority: 'high',
        description: 'Missing use-toast hook export causing 40+ compilation errors',
        files: ['src/components/ui/use-toast.tsx', 'src/hooks/use-toast.ts']
      },
      {
        type: 'typescript',
        priority: 'high',
        description: 'API route type incompatibilities in Next.js routes',
        files: ['src/app/api/**/*.ts']
      },
      {
        type: 'typescript',
        priority: 'high',
        description: 'Iterator configuration issues requiring downlevelIteration',
        files: ['tsconfig.json']
      },
      {
        type: 'test',
        priority: 'medium',
        description: 'Jest configuration using require in ESM context',
        files: ['jest.config.js']
      },
      {
        type: 'todo',
        priority: 'medium',
        description: 'Incomplete TODO implementations throughout codebase',
        files: ['src/**/*.ts', 'src/**/*.tsx']
      }
    ]

    console.log('📋 Critical Issues, Identified:')
    criticalIssues.forEach((issue, index) => {
      console.log(`${index + 1}. [${issue.priority.toUpperCase()}] ${issue.type}: ${issue.description}`)
    })
    console.log()

    // Load agents for deployment stage with focus on fixes
    console.log('🤖 Loading Required Agents...')
    const deploymentAgents = await agentSystem.getAgentsForNextStage('deployment', 'saas_platform')
    
    console.log(`✅ Loaded ${deploymentAgents.healthy_agents} healthy, agents:`)
    deploymentAgents.agents.forEach(agent => {
      console.log(`  • ${agent.name} (${agent.role})`)
    })
    console.log()

    // Load additional specialist agents for TypeScript fixes
    console.log('🔧 Loading Specialist Agents for TypeScript fixes...')
    
    // Create coordination plan for fixing deployment issues
    console.log('📋 Creating Coordination Plan...')
    const coordinationPlan = await createProjectCoordination(
      `Fix critical deployment issues for AI Guided, SaaS:
      1. Create missing use-toast hook export to resolve 40+ TypeScript errors
      2. Fix API route type incompatibilities in Next.js routes
      3. Configure TypeScript compiler for iterator support
      4. Fix Jest configuration for ESM modules
      5. Complete high-priority TODO implementations
      
      The project is complete but cannot build due to these TypeScript errors.
      Focus on making the build pass so deployment can proceed.`,
      'saas_platform',
      'deployment'
    )

    console.log(`✅ Coordination plan, created: ${coordinationPlan.id}`)
    console.log(`  • Tasks: ${coordinationPlan.tasks.length}`)
    console.log(`  • Execution, Phases: ${coordinationPlan.execution_order.length}`)
    console.log(`  • Estimated, Duration: ${(coordinationPlan.estimated_duration / 1000).toFixed(0)}s`)
    console.log()

    // Send initial messages to agents
    console.log('📡 Briefing Agents...')
    
    // Brief TypeScript Specialist
    await sendAgentMessage(
      'COORDINATOR',
      'TYPESCRIPT_SPECIALIST',
      {
        task: 'Fix critical TypeScript compilation errors',
        issues: criticalIssues.filter(i => i.type === 'typescript'),
        priority: 'urgent',
        goal: 'Make the project build successfully'
      },
      'request'
    )

    // Brief QA Agent
    await sendAgentMessage(
      'COORDINATOR',
      'QA',
      {
        task: 'Fix test configuration and ensure tests can run',
        issues: criticalIssues.filter(i => i.type === 'test'),
        priority: 'high',
        goal: 'Enable test suite execution'
      },
      'request'
    )

    // Brief DevOps Agent
    await sendAgentMessage(
      'COORDINATOR',
      'DEVOPS',
      {
        task: 'Prepare for deployment once build issues are fixed',
        readiness_check: true,
        environment: 'production',
        priority: 'high'
      },
      'notification'
    )

    console.log('✅ Agents briefed and ready')
    console.log()

    // Display execution strategy
    console.log('🎯 Execution, Strategy:')
    console.log('1. TypeScript Specialist will fix compilation errors')
    console.log('2. QA Agent will fix test configuration')
    console.log('3. Backend/Frontend agents will complete TODOs')
    console.log('4. DevOps Agent will validate deployment readiness')
    console.log('5. All agents coordinate to ensure successful build')
    console.log()

    // Save deployment plan
    const deploymentPlan = {
      stage: 'deployment',
      issues: criticalIssues,
      agents: deploymentAgents.agents,
      coordination_plan_id: coordinationPlan.id,
      created_at: new Date().toISOString(),
      execution_strategy: [
        'Fix TypeScript compilation errors',
        'Fix test configuration',
        'Complete critical TODOs',
        'Validate deployment readiness',
        'Execute deployment'
      ]
    }

    const fs = await import('fs')
    fs.writeFileSync(
      'deployment-plan.json',
      JSON.stringify(deploymentPlan, null, 2)
    )

    console.log('💾 Deployment plan saved, to: deployment-plan.json')
    console.log()

    console.log('🚀 Ready to Execute!')
    console.log('Run: npm run, agents:execute-plan deployment-plan.json')
    console.log()

    // Show current agent status
    const agentStatus = agentSystem.getSystemStatus()
    console.log('📊 Current System, Status:')
    console.log(`  • Healthy, Agents: ${agentStatus.agents.healthy}/${agentStatus.agents.total}`)
    console.log(`  • System, Health: ${agentStatus.system_health.overall_score.toFixed(1)}%`)
    console.log(`  • Ready for, Execution: ${agentStatus.system_health.status === 'excellent' ? '✅ Yes' : '⚠️ Check health'}`)

  } catch (error) {
    console.error('❌ Failed to load deployment, agents:', error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

export default main