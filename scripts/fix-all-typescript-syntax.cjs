const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Starting TypeScript syntax error fixes...\n');

// Get TypeScript errors
let tsErrors;
try {
  execSync('npx tsc --noEmit', { encoding: 'utf8' });
  console.log('✅ No TypeScript errors found!');
  process.exit(0);
} catch (error) {
  tsErrors = error.stdout || error.stderr || '';
}

// Parse errors by file
const errorsByFile = {};
const lines = tsErrors.split('\n');

lines.forEach(line => {
  const match = line.match(/^(.+\.tsx?)(\((\d+),(\d+)\))?: error (TS\d+): (.+)$/);
  if (match) {
    const [, filePath, , lineNum, colNum, errorCode, errorMsg] = match;
    if (!errorsByFile[filePath]) {
      errorsByFile[filePath] = [];
    }
    errorsByFile[filePath].push({
      line: parseInt(lineNum) || 0,
      column: parseInt(colNum) || 0,
      code: errorCode,
      message: errorMsg
    });
  }
});

console.log(`Found errors in ${Object.keys(errorsByFile).length} files\n`);

// Common syntax fixes
const syntaxFixes = {
  // Fix common JSX syntax errors
  fixJSX: (content) => {
    // Fix unclosed JSX tags
    content = content.replace(/<(\w+)([^>]*)\/(?!>)/g, '<$1$2 />');
    
    // Fix missing closing tags
    const openTags = [];
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Find opening tags
      const openMatches = line.matchAll(/<(\w+)(?:\s[^>]*)?>/g);
      for (const match of openMatches) {
        if (!['br', 'hr', 'img', 'input', 'meta', 'link'].includes(match[1].toLowerCase())) {
          openTags.push({ tag: match[1], line: i });
        }
      }
      
      // Find closing tags
      const closeMatches = line.matchAll(/<\/(\w+)>/g);
      for (const match of closeMatches) {
        const lastOpen = openTags.findLastIndex(t => t.tag === match[1]);
        if (lastOpen >= 0) {
          openTags.splice(lastOpen, 1);
        }
      }
    }
    
    // Add missing closing tags
    if (openTags.length > 0) {
      const lastTag = openTags[openTags.length - 1];
      lines[lastTag.line] += ` </${lastTag.tag}>`;
      content = lines.join('\n');
    }
    
    return content;
  },
  
  // Fix TypeScript syntax
  fixTypeScript: (content) => {
    // Fix missing commas in object literals
    content = content.replace(/(\w+):\s*(['"][^'"]*['"]|\d+|true|false|null)\s*(?=\w+:)/g, '$1: $2,');
    
    // Fix missing semicolons
    content = content.replace(/^(\s*(?:const|let|var|import|export)\s+.+)$/gm, (match) => {
      if (!match.endsWith(';') && !match.endsWith('{') && !match.endsWith(',')) {
        return match + ';';
      }
      return match;
    });
    
    // Fix arrow function syntax
    content = content.replace(/=>\s*{([^}]+)}(?!;)/g, '=> {$1};');
    
    // Fix type annotations
    content = content.replace(/:\s*\[\s*\]/g, ': []');
    content = content.replace(/:\s*\{\s*\}/g, ': {}');
    
    return content;
  },
  
  // Fix import/export syntax
  fixImports: (content) => {
    // Fix import statements
    content = content.replace(/import\s+(.+)\s+from\s+(['"][^'"]+['"])(?!;)/g, 'import $1 from $2;');
    
    // Fix export statements
    content = content.replace(/export\s+(?:const|let|var)\s+(\w+)\s*=\s*([^;]+)(?!;)/g, 'export $1 = $2;');
    
    return content;
  }
};

// Process files with the most errors first
const sortedFiles = Object.entries(errorsByFile)
  .sort((a, b) => b[1].length - a[1].length)
  .slice(0, 20); // Fix top 20 files first

let fixedCount = 0;

sortedFiles.forEach(([filePath, errors]) => {
  try {
    const fullPath = path.resolve(filePath);
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ File not found: ${filePath}`);
      return;
    }
    
    let content = fs.readFileSync(fullPath, 'utf8');
    const originalContent = content;
    
    console.log(`\n📄 Processing ${path.relative(process.cwd(), fullPath)} (${errors.length} errors)`);
    
    // Apply fixes based on error types
    const errorCodes = [...new Set(errors.map(e => e.code))];
    
    if (errorCodes.includes('TS1005') || errorCodes.includes('TS1003')) {
      console.log('   - Fixing syntax errors...');
      content = syntaxFixes.fixTypeScript(content);
      content = syntaxFixes.fixImports(content);
    }
    
    if (errorCodes.includes('TS1128') || errorCodes.includes('TS1109')) {
      console.log('   - Fixing JSX errors...');
      content = syntaxFixes.fixJSX(content);
    }
    
    // File-specific fixes
    if (filePath.includes('app.config.ts')) {
      console.log('   - Fixing config file syntax...');
      // Fix object literal syntax
      content = content.replace(/(\w+):\s*{([^}]+)}/g, (match, key, value) => {
        // Ensure proper comma separation
        const fixedValue = value
          .split('\n')
          .map(line => line.trim())
          .filter(line => line)
          .join(',\n    ');
        return `${key}: {\n    ${fixedValue}\n  }`;
      });
    }
    
    if (content !== originalContent) {
      fs.writeFileSync(fullPath, content);
      console.log('   ✅ Fixed');
      fixedCount++;
    } else {
      console.log('   ⚠️  No automatic fixes applied');
    }
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
  }
});

console.log(`\n📊 Summary: Fixed ${fixedCount} files`);
console.log('\n🔍 Running TypeScript check again...\n');

// Check if errors are reduced
try {
  execSync('npx tsc --noEmit', { encoding: 'utf8' });
  console.log('✅ All TypeScript errors fixed!');
} catch (error) {
  const remainingErrors = (error.stdout || '').split('\n').filter(line => line.includes('error TS')).length;
  console.log(`⚠️  ${remainingErrors} TypeScript errors remaining`);
  console.log('\nRun "npm run typecheck" to see remaining errors');
}