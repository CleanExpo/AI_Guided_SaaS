import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🍞 Generating retroactive breadcrumbs for all files...\n');

// Load extracted vision
const vision = JSON.parse(fs.readFileSync('extracted-vision.json', 'utf8'));

// File pattern mappings to purposes
const filePatterns = {
  // UI Components
  'src/components/auth/**/*': { category: 'auth.ui', purpose: 'Authentication user interface' },
  'src/components/admin/**/*': { category: 'admin.dashboard', purpose: 'Admin panel and monitoring' },
  'src/components/ui/**/*': { category: 'design.system', purpose: 'Reusable UI components' },
  'src/components/builder/**/*': { category: 'builder.ui', purpose: 'No-code/pro-code builders' },
  'src/components/dashboard/**/*': { category: 'dashboard.ui', purpose: 'User dashboards' },
  'src/components/health/**/*': { category: 'health.monitoring', purpose: 'System health visualization' },
  
  // Core Features
  'src/components/*ProjectBuilder*': { category: 'lovable.style', purpose: 'Guided project creation (Lovable.dev style)' },
  'src/components/*CodeEditor*': { category: 'vscode.style', purpose: 'Advanced code editing (VS Code style)' },
  'src/components/*AI*': { category: 'ai.integration', purpose: 'AI chat and assistance features' },
  'src/components/*Mock*': { category: 'mock.data', purpose: 'Mock data generation system' },
  
  // Backend/Libraries
  'src/lib/agents/**/*': { category: 'agent.orchestration', purpose: 'Multi-agent system coordination' },
  'src/lib/ai/**/*': { category: 'ai.services', purpose: 'AI provider integrations' },
  'src/lib/auth*': { category: 'auth.backend', purpose: 'Authentication and authorization' },
  'src/lib/database*': { category: 'data.layer', purpose: 'Database connections and queries' },
  'src/lib/breadcrumb/**/*': { category: 'breadcrumb.system', purpose: 'File purpose tracking' },
  'src/lib/mcp/**/*': { category: 'mcp.integration', purpose: 'Model Context Protocol' },
  
  // API Routes
  'src/app/api/auth/**/*': { category: 'api.auth', purpose: 'Authentication endpoints' },
  'src/app/api/admin/**/*': { category: 'api.admin', purpose: 'Admin management endpoints' },
  'src/app/api/agents/**/*': { category: 'api.agents', purpose: 'Agent control endpoints' },
  'src/app/api/ai/**/*': { category: 'api.ai', purpose: 'AI service endpoints' },
  
  // Pages
  'src/app/**/page.tsx': { category: 'pages', purpose: 'Application pages and routes' },
  'src/app/**/layout.tsx': { category: 'layouts', purpose: 'Page layout components' },
  
  // Configuration
  '*.config.*': { category: 'config', purpose: 'Configuration files' },
  'scripts/**/*': { category: 'scripts', purpose: 'Build and utility scripts' },
  'docker/**/*': { category: 'docker', purpose: 'Container configurations' }
};

// Helper to determine file purpose
function determinePurpose(filePath) {
  // Check each pattern
  for (const [pattern, info] of Object.entries(filePatterns)) {
    if (minimatch(filePath, pattern)) {
      return info;
    }
  }
  
  // Default based on file location
  if (filePath.includes('/components/')) return { category: 'ui.component', purpose: 'User interface component' };
  if (filePath.includes('/lib/')) return { category: 'library', purpose: 'Shared library code' };
  if (filePath.includes('/api/')) return { category: 'api', purpose: 'API endpoint' };
  if (filePath.includes('/app/')) return { category: 'app', purpose: 'Application page or route' };
  
  return { category: 'unknown', purpose: 'Purpose to be determined' };
}

// Simple minimatch implementation
function minimatch(path, pattern) {
  const regexPattern = pattern
    .replace(/\*\*/g, '.*')
    .replace(/\*/g, '[^/]*')
    .replace(/\?/g, '.');
  return new RegExp(`^${regexPattern}$`).test(path);
}

// Extract component name from file path
function extractComponentName(filePath) {
  const fileName = path.basename(filePath, path.extname(filePath));
  return fileName.replace(/([A-Z])/g, ' $1').trim();
}

// Main breadcrumb generation
async function generateBreadcrumbs() {
  const breadcrumbs = {};
  const stats = {
    total: 0,
    categorized: 0,
    unknown: 0
  };

  // Find all source files
  const files = await glob('src/**/*.{ts,tsx,js,jsx}', { 
    cwd: path.join(__dirname, '..'),
    ignore: ['**/node_modules/**', '**/.next/**']
  });

  console.log(`📂 Found ${files.length} source files to process\n`);

  // Process each file
  for (const file of files) {
    const normalizedPath = file.replace(/\\/g, '/');
    const { category, purpose } = determinePurpose(normalizedPath);
    const componentName = extractComponentName(normalizedPath);
    
    breadcrumbs[normalizedPath] = {
      purpose,
      category,
      componentName,
      linkedGoals: linkToGoals(category, normalizedPath),
      createdBy: 'MCAS-Rescue',
      timestamp: new Date().toISOString(),
      confidence: category === 'unknown' ? 0.3 : 0.8,
      needsReview: category === 'unknown'
    };
    
    stats.total++;
    if (category === 'unknown') {
      stats.unknown++;
    } else {
      stats.categorized++;
    }
  }

  // Create breadcrumbs directory
  const breadcrumbDir = path.join(__dirname, '..', 'breadcrumbs');
  if (!fs.existsSync(breadcrumbDir)) {
    fs.mkdirSync(breadcrumbDir, { recursive: true });
  }

  // Save breadcrumbs
  fs.writeFileSync(
    path.join(breadcrumbDir, 'rescue-manifest.json'),
    JSON.stringify(breadcrumbs, null, 2)
  );

  // Generate category summary
  const categorySummary = {};
  Object.values(breadcrumbs).forEach(b => {
    categorySummary[b.category] = (categorySummary[b.category] || 0) + 1;
  });

  fs.writeFileSync(
    path.join(breadcrumbDir, 'category-summary.json'),
    JSON.stringify(categorySummary, null, 2)
  );

  console.log('✅ Breadcrumb generation complete!\n');
  console.log('📊 Generation Summary:');
  console.log(`   Total Files: ${stats.total}`);
  console.log(`   Categorized: ${stats.categorized} (${Math.round(stats.categorized/stats.total*100)}%)`);
  console.log(`   Unknown: ${stats.unknown} (${Math.round(stats.unknown/stats.total*100)}%)`);
  console.log('\n📂 Category Distribution:');
  
  Object.entries(categorySummary)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([category, count]) => {
      console.log(`   ${category}: ${count} files`);
    });

  return breadcrumbs;
}

// Link breadcrumbs to project goals
function linkToGoals(category, filePath) {
  const goalMappings = {
    'auth.ui': ['Enable user authentication'],
    'auth.backend': ['Enable user authentication'],
    'lovable.style': ['Provide guided interface for non-technical users'],
    'vscode.style': ['Provide advanced interface for developers'],
    'ai.integration': ['Integrate AI capabilities'],
    'ai.services': ['Integrate AI capabilities'],
    'mock.data': ['Support rapid prototyping'],
    'agent.orchestration': ['Enable autonomous development'],
    'admin.dashboard': ['Monitor and manage platform'],
    'design.system': ['Consistent user experience']
  };
  
  return goalMappings[category] || ['Support platform functionality'];
}

// Run generation
generateBreadcrumbs().catch(console.error);