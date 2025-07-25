#!/usr/bin/env tsx
import * as fs from 'fs/promises';
import chalk from 'chalk';

async function monitorScores() {
  console.log(chalk.blue('📊 Starting score monitoring...\n'));
  
  setInterval(async () => {
    try {
      const latest = JSON.parse(
        await fs.readFile('evaluation-results/latest.json', 'utf-8')
      );
      
      const time = new Date().toLocaleTimeString();
      const overall = latest.overall;
      const trend = overall >= 8 ? '✅' : overall >= 6 ? '⚠️' : '❌';
      
      console.log(`[${time}] ${trend} Overall: ${overall}/10`);
      
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
