const fs = require('fs');
const path = require('path');

const fixes = [
  // support chat route
  {
    file: 'src/app/api/support/chat/route.ts',
    find: "console.error('Support chat error:', error), if (error instanceof z.ZodError) {",
    replace: "console.error('Support chat error:', error);\n    if (error instanceof z.ZodError) {"
  },
  // tutorials progress route
  {
    file: 'src/app/api/tutorials/progress/route.ts',
    find: "completedSteps: ['step1', 'step2'],;",
    replace: "completedSteps: ['step1', 'step2'],"
  },
  // validated chat route
  {
    file: 'src/app/api/validated-chat/route.ts',
    find: "console.error('Validated chat error:', error), if (error instanceof z.ZodError) {",
    replace: "console.error('Validated chat error:', error);\n    if (error instanceof z.ZodError) {"
  },
  // visual analyze route
  {
    file: 'src/app/api/visual/analyze/route.ts',
    find: 'const url = new URL(request.url); const analysisId = url.searchParams.get(\'analysisId\'), if (!analysisId) {',
    replace: 'const url = new URL(request.url);\n    const analysisId = url.searchParams.get(\'analysisId\');\n    if (!analysisId) {'
  },
  {
    file: 'src/app/api/visual/analyze/route.ts',
    find: 'try {;',
    replace: 'try {'
  },
  // visual generate route
  {
    file: 'src/app/api/visual/generate/route.ts',
    find: 'style = \'realistic\', const dimensions = { width: 512, height: 512 }} = body;',
    replace: 'style = \'realistic\',\n      dimensions = { width: 512, height: 512 }\n    } = body;'
  }
];

console.log('Applying final build error fixes...');

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

console.log('\nAll final build error fixes applied!');