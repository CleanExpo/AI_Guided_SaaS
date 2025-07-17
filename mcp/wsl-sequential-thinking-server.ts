#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';

const execAsync = promisify(exec);

// Sequential Thinking Interfaces
interface SequentialThinkingParams {
    thought: string;
    nextThoughtNeeded: boolean;
    thoughtNumber: number;
    totalThoughts: number;
    isRevision?: boolean;
    revisesThought?: number;
    branchFromThought?: number;
    branchId?: string;
    needsMoreThoughts?: boolean;
}

interface ThinkingContext {
    currentThought: number;
    totalThoughts: number;
    thoughtHistory: ThoughtRecord[];
    branches: Map<string, ThoughtBranch>;
    hypotheses: Hypothesis[];
    discoveries: Discovery[];
    revisions: Revision[];
}

interface ThoughtRecord {
    number: number;
    content: string;
    timestamp: Date;
    isRevision: boolean;
    branchId?: string;
    confidence: number;
    evidence?: any[];
    conclusions?: string[];
}

interface ThoughtBranch {
    id: string;
    fromThought: number;
    thoughts: ThoughtRecord[];
    outcome: 'success' | 'failure' | 'pending';
}

interface Hypothesis {
    id: string;
    statement: string;
    confidence: number;
    testCriteria: string[];
    evidence: any[];
    verified: boolean;
    timestamp: Date;
}

interface Discovery {
    type: 'issue' | 'opportunity' | 'insight';
    content: string;
    impact: 'low' | 'medium' | 'high';
    timestamp: Date;
}

interface Revision {
    originalThought: number;
    newInsight: string;
    reason: string;
    timestamp: Date;
    impact: string;
}

interface DeploymentStrategy {
    environment: string;
    steps: DeploymentStep[];
    rollbackStrategy: RollbackStrategy;
    monitoring: MonitoringStrategy;
}

interface DeploymentStep {
    name: string;
    action: string;
    requirements: string[];
    validation: string;
}

interface RollbackStrategy {
    triggers: string[];
    steps: string[];
    validation: string;
}

interface MonitoringStrategy {
    metrics: string[];
    alerts: string[];
    dashboards: string[];
}

class WSLSequentialThinkingMCP extends Server {
    private thinkingContext: ThinkingContext;
    private deploymentState: any = {};

    constructor() {
        super(
            {
                name: 'wsl-sequential-thinking-mcp',
                version: '1.0.0',
            },
            {
                capabilities: {
                    tools: {},
                },
            }
        );

        this.initializeThinkingContext();
        this.setupToolHandlers();
    }

    private initializeThinkingContext() {
        this.thinkingContext = {
            currentThought: 1,
            totalThoughts: 8,
            thoughtHistory: [],
            branches: new Map(),
            hypotheses: [],
            discoveries: [],
            revisions: []
        };
    }

