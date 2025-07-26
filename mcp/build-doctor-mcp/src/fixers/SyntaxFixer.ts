import * as fs from 'fs/promises';
import * as path from 'path';
import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import * as t from '@babel/types';
import { format } from 'prettier';
import { execSync } from 'child_process';
import { Logger } from '../utils/logger.js';

interface Fix {
  file: string;
  description: string;
  before: string;
  after: string;
  success: boolean;
  error?: string;
}

interface FixResult {
  fixed: Fix[];
  failed: Fix[];
  skipped: Fix[];
  buildPasses: boolean;
}

export class SyntaxFixer {
  private logger: Logger;

  constructor() {
    this.logger = new Logger('SyntaxFixer');
  }

  async fixAllErrors(
    diagnosis: any,
    options: { dryRun: boolean; projectPath: string }
  ): Promise<FixResult> {
    const result: FixResult = {
      fixed: [],
      failed: [],
      skipped: [],
      buildPasses: false,
    };

    // Group errors by file
    const errorsByFile = new Map<string, any[]>();
    diagnosis.errors.forEach((error: any) => {
      if (!errorsByFile.has(error.file)) {
        errorsByFile.set(error.file, []);
      }
      errorsByFile.get(error.file)!.push(error);
    });

    // Fix each file
    for (const [file, errors] of errorsByFile) {
      try {
        const fix = await this.fixFile(file, errors, options);
        if (fix.success) {
          result.fixed.push(fix);
        } else {
          result.failed.push(fix);
        }
      } catch (error: any) {
        result.failed.push({
          file,
          description: 'Failed to process file',
          before: '',
          after: '',
          success: false,
          error: error.message,
        });
      }
    }

    // Check if build passes after fixes
    if (!options.dryRun) {
      result.buildPasses = await this.checkBuildPasses(options.projectPath);
    }

    return result;
  }

  async fixSyntaxErrors(errors: any[]): Promise<FixResult> {
    const result: FixResult = {
      fixed: [],
      failed: [],
      skipped: [],
      buildPasses: false,
    };

    for (const error of errors) {
      try {
        const content = await fs.readFile(error.file, 'utf-8');
        const fixed = await this.fixSyntaxError(error, content);

        if (fixed) {
          await fs.writeFile(error.file, fixed);
          result.fixed.push({
            file: error.file,
            description: `Fixed: ${error.message}`,
            before: content.split('\\n')[error.line - 1] || '',
            after: fixed.split('\\n')[error.line - 1] || '',
            success: true,
          });
          this.logger.fix(error.file, error.message);
        } else {
          result.skipped.push({
            file: error.file,
            description: `Skipped: ${error.message}`,
            before: '',
            after: '',
            success: false,
          });
        }
      } catch (e: any) {
        result.failed.push({
          file: error.file,
          description: `Failed to fix: ${error.message}`,
          before: '',
          after: '',
          success: false,
          error: e.message,
        });
      }
    }

    return result;
  }

  async fixTypeScriptErrors(
    errors: any[],
    options: { strictMode: boolean }
  ): Promise<FixResult> {
    const result: FixResult = {
      fixed: [],
      failed: [],
      skipped: [],
      buildPasses: false,
    };

    for (const error of errors) {
      try {
        const content = await fs.readFile(error.file, 'utf-8');
        const fixed = await this.fixTypeScriptError(error, content, options);

        if (fixed && fixed !== content) {
          await fs.writeFile(error.file, fixed);
          result.fixed.push({
            file: error.file,
            description: `Fixed TS${error.code}: ${error.message}`,
            before: content.split('\\n')[error.line - 1] || '',
            after: fixed.split('\\n')[error.line - 1] || '',
            success: true,
          });
          this.logger.fix(error.file, `TS${error.code}: ${error.message}`);
        } else {
          result.skipped.push({
            file: error.file,
            description: `Cannot auto-fix: ${error.message}`,
            before: '',
            after: '',
            success: false,
          });
        }
      } catch (e: any) {
        result.failed.push({
          file: error.file,
          description: `Failed to fix: ${error.message}`,
          before: '',
          after: '',
          success: false,
          error: e.message,
        });
      }
    }

    return result;
  }

