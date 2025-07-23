#!/usr/bin/env node

/**
 * Agent-OS Health Check Runner (CommonJS)
 * Quick execution script for the comprehensive 6-stage health check
 */

const fs = require('fs');
const path = require('path');

class SimpleHealthCheck {
  constructor() {
    this.projectRoot = process.cwd();}
  async runQuickDiagnostic() {
    console.log('\n╔══════════════════════════════════════════════════════════════════════════════╗');
    console.log('║                    🔍 AGENT-OS QUICK DIAGNOSTIC                              ║');
    console.log('║                      Vercel Signin Redirect Analysis                        ║');
    console.log('╚══════════════════════════════════════════════════════════════════════════════╝\n');

    console.log('🎯 Target Issue: Admin signin redirecting to /auth instead of /admin in Vercel\n');

    try {
      // Stage 1: Analyze middleware.ts
      await this.analyzeMiddleware();
      
      // Stage 2: Check admin authentication boundary
      await this.checkAuthBoundary();
      
      // Stage 3: Identify Vercel-specific issues
      await this.identifyVercelIssues();
      
      // Stage 4: Generate recommendations
      await this.generateRecommendations();

      console.log('\n✅ Quick diagnostic completed successfully!');
      
    } catch (error) {
      console.error('\n❌ Diagnostic failed:', error.message);}}
  async analyzeMiddleware() {
    console.log('🔍 STAGE 1: Analyzing middleware.ts routing logic...');
    
    const _middlewarePath = path.join(this.projectRoot, 'src/middleware.ts');
    
    if (!fs.existsSync(middlewarePath)) {
      console.log('   ❌ middleware.ts not found');
      return;}
    const middlewareContent = fs.readFileSync(middlewarePath, 'utf8');
    
    // Check for routing configuration
    const _hasAdminPaths = middlewareContent.includes('ADMIN_PATHS');
    const _hasPublicPaths = middlewareContent.includes('PUBLIC_PATHS');
    const _hasProtectedPaths = middlewareContent.includes('PROTECTED_PATHS');
    
    console.log(`   📋 Admin paths configured: ${hasAdminPaths ? '✅' : '❌'}`);
    console.log(`   📋 Public paths configured: ${hasPublicPaths ? '✅' : '❌'}`);
    console.log(`   📋 Protected paths configured: ${hasProtectedPaths ? '✅' : '❌'}`);

    // Check authentication methods
    const _hasNextAuthToken = middlewareContent.includes('getToken({ req: request })');
    const _hasAdminToken = middlewareContent.includes('admin-token');
    
    console.log(`   🔐 NextAuth integration: ${hasNextAuthToken ? '✅' : '❌'}`);
    console.log(`   🔐 Admin token handling: ${hasAdminToken ? '✅' : '❌'}`);

    // CRITICAL: Check for conflicting redirects
    const _authSigninCount = (middlewareContent.match(/\/auth\/signin/g) || []).length;
    const _adminLoginCount = (middlewareContent.match(/\/admin\/login/g) || []).length;
    
    console.log(`   🔄 /auth/signin references: ${authSigninCount}`);
    console.log(`   🔄 /admin/login references: ${adminLoginCount}`);

    if (authSigninCount > 0 && adminLoginCount > 0) {
      console.log('   🚨 CRITICAL: Multiple signin redirect paths detected!');
      console.log('      This is likely causing the Vercel routing issue');}
    // Check Vercel Edge Runtime compatibility
    const _hasExportConfig = middlewareContent.includes('export const config');
    const _hasMatcher = middlewareContent.includes('matcher');
    
    console.log(`   ⚡ Vercel Edge config: ${hasExportConfig && hasMatcher ? '✅' : '❌'}`);
    
    if (!hasExportConfig || !hasMatcher) {
      console.log('   ⚠️  Missing Vercel Edge Runtime configuration');}}
  async checkAuthBoundary() {
    console.log('\n🛡️  STAGE 2: Checking admin authentication boundary...');
    
    // Check providers.tsx
    const _providersPath = path.join(this.projectRoot, 'src/components/providers.tsx');
    if (fs.existsSync(providersPath)) {
      const providersContent = fs.readFileSync(providersPath, 'utf8');
      
      const _excludesAdmin = providersContent.includes("pathname.startsWith('/admin')");
      console.log(`   🔒 Admin routes excluded from SessionProvider: ${excludesAdmin ? '✅' : '❌'}`);
      
      if (!excludesAdmin) {
        console.log('   🚨 CRITICAL: Admin routes may be affected by NextAuth SessionProvider');}}
    // Check admin components for NextAuth usage
    const _adminDir = path.join(this.projectRoot, 'src/components/admin');
    if (fs.existsSync(adminDir)) {
      const _adminFiles = fs.readdirSync(adminDir, { recursive: true });
      let useSessionCount = 0;
      
      for (const file of adminFiles) {
        if (file.endsWith('.tsx') || file.endsWith('.ts')) {
          const _filePath = path.join(adminDir, file);
          const content = fs.readFileSync(filePath, 'utf8');
          
          if (content.includes('useSession')) {
            useSessionCount++;
            console.log(`   ⚠️  ${file} uses NextAuth useSession`);}}}
      console.log(`   📊 Admin components using useSession: ${useSessionCount}`);
      if (useSessionCount > 0) { console.log('   🚨 CRITICAL: Admin components should not use NextAuth hooks');}
  async identifyVercelIssues() {
    console.log('\n🌐 STAGE 3: Identifying Vercel-specific issues...');
    
    const _middlewarePath = path.join(this.projectRoot, 'src/middleware.ts');
    if (fs.existsSync(middlewarePath)) {
      const content = fs.readFileSync(middlewarePath, 'utf8');
      
      // Check for Edge Runtime compatibility issues
      const edgeIncompatible = [
        { pattern: 'require(', issue: 'CommonJS require() not supported in Edge Runtime' },
        { pattern: 'process.env.', issue: 'Direct process.env access may not work in Edge Runtime' },
        { pattern: 'fs.readFileSync', issue: 'File system access not available in Edge Runtime' },
        { pattern: 'path.join', issue: 'Node.js path module may not be fully supported' }
      ];
      
      let issues = [];
      edgeIncompatible.forEach(({ pattern, issue }) => {
        if (content.includes(pattern)) {
          issues.push(issue);}
      });
      
      console.log(`   ⚡ Edge Runtime compatibility issues: ${issues.length}`);
      issues.forEach((issue, i) => {
        console.log(`      ${i + 1}. ${issue}`);
      });

      // Check for specific signin redirect logic that might behave differently in Vercel
      if (content.includes('/auth/signin') && content.includes('/admin/login')) { console.log('   🎯 ROOT CAUSE IDENTIFIED:');
        console.log('      Middleware contains both /auth/signin and /admin/login redirects');
        console.log('      This creates ambiguous routing behavior in Vercel production');
        console.log('      Local dev server may behave differently than Vercel Edge Runtime');}
  async generateRecommendations() {
    console.log('\n💡 STAGE 4: Generating fix recommendations...');
    
    console.log('\n🔧 IMMEDIATE ACTIONS REQUIRED:');
    
    console.log('\n   1. 🚨 CRITICAL - Fix Middleware Routing Logic:');
    console.log('      • Implement explicit route-based authentication in middleware.ts');
    console.log('      • Ensure admin routes (/admin/*) redirect to /admin/login');
    console.log('      • Ensure user routes (dashboard, etc.) redirect to /auth/signin');
    console.log('      • Remove ambiguous redirect logic');

    console.log('\n   2. 🛡️  HIGH - Isolate Admin Authentication:');
    console.log('      • Remove any useSession calls from admin components');
    console.log('      • Ensure admin routes are excluded from NextAuth SessionProvider');
    console.log('      • Use separate admin-token based authentication');

    console.log('\n   3. ⚡ MEDIUM - Vercel Edge Runtime Compatibility:');
    console.log('      • Review middleware for Edge Runtime compatibility');
    console.log('      • Add proper export config with matcher');
    console.log('      • Test authentication flows in Vercel preview environment');

    console.log('\n📋 VERIFICATION STEPS:');
    console.log('   1. Deploy to Vercel preview');
    console.log('   2. Test: Navigate to any protected route');
    console.log('   3. Verify: Admin routes redirect to /admin/login');
    console.log('   4. Verify: User routes redirect to /auth/signin');
    console.log('   5. Test both authentication flows end-to-end');

    // Generate a simple fix script
    this.generateSimpleFix();}
  generateSimpleFix() {
    console.log('\n🔧 Generating middleware fix...');
    
    const _fixScript = `
// MIDDLEWARE.TS FIX FOR VERCEL SIGNIN REDIRECT ISSUE
// Apply this fix to src/middleware.ts

// 1. Ensure explicit route-based authentication:
if (ADMIN_PATHS.some(path => pathname.startsWith(path))) {
  // Admin routes - use custom admin authentication
  const _adminToken = request.cookies.get('admin-token');
  
  if (!adminToken) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);}
  // Admin routes bypass NextAuth validation
  return NextResponse.next();}
// 2. Handle regular user routes with NextAuth:
if (PROTECTED_PATHS.some(path => pathname.startsWith(path))) {
  const _token = await getToken({ req: request });
  
  if (!token) {
    const loginUrl = new URL('/auth/signin', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);}}
// 3. Ensure proper Vercel Edge Runtime config:
export const _config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)'
  ]
};
    `;
    
    console.log('\n📝 MIDDLEWARE FIX TEMPLATE:');
    console.log('   Copy the above fix template to your middleware.ts file');
    console.log('   Adjust the logic to match your specific routing needs');
    
    return fixScript;}}
// Run the diagnostic
async function main() {
  const healthCheck = new SimpleHealthCheck();
  await healthCheck.runQuickDiagnostic();}
if (require.main === module) {
  main().catch(console.error);}
module.exports = { SimpleHealthCheck };
