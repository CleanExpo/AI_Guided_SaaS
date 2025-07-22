#!/usr/bin/env node

/**
 * Agent-OS Enhanced Orchestrator for 6-Stage Health Check
 * Optimized for CPU efficiency and systematic issue resolution
 */

import { performance } from 'perf_hooks';
import { EventEmitter } from 'events';

export interface HealthCheckAgent {
  id: string;
  name: string;
  stage: 1 | 2 | 3 | 4 | 5 | 6;
  priority: 'critical' | 'high' | 'medium' | 'low';
  cpuLimit: number;
  memoryLimit: number; // MB
  dependencies: string[];
  executionWindow: number; // minutes
  status: 'pending' | 'running' | 'completed' | 'failed' | 'timeout';
  startTime?: number;
  endTime?: number;
  results?: any;
  errors?: string[];
}

export interface OrchestrationConfig {
  maxConcurrentAgents: number;
  cpuMonitoring: boolean;
  failFastEnabled: boolean;
  rollbackTriggers: string[];
  resourceLimits: {
    maxCpuPercent: number;
    maxMemoryMB: number;
    maxExecutionTimeMinutes: number;
  };
}

export class EnhancedAgentOrchestrator extends EventEmitter {
  private agents: Map<string, HealthCheckAgent> = new Map();
  private runningAgents: Set<string> = new Set();
  private completedAgents: Set<string> = new Set();
  private failedAgents: Set<string> = new Set();
  private config: OrchestrationConfig;
  private healthCheckResults: Map<string, any> = new Map();
  private systemResourceMonitor?: NodeJS.Timeout;
  private projectRoot: string;

  constructor(config: OrchestrationConfig, projectRoot: string = process.cwd()) {
    super();
    this.config = config;
    this.projectRoot = projectRoot;
    this.initializeAgents();
    this.setupResourceMonitoring();
  }

  private initializeAgents(): void {
    const agents: HealthCheckAgent[] = [
      {
        id: 'static-analysis',
        name: 'Static Analysis Agent',
        stage: 1,
        priority: 'critical',
        cpuLimit: 25,
        memoryLimit: 512,
        dependencies: [],
        executionWindow: 5,
        status: 'pending',
        errors: []
      },
      {
        id: 'build-simulation',
        name: 'Build Simulation Agent', 
        stage: 2,
        priority: 'critical',
        cpuLimit: 40,
        memoryLimit: 1024,
        dependencies: ['static-analysis'],
        executionWindow: 10,
        status: 'pending',
        errors: []
      },
      {
        id: 'deployment-health',
        name: 'Deployment Health Agent',
        stage: 3,
        priority: 'high',
        cpuLimit: 20,
        memoryLimit: 256,
        dependencies: ['static-analysis'],
        executionWindow: 8,
        status: 'pending',
        errors: []
      },
      {
        id: 'recovery-rollback',
        name: 'Recovery & Rollback Agent',
        stage: 4,
        priority: 'high',
        cpuLimit: 15,
        memoryLimit: 256,
        dependencies: [],
        executionWindow: 3,
        status: 'pending',
        errors: []
      },
      {
        id: 'environment-parity',
        name: 'Environment Parity Agent',
        stage: 5,
        priority: 'medium',
        cpuLimit: 30,
        memoryLimit: 512,
        dependencies: ['build-simulation', 'deployment-health'],
        executionWindow: 12,
        status: 'pending',
        errors: []
      },
      {
        id: 'quality-gates',
        name: 'Quality Gates Agent',
        stage: 6,
        priority: 'medium',
        cpuLimit: 35,
        memoryLimit: 768,
        dependencies: ['environment-parity', 'recovery-rollback'],
        executionWindow: 15,
        status: 'pending',
        errors: []
      }
    ];

    agents.forEach(agent => {
      this.agents.set(agent.id, agent);
    });
  }

  private setupResourceMonitoring(): void {
    if (!this.config.cpuMonitoring) return;

    this.systemResourceMonitor = setInterval(() => {
      const memUsage = process.memoryUsage();
      const currentMemoryMB = memUsage.heapUsed / 1024 / 1024;

      // Check if we're approaching resource limits
      if (currentMemoryMB > this.config.resourceLimits.maxMemoryMB) {
        this.emit('resource-limit-exceeded', {
          type: 'memory',
          current: currentMemoryMB,
          limit: this.config.resourceLimits.maxMemoryMB
        });
        
        if (this.config.failFastEnabled) {
          this.emergencyShutdown('Memory limit exceeded');
        }
      }
    }, 5000); // Check every 5 seconds
  }

