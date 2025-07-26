import { Project, SourceFile, Node, SyntaxKind, VariableDeclarationKind } from 'ts-morph';
import { logger } from './utils/logger.js';
import { RefactoringOptions, RefactoringResult, OptimizationOptions } from './types.js';

export class RefactoringEngine {
  private project: Project;
  private elitePatterns: Map<string, (node: Node) => Node | null> = new Map();

  constructor() {
    this.project = new Project({
      compilerOptions: {
        target: 99, // Latest ES
        lib: ['esnext', 'dom'],
        jsx: 'react' as any,
        allowJs: true,
      },
    });
    this.initializeElitePatterns();
  }

  private initializeElitePatterns() {
    this.elitePatterns = new Map([
      ['callback_to_async', this.convertCallbackToAsync.bind(this)],
      ['for_to_functional', this.convertForToFunctional.bind(this)],
      ['optimize_conditionals', this.optimizeConditionals.bind(this)],
      ['extract_constants', this.extractMagicNumbers.bind(this)],
      ['simplify_returns', this.simplifyReturns.bind(this)],
      ['remove_redundancy', this.removeRedundantCode.bind(this)],
    ]);
  }

  async refactor(options: RefactoringOptions): Promise<RefactoringResult> {
    logger.info(`Starting refactoring: ${options.filePath}`);
    
    const sourceFile = this.project.addSourceFileAtPath(options.filePath);
    const originalContent = sourceFile.getFullText();
    const changes: any[] = [];

    try {
      switch (options.scope) {
        case 'file':
          await this.refactorFile(sourceFile, changes);
          break;
        case 'function':
          await this.refactorFunction(sourceFile, options.targetName, changes);
          break;
        case 'class':
          await this.refactorClass(sourceFile, options.targetName, changes);
          break;
        case 'module':
          await this.refactorModule(sourceFile, changes);
          break;
      }

      // Apply elite patterns
      for (const [patternName, patternFunc] of this.elitePatterns) {
        this.applyPattern(sourceFile, patternName, patternFunc, changes);
      }

      // Save changes
      await sourceFile.save();

      const newContent = sourceFile.getFullText();
      const metrics = this.calculateRefactoringMetrics(originalContent, newContent);

      return {
        success: true,
        filePath: options.filePath,
        changes,
        metrics,
      };
    } catch (error) {
      logger.error('Refactoring failed:', error);
      return {
        success: false,
        filePath: options.filePath,
        changes: [],
        metrics: { linesRemoved: 0, linesAdded: 0, complexityReduction: 0 },
      };
    }
  }

  private async refactorFile(sourceFile: SourceFile, changes: any[]) {
    // Remove unused imports
    this.removeUnusedImports(sourceFile, changes);
    
    // Convert var to let/const
    this.modernizeVariableDeclarations(sourceFile, changes);
    
    // Optimize function declarations
    this.optimizeFunctions(sourceFile, changes);
    
    // Remove dead code
    this.removeDeadCode(sourceFile, changes);
  }

  private async refactorFunction(sourceFile: SourceFile, targetName: string | undefined, changes: any[]) {
    const functions = sourceFile.getFunctions();
    const methods = sourceFile.getDescendantsOfKind(SyntaxKind.MethodDeclaration);
    
    const targetFunc = [...functions, ...methods].find(f => 
      f.getName() === targetName || (!targetName && true)
    );

    if (targetFunc) {
      this.optimizeSingleFunction(targetFunc, changes);
    }
  }

  private async refactorClass(sourceFile: SourceFile, targetName: string | undefined, changes: any[]) {
    const classes = sourceFile.getClasses();
    const targetClass = classes.find(c => 
      c.getName() === targetName || (!targetName && true)
    );

    if (targetClass) {
      this.optimizeClass(targetClass, changes);
    }
  }

  private async refactorModule(sourceFile: SourceFile, changes: any[]) {
    // Module-level optimizations
    this.consolidateExports(sourceFile, changes);
    this.optimizeModuleStructure(sourceFile, changes);
  }

