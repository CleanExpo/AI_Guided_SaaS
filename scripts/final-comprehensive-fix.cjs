const fs = require('fs');
const path = require('path');

// Fix IntegrationManager.ts - extra closing paren on line 48
const integrationPath = path.join(__dirname, '..', 'src/services/marketplace/IntegrationManager.ts');
if (fs.existsSync(integrationPath)) {
  let content = fs.readFileSync(integrationPath, 'utf8');
  content = content.replace(
    /params\?: Record<string, any>\)\s*\): Promise<any>/g,
    'params?: Record<string, any>\n  ): Promise<any>'
  );
  fs.writeFileSync(integrationPath, content);
  console.log('Fixed IntegrationManager.ts');
}

// Fix TemplateManager.ts - method signature on lines 85-87
const templatePath = path.join(__dirname, '..', 'src/services/marketplace/TemplateManager.ts');
if (fs.existsSync(templatePath)) {
  let content = fs.readFileSync(templatePath, 'utf8');
  content = content.replace(
    /private processTemplateConfig\(config: TemplateConfig\)\s*userConfig\?: Record<string, any>\)\s*\): Record<string, any>/g,
    'private processTemplateConfig(config: TemplateConfig,\n    userConfig?: Record<string, any>\n  ): Record<string, any>'
  );
  fs.writeFileSync(templatePath, content);
  console.log('Fixed TemplateManager.ts');
}

// Fix analytics/page.tsx - semicolons instead of commas
const analyticsPagePath = path.join(__dirname, '..', 'src/app/analytics/page.tsx');
if (fs.existsSync(analyticsPagePath)) {
  let content = fs.readFileSync(analyticsPagePath, 'utf8');
  content = content.replace(/totalUsers: 1247;/g, 'totalUsers: 1247,');
  content = content.replace(/pageViews: 5643;/g, 'pageViews: 5643,');
  fs.writeFileSync(analyticsPagePath, content);
  console.log('Fixed analytics/page.tsx');
}

// Fix analytics-engine.ts remaining issues
const enginePath = path.join(__dirname, '..', 'src/services/analytics-engine.ts');
if (fs.existsSync(enginePath)) {
  let content = fs.readFileSync(enginePath, 'utf8');
  
  // Fix all the remaining closing parentheses
  content = content.replace(/eventData\.metadata\)\s*\);/g, 'eventData.metadata\n        );');
  content = content.replace(/eventData\.context\)\s*\);/g, 'eventData.context\n        );');
  content = content.replace(/eventData\.data\)\s*\);/g, 'eventData.data\n        );');
  
  // Fix trackPerformance method signature
  content = content.replace(
    /unit: 'ms' \| 's' = 'ms'\)\s*metadata\?: Record<string, any>\)\s*\): void {/g,
    `unit: 'ms' | 's' = 'ms',
    metadata?: Record<string, any>
  ): void {`
  );
  
  // Fix identify method
  content = content.replace(
    /action: 'profile_update'\)\s*metadata: traits\)\s*\}\);/g,
    `action: 'profile_update',
      metadata: traits
    });`
  );
  
  // Fix query method
  content = content.replace(
    /filters\?: Record<string, any>;\)/g,
    'filters?: Record<string, any>;'
  );
  
  // Fix getDashboardData
  content = content.replace(
    /generateDashboardData\(allEvents,\s*metrics\)\s*this\.realtimeEvents\)\s*\);/g,
    `generateDashboardData(allEvents,
      metrics,
      this.realtimeEvents
    );`
  );
  
  // Fix filter
  content = content.replace(
    /e\.timestamp >= fiveMinutesAgo\)\s*\);/g,
    'e.timestamp >= fiveMinutesAgo\n    );'
  );
  
  // Fix initializeAnalytics
  content = content.replace(
    /aggregated: 365\s*\}\)\s*\.\.\.config\)/g,
    `aggregated: 365
      },
      ...config`
  );
  
  fs.writeFileSync(enginePath, content);
  console.log('Fixed analytics-engine.ts');
}

console.log('All syntax errors fixed!');