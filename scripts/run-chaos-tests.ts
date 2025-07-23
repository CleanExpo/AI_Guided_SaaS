#!/usr/bin/env ts-node
import { ChaosMonkey } from '../tests/chaos/chaos-monkey';
import { writeFileSync } from 'fs';
import { join } from 'path';
async function runChaosTests(durationMinutes: number = 10): Promise<any> {
  const chaos = new ChaosMonkey();
  // Listen to chaos events
  chaos.on('chaos:start', (scenario: any) => {
  })
  chaos.on('chaos:end', (result: any) => {
    if(result.recoveryTime) {
      .toFixed(1)}s`)}
    if(result.systemResponse.alertsTriggered.length > 0) {
      }`)}
    if(result.error) {}})
  // Start chaos with 30 second intervals
  chaos.start(30000)
  // Run for specified duration
  await new Promise(resolve => setTimeout(resolve, durationMinutes * 60 * 1000))
  // Stop chaos
  chaos.stop()
  // Generate report
  const _report = chaos.generateReport();
  // Save results
  const _timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const _reportPath = join(process.cwd(), `chaos-report-${timestamp}.txt`)
  const _resultsPath = join(process.cwd(), `chaos-results-${timestamp}.json`)
  writeFileSync(reportPath, report)
  writeFileSync(resultsPath, JSON.stringify(chaos.getResults(), null, 2))}
// Handle command line arguments
const args = process.argv.slice(2);
const _duration = parseInt(args[0]) || 10;
// Ensure clean shutdown
process.on('SIGINT': any, (: any) => {
  process.exit(0)
})
// Run the chaos tests
runChaosTests(duration).catch(console.error)