  private removeUnusedImports(sourceFile: SourceFile, changes: any[]) {
    const imports = sourceFile.getImportDeclarations();
    
    for (const importDecl of imports) {
      const namedImports = importDecl.getNamedImports();
      const unusedImports: any[] = [];
      
      for (const namedImport of namedImports) {
        const identifier = namedImport.getNameNode();
        const references = identifier.findReferencesAsNodes();
        
        if (references.length === 1) {
          unusedImports.push(namedImport);
        }
      }
      
      if (unusedImports.length === namedImports.length) {
        const before = importDecl.getText();
        importDecl.remove();
        changes.push({
          type: 'remove_import',
          before,
          after: '',
          line: importDecl.getStartLineNumber(),
          impact: 'Removed unused import',
        });
      } else if (unusedImports.length > 0) {
        const before = importDecl.getText();
        unusedImports.forEach(imp => imp.remove());
        changes.push({
          type: 'optimize_import',
          before,
          after: importDecl.getText(),
          line: importDecl.getStartLineNumber(),
          impact: `Removed ${unusedImports.length} unused imports`,
        });
      }
    }
  }

  private modernizeVariableDeclarations(sourceFile: SourceFile, changes: any[]) {
    const varDeclarations = sourceFile.getDescendantsOfKind(SyntaxKind.VariableStatement);
    
    for (const varStatement of varDeclarations) {
      const declarationList = varStatement.getDeclarationList();
      if (declarationList.getDeclarationKind() === VariableDeclarationKind.Var) {
        const before = varStatement.getText();
        
        // Analyze if it should be const or let
        const declarations = declarationList.getDeclarations();
        let useConst = true;
        
        for (const decl of declarations) {
          const identifier = decl.getNameNode();
          if (Node.isIdentifier(identifier)) {
            const refs = identifier.findReferencesAsNodes();
            const hasReassignment = refs.some(ref => {
              const parent = ref.getParent();
              return !!(parent && parent.getKindName() === 'BinaryExpression' && (parent as any).getOperatorToken().getText() === '=');
            });
            
            if (hasReassignment) {
              useConst = false;
              break;
            }
          }
        }
        
        declarationList.setDeclarationKind(
          useConst ? VariableDeclarationKind.Const : VariableDeclarationKind.Let
        );
        
        changes.push({
          type: 'modernize_variable',
          before,
          after: varStatement.getText(),
          line: varStatement.getStartLineNumber(),
          impact: `Converted var to ${useConst ? 'const' : 'let'}`,
        });
      }
    }
  }

  private optimizeFunctions(sourceFile: SourceFile, changes: any[]) {
    const functions = sourceFile.getFunctions();
    const methods = sourceFile.getDescendantsOfKind(SyntaxKind.MethodDeclaration);
    
    [...functions, ...methods].forEach(func => {
      this.optimizeSingleFunction(func, changes);
    });
  }

  private optimizeSingleFunction(func: any, changes: any[]) {
    // Early return optimization
    this.applyEarlyReturns(func, changes);
    
    // Remove unnecessary else blocks
    this.removeUnnecessaryElse(func, changes);
    
    // Inline single-use variables
    this.inlineSingleUseVariables(func, changes);
  }

  private applyEarlyReturns(func: any, changes: any[]) {
    const body = func.getBody();
    if (!Node.isBlock(body)) return;
    
    const statements = body.getStatements();
    if (statements.length === 0) return;
    
    // Look for if statements that wrap most of the function
    const firstStatement = statements[0];
    if (Node.isIfStatement(firstStatement)) {
      const thenStatement = firstStatement.getThenStatement();
      if (Node.isBlock(thenStatement) && statements.length === 1) {
        const condition = (firstStatement as any).getCondition();
        const before = func.getText();
        
        // Invert condition and use early return
        const invertedCondition = `!(${condition.getText()})`;
        const earlyReturn = `if (${invertedCondition}) return;`;
        
        const newStatements = [earlyReturn, ...thenStatement.getStatements().map(s => s.getText())];
        body.removeText();
        body.addStatements(newStatements);
        
        changes.push({
          type: 'early_return',
          before: before.substring(0, 100) + '...',
          after: func.getText().substring(0, 100) + '...',
          line: func.getStartLineNumber(),
          impact: 'Applied early return pattern',
        });
      }
    }
  }

