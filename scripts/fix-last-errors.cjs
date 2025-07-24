const fs = require('fs');
const path = require('path');

const fixes = [
  // n8n execute route
  {
    file: 'src/app/api/n8n/execute/route.ts',
    find: 'data: validatedData.data || {} catch (error) { console.error(error)',
    replace: 'data: validatedData.data || {}'
  },
  // n8n webhook route
  {
    file: 'src/app/api/n8n/webhook/route.ts',
    find: 'console.error(\'Webhook processing error:\', error), if (error instanceof z.ZodError) {',
    replace: 'console.error(\'Webhook processing error:\', error);\n    if (error instanceof z.ZodError) {'
  },
  // n8n workflows route
  {
    file: 'src/app/api/n8n/workflows/route.ts',
    find: '      ...validatedData,;',
    replace: '      ...validatedData,'
  },
  // requirements process route
  {
    file: 'src/app/api/requirements/process/route.ts',
    find: '      ...validatedData,;',
    replace: '      ...validatedData,'
  },
  // roadmap validate route
  {
    file: 'src/app/api/roadmap/validate/route.ts',
    find: "'Consider adding more detailed milestones';",
    replace: "'Consider adding more detailed milestones',"
  }
];

console.log('Applying final fixes...');

fixes.forEach(({ file, find, replace }) => {
  const filePath = path.join(__dirname, '..', file);
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(find)) {
      content = content.replace(find, replace);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed in ${file}`);
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
});

console.log('\nAll final fixes applied!');