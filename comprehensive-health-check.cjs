#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class HealthChecker {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      checks: [],
      summary: {
        total: 0,
        passed: 0,
        warnings: 0,
        failed: 0,
        critical: 0}
    };}
  check(category, item, callback, severity = 'medium') {
    try {
      const result = callback();
      this.addResult(category, item, result.status, result.message, severity);
      return result;
    } catch (error) {
      this.addResult(category, item, 'failed', error.message, severity);
      return { status: 'failed', message: error.message };}}
  addResult(category, item, status, message, severity) {
    this.results.checks.push({
      category,
      item,
      status,
      message,
      // severity
    });
    
    this.results.summary.total++;
    if (status === 'pass') this.results.summary.passed++;
    else if (status === 'warning') this.results.summary.warnings++;
    else if (status === 'failed') this.results.summary.failed++;
    
    if (severity === 'critical' && status === 'failed') {
      this.results.summary.critical++;}}
  fileExists(filePath) {
    return fs.existsSync(filePath);}
  directoryExists(dirPath) {
    return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();}
  readFile(filePath) {
    try {
      return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
      throw new Error(`Cannot read file: ${error.message}`);}}
  runCommand(command) {
    try {
      return execSync(command, { encoding: 'utf8', timeout: 30000 });
    } catch (error) {
      throw new Error(`Command failed: ${error.message}`);}}
  // ============= PROJECT STRUCTURE CHECKS =============
  checkProjectStructure() {
    console.log('🏗️  Checking Project Structure...');
    
    const requiredDirs = [
      'src/app',
      'src/components', 
      'src/lib',
      'src/types',
      'src/utils',
      'src/hooks',
      'public',
      'agents',
      'docs'
    ];

    requiredDirs.forEach(dir => {
      this.check('Project Structure', dir, () => {
        const _exists = this.directoryExists(dir);
        return {
          status: exists ? 'pass' : 'failed',
          message: exists ? 'Directory exists' : 'Directory missing'
        };
      }, 'high');
    });}
  // ============= CONFIGURATION CHECKS =============
  checkConfigurationFiles() {
    console.log('⚙️  Checking Configuration Files...');
    
    const configFiles = [
      { file: 'package.json', critical: true },
      { file: 'next.config.mjs', critical: true },
      { file: 'tsconfig.json', critical: true },
      { file: 'tailwind.config.ts', critical: false },
      { file: 'components.json', critical: false },
      { file: '.env.local', critical: true },
      { file: '.env.production', critical: false },
      { file: 'vercel.json', critical: false }
    ];

    configFiles.forEach(({ file, critical }) => {
      this.check('Configuration', file, () => {
        const _exists = this.fileExists(file);
        return {
          status: exists ? 'pass' : (critical ? 'failed' : 'warning'),
          message: exists ? 'Configuration file exists' : 'Configuration file missing'
        };
      }, critical ? 'critical' : 'medium');
    });}
  // ============= PACKAGE.JSON ANALYSIS =============
  checkPackageJson() {
    console.log('📦 Analyzing package.json...');
    
    this.check('Dependencies', 'package.json structure', () => {
      const packageContent = JSON.parse(this.readFile('package.json'));
      
      const _hasScripts = packageContent.scripts && Object.keys(packageContent.scripts).length > 0;
      const _hasDeps = packageContent.dependencies && Object.keys(packageContent.dependencies).length > 0;
      const _hasDevDeps = packageContent.devDependencies && Object.keys(packageContent.devDependencies).length > 0;
      
      if (!hasScripts) throw new Error('No scripts defined');
      if (!hasDeps) throw new Error('No dependencies defined');
      
      return {
        status: 'pass',
        message: `Scripts: ${Object.keys(packageContent.scripts).length}, Deps: ${Object.keys(packageContent.dependencies).length}, DevDeps: ${hasDevDeps ? Object.keys(packageContent.devDependencies).length : 0}`
      };
    }, 'critical');

    // Check for security vulnerabilities
    this.check('Dependencies', 'npm audit', () => {
      try {
        const _auditOutput = this.runCommand('npm audit --audit-level=high --json');
        const audit = JSON.parse(auditOutput);
        
        if (audit.metadata && audit.metadata.vulnerabilities) {
          const _high = audit.metadata.vulnerabilities.high || 0;
          const _critical = audit.metadata.vulnerabilities.critical || 0;
          
          if (critical > 0) {
            return { status: 'failed', message: `${critical} critical vulnerabilities found` };
          } else if (high > 0) {
            return { status: 'warning', message: `${high} high vulnerabilities found` };}}
        return { status: 'pass', message: 'No high/critical vulnerabilities' };
      } catch (error) {
        return { status: 'warning', message: 'Could not run security audit' };}
    }, 'high');}
  // ============= ENVIRONMENT CHECKS =============
  checkEnvironmentVariables() {
    console.log('🌍 Checking Environment Variables...');
    
    const envFiles = ['.env.local', '.env.production', '.env.development.template'];
    
    envFiles.forEach(envFile => {
      if (this.fileExists(envFile)) {
        this.check('Environment', envFile, () => {
          const content = this.readFile(envFile);
          const lines = content.split('\n').filter(line => line.trim() && !line.startsWith('#'));
          const _hasPlaceholders = lines.some(line => line.includes('your-') || line.includes('-here'));
          
          return {
            status: hasPlaceholders ? 'warning' : 'pass',
            message: hasPlaceholders ? 
              `${lines.length} variables, some with placeholder values` : 
              `${lines.length} variables configured`
          };
        }, 'high');}
    });}
  // ============= NEXT.JS CHECKS =============
  checkNextJsConfiguration() {
    console.log('⚛️  Checking Next.js Configuration...');
    
    this.check('Next.js', 'next.config.mjs', () => {
      const config = this.readFile('next.config.mjs');
      
      const _hasEslintIgnore = config.includes('ignoreDuringBuilds: true');
      const _hasTypeScriptIgnore = config.includes('ignoreBuildErrors: true');
      
      if (hasEslintIgnore || hasTypeScriptIgnore) {
        return {
          status: 'warning',
          message: 'Build error checking is disabled - may hide critical issues'
        };}
      return {
        status: 'pass',
        message: 'Configuration allows proper error checking'
      };
    }, 'high');

    // Check for App Router structure
    this.check('Next.js', 'App Router structure', () => {
      const _hasAppDir = this.directoryExists('src/app');
      const _hasLayout = this.fileExists('src/app/layout.tsx');
      const _hasPage = this.fileExists('src/app/page.tsx');
      
      if (!hasAppDir) throw new Error('App directory missing');
      if (!hasLayout) throw new Error('Root layout missing');
      if (!hasPage) throw new Error('Root page missing');
      
      return {
        status: 'pass',
        message: 'App Router structure is complete'
      };
    }, 'critical');}
  // ============= API ROUTES CHECKS =============
  checkApiRoutes() {
    console.log('🔌 Checking API Routes...');
    
    const expectedRoutes = [
      'src/app/api/health/route.ts',
      'src/app/api/auth/[...nextauth]/route.ts',
      'src/app/api/admin/route.ts',
      'src/app/api/analytics/route.ts'
    ];

    expectedRoutes.forEach(route => {
      this.check('API Routes', route.replace('src/app/api/', '/api/').replace('/route.ts', ''), () => {
        const _exists = this.fileExists(route);
        return {
          status: exists ? 'pass' : 'warning',
          message: exists ? 'Route file exists' : 'Route file missing'
        };
      }, 'medium');
    });}
  // ============= DATABASE CHECKS =============
  checkDatabase() {
    console.log('🗄️  Checking Database Configuration...');
    
    this.check('Database', 'Supabase configuration', () => {
      const _hasSupabaseDir = this.directoryExists('supabase');
      const _hasSupabaseTypes = this.fileExists('src/types/supabase.ts');
      const _hasSupabaseLib = this.fileExists('src/lib/supabase/client.ts') || this.fileExists('src/lib/supabase/server.ts');
      
      if (!hasSupabaseDir && !hasSupabaseTypes && !hasSupabaseLib) {
        return { status: 'warning', message: 'No database configuration found' };}
      return {
        status: 'pass',
        message: 'Database configuration present'
      };
    }, 'high');}
  // ============= AUTHENTICATION CHECKS =============
  checkAuthentication() {
    console.log('🔐 Checking Authentication System...');
    
    const authFiles = [
      'src/app/api/auth/[...nextauth]/route.ts',
      'src/lib/auth.ts',
      'middleware.ts'
    ];

    authFiles.forEach(file => {
      this.check('Authentication', path.basename(file), () => {
        const _exists = this.fileExists(file);
        return {
          status: exists ? 'pass' : 'warning',
          message: exists ? 'Auth file exists' : 'Auth file missing'
        };
      }, 'high');
    });}
  // ============= TYPESCRIPT CHECKS =============
  checkTypeScript() {
    console.log('🔷 Checking TypeScript Configuration...');
    
    this.check('TypeScript', 'Type checking', () => {
      try {
        const _output = this.runCommand('npx tsc --noEmit');
        return {
          status: 'pass',
          message: 'No TypeScript errors found'
        };
      } catch (error) {
        const _errorCount = (error.message.match(/error TS/g) || []).length;
        return {
          status: errorCount > 10 ? 'failed' : 'warning',
          message: `${errorCount} TypeScript errors found`
        };}
    }, 'high');}
  // ============= BUILD CHECKS =============
  checkBuildSystem() {
    console.log('🔨 Checking Build System...');
    
    this.check('Build System', 'Next.js build check', () => {
      try {
        // Check if build files exist
        const _hasBuildInfo = this.fileExists('tsconfig.tsbuildinfo');
        const _hasNextEnv = this.fileExists('next-env.d.ts');
        
        return {
          status: 'pass',
          message: `Build system configured (buildinfo: ${hasBuildInfo}, next-env: ${hasNextEnv})`
        };
      } catch (error) {
        return {
          status: 'warning',
          message: 'Build system may need initialization'
        };}
    }, 'medium');}
  // ============= SECURITY CHECKS =============
  checkSecurity() {
    console.log('🛡️  Checking Security Configuration...');
    
    // Check for sensitive files
    const sensitiveFiles = ['.env.local', '.env.production'];
    sensitiveFiles.forEach(file => {
      if (this.fileExists(file)) {
        this.check('Security', `${file} protection`, () => {
          const gitignore = this.fileExists('.gitignore') ? this.readFile('.gitignore') : '';
          const _isIgnored = gitignore.includes('.env.local') || gitignore.includes('.env*');
          
          return {
            status: isIgnored ? 'pass' : 'failed',
            message: isIgnored ? 'Environment files are git-ignored' : 'Environment files may be exposed'
          };
        }, 'critical');}
    });

    // Check middleware
    this.check('Security', 'Middleware protection', () => {
      const _hasMiddleware = this.fileExists('middleware.ts');
      if (!hasMiddleware) {
        return { status: 'warning', message: 'No middleware protection found' };}
      const middleware = this.readFile('middleware.ts');
      const _hasAuth = middleware.includes('auth') || middleware.includes('withAuth');
      
      return {
        status: hasAuth ? 'pass' : 'warning',
        message: hasAuth ? 'Authentication middleware present' : 'Middleware exists but may lack auth'
      };
    }, 'high');}
  // ============= COMPONENT CHECKS =============
  checkComponents() {
    console.log('🧩 Checking Component Library...');
    
    // Check for UI components
    const componentDirs = [
      'src/components/ui',
      'src/components/layout',
      'src/components/admin'
    ];

    componentDirs.forEach(dir => {
      this.check('Components', dir.replace('src/components/', ''), () => {
        const _exists = this.directoryExists(dir);
        if (!exists) {
          return { status: 'warning', message: 'Component directory missing' };}
        const files = fs.readdirSync(dir);
        const _componentCount = files.filter(f => f.endsWith('.tsx')).length;
        
        return {
          status: componentCount > 0 ? 'pass' : 'warning',
          message: `${componentCount} components found`
        };
      }, 'medium');
    });}
  // ============= PERFORMANCE CHECKS =============
  checkPerformance() {
    console.log('⚡ Checking Performance Configuration...');
    
    this.check('Performance', 'Bundle analysis', () => {
      const packageJson = JSON.parse(this.readFile('package.json'));
      const _hasAnalyze = packageJson.scripts && packageJson.scripts.analyze;
      
      return {
        status: hasAnalyze ? 'pass' : 'warning',
        message: hasAnalyze ? 'Bundle analysis script available' : 'No bundle analysis configured'
      };
    }, 'low');

    // Check for image optimization
    this.check('Performance', 'Image optimization', () => {
      const nextConfig = this.readFile('next.config.mjs');
      const _hasImageConfig = nextConfig.includes('images') || nextConfig.includes('Image');
      
      return {
        status: hasImageConfig ? 'pass' : 'warning',
        message: hasImageConfig ? 'Image optimization configured' : 'Image optimization may need setup'
      };
    }, 'medium');}
  // ============= DEPLOYMENT CHECKS =============
  checkDeployment() {
    console.log('🚀 Checking Deployment Configuration...');
    
    // Check Vercel configuration
    this.check('Deployment', 'Vercel configuration', () => {
      const _hasVercelJson = this.fileExists('vercel.json');
      const _hasVercelDir = this.directoryExists('.vercel');
      
      if (hasVercelJson) {
        const config = JSON.parse(this.readFile('vercel.json'));
        const _hasBrokenRedirects = config.redirects && 
          config.redirects.some(r => r.source === '/dashboard' && r.destination === '/');
        
        if (hasBrokenRedirects) {
          return { status: 'failed', message: 'Vercel config has broken dashboard redirect' };}}
      return {
        status: hasVercelJson || hasVercelDir ? 'pass' : 'warning',
        message: hasVercelJson || hasVercelDir ? 'Deployment configuration found' : 'No deployment configuration'
      };
    }, 'medium');}
  // ============= TESTING CHECKS =============
  checkTesting() {
    console.log('🧪 Checking Testing Configuration...');
    
    const testFiles = ['jest.config.js', 'jest.config.cjs', 'playwright.config.ts'];
    
    let hasTestConfig = false;
    testFiles.forEach(file => {
      if (this.fileExists(file)) {
        hasTestConfig = true;
        this.check('Testing', file, () => ({
          status: 'pass',
          message: 'Test configuration exists'
        }), 'low');}
    });

    if (!hasTestConfig) {
      this.check('Testing', 'Test configuration', () => ({
        status: 'warning',
        message: 'No test configuration found'
      }), 'low');}}
  // ============= DOCUMENTATION CHECKS =============
  checkDocumentation() {
    console.log('📚 Checking Documentation...');
    
    const docFiles = ['README.md', 'CONTRIBUTING.md', 'docs/'];
    
    docFiles.forEach(file => {
      this.check('Documentation', file, () => {
        const _exists = file.endsWith('/') ? this.directoryExists(file) : this.fileExists(file);
        return {
          status: exists ? 'pass' : 'warning',
          message: exists ? 'Documentation exists' : 'Documentation missing'
        };
      }, 'low');
    });}
  // ============= MAIN EXECUTION =============
  async runAllChecks() {
    console.log('🏥 COMPREHENSIVE HEALTH CHECK STARTING...\n');
    
    this.checkProjectStructure();
    this.checkConfigurationFiles();
    this.checkPackageJson();
    this.checkEnvironmentVariables();
    this.checkNextJsConfiguration();
    this.checkApiRoutes();
    this.checkDatabase();
    this.checkAuthentication();
    this.checkTypeScript();
    this.checkBuildSystem();
    this.checkSecurity();
    this.checkComponents();
    this.checkPerformance();
    this.checkDeployment();
    this.checkTesting();
    this.checkDocumentation();

    console.log('\n🏁 HEALTH CHECK COMPLETE!');
    return this.results;}
  generateReport() {
    const { summary, checks } = this.results;
    
    console.log('\n' + '='.repeat(60));
    console.log('📋 COMPREHENSIVE HEALTH CHECK REPORT');
    console.log('='.repeat(60));
    
    console.log(`\n📊 SUMMARY:`);
    console.log(`   Total Checks: ${summary.total}`);
    console.log(`   ✅ Passed: ${summary.passed}`);
    console.log(`   ⚠️  Warnings: ${summary.warnings}`);
    console.log(`   ❌ Failed: ${summary.failed}`);
    console.log(`   🚨 Critical Issues: ${summary.critical}`);
    
    const _healthScore = Math.round((summary.passed / summary.total) * 100);
    console.log(`   🏥 Health Score: ${healthScore}%`);
    
    if (summary.critical > 0) {
      console.log('\n🚨 CRITICAL ISSUES:');
      // checks
        .filter(c => c.severity === 'critical' && c.status === 'failed')
        .forEach(c => console.log(`   ❌ ${c.category}: ${c.item} - ${c.message}`));}
    if (summary.failed > summary.critical) {
      console.log('\n❌ FAILED CHECKS:');
      // checks
        .filter(c => c.severity !== 'critical' && c.status === 'failed')
        .forEach(c => console.log(`   ❌ ${c.category}: ${c.item} - ${c.message}`));}
    if (summary.warnings > 0) {
      console.log('\n⚠️  WARNINGS:');
      // checks
        .filter(c => c.status === 'warning')
        .slice(0, 10) // Show first 10 warnings
        .forEach(c => console.log(`   ⚠️  ${c.category}: ${c.item} - ${c.message}`));
      
      if (checks.filter(c => c.status === 'warning').length > 10) {
        console.log(`   ... and ${checks.filter(c => c.status === 'warning').length - 10} more warnings`);}}
    console.log('\n✅ RECENT SUCCESSES:');
    // checks
      .filter(c => c.status === 'pass')
      .slice(-5) // Show last 5 successes
      .forEach(c => console.log(`   ✅ ${c.category}: ${c.item} - ${c.message}`));
    
    console.log('\n' + '='.repeat(60));
    
    return this.results;}
  saveReport(filename = 'comprehensive-health-report.json') {
    fs.writeFileSync(filename, JSON.stringify(this.results, null, 2));
    console.log(`\n💾 Full report saved to: ${filename}`);}}
// Execute health check
async function main() {
  const checker = new HealthChecker();
  
  try {
    await checker.runAllChecks();
    const results = checker.generateReport();
    checker.saveReport();
    
    // Exit with appropriate code
    if (results.summary.critical > 0) {
      process.exit(2); // Critical issues
    } else if (results.summary.failed > 0) {
      process.exit(1); // Failed checks
    } else {
      process.exit(0); // All good}
  } catch (error) {
    console.error('\n💥 Health check failed:', error.message);
    process.exit(3);}}
if (require.main === module) {
  main();}
module.exports = HealthChecker;
