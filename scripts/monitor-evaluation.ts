#!/usr/bin/env tsx

import { getEvaluationMonitor } from '../src/services/evaluation-monitor';
import { exec } from 'child_process';
import { promisify } from 'util';
import chalk from 'chalk';

const execAsync = promisify(exec);

async function runEvaluation(): Promise<void> {
  console.log(chalk.blue('🔄 Running evaluation tests...'));
  
  try {
    const { stdout, stderr } = await execAsync('npm run eval:run', {
      maxBuffer: 1024 * 1024 * 10 // 10MB buffer
    });
    
    if (stderr && !stderr.includes('npx playwright')) {
      console.error(chalk.red('Evaluation errors:'), stderr);
    }
    
    console.log(chalk.green('✅ Evaluation completed'));
  } catch (error: any) {
    console.error(chalk.red('❌ Evaluation failed:'), error.message);
  }
}

async function startMonitoring() {
  console.log(chalk.cyan(`
╔════════════════════════════════════════════╗
║     🎯 EVALUATION MONITORING SYSTEM 🎯      ║
╚════════════════════════════════════════════╝
`));

  const monitor = getEvaluationMonitor();
  const checkInterval = parseInt(process.env.EVAL_CHECK_INTERVAL || '300000'); // 5 minutes default
  const runTests = process.env.EVAL_RUN_TESTS !== 'false';
  
  // Set up event listeners
  monitor.on('monitoring:started', () => {
    console.log(chalk.green('✅ Monitoring started'));
    console.log(chalk.gray(`Check interval: ${checkInterval / 1000}s`));
    console.log(chalk.gray(`Auto-run tests: ${runTests}`));
  });

  monitor.on('scores:updated', (scores) => {
    console.log(chalk.blue('\n📊 Current Scores:'));
    console.log(`  Dashboard: ${formatScore(scores.scores.dashboard.total)}`);
    console.log(`  Prompts:   ${formatScore(scores.scores.prompts.total)}`);
    console.log(`  Folders:   ${formatScore(scores.scores.folders.total)}`);
    console.log(`  Overall:   ${formatScore(scores.overall)}`);
  });

  monitor.on('score:changed', ({ component, oldScore, newScore, improved }) => {
    const emoji = improved ? '📈' : '📉';
    const color = improved ? chalk.green : chalk.red;
    console.log(color(`\n${emoji} ${component} score changed: ${oldScore} → ${newScore}`));
  });

  monitor.on('threshold:critical', ({ component, score }) => {
    console.log(chalk.red(`\n🚨 CRITICAL: ${component} score is ${score}/10`));
    notifyDiscord(`🚨 CRITICAL: ${component} evaluation score dropped to ${score}/10`);
  });

  monitor.on('threshold:warning', ({ component, score }) => {
    console.log(chalk.yellow(`\n⚠️  WARNING: ${component} score is ${score}/10`));
  });

  monitor.on('threshold:excellent', ({ component, score }) => {
    console.log(chalk.green(`\n🎉 EXCELLENT: ${component} score is ${score}/10`));
  });

  monitor.on('overall:critical', (score) => {
    console.log(chalk.red(`\n🚨 CRITICAL: Overall score is ${score}/10`));
    notifyDiscord(`🚨 CRITICAL: Overall evaluation score dropped to ${score}/10`);
  });

  monitor.on('error', (error) => {
    console.error(chalk.red('\n❌ Error:'), error);
  });

  // Start monitoring
  await monitor.startMonitoring(checkInterval);

  // Run initial evaluation if enabled
  if (runTests) {
    await runEvaluation();
  }

  // Set up evaluation runner
  if (runTests) {
    setInterval(async () => {
      console.log(chalk.blue('\n🔄 Running scheduled evaluation...'));
      await runEvaluation();
    }, checkInterval);
  }

  // Generate periodic reports
  setInterval(async () => {
    const report = await monitor.generateReport();
    console.log(chalk.cyan('\n📋 Monitoring Report:'));
    console.log(report);
    
    // Check stability
    const stability = monitor.getScoreStability();
    const unstableComponents = stability.filter(s => s.stability < 70);
    
    if (unstableComponents.length > 0) {
      console.log(chalk.yellow('\n⚠️  Unstable components detected:'));
      for (const { component, stability: stab } of unstableComponents) {
        console.log(`  - ${component}: ${stab}% stability`);
      }
    }
  }, 600000); // Every 10 minutes

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log(chalk.yellow('\n\n👋 Stopping monitoring...'));
    monitor.stopMonitoring();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    monitor.stopMonitoring();
    process.exit(0);
  });
}

function formatScore(score: number): string {
  const color = score >= 9 ? chalk.green :
               score >= 8 ? chalk.blue :
               score >= 7 ? chalk.yellow :
               chalk.red;
  
  const emoji = score >= 9 ? '🟢' :
                score >= 8 ? '🔵' :
                score >= 7 ? '🟡' :
                '🔴';
  
  return color(`${score.toFixed(1)}/10 ${emoji}`);
}

async function notifyDiscord(message: string): Promise<void> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  
  if (!webhookUrl) {
    return;
  }
  
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: message,
        username: 'Evaluation Monitor',
        avatar_url: 'https://example.com/bot-avatar.png'
      })
    });
  } catch (error) {
    console.error(chalk.red('Failed to send Discord notification:'), error);
  }
}

// Display help
if (process.argv.includes('--help')) {
  console.log(`
${chalk.cyan('Evaluation Monitoring System')}

${chalk.yellow('Usage:')}
  npm run eval:monitor [options]

${chalk.yellow('Options:')}
  --help              Show this help message
  --interval <ms>     Check interval in milliseconds (default: 300000)
  --no-tests          Don't run evaluation tests automatically

${chalk.yellow('Environment Variables:')}
  EVAL_CHECK_INTERVAL    Check interval in milliseconds
  EVAL_RUN_TESTS         Set to 'false' to disable automatic test runs
  DISCORD_WEBHOOK_URL    Discord webhook for notifications

${chalk.yellow('Examples:')}
  npm run eval:monitor
  npm run eval:monitor --interval 60000
  npm run eval:monitor --no-tests
  `);
  process.exit(0);
}

// Parse command line arguments
const args = process.argv.slice(2);
const intervalIndex = args.indexOf('--interval');
if (intervalIndex !== -1 && args[intervalIndex + 1]) {
  process.env.EVAL_CHECK_INTERVAL = args[intervalIndex + 1];
}
if (args.includes('--no-tests')) {
  process.env.EVAL_RUN_TESTS = 'false';
}

// Start monitoring
startMonitoring().catch(error => {
  console.error(chalk.red('Failed to start monitoring:'), error);
  process.exit(1);
});