#!/usr/bin/env node

import fs from 'fs';
import { glob } from 'glob';

console.log('🔧 Starting advanced syntax error fixing for remaining issues...');

// Get files with most critical syntax errors
const targetFiles = [
  'src/app/community/guidelines/page.tsx',
  'src/app/auth/signup/page.tsx',
  'src/app/auth/signin/page.tsx',
  'src/components/ShowcaseLandingPage.tsx',
  'src/components/dashboard/EnterpriseDashboard.tsx',
  'src/components/admin/AdminPanel.tsx',
  'src/components/ProductionShowcasePage.tsx',
  'src/components/health/HealthCheckDashboard.tsx'
];

let totalFixesApplied = 0;
let filesModified = 0;

const advancedFixes = [
  // Fix missing closing brackets in JSX elements
  {
    name: 'Fix missing closing brackets in Card/CardHeader/CardTitle',
    pattern: /(<Card[^>]*)\n\s*(<CardHeader[^>]*)\n\s*(<CardTitle[^>]*)\n/g,
    replacement: '$1>\n              $2>\n                $3>\n'
  },
  
  // Fix missing closing brackets in CardContent
  {
    name: 'Fix missing closing brackets in CardContent',
    pattern: /(<CardContent[^>]*)\n\s*(<[^>]+>)/g,
    replacement: '$1>\n              $2'
  },
  
  // Fix malformed self-closing tags
  {
    name: 'Fix malformed self-closing tags',
    pattern: /(\w+)>\/>/g,
    replacement: '$1 />'
  },
  
  // Fix broken JSX element structure
  {
    name: 'Fix broken JSX element structure',
    pattern: /className="([^"]*)" className="([^"]*)"/g,
    replacement: 'className="$1 $2"'
  },
  
  // Fix unclosed JSX elements with glass class
  {
    name: 'Fix unclosed JSX elements with glass class',
    pattern: /className="([^"]*glass[^"]*)\n/g,
    replacement: 'className="$1">\n'
  },
  
  // Fix broken template literals in JSX
  {
    name: 'Fix broken template literals in JSX',
    pattern: /\{([^}]*)\s*\}\s*\{([^}]*)\}/g,
    replacement: '{$1$2}'
  },
  
  // Fix missing closing brackets after className
  {
    name: 'Fix missing closing brackets after className',
    pattern: /className="[^"]*"\s*\n\s*([^<>\n]+)/g,
    replacement: (match, content) => {
      if (content.trim().startsWith('<') || content.trim().startsWith('{')) {
        return match.replace(/"\s*\n/, '">\n');
      }
      return match;
    }
  },
  
  // Fix specific patterns we know are problematic
  {
    name: 'Fix specific Card component patterns',
    pattern: /<Card className="glass"\s*\n\s*<CardHeader/g,
    replacement: '<Card className="glass">\n            <CardHeader'
  },
  
  {
    name: 'Fix specific CardHeader patterns',
    pattern: /<CardHeader className="glass"\s*\n\s*<CardTitle/g,
    replacement: '<CardHeader className="glass">\n              <CardTitle'
  },
  
  {
    name: 'Fix specific CardTitle patterns',
    pattern: /<CardTitle className="[^"]*glass[^"]*"\s*\n\s*([^<])/g,
    replacement: '<CardTitle className="flex items-center gap-2 glass">\n                $1'
  },
  
  // Fix broken attribute assignments
  {
    name: 'Fix broken attribute assignments',
    pattern: /(\w+)>\{([^}]*)\}/g,
    replacement: '$1={$2}'
  },
  
  // Fix space issues in icon components
  {
    name: 'Fix space issues in icon components',
    pattern: /className="([^"]*)\s+"\s*\/>/g,
    replacement: 'className="$1" />'
  }
];

for (const filePath of targetFiles) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      continue;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    let fileFixesApplied = 0;
    
    advancedFixes.forEach(fix => {
      const beforeLength = content.length;
      if (typeof fix.replacement === 'function') {
        content = content.replace(fix.pattern, fix.replacement);
      } else {
        content = content.replace(fix.pattern, fix.replacement);
      }
      
      if (content.length !== beforeLength || content !== content.replace(fix.pattern, fix.replacement)) {
        fileFixesApplied++;
        console.log(`  ✓ Applied ${fix.name} to ${filePath}`);
      }
    });
    
    // Manual fixes for specific known patterns
    if (filePath.includes('community/guidelines')) {
      // Fix the specific glass className issues
      content = content.replace(/className="flex items-center gap-2 glass\n/g, 'className="flex items-center gap-2 glass">\n');
      content = content.replace(/<CardContent className="glass"\n/g, '<CardContent className="glass">\n'); 
      fileFixesApplied += 2;
    }
    
    if (filePath.includes('ShowcaseLandingPage')) {
      // Fix the massive corruption in this file
      content = content.replace(/}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}/g, '}\n');
      content = content.replace(/\n\s*const\s+onClick/g, '\n              onClick');
      fileFixesApplied += 2;
    }
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      filesModified++;
      totalFixesApplied += fileFixesApplied;
      console.log(`📝 Modified ${filePath} (${fileFixesApplied} fixes)`);
    }
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

console.log(`\n✅ Advanced syntax error fixing complete!`);
console.log(`   Files modified: ${filesModified}`);
console.log(`   Total fixes applied: ${totalFixesApplied}`);
console.log(`\n🔍 Run 'npm run typecheck' to verify fixes...`);