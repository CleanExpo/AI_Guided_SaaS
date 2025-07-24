#!/usr/bin/env tsx

/**
 * TypeScript Error Analyzer
 * Analyzes and categorizes all TypeScript errors in the project
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

interface ErrorInfo {
  code: string;
  count: number;
  files: Set<string>;
  examples: string[];
}

interface ErrorAnalysis {
  totalErrors: number;
  errorsByCode: Record<string, ErrorInfo>;
  errorsByFile: Record<string, number>;
  topFiles: Array<{ file: string; errors: number }>;
  summary: {
    syntaxErrors: number;
    typeErrors: number;
    otherErrors: number;
  };
}

class TypeScriptErrorAnalyzer {
  private errors: Map<string, ErrorInfo> = new Map();
  private fileErrors: Map<string, number> = new Map();
  private totalErrors = 0;

  async analyze(): Promise<ErrorAnalysis> {
    console.log(chalk.blue.bold('\n🔍 Analyzing TypeScript Errors...\n'));

    try {
      // Run typecheck and capture output
      const output = execSync('npm run typecheck 2>&1 || true', {
        encoding: 'utf-8',
        maxBuffer: 1024 * 1024 * 50 // 50MB buffer for large output
      });

      this.parseErrors(output);
      const analysis = this.generateAnalysis();
      
      // Save detailed report
      this.saveReport(analysis);
      
      // Display summary
      this.displaySummary(analysis);

      return analysis;
    } catch (error) {
      console.error(chalk.red('Error during analysis:'), error.message);
      throw error;
    }
  }

  private parseErrors(output: string): void {
    const lines = output.split('\n');
    let currentFile = '';

    for (const line of lines) {
      // Match file path
      const fileMatch = line.match(/^(.+\.(ts|tsx))[:(\d]/);
      if (fileMatch) {
        currentFile = fileMatch[1];
      }

      // Match error code
      const errorMatch = line.match(/error (TS\d+):\s*(.+)/);
      if (errorMatch && currentFile) {
        const [_, code, message] = errorMatch;
        this.totalErrors++;

        // Update error info
        if (!this.errors.has(code)) {
          this.errors.set(code, {
            code,
            count: 0,
            files: new Set(),
            examples: []
          });
        }

        const errorInfo = this.errors.get(code)!;
        errorInfo.count++;
        errorInfo.files.add(currentFile);
        
        // Keep up to 3 examples
        if (errorInfo.examples.length < 3) {
          errorInfo.examples.push(`${currentFile}: ${message}`);
        }

        // Update file error count
        this.fileErrors.set(currentFile, (this.fileErrors.get(currentFile) || 0) + 1);
      }
    }
  }

  private generateAnalysis(): ErrorAnalysis {
    // Convert maps to objects
    const errorsByCode: Record<string, ErrorInfo> = {};
    this.errors.forEach((info, code) => {
      errorsByCode[code] = {
        ...info,
        files: info.files // Convert Set to array for JSON serialization
      };
    });

    const errorsByFile: Record<string, number> = {};
    this.fileErrors.forEach((count, file) => {
      errorsByFile[file] = count;
    });

    // Get top error files
    const topFiles = Array.from(this.fileErrors.entries())
      .map(([file, errors]) => ({ file, errors }))
      .sort((a, b) => b.errors - a.errors)
      .slice(0, 20);

    // Categorize errors
    const syntaxErrors = this.countErrorsByCategory(['TS1005', 'TS1128', 'TS1109', 'TS1003', 'TS1434']);
    const typeErrors = this.countErrorsByCategory(['TS2339', 'TS2554', 'TS2345', 'TS2322', 'TS2741']);
    const otherErrors = this.totalErrors - syntaxErrors - typeErrors;

    return {
      totalErrors: this.totalErrors,
      errorsByCode,
      errorsByFile,
      topFiles,
      summary: {
        syntaxErrors,
        typeErrors,
        otherErrors
      }
    };
  }

  private countErrorsByCategory(codes: string[]): number {
    return codes.reduce((sum, code) => {
      const error = this.errors.get(code);
      return sum + (error?.count || 0);
    }, 0);
  }

  private saveReport(analysis: ErrorAnalysis): void {
    // Save detailed JSON report
    const reportPath = path.join(process.cwd(), 'typescript-error-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(analysis, null, 2));
    console.log(chalk.green(`\n📄 Detailed report saved to: ${reportPath}`));

    // Save markdown summary
    const mdReport = this.generateMarkdownReport(analysis);
    const mdPath = path.join(process.cwd(), 'typescript-error-report.md');
    fs.writeFileSync(mdPath, mdReport);
    console.log(chalk.green(`📄 Markdown report saved to: ${mdPath}`));
  }

  private generateMarkdownReport(analysis: ErrorAnalysis): string {
    const { totalErrors, errorsByCode, topFiles, summary } = analysis;

    let md = `# TypeScript Error Report\n\n`;
    md += `Generated: ${new Date().toISOString()}\n\n`;
    md += `## Summary\n\n`;
    md += `- **Total Errors**: ${totalErrors.toLocaleString()}\n`;
    md += `- **Syntax Errors**: ${summary.syntaxErrors.toLocaleString()} (${((summary.syntaxErrors / totalErrors) * 100).toFixed(1)}%)\n`;
    md += `- **Type Errors**: ${summary.typeErrors.toLocaleString()} (${((summary.typeErrors / totalErrors) * 100).toFixed(1)}%)\n`;
    md += `- **Other Errors**: ${summary.otherErrors.toLocaleString()} (${((summary.otherErrors / totalErrors) * 100).toFixed(1)}%)\n\n`;

    md += `## Top Error Types\n\n`;
    md += `| Error Code | Count | Description | Files Affected |\n`;
    md += `|------------|-------|-------------|----------------|\n`;

    const topErrors = Object.entries(errorsByCode)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 15);

    const errorDescriptions: Record<string, string> = {
      'TS1005': 'Missing semicolon or syntax element',
      'TS1128': 'Declaration or statement expected',
      'TS1109': 'Expression expected',
      'TS1003': 'Identifier expected',
      'TS1434': 'Unexpected keyword or identifier',
      'TS2339': 'Property does not exist',
      'TS2554': 'Wrong number of arguments',
      'TS2345': 'Type mismatch',
      'TS2322': 'Type not assignable',
      'TS2741': 'Missing properties in type'
    };

    topErrors.forEach(([code, info]) => {
      const desc = errorDescriptions[code] || 'Other error';
      md += `| ${code} | ${info.count.toLocaleString()} | ${desc} | ${info.files.size} |\n`;
    });

    md += `\n## Top Files with Errors\n\n`;
    md += `| File | Error Count |\n`;
    md += `|------|-------------|\n`;

    topFiles.slice(0, 15).forEach(({ file, errors }) => {
      const shortPath = file.replace(process.cwd() + path.sep, '');
      md += `| ${shortPath} | ${errors.toLocaleString()} |\n`;
    });

    md += `\n## Fix Priority\n\n`;
    md += `1. **Syntax Errors** (${summary.syntaxErrors.toLocaleString()} errors)\n`;
    md += `   - Fix TS1005, TS1128, TS1109 first\n`;
    md += `   - Use automated tools and linters\n\n`;
    md += `2. **Type Errors** (${summary.typeErrors.toLocaleString()} errors)\n`;
    md += `   - Update type definitions\n`;
    md += `   - Fix property access issues\n\n`;
    md += `3. **Other Errors** (${summary.otherErrors.toLocaleString()} errors)\n`;
    md += `   - Address remaining issues\n`;

    return md;
  }

  private displaySummary(analysis: ErrorAnalysis): void {
    const { totalErrors, errorsByCode, topFiles, summary } = analysis;

    console.log(chalk.yellow.bold('\n📊 Error Summary\n'));
    console.log(chalk.white(`Total Errors: ${chalk.red.bold(totalErrors.toLocaleString())}`));
    console.log(chalk.white(`Syntax Errors: ${chalk.yellow(summary.syntaxErrors.toLocaleString())} (${((summary.syntaxErrors / totalErrors) * 100).toFixed(1)}%)`));
    console.log(chalk.white(`Type Errors: ${chalk.blue(summary.typeErrors.toLocaleString())} (${((summary.typeErrors / totalErrors) * 100).toFixed(1)}%)`));
    console.log(chalk.white(`Other Errors: ${chalk.gray(summary.otherErrors.toLocaleString())} (${((summary.otherErrors / totalErrors) * 100).toFixed(1)}%)`));

    console.log(chalk.yellow.bold('\n🔝 Top 10 Error Types\n'));
    Object.entries(errorsByCode)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 10)
      .forEach(([code, info], index) => {
        console.log(chalk.white(`${index + 1}. ${chalk.cyan(code)}: ${chalk.red(info.count.toLocaleString())} errors in ${info.files.size} files`));
      });

    console.log(chalk.yellow.bold('\n📁 Top 10 Files with Most Errors\n'));
    topFiles.slice(0, 10).forEach(({ file, errors }, index) => {
      const shortPath = file.replace(process.cwd() + path.sep, '');
      console.log(chalk.white(`${index + 1}. ${chalk.cyan(shortPath)}: ${chalk.red(errors.toLocaleString())} errors`));
    });

    console.log(chalk.green.bold('\n✅ Next Steps:\n'));
    console.log('1. Run automated syntax fixes: npm run fix:syntax');
    console.log('2. Fix type errors: npm run fix:types');
    console.log('3. Review the detailed reports generated');
    console.log('4. Start with files that have the most errors\n');
  }
}

// Run analyzer
async function main() {
  const analyzer = new TypeScriptErrorAnalyzer();
  try {
    await analyzer.analyze();
  } catch (error) {
    console.error(chalk.red('Analysis failed:'), error);
    process.exit(1);
  }
}

main();