  private async canRunAgent(agentId: string): Promise<boolean> {
    const agent = this.agents.get(agentId);
    if (!agent) return false;

    // Check concurrent agent limit
    if (this.runningAgents.size >= this.config.maxConcurrentAgents) {
      return false;
    }

    // Check dependencies
    for (const depId of agent.dependencies) {
      if (!this.completedAgents.has(depId)) {
        return false;
      }
    }

    // Check if any dependencies failed
    for (const depId of agent.dependencies) {
      if (this.failedAgents.has(depId)) {
        return false;
      }
    }

    return true;
  }

  public async executeHealthCheck(): Promise<Map<string, any>> {
    console.log('🚀 Starting Agent-OS 6-Stage Health Check');
    console.log(`🤖 Orchestrating ${this.agents.size} specialized agents`);
    console.log(`⚡ CPU Optimization: Max ${this.config.maxConcurrentAgents} concurrent agents\n`);

    this.emit('health-check-started');

    try {
      await this.executeAgentPipeline();
      this.emit('health-check-completed', this.healthCheckResults);
      return this.healthCheckResults;
    } catch (error) {
      this.emit('health-check-failed', error);
      throw error;
    } finally {
      this.cleanup();
    }
  }

  private async executeAgentPipeline(): Promise<void> {
    const stages = [1, 2, 3, 4, 5, 6];
    
    for (const stage of stages) {
      console.log(`\n📋 === STAGE ${stage} EXECUTION ===`);
      await this.executeStage(stage);
      
      // Check for critical failures
      if (this.shouldAbortPipeline()) {
        throw new Error(`Pipeline aborted due to critical failures in Stage ${stage}`);
      }
    }
  }

  private async executeStage(stageNumber: number): Promise<void> {
    const stageAgents = Array.from(this.agents.values())
      .filter(agent => agent.stage === stageNumber)
      .sort((a, b) => this.getPriorityValue(a.priority) - this.getPriorityValue(b.priority));

    const promises: Promise<void>[] = [];

    for (const agent of stageAgents) {
      if (await this.canRunAgent(agent.id)) {
        promises.push(this.executeAgent(agent));
        
        // Control concurrency
        if (promises.length >= this.config.maxConcurrentAgents) {
          await Promise.race(promises);
          // Remove completed promises
          const completedIndex = promises.findIndex(p => 
            Array.from(this.runningAgents.values()).length < this.config.maxConcurrentAgents
          );
          if (completedIndex >= 0) {
            promises.splice(completedIndex, 1);
          }
        }
      }
    }

    // Wait for all remaining stage agents to complete
    if (promises.length > 0) {
      await Promise.all(promises);
    }
  }

  private async executeAgent(agent: HealthCheckAgent): Promise<void> {
    agent.status = 'running';
    agent.startTime = performance.now();
    this.runningAgents.add(agent.id);

    console.log(`  🤖 ${agent.name} started (CPU Limit: ${agent.cpuLimit}%, Memory: ${agent.memoryLimit}MB)`);

    try {
      // Set execution timeout
      const timeout = agent.executionWindow * 60 * 1000; // Convert to milliseconds
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Agent execution timeout')), timeout);
      });

      // Execute agent based on type
      const agentPromise = this.executeAgentLogic(agent);

      const result = await Promise.race([agentPromise, timeoutPromise]);
      
      agent.results = result;
      agent.status = 'completed';
      agent.endTime = performance.now();
      
      this.completedAgents.add(agent.id);
      this.healthCheckResults.set(agent.id, result);

