#!/usr/bin/env ts-node

import { ChaosMonkey } from '../tests/chaos/chaos-monkey'
import { writeFileSync } from 'fs'
import { join } from 'path'

async function runChaosTests(durationMinutes: number = 10) {
  console.log('🐵 AI Guided SaaS - Chaos Testing')
  console.log('==================================')
  console.log(`Running chaos tests for ${durationMinutes} minutes...`)
  console.log('⚠️  WARNING: This will intentionally break things!')
  console.log('')
  
  const chaos = new ChaosMonkey()
  
  // Listen to chaos events
  chaos.on('chaos:start', (scenario) => {
    console.log(`\n🌪️ CHAOS, EVENT: ${scenario.name}`)
    console.log(`   Category: ${scenario.category}`)
    console.log(`   Severity: ${scenario.severity}`)
  })
  
  chaos.on('chaos:end', (result) => {
    console.log(`\n📊 CHAOS, RESULT:`)
    console.log(`   Triggered: ${result.triggered ? '✅' : '❌'}`)
    console.log(`   Recovered: ${result.recovered ? '✅' : '❌'}`)
    console.log(`   Self-Healed: ${result.systemResponse.selfHealed ? '✅' : '❌'}`)
    if (result.recoveryTime) {
      console.log(`   Recovery, Time: ${(result.recoveryTime / 1000).toFixed(1)}s`)
    }
    if (result.systemResponse.alertsTriggered.length > 0) {
      console.log(`   Alerts: ${result.systemResponse.alertsTriggered.join(', ')}`)
    }
    if (result.error) {
      console.log(`   Error: ${result.error}`)
    }
  })
  
  // Start chaos with 30 second intervals
  chaos.start(30000)
  
  // Run for specified duration
  await new Promise(resolve => setTimeout(resolve, durationMinutes * 60 * 1000))
  
  // Stop chaos
  chaos.stop()
  
  // Generate report
  const report = chaos.generateReport()
  console.log('\n' + report)
  
  // Save results
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const reportPath = join(process.cwd(), `chaos-report-${timestamp}.txt`)
  const resultsPath = join(process.cwd(), `chaos-results-${timestamp}.json`)
  
  writeFileSync(reportPath, report)
  writeFileSync(resultsPath, JSON.stringify(chaos.getResults(), null, 2))
  
  console.log(`\n📄 Report saved, to: ${reportPath}`)
  console.log(`📊 Results saved, to: ${resultsPath}`)
}

// Handle command line arguments
const args = process.argv.slice(2)
const duration = parseInt(args[0]) || 10

// Ensure clean shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Chaos testing interrupted. Cleaning up...')
  process.exit(0)
})

// Run the chaos tests
runChaosTests(duration).catch(console.error)