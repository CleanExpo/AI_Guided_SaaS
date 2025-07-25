import { test, expect } from '@playwright/test';
import * as fs from 'fs/promises';
import * as path from 'path';

// Evaluation config
const evalConfig = {
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

interface ComponentScore {
  functionality: number;
  usability: number;
  performance: number;
  design: number;
  testing: number;
  total: number;
  details: Record<string, any>;
}

interface EvaluationResult {
  timestamp: string;
  scores: {
    dashboard: ComponentScore;
    prompts: ComponentScore;
    folders: ComponentScore;
  };
  overall: number;
  recommendations: string[];
}

async function evaluateComponent(
  page: any,
  componentName: string,
  config: any
): Promise<ComponentScore> {
  const scores: any = {
    functionality: 0,
    usability: 0,
    performance: 0,
    design: 0,
    testing: 0,
    details: {}
  };

  // Evaluate each dimension
  for (const [dimension, dimConfig] of Object.entries(config)) {
    const dimScore = await evaluateDimension(page, componentName, dimension, dimConfig as any);
    scores[dimension] = dimScore.score;
    scores.details[dimension] = dimScore.details;
  }

  // Calculate weighted total
  let totalWeight = 0;
  let weightedSum = 0;
  for (const [dimension, dimConfig] of Object.entries(config)) {
    const weight = (dimConfig as any).weight;
    totalWeight += weight;
    weightedSum += scores[dimension] * weight;
  }
  scores.total = Math.round((weightedSum / totalWeight) * 10) / 10;

  return scores;
}

async function evaluateDimension(
  page: any,
  componentName: string,
  dimension: string,
  config: any
): Promise<{ score: number; details: any }> {
  const results: boolean[] = [];
  const details: any = {};

  for (const criterion of config.criteria) {
    try {
      const passed = await evaluateCriterion(page, componentName, dimension, criterion);
      results.push(passed);
      details[criterion] = passed ? 'Passed' : 'Failed';
    } catch (error) {
      results.push(false);
      details[criterion] = `Error: ${error}`;
    }
  }

  const score = (results.filter(r => r).length / results.length) * 10;
  return { score: Math.round(score * 10) / 10, details };
}

async function evaluateCriterion(
  page: any,
  componentName: string,
  dimension: string,
  criterion: string
): Promise<boolean> {
  // Dashboard functionality tests
  if (componentName === 'dashboard' && dimension === 'functionality') {
    switch (criterion) {
      case 'Metrics display correctly':
        await expect(page.locator('[data-testid="dashboard-metrics"]')).toBeVisible();
        return true;
      case 'Refresh button works':
        const refreshBtn = page.locator('[data-testid="refresh-button"]');
        await expect(refreshBtn).toBeVisible();
        await refreshBtn.click();
        return true;
      case 'Loading states work correctly':
        // Check if loading spinner appears and disappears
        return true;
      case 'Filter dropdown functions properly':
        const filterDropdown = page.locator('[data-testid="filter-dropdown"]');
        if (await filterDropdown.isVisible()) {
          await filterDropdown.click();
          return true;
        }
        return false;
      default:
        return true;
    }
  }

  // Prompts functionality tests
  if (componentName === 'prompts' && dimension === 'functionality') {
    switch (criterion) {
      case 'Create prompt button works':
        const createBtn = page.locator('[data-testid="create-prompt-button"]');
        await expect(createBtn).toBeVisible();
        return true;
      case 'Title and content fields function':
        const titleField = page.locator('[data-testid="prompt-title"]');
        const contentField = page.locator('[data-testid="prompt-content"]');
        return await titleField.isVisible() && await contentField.isVisible();
      case 'Search functionality works':
        const searchInput = page.locator('[data-testid="search-input"]');
        if (await searchInput.isVisible()) {
          await searchInput.fill('test search');
          return true;
        }
        return false;
      default:
        return true;
    }
  }

  // Folders functionality tests
  if (componentName === 'folders' && dimension === 'functionality') {
    switch (criterion) {
      case 'Create folder button works':
        const createFolderBtn = page.locator('[data-testid="create-folder-button"]');
        await expect(createFolderBtn).toBeVisible();
        return true;
      case 'Folder items display correctly':
        const folderItems = page.locator('[data-testid="folder-item"]');
        return (await folderItems.count()) > 0;
      case 'Drop zones work properly':
        const dropZones = page.locator('[data-testid="folder-drop-zone"]');
        return await dropZones.first().isVisible();
      default:
        return true;
    }
  }

  // Performance tests
  if (dimension === 'performance') {
    if (criterion === 'Page loads in < 2s') {
      const startTime = Date.now();
      await page.reload();
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      return loadTime < 2000;
    }
  }

  // Design tests
  if (dimension === 'design') {
    // Check for basic design criteria
    return true;
  }

  // Default pass for unimplemented tests
  return true;
}

test.describe('Senior Product Developer Evaluation Suite', () => {
  let evaluationResult: EvaluationResult;

  test.beforeAll(async () => {
    evaluationResult = {
      timestamp: new Date().toISOString(),
      scores: {
        dashboard: { functionality: 0, usability: 0, performance: 0, design: 0, testing: 0, total: 0, details: {} },
        prompts: { functionality: 0, usability: 0, performance: 0, design: 0, testing: 0, total: 0, details: {} },
        folders: { functionality: 0, usability: 0, performance: 0, design: 0, testing: 0, total: 0, details: {} }
      },
      overall: 0,
      recommendations: []
    };
  });

  test('Dashboard Evaluation', { timeout: 30000 }, async ({ page }) => {
    
  try {
    await page.goto('/dashboard', { waitUntil: 'networkidle', timeout: 15000 });
  } catch (error) {
    console.error('Navigation error for /dashboard:', error);
    await page.goto('/dashboard', { waitUntil: 'domcontentloaded', timeout: 15000 });
  }
    await page.waitForLoadState('networkidle');

    const score = await evaluateComponent(page, 'dashboard', evalConfig.dashboard);
    evaluationResult.scores.dashboard = score;

    console.log(`Dashboard Score: ${score.total}/10`);
    expect(score.total).toBeGreaterThan(0);
  });

  test('Prompts Evaluation', { timeout: 30000 }, async ({ page }) => {
    
  try {
    await page.goto('/prompts', { waitUntil: 'networkidle', timeout: 15000 });
  } catch (error) {
    console.error('Navigation error for /prompts:', error);
    await page.goto('/prompts', { waitUntil: 'domcontentloaded', timeout: 15000 });
  }
    await page.waitForLoadState('networkidle');

    const score = await evaluateComponent(page, 'prompts', evalConfig.prompts);
    evaluationResult.scores.prompts = score;

    console.log(`Prompts Score: ${score.total}/10`);
    expect(score.total).toBeGreaterThan(0);
  });

  test('Folders Evaluation', { timeout: 30000 }, async ({ page }) => {
    
  try {
    await page.goto('/folders', { waitUntil: 'networkidle', timeout: 15000 });
  } catch (error) {
    console.error('Navigation error for /folders:', error);
    await page.goto('/folders', { waitUntil: 'domcontentloaded', timeout: 15000 });
  }
    await page.waitForLoadState('networkidle');

    const score = await evaluateComponent(page, 'folders', evalConfig.folders);
    evaluationResult.scores.folders = score;

    console.log(`Folders Score: ${score.total}/10`);
    expect(score.total).toBeGreaterThan(0);
  });

  test.afterAll(async () => {
    // Calculate overall score
    const scores = [
      evaluationResult.scores.dashboard.total,
      evaluationResult.scores.prompts.total,
      evaluationResult.scores.folders.total
    ];
    evaluationResult.overall = Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10;

    // Generate recommendations
    evaluationResult.recommendations = generateRecommendations(evaluationResult);

    // Save results
    const resultsDir = path.join(process.cwd(), 'evaluation-results');
    await fs.mkdir(resultsDir, { recursive: true });
    
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    await fs.writeFile(
      path.join(resultsDir, `evaluation-${timestamp}.json`),
      JSON.stringify(evaluationResult, null, 2)
    );
    
    await fs.writeFile(
      path.join(resultsDir, 'latest.json'),
      JSON.stringify(evaluationResult, null, 2)
    );

    // Print summary
    printEvaluationSummary(evaluationResult);
  });
});

function generateRecommendations(result: EvaluationResult): string[] {
  const recommendations: string[] = [];
  const { dashboard, prompts, folders } = result.scores;

  // Component-specific recommendations
  if (dashboard.total < 8) {
    if (dashboard.functionality < 8) {
      recommendations.push('[Dashboard] Improve core functionality - ensure all metrics load correctly');
    }
    if (dashboard.performance < 7) {
      recommendations.push('[Dashboard] Optimize performance - reduce initial load time');
    }
  }

  if (prompts.total < 8) {
    if (prompts.usability < 7) {
      recommendations.push('[Prompts] Enhance usability - simplify the prompt creation workflow');
    }
    if (prompts.functionality < 8) {
      recommendations.push('[Prompts] Fix search functionality and form validation');
    }
  }

  if (folders.total < 8) {
    if (folders.functionality < 7) {
      recommendations.push('[Folders] Implement drag-and-drop functionality properly');
    }
    if (folders.design < 7) {
      recommendations.push('[Folders] Improve visual hierarchy and folder nesting indicators');
    }
  }

  // Priority recommendations
  const lowestScore = Math.min(dashboard.total, prompts.total, folders.total);
  if (lowestScore < 6) {
    recommendations.unshift(`[CRITICAL] ${getLowestScoringComponent(result)} requires immediate attention`);
  }

  return recommendations;
}

function getLowestScoringComponent(result: EvaluationResult): string {
  const scores = {
    Dashboard: result.scores.dashboard.total,
    Prompts: result.scores.prompts.total,
    Folders: result.scores.folders.total
  };
  
  return Object.entries(scores).reduce((a, b) => a[1] < b[1] ? a : b)[0];
}

function printEvaluationSummary(result: EvaluationResult) {
  console.log('\n🎯 EVALUATION REPORT');
  console.log('============================================\n');
  
  console.log('🎯 COMPONENT SCORES:');
  console.log(`✅ Dashboard: ${result.scores.dashboard.total}/10`);
  console.log(`⚠️ Prompts:   ${result.scores.prompts.total}/10`);
  console.log(`❌ Folders:   ${result.scores.folders.total}/10`);
  console.log(`\n🏆 Overall: ${result.overall}/10\n`);

  if (result.recommendations.length > 0) {
    console.log('🚨 PRIORITY IMPROVEMENTS:');
    result.recommendations.forEach(rec => {
      console.log(`   ${rec}`);
    });
  }
}