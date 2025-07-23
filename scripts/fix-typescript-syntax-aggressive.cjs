const fs = require('fs');
const path = require('path');
const glob = require('glob');

// ANSI color codes
const _green = '\x1b[32m';
const _red = '\x1b[31m';
const _yellow = '\x1b[33m';
const _reset = '\x1b[0m';

function fixTypeScriptSyntax(content, filePath) {
  let fixed = content;
  let changeCount = 0;

  // Fix semicolons after interface/type declarations
  fixed = fixed.replace(/^(\s*(?:export\s+)?(?:interface|type)\s+\w+(?:<[^>]+>)?\s*=\s*\{[^}]*\})\s*;*\s*$/gm, (match, declaration) => {
    changeCount++;
    return declaration + ';';
  });

  // Fix missing commas in object/interface declarations
  fixed = fixed.replace(/(\w+\s*:\s*(?:string|number|boolean|any|void|null|undefined|\w+(?:<[^>]+>)?|\[[^\]]+\]|\{[^}]+\}|'[^']*'|"[^"]*")(?:\s*\|\s*(?:string|number|boolean|any|void|null|undefined|\w+(?:<[^>]+>)?|\[[^\]]+\]|\{[^}]+\}|'[^']*'|"[^"]*"))*)\s*\n\s*(\w+\s*:)/g, '$1,\n  $2');

  // Fix missing commas in array literals
  fixed = fixed.replace(/(\[[^\]]*?)((?:['"][^'"]*['"]|[^,\[\]]+))\s*\n\s*((?:['"][^'"]*['"]|[^,\[\]]+))/g, (match, start, item1, item2) => {
    if (!item1.trim().endsWith(',') && !item2.trim().startsWith(',')) {
      changeCount++;
      return `${start}${item1},\n  ${item2}`;
}
    return match;
  });

  // Fix object property missing commas
  fixed = fixed.replace(/(\{[^}]*?)(\w+\s*:\s*[^}\n]+)\s*\n\s*(\w+\s*:)/g, (match, start, prop1, prop2) => {
    if (!prop1.trim().endsWith(',')) {
      changeCount++;
      return `${start}${prop1},\n  ${prop2}`;
}
    return match;
  });

  // Fix JSX className concatenation
  fixed = fixed.replace(/className=\{`([^`]+)`\s*\+\s*`([^`]+)`\}/g, (match, part1, part2) => {
    changeCount++;
    return `className={\`${part1} ${part2}\`}`;
  });

  // Fix template literal syntax errors
  fixed = fixed.replace(/`([^`]*)\$\{([^}]+)\}([^`]*)`\s*\+\s*`([^`]*)`/g, (match, before, expr, after, next) => {
    changeCount++;
    return `\`${before}\${${expr}}${after}${next}\``;
  });

  // Fix JSX expression syntax
  fixed = fixed.replace(/<(\w+)([^>]*?)>\s*\{([^}]+)\}\s*<\/\1>/g, (match, tag, attrs, content) => {
    // Ensure proper spacing
    const _cleanContent = content.trim();
    if (cleanContent !== content) {
      changeCount++;
      return `<${tag}${attrs}>{${cleanContent}}</${tag}>`;
}
    return match;
  });

  // Fix arrow function syntax
  fixed = fixed.replace(/(\w+)\s*=>\s*\{([^}]+)\}\s*;*$/gm, (match, param, body) => {
    if (!body.trim().endsWith(';') && !body.trim().endsWith('}')) {
      changeCount++;
      return `${param} => { ${body.trim()}; }`;
}
    return match;
  });

  // Fix missing semicolons after variable declarations
  fixed = fixed.replace(/^(\s*(?:const|let|var)\s+\w+(?:\s*:\s*[^=]+)?\s*=\s*[^;{\n]+)$/gm, (match, declaration) => {
    if (!declaration.trim().endsWith(';') && !declaration.trim().endsWith('}') && !declaration.trim().endsWith(')')) {
      changeCount++;
      return declaration + ';';
}
    return match;
  });

  // Fix export statement syntax
  fixed = fixed.replace(/^(\s*export\s+(?:const|let|var|function|class)\s+\w+[^;{]*?)$/gm, (match, exportStmt) => {
    if (!exportStmt.trim().endsWith(';') && !exportStmt.trim().endsWith('}') && !exportStmt.includes('{')) {
      changeCount++;
      return exportStmt + ';';
}
    return match;
  });

  // Fix import statement syntax
  fixed = fixed.replace(/^(\s*import\s+(?:\*\s+as\s+\w+|\{[^}]+\}|\w+)\s+from\s+['"][^'"]+['"])$/gm, (match, importStmt) => {
    changeCount++;
    return importStmt + ';';
  });

  // Fix JSX self-closing tags
  fixed = fixed.replace(/<(\w+)([^>]*?)\/\s*>/g, '<$1$2 />');

  // Fix React Fragment syntax
  fixed = fixed.replace(/<>\s*</g, '<React.Fragment>');
  fixed = fixed.replace(/\s*<\/>/g, '</React.Fragment>');

  // Fix async function syntax
  fixed = fixed.replace(/async\s+(\w+)\s*\(\s*\)\s*=>\s*\{/g, 'async $1() => {');

  // Fix type assertion syntax
  fixed = fixed.replace(/as\s+(\w+)\s*</g, 'as $1<');

  // Fix generic type syntax
  fixed = fixed.replace(/:\s*(\w+)\s*<\s*([^>]+)\s*>\s*([;])/g, ': $1<$2>$3');

  // Fix function parameter syntax
  fixed = fixed.replace(/function\s+(\w+)\s*\(\s*([^)]*?)\s*\)\s*:\s*(\w+)\s*\{/g, (match, name, params, returnType) => {
    const _cleanParams = params.split(',').map(p => p.trim()).join(', ');
    changeCount++;
    return `function ${name}(${cleanParams}): ${returnType} {`;
  });

  // Fix interface property syntax
  fixed = fixed.replace(/interface\s+(\w+)\s*\{([^}]+)\}/g, (match, name, body) => {
    let cleanBody = body;
    // Ensure all properties end with semicolon or comma
    cleanBody = cleanBody.replace(/(\w+\s*\??\s*:\s*[^;,\n]+)(\s*\n)/g, '$1;$2');
    if (cleanBody !== body) {
      changeCount++;
      return `interface ${name} {${cleanBody}}`;
}
    return match;
  });

  // Fix enum syntax
  fixed = fixed.replace(/enum\s+(\w+)\s*\{([^}]+)\}/g, (match, name, body) => {
    let cleanBody = body;
    // Ensure all enum values are properly separated
    cleanBody = cleanBody.replace(/(\w+\s*=\s*[^,\n]+)(\s*\n\s*)(\w+\s*=)/g, '$1,$2$3');
    if (cleanBody !== body) {
      changeCount++;
      return `enum ${name} {${cleanBody}}`;
}
    return match;
  });

  // Fix destructuring syntax
  fixed = fixed.replace(/const\s*\{\s*([^}]+)\s*\}\s*=\s*(\w+)\s*;*$/gm, (match, props, obj) => {
    const _cleanProps = props.split(',').map(p => p.trim()).join(', ');
    changeCount++;
    return `const { ${cleanProps} } = ${obj};`;
  });

  // Fix array destructuring
  fixed = fixed.replace(/const\s*\[\s*([^\]]+)\s*\]\s*=\s*(\w+)\s*;*$/gm, (match, items, arr) => {
    const _cleanItems = items.split(',').map(i => i.trim()).join(', ');
    changeCount++;
    return `const [${cleanItems}] = ${arr};`;
  });

  // Fix switch case syntax
  fixed = fixed.replace(/case\s+(['"][^'"]+['"]|\w+)\s*:\s*([^:]+?)(\s*case\s+|default\s*:|$)/gm, (match, caseValue, body, next) => {
    if (!body.trim().endsWith('break;') && !body.trim().endsWith('return') && !body.trim().endsWith('}')) {
      changeCount++;
      return `case ${caseValue}:\n    ${body.trim()}\n    break;\n${next}`;
}
    return match;
  });

  // Fix object method syntax
  fixed = fixed.replace(/(\w+)\s*:\s*function\s*\(/g, '$1: function(');
  fixed = fixed.replace(/(\w+)\s*:\s*async\s+function\s*\(/g, '$1: async function(');

  // Fix trailing commas in function parameters
  fixed = fixed.replace(/\(([^)]+),\s*\)/g, '($1)');

  // Fix multiple semicolons
  fixed = fixed.replace(/;{2}/g, ';');

  // Fix object spread syntax
  fixed = fixed.replace(/\.\.\.\s*(\w+)\s*,/g, '...$1,');

  // Fix return statement syntax
  fixed = fixed.replace(/return\s*\n\s*\{/g, 'return {');

  // Fix else if syntax
  fixed = fixed.replace(/\}\s*else\s+if\s*\(/g, '} else if (');

  // Fix try-catch syntax
  fixed = fixed.replace(/catch\s*\(\s*\)\s*\{/g, 'catch (error) {');

  // Fix logical operator spacing
  fixed = fixed.replace(/(\w+)\s*\|\|\s*(\w+)/g, '$1 || $2');
  fixed = fixed.replace(/(\w+)\s*&&\s*(\w+)/g, '$1 && $2');

  // Fix type union syntax
  fixed = fixed.replace(/:\s*(\w+)\s*\|\s*(\w+)/g, ': $1 | $2');

  // Fix optional chaining
  fixed = fixed.replace(/(\w+)\s*\?\.\s*(\w+)/g, '$1?.$2');

  // Fix nullish coalescing
  fixed = fixed.replace(/(\w+)\s*\?\?\s*(\w+)/g, '$1 ?? $2');

  return { fixed, changeCount };
}
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { fixed, changeCount } = fixTypeScriptSyntax(content, filePath);
    
    if (changeCount > 0 && fixed !== content) {
      fs.writeFileSync(filePath, fixed, 'utf8');
      console.log(`${green}✓${reset} Fixed ${changeCount} syntax issues in ${path.relative(process.cwd(), filePath)}`);
      return { success: true, changeCount };
}
    return { success: true, changeCount: 0 };
  } catch (error) {
    console.error(`${red}✗${reset} Error processing ${filePath}: ${error.message}`);
    return { success: false, changeCount: 0 };
}
}
function main() {
  console.log(`${yellow}🔧 Aggressive TypeScript Syntax Fixer${reset}\n`);
  
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
  console.log(`- Total syntax fixes: ${totalChanges}`);
  
  console.log(`\n${yellow}Run 'npm run build' to check remaining errors${reset}`);
}
main();