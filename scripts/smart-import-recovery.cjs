#!/usr/bin/env node

/**
 * Smart Import Recovery Script
 * Fixes broken import statements caused by overly aggressive cleanup
 * 
 * Target: Restore proper import syntax without breaking JSX
 */

const fs = require('fs');
const glob = require('glob');

console.log('🚑 SMART IMPORT RECOVERY - Fixing broken imports...\n');

const stats = {
  filesProcessed: 0,
  importsFixed: 0,
  errors: []
};

function fixImportStatements(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return false;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    const originalContent = content;

    console.log(`🔧 Fixing imports in: ${filePath}`);

    // Fix 1: Restore broken import paths that got split across lines
    // Pattern: import { Something } from '@\n              components\n              ui/something';
    const brokenImportPattern = /import\s+\{([^}]+)\}\s+from\s+'@\s*\n\s*components\s*\n\s*([^']+)';/g;
    content = content.replace(brokenImportPattern, (match, imports, path) => {
      hasChanges = true;
      return `import {${imports}} from '@/components/${path.trim()}';`;
    });

    // Fix 2: Restore broken import paths with different module patterns
    const brokenImportPattern2 = /import\s+\{([^}]+)\}\s+from\s+'([^']*)\s*\n\s*([^']*)\s*\n\s*([^']*)\s*';/g;
    content = content.replace(brokenImportPattern2, (match, imports, part1, part2, part3) => {
      if (part1.includes('@') || part1.includes('/')) {
        hasChanges = true;
        const fullPath = `${part1.trim()}/${part2.trim()}/${part3.trim()}`.replace(/\/+/g, '/');
        return `import {${imports}} from '${fullPath}';`;
      }
      return match;
    });

    // Fix 3: Handle specific broken patterns we've seen
    // Fix '@/components/ui/card' that became '@\n              components\n              ui/card'
    content = content.replace(
      /import\s+\{([^}]+)\}\s+from\s+'@\s*\n\s*components\s*\n\s*ui\/([^']+)';/g,
      "import {$1} from '@/components/ui/$2';"
    );

    // Fix 4: Handle health components pattern
    content = content.replace(
      /import\s+\{([^}]+)\}\s+from\s+'@\s*\n\s*components\s*\n\s*health\/([^']+)';/g,
      "import {$1} from '@/components/health/$2';"
    );

    // Fix 5: Handle admin components pattern
    content = content.replace(
      /import\s+\{([^}]+)\}\s+from\s+'\.\.\/\.\.\/\.\.\s*\n\s*components\s*\n\s*admin\/([^']+)';/g,
      "import {$1} from '../../../components/admin/$2';"
    );

    // Fix 6: Handle next/navigation and other core imports
    content = content.replace(
      /import\s+\{([^}]+)\}\s+from\s+'next\s*\n\s*navigation';/g,
      "import {$1} from 'next/navigation';"
    );

    // Fix 7: Handle lucide-react imports
    content = content.replace(
      /import\s+\{([^}]+)\}\s+from\s+'lucide-react\s*\n\s*';/g,
      "import {$1} from 'lucide-react';"
    );

    // Fix 8: Handle Link imports
    content = content.replace(
      /import\s+Link\s+from\s+'next\s*\n\s*link';/g,
      "import Link from 'next/link';"
    );

    // Fix 9: Handle React imports
    content = content.replace(
      /import\s+React(?:,\s*\{([^}]*)\})?\s+from\s+'react\s*\n\s*';/g,
      (match, hooks) => {
        if (hooks) {
          return `import React, {${hooks}} from 'react';`;
        }
        return "import React from 'react';";
      }
    );

    // Fix 10: Clean up any remaining malformed imports
    content = content.replace(
      /import\s+([^;]+);\s*\n\s*import\s+([^;]+);/g,
      'import $1;\nimport $2;'
    );

    // Fix 11: Handle broken comment patterns that interfere with imports
    content = content.replace(
      /\/\/\s*app\/[^/]*\/[^/]*\/[^/]*\/[^/]*\.tsx\/import/g,
      '// app/...\nimport'
    );

    // Fix 12: Handle broken JSX that got mixed with imports
    content = content.replace(
      /page\.tsx\/import/g,
      'page.tsx\nimport'
    );

    // Fix 13: Specific patterns we've identified
    const specificFixes = [
      {
        pattern: /import\s+\{([^}]+)\}\s+from\s+'@\s+components\s+ui\/([^']+)';/g,
        replacement: "import {$1} from '@/components/ui/$2';"
      },
      {
        pattern: /import\s+\{([^}]+)\}\s+from\s+'@\s+components\s+health\/([^']+)';/g,
        replacement: "import {$1} from '@/components/health/$2';"
      }
    ];

    specificFixes.forEach(fix => {
      const matches = content.match(fix.pattern);
      if (matches) {
        content = content.replace(fix.pattern, fix.replacement);
        hasChanges = true;
      }
    });

    // Count the fixes
    if (hasChanges) {
      const importLines = content.match(/^import\s+.*$/gm) || [];
      const fixedImports = importLines.filter(line => 
        line.includes('@/') || 
        line.includes('next/') || 
        line.includes('react') ||
        line.includes('lucide-react')
      ).length;
      
      stats.importsFixed += fixedImports;
      console.log(`   ✅ Fixed ${fixedImports} import statements`);
    } else {
      console.log(`   ℹ️  No import fixes needed`);
    }

    if (hasChanges) {
      fs.writeFileSync(filePath, content);
      return true;
    }

    return false;

  } catch (error) {
    console.error(`❌ Error fixing imports in ${filePath}:`, error.message);
    stats.errors.push({file: filePath, error: error.message});
    return false;
  }
}