  private removeUnnecessaryElse(func: any, changes: any[]) {
    func.forEachDescendant((node: Node) => {
      if (Node.isIfStatement(node)) {
        const thenStatement = node.getThenStatement();
        const elseStatement = node.getElseStatement();
        
        if (elseStatement && this.endsWithReturn(thenStatement)) {
          const before = node.getText();
          
          // Remove else keyword and de-indent
          const elseContent = Node.isBlock(elseStatement) 
            ? elseStatement.getStatements().map(s => s.getText()).join('\n')
            : elseStatement.getText();
          
          const parent = node.getParent();
          if (Node.isBlock(parent)) {
            const nodeIndex = parent.getStatements().indexOf(node as any);
            node.replaceWithText(
              `${(node as any).getCondition().getText()} ${thenStatement.getText()}`
            );
            parent.insertStatements(nodeIndex + 1, elseContent);
          }
          
          changes.push({
            type: 'remove_else',
            before: before.substring(0, 50) + '...',
            after: 'Removed unnecessary else block',
            line: node.getStartLineNumber(),
            impact: 'Simplified control flow',
          });
        }
      }
    });
  }

  private endsWithReturn(statement: Node): boolean {
    if (Node.isReturnStatement(statement)) return true;
    
    if (Node.isBlock(statement)) {
      const statements = (statement as any).getStatements();
      return statements.length > 0 && Node.isReturnStatement(statements[statements.length - 1]);
    }
    
    return false;
  }

  private inlineSingleUseVariables(func: any, changes: any[]) {
    const body = func.getBody();
    if (!Node.isBlock(body)) return;
    
    const variableStatements = body.getDescendantsOfKind(SyntaxKind.VariableStatement);
    
    for (const varStatement of variableStatements) {
      const declarations = varStatement.getDeclarationList().getDeclarations();
      
      for (const decl of declarations) {
        const identifier = decl.getNameNode();
        const initializer = decl.getInitializer();
        
        if (Node.isIdentifier(identifier) && initializer) {
          const references = identifier.findReferencesAsNodes();
          
          // Check if variable is used only once and not reassigned
          if (references.length === 2) { // Declaration + one use
            const usage = references.find(ref => ref !== identifier);
            
            if (usage && !this.isReassignment(usage)) {
              const before = varStatement.getText();
              usage.replaceWithText(initializer.getText());
              varStatement.remove();
              
              changes.push({
                type: 'inline_variable',
                before,
                after: `Inlined: ${initializer.getText()}`,
                line: varStatement.getStartLineNumber(),
                impact: 'Removed intermediate variable',
              });
            }
          }
        }
      }
    }
  }

  private isReassignment(node: Node): boolean {
    const parent = node.getParent();
    return !!(parent && parent.getKindName() === 'BinaryExpression' && (parent as any).getOperatorToken().getText() === '=');
  }

  private removeDeadCode(sourceFile: SourceFile, changes: any[]) {
    sourceFile.forEachDescendant((node) => {
      if (Node.isReturnStatement(node)) {
        const parent = node.getParent();
        if (Node.isBlock(parent)) {
          const statements = parent.getStatements();
          const nodeIndex = statements.indexOf(node as any);
          
          // Remove all statements after return
          for (let i = statements.length - 1; i > nodeIndex; i--) {
            const deadStatement = statements[i];
            const before = deadStatement.getText();
            deadStatement.remove();
            
            changes.push({
              type: 'remove_dead_code',
              before,
              after: '',
              line: deadStatement.getStartLineNumber(),
              impact: 'Removed unreachable code',
            });
          }
        }
      }
    });
  }

  private applyPattern(sourceFile: SourceFile, patternName: string, patternFunc: Function, changes: any[]) {
    sourceFile.forEachDescendant((node) => {
      const result = patternFunc(node);
      if (result) {
        changes.push({
          type: `pattern_${patternName}`,
          before: node.getText().substring(0, 50) + '...',
          after: result.getText().substring(0, 50) + '...',
          line: node.getStartLineNumber(),
          impact: `Applied ${patternName} pattern`,
        });
      }
    });
  }

  private convertCallbackToAsync(_node: Node): Node | null {
    // Convert callback patterns to async/await
    if (Node.isCallExpression(_node)) {
      const args = _node.getArguments();
      const lastArg = args[args.length - 1];
      
      if (lastArg && (Node.isFunctionExpression(lastArg) || Node.isArrowFunction(lastArg))) {
        const params = lastArg.getParameters();
        if (params.length >= 2 && params[0].getName() === 'err') {
          // This looks like a Node.js callback pattern
          // Would implement conversion to async/await here
          return null; // Placeholder
        }
      }
    }
    return null;
  }

