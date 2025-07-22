const { spawn } = require('child_process')
const path = require('path')

// Get agent configuration from environment
const AGENT_TYPE = process.env.AGENT_TYPE || 'unknown'
const AGENT_ID = process.env.AGENT_ID || 'unknown'
const ORCHESTRATOR_URL = process.env.ORCHESTRATOR_URL || 'http://localhost:3000'

`)

// Agent type to script mapping
const agentScripts = {
  orchestrator: 'src/lib/agents/orchestrator-runner.ts',
  frontend: 'src/lib/agents/runners/frontend-agent.ts',
  backend: 'src/lib/agents/runners/backend-agent.ts',
  architect: 'src/lib/agents/runners/architect-agent.ts',
  qa: 'src/lib/agents/runners/qa-agent.ts',
  devops: 'src/lib/agents/runners/devops-agent.ts'
}

const scriptPath = agentScripts[AGENT_TYPE]

if (!scriptPath) {
  console.error(`Unknown agent type: ${AGENT_TYPE}`)
  process.exit(1)
}

// Start the health check server in parallel
const healthCheck = spawn('node', [path.join(__dirname, 'agent-health-check.js')], {
  env: { ...process.env },
  stdio: 'inherit'
})

// Start the actual agent
const agent = spawn('npx', ['tsx', scriptPath], {
  env: {
    ...process.env,
    NODE_ENV: 'production',
    AGENT_ID,
    AGENT_TYPE,
    ORCHESTRATOR_URL
  },
  stdio: 'inherit'
})

// Handle agent process events
agent.on('error', (error) => {
  console.error(`Failed to start agent: ${error.message}`)
  process.exit(1)
})

agent.on('exit', (code, signal) => {

  // Kill health check process
  healthCheck.kill()
  
  // Exit with the same code
  process.exit(code || 0)
})

// Handle graceful shutdown
process.on('SIGTERM', () => {

  // Send SIGTERM to child processes
  agent.kill('SIGTERM')
  healthCheck.kill('SIGTERM')
  
  // Give processes time to shut down gracefully
  setTimeout(() => {
    agent.kill('SIGKILL')
    healthCheck.kill('SIGKILL')
    process.exit(0)
  }, 10000)
})

process.on('SIGINT', () => {

  agent.kill('SIGINT')
  healthCheck.kill('SIGINT')
})