# Pre-Commit Testing Protocol

## MANDATORY VALIDATION SEQUENCE

### Phase 1: Build Validation (BLOCKING)
```bash
# 1. Clean build test
npm run build

# Expected: Zero errors, zero warnings
# If fails: HALT - Fix all build errors before proceeding
```

### Phase 2: Code Quality Validation (BLOCKING)
```bash
# 2. ESLint validation
npm run lint

# Expected: Zero errors, zero warnings
# If fails: HALT - Fix all linting errors before proceeding
```

### Phase 3: Type Safety Validation (BLOCKING)
```bash
# 3. TypeScript validation
npx tsc --noEmit

# Expected: Zero type errors
# If fails: HALT - Fix all type errors before proceeding
```

### Phase 4: Automated Fixes (AUTO-APPLY)
```bash
# 4. Auto-fix common issues
npm run lint:fix
npm run format

# Expected: Auto-fixes applied
# Manual review required for complex issues
```

## CRITICAL ERROR PATTERNS TO CHECK

### 1. React Hook Dependencies
```typescript
// ❌ BLOCKING ERROR
useEffect(() => {
  loadData();
}, []); // Missing 'loadData' dependency

// ✅ CORRECT
const loadData = useCallback(async () => {
  // implementation
}, []);

useEffect(() => {
  loadData();
}, [loadData]);
```

### 2. TypeScript Any Types
```typescript
// ❌ BLOCKING ERROR
const data: any = response;

// ✅ CORRECT
interface ResponseData {
  id: string;
  name: string;
}
const data: ResponseData = response;
```

### 3. Unused Variables/Imports
```typescript
// ❌ BLOCKING ERROR
import { Filter, Heart, Share2 } from 'lucide-react'; // Unused imports

// ✅ CORRECT
import { Search } from 'lucide-react'; // Only used imports
```

### 4. Image Optimization
```tsx
// ❌ BLOCKING ERROR
<img src="/logo.png" alt="Logo" />

// ✅ CORRECT
import Image from 'next/image';
<Image src="/logo.png" alt="Logo" width={100} height={100} />
```

## AUTOMATED AGENT VALIDATION

### Agent Checklist (All Must Pass):
- [ ] **Build-Sync Agent**: `npm run build` succeeds
- [ ] **ESLint Agent**: Zero linting errors
- [ ] **Type-Safety Agent**: Zero TypeScript errors
- [ ] **Dependency Agent**: All useEffect dependencies included
- [ ] **Image Optimization Agent**: No `<img>` tags
- [ ] **Import Cleanup Agent**: No unused imports

### Agent Enforcement Commands:
```bash
# Run all agent validations
npm run agents:validate

# Force agent compliance
npm run agents:enforce

# Agent status check
npm run agents:status
```

## COMMIT BLOCKING CONDITIONS

### IMMEDIATE HALT CONDITIONS:
1. **Build Failure**: `npm run build` returns non-zero exit code
2. **ESLint Errors**: Any ESLint errors present
3. **TypeScript Errors**: Any type errors present
4. **Missing Dependencies**: useEffect missing dependencies
5. **Any Types**: Explicit `any` types found
6. **Unused Code**: Unused variables or imports
7. **Image Issues**: `<img>` tags instead of `<Image />`

### COMMIT APPROVAL PROCESS:
```bash
# 1. Pre-commit validation
npm run pre-commit:validate

# 2. Agent approval
npm run agents:approve

# 3. Final build check
npm run build:production

# 4. Commit allowed
git commit -m "message"
```

## ERROR RESOLUTION WORKFLOW

### 1. Build Errors
```bash
# Check build output
npm run build 2>&1 | tee build-errors.log

# Common fixes:
# - Fix TypeScript errors
# - Add missing dependencies
# - Remove unused imports
# - Replace any types
```

### 2. ESLint Errors
```bash
# Check linting output
npm run lint 2>&1 | tee lint-errors.log

# Auto-fix where possible
npm run lint:fix

# Manual fixes required for:
# - Complex type issues
# - Logic errors
# - Architecture violations
```

### 3. Type Safety Errors
```bash
# Check TypeScript output
npx tsc --noEmit 2>&1 | tee type-errors.log

# Common fixes:
# - Replace any with proper types
# - Add type annotations
# - Fix interface definitions
# - Resolve import issues
```

## INTEGRATION WITH HUSKY

### Pre-commit Hook Configuration:
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Agent validation
npm run agents:validate || exit 1

# Build validation
npm run build || exit 1

# Lint validation
npm run lint || exit 1

# Type validation
npx tsc --noEmit || exit 1

echo "✅ All validations passed - commit approved"
```

## EMERGENCY BYPASS

### Manual Override (Use Sparingly):
```bash
# Emergency commit (bypasses agents)
git commit --no-verify -m "EMERGENCY: Critical fix"

# Must be followed by immediate fix commit
git commit -m "fix: Restore agent compliance after emergency"
```

### Override Conditions:
- Production outage requiring immediate fix
- Security vulnerability requiring urgent patch
- Critical dependency update
- **MUST** be followed by compliance restoration

## MONITORING & REPORTING

### Agent Activity Logging:
- **Location**: `reports/agent-activity.log`
- **Format**: Timestamp, Agent, Action, Result
- **Retention**: 30 days

### Validation Metrics:
- **Build Success Rate**: Target 100%
- **Lint Compliance**: Target 100%
- **Type Safety**: Target 100%
- **Agent Response Time**: Target <5 seconds

### Daily Reports:
- **Validation Summary**: Daily validation statistics
- **Error Patterns**: Common error analysis
- **Agent Performance**: Agent efficiency metrics
- **Compliance Trends**: Historical compliance data

---

**ENFORCEMENT**: This protocol is MANDATORY and enforced by the agent system. Non-compliance results in commit blocking and escalation to project maintainers.