  private convertForToFunctional(node: Node): Node | null {
    // Convert for loops to functional patterns (map, filter, reduce)
    if (Node.isForStatement(node)) {
      // Analysis and conversion logic would go here
      return null; // Placeholder
    }
    return null;
  }

  private optimizeConditionals(_node: Node): Node | null {
    // Optimize conditional expressions
    if (Node.isConditionalExpression(_node)) {
      const condition = _node.getCondition();
      const whenTrue = _node.getWhenTrue();
      const whenFalse = _node.getWhenFalse();
      
      // Check for boolean literal returns
      if (whenTrue.getText() === 'true' && whenFalse.getText() === 'false') {
        _node.replaceWithText(condition.getText());
        return _node;
      }
      
      if (whenTrue.getText() === 'false' && whenFalse.getText() === 'true') {
        _node.replaceWithText(`!(${condition.getText()})`);
        return _node;
      }
    }
    return null;
  }

  private extractMagicNumbers(node: Node): Node | null {
    // Extract magic numbers to named constants
    if (Node.isNumericLiteral(node)) {
      const value = node.getLiteralValue();
      if (value !== 0 && value !== 1 && value !== -1) {
        // Would implement constant extraction logic here
        return null; // Placeholder
      }
    }
    return null;
  }

  private simplifyReturns(node: Node): Node | null {
    // Simplify return statements
    if (Node.isReturnStatement(node)) {
      const expression = node.getExpression();
      if (expression && Node.isConditionalExpression(expression)) {
        // Could convert to if-else with returns
        return null; // Placeholder
      }
    }
    return null;
  }

  private removeRedundantCode(_node: Node): Node | null {
    // Remove various forms of redundant code
    return null; // Placeholder
  }

  async optimizeImports(options: OptimizationOptions): Promise<any> {
    const { projectPath, removeUnused, sortImports } = options;
    const project = new Project();
    const files = await this.getProjectTypeScriptFiles(projectPath);
    const results: any[] = [];

    for (const filePath of files) {
      try {
        const sourceFile = project.addSourceFileAtPath(filePath);
        const changes: any[] = [];

        if (removeUnused) {
          this.removeUnusedImports(sourceFile, changes);
        }

        if (sortImports) {
          this.sortImportDeclarations(sourceFile, changes);
        }

        if (changes.length > 0) {
          await sourceFile.save();
          results.push({ file: filePath, changes });
        }
      } catch (error) {
        logger.error(`Failed to optimize imports in ${filePath}:`, error);
      }
    }

    return {
      filesProcessed: files.length,
      filesModified: results.length,
      results,
    };
  }

  private sortImportDeclarations(sourceFile: SourceFile, changes: any[]) {
    const imports = sourceFile.getImportDeclarations();
    if (imports.length < 2) return;

    const before = imports.map(i => i.getText()).join('\n');

    // Group imports
    const groups = {
      external: [] as any[],
      absolute: [] as any[],
      relative: [] as any[],
    };

    imports.forEach(imp => {
      const path = imp.getModuleSpecifierValue();
      if (!path.startsWith('.') && !path.startsWith('/')) {
        groups.external.push(imp);
      } else if (path.startsWith('/')) {
        groups.absolute.push(imp);
      } else {
        groups.relative.push(imp);
      }
    });

    // Sort within groups
    Object.values(groups).forEach(group => {
      group.sort((a, b) => a.getModuleSpecifierValue().localeCompare(b.getModuleSpecifierValue()));
    });

    // Reorder imports
    const sortedImports = [...groups.external, ...groups.absolute, ...groups.relative];
    const firstImport = imports[0];
    const lastImport = imports[imports.length - 1];

    if (firstImport && lastImport) {
      const startPos = firstImport.getPos();
      const endPos = lastImport.getEnd();
      
      sourceFile.removeText(startPos, endPos - startPos);
      sourceFile.insertText(startPos, sortedImports.map(i => i.getText()).join('\n'));

      changes.push({
        type: 'sort_imports',
        before: before.substring(0, 100) + '...',
        after: 'Sorted and grouped imports',
        line: firstImport.getStartLineNumber(),
        impact: 'Improved code organization',
      });
    }
  }

