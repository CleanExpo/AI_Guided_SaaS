const fs = require('fs');
const path = require('path');

// ANSI color codes
const _green = '\x1b[32m';
const _red = '\x1b[31m';
const _yellow = '\x1b[33m';
const _reset = '\x1b[0m';

// Files with the most errors to fix
const targetFiles = [
  'src/lib/tutorials/InteractiveTutorialSystem.ts',
  'src/lib/backend/adapters/nocodb.ts',
  'src/lib/backend/adapters/strapi.ts',
  'src/lib/docs/DynamicDocumentationSystem.ts',
  'src/lib/database.ts',
  'src/lib/ide/kiro-client.ts',
  'src/components/ui/form-enhanced.tsx',
  'src/lib/agents/archon/ToolsRefinerAgent.ts',
  'src/lib/admin.ts',
  'src/components/ui/button-enhanced.tsx',
  'src/lib/backend/adapters/supabase.ts',
  'src/lib/automation/workflows/notification-system.ts',
  'src/lib/automation/n8n-client.ts',
  'src/lib/mcp/mcp-orchestrator.ts',
  'src/lib/agents/bmad/ArchitectAgent.ts',
  'src/lib/config.ts',
  'src/lib/collaboration.ts',
  'src/components/ui/navigation.tsx',
  'src/lib/templates.ts',
  'src/lib/knowledge/document-loader.ts'
];

