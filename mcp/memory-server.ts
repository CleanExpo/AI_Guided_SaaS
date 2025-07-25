#!/usr/bin/env tsx
import { WebSocketServer } from 'ws';
import * as fs from 'fs/promises';
import * as path from 'path';
import chalk from 'chalk';

interface MemoryEntry {
  id: string;
  timestamp: Date;
  context: string;
  type: 'code' | 'conversation' | 'decision' | 'learning';
  tags: string[];
  importance: number;
}

class MemoryServer {
  private memories: Map<string, MemoryEntry> = new Map();
  private memoryFile: string;
  private wss: WebSocketServer;

  constructor(port: number = 9124) {
    this.memoryFile = path.join(process.cwd(), 'mcp-memory.json');
    this.wss = new WebSocketServer({ port });
    
    console.log(chalk.blue.bold(`\n🧠 MCP Memory Server`));
    console.log(chalk.cyan(`WebSocket server running on port ${port}\n`));
    
    this.loadMemories();
    this.setupWebSocket();
  }

  private async loadMemories() {
    try {
      const data = await fs.readFile(this.memoryFile, 'utf-8');
      const entries = JSON.parse(data);
      entries.forEach((entry: MemoryEntry) => {
        this.memories.set(entry.id, entry);
      });
      console.log(chalk.green(`✓ Loaded ${this.memories.size} memories`));
    } catch {
      console.log(chalk.yellow('⚠ No existing memories found'));
    }
  }

  private async saveMemories() {
    const entries = Array.from(this.memories.values());
    await fs.writeFile(this.memoryFile, JSON.stringify(entries, null, 2));
  }

  private setupWebSocket() {
    this.wss.on('connection', (ws) => {
      console.log(chalk.green('✓ Client connected'));
      
      ws.on('message', async (message) => {
        try {
          const data = JSON.parse(message.toString());
          const response = await this.handleMessage(data);
          ws.send(JSON.stringify(response));
        } catch (error) {
          ws.send(JSON.stringify({ error: error.message }));
        }
      });
      
      ws.on('close', () => {
        console.log(chalk.yellow('✗ Client disconnected'));
      });
    });
  }

  private async handleMessage(data: any) {
    const { action, payload } = data;
    
    switch (action) {
      case 'store':
        return this.storeMemory(payload);
      
      case 'retrieve':
        return this.retrieveMemory(payload);
      
      case 'search':
        return this.searchMemories(payload);
      
      case 'forget':
        return this.forgetMemory(payload);
      
      case 'stats':
        return this.getStats();
      
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  private storeMemory(payload: any) {
    const memory: MemoryEntry = {
      id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      context: payload.context,
      type: payload.type || 'conversation',
      tags: payload.tags || [],
      importance: payload.importance || 5
    };
    
    this.memories.set(memory.id, memory);
    this.saveMemories();
    
    console.log(chalk.cyan(`📝 Stored memory: ${memory.id}`));
    return { success: true, id: memory.id };
  }

  private retrieveMemory(payload: any) {
    const { id } = payload;
    const memory = this.memories.get(id);
    
    if (!memory) {
      throw new Error(`Memory not found: ${id}`);
    }
    
    return { success: true, memory };
  }

  private searchMemories(payload: any) {
    const { query, type, tags, limit = 10 } = payload;
    let results = Array.from(this.memories.values());
    
    // Filter by type
    if (type) {
      results = results.filter(m => m.type === type);
    }
    
    // Filter by tags
    if (tags && tags.length > 0) {
      results = results.filter(m => 
        tags.some((tag: string) => m.tags.includes(tag))
      );
    }
    
    // Search in context
    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(m => 
        m.context.toLowerCase().includes(lowerQuery)
      );
    }
    
    // Sort by importance and timestamp
    results.sort((a, b) => {
      if (a.importance !== b.importance) {
        return b.importance - a.importance;
      }
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
    
    // Limit results
    results = results.slice(0, limit);
    
    console.log(chalk.cyan(`🔍 Found ${results.length} memories`));
    return { success: true, memories: results };
  }

  private forgetMemory(payload: any) {
    const { id } = payload;
    
    if (this.memories.delete(id)) {
      this.saveMemories();
      console.log(chalk.yellow(`🗑️  Forgot memory: ${id}`));
      return { success: true };
    }
    
    throw new Error(`Memory not found: ${id}`);
  }

  private getStats() {
    const stats = {
      total: this.memories.size,
      byType: {} as Record<string, number>,
      avgImportance: 0,
      recentCount: 0
    };
    
    let totalImportance = 0;
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    this.memories.forEach(memory => {
      // Count by type
      stats.byType[memory.type] = (stats.byType[memory.type] || 0) + 1;
      
      // Sum importance
      totalImportance += memory.importance;
      
      // Count recent
      if (new Date(memory.timestamp) > oneDayAgo) {
        stats.recentCount++;
      }
    });
    
    stats.avgImportance = stats.total > 0 ? totalImportance / stats.total : 0;
    
    return { success: true, stats };
  }
}

// Example client usage
function printUsage() {
  console.log(chalk.gray('\n📖 Usage Examples:'));
  console.log(chalk.white('Store: {"action":"store","payload":{"context":"User implemented auth","type":"code","tags":["auth","feature"],"importance":8}}'));
  console.log(chalk.white('Search: {"action":"search","payload":{"query":"auth","type":"code","limit":5}}'));
  console.log(chalk.white('Stats: {"action":"stats","payload":{}}'));
  console.log(chalk.white('Retrieve: {"action":"retrieve","payload":{"id":"mem_123"}}'));
  console.log(chalk.white('Forget: {"action":"forget","payload":{"id":"mem_123"}}\n'));
}

// Start server
const server = new MemoryServer();
printUsage();

// Handle shutdown
process.on('SIGINT', () => {
  console.log(chalk.yellow('\n👋 Shutting down Memory Server...'));
  process.exit(0);
});