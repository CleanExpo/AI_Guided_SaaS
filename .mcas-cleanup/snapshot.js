import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('📸 Capturing current project state...\n');

const snapshot = {
  timestamp: new Date().toISOString(),
  projectPath: path.resolve('..'),
  metrics: {
    typeScriptErrors: 0,
    totalFiles: 0,
    srcFiles: 0,
    testFiles: 0,
    mdFiles: 0,
    buildStatus: 'unknown',
    nodeVersion: process.version
  }
};

try {
  // Count TypeScript errors
  console.log('🔍 Analyzing TypeScript errors...');
  const tsOutput = execSync('cd .. && npm run typecheck 2>&1', { encoding: 'utf8', stdio: 'pipe' }).toString();
  const errorMatches = tsOutput.match(/error TS\d+:/g) || [];
  snapshot.metrics.typeScriptErrors = errorMatches.length;
  console.log(`   Found ${snapshot.metrics.typeScriptErrors} TypeScript errors`);
} catch (error) {
  // TypeScript check failed, count errors from output
  const errorOutput = error.stdout || error.stderr || '';
  const errorMatches = errorOutput.match(/error TS\d+:/g) || [];
  snapshot.metrics.typeScriptErrors = errorMatches.length;
  snapshot.metrics.buildStatus = 'failing';
  console.log(`   Found ${snapshot.metrics.typeScriptErrors} TypeScript errors (build failing)`);
}

try {
  // Count files
  console.log('\n📁 Counting project files...');
  snapshot.metrics.totalFiles = parseInt(execSync('cd .. && find . -type f -not -path "./node_modules/*" -not -path "./.next/*" -not -path "./.git/*" | wc -l', { encoding: 'utf8' }).trim());
  snapshot.metrics.srcFiles = parseInt(execSync('cd .. && find src -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" 2>/dev/null | wc -l', { encoding: 'utf8' }).trim());
  snapshot.metrics.testFiles = parseInt(execSync('cd .. && find . -type f -name "*.test.*" -o -name "*.spec.*" -not -path "./node_modules/*" | wc -l', { encoding: 'utf8' }).trim());
  snapshot.metrics.mdFiles = parseInt(execSync('cd .. && find . -type f -name "*.md" -not -path "./node_modules/*" | wc -l', { encoding: 'utf8' }).trim());
  
  console.log(`   Total files: ${snapshot.metrics.totalFiles}`);
  console.log(`   Source files: ${snapshot.metrics.srcFiles}`);
  console.log(`   Test files: ${snapshot.metrics.testFiles}`);
  console.log(`   Documentation files: ${snapshot.metrics.mdFiles}`);
} catch (error) {
  console.error('   Error counting files:', error.message);
}

// Check for existing breadcrumbs
try {
  console.log('\n🍞 Checking breadcrumb coverage...');
  const breadcrumbFiles = execSync('cd .. && find . -type f -name "*.json" -path "*/breadcrumbs/*" -not -path "./node_modules/*" | wc -l', { encoding: 'utf8' }).trim();
  snapshot.metrics.breadcrumbFiles = parseInt(breadcrumbFiles);
  console.log(`   Breadcrumb files: ${snapshot.metrics.breadcrumbFiles}`);
} catch (error) {
  snapshot.metrics.breadcrumbFiles = 0;
}

// Save snapshot
fs.writeFileSync('snapshot-before.json', JSON.stringify(snapshot, null, 2));
console.log('\n✅ Snapshot saved to snapshot-before.json');
console.log('\n📊 Summary:');
console.log(`   TypeScript Errors: ${snapshot.metrics.typeScriptErrors}`);
console.log(`   Build Status: ${snapshot.metrics.buildStatus}`);
console.log(`   Total Files: ${snapshot.metrics.totalFiles}`);
console.log(`   Source Files: ${snapshot.metrics.srcFiles}`);
console.log(`   Breadcrumb Coverage: ${snapshot.metrics.breadcrumbFiles > 0 ? 'Partial' : 'None'}`);

export default snapshot;