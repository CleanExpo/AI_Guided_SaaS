#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Fix specific syntax patterns
function fixSyntaxErrors(content, filePath) {
  let fixed = content;
  let changeCount = 0;

  // Fix extra closing tags
  fixed = fixed.replace(/<\/any>\s*}/g, () => {
    changeCount++;
    return '}';
  });

  fixed = fixed.replace(/<\/HTMLFormElement>\s*}/g, () => {
    changeCount++;
    return '}';
  });

  fixed = fixed.replace(/<\/AdminUser>\s*}/g, () => {
    changeCount++;
    return '}';
  });

  // Fix missing closing divs
  fixed = fixed.replace(/}\s*catch\s*\(error\)\s*{/g, (match, offset) => {
    const before = content.substring(Math.max(0, offset - 200), offset);
    if (before.includes('</div>') && !before.includes('</div>\n  );')) {
      changeCount++;
      return '    </div>\n  );\n} catch (error) {';
    }
    return match;
  });

  // Fix broken function syntax
  fixed = fixed.replace(/]\s*;\s*props:\s*anyexport default function/g, () => {
    changeCount++;
    return '];\n\nexport default function';
  });

  // Fix missing parenthesis in generateStaticParams
  fixed = fixed.replace(/return Object\.keys\(apiDocs\)\.map\(\(slug\) => \({ slug: slug }\)/g, () => {
    changeCount++;
    return 'return Object.keys(apiDocs).map((slug) => ({ slug: slug }))';
  });

  // Fix broken children prop syntax
  fixed = fixed.replace(/children:\s*{\s*children:\s*React\.ReactNode/g, () => {
    changeCount++;
    return 'children';
  });

  // Fix extra closing divs at end of files
  if (filePath.includes('.tsx') || filePath.includes('.jsx')) {
    const lines = fixed.split('\n');
    let divCount = 0;
    let lastContentLine = -1;

    // Count divs and find last content line
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes('<div')) divCount += (line.match(/<div/g) || []).length;
      if (line.includes('</div>')) divCount -= (line.match(/<\/div>/g) || []).length;
      if (line.trim() && !line.trim().match(/^(}|<\/div>|<\/\w+>)$/)) {
        lastContentLine = i;
      }
    }

    // Remove extra closing divs after the component ends
    if (divCount < 0 && lastContentLine > -1) {
      const newLines = [];
      let extraDivsRemoved = 0;
      for (let i = 0; i < lines.length; i++) {
        if (i > lastContentLine && lines[i].trim() === '</div>' && extraDivsRemoved < Math.abs(divCount)) {
          extraDivsRemoved++;
          changeCount++;
        } else {
          newLines.push(lines[i]);
        }
      }
      fixed = newLines.join('\n');
    }
  }

  return { fixed, changeCount };
}

// Process files
async function processFiles() {
  const files = [
    'src/app/admin/mcp/page.tsx',
    'src/app/admin/performance/page.tsx',
    'src/app/analytics/page.tsx',
    'src/app/api-docs/[slug]/page.tsx',
    'src/app/api-docs/page.tsx',
    'src/app/admin/login/layout.tsx'
  ];

  let totalChanges = 0;

  for (const file of files) {
    const filePath = path.join(process.cwd(), file);
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      const { fixed, changeCount } = fixSyntaxErrors(content, file);
      
      if (changeCount > 0) {
        fs.writeFileSync(filePath, fixed, 'utf8');
        console.log(`Fixed ${changeCount} errors in ${file}`);
        totalChanges += changeCount;
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  }

  console.log(`\nTotal fixes: ${totalChanges}`);
}

// Run
processFiles().catch(console.error);