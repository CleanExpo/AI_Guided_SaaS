#!/usr/bin/env tsx

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';

const execAsync = promisify(exec);

interface BundleInfo {
  name: string;
  size: number;
  gzipSize: number;
}

async function analyzeBundle() {
  console.log(chalk.blue('🔍 Analyzing bundle size...\n'));

  try {
    // Build with analysis
    console.log('Building with bundle analysis...');
    await execAsync('cross-env ANALYZE=true npm run build', {
      maxBuffer: 1024 * 1024 * 10
    });

    // Read build output
    const buildManifest = await fs.readFile(
      path.join(process.cwd(), '.next/build-manifest.json'),
      'utf-8'
    );

    const manifest = JSON.parse(buildManifest);
    
    // Analyze chunks
    const chunks: BundleInfo[] = [];
    const statsPath = path.join(process.cwd(), '.next/analyze');
    
    if (await fileExists(statsPath)) {
      const stats = await fs.readFile(
        path.join(statsPath, 'client.html'),
        'utf-8'
      );
      console.log(chalk.green('✅ Bundle analysis complete!'));
      console.log(`View detailed report at: ${path.join(statsPath, 'client.html')}`);
    }

    // Get page sizes
    console.log(chalk.blue('\n📊 Page Bundle Sizes:\n'));
    
    const pagesDir = path.join(process.cwd(), '.next/static/chunks/pages');
    const pages = await fs.readdir(pagesDir);
    
    for (const page of pages) {
      if (page.endsWith('.js')) {
        const stats = await fs.stat(path.join(pagesDir, page));
        const size = stats.size;
        const pageName = page.replace('.js', '').replace(/-[a-f0-9]+$/, '');
        
        console.log(`  ${pageName}: ${formatBytes(size)}`);
      }
    }

    // Optimization suggestions
    console.log(chalk.yellow('\n💡 Optimization Suggestions:\n'));
    
    const suggestions = await generateOptimizationSuggestions();
    suggestions.forEach(s => console.log(`  • ${s}`));

  } catch (error) {
    console.error(chalk.red('Error analyzing bundle:'), error);
  }
}

async function generateOptimizationSuggestions(): Promise<string[]> {
  const suggestions: string[] = [];
  
  // Check for large dependencies
  const packageJson = JSON.parse(
    await fs.readFile('package.json', 'utf-8')
  );
  
  const largeDeps = {
    'moment': 'Use date-fns or dayjs instead',
    'lodash': 'Use lodash-es and import specific functions',
    '@mui/material': 'Consider using modular imports',
    'react-icons': 'Use lucide-react for smaller bundle',
  };
  
  for (const [dep, suggestion] of Object.entries(largeDeps)) {
    if (packageJson.dependencies[dep]) {
      suggestions.push(`${dep}: ${suggestion}`);
    }
  }

  // Check for dynamic imports opportunities
  const srcFiles = await getAllFiles('src');
  let dynamicImportCount = 0;
  
  for (const file of srcFiles) {
    if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const content = await fs.readFile(file, 'utf-8');
      if (content.includes('import(')) {
        dynamicImportCount++;
      }
    }
  }
  
  if (dynamicImportCount < 5) {
    suggestions.push('Consider using more dynamic imports for code splitting');
  }

  // Check image optimization
  const hasUnoptimizedImages = srcFiles.some(f => 
    f.match(/\.(png|jpg|jpeg)$/) && !f.includes('public')
  );
  
  if (hasUnoptimizedImages) {
    suggestions.push('Convert images to WebP format for better compression');
  }

  // Check for unused dependencies
  suggestions.push('Run "npm run clean:deps" to remove unused dependencies');

  return suggestions;
}

async function optimizeImages() {
  console.log(chalk.blue('\n🖼️  Optimizing images...\n'));
  
  const publicDir = path.join(process.cwd(), 'public');
  const images = await getAllFiles(publicDir, /\.(png|jpg|jpeg)$/);
  
  for (const image of images) {
    const size = (await fs.stat(image)).size;
    console.log(`  ${path.basename(image)}: ${formatBytes(size)}`);
  }
  
  console.log(chalk.yellow('\n  Consider using next/image for automatic optimization'));
}

async function implementCodeSplitting() {
  console.log(chalk.blue('\n✂️  Implementing code splitting...\n'));

  const componentsToSplit = [
    'src/components/editor/AdvancedCodeEditor.tsx',
    'src/components/marketplace/MarketplaceHome.tsx',
    'src/components/analytics/AnalyticsDashboard.tsx',
  ];

  for (const component of componentsToSplit) {
    if (await fileExists(component)) {
      console.log(`  ✅ ${path.basename(component)} - Ready for dynamic import`);
    }
  }

  console.log(chalk.yellow('\n  Update imports to use dynamic() for these components'));
}

async function getAllFiles(dir: string, pattern?: RegExp): Promise<string[]> {
  const files: string[] = [];
  
  async function walk(currentDir: string) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        await walk(fullPath);
      } else if (entry.isFile()) {
        if (!pattern || pattern.test(entry.name)) {
          files.push(fullPath);
        }
      }
    }
  }
  
  await walk(dir);
  return files;
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function main() {
  console.log(chalk.cyan(`
╔════════════════════════════════════════════╗
║        🚀 BUNDLE OPTIMIZATION TOOL 🚀       ║
╚════════════════════════════════════════════╝
`));

  await analyzeBundle();
  await optimizeImages();
  await implementCodeSplitting();

  console.log(chalk.green('\n✨ Optimization analysis complete!\n'));
}

// Run the script
main().catch(console.error);