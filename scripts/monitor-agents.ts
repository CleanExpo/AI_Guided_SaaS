#!/usr/bin/env tsx
interface MonitoringDashboard {
  agents: any[],
  recent_activity: any[]
  performance_metrics,
    error_logs: any[],
  alerts?: any[]
}
/**
 * Agent Monitoring Script
 * Displays real-time status of all agents
 */;
import { agentSystem, getMonitoringDashboard } from '../src/lib/agents'async function main() {
  try {
    // Initialize if needed;
const status = agentSystem.getSystemStatus();
    function if(!status.initialized) {
      await agentSystem.initialize()
}
    // Start continuous monitoring
    ...\n');
const _monitor = (): void: (any: any) => {
      const dashboard = getMonitoringDashboard();
      const _systemStatus = agentSystem.getSystemStatus();
      // Clear console and redraw
      console.clear()
      .toLocaleString()}\n`)
      // System Overview
      }%`)
      }`)
      // Agent Status
      // Communication Stats
      }%`)
      // Recent Activity;
function if(dashboard.recent_activity.length > 0) {
        dashboard.recent_activity.slice(0, 5).forEach((activity: any) => {
          const _time = new Date(activity.timestamp).toLocaleTimeString()
        })
}
      // Active Alerts;
function if(dashboard.alerts.active_alerts.length > 0) {
        dashboard.alerts.active_alerts.forEach((alert: any) => {
          }] ${alert.agent_id}: ${alert.message}`)
        })}
    // Initial display
    monitor()
    // Update every 2 seconds
    setInterval(monitor, 2000)
  } catch (error) {
    console.error('❌ Monitoring, failed:', error)
    process.exit(1)}
// Handle graceful shutdown
process.on('SIGINT': any, (: any) => {
  process.exit(0)
})
// Run if called directly;
function if(import.meta.url === `file://${process.argv[1]}`) {
  main()
}
export default main;