  async fixJSXErrors(
    errors: any[],
    options: { fixDuplicateProps: boolean }
  ): Promise<FixResult> {
    const result: FixResult = {
      fixed: [],
      failed: [],
      skipped: [],
      buildPasses: false,
    };

    for (const error of errors) {
      try {
        const content = await fs.readFile(error.file, 'utf-8');
        const fixed = await this.fixJSXError(error, content, options);

        if (fixed && fixed !== content) {
          await fs.writeFile(error.file, fixed);
          result.fixed.push({
            file: error.file,
            description: `Fixed JSX: ${error.message}`,
            before: content.split('\\n')[error.line - 1] || '',
            after: fixed.split('\\n')[error.line - 1] || '',
            success: true,
          });
          this.logger.fix(error.file, `JSX: ${error.message}`);
        } else {
          result.skipped.push({
            file: error.file,
            description: `Cannot auto-fix: ${error.message}`,
            before: '',
            after: '',
            success: false,
          });
        }
      } catch (e: any) {
        result.failed.push({
          file: error.file,
          description: `Failed to fix: ${error.message}`,
          before: '',
          after: '',
          success: false,
          error: e.message,
        });
      }
    }

    return result;
  }

  private async fixFile(
    file: string,
    errors: any[],
    options: any
  ): Promise<Fix> {
    const content = await fs.readFile(file, 'utf-8');
    let fixed = content;

    // Apply fixes based on error types
    for (const error of errors) {
      switch (error.type) {
        case 'syntax':
          fixed = (await this.fixSyntaxError(error, fixed)) || fixed;
          break;
        case 'typescript':
          fixed =
            (await this.fixTypeScriptError(error, fixed, {
              strictMode: false,
            })) || fixed;
          break;
        case 'jsx':
          fixed =
            (await this.fixJSXError(error, fixed, {
              fixDuplicateProps: true,
            })) || fixed;
          break;
        case 'import':
          fixed = this.fixImportError(error, fixed) || fixed;
          break;
      }
    }

    // Format the fixed code
    try {
      fixed = await format(fixed, {
        filepath: file,
        semi: true,
        singleQuote: true,
        trailingComma: 'es5',
      });
    } catch (e) {
      this.logger.warn('Prettier formatting failed, using raw fix');
    }

    if (!options.dryRun && fixed !== content) {
      await fs.writeFile(file, fixed);
    }

    return {
      file,
      description: `Fixed ${errors.length} errors`,
      before: content.substring(0, 200) + '...',
      after: fixed.substring(0, 200) + '...',
      success: true,
    };
  }

