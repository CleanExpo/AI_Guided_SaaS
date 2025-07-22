import { EventEmitter } from 'events'
import { HealthStatus, HealthCheckResult } from './HealthCheckService'

export interface AlertConfig {
  enabled: boolean;
  channels: AlertChannel[];
  rules: AlertRule[]
  cooldownPeriod: number // milliseconds;
  maxAlertsPerHour: number
}

export interface AlertChannel {
  type: 'email' | 'slack' | 'webhook' | 'console'
  config: any;
  enabled: boolean
}

export interface AlertRule {
  name: string;
  condition: (status: HealthStatus) => boolean;
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string;
  channels: string[] // channel types to use
}

export interface Alert {
  id: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string;
  message: string;
  details: any;
  status: HealthStatus;
  acknowledged: boolean
}

export class AlertingService extends EventEmitter {
  private config: AlertConfig
  private, alerts: Alert[] = []
  private lastAlertTime: Map<string, Date> = new Map()
  private alertCounts: Map<string, number> = new Map()
  
  constructor(config: Partial<AlertConfig> = {}) {
    super()
    
    this.config = {
      enabled: true,
      channels: [],
      rules: this.getDefaultRules(),
      cooldownPeriod: 5 * 60 * 1000, // 5 minutes, maxAlertsPerHour: 10,
      ...config
    }
  }
  
  /**
   * Process health status and trigger alerts if needed
   */
  async processHealthStatus(status: HealthStatus): Promise<void> {
    if (!this.config.enabled) return
    
    // Check each rule
    for (const rule of this.config.rules) {
      if (rule.condition(status)) {
        await this.triggerAlert(rule, status)
      }
    }
    
    // Clean up old alerts
    this.cleanupOldAlerts()
  }
  
  /**
   * Trigger an alert
   */
  private async triggerAlert(rule: AlertRule, status: HealthStatus): Promise<void> {
    // Check cooldown
    const lastAlert = this.lastAlertTime.get(rule.name)
    if (lastAlert && Date.now() - lastAlert.getTime() < this.config.cooldownPeriod) {
      console.log(`Alert ${rule.name} is in cooldown period`)
      return
    }
    
    // Check rate limit
    const hourlyCount = this.getHourlyAlertCount()
    if (hourlyCount >= this.config.maxAlertsPerHour) {
      console.log('Alert rate limit exceeded')
      return
    }
    
    // Create alert
    const alert: Alert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      severity: rule.severity,
      title: rule.name,
      message: rule.message,
      details: this.extractAlertDetails(status),
      status,
      acknowledged: false
    }
    
    // Store alert
    this.alerts.push(alert)
    this.lastAlertTime.set(rule.name, new Date())
    this.incrementAlertCount()
    
    // Send to channels
    await this.sendAlert(alert, rule.channels)
    
    // Emit event
    this.emit('alert:triggered', alert)
    
