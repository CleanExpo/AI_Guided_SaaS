#!/usr/bin/env node

/**
 * Agent Monitoring Script
 * Displays real-time status of all agents
 */

import { agentSystem, getMonitoringDashboard } from '../src/lib/agents'

async function main() {
  console.log('📊 Agent Monitoring Dashboard')
  console.log('=============================\n')

  try {
    // Initialize if needed
    const status = agentSystem.getSystemStatus()
    if (!status.initialized) {
      console.log('⚠️ System not initialized. Initializing...')
      await agentSystem.initialize()
    }

    // Start continuous monitoring
    console.log('🔍 Starting continuous monitoring (Ctrl+C to stop)...\n')
    
    const monitor = () => {
      const dashboard = getMonitoringDashboard()
      const systemStatus = agentSystem.getSystemStatus()
      
      // Clear console and redraw
      console.clear()
      console.log('📊 Agent Monitoring Dashboard')
      console.log('=============================')
      console.log(`📅 ${new Date().toLocaleString()}\n`)
      
      // System Overview
      console.log('🏥 System Health')
      console.log('----------------')
      console.log(`Overall Score: ${dashboard.overview.system_health_score.toFixed(1)}%`)
      console.log(`Status: ${systemStatus.system_health.status.toUpperCase()}`)
      console.log()
      
      // Agent Status
      console.log('🤖 Agent Status')
      console.log('---------------')
      console.log(`Total Agents: ${dashboard.overview.total_agents}`)
      console.log(`✅ Healthy: ${dashboard.overview.healthy_agents}`)
      console.log(`⚠️  Warning: ${dashboard.overview.warning_agents}`)
      console.log(`❌ Critical: ${dashboard.overview.critical_agents}`)
      console.log(`📴 Offline: ${dashboard.overview.offline_agents}`)
      console.log()
      
      // Communication Stats
      console.log('📡 Communication')
      console.log('----------------')
      console.log(`Messages: ${systemStatus.communication.total_messages}`)
      console.log(`Success Rate: ${systemStatus.communication.success_rate.toFixed(1)}%`)
      console.log(`Active Channels: ${systemStatus.communication.active_channels}`)
      console.log()
      
      // Recent Activity
      if (dashboard.recent_activity.length > 0) {
        console.log('📋 Recent Activity')
        console.log('-----------------')
        dashboard.recent_activity.slice(0, 5).forEach(activity => {
          const time = new Date(activity.timestamp).toLocaleTimeString()
          console.log(`[${time}] ${activity.message}`)
        })
      }
      
      // Active Alerts
      if (dashboard.alerts.active_alerts.length > 0) {
        console.log('\n🚨 Active Alerts')
        console.log('----------------')
        dashboard.alerts.active_alerts.forEach(alert => {
          console.log(`[${alert.severity.toUpperCase()}] ${alert.agent_id}: ${alert.message}`)
        })
      }
    }
    
    // Initial display
    monitor()
    
    // Update every 2 seconds
    setInterval(monitor, 2000)
    
  } catch (error) {
    console.error('❌ Monitoring failed:', error)
    process.exit(1)
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Stopping agent monitoring...')
  process.exit(0)
})

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export default main