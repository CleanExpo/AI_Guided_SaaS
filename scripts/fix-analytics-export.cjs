const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src/components/analytics/AnalyticsExport.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Fix malformed button tags
content = content.replace(
  /<button>key={format}>onClick=\{.*?\} aria-label="Button"/g,
  '<button\n                  key={format}\n                  onClick={() => setOptions({ ...options, format })}\n                  aria-label="Button"'
);

content = content.replace(
  /<button>key={range}>onClick=\{.*?\} aria-label="Button"/g,
  '<button\n                  key={range}\n                  onClick={() => setOptions({ ...options, dateRange: range })}\n                  aria-label="Button"'
);

// Fix checkbox inputs
content = content.replace(
  /<input\s*type="checkbox">checked={options\.metrics\.includes\(metric\)}>onChange/g,
  '<input\n                    type="checkbox"\n                    checked={options.metrics.includes(metric)}\n                    onChange'
);

content = content.replace(
  /<input\s*type="checkbox">checked={options\.includeRawData}>onChange/g,
  '<input\n                type="checkbox"\n                checked={options.includeRawData}\n                onChange'
);

content = content.replace(
  /<input\s*type="checkbox">checked={options\.includeCharts}>onChange/g,
  '<input\n                  type="checkbox"\n                  checked={options.includeCharts}\n                  onChange'
);

// Fix Button className
content = content.replace(
  /disabled={isExporting \|\| options\.metrics\.length === 0}>className="w-full">>/g,
  'disabled={isExporting || options.metrics.length === 0}\n            className="w-full"\n          >'
);

// Remove duplicate lines
const lines = content.split('\n');
const fixedLines = [];
let prevLine = '';
for (const line of lines) {
  if (!line.includes('<button key={range}') || !prevLine.includes('<button>key={range}')) {
    fixedLines.push(line);
  }
  prevLine = line;
}

fs.writeFileSync(filePath, fixedLines.join('\n'));
console.log('Fixed AnalyticsExport.tsx');