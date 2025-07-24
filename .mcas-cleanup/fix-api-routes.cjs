#!/usr/bin/env node

/**
 * MCAS API Route Syntax Fixer
 * Specifically targets the NextResponse.json(; pattern in API routes
 */

const fs = require('fs');
const path = require('path');

let totalFiles = 0;
let fixedFiles = 0;
let totalFixes = 0;
const fixedFilesList = [];

function fixApiRouteSyntax(content, filePath) {
  let fixed = content;
  let changes = 0;

  // Pattern 1: Fix NextResponse.json(; pattern
  // Before: return NextResponse.json(; { error: 'message' }, { status: 500 })
  // After:  return NextResponse.json({ error: 'message' }, { status: 500 });
  fixed = fixed.replace(/NextResponse\.json\s*\(\s*;\s*\n?\s*(\{[^}]+\})\s*,\s*(\{[^}]+\})\s*\)/gm, (match, data, options) => {
    changes++;
    return `NextResponse.json(${data}, ${options})`;
  });

  // Pattern 2: Fix NextResponse.json with semicolon inside
  fixed = fixed.replace(/NextResponse\.json\s*\(\s*;/gm, 'NextResponse.json(');

  // Pattern 3: Fix missing semicolons after NextResponse.json
  fixed = fixed.replace(/(NextResponse\.json\([^)]+\))(?=\s*})/gm, '$1;');

  // Pattern 4: Fix broken return statements with NextResponse
  fixed = fixed.replace(/return\s+NextResponse\.json\s*\(\s*\n\s*;/gm, 'return NextResponse.json(');

  // Pattern 5: Fix catch blocks with broken NextResponse
  fixed = fixed.replace(/catch\s*\([^)]+\)\s*{\s*console\.error\([^)]+\);\s*return\s+NextResponse\.json\s*\(\s*;/gm, (match) => {
    const errorMatch = match.match(/catch\s*\(([^)]+)\)/);
    const errorVar = errorMatch ? errorMatch[1] : 'error';
    const consoleMatch = match.match(/console\.error\(([^)]+)\)/);
    
    return match.replace(/return\s+NextResponse\.json\s*\(\s*;/, 'return NextResponse.json(');
  });

  // Pattern 6: Fix response objects with trailing commas
  fixed = fixed.replace(/(\{[^}]+),\s*}/gm, '$1}');

  // Pattern 7: Fix status codes
  fixed = fixed.replace(/status:\s*(\d+)\s*,?\s*}/gm, 'status: $1 }');

  // Pattern 8: Fix error responses specifically
  fixed = fixed.replace(/\{\s*error:\s*['"]([^'"]+)['"]\s*},\s*\{\s*status:\s*(\d+)\s*}/gm, 
    '{ error: \'$1\' }, { status: $2 }');

  // Pattern 9: Fix success responses
  fixed = fixed.replace(/\{\s*success:\s*true\s*,?\s*([^}]*)\s*}/gm, (match, rest) => {
    if (rest.trim()) {
      return `{ success: true, ${rest.trim()} }`;
    }
    return '{ success: true }';
  });

  // Pattern 10: Ensure all NextResponse.json calls end with semicolon
  fixed = fixed.replace(/(NextResponse\.json\([^)]+\))(?=\s*$)/gm, '$1;');

  // Pattern 11: Fix NextRequest type imports
  if (fixed.includes('NextRequest') && !fixed.includes("import { NextRequest")) {
    fixed = fixed.replace(/import\s*{\s*NextResponse\s*}\s*from\s*['"]next\/server['"]/m,
      "import { NextRequest, NextResponse } from 'next/server'");
    changes++;
  }

  // Pattern 12: Fix async function signatures
  fixed = fixed.replace(/export\s+async\s+function\s+(GET|POST|PUT|DELETE|PATCH)\s*\([^)]*\)\s*:\s*Promise<NextResponse>\s*{/gm,
    'export async function $1(request: NextRequest): Promise<NextResponse> {');

  return { fixed, changes };
}

function processFile(filePath) {
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) {
    return;
  }

  // Only process API route files
  if (!filePath.includes('\\api\\') && !filePath.includes('/api/')) {
    return;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { fixed, changes } = fixApiRouteSyntax(content, filePath);

    if (changes > 0) {
      fs.writeFileSync(filePath, fixed, 'utf8');
      fixedFiles++;
      totalFixes += changes;
      fixedFilesList.push({ file: filePath, fixes: changes });
      console.log(`✓ Fixed ${changes} issues in: ${path.relative(process.cwd(), filePath)}`);
    }

    totalFiles++;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

function findFiles(dir) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Skip node_modules and .next
        if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === '.git') {
          continue;
        }
        findFiles(fullPath);
      } else if (entry.isFile()) {
        processFile(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }
}

console.log('🔧 MCAS API Route Syntax Fixer');
console.log('==============================');
console.log('Targeting NextResponse.json syntax errors...\n');

const startTime = Date.now();

// Process all TypeScript files in src directory
const srcPath = path.join(process.cwd(), 'src');
if (fs.existsSync(srcPath)) {
  findFiles(srcPath);
}

const duration = ((Date.now() - startTime) / 1000).toFixed(2);

console.log('\n📊 Summary:');
console.log(`- Files processed: ${totalFiles}`);
console.log(`- Files fixed: ${fixedFiles}`);
console.log(`- Total fixes applied: ${totalFixes}`);
console.log(`- Duration: ${duration}s`);

if (fixedFilesList.length > 0) {
  console.log('\n📝 Fixed files:');
  fixedFilesList.forEach(({ file, fixes }) => {
    console.log(`  - ${path.relative(process.cwd(), file)} (${fixes} fixes)`);
  });
}

// Save report
const report = {
  timestamp: new Date().toISOString(),
  filesProcessed: totalFiles,
  filesFixed: fixedFiles,
  totalFixes: totalFixes,
  duration: `${duration}s`,
  fixedFiles: fixedFilesList
};

fs.writeFileSync(
  path.join(__dirname, 'api-routes-fix-report.json'),
  JSON.stringify(report, null, 2)
);

console.log('\n✅ API route syntax fixes complete!');
console.log('📄 Report saved to: .mcas-cleanup/api-routes-fix-report.json');