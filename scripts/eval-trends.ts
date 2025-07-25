#!/usr/bin/env tsx
import * as fs from 'fs/promises';
import * as path from 'path';
import chalk from 'chalk';

interface HistoryEntry {
  cycle: number;
  timestamp: string;
  overall: number;
  scores: {
    dashboard: number;
    prompts: number;
    folders: number;
  };
}

async function analyzeTrends() {
  console.log(chalk.blue.bold('\n📈 Evaluation Trends Analysis\n'));

  try {
    // Load history
    const historyPath = path.join(process.cwd(), 'evaluation-results', 'history.json');
    const history: HistoryEntry[] = JSON.parse(await fs.readFile(historyPath, 'utf-8'));
    
    if (history.length < 2) {
      console.log(chalk.yellow('Not enough data for trend analysis. Need at least 2 evaluation cycles.'));
      return;
    }
    
    // Parse command line options
    const metric = process.argv.includes('--metric') ? 
      process.argv[process.argv.indexOf('--metric') + 1] : 'all';
    const days = process.argv.includes('--days') ? 
      parseInt(process.argv[process.argv.indexOf('--days') + 1]) : 30;
    
    // Filter history by date range
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const filteredHistory = history.filter(entry => 
      new Date(entry.timestamp) >= cutoffDate
    );
    
    console.log(chalk.cyan(`Analyzing ${filteredHistory.length} evaluation cycles from the last ${days} days\n`));
    
    // Overall trend
    printOverallTrend(filteredHistory);
    
    // Component trends
    printComponentTrends(filteredHistory);
    
    // Performance metrics
    if (metric === 'all' || metric === 'performance') {
      printPerformanceMetrics(filteredHistory);
    }
    
    // Improvement velocity
    printImprovementVelocity(filteredHistory);
    
    // Predictions
    printPredictions(filteredHistory);
    
    // Generate visual chart
    generateChart(filteredHistory);
    
  } catch (error) {
    console.error(chalk.red('Failed to analyze trends:'), error);
  }
}

function printOverallTrend(history: HistoryEntry[]) {
  console.log(chalk.white.bold('📊 OVERALL TREND'));
  console.log(chalk.gray('─'.repeat(60)));
  
  const first = history[0];
  const last = history[history.length - 1];
  const improvement = last.overall - first.overall;
  const percentChange = ((improvement / first.overall) * 100).toFixed(1);
  
  const trend = improvement > 0 ? chalk.green('↑') : improvement < 0 ? chalk.red('↓') : chalk.gray('→');
  console.log(`Starting Score: ${first.overall}/10`);
  console.log(`Current Score: ${last.overall}/10`);
  console.log(`Change: ${trend} ${improvement > 0 ? '+' : ''}${improvement.toFixed(1)} (${percentChange}%)\n`);
}

function printComponentTrends(history: HistoryEntry[]) {
  console.log(chalk.white.bold('📈 COMPONENT TRENDS'));
  console.log(chalk.gray('─'.repeat(60)));
  
  const components = ['dashboard', 'prompts', 'folders'] as const;
  const first = history[0];
  const last = history[history.length - 1];
  
  components.forEach(component => {
    const firstScore = first.scores[component];
    const lastScore = last.scores[component];
    const change = lastScore - firstScore;
    
    // Calculate trend direction
    const recentTrend = calculateRecentTrend(history, component);
    const trendIcon = recentTrend > 0.1 ? '📈' : 
                     recentTrend < -0.1 ? '📉' : 
                     '→';
    
    console.log(`${trendIcon} ${component.padEnd(12)} ${firstScore.toFixed(1)} → ${lastScore.toFixed(1)} (${change > 0 ? '+' : ''}${change.toFixed(1)})`);
  });
  console.log();
}

function calculateRecentTrend(history: HistoryEntry[], component: keyof HistoryEntry['scores']): number {
  if (history.length < 3) return 0;
  
  const recent = history.slice(-3);
  const changes = recent.slice(1).map((entry, idx) => 
    entry.scores[component] - recent[idx].scores[component]
  );
  
  return changes.reduce((a, b) => a + b, 0) / changes.length;
}

