#!/usr/bin/env node

/**
 * Script to extract magic numbers to named constants
 * Improves code readability and maintainability
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔢 AI Guided SaaS - Magic Number Extractor');
console.log('==========================================\n');

// Color codes for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Find all TypeScript/JavaScript files
const sourceFiles = glob.sync('src/**/*.{ts,tsx,js,jsx}', {
  ignore: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/*.test.*',
    '**/*.spec.*',
    '**/constants/**',
    '**/config/**'
  ]
});

log(`Found ${sourceFiles.length} source files to analyze`, 'blue');

let totalMagicNumbers = 0;
let filesProcessed = 0;
let constantsExtracted = 0;

// Common magic numbers that should be constants
const commonMagicNumbers = {
  // Time values
  '1000': 'MILLISECONDS_PER_SECOND',
  '60000': 'MILLISECONDS_PER_MINUTE',
  '3600000': 'MILLISECONDS_PER_HOUR',
  '86400000': 'MILLISECONDS_PER_DAY',
  '604800000': 'MILLISECONDS_PER_WEEK',
  '60': 'SECONDS_PER_MINUTE',
  '3600': 'SECONDS_PER_HOUR',
  '86400': 'SECONDS_PER_DAY',
  '24': 'HOURS_PER_DAY',
  '7': 'DAYS_PER_WEEK',
  '30': 'DAYS_PER_MONTH_APPROX',
  '365': 'DAYS_PER_YEAR',
  
  // HTTP status codes
  '200': 'HTTP_STATUS_OK',
  '201': 'HTTP_STATUS_CREATED',
  '204': 'HTTP_STATUS_NO_CONTENT',
  '400': 'HTTP_STATUS_BAD_REQUEST',
  '401': 'HTTP_STATUS_UNAUTHORIZED',
  '403': 'HTTP_STATUS_FORBIDDEN',
  '404': 'HTTP_STATUS_NOT_FOUND',
  '500': 'HTTP_STATUS_INTERNAL_SERVER_ERROR',
  
  // Common limits
  '100': 'DEFAULT_PAGE_SIZE',
  '1024': 'BYTES_PER_KB',
  '1048576': 'BYTES_PER_MB',
  '1073741824': 'BYTES_PER_GB',
  
  // Percentages
  '0.1': 'TEN_PERCENT',
  '0.25': 'QUARTER',
  '0.5': 'HALF',
  '0.75': 'THREE_QUARTERS',
  
  // Array indices
  '0': 'FIRST_INDEX',
  '1': 'SECOND_INDEX',
  '-1': 'NOT_FOUND_INDEX'
};

// Context-aware number detection
function analyzeContext(line, numberStr, lineNum) {
  const contexts = [];
  
  // Check for time-related context
  if (line.match(/timeout|delay|interval|duration|seconds?|minutes?|hours?|days?|ms/i)) {
    contexts.push('time');
  }
  
  // Check for size/limit context
  if (line.match(/max|min|limit|size|length|count|total|threshold/i)) {
    contexts.push('limit');
  }
  
  // Check for HTTP context
  if (line.match(/status|response|request|http|api/i)) {
    contexts.push('http');
  }
  
  // Check for percentage context
  if (line.match(/percent|ratio|rate|factor/i)) {
    contexts.push('percentage');
  }
  
  // Check for pixel/dimension context
  if (line.match(/px|width|height|margin|padding|size|dimension/i)) {
    contexts.push('dimension');
  }
  
  // Check for port numbers
  if (line.match(/port/i) && parseInt(numberStr) > 1000 && parseInt(numberStr) < 65536) {
    contexts.push('port');
  }
  
  return contexts;
}

// Generate constant name based on context
function generateConstantName(number, contexts, usage) {
  // Check if it's a known magic number
  if (commonMagicNumbers[number]) {
    return commonMagicNumbers[number];
  }
  
  // Generate based on context
  let name = '';
  
  if (contexts.includes('time')) {
    if (number === '1000') return 'ONE_SECOND_MS';
    if (number === '5000') return 'FIVE_SECONDS_MS';
    if (number === '10000') return 'TEN_SECONDS_MS';
    if (number === '30000') return 'THIRTY_SECONDS_MS';
    name = `TIMEOUT_${number}_MS`;
  } else if (contexts.includes('limit')) {
    name = `MAX_${usage.toUpperCase()}_${number}`;
  } else if (contexts.includes('http')) {
    name = `HTTP_STATUS_${number}`;
  } else if (contexts.includes('dimension')) {
    name = `${usage.toUpperCase()}_${number}PX`;
  } else if (contexts.includes('port')) {
    name = `DEFAULT_PORT_${number}`;
  } else if (contexts.includes('percentage')) {
    name = `PERCENTAGE_${number.replace('.', '_')}`;
  } else {
    // Generic naming
    name = `CONSTANT_${number.replace('.', '_').replace('-', 'NEGATIVE_')}`;
  }
  
  return name.replace(/[^A-Z0-9_]/g, '_');
}

// Process each file
const report = {
  timestamp: new Date().toISOString(),
  filesAnalyzed: 0,
  totalMagicNumbers: 0,
  extractedConstants: [],
  filesSummary: []
};

