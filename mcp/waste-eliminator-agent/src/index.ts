#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { WasteAnalyzer } from './analyzer.js';
import { RefactoringEngine } from './refactoring-engine.js';
import { ContinuousMonitor } from './monitor.js';
import { ReportGenerator } from './report-generator.js';
import { OrchestrationAdapter } from './orchestration-adapter.js';
import { logger } from './utils/logger.js';

const AGENT_NAME = 'Project Waste Eliminator';
const AGENT_VERSION = '1.0.0';

class WasteEliminatorServer {
  private server: Server;
  private analyzer: WasteAnalyzer;
  private refactoringEngine: RefactoringEngine;
  private monitor: ContinuousMonitor;
  private reportGenerator: ReportGenerator;
  private orchestrationAdapter: OrchestrationAdapter;

  constructor() {
    this.server = new Server(
      {
        name: AGENT_NAME,
        version: AGENT_VERSION,
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.analyzer = new WasteAnalyzer();
    this.refactoringEngine = new RefactoringEngine();
    this.monitor = new ContinuousMonitor();
    this.reportGenerator = new ReportGenerator();
    this.orchestrationAdapter = new OrchestrationAdapter();

    this.setupHandlers();
    this.setupOrchestration();
  }

  private async setupOrchestration() {
    // Connect orchestration adapter to agent components
    this.orchestrationAdapter.on('analyze_project', async (params) => {
      return await this.handleAnalyzeProject(params);
    });

    this.orchestrationAdapter.on('refactor_code', async (params) => {
      return await this.handleRefactorCode(params);
    });

    this.orchestrationAdapter.on('start_monitoring', async (params) => {
      return await this.handleMonitorContinuous(params);
    });

    this.orchestrationAdapter.on('generate_report', async (params) => {
      return await this.handleGenerateReport(params);
    });

    // Try to connect to orchestrator if available
    if (process.env.ENABLE_ORCHESTRATION === 'true') {
      try {
        await this.orchestrationAdapter.connect();
        logger.info('Connected to orchestration system');
      } catch (error) {
        logger.warn('Failed to connect to orchestrator, running standalone:', error);
      }
    }
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'analyze_project',
          description: 'Scan entire project for waste, inefficiencies, and optimization opportunities',
          inputSchema: {
            type: 'object',
            properties: {
              projectPath: {
                type: 'string',
                description: 'Path to the project root directory',
              },
              depth: {
                type: 'string',
                enum: ['quick', 'standard', 'deep'],
                description: 'Analysis depth level',
                default: 'standard',
              },
            },
            required: ['projectPath'],
          },
        },
        {
          name: 'refactor_code',
          description: 'Refactor specific code areas to eliminate waste and optimize performance',
          inputSchema: {
            type: 'object',
            properties: {
              filePath: {
                type: 'string',
                description: 'Path to the file to refactor',
              },
              scope: {
                type: 'string',
                enum: ['file', 'function', 'class', 'module'],
                description: 'Scope of refactoring',
                default: 'file',
              },
              targetName: {
                type: 'string',
                description: 'Specific function/class name to refactor (optional)',
              },
            },
            required: ['filePath'],
          },
        },
        {
          name: 'detect_duplicates',
          description: 'Find and report duplicate code patterns across the project',
          inputSchema: {
            type: 'object',
            properties: {
              projectPath: {
                type: 'string',
                description: 'Path to the project root',
              },
              threshold: {
                type: 'number',
                description: 'Similarity threshold (0-1)',
                default: 0.8,
              },
            },
            required: ['projectPath'],
          },
        },
        {
          name: 'optimize_imports',
          description: 'Optimize and clean up import statements across the project',
          inputSchema: {
            type: 'object',
            properties: {
              projectPath: {
                type: 'string',
                description: 'Path to the project root',
              },
              removeUnused: {
                type: 'boolean',
                description: 'Remove unused imports',
                default: true,
              },
              sortImports: {
                type: 'boolean',
                description: 'Sort imports by convention',
                default: true,
              },
            },
            required: ['projectPath'],
          },
        },
        {
          name: 'generate_waste_report',
          description: 'Generate comprehensive waste elimination report',
          inputSchema: {
            type: 'object',
            properties: {
              projectPath: {
                type: 'string',
                description: 'Path to the project',
              },
              format: {
                type: 'string',
                enum: ['json', 'markdown', 'html'],
                description: 'Report format',
                default: 'markdown',
              },
            },
            required: ['projectPath'],
          },
        },
        {
          name: 'monitor_continuous',
          description: 'Enable continuous monitoring for waste detection',
          inputSchema: {
            type: 'object',
            properties: {
              projectPath: {
                type: 'string',
                description: 'Path to monitor',
              },
              interval: {
                type: 'number',
                description: 'Check interval in seconds',
                default: 300,
              },
              webhookUrl: {
                type: 'string',
                description: 'Webhook URL for notifications (optional)',
              },
            },
            required: ['projectPath'],
          },
        },
        {
          name: 'check_performance',
          description: 'Analyze performance bottlenecks and suggest optimizations',
          inputSchema: {
            type: 'object',
            properties: {
              filePath: {
                type: 'string',
                description: 'File to analyze for performance',
              },
              includeAsyncPatterns: {
                type: 'boolean',
                description: 'Include async/await optimization suggestions',
                default: true,
              },
            },
            required: ['filePath'],
          },
        },
      ],
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'analyze_project':
            return await this.handleAnalyzeProject(args);

          case 'refactor_code':
            return await this.handleRefactorCode(args);

          case 'detect_duplicates':
            return await this.handleDetectDuplicates(args);

          case 'optimize_imports':
            return await this.handleOptimizeImports(args);

          case 'generate_waste_report':
            return await this.handleGenerateReport(args);

          case 'monitor_continuous':
            return await this.handleMonitorContinuous(args);

          case 'check_performance':
            return await this.handleCheckPerformance(args);

          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        logger.error(`Tool execution failed: ${name}`, error);
        throw error;
      }
    });
  }

  private async handleAnalyzeProject(args: any) {
    const { projectPath, depth = 'standard' } = args;
    logger.info(`Analyzing project: ${projectPath} (depth: ${depth})`);

    const analysis = await this.analyzer.analyzeProject(projectPath, depth);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(analysis, null, 2),
        },
      ],
    };
  }

  private async handleRefactorCode(args: any) {
    const { filePath, scope = 'file', targetName } = args;
    logger.info(`Refactoring: ${filePath} (scope: ${scope})`);

    const result = await this.refactoringEngine.refactor({
      filePath,
      scope,
      targetName,
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async handleDetectDuplicates(args: any) {
    const { projectPath, threshold = 0.8 } = args;
    logger.info(`Detecting duplicates in: ${projectPath}`);

    const duplicates = await this.analyzer.detectDuplicates(projectPath, threshold);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(duplicates, null, 2),
        },
      ],
    };
  }

  private async handleOptimizeImports(args: any) {
    const { projectPath, removeUnused = true, sortImports = true } = args;
    logger.info(`Optimizing imports in: ${projectPath}`);

    const result = await this.refactoringEngine.optimizeImports({
      projectPath,
      removeUnused,
      sortImports,
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async handleGenerateReport(args: any) {
    const { projectPath, format = 'markdown' } = args;
    logger.info(`Generating waste report for: ${projectPath}`);

    const report = await this.reportGenerator.generate(projectPath, format);

    return {
      content: [
        {
          type: 'text',
          text: report,
        },
      ],
    };
  }

  private async handleMonitorContinuous(args: any) {
    const { projectPath, interval = 300, webhookUrl } = args;
    logger.info(`Starting continuous monitoring for: ${projectPath}`);

    const monitorId = await this.monitor.startMonitoring({
      projectPath,
      interval,
      webhookUrl,
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ 
            status: 'monitoring_started', 
            monitorId,
            interval,
            projectPath 
          }, null, 2),
        },
      ],
    };
  }

  private async handleCheckPerformance(args: any) {
    const { filePath, includeAsyncPatterns = true } = args;
    logger.info(`Checking performance for: ${filePath}`);

    const performance = await this.analyzer.checkPerformance({
      filePath,
      includeAsyncPatterns,
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(performance, null, 2),
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    logger.info(`${AGENT_NAME} v${AGENT_VERSION} started`);
  }
}

// Start the server
const server = new WasteEliminatorServer();
server.run().catch((error) => {
  logger.error('Server failed to start:', error);
  process.exit(1);
});