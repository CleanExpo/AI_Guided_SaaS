#!/usr/bin/env tsx
import * as fs from 'fs/promises';
import * as path from 'path';
import chalk from 'chalk';

interface EvaluationResult {
  timestamp: string;
  scores: {
    dashboard: any;
    prompts: any;
    folders: any;
  };
  overall: number;
  recommendations: string[];
}

async function generateReport() {
  console.log(chalk.blue.bold('\n📊 Generating Comprehensive Evaluation Report\n'));

  try {
    // Load latest evaluation results
    const latestPath = path.join(process.cwd(), 'evaluation-results', 'latest.json');
    const latest: EvaluationResult = JSON.parse(await fs.readFile(latestPath, 'utf-8'));
    
    // Load history if available
    let history: any[] = [];
    try {
      const historyPath = path.join(process.cwd(), 'evaluation-results', 'history.json');
      history = JSON.parse(await fs.readFile(historyPath, 'utf-8'));
    } catch {
      console.log(chalk.yellow('No history data available yet'));
    }
    
    // Generate report sections
    printHeader(latest);
    printScoresSummary(latest);
    printDetailedScores(latest);
    printRecommendations(latest);
    printTrendAnalysis(history);
    printActionItems(latest);
    
    // Save formatted report
    const reportContent = generateMarkdownReport(latest, history);
    const reportPath = path.join(process.cwd(), 'evaluation-results', 'report.md');
    await fs.writeFile(reportPath, reportContent);
    console.log(chalk.green(`\n✅ Report saved to: ${reportPath}`));
    
    // Generate format-specific reports if requested
    const format = process.argv.includes('--format') ? 
      process.argv[process.argv.indexOf('--format') + 1] : null;
    
    if (format === 'slack') {
      const slackReport = generateSlackReport(latest);
      console.log(chalk.cyan('\n📱 Slack-formatted report:'));
      console.log(slackReport);
    }
    
  } catch (error) {
    console.error(chalk.red('Failed to generate report:'), error);
  }
}

function printHeader(result: EvaluationResult) {
  console.log(chalk.cyan('═'.repeat(60)));
  console.log(chalk.cyan.bold('  SENIOR PRODUCT DEVELOPER AI EVALUATION REPORT'));
  console.log(chalk.cyan('═'.repeat(60)));
  console.log(chalk.gray(`Generated: ${new Date(result.timestamp).toLocaleString()}`));
  console.log();
}

function printScoresSummary(result: EvaluationResult) {
  console.log(chalk.white.bold('📊 EXECUTIVE SUMMARY'));
  console.log(chalk.gray('─'.repeat(60)));
  
  const getScoreEmoji = (score: number) => {
    if (score >= 9) return '🌟';
    if (score >= 8) return '✅';
    if (score >= 7) return '👍';
    if (score >= 6) return '⚠️';
    if (score >= 5) return '❌';
    return '💀';
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 8) return chalk.green;
    if (score >= 6) return chalk.yellow;
    return chalk.red;
  };
  
  console.log(chalk.white('Component Scores:'));
  Object.entries(result.scores).forEach(([component, scoreData]) => {
    const score = scoreData.total;
    const emoji = getScoreEmoji(score);
    const color = getScoreColor(score);
    console.log(`  ${emoji} ${component.padEnd(12)} ${color(score.toFixed(1))}/10`);
  });
  
  console.log();
  console.log(chalk.white.bold(`🏆 Overall Score: ${getScoreColor(result.overall)(result.overall.toFixed(1))}/10`));
  
  // Production readiness assessment
  const readiness = result.overall >= 8 ? 'PRODUCTION READY' :
                   result.overall >= 6 ? 'NEEDS IMPROVEMENTS' :
                   'NOT READY';
  const readinessColor = result.overall >= 8 ? chalk.green :
                        result.overall >= 6 ? chalk.yellow :
                        chalk.red;
  
  console.log(chalk.white.bold(`🚀 Status: ${readinessColor(readiness)}`));
  console.log();
}

function printDetailedScores(result: EvaluationResult) {
  console.log(chalk.white.bold('📋 DETAILED BREAKDOWN'));
  console.log(chalk.gray('─'.repeat(60)));
  
  Object.entries(result.scores).forEach(([component, scoreData]) => {
    console.log(chalk.cyan.bold(`\n${component.toUpperCase()}`));
    console.log(`Overall: ${scoreData.total}/10`);
    
    // Show dimension scores
    ['functionality', 'usability', 'performance', 'design', 'testing'].forEach(dimension => {
      if (scoreData[dimension] !== undefined) {
        const score = scoreData[dimension];
        const bar = '█'.repeat(Math.floor(score)) + '░'.repeat(10 - Math.floor(score));
        console.log(`  ${dimension.padEnd(15)} ${bar} ${score.toFixed(1)}/10`);
      }
    });
  });
  console.log();
}

function printRecommendations(result: EvaluationResult) {
  if (result.recommendations.length === 0) return;
  
  console.log(chalk.white.bold('🎯 RECOMMENDATIONS'));
  console.log(chalk.gray('─'.repeat(60)));
  
  result.recommendations.forEach((rec, index) => {
    const priority = rec.includes('CRITICAL') ? chalk.red('●') :
                    rec.includes('HIGH') ? chalk.yellow('●') :
                    chalk.blue('●');
    console.log(`${priority} ${rec}`);
  });
  console.log();
}

