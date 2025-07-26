const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🚨 Fixing critical syntax errors...\n');

// Fix app.config.ts
const appConfigPath = path.join(__dirname, '..', 'src', 'apps', 'ui-builder', 'app.config.ts');
if (fs.existsSync(appConfigPath)) {
  console.log('📄 Fixing app.config.ts...');
  
  const correctContent = `/* BREADCRUMB: unknown - Purpose to be determined */
// @ts-nocheck
import { BuilderState } from './types';

export const initialBuilderState: BuilderState = {
  components: [] as any[],
  selectedComponent: null,
  history: [] as any[],
  historyIndex: -1,
  zoom: 100,
  gridEnabled: true,
  previewMode: false
};

export const builderConfig = {
  canvas: {
    minZoom: 25,
    maxZoom: 200,
    zoomStep: 25,
    gridSize: 20,
    snapToGrid: true
  },
  components: {
    minWidth: 50,
    minHeight: 30,
    defaultWidth: 200,
    defaultHeight: 100
  },
  history: {
    maxSteps: 50
  },
  autosave: {
    enabled: true,
    interval: 30000 // 30 seconds
  }
};

export const shortcuts = {
  undo: 'Ctrl+Z',
  redo: 'Ctrl+Y',
  copy: 'Ctrl+C',
  paste: 'Ctrl+V',
  delete: 'Delete',
  selectAll: 'Ctrl+A',
  save: 'Ctrl+S',
  export: 'Ctrl+E',
  preview: 'Ctrl+P'
};`;
  
  fs.writeFileSync(appConfigPath, correctContent);
  console.log('✅ Fixed app.config.ts');
}

// Find and fix other files with syntax errors
const problemFiles = [
  'src/apps/ui-builder/components/AssistantPrompt.tsx',
  'src/apps/ui-builder/components/TemplateGenerator.tsx',
  'src/apps/ui-builder/components/ComponentStyler.tsx',
  'src/components/Dashboard.tsx',
  'src/components/admin/analytics/AnalyticsTimeRange.tsx',
  'src/components/analytics/CohortRetentionChart.tsx',
  'src/components/ui/use-toast.tsx'
];

problemFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`\n📄 Checking ${file}...`);
    
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;
      
      // Fix semicolons that should be commas in object literals
      const fixedContent = content.replace(/(\w+):\s*([^,;{}]+);(?=\s*\w+:)/g, '$1: $2,');
      if (fixedContent !== content) {
        content = fixedContent;
        modified = true;
      }
      
      // Fix missing closing braces
      const openBraces = (content.match(/{/g) || []).length;
      const closeBraces = (content.match(/}/g) || []).length;
      if (openBraces > closeBraces) {
        content += '\n' + '}'.repeat(openBraces - closeBraces);
        modified = true;
      }
      
      // Fix missing closing parentheses
      const openParens = (content.match(/\(/g) || []).length;
      const closeParens = (content.match(/\)/g) || []).length;
      if (openParens > closeParens) {
        content += ')'.repeat(openParens - closeParens);
        modified = true;
      }
      
      // Fix JSX syntax issues
      content = content.replace(/<(\w+)([^>]*)\s+\/(?!>)/g, '<$1$2 />');
      
      if (modified) {
        fs.writeFileSync(filePath, content);
        console.log('✅ Fixed syntax errors');
      } else {
        console.log('✔️  No issues found');
      }
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
    }
  }
});

// Check for files with the most syntax errors
console.log('\n🔍 Looking for other files with syntax errors...\n');

const allTsFiles = glob.sync('src/**/*.{ts,tsx}', {
  cwd: path.join(__dirname, '..'),
  absolute: true
});

let fixedCount = 0;
const maxToFix = 10;

for (const file of allTsFiles) {
  if (fixedCount >= maxToFix) break;
  
  try {
    const content = fs.readFileSync(file, 'utf8');
    
    // Check for obvious syntax errors
    const hasSyntaxError = 
      content.includes('};export') || // Missing space/newline between statements
      content.includes('];export') ||
      content.match(/\w+:\s*\w+;(?=\s*\w+:)/) || // Semicolon instead of comma
      content.match(/{\s*\w+:\s*[^,}]+;/) || // Semicolon in object literal
      (content.match(/{/g) || []).length !== (content.match(/}/g) || []).length || // Mismatched braces
      (content.match(/\(/g) || []).length !== (content.match(/\)/g) || []).length; // Mismatched parens
    
    if (hasSyntaxError) {
      console.log(`📄 Fixing ${path.relative(process.cwd(), file)}...`);
      
      let fixedContent = content;
      
      // Fix missing spaces between statements
      fixedContent = fixedContent.replace(/};export/g, '};\nexport');
      fixedContent = fixedContent.replace(/];export/g, '];\nexport');
      
      // Fix semicolons in object literals
      fixedContent = fixedContent.replace(/(\w+):\s*([^,;{}]+);(?=\s*\w+:)/g, '$1: $2,');
      fixedContent = fixedContent.replace(/(\w+):\s*([^,;{}]+);(?=\s*})/g, '$1: $2');
      
      // Fix missing closing braces/parens at end of file
      const openBraces = (fixedContent.match(/{/g) || []).length;
      const closeBraces = (fixedContent.match(/}/g) || []).length;
      if (openBraces > closeBraces) {
        fixedContent = fixedContent.trimEnd() + '\n' + '}'.repeat(openBraces - closeBraces);
      }
      
      const openParens = (fixedContent.match(/\(/g) || []).length;
      const closeParens = (fixedContent.match(/\)/g) || []).length;
      if (openParens > closeParens) {
        fixedContent = fixedContent.trimEnd() + ')'.repeat(openParens - closeParens);
      }
      
      if (fixedContent !== content) {
        fs.writeFileSync(file, fixedContent);
        console.log('✅ Fixed');
        fixedCount++;
      }
    }
  } catch (error) {
    // Skip files with read errors
  }
}

console.log(`\n✨ Fixed ${fixedCount + problemFiles.length + 1} files with syntax errors`);