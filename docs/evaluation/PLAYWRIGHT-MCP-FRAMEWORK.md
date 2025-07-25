# Playwright MCP Senior Product Developer AI Evaluation Framework

## 🚀 Quick Start

```bash
# Initialize the framework
npm run eval:init

# Run your first evaluation
npm run eval:run

# Start continuous evaluation (every 30 minutes)
npm run eval:continuous

# Generate comprehensive report
npm run eval:report
```

## 🎯 Framework Overview

This framework evaluates your application across 5 key dimensions like a senior product developer:

1. **Functionality (30%)** - Core features work correctly
2. **Usability (25%)** - User experience and interface design  
3. **Performance (20%)** - Load times and responsiveness
4. **Design (20%)** - Visual consistency and aesthetics
5. **Testing (5%)** - Test coverage and reliability

## 📊 Scoring System

- **9-10**: Exceptional (Senior Product Developer Standard)
- **8-8.9**: Excellent (Production Ready)
- **6-7.9**: Good (Needs Minor Improvements)
- **4-5.9**: Acceptable (Requires Attention)
- **0-3.9**: Poor (Critical Issues)

## 🛠️ Configuration

### Package.json Settings

```json
{
  "claudeCode": {
    "evaluationConfig": {
      "targetScores": {
        "dashboard": 8,
        "prompts": 8,
        "folders": 8
      },
      "continuousInterval": 30,
      "autoImproveThreshold": 7,
      "alertThreshold": 5
    }
  }
}
```

### Required Test Selectors

Add these data-testid attributes to your components:

**Dashboard:**
```tsx
<div data-testid="dashboard-metrics">
<button data-testid="refresh-button">
<div data-testid="loading-spinner">
<select data-testid="filter-dropdown">
```

**Prompts:**
```tsx
<button data-testid="create-prompt-button">
<input data-testid="prompt-title">
<textarea data-testid="prompt-content">
<input data-testid="search-input">
```

**Folders:**
```tsx
<button data-testid="create-folder-button">
<div data-testid="folder-item">
<div data-testid="draggable-item">
<div data-testid="folder-drop-zone">
```

## 📋 Available Commands

### Evaluation Commands
- `npm run eval:run` - Run complete evaluation
- `npm run eval:dashboard` - Evaluate dashboard only
- `npm run eval:prompts` - Evaluate prompts only
- `npm run eval:folders` - Evaluate folders only

### Continuous Integration
- `npm run eval:continuous` - Start continuous loop
- `INTERVAL=15 npm run eval:continuous` - Custom interval

### Analysis & Reporting
- `npm run eval:report` - Generate comprehensive report
- `npm run eval:trends` - Analyze trends over time
- `npm run eval:trends -- --days=7` - Last 7 days only

### Auto-Improvement
- `npm run eval:improve` - Apply safe improvements
- `npm run eval:improve -- --dry-run` - Preview changes

## 🔄 Continuous Evaluation Process

1. **Automated Testing** - Runs Playwright tests
2. **Score Calculation** - Weighted scoring across dimensions
3. **Trend Analysis** - Tracks improvement over time
4. **Alert Generation** - Notifies when below thresholds
5. **Auto-Improvement** - Applies safe fixes automatically

## 📈 Understanding Reports

### Sample Output
```
🎯 EVALUATION REPORT - Cycle #1
============================================

🎯 COMPONENT SCORES:
✅ Dashboard: 8/10
⚠️ Prompts:   6/10
❌ Folders:   4/10

🏆 Overall: 6.0/10

🚨 PRIORITY IMPROVEMENTS:
   [CRITICAL] Folders scored 4/8. Requires immediate attention.
   [HIGH] Prompts scored 6/8. Needs improvement.

📈 TREND ANALYSIS:
   📈 Dashboard: +0.5
   📉 Prompts: -0.2
   ➡️ Folders: +0.0
```

### Report Files
- `evaluation-results/latest.json` - Most recent evaluation
- `evaluation-results/history.json` - Historical data
- `evaluation-results/report.md` - Formatted report

## 🤖 Auto-Improvement System

The framework can automatically apply safe improvements when scores fall below thresholds:

### Low-Risk Improvements
- Adding aria-labels for accessibility
- Implementing loading states
- Improving visual hierarchy
- Adding basic animations

### Medium-Risk Improvements (Manual Approval)
- Form validation logic
- State management changes
- Component restructuring

## 🎯 Success Metrics

Track these KPIs:
- Average component scores trending upward
- Time to fix critical issues decreasing
- Number of production bugs decreasing
- User satisfaction correlating with scores

## 🔧 Troubleshooting

### Common Issues

**Tests failing to find elements:**
```bash
npx playwright test --debug tests/evaluation-suite.spec.ts
```

**Scores seem inaccurate:**
```bash
DEBUG=true npm run eval:run
```

**Performance issues:**
```bash
# Run tests in parallel
npx playwright test --workers=4
```

## 📚 Advanced Usage

### Custom Evaluation Criteria
Create `evaluation-config.js` to customize scoring:

```javascript
module.exports = {
  dashboard: {
    functionality: {
      weight: 4,  // Increase importance
      criteria: [
        'Custom requirement 1',
        'Custom requirement 2'
      ]
    }
  }
};
```

### CI/CD Integration
```yaml
# .github/workflows/evaluation.yml
name: Automated Evaluation
on: [push, pull_request]
jobs:
  evaluate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Evaluation
        run: npm run eval:run
      - name: Check Scores
        run: |
          SCORE=$(cat evaluation-results/latest.json | jq '.overall')
          if (( $(echo "$SCORE < 6" | bc -l) )); then
            exit 1
          fi
```

### Team Notifications
```bash
# Slack webhook for alerts
ALERT_WEBHOOK=https://hooks.slack.com/... npm run eval:continuous
```

## 🏆 Best Practices

1. **Start with realistic targets** - Don't aim for 10/10 immediately
2. **Run evaluations regularly** - At least daily in active development
3. **Review trends weekly** - Look for patterns and regressions
4. **Celebrate improvements** - Share success with the team
5. **Document custom criteria** - Keep evaluation criteria updated

## 🚀 Next Steps

1. Ensure all components have test selectors
2. Run initial evaluation to establish baseline
3. Set up continuous evaluation in development
4. Configure CI/CD integration
5. Review and act on recommendations

---

Ready to achieve senior product developer standards? Start evaluating now!