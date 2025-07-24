#!/usr/bin/env node

/**
 * MCAS Component Syntax Fixer
 * Fixes syntax errors in React components
 */

const fs = require('fs');
const path = require('path');

// Track fixes
let totalFiles = 0;
let filesFixed = 0;

/**
 * Fix component syntax errors
 */
function fixComponentSyntax(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Fix 1: useState with extra JSX closing tags
    // Pattern: useState<Type | null>(null), </Type> => useState<Type | null>(null)
    content = content.replace(/useState<([^>]+)>\(([^)]+)\),\s*<\/[^>]+>/g, 'useState<$1>($2)');
    
    // Fix 2: Multiple useState declarations with commas
    // Pattern: const [a, setA] = useState(x), const => const [a, setA] = useState(x);\n  const
    content = content.replace(/(\]\s*=\s*useState[^;]+),\s*const/g, '$1;\n  const');
    
    // Fix 3: useState with type but wrong semicolon placement
    content = content.replace(/useState<any>\(([^)]+)\),\s*useEffect/g, 'useState<any>($1);\n  \n  useEffect');
    
    // Fix 4: Return statements with extra comma and closing brace
    // Pattern: return <div>...</div>, } => return <div>...</div>;\n  }
    content = content.replace(/return\s+(<[^>]+>[^<]*<\/[^>]+>),\s*}/g, 'return $1;\n  }');
    
    // Fix 5: Fix string literal issues
    content = content.replace(/<string\s*\|\s*null>\(null\);<\/string>/g, '<string | null>(null)');
    
    // Fix 6: Clean up multiple commas/semicolons
    content = content.replace(/,\s*,/g, ',');
    content = content.replace(/;\s*;/g, ';');
    
    // Fix 7: Ensure proper spacing around hooks
    content = content.replace(/\)\s*,\s*use/g, ');\n  \n  use');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      filesFixed++;
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Fix specific problem files
 */
function fixSpecificFiles() {
  // Fix AgentPulseMonitor
  const agentPulsePath = path.join(process.cwd(), 'src/components/AgentPulseMonitor.tsx');
  if (fs.existsSync(agentPulsePath)) {
    let content = fs.readFileSync(agentPulsePath, 'utf8');
    // Fix the specific error pattern
    content = content.replace(
      /const \[pulseStatus, setPulseStatus\]\s*=\s*useState<PulseStatus \| null>\(null\),\s*<\/PulseStatus>,\s*const/g,
      'const [pulseStatus, setPulseStatus] = useState<PulseStatus | null>(null);\n  const'
    );
    fs.writeFileSync(agentPulsePath, content, 'utf8');
    console.log('✓ Fixed src/components/AgentPulseMonitor.tsx');
  }

  // Fix ContainerMonitor
  const containerPath = path.join(process.cwd(), 'src/components/ContainerMonitor.tsx');
  if (fs.existsSync(containerPath)) {
    let content = fs.readFileSync(containerPath, 'utf8');
    // Fix the useState and useEffect issue
    content = content.replace(
      /const \[isLoading, setIsLoading\] = useState<any>\(true\),\s*useEffect/g,
      'const [isLoading, setIsLoading] = useState<any>(true);\n  \n  useEffect'
    );
    // Fix the return statement
    content = content.replace(
      /return <div>Loading container information\.\.\.<\/div>,\s*}/g,
      'return <div>Loading container information...</div>;\n  }'
    );
    fs.writeFileSync(containerPath, content, 'utf8');
    console.log('✓ Fixed src/components/ContainerMonitor.tsx');
  }
}

console.log('🔧 MCAS Component Syntax Fixer');
console.log('==============================\n');

// First fix specific known issues
fixSpecificFiles();

// Then process all component files
function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      if (!entry.name.startsWith('.') && 
          entry.name !== 'node_modules' && 
          entry.name !== '.next') {
        processDirectory(fullPath);
      }
    } else if (entry.isFile() && 
               (entry.name.endsWith('.tsx') || 
                entry.name.endsWith('.jsx'))) {
      totalFiles++;
      if (fixComponentSyntax(fullPath)) {
        console.log(`✓ Fixed ${path.relative(process.cwd(), fullPath)}`);
      }
    }
  }
}

console.log('\nProcessing component files...');
processDirectory(path.join(process.cwd(), 'src/components'));
processDirectory(path.join(process.cwd(), 'src/app'));

console.log(`\n✅ Summary:`);
console.log(`   Total files: ${totalFiles}`);
console.log(`   Files fixed: ${filesFixed}`);