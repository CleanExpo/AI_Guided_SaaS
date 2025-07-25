#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const Redis = require('redis');

const execAsync = promisify(exec);

class EvaluationMonitorAgent {
  constructor() {
    this.agentId = 'evaluation-monitor-' + process.pid;
    this.redis = null;
    this.checkInterval = parseInt(process.env.CHECK_INTERVAL) || 300000; // 5 minutes
    this.minScore = parseFloat(process.env.MIN_SCORE) || 8;
    this.autoFix = process.env.AUTO_FIX === 'true';
    this.lastScores = null;
  }

  async initialize() {
    console.log('📊 Evaluation Monitor Agent starting...');
    console.log(`  Check interval: ${this.checkInterval / 1000}s`);
    console.log(`  Minimum score: ${this.minScore}/10`);
    console.log(`  Auto-fix: ${this.autoFix}`);
    
    // Connect to Redis if available
    if (process.env.REDIS_URL) {
      this.redis = Redis.createClient({
        url: process.env.REDIS_URL
      });
      
      await this.redis.connect();
      await this.reportStatus('initializing');
    }
    
    // Start monitoring
    await this.startMonitoring();
  }

  async reportStatus(state, metrics = {}) {
    if (this.redis) {
      await this.redis.publish('agent:status', JSON.stringify({
        agentId: this.agentId,
        type: 'evaluation',
        state,
        metrics: {
          ...metrics,
          lastCheck: new Date().toISOString()
        }
      }));
    }
  }

  async startMonitoring() {
    // Initial check
    await this.checkEvaluation();
    
    // Set up interval
    setInterval(async () => {
      await this.checkEvaluation();
    }, this.checkInterval);
  }

  async checkEvaluation() {
    console.log('\n🔍 Running evaluation check...');
    await this.reportStatus('busy');
    
    try {
      // Run evaluation tests
      const { stdout, stderr } = await execAsync('npm run eval:run', {
        env: { ...process.env, CI: 'true' },
        maxBuffer: 1024 * 1024 * 10
      });
      
      // Parse results
      const scores = await this.parseEvaluationResults();
      
      if (!scores) {
        console.error('❌ Failed to parse evaluation results');
        await this.reportStatus('error', { error: 'Parse failed' });
        return;
      }
      
      console.log('📊 Evaluation Results:');
      console.log(`  Dashboard: ${scores.dashboard}/10`);
      console.log(`  Prompts: ${scores.prompts}/10`);
      console.log(`  Folders: ${scores.folders}/10`);
      console.log(`  Overall: ${scores.overall}/10`);
      
      // Check for score drops
      if (this.lastScores) {
        await this.checkScoreChanges(scores);
      }
      
      // Check minimum thresholds
      const needsFix = await this.checkThresholds(scores);
      
      if (needsFix && this.autoFix) {
        await this.triggerAutoFix(scores);
      }
      
      this.lastScores = scores;
      await this.reportStatus('idle', { scores });
      
    } catch (error) {
      console.error('❌ Evaluation check failed:', error.message);
      await this.reportStatus('error', { error: error.message });
    }
  }

  async parseEvaluationResults() {
    try {
      const resultsPath = path.join(process.cwd(), 'evaluation-results', 'latest.json');
      const content = await fs.readFile(resultsPath, 'utf8');
      const data = JSON.parse(content);
      
      return {
        dashboard: data.scores.dashboard.total,
        prompts: data.scores.prompts.total,
        folders: data.scores.folders.total,
        overall: data.overall,
        timestamp: data.timestamp
      };
    } catch (error) {
      console.error('Failed to parse results:', error);
      return null;
    }
  }

  async checkScoreChanges(currentScores) {
    const components = ['dashboard', 'prompts', 'folders', 'overall'];
    
    for (const component of components) {
      const oldScore = this.lastScores[component];
      const newScore = currentScores[component];
      const diff = newScore - oldScore;
      
      if (Math.abs(diff) > 0.1) {
        const emoji = diff > 0 ? '📈' : '📉';
        const change = diff > 0 ? 'improved' : 'declined';
        
        console.log(`${emoji} ${component} score ${change}: ${oldScore} → ${newScore}`);
        
        // Report significant drops
        if (diff < -1) {
          await this.reportScoreDrop(component, oldScore, newScore);
        }
      }
    }
  }

  async checkThresholds(scores) {
    let needsFix = false;
    const components = ['dashboard', 'prompts', 'folders'];
    
    for (const component of components) {
      if (scores[component] < this.minScore) {
        console.log(`⚠️ ${component} score (${scores[component]}) below threshold (${this.minScore})`);
        needsFix = true;
      }
    }
    
    if (scores.overall < this.minScore) {
      console.log(`🚨 Overall score (${scores.overall}) below threshold (${this.minScore})`);
      needsFix = true;
    }
    
    return needsFix;
  }

  async reportScoreDrop(component, oldScore, newScore) {
    console.log(`🚨 Significant score drop detected for ${component}`);
    
    if (this.redis) {
      await this.redis.publish('alert:score-drop', JSON.stringify({
        component,
        oldScore,
        newScore,
        drop: oldScore - newScore,
        timestamp: new Date().toISOString()
      }));
    }
  }

  async triggerAutoFix(scores) {
    console.log('🔧 Triggering auto-fix...');
    
    const tasks = [];
    
    // Create fix tasks for low-scoring components
    if (scores.dashboard < this.minScore) {
      tasks.push({
        type: 'fix',
        component: 'dashboard',
        score: scores.dashboard,
        target: this.minScore
      });
    }
    
    if (scores.prompts < this.minScore) {
      tasks.push({
        type: 'fix',
        component: 'prompts',
        score: scores.prompts,
        target: this.minScore
      });
    }
    
    if (scores.folders < this.minScore) {
      tasks.push({
        type: 'fix',
        component: 'folders',
        score: scores.folders,
        target: this.minScore
      });
    }
    
    // Publish fix tasks
    for (const task of tasks) {
      if (this.redis) {
        await this.redis.publish('task:request', JSON.stringify({
          ...task,
          requestedBy: this.agentId,
          priority: 'high'
        }));
      }
      
      console.log(`📝 Created fix task for ${task.component}`);
    }
  }

  async shutdown() {
    console.log('🛑 Shutting down evaluation monitor...');
    
    if (this.redis) {
      await this.redis.quit();
    }
    
    process.exit(0);
  }
}

// Start agent
const agent = new EvaluationMonitorAgent();

agent.initialize().catch(err => {
  console.error('Failed to initialize agent:', err);
  process.exit(1);
});

// Handle shutdown
process.on('SIGINT', () => agent.shutdown());
process.on('SIGTERM', () => agent.shutdown());