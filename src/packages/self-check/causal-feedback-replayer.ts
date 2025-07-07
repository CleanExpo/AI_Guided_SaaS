// packages/self-check/causal-feedback-replayer.ts

import { logger, CausalLogEntry } from '../causal-engine/logger';

interface ComponentPattern {
  key: string;
  deletions: number;
  additions: number;
  edits: number;
  retentions: number;
  pattern: string;
}

export function analyzeCausalLogs(logs?: CausalLogEntry[]): { 
  status: string; 
  patterns: string[]; 
  summary: string;
  recommendations: string[];
} {
  const logData = logs || logger.getLogs();
  
  if (logData.length === 0) {
    return {
      status: '📊 No causal data available yet.',
      patterns: ['Start using the UI builder to generate causal insights.'],
      summary: 'No user interaction data to analyze.',
      recommendations: ['Encourage users to interact with the UI builder to collect data.']
    };
  }

  const componentStats: Record<string, ComponentPattern> = {};

  // Analyze each log entry
  logData.forEach((log) => {
    const key = `${log.page}::${log.componentType}`;
    
    if (!componentStats[key]) {
      componentStats[key] = {
        key,
        deletions: 0,
        additions: 0,
        edits: 0,
        retentions: 0,
        pattern: 'unknown'
      };
    }

    switch (log.action) {
      case 'added':
        componentStats[key].additions++;
        break;
      case 'deleted':
        componentStats[key].deletions++;
        break;
      case 'edited':
        componentStats[key].edits++;
        break;
      case 'kept':
        componentStats[key].retentions++;
        break;
    }
  });

  // Identify patterns
  const patterns: string[] = [];
  const recommendations: string[] = [];
  const problemComponents: ComponentPattern[] = [];

  Object.values(componentStats).forEach((stat) => {
    const total = stat.additions + stat.deletions + stat.edits + stat.retentions;
    
    if (total < 3) {
      stat.pattern = 'insufficient-data';
      return;
    }

    const deletionRate = stat.deletions / total;
    const retentionRate = stat.retentions / total;
    const editRate = stat.edits / total;

    // High deletion rate indicates problems
    if (deletionRate > 0.4) {
      stat.pattern = 'high-deletion';
      problemComponents.push(stat);
      patterns.push(`❌ ${stat.key} → High deletion rate (${(deletionRate * 100).toFixed(1)}%)`);
      recommendations.push(`Review ${stat.key.split('::')[1]} component design - users frequently delete it`);
    }
    // Low retention with high edits suggests usability issues
    else if (retentionRate < 0.3 && editRate > 0.3) {
      stat.pattern = 'edit-heavy';
      patterns.push(`⚠️ ${stat.key} → Requires frequent editing (${(editRate * 100).toFixed(1)}%)`);
      recommendations.push(`Improve default properties for ${stat.key.split('::')[1]} component`);
    }
    // High retention indicates good components
    else if (retentionRate > 0.6) {
      stat.pattern = 'high-retention';
      patterns.push(`✅ ${stat.key} → High retention (${(retentionRate * 100).toFixed(1)}%)`);
    }
    // Balanced usage
    else {
      stat.pattern = 'balanced';
      patterns.push(`📊 ${stat.key} → Balanced usage pattern`);
    }
  });

  // Generate summary
  const totalComponents = Object.keys(componentStats).length;
  const problemCount = problemComponents.length;
  
  let status = '✅ Component patterns look healthy.';
  if (problemCount > 0) {
    status = `⚠️ ${problemCount}/${totalComponents} components show concerning patterns.`;
  }

  const summary = `Analyzed ${logData.length} interactions across ${totalComponents} component types.`;

  // Add general recommendations
  if (problemComponents.length === 0 && patterns.length > 0) {
    recommendations.push('Continue monitoring user interactions for emerging patterns');
  }

  if (patterns.length === 0) {
    patterns.push('No significant patterns detected yet - need more user interaction data');
  }

  return {
    status,
    patterns: patterns.slice(0, 10), // Limit to top 10 patterns
    summary,
    recommendations: recommendations.slice(0, 5) // Limit to top 5 recommendations
  };
}

export function getTopProblematicComponents(logs?: CausalLogEntry[], limit: number = 5): ComponentPattern[] {
  const logData = logs || logger.getLogs();
  const componentStats: Record<string, ComponentPattern> = {};

  logData.forEach((log) => {
    const key = `${log.page}::${log.componentType}`;
    
    if (!componentStats[key]) {
      componentStats[key] = {
        key,
        deletions: 0,
        additions: 0,
        edits: 0,
        retentions: 0,
        pattern: 'unknown'
      };
    }

    switch (log.action) {
      case 'added':
        componentStats[key].additions++;
        break;
      case 'deleted':
        componentStats[key].deletions++;
        break;
      case 'edited':
        componentStats[key].edits++;
        break;
      case 'kept':
        componentStats[key].retentions++;
        break;
    }
  });

  return Object.values(componentStats)
    .filter(stat => {
      const total = stat.additions + stat.deletions + stat.edits + stat.retentions;
      return total >= 3; // Only consider components with sufficient data
    })
    .map(stat => {
      const total = stat.additions + stat.deletions + stat.edits + stat.retentions;
      const deletionRate = stat.deletions / total;
      return { ...stat, deletionRate };
    })
    .sort((a, b) => (b as any).deletionRate - (a as any).deletionRate)
    .slice(0, limit);
}

export function generateCausalInsights(): {
  totalInteractions: number;
  uniqueComponents: number;
  topIssues: string[];
  recommendations: string[];
} {
  const logs = logger.getLogs();
  const analysis = analyzeCausalLogs(logs);
  const problematicComponents = getTopProblematicComponents(logs, 3);

  const uniqueComponents = new Set(logs.map(log => `${log.page}::${log.componentType}`)).size;

  const topIssues = problematicComponents.map(comp => {
    const total = comp.additions + comp.deletions + comp.edits + comp.retentions;
    const deletionRate = comp.deletions / total;
    return `${comp.key.split('::')[1]}: ${(deletionRate * 100).toFixed(1)}% deletion rate`;
  });

  return {
    totalInteractions: logs.length,
    uniqueComponents,
    topIssues: topIssues.length > 0 ? topIssues : ['No significant issues detected'],
    recommendations: analysis.recommendations
  };
}
