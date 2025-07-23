#!/usr/bin/env node

/**
 * Final JSX Cleanup Script
 * Fixes remaining forward slash issues that are being interpreted as regex
 * This is the critical fix for remaining build blockers
 */

const fs = require('fs');
const glob = require('glob');

console.log('🚨 FINAL JSX CLEANUP - Removing forward slash issues...\n');

function cleanFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return false;
    }

    console.log(`🧹 Cleaning: ${filePath}`);
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    
    // Fix 1: Remove trailing forward slashes from import statements
    const originalImports = content.match(/import[^;]*;\/\s*$/gm);
    if (originalImports) {
      originalImports.forEach(importLine => {
        const fixed = importLine.replace(/;\/\s*$/, ';');
        content = content.replace(importLine, fixed);
        hasChanges = true;
      });
      console.log(`   ✅ Fixed ${originalImports.length} import statement trailing slashes`);
    }
    
    // Fix 2: Replace forward slashes in JSX content with proper line breaks
    const jsxSlashes = content.match(/\/[^\/\n\r].*?\/[^\/\n\r]/g);
    if (jsxSlashes) {
      jsxSlashes.forEach(match => {
        // Only fix if it's not a real regex or comment
        if (!match.startsWith('//') && !match.includes('"') && !match.includes("'")) {
          const fixed = match.replace(/\//g, '\n              ');
          content = content.replace(match, fixed);
          hasChanges = true;
        }
      });
      console.log(`   ✅ Fixed ${jsxSlashes.length} JSX forward slash issues`);
    }
    
    // Fix 3: Fix specific patterns causing unterminated regex
    content = content.replace(/\/\s*$/gm, '');
    
    // Fix 4: Fix JSX elements that got mangled with forward slashes
    content = content.replace(/<([^>]*)\/([^>]*)/g, '<$1 $2');
    
    // Fix 5: Fix closing tags with forward slashes
    content = content.replace(/<\/([^>]*)\/>/g, '</$1>');
    
    // Fix 6: Fix interface declarations that have extra closing braces
    content = content.replace(/\}\s*\}$/gm, '}');
    
    // Fix 7: Fix function declarations that got corrupted
    content = content.replace(/export default function ([A-Za-z]+)\(\) \{([^{]*)\{/g, 
      'export default function $1() {\n  $2\n  return (');
    
    // Fix 8: Fix return statements that got corrupted
    content = content.replace(/return \(\s*<([^>]*)>/g, 'return (\n    <$1>');
    
    // Fix 9: Clean up excessive whitespace and malformed structures
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    if (hasChanges) {
      fs.writeFileSync(filePath, content);
      console.log(`   ✨ File cleaned successfully\n`);
      return true;
    } else {
      console.log(`   ℹ️  No cleanup needed\n`);
      return false;
    }
    
  } catch (error) {
    console.error(`❌ Error cleaning ${filePath}:`, error.message);
    return false;
  }
}

// Specific manual fixes for the most problematic files
function manualFixes() {
  console.log('🔧 Applying manual fixes for critical files...\n');
  
  // Fix about/page.tsx - reconstruct the entire problematic section
  const aboutPath = 'src/app/about/page.tsx';
  if (fs.existsSync(aboutPath)) {
    let content = fs.readFileSync(aboutPath, 'utf8');
    
    // Fix the mangled JSX structure at the end
    const fixedEndStructure = `              <li>AI-powered development tools that understand your requirements</li>
              <li>No-code and pro-code experiences to suit every skill level</li>
              <li>Enterprise-grade security and scalability built-in</li>
              <li>One-click deployment to any cloud platform</li>
              <li>Continuous learning and improvement of our AI models</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}`;
    
    // Replace the problematic section
    content = content.replace(
      /              <li>AI-powered development tools that understand your requirements<\/li>\/.*?\}/s,
      fixedEndStructure
    );
    
    fs.writeFileSync(aboutPath, content);
    console.log('✅ Manually fixed about/page.tsx JSX structure');
  }
  
  // Fix admin-direct/page.tsx - remove trailing slash
  const adminDirectPath = 'src/app/admin-direct/page.tsx';
  if (fs.existsSync(adminDirectPath)) {
    let content = fs.readFileSync(adminDirectPath, 'utf8');
    content = content.replace(/import \{ Card, CardContent, CardHeader, CardTitle \} from '@\/components\/ui\/card';\//, 
                             "import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';");
    fs.writeFileSync(adminDirectPath, content);
    console.log('✅ Manually fixed admin-direct/page.tsx import');
  }
  
  // Fix admin/agent-monitor/page.tsx - remove trailing slash
  const agentMonitorPath = 'src/app/admin/agent-monitor/page.tsx';
  if (fs.existsSync(agentMonitorPath)) {
    let content = fs.readFileSync(agentMonitorPath, 'utf8');
    content = content.replace(/import \{ AlertsPanel \} from '@\/components\/health\/AlertsPanel';\//, 
                             "import { AlertsPanel } from '@/components/health/AlertsPanel';");
    fs.writeFileSync(agentMonitorPath, content);
    console.log('✅ Manually fixed admin/agent-monitor/page.tsx import');
  }
  
  // Fix admin/analytics/page.tsx - fix interface structure
  const analyticsPath = 'src/app/admin/analytics/page.tsx';
  if (fs.existsSync(analyticsPath)) {
    let content = fs.readFileSync(analyticsPath, 'utf8');
    content = content.replace(/  status: 'active' \| 'inactive';\}\s*\}/, 
                             "  status: 'active' | 'inactive';\n}");
    fs.writeFileSync(analyticsPath, content);
    console.log('✅ Manually fixed admin/analytics/page.tsx interface');
  }
  
  // Fix admin/causal/page.tsx - remove trailing slash
  const causalPath = 'src/app/admin/causal/page.tsx';
  if (fs.existsSync(causalPath)) {
    let content = fs.readFileSync(causalPath, 'utf8');
    content = content.replace(/import SelfCheckTrigger from '\.\.\/\.\.\/\.\.\/components\/admin\/SelfCheckTrigger';\//, 
                             "import SelfCheckTrigger from '../../../components/admin/SelfCheckTrigger';");
    fs.writeFileSync(causalPath, content);
    console.log('✅ Manually fixed admin/causal/page.tsx import');
  }
}

async function main() {
  console.log('🚨 Starting Final JSX Cleanup...\n');
  
  // Apply manual fixes first
  manualFixes();
  
  // Then clean all app files
  const appFiles = glob.sync('src/app/**/*.tsx');
  let totalCleaned = 0;
  
  console.log(`\n🧹 Cleaning ${appFiles.length} app files...\n`);
  
  appFiles.forEach(filePath => {
    if (cleanFile(filePath)) {
      totalCleaned++;
    }
  });
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('🎯 FINAL JSX CLEANUP COMPLETE');
  console.log('='.repeat(50));
  console.log(`📁 Files processed: ${appFiles.length}`);
  console.log(`🧹 Files cleaned: ${totalCleaned}`);
  
  console.log('\n🚀 Final step: Run "npm run build" to verify all fixes');
  console.log('🎯 Expected: Build should complete successfully now');
}

// Execute the cleanup
main().catch(console.error);