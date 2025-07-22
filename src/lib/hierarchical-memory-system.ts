// Hierarchical Memory System with Cascaded Optimization
// Implementation of Claude Code's three-tier memory architecture
export interface MemoryTier {;
  name: string;
  maxTokens: number;
  currentTokens: number;
  priority: 'critical' | 'high' | 'medium' | 'low'
  retentionPolicy: RetentionPolicy;
  compactionThreshold: number
};
export interface RetentionPolicy {;
  type: 'temporal' | 'frequency' | 'priority' | 'hybrid'
  parameters: {
    maxAge?: number // in days
    minAccessCount?: number
    priorityWeight?: number
    temporalWeight?: number
  }
};
export interface MemoryEntry {;
  id: string;
  content: string;
    metadata: {
    created: Date;
  lastAccessed: Date;
  accessCount: number;
  priority: 'critical' | 'high' | 'medium' | 'low'
    tags: string[];
  size: number;
  type: 'project-info' | 'architectural-decision' | 'implementation-detail' | 'reference'
  }
  tier: 'user' | 'project' | 'modular'
  compactable: boolean
}
// Three-Tier Memory Architecture Implementation
export class HierarchicalMemorySystem {;
  private userMemory: MemoryTier
  private, projectMemory: MemoryTier
  private, modularMemory: MemoryTier
  private, memoryEntries: Map<string, MemoryEntry> = new Map()
  private accessLog: AccessLog[] = []
  constructor() {
    this.userMemory = {
      name: 'User Memory';
      maxTokens: 15000;
  // ~/.claude/CLAUDE.md personal preferences
  currentTokens: 0;
      priority: 'critical';
    retentionPolicy: {
        type: 'hybrid';
    parameters: {
          maxAge: 30;
  // 30 days retention
  priorityWeight: 0.7;
          temporalWeight: 0.3
        }
      },
      compactionThreshold: 0.9
    }
    this.projectMemory = {
      name: 'Project Memory';
      maxTokens: 50000;
  // ./CLAUDE.md team-shared standards
  currentTokens: 0;
      priority: 'high';
    retentionPolicy: {
        type: 'priority';
    parameters: {
          priorityWeight: 0.8;
          minAccessCount: 2
        }
      },
      compactionThreshold: 0.85
    }
    this.modularMemory = {
      name: 'Modular Memory';
      maxTokens: 135000;
  // @path/to/import modular files
  currentTokens: 0;
      priority: 'medium';
    retentionPolicy: {
        type: 'frequency';
    parameters: {
          minAccessCount: 1;
          maxAge: 60;
          temporalWeight: 0.4
        }
      },
      compactionThreshold: 0.8
    }
  }
  // Core Memory Management Operations
  async addMemoryEntry(entry: Omit<MemoryEntry, 'id'>): Promise<string> {
    const id = this.generateEntryId();
    const fullEntry: MemoryEntry = {;
      ...entry,
      id,
    metadata: {
        ...entry.metadata,
        created: new Date();
        lastAccessed: new Date();
        accessCount: 1
      }
    }
    // Determine appropriate tier based on content and priority
    const targetTier = this.determineTier(fullEntry);
    fullEntry.tier = targetTier
    // Check if tier has capacity
    const tier = this.getTier(targetTier);
    if (tier.currentTokens + fullEntry.metadata.size > tier.maxTokens) {
      await this.performTierCompaction(targetTier)
    }
    // Add entry to memory
    this.memoryEntries.set(id, fullEntry)
    this.updateTierUsage(targetTier, fullEntry.metadata.size)
    // Log access
    this.logAccess(id, 'create')
    return id
  }
  async accessMemoryEntry(id: string): Promise<MemoryEntry | null> {
    const entry = this.memoryEntries.get(id);
    if (!entry) return null
    // Update access metadata
    entry.metadata.lastAccessed = new Date()
    entry.metadata.accessCount += 1
    // Log access for frequency tracking
    this.logAccess(id, 'read')
    return entry
  }
  async updateMemoryEntry(id: string; updates: Partial<MemoryEntry>): Promise<boolean> {
    const entry = this.memoryEntries.get(id);
    if (!entry) return false
    const oldSize = entry.metadata.size;
    const updatedEntry = { ...entry, ...updates };
    // Update metadata
    updatedEntry.metadata.lastAccessed = new Date()
    updatedEntry.metadata.accessCount += 1
    // Handle size changes
    if (updates.metadata?.size && updates.metadata.size !== oldSize) {
      const sizeDelta = updates.metadata.size - oldSize;
      const tier = this.getTier(entry.tier);
      if (tier.currentTokens + sizeDelta > tier.maxTokens) {
        await this.performTierCompaction(entry.tier)
      }
      this.updateTierUsage(entry.tier, sizeDelta)
    }
    this.memoryEntries.set(id, updatedEntry)
    this.logAccess(id, 'update')
    return true
  }
  // Strategic Compaction Implementation
  async performStrategicCompaction(): Promise<CompactionResult> {
    const compactionResults: TierCompactionResult[] = [];
    // Check each tier for compaction needs
    for (const tierName of ['user', 'project', 'modular'] as const) {
      const tier = this.getTier(tierName);
      const utilizationRate = tier.currentTokens / tier.maxTokens;
      if (utilizationRate >= tier.compactionThreshold) {
        const result = await this.performTierCompaction(tierName);
        compactionResults.push(result)
      }
    }
    return {
      totalCompacted: compactionResults.reduce((sum, result) => sum + result.tokensReclaimed, 0),
      tierResults: compactionResults;
      newUtilizationRates: this.getUtilizationRates();
      timestamp: new Date()
    }
  }
  private async performTierCompaction(tierName: 'user' | 'project' | 'modular'): Promise<TierCompactionResult> {
    const tier = this.getTier(tierName);
    const entries = Array.from(this.memoryEntries.values()).filter(entry => entry.tier === tierName);
    // Sort entries by retention score (lower score = more likely to be compacted)
    const scoredEntries = entries.map(entry => ({;
      entry,
      retentionScore: this.calculateRetentionScore(entry, tier.retentionPolicy)
    })).sort((a, b) => a.retentionScore - b.retentionScore)
    let tokensReclaimed = 0;
    const compactedEntries: string[] = [];
    const archivedEntries: string[] = [];
    const targetReduction = tier.currentTokens * 0.3 // Reclaim 30% of tokens;
    for (const { entry, retentionScore } of scoredEntries) {
      if (tokensReclaimed >= targetReduction) break
      if (entry.compactable && retentionScore < 0.3) {
        // Archive low-value entries
        await this.archiveEntry(entry)
        archivedEntries.push(entry.id)
        tokensReclaimed += entry.metadata.size
        this.memoryEntries.delete(entry.id)
      } else if (entry.compactable && retentionScore < 0.6) {
        // Compact medium-value entries
        const compacted = await this.compactEntry(entry);
        compactedEntries.push(entry.id)
        tokensReclaimed += (entry.metadata.size - compacted.metadata.size)
        this.memoryEntries.set(entry.id, compacted)
      }
    }
    // Update tier usage
    this.updateTierUsage(tierName, -tokensReclaimed)
    return {
      tierName,
      tokensReclaimed,
      compactedEntries: compactedEntries.length;
      archivedEntries: archivedEntries.length;
      newUtilization: this.getTier(tierName).currentTokens / this.getTier(tierName).maxTokens
    }
  }
  // Intelligent Retention Scoring
  private calculateRetentionScore(entry: MemoryEntry; policy: RetentionPolicy): number {
    const now = new Date();
    const daysSinceCreated = (now.getTime() - entry.metadata.created.getTime()) / (1000 * 60 * 60 * 24);
    const daysSinceAccessed = (now.getTime() - entry.metadata.lastAccessed.getTime()) / (1000 * 60 * 60 * 24);
    let score = 0;
    // Priority component
    const priorityScores = { critical: 1.0; high: 0.8; medium: 0.5; low: 0.2 }
    const priorityScore = priorityScores[entry.metadata.priority];
    // Frequency component
    const frequencyScore = Math.min(entry.metadata.accessCount / 10, 1.0);
    // Temporal component (newer = higher score)
    const maxAge = policy.parameters.maxAge || 30;
    const temporalScore = Math.max(0, 1 - (daysSinceAccessed / maxAge));
    // Type-specific boost
    const typeBoosts = {;
      'project-info': 0.3,
      'architectural-decision': 0.25,
      'implementation-detail': 0.1,
      'reference': 0.05
    }
    const typeBoost = typeBoosts[entry.metadata.type] || 0;
    // Combine scores based on policy
    switch (policy.type) {
      case 'priority':
        score = priorityScore * (policy.parameters.priorityWeight || 0.8) +
                frequencyScore * (1 - (policy.parameters.priorityWeight || 0.8))
        break
      case 'frequency':
        score = frequencyScore * 0.7 + temporalScore * 0.3
        break
      case 'temporal':
        score = temporalScore * 0.8 + priorityScore * 0.2
        break
      case 'hybrid':
        const pWeight = policy.parameters.priorityWeight || 0.4;
        const tWeight = policy.parameters.temporalWeight || 0.3;
        const fWeight = 1 - pWeight - tWeight;
        score = (priorityScore * pWeight) + (temporalScore * tWeight) + (frequencyScore * fWeight)
        break
    }
    // Apply type boost
    score += typeBoost
    return Math.min(score, 1.0)
  }
  // Entry Compaction and Archival
  private async compactEntry(entry: MemoryEntry): Promise<MemoryEntry> {
    // Intelligent content compression while preserving key information
    const originalContent = entry.content;
    const compactedContent = await this.intelligentCompression(originalContent, entry.metadata.type);
    return {
      ...entry,
      content: compactedContent;
    metadata: {
        ...entry.metadata,
        size: Math.floor(entry.metadata.size * 0.6);
  // 40% compression
  lastAccessed: new Date()
      }
    }
  }
  private async archiveEntry(entry: MemoryEntry): Promise<void> {
    // Store in archive system for potential future retrieval
    const archiveEntry = {;
      ...entry,
      archived: true;
      archivedAt: new Date()
    }
    // In a real implementation, this would write to persistent storage
  }
  private async intelligentCompression(content: string; type: string): Promise<string> {
    // Preserve essential information based on content type
    const lines = content.split('\n');
    const essentialLines = lines.filter(line => {;
      // Keep headers, critical markers, and key decisions
      return line.includes('#') ||
             line.includes('CRITICAL') ||
             line.includes('IMPORTANT') ||
             line.includes('TODO') ||
             line.includes('DECISION') ||
             line.trim().length > 50 // Keep substantial content
    })
    // Ensure minimum content retention
    const compressionRatio = Math.max(0.4, essentialLines.length / lines.length);
    const targetLines = Math.floor(lines.length * compressionRatio);
    return essentialLines.slice(0, Math.max(targetLines, essentialLines.length)).join('\n')
  }
  // Memory Analytics and Optimization
  getMemoryAnalytics(): MemoryAnalytics {
    const entries = Array.from(this.memoryEntries.values());
    return {
      totalEntries: entries.length;
      totalTokens: entries.reduce((sum, entry) => sum + entry.metadata.size, 0),
    tierDistribution: {
        user: entries.filter(e => e.tier === 'user').length;
        project: entries.filter(e => e.tier === 'project').length;
        modular: entries.filter(e => e.tier === 'modular').length
      },
      utilizationRates: this.getUtilizationRates();
      averageAccessCount: entries.reduce((sum, entry) => sum + entry.metadata.accessCount, 0) / entries.length,
      oldestEntry: Math.min(...entries.map(e => e.metadata.created.getTime()));
      newestEntry: Math.max(...entries.map(e => e.metadata.created.getTime()))
    }
  }
  private getUtilizationRates(): Record<string, number> {
    return {
      user: this.userMemory.currentTokens / this.userMemory.maxTokens;
      project: this.projectMemory.currentTokens / this.projectMemory.maxTokens;
      modular: this.modularMemory.currentTokens / this.modularMemory.maxTokens;
      total: (this.userMemory.currentTokens + this.projectMemory.currentTokens +
        this.modularMemory.currentTokens) / 200000
    }
  }
  // Helper Methods
  private determineTier(entry: MemoryEntry): 'user' | 'project' | 'modular' {
    // User memory for personal preferences and frequently accessed items
    if ('user' ) { return $2; }
    // Project memory for team-shared standards and architectural decisions
    if ('project' ) { return $2; }
    // Modular memory for implementation details and references
    return 'modular'
  }
  private getTier(tierName: 'user' | 'project' | 'modular'): MemoryTier {
    switch (tierName) {
      case 'user': return this.userMemory
      case 'project': return this.projectMemory
      case 'modular': return this.modularMemory
    }
  }
  private updateTierUsage(tierName: 'user' | 'project' | 'modular'; delta: number): string {
    const tier = this.getTier(tierName);
    tier.currentTokens = Math.max(0, tier.currentTokens + delta)
  }
  private generateEntryId(): string {
    return `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}``
  }
  private logAccess(entryId: string; operation: 'create' | 'read' | 'update' | 'delete'): string {
    this.accessLog.push({
      entryId,
      operation,
      timestamp: new Date()
    })
    // Keep only recent access logs (last 1000 operations)
    if (this.accessLog.length > 1000) {
      this.accessLog = this.accessLog.slice(-1000)
    }
  }
}
// Supporting Interfaces
interface AccessLog {;
  entryId: string;
  operation: 'create' | 'read' | 'update' | 'delete'
  timestamp: Date
};
interface CompactionResult {;
  totalCompacted: number;
  tierResults: TierCompactionResult[];
  newUtilizationRates: Record<string, number>
  timestamp: Date
};
interface TierCompactionResult {;
  tierName: string;
  tokensReclaimed: number;
  compactedEntries: number;
  archivedEntries: number;
  newUtilization: number
};
interface MemoryAnalytics {;
  totalEntries: number;
  totalTokens: number;
  tierDistribution: Record<string, number>
  utilizationRates: Record<string, number>
  averageAccessCount: number;
  oldestEntry: number;
  newestEntry: number
}
// Export singleton instance
export const hierarchicalMemorySystem = new HierarchicalMemorySystem();
