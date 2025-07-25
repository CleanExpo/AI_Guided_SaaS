import { promises as fs } from 'fs';
import path from 'path';
import { minify } from 'terser';
import cssnano from 'cssnano';
import postcss from 'postcss';
import { optimize } from 'svgo';

interface CompactConfig {
  enabled: boolean;
  threshold: number; // File size threshold in KB
  excludePatterns: string[];
  includePatterns: string[];
  maxFileSize: number; // Max file size to process in MB
  preserveComments: boolean;
  compactLevel: 'light' | 'medium' | 'aggressive';
}

interface CompactResult {
  originalSize: number;
  compactedSize: number;
  reduction: number;
  reductionPercentage: number;
  file: string;
  type: string;
  success: boolean;
  error?: string;
}

interface CompactReport {
  totalFiles: number;
  processedFiles: number;
  skippedFiles: number;
  totalOriginalSize: number;
  totalCompactedSize: number;
  totalReduction: number;
  averageReduction: number;
  results: CompactResult[];
  duration: number;
}

class AutoCompactSystem {
  private config: CompactConfig;
  private isRunning: boolean = false;
  private lastRun?: Date;
  private report: CompactReport | null = null;

  constructor(config: CompactConfig) {
    this.config = {
      enabled: true,
      threshold: 1, // 1KB minimum
      excludePatterns: ['node_modules', '.git', 'dist', 'build', '.next'],
      includePatterns: ['src', 'public', 'styles'],
      maxFileSize: 10, // 10MB max
      preserveComments: false,
      compactLevel: 'medium',
      ...config
    };
  }

  async compact(targetPath: string = '.'): Promise<CompactReport> {
    if (this.isRunning) {
      throw new Error('Compaction already in progress');
    }

    this.isRunning = true;
    const startTime = Date.now();
    const results: CompactResult[] = [];
    
    try {
      const files = await this.getFilesToCompact(targetPath);
      
      for (const file of files) {
        const result = await this.compactFile(file);
        if (result) {
          results.push(result);
        }
      }

      const report = this.generateReport(results, startTime);
      this.report = report;
      this.lastRun = new Date();
      
      return report;
    } finally {
      this.isRunning = false;
    }
  }

  private async getFilesToCompact(targetPath: string): Promise<string[]> {
    const files: string[] = [];
    
    const walk = async (dir: string) => {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.relative(targetPath, fullPath);
        
        // Check exclusions
        if (this.config.excludePatterns.some(pattern => relativePath.includes(pattern))) {
          continue;
        }
        
        if (entry.isDirectory()) {
          await walk(fullPath);
        } else if (entry.isFile()) {
          // Check file extension
          const ext = path.extname(fullPath).toLowerCase();
          if (['.js', '.jsx', '.ts', '.tsx', '.css', '.scss', '.svg', '.json'].includes(ext)) {
            const stats = await fs.stat(fullPath);
            
            // Check file size
            if (stats.size > this.config.threshold * 1024 && 
                stats.size < this.config.maxFileSize * 1024 * 1024) {
              files.push(fullPath);
            }
          }
        }
      }
    };
    
