const fs = require('fs');
const path = require('path');

const fixes = [
  // semantic index route
  {
    file: 'src/app/api/semantic/index/route.ts',
    find: 'const body = await request.json(), // Check if it\'s a batch request, if (Array.isArray(body)) {;',
    replace: 'const body = await request.json();\n    // Check if it\'s a batch request\n    if (Array.isArray(body)) {'
  },
  // support chat route
  {
    file: 'src/app/api/support/chat/route.ts',
    find: "message: z.string().min(1, 'Message is required'),;",
    replace: "message: z.string().min(1, 'Message is required'),"
  },
  // templates route
  {
    file: 'src/app/api/templates/route.ts',
    find: '} catch (error) { console.error(error)},',
    replace: '},'
  },
  // tutorials progress route
  {
    file: 'src/app/api/tutorials/progress/route.ts',
    find: '      ...validatedData,;',
    replace: '      ...validatedData,'
  },
  // validated chat route
  {
    file: 'src/app/api/validated-chat/route.ts',
    find: "message: z.string().min(1, 'Message is required'),;",
    replace: "message: z.string().min(1, 'Message is required'),"
  }
];

console.log('Applying final route fixes...');

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

console.log('\nAll final route fixes applied!');