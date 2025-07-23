const fs = require('fs');
const path = require('path');
const glob = require('glob');

// ANSI color codes
const _green = '\x1b[32m';
const _red = '\x1b[31m';
const _yellow = '\x1b[33m';
const _reset = '\x1b[0m';

function fixCommonPatterns(content, filePath) {
  let fixed = content;
  let changeCount = 0;

  // Fix comma/semicolon issues in interfaces and type definitions
  fixed = fixed.replace(/^(\s*\w+\s*\??\s*:\s*[^;}\n]+)(\s*\n\s*(?:\w+\s*\??\s*:|[}\]]))/gm, (match, prop, next) => {
    if (!prop.trim().endsWith(',') && !prop.trim().endsWith(';')) {
      changeCount++;
      return `${prop};${next}`;
}
    return match;
  });

  // Fix JSX syntax issues
  // Fix className concatenation
  fixed = fixed.replace(/className\s*=\s*\{`([^`]+)`\}/g, (match, classes) => {
    // Replace string concatenation within template literals
    const _fixedClasses = classes
      .replace(/`\s*\+\s*`/g, ' ')
      .replace(/\$\{([^}]+)\}\s*\+\s*`([^`]+)`/g, '${$1} $2')
      .replace(/`([^`]+)`\s*\+\s*\$\{([^}]+)\}/g, '$1 ${$2}');
    
    if (fixedClasses !== classes) {
      changeCount++;
      return `className={\`${fixedClasses}\`}`;
}
    return match;
  });

  // Fix JSX self-closing tags
  fixed = fixed.replace(/<(\w+)([^>]*?)\/\s*>/g, (match, tag, attrs) => {
    changeCount++;
    return `<${tag}${attrs} />`;
  });

  // Fix JSX fragments
  fixed = fixed.replace(/<>\s*/g, '<React.Fragment>');
  fixed = fixed.replace(/\s*<\/>/g, '</React.Fragment>');

  // Fix object literal syntax in JSX
  fixed = fixed.replace(/(\w+)\s*=\s*\{\s*\{([^}]+)\}\s*\}/g, (match, attr, content) => {
    changeCount++;
    return `${attr}={ { ${content.trim() }`;
  });

  // Fix function parameter type annotations
  fixed = fixed.replace(/function\s+(\w+)\s*\(([^)]*)\)\s*{/g, (match, name, params) => {
    if (!match.includes(':')) {
      changeCount++;
      return `function ${name}(${params}): void {`;
}
    return match;
  });

  // Fix arrow function type annotations
  fixed = fixed.replace(/const\s+(\w+)\s*=\s*\(([^)]*)\)\s*=>\s*{/g, (match, name, params) => {
    if (!match.includes(':') && !params.includes(':')) {
      changeCount++;
      return `const ${name} = (${params}): void => {`;
}
    return match;
  });

  // Fix async function annotations
  fixed = fixed.replace(/async\s+(\w+)\s*\(([^)]*)\)\s*{/g, (match, name, params) => {
    if (!match.includes(':')) {
      changeCount++;
      return `async ${name}(${params}): Promise<void> {`;
}
    return match;
  });

  // Fix missing any types
  fixed = fixed.replace(/catch\s*\(\s*(\w+)\s*\)/g, 'catch ($1: any)');
  fixed = fixed.replace(/\.map\s*\(\s*\(([^,)]+)\)\s*=>/g, '.map(($1: any) =>');
  fixed = fixed.replace(/\.filter\s*\(\s*\(([^,)]+)\)\s*=>/g, '.filter(($1: any) =>');
  fixed = fixed.replace(/\.forEach\s*\(\s*\(([^,)]+)\)\s*=>/g, '.forEach(($1: any) =>');

  // Fix React component props
  fixed = fixed.replace(/function\s+(\w+)\s*\(\s*\{\s*([^}]+)\s*\}\s*\)/g, (match, compName, props) => {
    if (!match.includes(':')) {
      changeCount++;
      return `function ${compName}({ ${props} }: any)`;
}
    return match;
  });

  // Fix useState calls
  fixed = fixed.replace(/useState\s*\(\s*([^)]+)\s*\)/g, (match, initialValue) => {
    if (!match.includes('<')) {
      changeCount++;
      return `useState<any>(${initialValue})`;
}
    return match;
  });

  // Fix useEffect/useCallback/useMemo dependencies
  fixed = fixed.replace(/(useEffect|useCallback|useMemo)\s*\(\s*\(\)\s*=>\s*{([^}]+)}\s*,\s*\[\s*\]\s*\)/g, 
    '$1(() => {$2}, [])');

  // Fix import/export statements
  fixed = fixed.replace(/^(import\s+.+from\s+['"][^'"]+['"])$/gm, '$1;');
  fixed = fixed.replace(/^(export\s+(?:default\s+)?[^;{]+)$/gm, (match) => {
    if (!match.includes('{') && !match.endsWith(';')) {
      changeCount++;
      return match + ';';
}
    return match;
  });

  // Fix object method shorthand
  fixed = fixed.replace(/(\w+)\s*\(\s*\)\s*{/g, (match, method) => {
    if (!match.startsWith('function') && !match.startsWith('async') && !match.includes('=>')) {
      changeCount++;
      return `${method}() {`;
}
    return match;
  });

  // Fix switch case formatting
  fixed = fixed.replace(/case\s+(['"`][^'"`]+['"`]|\w+)\s*:\s*([^:]+?)(\s*(?:case|default|}))/g, 
    (match, caseValue, body, next) => {
      const trimmedBody = body.trim();
      if (!trimmedBody.endsWith('break') && !trimmedBody.endsWith('return') && 
          !trimmedBody.endsWith('}') && next !== '}') {
        changeCount++;
        return `case ${caseValue}:\n${body}\nbreak;\n${next}`;
}
      return match;
    });

  // Fix array/object destructuring
  fixed = fixed.replace(/const\s*\{\s*([^}]+)\s*\}\s*=\s*([^;]+)$/gm, (match, props, value) => {
    if (!match.endsWith(';')) {
      changeCount++;
      return `const { ${props} } = ${value};`;
}
    return match;
  });

  fixed = fixed.replace(/const\s*\[\s*([^\]]+)\s*\]\s*=\s*([^;]+)$/gm, (match, items, value) => {
    if (!match.endsWith(';')) {
      changeCount++;
      return `const [${items}] = ${value};`;
}
    return match;
  });

  // Fix template literal syntax
  fixed = fixed.replace(/\$\{\s*([^}]+)\s*\}/g, '${$1}');

  // Fix optional chaining and nullish coalescing
  fixed = fixed.replace(/(\w+)\s*\?\.\s*(\w+)/g, '$1?.$2');
  fixed = fixed.replace(/(\w+)\s*\?\?\s*(\w+)/g, '$1 ?? $2');

  // Fix type assertions
  fixed = fixed.replace(/as\s+(\w+)\s*</g, 'as $1<');
  fixed = fixed.replace(/>\s*as\s+(\w+)/g, '> as $1');

  // Remove duplicate semicolons
  fixed = fixed.replace(/;{2}/g, ';');

  // Fix trailing commas in single-line contexts
  fixed = fixed.replace(/,(\s*[}\]])/g, '$1');

  // Fix React Fragment imports if needed
  if (fixed.includes('<React.Fragment>') && !fixed.includes('import React') && !fixed.includes('import * as React')) {
    fixed = `import React from 'react';\n${fixed}`;
    changeCount++;
}
  return { fixed, changeCount };
}
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { fixed, changeCount } = fixCommonPatterns(content, filePath);
    
    if (changeCount > 0 && fixed !== content) {
      fs.writeFileSync(filePath, fixed, 'utf8');
      console.log(`${green}✓${reset} Fixed ${changeCount} patterns in ${path.relative(process.cwd(), filePath)}`);
      return { success: true, changeCount };
}
    return { success: true, changeCount: 0 };
  } catch (error) {
    console.error(`${red}✗${reset} Error processing ${filePath}: ${error.message}`);
    return { success: false, changeCount: 0 };
}
}
function main() {
  console.log(`${yellow}🔧 Fixing Common TypeScript Patterns${reset}\n`);
  
  const patterns = [
    'src/**/*.{ts,tsx}',
    'scripts/**/*.ts',
    'tests/**/*.{ts,tsx}',
    '.agent-os/**/*.ts',
    'mcp/**/*.{ts,tsx}'
  ];
  
  const _excludePatterns = [
    '**/node_modules/**',
    '**/.next/**',
    '**/dist/**',
    '**/build/**',
    '**/*.d.ts'
  ];
  
  let totalFiles = 0;
  let fixedFiles = 0;
  let totalChanges = 0;
  
  patterns.forEach(pattern => {
    const files = glob.sync(pattern, { 
      ignore: excludePatterns,
      nodir: true 
    });
    
    files.forEach(file => {
      totalFiles++;
      const result = processFile(file);
      if (result.changeCount > 0) {
        fixedFiles++;
        totalChanges += result.changeCount;
}
    });
  });
  
  console.log(`\n${green}Summary:${reset}`);
  console.log(`- Total files processed: ${totalFiles}`);
  console.log(`- Files fixed: ${fixedFiles}`);
  console.log(`- Total pattern fixes: ${totalChanges}`);
  
  console.log(`\n${yellow}Run 'npm run build' to check remaining errors${reset}`);
}
main();