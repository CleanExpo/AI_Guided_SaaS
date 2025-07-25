#!/usr/bin/env tsx
import * as fs from 'fs/promises';
import * as path from 'path';
import chalk from 'chalk';

async function initializeEvaluationFramework() {
  console.log(chalk.blue.bold('\n🚀 Initializing Senior Product Developer AI Evaluation Framework\n'));

  // Create necessary directories
  const directories = [
    'tests',
    'scripts',
    'evaluation-results',
    'docs/evaluation'
  ];

  for (const dir of directories) {
    try {
      await fs.mkdir(dir, { recursive: true });
      console.log(chalk.green(`✓ Created directory: ${dir}`));
    } catch (error) {
      console.log(chalk.yellow(`⚠ Directory already exists: ${dir}`));
    }
  }

  // Create playwright.config.ts if it doesn't exist
  const playwrightConfigPath = path.join(process.cwd(), 'playwright.config.ts');
  const playwrightConfig = `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'evaluation-results/html-report' }],
    ['json', { outputFile: 'evaluation-results/test-results.json' }],
    ['list']
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
`;

  try {
    await fs.access(playwrightConfigPath);
    console.log(chalk.yellow('⚠ playwright.config.ts already exists'));
  } catch {
    await fs.writeFile(playwrightConfigPath, playwrightConfig);
    console.log(chalk.green('✓ Created playwright.config.ts'));
  }

  // Create evaluation config
  const evalConfigPath = path.join(process.cwd(), 'evaluation-config.js');
  const evalConfig = `module.exports = {
  dashboard: {
    functionality: {
      weight: 3,
      criteria: [
        'Metrics display correctly',
        'Refresh button works',
        'Data updates in real-time',
        'Filter dropdown functions properly',
        'Loading states work correctly'
      ]
    },
    usability: {
      weight: 2.5,
      criteria: [
        'Intuitive navigation',
        'Clear visual hierarchy',
        'Responsive design',
        'Accessible controls',
        'Helpful error messages'
      ]
    },
    performance: {
      weight: 2,
      criteria: [
        'Page loads in < 2s',
        'Smooth animations',
        'No layout shifts',
        'Efficient data loading',
        'Optimized bundle size'
      ]
    },
    design: {
      weight: 2,
      criteria: [
        'Consistent styling',
        'Professional appearance',
        'Proper spacing',
        'Color contrast',
        'Typography hierarchy'
      ]
    },
    testing: {
      weight: 0.5,
      criteria: [
        'Test selectors present',
        'Error boundaries',
        'Edge case handling',
        'Cross-browser compatibility'
      ]
    }
  },
  prompts: {
    functionality: {
      weight: 3,
      criteria: [
        'Create prompt button works',
        'Title and content fields function',
        'Search functionality works',
        'Prompt saving works correctly',
        'Prompt deletion works'
      ]
    },
    usability: {
      weight: 2.5,
      criteria: [
        'Clear form structure',
        'Intuitive workflow',
        'Search is responsive',
        'Validation messages clear',
        'Keyboard navigation works'
      ]
    },
    performance: {
      weight: 2,
      criteria: [
        'Fast form interactions',
        'Quick search results',
        'Efficient data handling',
        'No input lag',
        'Smooth transitions'
      ]
    },
    design: {
      weight: 2,
      criteria: [
        'Clean form layout',
        'Consistent button styles',
        'Proper field spacing',
        'Visual feedback on actions',
        'Mobile-responsive design'
      ]
    },
    testing: {
      weight: 0.5,
      criteria: [
        'Form validation works',
        'Error states handled',
        'Success feedback shown',
        'Data persistence checked'
      ]
    }
  },
  folders: {
    functionality: {
      weight: 3,
      criteria: [
        'Create folder button works',
        'Folder items display correctly',
        'Drag and drop functions',
        'Drop zones work properly',
        'Folder nesting works'
      ]
    },
    usability: {
      weight: 2.5,
      criteria: [
        'Clear drag indicators',
        'Visual drop feedback',
        'Intuitive organization',
        'Undo/redo capability',
        'Context menus work'
      ]
    },
    performance: {
      weight: 2,
      criteria: [
        'Smooth drag animations',
        'Fast folder operations',
        'No lag with many items',
        'Efficient re-rendering',
        'Quick state updates'
      ]
    },
    design: {
      weight: 2,
      criteria: [
        'Clear folder hierarchy',
        'Visual nesting indicators',
        'Consistent icons',
        'Proper hover states',
        'Clean drag preview'
      ]
    },
    testing: {
      weight: 0.5,
      criteria: [
        'Drag constraints work',
        'Invalid drops prevented',
        'State consistency maintained',
        'Edge cases handled'
      ]
    }
  }
};
`;

  await fs.writeFile(evalConfigPath, evalConfig);
  console.log(chalk.green('✓ Created evaluation-config.js'));

  // Check if test selectors documentation exists
  const selectorsDocPath = path.join(process.cwd(), 'docs/evaluation/test-selectors.md');
  const selectorsDoc = `# Test Selectors Reference

## Dashboard Page
\`\`\`html
<div data-testid="dashboard-metrics"><!-- metrics content --></div>
<button data-testid="refresh-button">Refresh</button>
<div data-testid="loading-spinner">Loading...</div>
<select data-testid="filter-dropdown"><!-- options --></select>
\`\`\`

## Prompts Page
\`\`\`html
<button data-testid="create-prompt-button">Create Prompt</button>
<input data-testid="prompt-title" placeholder="Prompt title">
<textarea data-testid="prompt-content">Prompt content</textarea>
<input data-testid="search-input" placeholder="Search prompts">
\`\`\`

## Folders Page
\`\`\`html
<button data-testid="create-folder-button">Create Folder</button>
<div data-testid="folder-item">Folder Item</div>
<div data-testid="draggable-item">Draggable Item</div>
<div data-testid="folder-drop-zone">Drop Zone</div>
\`\`\`

## Implementation Guide
Add these test selectors to your React components:

\`\`\`tsx
// Dashboard Component
<div data-testid="dashboard-metrics">
  {/* Your metrics content */}
</div>

// Prompts Component
<button data-testid="create-prompt-button" onClick={handleCreatePrompt}>
  Create Prompt
</button>

// Folders Component
<div 
  data-testid="folder-item" 
  draggable
  onDragStart={handleDragStart}
>
  {folderName}
</div>
\`\`\`
`;

  await fs.writeFile(selectorsDocPath, selectorsDoc);
  console.log(chalk.green('✓ Created test selectors documentation'));

  console.log(chalk.green.bold('\n✅ Evaluation framework initialized successfully!\n'));
  console.log(chalk.cyan('Next steps:'));
  console.log(chalk.white('1. Ensure your components have the required test selectors'));
  console.log(chalk.white('2. Run npm run eval:run to perform your first evaluation'));
  console.log(chalk.white('3. Check evaluation-results/ for detailed reports\n'));
}

initializeEvaluationFramework().catch(console.error);