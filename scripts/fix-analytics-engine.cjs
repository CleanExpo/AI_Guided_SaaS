const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src/services/analytics-engine.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Fix all the malformed function calls
content = content.replace(
  /eventData\.value,\s*eventData\.metadata\)\s*\);/g,
  'eventData.value,\n          eventData.metadata\n        );'
);

// Fix trackConversion
content = content.replace(
  /eventData\.currency\)\s*eventData\.metadata\)/g,
  'eventData.currency,\n          eventData.metadata'
);

// Fix trackPerformance
content = content.replace(
  /eventData\.unit\)\s*eventData\.metadata\)/g,
  'eventData.unit,\n          eventData.metadata'
);

// Fix trackError
content = content.replace(
  /eventData\.severity\)\s*eventData\.context\)/g,
  'eventData.severity,\n          eventData.context'
);

// Fix trackUser
content = content.replace(
  /eventData\.action\)\s*eventData\.metadata\)/g,
  'eventData.action,\n          eventData.metadata'
);

// Fix trackCustom
content = content.replace(
  /eventData\.name\)\s*eventData\.data\)/g,
  'eventData.name,\n          eventData.data'
);

// Fix trackPerformance method signature
content = content.replace(
  /unit: 'ms' \| 's' = 'ms'\)\s*metadata\?: Record<string, any>\)/g,
  'unit: \'ms\' | \'s\' = \'ms\',\n    metadata?: Record<string, any>'
);

// Fix generateDashboardData call
content = content.replace(
  /allEvents,\s*metrics\)\s*this\.realtimeEvents\)/g,
  'allEvents,\n      metrics,\n      this.realtimeEvents'
);

// Fix filter in updateRealtimeEvents
content = content.replace(
  /e\.timestamp >= fiveMinutesAgo\)\s*\);/g,
  'e.timestamp >= fiveMinutesAgo\n    );'
);

// Fix trackError window call
content = content.replace(
  /this\.trackError\(\)\s*new Error/g,
  'this.trackError(\n        new Error'
);

// Fix identify method
content = content.replace(
  /action: 'profile_update'\)\s*metadata: traits\)/g,
  'action: \'profile_update\',\n      metadata: traits'
);

// Fix query method filters parameter
content = content.replace(
  /filters\?: Record<string, any>;\)/g,
  'filters?: Record<string, any>;'
);

// Fix retention object
content = content.replace(
  /aggregated: 365\s*\}\)\s*\.\.\.config\)/g,
  'aggregated: 365\n      },\n      ...config'
);

fs.writeFileSync(filePath, content);
console.log('Fixed analytics-engine.ts');