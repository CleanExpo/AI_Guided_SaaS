#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Fix zod schema syntax errors
function fixZodSchemas(content) {
  let fixed = content;
  let changeCount = 0;

  // Fix semicolons in z.enum() definitions
  fixed = fixed.replace(/z\.enum\(\[([^\]]*)\]\);/g, (match, enumContent) => {
    const fixedEnum = enumContent.replace(/;/g, ',');
    changeCount++;
    return `z.enum([${fixedEnum}]),`;
  });

  // Fix semicolons in z.string() chains
  fixed = fixed.replace(/z\.string\(\)([^,\n]*);/g, (match, chain) => {
    changeCount++;
    return `z.string()${chain},`;
  });

  // Fix object property definitions with semicolons
  fixed = fixed.replace(/(\w+):\s*z\.(\w+)\([^)]*\);/g, (match, prop, method) => {
    if (match.includes('),') || match.includes('})')) {
      return match; // Already has comma
    }
    changeCount++;
    return match.replace(/;$/, ',');
  });

  // Fix z.array(z.object({ with extra comma
  fixed = fixed.replace(/z\.array\(z\.object\({,/g, () => {
    changeCount++;
    return 'z.array(z.object({';
  });

  // Fix semicolons at end of property definitions in objects
  fixed = fixed.replace(/(\s+)(\w+):\s*z\.string\(\);/g, (match, indent, prop) => {
    changeCount++;
    return `${indent}${prop}: z.string(),`;
  });

  // Fix force-dynamic export on same line as import
  fixed = fixed.replace(/export const dynamic = 'force-dynamic';import/g, () => {
    changeCount++;
    return "export const dynamic = 'force-dynamic';\n\nimport";
  });

  return { fixed, changeCount };
}

// Process API routes
async function processFiles() {
  const files = glob.sync('src/app/api/**/*.ts', {
    ignore: ['**/node_modules/**', '**/dist/**', '**/*.d.ts']
  });

  let totalChanges = 0;
  let filesFixed = 0;

  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      // Skip if file doesn't contain zod
      if (!content.includes('z.') || !content.includes('import { z }')) {
        continue;
      }

      const { fixed, changeCount } = fixZodSchemas(content);
      
      if (changeCount > 0) {
        fs.writeFileSync(file, fixed, 'utf8');
        console.log(`Fixed ${changeCount} issues in ${file}`);
        totalChanges += changeCount;
        filesFixed++;
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  }

  console.log(`\nFixed ${totalChanges} issues across ${filesFixed} files`);
}

// Run
processFiles().catch(console.error);