const fs = require('fs');
const path = require('path');

const fixes = [
  {
    file: 'src/app/auth/signup/page.tsx',
    find: "title: 'Sign Up - AI Guided SaaS Platform'\n  description:",
    replace: "title: 'Sign Up - AI Guided SaaS Platform',\n  description:"
  },
  {
    file: 'src/app/blog/[id]/page.tsx', 
    find: "readTime: '5 min read'\n    image:",
    replace: "readTime: '5 min read',\n    image:"
  },
  {
    file: 'src/app/blog/page.tsx',
    find: "title: 'Blog - AI Guided SaaS Platform'\n  description:",
    replace: "title: 'Blog - AI Guided SaaS Platform',\n  description:"
  },
  {
    file: 'src/app/collaborate/dashboard/page.tsx',
    find: '<div className="min-h-screen bg-gray-50 py-8 container mx-auto px-4 max-w-6xl"></div>\n        <div className="mb-8">',
    replace: '<div className="min-h-screen bg-gray-50 py-8">\n      <div className="container mx-auto px-4 max-w-6xl">\n        <div className="mb-8">'
  },
  {
    file: 'src/app/collaborate/page.tsx',
    find: "lastActivity: '2 hours ago'\n      status:",
    replace: "lastActivity: '2 hours ago',\n      status:"
  }
];

console.log('Fixing final batch of syntax errors...\n');

fixes.forEach(({file, find, replace}) => {
  const filePath = path.join(process.cwd(), file);
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(find)) {
      content = content.replace(find, replace);
      fs.writeFileSync(filePath, content);
      console.log(`Fixed: ${file}`);
    } else {
      console.log(`Pattern not found in: ${file}`);
    }
  } catch (err) {
    console.error(`Error processing ${file}:`, err.message);
  }
});

console.log('\nFinal batch fix complete!');