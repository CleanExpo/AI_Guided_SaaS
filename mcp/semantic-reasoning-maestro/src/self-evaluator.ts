interface EvaluationResult {
  score: number;
  confidence: number;
  quality: number;
  issues: string[];
  improvements: string[];
  furtherResearch: string[];
}

interface ArtifactEvaluation {
  score: number;
  issues: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
    location?: string;
  }>;
  suggestions: string[];
}

export class SelfEvaluator {
  private evaluationCriteria: Map<string, (input: any) => number>;
  
  constructor() {
    this.evaluationCriteria = new Map();
    this.initializeCriteria();
  }

  async evaluate(reasoningResult: any): Promise<EvaluationResult> {
    // Multi-dimensional evaluation
    const scores = {
      completeness: await this.evaluateCompleteness(reasoningResult),
      coherence: await this.evaluateCoherence(reasoningResult),
      accuracy: await this.evaluateAccuracy(reasoningResult),
      novelty: await this.evaluateNovelty(reasoningResult),
      usefulness: await this.evaluateUsefulness(reasoningResult),
    };
    
    // Calculate overall quality
    const quality = this.calculateOverallQuality(scores);
    
    // Assess confidence
    const confidence = await this.assessConfidence(reasoningResult, scores);
    
    // Identify issues
    const issues = await this.identifyIssues(reasoningResult, scores);
    
    // Suggest improvements
    const improvements = await this.suggestImprovements(reasoningResult, issues);
    
    // Identify areas for further research
    const furtherResearch = await this.identifyResearchGaps(reasoningResult);
    
    return {
      score: quality,
      confidence,
      quality: quality * 10, // Scale to 0-10
      issues,
      improvements,
      furtherResearch,
    };
  }

  async evaluateArtifact(artifact: string, criteria: string[]): Promise<ArtifactEvaluation> {
    const issues: ArtifactEvaluation['issues'] = [];
    
    // Apply each criterion
    for (const criterion of criteria) {
      const criterionIssues = await this.applyCriterion(artifact, criterion);
      issues.push(...criterionIssues);
    }
    
    // Additional automatic checks
    const automaticIssues = await this.performAutomaticChecks(artifact);
    issues.push(...automaticIssues);
    
    // Calculate score based on issues
    const score = this.calculateArtifactScore(issues);
    
    // Generate suggestions
    const suggestions = await this.generateSuggestions(artifact, issues);
    
    return {
      score,
      issues,
      suggestions,
    };
  }

  private initializeCriteria() {
    // Define evaluation criteria functions
    this.evaluationCriteria.set('completeness', (result) => {
      // Check if all aspects of the problem were addressed
      let score = 0.5;
      
      if (result.plan && result.plan.length > 0) score += 0.1;
      if (result.sources && result.sources.length > 0) score += 0.1;
      if (result.reasoning && result.reasoning.length > 0) score += 0.1;
      if (result.output) score += 0.2;
      
      return Math.min(score, 1);
    });
    
    this.evaluationCriteria.set('coherence', (result) => {
      // Check logical flow and consistency
      let score = 0.7;
      
      // Check if reasoning steps follow logically
      if (result.reasoning) {
        const coherenceScore = this.assessReasoningCoherence(result.reasoning);
        score = coherenceScore;
      }
      
      return score;
    });
    
    this.evaluationCriteria.set('accuracy', (result) => {
      // Assess factual accuracy (would need external validation in production)
      // For now, base on confidence levels and source reliability
      let score = 0.6;
      
      if (result.sources) {
        const avgReliability = result.sources.reduce((sum, s) => sum + (s.reliability || 0.5), 0) / result.sources.length;
        score = avgReliability;
      }
      
      return score;
    });
  }

  private async evaluateCompleteness(result: any): Promise<number> {
    const criterion = this.evaluationCriteria.get('completeness');
    return criterion ? criterion(result) : 0.5;
  }

  private async evaluateCoherence(result: any): Promise<number> {
    const criterion = this.evaluationCriteria.get('coherence');
    return criterion ? criterion(result) : 0.5;
  }

  private async evaluateAccuracy(result: any): Promise<number> {
    const criterion = this.evaluationCriteria.get('accuracy');
    return criterion ? criterion(result) : 0.5;
  }

