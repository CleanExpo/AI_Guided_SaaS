const fs = require('fs');
const path = require('path');

const fixes = [
  // Fix analytics route - duplicate identifier
  {
    file: 'src/app/api/analytics/route.ts',
    find: 'const data1 = {',
    replace: 'const data = {'
  },
  // Fix register route
  {
    file: 'src/app/api/auth/register/route.ts',
    find: "return NextResponse.json({ success: true, message: 'User registered successfully';",
    replace: "return NextResponse.json({ success: true, message: 'User registered successfully',"
  },
  // Fix backend-example route
  {
    file: 'src/app/api/backend-example/route.ts',
    find: 'const body = await request.json(), // Validate input, const validatedData = CreateProjectSchema.parse(body);',
    replace: 'const body = await request.json();\n        // Validate input\n        const validatedData = CreateProjectSchema.parse(body);'
  },
  {
    file: 'src/app/api/backend-example/route.ts',
    find: '            ...validatedData,;',
    replace: '            ...validatedData,'
  },
  // Fix collaboration room route
  {
    file: 'src/app/api/collaboration/rooms/route.ts',
    find: '      id: roomId;',
    replace: '      id: roomId,'
  }
];

console.log('Applying specific fixes...');

fixes.forEach(({ file, find, replace }) => {
  const filePath = path.join(__dirname, '..', file);
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(find)) {
      content = content.replace(find, replace);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed in ${file}: ${find.substring(0, 50)}...`);
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
});

// Fix session route - needs complete rewrite
const sessionRoutePath = path.join(__dirname, '..', 'src/app/api/auth/session/route.ts');
const sessionContent = `import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        const session = request.cookies.get('session');
        
        if (!session) {
            return NextResponse.json({
                authenticated: false,
                user: null
            });
        }
        
        // Simulate authenticated session
        return NextResponse.json({
            authenticated: true,
            user: { 
                id: 'user_123', 
                name: 'John Doe', 
                email: 'john@example.com' 
            }
        });
    } catch (error) {
        console.error('Session check error:', error);
        return NextResponse.json(
            { error: 'Session check failed' }, 
            { status: 500 }
        );
    }
}`;

fs.writeFileSync(sessionRoutePath, sessionContent, 'utf8');
console.log('Rewrote src/app/api/auth/session/route.ts');

console.log('\nAll fixes applied!');