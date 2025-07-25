#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

console.log('🔬 Syntax Surgeon - Fixing ONLY syntax errors...\n');

// Common syntax corruption patterns found in the codebase
const syntaxPatterns = [
    // Object literal fixes
    { 
        pattern: /:\s*([^,}\n]+);(?=\s*[}\n])/g, 
        replacement: ': $1',
        description: 'Fix semicolons in object literals'
    },
    {
        pattern: /,\s*;/g,
        replacement: ',',
        description: 'Remove semicolons after commas'
    },
    // Function parameter fixes
    {
        pattern: /\(\s*;/g,
        replacement: '(',
        description: 'Remove semicolons at start of parameters'
    },
    {
        pattern: /;\s*\)/g,
        replacement: ')',
        description: 'Remove semicolons at end of parameters'
    },
    // JSX fixes
    {
        pattern: /}\s*\/>/g,
        replacement: '/>',
        description: 'Fix JSX self-closing tags'
    },
    {
        pattern: /<\/(\w+){>/g,
        replacement: '</$1>',
        description: 'Fix JSX closing tags'
    },
    // Arrow function fixes
    {
        pattern: /\)\s*;\s*=>/g,
        replacement: ') =>',
        description: 'Fix arrow functions'
    },
    // Array literal fixes
    {
        pattern: /\[\s*;/g,
        replacement: '[',
        description: 'Fix array starts'
    },
    // Property assignment fixes
    {
        pattern: /(\w+)\s*;\s*:/g,
        replacement: '$1:',
        description: 'Fix property assignments'
    }
];

async function fixFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;
        let fixCount = 0;

        // Apply each pattern
        syntaxPatterns.forEach(({ pattern, replacement, description }) => {
            const matches = content.match(pattern);
            if (matches) {
                content = content.replace(pattern, replacement);
                fixCount += matches.length;
                console.log(`  ✓ ${description}: ${matches.length} fixes`);
            }
        });

        // Only write if changes were made
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Fixed ${filePath} (${fixCount} syntax errors)\n`);
            return fixCount;
        }
        
        return 0;
    } catch (error) {
        console.error(`❌ Error processing ${filePath}: ${error.message}`);
        return 0;
    }
}

async function main() {
    // Priority files to fix first
    const priorityFiles = [
        'src/components/Dashboard.tsx',
        'src/app/**/*.tsx',
        'src/app/**/*.ts',
        'src/components/**/*.tsx',
        'src/components/**/*.ts'
    ];

    let totalFixes = 0;
    
    for (const pattern of priorityFiles) {
        const files = await glob(pattern, { 
            ignore: ['**/node_modules/**', '**/dist/**', '**/.next/**'],
            absolute: true 
        });
        
        console.log(`\nProcessing ${files.length} files matching ${pattern}...`);
        
        for (const file of files) {
            const fixes = await fixFile(file);
            totalFixes += fixes;
        }
    }

    console.log(`\n🎯 Total syntax fixes applied: ${totalFixes}`);
    console.log('\n📋 Next steps:');
    console.log('1. Run: npm run build');
    console.log('2. Check remaining errors');
    console.log('3. Fix any complex syntax issues manually');
    console.log('4. Only then address TypeScript type errors');
}

// Run the surgeon
main().catch(console.error);