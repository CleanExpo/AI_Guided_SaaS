#!/usr/bin/env tsx
// Temporary disable for TypeScript compliance


// import { Command } from 'commander';
import { EnvManager } from '../src/lib/env/EnvManager';
// chalk import disabled for now
// ora import disabled for now
// inquirer import disabled for now
import fs from 'fs';
import path from 'path';

const program = new Command();
const envManager = new EnvManager();

program
  .name('env-manager')
  .description('Dynamic Environment Variable Manager for AI SaaS')
  .version('1.0.0');

// Validate command
program
  .command('validate')
  .description('Validate environment variables against schema')
  .option('-e, --env <environment>', 'Environment to validate', 'development')
  .action((options) => {
    const spinner = ora('Validating environment variables...').start();
    
    try {
      const result = envManager.validate(options.env);
      spinner.stop();
      
      console.log(envManager.generateReport());
      
      if (!result.isValid) {
        console.log(chalk.red('\n❌ Validation failed!'));
        process.exit(1);
      } else {
        console.log(chalk.green('\n✅ All environment variables are valid!'));
      }
    } catch (error) {
      spinner.fail('Validation failed');
      console.error(error);
      process.exit(1);
    }
  });

// Check command
program
  .command('check')
  .description('Quick check of environment status')
  .action(() => {
    const status = envManager.getStatus();
    
    console.log(chalk.bold('\n🔍 Quick Environment Check\n'));
    
    if (status.isValid) {
      console.log(chalk.green('✅ Environment is properly configured'));
    } else {
      console.log(chalk.red('❌ Environment has issues'));
    }
    
    console.log(`\nEnvironment: ${chalk.cyan(status.environment)}`);
    console.log(`Valid: ${chalk.green(status.summary.valid)}/${status.summary.total}`);
    
    if (status.summary.missing > 0) {
      console.log(chalk.red(`Missing: ${status.summary.missing} required variables`));
    }
    if (status.summary.warnings > 0) {
      console.log(chalk.yellow(`Warnings: ${status.summary.warnings}`));
    }
  });

// Sync command
program
  .command('sync')
  .description('Sync environment variables with configuration')
  .action(async () => {
    const spinner = ora('Syncing environment variables...').start();
    
    try {
      await envManager.sync();
      spinner.succeed('Environment synchronized');
      
      console.log(chalk.green('\n✅ Configuration updated with current environment'));
    } catch (error) {
      spinner.fail('Sync failed');
      console.error(error);
      process.exit(1);
    }
  });

// History command
program
  .command('history')
  .description('Show environment variable change history')
  .option('-n, --number <count>', 'Number of entries to show', '10')
  .action((options) => {
    const historyPath = path.join(process.cwd(), '.docs', 'env.history.log');
    
    if (!fs.existsSync(historyPath)) {
      console.log(chalk.yellow('No history found'));
      return;
    }
    
    const history = JSON.parse(fs.readFileSync(historyPath, 'utf-8'));
    const count = parseInt(options.number);
    const recent = history.slice(-count).reverse();
    
    console.log(chalk.bold('\n📜 Environment Variable History\n'));
    
    for (const entry of recent) {
      const date = new Date(entry.timestamp).toLocaleString();
      console.log(chalk.gray(`[${date}]`));
      console.log(`  Action: ${chalk.cyan(entry.action)}`);
      console.log(`  User: ${entry.user}`);
      console.log(`  Environment: ${entry.environment}`);
      console.log(`  Changes: ${entry.changes.message}`);
      console.log('');
    }
  });

// Compact command
program
  .command('compact')
  .description('Remove unused variables from configuration')
  .action(async () => {
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'This will remove unused variables from config. Continue?',
        default: false
      }
    ]);
    
    if (confirm) {
      const spinner = ora('Compacting configuration...').start();
      
      try {
        envManager.compact();
        spinner.succeed('Configuration compacted');
        console.log(chalk.green('\n✅ Unused variables removed'));
      } catch (error) {
        spinner.fail('Compact failed');
        console.error(error);
        process.exit(1);
      }
    }
  });

// Setup command
program
  .command('setup')
  .description('Interactive setup for missing environment variables')
  .action(async () => {
    const validation = envManager.validate();
    const missingVars = validation.errors.filter(e => e.severity === 'error' && e.message.includes('missing'));
    
    if (missingVars.length === 0) {
      console.log(chalk.green('✅ All required variables are set!'));
      return;
    }
    
    console.log(chalk.yellow(`\n⚠️  Found ${missingVars.length} missing required variables\n`));
    
    const configPath = path.join(process.cwd(), '.docs', 'env.config.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    const envPath = path.join(process.cwd(), '.env.local');
    let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf-8') : '';
    
    for (const error of missingVars) {
      const service = config.services[error.service];
      const varConfig = service.variables[error.variable];
      
      console.log(chalk.bold(`\n${service.name} - ${error.variable}`));
      console.log(chalk.gray(varConfig.description));
      
      if (varConfig.example) {
        console.log(chalk.gray(`Example: ${varConfig.example}`));
      }
      
      const { value } = await inquirer.prompt([
        {
          type: varConfig.sensitive ? 'password' : 'input',
          name: 'value',
          message: `Enter value for ${error.variable}:`,
          validate: (input) => {
            if (!input) return 'Value is required';
            if (varConfig.pattern) {
              const regex = new RegExp(varConfig.pattern);
              if (!regex.test(input)) {
                return `Value must match, pattern: ${varConfig.pattern}`;
              }
            }
            return true;
          }
        }
      ]);
      
      // Add to env file
      if (!envContent.includes(`${error.variable}=`)) {
        envContent += `\n${error.variable}=${value}`;
      }
    }
    
    // Write updated env file
    fs.writeFileSync(envPath, envContent.trim() + '\n');
    console.log(chalk.green(`\n✅ Updated ${envPath} with ${missingVars.length} variables`));
  });

// Export command
program
  .command('export')
  .description('Export environment status as JSON')
  .option('-o, --output <file>', 'Output file', 'env-status.json')
  .action((options) => {
    const status = envManager.getStatus();
    fs.writeFileSync(options.output, JSON.stringify(status, null, 2));
    console.log(chalk.green(`✅ Status exported to ${options.output}`));
  });

// Pre-deploy hook command
program
  .command('pre-deploy')
  .description('Pre-deployment environment check')
  .action(() => {
    console.log(chalk.bold('\n🚀 Pre-Deployment Environment Check\n'));
    
    const validation = envManager.validate(process.env.NODE_ENV || 'production');
    
    // Check critical services
    const criticalServices = ['supabase', 'redis', 'nextauth', 'stripe'];
    let criticalErrors = 0;
    
    for (const error of validation.errors) {
      if (error.severity === 'error' && criticalServices.includes(error.service)) {
        console.log(chalk.red(`❌ Critical: ${error.service}.${error.variable} - ${error.message}`));
        criticalErrors++;
      }
    }
    
    if (criticalErrors > 0) {
      console.log(chalk.red(`\n❌ Deployment, blocked: ${criticalErrors} critical errors found`));
      process.exit(1);
    } else if (validation.errors.filter(e => e.severity === 'error').length > 0) {
      console.log(chalk.yellow('\n⚠️  Non-critical errors found, deployment allowed with warnings'));
    } else {
      console.log(chalk.green('\n✅ Environment ready for deployment!'));
    }
  });

program.parse();