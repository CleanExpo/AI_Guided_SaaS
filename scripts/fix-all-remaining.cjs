const fs = require('fs');
const path = require('path');

// Fix blog/[id]/page.tsx
function fixBlogIdPage() {
  const filePath = path.join(process.cwd(), 'src/app/blog/[id]/page.tsx');
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // The issue is the article isn't properly closed - need to ensure proper JSX structure
  // Look for the pattern where </article> is followed by improper closing
  content = content.replace(/(<\/article>)\s*(<\/div>)\s*(<\/div>)\s*\);/g, '$1\n      $2\n    $3\n  );');
  
  fs.writeFileSync(filePath, content);
  console.log('Fixed blog/[id]/page.tsx');
}

// Fix community/guidelines/page.tsx
function fixGuidelinesPage() {
  const filePath = path.join(process.cwd(), 'src/app/community/guidelines/page.tsx');
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Fix the missing indentation/structure after </Card>
  content = content.replace(/(<\/Card>)\s*(<Card>)/g, '$1\n          \n          $2');
  
  fs.writeFileSync(filePath, content);
  console.log('Fixed community/guidelines/page.tsx');
}

// Fix community/page.tsx
function fixCommunityPage() {
  const filePath = path.join(process.cwd(), 'src/app/community/page.tsx');
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Find where the stats.map is missing proper closing
  // The issue is the mapping function isn't properly closed
  content = content.replace(/(<div className="grid gap-8[^>]+>)\s*\{communityStats\.map[^}]+}\s*(<\/div>)/gs, (match) => {
    // Need to ensure proper structure for the map
    if (!match.includes('</div>\n            ))}')) {
      return match.replace(/(<\/div>)\s*(<\/div>)\s*\)\)\}/g, '$1\n                $2\n              </div>\n            ))}');
    }
    return match;
  });
  
  fs.writeFileSync(filePath, content);
  console.log('Fixed community/page.tsx');
}

// Fix config/page.tsx
function fixConfigPage() {
  const filePath = path.join(process.cwd(), 'src/app/config/page.tsx');
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Fix missing closing divs and structure
  // Look for pattern where we have )}\n  )\n}
  const lines = content.split('\n');
  let depth = 0;
  let inJSX = false;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('return (')) inJSX = true;
    if (inJSX) {
      if (lines[i].includes('<div')) depth++;
      if (lines[i].includes('</div>')) depth--;
    }
  }
  
  // If depth doesn't match, we need to add closing divs
  if (depth > 0) {
    // Find the last )}\n} pattern and add missing divs before it
    content = content.replace(/(\s*)\)\s*}\s*$/m, (match, indent) => {
      let closingDivs = '';
      for (let i = 0; i < depth; i++) {
        closingDivs += `${indent}    </div>\n`;
      }
      return `${closingDivs}${indent}  );\n${indent}}`;
    });
  }
  
  fs.writeFileSync(filePath, content);
  console.log('Fixed config/page.tsx');
}

// Fix contact/page.tsx
function fixContactPage() {
  const filePath = path.join(process.cwd(), 'src/app/contact/page.tsx');
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Count divs to ensure proper closing
  const openDivs = (content.match(/<div/g) || []).length;
  const closeDivs = (content.match(/<\/div>/g) || []).length;
  
  if (openDivs > closeDivs) {
    // Add missing closing divs before the final )
    const missingDivs = openDivs - closeDivs;
    let closingDivs = '';
    for (let i = 0; i < missingDivs; i++) {
      closingDivs += '          </div>\n';
    }
    
    content = content.replace(/(\s*)\)\s*}\s*$/m, `${closingDivs}$1  );\n$1}`);
  }
  
  fs.writeFileSync(filePath, content);
  console.log('Fixed contact/page.tsx');
}

// Run all fixes
try {
  fixBlogIdPage();
  fixGuidelinesPage();
  fixCommunityPage();
  fixConfigPage();
  fixContactPage();
  console.log('\nAll remaining syntax fixes completed!');
} catch (error) {
  console.error('Error fixing files:', error);
  process.exit(1);
}