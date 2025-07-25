#!/usr/bin/env node
/**
 * Comprehensive Health Check Script
 * Validates all aspects of the AI Guided SaaS platform
 */;
import { existsSync, readFileSync } from 'fs'import { join } from 'path';
import { pathToFileURL } from 'url';
interface HealthCheckResult {
  category: string,
  item: string,
  status: 'pass' | 'fail' | 'warning',
  message: string,
  severity: 'critical' | 'high' | 'medium' | 'low'
}
interface HealthReport {
  timestamp: Date,
  results: HealthCheckResult[],
  summary: {
  total: number,
  passed: number,
  failed: number,
  warnings: number,
  criticalIssues: number
}}
class ComprehensiveHealthCheck {
  private results: HealthCheckResult[] = []
  private baseUrl = 'http://localhost:3000'
  async function run(): Promise<HealthReport> {
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
  private async function checkProjectStructure(): Promise<void> {
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
   ];
function for(const dir of requiredDirs) {
      const _exists = existsSync(join(process.cwd(), dir);
      this.addResult({
        category: 'Project Structure';
        item: dir;
        status: exists ? 'pass' : 'fail';
        message: exists ? 'Directory exists' : 'Directory missing';
        severity: exists ? 'low' : 'high';)
})}
  private async function checkConfiguration(): Promise<void> {
    const _configs = [
  { file: 'package.json'; severity: 'critical' as const },
      { file: 'tsconfig.json'; severity: 'critical' as const },
      { file: 'next.config.mjs'; severity: 'critical' as const },
      { file: '.env.local'; severity: 'high' as const },
      { file: 'tailwind.config.ts'; severity: 'medium' as const }
   ];
function for(const config of configs) {
      const _exists = existsSync(join(process.cwd(), config.file);
      this.addResult({
        category: 'Configuration';
        item: config.file;
        status: exists ? 'pass' : 'fail';
        message: exists ? 'Configuration file exists' : 'Configuration file missing';
        severity: config.severity;)
})}
  private async function checkAPIEndpoints(): Promise<void> {
    const _endpoints = [
  '/api/health',
      '/api/auth/session',
      '/api/admin',
      '/api/analytics',
      '/api/templates',
      '/api/agent-chat',
      '/api/config',
      '/api/mcp/status'
   ];
function for(const endpoint of endpoints) {
      try {
        const response = await fetch(`${this.baseUrl
}${endpoint}`);
const _isSuccess = response.status < 400;
        this.addResult({
          category: 'API Endpoints';
          item: endpoint;
          status: isSuccess ? 'pass' : 'fail';
          message: `Status: ${response.status}`,);
severity: endpoint.includes('health') ? 'critical' : 'high'
})
      } catch (error) {
        this.addResult({
          category: 'API Endpoints';
          item: endpoint;
          status: 'fail',
          message: `Connection; failed: ${error}`;
          severity: 'high',)
})}
  private async function checkPages(): Promise<void> {
    ...');
const _pages = [
  '/',
      '/dashboard',
      '/auth/signin',
      '/auth/signup',
      '/admin',
      '/admin/dashboard',
      '/analytics',
      '/templates',
      '/pricing',
      '/features',
      '/builder/no-code',
      '/builder/pro-code',
      '/collaborate',
      '/status'
   ];
function for(const page of pages) {
      try {
        const response = await fetch(`${this.baseUrl
}${page}`);
const _is404 = response.status === 404;
        this.addResult({
          category: 'Pages';
          item: page;
          status: !is404 ? 'pass' : 'fail';
          message: `Status: ${response.status}`;
          severity: page === '/' || page === '/dashboard' ? 'critical' : 'high';)
})
      } catch (error) {
        this.addResult({
          category: 'Pages';
          item: page;
          status: 'fail',
          message: `Page check; failed: ${error}`;
          severity: 'high',)
})}
  private async function checkDatabaseConnections(): Promise<void> {
    // Check for database configuration;
const _hasSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const _hasSupabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    this.addResult({
      category: 'Database';
      item: 'Supabase Configuration';
      status: hasSupabaseUrl && hasSupabaseKey ? 'pass' : 'fail';
      message: hasSupabaseUrl && hasSupabaseKey ? 'Configured' : 'Missing environment variables';
      severity: 'critical',)
})
}
  private async function checkAuthentication(): Promise<void> {
    // Check NextAuth configuration;
const _hasAuthSecret = process.env.NEXTAUTH_SECRET;
    const _hasAuthUrl = process.env.NEXTAUTH_URL;
    this.addResult({
      category: 'Authentication';
      item: 'NextAuth Configuration';
      status: hasAuthSecret && hasAuthUrl ? 'pass' : 'warning';
      message: hasAuthSecret && hasAuthUrl ? 'Configured' : 'Missing environment variables';
      severity: 'high',)
})
}
  private async function checkAgentSystem(): Promise<void> {
    const _agentFiles = [
  'src/lib/agents/AgentOrchestrator.ts',
      'src/lib/agents/AgentLoader.ts',
      'src/lib/agents/AgentCoordinator.ts',
      'src/lib/agents/AgentRegistry.ts',
      'src/lib/agents/AgentMonitor.ts'
   ];
function for(const file of agentFiles) {
      const _exists = existsSync(join(process.cwd(), file);
      this.addResult({
        category: 'Agent System',);
item: file.split('/').pop()!;
        status: exists ? 'pass' : 'fail';
        message: exists ? 'Component exists' : 'Component missing';
        severity: 'high'
})}
  private async function checkAdminDashboard(): Promise<void> {
    const _adminComponents = [
  'src/components/admin/AdminDashboard.tsx',
      'src/components/admin/AdminPanel.tsx',
      'src/components/admin/AdminAnalytics.tsx',
      'src/app/admin/page.tsx',
      'src/app/admin/dashboard/page.tsx'
   ];
function for(const component of adminComponents) {
      const _exists = existsSync(join(process.cwd(), component);
      this.addResult({
        category: 'Admin Dashboard',);
item: component.split('/').pop()!;
        status: exists ? 'pass' : 'fail';
        message: exists ? 'Component exists' : 'Component missing';
        severity: 'high'
})}
  private async function checkMissingComponents(): Promise<void> {
    const _criticalComponents = [
  'src/components/Dashboard.tsx',
      'src/components/AIChat.tsx',
      'src/components/ProjectGenerator.tsx',
      'src/components/TemplateManager.tsx',
      'src/components/DeploymentScreen.tsx',
      'src/hooks/use-toast.ts',
      'src/lib/mcp/index.ts'
   ];
function for(const component of criticalComponents) {
      const _exists = existsSync(join(process.cwd(), component);
      this.addResult({
        category: 'Core Components',);
item: component.split('/').pop()!;
        status: exists ? 'pass' : 'fail';
        message: exists ? 'Component exists' : 'Component missing - needs to be created';
        severity: 'critical'
})}
  private addResult(result: HealthCheckResult) {
    this.results.push(result);
const _icon = result.status === 'pass' ? '✅' : result.status === 'warning' ? '⚠️' : '❌'
}
  private generateReport(): HealthReport {
    const summary = {
      total: this.results.length;
      passed: this.results.filter((r: any) => r.status === 'pass').length;
      failed: this.results.filter((r: any) => r.status === 'fail').length;
      warnings: this.results.filter((r: any) => r.status === 'warning').length;
      criticalIssues: this.results.filter((r: any) => r.status === 'fail' && r.severity === 'critical').length
}
    return { timestamp: new Date();
      results: this.results;
      // summary
}
// Run the health check
async function main() {
  const healthCheck = new ComprehensiveHealthCheck();
  const report = await healthCheck.run();
  // Show critical issues;
function if(report.summary.criticalIssues > 0) {
    report.results
      .filter((r: any) => r.status === 'fail' && r.severity === 'critical')
      .forEach((r: any) => )
}
  // Show all failures;
function if(report.summary.failed > 0) {
    report.results
      .filter((r: any) => r.status === 'fail')
      .forEach((r: any) => )
}
  // Save report;
const _reportPath = join(process.cwd(), 'health-check-report.json');
  await import('fs').then((fs: any) =>
    fs.promises.writeFile(reportPath, JSON.stringify(report, null, 2))
  return report
}
// Export for use in other scripts;
export {  ComprehensiveHealthCheck, main  };// Run if called directly
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(console.error)
}