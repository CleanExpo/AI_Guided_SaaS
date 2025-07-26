import { WasteAnalyzer } from './analyzer.js';
import { logger } from './utils/logger.js';
import { WasteReport } from './types.js';

export class ReportGenerator {
  private analyzer: WasteAnalyzer;

  constructor() {
    this.analyzer = new WasteAnalyzer();
  }

  async generate(projectPath: string, format: string): Promise<string> {
    logger.info(`Generating ${format} report for ${projectPath}`);

    // Perform comprehensive analysis
    const analysis = await this.analyzer.analyzeProject(projectPath, 'deep');
    const duplicates = await this.analyzer.detectDuplicates(projectPath, 0.8);

    // Build waste report
    const report: WasteReport = {
      timestamp: new Date().toISOString(),
      projectPath,
      overallHealth: this.calculateHealth(analysis),
      wasteMetrics: {
        deadCodeLines: this.countDeadCodeLines(analysis.issues),
        duplicateCodeLines: duplicates.totalDuplicateLines,
        unusedExports: this.countUnusedExports(analysis.issues),
        complexFunctions: this.countComplexFunctions(analysis.issues),
        performanceBottlenecks: this.countPerformanceIssues(analysis.issues),
      },
      savings: {
        estimatedLinesRemovable: this.estimateRemovableLines(analysis, duplicates),
        estimatedTimeReduction: this.estimateTimeReduction(analysis),
        estimatedBundleSizeReduction: this.estimateBundleSizeReduction(analysis, duplicates),
      },
      topIssues: this.getTopIssues(analysis.issues),
      recommendations: this.generateRecommendations(analysis, duplicates),
    };

    // Format report based on requested format
    switch (format) {
      case 'json':
        return JSON.stringify(report, null, 2);
      case 'markdown':
        return this.formatMarkdown(report);
      case 'html':
        return this.formatHtml(report);
      default:
        return JSON.stringify(report, null, 2);
    }
  }

