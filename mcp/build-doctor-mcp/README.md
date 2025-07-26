# Build Doctor MCP 🩺

The ultimate build and code correctness expert. Build Doctor doesn't just diagnose—it cures. Never lose another week to syntax or build problems!

## Overview

Build Doctor MCP is an autonomous AI-powered tool that ensures every deployment pipeline runs flawlessly. With encyclopedic mastery of modern coding standards, static analysis, and build pipelines (Node.js, React/Next.js, TypeScript, and more), it rapidly discovers and fixes errors as if authored by the top syntax engineers in the world.

## Features

### 🔍 Comprehensive Diagnosis
- Scans entire codebase for syntax, structure, and build tool compatibility issues
- Identifies JSX, TypeScript, import, dependency, and configuration errors
- Cross-references build logs with source code
- Provides detailed error mapping with file locations and line numbers

### 🔧 Automated Fixing
- Fixes syntax errors (missing semicolons, brackets, quotes)
- Resolves TypeScript type errors
- Repairs JSX structure issues (duplicate props, unclosed tags)
- Corrects import statements and missing file extensions
- Applies Prettier formatting automatically

### ✅ Validation & Verification
- Runs full build validation after fixes
- Executes linting and type checking
- Optional test suite execution
- Provides detailed metrics (build time, bundle size, type coverage)

### 📊 Intelligent Reporting
- Generates before/after comparisons
- Creates fix summaries with actionable insights
- Produces reports in Markdown, JSON, or HTML formats
- Offers preventative suggestions for future issues

## Installation

```bash
cd mcp/build-doctor-mcp
npm install
npm run build
```

## Usage

### As an MCP Server

Start Build Doctor as an MCP server:

```bash
npm run build-doctor
```

Or in development mode:

```bash
npm run build-doctor:dev
```

### Available Tools

#### 1. `diagnose_build`
Performs comprehensive build diagnosis to identify all errors.

```json
{
  "name": "diagnose_build",
  "arguments": {
    "projectPath": "/path/to/project",
    "includeWarnings": false
  }
}
```

#### 2. `fix_all_errors`
Automatically fixes all detected build and syntax errors.

```json
{
  "name": "fix_all_errors",
  "arguments": {
    "projectPath": "/path/to/project",
    "dryRun": false,
    "createBackup": true
  }
}
```

#### 3. `fix_syntax_errors`
Specifically targets JavaScript/TypeScript syntax errors.

```json
{
  "name": "fix_syntax_errors",
  "arguments": {
    "projectPath": "/path/to/project",
    "files": ["src/index.ts", "src/app.tsx"]
  }
}
```

#### 4. `fix_typescript_errors`
Fixes TypeScript type errors and inconsistencies.

```json
{
  "name": "fix_typescript_errors",
  "arguments": {
    "projectPath": "/path/to/project",
    "strictMode": false
  }
}
```

#### 5. `fix_jsx_errors`
Repairs JSX/React syntax and structure errors.

```json
{
  "name": "fix_jsx_errors",
  "arguments": {
    "projectPath": "/path/to/project",
    "fixDuplicateProps": true
  }
}
```

#### 6. `validate_build`
Validates project build and reports status.

```json
{
  "name": "validate_build",
  "arguments": {
    "projectPath": "/path/to/project",
    "runTests": false
  }
}
```

#### 7. `generate_fix_report`
Generates a detailed report of all fixes applied.

```json
{
  "name": "generate_fix_report",
  "arguments": {
    "projectPath": "/path/to/project",
    "format": "markdown"
  }
}
```

### CLI Usage

Build Doctor also includes a CLI for direct usage:

```bash
# Diagnose issues
npx build-doctor diagnose --path /path/to/project

# Fix all issues
npx build-doctor fix --path /path/to/project

# Dry run (preview fixes)
npx build-doctor fix --path /path/to/project --dry-run

# Validate build
npx build-doctor validate --path /path/to/project --tests
```

## Common Fix Examples

### Syntax Errors
**Before:**
```javascript
const Component = () => {
  return <div>Hello World</div>
```

**After:**
```javascript
const Component = () => {
  return <div>Hello World</div>;
};
```

### JSX Duplicate Props
**Before:**
```jsx
<Button className="primary" onClick={handleClick} className="btn" />
```

**After:**
```jsx
<Button className="primary" onClick={handleClick} />
```

### TypeScript Implicit Any
**Before:**
```typescript
function processData(data) {
  return data.map(item => item.value);
}
```

**After:**
```typescript
function processData(data: any) {
  return data.map((item: any) => item.value);
}
```

## Integration

### Pre-commit Hook
Add to `.husky/pre-commit`:
```bash
#!/bin/sh
npx build-doctor validate || {
  echo "Build validation failed. Running Build Doctor..."
  npx build-doctor fix
  exit 1
}
```

### CI/CD Pipeline
Add to your GitHub Actions workflow:
```yaml
- name: Build Doctor Check
  run: |
    npx build-doctor diagnose
    npx build-doctor validate
```

### VS Code Integration
Add to `.vscode/tasks.json`:
```json
{
  "label": "Build Doctor Fix",
  "type": "shell",
  "command": "npx build-doctor fix",
  "problemMatcher": []
}
```

## Best Practices

1. **Run regularly**: Execute Build Doctor after every major change
2. **Review fixes**: Always review automated fixes before committing
3. **Enable backups**: Keep the backup feature enabled for safety
4. **Use dry-run**: Test fixes with dry-run mode first
5. **Set up automation**: Integrate with pre-commit hooks and CI/CD

## Configuration

Build Doctor respects your project's existing configuration:
- ESLint rules from `.eslintrc`
- TypeScript settings from `tsconfig.json`
- Prettier config from `.prettierrc`
- Build scripts from `package.json`

## Output Example

```
🩺 BUILD DOCTOR MCP OUTPUT

Status: ✅ All issues resolved

📊 Summary:
- Fixed: 23 issues
- Failed: 0 issues
- Skipped: 2 issues

✅ Fixed Issues:

📁 src/components/Button.tsx
   Fixed JSX: Duplicate prop 'className'
   Before: <Button className="primary" onClick={handleClick} className="btn" />
   After:  <Button className="primary" onClick={handleClick} />

📁 src/utils/helpers.ts
   Fixed TS7006: Parameter implicitly has 'any' type
   Before: export function processData(data) {
   After:  export function processData(data: any) {

🔍 Lint/Build Checks: PASS ✅
  ✓ Package.json Validation: Valid package.json
  ✓ Dependency Check: All dependencies installed
  ✓ ESLint Check: No linting errors
  ✓ TypeScript Check: No type errors
  ✓ Build: Build completed successfully

💡 Preventative Suggestions:
1. Enable pre-commit hooks with: npx husky add .husky/pre-commit "npm run lint"
2. Add TypeScript strict mode in tsconfig.json
3. Configure ESLint auto-fix on save in your IDE
4. Run 'npm run build' before every commit
```

## License

Part of the AI Guided SaaS project.