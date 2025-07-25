#!/usr/bin/env tsx
import * as fs from 'fs/promises';
import * as path from 'path';
import chalk from 'chalk';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function setupAutoImprovement() {
  console.log(chalk.blue.bold('\n🤖 Setting Up Automated Improvement Pipeline\n'));

  // Create a GitHub Action for continuous evaluation
  const githubActionContent = `name: Continuous Evaluation & Improvement

on:
  schedule:
    - cron: '0 */6 * * *' # Run every 6 hours
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  evaluate-and-improve:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Install Playwright browsers
        run: npx playwright install chromium
        
      - name: Start application
        run: |
          npm run dev &
          sleep 10
          
      - name: Run evaluation
        id: evaluate
        run: |
          npm run eval:run > evaluation-output.txt
          SCORE=$(grep "Overall:" evaluation-output.txt | grep -oP '\\d+\\.\\d+')
          echo "score=\${SCORE}" >> $GITHUB_OUTPUT
          
      - name: Check if improvements needed
        if: steps.evaluate.outputs.score < 8
        run: npm run eval:improve
        
      - name: Generate report
        run: npm run eval:report
        
      - name: Upload evaluation results
        uses: actions/upload-artifact@v3
        with:
          name: evaluation-results
          path: evaluation-results/
          
      - name: Comment on PR (if applicable)
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v6
        with:
          script: |
            const score = '\${{ steps.evaluate.outputs.score }}';
            const emoji = score >= 8 ? '✅' : score >= 6 ? '⚠️' : '❌';
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '## ' + emoji + ' Evaluation Results\\n\\nOverall Score: **' + score + '/10**\\n\\n[View detailed report](https://github.com/' + context.repo.owner + '/' + context.repo.repo + '/actions/runs/' + context.runId + ')'
            });
`;

  const githubDir = path.join(process.cwd(), '.github', 'workflows');
  await fs.mkdir(githubDir, { recursive: true });
  await fs.writeFile(
    path.join(githubDir, 'continuous-evaluation.yml'),
    githubActionContent
  );
  console.log(chalk.green('✓ Created GitHub Action for continuous evaluation'));

  // Create a pre-commit hook
  const preCommitHook = `#!/bin/sh
# Pre-commit hook for evaluation

echo "🧪 Running quick evaluation check..."

# Run a quick evaluation on changed components
CHANGED_COMPONENTS=$(git diff --cached --name-only | grep -E "(Dashboard|Prompts|Folders)" | head -1)

if [ ! -z "$CHANGED_COMPONENTS" ]; then
  echo "📊 Evaluating changed components..."
  npm run eval:run -- --quick
  
  SCORE=$(grep "Overall:" evaluation-results/latest.json | grep -oP '\\d+\\.\\d+')
  
  if [ $(echo "$SCORE < 8" | bc) -eq 1 ]; then
    echo "⚠️  Warning: Overall score is $SCORE/10 (below 8/10)"
    echo "Consider running: npm run eval:improve"
    echo "Continue anyway? (y/n)"
    read -r response
    if [ "$response" != "y" ]; then
      echo "Commit aborted. Please improve the score first."
      exit 1
    fi
  else
    echo "✅ Score is $SCORE/10 - looking good!"
  fi
fi

exit 0
`;

  const hooksDir = path.join(process.cwd(), '.git', 'hooks');
  try {
    await fs.mkdir(hooksDir, { recursive: true });
    await fs.writeFile(
      path.join(hooksDir, 'pre-commit'),
      preCommitHook,
      { mode: 0o755 }
    );
    console.log(chalk.green('✓ Created pre-commit hook'));
  } catch (error) {
    console.log(chalk.yellow('⚠ Could not create pre-commit hook (not a git repository?)'));
  }

  // Create automated improvement configuration
  const autoImprovementConfig = {
    enabled: true,
    schedule: {
      interval: 'hourly',
      times: ['09:00', '15:00', '21:00']
    },
    thresholds: {
      autoImprove: 7,
      alert: 5,
      target: 8.5
    },
    improvements: {
      lowRisk: {
        enabled: true,
        maxPerRun: 5
      },
      mediumRisk: {
        enabled: false,
        requiresApproval: true
      },
      highRisk: {
        enabled: false,
        requiresManualIntervention: true
      }
    },
    notifications: {
      slack: {
        enabled: false,
        webhook: process.env.SLACK_WEBHOOK_URL
      },
      email: {
        enabled: false,
        recipients: []
      }
    }
  };

  await fs.writeFile(
    path.join(process.cwd(), 'auto-improvement-config.json'),
    JSON.stringify(autoImprovementConfig, null, 2)
  );
  console.log(chalk.green('✓ Created auto-improvement configuration'));

  // Create a monitoring script
  const monitoringScript = `#!/usr/bin/env tsx
import * as fs from 'fs/promises';
import chalk from 'chalk';

async function monitorScores() {
  console.log(chalk.blue('📊 Starting score monitoring...\\n'));
  
  setInterval(async () => {
    try {
      const latest = JSON.parse(
        await fs.readFile('evaluation-results/latest.json', 'utf-8')
      );
      
      const time = new Date().toLocaleTimeString();
      const overall = latest.overall;
      const trend = overall >= 8 ? '✅' : overall >= 6 ? '⚠️' : '❌';
      
      console.log(\`[\${time}] \${trend} Overall: \${overall}/10\`);
      
      // Alert if score drops below threshold
      if (overall < 7) {
        console.log(chalk.red('🚨 ALERT: Score below threshold!'));
        console.log(chalk.yellow('Running auto-improvements...'));
        // Would trigger auto-improvements here
      }
    } catch (error) {
      console.error(chalk.red('Error reading evaluation results'));
    }
  }, 60000); // Check every minute
}

monitorScores().catch(console.error);
`;

  await fs.writeFile(
    path.join(process.cwd(), 'scripts/monitor-scores.ts'),
    monitoringScript
  );
  console.log(chalk.green('✓ Created monitoring script'));

  // Update package.json with new scripts
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
  
  packageJson.scripts = {
    ...packageJson.scripts,
    'eval:monitor': 'tsx scripts/monitor-scores.ts',
    'eval:auto-improve': 'tsx scripts/eval-improve.ts --auto',
    'eval:pipeline': 'npm run eval:run && npm run eval:auto-improve && npm run eval:report'
  };
  
  await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log(chalk.green('✓ Updated package.json with new scripts'));

  console.log(chalk.green.bold('\n✅ Automated improvement pipeline set up!\n'));
  
  console.log(chalk.cyan('Available commands:'));
  console.log(chalk.white('• npm run eval:monitor - Real-time score monitoring'));
  console.log(chalk.white('• npm run eval:auto-improve - Apply safe improvements'));
  console.log(chalk.white('• npm run eval:pipeline - Full evaluation pipeline\n'));
  
  console.log(chalk.cyan('Next steps:'));
  console.log(chalk.white('1. Commit the GitHub Action to enable CI/CD evaluation'));
  console.log(chalk.white('2. Configure notification webhooks in auto-improvement-config.json'));
  console.log(chalk.white('3. Start the monitoring dashboard at /evaluation\n'));
}

setupAutoImprovement().catch(console.error);