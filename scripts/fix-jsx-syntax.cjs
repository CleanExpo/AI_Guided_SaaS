const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Common JSX syntax patterns that need fixing
const fixes = [
  // Fix Card className="glass" without closing >
  {
    pattern: /<Card className="glass"\s*\n\s*<CardHeader/g,
    replacement: '<Card className="glass">\n          <CardHeader'
  },
  {
    pattern: /<Card className="glass"\s*\n\s*<CardContent/g,
    replacement: '<Card className="glass">\n          <CardContent'
  },
  // Fix CardHeader className="glass" without closing >
  {
    pattern: /<CardHeader className="glass"\s*\n\s*<CardTitle/g,
    replacement: '<CardHeader className="glass">\n            <CardTitle'
  },
  // Fix CardContent className="glass" without closing >
  {
    pattern: /<CardContent className="glass"\s*\n\s*<div/g,
    replacement: '<CardContent className="glass">\n            <div'
  },
  // Fix CardTitle className="glass"Text without closing >
  {
    pattern: /<CardTitle className="glass"([^>]+)<\/CardTitle>/g,
    replacement: '<CardTitle className="glass">$1</CardTitle>'
  },
  // Fix component props with extra > at the end
  {
    pattern: /\}\s*\/>>$/gm,
    replacement: '} />'
  },
  // Fix return( to return (
  {
    pattern: /return\(/g,
    replacement: 'return ('
  },
  // Fix extra )> in JSX
  {
    pattern: /\)\s*>/g,
    replacement: '>'
  },
  // Fix className="..." without closing >
  {
    pattern: /className="([^"]+)"\s*\n\s*>/g,
    replacement: 'className="$1">'
  },
  // Fix extra >> at the end of components
  {
    pattern: /\/>>$/gm,
    replacement: '/>'
  },
  // Fix missing > after className
  {
    pattern: /className="([^"]+)"\s*\n\s*([A-Z])/g,
    replacement: 'className="$1">\n          $2'
  },
  // Fix JSX arrow in render
  {
    pattern: /<ArrowUpRight className="h-3 w-3 mr-1" \/>\)/g,
    replacement: '<ArrowUpRight className="h-3 w-3 mr-1" />'
  }
];

// Process files
const files = glob.sync('src/**/*.{tsx,jsx}', { cwd: path.join(__dirname, '..') });

let totalFixed = 0;

files.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  let content = fs.readFileSync(filePath, 'utf8');
  let fixed = false;
  
  fixes.forEach(fix => {
    const matches = content.match(fix.pattern);
    if (matches) {
      content = content.replace(fix.pattern, fix.replacement);
      fixed = true;
    }
  });
  
  if (fixed) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed: ${file}`);
    totalFixed++;
  }
});

console.log(`\nTotal files fixed: ${totalFixed}`);