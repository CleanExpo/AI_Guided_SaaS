#!/usr/bin/env node

/**
 * MCAS Test File Syntax Fixer
 * Specifically targets syntax errors in test files
 */

const fs = require('fs');
const path = require('path');

let totalFiles = 0;
let fixedFiles = 0;
let totalFixes = 0;
const fixedFilesList = [];

function fixTestSyntax(content, filePath) {
  let fixed = content;
  let changes = 0;

  // Pattern 1: Fix describe blocks with broken syntax
  fixed = fixed.replace(/describe\s*\(\s*['"`]([^'"`]+)['"`]\s*,\s*\(\s*\)\s*=>\s*{\s*;\s*/gm, (match, testName) => {
    changes++;
    return `describe('${testName}', () => {\n  `;
  });

  // Pattern 2: Fix it blocks with broken syntax
  fixed = fixed.replace(/it\s*\(\s*['"`]([^'"`]+)['"`]\s*,\s*(?:async\s*)?\(\s*\)\s*=>\s*{\s*;\s*/gm, (match, testName, isAsync) => {
    changes++;
    return match.includes('async') ? `it('${testName}', async () => {\n    ` : `it('${testName}', () => {\n    `;
  });

  // Pattern 3: Fix test blocks
  fixed = fixed.replace(/test\s*\(\s*['"`]([^'"`]+)['"`]\s*,\s*(?:async\s*)?\(\s*\)\s*=>\s*{\s*;\s*/gm, (match, testName) => {
    changes++;
    return match.includes('async') ? `test('${testName}', async () => {\n    ` : `test('${testName}', () => {\n    `;
  });

  // Pattern 4: Fix expect statements
  fixed = fixed.replace(/expect\s*\(\s*([^)]+)\s*\)\s*\.toBe\s*\(\s*;/gm, (match, value) => {
    changes++;
    return `expect(${value}).toBe(`;
  });

  // Pattern 5: Fix broken assertions
  fixed = fixed.replace(/\)\s*\.toBe\s*\(\s*([^)]+)\s*\)\s*,\s*}/gm, ').toBe($1);');

  // Pattern 6: Fix missing semicolons after assertions
  fixed = fixed.replace(/(expect\([^)]+\)\.[a-zA-Z]+\([^)]*\))(?=\s*})/gm, '$1;');

  // Pattern 7: Fix beforeEach/afterEach blocks
  fixed = fixed.replace(/(beforeEach|afterEach|beforeAll|afterAll)\s*\(\s*(?:async\s*)?\(\s*\)\s*=>\s*{\s*;/gm, (match, hookName) => {
    changes++;
    return match.includes('async') ? `${hookName}(async () => {\n  ` : `${hookName}(() => {\n  `;
  });

  // Pattern 8: Fix mock functions
  fixed = fixed.replace(/jest\.fn\s*\(\s*\)\s*,\s*}/gm, 'jest.fn()');
  fixed = fixed.replace(/vi\.fn\s*\(\s*\)\s*,\s*}/gm, 'vi.fn()');

  // Pattern 9: Fix import statements
  fixed = fixed.replace(/import\s*{\s*([^}]+)\s*}\s*from\s*['"]([^'"]+)['"]\s*,\s*}/gm, "import { $1 } from '$2';");

  // Pattern 10: Fix const declarations in tests
  fixed = fixed.replace(/const\s+(\w+)\s*=\s*{\s*;\s*/gm, 'const $1 = {\n  ');
  fixed = fixed.replace(/const\s+(\w+)\s*=\s*\[\s*;\s*/gm, 'const $1 = [\n  ');

  // Pattern 11: Fix async/await syntax
  fixed = fixed.replace(/await\s+([^;]+)\s*,\s*}/gm, 'await $1;');

  // Pattern 12: Fix object property syntax in tests
  fixed = fixed.replace(/(\w+)\s*:\s*([^,}]+)\s*,\s*,/gm, '$1: $2,');

  // Pattern 13: Fix array elements
  fixed = fixed.replace(/\[\s*([^,\]]+)\s*,\s*,/gm, '[$1,');

  // Pattern 14: Fix missing closing braces
  fixed = fixed.replace(/}\s*;\s*}\s*;\s*}/gm, '}\n  });\n});');

  // Pattern 15: Fix render statements in React tests
  fixed = fixed.replace(/render\s*\(\s*<([^>]+)>\s*,\s*}/gm, 'render(<$1 />);');

  return { fixed, changes };
}

function processFile(filePath) {
  if (!filePath.endsWith('.test.ts') && !filePath.endsWith('.test.tsx') && 
      !filePath.endsWith('.spec.ts') && !filePath.endsWith('.spec.tsx')) {
    return;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { fixed, changes } = fixTestSyntax(content, filePath);

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

console.log('🔧 MCAS Test File Syntax Fixer');
console.log('==============================');
console.log('Targeting test file syntax errors...\n');

const startTime = Date.now();

// Process test files
const testsPath = path.join(process.cwd(), 'tests');
if (fs.existsSync(testsPath)) {
  findFiles(testsPath);
}

// Also check src for test files
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
  path.join(__dirname, 'test-syntax-fix-report.json'),
  JSON.stringify(report, null, 2)
);

console.log('\n✅ Test file syntax fixes complete!');
console.log('📄 Report saved to: .mcas-cleanup/test-syntax-fix-report.json');