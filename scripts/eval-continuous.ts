#!/usr/bin/env tsx
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';
import chalk from 'chalk';

const execAsync = promisify(exec);

interface EvaluationConfig {
  targetScores: {
    dashboard: number;
    prompts: number;
    folders: number;
  };
  continuousInterval: number;
  autoImproveThreshold: number;
  alertThreshold: number;
}

async function loadConfig(): Promise<EvaluationConfig> {
  try {
    const packageJson = JSON.parse(
      await fs.readFile(path.join(process.cwd(), 'package.json'), 'utf-8')
    );
    return packageJson.claudeCode?.evaluationConfig || {
      targetScores: { dashboard: 8, prompts: 8, folders: 8 },
      continuousInterval: 30,
      autoImproveThreshold: 7,
      alertThreshold: 5
    };
  } catch (error) {
    console.error('Failed to load config:', error);
    return {
      targetScores: { dashboard: 8, prompts: 8, folders: 8 },
      continuousInterval: 30,
      autoImproveThreshold: 7,
      alertThreshold: 5
    };
  }
}

async function runEvaluation() {
  console.log(chalk.blue(`\n🔄 Running evaluation at ${new Date().toLocaleString()}\n`));
  
  try {
    const { stdout, stderr } = await execAsync('npm run eval:run');
    
    if (stderr && !stderr.includes('DeprecationWarning')) {
      console.error(chalk.red('Evaluation error:'), stderr);
    }
    
    // Read the latest results
    const latestResults = JSON.parse(
      await fs.readFile(path.join(process.cwd(), 'evaluation-results', 'latest.json'), 'utf-8')
    );
    
    return latestResults;
  } catch (error) {
    console.error(chalk.red('Failed to run evaluation:'), error);
    return null;
  }
}

async function checkForAlerts(results: any, config: EvaluationConfig) {
  const alerts: string[] = [];
  
  // Check each component against alert threshold
  for (const [component, score] of Object.entries(results.scores)) {
    const componentScore = (score as any).total;
    if (componentScore < config.alertThreshold) {
      alerts.push(`🚨 CRITICAL: ${component} scored ${componentScore}/10 (below alert threshold)`);
    } else if (componentScore < config.targetScores[component as keyof typeof config.targetScores]) {
      alerts.push(`⚠️ WARNING: ${component} scored ${componentScore}/10 (below target)`);
    }
  }
  
  if (alerts.length > 0) {
    console.log(chalk.red('\n📢 ALERTS:'));
    alerts.forEach(alert => console.log(chalk.yellow(alert)));
    
    // If webhook URL is provided, send alerts
    if (process.env.ALERT_WEBHOOK) {
      await sendWebhookAlert(alerts.join('\n'));
    }
  }
}

async function sendWebhookAlert(message: string) {
  // Implement webhook notification (Slack, Discord, etc.)
  console.log(chalk.cyan('📤 Sending webhook alert...'));
}

async function checkForAutoImprovement(results: any, config: EvaluationConfig) {
  const componentsNeedingImprovement: string[] = [];
  
  for (const [component, score] of Object.entries(results.scores)) {
    const componentScore = (score as any).total;
    if (componentScore < config.autoImproveThreshold) {
      componentsNeedingImprovement.push(component);
    }
  }
  
  if (componentsNeedingImprovement.length > 0) {
    console.log(chalk.cyan('\n🔧 Auto-improvement needed for:'), componentsNeedingImprovement.join(', '));
    
    try {
      await execAsync('npm run eval:improve -- --components=' + componentsNeedingImprovement.join(','));
      console.log(chalk.green('✅ Auto-improvements applied'));
    } catch (error) {
      console.error(chalk.red('Failed to apply auto-improvements:'), error);
    }
  }
}

async function continuousEvaluation() {
  const config = await loadConfig();
  const intervalMinutes = parseInt(process.env.INTERVAL || String(config.continuousInterval));
  
  console.log(chalk.green.bold(`\n🚀 Starting continuous evaluation loop\n`));
  console.log(chalk.cyan(`⏰ Evaluation interval: ${intervalMinutes} minutes`));
  console.log(chalk.cyan(`🎯 Target scores: Dashboard=${config.targetScores.dashboard}, Prompts=${config.targetScores.prompts}, Folders=${config.targetScores.folders}`));
  console.log(chalk.cyan(`🔧 Auto-improve threshold: ${config.autoImproveThreshold}/10`));
  console.log(chalk.cyan(`🚨 Alert threshold: ${config.alertThreshold}/10\n`));
  
  let cycleCount = 0;
  
  // Initial evaluation
  await performEvaluationCycle(++cycleCount, config);
  
  // Set up interval
  setInterval(async () => {
    await performEvaluationCycle(++cycleCount, config);
  }, intervalMinutes * 60 * 1000);
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log(chalk.yellow('\n\n👋 Stopping continuous evaluation...'));
    process.exit(0);
  });
}

async function performEvaluationCycle(cycleNumber: number, config: EvaluationConfig) {
  console.log(chalk.blue.bold(`\n📊 EVALUATION CYCLE #${cycleNumber}`));
  console.log(chalk.gray('─'.repeat(50)));
  
  const results = await runEvaluation();
  
  if (results) {
    // Check for alerts
    await checkForAlerts(results, config);
    
    // Check for auto-improvement opportunities
    await checkForAutoImprovement(results, config);
    
    // Log summary
    console.log(chalk.green(`\n✅ Cycle #${cycleNumber} completed`));
    console.log(chalk.white(`📈 Overall score: ${results.overall}/10`));
    
    // Save cycle history
    const historyPath = path.join(process.cwd(), 'evaluation-results', 'history.json');
    let history: any[] = [];
    
    try {
      history = JSON.parse(await fs.readFile(historyPath, 'utf-8'));
    } catch {
      // File doesn't exist yet
    }
    
    history.push({
      cycle: cycleNumber,
      timestamp: new Date().toISOString(),
      overall: results.overall,
      scores: {
        dashboard: results.scores.dashboard.total,
        prompts: results.scores.prompts.total,
        folders: results.scores.folders.total
      }
    });
    
    // Keep only last 100 cycles
    if (history.length > 100) {
      history = history.slice(-100);
    }
    
    await fs.writeFile(historyPath, JSON.stringify(history, null, 2));
  }
  
  console.log(chalk.gray(`\nNext evaluation in ${config.continuousInterval} minutes...`));
}

// Start continuous evaluation
continuousEvaluation().catch(console.error);