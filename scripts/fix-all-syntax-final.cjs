const fs = require('fs');
const path = require('path');

// Fix analytics-engine.ts - remove carriage returns and fix method signatures
const enginePath = path.join(__dirname, '..', 'src/services/analytics-engine.ts');
if (fs.existsSync(enginePath)) {
  let content = fs.readFileSync(enginePath, 'utf8');
  
  // Remove all carriage returns
  content = content.replace(/\r/g, '');
  
  // Fix the trackPerformance method signature (lines 132-136)
  content = content.replace(
    /trackPerformance\(metric: 'page_load' \| 'api_response' \| 'render_time' \| 'interaction_delay',\s*value: number,\s*unit: 'ms' \| 's' = 'ms'\)\s*metadata\?: Record<string, any>\)\s*\): void {/gs,
    `trackPerformance(metric: 'page_load' | 'api_response' | 'render_time' | 'interaction_delay',
    value: number,
    unit: 'ms' | 's' = 'ms',
    metadata?: Record<string, any>
  ): void {`
  );
  
  // Fix the identify method (lines 140-147)
  content = content.replace(
    /identify\(userId: string, traits\?: Record<string, any>\): void {\s*this\.eventTracker\.setUserId\(userId\);\s*this\.track\({\s*type: 'user',\s*action: 'profile_update'\)\s*metadata: traits\)\s*}\);/gs,
    `identify(userId: string, traits?: Record<string, any>): void {
    this.eventTracker.setUserId(userId);
    this.track({
      type: 'user',
      action: 'profile_update',
      metadata: traits
    });`
  );
  
  // Fix the query method signature (lines 172-178)
  content = content.replace(
    /async query\(params: {\s*startDate: Date;\s*endDate: Date;\s*metrics\?: string\[\];\s*groupBy\?: 'hour' \| 'day' \| 'week' \| 'month';\s*filters\?: Record<string, any>;\)\s*}\): Promise<any> {/gs,
    `async query(params: {
    startDate: Date;
    endDate: Date;
    metrics?: string[];
    groupBy?: 'hour' | 'day' | 'week' | 'month';
    filters?: Record<string, any>;
  }): Promise<any> {`
  );
  
  // Fix getDashboardData method (lines 190-194)
  content = content.replace(
    /return this\.dashboardGenerator\.generateDashboardData\(allEvents,\s*metrics\)\s*this\.realtimeEvents\)\s*\);/gs,
    `return this.dashboardGenerator.generateDashboardData(allEvents,
      metrics,
      this.realtimeEvents
    );`
  );
  
  // Fix the filter in updateRealtimeEvents (lines 206-208)
  content = content.replace(
    /this\.realtimeEvents = this\.realtimeEvents\.filter\(e => e\.timestamp >= fiveMinutesAgo\)\s*\);/gs,
    `this.realtimeEvents = this.realtimeEvents.filter(e => e.timestamp >= fiveMinutesAgo);`
  );
  
  // Fix initializeAnalytics object spread (lines 301-303)
  content = content.replace(
    /aggregated: 365\s*}\)\s*\.\.\.config\)\s*}\);/gs,
    `aggregated: 365
      },
      ...config
    });`
  );
  
  fs.writeFileSync(enginePath, content);
  console.log('Fixed analytics-engine.ts');
}

// Fix IntegrationManager.ts - method signatures
const integrationPath = path.join(__dirname, '..', 'src/services/marketplace/IntegrationManager.ts');
if (fs.existsSync(integrationPath)) {
  let content = fs.readFileSync(integrationPath, 'utf8');
  
  // Fix validateCredentials method (lines 99-101)
  content = content.replace(
    /private validateCredentials\(integration: Integration\)\s*credentials: Record<string, string>\)\s*\): void {/gs,
    `private validateCredentials(integration: Integration,
    credentials: Record<string, string>
  ): void {`
  );
  
  // Fix testIntegrationConnection method (lines 109-111)
  content = content.replace(
    /private async testIntegrationConnection\(integration: Integration\)\s*credentials: Record<string, string>\)\s*\): Promise<void> {/gs,
    `private async testIntegrationConnection(integration: Integration,
    credentials: Record<string, string>
  ): Promise<void> {`
  );
  
  // Fix saveCredentials method (lines 116-118)
  content = content.replace(
    /private async saveCredentials\(integrationId: string\)\s*credentials: Record<string, string>\)\s*\): Promise<void> {/gs,
    `private async saveCredentials(integrationId: string,
    credentials: Record<string, string>
  ): Promise<void> {`
  );
  
  // Fix getCredentials return type (line 124)
  content = content.replace(
    /private async getCredentials\(integrationId: string\): Promise<Record<string, string> {/g,
    'private async getCredentials(integrationId: string): Promise<Record<string, string>> {'
  );
  
  fs.writeFileSync(integrationPath, content);
  console.log('Fixed IntegrationManager.ts');
}

// Fix TemplateManager.ts - method signatures
const templatePath = path.join(__dirname, '..', 'src/services/marketplace/TemplateManager.ts');
if (fs.existsSync(templatePath)) {
  let content = fs.readFileSync(templatePath, 'utf8');
  
  // Fix installTemplateFiles method (lines 103-105)
  content = content.replace(
    /private async installTemplateFiles\(files: TemplateFile\[\]\)\s*config: Record<string, any>\)\s*\): Promise<void> {/gs,
    `private async installTemplateFiles(files: TemplateFile[],
    config: Record<string, any>
  ): Promise<void> {`
  );
  
  fs.writeFileSync(templatePath, content);
  console.log('Fixed TemplateManager.ts');
}

console.log('All syntax errors fixed!');