const fs = require('fs');
const path = require('path');

const fixes = [
  // backend-example route
  {
    file: 'src/app/api/backend-example/route.ts',
    find: "return NextResponse.json({ success: true, message: 'Project created successfully';",
    replace: "return NextResponse.json({ success: true, message: 'Project created successfully',"
  },
  {
    file: 'src/app/api/backend-example/route.ts',
    find: 'console.error(\'Create project error:\', error), if (error instanceof z.ZodError) {',
    replace: 'console.error(\'Create project error:\', error);\n        if (error instanceof z.ZodError) {'
  },
  // collaboration rooms route
  {
    file: 'src/app/api/collaboration/rooms/route.ts',
    find: '// Simulate getting active rooms, const rooms = [, {',
    replace: '// Simulate getting active rooms\n        const rooms = [{'
  },
  // config route
  {
    file: 'src/app/api/config/route.ts',
    find: '}}',
    replace: '}'
  },
  // cycle-detection route
  {
    file: 'src/app/api/cycle-detection/route.ts',
    find: "'Consider breaking down complex dependencies';",
    replace: "'Consider breaking down complex dependencies',"
  },
  // feedback route
  {
    file: 'src/app/api/feedback/route.ts',
    find: 'email: z.string().email().optional();',
    replace: 'email: z.string().email().optional()'
  }
];

console.log('Applying API route fixes...');

fixes.forEach(({ file, find, replace }) => {
  const filePath = path.join(__dirname, '..', file);
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(find)) {
      content = content.replace(find, replace);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed in ${file}`);
    } else {
      console.log(`Pattern not found in ${file}`);
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
});

// Fix config route - needs adjustment
const configPath = path.join(__dirname, '..', 'src/app/api/config/route.ts');
try {
  let content = fs.readFileSync(configPath, 'utf8');
  // Remove the getFeatureStatus function that's outside the route handler
  content = content.replace(/}\s*getFeatureStatus.*$/s, '}');
  fs.writeFileSync(configPath, content, 'utf8');
  console.log('Fixed config route structure');
} catch (error) {
  console.error('Error fixing config route:', error.message);
}

console.log('\nAll API route fixes applied!');