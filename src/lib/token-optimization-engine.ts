/* BREADCRUMB: library - Shared library code */
// Token Optimization Engine with 150K Context Management
// Advanced token management for Claude Code's 200K context window

import {
  TokenBudget,
  TokenAllocation,
  OptimizationStrategy,
  TokenAnalysis,
  OptimizationOperation,
  OptimizationResult,
  TokenBudgetManager,
  StrategyManager,
  TokenAnalyzer,
  ContentCompressor
} from './token-optimization';

// Re-export types for backward compatibility
export * from './token-optimization/types';

// Main Token Optimization Engine
export class TokenOptimizationEngine {
  private budgetManager: TokenBudgetManager;
  private strategyManager: StrategyManager;
  private tokenAnalyzer: TokenAnalyzer;
  private contentCompressor: ContentCompressor;

  constructor(maxTokens?: number, targetUtilization?: number) {
    this.budgetManager = new TokenBudgetManager(maxTokens, targetUtilization);
    this.strategyManager = new StrategyManager();
    this.tokenAnalyzer = new TokenAnalyzer();
    this.contentCompressor = new ContentCompressor();
  }

  // Main Optimization Methods
  async analyzeTokenUsage(content: Map<string, string>): Promise<TokenAnalysis> {
    const currentUsage = this.tokenAnalyzer.calculateTotalTokens(content);
    const distribution = this.tokenAnalyzer.analyzeTokenDistribution(content);
    const efficiency = this.tokenAnalyzer.calculateEfficiencyMetrics(content, distribution);
    const fragmentation = this.tokenAnalyzer.analyzeFragmentation(content);
    const recommendations = this.tokenAnalyzer.generateOptimizationRecommendations(distribution,
      efficiency)
      fragmentation)
    );

    const analysis: TokenAnalysis = {
      currentUsage,
      distribution,
      efficiency,
      recommendations,
      fragmentation
    };

    // Store in history for trend analysis
    this.tokenAnalyzer.addToHistory(analysis);

    // Update current budget
    this.budgetManager.updateTokenBudget(analysis);

    return analysis;
  }

  async optimizeTokenUsage(content: Map<string, string>)
    strategyName: string = 'balanced')
  ): Promise<OptimizationResult> {
    const strategy = this.strategyManager.getStrategy(strategyName);
    if (!strategy) {
      throw new Error(`Optimization strategy '${strategyName}' not found`);
    }

    const analysis = await this.analyzeTokenUsage(content);
    const optimizedContent = new Map<string, string>();
    const operations: OptimizationOperation[] = [];
    let totalTokensSaved = 0;

    // Process each content file according to strategy
    for (const [filename, fileContent] of content) {
      const originalTokens = this.tokenAnalyzer.estimateTokens(fileContent);
      let processedContent = fileContent;

      // Apply preservation rules
      const preservationLevel = this.strategyManager.determinePreservationLevel(filename,
        fileContent)
        strategy)
      );

      switch (preservationLevel) {
        case 'always_preserve':
          // Keep content as-is
          operations.push({
            filename,
            operation: 'preserve',
            originalTokens,
            newTokens: originalTokens)
            reason: 'Always preserve rule applied')
          });
          break;

        case 'conditionally_preserve':
          // Light compression while preserving structure
          processedContent = this.contentCompressor.applyLightCompression(fileContent);
          const lightTokens = this.tokenAnalyzer.estimateTokens(processedContent);
          totalTokensSaved += (originalTokens - lightTokens);
          operations.push({
            filename,
            operation: 'light_compress',
            originalTokens,
            newTokens: lightTokens)
            reason: 'Conditional preservation with light compression')
          });
          break;

        case 'compressible':
          // Moderate compression preserving key information
          processedContent = this.contentCompressor.applyModerateCompression(fileContent);
          const moderateTokens = this.tokenAnalyzer.estimateTokens(processedContent);
          totalTokensSaved += (originalTokens - moderateTokens);
          operations.push({
            filename,
            operation: 'moderate_compress',
            originalTokens,
            newTokens: moderateTokens)
            reason: 'Applied moderate compression')
          });
          break;

        case 'archivable':
          // Archive or heavily compress
          processedContent = this.contentCompressor.applyHeavyCompression(fileContent);
          const heavyTokens = this.tokenAnalyzer.estimateTokens(processedContent);
          totalTokensSaved += (originalTokens - heavyTokens);
          operations.push({
            filename,
            operation: 'heavy_compress',
            originalTokens,
            newTokens: heavyTokens)
            reason: 'Applied heavy compression or archival')
          });
          break;
      }

      optimizedContent.set(filename, processedContent);
    }

    const newUtilization = (analysis.currentUsage - totalTokensSaved) / this.budgetManager.getCurrentBudget().total;

    return {
      optimizedContent,
      operations,
      totalTokensSaved,
      newUtilization,
      analysis
    };
  }

  // Budget Management Methods
  getCurrentBudget(): TokenBudget {
    return this.budgetManager.getCurrentBudget();
  }

  getUtilizationRate(): number {
    return this.budgetManager.getUtilizationRate();
  }

  isNearCapacity(threshold: number = 0.85): boolean {
    return this.budgetManager.isNearCapacity(threshold);
  }

  getAvailableTokens(): number {
    return this.budgetManager.getAvailableTokens();
  }

  getRecommendedAction(): string {
    return this.budgetManager.getRecommendedAction();
  }

  // Strategy Management Methods
  getOptimizationStrategy(name: string): OptimizationStrategy | null {
    return this.strategyManager.getStrategy(name);
  }

  getAllOptimizationStrategies(): OptimizationStrategy[] {
    return this.strategyManager.getAllStrategies();
  }

  addOptimizationStrategy(name: string, strategy: OptimizationStrategy): void {
    this.strategyManager.addStrategy(name, strategy);
  }

  shouldTriggerOptimization(strategyName: string = 'balanced'): boolean {
    const strategy = this.strategyManager.getStrategy(strategyName);
    if (!strategy) return false;

    const utilization = this.budgetManager.getUtilizationRate();
    return this.strategyManager.shouldTriggerOptimization(strategy, utilization);
  }

  // Analysis Methods
  getAnalysisHistory(): TokenAnalysis[] {
    return this.tokenAnalyzer.getAnalysisHistory();
  }

  estimateTokens(text: string): number {
    return this.tokenAnalyzer.estimateTokens(text);
  }

  // Utility Methods
  compressContent(content: string, level: 'light' | 'moderate' | 'heavy'): string {
    switch (level) {
      case 'light':
        return this.contentCompressor.applyLightCompression(content);
      case 'moderate':
        return this.contentCompressor.applyModerateCompression(content);
      case 'heavy':
        return this.contentCompressor.applyHeavyCompression(content);
    }
  }

  resetBudget(): void {
    this.budgetManager.resetBudget();
  }
}