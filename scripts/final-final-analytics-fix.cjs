const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src/services/analytics-engine.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Fix trackPerformance method signature - lines 134-136
content = content.replace(
  /unit: 'ms' \| 's' = 'ms'\)\s*metadata\?: Record<string, any>\)\s*\): void {/gs,
  `unit: 'ms' | 's' = 'ms',
    metadata?: Record<string, any>
  ): void {`
);

// Fix identify method - lines 144-146
content = content.replace(
  /action: 'profile_update'\)\s*metadata: traits\)\s*\}\);/gs,
  `action: 'profile_update',
      metadata: traits
    });`
);

// Fix query method - line 177
content = content.replace(
  /filters\?: Record<string, any>;\)/gs,
  'filters?: Record<string, any>;'
);

// Fix getDashboardData - lines 191-193
content = content.replace(
  /metrics,\s*this\.realtimeEvents\)\s*\);/gs,
  'metrics,\n      this.realtimeEvents\n    );'
);

// Fix filter in updateRealtimeEvents - line 207
content = content.replace(
  /\.filter\(e => e\.timestamp >= fiveMinutesAgo\)\s*\);/gs,
  '.filter(e => e.timestamp >= fiveMinutesAgo);'
);

// Fix initializeAnalytics - lines 238-239
content = content.replace(
  /aggregated: 365\s*\}\)\s*\.\.\.config\)/gs,
  `aggregated: 365
      },
      ...config`
);

// Fix all the extra closing parentheses on switch cases
content = content.replace(/eventData\.metadata\)\s*\);/g, 'eventData.metadata\n        );');
content = content.replace(/eventData\.context\)\s*\);/g, 'eventData.context\n        );');
content = content.replace(/eventData\.data\)\s*\);/g, 'eventData.data\n        );');

fs.writeFileSync(filePath, content);
console.log('Fixed all remaining analytics-engine.ts syntax errors');