  private async evaluateNovelty(result: any): Promise<number> {
    // Assess how novel or creative the solution is
    let score = 0.5;
    
    // Check for unique insights
    if (result.reasoning) {
      const uniqueApproaches = new Set(result.reasoning.map(r => r.type)).size;
      score += uniqueApproaches * 0.1;
    }
    
    return Math.min(score, 1);
  }

  private async evaluateUsefulness(result: any): Promise<number> {
    // Assess practical applicability
    let score = 0.6;
    
    // Check if output is actionable
    if (result.output && result.output.length > 100) score += 0.2;
    if (result.plan && result.plan.some(p => p.type === 'implementation')) score += 0.2;
    
    return Math.min(score, 1);
  }

  private calculateOverallQuality(scores: Record<string, number>): number {
    // Weighted average of all scores
    const weights = {
      completeness: 0.25,
      coherence: 0.25,
      accuracy: 0.3,
      novelty: 0.1,
      usefulness: 0.1,
    };
    
    let weightedSum = 0;
    let totalWeight = 0;
    
    for (const [criterion, score] of Object.entries(scores)) {
      const weight = weights[criterion] || 0.1;
      weightedSum += score * weight;
      totalWeight += weight;
    }
    
    return weightedSum / totalWeight;
  }

  private async assessConfidence(result: any, scores: Record<string, number>): Promise<number> {
    // Base confidence on quality scores and reasoning depth
    let confidence = this.calculateOverallQuality(scores);
    
    // Adjust based on reasoning depth
    if (result.reasoning && result.reasoning.length > 5) {
      confidence += 0.1;
    }
    
    // Adjust based on source count
    if (result.sources && result.sources.length > 3) {
      confidence += 0.1;
    }
    
    // Check for uncertainty indicators
    const uncertaintyCount = this.countUncertaintyIndicators(result);
    confidence -= uncertaintyCount * 0.05;
    
    return Math.max(0, Math.min(confidence, 1)) * 100; // Return as percentage
  }

  private countUncertaintyIndicators(result: any): number {
    const uncertaintyWords = ['might', 'maybe', 'possibly', 'unclear', 'uncertain', 'approximate'];
    const text = JSON.stringify(result).toLowerCase();
    
    return uncertaintyWords.reduce((count, word) => {
      const matches = text.match(new RegExp(word, 'g'));
      return count + (matches ? matches.length : 0);
    }, 0);
  }

  private async identifyIssues(result: any, scores: Record<string, number>): Promise<string[]> {
    const issues = [];
    
    // Check each score dimension
    if (scores.completeness < 0.7) {
      issues.push('Incomplete coverage of problem aspects');
    }
    
    if (scores.coherence < 0.7) {
      issues.push('Logical flow could be improved');
    }
    
    if (scores.accuracy < 0.7) {
      issues.push('Accuracy concerns - needs verification');
    }
    
    if (scores.novelty < 0.3) {
      issues.push('Solution lacks creativity or novel insights');
    }
    
    if (scores.usefulness < 0.6) {
      issues.push('Output may not be practically applicable');
    }
    
    // Check for specific problems
    if (!result.sources || result.sources.length === 0) {
      issues.push('No sources cited');
    }
    
    if (result.reasoning && result.reasoning.length < 3) {
      issues.push('Reasoning depth insufficient');
    }
    
    return issues;
  }

  private async suggestImprovements(result: any, issues: string[]): Promise<string[]> {
    const improvements = [];
    
    // Map issues to improvements
    const issueToImprovement = {
      'Incomplete coverage of problem aspects': 'Expand analysis to cover all problem dimensions',
      'Logical flow could be improved': 'Reorganize reasoning steps for better coherence',
      'Accuracy concerns - needs verification': 'Cross-reference with additional authoritative sources',
      'Solution lacks creativity or novel insights': 'Explore alternative approaches or perspectives',
      'Output may not be practically applicable': 'Add concrete examples and implementation details',
      'No sources cited': 'Research and cite relevant sources',
      'Reasoning depth insufficient': 'Add more intermediate reasoning steps',
    };
    
    issues.forEach(issue => {
      const improvement = issueToImprovement[issue];
      if (improvement) {
        improvements.push(improvement);
      }
    });
    
    // Add general improvements
    if (result.confidence && result.confidence < 70) {
      improvements.push('Increase analysis depth to improve confidence');
    }
    
    return improvements;
  }

