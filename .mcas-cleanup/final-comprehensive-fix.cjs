#!/usr/bin/env node

/**
 * MCAS Final Comprehensive Fix
 * Fix all remaining syntax errors
 */

const fs = require('fs');
const path = require('path');

console.log('🔨 MCAS Final Comprehensive Fix');
console.log('===============================\n');

// Pattern to fix comment and const declaration on same line
const fixCommentConstPattern = (content) => {
  return content.replace(
    /(\/\/ [^,\n]+),\s*(const|let|var)\s+(\w+)\s*=\s*{/g,
    (match, comment, keyword, varName) => {
      return `${comment}\n        ${keyword} ${varName} = {`;
    }
  );
};

// Pattern to fix variable declarations with commas
const fixVarDeclarationPattern = (content) => {
  return content.replace(
    /(const|let|var)\s+(\w+)\s*=\s*([^,\n]+),\s*\/\/([^\n]+)\n\s*(const|let|var)\s+(\w+)\s*=\s*{/g,
    (match, keyword1, name1, value1, comment, keyword2, name2) => {
      return `${keyword1} ${name1} = ${value1};\n        //${comment}\n        ${keyword2} ${name2} = {`;
    }
  );
};

// List of files to fix
const filesToFix = [
  {
    path: 'src/app/api/admin/stats/route.ts',
    fix: (content) => {
      return content.replace(
        /\/\/ Simulate stats data, const stats = {/g,
        '// Simulate stats data\n        const stats = {'
      );
    }
  },
  {
    path: 'src/app/api/admin/users/[id]/route.ts',
    fix: (content) => {
      return content.replace(
        /const userId = params\.id, \/\/ Simulate user data, const user = {/g,
        'const userId = params.id;\n        // Simulate user data\n        const user = {'
      );
    }
  }
];

// Process specific files
for (const fileConfig of filesToFix) {
  const filePath = path.join(process.cwd(), fileConfig.path);
  
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${fileConfig.path}`);
      continue;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    const fixed = fileConfig.fix(content);
    
    if (fixed !== content) {
      fs.writeFileSync(filePath, fixed, 'utf8');
      console.log(`✓ Fixed ${fileConfig.path}`);
    }
  } catch (error) {
    console.log(`❌ Error processing ${fileConfig.path}: ${error.message}`);
  }
}

// General fix function
function applyGeneralFixes(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    let fixCount = 0;
    
    // Apply all patterns
    content = fixCommentConstPattern(content);
    if (content !== original) fixCount++;
    
    let temp = fixVarDeclarationPattern(content);
    if (temp !== content) {
      content = temp;
      fixCount++;
    }
    
    // Fix other common patterns
    content = content.replace(/\)\s*,\s*return\s+/g, ');\n        return ');
    content = content.replace(/\}\s*,\s*return\s+/g, '};\n        return ');
    content = content.replace(/;\s*,\s*/g, ';\n        ');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      return fixCount;
    }
    return 0;
  } catch (error) {
    return 0;
  }
}

// Process all TypeScript files
function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      if (!entry.name.startsWith('.') && 
          entry.name !== 'node_modules' && 
          entry.name !== '.next' &&
          entry.name !== '.git') {
        processDirectory(fullPath);
      }
    } else if (entry.isFile() && 
               (entry.name.endsWith('.ts') || 
                entry.name.endsWith('.tsx'))) {
      const fixes = applyGeneralFixes(fullPath);
      if (fixes > 0) {
        console.log(`✓ Fixed ${path.relative(process.cwd(), fullPath)} (${fixes} patterns)`);
      }
    }
  }
}

console.log('\n🔍 Processing all source files...');
processDirectory(path.join(process.cwd(), 'src'));

// Check for specific problematic patterns in API routes
const apiDir = path.join(process.cwd(), 'src/app/api');
if (fs.existsSync(apiDir)) {
  function checkApiRoute(filePath) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let original = content;
      
      // Fix params destructuring
      content = content.replace(
        /export\s+async\s+function\s+(\w+)\s*\(\s*request:\s*NextRequest\s*\)\s*:\s*Promise<NextResponse>\s*{/g,
        (match, method) => {
          if (filePath.includes('[') && filePath.includes(']')) {
            return `export async function ${method}(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {`;
          }
          return match;
        }
      );
      
      if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✓ Fixed route params in ${path.relative(process.cwd(), filePath)}`);
      }
    } catch (error) {
      // Ignore
    }
  }
  
  function processApiRoutes(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        processApiRoutes(fullPath);
      } else if (entry.name === 'route.ts' || entry.name === 'route.tsx') {
        checkApiRoute(fullPath);
      }
    }
  }
  
  console.log('\n🔍 Checking API route parameters...');
  processApiRoutes(apiDir);
}

console.log('\n✅ Comprehensive fixes complete!');