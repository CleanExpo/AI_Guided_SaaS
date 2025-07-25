#!/usr/bin/env tsx

import { exec } from 'child_process';
import { promisify } from 'util';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

interface DeploymentOptions {
  environment: 'production' | 'preview' | 'development';
  skipTests?: boolean;
  skipBuild?: boolean;
  force?: boolean;
}

async function checkPrerequisites() {
  const spinner = ora('Checking prerequisites...').start();

  try {
    // Check Node version
    const { stdout: nodeVersion } = await execAsync('node --version');
    const majorVersion = parseInt(nodeVersion.replace('v', '').split('.')[0]);
    
    if (majorVersion < 20) {
      spinner.fail('Node.js 20+ is required');
      process.exit(1);
    }

    // Check Vercel CLI
    try {
      await execAsync('vercel --version');
    } catch {
      spinner.fail('Vercel CLI not found. Run: npm install -g vercel');
      process.exit(1);
    }

    // Check environment variables
    const requiredEnvVars = [
      'VERCEL_TOKEN',
      'VERCEL_ORG_ID',
      'VERCEL_PROJECT_ID'
    ];

    const missingVars = requiredEnvVars.filter(v => !process.env[v]);
    
    if (missingVars.length > 0) {
      spinner.fail(`Missing environment variables: ${missingVars.join(', ')}`);
      console.log(chalk.yellow('\nSet up Vercel:'));
      console.log('1. Run: vercel login');
      console.log('2. Run: vercel link');
      console.log('3. Add VERCEL_TOKEN to .env.local');
      process.exit(1);
    }

    spinner.succeed('Prerequisites checked');
  } catch (error) {
    spinner.fail('Prerequisite check failed');
    console.error(error);
    process.exit(1);
  }
}

async function runTests() {
  const spinner = ora('Running tests...').start();

  try {
    // Run evaluation tests
    await execAsync('npm run eval:run', {
      env: { ...process.env, CI: 'true' }
    });

    // Check evaluation results
    const results = JSON.parse(
      await fs.readFile('evaluation-results/latest.json', 'utf-8')
    );

    if (results.overall < 8) {
      spinner.fail(`Evaluation score too low: ${results.overall}/10`);
      console.log(chalk.red('\nComponent scores:'));
      console.log(`  Dashboard: ${results.scores.dashboard.total}/10`);
      console.log(`  Prompts: ${results.scores.prompts.total}/10`);
      console.log(`  Folders: ${results.scores.folders.total}/10`);
      process.exit(1);
    }

    spinner.succeed(`Tests passed! Score: ${results.overall}/10`);
  } catch (error) {
    spinner.fail('Tests failed');
    console.error(error);
    process.exit(1);
  }
}

async function buildProject() {
  const spinner = ora('Building project...').start();

  try {
    await execAsync('npm run build', {
      env: {
        ...process.env,
        NODE_ENV: 'production',
        SKIP_ENV_VALIDATION: 'true'
      }
    });

    // Check build output
    const buildDir = path.join(process.cwd(), '.next');
    const stats = await fs.stat(buildDir);
    
    if (!stats.isDirectory()) {
      throw new Error('Build directory not found');
    }

    spinner.succeed('Build completed successfully');
  } catch (error) {
    spinner.fail('Build failed');
    console.error(error);
    process.exit(1);
  }
}

async function deployToVercel(options: DeploymentOptions) {
  const spinner = ora(`Deploying to ${options.environment}...`).start();

  try {
    // Pull Vercel environment
    await execAsync(
      `vercel pull --yes --environment=${options.environment} --token=${process.env.VERCEL_TOKEN}`,
      { stdio: 'pipe' }
    );

    // Deploy based on environment
    let deployCommand = 'vercel deploy --token=$VERCEL_TOKEN';
    
    if (options.environment === 'production') {
      deployCommand += ' --prod';
    }

    if (options.skipBuild) {
      deployCommand += ' --prebuilt';
    }

    const { stdout } = await execAsync(deployCommand, {
      env: process.env
    });

    const deploymentUrl = stdout.trim().split('\n').pop();
    
    spinner.succeed(`Deployed to ${options.environment}`);
    console.log(chalk.green(`\n🚀 Deployment URL: ${deploymentUrl}`));

    // Run post-deployment checks
    await postDeploymentChecks(deploymentUrl!);

    return deploymentUrl;
  } catch (error) {
    spinner.fail('Deployment failed');
    console.error(error);
    process.exit(1);
  }
}

