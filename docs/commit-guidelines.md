# 📝 Commit Guidelines

## Overview

This document provides guidelines for making commits to the AI Guided SaaS project, including best practices, troubleshooting, and automated checks.

## 🎯 Commit Message Format

### Conventional Commits

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools

### Examples

```bash
feat: add user authentication system
fix: resolve memory leak in data processing
docs: update API documentation
style: format code with prettier
refactor: simplify user validation logic
perf: optimize database queries
test: add unit tests for auth service
chore: update dependencies
```

## 🔄 Pre-commit Process

### Automated Checks

When you commit, the following checks run automatically:

1. **ESLint**: Code linting and style checking
2. **Prettier**: Code formatting
3. **Type Checking**: TypeScript validation (optional)

### Pre-commit Hook Flow

```bash
git commit -m "your message"
↓
🔍 Running pre-commit checks...
↓
npx lint-staged
├── *.{js,jsx,ts,tsx} → eslint --fix → prettier --write
└── *.{json,md,yml,yaml} → prettier --write
↓
✅ Pre-commit checks passed!
↓
Commit created successfully
```

## 🛠️ Troubleshooting Commit Issues

### Issue: "prettier is not recognized"

**Error Message**:

```
'prettier' is not recognized as an internal or external command
```

**Solution**:

```bash
# Verify prettier is installed
npm list prettier

# If not installed, install it
npm install --save-dev prettier

# Try commit again
git commit -m "your message"
```

### Issue: "eslint --fix failed without output (KILLED)"

**Error Message**:

```
✖ eslint --fix failed without output (KILLED).
```

**Solutions**:

1. **Increase Node.js memory limit**:

   ```bash
   export NODE_OPTIONS="--max-old-space-size=4096"
   git commit -m "your message"
   ```

2. **Lint specific files only**:

   ```bash
   # Fix files manually first
   npx eslint src/components/admin/ --fix
   npx prettier --write src/components/admin/

   # Then commit
   git commit -m "your message"
   ```

3. **Bypass hooks temporarily** (use sparingly):
   ```bash
   git commit --no-verify -m "your message"
   ```

### Issue: "husky - pre-commit script failed (code 1)"

**Error Message**:

```
husky - pre-commit script failed (code 1)
```

**Solutions**:

1. **Check what failed**:

   ```bash
   # Run lint-staged manually to see errors
   npx lint-staged
   ```

2. **Fix linting errors**:

   ```bash
   # Fix ESLint issues
   npm run lint:fix

   # Format with Prettier
   npx prettier --write .

   # Try commit again
   git commit -m "your message"
   ```

3. **Check file permissions** (Linux/Mac):
   ```bash
   chmod +x .husky/pre-commit
   ```

### Issue: "Command failed with exit code 1"

**Cause**: Linting or formatting errors in your code

**Solution**:

```bash
# 1. Check specific errors
npm run lint

# 2. Fix automatically where possible
npm run lint:fix

# 3. Format code
npx prettier --write .

# 4. Check for remaining issues
npm run lint

# 5. Fix remaining issues manually

# 6. Try commit again
git commit -m "your message"
```

## 📋 Pre-commit Checklist

Before committing, ensure:

- [ ] **Code compiles**: `npm run build`
- [ ] **No linting errors**: `npm run lint`
- [ ] **Code is formatted**: `npx prettier --check .`
- [ ] **Types are valid**: `npm run typecheck`
- [ ] **Tests pass**: `npm run test` (if applicable)
- [ ] **Commit message follows convention**

## 🚀 Quick Commit Workflow

### Standard Workflow

```bash
# 1. Stage your changes
git add .

# 2. Check what will be committed
git status

# 3. Run quality checks manually (optional but recommended)
npm run lint:fix
npx prettier --write .

# 4. Commit with conventional message
git commit -m "feat: add new admin dashboard component"

# 5. Push to remote
git push origin your-branch-name
```

### Emergency Workflow (when hooks fail)

```bash
# 1. Fix issues manually
npm run lint:fix
npx prettier --write .

# 2. If still failing, bypass hooks temporarily
git commit --no-verify -m "fix: emergency commit - resolve later"

# 3. Create follow-up commit to fix issues
# ... fix remaining issues ...
git commit -m "fix: resolve linting and formatting issues"

# 4. Push both commits
git push origin your-branch-name
```

## 🔧 Configuration Files

### Prettier Configuration (`.prettierrc`)

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

### ESLint Configuration (`.eslintrc.json`)

- Extends Next.js recommended rules
- Includes TypeScript support
- Custom project-specific rules

### Husky Pre-commit Hook (`.husky/pre-commit`)

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Running pre-commit checks..."
npx lint-staged
echo "✅ Pre-commit checks passed!"
```

### Lint-staged Configuration (`package.json`)

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

## 🎯 Best Practices

### Commit Frequency

- **Commit often**: Small, focused commits are better than large ones
- **Logical units**: Each commit should represent a complete logical change
- **Working state**: Each commit should leave the code in a working state

### Commit Messages

- **Be descriptive**: Explain what and why, not just what
- **Use imperative mood**: "Add feature" not "Added feature"
- **Keep first line under 50 characters**
- **Use body for detailed explanations when needed**

### Code Quality

- **Test your changes**: Ensure your code works before committing
- **Follow project conventions**: Maintain consistency with existing code
- **Document significant changes**: Update relevant documentation

## 🆘 Emergency Procedures

### If Commit Process Hangs

1. **Cancel the process**: `Ctrl+C`
2. **Check system resources**: Task Manager / Activity Monitor
3. **Close unnecessary applications**
4. **Try again with reduced scope**:
   ```bash
   git add specific-file.js
   git commit -m "fix: specific change"
   ```

### If Repository Gets Corrupted

1. **Backup your changes**:

   ```bash
   git stash push -m "backup before fix"
   ```

2. **Reset to last known good state**:

   ```bash
   git reset --hard HEAD~1
   ```

3. **Restore your changes**:

   ```bash
   git stash pop
   ```

4. **Commit again with proper process**

### If Pre-commit Hooks Break Everything

1. **Disable hooks temporarily**:

   ```bash
   mv .husky .husky-backup
   ```

2. **Commit your changes**:

   ```bash
   git commit -m "emergency: disable hooks temporarily"
   ```

3. **Fix the hook configuration**:

   ```bash
   mv .husky-backup .husky
   # Fix the issues in .husky/pre-commit
   ```

4. **Test and re-enable**:
   ```bash
   npx lint-staged  # Test manually
   git commit -m "fix: restore working pre-commit hooks"
   ```

## 📚 Additional Resources

- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [Git Best Practices](https://git-scm.com/book/en/v2)
- [ESLint Rules Documentation](https://eslint.org/docs/rules/)
- [Prettier Configuration Options](https://prettier.io/docs/en/options.html)
- [Husky Documentation](https://typicode.github.io/husky/)

---

## 🎉 Success!

Following these guidelines will help ensure:

- ✅ Consistent code quality
- ✅ Clear commit history
- ✅ Smooth collaboration
- ✅ Reduced merge conflicts
- ✅ Easier debugging and rollbacks

Remember: When in doubt, ask for help or refer to this documentation!
