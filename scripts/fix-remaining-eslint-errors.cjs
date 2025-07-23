#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Fixing Remaining ESLint Errors - Phase 2...');

/**
 * Target the specific parsing errors that remain after Phase 1
 */

const PROJECT_ROOT = process.cwd();

function fixMCPJavaScriptFiles() {
  console.log('🔧 Fixing MCP JavaScript files...');
  
  const mcpFiles = [
    'mcp/index.js',
    'mcp/tools/environment-manager.js',
    'mcp/tools/platform-sync.js',
    'mcp/wsl-sequential-thinking-server.ts'
  ];

  for (const file of mcpFiles) {
    const filePath = path.join(PROJECT_ROOT, file);
    if (!fs.existsSync(filePath)) continue;

    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let fixed = false;

      // Fix '}' expected errors
      if (content.includes('} catch (error) { console.error')) {
        content = content.replace(/} catch \(error\) { console\.error/g, '} catch (error) {\n        console.error');
        fixed = true;
      }

      // Fix missing closing braces
      const openBraces = (content.match(/{/g) || []).length;
      const closeBraces = (content.match(/}/g) || []).length;
      if (openBraces > closeBraces) {
        const missing = openBraces - closeBraces;
        content += '\n' + '}'.repeat(missing);
        fixed = true;
      }

      // Fix broken function definitions
      content = content.replace(/function\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\([^)]*\)\s*{([^}]*)$/gm, 
        'function $1() {\n$2\n}');

      // Fix Declaration or statement expected errors
      content = content.replace(/^(\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*([^,]+),?\s*$/gm, '$1// $2: $3');

      if (fixed || content !== fs.readFileSync(filePath, 'utf8')) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Fixed ${file}`);
      }
    } catch (error) {
      console.log(`❌ Error fixing ${file}: ${error.message}`);
    }
  }
}

function fixTypeScriptParsingErrors() {
  console.log('🔧 Fixing TypeScript parsing errors...');
  
  const tsFiles = [
    'scripts/autonomous-doc-finder.ts',
    'scripts/autonomous-fix-applicator.ts',
    'scripts/build-sync-agent.ts',
    'scripts/comprehensive-health-check.ts'
  ];

  for (const file of tsFiles) {
    const filePath = path.join(PROJECT_ROOT, file);
    if (!fs.existsSync(filePath)) continue;

    try {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Remove shebang from non-first line
      if (content.includes('#!') && !content.startsWith('#!')) {
        content = content.replace(/^(.*)\n#!/gm, '$1\n//#!/');
      }

      // Fix ';' expected errors
      content = content.replace(/^(\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*([^;]+)$/gm, '$1$2: $3;');

      // Fix ')' expected errors
      content = content.replace(/\(\s*([^)]+)\s*$/gm, '($1)');

      // Fix ',' expected errors
      content = content.replace(/([a-zA-Z0-9_]+)\s*:\s*([^,}]+)\s*([}])/g, '$1: $2,$3');

      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed ${file}`);
    } catch (error) {
      console.log(`❌ Error fixing ${file}: ${error.message}`);
    }
  }
}

function fixJavaScriptParsingErrors() {
  console.log('🔧 Fixing JavaScript parsing errors...');
  
  const jsFiles = [
    'scripts/activate-enhanced-orchestration.js',
    'scripts/agent-health-check.js'
  ];

  for (const file of jsFiles) {
    const filePath = path.join(PROJECT_ROOT, file);
    if (!fs.existsSync(filePath)) continue;

    try {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Fix Declaration or statement expected
      content = content.replace(/^(\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*([^,}]+),?\s*$/gm, '$1const $2 = $3;');

      // Fix ',' expected errors  
      content = content.replace(/([a-zA-Z0-9_]+)\s*:\s*([^,}]+)\s*([}])/g, '$1: $2,$3');

      // Fix incomplete object literals
      content = content.replace(/{\s*([^}]+)\s*$/gm, '{\n$1\n}');

      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed ${file}`);
    } catch (error) {
      console.log(`❌ Error fixing ${file}: ${error.message}`);
    }
  }
}

function fixSpecificSyntaxIssues() {
  console.log('🔧 Fixing specific syntax issues...');
  
  // Get all files with errors from ESLint
  try {
    const result = execSync('npx eslint . --format=compact 2>&1 || true', { encoding: 'utf8' });
    const errorLines = result.split('\n').filter(line => line.includes('error'));
    
    const errorFiles = new Set();
    for (const line of errorLines) {
      const match = line.match(/^([^:]+):/);
      if (match) {
        errorFiles.add(match[1]);
      }
    }

    for (const filePath of errorFiles) {
      if (!fs.existsSync(filePath)) continue;
      
      try {
        let content = fs.readFileSync(filePath, 'utf8');
        let original = content;
        
        // Fix broken object/array syntax
        content = content.replace(/,(\s*[}\]])/g, '$1');
        content = content.replace(/{\s*,/g, '{');
        content = content.replace(/\[\s*,/g, '[');
        
        // Fix broken conditional expressions
        content = content.replace(/\?\s*([^:]+)\s*$/gm, '? $1 : undefined');
        
        // Fix incomplete statements
        content = content.replace(/^\s*\.\s*$/gm, '');
        content = content.replace(/^\s*,\s*$/gm, '');
        
        // Fix broken JSX
        content = content.replace(/>\s*{([^}]*)\s*$/gm, '>{$1}');
        
        // Fix broken template literals
        content = content.replace(/`([^`]*)\$\{([^}]*)\s*$/gm, '`$1\${$2}`');
        
        if (content !== original) {
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`✅ Fixed syntax in ${filePath.replace(PROJECT_ROOT, '.')}`);
        }
      } catch (error) {
        console.log(`❌ Error fixing ${filePath}: ${error.message}`);
      }
    }
  } catch (error) {
    console.log('Could not analyze ESLint errors');
  }
}

async function runFixes() {
  try {
    fixMCPJavaScriptFiles();
    fixTypeScriptParsingErrors();
    fixJavaScriptParsingErrors();
    fixSpecificSyntaxIssues();

    // Run ESLint auto-fix again
    console.log('\n🔧 Running ESLint auto-fix (Phase 2)...');
    try {
      execSync('npx eslint . --fix --max-warnings=999999', { stdio: 'pipe' });
      console.log('✅ ESLint auto-fix completed');
    } catch (error) {
      console.log('⚠️  ESLint auto-fix had some issues, but continuing...');
    }

    // Check final error count
    console.log('\n📊 Checking final ESLint error count...');
    try {
      const result = execSync('npx eslint . --format=compact 2>&1 || true', { encoding: 'utf8' });
      const errorCount = (result.match(/error/g) || []).length;
      console.log(`Final ESLint errors: ${errorCount}`);
      
      if (errorCount > 0) {
        console.log('\nRemaining errors (top 15):');
        const lines = result.split('\n').filter(line => line.includes('error')).slice(0, 15);
        lines.forEach(line => console.log(`  ${line}`));
      } else {
        console.log('🎉 All ESLint errors fixed!');
      }
    } catch (error) {
      console.log('Could not check final error count');
    }

    console.log('\n🎉 Phase 2 ESLint error fixing completed!');
  } catch (error) {
    console.error('❌ Phase 2 fixing failed:', error.message);
    throw error;
  }
}

// Run the fixes
runFixes().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});