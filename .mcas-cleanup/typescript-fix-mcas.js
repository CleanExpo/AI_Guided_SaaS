import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 MCAS TypeScript Error Fixer\n');

// Load breadcrumbs for context
const breadcrumbs = JSON.parse(fs.readFileSync('../breadcrumbs/rescue-manifest.json', 'utf8'));

// Common TypeScript fixes
const fixes = {
  // Missing imports
  addReactImport: {
    pattern: /JSX element/,
    fix: (content) => {
      if (!content.includes("import React") && !content.includes("import * as React")) {
        return `import React from 'react';\n` + content;
      }
      return content;
    }
  },
  
  // Next.js imports
  addNextImports: {
    pattern: /NextRequest|NextResponse/,
    fix: (content) => {
      if (!content.includes("import { NextRequest, NextResponse }")) {
        return `import { NextRequest, NextResponse } from 'next/server';\n` + content;
      }
      return content;
    }
  },

  // Missing type imports
  addTypeImports: {
    pattern: /Cannot find name '(FC|ReactNode|PropsWithChildren|MouseEvent|ChangeEvent)'/,
    fix: (content, match) => {
      const typeName = match[1];
      if (!content.includes(`import { ${typeName} }`)) {
        content = content.replace(
          /import React/,
          `import React, { ${typeName} }`
        );
      }
      return content;
    }
  },

  // Fix component props
  addPropsInterface: {
    pattern: /Binding element '(\w+)' implicitly has an 'any' type/,
    fix: (content, match) => {
      const propName = match[1];
      // Add interface before component
      const componentMatch = content.match(/(?:export\s+)?(?:default\s+)?function\s+(\w+)/);
      if (componentMatch) {
        const componentName = componentMatch[1];
        const interfaceCode = `\ninterface ${componentName}Props {\n  ${propName}: any;\n}\n\n`;
        content = content.replace(componentMatch[0], interfaceCode + componentMatch[0]);
      }
      return content;
    }
  },

  // Fix async route handlers
  fixAsyncRoutes: {
    pattern: /exported async functions in/,
    fix: (content) => {
      // Wrap in proper route handler
      if (content.includes('export async function')) {
        content = content.replace(
          /export async function (\w+)/g,
          'export async function $1(request: NextRequest)'
        );
      }
      return content;
    }
  },

  // Add missing 'use client' directive
  addUseClient: {
    pattern: /You're importing a component that needs (useState|useEffect|useContext)/,
    fix: (content) => {
      if (!content.startsWith("'use client'") && !content.startsWith('"use client"')) {
        return `'use client';\n\n` + content;
      }
      return content;
    }
  },

  // Fix property does not exist errors
  fixPropertyErrors: {
    pattern: /Property '(\w+)' does not exist on type/,
    fix: (content, match) => {
      const property = match[1];
      // Add to interface or type cast
      if (content.includes('interface') && content.includes(property)) {
        // Property is being used but not defined
        const interfaceMatch = content.match(/interface\s+\w+\s*{([^}]*)}/);
        if (interfaceMatch) {
          const newInterface = interfaceMatch[0].replace('}', `  ${property}?: any;\n}`);
          content = content.replace(interfaceMatch[0], newInterface);
        }
      }
      return content;
    }
  }
};

// Process files with errors
async function fixTypeScriptErrors() {
  console.log('🔍 Analyzing TypeScript errors...\n');
  
  // Get error output
  let errorOutput = '';
  try {
    execSync('cd .. && npm run typecheck', { encoding: 'utf8' });
  } catch (error) {
    errorOutput = error.stdout + error.stderr;
  }

  // Parse errors by file
  const errorsByFile = {};
  const lines = errorOutput.split('\n');
  
  lines.forEach(line => {
    const match = line.match(/^(.+?\.(ts|tsx)):(\d+):(\d+) - error (TS\d+): (.+)/);
    if (match) {
      const [, file, , lineNum, , errorCode, message] = match;
      if (!errorsByFile[file]) {
        errorsByFile[file] = [];
      }
      errorsByFile[file].push({ lineNum, errorCode, message });
    }
  });

  console.log(`📊 Found errors in ${Object.keys(errorsByFile).length} files\n`);

  // Fix files
  let fixedCount = 0;
  const filesToFix = Object.entries(errorsByFile).slice(0, 50); // Process 50 files at a time

  for (const [filePath, errors] of filesToFix) {
    console.log(`🔧 Fixing ${path.basename(filePath)} (${errors.length} errors)`);
    
    const fullPath = path.join(__dirname, '..', filePath);
    if (!fs.existsSync(fullPath)) continue;

    let content = fs.readFileSync(fullPath, 'utf8');
    let modified = false;

    // Apply fixes based on error messages
    for (const error of errors) {
      for (const [fixName, fix] of Object.entries(fixes)) {
        const match = error.message.match(fix.pattern);
        if (match) {
          const newContent = fix.fix(content, match);
          if (newContent !== content) {
            content = newContent;
            modified = true;
            console.log(`   ✅ Applied: ${fixName}`);
          }
        }
      }
    }

    // Apply breadcrumb-based fixes
    const breadcrumb = breadcrumbs[filePath.replace(/\\/g, '/')];
    if (breadcrumb) {
      // Add breadcrumb comment if missing
      if (!content.includes('BREADCRUMB:')) {
        content = `/* BREADCRUMB: ${breadcrumb.category} - ${breadcrumb.purpose} */\n` + content;
        modified = true;
      }

      // Apply category-specific fixes
      if (breadcrumb.category === 'api' && !content.includes('NextRequest')) {
        content = `import { NextRequest, NextResponse } from 'next/server';\n` + content;
        modified = true;
      }

      if (breadcrumb.category.includes('ui') && !content.includes("'use client'") && 
          (content.includes('useState') || content.includes('useEffect'))) {
        content = `'use client';\n\n` + content;
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(fullPath, content);
      fixedCount++;
    }
  }

  console.log(`\n✅ Fixed ${fixedCount} files`);

  // Check new error count
  let newErrorCount = 0;
  try {
    execSync('cd .. && npm run typecheck', { encoding: 'utf8' });
  } catch (error) {
    const errorOutput = error.stdout + error.stderr;
    newErrorCount = (errorOutput.match(/error TS\d+:/g) || []).length;
  }

  console.log(`\n📊 New error count: ${newErrorCount}`);
  
  return { fixedCount, newErrorCount };
}

// Run fixer
fixTypeScriptErrors().catch(console.error);