import * as fs from 'fs/promises';
import * as path from 'path';
import { createTwoFilesPatch } from 'diff';
import chalk from 'chalk';
import { Logger } from '../utils/logger.js';

interface ReportOptions {
  format: 'markdown' | 'json' | 'html';
}

export class BuildReporter {
  private logger: Logger;
  private fixHistory: any[] = [];

  constructor() {
    this.logger = new Logger('BuildReporter');
  }

  generateFixReport(fixes: any, validation: any): string {
    const totalFixed = fixes.fixed.length;
    const totalFailed = fixes.failed.length;
    const totalSkipped = fixes.skipped.length;

    let report = `🩺 BUILD DOCTOR MCP OUTPUT\\n\\n`;
    report += `Status: ${validation.success ? '✅ All issues resolved' : `❌ ${totalFailed} remaining errors`}\\n\\n`;

    report += `📊 Summary:\\n`;
    report += `- Fixed: ${totalFixed} issues\\n`;
    report += `- Failed: ${totalFailed} issues\\n`;
    report += `- Skipped: ${totalSkipped} issues\\n\\n`;

    if (fixes.fixed.length > 0) {
      report += `✅ Fixed Issues:\\n`;
      fixes.fixed.forEach((fix: any) => {
        report += `\\n📁 ${fix.file}\\n`;
        report += `   ${fix.description}\\n`;
        if (fix.before && fix.after) {
          report += `   Before: ${fix.before.trim()}\\n`;
          report += `   After:  ${fix.after.trim()}\\n`;
        }
      });
    }

    if (fixes.failed.length > 0) {
      report += `\\n❌ Failed Fixes:\\n`;
      fixes.failed.forEach((fix: any) => {
        report += `- ${fix.file}: ${fix.error || 'Unknown error'}\\n`;
      });
    }

    report += `\\n🔍 Lint/Build Checks: ${validation.success ? 'PASS ✅' : 'FAIL ❌'}\\n`;

    if (validation.steps) {
      validation.steps.forEach((step: any) => {
        report += `  ${step.success ? '✓' : '✗'} ${step.name}: ${step.message}\\n`;
      });
    }

    report += `\\n💡 Preventative Suggestions:\\n`;
    report += `1. Enable pre-commit hooks with: npx husky add .husky/pre-commit "npm run lint"\\n`;
    report += `2. Add TypeScript strict mode in tsconfig.json\\n`;
    report += `3. Configure ESLint auto-fix on save in your IDE\\n`;
    report += `4. Run 'npm run build' before every commit\\n`;

    // Store in history
    this.fixHistory.push({
      timestamp: new Date().toISOString(),
      fixes,
      validation,
    });

    return report;
  }

  async generateFullReport(
    projectPath: string,
    options: ReportOptions
  ): Promise<string> {
    const report = {
      title: 'Build Doctor Comprehensive Report',
      timestamp: new Date().toISOString(),
      projectPath,
      history: this.fixHistory,
      recommendations: this.generateRecommendations(),
    };

    switch (options.format) {
      case 'json':
        return JSON.stringify(report, null, 2);

      case 'html':
        return this.generateHTMLReport(report);

      case 'markdown':
      default:
        return this.generateMarkdownReport(report);
    }
  }

  private generateMarkdownReport(report: any): string {
    let md = `# ${report.title}\\n\\n`;
    md += `**Generated:** ${report.timestamp}\\n`;
    md += `**Project:** ${report.projectPath}\\n\\n`;

    md += `## Fix History\\n\\n`;

    if (report.history.length === 0) {
      md += `*No fixes recorded yet*\\n\\n`;
    } else {
      report.history.forEach((entry: any, index: number) => {
        md += `### Session ${index + 1} - ${entry.timestamp}\\n\\n`;
        md += `- **Fixed:** ${entry.fixes.fixed.length} issues\\n`;
        md += `- **Failed:** ${entry.fixes.failed.length} issues\\n`;
        md += `- **Build Status:** ${entry.validation.success ? 'PASS ✅' : 'FAIL ❌'}\\n\\n`;

        if (entry.fixes.fixed.length > 0) {
          md += `#### Fixed Issues:\\n`;
          entry.fixes.fixed.forEach((fix: any) => {
            md += `- \`${fix.file}\`: ${fix.description}\\n`;
          });
          md += `\\n`;
        }
      });
    }

    md += `## Recommendations\\n\\n`;
    report.recommendations.forEach((rec: string) => {
      md += `- ${rec}\\n`;
    });

    md += `\\n## Next Steps\\n\\n`;
    md += `1. Review all fixed files to ensure changes are correct\\n`;
    md += `2. Run comprehensive tests: \`npm test\`\\n`;
    md += `3. Commit changes: \`git add -A && git commit -m "fix: Apply Build Doctor fixes"\`\\n`;
    md += `4. Set up continuous monitoring with Build Doctor\\n`;

    return md;
  }

