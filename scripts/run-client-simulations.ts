#!/usr/bin/env ts-node

import { ClientSimulationRunner } from '../tests/simulation/client-simulation-runner'
import { writeFileSync } from 'fs'
import { join } from 'path'

async function main() {
  console.log('🚀 AI Guided SaaS - Client Simulation Testing')
  console.log('===========================================\n')
  
  const runner = new ClientSimulationRunner()
  
  try {
    // Run all scenarios
    const results = await runner.runAllScenarios()
    
    // Save results to file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const reportPath = join(process.cwd(), `simulation-report-${timestamp}.json`)
    const summaryPath = join(process.cwd(), `simulation-summary-${timestamp}.txt`)
    
    writeFileSync(reportPath, JSON.stringify(results, null, 2))
    writeFileSync(summaryPath, results.summary)
    
    // Display summary
    console.log(results.summary)
    
    // Exit with appropriate code
    process.exit(results.failed > 0 ? 1 : 0)
    
  } catch (error) {
    console.error('❌ Simulation runner, failed:', error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error)
}

export { main as runClientSimulations }