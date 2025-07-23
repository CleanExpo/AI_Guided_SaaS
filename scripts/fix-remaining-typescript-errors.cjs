const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * Comprehensive TypeScript Error Fix - Phase 3
 * Targets the remaining complex error patterns identified in analysis
 */

console.log('🔧 Starting Phase 3: Complex TypeScript Error Fixes...\n');

// Get all TypeScript files in src directory
const files = glob.sync('src/**/*.{ts,tsx}', { 
  cwd: process.cwd(),
  absolute: true 
});

let totalChanges = 0;
let filesModified = 0;

console.log(`📁 Found ${files.length} TypeScript files to process\n`);

files.forEach((filePath, index) => {
  try {
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    const _originalContent = content;
    let fileChanges = 0;

    // Progress indicator
    if ((index + 1) % 50 === 0) {
      console.log(`⚙️  Processing file ${index + 1}/${files.length}: ${path.basename(filePath)}`);
}
    // 1. Fix invalid generic interface syntax
    content = content.replace(
      /interface\s+(\w+)<string,\s*any>\s*\{/g, 
      'interface $1 {'
    );
    if (content !== originalContent) fileChanges++;

    // 2. Fix missing React HTML attribute types
    const reactHTMLFixes = [
      { pattern: /extends React\.InputHTMLAttributes(?!\<)/g, replacement: 'extends React.InputHTMLAttributes<HTMLInputElement>' },
      { pattern: /extends React\.TextareaHTMLAttributes(?!\<)/g, replacement: 'extends React.TextareaHTMLAttributes<HTMLTextAreaElement>' },
      { pattern: /extends React\.SelectHTMLAttributes(?!\<)/g, replacement: 'extends React.SelectHTMLAttributes<HTMLSelectElement>' },
      { pattern: /extends React\.ButtonHTMLAttributes(?!\<)/g, replacement: 'extends React.ButtonHTMLAttributes<HTMLButtonElement>' },
      { pattern: /extends React\.FormHTMLAttributes(?!\<)/g, replacement: 'extends React.FormHTMLAttributes<HTMLFormElement>' },
      { pattern: /extends React\.DivHTMLAttributes(?!\<)/g, replacement: 'extends React.HTMLAttributes<HTMLDivElement>' }
    ];

    const _beforeReactFixes = content;
    reactHTMLFixes.forEach(fix => {
      content = content.replace(fix.pattern, fix.replacement);
    });
    if (content !== beforeReactFixes) fileChanges++;

    // 3. Fix malformed generic function calls
    content = content.replace(
      /(\w+)<string,\s*any>\s*\(/g,
      '$1('
    );
    if (content !== beforeReactFixes) fileChanges++;

    // 4. Fix missing closing parentheses in function calls
    content = content.replace(
      /createClient\(\s*;/g,
      'createClient(\n  process.env.NEXT_PUBLIC_SUPABASE_URL!,\n  process.env.SUPABASE_SERVICE_ROLE_KEY!\n);'
    );

    // 5. Fix malformed JSX attribute syntax
    const jsxFixes = [
      // Fix className with double quotes
      { pattern: /className=\\"([^"]+)\\"/g, replacement: 'className="$1"' },
      // Fix malformed self-closing tags
      { pattern: /<(\w+)([^>]*)\s+\/\s*>/g, replacement: '<$1$2 />' },
      // Fix spacing in className concatenation
      { pattern: /className=\{\s*cn\(\s*\n\s*['"`]([^'"`]+)['"`]/g, replacement: 'className={cn(\n            \'$1\'' }
    ];

    const _beforeJSXFixes = content;
    jsxFixes.forEach(fix => {
      content = content.replace(fix.pattern, fix.replacement);
    });
    if (content !== beforeJSXFixes) fileChanges++;

    // 6. Fix function parameter destructuring issues
    const paramFixes = [
      // Fix function parameter with missing type annotations
      { pattern: /\(\{\s*([^}]+)\s*\}:\s*any\)/g, replacement: '({ $1 }: any)' },
      // Fix destructured parameters without proper typing
      { pattern: /=\s*\{\s*([^}]+)\s*\}:\s*any/g, replacement: '= { $1 }: any' }
    ];

    const _beforeParamFixes = content;
    paramFixes.forEach(fix => {
      content = content.replace(fix.pattern, fix.replacement);
    });
    if (content !== beforeParamFixes) fileChanges++;

    // 7. Fix specific supabase client issues
    content = content.replace(
      /const _supabase = createClient\(\s*;/g,
      'const _supabase = createClient(\n  process.env.NEXT_PUBLIC_SUPABASE_URL!,\n  process.env.SUPABASE_SERVICE_ROLE_KEY!\n);'
    );

    // 8. Fix switch statement syntax errors
    content = content.replace(
      /switch\s*\(\s*([^)]+):\s*any\s*\)\s*:\s*any/g,
      'switch ($1)'
    );

    // 9. Fix conditional JSX return statements
    content = content.replace(
      /return\s*\(\s*\n?\s*<([^>]+)>\s*\{\s*([^}]+)\s*\}\s*\n?\s*\)/g,
      'return (\n    <$1>\n      {$2}\n    </$1>\n  )'
    );

    // 10. Fix type annotation issues in loops
    content = content.replace(
      /for\s*\(\s*const\s+\[([^]+),\s*([^\]]+)\]\s+of\s+([^)]+):\s*any\s*\):\s*any/g,
      'for (const [$1, $2] of $3)'
    );

    // 11. Fix malformed object property syntax
    content = content.replace(
      /(\w+):\s*([\w\[\]<>]+);\s*\n/g,
      '$1: $2;\n'
    );

    // 12. Fix return type annotations
    content = content.replace(
      /\):\s*any\s*\{/g,
      ') {'
    );

    // 13. Fix specific React component prop issues
    const reactFixes = [
      // Fix ref forwarding syntax
      { pattern: /React\.forwardRef<([^]+),\s*([^>]+)>\s*\(\s*\(\s*\{([^}]+)\},\s*ref/g, replacement: 'React.forwardRef<$1, $2>(({ $3 }, ref' },
      // Fix component prop destructuring
      { pattern: /\(\{\s*([^}]+):\s*any\s*\}:\s*any\)\s*=>/g, replacement: '({ $1 }: any) =>' }
    ];

    const _beforeReactComponentFixes = content;
    reactFixes.forEach(fix => {
      content = content.replace(fix.pattern, fix.replacement);
    });
    if (content !== beforeReactComponentFixes) fileChanges++;

    // 14. Fix CSS class string formatting
    content = content.replace(
      /'([^']*)\s+([^']*)'(?=\s*[)])/g,
      "'$1 $2'"
    );

    // 15. Fix template literal issues
    content = content.replace(
      /`([^`]*)\$\{([^}]+)\}([^`]*)`\s*;?\s*``/g,
      '`$1${$2}$3`'
    );

    // 16. Fix comma vs semicolon in object literals
    content = content.replace(
      /(\w+):\s*([^,;]+);\s*\n\s*(\w+):/g,
      '$1: $2,\n    $3:'
    );

    // 17. Fix array destructuring in parameters
    content = content.replace(
      /\[([^:]+):\s*any,\s*([^\]]+)\]/g,
      '[$1, $2]'
    );

    // 18. Fix type assertions
    content = content.replace(
      /as\s+([^,;)\]}]+):\s*any/g,
      'as $1'
    );

    // 19. Fix missing closing braces in objects
    content = content.replace(
      /\{\s*([^}]+)\s*\n\s*\}\s*\}\s*;/g,
      '{\n    $1\n  }\n};'
    );

    // 20. Fix specific error patterns from the analyzed files
    const specificFixes = [
      // Fix MCPToolCall pattern
      { pattern: /MCPToolCall<string,\s*any>/g, replacement: 'MCPToolCall' },
      // Fix UserProgress pattern  
      { pattern: /UserProgress<string,\s*number>/g, replacement: 'UserProgress' },
      // Fix HandoffProtocol pattern
      { pattern: /HandoffProtocol<string,\s*any>/g, replacement: 'HandoffProtocol' },
      // Fix specific interface extends issues
      { pattern: /interface\s+(\w+)<([^>]+)>\s+extends\s+Omit<([^>]+)>/g, replacement: 'interface $1 extends Omit<$3>' }
    ];

    const _beforeSpecificFixes = content;
    specificFixes.forEach(fix => {
      content = content.replace(fix.pattern, fix.replacement);
    });
    if (content !== beforeSpecificFixes) fileChanges++;

    // Count total changes in this file
    if (content !== originalContent) {
      filesModified++;
      totalChanges += fileChanges;
      
      // Write the fixed content back to file
      fs.writeFileSync(filePath, content, 'utf8');
      
      if (fileChanges > 0) {
        console.log(`✅ Fixed ${fileChanges} patterns in ${path.relative(process.cwd(), filePath)}`);
}
}
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
}
});

console.log('\n🎉 Phase 3 TypeScript Error Fix Complete!');
console.log(`📊 Summary:`);
console.log(`   • Files processed: ${files.length}`);
console.log(`   • Files modified: ${filesModified}`);
console.log(`   • Total patterns fixed: ${totalChanges}`);
console.log(`\n🔍 Next: Run 'npm run type-check' to see remaining error count\n`);