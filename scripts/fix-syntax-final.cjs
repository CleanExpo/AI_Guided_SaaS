const fs = require('fs');
const path = require('path');

// Fix Dashboard.tsx Badge issue
function fixDashboard() {
  const filePath = path.join(process.cwd(), 'src/components/Dashboard.tsx');
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Fix Badge closing tag
  content = content.replace(/><\/Badge>\s*{/g, '>\n                            {');
  
  fs.writeFileSync(filePath, content);
  console.log('Fixed Dashboard.tsx');
}

// Fix demo/data-flexibility/page.tsx
function fixDataFlexibility() {
  const filePath = path.join(process.cwd(), 'src/app/demo/data-flexibility/page.tsx');
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Fix missing Card structure if needed
    content = content.replace(/<Card><\/Card>/g, '<Card>');
    
    fs.writeFileSync(filePath, content);
    console.log('Fixed demo/data-flexibility/page.tsx');
  }
}

// Fix docs/page.tsx input syntax
function fixDocsPage() {
  const filePath = path.join(process.cwd(), 'src/app/docs/page.tsx');
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Fix Input placeholder syntax
    content = content.replace(/placeholder="Search documentation...";/g, 'placeholder="Search documentation..."');
    content = content.replace(/className="pl-10";/g, 'className="pl-10"');
    
    fs.writeFileSync(filePath, content);
    console.log('Fixed docs/page.tsx');
  }
}

// Fix enterprise/page.tsx icon syntax
function fixEnterprise() {
  const filePath = path.join(process.cwd(), 'src/app/enterprise/page.tsx');
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Fix icon semicolons
    content = content.replace(/icon: ([^,;]+);/g, 'icon: $1,');
    
    fs.writeFileSync(filePath, content);
    console.log('Fixed enterprise/page.tsx');
  }
}

// Run all fixes
try {
  fixDashboard();
  fixDataFlexibility();
  fixDocsPage();
  fixEnterprise();
  console.log('\nAll syntax errors fixed\!');
} catch (error) {
  console.error('Error fixing files:', error);
  process.exit(1);
}
EOF < /dev/null
