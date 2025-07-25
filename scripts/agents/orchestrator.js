#!/usr/bin/env node

const EventEmitter = require('events');
const Redis = require('redis');
const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs').promises;
const path = require('path');

const execAsync = promisify(exec);

class AgentOrchestrator extends EventEmitter {
  constructor() {
    super();
    this.agents = new Map();
    this.taskQueue = [];
    this.isRunning = false;
    this.redis = null;
    this.config = {
      maxConcurrentAgents: parseInt(process.env.MAX_CONCURRENT_AGENTS) || 2,
      pulseInterval: 3000,
      healthCheckInterval: 30000,
      taskTimeout: 300000, // 5 minutes
    };
  }

  async initialize() {
    console.log('🚀 Agent Orchestrator initializing...');
    
    // Connect to Redis
    this.redis = Redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
    
    this.redis.on('error', err => console.error('Redis error:', err));
    await this.redis.connect();
    
    // Subscribe to agent channels
    await this.setupRedisSubscriptions();
    
    // Start health monitoring
    this.startHealthMonitoring();
    
    // Start task processor
    this.startTaskProcessor();
    
    console.log('✅ Agent Orchestrator ready');
  }

  async setupRedisSubscriptions() {
    const subscriber = this.redis.duplicate();
    await subscriber.connect();
    
    // Subscribe to agent status updates
    await subscriber.subscribe('agent:status', (message) => {
      const data = JSON.parse(message);
      this.handleAgentStatus(data);
    });
    
    // Subscribe to task results
    await subscriber.subscribe('agent:result', (message) => {
      const data = JSON.parse(message);
      this.handleTaskResult(data);
    });
    
    // Subscribe to task requests
    await subscriber.subscribe('task:request', (message) => {
      const task = JSON.parse(message);
      this.addTask(task);
    });
  }

  handleAgentStatus(status) {
    const { agentId, type, state, metrics } = status;
    
    if (!this.agents.has(agentId)) {
      this.agents.set(agentId, {
        id: agentId,
        type,
        state: 'idle',
        lastSeen: Date.now(),
        metrics: {}
      });
    }
    
    const agent = this.agents.get(agentId);
    agent.state = state;
    agent.lastSeen = Date.now();
    agent.metrics = { ...agent.metrics, ...metrics };
    
    console.log(`📊 Agent ${agentId} status: ${state}`);
  }

  handleTaskResult(result) {
    const { taskId, agentId, success, data, error } = result;
    
    console.log(`✅ Task ${taskId} completed by ${agentId}: ${success ? 'SUCCESS' : 'FAILED'}`);
    
    if (error) {
      console.error(`Task error: ${error}`);
    }
    
    // Mark agent as idle
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.state = 'idle';
    }
    
    // Process next task
    this.processNextTask();
  }

  addTask(task) {
    this.taskQueue.push({
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...task,
      createdAt: Date.now()
    });
    
    console.log(`📝 Task added to queue: ${task.type}`);
    this.processNextTask();
  }

  async processNextTask() {
    if (this.taskQueue.length === 0) return;
    
    // Find available agents
    const availableAgents = Array.from(this.agents.values())
      .filter(agent => agent.state === 'idle' && this.isAgentHealthy(agent));
    
    if (availableAgents.length === 0) {
      console.log('⏳ No available agents, waiting...');
      return;
    }
    
    // Get concurrent running agents count
    const runningAgents = Array.from(this.agents.values())
      .filter(agent => agent.state === 'busy').length;
    
    if (runningAgents >= this.config.maxConcurrentAgents) {
      console.log(`⏸️  Max concurrent agents reached (${runningAgents}/${this.config.maxConcurrentAgents})`);
      return;
    }
    
    // Assign task to best agent
    const task = this.taskQueue.shift();
    const agent = this.selectBestAgent(availableAgents, task);
    
    if (agent) {
      await this.assignTask(agent, task);
    } else {
      // Put task back in queue
      this.taskQueue.unshift(task);
    }
  }

  selectBestAgent(agents, task) {
    // Select agent based on type and performance
    const typeMatch = agents.filter(a => a.type === task.preferredAgent);
    
    if (typeMatch.length > 0) {
      return typeMatch[0];
    }
    
    // Return agent with best performance metrics
    return agents.sort((a, b) => {
      const scoreA = this.calculateAgentScore(a);
      const scoreB = this.calculateAgentScore(b);
      return scoreB - scoreA;
    })[0];
  }

  calculateAgentScore(agent) {
    const { metrics } = agent;
    
    // Calculate score based on CPU, memory, and success rate
    const cpuScore = 100 - (metrics.cpuUsage || 50);
    const memoryScore = 100 - (metrics.memoryUsage || 50);
    const successScore = (metrics.successRate || 100);
    
    return (cpuScore + memoryScore + successScore) / 3;
  }

  async assignTask(agent, task) {
    agent.state = 'busy';
    agent.currentTask = task.id;
    
    console.log(`🎯 Assigning task ${task.id} to agent ${agent.id}`);
    
    // Publish task to agent
    await this.redis.publish(`agent:${agent.id}:task`, JSON.stringify(task));
    
    // Set timeout for task
    setTimeout(() => {
      if (agent.currentTask === task.id) {
        console.error(`⏱️ Task ${task.id} timed out`);
        agent.state = 'idle';
        agent.currentTask = null;
        this.taskQueue.push(task); // Retry
      }
    }, this.config.taskTimeout);
  }

  isAgentHealthy(agent) {
    const timeSinceLastSeen = Date.now() - agent.lastSeen;
    return timeSinceLastSeen < 60000; // 1 minute
  }

  startHealthMonitoring() {
    setInterval(() => {
      for (const [agentId, agent] of this.agents) {
        if (!this.isAgentHealthy(agent)) {
          console.warn(`⚠️ Agent ${agentId} is unhealthy`);
          this.agents.delete(agentId);
        }
      }
    }, this.config.healthCheckInterval);
  }

  async startTaskProcessor() {
    // Process tasks on interval
    setInterval(() => {
      this.processNextTask();
    }, this.config.pulseInterval);
    
    // Add initial tasks
    await this.addInitialTasks();
  }

  async addInitialTasks() {
    // Check evaluation scores
    this.addTask({
      type: 'evaluation',
      action: 'check',
      preferredAgent: 'qa'
    });
    
    // Check TypeScript errors
    this.addTask({
      type: 'typescript',
      action: 'analyze',
      preferredAgent: 'typescript_specialist'
    });
    
    // Monitor performance
    this.addTask({
      type: 'performance',
      action: 'monitor',
      preferredAgent: 'devops'
    });
  }

  async shutdown() {
    console.log('🛑 Shutting down orchestrator...');
    
    // Disconnect from Redis
    if (this.redis) {
      await this.redis.quit();
    }
    
    process.exit(0);
  }
}

// Start orchestrator
const orchestrator = new AgentOrchestrator();

orchestrator.initialize().catch(err => {
  console.error('Failed to initialize orchestrator:', err);
  process.exit(1);
});

// Handle shutdown
process.on('SIGINT', () => orchestrator.shutdown());
process.on('SIGTERM', () => orchestrator.shutdown());