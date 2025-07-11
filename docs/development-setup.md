# 🛠️ Development Environment Setup

## Overview

This guide provides complete instructions for setting up the development environment for the AI Guided SaaS project, including all necessary tools, configurations, and troubleshooting steps.

## 📋 Prerequisites

### Required Software

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher (comes with Node.js)
- **Git**: Latest version
- **VS Code**: Recommended IDE with extensions

### System Requirements

- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 10GB free space minimum
- **OS**: Windows 10/11, macOS 10.15+, or Linux Ubuntu 18.04+

## 🚀 Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/CleanExpo/AI_Guided_SaaS.git
cd AI_Guided_SaaS
```

### 2. Install Dependencies

```bash
# Install all dependencies
npm install

# Verify installation
npm list --depth=0
```

### 3. Environment Configuration

```bash
# Copy environment template
cp .env.local.example .env.local

# Edit environment variables
# Add your API keys and configuration
```

### 4. Verify Development Tools

```bash
# Check if all tools are available
npx prettier --version
npx eslint --version
npx husky --version
```

## 🔧 Development Tools Configuration

### Prettier (Code Formatting)

**Configuration File**: `.prettierrc`

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

**Ignore File**: `.prettierignore`

- Excludes build files, dependencies, and generated content
- See file for complete list

### ESLint (Code Linting)

**Configuration**: `.eslintrc.json`

- Extends Next.js recommended configuration
- Includes TypeScript support
- Custom rules for project standards

### Husky (Git Hooks)

**Pre-commit Hook**: `.husky/pre-commit`

- Runs lint-staged for code quality
- Simplified to prevent resource issues
- Can be extended with additional checks

### Lint-staged (Staged Files Processing)

**Configuration in `package.json`**:

```json
"lint-staged": {
  "*.{js,jsx,ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{json,md,yml,yaml}": [
    "prettier --write"
  ]
}
```

## 📦 Available Scripts

### Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run typecheck    # TypeScript type checking
```

### Testing

```bash
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
npm run test:e2e     # Run end-to-end tests
```

### Quality Assurance

```bash
npm run validate     # Run typecheck, lint, and tests
npm run validate:full # Full validation with coverage
```

### Deployment

```bash
npm run deploy:check      # Pre-deployment checks
npm run deploy:staging    # Deploy to staging
npm run deploy:production # Deploy to production
```

## 🔍 Troubleshooting Common Issues

### Issue: "prettier is not recognized"

**Cause**: Prettier not installed or not in PATH
**Solution**:

```bash
# Install prettier globally
npm install -g prettier

# Or install locally
npm install --save-dev prettier
```

### Issue: "eslint --fix failed without output (KILLED)"

**Cause**: ESLint process killed due to resource constraints
**Solutions**:

1. **Reduce scope**:

   ```bash
   # Lint specific files only
   npx eslint src/components/admin/ --fix
   ```

2. **Increase memory limit**:

   ```bash
   # Set Node.js memory limit
   export NODE_OPTIONS="--max-old-space-size=4096"
   npm run lint:fix
   ```

3. **Simplify pre-commit hook**:
   - Edit `.husky/pre-commit`
   - Remove resource-intensive checks
   - Focus on essential validations only

### Issue: "husky - pre-commit script failed"

**Cause**: Pre-commit hook configuration issues
**Solutions**:

1. **Bypass temporarily**:

   ```bash
   git commit --no-verify -m "your message"
   ```

2. **Fix hook configuration**:

   ```bash
   # Reinstall husky
   npm uninstall husky
   npm install --save-dev husky
   npm run prepare
   ```

3. **Test hook manually**:
   ```bash
   npx lint-staged
   ```

### Issue: "Command failed with exit code 1"

**Cause**: Linting or formatting errors
**Solutions**:

1. **Check specific errors**:

   ```bash
   npm run lint -- --debug
   ```

2. **Fix formatting issues**:

   ```bash
   npx prettier --write .
   ```

3. **Fix linting issues**:
   ```bash
   npx eslint . --fix
   ```

## 🎯 Best Practices

### Code Quality

1. **Always run linting before committing**:

   ```bash
   npm run lint:fix
   ```

2. **Format code consistently**:

   ```bash
   npx prettier --write .
   ```

3. **Run type checking**:
   ```bash
   npm run typecheck
   ```

### Git Workflow

1. **Create feature branches**:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Commit frequently with clear messages**:

   ```bash
   git commit -m "feat: add new component"
   ```

3. **Test before pushing**:
   ```bash
   npm run validate
   git push origin feature/your-feature-name
   ```

### Performance Considerations

1. **Monitor resource usage during development**
2. **Use incremental builds when possible**
3. **Close unnecessary applications during intensive operations**
4. **Take breaks during long development sessions**

## 🔄 Maintenance

### Weekly Tasks

- [ ] Update dependencies: `npm update`
- [ ] Run full validation: `npm run validate:full`
- [ ] Check for security vulnerabilities: `npm audit`
- [ ] Clean up node_modules if needed: `rm -rf node_modules && npm install`

### Monthly Tasks

- [ ] Review and update development tools
- [ ] Update documentation
- [ ] Review and optimize build processes
- [ ] Update environment configurations

## 📚 Additional Resources

### Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Configuration](https://prettier.io/docs/en/configuration.html)

### VS Code Extensions (Recommended)

- ESLint
- Prettier - Code formatter
- TypeScript Importer
- Auto Rename Tag
- Bracket Pair Colorizer
- GitLens

### Useful Commands

```bash
# Check Node.js and npm versions
node --version && npm --version

# Clear npm cache
npm cache clean --force

# Reinstall all dependencies
rm -rf node_modules package-lock.json && npm install

# Check for outdated packages
npm outdated

# Update specific package
npm update package-name
```

## 🆘 Getting Help

### Internal Resources

- Check `docs/troubleshooting.md` for common issues
- Review `docs/emergency-procedures.md` for critical problems
- Check project README.md for basic information

### External Resources

- [Stack Overflow](https://stackoverflow.com) for coding questions
- [GitHub Issues](https://github.com/CleanExpo/AI_Guided_SaaS/issues) for project-specific problems
- [Next.js Discord](https://discord.gg/nextjs) for framework support

---

## 🎉 You're Ready!

Once you've completed this setup, you should be able to:

- ✅ Run the development server
- ✅ Make code changes with proper formatting
- ✅ Commit changes without hook failures
- ✅ Build the project successfully
- ✅ Run tests and validation

If you encounter any issues not covered in this guide, please update this documentation with the solution for future developers.
