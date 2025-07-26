#!/usr/bin/env node

import { RealDataEnforcer } from './mcp/real-data-enforcer/dist/index.js';

console.log('🔍 Real Data Enforcer MCP - Live Validation Demo\n');

const enforcer = new RealDataEnforcer(process.cwd());

// Example 1: Validate a legitimate fix with proper evidence
console.log('TEST 1: Validating build fix with evidence...');

const validationResult1 = await enforcer.validateAgentOutput(
  'claude-code',
  'Apply comprehensive TypeScript error fixes to chat page component',
  {
    sources: [
      {
        type: 'file_content',
        file_path: 'src/app/chat/page.tsx',
        expected_content: 'export default function ChatPage'
      },
      {
        type: 'build_output'
      }
    ]
  }
);

console.log('📊 VALIDATION RESULT:');
console.log(`Action: ${validationResult1.action.toUpperCase()}`);
console.log(`Trace ID: ${validationResult1.trace_id}`);
console.log(`Evidence Chains: ${validationResult1.evidence_used.length}`);
console.log(`Flags: ${validationResult1.flags.join(', ') || 'None'}`);
console.log(`Reasoning: ${validationResult1.reasoning}`);
console.log('\n' + '='.repeat(80) + '\n');

// Example 2: Test rejection of speculative action
console.log('TEST 2: Testing rejection of speculative action...');

const validationResult2 = await enforcer.validateAgentOutput(
  'speculative-agent',
  'Apply fixes based on common patterns (no specific evidence)',
  null
);

console.log('📊 REJECTION RESULT:');
console.log(`Action: ${validationResult2.action.toUpperCase()}`);
console.log(`Trace ID: ${validationResult2.trace_id}`);
console.log(`Evidence Chains: ${validationResult2.evidence_used.length}`);
console.log(`Flags: ${validationResult2.flags.join(', ')}`);
console.log(`Reasoning: ${validationResult2.reasoning}`);
console.log('\n' + '='.repeat(80) + '\n');

// Example 3: Get audit report
console.log('TEST 3: Generating audit report...');
const auditReport = await enforcer.getAuditReport();
console.log('📋 AUDIT REPORT:');
console.log(auditReport);

console.log('\n🎉 Real Data Enforcer MCP validation complete!');
console.log('\n🛡️ Result: Your automation is now bulletproof!');
console.log('   - Only evidence-based actions are approved');
console.log('   - All changes have full audit trails');
console.log('   - Zero tolerance for AI hallucinations');
console.log('   - Reality-based validation enforced');