import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { ProjectAnalyzer } from './analyzers/ProjectAnalyzer.js';
import { RequirementsEngine } from './engines/RequirementsEngine.js';
import { DependencyGuardian } from './guardians/DependencyGuardian.js';
import { QualityCoordinator } from './coordinators/QualityCoordinator.js';
import { TestingStrategyAgent } from './agents/TestingStrategyAgent.js';
import { ProductionValidator } from './validators/ProductionValidator.js';
import { ArchitectureMonitor } from './monitors/ArchitectureMonitor.js';
import { RiskPredictionEngine } from './engines/RiskPredictionEngine.js';
import { TodoListManager } from './managers/TodoListManager.js';
import { AgentCoordinator } from './coordinators/AgentCoordinator.js';

class MasterDevelopmentAnalysisAgent {
  private server: Server;
  private projectAnalyzer: ProjectAnalyzer;
  private requirementsEngine: RequirementsEngine;
  private dependencyGuardian: DependencyGuardian;
  private qualityCoordinator: QualityCoordinator;
  private testingAgent: TestingStrategyAgent;
  private productionValidator: ProductionValidator;
  private architectureMonitor: ArchitectureMonitor;
  private riskEngine: RiskPredictionEngine;
  private todoManager: TodoListManager;
  private agentCoordinator: AgentCoordinator;

