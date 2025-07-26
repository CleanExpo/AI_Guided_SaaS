const fs = require('fs');
const path = require('path');

let consoleCount = 0;
const consoleFiles = [];

function findConsoleStatements(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      if (!['node_modules', '.next', 'dist', 'build', '.git'].includes(file)) {
        findConsoleStatements(fullPath);
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const matches = content.match(/console\.(log|warn|error|info|debug)/g);
      
      if (matches && matches.length > 0) {
        consoleCount += matches.length;
        consoleFiles.push({
          file: path.relative(process.cwd(), fullPath),
          count: matches.length,
          lines: []
        });
        
        // Find line numbers
        const lines = content.split('\n');
        lines.forEach((line, index) => {
          if (line.match(/console\.(log|warn|error|info|debug)/)) {
            consoleFiles[consoleFiles.length - 1].lines.push(index + 1);
          }
        });
      }
    }
  });
}

console.log('Searching for console statements in src directory...\n');
findConsoleStatements(path.join(__dirname, 'src'));

console.log(`Total console statements found: ${consoleCount}\n`);
console.log('Files with console statements:');
consoleFiles.forEach(({ file, count, lines }) => {
  console.log(`\n${file} (${count} statements)`);
  console.log(`  Lines: ${lines.join(', ')}`);
});