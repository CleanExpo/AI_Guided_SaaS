const fs = require('fs');
const path = require('path');

// Find and fix patterns that were missed
const additionalPatterns = [
  // Fix semicolons in object properties within arrays
  {
    pattern: /(\[\s*\{[^}]*\w+\s*:\s*[^,}]+);(\s*[,}])/g,
    replacement: '$1,$2'
  },
  // Fix multiple semicolons in objects
  {
    pattern: /([,{]\s*\w+\s*:\s*[^;,}]+);(\s*\w+\s*:)/g,
    replacement: '$1,$2'
  },
  // Fix space in focus-visible: outline-none
  {
    pattern: /focus-visible:\s+outline-none/g,
    replacement: 'focus-visible:outline-none'
  },
  // Fix array elements with semicolons
  {
    pattern: /(\[\s*\{[^}]+\})\s*;(\s*\{)/g,
    replacement: '$1,$2'
  },
  // Fix object closing with semicolon before comma
  {
    pattern: /\}\s*;\s*,/g,
    replacement: '},'
  }
];

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    additionalPatterns.forEach(({ pattern, replacement }) => {
      const newContent = content.replace(pattern, replacement);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Fix specific files mentioned in errors
const specificFiles = [
  'src/components/admin/AdminAnalytics.tsx',
  'src/components/ui/button.tsx',
  'src/components/ui/badge.tsx',
  'src/lib/agents/types.ts',
  'src/lib/agents/runtime/AgentOrchestrator.ts'
];

console.log('Fixing specific files with remaining syntax errors...\n');

let fixedCount = 0;
specificFiles.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    if (fixFile(fullPath)) {
      fixedCount++;
    }
  }
});

// Also scan entire src directory for any remaining issues
function scanDirectory(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory() && !file.name.startsWith('.') && file.name !== 'node_modules') {
      scanDirectory(fullPath);
    } else if (file.isFile() && (file.name.endsWith('.tsx') || file.name.endsWith('.ts'))) {
      if (fixFile(fullPath)) {
        fixedCount++;
      }
    }
  }
}

console.log('\nScanning entire src directory for remaining issues...');
scanDirectory(path.join(process.cwd(), 'src'));

console.log(`\nTotal files fixed: ${fixedCount}`);