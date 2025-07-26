import * as fs from 'fs/promises';
import * as path from 'path';
import { glob } from 'glob';

export interface ProductionValidation {
  score: number;
  status: 'ready' | 'warnings' | 'not-ready';
  criticalIssues: ValidationIssue[];
  warnings: ValidationIssue[];
  passed: string[];
  checklist: ChecklistItem[];
}

interface ValidationIssue {
  category: string;
  title: string;
  description: string;
  impact: 'critical' | 'high' | 'medium' | 'low';
  fix?: string;
  effort?: string;
}

interface ChecklistItem {
  category: string;
  item: string;
  status: 'pass' | 'fail' | 'warning';
  details?: string;
}

export class ProductionValidator {
  async validate(projectPath: string, environment: string = 'production'): Promise<ProductionValidation> {
    const checklist = await this.runProductionChecklist(projectPath, environment);
    const criticalIssues = checklist.filter(item => item.status === 'fail' && this.isCritical(item));
    const warnings = checklist.filter(item => item.status === 'warning' || (item.status === 'fail' && !this.isCritical(item)));
    const passed = checklist.filter(item => item.status === 'pass');

    const score = this.calculateProductionScore(checklist);
    const status = this.determineStatus(score, criticalIssues.length);

    return {
      score,
      status,
      criticalIssues: this.convertToIssues(criticalIssues, 'critical'),
      warnings: this.convertToIssues(warnings, 'warning'),
      passed: passed.map(item => `${item.category}: ${item.item}`),
      checklist,
    };
  }

  private async runProductionChecklist(projectPath: string, environment: string): Promise<ChecklistItem[]> {
    const checklist: ChecklistItem[] = [];

    // Environment Configuration
    checklist.push(...await this.checkEnvironmentConfig(projectPath));

    // Security
    checklist.push(...await this.checkSecurity(projectPath));

    // Performance
    checklist.push(...await this.checkPerformance(projectPath));

    // Error Handling
    checklist.push(...await this.checkErrorHandling(projectPath));

    // Monitoring & Logging
    checklist.push(...await this.checkMonitoring(projectPath));

    // Database
    checklist.push(...await this.checkDatabase(projectPath));

    // Dependencies
    checklist.push(...await this.checkDependencies(projectPath));

    // Build & Deployment
    checklist.push(...await this.checkBuildDeployment(projectPath));

    // Backup & Recovery
    checklist.push(...await this.checkBackupRecovery(projectPath));

    // Scalability
    checklist.push(...await this.checkScalability(projectPath));

    return checklist;
  }

  private async checkEnvironmentConfig(projectPath: string): Promise<ChecklistItem[]> {
    const items: ChecklistItem[] = [];

    // Check for environment files
    const envFiles = ['.env.example', '.env.production'];
    for (const envFile of envFiles) {
      const exists = await this.fileExists(path.join(projectPath, envFile));
      items.push({
        category: 'Environment',
        item: `${envFile} exists`,
        status: exists ? 'pass' : 'fail',
        details: exists ? undefined : `Missing ${envFile} for production configuration`,
      });
    }

    // Check for sensitive data in code
    const hasSensitiveData = await this.checkForSensitiveData(projectPath);
    items.push({
      category: 'Environment',
      item: 'No hardcoded secrets',
      status: hasSensitiveData ? 'fail' : 'pass',
      details: hasSensitiveData ? 'Found potential hardcoded secrets in code' : undefined,
    });

    // Check environment validation
    const hasEnvValidation = await this.checkForEnvValidation(projectPath);
    items.push({
      category: 'Environment',
      item: 'Environment validation',
      status: hasEnvValidation ? 'pass' : 'warning',
      details: hasEnvValidation ? undefined : 'No environment variable validation found',
    });

    return items;
  }

  private async checkSecurity(projectPath: string): Promise<ChecklistItem[]> {
    const items: ChecklistItem[] = [];

    // Check for security headers
    const hasSecurityHeaders = await this.checkForSecurityHeaders(projectPath);
    items.push({
      category: 'Security',
      item: 'Security headers configured',
      status: hasSecurityHeaders ? 'pass' : 'fail',
      details: hasSecurityHeaders ? undefined : 'Missing security headers (CSP, HSTS, etc.)',
    });

    // Check for authentication
    const hasAuth = await this.checkForAuthentication(projectPath);
    items.push({
      category: 'Security',
      item: 'Authentication implemented',
      status: hasAuth ? 'pass' : 'warning',
      details: hasAuth ? undefined : 'No authentication system detected',
    });

    // Check for input validation
    const hasValidation = await this.checkForInputValidation(projectPath);
    items.push({
      category: 'Security',
      item: 'Input validation',
      status: hasValidation ? 'pass' : 'fail',
      details: hasValidation ? undefined : 'Insufficient input validation detected',
    });

    // Check for HTTPS
    items.push({
      category: 'Security',
      item: 'HTTPS enforcement',
      status: 'warning',
      details: 'Ensure HTTPS is enforced in production',
    });

    return items;
  }