      const executionTime = ((agent.endTime - agent.startTime!) / 1000).toFixed(2);
      console.log(`  ✅ ${agent.name} completed in ${executionTime}s`);
      
    } catch (error) {
      agent.status = 'failed';
      agent.errors?.push(error instanceof Error ? error.message : String(error));
      agent.endTime = performance.now();
      
      this.failedAgents.add(agent.id);

      const executionTime = agent.endTime ? ((agent.endTime - agent.startTime!) / 1000).toFixed(2) : 'N/A';
      console.log(`  ❌ ${agent.name} failed after ${executionTime}s: ${error}`);

      if (agent.priority === 'critical' && this.config.failFastEnabled) {
        throw new Error(`Critical agent ${agent.name} failed: ${error}`);
      }
    } finally {
      this.runningAgents.delete(agent.id);
    }
  }

  private async executeAgentLogic(agent: HealthCheckAgent): Promise<any> {
    // This will be implemented by specific agent modules
    switch (agent.id) {
      case 'static-analysis':
        return await this.executeStaticAnalysis();
      case 'build-simulation':
        return await this.executeBuildSimulation();
      case 'deployment-health':
        return await this.executeDeploymentHealth();
      case 'recovery-rollback':
        return await this.executeRecoveryRollback();
      case 'environment-parity':
        return await this.executeEnvironmentParity();
      case 'quality-gates':
        return await this.executeQualityGates();
      default:
        throw new Error(`Unknown agent: ${agent.id}`);
    }
  }

  // Individual agent execution methods
  private async executeStaticAnalysis(): Promise<any> {
    const { StaticAnalysisAgent } = await import('../agents/static-analysis-agent.js');
    const agent = new StaticAnalysisAgent(this.projectRoot);
    const results = await agent.execute();
    
    // Log critical findings
    if (results.criticalIssues.length > 0) {
      console.log(`🚨 Found ${results.criticalIssues.length} critical issues:`);
      results.criticalIssues.forEach((issue, i) => {
        console.log(`   ${i + 1}. ${issue.description} (${issue.location})`);
      });
    }
    
    if (results.vercelSpecificIssues.length > 0) {
      console.log(`🌐 Found ${results.vercelSpecificIssues.length} Vercel-specific issues`);
    }
    
    return results;
  }

  private async executeBuildSimulation(): Promise<any> {
    return { message: 'Build simulation placeholder - will implement next' };
  }

  private async executeDeploymentHealth(): Promise<any> {
    return { message: 'Deployment health placeholder - will implement next' };
  }

  private async executeRecoveryRollback(): Promise<any> {
    return { message: 'Recovery rollback placeholder - will implement next' };
  }

  private async executeEnvironmentParity(): Promise<any> {
    return { message: 'Environment parity placeholder - will implement next' };
  }

  private async executeQualityGates(): Promise<any> {
    return { message: 'Quality gates placeholder - will implement next' };
  }

  private shouldAbortPipeline(): boolean {
    // Abort if any critical agent failed
    for (const agentId of this.failedAgents) {
      const agent = this.agents.get(agentId);
      if (agent?.priority === 'critical') {
        return true;
      }
    }
    return false;
  }

  private getPriorityValue(priority: string): number {
    switch (priority) {
      case 'critical': return 1;
      case 'high': return 2;
      case 'medium': return 3;
      case 'low': return 4;
      default: return 5;
    }
  }

  private emergencyShutdown(reason: string): void {
    console.log(`🚨 EMERGENCY SHUTDOWN: ${reason}`);
    
    // Stop all running agents
    for (const agentId of this.runningAgents) {
      const agent = this.agents.get(agentId);
      if (agent) {
        agent.status = 'failed';
        agent.errors?.push(`Emergency shutdown: ${reason}`);
      }
    }

    this.cleanup();
    process.exit(1);
  }

  private cleanup(): void {
    if (this.systemResourceMonitor) {
      clearInterval(this.systemResourceMonitor);
    }
  }

  public generateReport(): string {
    let report = '\n╔══════════════════════════════════════════════════════════════════════════════╗\n';
    report += '║                    AGENT-OS 6-STAGE HEALTH CHECK REPORT                      ║\n';
    report += '╚══════════════════════════════════════════════════════════════════════════════╝\n\n';

    const completed = this.completedAgents.size;
    const failed = this.failedAgents.size;
    const total = this.agents.size;

    report += `📊 EXECUTION SUMMARY:\n`;
    report += `   ✅ Completed: ${completed}/${total} agents\n`;
    report += `   ❌ Failed: ${failed}/${total} agents\n`;
    report += `   🎯 Success Rate: ${((completed / total) * 100).toFixed(1)}%\n\n`;

    report += `📋 STAGE-BY-STAGE RESULTS:\n`;
    for (let stage = 1; stage <= 6; stage++) {
      const stageAgents = Array.from(this.agents.values()).filter(a => a.stage === stage);
      report += `\n   STAGE ${stage}:\n`;
      
      for (const agent of stageAgents) {
        const status = agent.status === 'completed' ? '✅' : 
                      agent.status === 'failed' ? '❌' : 
                      agent.status === 'running' ? '🔄' : '⏸️';
        
        const executionTime = agent.startTime && agent.endTime ? 
          ((agent.endTime - agent.startTime) / 1000).toFixed(2) + 's' : 'N/A';
        
        report += `     ${status} ${agent.name} (${executionTime})\n`;
        
        if (agent.errors && agent.errors.length > 0) {
          report += `       ⚠️  ${agent.errors[0]}\n`;
        }
      }
    }

    return report;
  }
}

// Default configuration for Agent-OS health checks
export const DEFAULT_CONFIG: OrchestrationConfig = {
  maxConcurrentAgents: 2,
  cpuMonitoring: true,
  failFastEnabled: true,
  rollbackTriggers: ['critical_error', 'cpu_overload', 'memory_exhausted'],
  resourceLimits: {
    maxCpuPercent: 75,
    maxMemoryMB: 2048,
    maxExecutionTimeMinutes: 60
  }
};
