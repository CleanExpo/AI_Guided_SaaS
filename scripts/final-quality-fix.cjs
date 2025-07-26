const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔧 Final Code Quality Fix...\n');

// Specific fixes for remaining issues
const specificFixes = {
  'src/services/llm-fallback-system.ts': content => {
    return content
      .replace(/process\.env\.OPENAI_API_KEY\s*\|\|\s*""/g, 'process.env.OPENAI_API_KEY || ""')
      .replace(/process\.env\.ANTHROPIC_API_KE\s*\|\|\s*''/g, 'process.env.ANTHROPIC_API_KEY || ""');
  },
  
  'src/services/analytics-websocket.ts': content => {
    return content.replace(
      /process\.env\.NEXT_PUBLIC_ANALYTICS_WS_UR\s*\|\|/g,
      'process.env.NEXT_PUBLIC_ANALYTICS_WS_URL ||'
    );
  },
  
  'src/packages/causal-engine/logger.ts': content => {
    return content.replace(
      /process\.env\.NEXT_PUBLIC_SUPABASE_ANON_KEY\s*\|\|\s*""!;/g,
      'process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";'
    );
  },
  
  'src/lib/validate-env.ts': content => {
    return content
      .replace(/process\.env\.NEXTAUTH_URL\s*\|\|\s*""/g, 'process.env.NEXTAUTH_URL || ""')
      .replace(
        /if\s*\(!process\.env\.OPENAI_API_KEY\s*\|\|\s*""\s*&&\s*!process\.env\.ANTHROPIC_API_KEY\s*\|\|\s*""\)/g,
        'if (!process.env.OPENAI_API_KEY && !process.env.ANTHROPIC_API_KEY)'
      );
  },
  
  'src/lib/project-storage.ts': content => {
    return content.replace(
      /process\.env\.SUPABASE_SERVICE_ROLE_KEY\s*\|\|\s*""/g,
      'process.env.SUPABASE_SERVICE_ROLE_KEY || ""'
    );
  },
  
  'src/lib/email.ts': content => {
    return content.replace(/process\.env\.RESEND_API_KE\s*\|\|/g, 'process.env.RESEND_API_KEY ||');
  },
  
  'src/lib/auth.ts': content => {
    return content
      .replace(/process\.env\.NEXT_PUBLIC_SUPABASE_URL\s*\|\|\s*""/g, 'process.env.NEXT_PUBLIC_SUPABASE_URL || ""')
      .replace(/process\.env\.GOOGLE_CLIENT_I\s*\|\|/g, 'process.env.GOOGLE_CLIENT_ID ||');
  },
  
  'src/lib/admin-auth.ts': content => {
    return content
      .replace(/process\.env\.ADMIN_EMAI\s*\|\|/g, 'process.env.ADMIN_EMAIL ||')
      .replace(/process\.env\.ADMIN_PASSWOR\s*\|\|/g, 'process.env.ADMIN_PASSWORD ||')
      .replace(/process\.env\.ADMIN_SESSION_SECRE\s*\|\|/g, 'process.env.ADMIN_SESSION_SECRET ||');
  },
  
  'src/lib/semantic/SemanticSearchService.ts': content => {
    return content.replace(/process\.env\.SEMANTIC_API_UR\s*\|\|/g, 'process.env.SEMANTIC_API_URL ||');
  },
  
  'src/lib/health/external-services-health.ts': content => {
    return content
      .replace(/process\.env\.STRIPE_SECRET_KEY\s*\|\|\s*""/g, 'process.env.STRIPE_SECRET_KEY || ""')
      .replace(/process\.env\.VERCEL_TOKEN\s*\|\|\s*""/g, 'process.env.VERCEL_TOKEN || ""')
      .replace(/process\.env\.GITHUB_TOKEN\s*\|\|\s*""/g, 'process.env.GITHUB_TOKEN || ""')
      .replace(/process\.env\.RESEND_API_KEY\s*\|\|\s*""/g, 'process.env.RESEND_API_KEY || ""')
      .replace(/\{\s*Date\.now\(/g, '{ // Date.now(');
  },
  
  'src/lib/epc/inference-telemetry.ts': content => {
    return content
      .replace(/if\s*\(proce$/m, 'if (process.env.SUPABASE_URL');
  },
  
  'src/components/ide/KiroProjectSetup.tsx': content => {
    return content.replace(/process\.env\.POR\s*\|\|/g, 'process.env.PORT ||');
  },
  
  'src/app/api/webhooks/stripe/route.ts': content => {
    return content.replace(/process\.env\.STRIPE_SECRET_KEY\s*\|\|\s*''/g, 'process.env.STRIPE_SECRET_KEY || ""');
  },
  
  'src/app/api/errors/route.ts': content => {
    return content.replace(/process\.env\.DISCORD_ERROR_WEBHOOK\s*\|\|\s*""/g, 'process.env.DISCORD_ERROR_WEBHOOK || ""');
  },
  
  'src/app/api/env/status/route.ts': content => {
    return content
      .replace(/!!process\.env\.NEXTAUTH_URL\s*\|\|\s*""/g, '!!process.env.NEXTAUTH_URL')
      .replace(/!!process\.env\.SMTP_HOST\s*\|\|\s*""/g, '!!process.env.SMTP_HOST');
  },
  
  'src/app/api/email/test/route.ts': content => {
    return content.replace(/!!process\.env\.SMTP_HOST\s*\|\|\s*""/g, '!!process.env.SMTP_HOST');
  },
  
  'src/app/api/cron/cache-warm/route.ts': content => {
    return content.replace(/process\.env\.PRERENDER_TOKE\s*\|\|/g, 'process.env.PRERENDER_TOKEN ||');
  },
  
  'src/app/api/admin/direct-auth/route.ts': content => {
    return content.replace(/!!process\.env\.ADMIN_PASSWORD\s*\|\|\s*""/g, '!!process.env.ADMIN_PASSWORD');
  },
  
  'src/app/api/admin/debug/route.ts': content => {
    return content.replace(/!!process\.env\.ADMIN_JWT_SECRET\s*\|\|\s*"default-jwt-secret"/g, '!!process.env.ADMIN_JWT_SECRET');
  },
  
  'src/app/api/admin/auth/login/route.ts': content => {
    return content.replace(/process\.env\.ADMIN_PASSWORD\s*\|\|\s*""/g, 'process.env.ADMIN_PASSWORD || ""');
  }
};

// Generic patterns to fix
const genericFixes = content => {
  // Fix environment variables with broken syntax
  content = content.replace(/process\.env\.([A-Z_]+[A-Z])\s+([A-Z])\s*\|\|/g, 'process.env.$1$2 ||');
  
  // Fix double || patterns
  content = content.replace(/\|\|\s*""\s*\|\|\s*''/g, ' || ""');
  content = content.replace(/\|\|\s*''\s*\|\|\s*""/g, ' || ""');
  
  // Fix parentheses around env checks
  content = content.replace(/\(process\.env\.NODE_ENV\s*\|\|\s*"([^"]+)"\)\s*===\s*"([^"]+)"/g, 
    '(process.env.NODE_ENV || "$1") === "$2"');
  
  // Fix style placeholders - ensure proper object syntax
  content = content.replace(/style=\{\{\s*backgroundColor:\s*([^}]+)\s*\}\}/g, 
    'style={{ backgroundColor: $1 }}');
  content = content.replace(/style=\{\{\s*fontFamily:\s*([^}]+)\s*\}\}/g, 
    'style={{ fontFamily: $1 }}');
  
  // Fix broken lines
  content = content.replace(/\bprocess\.env\.NODE_EN\b/g, 'process.env.NODE_ENV');
  content = content.replace(/\bprocess\.env\.OPENAI_API_KE\b/g, 'process.env.OPENAI_API_KEY');
  content = content.replace(/\bprocess\.env\.ADMIN_PANE\b/g, 'process.env.ADMIN_PANEL');
  content = content.replace(/\bprocess\.env\.ENABLE_ADMIN_PANE\b/g, 'process.env.ENABLE_ADMIN_PANEL');
  content = content.replace(/\bprocess\.env\.ADMIN_JWT_SECRE\b/g, 'process.env.ADMIN_JWT_SECRET');
  content = content.replace(/\bprocess\.env\.MASTER_ADMIN_ENABLE\b/g, 'process.env.MASTER_ADMIN_ENABLED');
  
  return content;
};

let totalFixed = 0;
const filesModified = new Set();

// Process files
const files = glob.sync('src/**/*.{ts,tsx,js,jsx}', {
  cwd: path.join(__dirname, '..'),
  absolute: true
});

files.forEach(file => {
  const relativePath = path.relative(path.join(__dirname, '..'), file).replace(/\\/g, '/');
  let content = fs.readFileSync(file, 'utf8');
  const originalContent = content;
  
  // Apply specific fixes if available
  if (specificFixes[relativePath]) {
    content = specificFixes[relativePath](content);
  }
  
  // Apply generic fixes
  content = genericFixes(content);
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    filesModified.add(file);
    totalFixed++;
    console.log(`✅ Fixed ${relativePath}`);
  }
});

console.log(`\n📊 Summary:`);
console.log(`  Files fixed: ${filesModified.size}`);
console.log(`  Total fixes: ${totalFixed}`);

if (filesModified.size > 0) {
  console.log('\n✅ All remaining issues should now be fixed!');
  console.log('\n📝 Final steps:');
  console.log('  1. Run: npm run build');
  console.log('  2. Deploy to Vercel');
} else {
  console.log('\n✅ No issues found!');
}