  private async checkPerformance(projectPath: string): Promise<ChecklistItem[]> {
    const items: ChecklistItem[] = [];

    // Check for caching
    const hasCaching = await this.checkForCaching(projectPath);
    items.push({
      category: 'Performance',
      item: 'Caching strategy',
      status: hasCaching ? 'pass' : 'warning',
      details: hasCaching ? undefined : 'No caching implementation detected',
    });

    // Check for compression
    const hasCompression = await this.checkForCompression(projectPath);
    items.push({
      category: 'Performance',
      item: 'Response compression',
      status: hasCompression ? 'pass' : 'warning',
      details: hasCompression ? undefined : 'Response compression not configured',
    });

    // Check for optimization
    const hasOptimization = await this.checkForOptimization(projectPath);
    items.push({
      category: 'Performance',
      item: 'Build optimization',
      status: hasOptimization ? 'pass' : 'warning',
      details: hasOptimization ? undefined : 'Build optimization not configured',
    });

    return items;
  }

  private async checkErrorHandling(projectPath: string): Promise<ChecklistItem[]> {
    const items: ChecklistItem[] = [];

    // Check for global error handler
    const hasGlobalErrorHandler = await this.checkForGlobalErrorHandler(projectPath);
    items.push({
      category: 'Error Handling',
      item: 'Global error handler',
      status: hasGlobalErrorHandler ? 'pass' : 'fail',
      details: hasGlobalErrorHandler ? undefined : 'Missing global error handler',
    });

    // Check for error boundaries (React)
    const hasErrorBoundaries = await this.checkForErrorBoundaries(projectPath);
    items.push({
      category: 'Error Handling',
      item: 'Error boundaries',
      status: hasErrorBoundaries ? 'pass' : 'warning',
      details: hasErrorBoundaries ? undefined : 'No React error boundaries found',
    });

    // Check for proper error responses
    const hasProperErrorResponses = await this.checkForProperErrorResponses(projectPath);
    items.push({
      category: 'Error Handling',
      item: 'Structured error responses',
      status: hasProperErrorResponses ? 'pass' : 'warning',
      details: hasProperErrorResponses ? undefined : 'Inconsistent error response format',
    });

    return items;
  }

  private async checkMonitoring(projectPath: string): Promise<ChecklistItem[]> {
    const items: ChecklistItem[] = [];

    // Check for logging
    const hasLogging = await this.checkForLogging(projectPath);
    items.push({
      category: 'Monitoring',
      item: 'Structured logging',
      status: hasLogging ? 'pass' : 'fail',
      details: hasLogging ? undefined : 'No structured logging implementation',
    });

    // Check for health endpoints
    const hasHealthEndpoints = await this.checkForHealthEndpoints(projectPath);
    items.push({
      category: 'Monitoring',
      item: 'Health check endpoints',
      status: hasHealthEndpoints ? 'pass' : 'fail',
      details: hasHealthEndpoints ? undefined : 'Missing health check endpoints',
    });

    // Check for metrics
    const hasMetrics = await this.checkForMetrics(projectPath);
    items.push({
      category: 'Monitoring',
      item: 'Application metrics',
      status: hasMetrics ? 'pass' : 'warning',
      details: hasMetrics ? undefined : 'No metrics collection configured',
    });

    return items;
  }

  private async checkDatabase(projectPath: string): Promise<ChecklistItem[]> {
    const items: ChecklistItem[] = [];

    // Check for migrations
    const hasMigrations = await this.checkForMigrations(projectPath);
    items.push({
      category: 'Database',
      item: 'Database migrations',
      status: hasMigrations ? 'pass' : 'warning',
      details: hasMigrations ? undefined : 'No database migration system found',
    });

    // Check for connection pooling
    const hasConnectionPooling = await this.checkForConnectionPooling(projectPath);
    items.push({
      category: 'Database',
      item: 'Connection pooling',
      status: hasConnectionPooling ? 'pass' : 'warning',
      details: hasConnectionPooling ? undefined : 'Database connection pooling not configured',
    });

    // Check for backups
    items.push({
      category: 'Database',
      item: 'Backup strategy',
      status: 'warning',
      details: 'Ensure database backup strategy is in place',
    });

    return items;
  }

