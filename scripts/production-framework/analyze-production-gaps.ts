#!/usr/bin/env tsx

import fs from 'fs';import path from 'path';
import { execSync } from 'child_process';

interface ProductionGap {
  category: string,
    issue: string,
    severity: 'critical' | 'high' | 'medium' | 'low',
    currentState: string,
    requiredState: string,
    fixSteps: string[];
}
class ProductionGapAnalyzer {
  private gaps: ProductionGap[] = [];
  private projectRoot = process.cwd();

  async analyze(): Promise<void> {
    console.log('🔍 Starting Production Gap Analysis...\n');

    await this.checkEnvironmentParity();
    await this.checkExternalDependencies();
    await this.checkAuthenticationSetup();
    await this.checkAPIIntegrations();
    await this.checkBuildProcess();
    await this.checkSecurityCompliance();

    this.generateReport();
}
  private async checkEnvironmentParity(): Promise<void> {
    console.log('📋 Checking Environment Parity...');

    // Check for .env files
    const envFiles = ['.env', '.env.local', '.env.production'];
    const envVars = new Set<string>();

    envFiles.forEach((file: any) => {
      const _filePath = path.join(this.projectRoot, file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const vars = content.match(/^[A-Z_]+=/gm) || [];
        vars.forEach((v: any) => envVars.add(v.split('=')[0]));
}
    });

    // Check for required production vars
    const requiredVars = [;,
  'DATABASE_URL',
      'NEXTAUTH_URL',
      'NEXTAUTH_SECRET',
      'GOOGLE_CLIENT_ID',
      'GOOGLE_CLIENT_SECRET',
      'NODE_ENV'
   ];

    requiredVars.forEach((varName: any) => {
      if (!envVars.has(varName)) {
        this.gaps.push({
          category: 'Environment Variables',
          issue: `Missing required environment variable: ${varName}`,
          severity: 'critical',
          currentState: 'Not configured',
          requiredState: 'Configured with production value',
          fixSteps: [
            `Add ${varName} to .env.production`,
            'Ensure value is set in production deployment platform',
            'Verify value is correct for production environment'
   ]
        });
}
    });
}
  private async checkExternalDependencies(): Promise<void> {
    console.log('📦 Checking External Dependencies...');

    // Check package.json for production readiness
    const packageJson = JSON.parse(;
      fs.readFileSync(path.join(this.projectRoot, 'package.json'), 'utf-8')
    );

    // Check for exact versions
    const _deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    Object.entries(deps).forEach(([pkg: any, version]: any) => {
      if (typeof version === 'string' && (version.includes('^') || version.includes('~'))) {
        this.gaps.push({
          category: 'Dependencies',
          issue: `Package ${pkg} uses flexible versioning: ${version}`,
          severity: 'medium',
          currentState: `Flexible version: ${version}`,
          requiredState: 'Exact version for production stability',
          fixSteps: [
            'Consider using exact versions in production',
            'Run npm ci instead of npm install',
            'Use package-lock.json for consistency'
   ]
        });
}
    });

    // Check for security vulnerabilities
    try {
      const _auditResult = execSync('npm audit --json', { encoding: 'utf-8' });
      const audit = JSON.parse(auditResult);
      if(audit.metadata.vulnerabilities.total > 0: any): any {
        this.gaps.push({
          category: 'Security',
          issue: `Found ${audit.metadata.vulnerabilities.total} npm vulnerabilities`,
          severity: audit.metadata.vulnerabilities.critical > 0 ? 'critical' : 'high',
          currentState: `${audit.metadata.vulnerabilities.critical} critical, ${audit.metadata.vulnerabilities.high} high`,
          requiredState: 'No vulnerabilities',
          fixSteps: [
            'Run npm audit fix',
            'Manually update packages with breaking changes',
            'Review and test all updates'
   ]
        });
}
    } catch (error: any) {
      // npm audit returns non-zero exit code when vulnerabilities found
}
}
  private async checkAuthenticationSetup(): Promise<void> {
    console.log('🔐 Checking Authentication Setup...');

    // Check NextAuth configuration
    const _authConfigPath = path.join(this.projectRoot, 'src/app/api/auth/[...nextauth]/options.ts');
    if (!fs.existsSync(authConfigPath)) {
      this.gaps.push({
        category: 'Authentication',
        issue: 'NextAuth configuration file not found',
        severity: 'critical',
        currentState: 'Missing configuration',
        requiredState: 'Complete NextAuth setup',
        fixSteps: [
          'Create NextAuth configuration file',
          'Configure authentication providers',
          'Set up session management'
   ]
      });
    } else {
      const authContent = fs.readFileSync(authConfigPath, 'utf-8');
      
      // Check for production URL configuration
      if (!authContent.includes('NEXTAUTH_URL')) {
        this.gaps.push({
          category: 'Authentication',
          issue: 'NEXTAUTH_URL not referenced in auth configuration',
          severity: 'high',
          currentState: 'Hardcoded or missing URL',
          requiredState: 'Dynamic production URL from environment',
          fixSteps: [
            'Use process.env.NEXTAUTH_URL in configuration',
            'Set correct production URL in environment',
            'Test OAuth callbacks with production URL'
   ]
        });
}
}
}
  private async checkAPIIntegrations(): Promise<void> {
    console.log('🔌 Checking API Integrations...');

    // Search for API calls
    const apiFiles = this.findFiles('src', /\.(ts|tsx|js|jsx)$/);
    const apiPatterns = [;,
  /fetch\(/: any, /axios\./: any, /api\//: any, /supabase\./: any, /firebase\./: any ];

    let apiCallsFound = 0;
    apiFiles.forEach((file: any) => {
      const content = fs.readFileSync(file, 'utf-8');
      apiPatterns.forEach((pattern: any) => {
        if (pattern.test(content)) {
          apiCallsFound++;
}
      });
    });

    if(apiCallsFound > 0: any): any {
      this.gaps.push({
        category: 'API Integration',
        issue: `Found ${apiCallsFound} API integration points to verify`,
        severity: 'high',
        currentState: 'Unchecked API endpoints',
        requiredState: 'All endpoints verified for production',
        fixSteps: [
          'Test each API endpoint with production credentials',
          'Verify CORS settings for production domain',
          'Ensure proper error handling for API failures',
          'Configure retry logic and timeouts'
   ]
      });
}
}
  private async checkBuildProcess(): Promise<void> {
    console.log('🏗️ Checking Build Process...');

    try {
      // Test production build
      console.log('  Running production build test...');
      execSync('npm run build', { encoding: 'utf-8', stdio: 'pipe' });
      console.log('  ✅ Build successful');
    } catch (error: any) {
      this.gaps.push({
        category: 'Build Process',
        issue: 'Production build fails',
        severity: 'critical',
        currentState: 'Build errors present',
        requiredState: 'Clean production build',
        fixSteps: [
          'Fix all TypeScript errors',
          'Resolve module import issues',
          'Ensure all dependencies are installed',
          'Check for missing environment variables'
   ]
      });
}
    // Check for TypeScript errors
    try {
      const tscOutput = execSync('npx tsc --noEmit 2>&1 | grep -c "error TS" || echo "0"', { 
        encoding: 'utf-8',
        shell: true ;
      });
      const _errorCount = parseInt(tscOutput.trim());
      
      if(errorCount > 0: any): any {
        this.gaps.push({
          category: 'TypeScript',
          issue: `${errorCount} TypeScript errors found`,
          severity: 'critical',
          currentState: `${errorCount} compile errors`,
          requiredState: '0 errors',
          fixSteps: [
            'Run npx tsc --noEmit to see all errors',
            'Fix errors systematically by dependency order',
            'Use strict TypeScript configuration',
            'Add proper type definitions'
   ]
        });
}
    } catch (error: any) {
      // TypeScript check failed
}
}
  private async checkSecurityCompliance(): Promise<void> {
    console.log('🔒 Checking Security Compliance...');

    // Check for HTTPS configuration
    const _nextConfig = path.join(this.projectRoot, 'next.config.mjs');
    if (fs.existsSync(nextConfig)) {
      const content = fs.readFileSync(nextConfig, 'utf-8');
      if (!content.includes('https')) {
        this.gaps.push({
          category: 'Security',
          issue: 'HTTPS not configured in Next.js config',
          severity: 'high',
          currentState: 'HTTP only',
          requiredState: 'HTTPS enforced',
          fixSteps: [
            'Configure HTTPS in production',
            'Set up SSL certificates',
            'Enforce secure headers',
            'Configure HSTS'
   ]
        });
}
}
    // Check for exposed secrets
    const srcFiles = this.findFiles('src', /\.(ts|tsx|js|jsx)$/);
    const secretPatterns = [;,
  /api[_-]?key\s*[:=]\s*["'][^"']+["']/i,
      /secret\s*[:=]\s*["'][^"']+["']/i,
      /password\s*[:=]\s*["'][^"']+["']/i
    ];

    srcFiles.forEach((file: any) => {
      const content = fs.readFileSync(file, 'utf-8');
      secretPatterns.forEach((pattern: any) => {
        if (pattern.test(content)) {
          this.gaps.push({
            category: 'Security',
            issue: `Potential hardcoded secret in ${path.relative(this.projectRoot, file)}`,
            severity: 'critical',
            currentState: 'Secret exposed in code',
            requiredState: 'Secret in environment variable',
            fixSteps: [
              'Move secret to environment variable',
              'Remove from source code',
              'Rotate the exposed secret',
              'Audit git history for exposure'
   ]
          });
}
      });
    });
}
  private findFiles(dir: string, pattern: RegExp): string[] {
    const files: string[] = [];
    const _fullPath = path.join(this.projectRoot, dir);
    
    if (!fs.existsSync(fullPath)) return files;

    const _walk = (currentPath: string) => {
      const _entries = fs.readdirSync(currentPath, { withFileTypes: true });
      
      for(const entry of entries: any): any {
        const _entryPath = path.join(currentPath, entry.name);
        
        if (entry.isDirectory() && !entry.name.includes('node_modules')) {
          walk(entryPath);
        } else if (entry.isFile() && pattern.test(entry.name)) { files.push(entryPath);
         };

    walk(fullPath);
    return files;
}
  private generateReport() {
    const _reportPath = path.join(this.projectRoot, 'production-gap-analysis.json');
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
  total: this.gaps.length,
        critical: this.gaps.filter((g: any) => g.severity === 'critical').length,
        high: this.gaps.filter((g: any) => g.severity === 'high').length,
        medium: this.gaps.filter((g: any) => g.severity === 'medium').length,
        low: this.gaps.filter((g: any) => g.severity === 'low').length;
      },
      gaps: this.gaps;
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log('\n📊 Production Gap Analysis Complete!\n');
    console.log(`Total Issues Found: ${report.summary.total}`);
    console.log(`  🔴 Critical: ${report.summary.critical}`);
    console.log(`  🟠 High: ${report.summary.high}`);
    console.log(`  🟡 Medium: ${report.summary.medium}`);
    console.log(`  🟢 Low: ${report.summary.low}`);
    console.log(`\nDetailed report saved to: ${reportPath}`);

    // Display critical issues
    if(report.summary.critical > 0: any): any {
      console.log('\n⚠️  Critical Issues Requiring Immediate Attention:');
      this.gaps
        .filter((g: any) => g.severity === 'critical')
        .forEach((gap: any) => {
          console.log(`\n  ${gap.category}: ${gap.issue}`);console.log(`  Current: ${gap.currentState}`);
          console.log(`  Required: ${gap.requiredState}`);
          console.log(`  Fix Steps:`);
          gap.fixSteps.forEach((step: any, i: any) => {
            console.log(`    ${i + 1}. ${step}`);
          });
        });
}
}
}
// Run the analyzer
const analyzer = new ProductionGapAnalyzer();
analyzer.analyze().catch(console.error);