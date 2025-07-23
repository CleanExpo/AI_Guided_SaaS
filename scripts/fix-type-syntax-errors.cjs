#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Pattern to fix type annotations with semicolons in the middle
function fixTypeSyntaxErrors(content) {
  let fixed = content;
  let changeCount = 0;

  // Fix string types with semicolons: strin;g -> string
  fixed = fixed.replace(/\bstrin;g\b/g, () => {
    changeCount++;
    return 'string';
  });

  // Fix number types with semicolons: numbe;r -> number
  fixed = fixed.replace(/\bnumbe;r\b/g, () => {
    changeCount++;
    return 'number';
  });

  // Fix boolean types with semicolons: boolea;n -> boolean
  fixed = fixed.replace(/\bboolea;n\b/g, () => {
    changeCount++;
    return 'boolean';
  });

  // Fix Date types with semicolons: Dat;e -> Date
  fixed = fixed.replace(/\bDat;e\b/g, () => {
    changeCount++;
    return 'Date';
  });

  // Fix array brackets with semicolons: [;] -> []
  fixed = fixed.replace(/\[;\]/g, () => {
    changeCount++;
    return '[]';
  });

  // Fix string literals in types: 'critical;' -> 'critical'
  fixed = fixed.replace(/'([^']*);'/g, (match, p1) => {
    changeCount++;
    return `'${p1}'`;
  });

  // Fix Record types: Record<strin;g -> Record<string
  fixed = fixed.replace(/Record<strin;g/g, () => {
    changeCount++;
    return 'Record<string';
  });

  // Fix interface property definitions with multiple issues
  fixed = fixed.replace(/(\w+):\s*strin;g;/g, (match, prop) => {
    changeCount++;
    return `${prop}: string;`;
  });

  fixed = fixed.replace(/(\w+):\s*numbe;r;/g, (match, prop) => {
    changeCount++;
    return `${prop}: number;`;
  });

  fixed = fixed.replace(/(\w+):\s*boolea;n;/g, (match, prop) => {
    changeCount++;
    return `${prop}: boolean;`;
  });

  fixed = fixed.replace(/(\w+):\s*Dat;e;/g, (match, prop) => {
    changeCount++;
    return `${prop}: Date;`;
  });

  // Fix Promise types
  fixed = fixed.replace(/Promise\s*{\s*$/gm, () => {
    changeCount++;
    return 'Promise<any> {';
  });

  // Fix function parameter destructuring
  fixed = fixed.replace(/const\s+{([^}]+)}\s*=\s*params;/g, (match, params) => {
    changeCount++;
    return `const { ${params} } = params;`;
  });

  // Fix variable declarations with wrong syntax
  fixed = fixed.replace(/const\s+_(\w+)\s*=;/g, (match, varName) => {
    changeCount++;
    return `const ${varName} =`;
  });

  // Fix unclosed template literals
  fixed = fixed.replace(/`([^`]*)\$\{([^}]+)\}%`([^`]*)``;/g, (match, p1, p2, p3) => {
    changeCount++;
    return `\`${p1}\${${p2}}%${p3}\`;`;
  });

  // Fix broken destructuring assignments
  fixed = fixed.replace(/const\s+{([^}]+)}\s*}\s*=\s*params;/g, (match, props) => {
    changeCount++;
    return `const { ${props} } = params;`;
  });

  // Fix missing commas in objects/interfaces
  fixed = fixed.replace(/}\s*}\s*,/g, () => {
    changeCount++;
    return '},';
  });

  // Fix duplicate closing braces
  fixed = fixed.replace(/}\s*}}\s*;/g, () => {
    changeCount++;
    return '};';
  });

  // Fix await expressions
  fixed = fixed.replace(/const\s+{([^}]+)}\s*}:\s*any\s*=\s*await/g, (match, props) => {
    changeCount++;
    return `const { ${props} }: any = await`;
  });

  // Fix broken ternary operators
  fixed = fixed.replace(/const\s+_(\w+)\s*=\s*(\w+)\s*;/g, (match, varName, condition) => {
    changeCount++;
    return `const ${varName} = ${condition}`;
  });

  return { fixed, changeCount };
}

async function fixFiles() {
  const files = glob.sync('src/**/*.{ts,tsx}', {
    ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
  });

  let totalFiles = 0;
  let totalChanges = 0;

  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const { fixed, changeCount } = fixTypeSyntaxErrors(content);
      
      if (changeCount > 0) {
        fs.writeFileSync(file, fixed, 'utf8');
        console.log(`Fixed ${changeCount} syntax errors in ${file}`);
        totalFiles++;
        totalChanges += changeCount;
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  }

  console.log(`\nFixed ${totalChanges} syntax errors across ${totalFiles} files`);
}

// Run the fixer
fixFiles().catch(console.error);