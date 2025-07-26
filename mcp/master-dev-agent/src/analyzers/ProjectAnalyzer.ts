import { glob } from 'glob';
import * as fs from 'fs/promises';
import * as path from 'path';

export interface ProjectAnalysis {
  phase: 'development' | 'testing' | 'pre-production' | 'production';
  completionPercentage: number;
  structure: ProjectStructure;
  missingComponents: string[];
  technologyStack: TechStack;
  fileStats: FileStats;
}

interface ProjectStructure {
  hasSourceCode: boolean;
  hasTests: boolean;
  hasDocumentation: boolean;
  hasConfiguration: boolean;
  hasCICD: boolean;
  hasDatabase: boolean;
  hasAPI: boolean;
  hasFrontend: boolean;
}

interface TechStack {
  languages: string[];
  frameworks: string[];
  databases: string[];
  tools: string[];
}

interface FileStats {
  totalFiles: number;
  sourceFiles: number;
  testFiles: number;
  configFiles: number;
  documentationFiles: number;
}

export class ProjectAnalyzer {
  async analyze(projectPath: string, depth: string = 'standard'): Promise<ProjectAnalysis> {
    const structure = await this.analyzeStructure(projectPath);
    const techStack = await this.detectTechStack(projectPath);
    const fileStats = await this.gatherFileStats(projectPath);
    const missingComponents = this.identifyMissingComponents(structure, techStack);
    const phase = this.determineProjectPhase(structure, fileStats);
    const completionPercentage = this.calculateCompletion(structure, missingComponents);

    return {
      phase,
      completionPercentage,
      structure,
      missingComponents,
      technologyStack: techStack,
      fileStats,
    };
  }

  private async analyzeStructure(projectPath: string): Promise<ProjectStructure> {
    const checks = {
      hasSourceCode: await this.checkExists(projectPath, ['src/**/*.{js,ts,jsx,tsx}', 'lib/**/*.{js,ts}']),
      hasTests: await this.checkExists(projectPath, ['**/*.{test,spec}.{js,ts,jsx,tsx}', 'tests/**/*']),
      hasDocumentation: await this.checkExists(projectPath, ['README.md', 'docs/**/*', '*.md']),
      hasConfiguration: await this.checkExists(projectPath, ['.env*', 'config/**/*', '*.config.{js,ts}']),
      hasCICD: await this.checkExists(projectPath, ['.github/workflows/*', '.gitlab-ci.yml', 'Jenkinsfile']),
      hasDatabase: await this.checkExists(projectPath, ['**/migrations/*', '**/schema.*', 'prisma/**/*']),
      hasAPI: await this.checkExists(projectPath, ['**/api/**/*', '**/routes/**/*', '**/controllers/**/*']),
      hasFrontend: await this.checkExists(projectPath, ['**/pages/**/*', '**/components/**/*', 'public/**/*']),
    };

    return checks;
  }

  private async detectTechStack(projectPath: string): Promise<TechStack> {
    const techStack: TechStack = {
      languages: [],
      frameworks: [],
      databases: [],
      tools: [],
    };

    // Check package.json for dependencies
    const packageJsonPath = path.join(projectPath, 'package.json');
    try {
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

      // Detect frameworks
      if (deps.next) techStack.frameworks.push('Next.js');
      if (deps.react) techStack.frameworks.push('React');
      if (deps.vue) techStack.frameworks.push('Vue');
      if (deps.express) techStack.frameworks.push('Express');
      if (deps.fastify) techStack.frameworks.push('Fastify');

      // Detect databases
      if (deps.mongodb || deps.mongoose) techStack.databases.push('MongoDB');
      if (deps.pg || deps.postgresql) techStack.databases.push('PostgreSQL');
      if (deps.mysql || deps.mysql2) techStack.databases.push('MySQL');
      if (deps.redis) techStack.databases.push('Redis');
      if (deps.prisma || deps['@prisma/client']) techStack.databases.push('Prisma');

      // Detect tools
      if (deps.typescript) techStack.tools.push('TypeScript');
      if (deps.eslint) techStack.tools.push('ESLint');
      if (deps.jest || deps.vitest) techStack.tools.push('Testing Framework');
      if (deps.webpack || deps.vite) techStack.tools.push('Bundler');
    } catch (error) {
      // No package.json or error reading it
    }

    // Detect languages by file extensions
    const files = await glob('**/*.{js,ts,jsx,tsx,py,java,go,rs,cpp,c}', {
      cwd: projectPath,
      ignore: ['node_modules/**', 'dist/**', 'build/**'],
    });

    const extensions = new Set(files.map(f => path.extname(f)));
    if (extensions.has('.ts') || extensions.has('.tsx')) techStack.languages.push('TypeScript');
    if (extensions.has('.js') || extensions.has('.jsx')) techStack.languages.push('JavaScript');
    if (extensions.has('.py')) techStack.languages.push('Python');
    if (extensions.has('.java')) techStack.languages.push('Java');
    if (extensions.has('.go')) techStack.languages.push('Go');
    if (extensions.has('.rs')) techStack.languages.push('Rust');

    return techStack;
  }