  private async checkDependencies(projectPath: string): Promise<ChecklistItem[]> {
    const items: ChecklistItem[] = [];

    // Check for lock file
    const hasLockFile = await this.checkForLockFile(projectPath);
    items.push({
      category: 'Dependencies',
      item: 'Lock file present',
      status: hasLockFile ? 'pass' : 'fail',
      details: hasLockFile ? undefined : 'Missing package lock file',
    });

    // Check for production dependencies
    const hasProductionDeps = await this.checkProductionDependencies(projectPath);
    items.push({
      category: 'Dependencies',
      item: 'Production dependencies',
      status: hasProductionDeps ? 'pass' : 'warning',
      details: hasProductionDeps ? undefined : 'Dev dependencies in production',
    });

    return items;
  }

  private async checkBuildDeployment(projectPath: string): Promise<ChecklistItem[]> {
    const items: ChecklistItem[] = [];

    // Check for build script
    const hasBuildScript = await this.checkForBuildScript(projectPath);
    items.push({
      category: 'Build & Deploy',
      item: 'Build script',
      status: hasBuildScript ? 'pass' : 'fail',
      details: hasBuildScript ? undefined : 'No build script in package.json',
    });

    // Check for start script
    const hasStartScript = await this.checkForStartScript(projectPath);
    items.push({
      category: 'Build & Deploy',
      item: 'Start script',
      status: hasStartScript ? 'pass' : 'fail',
      details: hasStartScript ? undefined : 'No start script in package.json',
    });

    // Check for deployment config
    const hasDeployConfig = await this.checkForDeploymentConfig(projectPath);
    items.push({
      category: 'Build & Deploy',
      item: 'Deployment configuration',
      status: hasDeployConfig ? 'pass' : 'warning',
      details: hasDeployConfig ? undefined : 'No deployment configuration found',
    });

    return items;
  }

  private async checkBackupRecovery(projectPath: string): Promise<ChecklistItem[]> {
    const items: ChecklistItem[] = [];

    items.push({
      category: 'Backup & Recovery',
      item: 'Disaster recovery plan',
      status: 'warning',
      details: 'Ensure disaster recovery plan is documented',
    });

    items.push({
      category: 'Backup & Recovery',
      item: 'Data backup strategy',
      status: 'warning',
      details: 'Verify automated backup procedures',
    });

    return items;
  }

  private async checkScalability(projectPath: string): Promise<ChecklistItem[]> {
    const items: ChecklistItem[] = [];

    // Check for stateless design
    const isStateless = await this.checkForStatelessDesign(projectPath);
    items.push({
      category: 'Scalability',
      item: 'Stateless architecture',
      status: isStateless ? 'pass' : 'warning',
      details: isStateless ? undefined : 'Application may not be stateless',
    });

    // Check for horizontal scaling readiness
    items.push({
      category: 'Scalability',
      item: 'Horizontal scaling ready',
      status: 'warning',
      details: 'Verify application can scale horizontally',
    });

    return items;
  }

  // Helper methods
  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  private async checkForSensitiveData(projectPath: string): Promise<boolean> {
    const files = await glob('**/*.{js,ts,jsx,tsx}', {
      cwd: projectPath,
      ignore: ['node_modules/**', 'dist/**', 'build/**'],
    });

    const sensitivePatterns = [
      /api[_-]?key\s*[:=]\s*["'][^"']+["']/i,
      /password\s*[:=]\s*["'][^"']+["']/i,
      /secret\s*[:=]\s*["'][^"']+["']/i,
      /token\s*[:=]\s*["'][^"']+["']/i,
    ];

    for (const file of files) {
      const content = await fs.readFile(path.join(projectPath, file), 'utf-8');
      for (const pattern of sensitivePatterns) {
        if (pattern.test(content) && !content.includes('process.env')) {
          return true;
        }
      }
    }

    return false;
  }

