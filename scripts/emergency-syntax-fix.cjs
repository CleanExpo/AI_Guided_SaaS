#!/usr/bin/env node

/**
 * EMERGENCY SYNTAX FIX
 * Fixes critical syntax errors preventing build
 */

const fs = require('fs');

console.log('🚨 EMERGENCY SYNTAX FIX INITIATED\n');

const criticalFixes = [
  {
    file: 'src/components/ui/alert.tsx',
    fixes: [
      {
        search: /defaultVariants:\s*{\s*variant:\s*"default"\s*\);/,
        replace: 'defaultVariants: {\n      variant: "default"\n    }\n  });'}
    ]
  },
  {
    file: 'src/components/ui/button.tsx',
    fixes: [
      {
        search: /defaultVariants:\s*{\s*variant:\s*"default",\s*size:\s*"default"\s*\);/,
        replace: 'defaultVariants: {\n      variant: "default",\n      size: "default"\n    }\n  });'}
    ]
  },
  {
    file: 'src/components/ui/select.tsx',
    fixes: [
      {
        search: /SelectItem;$/m,
        replace: 'SelectItem;'
      },
      {
        search: /export\s*{\s*Select,\s*SelectGroup,\s*SelectValue,\s*SelectTrigger,\s*SelectContent,\s*SelectItem;\s*}/,
        replace: 'export {\n  Select,\n  SelectGroup,\n  SelectValue,\n  SelectTrigger,\n  SelectContent,\n  SelectItem\n};'}
    ]
  },
  {
    file: 'src/components/ui/use-toast.tsx',
    fixes: [
      {
        search: /ToastProps from "@\/components\/ui\/toast";/,
        replace: 'ToastProps\n} from "@/components/ui/toast";'}
    ]
  },
  {
    file: 'src/app/admin-direct/page.tsx',
    fixes: [
      {
        search: /'Content-Type':\s*'application\/json',\s*}\s*body:\s*JSON\.stringify\(\{\s*password\s*}\)\);/,
        replace: '\'Content-Type\': \'application/json\'\n        },\n        body: JSON.stringify({ password })\n      });'}
    ]}
];

let fixedCount = 0;

criticalFixes.forEach(({ file, fixes }) => {
  if (fs.existsSync(file)) {
    try {
      let content = fs.readFileSync(file, 'utf8');
      let originalContent = content;
      
      fixes.forEach(({ search, replace }) => {
        content = content.replace(search, replace);
      });
      
      if (content !== originalContent) {
        fs.writeFileSync(file, content);
        console.log(`✅ Fixed critical syntax in: ${file}`);
        fixedCount++;}
    } catch (error) {
      console.log(`❌ Failed to fix: ${file} - ${error.message}`);}
  } else {
    console.log(`⚠️  File not found: ${file}`);}
});

console.log(`\n📊 EMERGENCY FIX SUMMARY:`);
console.log(`✅ Critical files fixed: ${fixedCount}`);

if (fixedCount > 0) {
  console.log('\n🎯 Critical syntax errors resolved!');
  console.log('✅ Ready for build attempt');
} else {
  console.log('\n⚠️  No critical syntax errors found');}
console.log('\n🚀 NEXT: Run npm run build');
