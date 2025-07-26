import { Project, SourceFile, Node, SyntaxKind } from 'ts-morph';
import * as fs from 'fs/promises';
import { glob } from 'glob';
import { logger } from './utils/logger.js';
import { CodeMetrics, WastePattern, AnalysisResult, DuplicateCode } from './types.js';

export class WasteAnalyzer {
  private project: Project;
  private wastePatterns: WastePattern[] = [];

  constructor() {
    this.project = new Project({
      skipFileDependencyResolution: true,
      compilerOptions: {
        allowJs: true,
        jsx: 'react' as any,
      },
    });
    this.initializeWastePatterns();
  }

  private initializeWastePatterns() {
    this.wastePatterns = [
      {
        name: 'unused_variables',
        severity: 'medium',
        detector: this.detectUnusedVariables.bind(this),
      },
      {
        name: 'dead_code',
        severity: 'high',
        detector: this.detectDeadCode.bind(this),
      },
      {
        name: 'complex_functions',
        severity: 'medium',
        detector: this.detectComplexFunctions.bind(this),
      },
      {
        name: 'duplicate_imports',
        severity: 'low',
        detector: this.detectDuplicateImports.bind(this),
      },
      {
        name: 'console_logs',
        severity: 'low',
        detector: this.detectConsoleLogs.bind(this),
      },
      {
        name: 'long_functions',
        severity: 'medium',
        detector: this.detectLongFunctions.bind(this),
      },
      {
        name: 'nested_callbacks',
        severity: 'high',
        detector: this.detectNestedCallbacks.bind(this),
      },
      {
        name: 'magic_numbers',
        severity: 'low',
        detector: this.detectMagicNumbers.bind(this),
      },
    ];
  }

  async analyzeProject(projectPath: string, depth: string): Promise<AnalysisResult> {
    logger.info(`Starting project analysis: ${projectPath}`);
    
    const startTime = Date.now();
    const files = await this.loadProjectFiles(projectPath);
    const issues: any[] = [];
    const metrics: CodeMetrics = {
      totalFiles: files.length,
      totalLines: 0,
      totalFunctions: 0,
      averageComplexity: 0,
      duplicateCodeRatio: 0,
    };

    for (const file of files) {
      try {
        const sourceFile = this.project.addSourceFileAtPath(file);
        const fileIssues = await this.analyzeFile(sourceFile, depth);
        issues.push(...fileIssues);
        
        // Update metrics
        metrics.totalLines += sourceFile.getEndLineNumber();
        metrics.totalFunctions += this.countFunctions(sourceFile);
      } catch (error) {
        logger.error(`Failed to analyze file: ${file}`, error);
      }
    }

    // Calculate duplicate code ratio
    const duplicates = await this.detectDuplicates(projectPath, 0.8);
    metrics.duplicateCodeRatio = duplicates.totalDuplicateLines / metrics.totalLines;

    const analysisTime = Date.now() - startTime;

    return {
      projectPath,
      timestamp: new Date().toISOString(),
      analysisTime,
      metrics,
      issues,
      summary: this.generateSummary(issues, metrics),
    };
  }

