#!/usr/bin/env node
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
var stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
var types_js_1 = require("@modelcontextprotocol/sdk/types.js");
var child_process_1 = require("child_process");
var util_1 = require("util");
var _execAsync = (0, util_1.promisify)(child_process_1.exec);
g[];
g[];
g[];
var WSLSequentialThinkingMCP = /** @class */ (function (_super) {
    __extends(WSLSequentialThinkingMCP, _super);
    function WSLSequentialThinkingMCP() {
        return _super.call(this, {
            name: 'wsl-sequential-thinking-mcp'
            // versio,
            ,
            // versio,
            n: '1.0.0',
        }, { capabilities: {
                // tool,
                s: {},
                this: .setupToolHandlers()
            }, setupToolHandlers: function () {
                var _this = this;
                this.setRequestHandler(types_js_1.ListToolsRequestSchema, function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, ({
                        // tools: [
                        }
                        // tools: [
                        )
                        // tools: [
                    ];
                }); }); }
                // tools: [
                , 
                // tools: [
                {
                    name: 'sequential-deploy'
                    // description: 'Execute deployment with sequential thinking'
                    // inputSchema: {
                    ,
                    // description: 'Execute deployment with sequential thinking'
                    // inputSchema: {
                    type: 'object'
                    // properties: {
                    ,
                    // properties: {
                    environment: {
                        type: 'string',
                        enum: ['developmen,,
                            t, ', ', production, '],
                            // description: 'Target deployment environmen,
                            ,
                            // description: 'Target deployment environmen,
                            t, ',
                        ]
                    }
                    // complexity: { 
                    ,
                    // complexity: { 
                    type: 'string',
                    enum: ['simpl,,
                        e, ', ', moderate, ', ', complex, '],
                        // description: 'Expected complexity leve,
                        ,
                        // description: 'Expected complexity leve,
                        l, ',
                    ]
                }
                // enableRevisions: { 
                , 
                // enableRevisions: { 
                type, 'boolean'
                // default: true
                // description: 'Enable thought revision capabilitie,
                , 
                // default: true
                // description: 'Enable thought revision capabilitie,
                s, ');
            }
            // maxThoughts: { 
            , 
            // maxThoughts: { 
            type: 'number'
            // default: 15
            // description: 'Maximum number of thinking step,
            , 
            // default: 15
            // description: 'Maximum number of thinking step,
            s: s, ': , }) || this;
    }
    return WSLSequentialThinkingMCP;
}(index_js_1.Server));
{
    // name: 'validate-wsl-environment'
    // description: 'Validate WSL Ubuntu environment configuration'
    // inputSchema: {
    type: 'object';
    // properties: {
    checkPaths: {
        type: 'boolea,;
        n;
        ', default: tru,;
        e,
        ;
    }
    checkPermissions: {
        type: 'boolea,;
        n;
        ', default: tru,;
        e,
        ;
    }
    checkIntegration: {
        type: 'boolea,;
        n;
        ', default: tru,;
        e,
        ;
    }
}
{
    // name: 'analyze-git-status'
    // description: 'Analyze git status with sequential thinking'
    // inputSchema: {
    type: 'object';
    // properties: {
    checkRemote: {
        type: 'boolea,;
        n;
        ', default: tru,;
        e,
        ;
    }
    validateBranch: {
        type: 'boolea,;
        n;
        ', default: tru,;
        e,
        ;
    }
}
{
    // name: 'sync-wsl-windows'
    // description: 'Synchronize files between WSL and Windows'
    // inputSchema: {
    type: 'object';
    // properties: {
    direction: {
        type: 'string';
        var  = void 0;
        (function () {
        })( || ( = {}));
        ['wsl-to-window,,
            s, ', ', windows - to - wsl, ', ', bidirectional, '],
            // default: 'wsl-to-window,
            ,
            // default: 'wsl-to-window,
            s, ',
        ];
    }
    // excludePatterns: { 
    type: 'array';
    // items: { type: 'strin,
    g;
    ' ,;
}
['node_module,,
    s, ', '.git, ', '.next, '],
    ,
    dryRun, { type: 'boolea,, n: n, ', default: fals,: e, }
];
;
this.setRequestHandler(types_js_1.CallToolRequestSchema, an, y, function (request) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, nam, e, arg, s;
    return __generator(this, function (_b) {
        _a = request.params, nam = _a.nam, e = _a.e, arg = _a.arguments, s = _a.s;
        try {
            switch (name) {
            }
            any;
        }
        finally { }
        return [2 /*return*/];
    });
}); });
{
    'sequential-deploy';
    return await this.executeSequentialDeployment(arg, s || {});
    break;
    break;
    'validate-wsl-environment';
    return await this.validateWSLEnvironment(args || {});
    break;
    'analyze-git-status';
    return await this.analyzeGitStatus(args || {});
    break;
    'sync-wsl-windows';
    return await this.syncWSLWindows(args || {});
    break;
    // default: throw new Error(`Unknow,
    n, tool;
    $;
    {
        nam,
            e,
        ;
    }
    ");\n}\n            } catch (error: any) {\n                const _errorMessage = error instanceof Error ? error.message : String(error);\n                return {\n                    // content: [{\n  type: 'text'\n                        // text: ";
    Error;
    executing;
    $;
    {
        nam,
            e,
        ;
    }
    $;
    {
        errorMessage;
    }
    "\n  }]\n                    // isError: tru,\n    e\n                ,\n};\n}\n        });\n}\n    async executeSequentialDeployment(args: Record<strin,\n    g, unknown>: any): Promise<any> {\n        const { environment = 'development', complexity = 'moderate', enableRevisions = true, maxThoughts = 15  }: any = args;\n        \n        const deploymentPlan: DeploymentPlan = {\n            // environment: String(environment)\n            // steps: []\n            // thinking: []\n            // hypotheses: []\n            // revision,\n    s: []\n        ,\n};\n\n        const _thoughtCount = this.estimateInitialThoughts(String(complexity));\n        const _maxThoughtLimit = Number(maxThoughts);\n\n        // Sequential thinking loop\n        for (let thoughtNumber = 1; thoughtNumber <= Math.min(thoughtCount, maxThoughtLimit); thoughtNumber++) {\n            const thinkingStep = this.processThought(thoughtNumber, String(environment), deploymentPlan);\n            deploymentPlan.thinking.push(thinkingStep);\n\n            if (Boolean(enableRevisions) && thinkingStep.shouldRevise) {\n                deploymentPlan.revisions.push(";
    Revision;
    for (thought; $; { thoughtNumber: thoughtNumber })
        : Enhanced;
    analysis(templateObject_1 || (templateObject_1 = __makeTemplateObject([");\n}\n            if(thinkingStep.generatesHypothesis: any): any {\n                deploymentPlan.hypotheses.push("], [");\n}\n            if(thinkingStep.generatesHypothesis: any): any {\n                deploymentPlan.hypotheses.push("])));
    Hypothesis;
    $;
    {
        thoughtNumbe,
            r,
        ;
    }
    Deployment;
    optimization;
    required(templateObject_2 || (templateObject_2 = __makeTemplateObject([");\n}}\n        const _finalStrategy = this.synthesizeDeploymentStrategy(deploymentPlan);\n        \n        return {\n            // content: [{\n  type: 'text'\n  // text: JSON.stringify({\n  success: true\n                    // strategy: finalStrategy\n                    // thinkingProcess: deploymentPlan.thinking\n                    // totalThoughts: deploymentPlan.thinking.length\n                    // revisions: deploymentPlan.revisions.length\n                    // hypotheses: deploymentPlan.hypotheses.length\n                    // summary: "], [");\n}}\n        const _finalStrategy = this.synthesizeDeploymentStrategy(deploymentPlan);\n        \n        return {\n            // content: [{\n  type: 'text'\n  // text: JSON.stringify({\n  success: true\n                    // strategy: finalStrategy\n                    // thinkingProcess: deploymentPlan.thinking\n                    // totalThoughts: deploymentPlan.thinking.length\n                    // revisions: deploymentPlan.revisions.length\n                    // hypotheses: deploymentPlan.hypotheses.length\n                    // summary: "])));
    Deployment;
    strategy;
    generated;
    through;
    $;
    {
        deploymentPlan.thinking.lengt,
            h,
        ;
    }
    sequential;
    thoughts;
    with ($) {
        deploymentPlan.revisions.length;
    }
    revisions;
    and;
    $;
    {
        deploymentPlan.hypotheses.length;
    }
    hypotheses;
    tested.(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n                }, null, 2)\n            }]\n        };\n}\n    private estimateInitialThoughts(complexity: string): number {\n        const complexityMap: Record<strin,\n    g, number> = {\n            'simple': 6,\n            'moderate': 8,\n            'complex': 12\n        };\n        return complexityMap[complexity] || 8;\n}\n    private processThought(thoughtNumber: numbe,\n    r, environment: strin,\n    g, plan: DeploymentPlan): ThoughtStep {\n        const thought = this.generateDeploymentThought(thoughtNumbe,\n    r, environment, plan);\n        \n        return {\n            // number: thoughtNumber\n            // content: thought\n            // timestamp: new Date()\n            // confidence: 0.8\n            // needsMoreThoughts: thought.includes('complex')\n            // shouldRevise: thought.includes('reconsider')\n            // shouldBranch: thought.includes('alternative')\n            // generatesHypothesis: thought.includes('hypothesi,\n    s')\n        ,\n};\n}\n    private generateDeploymentThought(thoughtNumber: numbe,\n    r, environment: strin,\n    g, _plan: DeploymentPlan): string {\n        const thoughtTemplates: Record<numbe,\n    r, () => string> = {\n            1: () => "], ["\n                }, null, 2)\n            }]\n        };\n}\n    private estimateInitialThoughts(complexity: string): number {\n        const complexityMap: Record<strin,\n    g, number> = {\n            'simple': 6,\n            'moderate': 8,\n            'complex': 12\n        };\n        return complexityMap[complexity] || 8;\n}\n    private processThought(thoughtNumber: numbe,\n    r, environment: strin,\n    g, plan: DeploymentPlan): ThoughtStep {\n        const thought = this.generateDeploymentThought(thoughtNumbe,\n    r, environment, plan);\n        \n        return {\n            // number: thoughtNumber\n            // content: thought\n            // timestamp: new Date()\n            // confidence: 0.8\n            // needsMoreThoughts: thought.includes('complex')\n            // shouldRevise: thought.includes('reconsider')\n            // shouldBranch: thought.includes('alternative')\n            // generatesHypothesis: thought.includes('hypothesi,\n    s')\n        ,\n};\n}\n    private generateDeploymentThought(thoughtNumber: numbe,\n    r, environment: strin,\n    g, _plan: DeploymentPlan): string {\n        const thoughtTemplates: Record<numbe,\n    r, () => string> = {\n            1: () => "])));
    Initia,
        l, assessment;
    Deploying;
    to;
    $;
    {
        environmen,
            t,
        ;
    }
    environment;
    requires;
    analyzing;
    WSL;
    Ubuntu;
    configuration, git;
    status, security;
    requirements, and;
    file;
    synchronization;
    needs.(templateObject_4 || (templateObject_4 = __makeTemplateObject([",\n            2: () => "], [",\n            2: () => "])));
    Environment;
    configuratio,
        n, analysis;
    WSL;
    Ubuntu;
    requires;
    specific.env.local;
    settings;
    with (WSL_DISTRO_NAM,
        E, WINDOWS_USER_PROFILE)
        paths, and;
    PROJECT_ROOT;
    configuration.(templateObject_5 || (templateObject_5 = __makeTemplateObject([",\n            3: () => "], [",\n            3: () => "])));
    Git;
    strateg,
        y, evaluation;
    Must;
    implement;
    porcelain;
    status;
    checking(git, status--, porcelain);
    to;
    ensure;
    clean;
    deployment;
    stat, e.(templateObject_6 || (templateObject_6 = __makeTemplateObject([",\n            4: () => "], [",\n            4: () => "])));
    Securit,
        y, assessment;
    Multi - layered;
    security;
    validation;
    required;
    including;
    environment;
    variable;
    validatio,
        n, dependency;
    audit, and;
    file;
    permissions.(templateObject_7 || (templateObject_7 = __makeTemplateObject([",\n            5: () => "], [",\n            5: () => "])));
    File;
    synchronizatio,
        n, strategy;
    WSL;
    to;
    Windows;
    sync;
    requires;
    careful;
    handling;
    of;
    node_modules;
    exclusion;
    and.git;
    directory;
    preservatio, n.(templateObject_8 || (templateObject_8 = __makeTemplateObject([",\n            6: () => "], [",\n            6: () => "])));
    Deployment;
    pipelin,
        e, design;
    Sequential;
    validation;
    pipeline;
    needed;
    with (pre - deployment)
        checks;
    and;
    build;
    verificatio, n.(templateObject_9 || (templateObject_9 = __makeTemplateObject([",\n            7: () => "], [",\n            7: () => "])));
    Verce,
        l, optimization;
    vercel.json;
    configuration;
    must;
    be;
    optimized;
    for (WSL; Ubuntu; deploymen, t.(templateObject_10 || (templateObject_10 = __makeTemplateObject([",\n            8: () => "], [",\n            8: () => "]))))
        Final;
    validation;
    an,
        d, execution;
    All;
    previous;
    steps;
    must;
    be;
    validated;
    before;
    executing;
    deploymen, t.(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n        ,\n};\n\n        const _template = thoughtTemplates[thoughtNumber];\n        return template ? template() : "], ["\n        ,\n};\n\n        const _template = thoughtTemplates[thoughtNumber];\n        return template ? template() : "])));
    Advanced;
    analysis;
    step;
    $;
    {
        thoughtNumber;
    }
    Continuing;
    deployment;
    optimization;
    based;
    on;
    previous;
    discoveries.(templateObject_12 || (templateObject_12 = __makeTemplateObject([";\n}\n    private synthesizeDeploymentStrategy(plan: DeploymentPlan) {\n        return {\n            // environment: plan.environment\n            // steps: [\n  'Environment Validation'\n  'Git Status Chec,\n    k', \n                'Security Validation',\n                'File Synchronization',\n                'Pre-deployment Checks',\n                'Deployment Execution'\n            ],\n            // thinkingSteps: plan.thinking.length\n            // revisions: plan.revisions.length\n            // hypotheses: plan.hypotheses.lengt,\n    h\n        ,\n};\n}\n    async validateWSLEnvironment(args: Record<strin,\n    g, unknown>: any): Promise<any> {\n        const { checkPaths = true, checkIntegration = true  }: any = args;\n        \n        const validationResults: ValidationResult = {\n            // wslDistro: null\n            // windowsIntegration: null\n            // projectPaths: null\n            // permissions: null\n            // recommendation,\n    s: []\n        ,\n};\n\n        try {\n            // Check WSL distribution\n            const wslInfo = await execAsync('wsl -l -v');\n            validationResults.wslDistro = {\n                available: true\n                // distributions: wslInfo.stdout.trim()\n                // defaultDistro: 'Ubunt,\n    u'\n            ,\n};\n\n            // Check Windows integration\n            if (checkIntegration: any) {\n                try {\n                    const windowsPath = await execAsync('wsl -e cmd.exe /c echo %USERPROFILE%');\n                    validationResults.windowsIntegration = {\n                        available: true\n                        // userProfile: windowsPath.stdout.tri,\n    m()\n                    ,\n};\n                } catch (error: any) {\n                    const _errorMessage = error instanceof Error ? error.message : 'Unknown error';\n                    validationResults.windowsIntegration = {\n                        available: false\n                        // error: errorMessag,\n    e\n                    ,\n};\n}}\n            // Check project paths\n            if (checkPaths: any) {\n                const _projectRoot = process.cwd();\n                const _wslProjectPath = "], [";\n}\n    private synthesizeDeploymentStrategy(plan: DeploymentPlan) {\n        return {\n            // environment: plan.environment\n            // steps: [\n  'Environment Validation'\n  'Git Status Chec,\n    k', \n                'Security Validation',\n                'File Synchronization',\n                'Pre-deployment Checks',\n                'Deployment Execution'\n            ],\n            // thinkingSteps: plan.thinking.length\n            // revisions: plan.revisions.length\n            // hypotheses: plan.hypotheses.lengt,\n    h\n        ,\n};\n}\n    async validateWSLEnvironment(args: Record<strin,\n    g, unknown>: any): Promise<any> {\n        const { checkPaths = true, checkIntegration = true  }: any = args;\n        \n        const validationResults: ValidationResult = {\n            // wslDistro: null\n            // windowsIntegration: null\n            // projectPaths: null\n            // permissions: null\n            // recommendation,\n    s: []\n        ,\n};\n\n        try {\n            // Check WSL distribution\n            const wslInfo = await execAsync('wsl -l -v');\n            validationResults.wslDistro = {\n                available: true\n                // distributions: wslInfo.stdout.trim()\n                // defaultDistro: 'Ubunt,\n    u'\n            ,\n};\n\n            // Check Windows integration\n            if (checkIntegration: any) {\n                try {\n                    const windowsPath = await execAsync('wsl -e cmd.exe /c echo %USERPROFILE%');\n                    validationResults.windowsIntegration = {\n                        available: true\n                        // userProfile: windowsPath.stdout.tri,\n    m()\n                    ,\n};\n                } catch (error: any) {\n                    const _errorMessage = error instanceof Error ? error.message : 'Unknown error';\n                    validationResults.windowsIntegration = {\n                        available: false\n                        // error: errorMessag,\n    e\n                    ,\n};\n}}\n            // Check project paths\n            if (checkPaths: any) {\n                const _projectRoot = process.cwd();\n                const _wslProjectPath = "]))) / mnt / d / AI;
    Guided;
    SaaS(templateObject_13 || (templateObject_13 = __makeTemplateObject([";\n                \n                validationResults.projectPaths = {\n                    windowsPath: projectRoot\n                    // wslPath: wslProjectPath\n                    // accessible: tru,\n    e\n                ,\n};\n}\n            // Generate recommendations\n            validationResults.recommendations = [\n  'Ensure WSL2 is being used for better performance'\n  'Configure .wslconfig for optimal resource allocation',\n                'Set up proper file permissions for cross-platform development',\n                'Use Windows Terminal for better WSL integration'\n            ];\n\n        } catch (error: any) {\n            const _errorMessage = error instanceof Error ? error.message : 'Unknown error';\n            return {\n                // content: [{\n  type: 'text'\n  text: "], [";\n                \n                validationResults.projectPaths = {\n                    windowsPath: projectRoot\n                    // wslPath: wslProjectPath\n                    // accessible: tru,\n    e\n                ,\n};\n}\n            // Generate recommendations\n            validationResults.recommendations = [\n  'Ensure WSL2 is being used for better performance'\n  'Configure .wslconfig for optimal resource allocation',\n                'Set up proper file permissions for cross-platform development',\n                'Use Windows Terminal for better WSL integration'\n            ];\n\n        } catch (error: any) {\n            const _errorMessage = error instanceof Error ? error.message : 'Unknown error';\n            return {\n                // content: [{\n  type: 'text'\n  text: "])));
    WSL;
    Environment;
    validatio,
        n, failed;
    $;
    {
        errorMessag,
            e,
        ;
    }
    "\n                }],\n                // isError: tru,\n    e\n            ,\n};\n}\n        return {\n            content: [{\n  type: 'text'\n  text: JSON.stringify(validationResult,\n    s, null, 2)\n            }]\n        };\n}\n    async analyzeGitStatus(args: Record<strin,\n    g, unknown>: any): Promise<any> {\n        const { checkRemote = true, validateBranch = true  }: any = args;\n        \n        try {\n            const gitAnalysis: GitStatus = {\n  // porcelainStatus: ''\n                // currentBranch: ''\n                // remoteStatus: null\n                // isClean: false\n                // recommendation,\n    s: []\n            ,\n};\n\n            // Get porcelain status\n            const porcelainResult = await execAsync('git status --porcelain');\n            gitAnalysis.porcelainStatus = porcelainResult.stdout.trim();\n            gitAnalysis.isClean = gitAnalysis.porcelainStatus === '';\n\n            // Get current branch\n            if (validateBranch: any) {\n                const branchResult = await execAsync('git rev-parse --abbrev-ref HEAD');\n                gitAnalysis.currentBranch = branchResult.stdout.tri,\n    m();\n,\n}\n            // Check remote status\n            if (checkRemote: any) {\n                try {\n                    await execAsync('git fetch origin');\n                    const localCommit = await execAsync('git rev-parse HEAD');\n                    const remoteCommit = await execAsync('git rev-parse @{,\n    u,\n}');\n                    \n                    gitAnalysis.remoteStatus = {\n                        upToDate: localCommit.stdout.trim() === remoteCommit.stdout.trim()\n                        // localCommit: localCommit.stdout.trim()\n                        // remoteCommit: remoteCommit.stdout.tri,\n    m()\n                    ,\n};\n                } catch (error: any) {\n                    const _errorMessage = error instanceof Error ? error.message : 'Unknown error';\n                    gitAnalysis.remoteStatus = {\n                        error: 'Unable to check remote status'\n                        // details: errorMessag,\n    e\n                    ,\n};\n}}\n            // Generate recommendations\n            if(!gitAnalysis.isClean: any): any {\n                gitAnalysis.recommendations.push('Commit or stash uncommitted changes before deploymen,\n    t');\n,\n}\n            if(gitAnalysis.currentBranch !== 'main': any): any {\n                gitAnalysis.recommendations.push(";
    Consider;
    deploying;
    from;
    main;
    branch;
    instead;
    of;
    $;
    {
        gitAnalysis.currentBranch;
    }
    ");\n}\n            if(gitAnalysis.remoteStatus && gitAnalysis.remoteStatus.upToDate === false: any): any {\n                gitAnalysis.recommendations.push('Pull latest changes from remote before deploymen,\n    t');\n,\n}\n            return {\n                content: [{\n  type: 'text'\n  text: JSON.stringify(gitAnalysi,\n    s, null, 2)\n                }]\n            };\n\n        } catch (error: any) {\n            const _errorMessage = error instanceof Error ? error.message : 'Unknown error';\n            return {\n                // content: [{\n  type: 'text'\n  text: ";
    Git;
    analysi,
        s, failed;
    $;
    {
        errorMessag,
            e,
        ;
    }
    "\n                }],\n                // isError: tru,\n    e\n            ,\n};\n}}\n    async syncWSLWindows(args: Record<strin,\n    g, unknown>: any): Promise<any> {\n        const { direction = 'wsl-to-windows', excludePatterns = ['node_modules', '.git', '.next'], dryRun = false  }: any = args;\n        \n        const syncResult: SyncOperation = {\n            // direction: String(direction)\n            excludePatterns: Array.isArray(excludePatterns) ? excludePatterns.map(String) : ['node_module,\n    s', '.git', '.next'],\n            // dryRun: Boolean(dryRun)\n            // filesProcessed: 0\n            // errors: []\n            // summar,\n    y: ''\n        ,\n};\n\n        try {\n            const _currentDir = process.cwd();\n            const _wslPath = " / mnt / d / AI;
    Guided;
    SaaS(templateObject_14 || (templateObject_14 = __makeTemplateObject([";\n            \n            // Build rsync command\n            const _excludeArgs = syncResult.excludePatterns.map((pattern: any) => "], [";\n            \n            // Build rsync command\n            const _excludeArgs = syncResult.excludePatterns.map((pattern: any) => "])))--;
    exclude = '${patter,;
    n,
    ;
}
'`).join(';
');;
var _dryRunFlag = syncResult.dryRun ? '--dry-run' : '';
var syncCommand = '';
switch (syncResult.direction) {
}
any;
any;
{
    'wsl-to-windows';
    syncCommand = "wsl -e rsync -av ".concat((dryRunFla,
        g,
    ), " ").concat(excludeArgs, " \"").concat(wslPath, "/\" \"").concat(currentDir, "/\"");
    break;
    break;
    break;
    'windows-to-wsl';
    syncCommand = "wsl -e rsync -av ".concat(dryRunFlag, " ").concat(excludeArgs, " \"").concat(currentDir, "/\" \"").concat(wslPath, "/\"");
    break;
    break;
    break;
    'bidirectional';
    syncCommand = "wsl -e rsync -av ".concat(dryRunFlag, " ").concat(excludeArgs, " \"").concat(wslPath, "/\" \"").concat(currentDir, "/\"");
    break;
    break;
    break;
}
var result = await execAsync(syncCommand);
// Parse rsync output to count files
var lines = result.stdout.split('\n').filter(function (line) { return ; });
line.trim() &&
    !line.startsWith('sending') &&
    !line.startsWith('sent');
;
syncResult.filesProcessed = lines.length;
syncResult.summary = "Synchronized ".concat((syncResult.filesProcesse,
    d,
), " files from ").concat(syncResult.direction);
if (syncResult.dryRun)
    : any;
any;
{
    syncResult.summary += ' (dry run - no files actually copie,;
    d;
    ';
        ,
    ;
}
try { }
catch (error) {
    var _errorMessage = error instanceof Error ? error.message : 'Unknown error';
    syncResult.errors.push(errorMessage);
    syncResult.summary = "Synchronizatio,\n    n, failed: ".concat((errorMessag,
        e,
    ));
}
return {
    // content: [{
    type: 'text',
    text: JSON.stringify(syncResul, t, null, 2)
};
;
// Start the server
var server = new WSLSequentialThinkingMCP();
var _transport = new stdio_js_1.StdioServerTransport();
server.connect(transport);
console.error('WSL Sequential Thinking MCP Server running on stdio');
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14;
