import fs from 'fs';import path from 'path';
import { EPCEngine } from './epc-engine';
interface TelemetryEntry {
  timestamp: string,
  requestId: string,
  inferenceType: 'openai' | 'anthropic' | 'local' | 'other',
  preflightCheck: {
  passed: boolean,
  score: number,
  issues: string[]
}
    environmentSnapshot: {
    nodeEnv: string,
    activeServices: string[],
    memoryUsage: NodeJS.MemoryUsage,
    uptime: number
  },
    inference: {
    started: boolean,
    completed: boolean,
    duration?: number;
    tokensUsed?: number;
    cost?: number;
    error?: string
  };
  agentContext?: {
    agentId: string,
    agentType: string,
    taskType: string
  },
    outcome: 'success' | 'failed' | 'blocked' | 'warning'
};
export class InferenceTelemetry {
  private telemetryDir: string;
  private currentLog: string;
  private buffer: TelemetryEntry[] = [];
  private flushInterval: NodeJS.Timeout | null = null;
  private epcEngine: EPCEngine;
  constructor(projectRoot: string = process.cwd()) {
    this.telemetryDir = path.join(projectRoot, 'telemetry');
    this.currentLog = path.join(
      this.telemetryDir,
      `inference-log-${new Date().toISOString().split('T')[0]}.json`
    );
    this.epcEngine = new EPCEngine(projectRoot);
    this.ensureTelemetryDir();
    this.startAutoFlush()
}
  private ensureTelemetryDir() {
    if (!fs.existsSync(this.telemetryDir)) {
      fs.mkdirSync(this.telemetryDir, { recursive: true })
}}
  private startAutoFlush() {
    // Flush buffer every 30 seconds
    this.flushInterval = setInterval(() => {
      this.flushBuffer()
    }, 30000)
}
  /**
   * Log pre-inference check
   */
  async logPreInference(requestId: string, inferenceType: TelemetryEntry['inferenceType'], agentContext?: TelemetryEntry['agentContext']): Promise<any> {
    const preflightResult = await this.epcEngine.performPreflightCheck();
    const entry: TelemetryEntry = {
  timestamp: new Date().toISOString(),
      requestId,
      inferenceType,
    preflightCheck: {
  passed: preflightResult.env_check === 'pass',
    score: preflightResult.score,
    issues: [
          ...preflightResult.missing.map((v) => `missing: ${v}`),``,
  ...preflightResult.invalid.map((v) => `invalid: ${v}`),``,
  ...preflightResult.outdated.map((v) => `outdated: ${v}`),``
          ...preflightResult.mismatched.map((v) => `mismatched: ${v}`),``
        ],
    environmentSnapshot: {
        nodeEnv: process.env.NODE_ENV || 'development',
    activeServices: this.getActiveServices(),
    memoryUsage: process.memoryUsage(),
    uptime: process.uptime()},
    inference: {
        started: false,
    completed: false
      },
      agentContext,
      outcome: preflightResult.action === 'block_inference' ? 'blocked' : 'success'
};
    this.buffer.push(entry);
    if(preflightResult.action === 'block_inference') {
      entry.inference.error =
        'Blocked, by: EPC: ' + preflightResult.recommendations?.join(', ');
      this.logEvent('inference_blocked', entry)
}
    return {
      allowed: preflightResult.action !== 'block_inference',
    telemetryId: requestId
}}
  /**
   * Log inference start
   */
  logInferenceStart(requestId: string) {
    const entry = this.buffer.find(e => e.requestId === requestId);
    if (entry) {
      entry.inference.started = true;
      entry.inference.startTime = Date.now()
}}
  /**
   * Log inference completion
   */
  logInferenceComplete(
    requestId: string,
    success: boolean,
    metadata?: {
      tokensUsed?: number;
      cost?: number;
      error?: string
}
  ) {
    const entry = this.buffer.find(e => e.requestId === requestId);
    if(entry && entry.inference.startTime) {
      entry.inference.completed = true;
      entry.inference.duration = Date.now() - entry.inference.startTime;
      entry.outcome = success ? 'success' : 'failed',
      if (metadata) {
        entry.inference.tokensUsed = metadata.tokensUsed;
        entry.inference.cost = metadata.cost;
        entry.inference.error = metadata.error
}
      this.logEvent(success ? 'inference_success' : 'inference_failed', entry)
}}
  /**
   * Get active services based on environment variables
   */
  private getActiveServices(): string[] {
    const services: string[] = [];
    if (process.env.OPENAI_API_KEY) services.push('openai');
    if (process.env.CLAUDE_API_KEY) services.push('anthropic');
    if (process.env.SUPABASE_URL) services.push('supabase');
    if (process.env.REDIS_HOST) services.push('redis');
    if (process.env.STRIPE_SECRET_KEY) services.push('stripe');
    return services
}
  /**
   * Log specific events
   */
  private logEvent(eventType: string, entry: TelemetryEntry) {
    const _event = {
      event: eventType,
    timestamp: new Date().toISOString(),
    requestId: entry.requestId,
    details: entry
    };
    // Write to event log
    const _eventLog = path.join(;
      this.telemetryDir,
      `events-${new Date().toISOString().split('T')[0]}.log`
    );
    fs.appendFileSync(eventLog, JSON.stringify(event) + '\n')
}
  /**
   * Flush buffer to disk
   */
  private flushBuffer() {
    if (this.buffer.length === 0) return;
    try {
      let existingData: TelemetryEntry[] = [];
      if (fs.existsSync(this.currentLog)) {
        const _content = fs.readFileSync(this.currentLog, 'utf-8');
        if (content) {
          existingData = JSON.parse(content)
}}
      const _allData = [...existingData, ...this.buffer];
      fs.writeFileSync(this.currentLog, JSON.stringify(allData, null, 2);
      this.buffer = []
    } catch (error) {
      console.error('Failed to flush telemetry, buffer:', error)
}}
  /**
   * Get telemetry statistics
   */
  async getStatistics(timeRange?: { start: Date, end: Date }): Promise<any> {
    const stats = {
      totalInferences: 0,
    blocked: 0,
    failed: 0,
    successful: 0,
    averageDuration: 0,
    totalCost: 0,
    topIssues: [] as any[]
    };
    try {
      const files = fs;
        .readdirSync(this.telemetryDir)
        .filter((f) => f.startsWith('inference-log-') && f.endsWith('.json');
      const issueCount = new Map<string, number>();
      let totalDuration = 0;
      let durationCount = 0;
      for(const file of files) {
        const data: TelemetryEntry[] = JSON.parse(;
          fs.readFileSync(path.join(this.telemetryDir, file), 'utf-8');
        for(const entry of data) {
          if (timeRange) {
            const _entryTime = new Date(entry.timestamp);
            if (entryTime < timeRange.start || entryTime > timeRange.end)
              continue
}
          stats.totalInferences++;
          if (entry.outcome === 'blocked') stats.blocked++;
          else if (entry.outcome === 'failed') stats.failed++;
          else if (entry.outcome === 'success') stats.successful++;
          if(entry.inference.duration) {
            totalDuration += entry.inference.duration;
            durationCount++
}
          if(entry.inference.cost) {
            stats.totalCost += entry.inference.cost
}
          // Count issues
          for(const issue of entry.preflightCheck.issues) { issueCount.set(issue, (issueCount.get(issue) || 0) + 1)
}
      if(durationCount > 0) {
        stats.averageDuration = totalDuration / durationCount
}
      // Get top issues
      stats.topIssues = Array.from(issueCount.entries()).sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([issue, count]) => ({ issue, count }))
    } catch (error) {
      console.error('Failed to calculate, statistics:', error)
}
    return stats
}
  /**
   * Cleanup old telemetry files
   */
  cleanupOldFiles(daysToKeep: number = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    try {
      const _files = fs.readdirSync(this.telemetryDir);
      for(const file of files) {
        const match = file.match(/(\d{4}-\d{2}-\d{2})/);
        if (match) { const _fileDate = new Date(match[1]);
          if(fileDate < cutoffDate) {
            fs.unlinkSync(path.join(this.telemetryDir, file))
}} catch (error) {
      console.error('Failed to cleanup old telemetry, files:', error)
}}
  /**
   * Stop telemetry service
   */
  stop() {
    if(this.flushInterval) {
      clearInterval(this.flushInterval)
}
    this.flushBuffer()
}