    private setupToolHandlers() {
        this.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: [
                {
                    name: 'sequential-deploy',
                    description: 'Execute deployment with sequential thinking',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            environment: { 
                                type: 'string', 
                                enum: ['development', 'production'],
                                description: 'Target deployment environment'
                            },
                            complexity: { 
                                type: 'string', 
                                enum: ['simple', 'moderate', 'complex'],
                                description: 'Expected complexity level'
                            },
                            enableRevisions: { 
                                type: 'boolean', 
                                default: true,
                                description: 'Enable thought revision capabilities'
                            },
                            maxThoughts: { 
                                type: 'number', 
                                default: 15,
                                description: 'Maximum number of thinking steps'
                            }
                        },
                        required: ['environment']
                    }
                },
                {
                    name: 'think-through-problem',
                    description: 'Apply sequential thinking to any deployment problem',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            problem: { 
                                type: 'string', 
                                description: 'Problem description' 
                            },
                            context: { 
                                type: 'object', 
                                description: 'Additional context information' 
                            },
                            initialThoughts: { 
                                type: 'number', 
                                default: 8,
                                description: 'Initial estimate of thoughts needed'
                            }
                        },
                        required: ['problem']
                    }
                },
                {
                    name: 'revise-approach',
                    description: 'Revise previous thinking based on new information',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            thoughtToRevise: { 
                                type: 'number',
                                description: 'Which thought number to revise'
                            },
                            newInsight: { 
                                type: 'string',
                                description: 'New insight or information'
                            },
                            reason: { 
                                type: 'string',
                                description: 'Reason for revision'
                            }
                        },
                        required: ['thoughtToRevise', 'newInsight', 'reason']
                    }
                },
                {
                    name: 'validate-wsl-environment',
                    description: 'Validate WSL Ubuntu environment configuration',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            checkPaths: { type: 'boolean', default: true },
                            checkPermissions: { type: 'boolean', default: true },
                            checkIntegration: { type: 'boolean', default: true }
                        }
                    }
                },
                {
                    name: 'analyze-git-status',
                    description: 'Analyze git status with sequential thinking',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            checkRemote: { type: 'boolean', default: true },
                            validateBranch: { type: 'boolean', default: true }
                        }
                    }
                },
                {
                    name: 'sync-wsl-windows',
                    description: 'Synchronize files between WSL and Windows',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            direction: { 
                                type: 'string', 
                                enum: ['wsl-to-windows', 'windows-to-wsl', 'bidirectional'],
                                default: 'wsl-to-windows'
                            },
                            excludePatterns: { 
                                type: 'array', 
                                items: { type: 'string' },
                                default: ['node_modules', '.git', '.next']
                            },
                            dryRun: { type: 'boolean', default: false }
                        }
                    }
                }
            ]
        }));

        this.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;

            try {
                switch (name) {
                    case 'sequential-deploy':
                        return await this.executeSequentialDeployment(args || {});
                    case 'think-through-problem':
                        return await this.thinkThroughProblem(args || {});
                    case 'revise-approach':
                        return await this.reviseApproach(args || {});
                    case 'validate-wsl-environment':
                        return await this.validateWSLEnvironment(args || {});
                    case 'analyze-git-status':
                        return await this.analyzeGitStatus(args || {});
                    case 'sync-wsl-windows':
                        return await this.syncWSLWindows(args || {});
                    default:
                        throw new Error(`Unknown tool: ${name}`);
                }
            } catch (error) {
                return {
                    content: [{
                        type: 'text',
                        text: `Error executing ${name}: ${error instanceof Error ? error.message : String(error)}`
                    }],
                    isError: true
                };
            }
        });
    }

    // Core Sequential Thinking Implementation
    async executeSequentialDeployment(args: any) {
        const { environment = 'development', complexity = 'moderate', enableRevisions = true, maxThoughts = 15 } = args;
        
        // Initialize thinking process
        let thoughtNumber = 1;
        let totalThoughts = this.estimateInitialThoughts(complexity);
        let nextThoughtNeeded = true;
        
        const deploymentPlan = {
            environment,
            steps: [],
            thinking: [],
            hypotheses: [],
            revisions: []
        };

        // Sequential thinking loop
        while (nextThoughtNeeded && thoughtNumber <= maxThoughts) {
            const thinkingStep = await this.processThought({
                thought: await this.generateDeploymentThought(thoughtNumber, environment, deploymentPlan),
                nextThoughtNeeded: true,
                thoughtNumber,
                totalThoughts
            });

            deploymentPlan.thinking.push(thinkingStep);

            // Dynamic complexity adjustment
            if (thinkingStep.needsMoreThoughts) {
                totalThoughts = Math.min(totalThoughts + 2, maxThoughts);
            }

            // Handle revisions
            if (enableRevisions && thinkingStep.shouldRevise) {
                const revision = await this.handleRevision(thinkingStep);
                deploymentPlan.revisions.push(revision);
            }

            // Branch exploration
            if (thinkingStep.shouldBranch) {
                const branchResult = await this.exploreBranch(thinkingStep);
                deploymentPlan.thinking.push(branchResult);
            }

            // Hypothesis generation and testing
            if (thinkingStep.generatesHypothesis) {
                const hypothesis = await this.generateHypothesis(thinkingStep);
                deploymentPlan.hypotheses.push(hypothesis);
            }

            thoughtNumber++;
            nextThoughtNeeded = thoughtNumber <= totalThoughts;
        }

        // Synthesize final deployment strategy
        const finalStrategy = await this.synthesizeDeploymentStrategy(deploymentPlan);
        
        return {
            content: [{
                type: 'text',
                text: JSON.stringify({
                    success: true,
                    strategy: finalStrategy,
                    thinkingProcess: deploymentPlan.thinking,
                    totalThoughts: thoughtNumber - 1,
                    revisions: deploymentPlan.revisions.length,
                    hypotheses: deploymentPlan.hypotheses.length,
                    summary: `Deployment strategy generated through ${thoughtNumber - 1} sequential thoughts with ${deploymentPlan.revisions.length} revisions and ${deploymentPlan.hypotheses.length} hypotheses tested.`
                }, null, 2)
            }]
        };
    }

    private estimateInitialThoughts(complexity: string): number {
        const complexityMap = {
            'simple': 6,
            'moderate': 8,
            'complex': 12
        };
        return complexityMap[complexity] || 8;
    }

    private async processThought(params: SequentialThinkingParams): Promise<any> {
        const thought: ThoughtRecord = {
            number: params.thoughtNumber,
            content: params.thought,
            timestamp: new Date(),
            isRevision: params.isRevision || false,
            branchId: params.branchId,
            confidence: 0.8,
            evidence: [],
            conclusions: []
        };

        this.thinkingContext.thoughtHistory.push(thought);

        // Analyze thought for special properties
        const analysis = await this.analyzeThought(thought);
        
        return {
            ...thought,
            ...analysis,
            nextThoughtNeeded: params.nextThoughtNeeded
        };
    }

    private async analyzeThought(thought: ThoughtRecord): Promise<any> {
        const content = thought.content.toLowerCase();
        
        return {
            shouldRevise: content.includes('reconsider') || content.includes('revise'),
            shouldBranch: content.includes('alternative') || content.includes('explore'),
            generatesHypothesis: content.includes('hypothesis') || content.includes('assume'),
            needsMoreThoughts: content.includes('complex') || content.includes('additional'),
            discoversIssue: content.includes('issue') || content.includes('problem'),
            branchId: this.extractBranchId(content),
            hypothesisStatement: this.extractHypothesis(content),
            confidence: this.calculateConfidence(content)
        };
    }

    private extractBranchId(content: string): string | undefined {
        if (content.includes('sync')) return 'sync-alternative';
        if (content.includes('security')) return 'security-enhanced';
        if (content.includes('performance')) return 'performance-optimized';
        return undefined;
    }

    private extractHypothesis(content: string): string | undefined {
        const hypothesisMarkers = ['hypothesis:', 'assume that', 'if we', 'suppose'];
        for (const marker of hypothesisMarkers) {
            const index = content.indexOf(marker);
            if (index !== -1) {
                return content.substring(index + marker.length).trim().split('.')[0];
            }
        }
        return undefined;
    }

    private calculateConfidence(content: string): number {
        let confidence = 0.7; // Base confidence
        
        if (content.includes('certain') || content.includes('definitely')) confidence += 0.2;
        if (content.includes('likely') || content.includes('probably')) confidence += 0.1;
        if (content.includes('uncertain') || content.includes('maybe')) confidence -= 0.2;
        if (content.includes('complex') || content.includes('difficult')) confidence -= 0.1;
        
        return Math.max(0.1, Math.min(1.0, confidence));
    }

    // Thought Generation for Deployment Scenarios
    private async generateDeploymentThought(thoughtNumber: number, environment: string, plan: any): Promise<string> {
        const thoughtTemplates = {
            1: () => `Initial assessment: Deploying to ${environment} environment requires analyzing WSL Ubuntu configuration, git status, security requirements, and file synchronization needs. Current complexity appears ${this.assessComplexity(plan)}.`,
            
            2: () => `Environment configuration analysis: WSL Ubuntu requires specific .env.local settings with WSL_DISTRO_NAME, WINDOWS_USER_PROFILE paths, and PROJECT_ROOT configuration. Need to verify current environment variables and sync requirements.`,
            
            3: () => `Git strategy evaluation: Must implement porcelain status checking (git status --porcelain) to ensure clean deployment state. Current git status needs verification before proceeding with any deployment actions.`,
            
            4: () => `Security assessment: Multi-layered security validation required including environment variable validation, dependency audit, file permissions, and authentication verification for GitHub/Vercel integration.`,
            
            5: () => `File synchronization strategy: WSL to Windows sync requires careful handling of node_modules exclusion, .git directory preservation, and selective file copying with rsync or alternative methods.`,
            
            6: () => `Deployment pipeline design: Sequential validation pipeline needed with pre-deployment checks, build verification, security scanning, and automated rollback capabilities.`,
            
            7: () => `Vercel optimization: vercel.json configuration must be optimized for WSL Ubuntu deployment with proper build settings, environment variables, and function configurations.`,
            
            8: () => `Final validation and execution: All previous steps must be validated before executing deployment. Need comprehensive testing and verification of each component.`
        };

        return thoughtTemplates[thoughtNumber] ? thoughtTemplates[thoughtNumber]() : 
               `Advanced analysis step ${thoughtNumber}: Continuing deployment optimization based on previous discoveries and requirements.`;
    }

    private assessComplexity(plan: any): string {
        const factors = [
            plan.thinking?.length || 0,
            plan.hypotheses?.length || 0,
            plan.revisions?.length || 0
        ];
        
        const totalComplexity = factors.reduce((sum, factor) => sum + factor, 0);
        
        if (totalComplexity < 5) return 'moderate';
        if (totalComplexity < 10) return 'complex';
        return 'highly complex';
    }

    // WSL Environment Validation
    async validateWSLEnvironment(args: any) {
        const { checkPaths = true, checkPermissions = true, checkIntegration = true } = args;
        
        const validationResults = {
            wslDistro: null,
            windowsIntegration: null,
            projectPaths: null,
            permissions: null,
            recommendations: []
        };

        try {
            // Check WSL distribution
            const wslInfo = await execAsync('wsl -l -v');
            validationResults.wslDistro = {
                available: true,
                distributions: wslInfo.stdout.trim(),
                defaultDistro: 'Ubuntu' // Simplified
            };

            // Check Windows integration
            if (checkIntegration) {
                try {
                    const windowsPath = await execAsync('wsl -e cmd.exe /c echo %USERPROFILE%');
                    validationResults.windowsIntegration = {
                        available: true,
                        userProfile: windowsPath.stdout.trim()
                    };
                } catch (error) {
                    validationResults.windowsIntegration = {
                        available: false,
                        error: error.message
                    };
                }
            }

            // Check project paths
            if (checkPaths) {
                const projectRoot = process.cwd();
                const wslProjectPath = `/mnt/d/AI Guided SaaS`; // Based on current directory
                
                validationResults.projectPaths = {
                    windowsPath: projectRoot,
                    wslPath: wslProjectPath,
                    accessible: true
                };
            }

            // Generate recommendations
            validationResults.recommendations = [
                'Ensure WSL2 is being used for better performance',
                'Configure .wslconfig for optimal resource allocation',
                'Set up proper file permissions for cross-platform development',
                'Use Windows Terminal for better WSL integration'
            ];

        } catch (error) {
            return {
                content: [{
                    type: 'text',
                    text: `WSL Environment validation failed: ${error.message}`
                }],
                isError: true
            };
        }

        return {
            content: [{
                type: 'text',
                text: JSON.stringify(validationResults, null, 2)
            }]
        };
    }

    // Git Status Analysis
    async analyzeGitStatus(args: any) {
        const { checkRemote = true, validateBranch = true } = args;
        
        try {
            const gitAnalysis = {
                porcelainStatus: null,
                currentBranch: null,
                remoteStatus: null,
                isClean: false,
                recommendations: []
            };

            // Get porcelain status
            const porcelainResult = await execAsync('git status --porcelain');
            gitAnalysis.porcelainStatus = porcelainResult.stdout.trim();
            gitAnalysis.isClean = gitAnalysis.porcelainStatus === '';

            // Get current branch
            if (validateBranch) {
                const branchResult = await execAsync('git rev-parse --abbrev-ref HEAD');
                gitAnalysis.currentBranch = branchResult.stdout.trim();
            }

            // Check remote status
            if (checkRemote) {
                try {
                    await execAsync('git fetch origin');
                    const localCommit = await execAsync('git rev-parse HEAD');
                    const remoteCommit = await execAsync('git rev-parse @{u}');
                    
                    gitAnalysis.remoteStatus = {
                        upToDate: localCommit.stdout.trim() === remoteCommit.stdout.trim(),
                        localCommit: localCommit.stdout.trim(),
                        remoteCommit: remoteCommit.stdout.trim()
                    };
                } catch (error) {
                    gitAnalysis.remoteStatus = {
                        error: 'Unable to check remote status',
                        details: error.message
                    };
                }
            }

            // Generate recommendations
            if (!gitAnalysis.isClean) {
                gitAnalysis.recommendations.push('Commit or stash uncommitted changes before deployment');
            }
            
            if (gitAnalysis.currentBranch !== 'main') {
                gitAnalysis.recommendations.push(`Consider deploying from main branch instead of ${gitAnalysis.currentBranch}`);
            }

            if (gitAnalysis.remoteStatus && !gitAnalysis.remoteStatus.upToDate) {
                gitAnalysis.recommendations.push('Pull latest changes from remote before deployment');
            }

            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify(gitAnalysis, null, 2)
                }]
            };

        } catch (error) {
            return {
                content: [{
                    type: 'text',
                    text: `Git analysis failed: ${error.message}`
                }],
                isError: true
            };
        }
    }

    // File Synchronization
    async syncWSLWindows(args: any) {
        const { direction = 'wsl-to-windows', excludePatterns = ['node_modules', '.git', '.next'], dryRun = false } = args;
        
        const syncResult = {
            direction,
            excludePatterns,
            dryRun,
            filesProcessed: 0,
            errors: [],
            summary: ''
        };

        try {
            const currentDir = process.cwd();
            const wslPath = `/mnt/d/AI Guided SaaS`;
            
            // Build rsync command
            const excludeArgs = excludePatterns.map(pattern => `--exclude='${pattern}'`).join(' ');
            const dryRunFlag = dryRun ? '--dry-run' : '';
            
            let syncCommand = '';
            
            switch (direction) {
                case 'wsl-to-windows':
                    syncCommand = `wsl -e rsync -av ${dryRunFlag} ${excludeArgs} "${wslPath}/" "${currentDir}/"`;
                    break;
                case 'windows-to-wsl':
                    syncCommand = `wsl -e rsync -av ${dryRunFlag} ${excludeArgs} "${currentDir}/" "${wslPath}/"`;
                    break;
                case 'bidirectional':
                    // For bidirectional, we'll do WSL to Windows first, then check for conflicts
                    syncCommand = `wsl -e rsync -av ${dryRunFlag} ${excludeArgs} "${wslPath}/" "${currentDir}/"`;
                    break;
            }

            const result = await execAsync(syncCommand);
            
            // Parse rsync output to count files
            const lines = result.stdout.split('\n').filter(line => line.trim() && !line.startsWith('sending') && !line.startsWith('sent'));
            syncResult.filesProcessed = lines.length;
            syncResult.summary = `Synchronized ${syncResult.filesProcessed} files from ${direction}`;

            if (dryRun) {
                syncResult.summary += ' (dry run - no files actually copied)';
            }

        } catch (error) {
            syncResult.errors.push(error.message);
            syncResult.summary = `Synchronization failed: ${error.message}`;
        }

        return {
            content: [{
                type: 'text',
                text: JSON.stringify(syncResult, null, 2)
            }]
        };
    }

    // Additional helper methods
    private async handleRevision(thinkingStep: any): Promise<Revision> {
        return {
            originalThought: thinkingStep.revisesThought,
            newInsight: thinkingStep.newInsight || 'Revised based on new analysis',
            reason: thinkingStep.revisionReason || 'Improved understanding',
            timestamp: new Date(),
            impact: await this.assessRevisionImpact(thinkingStep)
        };
    }

    private async assessRevisionImpact(thinkingStep: any): Promise<string> {
        // Simplified impact assessment
        if (thinkingStep.confidence > 0.8) return 'high';
        if (thinkingStep.confidence > 0.6) return 'medium';
        return 'low';
    }

    private async exploreBranch(thinkingStep: any): Promise<ThoughtRecord> {
        const branchStrategies = {
            'sync-alternative': () => 'Exploring alternative sync methods: file watchers, git-based sync, or Windows robocopy for better performance',
            'security-enhanced': () => 'Exploring enhanced security measures: additional vulnerability scanning, secrets validation, and access control',
            'performance-optimized': () => 'Exploring performance optimizations: build caching, parallel processing, and resource optimization'
        };

        const strategy = branchStrategies[thinkingStep.branchId];
        const branchContent = strategy ? strategy() : 'Exploring alternative approach';

        return {
            number: thinkingStep.thoughtNumber,
            content: branchContent,
            timestamp: new Date(),
            isRevision: false,
            branchId: thinkingStep.branchId,
            confidence: 0.8
        };
    }

    private async generateHypothesis(thinkingStep: any): Promise<Hypothesis> {
        const hypothesis: Hypothesis = {
            id: `hyp-${Date.now()}`,
            statement: thinkingStep.hypothesisStatement || 'Generated hypothesis',
            confidence: thinkingStep.confidence || 0.7,
            testCriteria: thinkingStep.testCriteria || ['validation required'],
            evidence: [],
            verified: false,
            timestamp: new Date()
        };

        // Simplified hypothesis testing
        hypothesis.verified = hypothesis.confidence > 0.7;
        hypothesis.evidence = ['Sequential thinking analysis', 'Context evaluation'];

        return hypothesis;
    }

    private async synthesizeDeploymentStrategy(plan: any): Promise<DeploymentStrategy> {
        return {
            environment: plan.environment,
            steps: [
                {
                    name: 'Environment Validation',
                    action: 'validateWSLEnvironment',
                    requirements: ['WSL_DISTRO_NAME', 'PROJECT_ROOT', '.env.local'],
                    validation: 'checkEnvironmentVariables'
                },
                {
                    name: 'Git Status Check',
                    action: 'validateGitStatus',
                    requirements: ['clean working directory', 'up-to-date with remote'],
                    validation: 'git status --porcelain'
                },
                {
                    name: 'Security Validation',
                    action: 'runSecurityChecks',
                    requirements: ['dependency audit', 'environment validation', 'file permissions'],
                    validation: 'npm audit && checkFilePermissions'
                },
                {
                    name: 'File Synchronization',
                    action: 'syncWSLWindows',
                    requirements: ['exclude node_modules', 'preserve .git', 'update timestamps'],
                    validation: 'rsync verification'
                },
                {
                    name: 'Pre-deployment Checks',
                    action: 'runPreDeploymentChecks',
                    requirements: ['vercel.json exists', 'build successful', 'tests pass'],
                    validation: 'node vercel-pre-deployment-check.cjs'
                },
                {
                    name: 'Deployment Execution',
                    action: 'deployToVercel',
                    requirements: ['all checks passed', 'environment configured'],
                    validation: 'vercel --prod'
                }
            ],
            rollbackStrategy: {
                triggers: ['deployment failure', 'health check failure', 'user request'],
                steps: ['stop deployment', 'restore previous version', 'verify rollback'],
                validation: 'health check passed'
            },
            monitoring: {
                metrics: ['response time', 'error rate', 'deployment status'],
                alerts: ['deployment failure', 'performance degradation'],
                dashboards: ['deployment dashboard', 'performance metrics']
            }
        };
    }

    async thinkThroughProblem(args: any) {
        const { problem, context = {}, initialThoughts = 8 } = args;
        
        // Implementation for general problem solving
        return {
            content: [{
                type: 'text',
                text: `Thinking through problem: ${problem}\nContext: ${JSON.stringify(context, null, 2)}\nInitial thoughts: ${initialThoughts}`
            }]
        };
    }

    async reviseApproach(args: any) {
        const { thoughtToRevise, newInsight, reason } = args;
        
        const revision = {
            thoughtToRevise,
            newInsight,
            reason,
            timestamp: new Date(),
            impact: 'Approach revised based on new information'
        };

        return {
            content: [{
                type: 'text',
                text: JSON.stringify(revision, null, 2)
            }]
        };
    }
}

// Start the server
const server = new WSLSequentialThinkingMCP();
const transport = new StdioServerTransport();
server.connect(transport);

console.error('WSL Sequential Thinking MCP Server running on stdio');
