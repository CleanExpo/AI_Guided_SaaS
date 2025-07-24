# Node.js v20 Migration Guide

## Overview

This guide documents the migration from Node.js v18 to v20 for the AI Guided SaaS project.

## Node.js v20 Key Features & Requirements

### 1. **Stable Features in v20**
- **Permission Model**: Experimental in v18, stable in v20
- **Test Runner**: Built-in test runner is now stable
- **WebCrypto API**: Full compatibility
- **Single Executable Applications**: Create standalone executables
- **Import.meta.resolve**: Stable for ESM resolution

### 2. **Performance Improvements**
- V8 engine v11.3 (improved performance)
- Faster URL parsing
- Improved startup time
- Better memory management

### 3. **Breaking Changes from v18**
- Deprecated `url.parse()` - use `new URL()` instead
- Stricter Promise rejection handling
- Some crypto algorithms deprecated
- `process.binding()` is deprecated

## Migration Steps

### 1. **Switch to Node v20**
```bash
# Using nvm for Windows
nvm install 20.19.4
nvm use 20.19.4

# Or run our setup script
npm run setup:node20
```

### 2. **Update Dependencies**
```bash
# Clean install with Node v20
rm -rf node_modules package-lock.json
npm install
```

### 3. **Code Updates Required**

#### URL Parsing
```typescript
// Old (deprecated)
import { parse } from 'url';
const parsed = parse(urlString);

// New (Node v20)
const parsed = new URL(urlString);
```

#### Promise Rejections
```typescript
// Add global handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
});
```

#### ESM Support
```typescript
// package.json already has "type": "module"
// Use .cjs extension for CommonJS files
// Use import.meta.url for __dirname equivalent
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
```

### 4. **Environment Variables**
```env
# Add to .env
NODE_VERSION=20.19.4
NODE_ENV=development
```

### 5. **CI/CD Updates**
Update GitHub Actions, Docker, and deployment configs:

```yaml
# .github/workflows/node.js.yml
- uses: actions/setup-node@v3
  with:
    node-version: '20.19.4'
```

```dockerfile
# Dockerfile
FROM node:20.19.4-alpine
```

## Compatibility Checklist

### ✅ **Compatible Dependencies**
- Next.js 15.4.3 - Full Node v20 support
- React 19.1.0 - Compatible
- TypeScript 5.x - Compatible
- All major dependencies support Node v20

### ⚠️ **Dependencies to Watch**
- Native modules may need rebuilding
- Some older packages might need updates

### 🔧 **Project-Specific Updates**

1. **MCP Servers**
   - Sequential-thinking server: Already using CommonJS (.cjs)
   - Serena: Python-based, not affected

2. **Scripts**
   - Use .cjs extension for CommonJS scripts
   - Use .mjs or .js (with type: module) for ESM

3. **Build Tools**
   - esbuild: Compatible with Node v20
   - Webpack (via Next.js): Compatible

## Testing Node v20

### 1. **Verify Installation**
```bash
node -v  # Should show v20.19.4
npm -v   # Should show 10.x or higher
```

### 2. **Run Test Suite**
```bash
npm run test
npm run test:e2e
npm run typecheck
```

### 3. **Check for Deprecation Warnings**
```bash
node --trace-deprecation npm run dev
```

### 4. **Performance Testing**
```bash
# Memory usage
node --expose-gc --trace-gc npm run build

# Startup time
time node -e "console.log('Hello')"
```

## Rollback Plan

If issues arise:

1. **Switch back to Node v18**
   ```bash
   nvm use 18.20.8
   ```

2. **Restore dependencies**
   ```bash
   git checkout package-lock.json
   npm ci
   ```

## Benefits of Node v20

1. **Performance**: ~10% faster than v18
2. **Security**: Latest security patches
3. **Features**: Access to latest JavaScript features
4. **LTS**: Long-term support until April 2026
5. **Compatibility**: Better ESM support

## Common Issues & Solutions

### Issue 1: Module Resolution
```bash
Error: Cannot find module
Solution: Check file extensions (.js vs .cjs vs .mjs)
```

### Issue 2: Native Modules
```bash
Error: The module was compiled against a different Node.js version
Solution: npm rebuild
```

### Issue 3: Permission Errors
```bash
Error: EACCES: permission denied
Solution: Clear npm cache: npm cache clean --force
```

## Monitoring After Migration

1. **Check logs for warnings**
   ```bash
   npm run dev 2>&1 | grep -i "deprecat"
   ```

2. **Monitor performance**
   - Memory usage
   - CPU usage
   - Response times

3. **Run full test suite**
   ```bash
   npm run validate:full
   ```

---

For more details, see:
- [Node.js v20 Documentation](https://nodejs.org/docs/latest-v20.x/api/)
- [Node.js v20 Changelog](https://github.com/nodejs/node/blob/main/doc/changelogs/CHANGELOG_V20.md)
- [Migration Guide](https://nodejs.org/en/docs/guides/)