  constructor() {
    this.server = new Server(
      {
        name: 'master-dev-agent',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Initialize all sub-agents
    this.projectAnalyzer = new ProjectAnalyzer();
    this.requirementsEngine = new RequirementsEngine();
    this.dependencyGuardian = new DependencyGuardian();
    this.qualityCoordinator = new QualityCoordinator();
    this.testingAgent = new TestingStrategyAgent();
    this.productionValidator = new ProductionValidator();
    this.architectureMonitor = new ArchitectureMonitor();
    this.riskEngine = new RiskPredictionEngine();
    this.todoManager = new TodoListManager();
    this.agentCoordinator = new AgentCoordinator();

    this.setupHandlers();
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: this.getTools(),
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'analyze_project':
          return await this.analyzeProject(args);
        case 'generate_requirements':
          return await this.generateRequirements(args);
        case 'check_dependencies':
          return await this.checkDependencies(args);
        case 'validate_quality':
          return await this.validateQuality(args);
        case 'generate_tests':
          return await this.generateTests(args);
        case 'validate_production':
          return await this.validateProduction(args);
        case 'analyze_architecture':
          return await this.analyzeArchitecture(args);
        case 'predict_risks':
          return await this.predictRisks(args);
        case 'get_todo_list':
          return await this.getTodoList(args);
        case 'coordinate_agents':
          return await this.coordinateAgents(args);
        case 'full_analysis':
          return await this.performFullAnalysis(args);
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  private getTools(): Tool[] {
    return [
      {
        name: 'analyze_project',
        description: 'Perform comprehensive project structure and completeness analysis',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: { type: 'string', description: 'Path to project directory' },
            depth: { type: 'string', enum: ['surface', 'standard', 'deep'], default: 'standard' },
          },
          required: ['projectPath'],
        },
      },
      {
        name: 'generate_requirements',
        description: 'Automatically generate and maintain project requirements',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: { type: 'string' },
            format: { type: 'string', enum: ['markdown', 'json', 'yaml'], default: 'markdown' },
          },
          required: ['projectPath'],
        },
      },
      {
        name: 'check_dependencies',
        description: 'Analyze dependencies for conflicts, updates, and security issues',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: { type: 'string' },
            checkSecurity: { type: 'boolean', default: true },
            checkUpdates: { type: 'boolean', default: true },
          },
          required: ['projectPath'],
        },
      },
      {
        name: 'validate_quality',
        description: 'Perform comprehensive code quality analysis',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: { type: 'string' },
            standards: { type: 'array', items: { type: 'string' } },
          },
          required: ['projectPath'],
        },
      },
      {
        name: 'generate_tests',
        description: 'Automatically generate test cases and identify test gaps',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: { type: 'string' },
            testType: { type: 'string', enum: ['unit', 'integration', 'e2e', 'all'], default: 'all' },
          },
          required: ['projectPath'],
        },
      },
      {
        name: 'validate_production',
        description: 'Assess production readiness and identify missing configurations',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: { type: 'string' },
            environment: { type: 'string', default: 'production' },
          },
          required: ['projectPath'],
        },
      },
      {
        name: 'analyze_architecture',
        description: 'Analyze project architecture consistency and patterns',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: { type: 'string' },
            checkPatterns: { type: 'boolean', default: true },
          },
          required: ['projectPath'],
        },
      },
      {
        name: 'predict_risks',
        description: 'Use historical patterns to predict potential issues',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: { type: 'string' },
            timeframe: { type: 'string', enum: ['immediate', 'short-term', 'long-term'], default: 'short-term' },
          },
          required: ['projectPath'],
        },
      },
      {
        name: 'get_todo_list',
        description: 'Get dynamic, prioritized todo list based on current project state',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: { type: 'string' },
            priority: { type: 'string', enum: ['all', 'critical', 'high', 'medium', 'low'], default: 'all' },
          },
          required: ['projectPath'],
        },
      },
      {
        name: 'coordinate_agents',
        description: 'Get coordination intelligence for optimal multi-agent collaboration',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: { type: 'string' },
            activeAgents: { type: 'array', items: { type: 'string' } },
          },
          required: ['projectPath'],
        },
      },
      {
        name: 'full_analysis',
        description: 'Perform complete project analysis with all sub-agents',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: { type: 'string' },
            outputFormat: { type: 'string', enum: ['summary', 'detailed', 'actionable'], default: 'actionable' },
          },
          required: ['projectPath'],
        },
      },
    ];
  }

  private async analyzeProject(args: any) {
    const analysis = await this.projectAnalyzer.analyze(args.projectPath, args.depth);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(analysis, null, 2),
        },
      ],
    };
  }

  private async generateRequirements(args: any) {
    const requirements = await this.requirementsEngine.generate(args.projectPath, args.format);
    return {
      content: [
        {
          type: 'text',
          text: requirements,
        },
      ],
    };
  }

  private async checkDependencies(args: any) {
    const report = await this.dependencyGuardian.check(args.projectPath, {
      checkSecurity: args.checkSecurity,
      checkUpdates: args.checkUpdates,
    });
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(report, null, 2),
        },
      ],
    };
  }

  private async validateQuality(args: any) {
    const validation = await this.qualityCoordinator.validate(args.projectPath, args.standards);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(validation, null, 2),
        },
      ],
    };
  }

  private async generateTests(args: any) {
    const tests = await this.testingAgent.generateTests(args.projectPath, args.testType);
    return {
      content: [
        {
          type: 'text',
          text: tests,
        },
      ],
    };
  }

  private async validateProduction(args: any) {
    const validation = await this.productionValidator.validate(args.projectPath, args.environment);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(validation, null, 2),
        },
      ],
    };
  }

  private async analyzeArchitecture(args: any) {
    const analysis = await this.architectureMonitor.analyze(args.projectPath, args.checkPatterns);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(analysis, null, 2),
        },
      ],
    };
  }

  private async predictRisks(args: any) {
    const predictions = await this.riskEngine.predict(args.projectPath, args.timeframe);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(predictions, null, 2),
        },
      ],
    };
  }

  private async getTodoList(args: any) {
    const todos = await this.todoManager.generateTodoList(args.projectPath, args.priority);
    return {
      content: [
        {
          type: 'text',
          text: todos,
        },
      ],
    };
  }

  private async coordinateAgents(args: any) {
    const coordination = await this.agentCoordinator.getCoordinationPlan(
      args.projectPath,
      args.activeAgents
    );
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(coordination, null, 2),
        },
      ],
    };
  }

  private async performFullAnalysis(args: any) {
    // Run all analyses in parallel
    const [
      projectAnalysis,
      requirements,
      dependencies,
      quality,
      tests,
      production,
      architecture,
      risks,
      todos,
    ] = await Promise.all([
      this.projectAnalyzer.analyze(args.projectPath, 'deep'),
      this.requirementsEngine.generate(args.projectPath, 'json'),
      this.dependencyGuardian.check(args.projectPath, { checkSecurity: true, checkUpdates: true }),
      this.qualityCoordinator.validate(args.projectPath, []),
      this.testingAgent.generateTests(args.projectPath, 'all'),
      this.productionValidator.validate(args.projectPath, 'production'),
      this.architectureMonitor.analyze(args.projectPath, true),
      this.riskEngine.predict(args.projectPath, 'short-term'),
      this.todoManager.generateTodoList(args.projectPath, 'all'),
    ]);

    const fullReport = this.formatFullAnalysisReport({
      projectAnalysis,
      requirements,
      dependencies,
      quality,
      tests,
      production,
      architecture,
      risks,
      todos,
    }, args.outputFormat);

    return {
      content: [
        {
          type: 'text',
          text: fullReport,
        },
      ],
    };
  }

  private formatFullAnalysisReport(data: any, format: string): string {
    const report = {
      summary: {
        timestamp: new Date().toISOString(),
        projectPhase: data.projectAnalysis.phase,
        completionPercentage: data.projectAnalysis.completionPercentage,
        productionReadinessScore: data.production.score,
        criticalIssues: data.production.criticalIssues.length,
        highPriorityTasks: data.todos.split('High Priority:').length - 1,
      },
      details: format === 'detailed' ? data : undefined,
      actionableTodos: format === 'actionable' ? data.todos : undefined,
    };

    return JSON.stringify(report, null, 2);
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Master Development Analysis Agent MCP server running');
  }
}

const agent = new MasterDevelopmentAnalysisAgent();
agent.run().catch(console.error);