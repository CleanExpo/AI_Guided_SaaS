import { OptimizationStrategy, PreservationRule, OptimizationTrigger } from './types';

export class StrategyManager {
  private strategies: Map<string, OptimizationStrategy> = new Map();

  constructor() {
    this.initializeOptimizationStrategies();
  }

  private initializeOptimizationStrategies(): void {
    // Conservative Strategy - Minimal compression, high preservation
    this.strategies.set('conservative', {
      name: 'Conservative Optimization',
      description: 'Minimal compression with maximum preservation of context',
      targetUtilization: 0.7,
      compressionRatio: 0.1,
      preservationRules: [
        {
          type: 'always_preserve',
          pattern: /CLAUDE\.md|PROJECT_CONTEXT\.md|DEVELOPMENT_STATUS\.md/,
          priority: 10,
          reason: 'Core memory files essential for project continuity'
        },
        {
          type: 'always_preserve',
          pattern: /## 🎯 CORE CAPABILITIES|## 📊 CURRENT STATE/,
          priority: 9,
          reason: 'Critical project status information'
        },
        {
          type: 'conditionally_preserve',
          pattern: /### \*\*.*\*\*/,
          priority: 7,
          reason: 'Major section headers provide important structure'
        }
      ],
      triggers: [
        { condition: 'token_threshold', threshold: 0.85 },
        { condition: 'manual' }
      ]
    });

    // Balanced Strategy - Moderate compression with smart preservation
    this.strategies.set('balanced', {
      name: 'Balanced Optimization',
      description: 'Balanced approach with intelligent compression and preservation',
      targetUtilization: 0.75,
      compressionRatio: 0.25,
      preservationRules: [
        {
          type: 'always_preserve',
          pattern: /CLAUDE\.md|PROJECT_CONTEXT\.md/,
          priority: 10,
          reason: 'Essential memory files'
        },
        {
          type: 'conditionally_preserve',
          pattern: /✅|🚀|🧠|📊/,
          priority: 8,
          reason: 'Status indicators and key achievements'
        },
        {
          type: 'compressible',
          pattern: /### \*\*Implementation.*\*\*|### \*\*Technical.*\*\*/,
          priority: 5,
          reason: 'Technical details can be compressed while preserving key points'
        },
        {
          type: 'archivable',
          pattern: /Historical|Deprecated|Legacy/,
          priority: 2,
          reason: 'Historical information can be archived'
        }
      ],
      triggers: [
        { condition: 'token_threshold', threshold: 0.8 },
        { condition: 'context_fragmentation' },
        { condition: 'manual' }
      ]
    });

    // Aggressive Strategy - Maximum compression with strategic preservation
    this.strategies.set('aggressive', {
      name: 'Aggressive Optimization',
      description: 'Maximum compression while preserving absolutely critical information',
      targetUtilization: 0.6,
      compressionRatio: 0.4,
      preservationRules: [
        {
          type: 'always_preserve',
          pattern: /CLAUDE\.md/,
          priority: 10,
          reason: 'Core memory file is absolutely essential'
        },
        {
          type: 'always_preserve',
          pattern: /## 🧠 PROJECT IDENTITY|## 🎯 CORE CAPABILITIES/,
          priority: 9,
          reason: 'Project identity and core capabilities must be preserved'
        },
        {
          type: 'compressible',
          pattern: /.*/,
          priority: 3,
          reason: 'Most content can be compressed in aggressive mode'
        }
      ],
      triggers: [
        { condition: 'token_threshold', threshold: 0.9 },
        { condition: 'manual' }
      ]
    });
  }

  getStrategy(name: string): OptimizationStrategy | null {
    return this.strategies.get(name) || null;
  }

  getAllStrategies(): OptimizationStrategy[] {
    return Array.from(this.strategies.values());
  }

  addStrategy(name: string, strategy: OptimizationStrategy): void {
    this.strategies.set(name, strategy);
  }

  removeStrategy(name: string): boolean {
    return this.strategies.delete(name);
  }

  getStrategyNames(): string[] {
    return Array.from(this.strategies.keys());
  }

  determinePreservationLevel(
    filename: string,
    content: string,
    strategy: OptimizationStrategy
  ): PreservationRule['type'] {
    let bestMatch: PreservationRule | null = null;
    let highestPriority = -1;

    for (const rule of strategy.preservationRules) {
      const pattern = typeof rule.pattern === 'string' 
        ? new RegExp(rule.pattern) 
        : rule.pattern;

      if ((pattern.test(filename) || pattern.test(content)) && rule.priority > highestPriority) {
        bestMatch = rule;
        highestPriority = rule.priority;
      }
    }

    return bestMatch?.type || 'compressible';
  }

  shouldTriggerOptimization(
    strategy: OptimizationStrategy,
    currentUtilization: number,
    fragmentationScore?: number
  ): boolean {
    for (const trigger of strategy.triggers) {
      switch (trigger.condition) {
        case 'token_threshold':
          if (trigger.threshold && currentUtilization >= trigger.threshold) {
            return true;
          }
          break;
        case 'context_fragmentation':
          if (fragmentationScore && fragmentationScore > 0.7) {
            return true;
          }
          break;
        case 'manual':
          // Manual triggers are handled externally
          break;
        case 'time_interval':
          // Time-based triggers would need additional logic
          break;
      }
    }
    
    return false;
  }
}