// Specific manual fixes for the most broken files
function applyManualFixes() {
  console.log('🔧 Applying targeted manual fixes...\n');

  // Fix cookies page that got completely mangled
  const cookiesPath = 'src/app/cookies/page.tsx';
  if (fs.existsSync(cookiesPath)) {
    const cookiesContent = `import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy - AI Guided SaaS Platform',
  description: 'Our cookie policy and how we use cookies on our platform'
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Cookie Policy</h1>
          
          <div className="space-y-6">
            <p className="text-lg">
              This Cookie Policy explains how AI Guided SaaS ("we", "us", or "our") uses cookies and similar technologies when you visit our website.
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">What Are Cookies?</h2>
              <p>
                Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Cookies</h2>
              <p>We use cookies for the following purposes:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Essential Cookies:</strong> These are necessary for the website to function properly</li>
                <li><strong>Analytics Cookies:</strong> These help us understand how visitors interact with our website</li>
                <li><strong>Functional Cookies:</strong> These enable enhanced functionality and personalization</li>
                <li><strong>Marketing Cookies:</strong> These are used to deliver relevant advertisements</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Managing Cookies</h2>
              <p>
                You can control cookies through your browser settings. Most browsers allow you to view, block, and delete cookies.
              </p>
              <p className="mt-4">
                Please note that blocking all cookies may affect the functionality of our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p>
                If you have any questions about our Cookie Policy, please contact us at{' '}
                <a href="mailto:privacy@aiguidedsaas.com" className="text-blue-600 hover:text-blue-700">
                  privacy@aiguidedsaas.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}`;

    fs.writeFileSync(cookiesPath, cookiesContent);
    console.log('✅ Manually reconstructed cookies/page.tsx');
  }

  // Fix about page structure
  const aboutPath = 'src/app/about/page.tsx';
  if (fs.existsSync(aboutPath)) {
    let content = fs.readFileSync(aboutPath, 'utf8');
    
    // Fix the broken ending
    content = content.replace(
      /< div>\s*< div>\s*\);\s*\}/,
      `      </div>
    </div>
  );
}`
    );
    
    fs.writeFileSync(aboutPath, content);
    console.log('✅ Manually fixed about/page.tsx structure');
  }
}

async function main() {
  console.log('🚑 Starting Smart Import Recovery...\n');

  // Apply manual fixes first
  applyManualFixes();

  // Find all TypeScript/TSX files in src
  const tsFiles = glob.sync('src/**/*.{ts,tsx}');
  
  console.log(`\n🔧 Processing ${tsFiles.length} TypeScript files...\n`);

  let filesFixed = 0;
  tsFiles.forEach(filePath => {
    if (fixImportStatements(filePath)) {
      filesFixed++;
    }
    stats.filesProcessed++;
  });

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('🎯 SMART IMPORT RECOVERY COMPLETE');
  console.log('='.repeat(60));
  console.log(`📁 Files processed: ${stats.filesProcessed}`);
  console.log(`🔧 Files with fixes: ${filesFixed}`);
  console.log(`📝 Total imports fixed: ${stats.importsFixed}`);
  console.log(`❌ Errors encountered: ${stats.errors.length}`);

  if (stats.errors.length > 0) {
    console.log('\n❌ Errors:');
    stats.errors.forEach(err => {
      console.log(`   ${err.file}: ${err.error}`);
    });
  }

  console.log('\n🚀 Next: Run "npm run build" to verify recovery');
  console.log('🎯 Expected: Build should succeed or show minimal errors');
}

// Execute the recovery
main().catch(console.error);