  private async loadProjectFiles(projectPath: string): Promise<string[]> {
    const patterns = [
      '**/*.ts',
      '**/*.tsx',
      '**/*.js',
      '**/*.jsx',
    ];
    
    const ignorePatterns = [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.next/**',
      '**/coverage/**',
    ];

    const files: string[] = [];
    
    for (const pattern of patterns) {
      const matches = await glob(pattern, {
        cwd: projectPath,
        ignore: ignorePatterns,
        absolute: true,
      });
      files.push(...matches);
    }

    return files;
  }

  private async analyzeFile(sourceFile: SourceFile, depth: string): Promise<any[]> {
    const issues: any[] = [];

    for (const pattern of this.wastePatterns) {
      if (depth === 'quick' && pattern.severity === 'low') continue;
      
      const patternIssues = await pattern.detector(sourceFile);
      issues.push(...patternIssues);
    }

    return issues;
  }

  private detectUnusedVariables(sourceFile: SourceFile): any[] {
    const issues: any[] = [];
    const variableDeclarations = sourceFile.getDescendantsOfKind(SyntaxKind.VariableDeclaration);

    for (const variable of variableDeclarations) {
      const identifier = variable.getNameNode();
      if (Node.isIdentifier(identifier)) {
        const references = identifier.findReferencesAsNodes();
        if (references.length === 1) { // Only the declaration itself
          issues.push({
            type: 'unused_variable',
            severity: 'medium',
            file: sourceFile.getFilePath(),
            line: variable.getStartLineNumber(),
            column: variable.getStartLinePos(),
            message: `Unused variable: ${identifier.getText()}`,
            code: variable.getText(),
          });
        }
      }
    }

    return issues;
  }

  private detectDeadCode(sourceFile: SourceFile): any[] {
    const issues: any[] = [];
    
    // Detect unreachable code after return statements
    sourceFile.forEachDescendant((node) => {
      if (Node.isReturnStatement(node)) {
        const parent = node.getParent();
        if (Node.isBlock(parent)) {
          const siblings = parent.getStatements();
          const nodeIndex = siblings.indexOf(node as any);
          
          for (let i = nodeIndex + 1; i < siblings.length; i++) {
            issues.push({
              type: 'dead_code',
              severity: 'high',
              file: sourceFile.getFilePath(),
              line: siblings[i].getStartLineNumber(),
              message: 'Unreachable code detected',
              code: siblings[i].getText(),
            });
          }
        }
      }
    });

    return issues;
  }

  private detectComplexFunctions(sourceFile: SourceFile): any[] {
    const issues: any[] = [];
    const functions = sourceFile.getFunctions();
    const methods = sourceFile.getDescendantsOfKind(SyntaxKind.MethodDeclaration);

    const allFunctions = [...functions, ...methods];

    for (const func of allFunctions) {
      const complexity = this.calculateCyclomaticComplexity(func);
      if (complexity > 10) {
        issues.push({
          type: 'complex_function',
          severity: 'medium',
          file: sourceFile.getFilePath(),
          line: func.getStartLineNumber(),
          message: `Function has high cyclomatic complexity: ${complexity}`,
          functionName: func.getName() || 'anonymous',
          complexity,
        });
      }
    }

    return issues;
  }

  private detectDuplicateImports(sourceFile: SourceFile): any[] {
    const issues: any[] = [];
    const imports = sourceFile.getImportDeclarations();
    const importMap = new Map<string, any[]>();

    for (const imp of imports) {
      const moduleSpecifier = imp.getModuleSpecifierValue();
      if (!importMap.has(moduleSpecifier)) {
        importMap.set(moduleSpecifier, []);
      }
      importMap.get(moduleSpecifier)!.push(imp);
    }

    for (const [module, imports] of importMap) {
      if (imports.length > 1) {
        issues.push({
          type: 'duplicate_imports',
          severity: 'low',
          file: sourceFile.getFilePath(),
          line: imports[1].getStartLineNumber(),
          message: `Duplicate import from module: ${module}`,
          count: imports.length,
        });
      }
    }

    return issues;
  }

  private detectConsoleLogs(sourceFile: SourceFile): any[] {
    const issues: any[] = [];
    
    sourceFile.forEachDescendant((node) => {
      if (Node.isCallExpression(node)) {
        const expression = node.getExpression();
        if (expression.getText().startsWith('console.')) {
          issues.push({
            type: 'console_log',
            severity: 'low',
            file: sourceFile.getFilePath(),
            line: node.getStartLineNumber(),
            message: 'Console statement found in production code',
            code: node.getText(),
          });
        }
      }
    });

    return issues;
  }

  private detectLongFunctions(sourceFile: SourceFile): any[] {
    const issues: any[] = [];
    const functions = sourceFile.getFunctions();
    const methods = sourceFile.getDescendantsOfKind(SyntaxKind.MethodDeclaration);

    const allFunctions = [...functions, ...methods];

    for (const func of allFunctions) {
      const lineCount = func.getEndLineNumber() - func.getStartLineNumber();
      if (lineCount > 50) {
        issues.push({
          type: 'long_function',
          severity: 'medium',
          file: sourceFile.getFilePath(),
          line: func.getStartLineNumber(),
          message: `Function is too long: ${lineCount} lines`,
          functionName: func.getName() || 'anonymous',
          lineCount,
        });
      }
    }

    return issues;
  }

  private detectNestedCallbacks(sourceFile: SourceFile): any[] {
    const issues: any[] = [];
    
    sourceFile.forEachDescendant((node) => {
      if (Node.isFunctionExpression(node) || Node.isArrowFunction(node)) {
        let depth = 0;
        let parent: Node | undefined = node.getParent();
        
        while (parent) {
          if (Node.isFunctionExpression(parent) || Node.isArrowFunction(parent)) {
            depth++;
          }
          parent = parent.getParent();
        }
        
        if (depth >= 3) {
          issues.push({
            type: 'nested_callbacks',
            severity: 'high',
            file: sourceFile.getFilePath(),
            line: node.getStartLineNumber(),
            message: `Deeply nested callbacks detected (depth: ${depth})`,
            depth,
          });
        }
      }
    });

    return issues;
  }

  private detectMagicNumbers(sourceFile: SourceFile): any[] {
    const issues: any[] = [];
    
    sourceFile.forEachDescendant((node) => {
      if (Node.isNumericLiteral(node)) {
        const value = node.getLiteralValue();
        const parent = node.getParent();
        
        // Skip common acceptable magic numbers
        if (value === 0 || value === 1 || value === -1) return;
        
        // Skip if it's part of a const declaration
        if (parent && Node.isVariableDeclaration(parent)) return;
        
        issues.push({
          type: 'magic_number',
          severity: 'low',
          file: sourceFile.getFilePath(),
          line: node.getStartLineNumber(),
          message: `Magic number detected: ${value}`,
          value,
        });
      }
    });

    return issues;
  }

  private calculateCyclomaticComplexity(node: Node): number {
    let complexity = 1;
    
    node.forEachDescendant((child) => {
      switch (child.getKind()) {
        case SyntaxKind.IfStatement:
        case SyntaxKind.ConditionalExpression:
        case SyntaxKind.WhileStatement:
        case SyntaxKind.ForStatement:
        case SyntaxKind.ForInStatement:
        case SyntaxKind.ForOfStatement:
        case SyntaxKind.CaseClause:
          complexity++;
          break;
        case SyntaxKind.BinaryExpression:
          const op = (child as any).getOperatorToken().getText();
          if (op === '&&' || op === '||') {
            complexity++;
          }
          break;
      }
    });
    
    return complexity;
  }

  private countFunctions(sourceFile: SourceFile): number {
    const functions = sourceFile.getFunctions();
    const methods = sourceFile.getDescendantsOfKind(SyntaxKind.MethodDeclaration);
    const arrows = sourceFile.getDescendantsOfKind(SyntaxKind.ArrowFunction);
    
    return functions.length + methods.length + arrows.length;
  }

  async detectDuplicates(projectPath: string, _threshold: number): Promise<DuplicateCode> {
    // Simplified duplicate detection - in production, use more sophisticated algorithms
    const files = await this.loadProjectFiles(projectPath);
    const codeBlocks = new Map<string, { file: string; line: number }[]>();
    let totalDuplicateLines = 0;

    for (const file of files) {
      try {
        const content = await fs.readFile(file, 'utf-8');
        const lines = content.split('\n');
        
        for (let i = 0; i < lines.length - 5; i++) {
          const block = lines.slice(i, i + 5).join('\n').trim();
          if (block.length < 50) continue; // Skip small blocks
          
          if (!codeBlocks.has(block)) {
            codeBlocks.set(block, []);
          }
          codeBlocks.get(block)!.push({ file, line: i + 1 });
        }
      } catch (error) {
        logger.error(`Failed to read file for duplicate detection: ${file}`, error);
      }
    }

    const duplicates: any[] = [];
    
    for (const [block, locations] of codeBlocks) {
      if (locations.length > 1) {
        duplicates.push({
          code: block,
          locations,
          count: locations.length,
        });
        totalDuplicateLines += 5 * (locations.length - 1);
      }
    }

    return {
      totalDuplicateLines,
      duplicates: duplicates.slice(0, 20), // Limit to top 20
    };
  }

  async checkPerformance(options: { filePath: string; includeAsyncPatterns: boolean }): Promise<any> {
    const sourceFile = this.project.addSourceFileAtPath(options.filePath);
    const issues: any[] = [];

    // Check for performance anti-patterns
    sourceFile.forEachDescendant((node) => {
      // Array operations in loops
      if (Node.isForStatement(node) || Node.isWhileStatement(node)) {
        const body = (node as any).getStatement();
        if (body) {
          body.forEachDescendant((child: Node) => {
            if (Node.isCallExpression(child)) {
              const text = child.getText();
              if (text.includes('.push(') || text.includes('.unshift(')) {
                issues.push({
                  type: 'array_operation_in_loop',
                  line: child.getStartLineNumber(),
                  message: 'Array operation in loop - consider bulk operations',
                  suggestion: 'Collect items and use concat/spread after loop',
                });
              }
            }
          });
        }
      }

      // Async patterns
      if (options.includeAsyncPatterns && Node.isCallExpression(node)) {
        const text = node.getText();
        if (text.includes('await') && Node.isForStatement(node.getParent())) {
          issues.push({
            type: 'await_in_loop',
            line: node.getStartLineNumber(),
            message: 'Await in loop - consider Promise.all',
            suggestion: 'Use Promise.all for parallel execution',
          });
        }
      }
    });

    return {
      filePath: options.filePath,
      performanceIssues: issues,
    };
  }

  private generateSummary(issues: any[], metrics: CodeMetrics): string {
    const issueCounts = issues.reduce((acc, issue) => {
      acc[issue.type] = (acc[issue.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const summary = {
      totalIssues: issues.length,
      criticalIssues: issues.filter(i => i.severity === 'high').length,
      issueCounts,
      codeQualityScore: this.calculateQualityScore(issues, metrics),
      recommendations: this.generateRecommendations(issueCounts, metrics),
    };

    return JSON.stringify(summary, null, 2);
  }

  private calculateQualityScore(issues: any[], _metrics: CodeMetrics): number {
    const severityWeights = { high: 10, medium: 5, low: 1 };
    const totalWeight = issues.reduce((sum, issue) => 
      sum + (severityWeights[issue.severity as keyof typeof severityWeights] || 0), 0
    );
    
    const baseScore = 100;
    const deduction = Math.min(totalWeight * 0.5, 80);
    
    return Math.max(baseScore - deduction, 20);
  }

  private generateRecommendations(issueCounts: Record<string, number>, _metrics: CodeMetrics): string[] {
    const recommendations: string[] = [];

    if (issueCounts.complex_function > 5) {
      recommendations.push('Consider breaking down complex functions into smaller, more manageable pieces');
    }

    if (issueCounts.long_function > 3) {
      recommendations.push('Refactor long functions to improve readability and maintainability');
    }

    if (_metrics.duplicateCodeRatio > 0.1) {
      recommendations.push('Extract common code patterns into reusable functions or modules');
    }

    if (issueCounts.nested_callbacks > 0) {
      recommendations.push('Replace nested callbacks with async/await or promises');
    }

    if (issueCounts.console_log > 10) {
      recommendations.push('Implement proper logging system instead of console statements');
    }

    return recommendations;
  }
}