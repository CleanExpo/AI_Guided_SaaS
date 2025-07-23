const fs = require('fs');
const path = require('path');

const apiDir = path.join(__dirname, '..', 'src', 'app', 'api');

// List of specific files that need fixing
const filesToFix = [
  'cycle-detection/route.ts',
  'email/test/route.ts',
  'feedback/route.ts',
  'agents/pulse-status/route.ts',
  'agents/pulse-config/route.ts',
  'agent-chat/route.ts',
  'admin/users/route.ts',
  'admin/users/[id]/route.ts',
  'admin/stats/route.ts',
  'admin/direct-auth/route.ts',
  'admin/debug/route.ts',
  'admin/auth/login/route.ts',
  'admin/analytics/route.ts',
  'backend-example/route.ts',
  'auth/[...nextauth]/options.ts',
  'auth/session/route.ts',
  'n8n/execute/route.ts',
  'analytics/route.ts',
  'admin/route.ts'
];

// Function to fix specific syntax patterns
function fixSyntaxPatterns(content) {
  let fixed = content;
  
  // Fix error response patterns - }; followed by { status:
  fixed = fixed.replace(/}\s*;\s*{\s*status:\s*(\d+)\s*}/g, '}, { status: $1 }');
  
  // Fix object properties with semicolons that should be commas
  // This handles patterns like:
  // property: value;
  // nextProperty: value
  fixed = fixed.replace(/:\s*([^;,\n}]+);(\s*\n\s*\w+:)/g, ': $1,$2');
  
  // Fix last property in object ending with semicolon
  fixed = fixed.replace(/:\s*([^;,\n}]+);(\s*\n\s*})/g, ': $1$2');
  
  // Fix z.object schema definitions
  fixed = fixed.replace(/z\.string\(\)[^,;]*;/g, (match) => {
    if (match.includes(')')) {
      return match.replace(/;$/, ',');
    }
    return match;
  });
  
  // Fix interface properties
  fixed = fixed.replace(/interface\s+\w+\s*{([^}]+)}/g, (match, body) => {
    const fixedBody = body
      .split('\n')
      .map(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.endsWith(';') && !trimmed.endsWith(',') && trimmed.includes(':')) {
          return line.replace(/,\s*$/, ';');
        }
        return line;
      })
      .join('\n');
    return match.replace(body, fixedBody);
  });
  
  // Fix specific patterns in object literals
  fixed = fixed.replace(/const\s+\w+\s*=\s*{([^}]+)},/g, (match, body) => {
    const fixedBody = body.replace(/;(\s*\n)/g, ',$1');
    return match.replace(body, fixedBody);
  });
  
  // Fix authOptions specific pattern
  fixed = fixed.replace(/export const authOptions: NextAuthOptions = {,/g, 
    'export const authOptions: NextAuthOptions = {');
  
  // Fix nested object comma patterns
  fixed = fixed.replace(/:\s*{\s*,/g, ': {');
  
  // Fix array ending patterns
  fixed = fixed.replace(/}\s*]\s*;/g, '}\n    ];');
  
  // Fix specific response patterns
  fixed = fixed.replace(/const response: \w+ = {,/g, (match) => {
    return match.replace('{,', '{');
  });
  
  return fixed;
}

// Process each file
filesToFix.forEach(filePath => {
  const fullPath = path.join(apiDir, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  
  try {
    const content = fs.readFileSync(fullPath, 'utf8');
    const fixed = fixSyntaxPatterns(content);
    
    if (content !== fixed) {
      fs.writeFileSync(fullPath, fixed, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
    } else {
      console.log(`✓ No changes needed: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }
});

console.log('\nDone fixing targeted API route syntax issues!');