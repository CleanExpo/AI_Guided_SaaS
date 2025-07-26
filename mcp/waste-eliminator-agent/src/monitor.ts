import * as fs from 'fs/promises';
import * as path from 'path';
import { createHash } from 'crypto';
import { logger } from './utils/logger.js';
import { WasteAnalyzer } from './analyzer.js';
import { MonitoringConfig } from './types.js';

interface MonitoringSession {
  id: string;
  config: MonitoringConfig;
  intervalId: NodeJS.Timeout;
  lastChecksum: Map<string, string>;
  startTime: Date;
  checksPerformed: number;
  issuesFound: number;
}

export class ContinuousMonitor {
  private sessions: Map<string, MonitoringSession> = new Map();
  private analyzer: WasteAnalyzer;

  constructor() {
    this.analyzer = new WasteAnalyzer();
  }

  async startMonitoring(config: MonitoringConfig): Promise<string> {
    const sessionId = this.generateSessionId();
    
    logger.info(`Starting monitoring session ${sessionId} for ${config.projectPath}`);

    const session: MonitoringSession = {
      id: sessionId,
      config,
      intervalId: null as any,
      lastChecksum: new Map(),
      startTime: new Date(),
      checksPerformed: 0,
      issuesFound: 0,
    };

    // Perform initial scan
    await this.performCheck(session);

    // Set up interval
    session.intervalId = setInterval(() => {
      this.performCheck(session).catch(error => {
        logger.error(`Monitoring check failed for session ${sessionId}:`, error);
      });
    }, config.interval * 1000);

    this.sessions.set(sessionId, session);

    return sessionId;
  }

  async stopMonitoring(sessionId: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    
    if (!session) {
      logger.warn(`No monitoring session found with ID: ${sessionId}`);
      return false;
    }

    clearInterval(session.intervalId);
    this.sessions.delete(sessionId);
    
    logger.info(`Stopped monitoring session ${sessionId}`);
    return true;
  }

  async getStatus(sessionId: string): Promise<any> {
    const session = this.sessions.get(sessionId);
    
    if (!session) {
      return null;
    }

    return {
      id: session.id,
      projectPath: session.config.projectPath,
      interval: session.config.interval,
      startTime: session.startTime,
      checksPerformed: session.checksPerformed,
      issuesFound: session.issuesFound,
      uptime: Date.now() - session.startTime.getTime(),
      filesMonitored: session.lastChecksum.size,
    };
  }

  getAllSessions(): Array<{ id: string; status: any }> {
    return Array.from(this.sessions.keys()).map(id => ({
      id,
      status: this.getStatus(id),
    }));
  }

  private async performCheck(session: MonitoringSession) {
    session.checksPerformed++;
    
    try {
      const changedFiles = await this.detectChangedFiles(session);
      
      if (changedFiles.length === 0) {
        logger.debug(`No changes detected in session ${session.id}`);
        return;
      }

      logger.info(`Detected ${changedFiles.length} changed files in session ${session.id}`);

      // Analyze changed files for waste
      const issues: any[] = [];
      for (const file of changedFiles) {
        const analysis = await this.analyzer.analyzeProject(path.dirname(file), 'quick');
        issues.push(...analysis.issues.filter(issue => issue.file === file));
      }

      if (issues.length > 0) {
        session.issuesFound += issues.length;
        await this.reportIssues(session, issues);
      }

    } catch (error) {
      logger.error(`Check failed for session ${session.id}:`, error);
    }
  }

  private async detectChangedFiles(session: MonitoringSession): Promise<string[]> {
    const changedFiles: string[] = [];
    const files = await this.getMonitoredFiles(session.config.projectPath);

    for (const file of files) {
      try {
        const content = await fs.readFile(file, 'utf-8');
        const checksum = this.calculateChecksum(content);
        const lastChecksum = session.lastChecksum.get(file);

        if (lastChecksum && lastChecksum !== checksum) {
          changedFiles.push(file);
        }

        session.lastChecksum.set(file, checksum);
      } catch (error) {
        logger.error(`Failed to check file ${file}:`, error);
      }
    }

    return changedFiles;
  }

  private async getMonitoredFiles(projectPath: string): Promise<string[]> {
    const { glob } = await import('glob');
    const patterns = ['**/*.{ts,tsx,js,jsx}'];
    const ignorePatterns = [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.next/**',
    ];

    const files: string[] = [];
    
    for (const pattern of patterns) {
      const matches = await glob(pattern, {
        cwd: projectPath,
        ignore: ignorePatterns,
        absolute: true,
      });
      files.push(...matches);
    }

    return files;
  }

  private calculateChecksum(content: string): string {
    return createHash('md5').update(content).digest('hex');
  }

  private async reportIssues(session: MonitoringSession, issues: any[]) {
    const report = {
      sessionId: session.id,
      timestamp: new Date().toISOString(),
      projectPath: session.config.projectPath,
      issuesFound: issues.length,
      issues: issues.map(issue => ({
        type: issue.type,
        severity: issue.severity,
        file: issue.file,
        line: issue.line,
        message: issue.message,
      })),
    };

    logger.info(`Found ${issues.length} new issues in session ${session.id}`);

    // Send webhook if configured
    if (session.config.webhookUrl) {
      try {
        await this.sendWebhook(session.config.webhookUrl, report);
      } catch (error) {
        logger.error(`Failed to send webhook for session ${session.id}:`, error);
      }
    }

    // Save report to file
    const reportPath = path.join(
      session.config.projectPath,
      '.waste-eliminator',
      `report-${session.id}-${Date.now()}.json`
    );

    try {
      await fs.mkdir(path.dirname(reportPath), { recursive: true });
      await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
      logger.info(`Saved report to ${reportPath}`);
    } catch (error) {
      logger.error(`Failed to save report:`, error);
    }
  }

  private async sendWebhook(webhookUrl: string, data: any) {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.status} ${response.statusText}`);
    }

    logger.info(`Webhook sent successfully to ${webhookUrl}`);
  }

  private generateSessionId(): string {
    return `monitor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Graceful shutdown
  async shutdown() {
    logger.info('Shutting down all monitoring sessions...');
    
    for (const sessionId of this.sessions.keys()) {
      await this.stopMonitoring(sessionId);
    }
    
    logger.info('All monitoring sessions stopped');
  }
}