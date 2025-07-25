const fs = require('fs');
const path = require('path');

// Fix community/page.tsx
function fixCommunityPage() {
  const filePath = path.join(process.cwd(), 'src/app/community/page.tsx');
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Count open/close divs to ensure proper structure
  const openDivs = (content.match(/<div/g) || []).length;
  const closeDivs = (content.match(/<\/div>/g) || []).length;
  
  if (openDivs > closeDivs) {
    const missingDivs = openDivs - closeDivs;
    let closingDivs = '';
    for (let i = 0; i < missingDivs; i++) {
      closingDivs += '      </div>\n';
    }
    content = content.replace(/(\s*)\)\s*}\s*$/m, `${closingDivs}$1  );\n$1}`);
  }
  
  fs.writeFileSync(filePath, content);
  console.log('Fixed community/page.tsx');
}

// Fix cookies/page.tsx
function fixCookiesPage() {
  const filePath = path.join(process.cwd(), 'src/app/cookies/page.tsx');
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Count open/close divs to ensure proper structure
  const openDivs = (content.match(/<div/g) || []).length;
  const closeDivs = (content.match(/<\/div>/g) || []).length;
  
  if (openDivs > closeDivs) {
    const missingDivs = openDivs - closeDivs;
    let closingDivs = '';
    for (let i = 0; i < missingDivs; i++) {
      closingDivs += '      </div>\n';
    }
    content = content.replace(/(\s*)\)\s*}\s*$/m, `${closingDivs}$1  );\n$1}`);
  }
  
  fs.writeFileSync(filePath, content);
  console.log('Fixed cookies/page.tsx');
}

// Fix demo/data-flexibility/page.tsx
function fixDataFlexibilityPage() {
  const filePath = path.join(process.cwd(), 'src/app/demo/data-flexibility/page.tsx');
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Fix semicolons in object properties
    content = content.replace(/icon: ([^,;]+);/g, 'icon: $1,');
    
    fs.writeFileSync(filePath, content);
    console.log('Fixed demo/data-flexibility/page.tsx');
  }
}

// Run all fixes
try {
  fixCommunityPage();
  fixCookiesPage();
  fixDataFlexibilityPage();
  console.log('\nFinal cleanup completed!');
} catch (error) {
  console.error('Error fixing files:', error);
  process.exit(1);
}