#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema
} from '@modelcontextprotocol/sdk/types.js';
import { ProjectAnalyzer } from './analyzers/ProjectAnalyzer.js';
import { RequirementsEngine } from './engines/RequirementsEngine.js';
import { RiskPredictionEngine } from './engines/RiskPredictionEngine.js';
import { TodoListManager } from './managers/TodoListManager.js';
import { AgentCoordinator } from './coordinators/AgentCoordinator.js';
import { Logger } from './utils/logger.js';

const logger = new Logger('MasterDevAnalysisAgent');

class MasterDevelopmentAnalysisAgent {
  private server: Server;
  private projectAnalyzer: ProjectAnalyzer;
  private requirementsEngine: RequirementsEngine;
  private riskEngine: RiskPredictionEngine;
  private todoManager: TodoListManager;
  private coordinator: AgentCoordinator;

  constructor() {
    this.server = new Server(
      {
        name: 'master-dev-analysis-agent',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Initialize sub-agents
    this.projectAnalyzer = new ProjectAnalyzer();
    this.requirementsEngine = new RequirementsEngine();
    this.riskEngine = new RiskPredictionEngine();
    this.todoManager = new TodoListManager();
    this.coordinator = new AgentCoordinator();

    this.setupHandlers();
  }

  private setupHandlers(): void {
    // Handle tool listing
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: this.getAvailableTools(),
    }));

    // Handle tool execution
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'analyze_project':
            return await this.analyzeProject(args as any);
          
          case 'generate_todo_list':
            return await this.generateTodoList(args as any);
          
          case 'assess_production_readiness':
            return await this.assessProductionReadiness(args as any);
          
          case 'identify_missing_components':
            return await this.identifyMissingComponents(args as any);
          
          case 'predict_risks':
            return await this.predictRisks(args as any);
          
