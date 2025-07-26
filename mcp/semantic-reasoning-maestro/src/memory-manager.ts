interface MemoryEntry {
  id: string;
  timestamp: Date;
  context: any;
  result: any;
  metadata: {
    importance: number;
    accessCount: number;
    lastAccessed: Date;
    tags: string[];
    relationships: string[];
  };
}

interface MemoryIndex {
  semantic: Map<string, string[]>; // semantic hash -> memory IDs
  temporal: Map<number, string[]>; // time bucket -> memory IDs
  relational: Map<string, string[]>; // entity -> memory IDs
  importance: MemoryEntry[]; // sorted by importance
}

export class MemoryManager {
  private memories: Map<string, MemoryEntry>;
  private index: MemoryIndex;
  private maxMemories: number;
  private compressionThreshold: number;

  constructor(maxMemories: number = 10000, compressionThreshold: number = 0.8) {
    this.memories = new Map();
    this.index = {
      semantic: new Map(),
      temporal: new Map(),
      relational: new Map(),
      importance: [],
    };
    this.maxMemories = maxMemories;
    this.compressionThreshold = compressionThreshold;
  }

  async store(context: any, result: any): Promise<string> {
    const id = this.generateMemoryId();
    const timestamp = new Date();
    
    // Calculate importance based on complexity and novelty
    const importance = await this.calculateImportance(context, result);
    
    // Extract tags and relationships
    const tags = this.extractTags(context, result);
    const relationships = await this.extractRelationships(context, result);
    
    const entry: MemoryEntry = {
      id,
      timestamp,
      context,
      result,
      metadata: {
        importance,
        accessCount: 0,
        lastAccessed: timestamp,
        tags,
        relationships,
      },
    };
    
    // Store in main memory
    this.memories.set(id, entry);
    
    // Update indices
    await this.updateIndices(entry);
    
    // Compress if needed
    if (this.memories.size > this.maxMemories * this.compressionThreshold) {
      await this.compressMemories();
    }
    
    return id;
  }

  async recall(query: any): Promise<any[]> {
    // Multi-strategy recall
    const semanticMatches = await this.semanticRecall(query);
    const temporalMatches = await this.temporalRecall(query);
    const relationalMatches = await this.relationalRecall(query);
    
    // Combine and rank results
    const allMatches = this.combineMatches(
      semanticMatches,
      temporalMatches,
      relationalMatches
    );
    
    // Update access counts
    allMatches.forEach(match => {
      const memory = this.memories.get(match.id);
      if (memory) {
        memory.metadata.accessCount++;
        memory.metadata.lastAccessed = new Date();
      }
    });
    
    // Return ranked results
    return allMatches.map(match => ({
      context: match.memory.context,
      result: match.memory.result,
      relevance: match.score,
      timestamp: match.memory.timestamp,
    }));
  }

  async update(id: string, updates: Partial<MemoryEntry>): Promise<void> {
    const memory = this.memories.get(id);
    if (!memory) return;
    
    // Update memory
    Object.assign(memory, updates);
    
    // Re-index if necessary
    if (updates.context || updates.result) {
      await this.reindexMemory(memory);
    }
  }

  async forget(criteria: any): Promise<number> {
    const toForget = await this.findMemoriesToForget(criteria);
    
    toForget.forEach(id => {
      const memory = this.memories.get(id);
      if (memory) {
        this.removeFromIndices(memory);
        this.memories.delete(id);
      }
    });
    
    return toForget.length;
  }

