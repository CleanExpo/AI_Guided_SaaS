#\!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Final Syntax Fix - Targeting specific remaining errors...\n');

const fixes = [
    {
        file: 'src/components/AgentPulseMonitor.tsx',
        line: 123,
        fix: (content) => {
            // Fix missing closing tag on Progress component
            return content.replace(
                /className=\{pulse\.resources\.memoryUsage\s*>\s*pulse\.config\.maxMemoryUsage\s*\?\s*'bg-red-100'\s*:\s*''\}\/>/g,
                "className={pulse.resources.memoryUsage > pulse.config.maxMemoryUsage ? 'bg-red-100' : ''} />"
            );
        }
    },
    {
        file: 'src/components/Dashboard.tsx',
        line: 121,
        fix: (content) => {
            // Fix Badge with children on separate line
            return content.replace(
                /variant=\{project\.status === 'active' \? 'default' : 'secondary'\}\s*>\s*\n/g,
                "variant={project.status === 'active' ? 'default' : 'secondary'}>\n"
            );
        }
    },
    {
        file: 'src/components/LandingPageProduction.tsx',
        line: 62,
        fix: (content) => {
            // Fix Badge self-closing with text
            return content.replace(
                /<Badge className="bg-orange-100 text-orange-700">🚀 Trusted by 10,000\+ developers\/>/g,
                '<Badge className="bg-orange-100 text-orange-700">🚀 Trusted by 10,000+ developers</Badge>'
            );
        }
    },
    {
        file: 'src/components/admin/AdminAnalytics.tsx',
        line: 121,
        fix: (content) => {
            // Fix div with style prop
            return content.replace(
                /style=\{\{ height: `\$\{[^}]+\}%` \}\/>/g,
                (match) => match.replace('/>', '} />')
            );
        }
    },
    {
        file: 'src/app/blog/[id]/page.tsx',
        line: 152,
        fix: (content) => {
            // Fix dangerouslySetInnerHTML
            return content.replace(
                /<div dangerouslySetInnerHTML=\{\{ __html: [^}]+ \}\/>/g,
                (match) => match.replace('/>', '} />')
            );
        }
    }
];

async function fixFile(filePath, fixFunction) {
    try {
        const fullPath = path.join(process.cwd(), filePath);
        let content = fs.readFileSync(fullPath, 'utf8');
        const originalContent = content;
        
        content = fixFunction(content);
        
        if (content \!== originalContent) {
            fs.writeFileSync(fullPath, content, 'utf8');
            console.log(`✅ Fixed ${filePath}`);
            return true;
        }
        
        console.log(`⚠️  No changes needed for ${filePath}`);
        return false;
    } catch (error) {
        console.error(`❌ Error fixing ${filePath}: ${error.message}`);
        return false;
    }
}

async function main() {
    console.log('Applying targeted fixes...\n');
    
    let fixedCount = 0;
    
    for (const { file, fix } of fixes) {
        if (await fixFile(file, fix)) {
            fixedCount++;
        }
    }
    
    console.log(`\n✨ Fixed ${fixedCount} files`);
    console.log('\nRun npm run build to verify all syntax errors are resolved.');
}

main().catch(console.error);
EOF < /dev/null
