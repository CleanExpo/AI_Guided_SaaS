# Real Data Enforcer MCP

The Real Data Enforcer MCP is the **ultimate no-nonsense validation system** that ensures every suggestion, code fix, project insight, or decision delivered by any MCP or agent in the ecosystem is based entirely on **direct, verifiable evidence** from real source data.

## 🔍 Core Mission

**Zero tolerance for AI hallucinations, speculation, or "best guesses"** - only hard evidence passes the gate.

## 🎯 Best Practices (Built-In)

- **Always prefer "no action" over speculative action**
- **All explanations must cite where the information/data came from** - nothing is asserted without a traceable source
- **Never allow silent auto-fixes or "best guess" logic** - only hard proof

## 🛠️ How to Use Real Data Enforcer MCP

### 1. As Pre-Merge Gate in CI/CD
Make it the **last step** in any automated pipeline - no automated fix, design decision, or project analysis gets applied unless it passes the Evidence Gate.

```bash
# In your CI pipeline
npm run validate-all-changes
node scripts/run-real-data-enforcer.js
```

### 2. As Pre-Release Checker
Connect it to your MCP suite for final validation:

```javascript
// Example: Validate before deployment
const validation = await mcpClient.callTool('validate_agent_output', {
  agent_source: 'build-doctor-mcp',
  proposed_action: 'Apply TypeScript fixes to 127 files',
  evidence: {
    sources: [
      {
        type: 'build_output',
        expected_content: 'compilation successful'
      },
      {
        type: 'file_content',
        file_path: 'src/components/fixed-component.tsx',
        expected_content: 'export default function'
      }
    ]
  }
});

if (validation.action !== 'accepted') {
  throw new Error('Evidence validation failed - deployment blocked');
}
```

### 3. Review Audit Trails
Verify (or debug) any fix, insight, or action taken by your agentic ecosystem:

```bash
# Get comprehensive audit report
node scripts/run-real-data-enforcer.js --audit-report
```

## 🔧 Available Tools

### `validate_agent_output`
Validates any agent output with evidence-based verification.

**Input:**
- `agent_source`: Source agent or MCP name
- `proposed_action`: Description of the proposed action  
- `evidence`: Object containing evidence sources

**Output:**
- `action`: 'accepted' | 'rejected' | 'deferred'
- `evidence_used`: Array of verified evidence chains
- `verification_status`: Summary of verification results
- `trace_id`: Unique identifier for audit trail
- `flags`: Any warnings or issues detected
- `reasoning`: Detailed explanation with source citations

### `get_audit_report`
Get comprehensive audit report of all validations with statistics and recent activity.

### `verify_build_state`
Verify current build state with evidence from linting, tests, and compilation.

## 🏗️ Evidence Types Supported

- **file_content**: Verify file exists and contains expected content
- **build_output**: Verify build/compilation succeeds
- **error_log**: Verify error logs and typecheck output
- **test_result**: Verify test execution results

## 📊 Example Validation Flow

```
🔍 REAL DATA ENFORCER VALIDATION RESULT

Action: ACCEPTED
Trace ID: RDE-1704123456789-a1b2c3d4
Verification: Verified: 3, Failed: 0, Pending: 0

Evidence Used:
- file_content: verified
  Data: Verified: src/components/ChatPage.tsx (8,245 chars)
  Reference: src/components/ChatPage.tsx

- build_output: verified  
  Data: Build successful: Compiled successfully
  Reference: BUILD_SUCCESS

- error_log: verified
  Data: No errors found
  Reference: TYPECHECK_OUTPUT

Flags: None

Reasoning: All evidence chains verified successfully. Sources: src/components/ChatPage.tsx, BUILD_SUCCESS, TYPECHECK_OUTPUT. Action approved with full traceability.
```

## 🛡️ Result: Bulletproof Automation

Your automation is now **bulletproof** - every move is grounded in true, auditable, verifiable data. No AI can "pretend," fake, or shortcut its way into your codebase or workflows. **Only reality-based, fact-checked improvements get shipped.**

## 🚀 Installation & Deployment

```bash
# Build and install
cd mcp/real-data-enforcer
npm install
npm run build

# Run standalone
npm run start

# Run via launcher script
node scripts/run-real-data-enforcer.js
```

## 📋 Audit Log

All validations are logged to `.rde-audit.json` with full traceability:

- Timestamp and trace ID
- Agent source and proposed action
- Evidence chains and verification results
- Flags and detailed reasoning
- Full audit trail for compliance

---

**The Real Data Enforcer MCP: Because reality is the only acceptable input.**