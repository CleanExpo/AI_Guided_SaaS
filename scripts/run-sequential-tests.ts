#!/usr/bin/env tsx
import { exec } from 'child_process';
import { promisify } from 'util';
import chalk from 'chalk';

const execAsync = promisify(exec);

async function runSequentialTests() {
  console.log(chalk.blue.bold('\n🧪 Running Sequential Evaluation Tests\n'));
  
  const tests = [
    { name: 'Dashboard', grep: 'Dashboard' },
    { name: 'Prompts', grep: 'Prompts' },
    { name: 'Folders', grep: 'Folders' }
  ];
  
  const results = {};
  
  for (const test of tests) {
    console.log(chalk.cyan(`\nTesting ${test.name}...`));
    
    try {
      const { stdout } = await execAsync(
        `npx playwright test tests/evaluation-suite.spec.ts --config=playwright-eval.config.ts --grep=${test.grep} --reporter=json`
      );
      
      const match = stdout.match(/Score: ([\d.]+)\/10/);
      if (match) {
        results[test.name] = parseFloat(match[1]);
        console.log(chalk.green(`✓ ${test.name}: ${match[1]}/10`));
      }
    } catch (error) {
      console.error(chalk.red(`✗ ${test.name} test failed`));
      results[test.name] = 0;
    }
  }
  
  const overall = Object.values(results).reduce((a, b) => a + b, 0) / Object.keys(results).length;
  
  console.log(chalk.blue.bold('\n📊 Final Scores:'));
  console.log(chalk.white(`Dashboard: ${results.Dashboard || 0}/10`));
  console.log(chalk.white(`Prompts: ${results.Prompts || 0}/10`));
  console.log(chalk.white(`Folders: ${results.Folders || 0}/10`));
  console.log(chalk.green.bold(`\nOverall: ${overall.toFixed(1)}/10\n`));
}

runSequentialTests().catch(console.error);
