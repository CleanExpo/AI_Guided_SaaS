#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { BuildAnalyzer } from './analyzers/BuildAnalyzer.js';
import { SyntaxFixer } from './fixers/SyntaxFixer.js';
import { CodeValidator } from './validators/CodeValidator.js';
import { BuildReporter } from './reporters/BuildReporter.js';
import { Logger } from './utils/logger.js';
import { execSync } from 'child_process';
import * as path from 'path';

const logger = new Logger('BuildDoctorMCP');

class BuildDoctorMCP {
  private server: Server;
  private analyzer: BuildAnalyzer;
  private fixer: SyntaxFixer;
  private validator: CodeValidator;
  private reporter: BuildReporter;

  constructor() {
    this.server = new Server(
      {
        name: 'build-doctor-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Initialize components
    this.analyzer = new BuildAnalyzer();
    this.fixer = new SyntaxFixer();
    this.validator = new CodeValidator();
    this.reporter = new BuildReporter();

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
          case 'diagnose_build':
            return await this.diagnoseBuild(args as any);

          case 'fix_all_errors':
            return await this.fixAllErrors(args as any);

          case 'fix_syntax_errors':
            return await this.fixSyntaxErrors(args as any);

          case 'fix_typescript_errors':
            return await this.fixTypeScriptErrors(args as any);

          case 'fix_jsx_errors':
            return await this.fixJSXErrors(args as any);

          case 'validate_build':
            return await this.validateBuild(args as any);

          case 'generate_fix_report':
            return await this.generateFixReport(args as any);

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        logger.error(`Tool execution failed: ${error}`);
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    });
  }

