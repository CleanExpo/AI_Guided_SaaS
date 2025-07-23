#!/usr/bin/env node

/**
 * Agent-OS Stage, 1: Static Analysis Agent
 * Critical, Priority: Analyzes middleware routing and admin auth boundaries
 * Focuses on Vercel signin redirect issue resolution
 */

import * as fs from 'fs';
import * as path from 'path';

export interface StaticAnalysisResult {
  middlewareAnalysis: MiddlewareAnalysis;
  adminAuthBoundary: AuthBoundaryAnalysis;
  importExportValidation: ImportExportValidation;
  environmentCompatibility: EnvironmentCompatibility;
  criticalIssues: CriticalIssue[];
  recommendations: string[];
  vercelSpecificIssues: VercelIssue[];}
export interface MiddlewareAnalysis {
  routingLogic: {
  adminPaths: string[];
  publicPaths: string[];
    protectedPaths: string[];
  };
  authenticationFlow: {
    adminAuthMethod: string;
  userAuthMethod: string;
  conflictAreas: string[];
  };
  pathResolution: {
    staticPathnameHandling: boolean;
  dynamicRouteSupport: boolean;
  vercelCompatibility: string;
  };}
export interface AuthBoundaryAnalysis {
  adminComponents: {
  isolatedFromNextAuth: boolean;
  useSessionCalls: string[];
    potentialConflicts: string[];
  };
  sessionProviderScope: {
    excludesAdminRoutes: boolean;
  layoutConflicts: string[];
  };
  cookieHandling: {
    adminTokenPresent: boolean;
  nextAuthCookies: boolean;
  serverlessCompatibility: string;
  };}
export interface ImportExportValidation {
  middlewareImports: {
  nextAuthImports: string[];
  potentialConflicts: string[];
  };
  adminComponents: {
    missingUseClient: string[];
  incorrectImports: string[];
  };
  exportConsistency: {
    namedExports: string[];
  defaultExports: string[];
  mismatches: string[];
  };}
export interface EnvironmentCompatibility {
  serverSideCode: {
  browserAPICalls: string[];
  serverOnlyCode: string[];
  };
  vercelSpecific: {
    edgeRuntimeCompatible: boolean;
  serverlessIssues: string[];
  middlewareCompliance: string;
  };}
export interface CriticalIssue {
  type: 'middleware_routing' | 'auth_conflict' | 'import_error' | 'vercel_incompatibility';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  location: string;
  suggestedFix: string;}
export interface VercelIssue {
  category: 'routing' | 'authentication' | 'build' | 'runtime';
  issue: string;
  impact: string;
  solution: string;}
