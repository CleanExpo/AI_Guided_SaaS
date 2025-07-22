# 🏥 Health Check System - Quick Start Guide

## Overview
The enhanced health check system ensures your codebase maintains perfect health continuously through automated detection, fixing, and prevention of errors.

## 🚀 Quick Commands

```bash
# Run comprehensive health check
npm run health:check

# Automatically fix all errors (recursive)
npm run fix:all

# Generate health dashboard
node scripts/health-dashboard.js --open

# Quick health check
npm run health:simple
```

## 📋 Available Scripts

### Health Checks
- `npm run health:check` - Exhaustive health check with detailed report
- `npm run health:simple` - Quick health check (TypeScript + ESLint only)
- `npm run health:full` - Health check + build verification

### Automated Fixes
- `npm run fix:all` - Recursive fix loop until zero errors
- `npm run fix:typescript` - Fix TypeScript syntax errors
- `npm run fix:eslint` - Auto-fix ESLint issues
- `npm run fix:prettier` - Format code with Prettier
- `npm run fix:mcp` - Fix MCP module issues

### Verification
- `npm run typecheck` - TypeScript type checking
- `npm run lint` - ESLint checking
- `npm run verify:mcp` - MCP module integrity

## 🔄 Automated Workflow

1. **Pre-commit Hooks** (via Husky)
   - Runs automatically before each commit
   - Prevents commits with errors
   - Suggests fix commands

2. **CI/CD Pipeline** (GitHub Actions)
   - Runs on every push and PR
   - Daily deep scans at midnight
   - Auto-fixes on main branch

3. **Fix Loop Process**
   ```
   Detect Errors → Apply Fixes → Re-check → Repeat
   ```

## 📊 Health Metrics

| Metric | Target | Command to Check |
|--------|--------|------------------|
| TypeScript Errors | 0 | `npx tsc --noEmit` |
| ESLint Errors | 0 | `npx eslint .` |
| Build Success | ✅ | `npm run build` |
| Tests Passing | ✅ | `npm test` |
| Dependencies | ✅ | `npm audit` |

## 🛠️ Troubleshooting

### "Too many errors to fix automatically"
```bash
# Focus on critical files first
node scripts/fix-critical-errors.cjs

# Then run full fix
npm run fix:all
```

### "Build still failing after fixes"
```bash
# Clean install
rm -rf node_modules .next
npm install

# Rebuild
npm run build
```

### "Pre-commit hook blocking commit"
```bash
# Fix errors first
npm run fix:all

# Or bypass temporarily (not recommended)
git commit --no-verify
```

## 📈 Monitoring

### View Health Dashboard
```bash
node scripts/health-dashboard.js --open
```

### Check Historical Trends
```bash
cat health-check-results.json | jq '.healthScore'
```

### CI/CD Status
- Check GitHub Actions tab
- Review PR comments for health reports

## 🎯 Best Practices

1. **Run health check before major changes**
   ```bash
   npm run health:check
   ```

2. **Fix errors immediately**
   ```bash
   npm run fix:all
   ```

3. **Keep dependencies updated**
   ```bash
   npm outdated
   npm update
   ```

4. **Review security regularly**
   ```bash
   npm audit
   npm audit fix
   ```

## 📚 Advanced Usage

### Custom Health Check
```javascript
// Add to scripts/health-check-exhaustive.js
const customCheck = {
  name: 'Custom Check',
  run: () => {
    // Your custom logic
    return { passed: true, message: 'All good!' };
  }
};
```

### Exclude Files from Checks
```javascript
// .eslintignore
build/
coverage/
*.config.js
```

### Strict Mode (Zero Tolerance)
```bash
# Update tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

## 🔗 Related Documentation

- [Full Health Check System Documentation](./HEALTH_CHECK_SYSTEM_V2.md)
- [TypeScript Configuration](./tsconfig.json)
- [ESLint Configuration](./.eslintrc.json)
- [CI/CD Workflow](./.github/workflows/health-check.yml)

---

**Remember**: A healthy codebase is a happy codebase! 🌟