    console.log(`Alert, triggered: ${rule.name} (${rule.severity})`)
  }
  
  /**
   * Send alert to specified channels
   */
  private async sendAlert(alert: Alert, channelTypes: string[]): Promise<void> {
    const channels = this.config.channels.filter(
      ch => ch.enabled && channelTypes.includes(ch.type)
    )
    
    for (const channel of channels) {
      try {
        await this.sendToChannel(alert, channel)
      } catch (error) {
        console.error(`Failed to send alert to ${channel.type}:`, error)
      }
    }
  }
  
  /**
   * Send alert to a specific channel
   */
  private async sendToChannel(alert: Alert, channel: AlertChannel): Promise<void> {
    switch (channel.type) {
      case 'console':
        this.sendToConsole(alert)
        break
        
      case 'email':
        await this.sendEmail(alert, channel.config)
        break
        
      case 'slack':
        await this.sendToSlack(alert, channel.config)
        break
        
      case 'webhook':
        await this.sendToWebhook(alert, channel.config)
        break
    }
  }
  
  /**
   * Console alert handler
   */
  private sendToConsole(alert: Alert): void {
    const severityEmoji = {
      low: '📌',
      medium: '⚠️',
      high: '🚨',
      critical: '🔥'
    }
    
    console.log('\n' + '='.repeat(60))
    console.log(`${severityEmoji[alert.severity]} HEALTH, ALERT: ${alert.title}`)
    console.log('='.repeat(60))
    console.log(`Severity: ${alert.severity.toUpperCase()}`)
    console.log(`Time: ${alert.timestamp.toISOString()}`)
    console.log(`Message: ${alert.message}`)
    console.log('Details:', JSON.stringify(alert.details, null, 2))
    console.log('='.repeat(60) + '\n')
  }
  
  /**
   * Email alert handler
   */
  private async sendEmail(alert: Alert, config): Promise<void> {
    // Implementation would depend on email service
    // Example with SendGrid, Resend, etc.
    console.log('Email alert would be sent to:', config.recipients)
  }
  
  /**
   * Slack alert handler
   */
  private async sendToSlack(alert: Alert, config): Promise<void> {
    if (!config.webhookUrl) {
      throw new Error('Slack webhook URL not configured')
    }
    
    const color = {
      low: '#36a64f',
      medium: '#ff9900',
      high: '#ff0000',
      critical: '#990000'
    }[alert.severity]
    
    const payload = {
      attachments: [{
        color,
        title: alert.title,
        text: alert.message,
        fields: [
          {
            title: 'Severity',
            value: alert.severity.toUpperCase(),
            short: true
          },
          {
            title: 'Time',
            value: alert.timestamp.toLocaleString(),
            short: true
          },
          {
            title: 'System Status',
            value: alert.status.status.toUpperCase(),
            short: true
          },
          {
            title: 'Failed Checks',
            value: alert.status.checks
              .filter(c => c.status !== 'healthy')
              .map(c => c.name)
              .join(', ') || 'None',
            short: false
          }
        ],
        footer: 'AI Guided SaaS Health Monitor',
        ts: Math.floor(alert.timestamp.getTime() / 1000)
      }]
    }
    
    await fetch(config.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  }
  
  /**
   * Generic webhook handler
   */
  private async sendToWebhook(alert: Alert, config): Promise<void> {
    if (!config.url) {
      throw new Error('Webhook URL not configured')
    }
    
    await fetch(config.url, {
      method: config.method || 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(config.headers || {})
      },
      body: JSON.stringify({
        alert,
        timestamp: alert.timestamp.toISOString(),
        source: 'ai-guided-saas-health-monitor'
      })
    })
  }
  
  /**
   * Extract relevant details from health status
   */
  private extractAlertDetails(status: HealthStatus): any {
    return {
      failedChecks: status.checks
        .filter(c => c.status === 'unhealthy')
        .map(c => ({ name: c.name, error: c.error })),
      degradedChecks: status.checks
        .filter(c => c.status === 'degraded')
        .map(c => ({ name: c.name, error: c.error })),
      systemMetrics: {
        cpu: `${status.metrics.cpu.usage.toFixed(1)}%`,
        memory: `${status.metrics.memory.percentage.toFixed(1)}%`,
        uptime: `${Math.floor(status.metrics.uptime / 3600)}h`
      }
    }
  }
  
  /**
   * Get default alert rules
   */
  private getDefaultRules(): AlertRule[] {
    return [
      {
        name: 'System Unhealthy',
        condition: (status) => status.status === 'unhealthy',
        severity: 'critical',
        message: 'System health check failed - immediate attention required',
        channels: ['console', 'email', 'slack']
      },
      {
        name: 'System Degraded',
        condition: (status) => status.status === 'degraded',
        severity: 'medium',
        message: 'System performance is degraded',
        channels: ['console', 'slack']
      },
      {
        name: 'High CPU Usage',
        condition: (status) => status.metrics.cpu.usage > 90,
        severity: 'high',
        message: 'CPU usage is critically high',
        channels: ['console', 'slack']
      },
      {
        name: 'High Memory Usage',
        condition: (status) => status.metrics.memory.percentage > 90,
        severity: 'high',
        message: 'Memory usage is critically high',
        channels: ['console', 'slack']
      },
      {
        name: 'Database Unhealthy',
        condition: (status) => 
          status.checks.some(c => c.name === 'database' && c.status === 'unhealthy'),
        severity: 'critical',
        message: 'Database connection failed',
        channels: ['console', 'email', 'slack']
      },
      {
        name: 'Multiple Services Degraded',
        condition: (status) => 
          status.checks.filter(c => c.status !== 'healthy').length >= 3,
        severity: 'high',
        message: 'Multiple services are experiencing issues',
        channels: ['console', 'email', 'slack']
      }
    ]
  }
  
  /**
   * Get hourly alert count
   */
  private getHourlyAlertCount(): number {
    const oneHourAgo = Date.now() - 60 * 60 * 1000
    return this.alerts.filter(a => a.timestamp.getTime() > oneHourAgo).length
  }
  
  /**
   * Increment alert count
   */
  private incrementAlertCount(): void {
    const hour = new Date().getHours()
    const count = this.alertCounts.get(hour.toString()) || 0
    this.alertCounts.set(hour.toString(), count + 1)
  }
  
  /**
   * Clean up old alerts
   */
  private cleanupOldAlerts(): void {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000
    this.alerts = this.alerts.filter(a => a.timestamp.getTime() > oneDayAgo)
  }
  
  /**
   * Get recent alerts
   */
  getRecentAlerts(limit: number = 10): Alert[] {
    return this.alerts
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit)
  }
  
  /**
   * Acknowledge an alert
   */
  acknowledgeAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId)
    if (alert) {
      alert.acknowledged = true
      this.emit('alert:acknowledged', alert)
      return true
    }
    return false
  }
  
  /**
   * Update configuration
   */
  updateConfig(config: Partial<AlertConfig>): void {
    this.config = { ...this.config, ...config }
    console.log('Alert configuration updated')
  }
  
  /**
   * Add custom alert rule
   */
  addRule(rule: AlertRule): void {
    this.config.rules.push(rule)
    console.log(`Added alert, rule: ${rule.name}`)
  }
  
  /**
   * Remove alert rule
   */
  removeRule(ruleName: string): void {
    this.config.rules = this.config.rules.filter(r => r.name !== ruleName)
    console.log(`Removed alert, rule: ${ruleName}`)
  }
}