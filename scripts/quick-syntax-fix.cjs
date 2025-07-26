const fs = require("fs");
const path = require("path");

console.log("🔧 Fixing Syntax Errors...\n");

const fixes = [
  {
    file: "src/app/admin-direct/page.tsx",
    fix: content => {
      return content.replace(/placeholder\s*=\s*"Enter master password"/g, "placeholder=\"Enter master password\"");
    }
  },
  {
    file: "src/app/admin/login/page.tsx",
    fix: content => {
      return content.replace(/placeholder\s*=\s*"Admin Password"/g, "placeholder=\"Admin Password\"");
    }
  },
  {
    file: "src/app/analytics/advanced/page.tsx",
    fix: content => {
      content = content.replace(/style={{\s*width:\s*"(\d+%?)"\s*}}/g, "style={{ width: \"$1\" }}");
      return content;
    }
  }
];

let totalFixed = 0;

fixes.forEach(({ file, fix }) => {
  const filePath = path.join(__dirname, "..", file);
  
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, "utf8");
    const fixedContent = fix(content);
    
    if (content \!== fixedContent) {
      fs.writeFileSync(filePath, fixedContent);
      console.log(`✅ Fixed ${file}`);
      totalFixed++;
    }
  }
});

console.log(`\n📊 Total files fixed: ${totalFixed}`);
