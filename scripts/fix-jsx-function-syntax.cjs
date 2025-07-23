#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing JSX and Function Syntax Issues...');

const PROJECT_ROOT = process.cwd();

// Target files with known JSX/function issues
const targetFiles = [
  'src/app/admin-direct/page.tsx',
  'src/app/admin/dashboard/page.tsx', 
  'src/app/admin/login/page.tsx',
  'src/app/admin/debug/page.tsx',
  'src/app/analytics/page.tsx',
  'src/app/api-docs/[slug]/page.tsx'
];

function fixJSXAndFunctionSyntax(content, fileName) {
  let fixed = content;
  
  // Fix function parameters with type annotations
  fixed = fixed.replace(/onChange:\s*any\s*=\s*\(/g, 'onChange={(');
  fixed = fixed.replace(/onClick:\s*any\s*=\s*\(/g, 'onClick={(');
  fixed = fixed.replace(/onSubmit:\s*any\s*=\s*\(/g, 'onSubmit={(');
  
  // Fix JSX expressions and conditional rendering
  fixed = fixed.replace(/{error\s*&&\s*\(div/g, '{error && (<div');
  fixed = fixed.replace(/}\s*\)\s*\{/g, ')}\n          {');
  
  // Fix malformed JSX tags
  fixed = fixed.replace(/<\/form><\/div>/g, '</div>\n            </form>');
  fixed = fixed.replace(/}\)\s*<\/div>/g, ')}\n          </div>');
  
  // Fix function parameter lists
  fixed = fixed.replace(/\(:\s*any\)\s*=>/g, '() =>');
  fixed = fixed.replace(/async\s*\(:\s*any\)\s*=>/g, 'async () =>');
  
  // Fix export function syntax
  if (fileName.includes('page.tsx')) {
    fixed = fixed.replace(
      /export\s+default\s+function\s+(\w+)[^{]*?:\s*any[^{]*?\{/g,
      'export default function $1() {'
    );
  }
  
  // Fix interface syntax
  fixed = fixed.replace(/(\w+):\s*([^,;}]+);,/g, '$1: $2,');
  fixed = fixed.replace(/,\s*}/g, '\n  }');
  
  // Fix JSX closing structure for specific patterns
  if (fileName.includes('admin-direct') || fileName.includes('admin/login')) {
    // Ensure proper form structure
    if (fixed.includes('<form') && !fixed.includes('</form>')) {
      fixed = fixed.replace(
        /(<Input[^>]*\/>[\s\S]*?)<\/div>/,
        '$1\n          </form>\n        </CardContent>\n      </Card>\n    </div>'
      );
    }
  }
  
  return fixed;
}

async function fixTargetFiles() {
  let fixedCount = 0;
  
  for (const file of targetFiles) {
    const filePath = path.join(PROJECT_ROOT, file);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⏭️  Skipping ${file} (not found)`);
      continue;
    }
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const fixed = fixJSXAndFunctionSyntax(content, file);
      
      if (fixed !== content) {
        fs.writeFileSync(filePath, fixed, 'utf8');
        fixedCount++;
        console.log(`✅ Fixed ${file}`);
      } else {
        console.log(`⏭️  No changes needed in ${file}`);
      }
    } catch (error) {
      console.log(`❌ Error fixing ${file}: ${error.message}`);
    }
  }
  
  console.log(`\n🎯 Fixed ${fixedCount} files with JSX/function syntax issues`);
  return fixedCount;
}

// Run the fixes
fixTargetFiles().catch(error => {
  console.error('❌ JSX/Function fix failed:', error.message);
  process.exit(1);
});