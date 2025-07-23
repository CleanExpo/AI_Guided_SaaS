#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Fix API route syntax errors
function fixApiRoutes() {
  const apiRoutes = glob.sync('src/app/api/**/*.ts', {
    ignore: ['**/node_modules/**', '**/dist/**']
  });

  let totalFixed = 0;

  apiRoutes.forEach(file => {
    try {
      let content = fs.readFileSync(file, 'utf8');
      let fixed = false;

      // Count opening and closing braces
      const openBraces = (content.match(/{/g) || []).length;
      const closeBraces = (content.match(/}/g) || []).length;

      // If there are more opening braces, add closing braces at the end
      if (openBraces > closeBraces) {
        const diff = openBraces - closeBraces;
        content = content.trimEnd() + '\n' + '}'.repeat(diff) + '\n';
        fixed = true;
      }

      // Fix common patterns
      // Fix async function missing closing brace
      if (content.includes('export async function') && !content.trim().endsWith('}')) {
        const lastBrace = content.lastIndexOf('}');
        const lastReturn = content.lastIndexOf('return');
        
        if (lastReturn > lastBrace) {
          content = content.trimEnd() + '\n}\n';
          fixed = true;
        }
      }

      if (fixed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Fixed ${file}`);
        totalFixed++;
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  });

  console.log(`\nFixed ${totalFixed} API route files`);
}

// Run the fixer
fixApiRoutes();