  private getAvailableTools(): any[] {
    return [
      {
        name: 'diagnose_build',
        description:
          'Perform comprehensive build diagnosis to identify all errors',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: {
              type: 'string',
              description: 'Path to the project root directory',
            },
            includeWarnings: {
              type: 'boolean',
              description: 'Include warnings in the diagnosis',
              default: false,
            },
          },
          required: ['projectPath'],
        },
      },
      {
        name: 'fix_all_errors',
        description: 'Automatically fix all detected build and syntax errors',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: {
              type: 'string',
              description: 'Path to the project root directory',
            },
            dryRun: {
              type: 'boolean',
              description: 'Preview fixes without applying them',
              default: false,
            },
            createBackup: {
              type: 'boolean',
              description: 'Create backup before applying fixes',
              default: true,
            },
          },
          required: ['projectPath'],
        },
      },
      {
        name: 'fix_syntax_errors',
        description: 'Fix JavaScript/TypeScript syntax errors',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: {
              type: 'string',
              description: 'Path to the project root directory',
            },
            files: {
              type: 'array',
              items: { type: 'string' },
              description: 'Specific files to fix (optional)',
            },
          },
          required: ['projectPath'],
        },
      },
      {
        name: 'fix_typescript_errors',
        description: 'Fix TypeScript type errors and inconsistencies',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: {
              type: 'string',
              description: 'Path to the project root directory',
            },
            strictMode: {
              type: 'boolean',
              description: 'Apply strict TypeScript fixes',
              default: false,
            },
          },
          required: ['projectPath'],
        },
      },
      {
        name: 'fix_jsx_errors',
        description: 'Fix JSX/React syntax and structure errors',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: {
              type: 'string',
              description: 'Path to the project root directory',
            },
            fixDuplicateProps: {
              type: 'boolean',
              description: 'Fix duplicate props/attributes',
              default: true,
            },
          },
          required: ['projectPath'],
        },
      },
      {
        name: 'validate_build',
        description: 'Validate project build and report status',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: {
              type: 'string',
              description: 'Path to the project root directory',
            },
            runTests: {
              type: 'boolean',
              description: 'Also run tests during validation',
              default: false,
            },
          },
          required: ['projectPath'],
        },
      },
      {
        name: 'generate_fix_report',
        description: 'Generate detailed report of all fixes applied',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: {
              type: 'string',
              description: 'Path to the project root directory',
            },
            format: {
              type: 'string',
              enum: ['markdown', 'json', 'html'],
              description: 'Report format',
              default: 'markdown',
            },
          },
          required: ['projectPath'],
        },
      },
    ];
  }

  private async diagnoseBuild(args: {
    projectPath: string;
    includeWarnings?: boolean;
  }) {
    logger.info(`Diagnosing build at ${args.projectPath}`);

    const diagnosis = await this.analyzer.analyzeBuild(args.projectPath, {
      includeWarnings: args.includeWarnings || false,
    });

    const summary = this.formatDiagnosisSummary(diagnosis);

    return {
      content: [
        {
          type: 'text',
          text: summary,
        },
      ],
    };
  }

  private async fixAllErrors(args: {
    projectPath: string;
    dryRun?: boolean;
    createBackup?: boolean;
  }) {
    logger.info(`Fixing all errors at ${args.projectPath}`);

    // First diagnose
    const diagnosis = await this.analyzer.analyzeBuild(args.projectPath);

    if (args.createBackup !== false) {
      await this.createBackup(args.projectPath);
    }

    // Apply fixes
    const fixes = await this.fixer.fixAllErrors(diagnosis, {
      dryRun: args.dryRun || false,
      projectPath: args.projectPath,
    });

    // Validate after fixes
    const validation = args.dryRun
      ? { success: true, message: 'Dry run - no validation performed' }
      : await this.validator.validateProject(args.projectPath);

    const report = this.reporter.generateFixReport(fixes, validation);

    return {
      content: [
        {
          type: 'text',
          text: report,
        },
      ],
    };
  }

  private async fixSyntaxErrors(args: {
    projectPath: string;
    files?: string[];
  }) {
    logger.info(`Fixing syntax errors at ${args.projectPath}`);

    const syntaxErrors = await this.analyzer.findSyntaxErrors(
      args.projectPath,
      args.files
    );
    const fixes = await this.fixer.fixSyntaxErrors(syntaxErrors);

    const summary = this.formatFixSummary('Syntax Errors', fixes);

    return {
      content: [
        {
          type: 'text',
          text: summary,
        },
      ],
    };
  }

  private async fixTypeScriptErrors(args: {
    projectPath: string;
    strictMode?: boolean;
  }) {
    logger.info(`Fixing TypeScript errors at ${args.projectPath}`);

    const tsErrors = await this.analyzer.findTypeScriptErrors(args.projectPath);
    const fixes = await this.fixer.fixTypeScriptErrors(tsErrors, {
      strictMode: args.strictMode || false,
    });

    const summary = this.formatFixSummary('TypeScript Errors', fixes);

    return {
      content: [
        {
          type: 'text',
          text: summary,
        },
      ],
    };
  }

  private async fixJSXErrors(args: {
    projectPath: string;
    fixDuplicateProps?: boolean;
  }) {
    logger.info(`Fixing JSX errors at ${args.projectPath}`);

    const jsxErrors = await this.analyzer.findJSXErrors(args.projectPath);
    const fixes = await this.fixer.fixJSXErrors(jsxErrors, {
      fixDuplicateProps: args.fixDuplicateProps !== false,
    });

    const summary = this.formatFixSummary('JSX Errors', fixes);

    return {
      content: [
        {
          type: 'text',
          text: summary,
        },
      ],
    };
  }

  private async validateBuild(args: {
    projectPath: string;
    runTests?: boolean;
  }) {
    logger.info(`Validating build at ${args.projectPath}`);

    const validation = await this.validator.validateProject(args.projectPath, {
      runTests: args.runTests || false,
    });

    const summary = this.formatValidationSummary(validation);

    return {
      content: [
        {
          type: 'text',
          text: summary,
        },
      ],
    };
  }

  private async generateFixReport(args: {
    projectPath: string;
    format?: string;
  }) {
    logger.info(`Generating fix report for ${args.projectPath}`);

    const report = await this.reporter.generateFullReport(args.projectPath, {
      format: (args.format || 'markdown') as 'markdown' | 'json' | 'html',
    });

    return {
      content: [
        {
          type: 'text',
          text: report,
        },
      ],
    };
  }

  private formatDiagnosisSummary(diagnosis: any): string {
    return `🩺 BUILD DOCTOR DIAGNOSIS

Status: ${diagnosis.errors.length === 0 ? '✅ All Clear' : `❌ ${diagnosis.errors.length} Errors Found`}

📊 Error Breakdown:
- Syntax Errors: ${diagnosis.syntaxErrors}
- TypeScript Errors: ${diagnosis.typeScriptErrors}
- JSX Errors: ${diagnosis.jsxErrors}
- Import Errors: ${diagnosis.importErrors}
- Build Config Issues: ${diagnosis.configErrors}

${
  diagnosis.errors.length > 0
    ? `
⚠️ Critical Issues:
${diagnosis.errors
  .slice(0, 5)
  .map((e: any) => `- ${e.file}:${e.line} - ${e.message}`)
  .join('\\n')}
${diagnosis.errors.length > 5 ? `\\n... and ${diagnosis.errors.length - 5} more errors` : ''}

💡 Recommendation: Run 'fix_all_errors' to automatically resolve these issues.
`
    : '🎉 Your build is healthy! No errors detected.'
}`;
  }

  private formatFixSummary(category: string, fixes: any): string {
    return `🔧 BUILD DOCTOR - ${category} Fixed

✅ Fixed: ${fixes.fixed.length} issues
❌ Failed: ${fixes.failed.length} issues
⏭️ Skipped: ${fixes.skipped.length} issues

${
  fixes.fixed.length > 0
    ? `
📝 Fixed Files:
${fixes.fixed
  .slice(0, 10)
  .map((f: any) => `- ${f.file}: ${f.description}`)
  .join('\\n')}
${fixes.fixed.length > 10 ? `\\n... and ${fixes.fixed.length - 10} more fixes` : ''}
`
    : ''
}

${
  fixes.failed.length > 0
    ? `
⚠️ Failed Fixes:
${fixes.failed.map((f: any) => `- ${f.file}: ${f.reason}`).join('\\n')}
`
    : ''
}

Build Status: ${fixes.buildPasses ? '✅ Build Passes' : '❌ Build Still Failing'}`;
  }

  private formatValidationSummary(validation: any): string {
    return `🏥 BUILD VALIDATION REPORT

Status: ${validation.success ? '✅ Build Successful' : '❌ Build Failed'}

${validation.steps
  .map(
    (step: any) => `${step.success ? '✅' : '❌'} ${step.name}: ${step.message}`
  )
  .join('\\n')}

${
  validation.metrics
    ? `
📊 Build Metrics:
- Build Time: ${validation.metrics.buildTime}ms
- Bundle Size: ${validation.metrics.bundleSize}
- Type Coverage: ${validation.metrics.typeCoverage}%
`
    : ''
}

${
  !validation.success
    ? `
💡 Next Steps:
1. Run 'diagnose_build' to identify specific issues
2. Use 'fix_all_errors' to automatically resolve them
3. Re-run validation to confirm fixes
`
    : '🎉 Your project is production-ready!'
}`;
  }

  private async createBackup(projectPath: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(
      projectPath,
      `.build-doctor-backup-${timestamp}`
    );

    try {
      execSync(`cp -r "${projectPath}" "${backupPath}"`, { stdio: 'ignore' });
      logger.info(`Backup created at ${backupPath}`);
    } catch (error) {
      logger.warn('Failed to create backup, continuing anyway');
    }
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    logger.info(
      'Build Doctor MCP Server running - Ready to diagnose and fix your build!'
    );
  }
}

// Start the server
const doctor = new BuildDoctorMCP();
doctor.run().catch(console.error);
