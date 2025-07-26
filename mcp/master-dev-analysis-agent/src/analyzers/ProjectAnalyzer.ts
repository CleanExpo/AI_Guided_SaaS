import { glob } from 'glob';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Logger } from '../utils/logger.js';

interface ProjectAnalysis {
  phase: string;
  completionPercentage: number;
  productionReadinessScore: number;
  missingElements: Array<{
    name: string;
    solution: string;
    priority: number;
  }>;
  architectureConsistency: string;
  technicalDebt: string[];
  scalabilityConcerns: string[];
  securityVulnerabilities: string[];
  metrics: {
    totalFiles: number;
    linesOfCode: number;
    testCoverage: number;
    dependencies: number;
  };
}

export class ProjectAnalyzer {
  private logger: Logger;

  constructor() {
    this.logger = new Logger('ProjectAnalyzer');
  }

  async analyze(projectPath: string, depth: string = 'comprehensive'): Promise<ProjectAnalysis> {
    this.logger.info(`Analyzing project at ${projectPath} with depth: ${depth}`);

    const [
      structure,
      dependencies,
      configuration,
      testingStatus,
      securityStatus
    ] = await Promise.all([
      this.analyzeStructure(projectPath),
      this.analyzeDependencies(projectPath),
      this.analyzeConfiguration(projectPath),
      this.analyzeTestingStatus(projectPath),
      this.analyzeSecurityStatus(projectPath)
    ]);

    const missingElements = await this.identifyMissingElements(projectPath);
    const metrics = await this.calculateMetrics(projectPath);
    
    const phase = this.determineProjectPhase(structure, testingStatus);
    const completionPercentage = this.calculateCompletion(structure, configuration, testingStatus);
    const productionReadinessScore = this.calculateProductionReadiness(
      structure,
      configuration,
      testingStatus,
      securityStatus
    );

    return {
      phase,
      completionPercentage,
      productionReadinessScore,
      missingElements,
      architectureConsistency: structure.consistency,
      technicalDebt: this.identifyTechnicalDebt(structure, dependencies),
      scalabilityConcerns: this.identifyScalabilityConcerns(structure, configuration),
      securityVulnerabilities: securityStatus.vulnerabilities,
      metrics
    };
  }

  private async analyzeStructure(projectPath: string): Promise<any> {
    const files = await glob('**/*.{js,ts,jsx,tsx,json,yml,yaml}', {
      cwd: projectPath,
      ignore: ['node_modules/**', 'dist/**', 'build/**']
    });

    const structure = {
      hasSourceDirectory: files.some(f => f.startsWith('src/')),
      hasTestDirectory: files.some(f => f.includes('test') || f.includes('spec')),
      hasConfigFiles: files.some(f => f.match(/\.(config|rc)\./)),
      hasBuildFiles: files.some(f => f.match(/webpack|rollup|vite|next\.config/)),
      consistency: 'Good' // Simplified for now
    };

    return structure;
  }

  private async analyzeDependencies(projectPath: string): Promise<any> {
    try {
      const packageJsonPath = path.join(projectPath, 'package.json');
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
      
      return {
        total: Object.keys(packageJson.dependencies || {}).length +
               Object.keys(packageJson.devDependencies || {}).length,
        outdated: [], // Would need npm outdated integration
        security: []  // Would need npm audit integration
      };
    } catch (error) {
      this.logger.error('Failed to analyze dependencies:', error);
      return { total: 0, outdated: [], security: [] };
    }
  }

  private async analyzeConfiguration(projectPath: string): Promise<any> {
    const configFiles = await glob('**/*.{env,env.*,config.js,config.ts}', {
      cwd: projectPath,
      ignore: ['node_modules/**']
    });

    return {
      hasEnvFiles: configFiles.some(f => f.includes('.env')),
      hasProductionConfig: configFiles.some(f => f.includes('production')),
      hasDockerConfig: await this.fileExists(path.join(projectPath, 'Dockerfile')),
      hasCICD: await this.fileExists(path.join(projectPath, '.github/workflows')) ||
                await this.fileExists(path.join(projectPath, '.gitlab-ci.yml'))
    };
  }

  private async analyzeTestingStatus(projectPath: string): Promise<any> {
    const testFiles = await glob('**/*.{test,spec}.{js,ts,jsx,tsx}', {
      cwd: projectPath,
      ignore: ['node_modules/**']
    });

    return {
      hasTests: testFiles.length > 0,
      testCount: testFiles.length,
      hasE2ETests: testFiles.some(f => f.includes('e2e') || f.includes('integration')),
      hasUnitTests: testFiles.some(f => !f.includes('e2e') && !f.includes('integration')),
      coverage: 0 // Would need test coverage report integration
    };
  }

  private async analyzeSecurityStatus(projectPath: string): Promise<any> {
    const vulnerabilities: string[] = [];

    // Check for common security issues
    const files = await glob('**/*.{js,ts,jsx,tsx}', {
      cwd: projectPath,
      ignore: ['node_modules/**']
    });

    for (const file of files.slice(0, 10)) { // Sample first 10 files
      const content = await fs.readFile(path.join(projectPath, file), 'utf-8');
      
      if (content.includes('eval(')) {
        vulnerabilities.push(`Potential eval() usage in ${file}`);
      }
      if (content.match(/api[_-]?key|secret|password/i) && !file.includes('.env')) {
        vulnerabilities.push(`Potential hardcoded credentials in ${file}`);
      }
    }

    return { vulnerabilities };
  }