  private async getProjectTypeScriptFiles(projectPath: string): Promise<string[]> {
    const { glob } = await import('glob');
    return glob('**/*.{ts,tsx}', {
      cwd: projectPath,
      ignore: ['**/node_modules/**', '**/dist/**', '**/build/**'],
      absolute: true,
    });
  }

  private calculateRefactoringMetrics(originalContent: string, newContent: string): any {
    const originalLines = originalContent.split('\n');
    const newLines = newContent.split('\n');

    return {
      linesRemoved: Math.max(0, originalLines.length - newLines.length),
      linesAdded: Math.max(0, newLines.length - originalLines.length),
      complexityReduction: this.estimateComplexityReduction(originalContent, newContent),
    };
  }

  private estimateComplexityReduction(originalContent: string, newContent: string): number {
    // Simple heuristic: count reduction in control flow keywords
    const controlFlowKeywords = ['if', 'else', 'for', 'while', 'switch', 'case'];
    
    const countKeywords = (content: string) => {
      return controlFlowKeywords.reduce((count, keyword) => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'g');
        return count + (content.match(regex) || []).length;
      }, 0);
    };

    const originalComplexity = countKeywords(originalContent);
    const newComplexity = countKeywords(newContent);
    
    return Math.max(0, originalComplexity - newComplexity);
  }

  private optimizeClass(targetClass: any, changes: any[]) {
    // Remove empty constructor
    const constructor = targetClass.getConstructors()[0];
    if (constructor && constructor.getStatements().length === 0) {
      const before = constructor.getText();
      constructor.remove();
      changes.push({
        type: 'remove_empty_constructor',
        before,
        after: '',
        line: constructor.getStartLineNumber(),
        impact: 'Removed empty constructor',
      });
    }

    // Convert methods to arrow functions where appropriate
    const methods = targetClass.getMethods();
    methods.forEach((method: any) => {
      if (!method.isStatic() && !method.isAsync()) {
        // Check if method uses 'this'
        let usesThis = false;
        method.forEachDescendant((node: Node) => {
          if (Node.isThisExpression(node)) {
            usesThis = true;
          }
        });

        if (!usesThis) {
          // Could convert to static method
          const before = method.getText();
          method.setIsStatic(true);
          changes.push({
            type: 'make_static',
            before: before.substring(0, 50) + '...',
            after: 'Converted to static method',
            line: method.getStartLineNumber(),
            impact: 'Improved performance - no instance binding needed',
          });
        }
      }
    });
  }

  private consolidateExports(sourceFile: SourceFile, changes: any[]) {
    const exports = sourceFile.getExportDeclarations();
    const namedExports: string[] = [];

    // Collect all named exports
    exports.forEach(exp => {
      if (!exp.getModuleSpecifier()) {
        const named = exp.getNamedExports();
        named.forEach(n => {
          namedExports.push(n.getName());
        });
      }
    });

    // If multiple export statements, consolidate
    if (exports.length > 1 && namedExports.length > 0) {
      const before = exports.map(e => e.getText()).join('\n');
      
      // Remove individual exports
      exports.forEach(exp => {
        if (!exp.getModuleSpecifier()) {
          exp.remove();
        }
      });

      // Add consolidated export
      sourceFile.addExportDeclaration({
        namedExports: namedExports,
      });

      changes.push({
        type: 'consolidate_exports',
        before: before.substring(0, 100) + '...',
        after: `export { ${namedExports.join(', ')} }`,
        line: sourceFile.getEndLineNumber(),
        impact: 'Consolidated exports for clarity',
      });
    }
  }

  private optimizeModuleStructure(sourceFile: SourceFile, changes: any[]) {
    // Move imports to top
    const imports = sourceFile.getImportDeclarations();
    if (imports.length > 0) {
      const firstImport = imports[0];
      const firstImportPos = firstImport.getPos();
      
      // Check if there's code before the first import
      const firstStatement = sourceFile.getStatements()[0];
      if (firstStatement && firstStatement !== firstImport && firstStatement.getPos() < firstImportPos) {
        // Move imports to top
        const importTexts = imports.map(i => i.getText());
        imports.forEach(i => i.remove());
        
        sourceFile.insertStatements(0, importTexts);
        
        changes.push({
          type: 'organize_imports',
          before: 'Imports scattered throughout file',
          after: 'Moved all imports to top',
          line: 1,
          impact: 'Improved module structure',
        });
      }
    }
  }
}