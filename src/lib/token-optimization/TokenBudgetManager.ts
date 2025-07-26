import { TokenBudget, TokenAllocation, TokenAnalysis } from './types';

export class TokenBudgetManager {
  private maxTokens: number = 200000;
  private targetUtilization: number = 0.75; // 150K tokens (75% of 200K)
  private currentBudget: TokenBudget;

  constructor(maxTokens?: number, targetUtilization?: number) {
    if (maxTokens) this.maxTokens = maxTokens;
    if (targetUtilization) this.targetUtilization = targetUtilization;
    this.currentBudget = this.initializeTokenBudget();
  }

  private initializeTokenBudget(): TokenBudget {
    const targetTokens = this.maxTokens * this.targetUtilization; // 150K tokens

    return {
      total: this.maxTokens,
      allocated: {
        coreMemory: Math.floor(targetTokens * 0.15),        // 22.5K - Essential project info
        workingContext: Math.floor(targetTokens * 0.30),    // 45K - Active development
        documentation: Math.floor(targetTokens * 0.25),     // 37.5K - Documentation
        codeContext: Math.floor(targetTokens * 0.20),       // 30K - Current code
        toolOutput: Math.floor(targetTokens * 0.07),        // 10.5K - Tool results
        conversationHistory: Math.floor(targetTokens * 0.03) // 4.5K - Recent conversation
      },
      reserved: this.maxTokens - targetTokens, // 50K reserved for safety
      available: this.maxTokens,
      utilizationRate: 0
    };
  }

  getCurrentBudget(): TokenBudget {
    return { ...this.currentBudget };
  }

  updateTokenBudget(analysis: TokenAnalysis): void {
    this.currentBudget.available = this.maxTokens - analysis.currentUsage;
    this.currentBudget.utilizationRate = analysis.currentUsage / this.maxTokens;
  }

  checkBudgetExceeded(allocation: keyof TokenAllocation, tokensToAdd: number): boolean {
    const currentAllocation = this.currentBudget.allocated[allocation];
    return tokensToAdd > currentAllocation;
  }

  allocateTokens(allocation: keyof TokenAllocation, tokens: number): boolean {
    if (this.checkBudgetExceeded(allocation, tokens)) {
      return false;
    }

    this.currentBudget.allocated[allocation] -= tokens;
    this.currentBudget.available -= tokens;
    return true;
  }

  deallocateTokens(allocation: keyof TokenAllocation, tokens: number): void {
    this.currentBudget.allocated[allocation] += tokens;
    this.currentBudget.available += tokens;
  }

  getUtilizationRate(): number {
    return this.currentBudget.utilizationRate;
  }

  isNearCapacity(threshold: number = 0.85): boolean {
    return this.currentBudget.utilizationRate >= threshold;
  }

  getAvailableTokens(): number {
    return this.currentBudget.available;
  }

  getRecommendedAction(): string {
    const utilization = this.currentBudget.utilizationRate;
    
    if (utilization < 0.5) {
      return 'optimal';
    } else if (utilization < 0.75) {
      return 'monitor';
    } else if (utilization < 0.85) {
      return 'optimize';
    } else {
      return 'urgent_optimization';
    }
  }

  resetBudget(): void {
    this.currentBudget = this.initializeTokenBudget();
  }
}