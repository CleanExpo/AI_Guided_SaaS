#!/usr/bin/env node

/**
 * Comprehensive Health Check Script
 * Validates all aspects of the AI Guided SaaS platform
 */

const { existsSync, readFileSync, writeFileSync } = require('fs')
const { join } = require('path')

class ComprehensiveHealthCheck {
  constructor() {
    this.results = []
    this.baseUrl = 'http://localhost:3004'
}
  async run() {
    console.log('🏥 Starting Comprehensive Health Check...\n')
    
    // 1. Check project structure
    await this.checkProjectStructure()
    
    // 2. Check configuration files
    await this.checkConfiguration()
    
    // 3. Check API endpoints
    await this.checkAPIEndpoints()
    
    // 4. Check pages (no 404s)
    await this.checkPages()
    
    // 5. Check database connections
    await this.checkDatabaseConnections()
    
    // 6. Check authentication
    await this.checkAuthentication()
    
    // 7. Check AI/Agent system
    await this.checkAgentSystem()
    
    // 8. Check admin dashboard
    await this.checkAdminDashboard()
    
    // 9. Check missing components
    await this.checkMissingComponents()
    
    // 10. Generate report
    return this.generateReport()
}
  async checkProjectStructure() {
    console.log('📁 Checking Project Structure...')
    
    const _requiredDirs = [
      'src/app',
      'src/components',
      'src/lib',
      'src/hooks',
      'src/types',
      'src/utils',
      'public',
      'agents',
      'docs'
    ]
    
    for (const dir of requiredDirs) {
      const _exists = existsSync(join(process.cwd(), dir))
      this.addResult({
        category: 'Project Structure',
        item: dir,
        status: exists ? 'pass' : 'fail',
        message: exists ? 'Directory exists' : 'Directory missing',
        severity: exists ? 'low' : 'high'
      })
}
}
  async checkConfiguration() {
    console.log('⚙️ Checking Configuration Files...')
    
    const _configs = [
      { file: 'package.json', severity: 'critical' },
      { file: 'tsconfig.json', severity: 'critical' },
      { file: 'next.config.mjs', severity: 'critical' },
      { file: '.env.local', severity: 'high' },
      { file: 'tailwind.config.ts', severity: 'medium' }
    ]
    
    for (const config of configs) {
      const _exists = existsSync(join(process.cwd(), config.file))
      this.addResult({
        category: 'Configuration',
        item: config.file,
        status: exists ? 'pass' : 'fail',
        message: exists ? 'Configuration file exists' : 'Configuration file missing',
        severity: config.severity
      })
}
}
  async checkAPIEndpoints() {
    console.log('🔌 Checking API Endpoints...')
    
    const _endpoints = [
      '/api/health',
      '/api/auth/session',
      '/api/admin',
      '/api/analytics',
      '/api/templates',
      '/api/agent-chat',
      '/api/config',
      '/api/mcp/status'
    ]
    
    for (const endpoint of endpoints) {
      try {
        const _fetch = require('node-fetch')
        const response = await fetch(`${this.baseUrl}${endpoint}`)
        const _isSuccess = response.status < 400
        
        this.addResult({
          category: 'API Endpoints',
          item: endpoint,
          status: isSuccess ? 'pass' : 'fail',
          message: `Status: ${response.status}`,
          severity: endpoint.includes('health') ? 'critical' : 'high'
        })
      } catch (error) {
        // If fetch is not available, check if route file exists
        const _routePath = join(process.cwd(), 'src', 'app', endpoint, 'route.ts')
        const _exists = existsSync(routePath)
        
        this.addResult({
          category: 'API Endpoints',
          item: endpoint,
          status: exists ? 'warning' : 'fail',
          message: exists ? 'Route file exists (server not running)' : 'Route file missing',
          severity: 'high'
        })
}
}
}
  async checkPages() {
    console.log('📄 Checking Pages (No 404s)...')
    
    const _pages = [
      { path: '/', file: 'src/app/page.tsx' },
      { path: '/dashboard', file: 'src/app/dashboard/page.tsx' },
      { path: '/auth/signin', file: 'src/app/auth/signin/page.tsx' },
      { path: '/auth/signup', file: 'src/app/auth/signup/page.tsx' },
      { path: '/admin', file: 'src/app/admin/page.tsx' },
      { path: '/admin/dashboard', file: 'src/app/admin/dashboard/page.tsx' },
      { path: '/analytics', file: 'src/app/analytics/page.tsx' },
      { path: '/templates', file: 'src/app/templates/page.tsx' },
      { path: '/pricing', file: 'src/app/pricing/page.tsx' },
      { path: '/features', file: 'src/app/features/page.tsx' },
      { path: '/builder/no-code', file: 'src/app/builder/no-code/page.tsx' },
      { path: '/builder/pro-code', file: 'src/app/builder/pro-code/page.tsx' },
      { path: '/collaborate', file: 'src/app/collaborate/page.tsx' },
      { path: '/status', file: 'src/app/status/page.tsx' }
    ]
    
    for (const page of pages) {
      const _exists = existsSync(join(process.cwd(), page.file))
      
      this.addResult({
        category: 'Pages',
        item: page.path,
        status: exists ? 'pass' : 'fail',
        message: exists ? 'Page file exists' : 'Page file missing - will cause 404',
        severity: page.path === '/' || page.path === '/dashboard' ? 'critical' : 'high'
      })
}
}
  async checkDatabaseConnections() {
    console.log('🗄️ Checking Database Connections...')
    
    // Read .env.local if it exists
    let envVars = {}
    const _envPath = join(process.cwd(), '.env.local')
    if (existsSync(envPath)) {
      const envContent = readFileSync(envPath, 'utf-8')
      envContent.split('\n').forEach(line => {
        const [key, value] = line.split('=')
        if (key && value) {
          envVars[key.trim()] = value.trim()
}
      })
}
    const _hasSupabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL || envVars.SUPABASE_URL
    const _hasSupabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY || envVars.SUPABASE_ANON_KEY
    
    this.addResult({
      category: 'Database',
      item: 'Supabase Configuration',
      status: hasSupabaseUrl && hasSupabaseKey ? 'pass' : 'fail',
      message: hasSupabaseUrl && hasSupabaseKey ? 'Configured' : 'Missing environment variables',
      severity: 'critical'
    })
}
  async checkAuthentication() {
    console.log('🔐 Checking Authentication...')
    
    // Check for auth files
    const _authFiles = [
      'src/app/api/auth/[...nextauth]/route.ts',
      'src/lib/auth.ts',
      'src/middleware.ts'
    ]
    
    for (const file of authFiles) {
      const _exists = existsSync(join(process.cwd(), file))
      this.addResult({
        category: 'Authentication',
        item: file.split('/').pop(),
        status: exists ? 'pass' : 'fail',
        message: exists ? 'Auth file exists' : 'Auth file missing',
        severity: 'high'
      })
}
}
  async checkAgentSystem() {
    console.log('🤖 Checking Agent System...')
    
    const _agentFiles = [
      'src/lib/agents/AgentOrchestrator.ts',
      'src/lib/agents/AgentLoader.ts',
      'src/lib/agents/AgentCoordinator.ts',
      'src/lib/agents/AgentRegistry.ts',
      'src/lib/agents/AgentMonitor.ts',
      'src/lib/agents/AgentCommunication.ts'
    ]
    
    for (const file of agentFiles) {
      const _exists = existsSync(join(process.cwd(), file))
      this.addResult({
        category: 'Agent System',
        item: file.split('/').pop(),
        status: exists ? 'pass' : 'fail',
        message: exists ? 'Component exists' : 'Component missing',
        severity: 'high'
      })
}
}
  async checkAdminDashboard() {
    console.log('👨‍💼 Checking Admin Dashboard...')
    
    const _adminComponents = [
      'src/components/admin/AdminDashboard.tsx',
      'src/components/admin/AdminPanel.tsx',
      'src/components/admin/AdminAnalytics.tsx',
      'src/app/admin/page.tsx',
      'src/app/admin/dashboard/page.tsx'
    ]
    
    for (const component of adminComponents) {
      const _exists = existsSync(join(process.cwd(), component))
      this.addResult({
        category: 'Admin Dashboard',
        item: component.split('/').pop(),
        status: exists ? 'pass' : 'fail',
        message: exists ? 'Component exists' : 'Component missing',
        severity: 'high'
      })
}
}
  async checkMissingComponents() {
    console.log('🔍 Checking for Missing Components...')
    
    const _criticalComponents = [
      'src/components/Dashboard.tsx',
      'src/components/AIChat.tsx',
      'src/components/ProjectGenerator.tsx',
      'src/components/TemplateManager.tsx',
      'src/components/DeploymentScreen.tsx',
      'src/hooks/use-toast.ts',
      'src/lib/mcp/index.ts'
    ]
    
    for (const component of criticalComponents) {
      const _exists = existsSync(join(process.cwd(), component))
      this.addResult({
        category: 'Core Components',
        item: component.split('/').pop(),
        status: exists ? 'pass' : 'fail',
        message: exists ? 'Component exists' : 'Component missing - needs to be created',
        severity: 'critical'
      })
}
}
  addResult(result) {
    this.results.push(result)
    
    const _icon = result.status === 'pass' ? '✅' : result.status === 'warning' ? '⚠️' : '❌'
    console.log(`${icon} ${result.item}: ${result.message}`)
}
  generateReport() {
    const summary = {
      total: this.results.length,
      passed: this.results.filter(r => r.status === 'pass').length,
      failed: this.results.filter(r => r.status === 'fail').length,
      warnings: this.results.filter(r => r.status === 'warning').length,
      criticalIssues: this.results.filter(r => r.status === 'fail' && r.severity === 'critical').length
}
    return { timestamp: new Date(),
      results: this.results,
      // summary
}
// Run the health check
async function main() {
  const healthCheck = new ComprehensiveHealthCheck()
  const report = await healthCheck.run()
  
  console.log('\n📊 Health Check Summary')
  console.log('======================')
  console.log(`Total Checks: ${report.summary.total}`)
  console.log(`✅ Passed: ${report.summary.passed}`)
  console.log(`❌ Failed: ${report.summary.failed}`)
  console.log(`⚠️ Warnings: ${report.summary.warnings}`)
  console.log(`🚨 Critical Issues: ${report.summary.criticalIssues}`)
  
  // Show critical issues
  if (report.summary.criticalIssues > 0) {
    console.log('\n🚨 Critical Issues:')
    report.results
      .filter(r => r.status === 'fail' && r.severity === 'critical')
      .forEach(r => console.log(`- ${r.category}: ${r.item} - ${r.message}`))
}
  // Show all failures
  if (report.summary.failed > 0) {
    console.log('\n❌ All Failed Checks:')
    report.results
      .filter(r => r.status === 'fail')
      .forEach(r => console.log(`- ${r.category}: ${r.item} - ${r.message}`))
}
  // Save report
  const _reportPath = join(process.cwd(), 'health-check-report.json')
  writeFileSync(reportPath, JSON.stringify(report, null, 2))
  
  console.log(`\n📄 Full report saved to: ${reportPath}`)
  
  return report
}
// Export for use in other scripts
module.exports = { ComprehensiveHealthCheck, main }

// Run if called directly
if (require.main === module) {
  main().catch(console.error)
}