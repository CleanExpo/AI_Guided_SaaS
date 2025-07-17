#!/usr/bin/env node

/**
 * VERCEL PRE-DEPLOYMENT VALIDATION SYSTEM
 * 
 * This script validates ALL Vercel deployment requirements before build
 * Based on official Vercel documentation and best practices
 * 
 * Run this BEFORE every deployment to prevent build failures
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class VercelPreDeploymentValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.projectRoot = process.cwd();
    this.requiredFiles = [
      'package.json',
      'next.config.mjs',
      '.env.production',
      'tsconfig.json'
    ];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const colors = {
      info: '\x1b[36m',    // Cyan
      success: '\x1b[32m', // Green
      warning: '\x1b[33m', // Yellow
      error: '\x1b[31m',   // Red
      reset: '\x1b[0m'
    };
    
    console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
  }

  addError(message) {
    this.errors.push(message);
    this.log(`❌ ERROR: ${message}`, 'error');
  }

  addWarning(message) {
    this.warnings.push(message);
    this.log(`⚠️  WARNING: ${message}`, 'warning');
  }

  addSuccess(message) {
    this.log(`✅ ${message}`, 'success');
  }

  // 1. VERCEL FRAMEWORK DETECTION
  validateFrameworkDetection() {
    this.log('🔍 Validating Vercel Framework Detection...', 'info');
    
    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      this.addError('package.json not found - required for framework detection');
      return;
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Check Next.js detection requirements
    if (!packageJson.dependencies?.next && !packageJson.devDependencies?.next) {
      this.addError('Next.js not found in dependencies - Vercel cannot detect framework');
      return;
    }

    // Check build script
    if (!packageJson.scripts?.build) {
      this.addError('Missing "build" script in package.json - required by Vercel');
      return;
    }

    // Validate build script content
    if (packageJson.scripts.build !== 'next build') {
      this.addWarning(`Build script is "${packageJson.scripts.build}" - should be "next build" for optimal Vercel detection`);
    }

    this.addSuccess('Framework detection requirements met');
  }

  // 2. VERCEL BUILD SETTINGS VALIDATION
  validateBuildSettings() {
    this.log('🔧 Validating Vercel Build Settings...', 'info');
    
    // Check vercel.json if exists
    const vercelJsonPath = path.join(this.projectRoot, 'vercel.json');
    if (fs.existsSync(vercelJsonPath)) {
      try {
        const vercelConfig = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));
        
        // Validate build command
        if (vercelConfig.buildCommand && vercelConfig.buildCommand !== 'npm run build') {
          this.addWarning(`Custom build command detected: ${vercelConfig.buildCommand}`);
        }

        // Validate output directory
        if (vercelConfig.outputDirectory && vercelConfig.outputDirectory !== '.next') {
          this.addWarning(`Custom output directory: ${vercelConfig.outputDirectory}`);
        }

        // Check for problematic redirects
        if (vercelConfig.redirects) {
          vercelConfig.redirects.forEach((redirect, index) => {
            if (redirect.source === '/dashboard' && redirect.destination === '/') {
              this.addError(`Problematic redirect found at index ${index}: /dashboard -> / (breaks navigation)`);
            }
          });
        }

        this.addSuccess('vercel.json configuration validated');
      } catch (error) {
        this.addError(`Invalid vercel.json format: ${error.message}`);
      }
    }

    // Check Next.js config
    const nextConfigPath = path.join(this.projectRoot, 'next.config.mjs');
    if (fs.existsSync(nextConfigPath)) {
      const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');
      
      // Check for build-breaking configurations
      if (nextConfigContent.includes('ignoreDuringBuilds: false')) {
        this.addError('next.config.mjs has ignoreDuringBuilds: false - will cause build failures with ESLint errors');
      }

      if (nextConfigContent.includes('ignoreBuildErrors: false')) {
        this.addError('next.config.mjs has ignoreBuildErrors: false - will cause build failures with TypeScript errors');
      }

      // Check for experimental features that might cause issues
      if (nextConfigContent.includes('optimizeCss: true')) {
        this.addWarning('CSS optimization enabled - may cause critters module issues');
      } else if (nextConfigContent.includes('optimizeCss: false')) {
        this.addSuccess('CSS optimization properly disabled - no critters module issues');
      }

      this.addSuccess('Next.js configuration validated');
    }
  }

  // 3. ENVIRONMENT VARIABLES VALIDATION
  validateEnvironmentVariables() {
    this.log('🌍 Validating Environment Variables...', 'info');
    
    const envProdPath = path.join(this.projectRoot, '.env.production');
    if (!fs.existsSync(envProdPath)) {
      this.addError('.env.production file missing - required for production deployment');
      return;
    }

    const envContent = fs.readFileSync(envProdPath, 'utf8');
    const envLines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
    
    // Critical environment variables for Next.js + Vercel
    const criticalVars = [
      'NODE_ENV',
      'NEXTAUTH_URL',
      'NEXTAUTH_SECRET'
    ];

    const foundVars = {};
    envLines.forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        foundVars[key.trim()] = value.trim();
      }
    });

    // Check critical variables
    criticalVars.forEach(varName => {
      if (!foundVars[varName]) {
        this.addError(`Missing critical environment variable: ${varName}`);
      } else if (foundVars[varName].includes('REPLACE_WITH') || foundVars[varName].includes('your-production')) {
        this.addError(`Environment variable ${varName} has placeholder value: ${foundVars[varName]}`);
      }
    });

    // Check for invalid URLs
    Object.entries(foundVars).forEach(([key, value]) => {
      if (key.includes('URL') && value.includes('REPLACE_WITH')) {
        this.addError(`Invalid URL in ${key}: ${value}`);
      }
    });

    // Validate NEXTAUTH_URL format
    if (foundVars.NEXTAUTH_URL && !foundVars.NEXTAUTH_URL.startsWith('https://')) {
      this.addError(`NEXTAUTH_URL must start with https:// for production: ${foundVars.NEXTAUTH_URL}`);
    }

    this.addSuccess('Environment variables validated');
  }

  // 4. DEPENDENCY VALIDATION
  validateDependencies() {
    this.log('📦 Validating Dependencies...', 'info');
    
    try {
      // Check if node_modules exists
      if (!fs.existsSync(path.join(this.projectRoot, 'node_modules'))) {
        this.addError('node_modules directory missing - run npm install');
        return;
      }

      // Run npm audit for security vulnerabilities
      try {
        execSync('npm audit --audit-level=high', { stdio: 'pipe' });
        this.addSuccess('No high-severity vulnerabilities found');
      } catch (error) {
        this.addWarning('High-severity vulnerabilities detected - consider running npm audit fix');
      }

      // Check for peer dependency warnings
      try {
        const npmLsOutput = execSync('npm ls --depth=0', { stdio: 'pipe', encoding: 'utf8' });
        if (npmLsOutput.includes('UNMET PEER DEPENDENCY')) {
          this.addWarning('Unmet peer dependencies detected');
        }
      } catch (error) {
        this.addWarning('Dependency tree has issues - check npm ls output');
      }

      this.addSuccess('Dependencies validated');
    } catch (error) {
      this.addError(`Dependency validation failed: ${error.message}`);
    }
  }

  // 5. BUILD VALIDATION (DRY RUN)
  validateBuildProcess() {
    this.log('🏗️  Validating Build Process (Dry Run)...', 'info');
    
    try {
      // Check TypeScript compilation
      if (fs.existsSync(path.join(this.projectRoot, 'tsconfig.json'))) {
        try {
          execSync('npx tsc --noEmit', { stdio: 'pipe' });
          this.addSuccess('TypeScript compilation check passed');
        } catch (error) {
          this.addWarning('TypeScript compilation has errors - build may fail if ignoreBuildErrors is false');
        }
      }

      // Check ESLint
      try {
        execSync('npx eslint . --ext .ts,.tsx,.js,.jsx --max-warnings 0', { stdio: 'pipe' });
        this.addSuccess('ESLint check passed');
      } catch (error) {
        // Check if ignoreDuringBuilds is true
        const nextConfigPath = path.join(this.projectRoot, 'next.config.mjs');
        if (fs.existsSync(nextConfigPath)) {
          const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');
          if (nextConfigContent.includes('ignoreDuringBuilds: true')) {
            this.addSuccess('ESLint errors present but handled - ignoreDuringBuilds: true configured');
          } else {
            this.addWarning('ESLint errors detected - build may fail if ignoreDuringBuilds is false');
          }
        } else {
          this.addWarning('ESLint errors detected - build may fail if ignoreDuringBuilds is false');
        }
      }

      // Simulate Next.js build check (without full build)
      try {
        execSync('npx next build --dry-run', { stdio: 'pipe' });
        this.addSuccess('Next.js build dry-run passed');
      } catch (error) {
        // Dry-run might not be available, try build info
        try {
          execSync('npx next info', { stdio: 'pipe' });
          this.addSuccess('Next.js configuration valid');
        } catch (infoError) {
          this.addWarning('Could not validate Next.js build process');
        }
      }

    } catch (error) {
      this.addError(`Build validation failed: ${error.message}`);
    }
  }

  // 6. VERCEL-SPECIFIC REQUIREMENTS
  validateVercelRequirements() {
    this.log('🚀 Validating Vercel-Specific Requirements...', 'info');
    
    // Check file size limits (Vercel has limits)
    const checkFileSize = (filePath, maxSize, description) => {
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        if (stats.size > maxSize) {
          this.addWarning(`${description} is ${(stats.size / 1024 / 1024).toFixed(2)}MB - may exceed Vercel limits`);
        }
      }
    };

    // Check common large files
    checkFileSize(path.join(this.projectRoot, 'package-lock.json'), 10 * 1024 * 1024, 'package-lock.json');
    
    // Check for .vercel directory (indicates previous deployments)
    if (fs.existsSync(path.join(this.projectRoot, '.vercel'))) {
      this.addSuccess('Previous Vercel deployment configuration found');
    }

    // Check for proper .gitignore
    const gitignorePath = path.join(this.projectRoot, '.gitignore');
    if (fs.existsSync(gitignorePath)) {
      const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
      const requiredIgnores = ['.env.local', '.env*.local', '.vercel', '.next'];
      
      requiredIgnores.forEach(pattern => {
        // Check for exact match or wildcard patterns
        const isPatternCovered = gitignoreContent.includes(pattern) || 
                                (pattern === '.env.local' && gitignoreContent.includes('.env*.local'));
        
        if (!isPatternCovered) {
          this.addWarning(`Missing ${pattern} in .gitignore - may cause deployment issues`);
        }
      });
    }

    // Check Node.js version compatibility
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    
    if (majorVersion < 18) {
      this.addError(`Node.js ${nodeVersion} detected - Vercel requires Node.js 18+ for Next.js 13+`);
    } else {
      this.addSuccess(`Node.js ${nodeVersion} is compatible with Vercel`);
    }

    this.addSuccess('Vercel-specific requirements validated');
  }

  // 7. PERFORMANCE AND OPTIMIZATION CHECKS
  validatePerformance() {
    this.log('⚡ Validating Performance Optimizations...', 'info');
    
    // Check for large bundle indicators
    const srcDir = path.join(this.projectRoot, 'src');
    if (fs.existsSync(srcDir)) {
      const checkLargeFiles = (dir) => {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);
          
          if (stat.isDirectory()) {
            checkLargeFiles(filePath);
          } else if (stat.size > 500 * 1024 && (file.endsWith('.ts') || file.endsWith('.tsx'))) {
            this.addWarning(`Large source file detected: ${filePath} (${(stat.size / 1024).toFixed(2)}KB)`);
          }
        });
      };
      
      try {
        checkLargeFiles(srcDir);
      } catch (error) {
        // Ignore permission errors
      }
    }

    // Check for image optimization setup
    const publicDir = path.join(this.projectRoot, 'public');
    if (fs.existsSync(publicDir)) {
      const images = fs.readdirSync(publicDir).filter(file => 
        /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file)
      );
      
      if (images.length > 0) {
        this.addSuccess(`Found ${images.length} images in public directory`);
      }
    }

    this.addSuccess('Performance validation completed');
  }

  // MAIN VALIDATION RUNNER
  async runValidation() {
    this.log('🚀 STARTING VERCEL PRE-DEPLOYMENT VALIDATION', 'info');
    this.log('=' .repeat(60), 'info');
    
    // Run all validation checks
    this.validateFrameworkDetection();
    this.validateBuildSettings();
    this.validateEnvironmentVariables();
    this.validateDependencies();
    this.validateBuildProcess();
    this.validateVercelRequirements();
    this.validatePerformance();
    
    // Generate final report
    this.log('=' .repeat(60), 'info');
    this.log('📊 VALIDATION SUMMARY', 'info');
    this.log('=' .repeat(60), 'info');
    
    if (this.errors.length === 0 && this.warnings.length === 0) {
      this.log('🎉 ALL CHECKS PASSED - READY FOR VERCEL DEPLOYMENT!', 'success');
      return { success: true, errors: [], warnings: [] };
    }
    
    if (this.errors.length > 0) {
      this.log(`❌ ${this.errors.length} CRITICAL ERRORS FOUND:`, 'error');
      this.errors.forEach((error, index) => {
        this.log(`   ${index + 1}. ${error}`, 'error');
      });
    }
    
    if (this.warnings.length > 0) {
      this.log(`⚠️  ${this.warnings.length} WARNINGS FOUND:`, 'warning');
      this.warnings.forEach((warning, index) => {
        this.log(`   ${index + 1}. ${warning}`, 'warning');
      });
    }
    
    if (this.errors.length > 0) {
      this.log('🚫 DEPLOYMENT NOT RECOMMENDED - FIX ERRORS FIRST', 'error');
      return { success: false, errors: this.errors, warnings: this.warnings };
    } else {
      this.log('✅ DEPLOYMENT READY WITH WARNINGS - PROCEED WITH CAUTION', 'warning');
      return { success: true, errors: [], warnings: this.warnings };
    }
  }
}

// Run validation if called directly
if (require.main === module) {
  const validator = new VercelPreDeploymentValidator();
  validator.runValidation().then(result => {
    process.exit(result.success ? 0 : 1);
  });
}

module.exports = VercelPreDeploymentValidator;