sourceFiles.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const magicNumbers = [];
  
  lines.forEach((line, index) => {
    // Skip comments and strings
    if (line.trim().startsWith('//') || line.trim().startsWith('*')) return;
    
    // Remove strings to avoid matching numbers in strings
    const lineWithoutStrings = line.replace(/'[^']*'|"[^"]*"|`[^`]*`/g, '');
    
    // Find numbers (including decimals and negatives)
    const numberMatches = lineWithoutStrings.match(/-?\b\d+\.?\d*\b/g);
    
    if (numberMatches) {
      numberMatches.forEach(num => {
        // Skip array indices [0], [1], etc in most cases
        if (line.includes(`[${num}]`) && parseInt(num) < 10) return;
        
        // Skip CSS values
        if (line.includes(`${num}px`) || line.includes(`${num}em`) || line.includes(`${num}rem`)) return;
        
        // Skip version numbers
        if (line.match(new RegExp(`\\d+\\.${num}\\.\\d+`))) return;
        
        // Skip import statements
        if (line.includes('import') || line.includes('require')) return;
        
        // Skip decimal places that are too precise (likely calculated values)
        if (num.includes('.') && num.split('.')[1].length > 3) return;
        
        // Skip 0 and 1 in most contexts (too common)
        if (num === '0' || num === '1') {
          // But keep them in specific contexts
          if (!line.match(/length|size|count|index|true|false|null|undefined/i)) return;
        }
        
        const contexts = analyzeContext(line, num, index);
        
        // Extract variable or function name for context
        const usageMatch = line.match(/(?:const|let|var|function)\s+(\w+)|(\w+)\s*[=:]\s*[^=]*\b\d+/);
        const usage = usageMatch ? (usageMatch[1] || usageMatch[2] || 'value') : 'value';
        
        magicNumbers.push({
          line: index + 1,
          value: num,
          contexts,
          usage,
          snippet: line.trim(),
          suggestedName: generateConstantName(num, contexts, usage)
        });
      });
    }
  });
  
  if (magicNumbers.length > 0) {
    const relPath = path.relative(process.cwd(), filePath);
    report.filesSummary.push({
      file: relPath,
      count: magicNumbers.length,
      topNumbers: magicNumbers.slice(0, 5)
    });
    
    totalMagicNumbers += magicNumbers.length;
    
    // Create constants file suggestion
    if (magicNumbers.length > 10) {
      log(`\n📁 ${relPath}`, 'yellow');
      log(`  Found ${magicNumbers.length} magic numbers`, 'red');
      
      // Group by suggested constant names to avoid duplicates
      const uniqueConstants = {};
      magicNumbers.forEach(mn => {
        if (!uniqueConstants[mn.suggestedName]) {
          uniqueConstants[mn.suggestedName] = mn;
        }
      });
      
      // Show top 5 suggestions
      const suggestions = Object.values(uniqueConstants).slice(0, 5);
      log('  Suggested constants:', 'green');
      suggestions.forEach(s => {
        log(`    ${s.suggestedName} = ${s.value}`, 'blue');
      });
      
      constantsExtracted += Object.keys(uniqueConstants).length;
    }
  }
  
  filesProcessed++;
  report.filesAnalyzed++;
});

// Generate constants file template
const constantsTemplate = `/**
 * Generated Constants File
 * Extract these magic numbers from your codebase
 */

// Time constants (milliseconds)
export const MILLISECONDS_PER_SECOND = 1000;
export const MILLISECONDS_PER_MINUTE = 60000;
export const MILLISECONDS_PER_HOUR = 3600000;
export const MILLISECONDS_PER_DAY = 86400000;

// Time constants (seconds)
export const SECONDS_PER_MINUTE = 60;
export const SECONDS_PER_HOUR = 3600;
export const SECONDS_PER_DAY = 86400;

// HTTP Status codes
export const HTTP_STATUS_OK = 200;
export const HTTP_STATUS_CREATED = 201;
export const HTTP_STATUS_BAD_REQUEST = 400;
export const HTTP_STATUS_UNAUTHORIZED = 401;
export const HTTP_STATUS_FORBIDDEN = 403;
export const HTTP_STATUS_NOT_FOUND = 404;
export const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;

// Common limits
export const DEFAULT_PAGE_SIZE = 100;
export const MAX_FILE_SIZE_MB = 10;
export const MAX_UPLOAD_SIZE_BYTES = 10485760; // 10MB
export const DEFAULT_TIMEOUT_MS = 30000;
export const MAX_RETRY_ATTEMPTS = 3;

// Dimensions
export const SIDEBAR_WIDTH_PX = 250;
export const HEADER_HEIGHT_PX = 64;
export const MOBILE_BREAKPOINT_PX = 768;

// Rates and percentages
export const DEFAULT_TAX_RATE = 0.1;
export const DISCOUNT_PERCENTAGE = 0.15;

// Indexes
export const FIRST_INDEX = 0;
export const NOT_FOUND_INDEX = -1;
`;

// Save constants template
const constantsDir = path.join(process.cwd(), 'src', 'constants');
if (!fs.existsSync(constantsDir)) {
  fs.mkdirSync(constantsDir, { recursive: true });
}
fs.writeFileSync(path.join(constantsDir, 'generated-constants.ts'), constantsTemplate);

console.log('\n' + '='.repeat(50));
log(`🔍 Magic Number Analysis Complete!`, 'green');
log(`Files analyzed: ${filesProcessed}`, 'blue');
log(`Total magic numbers found: ${totalMagicNumbers}`, 'yellow');
log(`Unique constants suggested: ${constantsExtracted}`, 'green');

// Save detailed report
report.totalMagicNumbers = totalMagicNumbers;
report.summary = {
  averagePerFile: (totalMagicNumbers / filesProcessed).toFixed(2),
  filesWithMostMagicNumbers: report.filesSummary
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .map(f => `${f.file} (${f.count})`)
};

fs.writeFileSync('magic-numbers-report.json', JSON.stringify(report, null, 2));
log(`\n📄 Report saved to: magic-numbers-report.json`, 'yellow');
log(`📄 Constants template saved to: src/constants/generated-constants.ts`, 'green');