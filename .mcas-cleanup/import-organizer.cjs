#!/usr/bin/env node

/**
 * MCAS Import Organizer
 * Organizes imports and detects circular dependencies
 */

const fs = require('fs');
const path = require('path');

class ImportOrganizer {
  constructor() {
    this.totalFiles = 0;
    this.fixedFiles = 0;
    this.circularDeps = new Map();
    this.importGraph = new Map();
  }

  async run() {
    console.log('🔧 MCAS Import Organizer');
    console.log('========================');
    console.log('Organizing imports and detecting circular dependencies...\n');

    // Build import graph
    await this.buildImportGraph();
    
    // Detect circular dependencies
    await this.detectCircularDependencies();
    
    // Organize imports in all files
    await this.organizeImports();
    
    // Generate report
    this.generateReport();
  }

  async buildImportGraph() {
    console.log('Building import graph...');
    const files = this.getAllTypeScriptFiles();
    
    for (const file of files) {
      const imports = this.extractImports(file);
      this.importGraph.set(file, imports);
    }
    
    console.log(`Analyzed ${this.importGraph.size} files\n`);
  }

  getAllTypeScriptFiles() {
    const files = [];
    const srcDir = path.join(process.cwd(), 'src');
    
    function walkDir(dir) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory() && !['node_modules', '.next', '.git'].includes(entry.name)) {
          walkDir(fullPath);
        } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
          files.push(fullPath);
        }
      }
    }
    
    if (fs.existsSync(srcDir)) {
      walkDir(srcDir);
    }
    
    return files;
  }

  extractImports(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const imports = [];
    
    // Match all import statements
    const importRegex = /import\s+(?:(?:\{[^}]*\}|[\w*]+|\*\s+as\s+\w+)\s+from\s+)?['"]([^'"]+)['"]/g;
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];
      
      // Resolve relative imports
      if (importPath.startsWith('.')) {
        const resolvedPath = path.resolve(path.dirname(filePath), importPath);
        imports.push(this.normalizeImportPath(resolvedPath));
      } else if (importPath.startsWith('@/')) {
        const resolvedPath = path.join(process.cwd(), 'src', importPath.slice(2));
        imports.push(this.normalizeImportPath(resolvedPath));
      }
    }
    
    return imports;
  }

  normalizeImportPath(importPath) {
    // Add file extensions if missing
    const extensions = ['.ts', '.tsx', '.js', '.jsx'];
    
    for (const ext of extensions) {
      if (fs.existsSync(importPath + ext)) {
        return importPath + ext;
      }
    }
    
    // Check for index files
    for (const ext of extensions) {
      const indexPath = path.join(importPath, 'index' + ext);
      if (fs.existsSync(indexPath)) {
        return indexPath;
      }
    }
    
    return importPath;
  }

  async detectCircularDependencies() {
    console.log('Detecting circular dependencies...');
    
    for (const [file, imports] of this.importGraph) {
      const visited = new Set();
      const stack = new Set();
      
      this.dfs(file, visited, stack, []);
    }
    
    if (this.circularDeps.size > 0) {
      console.log(`Found ${this.circularDeps.size} circular dependencies\n`);
    } else {
      console.log('No circular dependencies found\n');
    }
  }

  dfs(node, visited, stack, path) {
    if (stack.has(node)) {
      // Found circular dependency
      const cycle = [...path, node];
      const cycleStart = cycle.indexOf(node);
      const circularPath = cycle.slice(cycleStart);
      
      const key = circularPath.sort().join(' -> ');
      if (!this.circularDeps.has(key)) {
        this.circularDeps.set(key, circularPath);
      }
      return;
    }
    
    if (visited.has(node)) {
      return;
    }
    
    visited.add(node);
    stack.add(node);
    
    const imports = this.importGraph.get(node) || [];
    for (const imp of imports) {
      if (this.importGraph.has(imp)) {
        this.dfs(imp, visited, stack, [...path, node]);
      }
    }
    
    stack.delete(node);
  }

  async organizeImports() {
    console.log('Organizing imports...');
    
    for (const file of this.importGraph.keys()) {
      this.totalFiles++;
      
      try {
        const content = fs.readFileSync(file, 'utf8');
        const organized = this.organizeFileImports(content);
        
        if (organized !== content) {
          fs.writeFileSync(file, organized, 'utf8');
          this.fixedFiles++;
        }
      } catch (error) {
        console.error(`Error organizing ${file}:`, error.message);
      }
    }
    
    console.log(`Organized imports in ${this.fixedFiles} files\n`);
  }

  organizeFileImports(content) {
    const lines = content.split('\n');
    const imports = [];
    const otherLines = [];
    let inImportSection = true;
    let hasUseDirective = false;
    
    // Extract imports and other lines
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      
      // Check for use directives
      if (i === 0 && (trimmed === "'use client'" || trimmed === '"use client"' || 
                      trimmed === "'use server'" || trimmed === '"use server"')) {
        hasUseDirective = true;
        otherLines.push(line);
        continue;
      }
      
      // Check if we're still in the import section
      if (inImportSection) {
        if (trimmed.startsWith('import ') || (trimmed === '' && imports.length > 0)) {
          imports.push(line);
        } else if (trimmed !== '') {
          inImportSection = false;
          otherLines.push(line);
        }
      } else {
        otherLines.push(line);
      }
    }
    
    // Organize imports by category
    const reactImports = [];
    const nextImports = [];
    const externalImports = [];
    const aliasImports = [];
    const relativeImports = [];
    const typeImports = [];
    
    for (const imp of imports) {
      const trimmed = imp.trim();
      if (!trimmed) continue;
      
      if (trimmed.includes('import type')) {
        typeImports.push(imp);
      } else if (trimmed.includes("from 'react'") || trimmed.includes('from "react"')) {
        reactImports.push(imp);
      } else if (trimmed.includes("from 'next") || trimmed.includes('from "next')) {
        nextImports.push(imp);
      } else if (trimmed.includes("from '@/")) {
        aliasImports.push(imp);
      } else if (trimmed.includes("from '.")) {
        relativeImports.push(imp);
      } else if (trimmed.includes('from ')) {
        externalImports.push(imp);
      }
    }
    
    // Sort each category
    reactImports.sort();
    nextImports.sort();
    externalImports.sort();
    aliasImports.sort();
    relativeImports.sort();
    typeImports.sort();
    
    // Combine organized imports
    const organizedImports = [
      ...reactImports,
      ...nextImports,
      ...externalImports,
      '',
      ...aliasImports,
      ...relativeImports,
      '',
      ...typeImports
    ].filter((line, index, arr) => {
      // Remove duplicate empty lines
      return !(line === '' && index > 0 && arr[index - 1] === '');
    });
    
    // Remove trailing empty lines from imports
    while (organizedImports.length > 0 && organizedImports[organizedImports.length - 1] === '') {
      organizedImports.pop();
    }
    
    // Combine everything
    const result = [];
    
    if (hasUseDirective) {
      result.push(otherLines.shift()); // Add use directive
      if (organizedImports.length > 0) {
        result.push(''); // Empty line after directive
      }
    }
    
    if (organizedImports.length > 0) {
      result.push(...organizedImports);
      result.push(''); // Empty line after imports
    }
    
    result.push(...otherLines);
    
    return result.join('\n');
  }

  generateReport() {
    console.log('📊 Import Organization Report');
    console.log('============================');
    console.log(`Files analyzed: ${this.totalFiles}`);
    console.log(`Files organized: ${this.fixedFiles}`);
    console.log(`Circular dependencies: ${this.circularDeps.size}`);
    
    if (this.circularDeps.size > 0) {
      console.log('\n🔄 Circular Dependencies:');
      let count = 1;
      for (const [key, cycle] of this.circularDeps) {
        console.log(`\n${count}. Circular dependency detected:`);
        for (let i = 0; i < cycle.length; i++) {
          const file = cycle[i];
          const relative = path.relative(process.cwd(), file);
          const arrow = i < cycle.length - 1 ? '→' : '↻';
          console.log(`   ${arrow} ${relative}`);
        }
        count++;
      }
      
      console.log('\n💡 To fix circular dependencies:');
      console.log('   - Extract shared types to a separate file');
      console.log('   - Use dependency injection');
      console.log('   - Restructure module boundaries');
    }
    
    // Save detailed report
    const report = {
      timestamp: new Date().toISOString(),
      filesAnalyzed: this.totalFiles,
      filesOrganized: this.fixedFiles,
      circularDependencies: Array.from(this.circularDeps.entries()).map(([key, cycle]) => ({
        key,
        cycle: cycle.map(f => path.relative(process.cwd(), f))
      }))
    };
    
    fs.writeFileSync(
      path.join(__dirname, 'import-organization-report.json'),
      JSON.stringify(report, null, 2)
    );
    
    console.log('\n✅ Import organization complete!');
    console.log('📄 Report saved to: .mcas-cleanup/import-organization-report.json');
  }
}

// Run the organizer
const organizer = new ImportOrganizer();
organizer.run().catch(console.error);