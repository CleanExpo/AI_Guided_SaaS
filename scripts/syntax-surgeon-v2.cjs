#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

console.log('🔬 Syntax Surgeon v2 - Fixing complex JSX patterns...\n');

// Enhanced patterns for JSX issues
const syntaxPatterns = [
    // Fix self-closing tags with props spread
    {
        pattern: /\{\.\.\.(\w+)\/>/g,
        replacement: '{...$1} />',
        description: 'Fix prop spread in self-closing tags'
    },
    // Fix style objects with missing closing brace
    {
        pattern: /style=\{\{([^}]+)\}\/>/g,
        replacement: 'style={{$1}} />',
        description: 'Fix style objects in self-closing tags'
    },
    // Fix className with ternary missing closing
    {
        pattern: /className=\{([^}]+)\}\/>/g,
        replacement: 'className={$1} />',
        description: 'Fix className in self-closing tags'
    },
    // Fix onChange handlers
    {
        pattern: /onChange=\{([^}]+)\}<\/Input>/g,
        replacement: 'onChange={$1} />',
        description: 'Fix onChange handlers'
    },
    // Generic prop fixes
    {
        pattern: /(\w+)=\{([^}]+)\}\/>/g,
        replacement: '$1={$2} />',
        description: 'Fix generic props in self-closing tags'
    },
    // Fix components ending with </ComponentName>
    {
        pattern: /<\/(\w+)>$/gm,
        replacement: (match, component) => {
            // Only replace if it looks like it should be self-closing
            if (['Input', 'Progress', 'Badge'].includes(component)) {
                return '/>';
            }
            return match;
        },
        description: 'Fix incorrect closing tags'
    },
    // Fix double closing brackets
    {
        pattern: /\}\}\/>/g,
        replacement: '}} />',
        description: 'Fix double closing brackets'
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
                if (typeof replacement === 'function') {
                    content = content.replace(pattern, replacement);
                } else {
                    content = content.replace(pattern, replacement);
                }
                fixCount += matches.length;
                console.log(`  ✓ ${description}: ${matches.length} fixes`);
            }
        });

        // Special handling for specific known issues
        if (filePath.includes('AgentPulseMonitor.tsx')) {
            content = content.replace(
                /className=\{pulse\.resources\.\w+\s*>\s*pulse\.config\.\w+\s*\?\s*'bg-red-100'\s*:\s*''\}\/>/g,
                (match) => match.replace('/>', '} />')
            );
        }

        if (filePath.includes('LandingPageProduction.tsx')) {
            content = content.replace(
                /onChange=\{\(e\)\s*=>\s*setAppIdea\(e\.target\.value\)\}<\/Input>/g,
                'onChange={(e) => setAppIdea(e.target.value)} />'
            );
        }

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
    // Target files with known issues
    const targetFiles = [
        'src/components/AgentPulseMonitor.tsx',
        'src/components/LandingPageProduction.tsx',
        'src/components/admin/AdminAnalytics.tsx',
        'src/components/ui/badge.tsx',
        'src/components/ui/button.tsx',
        'src/components/ui/card.tsx',
        'src/components/ui/separator.tsx',
        'src/components/ui/input.tsx',
        'src/components/ui/**/*.tsx',
        'src/components/**/*.tsx'
    ];

    let totalFixes = 0;
    
    for (const pattern of targetFiles) {
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
    console.log('2. Check for any remaining errors');
    console.log('3. Fix complex cases manually if needed');
}

// Run the surgeon
main().catch(console.error);