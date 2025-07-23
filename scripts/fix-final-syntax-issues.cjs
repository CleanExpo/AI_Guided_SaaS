const fs = require('fs');
const path = require('path');

// Manual fixes for specific files with known issues
const fixes = {
  'src/app/api/n8n/execute/route.ts': content => {
    return content
      .replace(/workflowId: z\.string\(\),/, 'workflowId: z.string(),')
      .replace(/data: z\.record\(z\.any\(\)\)\.optional\(\);/, 'data: z.record(z.any()).optional(),')
      .replace(/id: 'exec_' \+ Math\.random\(\)\.toString\(36\)\.substr\(2, 9\);/, "id: 'exec_' + Math.random().toString(36).substr(2, 9),")
      .replace(/startTime: new Date\(\)\.toISOString\(\),/, 'startTime: new Date().toISOString(),')
      .replace(/status: 'completed',/, "status: 'completed',")
      .replace(/startTime: new Date\(\)\.toISOString\(\);/, 'startTime: new Date().toISOString(),');
  },
  
  'src/app/api/auth/session/route.ts': content => {
    return content
      .replace(/user: \{,/, 'user: {')
      .replace(/authenticated: true,\s*user: \{/, 'authenticated: true,\n      user: {');
  },
  
  'src/app/api/auth/[...nextauth]/options.ts': content => {
    return content
      .replace(/\)\);/, '),')
      .replace(/providers: \[/, 'providers: [')
      .replace(/email: \{ label: 'Email', type: 'email' \};/, "email: { label: 'Email', type: 'email' },")
      .replace(/\}\s*\]\s*;/, '}\n    ],')
      .replace(/pages: \{,/, 'pages: {')
      .replace(/callbacks: \{/, 'callbacks: {')
      .replace(/return token;\s*};/, 'return token;\n        },')
      .replace(/\}\s*};/, '}\n    },');
  },
  
  'src/app/api/backend-example/route.ts': content => {
    return content
      .replace(/id: 'proj_' \+ Math\.random\(\)\.toString\(36\)\.substr\(2, 9\);/, "id: 'proj_' + Math.random().toString(36).substr(2, 9),")
      .replace(/status: 'active',/, "status: 'active',")
      .replace(/createdAt: new Date\(\)\.toISOString\(\)\s*\};/, 'createdAt: new Date().toISOString()\n            },');
  },
  
  'src/app/api/admin/stats/route.ts': content => {
    return content
      .replace(/user_agent: request\.headers\.get\('user-agent'\) \|\| 'unknown'\s*\};/, "user_agent: request.headers.get('user-agent') || 'unknown'\n            },");
  },
  
  'src/app/api/admin/users/[id]/route.ts': content => {
    return content
      .replace(/const userId = params\.id,/, 'const userId = params.id;')
      .replace(/status: 'active',/, "status: 'active',")
      .replace(/createdAt: new Date\(\)\.toISOString\(\);/, 'createdAt: new Date().toISOString(),')
      .replace(/\.\.\.\s*body;/, '...body,');
  },
  
  'src/app/api/admin/users/route.ts': content => {
    return content
      .replace(/status: i % 2 === 0 \? 'active' : 'inactive',/, "status: i % 2 === 0 ? 'active' : 'inactive',")
      .replace(/createdAt: new Date\(\)\.toISOString\(\);/, 'createdAt: new Date().toISOString(),')
      .replace(/total: 1247,/, 'total: 1247,')
      .replace(/pages: Math\.ceil\(1247 \/ limit\)\s*\};/, 'pages: Math.ceil(1247 / limit)\n            },');
  },
  
  'src/app/api/agent-chat/route.ts': content => {
    return content
      .replace(/context\?: Record<string;/, 'context?: Record<string,')
      .replace(/artifacts\?: any\[\]/, 'artifacts?: any[];')
      .replace(/const response: AgentChatResponse = \{,/, 'const response: AgentChatResponse = {')
      .replace(/suggestions: \[([^]]+?)\];/, 'suggestions: [$1],');
  },
  
  'src/app/api/agents/pulse-status/route.ts': content => {
    return content
      .replace(/timestamp: new Date\(\)\.toISOString\(\);/, 'timestamp: new Date().toISOString(),')
      .replace(/agents: \{,/, 'agents: {');
  },
  
  'src/app/api/admin/analytics/route.ts': content => {
    return content
      .replace(/metadata: \{/, 'metadata: {')
      .replace(/ip_address: request\.headers\.get\('x-forwarded-for'\) \|\| 'unknown',/, "ip_address: request.headers.get('x-forwarded-for') || 'unknown',");
  },
  
  'src/app/api/admin/debug/route.ts': content => {
    return content
      .replace(/ADMIN_EMAIL: process\.env\.ADMIN_EMAIL,/, 'ADMIN_EMAIL: process.env.ADMIN_EMAIL,')
      .replace(/MASTER_ADMIN_ENABLED: process\.env\.MASTER_ADMIN_ENABLED\s*\};/, 'MASTER_ADMIN_ENABLED: process.env.MASTER_ADMIN_ENABLED\n            },')
      .replace(/ADMIN_SESSION_SECRET_SET: !!process\.env\.ADMIN_SESSION_SECRET\s*\};/, 'ADMIN_SESSION_SECRET_SET: !!process.env.ADMIN_SESSION_SECRET\n            },');
  },
  
  'src/app/api/cycle-detection/route.ts': content => {
    return content
      .replace(/id: string,/, 'id: string;')
      .replace(/title: string;/, 'title: string;')
      .replace(/content: string,/, 'content: string;')
      .replace(/relevance: number/, 'relevance: number;')
      .replace(/cycleLength\?: number,/, 'cycleLength?: number;')
      .replace(/suggestions: string\[\]/, 'suggestions: string[];')
      .replace(/const result: CycleDetectionResult = \{,/, 'const result: CycleDetectionResult = {');
  },
  
  'src/app/api/feedback/route.ts': content => {
    return content
      .replace(/type: z\.enum\(\['bug', 'feature', 'general'\]\);/, "type: z.enum(['bug', 'feature', 'general']),")
      .replace(/message: z\.string\(\)\.min\(1, 'Message is required'\);/, "message: z.string().min(1, 'Message is required'),")
      .replace(/\}\),/, '});')
      .replace(/id: 'feedback_' \+ Math\.random\(\)\.toString\(36\)\.substr\(2, 9\);/, "id: 'feedback_' + Math.random().toString(36).substr(2, 9),")
      .replace(/status: 'open',/, "status: 'open',");
  }
};

// Apply fixes
Object.entries(fixes).forEach(([filePath, fixFunction]) => {
  const fullPath = path.join(__dirname, '..', filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  
  try {
    const content = fs.readFileSync(fullPath, 'utf8');
    const fixed = fixFunction(content);
    
    if (content !== fixed) {
      fs.writeFileSync(fullPath, fixed, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
    } else {
      console.log(`✓ No changes needed: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }
});

console.log('\nFinal syntax fixes complete!');