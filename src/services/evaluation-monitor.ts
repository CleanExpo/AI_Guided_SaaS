import { EventEmitter } from 'events';
import fs from 'fs/promises';
import path from 'path';

export interface EvaluationScore {
  timestamp: string,
  scores: {
    dashboard: ComponentScore,
    prompts: ComponentScore,
    folders: ComponentScore
  };
  overall: number,
  recommendations: string[]
}

export interface ComponentScore {
  functionality: number,
  usability: number,
  performance: number,
  design: number,
  testing: number,
  total: number;
  details?: Record<string, any>;
}

export interface ScoreThresholds {
  critical: number,
  warning: number,
  good: number,
  excellent: number
}

export class EvaluationMonitor extends EventEmitter {
  private resultsPath: string;
  private thresholds: ScoreThresholds;
  private isMonitoring: boolean = false;
  private monitorInterval: NodeJS.Timeout | null = null;
  private lastScore: EvaluationScore | null = null;
  private scoreHistory: EvaluationScore[] = [];
  private maxHistorySize: number = 100;

  constructor(
    resultsPath: string = 'evaluation-results',
    thresholds: ScoreThresholds = {
      critical: 5,
      warning: 7,
      good: 8,
      excellent: 9
    }
  ) {
    super();
    this.resultsPath = resultsPath;
    this.thresholds = thresholds;
  }

  async startMonitoring(intervalMs: number = 30000): Promise<void> {
    if (this.isMonitoring) {
      
      return;
    }

    this.isMonitoring = true;
    
    // Initial check
    await this.checkScores();
    
    // Set up interval
    this.monitorInterval = setInterval(async () => {
      try {
        await this.checkScores();
      } catch (error) {
        this.emit('error', error);
      }
    }, intervalMs);

    this.emit('monitoring: started');
  }