async function postDeploymentChecks(url: string) {
  const spinner = ora('Running post-deployment checks...').start();

  try {
    // Check if site is accessible
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Site returned ${response.status}`);
    }

    // Check critical endpoints
    const endpoints = ['/api/health', '/dashboard', '/prompts', '/folders'];
    
    for (const endpoint of endpoints) {
      const res = await fetch(`${url}${endpoint}`);
      if (!res.ok && res.status !== 401) { // 401 is OK for auth-protected routes
        console.warn(chalk.yellow(`\n⚠️  ${endpoint} returned ${res.status}`));
      }
    }

    spinner.succeed('Post-deployment checks passed');
  } catch (error) {
    spinner.fail('Post-deployment checks failed');
    console.error(error);
  }
}

async function main() {
  console.log(chalk.cyan(`
╔════════════════════════════════════════════╗
║        🚀 VERCEL DEPLOYMENT TOOL 🚀         ║
╚════════════════════════════════════════════╝
`));

  // Parse command line arguments
  const args = process.argv.slice(2);
  const environment = args[0] as DeploymentOptions['environment'] || 'preview';
  
  const options: DeploymentOptions = {
    environment,
    skipTests: args.includes('--skip-tests'),
    skipBuild: args.includes('--skip-build'),
    force: args.includes('--force')
  };

  if (!['production', 'preview', 'development'].includes(environment)) {
    console.error(chalk.red('Invalid environment. Use: production, preview, or development'));
    process.exit(1);
  }

  // Confirmation for production
  if (environment === 'production' && !options.force) {
    console.log(chalk.yellow('\n⚠️  You are about to deploy to PRODUCTION!'));
    console.log('Add --force to skip this confirmation\n');
    
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const answer = await new Promise<string>(resolve => {
      readline.question('Type "deploy" to continue: ', resolve);
    });

    readline.close();

    if (answer !== 'deploy') {
      console.log(chalk.red('Deployment cancelled'));
      process.exit(0);
    }
  }

  try {
    // Run deployment steps
    await checkPrerequisites();

    if (!options.skipTests) {
      await runTests();
    }

    if (!options.skipBuild) {
      await buildProject();
    }

    const deploymentUrl = await deployToVercel(options);

    // Success message
    console.log(chalk.green(`
✅ Deployment successful!

Environment: ${environment}
URL: ${deploymentUrl}
Time: ${new Date().toISOString()}

Next steps:
1. Check the deployment: ${deploymentUrl}
2. Monitor error logs: ${deploymentUrl}/api/errors
3. View performance metrics: ${deploymentUrl}/api/monitoring/vitals
`));

  } catch (error) {
    console.error(chalk.red('\n❌ Deployment failed:'), error);
    process.exit(1);
  }
}

// Show help
if (process.argv.includes('--help')) {
  console.log(`
Usage: npm run deploy:vercel [environment] [options]

Environments:
  production    Deploy to production (requires confirmation)
  preview       Deploy to preview (default)
  development   Deploy to development

Options:
  --skip-tests  Skip running tests
  --skip-build  Skip building (use existing build)
  --force       Skip production confirmation
  --help        Show this help message

Examples:
  npm run deploy:vercel preview
  npm run deploy:vercel production --force
  npm run deploy:vercel preview --skip-tests
`);
  process.exit(0);
}

// Run deployment
main().catch(console.error);