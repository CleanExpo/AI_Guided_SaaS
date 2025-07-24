const fs = require('fs');
const path = require('path');

const fixes = [
  // n8n execute route
  {
    file: 'src/app/api/n8n/execute/route.ts',
    find: 'const body = await request.json(), // Validate input, const validatedData = ExecuteWorkflowSchema.parse(body);',
    replace: 'const body = await request.json();\n    // Validate input\n    const validatedData = ExecuteWorkflowSchema.parse(body);'
  },
  {
    file: 'src/app/api/n8n/execute/route.ts',
    find: "id: 'exec_' + Math.random().toString(36).substr(2, 9),;",
    replace: "id: 'exec_' + Math.random().toString(36).substr(2, 9),"
  },
  // n8n webhook route
  {
    file: 'src/app/api/n8n/webhook/route.ts',
    find: "action: z.enum(['deploy', 'test', 'notify', 'custom']),;",
    replace: "action: z.enum(['deploy', 'test', 'notify', 'custom']),"
  },
  // n8n workflows route
  {
    file: 'src/app/api/n8n/workflows/route.ts',
    find: "type: z.enum(['deployment', 'testing', 'notification', 'custom']),;",
    replace: "type: z.enum(['deployment', 'testing', 'notification', 'custom']),"
  },
  // requirements process route
  {
    file: 'src/app/api/requirements/process/route.ts',
    find: "priority: z.enum(['low', 'medium', 'high']).optional();",
    replace: "priority: z.enum(['low', 'medium', 'high']).optional()"
  },
  // roadmap validate route
  {
    file: 'src/app/api/roadmap/validate/route.ts',
    find: 'const body = await request.json(), // Validate input, const validatedData = validateSchema.parse(body);',
    replace: 'const body = await request.json();\n    // Validate input\n    const validatedData = validateSchema.parse(body);'
  },
  {
    file: 'src/app/api/roadmap/validate/route.ts',
    find: 'issues: any[],',
    replace: 'issues: [] as any[],'
  }
];

console.log('Applying route fixes...');

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

console.log('\nAll route fixes applied!');