import { Logger } from '../utils/logger.js';

interface CoordinationPlan {
  validationFocus: string[];
  routingSuggestions: string[];
  resourceRecommendations: string[];
  executionOrder: string[];
  agentAssignments: Map<string, string[]>;
}

export class AgentCoordinator {
  private logger: Logger;

  constructor() {
    this.logger = new Logger('AgentCoordinator');
  }

  async generateCoordinationPlan(analysis: any, agentTypes?: string[]): Promise<CoordinationPlan> {
    this.logger.info('Generating agent coordination plan');

    const plan: CoordinationPlan = {
      validationFocus: this.identifyValidationFocus(analysis),
      routingSuggestions: this.generateRoutingSuggestions(analysis, agentTypes),
      resourceRecommendations: this.generateResourceRecommendations(analysis),
      executionOrder: this.determineOptimalExecutionOrder(analysis, agentTypes),
      agentAssignments: this.assignTasksToAgents(analysis, agentTypes)
    };

    return plan;
  }

  private identifyValidationFocus(analysis: any): string[] {
    const focus: string[] = [];

    // Priority 1: Security vulnerabilities
    if (analysis.securityVulnerabilities.length > 0) {
      focus.push('Security vulnerability validation in affected files');
    }

    // Priority 2: Test coverage
    if (analysis.metrics.testCoverage < 70) {
      focus.push('Test coverage validation for critical paths');
    }

    // Priority 3: Architecture consistency
    if (analysis.architectureConsistency !== 'Good') {
      focus.push('Architecture pattern validation across modules');
    }

    // Priority 4: Production readiness
    if (analysis.productionReadinessScore < 7) {
      focus.push('Production configuration and deployment readiness');
    }

    // Priority 5: Performance
    focus.push('Performance bottleneck identification');

    return focus;
  }

  private generateRoutingSuggestions(analysis: any, _agentTypes?: string[]): string[] {
    const suggestions: string[] = [];
    // const agents = agentTypes || ['validator', 'orchestrator', 'tester', 'deployer'];

    // Route based on project phase
    switch (analysis.phase) {
      case 'Development':
        suggestions.push('Route feature development tasks to development agents');
        suggestions.push('Prioritize code quality validation agents');
        break;
      
      case 'Testing':
        suggestions.push('Route to testing agents for comprehensive validation');
        suggestions.push('Engage performance testing agents');
        break;
      
      case 'Pre-Production':
        suggestions.push('Route to deployment preparation agents');
        suggestions.push('Engage security validation agents');
        break;
    }

    // Specific routing based on issues
    if (analysis.securityVulnerabilities.length > 0) {
      suggestions.push('Immediate routing to security specialist agents');
    }

    if (analysis.technicalDebt.length > 3) {
      suggestions.push('Schedule refactoring agents during low-activity periods');
    }

    return suggestions;
  }

  private generateResourceRecommendations(analysis: any): string[] {
    const recommendations: string[] = [];

    // CPU/Memory recommendations
    if (analysis.metrics.totalFiles > 1000) {
      recommendations.push('Allocate high-memory agents for large codebase analysis');
    }

    // Parallel processing
    if (analysis.metrics.testCoverage < 50 && analysis.metrics.totalFiles > 500) {
      recommendations.push('Enable parallel test execution across multiple agents');
    }

    // Resource scheduling
    recommendations.push('Schedule intensive operations during off-peak hours');
    
    // Agent pooling
    if (analysis.phase === 'Pre-Production') {
      recommendations.push('Maintain agent pool for rapid deployment validation');
    }

    return recommendations;
  }

  private determineOptimalExecutionOrder(analysis: any, _agentTypes?: string[]): string[] {
    const order: string[] = [];

    // Critical path first
    if (analysis.securityVulnerabilities.length > 0) {
      order.push('Security validation agent');
    }

    // Build and test
    order.push('Build validation agent');
    order.push('Unit test execution agent');
    
    // Quality checks
    order.push('Code quality analysis agent');
    order.push('Architecture consistency agent');

    // Integration and E2E
    if (analysis.phase !== 'Development') {
      order.push('Integration test agent');
      order.push('E2E test execution agent');
    }

    // Deployment preparation
    if (analysis.phase === 'Pre-Production') {
      order.push('Environment validation agent');
      order.push('Deployment readiness agent');
      order.push('Performance testing agent');
    }

    return order;
  }

  private assignTasksToAgents(analysis: any, _agentTypes?: string[]): Map<string, string[]> {
    const assignments = new Map<string, string[]>();

    // Validator agents
    assignments.set('validator', [
      'Validate code syntax and structure',
      'Check coding standards compliance',
      'Verify test coverage thresholds'
    ]);

    // Orchestrator agents
    assignments.set('orchestrator', [
      'Coordinate multi-agent workflows',
      'Manage task dependencies',
      'Monitor agent performance'
    ]);

    // Tester agents
    assignments.set('tester', [
      'Execute unit test suites',
      'Run integration tests',
      'Perform E2E testing'
    ]);

    // Deployer agents
    if (analysis.phase === 'Pre-Production' || analysis.phase === 'Production') {
      assignments.set('deployer', [
        'Validate deployment configuration',
        'Check environment variables',
        'Verify container builds'
      ]);
    }

    // Monitor agents
    assignments.set('monitor', [
      'Track execution metrics',
      'Monitor resource usage',
      'Generate performance reports'
    ]);

    return assignments;
  }
}