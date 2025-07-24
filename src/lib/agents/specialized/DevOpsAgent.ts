import { Agent } from '../base/Agent';
import { AgentConfig, AgentMessage, AgentCapability } from '../types';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export interface DeploymentConfig {
  environment: 'development' | 'staging' | 'production',
  platform: 'vercel' | 'railway' | 'docker' | 'custom';
  branch?: string;
  variables?: Record<string, string>;
  healthCheckUrl?: string;
}

export interface DeploymentResult {
  success: boolean;
  deploymentId?: string;
  url?: string;
  duration?: number;
  logs?: string[];
  error?: string;
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down',
  services: Array<{
    name: string,
    status: 'up' | 'down';
    responseTime?: number,
    lastCheck: Date;
  }>;
  metrics: {
    cpu: number,
    memory: number,
    disk: number,
    uptime: number;
  };
}

export class DevOpsAgent extends Agent {
  private deploymentHistory: DeploymentResult[] = [];
  
  constructor(config: Partial<AgentConfig> = {}) {
    super({
      id: 'devops-agent',
      name: 'DevOps Agent',
      type: 'specialist',
      ...config
    });
  }

  protected defineCapabilities(): AgentCapability[] {
    return [
      {
        name: 'deploy',
        description: 'Deploy application to specified environment',
        parameters: {
          config: { type: 'object', required: true   }
},
      {
        name: 'rollback',
        description: 'Rollback to previous deployment',
        parameters: {
          deploymentId: { type: 'string', required: true   }
},
      {
        name: 'monitorHealth',
        description: 'Monitor system and service health',
        parameters: {
          services: { type: 'array', required: false   }
},
      {
        name: 'scaleService',
        description: 'Scale service instances',
        parameters: {
          service: { type: 'string', required: true },
          instances: { type: 'number', required: true   }
},
      {
        name: 'manageCertificates',
        description: 'Manage SSL certificates',
        parameters: {
          domain: { type: 'string', required: true },
          action: { type: 'string', required: true   }
}
    ];
  }

  async processMessage(message: AgentMessage): Promise<void> {
    this.logger.info(`Processing DevOps task: ${message.type}`);

    try {
      switch (message.type) {
        case 'deploy':
          await this.handleDeployment(message.payload);
          break;
        case 'rollback':
          await this.handleRollback(message.payload);
          break;
        case 'monitor':
          await this.handleMonitoring(message.payload);
          break;
        case 'scale':
          await this.handleScaling(message.payload);
          break;
        case 'health-check':
          await this.performHealthCheck(message.payload);
          break;
        default:
          await this.handleGenericTask(message);
      }
    } catch (error) {
      this.logger.error('DevOps task failed:', error);
      await this.sendMessage({
        to: message.from,
        type: 'error',
        payload: {
          error: error.message,
          task: message.type
        }
      });
    }
  }

  private async handleDeployment(payload: DeploymentConfig): Promise<void> {
    this.logger.info(`Starting deployment to ${payload.environment} on ${payload.platform}`);
    
    // Pre-deployment checks
    const preChecks = await this.runPreDeploymentChecks(payload);
    if (!preChecks.passed) {
      throw new Error(`Pre-deployment checks failed: ${preChecks.reason}`);
    }
    
    // Request QA validation
    await this.sendMessage({
      to: 'qa-agent',
      type: 'validate',
      payload: { environment: payload.environment }
    });
    
    // Wait for QA approval (simplified - in real implementation would use proper async handling)
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Execute deployment
    const result = await this.executeDeploy(payload);
    
    // Store deployment history
    this.deploymentHistory.push(result);
    
    // Post-deployment verification
    if (result.success && payload.healthCheckUrl) {
      await this.verifyDeployment(payload.healthCheckUrl);
    }
    
    // Report results
    await this.sendMessage({
      to: 'orchestrator',
      type: 'deployment-complete',
      payload: result
    });
    
    // If deployment failed, trigger rollback consideration
    if (!result.success) {
      await this.considerRollback(payload.environment);
    }
  }

  private async handleRollback(payload: { deploymentId: string }): Promise<void> {
    this.logger.info(`Initiating rollback to deployment ${payload.deploymentId}`);
    
    const previousDeployment = this.deploymentHistory.find(d => d.deploymentId === payload.deploymentId);
    
    if (!previousDeployment) {
      throw new Error(`Deployment ${payload.deploymentId} not found in history`);
    }
    
    // Execute rollback based on platform
    const rollbackResult = await this.executeRollback(previousDeployment);
    
    await this.sendMessage({
      to: 'orchestrator',
      type: 'rollback-complete',
      payload: rollbackResult
    });
  }

  private async handleMonitoring(payload: any): Promise<void> {
    const health = await this.checkSystemHealth(payload.services);
    
    // Alert if issues detected
    if (health.status !== 'healthy') {
      await this.sendMessage({
        to: 'orchestrator',
        type: 'health-alert',
        payload: health
      });
      
      // Trigger self-healing if critical
      if (health.status === 'down') {
        await this.sendMessage({
          to: 'self-healing-agent',
          type: 'critical-failure',
          payload: health
        });
      }
    }
    
    // Regular health report
    await this.sendMessage({
      to: 'orchestrator',
      type: 'health-report',
      payload: health
    });
  }

  private async handleScaling(payload: { service: string, instances: number }): Promise<void> {
    this.logger.info(`Scaling ${payload.service} to ${payload.instances} instances`);
    
    // Platform-specific scaling logic
    const scalingResult = await this.scaleService(payload.service, payload.instances);
    
    await this.sendMessage({
      to: 'orchestrator',
      type: 'scaling-complete',
      payload: scalingResult
    });
  }

  private async runPreDeploymentChecks(config: DeploymentConfig): Promise<{ passed: boolean; reason?: string }> {
    const checks = [
      { name: 'Git Status', check: () => this.checkGitStatus() },
      { name: 'Branch Protection', check: () => this.checkBranchProtection(config.branch) },
      { name: 'Environment Variables', check: () => this.checkEnvVars(config.environment) },
      { name: 'Resource Availability', check: () => this.checkResources() }
    ];
    
    for (const { name, check } of checks) {
      try {
        const passed = await check();
        if (!passed) {
          return { passed: false, reason: `${name} check failed` };
        }
      } catch (error) {
        return { passed: false, reason: `${name} check error: ${error.message}` };
      }
    }
    
    return { passed: true };
  }

  private async executeDeploy(config: DeploymentConfig): Promise<DeploymentResult> {
    const startTime = Date.now();
    const logs: string[] = [];
    
    try {
      let deploymentId: string;
      let url: string;
      
      switch (config.platform) {
        case 'vercel':
          ({ deploymentId, url } = await this.deployToVercel(config));
          break;
        case 'railway':
          ({ deploymentId, url } = await this.deployToRailway(config));
          break;
        case 'docker':
          ({ deploymentId, url } = await this.deployToDocker(config));
          break;
        default:
          throw new Error(`Unsupported platform: ${config.platform}`);
      }
      
      return {
        success: true,
        deploymentId,
        url,
        duration: Date.now() - startTime,
        logs
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        duration: Date.now() - startTime,
        logs
      };
    }
  }

  private async deployToVercel(config: DeploymentConfig): Promise<{ deploymentId: string, url: string }> {
    // Vercel deployment logic
    const envVars = config.variables ? 
      Object.entries(config.variables).map(([k, v]) => `-e ${k}="${v}"`).join(' ') : '';
    
    const command = `vercel deploy ${config.environment === 'production' ? '--prod' : ''} ${envVars}`;
    
    const output = execSync(command, { encoding: 'utf8' });
    
    // Parse deployment URL from output
    const urlMatch = output.match(/https:\/\/[^\s]+/);
    const url = urlMatch ? urlMatch[0] : '';
    
    return {
      deploymentId: `vercel-${Date.now()}`,
      url
    };
  }

  private async deployToRailway(config: DeploymentConfig): Promise<{ deploymentId: string, url: string }> {
    // Railway deployment logic
    const command = `railway up -e ${config.environment}`;
    
    execSync(command, { encoding: 'utf8' });
    
    return {
      deploymentId: `railway-${Date.now()}`,
      url: `https://${config.environment}.railway.app`
    };
  }

  private async deployToDocker(config: DeploymentConfig): Promise<{ deploymentId: string, url: string }> {
    // Docker deployment logic
    const imageName = `ai-guided-saas:${config.environment}`;
    
    // Build Docker image
    execSync(`docker build -t ${imageName} .`);
    
    // Tag and push to registry
    execSync(`docker tag ${imageName} registry.example.com/${imageName}`);
    execSync(`docker push registry.example.com/${imageName}`);
    
    return {
      deploymentId: `docker-${Date.now()}`,
      url: `https://${config.environment}.example.com`
    };
  }

  private async verifyDeployment(healthCheckUrl: string): Promise<boolean> {
    // Simple health check - in production would be more sophisticated
    try {
      const response = await fetch(healthCheckUrl);
      return response.ok;
    } catch (error) {
      this.logger.error('Deployment verification failed:', error);
      return false;
    }
  }

  private async executeRollback(deployment: DeploymentResult): Promise<any> {
    // Platform-specific rollback logic
    this.logger.info(`Executing rollback to ${deployment.deploymentId}`);
    
    // Simplified rollback - in production would be platform-specific
    return {
      success: true,
      rolledBackTo: deployment.deploymentId
    };
  }

  private async checkSystemHealth(services?: string[]): Promise<SystemHealth> {
    const health: SystemHealth = {
      status: 'healthy',
      services: [],
      metrics: {
        cpu: 0,
        memory: 0,
        disk: 0,
        uptime: process.uptime()
      }
    };
    
    // Check specified services or default set
    const servicesToCheck = services || ['web', 'api', 'database', 'redis'];
    
    for (const service of servicesToCheck) {
      const serviceHealth = await this.checkServiceHealth(service);
      health.services.push(serviceHealth);
      
      if (serviceHealth.status === 'down') {
        health.status = 'degraded';
      }
    }
    
    // Get system metrics
    health.metrics = await this.getSystemMetrics();
    
    // Determine overall health
    if (health.services.filter(s => s.status === 'down').length > 1) {
      health.status = 'down';
    }
    
    return health;
  }

  private async checkServiceHealth(service: string): Promise<any> {
    // Service-specific health checks
    const healthEndpoints: Record<string, string> = {
      web: 'http://localhost:3000/api/health',
      api: 'http://localhost:3000/api/health',
      database: 'postgresql://localhost:5432',
      redis: 'redis://localhost:6379'
    };
    
    const endpoint = healthEndpoints[service];
    
    if (!endpoint) {
      return {
        name: service,
        status: 'down',
        lastCheck: new Date()
      };
    }
    
    try {
      const start = Date.now();
      // Simplified health check
      const isUp = true; // Would actually check the endpoint
      
      return {
        name: service,
        status: isUp ? 'up' : 'down',
        responseTime: Date.now() - start,
        lastCheck: new Date()
      };
    } catch (error) {
      return {
        name: service,
        status: 'down',
        lastCheck: new Date()
      };
    }
  }

  private async getSystemMetrics(): Promise<any> {
    // Get system resource usage
    // In production, would use proper monitoring tools
    return {
      cpu: Math.random() * 100,
      memory: Math.random() * 100,
      disk: Math.random() * 100,
      uptime: process.uptime()
    };
  }

  private async considerRollback(environment: string): Promise<void> {
    // Analyze if automatic rollback should be triggered
    const lastSuccessful = this.deploymentHistory
      .filter(d => d.success)
      .pop();
    
    if (lastSuccessful) {
      await this.sendMessage({
        to: 'orchestrator',
        type: 'rollback-recommendation',
        payload: {
          environment,
          recommendedDeployment: lastSuccessful.deploymentId
        }
      });
    }
  }

  private async scaleService(service: string, instances: number): Promise<any> {
    // Platform-specific scaling
    this.logger.info(`Scaling ${service} to ${instances} instances`);
    
    return {
      service,
      previousInstances: 1,
      currentInstances: instances,
      success: true
    };
  }

  private checkGitStatus(): boolean {
    try {
      const status = execSync('git status --porcelain', { encoding: 'utf8' });
      return status.trim() === '';
    } catch {
      return false;
    }
  }

  private checkBranchProtection(branch?: string): boolean {
    // Check if deploying from protected branch
    const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
    const protectedBranches = ['main', 'master', 'production'];
    
    return !branch || protectedBranches.includes(currentBranch);
  }

  private checkEnvVars(environment: string): boolean {
    const requiredVars = ['DATABASE_URL', 'NEXTAUTH_SECRET'];
    const envFile = `.env.${environment}`;
    
    if (fs.existsSync(envFile)) {
      const content = fs.readFileSync(envFile, 'utf8');
      return requiredVars.every(v => content.includes(`${v}=`));
    }
    
    return false;
  }

  private checkResources(): boolean {
    // Check if system has enough resources for deployment
    // Simplified - would check actual resource availability
    return true;
  }

  private async performHealthCheck(payload: any): Promise<void> {
    const health = await this.checkSystemHealth(payload.services);
    
    await this.sendMessage({
      to: payload.from || 'orchestrator',
      type: 'health-status',
      payload: health
    });
  }
}