import { execSync } from 'child_process';
import * as path from 'path';
import { Logger } from '../utils/logger.js';

interface ValidationStep {
  name: string;
  success: boolean;
  message: string;
  duration?: number;
}

interface ValidationResult {
  success: boolean;
  steps: ValidationStep[];
  metrics?: {
    buildTime: number;
    bundleSize: string;
    typeCoverage: number;
  };
}

export class CodeValidator {
  private logger: Logger;

  constructor() {
    this.logger = new Logger('CodeValidator');
  }

  async validateProject(projectPath: string, options: { runTests?: boolean } = {}): Promise<ValidationResult> {
    this.logger.info('Starting project validation...');
    
    const steps: ValidationStep[] = [];
    let overallSuccess = true;

    // Step 1: Check package.json
    const packageCheck = await this.validatePackageJson(projectPath);
    steps.push(packageCheck);
    overallSuccess = overallSuccess && packageCheck.success;

    // Step 2: Check dependencies
    const depsCheck = await this.validateDependencies(projectPath);
    steps.push(depsCheck);
    overallSuccess = overallSuccess && depsCheck.success;

    // Step 3: Run linter
    const lintCheck = await this.runLinter(projectPath);
    steps.push(lintCheck);
    overallSuccess = overallSuccess && lintCheck.success;

    // Step 4: Type check
    const typeCheck = await this.runTypeCheck(projectPath);
    steps.push(typeCheck);
    overallSuccess = overallSuccess && typeCheck.success;

    // Step 5: Build project
    const buildCheck = await this.runBuild(projectPath);
    steps.push(buildCheck);
    overallSuccess = overallSuccess && buildCheck.success;

    // Step 6: Run tests (optional)
    if (options.runTests) {
      const testCheck = await this.runTests(projectPath);
      steps.push(testCheck);
      overallSuccess = overallSuccess && testCheck.success;
    }

    // Collect metrics if build successful
    let metrics;
    if (buildCheck.success) {
      metrics = await this.collectMetrics(projectPath);
    }

    return {
      success: overallSuccess,
      steps,
      metrics,
    };
  }

  private async validatePackageJson(projectPath: string): Promise<ValidationStep> {
    const startTime = Date.now();
    
    try {
      const packageJson = require(path.join(projectPath, 'package.json'));
      
      // Check for required fields
      const required = ['name', 'version', 'scripts'];
      const missing = required.filter(field => !packageJson[field]);
      
      if (missing.length > 0) {
        return {
          name: 'Package.json Validation',
          success: false,
          message: `Missing required fields: ${missing.join(', ')}`,
          duration: Date.now() - startTime,
        };
      }

      // Check for build script
      if (!packageJson.scripts?.build) {
        return {
          name: 'Package.json Validation',
          success: false,
          message: 'Missing build script',
          duration: Date.now() - startTime,
        };
      }

      return {
        name: 'Package.json Validation',
        success: true,
        message: 'Valid package.json',
        duration: Date.now() - startTime,
      };
    } catch (error: any) {
      return {
        name: 'Package.json Validation',
        success: false,
        message: `Failed to read package.json: ${error.message}`,
        duration: Date.now() - startTime,
      };
    }
  }

  private async validateDependencies(projectPath: string): Promise<ValidationStep> {
    const startTime = Date.now();
    
    try {
      // Check for missing dependencies
      execSync('npm ls --depth=0', {
        cwd: projectPath,
        stdio: 'pipe',
      });

      return {
        name: 'Dependency Check',
        success: true,
        message: 'All dependencies installed',
        duration: Date.now() - startTime,
      };
    } catch (error: any) {
      // Check if it's just warnings or actual errors
      const output = error.stdout?.toString() || '';
      const hasErrors = output.includes('npm ERR!');
      
      return {
        name: 'Dependency Check',
        success: !hasErrors,
        message: hasErrors ? 'Missing or invalid dependencies' : 'Dependencies OK (with warnings)',
        duration: Date.now() - startTime,
      };
    }
  }