  private generateHTMLReport(report: any): string {
    return `<!DOCTYPE html>
<html>
<head>
    <title>${report.title}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 40px; }
        h1 { color: #333; }
        .success { color: #28a745; }
        .error { color: #dc3545; }
        .fix-entry { background: #f8f9fa; padding: 10px; margin: 10px 0; border-radius: 5px; }
        code { background: #e9ecef; padding: 2px 4px; border-radius: 3px; }
        .metrics { display: flex; gap: 20px; margin: 20px 0; }
        .metric { background: #007bff; color: white; padding: 20px; border-radius: 5px; text-align: center; }
        .metric h3 { margin: 0; font-size: 24px; }
        .metric p { margin: 5px 0 0 0; opacity: 0.9; }
    </style>
</head>
<body>
    <h1>${report.title}</h1>
    <p><strong>Generated:</strong> ${report.timestamp}</p>
    <p><strong>Project:</strong> <code>${report.projectPath}</code></p>
    
    <div class="metrics">
        <div class="metric">
            <h3>${this.getTotalFixed(report.history)}</h3>
            <p>Total Issues Fixed</p>
        </div>
        <div class="metric" style="background: ${this.getLastBuildStatus(report.history) ? '#28a745' : '#dc3545'}">
            <h3>${this.getLastBuildStatus(report.history) ? 'PASS' : 'FAIL'}</h3>
            <p>Build Status</p>
        </div>
        <div class="metric" style="background: #6c757d">
            <h3>${report.history.length}</h3>
            <p>Fix Sessions</p>
        </div>
    </div>
    
    <h2>Fix History</h2>
    ${report.history
      .map(
        (entry: any, index: number) => `
        <div class="fix-entry">
            <h3>Session ${index + 1} - ${new Date(entry.timestamp).toLocaleString()}</h3>
            <p class="${entry.validation.success ? 'success' : 'error'}">
                Build Status: ${entry.validation.success ? 'PASS ✅' : 'FAIL ❌'}
            </p>
            <p>Fixed: ${entry.fixes.fixed.length} | Failed: ${entry.fixes.failed.length}</p>
        </div>
    `
      )
      .join('')}
    
    <h2>Recommendations</h2>
    <ul>
        ${report.recommendations.map((rec: string) => `<li>${rec}</li>`).join('')}
    </ul>
</body>
</html>`;
  }

  private generateRecommendations(): string[] {
    const recommendations = [
      'Enable TypeScript strict mode for better type safety',
      'Configure ESLint with auto-fix on save',
      'Set up pre-commit hooks with Husky',
      'Add GitHub Actions for continuous integration',
      'Use Prettier for consistent code formatting',
      'Enable source maps for better debugging',
      'Add type coverage reporting to track progress',
    ];

    // Add specific recommendations based on fix history
    if (
      this.fixHistory.some((h) =>
        h.fixes.fixed.some((f: any) => f.description.includes('JSX'))
      )
    ) {
      recommendations.unshift(
        'Consider using React.FC for consistent component typing'
      );
    }

    if (
      this.fixHistory.some((h) =>
        h.fixes.fixed.some((f: any) => f.description.includes('import'))
      )
    ) {
      recommendations.unshift('Configure module resolution in tsconfig.json');
    }

    return recommendations;
  }

  private getTotalFixed(history: any[]): number {
    return history.reduce((sum, entry) => sum + entry.fixes.fixed.length, 0);
  }

  private getLastBuildStatus(history: any[]): boolean {
    if (history.length === 0) return false;
    return history[history.length - 1].validation.success;
  }

  async saveReportToFile(
    report: string,
    projectPath: string,
    format: string
  ): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `build-doctor-report-${timestamp}.${format}`;
    const filepath = path.join(projectPath, filename);

    await fs.writeFile(filepath, report);
    this.logger.success(`Report saved to ${filename}`);

    return filepath;
  }
}
