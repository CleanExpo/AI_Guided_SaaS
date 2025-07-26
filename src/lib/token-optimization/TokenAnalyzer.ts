import { 
  TokenAnalysis, 
  TokenDistribution, 
  EfficiencyMetrics, 
  FragmentationAnalysis,
  OptimizationRecommendation,
  AccessPattern,
  DefragmentationOpportunity
} from './types';

export class TokenAnalyzer {
  private analysisHistory: TokenAnalysis[] = [];

  calculateTotalTokens(content: Map<string, string>): number {
    let totalTokens = 0;
    
    for (const [, fileContent] of content) {
      totalTokens += this.estimateTokens(fileContent);
    }
    
    return totalTokens;
  }

  estimateTokens(text: string): number {
    // Rough estimation: 1 token ≈ 4 characters for English text
    // This is a simplified approximation - in production, use proper tokenization
    return Math.ceil(text.length / 4);
  }

  analyzeTokenDistribution(content: Map<string, string>): TokenDistribution {
    const files: Record<string, number> = {};
    const categories: Record<string, number> = {};
    
    let totalTokens = 0;
    
    for (const [filename, fileContent] of content) {
      const tokens = this.estimateTokens(fileContent);
      files[filename] = tokens;
      totalTokens += tokens;
      
      // Categorize files
      const category = this.categorizeFile(filename);
      categories[category] = (categories[category] || 0) + tokens;
    }

    return {
      categories,
      files,
      agents: this.analyzeAgentDistribution(content),
      temporalDistribution: {
        recent: Math.floor(totalTokens * 0.3),
        current: Math.floor(totalTokens * 0.5),
        historical: Math.floor(totalTokens * 0.2)
      }
    };
  }

  private categorizeFile(filename: string): string {
    if (filename.includes('CLAUDE.md') || filename.includes('PROJECT')) {
      return 'core_memory';
    } else if (filename.includes('.tsx') || filename.includes('.ts')) {
      return 'code';
    } else if (filename.includes('.md')) {
      return 'documentation';
    } else if (filename.includes('test') || filename.includes('spec')) {
      return 'tests';
    } else if (filename.includes('config') || filename.includes('env')) {
      return 'configuration';
    } else {
      return 'other';
    }
  }

  private analyzeAgentDistribution(content: Map<string, string>): Record<string, number> {
    const agents: Record<string, number> = {};
    
    for (const [filename, fileContent] of content) {
      if (filename.includes('agent') || filename.includes('Agent')) {
        const agentName = this.extractAgentName(filename);
        agents[agentName] = this.estimateTokens(fileContent);
      }
    }
    
    return agents;
  }

  private extractAgentName(filename: string): string {
    const match = filename.match(/([A-Z][a-z]+Agent)/);
    return match ? match[1] : 'unknown';
  }

  calculateEfficiencyMetrics(
    content: Map<string, string>,
    distribution: TokenDistribution
  ): EfficiencyMetrics {
    const totalTokens = Object.values(distribution.files).reduce((sum, tokens) => sum + tokens, 0);
    const targetTokens = 150000; // 75% of 200K
    
    const utilizationScore = Math.min(totalTokens / targetTokens, 1);
    const compressionPotential = this.calculateCompressionPotential(content);
    const redundancyLevel = this.calculateRedundancyLevel(content);
    const accessPatterns = this.generateAccessPatterns(content);

    return {
      utilizationScore,
      compressionPotential,
      redundancyLevel,
      accessPatterns
    };
  }

  private calculateCompressionPotential(content: Map<string, string>): number {
    let compressibleTokens = 0;
    let totalTokens = 0;

    for (const [filename, fileContent] of content) {
      const tokens = this.estimateTokens(fileContent);
      totalTokens += tokens;

      // Heuristics for compression potential
      if (this.isCompressible(filename, fileContent)) {
        compressibleTokens += tokens * 0.4; // Assume 40% compression potential
      }
    }

    return totalTokens > 0 ? compressibleTokens / totalTokens : 0;
  }

  private isCompressible(filename: string, content: string): boolean {
    // Check for repetitive patterns, verbose documentation, etc.
    const repetitivePatterns = (content.match(/(.{10,})\1+/g) || []).length;
    const verboseDocumentation = content.includes('###') && content.length > 1000;
    const hasComments = (content.match(/\/\*[\s\S]*?\*\/|\/\/.*$/gm) || []).length > 10;
    
    return repetitivePatterns > 5 || verboseDocumentation || hasComments;
  }

  private calculateRedundancyLevel(content: Map<string, string>): number {
    const allContent = Array.from(content.values()).join('\n');
    const lines = allContent.split('\n');
    const uniqueLines = new Set(lines.filter(line => line.trim().length > 0));
    
    return lines.length > 0 ? 1 - (uniqueLines.size / lines.length) : 0;
  }