function printTrendAnalysis(history: any[]) {
  if (history.length < 2) return;
  
  console.log(chalk.white.bold('📈 TREND ANALYSIS'));
  console.log(chalk.gray('─'.repeat(60)));
  
  const latest = history[history.length - 1];
  const previous = history[history.length - 2];
  
  const getTrendEmoji = (diff: number) => {
    if (diff > 0.5) return '📈';
    if (diff > 0) return '↗️';
    if (diff === 0) return '➡️';
    if (diff > -0.5) return '↘️';
    return '📉';
  };
  
  ['dashboard', 'prompts', 'folders'].forEach(component => {
    const diff = latest.scores[component] - previous.scores[component];
    const emoji = getTrendEmoji(diff);
    const color = diff > 0 ? chalk.green : diff < 0 ? chalk.red : chalk.gray;
    console.log(`  ${emoji} ${component.padEnd(12)} ${color(diff > 0 ? '+' : '')}${color(diff.toFixed(1))}`);
  });
  
  // Show velocity
  const recentHistory = history.slice(-5);
  const avgImprovement = recentHistory.reduce((acc, curr, idx) => {
    if (idx === 0) return 0;
    return acc + (curr.overall - recentHistory[idx - 1].overall);
  }, 0) / (recentHistory.length - 1);
  
  console.log(chalk.white(`\n📊 Average improvement per cycle: ${avgImprovement > 0 ? '+' : ''}${avgImprovement.toFixed(2)}`));
  console.log();
}

function printActionItems(result: EvaluationResult) {
  console.log(chalk.white.bold('✅ ACTION ITEMS'));
  console.log(chalk.gray('─'.repeat(60)));
  
  const actionItems: string[] = [];
  
  // Generate specific action items based on scores
  Object.entries(result.scores).forEach(([component, scoreData]) => {
    if (scoreData.functionality < 7) {
      actionItems.push(`Fix ${component} core functionality issues`);
    }
    if (scoreData.performance < 7) {
      actionItems.push(`Optimize ${component} performance`);
    }
    if (scoreData.usability < 6) {
      actionItems.push(`Improve ${component} user experience`);
    }
  });
  
  if (actionItems.length === 0) {
    actionItems.push('Continue monitoring and maintaining high standards');
    actionItems.push('Consider adding new features or enhancements');
  }
  
  actionItems.forEach((item, index) => {
    console.log(`${index + 1}. ${item}`);
  });
  console.log();
}

function generateMarkdownReport(result: EvaluationResult, history: any[]): string {
  let report = `# Senior Product Developer AI Evaluation Report\n\n`;
  report += `Generated: ${new Date(result.timestamp).toLocaleString()}\n\n`;
  
  report += `## Executive Summary\n\n`;
  report += `| Component | Score | Status |\n`;
  report += `|-----------|-------|--------|\n`;
  
  Object.entries(result.scores).forEach(([component, scoreData]) => {
    const status = scoreData.total >= 8 ? '✅ Excellent' :
                  scoreData.total >= 6 ? '⚠️ Needs Work' :
                  '❌ Critical';
    report += `| ${component} | ${scoreData.total}/10 | ${status} |\n`;
  });
  
  report += `\n**Overall Score:** ${result.overall}/10\n\n`;
  
  report += `## Detailed Scores\n\n`;
  Object.entries(result.scores).forEach(([component, scoreData]) => {
    report += `### ${component}\n`;
    report += `- Functionality: ${scoreData.functionality}/10\n`;
    report += `- Usability: ${scoreData.usability}/10\n`;
    report += `- Performance: ${scoreData.performance}/10\n`;
    report += `- Design: ${scoreData.design}/10\n`;
    report += `- Testing: ${scoreData.testing}/10\n\n`;
  });
  
  if (result.recommendations.length > 0) {
    report += `## Recommendations\n\n`;
    result.recommendations.forEach(rec => {
      report += `- ${rec}\n`;
    });
    report += '\n';
  }
  
  return report;
}

function generateSlackReport(result: EvaluationResult): string {
  const getStatusEmoji = (score: number) => score >= 8 ? '✅' : score >= 6 ? '⚠️' : '❌';
  
  let report = `*🎯 Evaluation Report - ${new Date(result.timestamp).toLocaleString()}*\n\n`;
  report += `*Component Scores:*\n`;
  
  Object.entries(result.scores).forEach(([component, scoreData]) => {
    report += `${getStatusEmoji(scoreData.total)} *${component}:* ${scoreData.total}/10\n`;
  });
  
  report += `\n*Overall:* ${result.overall}/10 ${getStatusEmoji(result.overall)}\n`;
  
  if (result.recommendations.length > 0) {
    report += `\n*Top Priorities:*\n`;
    result.recommendations.slice(0, 3).forEach(rec => {
      report += `• ${rec}\n`;
    });
  }
  
  return report;
}

// Run report generation
generateReport().catch(console.error);