  private async runLinter(projectPath: string): Promise<ValidationStep> {
    const startTime = Date.now();
    
    try {
      const output = execSync('npm run lint', {
        cwd: projectPath,
        encoding: 'utf-8',
        stdio: 'pipe',
      });

      return {
        name: 'ESLint Check',
        success: true,
        message: 'No linting errors',
        duration: Date.now() - startTime,
      };
    } catch (error: any) {
      const output = error.stdout?.toString() || error.message;
      const errorCount = (output.match(/\\d+ errors?/g) || [])[0] || 'Multiple errors';
      
      return {
        name: 'ESLint Check',
        success: false,
        message: `Linting failed: ${errorCount}`,
        duration: Date.now() - startTime,
      };
    }
  }

  private async runTypeCheck(projectPath: string): Promise<ValidationStep> {
    const startTime = Date.now();
    
    try {
      execSync('npx tsc --noEmit', {
        cwd: projectPath,
        stdio: 'pipe',
      });

      return {
        name: 'TypeScript Check',
        success: true,
        message: 'No type errors',
        duration: Date.now() - startTime,
      };
    } catch (error: any) {
      const output = error.stdout?.toString() || error.message;
      const errorMatch = output.match(/Found (\\d+) errors?/);
      const errorCount = errorMatch ? errorMatch[1] : 'Multiple';
      
      return {
        name: 'TypeScript Check',
        success: false,
        message: `Type check failed: ${errorCount} errors`,
        duration: Date.now() - startTime,
      };
    }
  }

  private async runBuild(projectPath: string): Promise<ValidationStep> {
    const startTime = Date.now();
    
    try {
      execSync('npm run build', {
        cwd: projectPath,
        stdio: 'pipe',
        env: { ...process.env, CI: 'true' },
      });

      return {
        name: 'Build',
        success: true,
        message: 'Build completed successfully',
        duration: Date.now() - startTime,
      };
    } catch (error: any) {
      return {
        name: 'Build',
        success: false,
        message: `Build failed: ${error.message.split('\\n')[0]}`,
        duration: Date.now() - startTime,
      };
    }
  }

  private async runTests(projectPath: string): Promise<ValidationStep> {
    const startTime = Date.now();
    
    try {
      const output = execSync('npm test -- --passWithNoTests', {
        cwd: projectPath,
        encoding: 'utf-8',
        stdio: 'pipe',
        env: { ...process.env, CI: 'true' },
      });

      const testMatch = output.match(/Tests:\\s+(\\d+) passed/);
      const testCount = testMatch ? testMatch[1] : '0';
      
      return {
        name: 'Tests',
        success: true,
        message: `${testCount} tests passed`,
        duration: Date.now() - startTime,
      };
    } catch (error: any) {
      return {
        name: 'Tests',
        success: false,
        message: 'Test suite failed',
        duration: Date.now() - startTime,
      };
    }
  }

  private async collectMetrics(projectPath: string): Promise<any> {
    const metrics = {
      buildTime: 0,
      bundleSize: 'N/A',
      typeCoverage: 0,
    };

    try {
      // Get build time from last build
      const buildStart = Date.now();
      execSync('npm run build', {
        cwd: projectPath,
        stdio: 'ignore',
      });
      metrics.buildTime = Date.now() - buildStart;

      // Try to get bundle size (Next.js specific)
      try {
        const buildOutput = execSync('cat .next/build-manifest.json', {
          cwd: projectPath,
          encoding: 'utf-8',
        });
        const manifest = JSON.parse(buildOutput);
        const pages = Object.keys(manifest.pages).length;
        metrics.bundleSize = `${pages} pages`;
      } catch {
        // Not a Next.js project or build output not available
      }

      // Get type coverage if available
      try {
        const typeCoverageOutput = execSync('npx type-coverage --detail', {
          cwd: projectPath,
          encoding: 'utf-8',
        });
        const coverageMatch = typeCoverageOutput.match(/(\\d+\\.\\d+)%/);
        if (coverageMatch) {
          metrics.typeCoverage = parseFloat(coverageMatch[1]);
        }
      } catch {
        // Type coverage not available
      }
    } catch (error) {
      this.logger.warn('Failed to collect some metrics');
    }

    return metrics;
  }
}