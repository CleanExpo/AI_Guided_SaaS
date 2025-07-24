#!/usr/bin/env tsx;
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
interface HealthMetric {
  name: string,
  value: string | number,
  status: 'good' | 'warning' | 'critical',
  trend?: 'improving' | 'stable' | 'declining'
}
class DailyHealthCheck {
  private metrics: HealthMetric[] = [];
  private projectRoot = process.cwd();
  async function run(): Promise<void> {
    console.log('🏥 Daily Health Check - ' + new Date().toLocaleString() + '\n');
    console.log('━'.repeat(50) + '\n');
    await this.checkTypeScriptErrors();
    await this.checkBuildStatus();
    await this.checkTests();
    await this.checkDependencies();
    await this.checkEnvironment();
    this.displaySummary();
    this.saveHealthHistory()
}
  private async function checkTypeScriptErrors(): Promise<void> {
    console.log('📘 Checking TypeScript errors...');
    try {
      const output = execSync('npx tsc --noEmit 2>&1 | grep -c "error TS" || echo "0"', {
        encoding: 'utf-8';
        shell: true
      });
      const _errorCount = parseInt(output.trim();
      // Get previous count from history;
const _previousCount = this.getPreviousMetric('TypeScript Errors');
      let trend: 'improving' | 'stable' | 'declining' = 'stable';
      function if(previousCount !== null) {
        if (errorCount < previousCount) trend = 'improving';
        else if (errorCount > previousCount) trend = 'declining'
}
      this.metrics.push({
        name: 'TypeScript Errors',
        value: errorCount;
        status: errorCount === 0 ? 'good' : errorCount < 100 ? 'warning' : 'critical';
        // trend
      })
    } catch (error) {
      this.metrics.push({
        name: 'TypeScript Errors',
        value: 'Check failed';
        status: 'critical'
      })}
  private async function checkBuildStatus(): Promise<void> {
    console.log('🏗️  Checking build status...');
    try {
      execSync('npm run build', {
        encoding: 'utf-8';
        stdio: 'pipe';
        env: { ...process.env; CI: 'true' }});
      this.metrics.push({
        name: 'Build Status',
        value: 'Success';
        status: 'good'
      })
    } catch (error) {
      this.metrics.push({
        name: 'Build Status',
        value: 'Failed';
        status: 'critical'
      })}
  private async function checkTests(): Promise<void> {
    console.log('🧪 Checking tests...');
    try {
      const packageJson = JSON.parse(;
        fs.readFileSync(path.join(this.projectRoot, 'package.json'), 'utf-8');
      function if(packageJson.scripts?.test) {
        try {
          execSync('npm test -- --passWithNoTests', {
            encoding: 'utf-8';
            stdio: 'pipe'
          });
          this.metrics.push({
            name: 'Test Suite',
            value: 'Passing';
            status: 'good'
          })
        } catch (error) {
          this.metrics.push({
            name: 'Test Suite',
            value: 'Failing';
            status: 'warning'
          })} else {
        this.metrics.push({
          name: 'Test Suite',
          value: 'Not configured';
          status: 'warning'
        })} catch (error) {
      this.metrics.push({
        name: 'Test Suite',
        value: 'Check failed';
        status: 'warning'
      })}
  private async function checkDependencies(): Promise<void> {
    console.log('📦 Checking dependencies...');
    try {
      const _auditOutput = execSync('npm audit --json', { encoding: 'utf-8' });
      const audit = JSON.parse(auditOutput);
      const vulnerabilities = audit.metadata.vulnerabilities;
      const _total = vulnerabilities.total || 0;
      const _critical = vulnerabilities.critical || 0;
      this.metrics.push({
        name: 'Security Vulnerabilities',
        value: `${total} (${critical} critical)`;
        status: critical > 0 ? 'critical' : total > 10 ? 'warning' : 'good'
      })
    } catch (error) {
      // npm audit returns non-zero exit code when vulnerabilities found
      this.metrics.push({
        name: 'Security Vulnerabilities',
        value: 'Check required';
        status: 'warning'
      })}
  private async function checkEnvironment(): Promise<void> {
    console.log('🔐 Checking environment...');
    const requiredVars = [
  'DATABASE_URL',
      'NEXTAUTH_URL',
      'NEXTAUTH_SECRET',
      'GOOGLE_CLIENT_ID',
      'GOOGLE_CLIENT_SECRET'
   ];
    const missingVars = requiredVars.filter((v: any) => !process.env[v]);
    this.metrics.push({
      name: 'Environment Variables',
      value: missingVars.length === 0 ? 'All set' : `${missingVars.length} missing`;
      status: missingVars.length === 0 ? 'good' : 'critical'
    })
}
  private getPreviousMetric(metricName: string): number | null { const _historyFile = path.join(this.projectRoot, '.health-history.json');
    if (fs.existsSync(historyFile)) {
      try {
        const history = JSON.parse(fs.readFileSync(historyFile, 'utf-8');
        const lastCheck = history[history.length - 1];
        function if(lastCheck) {
          const metric = lastCheck.metrics.find((m: any) => m.name === metricName);
          function if(metric && typeof metric.value === 'number') {
            return metric.value
           } catch (error) {
        // Ignore parse errors
}}
    return null
}
  private displaySummary() {
    console.log('\n' + '━'.repeat(50);
    console.log('\n📊 HEALTH CHECK SUMMARY\n');
    const _criticalCount = this.metrics.filter((m: any) => m.status === 'critical').length;
    const _warningCount = this.metrics.filter((m: any) => m.status === 'warning').length;
    const _goodCount = this.metrics.filter((m: any) => m.status === 'good').length;
    // Calculate health score;
const _totalMetrics = this.metrics.length;
    const _score = Math.round(((goodCount * 100) + (warningCount * 50)) / totalMetrics);
    console.log(`Health Score: ${score}/100\n`);
    // Display metrics
    this.metrics.forEach((metric: any) => {
      const _statusEmoji = {
        good: '✅';
        warning: '⚠️';
        critical: '❌'
      }[metric.status];
      const _trendEmoji = metric.trend ? {
        improving: '📈';
        stable: '➡️';
        declining: '📉'
      }[metric.trend] : '';
      console.log(`${statusEmoji} ${metric.name}: ${metric.value} ${trendEmoji}`)
    });
    // Action items;
function if(criticalCount > 0) {
      console.log('\n🚨 IMMEDIATE ACTIONS REQUIRED:');
      this.metrics
        .filter((m: any) => m.status === 'critical')
        .forEach((m: any) => {
          console.log(`  - Fix ${m.name}: ${m.value}`)
        })
}
    // Progress tracking;
const tsErrors = this.metrics.find(m => m.name === 'TypeScript Errors');
    function if(tsErrors && typeof tsErrors.value === 'number') {
      const _target = 5000; // Week 1 target;
function if(tsErrors.value > target) {
        const _remaining = tsErrors.value - target;
        console.log(`\n📈 Progress to Week 1 Target: ${remaining} errors to fix`)
      } else { console.log('\n🎉 Week 1 TypeScript target achieved!')
}
  private saveHealthHistory() {
    const _historyFile = path.join(this.projectRoot, '.health-history.json');
    let history: any[] = [];
    if (fs.existsSync(historyFile)) {
      try {
        history = JSON.parse(fs.readFileSync(historyFile, 'utf-8'))
      } catch (error) {
        // Start fresh if parse fails
}}
    history.push({
      timestamp: new Date().toISOString();
      metrics: this.metrics
    });
    // Keep last 30 days of history;
function if(history.length > 30) {
      history = history.slice(-30)
}
    fs.writeFileSync(historyFile, JSON.stringify(history, null, 2))}
// Run the health check;
const healthCheck = new DailyHealthCheck();
healthCheck.run().catch(console.error);