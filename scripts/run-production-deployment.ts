#!/usr/bin/env tsx

/**
 * Run Production Deployment with Real Agents
 * Executes actual deployment tasks using the agent system
 */

import chalk from 'chalk';
import ora from 'ora';
import { agents } from './agents/production-deployment-agents';

interface DeploymentTask {
  id: string;
  name: string;
  agent: string;
  dependencies?: string[];
  critical?: boolean;
}

class ProductionDeploymentRunner {
  private tasks: DeploymentTask[] = [
    // Phase 1: Preparation
    {
      id: 'fix-production-scripts',
      name: 'Fix Production Scripts',
      agent: 'backend',
      critical: true
    },
    {
      id: 'setup-env-vars',
      name: 'Setup Environment Variables',
      agent: 'devops',
      critical: true
    },
    {
      id: 'fix-typescript-syntax',
      name: 'Analyze TypeScript Errors',
      agent: 'frontend',
      critical: false
    },

    // Phase 2: Validation
    {
      id: 'verify-dependencies',
      name: 'Verify Dependencies',
      agent: 'devops',
      dependencies: ['setup-env-vars'],
      critical: false
    },
    {
      id: 'run-build-test',
      name: 'Test Production Build',
      agent: 'qa',
      dependencies: ['fix-production-scripts'],
      critical: true
    },

    // Phase 3: Testing
    {
      id: 'run-tests',
      name: 'Run Test Suite',
      agent: 'qa',
      dependencies: ['run-build-test'],
      critical: false
    },
    {
      id: 'performance-check',
      name: 'Check Performance Metrics',
      agent: 'qa',
      dependencies: ['run-build-test'],
      critical: false
    },

    // Phase 4: Deployment Preparation
    {
      id: 'vercel-config',
      name: 'Configure Vercel',
      agent: 'devops',
      dependencies: ['setup-env-vars'],
      critical: true
    },
    {
      id: 'deploy-staging',
      name: 'Prepare Staging Deployment',
      agent: 'devops',
      dependencies: ['run-build-test', 'vercel-config'],
      critical: true
    }
  ];

  private completedTasks: Set<string> = new Set();
  private results: Map<string, any> = new Map();

  async run() {
    console.log(chalk.blue.bold('\n🚀 AI Guided SaaS - Production Deployment\n'));
    console.log(chalk.cyan('Using agent system to prepare for production deployment...\n'));

    // Start with architect planning
    await this.architectPlanning();

    // Execute tasks
    await this.executeTasks();

    // Review results
    await this.architectReview();

    // Display summary
    this.displaySummary();
  }

  private async architectPlanning() {
    const spinner = ora('Architect Agent: Planning deployment...').start();
    
    try {
      const result = await agents.architect.execute('plan-deployment');
      spinner.succeed('Architect Agent: Deployment plan created');
      
      if (result.plan) {
        console.log(chalk.gray('\n📋 Deployment Plan:'));
        result.plan.phases.forEach((phase: any) => {
          console.log(chalk.gray(`   ${phase.name} (${phase.duration})`));
        });
        console.log();
      }
    } catch (error) {
      spinner.fail('Architect Agent: Planning failed');
    }
  }

  private async executeTasks() {
    for (const task of this.tasks) {
      // Check dependencies
      if (task.dependencies) {
        const unmetDeps = task.dependencies.filter(dep => !this.completedTasks.has(dep));
        if (unmetDeps.length > 0) {
          console.log(chalk.yellow(`⏭️  Skipping ${task.name} (waiting for: ${unmetDeps.join(', ')})`));
          continue;
        }
      }

      // Execute task
      await this.executeTask(task);
    }

    // Check for remaining tasks
    const remainingTasks = this.tasks.filter(t => !this.completedTasks.has(t.id));
    if (remainingTasks.length > 0) {
      console.log(chalk.yellow('\n⚠️  Running second pass for dependent tasks...\n'));
      await this.executeTasks();
    }
  }