  private async identifyResearchGaps(result: any): Promise<string[]> {
    const gaps = [];
    
    // Analyze what wasn't covered
    if (result.task) {
      const taskKeywords = this.extractKeywords(result.task);
      const coveredKeywords = this.extractCoveredKeywords(result);
      
      taskKeywords.forEach(keyword => {
        if (!coveredKeywords.has(keyword)) {
          gaps.push(`Research needed on: ${keyword}`);
        }
      });
    }
    
    // Check for explicit unknowns mentioned
    if (result.output) {
      const unknowns = this.extractUnknowns(result.output);
      gaps.push(...unknowns.map(u => `Investigate: ${u}`));
    }
    
    // Check for low-confidence areas
    if (result.reasoning) {
      result.reasoning.forEach(step => {
        if (step.confidence < 0.6) {
          gaps.push(`Low confidence area: ${step.description}`);
        }
      });
    }
    
    return gaps.slice(0, 5); // Limit to top 5
  }

  private extractKeywords(text: string): Set<string> {
    const words = text.toLowerCase().match(/\b\w{4,}\b/g) || [];
    const stopWords = new Set(['that', 'this', 'with', 'from', 'have', 'been', 'were', 'their']);
    
    return new Set(words.filter(word => !stopWords.has(word)));
  }

  private extractCoveredKeywords(result: any): Set<string> {
    const covered = new Set<string>();
    const text = JSON.stringify(result).toLowerCase();
    
    const words = text.match(/\b\w{4,}\b/g) || [];
    words.forEach(word => covered.add(word));
    
    return covered;
  }

  private extractUnknowns(text: string): string[] {
    const unknowns = [];
    const patterns = [
      /unknown\s+(\w+)/gi,
      /unclear\s+(\w+)/gi,
      /further research needed on\s+([^.]+)/gi,
    ];
    
    patterns.forEach(pattern => {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        unknowns.push(match[1]);
      }
    });
    