  stopMonitoring(): void {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = null;
    }
    this.isMonitoring = false;
    this.emit('monitoring: stopped');
  }

  async checkScores(): Promise<void> {
    try {
      const latestPath = path.join(this.resultsPath, 'latest.json');
      const data = await fs.readFile(latestPath, 'utf-8');
      const scores: EvaluationScore = JSON.parse(data);
      
      // Compare with last score
      if (this.lastScore) {
        this.compareScores(this.lastScore, scores);
      }
      
      // Check thresholds
      this.checkThresholds(scores);
      
      // Update history
      this.updateHistory(scores);
      
      this.lastScore = scores;
      this.emit('scores:updated', scores);
    } catch (error) {
      this.emit('error', `Failed to read scores: ${error}`);
    }
  }

  private compareScores(oldScore: EvaluationScore, newScore: EvaluationScore): void {
    const components = ['dashboard', 'prompts', 'folders'] as const;
    
    for (const component of components) {
      const oldTotal = oldScore.scores[component].total;
      const newTotal = newScore.scores[component].total;
      const diff = newTotal - oldTotal;
      
      if (Math.abs(diff) > 0.1) {
        this.emit('score:changed', {
          component,
          oldScore: oldTotal,
          newScore: newTotal,
          difference: diff,
          improved: diff > 0
        });
      }
    }
    
    // Check overall score change
    const overallDiff = newScore.overall - oldScore.overall;
    if (Math.abs(overallDiff) > 0.1) {
      this.emit('overall:changed', {
        oldScore: oldScore.overall,
        newScore: newScore.overall,
        difference: overallDiff,
        improved: overallDiff > 0
      });
    }
  }

  private checkThresholds(scores: EvaluationScore): void {
    const components = ['dashboard', 'prompts', 'folders'] as const;
    
    for (const component of components) {
      const score = scores.scores[component].total;
      
      if (score < this.thresholds.critical) {
        this.emit('threshold:critical', { component, score });
      } else if (score < this.thresholds.warning) {
        this.emit('threshold:warning', { component, score });
      } else if (score >= this.thresholds.excellent) {
        this.emit('threshold:excellent', { component, score });
      } else if (score >= this.thresholds.good) {
        this.emit('threshold:good', { component, score });
      }
    }
    
    // Check overall score threshold
    if (scores.overall < this.thresholds.critical) {
      this.emit('overall:critical', scores.overall);
    } else if (scores.overall < this.thresholds.warning) {
      this.emit('overall:warning', scores.overall);
    } else if (scores.overall >= this.thresholds.excellent) {
      this.emit('overall:excellent', scores.overall);
    } else if (scores.overall >= this.thresholds.good) {
      this.emit('overall:good', scores.overall);
    }
  }

  private updateHistory(score: EvaluationScore): void {
    this.scoreHistory.push(score);
    
    // Keep history size under control
    if (this.scoreHistory.length > this.maxHistorySize) {
      this.scoreHistory = this.scoreHistory.slice(-this.maxHistorySize);
    }
  }

  getScoreTrend(component?: string): { timestamps: string[], scores: number[] } {
    const timestamps: string[] = [];
    const scores: number[] = [];
    
    for (const entry of this.scoreHistory) {
      timestamps.push(entry.timestamp);
      
      if (component && component in entry.scores) {
        scores.push(entry.scores[component as keyof typeof entry.scores].total);
      } else {
        scores.push(entry.overall);
      }
    }
    
    return { timestamps, scores };
  }

  getAverageScore(component?: string, lastN: number = 10): number {
    const recentScores = this.scoreHistory.slice(-lastN);
    
    if (recentScores.length === 0) return 0;
    
    const scores = recentScores.map(entry => {
      if (component && component in entry.scores) {
        return entry.scores[component as keyof typeof entry.scores].total;
      }
      return entry.overall;
    });
    
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  }

  getScoreStability(): { component: string, stability: number }[] {
    const components = ['dashboard', 'prompts', 'folders', 'overall'] as const;
    const results: { component: string, stability: number }[] = [];
    
    for (const component of components) {
      const trend = this.getScoreTrend(component === 'overall' ? undefined : component);
      
      if (trend.scores.length < 2) {
        results.push({ component, stability: 100 });
        continue;
      }
      
      // Calculate standard deviation
      const mean = trend.scores.reduce((a, b) => a + b, 0) / trend.scores.length;
      const variance = trend.scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / trend.scores.length;
      const stdDev = Math.sqrt(variance);
      
      // Stability as inverse of coefficient of variation (normalized)
      const stability = mean > 0 ? Math.max(0, 100 - (stdDev / mean) * 100) : 0;
      
      results.push({ component, stability: Math.round(stability) });
    }
    
    return results;
  }

  async generateReport(): Promise<string> {
    if (!this.lastScore) {
      return 'No evaluation data available';
    }
    
    const stability = this.getScoreStability();
    const trends = {
      dashboard: this.getScoreTrend('dashboard'),
      prompts: this.getScoreTrend('prompts'),
      folders: this.getScoreTrend('folders'),
      overall: this.getScoreTrend()
    };
    
    let report = '# Evaluation Monitoring Report\n\n';
    report += `Generated: ${new Date().toISOString()}\n\n`;
    
    report += '## Current Scores\n';
    report += `- **Dashboard**: ${this.lastScore.scores.dashboard.total}/10\n`;
    report += `- **Prompts**: ${this.lastScore.scores.prompts.total}/10\n`;
    report += `- **Folders**: ${this.lastScore.scores.folders.total}/10\n`;
    report += `- **Overall**: ${this.lastScore.overall}/10\n\n`;
    
    report += '## Score Stability\n';
    for (const { component, stability: stab } of stability) {
      const emoji = stab > 90 ? '🟢' : stab > 70 ? '🟡' : '🔴';
      report += `- ${component}: ${stab}% ${emoji}\n`;
    }
    
    report += '\n## Recommendations\n';
    if (this.lastScore.recommendations) {
      for (const rec of this.lastScore.recommendations) {
        report += `- ${rec}\n`;
      }
    }
    
    report += '\n## Threshold Status\n';
    const components = ['dashboard', 'prompts', 'folders'] as const;
    for (const component of components) {
      const score = this.lastScore.scores[component].total;
      const status = score >= this.thresholds.excellent ? 'Excellent' :
                    score >= this.thresholds.good ? 'Good' :
                    score >= this.thresholds.warning ? 'Warning' :
                    'Critical';
      report += `- ${component}: ${status}\n`;
    }
    
    return report;
  }

  getCurrentScore(): EvaluationScore | null {
    return this.lastScore;
  }

  getHistory(): EvaluationScore[] {
    return [...this.scoreHistory];
  }

  clearHistory(): void {
    this.scoreHistory = [];
    this.emit('history: cleared');
  }
}

// Singleton instance
let monitorInstance: EvaluationMonitor | null = null;

export function getEvaluationMonitor(): EvaluationMonitor {
  if (!monitorInstance) {
    monitorInstance = new EvaluationMonitor();
  }
  return monitorInstance;
}