function printPerformanceMetrics(history: HistoryEntry[]) {
  console.log(chalk.white.bold('⚡ PERFORMANCE METRICS'));
  console.log(chalk.gray('─'.repeat(60)));
  
  // Time to reach targets
  const targets = { dashboard: 8, prompts: 8, folders: 8 };
  
  Object.entries(targets).forEach(([component, target]) => {
    const firstAboveTarget = history.find(entry => 
      entry.scores[component as keyof typeof entry.scores] >= target
    );
    
    if (firstAboveTarget) {
      const cyclesNeeded = firstAboveTarget.cycle;
      console.log(`${component}: Reached target (${target}/10) in ${cyclesNeeded} cycles`);
    } else {
      const current = history[history.length - 1].scores[component as keyof typeof history[0].scores];
      const remaining = target - current;
      const avgImprovement = calculateAverageImprovement(history, component as keyof HistoryEntry['scores']);
      const estimatedCycles = avgImprovement > 0 ? Math.ceil(remaining / avgImprovement) : '∞';
      console.log(`${component}: ${remaining.toFixed(1)} points to target (est. ${estimatedCycles} cycles)`);
    }
  });
  console.log();
}

function calculateAverageImprovement(history: HistoryEntry[], component: keyof HistoryEntry['scores']): number {
  if (history.length < 2) return 0;
  
  const improvements = history.slice(1).map((entry, idx) => 
    entry.scores[component] - history[idx].scores[component]
  );
  
  return improvements.reduce((a, b) => a + b, 0) / improvements.length;
}

function printImprovementVelocity(history: HistoryEntry[]) {
  console.log(chalk.white.bold('🚀 IMPROVEMENT VELOCITY'));
  console.log(chalk.gray('─'.repeat(60)));
  
  // Calculate velocity over different time periods
  const periods = [
    { name: 'Last 5 cycles', count: 5 },
    { name: 'Last 10 cycles', count: 10 },
    { name: 'All time', count: history.length }
  ];
  
  periods.forEach(period => {
    const relevantHistory = history.slice(-period.count);
    if (relevantHistory.length < 2) return;
    
    const velocity = (relevantHistory[relevantHistory.length - 1].overall - relevantHistory[0].overall) / 
                    (relevantHistory.length - 1);
    
    console.log(`${period.name.padEnd(15)} ${velocity > 0 ? '+' : ''}${velocity.toFixed(3)} points/cycle`);
  });
  console.log();
}

function printPredictions(history: HistoryEntry[]) {
  console.log(chalk.white.bold('🔮 PREDICTIONS'));
  console.log(chalk.gray('─'.repeat(60)));
  
  const avgImprovement = calculateAverageImprovement(history, 'dashboard');
  const current = history[history.length - 1];
  
  // Predict future scores
  const predictions = [
    { cycles: 5, label: '5 cycles' },
    { cycles: 10, label: '10 cycles' },
    { cycles: 20, label: '20 cycles' }
  ];
  
  predictions.forEach(pred => {
    const predictedOverall = Math.min(10, current.overall + (avgImprovement * pred.cycles));
    console.log(`After ${pred.label}: ${predictedOverall.toFixed(1)}/10`);
  });
  
  // Time to reach 9/10
  if (current.overall < 9 && avgImprovement > 0) {
    const cyclesToNine = Math.ceil((9 - current.overall) / avgImprovement);
    console.log(`\nEstimated cycles to reach 9/10: ${cyclesToNine}`);
  }
  console.log();
}

function generateChart(history: HistoryEntry[]) {
  console.log(chalk.white.bold('📊 VISUAL TREND'));
  console.log(chalk.gray('─'.repeat(60)));
  
  // Simple ASCII chart
  const maxScore = 10;
  const height = 10;
  const width = Math.min(50, history.length);
  
  // Sample data if too many points
  const step = Math.ceil(history.length / width);
  const sampledHistory = history.filter((_, idx) => idx % step === 0);
  
  // Create chart
  for (let y = height; y >= 0; y--) {
    const scoreThreshold = (y / height) * maxScore;
    let line = y === 0 ? '  └' : scoreThreshold === 10 ? '10┤' : ` ${scoreThreshold.toFixed(0)}┤`;
    
    sampledHistory.forEach(entry => {
      if (entry.overall >= scoreThreshold) {
        line += '█';
      } else {
        line += ' ';
      }
    });
    
    console.log(line);
  }
  
  console.log('  ' + '─'.repeat(sampledHistory.length + 1));
  console.log('    ' + 'Evaluation Cycles →');
  console.log();
  
  // Legend
  console.log(chalk.gray('Legend:'));
  console.log(chalk.blue('█') + ' Overall Score');
  console.log();
}

// Run trends analysis
analyzeTrends().catch(console.error);