  private async checkForEnvValidation(projectPath: string): Promise<boolean> {
    const patterns = ['env.', 'validateEnv', 'envSchema', 'z.object'];
    return this.checkForPatterns(projectPath, patterns);
  }

  private async checkForSecurityHeaders(projectPath: string): Promise<boolean> {
    const patterns = ['helmet', 'Content-Security-Policy', 'X-Frame-Options', 'HSTS'];
    return this.checkForPatterns(projectPath, patterns);
  }

  private async checkForAuthentication(projectPath: string): Promise<boolean> {
    const patterns = ['auth', 'jwt', 'session', 'passport', 'next-auth'];
    return this.checkForPatterns(projectPath, patterns);
  }

  private async checkForInputValidation(projectPath: string): Promise<boolean> {
    const patterns = ['joi', 'yup', 'zod', 'validate', 'sanitize'];
    return this.checkForPatterns(projectPath, patterns);
  }

  private async checkForCaching(projectPath: string): Promise<boolean> {
    const patterns = ['cache', 'redis', 'memcached', 'Cache-Control'];
    return this.checkForPatterns(projectPath, patterns);
  }

  private async checkForCompression(projectPath: string): Promise<boolean> {
    const patterns = ['compression', 'gzip', 'brotli', 'compress'];
    return this.checkForPatterns(projectPath, patterns);
  }

  private async checkForOptimization(projectPath: string): Promise<boolean> {
    const patterns = ['terser', 'minify', 'optimize', 'production', 'webpack.prod'];
    return this.checkForPatterns(projectPath, patterns);
  }

  private async checkForGlobalErrorHandler(projectPath: string): Promise<boolean> {
    const patterns = ['app.use((err', 'process.on(\'uncaughtException\'', 'window.onerror'];
    return this.checkForPatterns(projectPath, patterns);
  }

  private async checkForErrorBoundaries(projectPath: string): Promise<boolean> {
    const patterns = ['ErrorBoundary', 'componentDidCatch', 'getDerivedStateFromError'];
    return this.checkForPatterns(projectPath, patterns);
  }

  private async checkForProperErrorResponses(projectPath: string): Promise<boolean> {
    const patterns = ['status(400)', 'status(401)', 'status(404)', 'status(500)'];
    return this.checkForPatterns(projectPath, patterns);
  }

  private async checkForLogging(projectPath: string): Promise<boolean> {
    const patterns = ['winston', 'pino', 'bunyan', 'morgan', 'logger'];
    return this.checkForPatterns(projectPath, patterns);
  }

  private async checkForHealthEndpoints(projectPath: string): Promise<boolean> {
    const patterns = ['/health', '/healthz', '/ready', '/live'];
    return this.checkForPatterns(projectPath, patterns);
  }

  private async checkForMetrics(projectPath: string): Promise<boolean> {
    const patterns = ['prometheus', 'metrics', 'statsd', 'newrelic', 'datadog'];
    return this.checkForPatterns(projectPath, patterns);
  }

  private async checkForMigrations(projectPath: string): Promise<boolean> {
    const patterns = ['migration', 'migrate', 'knex', 'sequelize', 'typeorm', 'prisma'];
    return this.checkForPatterns(projectPath, patterns);
  }

  private async checkForConnectionPooling(projectPath: string): Promise<boolean> {
    const patterns = ['pool', 'poolSize', 'maxConnections', 'connectionLimit'];
    return this.checkForPatterns(projectPath, patterns);
  }

  private async checkForLockFile(projectPath: string): Promise<boolean> {
    const lockFiles = ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml'];
    for (const lockFile of lockFiles) {
      if (await this.fileExists(path.join(projectPath, lockFile))) {
        return true;
      }
    }
    return false;
  }

  private async checkProductionDependencies(projectPath: string): Promise<boolean> {
    try {
      const packageJson = JSON.parse(
        await fs.readFile(path.join(projectPath, 'package.json'), 'utf-8')
      );
      
      // Check if dev tools are in production dependencies
      const devTools = ['webpack', 'babel', 'eslint', 'jest', 'typescript'];
      const prodDeps = Object.keys(packageJson.dependencies || {});
      
      for (const tool of devTools) {
        if (prodDeps.some(dep => dep.includes(tool))) {
          return false;
        }
      }
      
      return true;
    } catch {
      return false;
    }
  }

  private async checkForBuildScript(projectPath: string): Promise<boolean> {
    try {
      const packageJson = JSON.parse(
        await fs.readFile(path.join(projectPath, 'package.json'), 'utf-8')
      );
      return !!packageJson.scripts?.build;
    } catch {
      return false;
    }
  }

