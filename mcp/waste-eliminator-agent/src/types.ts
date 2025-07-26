export interface CodeMetrics {
  totalFiles: number;
  totalLines: number;
  totalFunctions: number;
  averageComplexity: number;
  duplicateCodeRatio: number;
}

export interface WastePattern {
  name: string;
  severity: 'low' | 'medium' | 'high';
  detector: (sourceFile: any) => any[];
}

export interface AnalysisResult {
  projectPath: string;
  timestamp: string;
  analysisTime: number;
  metrics: CodeMetrics;
  issues: any[];
  summary: string;
}

export interface DuplicateCode {
  totalDuplicateLines: number;
  duplicates: Array<{
    code: string;
    locations: Array<{ file: string; line: number }>;
    count: number;
  }>;
}

export interface RefactoringOptions {
  filePath: string;
  scope: 'file' | 'function' | 'class' | 'module';
  targetName?: string;
}

export interface RefactoringResult {
  success: boolean;
  filePath: string;
  changes: Array<{
    type: string;
    before: string;
    after: string;
    line: number;
    impact: string;
  }>;
  metrics: {
    linesRemoved: number;
    linesAdded: number;
    complexityReduction: number;
  };
}

export interface OptimizationOptions {
  projectPath: string;
  removeUnused: boolean;
  sortImports: boolean;
}

export interface MonitoringConfig {
  projectPath: string;
  interval: number;
  webhookUrl?: string;
}

export interface WasteReport {
  timestamp: string;
  projectPath: string;
  overallHealth: 'excellent' | 'good' | 'fair' | 'poor';
  wasteMetrics: {
    deadCodeLines: number;
    duplicateCodeLines: number;
    unusedExports: number;
    complexFunctions: number;
    performanceBottlenecks: number;
  };
  savings: {
    estimatedLinesRemovable: number;
    estimatedTimeReduction: string;
    estimatedBundleSizeReduction: string;
  };
  topIssues: Array<{
    type: string;
    count: number;
    severity: string;
    estimatedEffort: string;
  }>;
  recommendations: string[];
}