  private generateAccessPatterns(content: Map<string, string>): AccessPattern[] {
    const patterns: AccessPattern[] = [];
    
    for (const [filename, fileContent] of content) {
      patterns.push({
        content: filename,
        accessCount: this.estimateAccessFrequency(filename),
        lastAccessed: new Date(),
        importance: this.calculateImportance(filename, fileContent)
      });
    }

    return patterns.sort((a, b) => b.importance - a.importance);
  }

  private estimateAccessFrequency(filename: string): number {
    // Heuristic based on file type and name
    if (filename.includes('CLAUDE.md')) return 10;
    if (filename.includes('.tsx') || filename.includes('.ts')) return 7;
    if (filename.includes('test')) return 3;
    return 5;
  }

  private calculateImportance(filename: string, content: string): number {
    let importance = 5; // Base importance
    
    if (filename.includes('CLAUDE.md')) importance += 5;
    if (filename.includes('PROJECT')) importance += 4;
    if (content.includes('🎯') || content.includes('✅')) importance += 2;
    if (content.length > 5000) importance += 1;
    
    return Math.min(importance, 10);
  }

  analyzeFragmentation(content: Map<string, string>): FragmentationAnalysis {
    const causes: string[] = [];
    let fragmentationScore = 0;

    // Analyze for common fragmentation causes
    const fileCount = content.size;
    if (fileCount > 50) {
      causes.push('Too many small files');
      fragmentationScore += 0.3;
    }

    // Check for scattered related content
    const relatedFiles = this.findRelatedFiles(content);
    if (relatedFiles.scattered > relatedFiles.total * 0.3) {
      causes.push('Related content is scattered');
      fragmentationScore += 0.4;
    }

    // Check for redundant information
    const redundancyLevel = this.calculateRedundancyLevel(content);
    if (redundancyLevel > 0.3) {
      causes.push('High redundancy between files');
      fragmentationScore += redundancyLevel * 0.3;
    }

    return {
      score: Math.min(fragmentationScore, 1),
      causes,
      impactOnPerformance: fragmentationScore * 0.5,
      defragmentationOpportunities: this.identifyDefragmentationOpportunities(content)
    };
  }

  private findRelatedFiles(content: Map<string, string>): { total: number; scattered: number } {
    // Simplified analysis - in production, use more sophisticated matching
    let total = 0;
    let scattered = 0;

    const categories = new Map<string, string[]>();
    
    for (const filename of content.keys()) {
      const category = this.categorizeFile(filename);
      if (!categories.has(category)) {
        categories.set(category, []);
      }
      categories.get(category)!.push(filename);
      total++;
    }

    // Count scattered files (files that should be together but aren't)
    for (const [category, files] of categories) {
      if (files.length > 1 && category !== 'other') {
        scattered += files.length - 1;
      }
    }

    return { total, scattered };
  }

  private identifyDefragmentationOpportunities(content: Map<string, string>): DefragmentationOpportunity[] {
    const opportunities: DefragmentationOpportunity[] = [];

    // Look for merge opportunities
    const categories = new Map<string, string[]>();
    for (const filename of content.keys()) {
      const category = this.categorizeFile(filename);
      if (!categories.has(category)) {
        categories.set(category, []);
      }
      categories.get(category)!.push(filename);
    }

    for (const [category, files] of categories) {
      if (files.length > 3 && category !== 'code') {
        opportunities.push({
          target: `${category} files`,
          method: 'consolidate',
          savings: files.length * 100, // Estimated token savings
          effort: files.length * 2
        });
      }
    }

    return opportunities;
  }

  generateOptimizationRecommendations(
    distribution: TokenDistribution,
    efficiency: EfficiencyMetrics,
    fragmentation: FragmentationAnalysis
  ): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = [];

    // High token usage recommendation
    if (efficiency.utilizationScore > 0.8) {
      recommendations.push({
        type: 'compress',
        target: 'High token usage files',
        estimatedSavings: Math.floor(efficiency.compressionPotential * 10000),
        riskLevel: 'medium',
        description: 'Apply compression to reduce token usage'
      });
    }

    // Fragmentation recommendation
    if (fragmentation.score > 0.5) {
      recommendations.push({
        type: 'consolidate',
        target: 'Fragmented content',
        estimatedSavings: 5000,
        riskLevel: 'low',
        description: 'Consolidate related files to reduce fragmentation'
      });
    }

    // Redundancy recommendation
    if (efficiency.redundancyLevel > 0.3) {
      recommendations.push({
        type: 'prioritize',
        target: 'Redundant content',
        estimatedSavings: Math.floor(efficiency.redundancyLevel * 8000),
        riskLevel: 'low',
        description: 'Remove or deduplicate redundant content'
      });
    }

    return recommendations;
  }

  getAnalysisHistory(): TokenAnalysis[] {
    return [...this.analysisHistory];
  }

  addToHistory(analysis: TokenAnalysis): void {
    this.analysisHistory.push(analysis);
    
    // Keep only last 10 analyses
    if (this.analysisHistory.length > 10) {
      this.analysisHistory = this.analysisHistory.slice(-10);
    }
  }
}