  private generateMemoryId(): string {
    return `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async calculateImportance(context: any, result: any): Promise<number> {
    let importance = 0.5; // Base importance
    
    // Complexity factor
    const complexity = this.estimateComplexity(context);
    importance += complexity * 0.2;
    
    // Novelty factor
    const novelty = await this.estimateNovelty(context, result);
    importance += novelty * 0.2;
    
    // Result quality factor
    const quality = this.estimateQuality(result);
    importance += quality * 0.1;
    
    return Math.min(importance, 1);
  }

  private estimateComplexity(context: any): number {
    // Estimate based on context size and structure
    const jsonString = JSON.stringify(context);
    const size = jsonString.length;
    const depth = this.getObjectDepth(context);
    
    return Math.min((size / 10000) + (depth / 10), 1);
  }

  private getObjectDepth(obj: any, currentDepth: number = 0): number {
    if (typeof obj !== 'object' || obj === null) return currentDepth;
    
    const depths = Object.values(obj).map(value => 
      this.getObjectDepth(value, currentDepth + 1)
    );
    
    return Math.max(currentDepth, ...depths);
  }

  private async estimateNovelty(context: any, result: any): Promise<number> {
    // Check how different this is from existing memories
    const similar = await this.findSimilarMemories(context, 5);
    
    if (similar.length === 0) return 1; // Completely novel
    
    const avgSimilarity = similar.reduce((sum, s) => sum + s.similarity, 0) / similar.length;
    return 1 - avgSimilarity;
  }

  private estimateQuality(result: any): number {
    // Estimate result quality based on various factors
    if (!result) return 0;
    
    let quality = 0.5;
    
    // Check for completeness
    if (result.output && result.sources) quality += 0.2;
    if (result.confidence && result.confidence > 0.7) quality += 0.2;
    if (result.reasoning && result.reasoning.length > 3) quality += 0.1;
    
    return Math.min(quality, 1);
  }

  private extractTags(context: any, result: any): string[] {
    const tags = [];
    
    // Extract from context
    if (context.mode) tags.push(`mode:${context.mode}`);
    if (context.depth) tags.push(`depth:${context.depth}`);
    
    // Extract from result
    if (result.task) tags.push(`task:${result.task.split(' ')[0]}`);
    
    // Extract key terms
    const text = JSON.stringify({ context, result });
    const keyTerms = this.extractKeyTerms(text);
    tags.push(...keyTerms.map(term => `term:${term}`));
    
    return [...new Set(tags)];
  }

  private extractKeyTerms(text: string): string[] {
    // Simple keyword extraction
    const words = text.toLowerCase().match(/\b\w{4,}\b/g) || [];
    const wordFreq = new Map<string, number>();
    
    words.forEach(word => {
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
    });
    
    return Array.from(wordFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);
  }

  private async extractRelationships(context: any, result: any): Promise<string[]> {
    const relationships = [];
    
    // Find related memories
    const similar = await this.findSimilarMemories(context, 3);
    relationships.push(...similar.map(s => s.id));
    
    // Extract entity relationships
    if (context.entities) {
      context.entities.forEach(entity => {
        relationships.push(`entity:${entity}`);
      });
    }
    
    return relationships;
  }

  private async updateIndices(entry: MemoryEntry): Promise<void> {
    // Update semantic index
    const semanticHash = await this.computeSemanticHash(entry.context);
    if (!this.index.semantic.has(semanticHash)) {
      this.index.semantic.set(semanticHash, []);
    }
    this.index.semantic.get(semanticHash)!.push(entry.id);
    
    // Update temporal index
    const timeBucket = Math.floor(entry.timestamp.getTime() / (1000 * 60 * 60)); // Hour buckets
    if (!this.index.temporal.has(timeBucket)) {
      this.index.temporal.set(timeBucket, []);
    }
    this.index.temporal.get(timeBucket)!.push(entry.id);
    
    // Update relational index
    entry.metadata.relationships.forEach(rel => {
      if (!this.index.relational.has(rel)) {
        this.index.relational.set(rel, []);
      }
      this.index.relational.get(rel)!.push(entry.id);
    });
    
    // Update importance index
    this.index.importance.push(entry);
    this.index.importance.sort((a, b) => b.metadata.importance - a.metadata.importance);
  }

  private async computeSemanticHash(context: any): Promise<string> {
    // Simple semantic hashing
    const text = JSON.stringify(context);
    const terms = this.extractKeyTerms(text);
    return terms.sort().join(':');
  }

  private async compressMemories(): Promise<void> {
    // Remove least important and least accessed memories
    const candidates = Array.from(this.memories.values())
      .sort((a, b) => {
        const scoreA = a.metadata.importance + (a.metadata.accessCount / 100);
        const scoreB = b.metadata.importance + (b.metadata.accessCount / 100);
        return scoreA - scoreB;
      });
    
    const toRemove = candidates.slice(0, Math.floor(this.maxMemories * 0.2));
    
    toRemove.forEach(memory => {
      this.removeFromIndices(memory);
      this.memories.delete(memory.id);
    });
  }

  private removeFromIndices(memory: MemoryEntry): void {
    // Remove from all indices
    this.index.semantic.forEach(ids => {
      const index = ids.indexOf(memory.id);
      if (index > -1) ids.splice(index, 1);
    });
    
    this.index.temporal.forEach(ids => {
      const index = ids.indexOf(memory.id);
      if (index > -1) ids.splice(index, 1);
    });
    
    this.index.relational.forEach(ids => {
      const index = ids.indexOf(memory.id);
      if (index > -1) ids.splice(index, 1);
    });
    
    const importanceIndex = this.index.importance.findIndex(m => m.id === memory.id);
    if (importanceIndex > -1) {
      this.index.importance.splice(importanceIndex, 1);
    }
  }

  private async semanticRecall(query: any): Promise<any[]> {
    const queryHash = await this.computeSemanticHash(query);
    const directMatches = this.index.semantic.get(queryHash) || [];
    
    const matches = directMatches.map(id => ({
      id,
      memory: this.memories.get(id)!,
      score: 1.0,
    }));
    
    // Also find similar hashes
    const similarHashes = await this.findSimilarHashes(queryHash);
    
    similarHashes.forEach(({ hash, similarity }) => {
      const ids = this.index.semantic.get(hash) || [];
      ids.forEach(id => {
        matches.push({
          id,
          memory: this.memories.get(id)!,
          score: similarity,
        });
      });
    });
    
    return matches;
  }

  private async temporalRecall(query: any): Promise<any[]> {
    // Find memories from similar time periods
    const matches = [];
    
    if (query.timestamp) {
      const queryBucket = Math.floor(new Date(query.timestamp).getTime() / (1000 * 60 * 60));
      
      // Check nearby buckets
      for (let offset = -2; offset <= 2; offset++) {
        const bucket = queryBucket + offset;
        const ids = this.index.temporal.get(bucket) || [];
        
        ids.forEach(id => {
          matches.push({
            id,
            memory: this.memories.get(id)!,
            score: 1 - Math.abs(offset) * 0.2,
          });
        });
      }
    }
    
    return matches;
  }

  private async relationalRecall(query: any): Promise<any[]> {
    const matches = [];
    
    // Find memories related to entities in query
    if (query.entities) {
      query.entities.forEach(entity => {
        const relKey = `entity:${entity}`;
        const ids = this.index.relational.get(relKey) || [];
        
        ids.forEach(id => {
          matches.push({
            id,
            memory: this.memories.get(id)!,
            score: 0.8,
          });
        });
      });
    }
    
    return matches;
  }

  private combineMatches(...matchSets: any[][]): any[] {
    const combined = new Map<string, any>();
    
    matchSets.flat().forEach(match => {
      if (combined.has(match.id)) {
        // Combine scores
        const existing = combined.get(match.id);
        existing.score = Math.max(existing.score, match.score);
      } else {
        combined.set(match.id, match);
      }
    });
    
    return Array.from(combined.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Return top 10
  }

  private async findSimilarMemories(context: any, limit: number): Promise<any[]> {
    const contextHash = await this.computeSemanticHash(context);
    const allHashes = Array.from(this.index.semantic.keys());
    
    const similarities = allHashes.map(hash => ({
      hash,
      similarity: this.hashSimilarity(contextHash, hash),
    }));
    
    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .map(({ hash, similarity }) => {
        const ids = this.index.semantic.get(hash) || [];
        return ids.map(id => ({ id, similarity }));
      })
      .flat();
  }

  private async findSimilarHashes(queryHash: string): Promise<any[]> {
    const allHashes = Array.from(this.index.semantic.keys());
    
    return allHashes
      .map(hash => ({
        hash,
        similarity: this.hashSimilarity(queryHash, hash),
      }))
      .filter(({ similarity }) => similarity > 0.5)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5);
  }

  private hashSimilarity(hash1: string, hash2: string): number {
    const terms1 = new Set(hash1.split(':'));
    const terms2 = new Set(hash2.split(':'));
    
    const intersection = new Set([...terms1].filter(x => terms2.has(x)));
    const union = new Set([...terms1, ...terms2]);
    
    return intersection.size / union.size;
  }

  private async reindexMemory(memory: MemoryEntry): Promise<void> {
    // Remove from current indices
    this.removeFromIndices(memory);
    
    // Update metadata
    memory.metadata.tags = this.extractTags(memory.context, memory.result);
    memory.metadata.relationships = await this.extractRelationships(memory.context, memory.result);
    
    // Re-add to indices
    await this.updateIndices(memory);
  }

  private async findMemoriesToForget(criteria: any): Promise<string[]> {
    const toForget: string[] = [];
    
    this.memories.forEach((memory, id) => {
      let shouldForget = false;
      
      // Age-based forgetting
      if (criteria.olderThan) {
        const age = Date.now() - memory.timestamp.getTime();
        if (age > criteria.olderThan) shouldForget = true;
      }
      
      // Importance-based forgetting
      if (criteria.importanceLessThan) {
        if (memory.metadata.importance < criteria.importanceLessThan) shouldForget = true;
      }
      
      // Access-based forgetting
      if (criteria.accessedLessThan) {
        if (memory.metadata.accessCount < criteria.accessedLessThan) shouldForget = true;
      }
      
      // Tag-based forgetting
      if (criteria.withTags) {
        const hasTag = criteria.withTags.some(tag => memory.metadata.tags.includes(tag));
        if (hasTag) shouldForget = true;
      }
      
      if (shouldForget) toForget.push(id);
    });
    
    return toForget;
  }
}