  private async checkForStartScript(projectPath: string): Promise<boolean> {
    try {
      const packageJson = JSON.parse(
        await fs.readFile(path.join(projectPath, 'package.json'), 'utf-8')
      );
      return !!packageJson.scripts?.start;
    } catch {
      return false;
    }
  }

  private async checkForDeploymentConfig(projectPath: string): Promise<boolean> {
    const deployFiles = ['vercel.json', 'netlify.toml', 'Dockerfile', 'docker-compose.yml', 'heroku.yml'];
    for (const deployFile of deployFiles) {
      if (await this.fileExists(path.join(projectPath, deployFile))) {
        return true;
      }
    }
    return false;
  }

  private async checkForStatelessDesign(projectPath: string): Promise<boolean> {
    // Check for session storage patterns that indicate stateful design
    const statefulPatterns = ['express-session', 'session.save', 'req.session'];
    const hasStateful = await this.checkForPatterns(projectPath, statefulPatterns);
    return !hasStateful;
  }

  private async checkForPatterns(projectPath: string, patterns: string[]): Promise<boolean> {
    const files = await glob('**/*.{js,ts,jsx,tsx,json}', {
      cwd: projectPath,
      ignore: ['node_modules/**', 'dist/**', 'build/**'],
    });

    for (const file of files.slice(0, 100)) { // Limit to first 100 files for performance
      try {
        const content = await fs.readFile(path.join(projectPath, file), 'utf-8');
        for (const pattern of patterns) {
          if (content.includes(pattern)) {
            return true;
          }
        }
      } catch {
        // Ignore read errors
      }
    }

    return false;
  }

  private isCritical(item: ChecklistItem): boolean {
    const criticalItems = [
      'No hardcoded secrets',
      'Security headers configured',
      'Input validation',
      'Global error handler',
      'Structured logging',
      'Health check endpoints',
      'Lock file present',
      'Build script',
      'Start script',
    ];

    return criticalItems.some(critical => item.item.includes(critical));
  }

  private calculateProductionScore(checklist: ChecklistItem[]): number {
    const weights = {
      pass: 1,
      warning: 0.5,
      fail: 0,
    };

    const totalScore = checklist.reduce((score, item) => {
      const weight = this.isCritical(item) ? 2 : 1;
      return score + (weights[item.status] * weight);
    }, 0);

    const maxScore = checklist.reduce((max, item) => {
      const weight = this.isCritical(item) ? 2 : 1;
      return max + weight;
    }, 0);

    return Math.round((totalScore / maxScore) * 10);
  }

  private determineStatus(score: number, criticalIssues: number): ProductionValidation['status'] {
    if (criticalIssues > 0 || score < 5) return 'not-ready';
    if (score < 8) return 'warnings';
    return 'ready';
  }

  private convertToIssues(items: ChecklistItem[], type: 'critical' | 'warning'): ValidationIssue[] {
    return items.map(item => ({
      category: item.category,
      title: item.item,
      description: item.details || `${item.item} check failed`,
      impact: type === 'critical' ? 'critical' : 'medium',
      fix: this.getSuggestedFix(item),
      effort: this.getEstimatedEffort(item),
    }));
  }

  private getSuggestedFix(item: ChecklistItem): string | undefined {
    const fixes: Record<string, string> = {
      'No hardcoded secrets': 'Move all secrets to environment variables',
      'Security headers configured': 'npm install helmet && app.use(helmet())',
      'Global error handler': 'Implement Express error middleware or React error boundary',
      'Health check endpoints': 'Add GET /health endpoint returning { status: "ok" }',
      'Lock file present': 'Run npm install to generate package-lock.json',
      'Build script': 'Add "build": "next build" to package.json scripts',
      'Start script': 'Add "start": "node server.js" to package.json scripts',
    };

    return fixes[item.item];
  }

  private getEstimatedEffort(item: ChecklistItem): string {
    const efforts: Record<string, string> = {
      'No hardcoded secrets': '1-2 hours',
      'Security headers configured': '30 minutes',
      'Global error handler': '2-4 hours',
      'Health check endpoints': '1 hour',
      'Lock file present': '5 minutes',
      'Build script': '30 minutes',
      'Start script': '30 minutes',
    };

    return efforts[item.item] || '1-2 hours';
  }
}