  private async gatherFileStats(projectPath: string): Promise<FileStats> {
    const allFiles = await glob('**/*', {
      cwd: projectPath,
      ignore: ['node_modules/**', '.git/**', 'dist/**', 'build/**'],
      nodir: true,
    });

    const sourceFiles = allFiles.filter(f => 
      /\.(js|ts|jsx|tsx|py|java|go|rs|cpp|c)$/.test(f) && 
      !f.includes('test') && 
      !f.includes('spec')
    );

    const testFiles = allFiles.filter(f => 
      f.includes('test') || f.includes('spec') || f.includes('__tests__')
    );

    const configFiles = allFiles.filter(f => 
      f.includes('config') || f.endsWith('.json') || f.endsWith('.yml') || f.endsWith('.yaml')
    );

    const documentationFiles = allFiles.filter(f => f.endsWith('.md'));

    return {
      totalFiles: allFiles.length,
      sourceFiles: sourceFiles.length,
      testFiles: testFiles.length,
      configFiles: configFiles.length,
      documentationFiles: documentationFiles.length,
    };
  }

  private identifyMissingComponents(structure: ProjectStructure, techStack: TechStack): string[] {
    const missing: string[] = [];

    if (!structure.hasTests) missing.push('Test Suite');
    if (!structure.hasDocumentation) missing.push('Documentation');
    if (!structure.hasCICD) missing.push('CI/CD Pipeline');
    if (!structure.hasConfiguration) missing.push('Configuration Management');
    
    // Tech-specific checks
    if (techStack.frameworks.includes('Next.js') || techStack.frameworks.includes('React')) {
      if (!structure.hasConfiguration) missing.push('Environment Variables (.env files)');
    }

    if (structure.hasAPI && !structure.hasTests) {
      missing.push('API Tests');
    }

    return missing;
  }

  private determineProjectPhase(structure: ProjectStructure, fileStats: FileStats): ProjectAnalysis['phase'] {
    if (!structure.hasSourceCode || fileStats.sourceFiles < 5) {
      return 'development';
    }

    if (!structure.hasTests || fileStats.testFiles < fileStats.sourceFiles * 0.2) {
      return 'development';
    }

    if (!structure.hasCICD || !structure.hasConfiguration) {
      return 'testing';
    }

    if (!structure.hasDocumentation) {
      return 'pre-production';
    }

    return 'production';
  }

  private calculateCompletion(structure: ProjectStructure, missingComponents: string[]): number {
    const totalChecks = Object.keys(structure).length;
    const passedChecks = Object.values(structure).filter(v => v).length;
    const structureScore = (passedChecks / totalChecks) * 70;

    const missingPenalty = Math.min(missingComponents.length * 5, 30);
    
    return Math.max(0, Math.round(structureScore + 30 - missingPenalty));
  }

  private async checkExists(projectPath: string, patterns: string[]): Promise<boolean> {
    for (const pattern of patterns) {
      const files = await glob(pattern, {
        cwd: projectPath,
        ignore: ['node_modules/**', '.git/**'],
      });
      if (files.length > 0) return true;
    }
    return false;
  }
}