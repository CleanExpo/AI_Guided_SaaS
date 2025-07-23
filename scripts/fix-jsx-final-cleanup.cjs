#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔧 Final JSX Cleanup Script\n');

// Files identified from build errors
const targetFiles = [
  'src/components/ui/progress.tsx',
  'src/app/admin/agent-monitor/page.tsx',
  'src/app/admin/causal/page.tsx',
  'src/components/admin/SystemResourceMonitor.tsx',
  'src/components/backend/BackendSelector.tsx',
  'src/components/builder/NoCodeBuilder.tsx'
];

const fixes = [
  {
    // Fix progress.tsx - remove extra closing tags
    file: 'src/components/ui/progress.tsx',
    fixes: [
      {
        find: /    <\/typeof>\n\)\)\nProgress\.displayName = ProgressPrimitive\.Root\.displayName\n\nexport \{ Progress \}\n<\/typeof>\n}\n$/,
        replace: `))\nProgress.displayName = ProgressPrimitive.Root.displayName\n\nexport { Progress }`
      },
      {
        find: /"relative h-4 w-full overflow-hidden rounded-full bg-secondary" className/,
        replace: `"relative h-4 w-full overflow-hidden rounded-full bg-secondary", className`}
    ]
  },
  {
    // Fix agent-monitor page - remove extra closing tags
    file: 'src/app/admin/agent-monitor/page.tsx',
    fixes: [
      {
        find: /  <\/AlertsPanel>\n  <\/ContainerMonitor>\n  <\/AgentPulseMonitor>\n  <\/TaskQueueVisualizer>\n  <\/SystemMetrics>\n  \);\n}\n$/,
        replace: `  );\n}`}
    ]
  },
  {
    // Fix causal page - remove extra closing tags
    file: 'src/app/admin/causal/page.tsx',
    fixes: [
      {
        find: /  <\/CausalExplorerUI>\n  <\/SelfCheckTrigger>\n  \);\n}\n$/,
        replace: `  );\n}`}
    ]
  },
  {
    // Fix SystemResourceMonitor
    file: 'src/components/admin/SystemResourceMonitor.tsx', 
    fixes: [
      {
        find: /\n<\/div><\/Card>\n}\n\s*\n\s*\);\n}\n$/,
        replace: `\n      </Card>\n    </div>\n  );\n}`
      },
      {
        find: /className=\{\`px-2 py-1 rounded text-sm font-bold \$\{getStatusColor\(metrics\.cpuUsage thresholds\.cpuWarning  thresholds\.cpuCritical\)\}\`\}/,
        replace: `className={\`px-2 py-1 rounded text-sm font-bold \${getStatusColor(metrics.cpuUsage, thresholds.cpuWarning, thresholds.cpuCritical)}\`}`
      },
      {
        find: /className=\{\`px-2 py-1 rounded text-sm font-bold \$\{getStatusColor\(metrics\.memoryUsage thresholds\.memoryWarning  thresholds\.memoryCritical\)\}\`\}/,
        replace: `className={\`px-2 py-1 rounded text-sm font-bold \${getStatusColor(metrics.memoryUsage, thresholds.memoryWarning, thresholds.memoryCritical)}\`}`}
    ]
  },
  {
    // Fix BackendSelector - clean up Button tags
    file: 'src/components/backend/BackendSelector.tsx',
    fixes: [
      {
        find: /<\/Button>\s*<Button/g,
        replace: `</Button>\n            \n            <Button`
      },
      {
        find: />\s*{testing \? \(<\/Button>/,
        replace: `>\n              {testing ? (`}
    ]
  },
  {
    // Fix NoCodeBuilder - clean up component syntax
    file: 'src/components/builder/NoCodeBuilder.tsx',
    fixes: [
      {
        find: /export default function NoCodeBuilder\(\) \{<\/string>/,
        replace: `export default function NoCodeBuilder() {`
      },
      {
        find: /  const \[selectedComponent, setSelectedComponent\] = useState<string \| null>\(null\);\n      <\/Component>/,
        replace: `  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);`
      },
      {
        find: /  props: Record<string, any>\n  children\?: Component\[\];\n}\;/,
        replace: `  props: Record<string, any>;\n  children?: Component[];\n}`
      },
      {
        find: /const _handleDragStart = \(e: React\.DragEvent: type, string\) => \{/,
        replace: `const _handleDragStart = (e: React.DragEvent, type: string) => {`}
    ]}
];

function applyFixes(filePath, fixList) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const _original = content;
    let fixCount = 0;
    
    fixList.forEach(fix => {
      const _before = content;
      content = content.replace(fix.find, fix.replace);
      if (before !== content) {
        fixCount++;}
    });
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed ${filePath} (${fixCount} fixes applied)`);
      return true;
    } else {
      console.log(`ℹ️  No changes needed for ${filePath}`);
      return false;}
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;}}
// Also run a generic cleanup on all TSX files
function genericCleanup(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const _original = content;
    
    // Fix common JSX issues
    // Fix comma in className concatenations
    content = content.replace(/"([^"]+)" className/g, '"$1", className');
    
    // Fix semicolons that should be commas in interfaces
    content = content.replace(/(\w+): ([^;,\n]+);(\s*(?:\/\/[^\n]*)?\s*}\s*[;,)])/g, '$1: $2$3');
    
    // Ensure file ends with newline
    if (!content.endsWith('\n')) {
      content += '\n';}
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;}
    return false;
  } catch (error) {
    return false;}}
// Process targeted fixes
console.log('🎯 Applying targeted fixes...\n');
let fixedCount = 0;

fixes.forEach(({ file, fixes: fixList }) => {
  const _fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    if (applyFixes(fullPath, fixList)) {
      fixedCount++;}
  } else {
    console.log(`⚠️  File not found: ${file}`);}
});

// Generic cleanup on other TSX files  
console.log('\n🧹 Running generic cleanup...\n');
const tsxFiles = glob.sync('src/**/*.tsx', { 
  ignore: ['**/node_modules/**', '**/*.test.tsx', '**/*.spec.tsx']
});

let genericFixed = 0;
tsxFiles.forEach(file => { if (!targetFiles.includes(file)) {
    if (genericCleanup(file)) {
      genericFixed++;
     });

console.log(`\n✅ Final cleanup completed!`);
console.log(`   - ${fixedCount} targeted fixes applied`);
console.log(`   - ${genericFixed} files cleaned up with generic fixes`);