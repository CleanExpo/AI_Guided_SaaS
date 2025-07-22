#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🏥 Health Check Dashboard Generator\n');

// Run health check if results don't exist
if (!fs.existsSync('health-check-results.json')) {
  console.log('Running health check first...');
  execSync('node scripts/health-check-exhaustive.js', { stdio: 'inherit' });
}

// Read results
const results = JSON.parse(fs.readFileSync('health-check-results.json', 'utf8'));

// Generate HTML dashboard
const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Guided SaaS - Health Check Dashboard</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f7fa;
      color: #2d3748;
      line-height: 1.6;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    header {
      background: white;
      padding: 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
      border-radius: 8px;
    }
    h1 {
      color: #1a202c;
      margin-bottom: 0.5rem;
    }
    .timestamp {
      color: #718096;
      font-size: 0.875rem;
    }
    .score-card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      text-align: center;
      margin-bottom: 2rem;
    }
    .score {
      font-size: 4rem;
      font-weight: bold;
      margin: 1rem 0;
    }
    .score.excellent { color: #48bb78; }
    .score.good { color: #ed8936; }
    .score.poor { color: #e53e3e; }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .card h3 {
      margin-bottom: 1rem;
      color: #2d3748;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .metric {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid #e2e8f0;
    }
    .metric:last-child { border-bottom: none; }
    .badge {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 500;
    }
    .badge.success { background: #c6f6d5; color: #276749; }
    .badge.warning { background: #feebc8; color: #c05621; }
    .badge.error { background: #feb2b2; color: #c53030; }
    .icon { width: 1.5rem; height: 1.5rem; }
    .recommendations {
      background: #edf2f7;
      padding: 1.5rem;
      border-radius: 8px;
      margin-top: 2rem;
    }
    .recommendations h3 {
      margin-bottom: 1rem;
      color: #2d3748;
    }
    .recommendations ol {
      margin-left: 1.5rem;
    }
    .recommendations li {
      margin-bottom: 0.5rem;
    }
    .file-list {
      background: #f7fafc;
      padding: 1rem;
      border-radius: 4px;
      margin-top: 1rem;
      font-family: monospace;
      font-size: 0.875rem;
    }
    .progress-bar {
      background: #e2e8f0;
      height: 8px;
      border-radius: 4px;
      overflow: hidden;
      margin-top: 0.5rem;
    }
    .progress-fill {
      height: 100%;
      background: #4299e1;
      transition: width 0.3s ease;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>🏥 AI Guided SaaS - Health Check Dashboard</h1>
      <p class="timestamp">Generated: ${new Date(results.timestamp).toLocaleString()}</p>
    </header>

    <div class="score-card">
      <h2>Overall Health Score</h2>
      <div class="score ${results.healthScore >= 90 ? 'excellent' : results.healthScore >= 70 ? 'good' : 'poor'}">
        ${results.healthScore}/100
      </div>
      <p>${results.healthScore >= 90 ? '✅ Excellent' : results.healthScore >= 70 ? '⚠️ Needs Attention' : '❌ Critical'}</p>
    </div>

    <div class="grid">
      <div class="card">
        <h3>
          <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
          </svg>
          TypeScript
        </h3>
        <div class="metric">
          <span>Errors</span>
          <span class="badge ${results.typescript.errors === 0 ? 'success' : 'error'}">
            ${results.typescript.errors}
          </span>
        </div>
        ${results.typescript.files.length > 0 ? `
          <div class="file-list">
            <strong>Top files with errors:</strong><br>
            ${results.typescript.files.slice(0, 3).map(f => 
              `${f.file}: ${f.count} errors`
            ).join('<br>')}
          </div>
        ` : ''}
      </div>

      <div class="card">
        <h3>
          <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          ESLint
        </h3>
        <div class="metric">
          <span>Errors</span>
          <span class="badge ${results.eslint.errors === 0 ? 'success' : 'error'}">
            ${results.eslint.errors}
          </span>
        </div>
        <div class="metric">
          <span>Warnings</span>
          <span class="badge ${results.eslint.warnings === 0 ? 'success' : 'warning'}">
            ${results.eslint.warnings}
          </span>
        </div>
      </div>

      <div class="card">
        <h3>
          <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
          Build
        </h3>
        <div class="metric">
          <span>Status</span>
          <span class="badge ${results.build.success ? 'success' : 'error'}">
            ${results.build.success ? 'Passing' : 'Failing'}
          </span>
        </div>
        ${results.performance.buildTime ? `
          <div class="metric">
            <span>Build Time</span>
            <span>${results.performance.buildTime.toFixed(1)}s</span>
          </div>
        ` : ''}
      </div>

      <div class="card">
        <h3>
          <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
          Security
        </h3>
        <div class="metric">
          <span>Vulnerabilities</span>
          <span class="badge ${results.dependencies.vulnerabilities.total === 0 ? 'success' : 'warning'}">
            ${results.dependencies.vulnerabilities.total || 0}
          </span>
        </div>
        ${results.dependencies.vulnerabilities.critical > 0 ? `
          <div class="metric">
            <span>Critical</span>
            <span class="badge error">${results.dependencies.vulnerabilities.critical}</span>
          </div>
        ` : ''}
      </div>

      <div class="card">
        <h3>
          <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
          </svg>
          Dependencies
        </h3>
        <div class="metric">
          <span>Missing</span>
          <span class="badge ${results.dependencies.missing === 0 ? 'success' : 'error'}">
            ${results.dependencies.missing}
          </span>
        </div>
        <div class="metric">
          <span>Outdated</span>
          <span class="badge ${results.dependencies.outdated === 0 ? 'success' : 'warning'}">
            ${results.dependencies.outdated}
          </span>
        </div>
      </div>

      <div class="card">
        <h3>
          <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          Tests
        </h3>
        <div class="metric">
          <span>Passed</span>
          <span class="badge success">${results.tests.passed}</span>
        </div>
        <div class="metric">
          <span>Failed</span>
          <span class="badge ${results.tests.failed === 0 ? 'success' : 'error'}">
            ${results.tests.failed}
          </span>
        </div>
      </div>
    </div>

    ${generateRecommendations(results).length > 0 ? `
      <div class="recommendations">
        <h3>📋 Recommendations</h3>
        <ol>
          ${generateRecommendations(results).map(rec => `<li>${rec}</li>`).join('')}
        </ol>
      </div>
    ` : ''}

    <div style="margin-top: 2rem; text-align: center; color: #718096;">
      <p>Run <code>npm run health:check</code> to update this report</p>
    </div>
  </div>

  <script>
    // Auto-refresh every 30 seconds if in development
    if (window.location.hostname === 'localhost') {
      setTimeout(() => window.location.reload(), 30000);
    }
  </script>
</body>
</html>
`;

// Write dashboard
fs.writeFileSync('health-dashboard.html', html);
console.log('✅ Dashboard generated: health-dashboard.html');

// Also generate a markdown report
const markdown = `# Health Check Report

Generated: ${new Date(results.timestamp).toLocaleString()}

## Overall Health Score: ${results.healthScore}/100

### Summary
- **TypeScript Errors**: ${results.typescript.errors}
- **ESLint Errors**: ${results.eslint.errors} (Warnings: ${results.eslint.warnings})
- **Build Status**: ${results.build.success ? '✅ Passing' : '❌ Failing'}
- **Dependencies**: ${results.dependencies.missing} missing, ${results.dependencies.outdated} outdated
- **Security**: ${results.dependencies.vulnerabilities.total || 0} vulnerabilities
- **Tests**: ${results.tests.passed} passed, ${results.tests.failed} failed

### Recommendations
${generateRecommendations(results).map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

### Quick Fix Commands
\`\`\`bash
# Fix all errors automatically
npm run fix:all

# Fix specific issues
npm run fix:typescript  # TypeScript errors
npm run fix:eslint     # ESLint errors
npm run fix:prettier   # Code formatting

# Verify fixes
npm run health:check
\`\`\`
`;

fs.writeFileSync('HEALTH_CHECK_REPORT.md', markdown);
console.log('✅ Markdown report generated: HEALTH_CHECK_REPORT.md');

// Open dashboard in browser (optional)
if (process.argv.includes('--open')) {
  const opener = process.platform === 'win32' ? 'start' : 
                  process.platform === 'darwin' ? 'open' : 'xdg-open';
  execSync(`${opener} health-dashboard.html`);
}

function generateRecommendations(results) {
  const recs = [];
  
  if (results.typescript.errors > 0) {
    recs.push(`Fix ${results.typescript.errors} TypeScript errors - Run: npm run fix:typescript`);
  }
  
  if (results.eslint.errors > 0) {
    recs.push(`Fix ${results.eslint.errors} ESLint errors - Run: npm run fix:eslint`);
  }
  
  if (!results.build.success) {
    recs.push('Fix build errors - Check build output for details');
  }
  
  if (results.dependencies.missing > 0) {
    recs.push('Install missing dependencies - Run: npm install');
  }
  
  if (results.dependencies.vulnerabilities.total > 0) {
    recs.push(`Fix ${results.dependencies.vulnerabilities.total} security vulnerabilities - Run: npm audit fix`);
  }
  
  return recs;
}