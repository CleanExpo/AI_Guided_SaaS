const fs = require('fs');
const path = require('path');

// Fix SelfCheckTrigger.tsx
const selfCheckPath = path.join(__dirname, '..', 'src/components/admin/SelfCheckTrigger.tsx');
if (fs.existsSync(selfCheckPath)) {
  let content = fs.readFileSync(selfCheckPath, 'utf8');
  // Fix the malformed React.FC syntax
  content = content.replace(
    /const SelfCheckTrigger: React\.FC<SelfCheckTriggerProps>\s*= \({ onReportGenerated }\) => {<\/SelfCheckTriggerProps>/g,
    'const SelfCheckTrigger: React.FC<SelfCheckTriggerProps> = ({ onReportGenerated }) => {'
  );
  // Fix malformed state declarations
  content = content.replace(/<\/HealthMetrics>/g, '');
  fs.writeFileSync(selfCheckPath, content);
  console.log('Fixed SelfCheckTrigger.tsx');
}

// Fix analytics/route.ts line 69-70
const analyticsPath = path.join(__dirname, '..', 'src/app/api/analytics/route.ts');
if (fs.existsSync(analyticsPath)) {
  let content = fs.readFileSync(analyticsPath, 'utf8');
  content = content.replace(/event\)\s*tracked: true,\)/g, 'event,\n                tracked: true,');
  fs.writeFileSync(analyticsPath, content);
  console.log('Fixed analytics/route.ts');
}

// Fix backend-example/route.ts line 24-25
const backendPath = path.join(__dirname, '..', 'src/app/api/backend-example/route.ts');
if (fs.existsSync(backendPath)) {
  let content = fs.readFileSync(backendPath, 'utf8');
  content = content.replace(
    /message: 'Project created successfully'\)\s*project/g,
    "message: 'Project created successfully',\n            project"
  );
  fs.writeFileSync(backendPath, content);
  console.log('Fixed backend-example/route.ts');
}

// Fix collaboration/rooms/route.ts line 68-69
const collaborationPath = path.join(__dirname, '..', 'src/app/api/collaboration/rooms/route.ts');
if (fs.existsSync(collaborationPath)) {
  let content = fs.readFileSync(collaborationPath, 'utf8');
  content = content.replace(
    /operation: 'getRooms'\)\s*module: 'collaboration\/rooms'\)/g,
    "operation: 'getRooms',\n            module: 'collaboration/rooms'"
  );
  fs.writeFileSync(collaborationPath, content);
  console.log('Fixed collaboration/rooms/route.ts');
}

// Fix config/route.ts line 25-26
const configPath = path.join(__dirname, '..', 'src/app/api/config/route.ts');
if (fs.existsSync(configPath)) {
  let content = fs.readFileSync(configPath, 'utf8');
  content = content.replace(/feature,\)\s*enabled\s*}\)/g, 'feature,\n                enabled\n            });');
  fs.writeFileSync(configPath, content);
  console.log('Fixed config/route.ts');
}

// Comprehensive pattern fix for all files
const srcDir = path.join(__dirname, '..', 'src');

function finalPatternFix(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      finalPatternFix(fullPath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      // Fix malformed object properties: key) -> key,
      content = content.replace(/([a-zA-Z_]+)\)\s*([a-zA-Z_]+):/g, '$1,\n                $2:');
      
      // Fix malformed closing tags in TSX
      content = content.replace(/<\/[A-Za-z]+>/g, (match) => {
        // Only keep valid closing tags that match opening tags
        if (content.includes(match.replace('/', ''))) {
          return match;
        }
        return '';
      });
      
      // Fix double semicolons
      content = content.replace(/;;/g, ';');
      
      // Fix object syntax with trailing parentheses
      content = content.replace(/,\)\s*}/g, '\n            }');
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content);
        console.log(`Applied final patterns to ${path.relative(srcDir, fullPath)}`);
      }
    }
  });
}

finalPatternFix(srcDir);

console.log('\n✅ ABSOLUTE FINAL FIX COMPLETE!');
console.log('This should resolve all remaining syntax errors.');