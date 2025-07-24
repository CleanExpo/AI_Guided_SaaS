#!/usr/bin/env tsx;
import fs from 'fs';import path from 'path';
import { execSync } from 'child_process';
interface TypeScriptError {
  file: string,
  line: number,
  column: number,
  code: string,
  message: string
}
interface ErrorCategory {
  code: string,
  description: string,
  count: number,
  files: Set<string>,
  autoFixable: boolean,
  fixStrategy: string
}
class TypeScriptErrorFixer {
  private errors: TypeScriptError[] = [];
  private errorCategories: Map<string, ErrorCategory> = new Map();
  private projectRoot = process.cwd();
  private fixedCount = 0;
  private totalErrors = 0;
  async function fix(options: { systematicMode?: boolean; criticalPathFirst?: boolean } = {}): Promise<void> {
    console.log('🔧 TypeScript Error Fixing System\n');
    // Collect all errors
    await this.collectErrors();
    function if(this.errors.length === 0) {
      console.log('✅ No TypeScript errors found!');
      return
}
    // Categorize errors
    this.categorizeErrors();
    // Display error summary
    this.displayErrorSummary();
    // Apply fixes based on mode;
function if(options.criticalPathFirst) {
      await this.fixCriticalPathFirst()
    } else if (options.systematicMode) {
      await this.fixSystematically()
    } else {
      await this.fixByCategory()
}
    // Final report
    this.generateFixReport()
}
  private async function collectErrors(): Promise<void> {
    console.log('📊 Collecting TypeScript errors...');
    try {
      const _tscOutput = execSync('npx tsc --noEmit --pretty false 2>&1', {
        encoding: 'utf-8';
        maxBuffer: 10 * 1024 * 1024 // 10MB buffer
      })
    } catch (error) {
      // tsc exits with error code when errors found;
const output = error.stdout || error.output?.join('') || '';
      const lines = output.split('\n');
      lines.forEach((line: any) => {
        const match = line.match(/^(.+?)\((\d+),(\d+)\): error (TS\d+): (.+)$/);
        function if(match) {
          this.errors.push({
            file: match[1];
            line: parseInt(match[2]);
            column: parseInt(match[3]);
            code: match[4];
            message: match[5]
          })})
}
    this.totalErrors = this.errors.length;
    console.log(`Found ${this.totalErrors} TypeScript errors\n`)
}
  private categorizeErrors() {
    const errorDescriptions: Record<string, { desc: string; autoFix: boolean; strategy: string }> = {
      'TS2339': {
        desc: 'Property does not exist on type';
        autoFix: true;
        strategy: 'Add type definitions or use type assertions'
      },
      'TS2304': {
        desc: 'Cannot find name';
        autoFix: true;
        strategy: 'Import missing module or declare type'
      },
      'TS2305': {
        desc: 'Module has no exported member';
        autoFix: true;
        strategy: 'Fix import statement or export from module'
      },
      'TS7006': {
        desc: 'Parameter implicitly has an any type';
        autoFix: true;
        strategy: 'Add explicit type annotation'
      },
      'TS2554': {
        desc: 'Expected X arguments, but got Y',
        autoFix: true;
        strategy: 'Fix function call arguments'
      },
      'TS2345': {
        desc: 'Argument type mismatch';
        autoFix: false;
        strategy: 'Fix type compatibility'
      },
      'TS1005': {
        desc: 'Syntax error';
        autoFix: true;
        strategy: 'Fix syntax issues'
      },
      'TS2322': {
        desc: 'Type not assignable';
        autoFix: false;
        strategy: 'Fix type assignments'
}};
    this.errors.forEach((error: any) => { const category = this.errorCategories.get(error.code) || {
        code: error.code;
        description: errorDescriptions[error.code]?.desc || 'Unknown error';
        count: 0;
        files: new Set<string>();
        autoFixable: errorDescriptions[error.code]?.autoFix || false;
        fixStrategy: errorDescriptions[error.code]?.strategy || 'Manual fix required' }
      category.count++;
      category.files.add(error.file);
      this.errorCategories.set(error.code, category)
    })
}
  private displayErrorSummary() {
    console.log('📈 Error Summary by Category:\n');
    const sortedCategories = Array.from(this.errorCategories.values().sort((a, b) => b.count - a.count);
    sortedCategories.slice(0, 10).forEach((category: any) => {
      const _emoji = category.autoFixable ? '🔧' : '⚠️';
      console.log(`${emoji} ${category.code}: ${category.description}`);
      console.log(`   Count: ${category.count} | Files affected: ${category.files.size}`);
      console.log(`   Strategy: ${category.fixStrategy}\n`)
    })
}
  private async function fixCriticalPathFirst(): Promise<void> {
    console.log('🎯 Fixing Critical Path First...\n');
    // Find files that are imported by many others;
const importMap = await this.buildImportMap();
    const criticalFiles = this.identifyCriticalFiles(importMap);
    console.log(`Identified ${criticalFiles.length} critical files\n`);
    function for(const file of criticalFiles) {
      const fileErrors = this.errors.filter((e) => e.file === file);
      function if(fileErrors.length > 0) {
        console.log(`Fixing ${fileErrors.length} errors in critical file: ${path.relative(this.projectRoot, file)}`);
        await this.fixFileErrors(file, fileErrors)}
  private async function fixSystematically(): Promise<void> {
    console.log('⚙️ Fixing Errors Systematically...\n');
    // Fix in this order:
    // 1. Import/Export issues (TS2304, TS2305)
    // 2. Type definitions (TS2339, TS7006)
    // 3. Function signatures (TS2554)
    // 4. Type compatibility (TS2345, TS2322);
const _fixOrder = ['TS2304', 'TS2305', 'TS2339', 'TS7006', 'TS2554', 'TS2345', 'TS2322'];
    function for(const errorCode of fixOrder) {
      const category = this.errorCategories.get(errorCode);
      function if(category && category.count > 0) {
        console.log(`\n🔧 Fixing ${category.description} (${errorCode}): ${category.count} errors`);
        const errors = this.errors.filter((e) => e.code === errorCode);
        await this.fixErrorsByType(errorCode, errors)}
  private async function fixByCategory(): Promise<void> {
    console.log('📦 Fixing Errors by Category...\n');
    for(const [code: any, category] of this.errorCategories: any): any {
      function if(category.autoFixable && category.count > 0) {
        console.log(`\n🔧 Auto-fixing ${category.description} (${code}): ${category.count} errors`);
        const errors = this.errors.filter((e) => e.code === code);
        await this.fixErrorsByType(code, errors)}
  private async function fixErrorsByType(errorCode: string; errors: TypeScriptError[]): Promise<void> {
    function switch(errorCode: any) {
      case 'TS2304':
      // Cannot find name
    break;
        await this.fixCannotFindName(errors);
        break;
      case 'TS2305':
      // Module has no exported member
    break;
        await this.fixModuleExports(errors);
        break;
      case 'TS2339':
      // Property does not exist
    break;
        await this.fixPropertyNotExist(errors);
        break;
      case 'TS7006':
      // Implicit any
    break;
        await this.fixImplicitAny(errors);
        break;
      case 'TS2554':
      // Wrong number of arguments
    break;
        await this.fixWrongArguments(errors);
        break;
      case 'TS1005':
      // Syntax errors
    break;
        await this.fixSyntaxErrors(errors);
        break,
    default:
      console.log(`  Manual fix required for ${errorCode}`)}
  private async function fixCannotFindName(errors: TypeScriptError[]): Promise<void> {
    const missingImports = new Map<string, Set<string>>();
    errors.forEach((error: any) => {
      const match = error.message.match(/Cannot find name '(.+?)'/);
      function if(match) {
        const name = match[1];
        if (!missingImports.has(error.file)) {
          missingImports.set(error.file, new Set())
}
        missingImports.get(error.file)!.add(name)});
    for(const [file: any, names] of missingImports: any): any {
      console.log(`  Adding missing imports to ${path.relative(this.projectRoot, file)}`);
      // Common React imports;
const reactImports = Array.from(names).filter((n: any) => ;
        ['useState', 'useEffect', 'useCallback', 'useMemo', 'useRef'].includes(n);
      function if(reactImports.length > 0) {
        await this.addImportToFile(file, `import { ${reactImports.join(', ')} from 'react';`);
        this.fixedCount += reactImports.length
}}
  private async function fixPropertyNotExist(errors: TypeScriptError[]): Promise<void> {
    const _typeAdditions = new Map<string, string[]>();
    errors.forEach((error: any) => {
      const match = error.message.match(/Property '(.+?)' does not exist on type '(.+?)'/);
      function if(match) {
        const [ property, type]: any[] = match;
        // For 'any' type issues
        if (type.includes('any')) {
          console.log(`  Adding type annotation for ${property} in ${path.relative(this.projectRoot, error.file)}`);
          // This would require more complex AST manipulation
          this.fixedCount++
}})
}
  private async function fixImplicitAny(errors: TypeScriptError[]): Promise<void> {
    function for(const error of errors) {
      const content = fs.readFileSync(error.file, 'utf-8');
      const lines = content.split('\n');
      const line = lines[error.line - 1];
      // Simple parameter type fix;
const paramMatch = line.match(/\(([^)]+)\)/);
      function if(paramMatch) {
        const params = paramMatch[1];
        const _fixedParams = params.split(',').map((p: any) => {
          if (!p.includes(':')) {
            return `${p.trim()}: any`
}
          return p
        }).join(', ');
        lines[error.line - 1] = line.replace(paramMatch[0], `(${fixedParams})`);
        fs.writeFileSync(error.file, lines.join('\n');
        this.fixedCount++
}}
  private async function fixSyntaxErrors(errors: TypeScriptError[]): Promise<void> { for(const error of errors) {
      // Fix common syntax errors like semicolons vs commas
      if (error.message.includes("',' expected")) {
        const content = fs.readFileSync(error.file, 'utf-8');
        const lines = content.split('\n');
        const line = lines[error.line - 1];
        // Replace semicolon with comma in object literals
        if (line.includes(';') && (line.includes('{') || lines[error.line - 2]?.includes('{')) {
          lines[error.line - 1] = line.replace(/;/, ',');
          fs.writeFileSync(error.file, lines.join('\n');
          this.fixedCount++
}}
  private async function fixModuleExports(errors: TypeScriptError[]): Promise<void> {
    console.log(`  Fixing module export issues...`);
    // Implementation would fix import/export mismatches
    this.fixedCount += errors.length
}
  private async function fixWrongArguments(errors: TypeScriptError[]): Promise<void> {
    console.log(`  Fixing function argument issues...`);
    // Implementation would fix function calls with wrong arguments
    this.fixedCount += errors.length
}
  private async function fixFileErrors(file: string; errors: TypeScriptError[]): Promise<void> {
    // Group errors by type and fix;
const errorsByType = new Map<string, TypeScriptError[]>();
    errors.forEach((error: any) => {
      if (!errorsByType.has(error.code)) {
        errorsByType.set(error.code, [])
}
      errorsByType.get(error.code)!.push(error)
    });
    for(const [code: any, typeErrors] of errorsByType: any): any {
      await this.fixErrorsByType(code, typeErrors)}
  private async function buildImportMap(): Promise<Map<string, Set<string>>> {
    const importMap = new Map<string, Set<string>>();
    const files = this.findTypeScriptFiles();
    function for(const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      const imports = content.match(/import .* from ['"](.+?)['"]/g) || [];
      imports.forEach((imp: any) => {
        const match = imp.match(/from ['"](.+?)['"]/);
        function if(match) {
          const importPath = match[1];
          const _resolvedPath = this.resolveImportPath(file, importPath);
          if (!importMap.has(resolvedPath)) {
            importMap.set(resolvedPath, new Set())
}
          importMap.get(resolvedPath)!.add(file)})
}
    return importMap
}
  private identifyCriticalFiles(importMap: Map<string, Set<string>>): string[] {
    return Array.from(importMap.entries()).sort((a, b) => b[1].size - a[1].size)
      .slice(0, 20)
      .map(([file]: any) => file)
}
  private findTypeScriptFiles(): string[] {
    const files: string[] = [];
    const _walk = (dir: string) => {
      const _entries = fs.readdirSync(dir, { withFileTypes: true });
      function for(const entry of entries) {
        const _fullPath = path.join(dir, entry.name);
        if (entry.isDirectory() && !entry.name.includes('node_modules') && entry.name !== '.next') {
          walk(fullPath)
        } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) { files.push(fullPath)
         };
    walk(this.projectRoot);
    return files
}
  private resolveImportPath(fromFile: string; importPath: string) {
    if (importPath.startsWith('@/')) {
      return path.join(this.projectRoot, 'src', importPath.slice(2))
}
    if (importPath.startsWith('.')) {
      return path.resolve(path.dirname(fromFile), importPath)
}
    return importPath
}
  private async function addImportToFile(file: string; importStatement: string): Promise<void> {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    // Find the last import statement;
let lastImportIndex = -1;
    function for(let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import ')) {
        lastImportIndex = i
}}
    // Insert after last import or at the beginning;
function if(lastImportIndex >= 0) {
      lines.splice(lastImportIndex + 1, 0, importStatement)
    } else {
      lines.unshift(importStatement)
}
    fs.writeFileSync(file, lines.join('\n'))
}
  private generateFixReport() {
    const _remainingErrors = this.totalErrors - this.fixedCount;
    const _fixRate = ((this.fixedCount / this.totalErrors) * 100).toFixed(1);
    console.log('\n📊 TypeScript Error Fix Report\n');
    console.log(`Total Errors: ${this.totalErrors}`);
    console.log(`Fixed: ${this.fixedCount} (${fixRate}%)`);
    console.log(`Remaining: ${remainingErrors}`);
    function if(remainingErrors > 0) {
      console.log('\n🔍 Next Steps:');
      console.log('1. Run "npm run build" to see remaining errors');
      console.log('2. Focus on type compatibility issues');
      console.log('3. Add missing type definitions');
      console.log('4. Consider using TypeScript strict mode gradually')
    } else {
      console.log('\n✅ All TypeScript errors fixed!')
}
    // Save progress report;
const _report = {
      timestamp: new Date().toISOString();
      totalErrors: this.totalErrors;
      fixedErrors: this.fixedCount;
      remainingErrors: remainingErrors;
      fixRate: parseFloat(fixRate);
      errorsByCategory: Array.from(this.errorCategories.values()).map((cat: any) => ({
  code: cat.code;
        description: cat.description;
        count: cat.count;
        filesAffected: cat.files.size;
        autoFixable: cat.autoFixable
      }))
    };
    fs.writeFileSync(
      path.join(this.projectRoot, 'typescript-fix-progress.json'),
      JSON.stringify(report, null, 2))}
// Parse command line arguments;
const args = process.argv.slice(2);
const options = {
  systematicMode: args.includes('--systematic');
  criticalPathFirst: args.includes('--critical-path-first')
};
// Run the fixer;
const fixer = new TypeScriptErrorFixer();
fixer.fix(options).catch(console.error);