  private async identifyMissingElements(projectPath: string): Promise<any[]> {
    const missing = [];

    // Check for essential files
    const essentialFiles = [
      { file: 'README.md', name: 'Documentation', solution: 'Create README.md with project overview' },
      { file: '.gitignore', name: 'Git ignore file', solution: 'Create .gitignore to exclude sensitive files' },
      { file: '.env.example', name: 'Environment example', solution: 'Create .env.example with required variables' },
      { file: 'LICENSE', name: 'License file', solution: 'Add appropriate license file' }
    ];

    for (const essential of essentialFiles) {
      if (!await this.fileExists(path.join(projectPath, essential.file))) {
        missing.push({
          name: essential.name,
          solution: essential.solution,
          priority: 8
        });
      }
    }

    return missing;
  }

  private async calculateMetrics(projectPath: string): Promise<any> {
    const files = await glob('**/*.{js,ts,jsx,tsx}', {
      cwd: projectPath,
      ignore: ['node_modules/**', 'dist/**', 'build/**']
    });

    let totalLines = 0;
    for (const file of files) {
      try {
        const content = await fs.readFile(path.join(projectPath, file), 'utf-8');
        totalLines += content.split('\\n').length;
      } catch (error) {
        // Skip files that can't be read
      }
    }

    return {
      totalFiles: files.length,
      linesOfCode: totalLines,
      testCoverage: 0, // Would need actual coverage data
      dependencies: 0  // Set from dependency analysis
    };
  }

  private determineProjectPhase(structure: any, testing: any): string {
    if (!structure.hasSourceDirectory) return 'Initial Setup';
    if (!testing.hasTests) return 'Development';
    if (!testing.hasE2ETests) return 'Testing';
    return 'Pre-Production';
  }

  private calculateCompletion(structure: any, config: any, testing: any): number {
    let score = 0;
    if (structure.hasSourceDirectory) score += 25;
    if (structure.hasTestDirectory) score += 15;
    if (config.hasEnvFiles) score += 10;
    if (config.hasProductionConfig) score += 10;
    if (testing.hasTests) score += 20;
    if (testing.hasE2ETests) score += 10;
    if (config.hasDockerConfig) score += 5;
    if (config.hasCICD) score += 5;
    return score;
  }

  private calculateProductionReadiness(structure: any, config: any, testing: any, security: any): number {
    let score = 0;
    if (structure.consistency === 'Good') score += 2;
    if (config.hasProductionConfig) score += 2;
    if (config.hasDockerConfig) score += 1;
    if (config.hasCICD) score += 2;
    if (testing.hasE2ETests) score += 2;
    if (security.vulnerabilities.length === 0) score += 1;
    return score;
  }

  private identifyTechnicalDebt(structure: any, dependencies: any): string[] {
    const debt = [];
    if (!structure.consistency || structure.consistency !== 'Good') {
      debt.push('Inconsistent project structure');
    }
    if (dependencies.outdated.length > 0) {
      debt.push(`${dependencies.outdated.length} outdated dependencies`);
    }
    return debt;
  }

  private identifyScalabilityConcerns(structure: any, config: any): string[] {
    const concerns = [];
    if (!config.hasDockerConfig) {
      concerns.push('No containerization setup');
    }
    if (!structure.hasTestDirectory) {
      concerns.push('Limited test coverage for scaling confidence');
    }
    return concerns;
  }

  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async identifyMissingComponents(analysis: any, _componentTypes?: string[]): Promise<any> {
    // Implementation for identifying missing components by type
    return {
      config: analysis.missingElements.filter((e: any) => e.name.includes('config')),
      security: analysis.securityVulnerabilities,
      testing: analysis.technicalDebt.filter((d: string) => d.includes('test')),
      documentation: analysis.missingElements.filter((e: any) => e.name.includes('Documentation')),
      monitoring: [],
      deployment: analysis.missingElements.filter((e: any) => e.name.includes('Docker') || e.name.includes('CI'))
    };
  }

  async assessProductionReadiness(analysis: any, _checklistType?: string): Promise<any> {
    const completed = [];
    const missing = [];
    const recommendations = [];

    // Basic checks
    if (analysis.metrics.testCoverage > 70) {
      completed.push('Adequate test coverage');
    } else {
      missing.push('Test coverage below 70%');
      recommendations.push('Increase test coverage to at least 70%');
    }

    if (analysis.securityVulnerabilities.length === 0) {
      completed.push('No critical security vulnerabilities');
    } else {
      missing.push('Security vulnerabilities detected');
      recommendations.push('Address all security vulnerabilities before deployment');
    }

    const score = (completed.length / (completed.length + missing.length)) * 100;
    const status = score >= 80 ? 'Ready' : score >= 60 ? 'Almost Ready' : 'Not Ready';

    return {
      score: Math.round(score),
      status,
      completed,
      missing,
      recommendations
    };
  }
}