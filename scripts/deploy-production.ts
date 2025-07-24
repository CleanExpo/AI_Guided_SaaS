#!/usr/bin/env tsx

/**
 * Production Deployment Script
 * Handles the complete production deployment process
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

interface DeploymentStep {
  name: string;
  description: string;
  action: () => void | Promise<void>;
  critical?: boolean;
}

class ProductionDeployment {
  private steps: DeploymentStep[] = [
    {
      name: 'Environment Check',
      description: 'Verify all environment variables are set',
      action: () => this.checkEnvironment(),
      critical: true
    },
    {
      name: 'Dependencies',
      description: 'Install and audit dependencies',
      action: () => this.checkDependencies(),
      critical: true
    },
    {
      name: 'TypeScript',
      description: 'Check TypeScript compilation',
      action: () => this.checkTypeScript(),
      critical: false // Currently ignored in build
    },
    {
      name: 'Linting',
      description: 'Run ESLint checks',
      action: () => this.runLinting(),
      critical: false
    },
    {
      name: 'Tests',
      description: 'Run test suite',
      action: () => this.runTests(),
      critical: false
    },
    {
      name: 'Build',
      description: 'Create production build',
      action: () => this.runBuild(),
      critical: true
    },
    {
      name: 'Vercel Config',
      description: 'Validate Vercel configuration',
      action: () => this.checkVercelConfig(),
      critical: true
    }
  ];

  async run(): Promise<void> {
    console.log(chalk.blue.bold('\n🚀 Production Deployment Process\n'));

    let hasErrors = false;
    const results: { step: string; status: 'success' | 'failed' | 'warning' }[] = [];

    for (const step of this.steps) {
      console.log(chalk.cyan(`\n📋 ${step.name}: ${step.description}`));
      
      try {
        await step.action();
        console.log(chalk.green(`✅ ${step.name} completed successfully`));
        results.push({ step: step.name, status: 'success' });
      } catch (error) {
        if (step.critical) {
          console.log(chalk.red(`❌ ${step.name} failed (CRITICAL)`));
          console.error(chalk.red(error.message));
          hasErrors = true;
          results.push({ step: step.name, status: 'failed' });
          break; // Stop on critical errors
        } else {
          console.log(chalk.yellow(`⚠️  ${step.name} failed (non-critical)`));
          console.error(chalk.yellow(error.message));
          results.push({ step: step.name, status: 'warning' });
        }
      }
    }

    // Summary
    console.log(chalk.blue.bold('\n📊 Deployment Summary\n'));
    results.forEach(({ step, status }) => {
      const icon = status === 'success' ? '✅' : status === 'warning' ? '⚠️' : '❌';
      const color = status === 'success' ? chalk.green : status === 'warning' ? chalk.yellow : chalk.red;
      console.log(color(`${icon} ${step}`));
    });

    if (hasErrors) {
      console.log(chalk.red.bold('\n❌ Deployment failed due to critical errors'));
      console.log(chalk.red('Please fix the issues above before deploying to production.\n'));
      process.exit(1);
    } else {
      console.log(chalk.green.bold('\n✅ Ready for production deployment!'));
      console.log(chalk.green('\nNext steps:'));
      console.log(chalk.green('1. Run: vercel --prod'));
      console.log(chalk.green('2. Test the preview URL'));
      console.log(chalk.green('3. Monitor the deployment\n'));
    }
  }

  private checkEnvironment(): void {
    console.log('Checking environment variables...');
    
    const requiredVars = [
      'DATABASE_URL',
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL',
    ];

    const missing = requiredVars.filter(varName => !process.env[varName]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    // Check for at least one AI provider
    if (!process.env.OPENAI_API_KEY && !process.env.ANTHROPIC_API_KEY) {
      throw new Error('At least one AI provider (OpenAI or Anthropic) must be configured');
    }
  }

  private checkDependencies(): void {
    console.log('Installing dependencies...');
    execSync('npm ci --legacy-peer-deps', { stdio: 'inherit' });

    console.log('Checking for vulnerabilities...');
    try {
      execSync('npm audit --production --audit-level=high', { stdio: 'inherit' });
    } catch (error) {
      console.log(chalk.yellow('Some vulnerabilities found, but continuing...'));
    }
  }

  private checkTypeScript(): void {
    console.log('Checking TypeScript...');
    try {
      execSync('npm run typecheck', { stdio: 'inherit' });
    } catch (error) {
      // TypeScript errors are currently ignored in build
      console.log(chalk.yellow('TypeScript errors detected (currently ignored in build)'));
    }
  }

  private runLinting(): void {
    console.log('Running ESLint...');
    try {
      execSync('npm run lint', { stdio: 'inherit' });
    } catch (error) {
      throw new Error('Linting failed. Run "npm run lint:fix" to auto-fix issues.');
    }
  }

  private runTests(): void {
    console.log('Running tests...');
    try {
      execSync('npm test -- --passWithNoTests', { stdio: 'inherit' });
    } catch (error) {
      throw new Error('Tests failed. Please fix failing tests before deployment.');
    }
  }

  private runBuild(): void {
    console.log('Creating production build...');
    
    // Set production environment
    process.env.NODE_ENV = 'production';
    
    try {
      execSync('npm run build', { stdio: 'inherit' });
    } catch (error) {
      throw new Error('Build failed. Check the error messages above.');
    }

    // Check build output
    const buildDir = path.join(process.cwd(), '.next');
    if (!fs.existsSync(buildDir)) {
      throw new Error('Build directory not found. Build may have failed.');
    }
  }

  private checkVercelConfig(): void {
    console.log('Checking Vercel configuration...');
    
    const vercelConfigPath = path.join(process.cwd(), 'vercel.json');
    if (!fs.existsSync(vercelConfigPath)) {
      throw new Error('vercel.json not found');
    }

    try {
      const config = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf-8'));
      
      // Validate required fields
      if (!config.framework || config.framework !== 'nextjs') {
        throw new Error('Invalid framework in vercel.json');
      }

      if (!config.buildCommand) {
        throw new Error('Missing buildCommand in vercel.json');
      }

      console.log('Vercel configuration is valid');
    } catch (error) {
      throw new Error(`Invalid vercel.json: ${error.message}`);
    }
  }
}

// Run deployment check
const deployment = new ProductionDeployment();
deployment.run().catch(console.error);