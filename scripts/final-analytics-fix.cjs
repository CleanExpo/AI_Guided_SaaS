const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src/services/analytics-engine.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Fix all the malformed trackFeature calls - there's an extra closing paren
content = content.replace(
  /event = this\.eventTracker\.trackFeature\(eventData\.feature,\s*eventData\.action,\s*eventData\.value,\s*eventData\.metadata\)\s*\);/gs,
  'event = this.eventTracker.trackFeature(eventData.feature, eventData.action, eventData.value, eventData.metadata);'
);

// Fix trackConversion - missing comma and extra paren
content = content.replace(
  /event = this\.eventTracker\.trackConversion\(eventData\.goal,\s*eventData\.value,\s*eventData\.currency\)\s*eventData\.metadata\)\s*\);/gs,
  'event = this.eventTracker.trackConversion(eventData.goal, eventData.value, eventData.currency, eventData.metadata);'
);

// Fix trackPerformance - missing comma and extra paren
content = content.replace(
  /event = this\.eventTracker\.trackPerformance\(eventData\.metric,\s*eventData\.value,\s*eventData\.unit\)\s*eventData\.metadata\)\s*\);/gs,
  'event = this.eventTracker.trackPerformance(eventData.metric, eventData.value, eventData.unit, eventData.metadata);'
);

// Fix trackError - missing comma and extra paren
content = content.replace(
  /event = this\.eventTracker\.trackError\(eventData\.error,\s*eventData\.severity\)\s*eventData\.context\)\s*\);/gs,
  'event = this.eventTracker.trackError(eventData.error, eventData.severity, eventData.context);'
);

// Fix trackUser - missing comma and extra paren
content = content.replace(
  /event = this\.eventTracker\.trackUser\(eventData\.action\)\s*eventData\.metadata\)\s*\);/gs,
  'event = this.eventTracker.trackUser(eventData.action, eventData.metadata);'
);

// Fix trackCustom - missing comma and extra paren
content = content.replace(
  /event = this\.eventTracker\.trackCustom\(eventData\.name\)\s*eventData\.data\)\s*\);/gs,
  'event = this.eventTracker.trackCustom(eventData.name, eventData.data);'
);

fs.writeFileSync(filePath, content);
console.log('Fixed all analytics-engine.ts syntax errors');