import { glob } from 'glob';
import * as fs from 'fs/promises';
import * as path from 'path';
import { parse as parseTypeScript } from '@typescript-eslint/parser';
import * as parser from '@babel/parser';
import { Logger } from '../utils/logger.js';
import { execSync } from 'child_process';

interface BuildError {
  file: string;
  line: number;
  column: number;
  message: string;
  type: 'syntax' | 'typescript' | 'jsx' | 'import' | 'config';
  severity: 'error' | 'warning';
  code?: string;
}

interface BuildDiagnosis {
  errors: BuildError[];
  syntaxErrors: number;
  typeScriptErrors: number;
  jsxErrors: number;
  importErrors: number;
  configErrors: number;
  warnings: number;
  buildCommand?: string;
  buildOutput?: string;
}

export class BuildAnalyzer {
  private logger: Logger;

  constructor() {
    this.logger = new Logger('BuildAnalyzer');
  }

  async analyzeBuild(projectPath: string, options: { includeWarnings?: boolean } = {}): Promise<BuildDiagnosis> {
    this.logger.info('Starting comprehensive build analysis...');

    const errors: BuildError[] = [];
    
    // Run build and capture errors
    const buildErrors = await this.runBuildAndCaptureErrors(projectPath);
    errors.push(...buildErrors);

    // Analyze source files
    const sourceFiles = await this.getSourceFiles(projectPath);
    
    for (const file of sourceFiles) {
      try {
        const content = await fs.readFile(file, 'utf-8');
        const fileErrors = await this.analyzeFile(file, content, options);
        errors.push(...fileErrors);
      } catch (error) {
        this.logger.error(`Failed to analyze ${file}:`, error);
      }
    }

    // Categorize errors
    const diagnosis: BuildDiagnosis = {
      errors: errors.filter(e => options.includeWarnings || e.severity === 'error'),
      syntaxErrors: errors.filter(e => e.type === 'syntax').length,
      typeScriptErrors: errors.filter(e => e.type === 'typescript').length,
      jsxErrors: errors.filter(e => e.type === 'jsx').length,
      importErrors: errors.filter(e => e.type === 'import').length,
      configErrors: errors.filter(e => e.type === 'config').length,
      warnings: errors.filter(e => e.severity === 'warning').length,
    };

    this.logger.info(`Analysis complete: ${diagnosis.errors.length} issues found`);
    return diagnosis;
  }

  async findSyntaxErrors(projectPath: string, files?: string[]): Promise<BuildError[]> {
    const targetFiles = files || await this.getSourceFiles(projectPath);
    const errors: BuildError[] = [];

    for (const file of targetFiles) {
      try {
        const content = await fs.readFile(file, 'utf-8');
        const syntaxErrors = await this.checkSyntax(file, content);
        errors.push(...syntaxErrors);
      } catch (error) {
        this.logger.error(`Syntax check failed for ${file}:`, error);
      }
    }

    return errors;
  }

  async findTypeScriptErrors(projectPath: string): Promise<BuildError[]> {
    const errors: BuildError[] = [];

    try {
      // Run TypeScript compiler
      const output = execSync('npx tsc --noEmit --pretty false', {
        cwd: projectPath,
        encoding: 'utf-8',
      });
    } catch (error: any) {
      const output = error.stdout || error.message;
      const tsErrors = this.parseTypeScriptOutput(output);
      errors.push(...tsErrors);
    }

    return errors;
  }

  async findJSXErrors(projectPath: string): Promise<BuildError[]> {
    const jsxFiles = await glob('**/*.{jsx,tsx}', {
      cwd: projectPath,
      ignore: ['node_modules/**', 'dist/**', 'build/**'],
    });

    const errors: BuildError[] = [];

    for (const file of jsxFiles) {
      const fullPath = path.join(projectPath, file);
      try {
        const content = await fs.readFile(fullPath, 'utf-8');
        const jsxErrors = await this.checkJSXStructure(fullPath, content);
        errors.push(...jsxErrors);
      } catch (error) {
        this.logger.error(`JSX check failed for ${file}:`, error);
      }
    }

    return errors;
  }

  private async runBuildAndCaptureErrors(projectPath: string): Promise<BuildError[]> {
    const errors: BuildError[] = [];

    try {
      execSync('npm run build', {
        cwd: projectPath,
        encoding: 'utf-8',
        stdio: 'pipe',
      });
    } catch (error: any) {
      const output = error.stdout + error.stderr;
      const buildErrors = this.parseBuildOutput(output);
      errors.push(...buildErrors);
    }

    return errors;
  }

  private async getSourceFiles(projectPath: string): Promise<string[]> {
    const files = await glob('**/*.{js,jsx,ts,tsx}', {
      cwd: projectPath,
      ignore: ['node_modules/**', 'dist/**', 'build/**', '.next/**'],
      absolute: true,
    });
    return files;
  }

  private async analyzeFile(file: string, content: string, options: any): Promise<BuildError[]> {
    const errors: BuildError[] = [];
    const ext = path.extname(file);

    // Check syntax
    const syntaxErrors = await this.checkSyntax(file, content);
    errors.push(...syntaxErrors);

    // Check JSX structure
    if (ext === '.jsx' || ext === '.tsx') {
      const jsxErrors = await this.checkJSXStructure(file, content);
      errors.push(...jsxErrors);
    }

    // Check imports
    const importErrors = this.checkImports(file, content);
    errors.push(...importErrors);

    return errors;
  }