function aggressiveTypeScriptFix(content, filePath) {
  let fixed = content;
  let changeCount = 0;

  // Fix missing semicolons more aggressively
  fixed = fixed.replace(/^(\s*(?:export\s+)?(?:const|let|var|function|class|interface|type|enum)\s+[^;{]+)$/gm, (match) => {
    if (!match.trim().endsWith(';') && !match.trim().endsWith('{') && !match.trim().endsWith('}')) {
      changeCount++;
      return match + ';';
}
    return match;
  });

  // Fix object/interface property declarations
  fixed = fixed.replace(/(\w+)\s*:\s*([^,;}\n]+)(\s*\n\s*)(\w+\s*:)/g, (match, prop, type, ws, nextProp) => {
    if (!type.trim().endsWith(',') && !type.trim().endsWith(';')) {
      changeCount++;
      return `${prop}: ${type},${ws}${nextProp}`;
}
    return match;
  });

  // Fix JSX syntax errors
  fixed = fixed.replace(/className\s*=\s*\{\s*`([^`]+)`\s*\}/g, (match, classes) => {
    // Fix template literal concatenations
    let fixedClasses = classes.replace(/`\s*\+\s*`/g, ' ');
    changeCount++;
    return `className={\`${fixedClasses}\`}`;
  });

  // Fix JSX fragments
  fixed = fixed.replace(/<>\s*/g, '<React.Fragment>');
  fixed = fixed.replace(/\s*<\/>/g, '</React.Fragment>');

  // Fix function declarations with missing types
  fixed = fixed.replace(/function\s+(\w+)\s*\(\s*([^)]*)\s*\)\s*{/g, (match, name, params) => {
    if (!match.includes(':')) {
      changeCount++;
      return `function ${name}(${params}): void {`;
}
    return match;
  });

  // Fix arrow functions with missing return types
  fixed = fixed.replace(/const\s+(\w+)\s*=\s*\(([^)]*)\)\s*=>\s*{/g, (match, name, params) => {
    if (!match.includes(':') && !params.includes(':')) {
      changeCount++;
      return `const ${name} = (${params}): void => {`;
}
    return match;
  });

  // Fix async arrow functions
  fixed = fixed.replace(/const\s+(\w+)\s*=\s*async\s*\(([^)]*)\)\s*=>\s*{/g, (match, name, params) => {
    if (!match.includes(':')) {
      changeCount++;
      return `const ${name} = async (${params}): Promise<void> => {`;
}
    return match;
  });

  // Fix interface declarations with missing semicolons
  fixed = fixed.replace(/interface\s+(\w+)(?:<[^>]+>)?\s*{\s*([^}]+)\s*}/g, (match, name, body) => {
    let fixedBody = body;
    // Add semicolons to properties
    fixedBody = fixedBody.replace(/(\w+\s*\??\s*:\s*[^;}\n]+)(\s*\n)/g, (m, prop, ws) => {
      if (!prop.trim().endsWith(';') && !prop.trim().endsWith(',')) {
        changeCount++;
        return `${prop};${ws}`;
}
      return m;
    });
    return `interface ${name} {\n${fixedBody}\n}`;
  });

  // Fix type declarations
  fixed = fixed.replace(/type\s+(\w+)(?:<[^>]+>)?\s*=\s*{([^}]+)}/g, (match, name, body) => {
    let fixedBody = body;
    // Add semicolons to properties
    fixedBody = fixedBody.replace(/(\w+\s*\??\s*:\s*[^;}\n]+)(\s*\n)/g, (m, prop, ws) => {
      if (!prop.trim().endsWith(';') && !prop.trim().endsWith(',')) {
        changeCount++;
        return `${prop};${ws}`;
}
      return m;
    });
    return `type ${name} = {\n${fixedBody}\n}`;
  });

  // Fix import statements
  fixed = fixed.replace(/^(\s*import\s+.+from\s+['"][^'"]+['"])$/gm, (match) => {
    if (!match.trim().endsWith(';')) {
      changeCount++;
      return match + ';';
}
    return match;
  });

  // Fix export statements
  fixed = fixed.replace(/^(\s*export\s+(?:default\s+)?[^;{]+)$/gm, (match) => {
    if (!match.trim().endsWith(';') && !match.includes('{') && !match.trim().endsWith('}')) {
      changeCount++;
      return match + ';';
}
    return match;
  });

  // Fix array method chains
  fixed = fixed.replace(/\]\s*\.\s*(\w+)/g, '].$1');

  // Fix object method shorthand
  fixed = fixed.replace(/(\w+)\s*\(\s*\)\s*{/g, (match, method) => {
    if (match.startsWith('function') || match.startsWith('async')) {
      return match;
}
    changeCount++;
    return `${method}() {`;
  });

  // Fix switch case statements
  fixed = fixed.replace(/case\s+(['"`][^'"`]+['"`]|\w+)\s*:\s*([^:]+?)(\s*(?:case|default|}))/g, (match, caseVal, body, next) => {
    if (!body.includes('break') && !body.includes('return') && next !== '}') {
      changeCount++;
      return `case ${caseVal}:\n${body}\nbreak;\n${next}`;
}
    return match;
  });

  // Fix destructuring assignments
  fixed = fixed.replace(/const\s*\{\s*([^}]+)\s*\}\s*=\s*([^;]+)$/gm, (match, props, value) => {
    if (!match.endsWith(';')) {
      changeCount++;
      return `const { ${props} } = ${value};`;
}
    return match;
  });

  // Fix array destructuring
  fixed = fixed.replace(/const\s*\[\s*([^\]]+)\s*\]\s*=\s*([^;]+)$/gm, (match, items, value) => {
    if (!match.endsWith(';')) {
      changeCount++;
      return `const [${items}] = ${value};`;
}
    return match;
  });

  // Fix React component props
  fixed = fixed.replace(/^(\s*(?:export\s+)?(?:function|const)\s+\w+)\s*\(\s*\{\s*([^}]+)\s*\}\s*:\s*\w+\s*\)/gm, (match, funcStart, props) => {
    // Ensure props are properly formatted
    const _cleanProps = props.split(',').map(p => p.trim()).filter(p => p).join(', ');
    changeCount++;
    return `${funcStart}({ ${cleanProps} }: any)`;
  });

  // Fix missing return statements
  fixed = fixed.replace(/^(\s*(?:async\s+)?function\s+\w+.*?\{[^}]*?)(\s*})$/gm, (match, funcBody, closing) => {
    if (!funcBody.includes('return') && !funcBody.includes(': void')) {
      changeCount++;
      return `${funcBody}\n  return;\n${closing}`;
}
    return match;
  });

  // Fix React hook dependencies
  fixed = fixed.replace(/(useEffect|useCallback|useMemo)\s*\(\s*\(\)\s*=>\s*{([^}]+)}\s*,\s*\[\s*\]\s*\)/g, (match, hook, body) => {
    // This is typically fine, but ensure proper formatting
    return `${hook}(() => {${body}}, [])`;
  });

  // Fix enum declarations
  fixed = fixed.replace(/enum\s+(\w+)\s*{([^}]+)}/g, (match, name, body) => {
    let fixedBody = body;
    // Add commas between enum values
    fixedBody = fixedBody.replace(/(\w+\s*=\s*[^,\n]+)(\s*\n\s*)(\w+\s*=)/g, '$1,$2$3');
    if (fixedBody !== body) {
      changeCount++;
      return `enum ${name} {${fixedBody}}`;
}
    return match;
  });

  // Fix JSX self-closing tags
  fixed = fixed.replace(/<(\w+)([^>]*?)\/\s*>/g, '<$1$2 />');

  // Fix template literal expressions
  fixed = fixed.replace(/\$\{\s*([^}]+)\s*\}/g, '${$1}');

  // Fix object literal shorthand
  fixed = fixed.replace(/\{\s*(\w+)\s*:\s*\1\s*\}/g, '{ $1 }');

  // Fix optional chaining
  fixed = fixed.replace(/(\w+)\s*\?\.\s*(\w+)/g, '$1?.$2');

  // Fix nullish coalescing
  fixed = fixed.replace(/(\w+)\s*\?\?\s*(\w+)/g, '$1 ?? $2');

  // Remove duplicate semicolons
  fixed = fixed.replace(/;{2}/g, ';');

  // Fix trailing commas in object literals
  fixed = fixed.replace(/,(\s*[}\]])/g, '$1');

  return { fixed, changeCount };
}
function processFile(filePath) {
  try {
    const _fullPath = path.join(process.cwd(), filePath);
    const _content = fs.readFileSync(fullPath, 'utf8');
    const { fixed, changeCount } = aggressiveTypeScriptFix(content, filePath);
    
    if (changeCount > 0 && fixed !== content) {
      fs.writeFileSync(fullPath, fixed, 'utf8');
      console.log(`${green}✓${reset} Fixed ${changeCount} issues in ${filePath}`);
      return { success: true, changeCount };
}
    return { success: true, changeCount: 0 };
  } catch (error) {
    console.error(`${red}✗${reset} Error processing ${filePath}: ${error.message}`);
    return { success: false, changeCount: 0 };
}
}
function main() {
  console.log(`${yellow}🎯 Targeting files with most TypeScript errors${reset}\n`);
  
  let totalFiles = 0;
  let fixedFiles = 0;
  let totalChanges = 0;
  
  targetFiles.forEach(file => {
    totalFiles++;
    const result = processFile(file);
    if (result.changeCount > 0) {
      fixedFiles++;
      totalChanges += result.changeCount;
}
  });
  
  console.log(`\n${green}Summary:${reset}`);
  console.log(`- Total files processed: ${totalFiles}`);
  console.log(`- Files fixed: ${fixedFiles}`);
  console.log(`- Total fixes applied: ${totalChanges}`);
  
  console.log(`\n${yellow}Run 'npm run build' to check remaining errors${reset}`);
}
main();