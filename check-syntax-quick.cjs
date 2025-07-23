const fs = require('fs');
const path = require('path');

function checkBraces(content, filePath) {
  let openBraces = 0;
  let openParens = 0;
  let openBrackets = 0;
  let inString = false;
  let stringChar = '';
  let inComment = false;
  let inMultilineComment = false;
  
  const lines = content.split('\n');
  const errors = [];
  
  for (let lineNum = 0; lineNum < lines.length; lineNum++) {
    const line = lines[lineNum];
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];
      
      // Handle comments
      if (!inString) {
        if (char === '/' && nextChar === '/') {
          break; // Skip rest of line
        }
        if (char === '/' && nextChar === '*') {
          inMultilineComment = true;
          i++;
          continue;
        }
        if (char === '*' && nextChar === '/' && inMultilineComment) {
          inMultilineComment = false;
          i++;
          continue;
        }
      }
      
      if (inMultilineComment) continue;
      
      // Handle strings
      if ((char === '"' || char === "'" || char === '`') && !inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar && inString && line[i-1] !== '\\') {
        inString = false;
        stringChar = '';
      }
      
      if (!inString && !inComment) {
        if (char === '{') openBraces++;
        if (char === '}') openBraces--;
        if (char === '(') openParens++;
        if (char === ')') openParens--;
        if (char === '[') openBrackets++;
        if (char === ']') openBrackets--;
        
        if (openBraces < 0) {
          errors.push(`Line ${lineNum + 1}: Extra closing brace }`);
        }
        if (openParens < 0) {
          errors.push(`Line ${lineNum + 1}: Extra closing parenthesis )`);
        }
        if (openBrackets < 0) {
          errors.push(`Line ${lineNum + 1}: Extra closing bracket ]`);
        }
      }
    }
  }
  
  if (openBraces > 0) errors.push(`Missing ${openBraces} closing brace(s) }`);
  if (openBraces < 0) errors.push(`Extra ${-openBraces} closing brace(s) }`);
  if (openParens > 0) errors.push(`Missing ${openParens} closing parenthesis/es )`);
  if (openParens < 0) errors.push(`Extra ${-openParens} closing parenthesis/es )`);
  if (openBrackets > 0) errors.push(`Missing ${openBrackets} closing bracket(s) ]`);
  if (openBrackets < 0) errors.push(`Extra ${-openBrackets} closing bracket(s) ]`);
  
  return errors;
}

const filesToCheck = [
  'src/app/admin/analytics/page.tsx',
  'src/app/admin/mcp/page.tsx',
  'src/app/admin/dashboard/page.tsx',
  'src/app/admin/agent-monitor/page.tsx',
  'src/app/admin/causal/page.tsx',
  'src/app/admin/debug/page.tsx',
  'src/app/about/page.tsx',
  'src/app/community/guidelines/page.tsx',
  'src/components/AgentPulseMonitor.tsx',
  'src/components/admin/SelfCheckTrigger.tsx',
  'src/components/ContainerMonitor.tsx',
  'src/components/health/AlertsPanel.tsx',
  'src/components/health/SystemMetrics.tsx',
  'src/components/health/TaskQueueVisualizer.tsx',
  'src/packages/causal-engine/explorer-ui.tsx'
];

console.log('Checking syntax in critical files...\n');

filesToCheck.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    const errors = checkBraces(content, file);
    
    if (errors.length > 0) {
      console.log(`\n❌ ${file}:`);
      errors.forEach(err => console.log(`   ${err}`));
    } else {
      console.log(`✅ ${file} - OK`);
    }
  } else {
    console.log(`⚠️  ${file} - Not found`);
  }
});

console.log('\nSyntax check complete.');