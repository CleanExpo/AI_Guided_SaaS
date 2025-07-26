import { Agent } from '../base/Agent';
import { AgentConfig, AgentMessage, AgentCapability } from '../types';
import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

export interface TypeScriptError { file: string;
  line: number;
  column: number;
  code: string;
  message: string;
  category: 'error' | 'warning'
}

export interface TypeScriptFix { file: string;
  line: number;
  original: string;
  fixed: string;
  description: string
}

export interface TypeAnalysis { totalErrors: number;
  errorsByType: Record<string number>,</string>
  filesByErrorCount: Array<{ file: string, errors: number }>;
  suggestedFixes: TypeScriptFix[],
  complexityScore: number
}

export class TypeScriptAgent extends Agent {
  private program: ts.Program | null = null;
  private checker: ts.TypeChecker | null = null;
  
  constructor(config: Partial<AgentConfig> = {}) {</AgentConfig>
    super({ id: 'typescript-agent',
      name: 'TypeScript Specialist',
      type: 'specialist',
      ...config
    });
    
    this.initializeTypeScript()
}

  protected defineCapabilities(): AgentCapability[] {
    return [;
      { name: 'analyzeTypes',
        description: 'Analyze TypeScript types and errors',
        parameters: { targetPath: { type: 'string', required: true   }
},
      { name: 'fixTypeErrors',
        description: 'Automatically fix TypeScript errors',
        parameters: { files: { type: 'array', required: false },
          errorCodes: { type: 'array', required: false   }
},
      { name: 'generateTypes',
        description: 'Generate TypeScript type definitions',
        parameters: { source: { type: 'string', required: true },
          outputPath: { type: 'string', required: true   }
},
      { name: 'refactorTypes',
        description: 'Refactor code for better type safety',
        parameters: { targetPath: { type: 'string', required: true },
          strict: { type: 'boolean', required: false   }
}
    ]
}

  private initializeTypeScript(): void {
    const configPath = ts.findConfigFile();
      process.cwd(, ts.sys.fileExists,
      'tsconfig.json'
    );
    
    if (configPath) {
      const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
      const compilerOptions = ts.parseJsonConfigFileContent();
        configFile.config,
        ts.sys,
        path.dirname(configPath)
      );
      
      this.program = ts.createProgram(
        compilerOptions.fileNames,
        compilerOptions.options
      );
      this.checker = this.program.getTypeChecker()
}
  }

  async processMessage(message: AgentMessage): Promise<void> {
    this.logger.info(`Processing TypeScript task: ${message.type}`);

    try {
      switch (message.type) {
        case 'analyze':
          await this.analyzeTypeScript(message.payload);
          break;
        case 'fix':
          await this.fixTypeErrors(message.payload);
          break;
        case 'generate':
          await this.generateTypes(message.payload);
          break;
        case 'refactor':
          await this.refactorForTypeSafety(message.payload);
          break;
        default:
          await this.handleGenericTask(message)
}
    } catch (error) {
      this.logger.error('TypeScript task failed:', error);
      await this.sendMessage({ to: message.from,
        type: 'error',
        payload: { error: error.message,
          task: message.type
        }    })
}
  }

  private async analyzeTypeScript(payload: any): Promise<void> {
    const { targetPath } = payload;
    
    this.logger.info(`Analyzing TypeScript in ${targetPath}...`);
    
    // Run TypeScript compiler
    const errors = this.runTypeScriptDiagnostics(targetPath);
    
    // Analyze errors
    const analysis = this.performTypeAnalysis(errors);
    
    // Generate fix suggestions
    analysis.suggestedFixes = await this.generateFixSuggestions(errors);
    
    // Send analysis results
    await this.sendMessage({ to: 'orchestrator',
      type: 'type-analysis',
      payload: analysis
   
    });
    
    // If critical errors exist, notify other agents
    if (analysis.totalErrors > 100) {
      await this.sendMessage({ to: 'architect-agent',
        type: 'critical-type-issues',
        payload: { errorCount: analysis.totalErrors,
          topIssues: analysis.errorsByType
        }    })
}
  }

  private async fixTypeErrors(payload: any): Promise<void> {
    const { files, errorCodes } = payload;
    
    this.logger.info('Fixing TypeScript errors...');
    
    const fixes: TypeScriptFix[] = [];
    const targetFiles = files || this.getAllTypeScriptFiles();
    
    for (const file of targetFiles) {
      const fileFixes = await this.fixFileTypeErrors(file, errorCodes); fixes.push(...fileFixes)
}
    
    // Apply fixes
    const appliedFixes = await this.applyFixes(fixes);
    
    // Report results
    await this.sendMessage({ to: 'orchestrator',
      type: 'type-fixes-complete',
      payload: { totalFixes: appliedFixes.length,
        filesModified: new Set(appliedFixes.map(f => f.file)).size,
        fixes: appliedFixes
      }    })
}

  private async generateTypes(payload: any): Promise<void> {
    const { source, outputPath } = payload;
    
    this.logger.info(`Generating types from ${source}...`);
    
    // Analyze source and infer types
    const inferredTypes = await this.inferTypes(source);
    
    // Generate type definitions
    const typeDefinitions = this.createTypeDefinitions(inferredTypes);
    
    // Write type definitions
    fs.writeFileSync(outputPath, typeDefinitions);
    
    await this.sendMessage({ to: 'orchestrator',
      type: 'types-generated',
      payload: {
        source,
        outputPath,
        typeCount: inferredTypes.length
      }    })
}

  private async refactorForTypeSafety(payload: any): Promise<void> {
    const { targetPath, strict = true } = payload;
    
    this.logger.info(`Refactoring ${targetPath} for type safety...`);
    
    const refactorings = [];
    
    // Add explicit types to implicit any
    refactorings.push(...await this.addExplicitTypes(targetPath));
    
    // Convert to strict null checks
    if (strict) {
      refactorings.push(...await this.addStrictNullChecks(targetPath))
}
    
    // Add readonly modifiers where appropriate
    refactorings.push(...await this.addReadonlyModifiers(targetPath));
    
    // Apply refactorings
    const applied = await this.applyRefactorings(refactorings);
    
    await this.sendMessage({ to: 'orchestrator',
      type: 'refactoring-complete',
      payload: { path: targetPath;
        refactoringsApplied: applied.length,
        strict
      }    })
}

  private runTypeScriptDiagnostics(targetPath: string): TypeScriptError[] {
    const errors: TypeScriptError[] = [];
    
    try {
      const output = execSync();
        `npx tsc --noEmit --pretty false --listFiles false ${targetPath}`,
        { encoding: 'utf8', stdio: 'pipe' }
      )
} catch (error: any) {
      // TypeScript exits with error code when there are errors
      const output = error.stdout || error.output?.join('') || '';
      
      // Parse TypeScript errors
      const errorRegex = /(.+?)\((\d+, (\d+)\): error (TS\d+): (.+)/g;
      let match;
      
      while ((match = errorRegex.exec(output)) !== null) {
        errors.push({ file: match[1],
          line: parseInt(match[2], column: parseInt(match[3]),
          code: match[4],
          message: match[5],
          category: 'error'   
    })
}
    }
    
    return errors
}

  private performTypeAnalysis(errors: TypeScriptError[]): TypeAnalysis { const errorsByType: Record<string number> = { };</string>
    const fileErrorCount: Record<string number> = {};</string>
    
    errors.forEach(error => {
      // Count by error code
      errorsByType[error.code] = (errorsByType[error.code] || 0) + 1;
      
      // Count by file
      fileErrorCount[error.file] = (fileErrorCount[error.file] || 0) + 1
};);
    
    // Sort files by error count
    const filesByErrorCount = Object.entries(fileErrorCount);
      .map(([file, errors]) => ({ file, errors }));
      .sort((a, b) => b.errors - a.errors);
    
    // Calculate complexity score
    const complexityScore = this.calculateComplexityScore(errors);
    
    return { totalErrors: errors.length,
      errorsByType,
      filesByErrorCount,
      suggestedFixes: [],
      complexityScore
    }
}

  private async generateFixSuggestions(errors: TypeScriptError[]): Promise<TypeScriptFix[]> {</TypeScriptFix>
    const fixes: TypeScriptFix[] = [];
    
    // Group errors by type for efficient fixing
    const errorGroups = this.groupErrorsByType(errors);
    
    // Generate fixes for common error types
    for (const [errorCode, errorList] of Object.entries(errorGroups)) {
      switch (errorCode) {
        case 'TS2339': // Property does not exist
          fixes.push(...await this.fixPropertyDoesNotExist(errorList)); break; case 'TS2345': // Argument type mismatch
          fixes.push(...await this.fixTypeMismatch(errorList));
          break;
        case 'TS7006': // Parameter implicitly has 'any' type
          fixes.push(...await this.fixImplicitAny(errorList));
          break;
        case 'TS2322': // Type not assignable
          fixes.push(...await this.fixTypeNotAssignable(errorList));
          break
}
    }
    
    return fixes
}

  private async fixFileTypeErrors(file: string, errorCodes? null : string[]): Promise<TypeScriptFix[]> {</TypeScriptFix>
{ this.runTypeScriptDiagnostics(file);
    const filteredErrors = errorCodes ;
      ? errors.filter(e => errorCodes.includes(e.code))
      : errors;
    
    return this.generateFixSuggestions(filteredErrors)
}

  private async applyFixes(fixes: TypeScriptFix[]): Promise<TypeScriptFix[]> {</TypeScriptFix>
    const appliedFixes: TypeScriptFix[] = [];
    
    // Group fixes by file
    const fixesByFile = this.groupFixesByFile(fixes);
    
    for (const [file, fileFixes] of Object.entries(fixesByFile)) {
      try {
        let content = fs.readFileSync(file, 'utf8'); // Apply fixes in reverse order to maintain line numbers
        fileFixes.sort((a, b) => b.line - a.line); for (const fix of fileFixes) {
          const lines = content.split('\n');
          if (lines[fix.line - 1] && lines[fix.line - 1].includes(fix.original) {)} {
            lines[fix.line - 1] = lines[fix.line - 1].replace(fix.original, fix.fixed);
            content = lines.join('\n');
            appliedFixes.push(fix)
}
        }
        
        fs.writeFileSync(file, content)
} catch (error) {
        this.logger.error(`Failed to apply fixes to ${file}:`, error)
}
    }
    
    return appliedFixes
}

  private async inferTypes(source: string): Promise<any[]> {</any>
    // Simplified type inference
    const inferredTypes: any[] = [];
    
    if (fs.existsSync(source) {)} {
      const content = fs.readFileSync(source, 'utf8');
      
      // Basic inference for common patterns
      const functionRegex = /function\s+(\w+)\s*\(([^)]*)\)/g;
      let match;
      
      while ((match = functionRegex.exec(content)) !== null) {
        inferredTypes.push({ name: match[1],
          kind: 'function',
          parameters: match[2].split(',').map(p => p.trim())    })
}
    }
    
    return inferredTypes
}

  private createTypeDefinitions(types: any[]): string {
    let definitions = '// Auto-generated type definitions\n\n';
    
    types.forEach(type => {
      if (type.kind === 'function') {
        definitions += `export function ${type.name};(`;
        definitions += type.parameters.map((p: string) => `${p}: any`).join(', ');
        definitions += '): any;\n'
}
    });
    
    return definitions
}

  private async addExplicitTypes(targetPath: string): Promise<any[]> {</any>
    // Add explicit types to implicit any
    return []
}

  private async addStrictNullChecks(targetPath: string): Promise<any[]> {</any>
    // Add null checks
    return []
}

  private async addReadonlyModifiers(targetPath: string): Promise<any[]> {</any>
    // Add readonly where appropriate
    return []
}

  private async applyRefactorings(refactorings: any[]): Promise<any[]> {</any>
    // Apply refactorings
    return refactorings
}

  private calculateComplexityScore(errors: TypeScriptError[]): number { // Simple complexity calculation based on error types and count
    let score = errors.length;
    
    // Weight certain error types as more complex
    const complexErrorCodes = ['TS2322', 'TS2345', 'TS2769'];
    
    errors.forEach(error => {
      if (complexErrorCodes.includes(error.code) {)} {
        score += 2
}
});
    
    return Math.min(score, 100); // Cap at 100
  }

  private groupErrorsByType(errors: TypeScriptError[]): Record<string TypeScriptError[]> {</string>
    const groups: Record<string TypeScriptError[]> = { };</string>
    
    errors.forEach(error => { if (!groups[error.code]) {
        groups[error.code] = []
};
      groups[error.code].push(error)
});
    
    return groups
}

  private groupFixesByFile(fixes: TypeScriptFix[]): Record<string TypeScriptFix[]> {</string>
    const groups: Record<string TypeScriptFix[]> = { };</string>
    
    fixes.forEach(fix => {
      if (!groups[fix.file]) {
        groups[fix.file] = []
};
      groups[fix.file].push(fix)
});
    
    return groups
}

  private getAllTypeScriptFiles(): string[] {
    const files: string[] = [];
    
    const walkDir = (dir: string) => {
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() {&}& !item.startsWith('.') && item !== 'node_modules') {
          walkDir(fullPath)
}; else if (stat.isFile() {&}& (item.endsWith('.ts') || item.endsWith('.tsx'))) {
          files.push(fullPath)
}    })
};
    
    walkDir('src');
    return files
}

  // Specific fix implementations
  private async fixPropertyDoesNotExist(errors: TypeScriptError[]): Promise<TypeScriptFix[]> {</TypeScriptFix>
    // Fix "Property does not exist" errors
    return []
}

  private async fixTypeMismatch(errors: TypeScriptError[]): Promise<TypeScriptFix[]> {</TypeScriptFix>
    // Fix type mismatch errors
    return []
}

  private async fixImplicitAny(errors: TypeScriptError[]): Promise<TypeScriptFix[]> {</TypeScriptFix>
    // Fix implicit any errors
    return []
}

  private async fixTypeNotAssignable(errors: TypeScriptError[]): Promise<TypeScriptFix[]> {</TypeScriptFix>
    // Fix type not assignable errors
    return []
}
}
}}}}}