  private async executeTask(task: DeploymentTask) {
    const agent = agents[task.agent];
    if (!agent) {
      console.error(chalk.red(`❌ No agent found for type: ${task.agent}`));
      return;
    }

    const spinner = ora(`${task.agent.toUpperCase()} Agent: ${task.name}...`).start();

    try {
      const result = await agent.execute(task.id);
      this.results.set(task.id, result);
      this.completedTasks.add(task.id);

      if (result.success) {
        spinner.succeed(`${task.agent.toUpperCase()} Agent: ${task.name} - ${chalk.green('Success')}`);
        
        // Display additional info
        if (result.message) {
          console.log(chalk.gray(`   → ${result.message}`));
        }
        if (result.summary) {
          this.displayTaskSummary(result.summary);
        }
      } else {
        if (task.critical) {
          spinner.fail(`${task.agent.toUpperCase()} Agent: ${task.name} - ${chalk.red('Failed (Critical)')}`);
          if (result.message) {
            console.log(chalk.red(`   → ${result.message}`));
          }
          throw new Error('Critical task failed');
        } else {
          spinner.warn(`${task.agent.toUpperCase()} Agent: ${task.name} - ${chalk.yellow('Failed (Non-critical)')}`);
          if (result.message) {
            console.log(chalk.yellow(`   → ${result.message}`));
          }
        }
      }
    } catch (error) {
      this.results.set(task.id, { success: false, error: error.message });
      
      if (task.critical) {
        spinner.fail(`${task.agent.toUpperCase()} Agent: ${task.name} - ${chalk.red('Failed (Critical)')}`);
        console.error(chalk.red(`   → ${error.message}`));
        throw error;
      } else {
        spinner.warn(`${task.agent.toUpperCase()} Agent: ${task.name} - ${chalk.yellow('Failed')}`);
        console.error(chalk.yellow(`   → ${error.message}`));
      }
    }

    console.log(); // Add spacing between tasks
  }

  private displayTaskSummary(summary: any) {
    if (summary.total) {
      console.log(chalk.gray(`   → Total errors: ${summary.total}`));
    }
    if (summary.topErrors) {
      console.log(chalk.gray('   → Top errors:'));
      summary.topErrors.forEach((error: any) => {
        console.log(chalk.gray(`      - ${error.code}: ${error.count} occurrences`));
      });
    }
  }

  private async architectReview() {
    const spinner = ora('Architect Agent: Reviewing results...').start();
    
    try {
      const resultsObj = Object.fromEntries(this.results);
      const review = await agents.architect.execute('review-results', resultsObj);
      
      spinner.succeed('Architect Agent: Review completed');
      
      if (review.recommendation) {
        console.log(chalk.cyan(`\n💡 Recommendation: ${review.recommendation}`));
      }
    } catch (error) {
      spinner.fail('Architect Agent: Review failed');
    }
  }

  private displaySummary() {
    console.log(chalk.blue.bold('\n📊 Deployment Preparation Summary\n'));

    const successful = Array.from(this.results.entries())
      .filter(([_, result]) => result.success);
    const failed = Array.from(this.results.entries())
      .filter(([_, result]) => !result.success);

    console.log(chalk.green(`✅ Successful: ${successful.length}/${this.tasks.length}`));
    successful.forEach(([taskId, result]) => {
      const task = this.tasks.find(t => t.id === taskId);
      console.log(chalk.gray(`   - ${task?.name}`));
    });

    if (failed.length > 0) {
      console.log(chalk.red(`\n❌ Failed: ${failed.length}`));
      failed.forEach(([taskId, result]) => {
        const task = this.tasks.find(t => t.id === taskId);
        console.log(chalk.red(`   - ${task?.name}: ${result.message || result.error}`));
      });
    }

    // Next steps
    console.log(chalk.blue.bold('\n🎯 Next Steps:\n'));
    
    if (failed.length === 0) {
      console.log(chalk.green('1. Your application is ready for deployment!'));
      console.log(chalk.green('2. Run `vercel` to deploy to staging'));
      console.log(chalk.green('3. Test the staging deployment thoroughly'));
      console.log(chalk.green('4. Run `vercel --prod` to deploy to production'));
    } else {
      console.log(chalk.yellow('1. Review and fix the failed tasks above'));
      console.log(chalk.yellow('2. Update environment variables in .env.production'));
      console.log(chalk.yellow('3. Run this script again to verify fixes'));
      console.log(chalk.yellow('4. Once all tasks pass, deploy to Vercel'));
    }

    // Manual steps reminder
    console.log(chalk.cyan('\n📝 Manual Steps Required:'));
    console.log(chalk.cyan('1. Update .env.production with your actual API keys and database URLs'));
    console.log(chalk.cyan('2. Set up environment variables in Vercel dashboard'));
    console.log(chalk.cyan('3. Connect your GitHub repository to Vercel'));
    console.log(chalk.cyan('4. Configure custom domain (if applicable)'));
  }
}

// Run the deployment
async function main() {
  try {
    const runner = new ProductionDeploymentRunner();
    await runner.run();
    process.exit(0);
  } catch (error) {
    console.error(chalk.red('\n❌ Deployment preparation failed:'), error.message);
    process.exit(1);
  }
}

main();