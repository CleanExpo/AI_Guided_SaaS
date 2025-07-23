const fs = require('fs');

const content = fs.readFileSync('src/app/admin/analytics/page.tsx', 'utf8');
const lines = content.split('\n');

let braceCount = 0;
let parenCount = 0;
let bracketCount = 0;
let inString = false;
let stringChar = '';

console.log('Checking brace matching in analytics page...\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  let lineNum = i + 1;
  
  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    
    // Handle strings
    if ((char === '"' || char === "'" || char === '`') && !inString) {
      inString = true;
      stringChar = char;
    } else if (char === stringChar && inString && line[j-1] !== '\\') {
      inString = false;
      stringChar = '';
    }
    
    if (!inString) {
      if (char === '{') {
        braceCount++;
        console.log(`Line ${lineNum}: { (braceCount: ${braceCount})`);
      }
      if (char === '}') {
        braceCount--;
        console.log(`Line ${lineNum}: } (braceCount: ${braceCount})`);
        if (braceCount < 0) {
          console.log(`❌ ERROR: Extra closing brace at line ${lineNum}`);
        }
      }
      if (char === '(') parenCount++;
      if (char === ')') parenCount--;
      if (char === '[') bracketCount++;
      if (char === ']') bracketCount--;
    }
  }
}

console.log('\nFinal counts:');
console.log(`Braces: ${braceCount} (should be 0)`);
console.log(`Parentheses: ${parenCount} (should be 0)`);
console.log(`Brackets: ${bracketCount} (should be 0)`);

if (braceCount !== 0 || parenCount !== 0 || bracketCount !== 0) {
  console.log('❌ SYNTAX ERROR: Mismatched braces/parentheses/brackets');
} else {
  console.log('✅ All braces, parentheses, and brackets are matched');
}