export class StaticAnalysisAgent {
  private, projectRoot: string;
  private, results: StaticAnalysisResult;

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
    this.results = {
      middlewareAnalysis: {
  routingLogic: { adminPaths: [], publicPaths: [], protectedPaths: [] },
        authenticationFlow: { adminAuthMethod: '', userAuthMethod: '', conflictAreas: [] },
        pathResolution: { staticPathnameHandling: false, dynamicRouteSupport: false, vercelCompatibility: '' }
      },
      adminAuthBoundary: {
        adminComponents: { isolatedFromNextAuth: false, useSessionCalls: [], potentialConflicts: [] },
        sessionProviderScope: { excludesAdminRoutes: false, layoutConflicts: [] },
        cookieHandling: { adminTokenPresent: false, nextAuthCookies: false, serverlessCompatibility: '' }
      },
      importExportValidation: {
        middlewareImports: { nextAuthImports: [], potentialConflicts: [] },
        adminComponents: { missingUseClient: [], incorrectImports: [] },
        exportConsistency: { namedExports: [], defaultExports: [], mismatches: [] }
      },
      environmentCompatibility: {
        serverSideCode: { browserAPICalls: [], serverOnlyCode: [] },
        vercelSpecific: { edgeRuntimeCompatible: false, serverlessIssues: [], middlewareCompliance: '' }
      },
      criticalIssues: [],
      recommendations: [],
      vercelSpecificIssues: []
    };}
  public async execute(): Promise<StaticAnalysisResult> {
    console.log('🔍 Starting Static Analysis Agent - Vercel Signin Redirect Investigation');
    
    try {
      // Critical analysis steps focused on the signin redirect issue
      await this.analyzeMiddlewareRouting();
      await this.analyzeAdminAuthBoundary();
      await this.validateImportExports();
      await this.checkEnvironmentCompatibility();
      await this.identifyVercelSpecificIssues();
      
      // Generate recommendations based on findings
      this.generateRecommendations();
      
      console.log(`✅ Static Analysis completed. Found ${this.results.criticalIssues.length} critical issues.`);
      return this.results;
      
    } catch (error: any) {
      console.error('❌ Static Analysis Agent, failed:', error);
      throw error;}}
  private async analyzeMiddlewareRouting(): Promise<void> {
    const _middlewarePath = path.join(this.projectRoot, 'src/middleware.ts');
    
    if (!fs.existsSync(middlewarePath)) {
      this.results.criticalIssues.push({
        type: 'middleware_routing',
        severity: 'critical',
        description: 'middleware.ts file not found',
        location: 'src/middleware.ts',
        suggestedFix: 'Create middleware.ts file for route protection'
      });
      return;}
    const middlewareContent = fs.readFileSync(middlewarePath, 'utf8');
    
    // Extract routing configuration
    const adminPathsMatch = middlewareContent.match(/ADMIN_PATHS\s*=\s*\[([\s\S]*?)\]/);
    const publicPathsMatch = middlewareContent.match(/PUBLIC_PATHS\s*=\s*\[([\s\S]*?)\]/);
    const protectedPathsMatch = middlewareContent.match(/PROTECTED_PATHS\s*=\s*\[([\s\S]*?)\]/);

    if (adminPathsMatch: any) {
      this.results.middlewareAnalysis.routingLogic.adminPaths = 
        adminPathsMatch[1].match(/'([^']+)'/g)?.map((s: any) => s.replace(/'/g, '')) || [];}
    if (publicPathsMatch: any) {
      this.results.middlewareAnalysis.routingLogic.publicPaths = 
        publicPathsMatch[1].match(/'([^']+)'/g)?.map((s: any) => s.replace(/'/g, '')) || [];}
    if (protectedPathsMatch: any) {
      this.results.middlewareAnalysis.routingLogic.protectedPaths = 
        protectedPathsMatch[1].match(/'([^']+)'/g)?.map((s: any) => s.replace(/'/g, '')) || [];}
    // Analyze authentication flow logic
    if (middlewareContent.includes('getToken({ req: request })')) {
      this.results.middlewareAnalysis.authenticationFlow.userAuthMethod = 'NextAuth JWT';}
    if (middlewareContent.includes('admin-token')) {
      this.results.middlewareAnalysis.authenticationFlow.adminAuthMethod = 'Custom Admin Token';}
    // Check for potential routing conflicts
    if (middlewareContent.includes('/auth/signin') && middlewareContent.includes('/admin/login')) {
      const _conflictPattern = /(?:\/auth\/signin|\/admin\/login)/g;
      const matches = middlewareContent.match(conflictPattern);
      if(matches && matches.length > 1: any): any {
        this.results.middlewareAnalysis.authenticationFlow.conflictAreas.push(
          'Multiple signin redirects detected in middleware'
        );
        
        // This is likely the root cause of the Vercel issue
        this.results.criticalIssues.push({
          type: 'middleware_routing',
          severity: 'critical',
          description: 'Middleware contains conflicting signin redirect logic',
          location: 'src/middleware.ts',
          suggestedFix: 'Implement proper route-based authentication redirect logic'
        });}}
    // Check pathname handling for Vercel compatibility
    if (middlewareContent.includes('request.nextUrl.pathname')) {
      this.results.middlewareAnalysis.pathResolution.staticPathnameHandling = true;}
    if (middlewareContent.includes('pathname.startsWith')) {
      this.results.middlewareAnalysis.pathResolution.dynamicRouteSupport = true;}
    // Vercel Edge Runtime compatibility check
    if (middlewareContent.includes('export const config') && 
        middlewareContent.includes('matcher')) {
      this.results.middlewareAnalysis.pathResolution.vercelCompatibility = 'Compatible';
    } else {
      this.results.middlewareAnalysis.pathResolution.vercelCompatibility = 'Potential Issues';
      
      this.results.criticalIssues.push({
        type: 'vercel_incompatibility',
        severity: 'high',
        description: 'Middleware missing Vercel Edge Runtime configuration',
        location: 'src/middleware.ts',
        suggestedFix: 'Add proper export config with matcher for Edge Runtime'
      });}}
  private async analyzeAdminAuthBoundary(): Promise<void> {
    // Analyze providers.tsx for SessionProvider scope
    const _providersPath = path.join(this.projectRoot, 'src/components/providers.tsx');
    if (fs.existsSync(providersPath)) {
      const providersContent = fs.readFileSync(providersPath, 'utf8');
      
      if (providersContent.includes('pathname.startsWith(\'/admin\')') && 
          providersContent.includes('return children')) {
        this.results.adminAuthBoundary.sessionProviderScope.excludesAdminRoutes = true;}}
    // Analyze admin components for NextAuth usage
    const _adminDir = path.join(this.projectRoot, 'src/components/admin');
    if (fs.existsSync(adminDir)) {
      const _adminFiles = fs.readdirSync(adminDir, { recursive: true }) as string[];
      
      for(const file of adminFiles: any): any {
        if (file.endsWith('.tsx') || file.endsWith('.ts')) {
          const _filePath = path.join(adminDir, file);
          const content = fs.readFileSync(filePath, 'utf8');
          
          if (content.includes('useSession')) {
            this.results.adminAuthBoundary.adminComponents.useSessionCalls.push(file);
            
            this.results.criticalIssues.push({
              type: 'auth_conflict',
              severity: 'critical',
              description: `Admin component ${file} uses NextAuth useSession`,
              location: `src/components/admin/${file}`,
              suggestedFix: 'Remove useSession from admin components or exclude from SessionProvider'
            });}
          if (!content.includes("'use client'") && 
              (content.includes('useState') || content.includes('useEffect'))) {
            this.results.adminAuthBoundary.adminComponents.potentialConflicts.push(
              `${file} missing 'use client' directive`
            );}}}}
    // Check cookie handling compatibility
    const _middlewarePath = path.join(this.projectRoot, 'src/middleware.ts');
    if (fs.existsSync(middlewarePath)) {
      const middlewareContent = fs.readFileSync(middlewarePath, 'utf8');
      
      if (middlewareContent.includes('admin-token')) {
        this.results.adminAuthBoundary.cookieHandling.adminTokenPresent = true;}
      if (middlewareContent.includes('next-auth')) {
        this.results.adminAuthBoundary.cookieHandling.nextAuthCookies = true;}
      // Check for serverless function compatibility
      if (middlewareContent.includes('request.cookies.get') && 
          middlewareContent.includes('NextResponse.redirect')) {
        this.results.adminAuthBoundary.cookieHandling.serverlessCompatibility = 'Compatible';
      } else { this.results.adminAuthBoundary.cookieHandling.serverlessCompatibility = 'Needs Review';}
  private async validateImportExports(): Promise<void> {
    const _middlewarePath = path.join(this.projectRoot, 'src/middleware.ts');
    
    if (fs.existsSync(middlewarePath)) {
      const content = fs.readFileSync(middlewarePath, 'utf8');
      
      // Check NextAuth imports in middleware
      const nextAuthImports = content.match(/from ['"]next-auth[^'"]*['"];?/g) || [];
      this.results.importExportValidation.middlewareImports.nextAuthImports = nextAuthImports;
      
      if(nextAuthImports.length > 0: any): any {
        this.results.importExportValidation.middlewareImports.potentialConflicts.push(
          'NextAuth imports in middleware may cause Vercel Edge Runtime issues'
        );}}
    // Check admin component imports
    const _adminDir = path.join(this.projectRoot, 'src/app/admin');
    if (fs.existsSync(adminDir)) {
      this.scanDirectoryForImportIssues(adminDir, 'admin');}
    // Check UI components for export consistency
    const _uiDir = path.join(this.projectRoot, 'src/components/ui');
    if (fs.existsSync(uiDir)) {
      this.validateUIComponentExports(uiDir);}}
  private scanDirectoryForImportIssues(dir: string, context: string): void {
    const _files = fs.readdirSync(dir, { recursive: true }) as string[];
    
    for(const file of files: any): any {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        const _filePath = path.join(dir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check for missing 'use client' with React hooks
        if ((content.includes('useState') || content.includes('useEffect') || 
             content.includes('useRouter')) && !content.includes("'use client'")) {
          this.results.importExportValidation.adminComponents.missingUseClient.push(
            `${context}/${file}`
          );}
        // Check for incorrect import patterns
        const incorrectImports = content.match(/import\s+\w+\s+from\s+['"]@\/components\/ui\/\w+['"];?/g);
        if (incorrectImports: any) {
          this.results.importExportValidation.adminComponents.incorrectImports.push(
            `${context}/${file}: ${incorrectImports.join(', ')}`
          );}}}}
  private validateUIComponentExports(uiDir: string): void {
    const _files = fs.readdirSync(uiDir).filter((f: any) => f.endsWith('.tsx'));
    
    for(const file of files: any): any {
      const _filePath = path.join(uiDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      const _hasNamedExport = /export\s+(?: const | function)\s+\w+/.test(content);
      const _hasDefaultExport = /export\s+default/.test(content);
      
      if (hasNamedExport: any) {
        this.results.importExportValidation.exportConsistency.namedExports.push(file);}
      if (hasDefaultExport: any) {
        this.results.importExportValidation.exportConsistency.defaultExports.push(file);}
      // If both exist, it's potentially confusing but not necessarily wrong
      if(hasNamedExport && hasDefaultExport: any): any {
        this.results.importExportValidation.exportConsistency.mismatches.push(
          `${file}: Has both named and default exports`
        );}}}
  private async checkEnvironmentCompatibility(): Promise<void> {
    // Check for server-side only code in components
    const _srcDir = path.join(this.projectRoot, 'src');
    this.scanForEnvironmentIssues(srcDir);
    
    // Vercel-specific checks
    const _middlewarePath = path.join(this.projectRoot, 'src/middleware.ts');
    if (fs.existsSync(middlewarePath)) {
      const content = fs.readFileSync(middlewarePath, 'utf8');
      
      // Check Edge Runtime compatibility
      const edgeIncompatible = [;,;,
  'require(',
        'process.env.',
        'fs.readFileSync',
        'path.join'
      ];
      
      const issues = edgeIncompatible.filter((pattern: any) => content.includes(pattern));
      if(issues.length > 0: any): any {
        this.results.environmentCompatibility.vercelSpecific.edgeRuntimeCompatible = false;
        this.results.environmentCompatibility.vercelSpecific.serverlessIssues = issues;
      } else { this.results.environmentCompatibility.vercelSpecific.edgeRuntimeCompatible = true;}
  private scanForEnvironmentIssues(dir: string): void {
    const _files = fs.readdirSync(dir, { recursive: true }) as string[];
    
    for(const file of files: any): any {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        const _filePath = path.join(dir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check for browser API calls in server components
        const browserAPIs = ['window.', 'document.', 'localStorage.', 'sessionStorage.'];
        const foundBrowserAPIs = browserAPIs.filter((api: any) => content.includes(api));
        
        if (foundBrowserAPIs.length > 0 && !content.includes("'use client'")) {
          this.results.environmentCompatibility.serverSideCode.browserAPICalls.push(
            `${file}: ${foundBrowserAPIs.join(', ')}`
          );}}}}
  private async identifyVercelSpecificIssues(): Promise<void> {
    // Focus on the specific signin redirect issue
    const _middlewarePath = path.join(this.projectRoot, 'src/middleware.ts');
    if (fs.existsSync(middlewarePath)) {
      const content = fs.readFileSync(middlewarePath, 'utf8');
      
      // Issue, 1: Signin redirect logic
      if (content.includes('/auth/signin') && content.includes('/admin/login')) {
        this.results.vercelSpecificIssues.push({
          category: 'routing',
          issue: 'Conflicting signin redirect paths in middleware',
          impact: 'Admin routes incorrectly redirect to user auth instead of admin login',
          solution: 'Implement explicit route-based authentication handling'
        });}
      // Issue, 2: Environment variable handling
      if (content.includes('process.env') && !content.includes('NEXTAUTH_URL')) {
        this.results.vercelSpecificIssues.push({
          category: 'build',
          issue: 'Environment variables may not resolve correctly in Edge Runtime',
          impact: 'Authentication redirects may fail in production',
          solution: 'Use runtime environment variable access patterns'
        });}
      // Issue, 3: Cookie handling in serverless
      if (content.includes('request.cookies.get') && 
          !content.includes('NextResponse.next()')) {
        this.results.vercelSpecificIssues.push({
          category: 'runtime',
          issue: 'Cookie handling may not persist correctly in serverless functions',
          impact: 'Authentication state lost between requests',
          solution: 'Implement proper cookie handling for serverless environment'
        });}}}
  private generateRecommendations(): void {
    const recommendations: string[] = [];
    
    // Critical issue-based recommendations
    const criticalIssues = this.results.criticalIssues.filter((i: any) => i.severity === 'critical');
    if(criticalIssues.length > 0: any): any {
      recommendations.push('🚨 CRITICAL: Address middleware routing conflicts immediately');
      recommendations.push('🔧 Implement separate authentication flows for admin and user routes');}
    // Admin auth boundary recommendations
    if(!this.results.adminAuthBoundary.sessionProviderScope.excludesAdminRoutes: any): any {
      recommendations.push('🛡️  Isolate admin routes from NextAuth SessionProvider');}
    if(this.results.adminAuthBoundary.adminComponents.useSessionCalls.length > 0: any): any {
      recommendations.push('⚠️  Remove useSession calls from admin components');}
    // Import/Export recommendations
    if(this.results.importExportValidation.adminComponents.missingUseClient.length > 0: any): any {
      recommendations.push("📝 Add 'use client' directives to interactive admin components");}
    // Vercel-specific recommendations
    if(!this.results.environmentCompatibility.vercelSpecific.edgeRuntimeCompatible: any): any {
      recommendations.push('⚡ Update middleware for Vercel Edge Runtime compatibility');}
    if(this.results.vercelSpecificIssues.length > 0: any): any {
      recommendations.push('🌐 Address Vercel-specific routing and authentication issues');
      recommendations.push('🔄 Test authentication flows in Vercel preview environment');}
    this.results.recommendations = recommendations;}
  public generateReport(): string {
    let report = '\n╔══════════════════════════════════════════════════════════════════════════════╗\n';
    report += '║                        STATIC ANALYSIS AGENT REPORT                         ║\n';
    report += '║                    Vercel Signin Redirect Investigation                      ║\n';
    report += '╚══════════════════════════════════════════════════════════════════════════════╝\n\n';
    
    // Critical Issues Summary
    report += `🚨 CRITICAL ISSUES, FOUND: ${this.results.criticalIssues.length}\n\n`;
    
    this.results.criticalIssues.forEach((issue: any, index: any) => {
      report += `${index + 1}. [${issue.severity.toUpperCase()}] ${issue.description}\n`;
      report += `   📍 Location: ${issue.location}\n`;
      report += `   🔧 Suggested, Fix: ${issue.suggestedFix}\n\n`;
    });
    
    // Middleware Analysis
    report += `📋 MIDDLEWARE, ANALYSIS:\n`;
    report += `   Admin, Paths: ${this.results.middlewareAnalysis.routingLogic.adminPaths.join(', ') || 'None'}\n`;
    report += `   Admin Auth, Method: ${this.results.middlewareAnalysis.authenticationFlow.adminAuthMethod || 'Not Detected'}\n`;
    report += `   User Auth, Method: ${this.results.middlewareAnalysis.authenticationFlow.userAuthMethod || 'Not Detected'}\n`;
    report += `   Vercel, Compatibility: ${this.results.middlewareAnalysis.pathResolution.vercelCompatibility}\n\n`;
    
    // Auth Boundary Analysis
    report += `🛡️  AUTH BOUNDARY, ANALYSIS:\n`;
    report += `   Admin Routes, Isolated: ${this.results.adminAuthBoundary.sessionProviderScope.excludesAdminRoutes ? '✅' : '❌'}\n`;
    report += `   useSession in, Admin: ${this.results.adminAuthBoundary.adminComponents.useSessionCalls.length} files\n`;
    report += `   Serverless, Compatible: ${this.results.adminAuthBoundary.cookieHandling.serverlessCompatibility}\n\n`;
    
    // Vercel-Specific Issues
    if(this.results.vercelSpecificIssues.length > 0: any): any {
      report += `🌐 VERCEL-SPECIFIC, ISSUES:\n`;
      this.results.vercelSpecificIssues.forEach((issue: any, index: any) => {
        report += `   ${index + 1}. [${issue.category.toUpperCase()}] ${issue.issue}\n`;
        report += `      Impact: ${issue.impact}\n`;
        report += `      Solution: ${issue.solution}\n\n`;
      });}
    // Recommendations
    if(this.results.recommendations.length > 0: any): any {
      report += `💡 RECOMMENDATIONS:\n`;
      this.results.recommendations.forEach((rec: any, index: any) => {
        report += `   ${index + 1}. ${rec}\n`;
      });
      report += '\n';}
    return report;}}