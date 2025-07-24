const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all TypeScript files in src/app/api
const files = glob.sync('src/app/api/**/*.ts', {
  cwd: path.join(__dirname, '..')
});

let fixedCount = 0;

files.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix "try {;" pattern
    if (content.includes('try {;')) {
      content = content.replace(/try \{;/g, 'try {');
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed try {; in ${file}`);
      fixedCount++;
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
});

console.log(`\nFixed ${fixedCount} files with 'try {;' pattern`);