  private async fixSyntaxError(
    error: any,
    content: string
  ): Promise<string | null> {
    const lines = content.split('\\n');

    // Common syntax fixes
    if (error.message.includes('Unexpected token')) {
      // Fix missing semicolons
      if (error.message.includes('}') || error.message.includes(')')) {
        if (error.line > 0 && error.line <= lines.length) {
          lines[error.line - 1] = lines[error.line - 1].trimEnd() + ';';
          return lines.join('\\n');
        }
      }

      // Fix missing closing brackets
      if (error.message.includes('expected')) {
        const line = lines[error.line - 1];
        const openBrackets = (line.match(/[({\\[]/g) || []).length;
        const closeBrackets = (line.match(/[)}\\]]/g) || []).length;

        if (openBrackets > closeBrackets) {
          const missing = openBrackets - closeBrackets;
          let suffix = '';
          for (let i = 0; i < missing; i++) {
            if (line.includes('(')) suffix += ')';
            else if (line.includes('{')) suffix += '}';
            else if (line.includes('[')) suffix += ']';
          }
          lines[error.line - 1] = line + suffix;
          return lines.join('\\n');
        }
      }
    }

    // Fix unterminated strings
    if (error.message.includes('Unterminated string')) {
      const line = lines[error.line - 1];
      const quotes = line.match(/['"]/g) || [];
      if (quotes.length % 2 !== 0) {
        lines[error.line - 1] = line + quotes[quotes.length - 1];
        return lines.join('\\n');
      }
    }

    return null;
  }

  private async fixTypeScriptError(
    error: any,
    content: string,
    options: any
  ): Promise<string | null> {
    // Common TypeScript fixes based on error codes
    switch (error.code) {
      case 'TS2307': // Cannot find module
        return this.fixMissingImport(error, content);

      case 'TS2339': // Property does not exist
        return this.fixMissingProperty(error, content, options);

      case 'TS2345': // Argument type mismatch
        return this.fixTypeMismatch(error, content);

      case 'TS7006': // Parameter implicitly has 'any' type
        return this.fixImplicitAny(error, content);

      default:
        return null;
    }
  }

  private async fixJSXError(
    error: any,
    content: string,
    options: any
  ): Promise<string | null> {
    const lines = content.split('\\n');

    // Fix duplicate props
    if (error.message.includes('Duplicate prop') && options.fixDuplicateProps) {
      const match = error.message.match(/Duplicate prop '(\\w+)'/);
      if (match) {
        const propName = match[1];
        const line = lines[error.line - 1];

        // Remove the second occurrence
        const regex = new RegExp(`\\\\s${propName}=[^\\\\s>]+`, 'g');
        const matches = line.match(regex);
        if (matches && matches.length > 1) {
          // Keep first, remove second
          const firstIndex = line.indexOf(matches[0]);
          const secondIndex = line.indexOf(matches[1], firstIndex + 1);
          lines[error.line - 1] =
            line.substring(0, secondIndex) +
            line.substring(secondIndex + matches[1].length);
          return lines.join('\\n');
        }
      }
    }

    // Fix unclosed tags
    if (error.message.includes('Unclosed JSX tags')) {
      const match = error.message.match(/Unclosed JSX tags: (.+)/);
      if (match) {
        const tags = match[1].split(', ');
        let fixedContent = content;

        // Add closing tags at the end of the file
        tags.forEach((tag: string) => {
          fixedContent += `\\n</${tag}>`;
        });

        return fixedContent;
      }
    }

    return null;
  }

  private fixImportError(error: any, content: string): string | null {
    if (error.message.includes('should include file extension')) {
      const lines = content.split('\\n');
      const line = lines[error.line - 1];

      // Add .js extension to relative imports
      const fixed = line.replace(
        /from\s+['"](\.\/[^'"]+)(?!\.[^'"]+)['"]/,
        "from '$1.js'"
      );

      if (fixed !== line) {
        lines[error.line - 1] = fixed;
        return lines.join('\\n');
      }
    }

    return null;
  }

  private fixMissingImport(error: any, content: string): string | null {
    // Extract module name from error
    const match = error.message.match(/Cannot find module '(.+)'/);
    if (match) {
      const moduleName = match[1];

      // Common import fixes
      const commonFixes: Record<string, string> = {
        react: "import React from 'react';",
        'next/router': "import { useRouter } from 'next/router';",
        'next/link': "import Link from 'next/link';",
      };

      if (commonFixes[moduleName]) {
        return commonFixes[moduleName] + '\\n' + content;
      }
    }

    return null;
  }

  private fixMissingProperty(
    error: any,
    content: string,
    options: any
  ): string | null {
    if (options.strictMode) {
      // In strict mode, add type assertion
      const lines = content.split('\\n');
      const line = lines[error.line - 1];

      // Add 'as any' to bypass type checking (not recommended for production)
      const fixed = line.replace(/(\\w+)\\.(\\w+)/, '$1 as any.$2');

      if (fixed !== line) {
        lines[error.line - 1] = fixed;
        return lines.join('\\n');
      }
    }

    return null;
  }

  private fixTypeMismatch(error: any, content: string): string | null {
    // Add type assertion for quick fix
    const lines = content.split('\\n');
    const line = lines[error.line - 1];

    // Wrap in type assertion
    const fixed = line.replace(/(\w+)\(/, '($1 as any)(');

    if (fixed !== line) {
      lines[error.line - 1] = fixed;
      return lines.join('\\n');
    }

    return null;
  }

  private fixImplicitAny(error: any, content: string): string | null {
    const lines = content.split('\\n');
    const line = lines[error.line - 1];

    // Add explicit any type
    const fixed = line.replace(/(\w+)\s*\)/, '$1: any)');

    if (fixed !== line) {
      lines[error.line - 1] = fixed;
      return lines.join('\\n');
    }

    return null;
  }

  private async checkBuildPasses(projectPath: string): Promise<boolean> {
    try {
      execSync('npm run build', {
        cwd: projectPath,
        stdio: 'ignore',
      });
      return true;
    } catch {
      return false;
    }
  }
}