    return unknowns;
  }

  private assessReasoningCoherence(reasoning: any[]): number {
    if (!reasoning || reasoning.length === 0) return 0.5;
    
    let coherenceScore = 1;
    
    // Check if each step builds on previous
    for (let i = 1; i < reasoning.length; i++) {
      const current = reasoning[i];
      const previous = reasoning[i - 1];
      
      // Check if current step references previous
      const references = this.checkReference(current, previous);
      if (!references) {
        coherenceScore -= 0.1;
      }
    }
    
    // Check for logical progression
    const types = reasoning.map(r => r.type);
    const hasLogicalProgression = this.checkLogicalProgression(types);
    if (!hasLogicalProgression) {
      coherenceScore -= 0.2;
    }
    
    return Math.max(0.3, coherenceScore);
  }

  private checkReference(current: any, previous: any): boolean {
    // Simple check if current step references previous
    const currentText = JSON.stringify(current).toLowerCase();
    const previousTerms = this.extractKeywords(previous.conclusion || '');
    
    for (const term of previousTerms) {
      if (currentText.includes(term)) {
        return true;
      }
    }
    
    return false;
  }

  private checkLogicalProgression(types: string[]): boolean {
    // Check if reasoning types follow a logical pattern
    const validProgressions = [
      ['analysis', 'synthesis'],
      ['deduction', 'induction'],
      ['hypothesis', 'evidence', 'conclusion'],
    ];
    
    for (const progression of validProgressions) {
      if (this.matchesProgression(types, progression)) {
        return true;
      }
    }
    
    return types.length > 0;
  }

  private matchesProgression(actual: string[], expected: string[]): boolean {
    let expectedIndex = 0;
    
    for (const type of actual) {
      if (type === expected[expectedIndex]) {
        expectedIndex++;
        if (expectedIndex >= expected.length) {
          return true;
        }
      }
    }
    
    return false;
  }

  private async applyCriterion(artifact: string, criterion: string): Promise<ArtifactEvaluation['issues']> {
    const issues: ArtifactEvaluation['issues'] = [];
    
    switch (criterion) {
      case 'correctness':
        issues.push(...await this.checkCorrectness(artifact));
        break;
        
      case 'completeness':
        issues.push(...await this.checkCompleteness(artifact));
        break;
        
      case 'efficiency':
        issues.push(...await this.checkEfficiency(artifact));
        break;
        
      case 'readability':
        issues.push(...await this.checkReadability(artifact));
        break;
        
      case 'best-practices':
        issues.push(...await this.checkBestPractices(artifact));
        break;
    }
    
    return issues;
  }

  private async performAutomaticChecks(artifact: string): Promise<ArtifactEvaluation['issues']> {
    const issues: ArtifactEvaluation['issues'] = [];
    
    // Check for common problems
    if (artifact.includes('TODO')) {
      issues.push({
        type: 'incomplete',
        severity: 'medium',
        description: 'Contains TODO markers',
      });
    }
    
    if (artifact.includes('console.log')) {
      issues.push({
        type: 'debug-code',
        severity: 'low',
        description: 'Contains debug logging statements',
      });
    }
    
    // Check for syntax issues (simplified)
    const syntaxIssues = this.checkSyntax(artifact);
    issues.push(...syntaxIssues);
    
    return issues;
  }

  private checkSyntax(artifact: string): ArtifactEvaluation['issues'] {
    const issues: ArtifactEvaluation['issues'] = [];
    
    // Basic bracket matching
    const openBrackets = (artifact.match(/[{(\[]/g) || []).length;
    const closeBrackets = (artifact.match(/[})\]]/g) || []).length;
    
    if (openBrackets !== closeBrackets) {
      issues.push({
        type: 'syntax',
        severity: 'high',
        description: 'Mismatched brackets',
      });
    }
    
    return issues;
  }

  private async checkCorrectness(artifact: string): Promise<ArtifactEvaluation['issues']> {
    // Check logical correctness
    return [];
  }

  private async checkCompleteness(artifact: string): Promise<ArtifactEvaluation['issues']> {
    // Check if all required parts are present
    return [];
  }

  private async checkEfficiency(artifact: string): Promise<ArtifactEvaluation['issues']> {
    const issues: ArtifactEvaluation['issues'] = [];
    
    // Check for obvious inefficiencies
    if (artifact.includes('for') && artifact.includes('for', artifact.indexOf('for') + 3)) {
      issues.push({
        type: 'performance',
        severity: 'medium',
        description: 'Nested loops detected - consider optimization',
      });
    }
    
    return issues;
  }

  private async checkReadability(artifact: string): Promise<ArtifactEvaluation['issues']> {
    const issues: ArtifactEvaluation['issues'] = [];
    
    // Check line length
    const lines = artifact.split('\n');
    lines.forEach((line, index) => {
      if (line.length > 120) {
        issues.push({
          type: 'style',
          severity: 'low',
          description: 'Line too long',
          location: `Line ${index + 1}`,
        });
      }
    });
    
    return issues;
  }

  private async checkBestPractices(artifact: string): Promise<ArtifactEvaluation['issues']> {
    // Check against known best practices
    return [];
  }

  private calculateArtifactScore(issues: ArtifactEvaluation['issues']): number {
    let score = 1.0;
    
    // Deduct points based on issue severity
    issues.forEach(issue => {
      switch (issue.severity) {
        case 'high':
          score -= 0.2;
          break;
        case 'medium':
          score -= 0.1;
          break;
        case 'low':
          score -= 0.05;
          break;
      }
    });
    
    return Math.max(0, score);
  }

  private async generateSuggestions(artifact: string, issues: ArtifactEvaluation['issues']): Promise<string[]> {
    const suggestions = [];
    
    // Generate suggestions based on issues
    const issueTypes = new Set(issues.map(i => i.type));
    
    if (issueTypes.has('syntax')) {
      suggestions.push('Fix syntax errors before proceeding');
    }
    
    if (issueTypes.has('performance')) {
      suggestions.push('Consider algorithm optimization for better performance');
    }
    
    if (issueTypes.has('style')) {
      suggestions.push('Format code according to style guidelines');
    }
    
    if (issueTypes.has('incomplete')) {
      suggestions.push('Complete all TODO items');
    }
    
    // Add general suggestions
    if (suggestions.length === 0) {
      suggestions.push('Code looks good - consider adding tests');
    }
    
    return suggestions;
  }
}