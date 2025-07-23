#!/usr/bin/env node

/**
 * Phase 2 JSX Repair Script
 * Fixes remaining import statement and metadata object issues
 * 
 * Target: Import statements with slashes and malformed metadata objects
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 PHASE 2 JSX REPAIR - Fixing import statements and metadata...\n');

const CRITICAL_FILES_PHASE2 = [
  'src/app/about/page.tsx',
  'src/app/admin-direct/page.tsx', 
  'src/app/admin/agent-monitor/page.tsx',
  'src/app/admin/analytics/page.tsx',
  'src/app/admin/causal/page.tsx'
];

const fixes = {
  totalFiles: 0,
  totalFixes: 0,
  errors: []
};

function fixPhase2Issues(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return;
    }

    console.log(`🔧 Phase 2 Fixing: ${filePath}`);
    let content = fs.readFileSync(filePath, 'utf8');
    let fileFixes = 0;
    
    // Fix 1: Malformed import statements with forward slashes
    const importMatches = content.match(/import[^;]*\/[^;]*;/g);
    if (importMatches) {
      importMatches.forEach(importStatement => {
        // Split on slash and create proper separate import statements
        const parts = importStatement.split('/');
        if (parts.length > 2) {
          // This is a malformed import - fix it
          const fixedImports = [];
          let currentImport = parts[0];
          
          for (let i = 1; i < parts.length - 1; i++) {
            if (parts[i].includes('import')) {
              // New import statement
              fixedImports.push(currentImport + ';');
              currentImport = parts[i];
            } else {
              currentImport += '/' + parts[i];
            }
          }
          
          // Add the last part
          currentImport += '/' + parts[parts.length - 1];
          fixedImports.push(currentImport);
          
          const replacement = fixedImports.join('\n');
          content = content.replace(importStatement, replacement);
          fileFixes++;
        }
      });
    }
    
    // Fix 2: Better import statement splitting
    content = content.replace(/import ([^;]*);\/import ([^;]*);/g, (match, import1, import2) => {
      return `import ${import1};\nimport ${import2};`;
    });
    
    // Fix 3: Multiple imports on same line with slashes
    content = content.replace(/import ([^;]*\/[^;]*);/g, (match, importContent) => {
      const parts = importContent.split('/import ');
      if (parts.length > 1) {
        const imports = [`import ${parts[0]};`];
        for (let i = 1; i < parts.length; i++) {
          imports.push(`import ${parts[i]};`);
        }
        fileFixes++;
        return imports.join('\n');
      }
      return match;
    });
    
    // Fix 4: Malformed metadata objects
    content = content.replace(/export const metadata: Metadata = \{([^}]*)\}\s*\}/g, (match, metadataContent) => {
      const lines = metadataContent.split(',');
      const fixedLines = lines.map(line => line.trim()).filter(line => line);
      const fixedMetadata = `export const metadata: Metadata = {\n  ${fixedLines.join(',\n  ')}\n};`;
      fileFixes++;
      return fixedMetadata;
    });
    
    // Fix 5: Fix metadata object structure issues
    content = content.replace(/title: '([^']*)',\s*\}\s*description: '([^']*)'/, 'title: \'$1\',\n  description: \'$2\'');
    
    // Fix 6: Fix JSX expressions with stray curly braces
    content = content.replace(/\}\s*\{/g, '');
    
    // Fix 7: Fix function declarations that got merged
    content = content.replace(/export default function ([A-Za-z]+)\(\) \{([^{]*)\{/g, 'export default function $1() {\n  $2\n  return (');
    
    // Fix 8: Fix closing bracket issues in JSX
    content = content.replace(/\)\s*;\s*\}/g, ');\n}');
    
    // Fix 9: Fix component return statements
    content = content.replace(/return \(\s*<div/g, 'return (\n    <div');
    
    // Fix 10: Fix interface declarations that got mangled
    content = content.replace(/import ([^;]*);\/interface/g, 'import $1;\n\ninterface');
    
    console.log(`   ✅ Import and structure fixes: ${fileFixes} applied`);
    
    // Write fixed content back to file
    if (fileFixes > 0) {
      fs.writeFileSync(filePath, content);
      console.log(`   ✨ Total Phase 2 fixes applied: ${fileFixes}\n`);
    } else {
      console.log(`   ℹ️  No Phase 2 fixes needed\n`);
    }
    
    fixes.totalFixes += fileFixes;
    fixes.totalFiles++;
    
  } catch (error) {
    console.error(`❌ Error in Phase 2 fixing ${filePath}:`, error.message);
    fixes.errors.push({file: filePath, error: error.message});
  }
}

// Specific fixes for the identified problematic files
function fixSpecificFiles() {
  
  // Fix about/page.tsx metadata issue
  const aboutPath = 'src/app/about/page.tsx';
  if (fs.existsSync(aboutPath)) {
    let content = fs.readFileSync(aboutPath, 'utf8');
    // Fix the specific metadata syntax error
    content = content.replace(
      /export const metadata: Metadata = \{title: '([^']*)',\}\s*description: '([^']*)'\}/,
      `export const metadata: Metadata = {\n  title: '$1',\n  description: '$2'\n};`
    );
    fs.writeFileSync(aboutPath, content);
    console.log('✅ Fixed about/page.tsx metadata structure');
  }
  
  // Fix admin-direct/page.tsx import issues
  const adminDirectPath = 'src/app/admin-direct/page.tsx';
  if (fs.existsSync(adminDirectPath)) {
    let content = fs.readFileSync(adminDirectPath, 'utf8');
    // Fix the malformed import line
    content = content.replace(
      /import \{ useRouter \} from 'next\/navigation';\/import \{ Button \} from '@\/components\/ui\/button';\/import \{ Input \} from '@\/components\/ui\/input';\/import \{ Card, CardContent, CardHeader, CardTitle \} from '@\/components\/ui\/card';/,
      `import { useRouter } from 'next/navigation';\nimport { Button } from '@/components/ui/button';\nimport { Input } from '@/components/ui/input';\nimport { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';`
    );
    fs.writeFileSync(adminDirectPath, content);
    console.log('✅ Fixed admin-direct/page.tsx import statements');
  }
  
  // Fix admin/agent-monitor/page.tsx import issues
  const agentMonitorPath = 'src/app/admin/agent-monitor/page.tsx';
  if (fs.existsSync(agentMonitorPath)) {
    let content = fs.readFileSync(agentMonitorPath, 'utf8');
    // Fix the malformed import line
    content = content.replace(
      /import \{ Card, CardContent, CardDescription, CardHeader, CardTitle \} from '@\/components\/ui\/card';\/import \{ Tabs, TabsContent, TabsList, TabsTrigger \} from '@\/components\/ui\/tabs';\/import \{ AgentPulseMonitor \} from '@\/components\/AgentPulseMonitor';\/import \{ ContainerMonitor \} from '@\/components\/ContainerMonitor';\/import \{ SystemMetrics \} from '@\/components\/health\/SystemMetrics';\/import \{ TaskQueueVisualizer \} from '@\/components\/health\/TaskQueueVisualizer';\/import \{ AlertsPanel \} from '@\/components\/health\/AlertsPanel';/,
      `import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';\nimport { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';\nimport { AgentPulseMonitor } from '@/components/AgentPulseMonitor';\nimport { ContainerMonitor } from '@/components/ContainerMonitor';\nimport { SystemMetrics } from '@/components/health/SystemMetrics';\nimport { TaskQueueVisualizer } from '@/components/health/TaskQueueVisualizer';\nimport { AlertsPanel } from '@/components/health/AlertsPanel';`
    );
    fs.writeFileSync(agentMonitorPath, content);
    console.log('✅ Fixed admin/agent-monitor/page.tsx import statements');
  }
  
  // Fix admin/analytics/page.tsx import issues
  const analyticsPath = 'src/app/admin/analytics/page.tsx';
  if (fs.existsSync(analyticsPath)) {
    let content = fs.readFileSync(analyticsPath, 'utf8');
    // Fix the malformed import and interface declaration
    content = content.replace(
      /import \{ Card, CardContent, CardHeader, CardTitle \} from '@\/components\/ui\/card';\/import \{ Button \} from '@\/components\/ui\/button';\/import \{ BarChart3, ArrowLeft, Download \} from 'lucide-react';\nimport Link from 'next\/link';\/interface AdminUser \{/,
      `import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';\nimport { Button } from '@/components/ui/button';\nimport { BarChart3, ArrowLeft, Download } from 'lucide-react';\nimport Link from 'next/link';\n\ninterface AdminUser {`
    );
    fs.writeFileSync(analyticsPath, content);
    console.log('✅ Fixed admin/analytics/page.tsx import statements');
  }
  
  // Fix admin/causal/page.tsx JSX structure issues
  const causalPath = 'src/app/admin/causal/page.tsx';
  if (fs.existsSync(causalPath)) {
    let content = fs.readFileSync(causalPath, 'utf8');
    // Fix the JSX structure issues
    content = content.replace(
      /          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard<\/h1>\/          <p className="text-gray-600">System health monitoring and causal intelligence analytics<\/p>\/        <\/div>\/        \}/,
      `          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>\n          <p className="text-gray-600">System health monitoring and causal intelligence analytics</p>\n        </div>`
    );
    
    content = content.replace(
      /            <h2 className="text-xl font-semibold text-gray-900">Causal Intelligence Analytics<\/h2>\/            <p className="text-gray-600 mt-1">User behavior patterns and component performance insights<\/p>\/          <\/div>\/          <CausalExplorerUI \/>\/        <\/div>\/      <\/div>\/    <\/div>\/  \);/,
      `            <h2 className="text-xl font-semibold text-gray-900">Causal Intelligence Analytics</h2>\n            <p className="text-gray-600 mt-1">User behavior patterns and component performance insights</p>\n          </div>\n          <CausalExplorerUI />\n        </div>\n      </div>\n    </div>\n  );`
    );
    fs.writeFileSync(causalPath, content);
    console.log('✅ Fixed admin/causal/page.tsx JSX structure');
  }
}

// Main execution
async function main() {
  console.log('🔧 Starting Phase 2 JSX Repair...\n');
  
  // First apply specific fixes for known problematic files
  fixSpecificFiles();
  
  // Then apply general Phase 2 fixes
  CRITICAL_FILES_PHASE2.forEach(filePath => {
    fixPhase2Issues(filePath);
  });
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('🎯 PHASE 2 JSX REPAIR COMPLETE');
  console.log('='.repeat(50));
  console.log(`📁 Files processed: ${fixes.totalFiles}`);
  console.log(`🔧 Total fixes applied: ${fixes.totalFixes}`);
  console.log(`❌ Errors encountered: ${fixes.errors.length}`);
  
  if (fixes.errors.length > 0) {
    console.log('\n❌ Errors:');
    fixes.errors.forEach(err => {
      console.log(`   ${err.file}: ${err.error}`);
    });
  }
  
  console.log('\n🚀 Next step: Run "npm run build" again to verify Phase 2 fixes');
}

// Execute the repair
main().catch(console.error);