          case 'coordinate_agents':
            return await this.coordinateAgents(args as any);
          
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        logger.error(`Tool execution failed: ${error}`);
        return {
          content: [{
            type: 'text',
            text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          }],
        };
      }
    });
  }

  private getAvailableTools(): any[] {
    return [
      {
        name: 'analyze_project',
        description: 'Perform comprehensive project analysis including structure, dependencies, and architecture',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: {
              type: 'string',
              description: 'Path to the project root directory',
            },
            depth: {
              type: 'string',
              enum: ['basic', 'comprehensive', 'exhaustive'],
              description: 'Analysis depth level',
              default: 'comprehensive',
            },
          },
          required: ['projectPath'],
        },
      },
      {
        name: 'generate_todo_list',
        description: 'Generate dynamic, prioritized todo list based on project analysis',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: {
              type: 'string',
              description: 'Path to the project root directory',
            },
            phase: {
              type: 'string',
              enum: ['development', 'testing', 'pre-production', 'production'],
              description: 'Current project phase',
            },
          },
          required: ['projectPath'],
        },
      },
      {
        name: 'assess_production_readiness',
        description: 'Evaluate project readiness for production deployment',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: {
              type: 'string',
              description: 'Path to the project root directory',
            },
            checklistType: {
              type: 'string',
              enum: ['basic', 'comprehensive', 'enterprise'],
              description: 'Type of production readiness checklist',
              default: 'comprehensive',
            },
          },
          required: ['projectPath'],
        },
      },
      {
        name: 'identify_missing_components',
        description: 'Identify missing project components and configurations',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: {
              type: 'string',
              description: 'Path to the project root directory',
            },
            componentTypes: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['config', 'security', 'testing', 'documentation', 'monitoring', 'deployment'],
              },
              description: 'Specific component types to check',
            },
          },
          required: ['projectPath'],
        },
      },
      {
        name: 'predict_risks',
        description: 'Predict potential risks and issues based on project analysis',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: {
              type: 'string',
              description: 'Path to the project root directory',
            },
            riskCategories: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['security', 'performance', 'scalability', 'maintainability', 'deployment'],
              },
              description: 'Risk categories to analyze',
            },
          },
          required: ['projectPath'],
        },
      },
      {
        name: 'coordinate_agents',
        description: 'Provide coordination intelligence for multi-agent collaboration',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: {
              type: 'string',
              description: 'Path to the project root directory',
            },
            agentTypes: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['validator', 'orchestrator', 'tester', 'deployer', 'monitor'],
              },
              description: 'Types of agents to coordinate',
            },
          },
          required: ['projectPath'],
        },
      },
    ];
  }

  private async analyzeProject(args: { projectPath: string; depth?: string }) {
    const analysis = await this.projectAnalyzer.analyze(args.projectPath, args.depth || 'comprehensive');
    const requirements = await this.requirementsEngine.generateRequirements(analysis);
    const risks = await this.riskEngine.assessRisks(analysis);

    const summary = this.formatProjectIntelligenceSummary(analysis, requirements, risks);

    return {
      content: [{
        type: 'text',
        text: summary,
      }],
    };
  }

  private async generateTodoList(args: { projectPath: string; phase?: string }) {
    const analysis = await this.projectAnalyzer.analyze(args.projectPath);
    const todoList = await this.todoManager.generateDynamicTodoList(analysis, args.phase);

    return {
      content: [{
        type: 'text',
        text: this.formatTodoList(todoList),
      }],
    };
  }

  private async assessProductionReadiness(args: { projectPath: string; checklistType?: string }) {
    const analysis = await this.projectAnalyzer.analyze(args.projectPath);
    const readiness = await this.projectAnalyzer.assessProductionReadiness(analysis, args.checklistType);

    return {
      content: [{
        type: 'text',
        text: this.formatProductionReadinessReport(readiness),
      }],
    };
  }

  private async identifyMissingComponents(args: { projectPath: string; componentTypes?: string[] }) {
    const analysis = await this.projectAnalyzer.analyze(args.projectPath);
    const missing = await this.projectAnalyzer.identifyMissingComponents(analysis, args.componentTypes);

    return {
      content: [{
        type: 'text',
        text: this.formatMissingComponentsReport(missing),
      }],
    };
  }

  private async predictRisks(args: { projectPath: string; riskCategories?: string[] }) {
    const analysis = await this.projectAnalyzer.analyze(args.projectPath);
    const risks = await this.riskEngine.predictRisks(analysis, args.riskCategories);

    return {
      content: [{
        type: 'text',
        text: this.formatRiskPredictionReport(risks),
      }],
    };
  }

  private async coordinateAgents(args: { projectPath: string; agentTypes?: string[] }) {
    const analysis = await this.projectAnalyzer.analyze(args.projectPath);
    const coordination = await this.coordinator.generateCoordinationPlan(analysis, args.agentTypes);

    return {
      content: [{
        type: 'text',
        text: this.formatCoordinationIntelligence(coordination),
      }],
    };
  }

  private formatProjectIntelligenceSummary(analysis: any, _requirements: any, risks: any): string {
    return `🎯 PROJECT INTELLIGENCE SUMMARY

Current Phase: ${analysis.phase}
Completion Percentage: ${analysis.completionPercentage}%
Critical Issues: ${risks.critical.length} | High Priority: ${risks.high.length} | Medium: ${risks.medium.length}
Production Readiness Score: ${analysis.productionReadinessScore}/10

⚠️ CRITICAL MISSING ELEMENTS
${this.formatCriticalMissing(analysis.missingElements)}

🔍 ARCHITECTURAL ANALYSIS
- Consistency with established patterns: ${analysis.architectureConsistency}
- Technical debt indicators: ${analysis.technicalDebt.join(', ')}
- Scalability concerns: ${analysis.scalabilityConcerns.join(', ')}
- Security vulnerabilities: ${analysis.securityVulnerabilities.join(', ')}

📊 PROJECT METRICS
- Total Files: ${analysis.metrics.totalFiles}
- Lines of Code: ${analysis.metrics.linesOfCode}
- Test Coverage: ${analysis.metrics.testCoverage}%
- Dependencies: ${analysis.metrics.dependencies}
`;
  }

  private formatTodoList(todoList: any): string {
    let output = '📋 DYNAMIC TODO LIST\\n\\n';
    
    for (const phase of todoList.phases) {
      output += `**${phase.name}:**\\n`;
      for (const task of phase.tasks) {
        output += `- [ ] ${task.description}\\n`;
        if (task.command) {
          output += `  Command: \`${task.command}\`\\n`;
        }
        if (task.dependencies.length > 0) {
          output += `  Dependencies: ${task.dependencies.join(', ')}\\n`;
        }
      }
      output += '\\n';
    }
    
    return output;
  }

  private formatProductionReadinessReport(readiness: any): string {
    return `🚀 PRODUCTION READINESS ASSESSMENT

Overall Score: ${readiness.score}/100
Status: ${readiness.status}

✅ COMPLETED ITEMS:
${readiness.completed.map((item: string) => `- ${item}`).join('\\n')}

❌ MISSING ITEMS:
${readiness.missing.map((item: string) => `- ${item}`).join('\\n')}

⚠️ RECOMMENDATIONS:
${readiness.recommendations.map((rec: string) => `- ${rec}`).join('\\n')}
`;
  }

  private formatMissingComponentsReport(missing: any): string {
    return `🔍 MISSING COMPONENTS ANALYSIS

${Object.entries(missing).map(([category, items]: [string, any]) => `
**${category.toUpperCase()}:**
${items.map((item: any) => `- ${item.name}: ${item.description}`).join('\\n')}
`).join('\\n')}
`;
  }

  private formatRiskPredictionReport(risks: any): string {
    return `⚠️ RISK PREDICTION REPORT

${Object.entries(risks).map(([severity, items]: [string, any]) => `
**${severity.toUpperCase()} RISKS:**
${items.map((risk: any) => `- ${risk.description} (Probability: ${risk.probability}%)`).join('\\n')}
`).join('\\n')}
`;
  }

  private formatCoordinationIntelligence(coordination: any): string {
    return `📊 AGENT COORDINATION INTELLIGENCE

**Recommended Validation Focus:**
${coordination.validationFocus.map((item: string) => `- ${item}`).join('\\n')}

**Orchestrator Routing Suggestions:**
${coordination.routingSuggestions.map((item: string) => `- ${item}`).join('\\n')}

**Resource Utilization:**
${coordination.resourceRecommendations.map((item: string) => `- ${item}`).join('\\n')}

**Optimal Execution Order:**
${coordination.executionOrder.map((item: string, index: number) => `${index + 1}. ${item}`).join('\\n')}
`;
  }

  private formatCriticalMissing(missingElements: any[]): string {
    return missingElements
      .sort((a, b) => b.priority - a.priority)
      .map(element => `- ${element.name}: ${element.solution}`)
      .join('\\n');
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    logger.info('Master Development Analysis Agent MCP Server running');
  }
}

// Start the server
const agent = new MasterDevelopmentAnalysisAgent();
agent.run().catch(console.error);