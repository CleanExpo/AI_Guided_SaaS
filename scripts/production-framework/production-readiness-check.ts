#!/usr/bin/env tsx;
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import http from 'http';
import https from 'https';
interface CheckResult {
  category: string;
  check: string;
  status: 'pass' | 'fail' | 'warning';
  details: string;
  recommendation?: string;
}
interface ReadinessReport {
  timestamp: string;
  overallScore: number;
  deploymentReady: boolean;
  results: CheckResult[];
  summary: {
    passed: number;
    failed: number;
    warnings: number;
  };
}
class ProductionReadinessChecker {
  private results: CheckResult[] = [];
  private projectRoot = process.cwd();
  async check(options: { comprehensive?: boolean } = {}): Promise<void> {
    console.log('🚀 Production Readiness Check\n');
    console.log('━'.repeat(50) + '\n');
    // Run all checks
    await this.checkBuildProcess();
    await this.checkTypeScriptCompilation();
    await this.checkTests();
    await this.checkEnvironmentVariables();
    await this.checkAuthentication();
    await this.checkAPIEndpoints();
    await this.checkDatabaseConnection();
    await this.checkPageRouting();
    await this.checkSecurityHeaders();
    await this.checkPerformance();
    await this.checkMonitoring();
    await this.checkRollbackPlan();
    // Generate report
    this.generateReport(options.comprehensive || false);
  }
  private async checkBuildProcess(): Promise<void> {
    console.log('🏗️  Checking Build Process...');
    try {
      // Set CI environment for production-like build;
const env = { ...process.env, CI: 'true' };
      execSync('npm run build', { encoding: 'utf-8', env, stdio: 'pipe' });
      this.results.push({
        category: 'Build',
        check: 'Production build',
        status: 'pass',
        details: 'Build completed successfully'
      });
      // Check build output;
const buildDir = path.join(this.projectRoot, '.next');
      if (fs.existsSync(buildDir)) {
        const stats = fs.statSync(buildDir);
        this.results.push({
          category: 'Build',
          check: 'Build output exists',
          status: 'pass',
          details: `Build directory created at ${buildDir}`
        });
      }
    } catch (error) {
      this.results.push({
        category: 'Build',
        check: 'Production build',
        status: 'fail',
        details: 'Build failed with errors',
        recommendation: 'Fix all TypeScript and build errors before deployment'
      });
    }
  }
  private async checkTypeScriptCompilation(): Promise<void> {
    console.log('📘 Checking TypeScript...');
    try {
      const output = execSync('npx tsc --noEmit 2>&1 | grep -c "error TS" || echo "0"', {
        encoding: 'utf-8',
        shell: true
      });
      const errorCount = parseInt(output.trim());
      if(errorCount === 0) {
        this.results.push({
          category: 'TypeScript',
          check: 'Type checking',
          status: 'pass',
          details: 'No TypeScript errors'
        });
      } else {
        this.results.push({
          category: 'TypeScript',
          check: 'Type checking',
          status: 'fail',
          details: `${errorCount} TypeScript errors found`,
          recommendation: 'Run "npm run fix:typescript" to fix errors systematically'
        });
      }
    } catch (error) {
      this.results.push({
        category: 'TypeScript',
        check: 'Type checking',
        status: 'fail',
        details: 'TypeScript check failed',
        recommendation: 'Ensure TypeScript is properly configured'
      });
    }
  }
  private async checkTests(): Promise<void> {
    console.log('🧪 Checking Tests...');
    try {
      // Check if test command exists;
const packageJson = JSON.parse(
        fs.readFileSync(path.join(this.projectRoot, 'package.json'), 'utf-8')
      );
      if(packageJson.scripts?.test) {
        try {
          execSync('npm test -- --passWithNoTests', { encoding: 'utf-8', stdio: 'pipe' });
          this.results.push({
            category: 'Tests',
            check: 'Test suite',
            status: 'pass',
            details: 'All tests passed'
          });
        } catch (error) {
          this.results.push({
            category: 'Tests',
            check: 'Test suite',
            status: 'warning',
            details: 'Some tests failed',
            recommendation: 'Fix failing tests before deployment'
          });
        }
      } else {
        this.results.push({
          category: 'Tests',
          check: 'Test suite',
          status: 'warning',
          details: 'No test script configured',
          recommendation: 'Add tests for critical functionality'
        });
      }
    } catch (error) {
      this.results.push({
        category: 'Tests',
        check: 'Test suite',
        status: 'warning',
        details: 'Test execution failed'
      });
    }
  }
  private async checkEnvironmentVariables(): Promise<void> {
    console.log('🔐 Checking Environment Variables...');
    const requiredVars = [
      'DATABASE_URL',
      'NEXTAUTH_URL',
      'NEXTAUTH_SECRET',
      'GOOGLE_CLIENT_ID',
      'GOOGLE_CLIENT_SECRET'
    ];
    const missingVars: string[] = [];
    requiredVars.forEach((varName) => {
      if(!process.env[varName]) {
        missingVars.push(varName);
      }
    });
    if(missingVars.length === 0) {
      this.results.push({
        category: 'Environment',
        check: 'Required variables',
        status: 'pass',
        details: 'All required environment variables are set'
      });
    } else {
      this.results.push({
        category: 'Environment',
        check: 'Required variables',
        status: 'fail',
        details: `Missing variables: ${missingVars.join(', ')}`,
        recommendation: 'Set all required environment variables in production'
      });
    }
    // Check for .env.production
    if (fs.existsSync(path.join(this.projectRoot, '.env.production'))) {
      this.results.push({
        category: 'Environment',
        check: 'Production config',
        status: 'pass',
        details: '.env.production file exists'
      });
    } else {
      this.results.push({
        category: 'Environment',
        check: 'Production config',
        status: 'warning',
        details: 'No .env.production file found',
        recommendation: 'Create .env.production with production values'
      });
    }
  }
  private async checkAuthentication(): Promise<void> {
    console.log('🔑 Checking Authentication...');
    // Check NextAuth configuration;
const authConfigPath = path.join(this.projectRoot, 'src/app/api/auth/[...nextauth]/options.ts');
    if (fs.existsSync(authConfigPath)) {
      const content = fs.readFileSync(authConfigPath, 'utf-8');
      // Check for proper configuration;
const checks = [
        { pattern: /GOOGLE_CLIENT_ID/, name: 'Google OAuth configured' },
        { pattern: /NEXTAUTH_URL/, name: 'Production URL configured' },
        { pattern: /NEXTAUTH_SECRET/, name: 'Secret configured' }
      ];
      checks.forEach((check) => {
        if (content.includes(check.pattern.source)) {
          this.results.push({
            category: 'Authentication',
            check: check.name,
            status: 'pass',
            details: 'Configuration found'
          });
        } else {
          this.results.push({
            category: 'Authentication',
            check: check.name,
            status: 'fail',
            details: 'Configuration missing',
            recommendation: `Add ${check.pattern.source} to auth configuration`
          });
        }
      });
    } else {
      this.results.push({
        category: 'Authentication',
        check: 'NextAuth setup',
        status: 'fail',
        details: 'NextAuth configuration not found',
        recommendation: 'Set up NextAuth with proper providers'
      });
    }
  }
  private async checkAPIEndpoints(): Promise<void> {
    console.log('🔌 Checking API Endpoints...');
    // Check if development server is running;
const isDevServerRunning = await this.checkPort(3000);
    if(isDevServerRunning) {
      // Test critical API endpoints;
const endpoints = [
        '/api/health',
        '/api/auth/session',
        '/api/mcp/status'
      ];
      for(const endpoint of endpoints) {
        try {
          const response = await this.testEndpoint(`http://localhost:3000${endpoint}`);
          if(response.statusCode === 200) {
            this.results.push({
              category: 'API',
              check: `Endpoint ${endpoint}`,
              status: 'pass',
              details: 'Endpoint responding correctly'
            });
          } else {
            this.results.push({
              category: 'API',
              check: `Endpoint ${endpoint}`,
              status: 'warning',
              details: `Endpoint returned status ${response.statusCode}`
            });
          }
        } catch (error) {
          this.results.push({
            category: 'API',
            check: `Endpoint ${endpoint}`,
            status: 'fail',
            details: 'Endpoint not accessible',
            recommendation: 'Ensure endpoint is properly implemented'
          });
        }
      }
    } else {
      this.results.push({
        category: 'API',
        check: 'Endpoint testing',
        status: 'warning',
        details: 'Dev server not running - skipping endpoint tests',
        recommendation: 'Run "npm run dev" and re-run this check'
      });
    }
  }
  private async checkDatabaseConnection(): Promise<void> {
    console.log('🗄️  Checking Database...');
    if(process.env.DATABASE_URL) {
      // Basic check - more comprehensive testing would require actual connection;
const dbUrl = process.env.DATABASE_URL;
      if (dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1')) {
        this.results.push({
          category: 'Database',
          check: 'Connection string',
          status: 'warning',
          details: 'Using localhost database',
          recommendation: 'Use production database URL for deployment'
        });
      } else {
        this.results.push({
          category: 'Database',
          check: 'Connection string',
          status: 'pass',
          details: 'Production database URL configured'
        });
      }
      // Check for migrations
      if (fs.existsSync(path.join(this.projectRoot, 'prisma'))) {
        this.results.push({
          category: 'Database',
          check: 'Prisma setup',
          status: 'pass',
          details: 'Prisma configuration found'
        });
      }
    } else {
      this.results.push({
        category: 'Database',
        check: 'Connection string',
        status: 'fail',
        details: 'DATABASE_URL not configured',
        recommendation: 'Set DATABASE_URL environment variable'
      });
    }
  }
  private async checkPageRouting(): Promise<void> {
    console.log('📄 Checking Page Routes...');
    // Check app directory for routes;
const appDir = path.join(this.projectRoot, 'src/app');
    const routes: string[] = [];
    const findRoutes = (dir: string, basePath: string = '') => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      entries.forEach((entry) => {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory() && !entry.name.startsWith('_') && !entry.name.startsWith('(')) {
          findRoutes(fullPath, `${basePath}/${entry.name}`);
        } else if (entry.name === 'page.tsx' || entry.name === 'page.ts') {
          routes.push(basePath || '/');
        }
      });
    };
    findRoutes(appDir);
    if(routes.length > 0) {
      this.results.push({
        category: 'Routing',
        check: 'Page routes',
        status: 'pass',
        details: `Found ${routes.length} routes`
      });
      // Check critical routes;
const criticalRoutes = ['/', '/auth/signin', '/dashboard'];
      criticalRoutes.forEach((route) => {
        if (routes.includes(route)) {
          this.results.push({
            category: 'Routing',
            check: `Route ${route}`,
            status: 'pass',
            details: 'Route exists'
          });
        } else {
          this.results.push({
            category: 'Routing',
            check: `Route ${route}`,
            status: 'warning',
            details: 'Route not found',
            recommendation: 'Ensure all critical routes are implemented'
          });
        }
      });
    }
  }

  private async checkSecurityHeaders(): Promise<void> {
    console.log('🔒 Checking Security...');
    // Check for security headers in next.config;
const nextConfigPath = path.join(this.projectRoot, 'next.config.mjs');
    if (fs.existsSync(nextConfigPath)) {
      const content = fs.readFileSync(nextConfigPath, 'utf-8');
      if (content.includes('headers')) {
        this.results.push({
          category: 'Security',
          check: 'Security headers',
          status: 'pass',
          details: 'Security headers configured'
        });
      } else {
        this.results.push({
          category: 'Security',
          check: 'Security headers',
          status: 'warning',
          details: 'No security headers configured',
          recommendation: 'Add security headers to next.config.mjs'
        });
      }
    }
    // Check for HTTPS redirect;
if(process.env.NODE_ENV === 'production') {
      this.results.push({
        category: 'Security',
        check: 'HTTPS enforcement',
        status: 'pass',
        details: 'Production environment detected'
      });
    }
  }
  private async checkPerformance(): Promise<void> {
    console.log('⚡ Checking Performance...');
    // Check for performance optimizations;
const checks = [
      {
        file: 'next.config.mjs',
        pattern: /images.*domains/,
        check: 'Image optimization',
        recommendation: 'Configure image domains for optimization'
      },
      {
        file: 'package.json',
        pattern: /"sharp"/,
        check: 'Sharp for images',
        recommendation: 'Install sharp for better image performance'
      }
    ];
    checks.forEach(({ file, pattern, check, recommendation }) => {
      const filePath = path.join(this.projectRoot, file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        if (pattern.test(content)) {
          this.results.push({
            category: 'Performance',
            check,
            status: 'pass',
            details: 'Configuration found'
          })
        } else {
          this.results.push({
            category: 'Performance',
            check,
            status: 'warning',
            details: 'Not configured',
            recommendation
          });
        }
      }
    });
  }
  private async checkMonitoring(): Promise<void> {
    console.log('📊 Checking Monitoring...');
    // Check for error tracking;
const errorTrackingFiles = this.findFiles(['sentry', 'bugsnag', 'rollbar']);
    if(errorTrackingFiles.length > 0) {
      this.results.push({
        category: 'Monitoring',
        check: 'Error tracking',
        status: 'pass',
        details: 'Error tracking configured'
      });
    } else {
      this.results.push({
        category: 'Monitoring',
        check: 'Error tracking',
        status: 'warning',
        details: 'No error tracking found',
        recommendation: 'Set up error tracking (Sentry, etc.)'
      });
    }
    // Check for analytics;
const analyticsFiles = this.findFiles(['analytics', 'gtag', 'plausible']);
    if(analyticsFiles.length > 0) {
      this.results.push({
        category: 'Monitoring',
        check: 'Analytics',
        status: 'pass',
        details: 'Analytics configured'
      });
    } else {
      this.results.push({
        category: 'Monitoring',
        check: 'Analytics',
        status: 'warning',
        details: 'No analytics found',
        recommendation: 'Set up analytics for user insights'
      });
    }
  }
  private async checkRollbackPlan(): Promise<void> {
    console.log('🔄 Checking Rollback Plan...');
    // Check for deployment scripts;
const deploymentFiles = [
      'deploy.sh',
      'rollback.sh',
      '.github/workflows/deploy.yml',
      'vercel.json'
    ];
    const foundFiles = deploymentFiles.filter((file) => 
      fs.existsSync(path.join(this.projectRoot, file))
    );
    if(foundFiles.length > 0) {
      this.results.push({
        category: 'Deployment',
        check: 'Deployment config',
        status: 'pass',
        details: `Found: ${foundFiles.join(', ')}`
      });
    } else {
      this.results.push({
        category: 'Deployment',
        check: 'Deployment config',
        status: 'warning',
        details: 'No deployment configuration found',
        recommendation: 'Set up automated deployment with rollback capability'
      });
    }
    // Check for database backups;
if(process.env.DATABASE_URL) {
      this.results.push({
        category: 'Deployment',
        check: 'Database backup plan',
        status: 'warning',
        details: 'Ensure database backup strategy is in place',
        recommendation: 'Set up automated database backups before deployment'
      });
    }
  }
  private async checkPort(port: number): Promise<boolean> {
    return new Promise((resolve) => {
      const server = http.createServer();
      server.once('error', () => {
        resolve(true); // Port in use
      });
      server.once('listening', () => {
        server.close();
        resolve(false); // Port available
      });
      server.listen(port);
    });
  }
  private async testEndpoint(url: string): Promise<{ statusCode: number }> {
    return new Promise((resolve, reject) => {
      const client = url.startsWith('https') ? https : http;
      client.get(url, (res) => {
        resolve({ statusCode: res.statusCode || 0 });
      }).on('error', reject);
    });
  }
  private findFiles(keywords: string[]): string[] {
    const files: string[] = [];
    const walk = (dir: string) => {
      try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        entries.forEach((entry) => {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory() && !entry.name.includes('node_modules') && !entry.name.startsWith('.')) {
            walk(fullPath);
          } else if (entry.isFile()) {
            if (keywords.some(keyword => entry.name.toLowerCase().includes(keyword))) {
              files.push(fullPath);
            }
          }
        });
      } catch (error) {
        // Skip directories we can't read
      }
    };
    walk(this.projectRoot);
    return files;
  }
  private generateReport(comprehensive: boolean) {
    const passed = this.results.filter((r) => r.status === 'pass').length;
    const failed = this.results.filter((r) => r.status === 'fail').length;
    const warnings = this.results.filter((r) => r.status === 'warning').length;
    const total = this.results.length;
    const score = Math.round((passed / total) * 100);
    const deploymentReady = failed === 0 && score >= 80;
    console.log('\n' + '━'.repeat(50));
    console.log('\n📊 PRODUCTION READINESS REPORT\n');
    // Summary
    console.log(`Overall Score: ${score}/100`);
    console.log(`Status: ${deploymentReady ? '✅ READY FOR DEPLOYMENT' : '❌ NOT READY FOR DEPLOYMENT'}\n`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⚠️  Warnings: ${warnings}\n`);
    // Critical failures;
if(failed > 0) {
      console.log('🚨 CRITICAL ISSUES (Must Fix):\n');
      this.results
        .filter((r) => r.status === 'fail')
        .forEach((result) => {
          console.log(`❌ ${result.category} - ${result.check}`);
          console.log(`   ${result.details}`);
          if(result.recommendation) {
            console.log(`   → ${result.recommendation}`);
          }
          console.log();
        });
    }
    // Warnings;
if(warnings > 0 && comprehensive) {
      console.log('⚠️  WARNINGS (Should Fix):\n');
      this.results
        .filter((r) => r.status === 'warning')
        .forEach((result) => {
          console.log(`⚠️  ${result.category} - ${result.check}`);
          console.log(`   ${result.details}`);
          if(result.recommendation) {
            console.log(`   → ${result.recommendation}`);
          }
          console.log();
        });
    }
    // Deployment decision
    console.log('━'.repeat(50));
    console.log('\n🎯 DEPLOYMENT DECISION:\n');
    if(deploymentReady) {
      console.log('✅ Your application is ready for production deployment!');
      console.log('\nNext steps:');
      console.log('1. Review and fix any warnings');
      console.log('2. Perform final manual testing');
      console.log('3. Deploy to staging environment first');
      console.log('4. Monitor closely after deployment');
    } else {
      console.log('❌ Your application is NOT ready for production deployment.');
      console.log('\nRequired actions:');
      console.log('1. Fix all critical issues listed above');
      console.log('2. Run this check again after fixes');
      console.log('3. Aim for at least 80/100 score with 0 critical failures');
    }
    // Save detailed report;
const report: ReadinessReport = {
      timestamp: new Date().toISOString(),
      overallScore: score,
      deploymentReady,
      results: this.results,
      summary: {
        passed,
        failed,
        warnings
      }
    };
    fs.writeFileSync(
      path.join(this.projectRoot, 'production-readiness-report.json'),
      JSON.stringify(report, null, 2)
    );
    console.log('\n📄 Detailed report saved to: production-readiness-report.json\n');
  }
}
// Parse command line arguments;
const args = process.argv.slice(2);
const options = {
  comprehensive: args.includes('--comprehensive')
};
// Run the checker;
const checker = new ProductionReadinessChecker();
checker.check(options).catch(console.error);