  private async checkSyntax(file: string, content: string): Promise<BuildError[]> {
    const errors: BuildError[] = [];
    const ext = path.extname(file);

    try {
      if (ext === '.ts' || ext === '.tsx') {
        parseTypeScript(content, {
          ecmaVersion: 'latest',
          sourceType: 'module',
          ecmaFeatures: {
            jsx: ext === '.tsx',
          },
        });
      } else {
        parser.parse(content, {
          sourceType: 'module',
          plugins: ['jsx', 'typescript', 'decorators-legacy'],
          errorRecovery: true,
        });
      }
    } catch (error: any) {
      errors.push({
        file,
        line: error.loc?.line || 0,
        column: error.loc?.column || 0,
        message: error.message,
        type: 'syntax',
        severity: 'error',
        code: error.code,
      });
    }

    return errors;
  }

  private async checkJSXStructure(file: string, content: string): Promise<BuildError[]> {
    const errors: BuildError[] = [];

    // Check for common JSX issues
    const lines = content.split('\\n');
    
    // Check for duplicate props
    const propRegex = /\\s(\\w+)=/g;
    lines.forEach((line, index) => {
      const props = new Map<string, number>();
      let match;
      while ((match = propRegex.exec(line)) !== null) {
        const propName = match[1];
        if (props.has(propName)) {
          errors.push({
            file,
            line: index + 1,
            column: match.index,
            message: `Duplicate prop '${propName}'`,
            type: 'jsx',
            severity: 'error',
          });
        }
        props.set(propName, match.index);
      }
    });

    // Check for unterminated JSX
    const openTags = content.match(/<(\w+)[^>]*>/g) || [];
    const closeTags = content.match(/<\/(\w+)>/g) || [];
    
    const tagStack: string[] = [];
    openTags.forEach(tag => {
      const tagName = tag.match(/<(\w+)/)?.[1];
      if (tagName && !tag.endsWith('/>')) {
        tagStack.push(tagName);
      }
    });

    closeTags.forEach(tag => {
      const tagName = tag.match(/<\/(\w+)>/)?.[1];
      const lastTag = tagStack.pop();
      if (tagName !== lastTag) {
        errors.push({
          file,
          line: 0,
          column: 0,
          message: `Mismatched JSX tags: expected </${lastTag}> but found </${tagName}>`,
          type: 'jsx',
          severity: 'error',
        });
      }
    });

    if (tagStack.length > 0) {
      errors.push({
        file,
        line: 0,
        column: 0,
        message: `Unclosed JSX tags: ${tagStack.join(', ')}`,
        type: 'jsx',
        severity: 'error',
      });
    }

    return errors;
  }

  private checkImports(file: string, content: string): BuildError[] {
    const errors: BuildError[] = [];
    const importRegex = /import\\s+(?:{[^}]+}|\\*\\s+as\\s+\\w+|\\w+)\\s+from\\s+['"](.*)['"]/g;
    
    let match;
    let lineNum = 1;
    const lines = content.split('\\n');
    
    lines.forEach((line, index) => {
      const importMatch = line.match(/import.*from\\s+['"](.*)['"]/);
      if (importMatch) {
        const importPath = importMatch[1];
        
        // Check for missing extensions in relative imports
        if (importPath.startsWith('.') && !importPath.match(/\\.(js|jsx|ts|tsx|json|css|scss)$/)) {
          errors.push({
            file,
            line: index + 1,
            column: 0,
            message: `Import path '${importPath}' should include file extension`,
            type: 'import',
            severity: 'warning',
          });
        }
      }
    });

    return errors;
  }

  private parseBuildOutput(output: string): BuildError[] {
    const errors: BuildError[] = [];
    const lines = output.split('\\n');
    
    const errorPatterns = [
      // Next.js error pattern
      /(.+?)\\s*\\((\\d+):(\\d+)\\)\\s*(.+)/,
      // TypeScript error pattern
      /(.+?)\\((\\d+),(\\d+)\\):\\s*error\\s+TS\\d+:\\s*(.+)/,
      // Generic error pattern
      /Error:\\s*(.+?)\\s+at\\s+(.+?):(\\d+):(\\d+)/,
    ];

    lines.forEach(line => {
      for (const pattern of errorPatterns) {
        const match = line.match(pattern);
        if (match) {
          errors.push({
            file: match[1],
            line: parseInt(match[2]),
            column: parseInt(match[3]),
            message: match[4] || match[1],
            type: 'syntax',
            severity: 'error',
          });
          break;
        }
      }
    });

    return errors;
  }

  private parseTypeScriptOutput(output: string): BuildError[] {
    const errors: BuildError[] = [];
    const lines = output.split('\\n');
    
    lines.forEach(line => {
      const match = line.match(/(.+?)\\((\\d+),(\\d+)\\):\\s*error\\s+TS(\\d+):\\s*(.+)/);
      if (match) {
        errors.push({
          file: match[1],
          line: parseInt(match[2]),
          column: parseInt(match[3]),
          message: match[5],
          type: 'typescript',
          severity: 'error',
          code: `TS${match[4]}`,
        });
      }
    });

    return errors;
  }
}