  private calculateHealth(analysis: any): 'excellent' | 'good' | 'fair' | 'poor' {
    const score = this.calculateHealthScore(analysis);
    
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 60) return 'fair';
    return 'poor';
  }

  private calculateHealthScore(analysis: any): number {
    const { issues, metrics } = analysis;
    
    let score = 100;
    
    // Deduct for issues based on severity
    const severityPenalties = { high: 5, medium: 2, low: 0.5 };
    issues.forEach((issue: any) => {
      score -= severityPenalties[issue.severity as keyof typeof severityPenalties] || 0;
    });
    
    // Deduct for high duplicate ratio
    if (metrics.duplicateCodeRatio > 0.2) score -= 10;
    else if (metrics.duplicateCodeRatio > 0.1) score -= 5;
    
    // Deduct for average complexity
    if (metrics.averageComplexity > 10) score -= 10;
    else if (metrics.averageComplexity > 5) score -= 5;
    
    return Math.max(0, Math.min(100, score));
  }

  private countDeadCodeLines(issues: any[]): number {
    return issues
      .filter(issue => issue.type === 'dead_code')
      .reduce((sum, issue) => sum + (issue.lineCount || 1), 0);
  }

  private countUnusedExports(issues: any[]): number {
    return issues.filter(issue => 
      issue.type === 'unused_export' || issue.type === 'unused_variable'
    ).length;
  }

  private countComplexFunctions(issues: any[]): number {
    return issues.filter(issue => issue.type === 'complex_function').length;
  }

  private countPerformanceIssues(issues: any[]): number {
    return issues.filter(issue => 
      issue.type === 'performance' || 
      issue.type === 'nested_callbacks' ||
      issue.type === 'array_operation_in_loop'
    ).length;
  }

  private estimateRemovableLines(analysis: any, duplicates: any): number {
    const deadCode = this.countDeadCodeLines(analysis.issues);
    const duplicateLines = duplicates.totalDuplicateLines;
    const unusedCode = analysis.issues
      .filter((i: any) => i.type === 'unused_variable' || i.type === 'unused_function')
      .length * 5; // Estimate 5 lines per unused item
    
    return deadCode + duplicateLines + unusedCode;
  }

  private estimateTimeReduction(analysis: any): string {
    const complexityReduction = analysis.issues
      .filter((i: any) => i.type === 'complex_function')
      .reduce((sum: number, i: any) => sum + (i.complexity || 0), 0);
    
    // Rough estimate: each complexity point = 0.5 seconds in understanding/maintenance
    const seconds = complexityReduction * 0.5;
    
    if (seconds < 60) return `${Math.round(seconds)}s per code review`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m per code review`;
    return `${Math.round(seconds / 3600)}h per code review`;
  }

  private estimateBundleSizeReduction(analysis: any, duplicates: any): string {
    const removableLines = this.estimateRemovableLines(analysis, duplicates);
    // Rough estimate: 50 characters per line, 1 byte per character
    const bytes = removableLines * 50;
    
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${Math.round(bytes / (1024 * 1024))} MB`;
  }

  private getTopIssues(issues: any[]): any[] {
    const issueCounts = new Map<string, { count: number; severity: string }>();
    
    issues.forEach(issue => {
      const key = issue.type;
      if (!issueCounts.has(key)) {
        issueCounts.set(key, { count: 0, severity: issue.severity });
      }
      issueCounts.get(key)!.count++;
    });
    
    return Array.from(issueCounts.entries())
      .map(([type, data]) => ({
        type,
        count: data.count,
        severity: data.severity,
        estimatedEffort: this.estimateEffort(type, data.count),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  private estimateEffort(type: string, count: number): string {
    const effortPerIssue: Record<string, number> = {
      'dead_code': 1,
      'unused_variable': 1,
      'duplicate_imports': 1,
      'console_log': 1,
      'magic_number': 2,
      'complex_function': 15,
      'long_function': 20,
      'nested_callbacks': 30,
      'duplicate_code': 10,
    };
    
    const minutes = (effortPerIssue[type] || 5) * count;
    
    if (minutes < 60) return `${minutes}m`;
    if (minutes < 480) return `${Math.round(minutes / 60)}h`;
    return `${Math.round(minutes / 480)}d`;
  }

  private generateRecommendations(analysis: any, duplicates: any): string[] {
    const recommendations: string[] = [];
    const { issues } = analysis;
    
    // Priority 1: Critical issues
    const criticalCount = issues.filter((i: any) => i.severity === 'high').length;
    if (criticalCount > 0) {
      recommendations.push(
        `Address ${criticalCount} critical issues immediately to prevent production problems`
      );
    }
    
    // Priority 2: Duplicate code
    if (duplicates.totalDuplicateLines > 100) {
      recommendations.push(
        'Extract common patterns into shared utilities to eliminate duplicate code'
      );
    }
    
    // Priority 3: Complex functions
    const complexFunctions = issues.filter((i: any) => i.type === 'complex_function');
    if (complexFunctions.length > 5) {
      recommendations.push(
        'Refactor complex functions using SOLID principles for better maintainability'
      );
    }
    
    // Priority 4: Performance
    const perfIssues = this.countPerformanceIssues(issues);
    if (perfIssues > 0) {
      recommendations.push(
        'Optimize performance bottlenecks to improve application responsiveness'
      );
    }
    
    // Priority 5: Code hygiene
    const consoleCount = issues.filter((i: any) => i.type === 'console_log').length;
    if (consoleCount > 10) {
      recommendations.push(
        'Implement proper logging framework and remove console statements'
      );
    }
    
    // Add automation recommendation
    recommendations.push(
      'Set up continuous monitoring to catch waste as it\'s introduced'
    );
    
    return recommendations;
  }

  private formatMarkdown(report: WasteReport): string {
    const { wasteMetrics, savings, topIssues, recommendations } = report;
    
    return `# Waste Elimination Report

**Generated:** ${new Date(report.timestamp).toLocaleString()}  
**Project:** ${report.projectPath}  
**Overall Health:** ${report.overallHealth.toUpperCase()}

## Executive Summary

Your codebase health is **${report.overallHealth}**. By implementing the recommended optimizations, you can:
- Remove approximately **${savings.estimatedLinesRemovable} lines** of code
- Reduce code review time by **${savings.estimatedTimeReduction}**
- Decrease bundle size by **${savings.estimatedBundleSizeReduction}**

## Waste Metrics

| Metric | Value |
|--------|-------|
| Dead Code Lines | ${wasteMetrics.deadCodeLines} |
| Duplicate Code Lines | ${wasteMetrics.duplicateCodeLines} |
| Unused Exports | ${wasteMetrics.unusedExports} |
| Complex Functions | ${wasteMetrics.complexFunctions} |
| Performance Bottlenecks | ${wasteMetrics.performanceBottlenecks} |

## Top Issues

| Issue Type | Count | Severity | Estimated Effort |
|------------|-------|----------|------------------|
${topIssues.map(issue => 
  `| ${issue.type} | ${issue.count} | ${issue.severity} | ${issue.estimatedEffort} |`
).join('\n')}

## Recommendations

${recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

## Next Steps

1. **Immediate**: Address all high-severity issues
2. **This Week**: Eliminate duplicate code patterns
3. **This Month**: Refactor complex functions
4. **Ongoing**: Enable continuous monitoring

---
*Generated by Project Waste Eliminator Agent*`;
  }

  private formatHtml(report: WasteReport): string {
    const { wasteMetrics, savings, topIssues, recommendations } = report;
    
    return `<!DOCTYPE html>
<html>
<head>
    <title>Waste Elimination Report</title>
    <style>
        body { font-family: -apple-system, sans-serif; margin: 40px; color: #333; }
        h1 { color: #2563eb; }
        h2 { color: #1e40af; margin-top: 30px; }
        .summary { background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .health-excellent { color: #10b981; }
        .health-good { color: #3b82f6; }
        .health-fair { color: #f59e0b; }
        .health-poor { color: #ef4444; }
        table { border-collapse: collapse; width: 100%; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
        th { background: #f9fafb; font-weight: 600; }
        .recommendations { background: #eff6ff; padding: 20px; border-radius: 8px; }
        .recommendations li { margin: 10px 0; }
        .metric-value { font-size: 24px; font-weight: bold; color: #1e40af; }
    </style>
</head>
<body>
    <h1>Waste Elimination Report</h1>
    
    <div class="summary">
        <p><strong>Generated:</strong> ${new Date(report.timestamp).toLocaleString()}</p>
        <p><strong>Project:</strong> ${report.projectPath}</p>
        <p><strong>Overall Health:</strong> <span class="health-${report.overallHealth}">${report.overallHealth.toUpperCase()}</span></p>
    </div>

    <h2>Executive Summary</h2>
    <p>Your codebase health is <strong>${report.overallHealth}</strong>. By implementing the recommended optimizations:</p>
    <ul>
        <li>Remove approximately <span class="metric-value">${savings.estimatedLinesRemovable}</span> lines of code</li>
        <li>Reduce code review time by <span class="metric-value">${savings.estimatedTimeReduction}</span></li>
        <li>Decrease bundle size by <span class="metric-value">${savings.estimatedBundleSizeReduction}</span></li>
    </ul>

    <h2>Waste Metrics</h2>
    <table>
        <tr><th>Metric</th><th>Value</th></tr>
        <tr><td>Dead Code Lines</td><td>${wasteMetrics.deadCodeLines}</td></tr>
        <tr><td>Duplicate Code Lines</td><td>${wasteMetrics.duplicateCodeLines}</td></tr>
        <tr><td>Unused Exports</td><td>${wasteMetrics.unusedExports}</td></tr>
        <tr><td>Complex Functions</td><td>${wasteMetrics.complexFunctions}</td></tr>
        <tr><td>Performance Bottlenecks</td><td>${wasteMetrics.performanceBottlenecks}</td></tr>
    </table>

    <h2>Top Issues</h2>
    <table>
        <tr><th>Issue Type</th><th>Count</th><th>Severity</th><th>Estimated Effort</th></tr>
        ${topIssues.map(issue => 
          `<tr><td>${issue.type}</td><td>${issue.count}</td><td>${issue.severity}</td><td>${issue.estimatedEffort}</td></tr>`
        ).join('')}
    </table>

    <h2>Recommendations</h2>
    <div class="recommendations">
        <ol>
            ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ol>
    </div>

    <h2>Next Steps</h2>
    <ol>
        <li><strong>Immediate:</strong> Address all high-severity issues</li>
        <li><strong>This Week:</strong> Eliminate duplicate code patterns</li>
        <li><strong>This Month:</strong> Refactor complex functions</li>
        <li><strong>Ongoing:</strong> Enable continuous monitoring</li>
    </ol>

    <hr>
    <p><em>Generated by Project Waste Eliminator Agent</em></p>
</body>
</html>`;
  }
}