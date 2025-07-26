export interface TokenBudget {
  total: number;
  allocated: TokenAllocation;
  reserved: number;
  available: number;
  utilizationRate: number;
}

export interface TokenAllocation {
  coreMemory: number;        // Essential project information
  workingContext: number;    // Active development context
  documentation: number;     // Documentation and guides
  codeContext: number;      // Current code being worked on
  toolOutput: number;       // Tool execution results
  conversationHistory: number; // Recent conversation context
}

export interface OptimizationStrategy {
  name: string;
  description: string;
  targetUtilization: number;
  compressionRatio: number;
  preservationRules: PreservationRule[];
  triggers: OptimizationTrigger[];
}

export interface PreservationRule {
  type: 'always_preserve' | 'conditionally_preserve' | 'compressible' | 'archivable';
  pattern: string | RegExp;
  priority: number;
  reason: string;
}

export interface OptimizationTrigger {
  condition: 'token_threshold' | 'time_interval' | 'context_fragmentation' | 'manual';
  threshold?: number;
  interval?: number;
  parameters?: Record<string, any>;
}

export interface TokenAnalysis {
  currentUsage: number;
  distribution: TokenDistribution;
  efficiency: EfficiencyMetrics;
  recommendations: OptimizationRecommendation[];
  fragmentation: FragmentationAnalysis;
}

export interface TokenDistribution {
  categories: Record<string, number>;
  files: Record<string, number>;
  agents: Record<string, number>;
  temporalDistribution: TemporalDistribution;
}

export interface TemporalDistribution {
  recent: number;      // Last hour
  current: number;     // Current session
  historical: number;  // Previous sessions
}

export interface EfficiencyMetrics {
  utilizationScore: number;
  compressionPotential: number;
  redundancyLevel: number;
  accessPatterns: AccessPattern[];
}

export interface AccessPattern {
  content: string;
  accessCount: number;
  lastAccessed: Date;
  importance: number;
}

export interface OptimizationRecommendation {
  type: 'compress' | 'archive' | 'split' | 'merge' | 'prioritize' | 'consolidate';
  target: string;
  estimatedSavings: number;
  riskLevel: 'low' | 'medium' | 'high';
  description: string;
}

export interface FragmentationAnalysis {
  score: number;
  causes: string[];
  impactOnPerformance: number;
  defragmentationOpportunities: DefragmentationOpportunity[];
}

export interface DefragmentationOpportunity {
  target: string;
  method: 'consolidate' | 'reorder' | 'deduplicate';
  savings: number;
  effort: number;
}

export interface OptimizationOperation {
  filename: string;
  operation: 'preserve' | 'light_compress' | 'moderate_compress' | 'heavy_compress';
  originalTokens: number;
  newTokens: number;
  reason: string;
}

export interface OptimizationResult {
  optimizedContent: Map<string, string>;
  operations: OptimizationOperation[];
  totalTokensSaved: number;
  newUtilization: number;
  analysis: TokenAnalysis;
}