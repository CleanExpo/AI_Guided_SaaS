#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎯 FINAL FIX: Critical JSX Structure Issues');

const PROJECT_ROOT = process.cwd();

// Files with critical JSX structure issues
const criticalFiles = [
  'src/app/admin-direct/page.tsx',
  'src/app/admin/login/page.tsx',
  'src/app/admin/dashboard/page.tsx',
  'src/app/admin/debug/page.tsx',
  'src/app/analytics/page.tsx'
];

function fixCriticalJSXStructure(content, fileName) {
  let fixed = content;
  
  // Fix admin-direct and admin/login JSX structure
  if (fileName.includes('admin-direct') || fileName.includes('admin/login')) {
    // Ensure proper JSX closing structure
    if (fixed.includes('onChange: any=')) {
      fixed = fixed.replace(/onChange:\s*any\s*=\s*{/g, 'onChange={');
    }
    
    // Fix form structure - ensure all tags are properly closed
    if (fixed.includes('<form') && fixed.includes('</form>')) {
      // Find the form section and rebuild it properly
      const formStart = fixed.indexOf('<form');
      const formEnd = fixed.indexOf('</form>') + 7;
      
      if (formStart > -1 && formEnd > formStart) {
        const beforeForm = fixed.substring(0, formStart);
        const afterForm = fixed.substring(formEnd);
        
        // Create properly structured form
        const properForm = `<form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Authenticating...' : 'Access Admin Panel'}
            </Button>
          </form>`;
        
        fixed = beforeForm + properForm + afterForm;
      }
    }
    
    // Ensure proper closing structure
    if (!fixed.includes('        </CardContent>\n      </Card>\n    </div>\n  );\n}')) {
      fixed = fixed.replace(/}\s*$/, `        </CardContent>
      </Card>
    </div>
  );
}`);
    }
  }
  
  // Fix dashboard JSX structure
  if (fileName.includes('dashboard')) {
    fixed = fixed.replace(/}\s*\)\s*\{/g, ') {');
    fixed = fixed.replace(/}\s*export/g, '}\n\nexport');
  }
  
  // Fix debug page structure
  if (fileName.includes('debug')) {
    fixed = fixed.replace(/(\w+):\s*([^,}]+),\s*}/g, '$1: $2\n  }');
    fixed = fixed.replace(/},\s*export/g, '}\n\nexport');
  }
  
  // Fix analytics page structure
  if (fileName.includes('analytics')) {
    fixed = fixed.replace(/export\s+default\s+function\s+(\w+)export/g, 'export default function $1() {');
    fixed = fixed.replace(/}\s*}\s*export/g, '}\n}\n\nexport');
  }
  
  // General JSX fixes
  fixed = fixed.replace(/props:\s*anyexport/g, 'export');
  fixed = fixed.replace(/}\s*\)\s*export/g, '}\n\nexport');
  fixed = fixed.replace(/}\s*}\s*}\s*export/g, '}\n}\n\nexport');
  
  return fixed;
}

async function fixCriticalFiles() {
  let fixedCount = 0;
  
  for (const file of criticalFiles) {
    const filePath = path.join(PROJECT_ROOT, file);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⏭️  Skipping ${file} (not found)`);
      continue;
    }
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const fixed = fixCriticalJSXStructure(content, file);
      
      if (fixed !== content) {
        fs.writeFileSync(filePath, fixed, 'utf8');
        fixedCount++;
        console.log(`✅ Fixed critical JSX structure in ${file}`);
      } else {
        console.log(`⏭️  No critical changes needed in ${file}`);
      }
    } catch (error) {
      console.log(`❌ Error fixing ${file}: ${error.message}`);
    }
  }
  
  console.log(`\n🎯 Fixed ${fixedCount} files with critical JSX structure issues`);
  return fixedCount;
}

// Run the critical fixes
fixCriticalFiles().then(fixedCount => {
  console.log('\n🎉 Critical JSX structure fixes complete!');
  console.log('💡 Try running TypeScript check again to see improvements');
}).catch(error => {
  console.error('❌ Critical JSX fix failed:', error.message);
  process.exit(1);
});