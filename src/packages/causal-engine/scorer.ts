import type { CausalLogEntry } from './logger';

type ComponentStats = {
  total: number;
  kept: number;
  edited: number;
  deleted: number;
  added: number;
};

type ScoreMap = {
  [key: string]: ComponentStats;
};

type ScoreResult = {
  score: number;
  confidence: string;
  total: number;
};

type ComponentScore = ScoreResult & {
  key: string;
};

export class CausalScorer {
  private logs: CausalLogEntry[];
  
  constructor(logs: CausalLogEntry[]) {
    this.logs = logs;
  }

  /**
   * Generate score map: for each page + componentType, track outcomes
   */
  getComponentScoreMap(): ScoreMap {
    const map: ScoreMap = {};
    
    for (const log of this.logs) {
      const key = `${log.page}:${log.componentType}`;
      
      if (!map[key]) {
        map[key] = { 
          total: 0, 
          kept: 0, 
          edited: 0, 
          deleted: 0, 
          added: 0 
        };
      }
      
      map[key].total += 1;
      if (log.action in map[key]) {
        (map[key] as Record<string, number>)[log.action]++;
      }
    }
    
    return map;
  }

  /**
   * Score is based on retention + positive edits
   * 0 = consistently deleted; 1 = always kept/edited
   * Uses Inverse Propensity Weighting (IPW) principles
   */
  scoreComponent(page: string, componentType: string): number {
    const map = this.getComponentScoreMap();
    const key = `${page}:${componentType}`;
    const stats = map[key];
    
    if (!stats || stats.total === 0) {
      return 0.5; // unknown gets neutral
    }
    
    // IPW-inspired scoring: weight positive actions higher
    const retainScore = (stats.kept + 0.75 * stats.edited) / stats.total;
    const deleteScore = stats.deleted / stats.total;
    
    // Penalize high deletion rates more heavily
    const finalScore = retainScore - deleteScore * 0.5;
    
    return Math.min(Math.max(finalScore, 0), 1); // clamp between 0–1
  }

  /**
   * Get confidence level based on sample size
   */
  getConfidence(page: string,
                componentType: string)
  ): 'low' | 'medium' | 'high' {
    const map = this.getComponentScoreMap();
    const key = `${page}:${componentType}`;
    const stats = map[key];
    
    if (!stats || stats.total < 3) {
      return 'low';
    }
    if (stats.total < 10) {
      return 'medium';
    }
    return 'high';
  }

  /**
   * Optional: return all scores for review
   */
  getAllScores(): Record<string, ScoreResult> {
    const map = this.getComponentScoreMap();
    const result: Record<string, ScoreResult> = {};
    
    for (const key in map) {
      const { total, kept, edited, deleted } = map[key];
      const retainScore = (kept + 0.75 * edited) / total;
      const deleteScore = deleted / total;
      const finalScore = retainScore - deleteScore * 0.5;
      
      const [page, componentType] = key.split(':');
      const confidence = this.getConfidence(page, componentType);
      
      result[key] = {
        score: Math.min(Math.max(finalScore, 0), 1),
        confidence,
        total
      };
    }
    
    return result;
  }

  /**
   * Get top performing components
   */
  getTopComponents(limit: number = 5): Array<ComponentScore> {
    const scores = this.getAllScores();
    
    return Object.entries(scores)
      .map(([key, data]) => ({ key, ...data }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Get components that need improvement
   */
  getLowPerformingComponents(threshold: number = 0.3): Array<ComponentScore> {
    const scores = this.getAllScores();
    
    return Object.entries(scores)
      .map(([key, data]) => ({ key, ...data }))
      .filter((item) => item.score < threshold && item.confidence !== 'low')
      .sort((a, b) => a.score - b.score);
  }
}