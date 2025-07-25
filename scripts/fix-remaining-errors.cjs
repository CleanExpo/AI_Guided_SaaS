const fs = require('fs');
const path = require('path');

// Fix collaborate/page.tsx
function fixCollaboratePage() {
  const filePath = path.join(process.cwd(), 'src/app/collaborate/page.tsx');
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Fix useState generic syntax - the HTML entities need to be handled
  content = content.replace(/const \[activeProject, setActiveProject\] = useState<string \| null>\(null\);<\/string>/g, 
    'const [activeProject, setActiveProject] = useState<string | null>(null);');
  
  // Fix semicolons in object properties
  content = content.replace(/members: (\d+);/g, 'members: $1,');
  
  // Fix loading spinner JSX
  content = content.replace(/<div className="flex items-center justify-center min-h-screen">, <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600">/g,
    '<div className="flex items-center justify-center min-h-screen">\n        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600">');
  
  // Fix the closing of loading spinner
  const loadingPattern = /<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600">\s*<\/div>\s*\)\s*}/g;
  content = content.replace(loadingPattern, 
    '<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>\n      </div>\n    );\n  }');
  
  // Fix Plus icon JSX
  content = content.replace(/<Plus className="h-5 w-5"\s*\/> Create New Project<\/Plus>/g, 
    '<Plus className="h-5 w-5" />\n                Create New Project');
  content = content.replace(/<Plus className="h-4 w-4"\s*\/> New Project<\/Plus>/g, 
    '<Plus className="h-4 w-4" />\n                New Project');
  
  // Fix all icon components
  content = content.replace(/<(Users|Share2|MessageCircle|Clock|Globe|Lock|Zap) className="([^"]+)"\s*\/>/g, 
    '<$1 className="$2" />');
  
  // Fix button onClick
  content = content.replace(/onClick=\{\(\) => window\.location\.href = '\/auth\/signin'}\><\/Button>/g, 
    'onClick={() => window.location.href = "/auth/signin"}>\n                Get Started Free\n              </Button>');
  
  // Fix badge variant conditional
  content = content.replace(/variant=\{\s*project\.status === 'active' \? 'default'  : null\s*project\.status === 'review' \? 'secondary' : 'outline'\s*}/g,
    'variant={\n                        project.status === "active" ? "default" :\n                        project.status === "review" ? "secondary" : "outline"\n                      }');
  
  // Fix empty CardHeader
  content = content.replace(/<CardHeader><\/CardHeader>/g, '<CardHeader>');
  
  // Fix missing closing divs and structure
  content = content.replace(/<div className="absolute inset-0 bg-grid-gray-100 bg-grid opacity-50">/g, 
    '<div className="absolute inset-0 bg-grid-gray-100 bg-grid opacity-50"></div>');
  
  // Fix Card onClick
  content = content.replace(/onClick=\{\(\) => setActiveProject\(project\.id\)\}\><\/Card>/g, 
    'onClick={() => setActiveProject(project.id)}>');
  
  // Fix the ending structure
  if (!content.endsWith('}\n')) {
    content = content.replace(/\)\s*};?\s*$/, ');\n}');
  }
  
  fs.writeFileSync(filePath, content);
  console.log('Fixed collaborate/page.tsx');
}

// Fix community/page.tsx
function fixCommunityPage() {
  const filePath = path.join(process.cwd(), 'src/app/community/page.tsx');
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Fix semicolons in object properties
    content = content.replace(/members: (\d+);/g, 'members: $1,');
    
    fs.writeFileSync(filePath, content);
    console.log('Fixed community/page.tsx');
  }
}

// Fix community/guidelines/page.tsx
function fixGuidelinesPage() {
  const filePath = path.join(process.cwd(), 'src/app/community/guidelines/page.tsx');
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Fix Button with ArrowLeft
    content = content.replace(/<Button variant="ghost" size="sm"><\/Button>\s*<ArrowLeft className="h-4 w-4 mr-2"\s*\/>\s*Back to Community\s*<\/Button>/g,
      '<Button variant="ghost" size="sm">\n                  <ArrowLeft className="h-4 w-4 mr-2" />\n                  Back to Community\n                </Button>');
    
    fs.writeFileSync(filePath, content);
    console.log('Fixed community/guidelines/page.tsx');
  }
}

// Fix config/page.tsx
function fixConfigPage() {
  const filePath = path.join(process.cwd(), 'src/app/config/page.tsx');
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Fix empty CardHeader and structure
    content = content.replace(/<CardHeader><\/CardHeader>/g, '<CardHeader>');
    content = content.replace(/<CardTitle className="text-lg">Configuration<\/CardTitle>\s*<\/CardHeader>/g,
      '<CardTitle className="text-lg">Configuration</CardTitle>\n                </CardHeader>');
    
    fs.writeFileSync(filePath, content);
    console.log('Fixed config/page.tsx');
  }
}

// Run all fixes
try {
  fixCollaboratePage();
  fixCommunityPage();
  fixGuidelinesPage();
  fixConfigPage();
  console.log('\nAll syntax fixes completed!');
} catch (error) {
  console.error('Error fixing files:', error);
  process.exit(1);
}