    await walk(targetPath);
    return files;
  }

  private async compactFile(filePath: string): Promise<CompactResult | null> {
    try {
      const stats = await fs.stat(filePath);
      const originalSize = stats.size;
      const ext = path.extname(filePath).toLowerCase();
      const content = await fs.readFile(filePath, 'utf8');
      
      let compactedContent: string = content;
      let type: string = 'unknown';
      
      switch (ext) {
        case '.js':
        case '.jsx':
        case '.ts':
        case '.tsx':
          compactedContent = await this.compactJavaScript(content, filePath);
          type = 'javascript';
          break;
          
        case '.css':
        case '.scss':
          compactedContent = await this.compactCSS(content);
          type = 'css';
          break;
          
        case '.svg':
          compactedContent = await this.compactSVG(content);
          type = 'svg';
          break;
          
        case '.json':
          compactedContent = this.compactJSON(content);
          type = 'json';
          break;
          
        default:
          return null;
      }
      
      // Only write if there's actual reduction
      const compactedSize = Buffer.byteLength(compactedContent, 'utf8');
      const reduction = originalSize - compactedSize;
      const reductionPercentage = (reduction / originalSize) * 100;
      
      if (reduction > 0 && reductionPercentage > 1) { // At least 1% reduction
        await fs.writeFile(filePath, compactedContent, 'utf8');
        
        return {
          originalSize,
          compactedSize,
          reduction,
          reductionPercentage,
          file: filePath,
          type,
          success: true
        };
      }
      
      return null;
    } catch (error) {
      return {
        originalSize: 0,
        compactedSize: 0,
        reduction: 0,
        reductionPercentage: 0,
        file: filePath,
        type: 'unknown',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async compactJavaScript(content: string, filePath: string): Promise<string> {
    // Skip already minified files
    if (filePath.includes('.min.')) {
      return content;
    }
    
    const options: any = {
      compress: {
        dead_code: true,
        drop_console: this.config.compactLevel === 'aggressive',
        drop_debugger: true,
        unused: true,
        collapse_vars: true,
        reduce_vars: true,
        pure_funcs: this.config.compactLevel === 'aggressive' ? ['console.log'] : []
      },
      mangle: this.config.compactLevel !== 'light',
      format: {
        comments: this.config.preserveComments ? 'some' : false
      }
    };
    
    const result = await minify(content, options);
    return result.code || content;
  }

  private async compactCSS(content: string): Promise<string> {
    const result = await postcss([
      cssnano({
        preset: [
          'default',
          {
            discardComments: {
              removeAll: !this.config.preserveComments
            },
            normalizeWhitespace: this.config.compactLevel !== 'light',
            mergeLonghand: this.config.compactLevel === 'aggressive',
            discardEmpty: true,
            minifySelectors: true,
            minifyFontValues: true,
            discardUnused: this.config.compactLevel === 'aggressive'
          }
        ]
      })
    ]).process(content, { from: undefined });
    
    return result.css;
  }

  private async compactSVG(content: string): Promise<string> {
    const result = optimize(content, {
      multipass: this.config.compactLevel === 'aggressive',
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              removeViewBox: false,
              removeTitle: !this.config.preserveComments,
              removeDesc: !this.config.preserveComments,
              removeComments: !this.config.preserveComments,
              cleanupNumericValues: {
                floatPrecision: this.config.compactLevel === 'aggressive' ? 1 : 2
              }
            }
          }
        }
      ]
    });
    
    return result.data;
  }

  private compactJSON(content: string): string {
    try {
      const parsed = JSON.parse(content);
      return JSON.stringify(parsed); // Remove all whitespace
    } catch {
      return content; // Return original if parsing fails
    }
  }

  private generateReport(results: CompactResult[], startTime: number): CompactReport {
    const successfulResults = results.filter(r => r.success && r.reduction > 0);
    
    const totalOriginalSize = successfulResults.reduce((sum, r) => sum + r.originalSize, 0);
    const totalCompactedSize = successfulResults.reduce((sum, r) => sum + r.compactedSize, 0);
    const totalReduction = totalOriginalSize - totalCompactedSize;
    const averageReduction = successfulResults.length > 0
      ? successfulResults.reduce((sum, r) => sum + r.reductionPercentage, 0) / successfulResults.length
      : 0;
    
    return {
      totalFiles: results.length,
      processedFiles: successfulResults.length,
      skippedFiles: results.length - successfulResults.length,
      totalOriginalSize,
      totalCompactedSize,
      totalReduction,
      averageReduction,
      results: successfulResults,
      duration: Date.now() - startTime
    };
  }

  async autoCompact(): Promise<void> {
    if (!this.config.enabled) {
      return;
    }
    
    // Run compaction in the background
    setImmediate(async () => {
      try {
        await this.compact();
      } catch (error) {
        console.error('Auto-compact failed:', error);
      }
    });
  }

  getReport(): CompactReport | null {
    return this.report;
  }

  getConfig(): CompactConfig {
    return { ...this.config };
  }

  updateConfig(updates: Partial<CompactConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  isEnabled(): boolean {
    return this.config.enabled;
  }

  getLastRun(): Date | undefined {
    return this.lastRun;
  }

  formatReport(report: CompactReport): string {
    const lines = [
      '=== Auto-Compact Report ===',
      `Total Files Analyzed: ${report.totalFiles}`,
      `Files Compacted: ${report.processedFiles}`,
      `Files Skipped: ${report.skippedFiles}`,
      `Original Size: ${(report.totalOriginalSize / 1024).toFixed(2)} KB`,
      `Compacted Size: ${(report.totalCompactedSize / 1024).toFixed(2)} KB`,
      `Total Reduction: ${(report.totalReduction / 1024).toFixed(2)} KB (${report.averageReduction.toFixed(1)}%)`,
      `Duration: ${report.duration}ms`,
      '',
      'Top Compressions:'
    ];
    
    const topResults = report.results
      .sort((a, b) => b.reduction - a.reduction)
      .slice(0, 10);
    
    topResults.forEach(result => {
      lines.push(
        `  ${path.basename(result.file)}: ${(result.reduction / 1024).toFixed(2)} KB (${result.reductionPercentage.toFixed(1)}%)`
      );
    });
    
    return lines.join('\n');
  }
}

// Singleton instance
let autoCompactInstance: AutoCompactSystem | null = null;

export function initializeAutoCompact(config?: Partial<CompactConfig>): AutoCompactSystem {
  if (!autoCompactInstance) {
    autoCompactInstance = new AutoCompactSystem(config || {});
  }
  return autoCompactInstance;
}

export function getAutoCompact(): AutoCompactSystem {
  if (!autoCompactInstance) {
    throw new Error('Auto-Compact System not initialized');
  }
  return autoCompactInstance;
}

export { AutoCompactSystem, type CompactConfig, type CompactReport, type CompactResult };