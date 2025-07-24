#!/usr/bin/env node

/**
 * MCAS Type Safety Agent
 * Automatically adds missing type annotations based on usage patterns
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Common type patterns
const TYPE_PATTERNS = {
  // React types
  'children': ': ReactNode',
  'className': ': string',
  'style': ': CSSProperties',
  'onClick': ': (e: MouseEvent) => void',
  'onChange': ': (e: ChangeEvent<HTMLInputElement>) => void',
  'onSubmit': ': (e: FormEvent) => void',
  'disabled': ': boolean',
  'loading': ': boolean',
  'error': ': string | null',
  'data': ': any',
  'id': ': string',
  'name': ': string',
  'value': ': string',
  'label': ': string',
  'placeholder': ': string',
  'type': ': string',
  'href': ': string',
  'src': ': string',
  'alt': ': string',
  'width': ': number',
  'height': ': number',
  'size': ': "sm" | "md" | "lg"',
  'variant': ': "primary" | "secondary" | "outline"',
  'status': ': "idle" | "loading" | "success" | "error"',
  
  // Function parameters
  'req': ': NextRequest',
  'res': ': NextResponse',
  'params': ': { [key: string]: string }',
  'searchParams': ': { [key: string]: string | string[] }',
  
  // State types
  'setState': ': Dispatch<SetStateAction<T>>',
  'isOpen': ': boolean',
  'setIsOpen': ': Dispatch<SetStateAction<boolean>>',
  'items': ': any[]',
  'user': ': User | null',
  'session': ': Session | null',
  
  // API types
  'response': ': Response',
  'headers': ': Headers',
  'body': ': any',
  'method': ': string',
  'url': ': string',
  'config': ': any',
  'options': ': any',
  
  // Event handlers
  'handleClick': ': () => void',
  'handleChange': ': (value: any) => void',
  'handleSubmit': ': (data: any) => void',
  'handleError': ': (error: Error) => void',
  
  // Common objects
  'project': ': Project',
  'projects': ': Project[]',
  'template': ': Template',
  'templates': ': Template[]',
  'feature': ': Feature',
  'features': ': Feature[]'
};

class TypeSafetyAgent {
  constructor() {
    this.totalFiles = 0;
    this.fixedFiles = 0;
    this.totalTypesAdded = 0;
    this.errorMap = new Map();
  }

  async run() {
    console.log('🤖 MCAS Type Safety Agent');
    console.log('========================');
    console.log('Analyzing TypeScript errors and adding type annotations...\n');

    // Collect type errors
    await this.collectTypeErrors();
    
    // Process files
    await this.processFiles();
    
    // Generate missing interfaces
    await this.generateInterfaces();
    
    // Report results
    this.report();
  }

  async collectTypeErrors() {
    console.log('Collecting type errors...');
    
    try {
      const output = execSync('npx tsc --noEmit 2>&1', { 
        encoding: 'utf8',
        cwd: process.cwd(),
        maxBuffer: 10 * 1024 * 1024
      });
      
      this.parseTypeErrors(output);
    } catch (error) {
      if (error.stdout) {
        this.parseTypeErrors(error.stdout);
      }
    }
    
    console.log(`Found ${this.errorMap.size} files with type errors\n`);
  }

  parseTypeErrors(output) {
    const lines = output.split('\n');
    
    for (const line of lines) {
      // Parameter implicitly has 'any' type
      const paramMatch = line.match(/(.+\.tsx?)\((\d+),(\d+)\): error TS7006: Parameter '([^']+)' implicitly has an 'any' type/);
      if (paramMatch) {
        const [_, file, lineNum, colNum, param] = paramMatch;
        if (!this.errorMap.has(file)) {
          this.errorMap.set(file, []);
        }
        this.errorMap.get(file).push({
          type: 'implicit-any-param',
          line: parseInt(lineNum),
          column: parseInt(colNum),
          identifier: param
        });
      }
      
      // Binding element implicitly has 'any' type
      const bindingMatch = line.match(/(.+\.tsx?)\((\d+),(\d+)\): error TS7031: Binding element '([^']+)' implicitly has an 'any' type/);
      if (bindingMatch) {
        const [_, file, lineNum, colNum, element] = bindingMatch;
        if (!this.errorMap.has(file)) {
          this.errorMap.set(file, []);
        }
        this.errorMap.get(file).push({
          type: 'implicit-any-binding',
          line: parseInt(lineNum),
          column: parseInt(colNum),
          identifier: element
        });
      }
      
      // Property does not exist
      const propMatch = line.match(/(.+\.tsx?)\((\d+),(\d+)\): error TS2339: Property '([^']+)' does not exist on type/);
      if (propMatch) {
        const [_, file, lineNum, colNum, prop] = propMatch;
        if (!this.errorMap.has(file)) {
          this.errorMap.set(file, []);
        }
        this.errorMap.get(file).push({
          type: 'missing-property',
          line: parseInt(lineNum),
          column: parseInt(colNum),
          identifier: prop
        });
      }
    }
  }

  async processFiles() {
    for (const [filePath, errors] of this.errorMap) {
      this.totalFiles++;
      
      try {
        let content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        let modified = false;
        
        // Sort errors by line number in reverse to avoid offset issues
        const sortedErrors = errors.sort((a, b) => b.line - a.line);
        
        for (const error of sortedErrors) {
          if (error.type === 'implicit-any-param' || error.type === 'implicit-any-binding') {
            const result = this.addTypeAnnotation(lines, error);
            if (result.modified) {
              modified = true;
              this.totalTypesAdded++;
            }
          }
        }
        
        if (modified) {
          fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
          this.fixedFiles++;
          console.log(`✓ Added types to: ${path.relative(process.cwd(), filePath)}`);
        }
      } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
      }
    }
  }

  addTypeAnnotation(lines, error) {
    const lineIndex = error.line - 1;
    if (lineIndex < 0 || lineIndex >= lines.length) {
      return { modified: false };
    }
    
    let line = lines[lineIndex];
    const identifier = error.identifier;
    
    // Check if type already exists
    if (line.includes(`${identifier}:`) || line.includes(`${identifier} :`)) {
      return { modified: false };
    }
    
    // Try to infer type from pattern
    let typeAnnotation = ': any';
    
    // Check common patterns
    if (TYPE_PATTERNS[identifier]) {
      typeAnnotation = TYPE_PATTERNS[identifier];
    } else {
      // Try to infer from context
      typeAnnotation = this.inferType(line, identifier);
    }
    
    // Add type annotation
    const patterns = [
      // Function parameters
      { regex: new RegExp(`(\\(.*?)(${identifier})(.*?\\))`), replacement: `$1${identifier}${typeAnnotation}$3` },
      // Destructured parameters
      { regex: new RegExp(`({.*?)(${identifier})(.*?})`), replacement: `$1${identifier}${typeAnnotation}$3` },
      // Arrow function parameters
      { regex: new RegExp(`(\\()(${identifier})(\\)\\s*=>)`), replacement: `$1${identifier}${typeAnnotation}$3` },
      // Variable declarations
      { regex: new RegExp(`(const|let|var)\\s+(${identifier})\\s*=`), replacement: `$1 ${identifier}${typeAnnotation} =` }
    ];
    
    for (const pattern of patterns) {
      if (pattern.regex.test(line)) {
        lines[lineIndex] = line.replace(pattern.regex, pattern.replacement);
        return { modified: true };
      }
    }
    
    return { modified: false };
  }

  inferType(line, identifier) {
    // Check for setState pattern
    if (identifier.startsWith('set') && identifier[3] === identifier[3].toUpperCase()) {
      return ': Dispatch<SetStateAction<any>>';
    }
    
    // Check for event handlers
    if (identifier.startsWith('handle') || identifier.startsWith('on')) {
      if (line.includes('onClick')) return ': (e: MouseEvent) => void';
      if (line.includes('onChange')) return ': (e: ChangeEvent<HTMLInputElement>) => void';
      if (line.includes('onSubmit')) return ': (e: FormEvent) => void';
      return ': (e: any) => void';
    }
    
    // Check for boolean flags
    if (identifier.startsWith('is') || identifier.startsWith('has') || identifier.startsWith('should')) {
      return ': boolean';
    }
    
    // Check for arrays
    if (identifier.endsWith('s') || identifier.endsWith('List') || identifier.endsWith('Array')) {
      return ': any[]';
    }
    
    // Check for numbers
    if (identifier.includes('count') || identifier.includes('index') || identifier.includes('size')) {
      return ': number';
    }
    
    // Default to any
    return ': any';
  }

  async generateInterfaces() {
    console.log('\nGenerating missing interfaces...');
    
    const interfaces = new Map();
    
    // Collect common patterns
    for (const [filePath, errors] of this.errorMap) {
      for (const error of errors) {
        if (error.type === 'missing-property') {
          // Track properties that need interfaces
          const content = fs.readFileSync(filePath, 'utf8');
          const lines = content.split('\n');
          const line = lines[error.line - 1] || '';
          
          // Extract type name
          const typeMatch = line.match(/type\s+'([^']+)'/);
          if (typeMatch) {
            const typeName = typeMatch[1];
            if (!interfaces.has(typeName)) {
              interfaces.set(typeName, new Set());
            }
            interfaces.get(typeName).add(error.identifier);
          }
        }
      }
    }
    
    // Generate interface file
    if (interfaces.size > 0) {
      let interfaceContent = '// Auto-generated interfaces by MCAS Type Safety Agent\n\n';
      
      for (const [typeName, properties] of interfaces) {
        interfaceContent += `export interface ${typeName} {\n`;
        for (const prop of properties) {
          const propType = TYPE_PATTERNS[prop] ? TYPE_PATTERNS[prop].replace(':', '').trim() : 'any';
          interfaceContent += `  ${prop}: ${propType};\n`;
        }
        interfaceContent += '}\n\n';
      }
      
      const interfacePath = path.join(process.cwd(), 'src', 'types', 'generated.ts');
      fs.mkdirSync(path.dirname(interfacePath), { recursive: true });
      fs.writeFileSync(interfacePath, interfaceContent);
      console.log(`✓ Generated interfaces in: src/types/generated.ts`);
    }
  }

  report() {
    console.log('\n📊 Type Safety Report:');
    console.log(`- Files analyzed: ${this.totalFiles}`);
    console.log(`- Files fixed: ${this.fixedFiles}`);
    console.log(`- Type annotations added: ${this.totalTypesAdded}`);
    
    const report = {
      timestamp: new Date().toISOString(),
      filesAnalyzed: this.totalFiles,
      filesFixed: this.fixedFiles,
      typesAdded: this.totalTypesAdded,
      remainingErrors: Array.from(this.errorMap.entries()).map(([file, errors]) => ({
        file: path.relative(process.cwd(), file),
        errorCount: errors.length,
        errors: errors
      }))
    };
    
    fs.writeFileSync(
      path.join(__dirname, 'type-safety-report.json'),
      JSON.stringify(report, null, 2)
    );
    
    console.log('\n✅ Type safety improvements complete!');
    console.log('📄 Report saved to: .mcas-cleanup/type-safety-report.json');
  }
}

// Run the agent
const agent = new TypeSafetyAgent();
agent.run().catch(console.error);