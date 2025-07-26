#!/usr/bin/env node

import { RealDataEnforcer } from './mcp/real-data-enforcer/dist/index.js';

console.log('🔍 Real Data Enforcer MCP - Quick Demo\n');

const enforcer = new RealDataEnforcer(process.cwd());

// Demo 1: Test with file evidence only (fast)
console.log('📝 TEST 1: Validating with file evidence...');

try {
  const result1 = await enforcer.validateAgentOutput(
    'claude-code',
    'Fix critical syntax errors in rebuilt ChatPage component',
    {
      sources: [
        {
          type: 'file_content',
          file_path: 'src/app/chat/page.tsx',
          expected_content: 'export default function ChatPage'
        }
      ]
    }
  );

  console.log('✅ VALIDATION RESULT:');
  console.log(`   Action: ${result1.action.toUpperCase()}`);
  console.log(`   Trace ID: ${result1.trace_id}`);
  console.log(`   Evidence Used: ${result1.evidence_used.length} chains`);
  console.log(`   Flags: ${result1.flags.join(', ') || 'None'}`);
  console.log(`   Status: ${result1.verification_status}`);
  console.log(`   Reasoning: ${result1.reasoning.substring(0, 100)}...`);

} catch (error) {
  console.log('❌ Validation failed:', error.message);
}

console.log('\n' + '='.repeat(80) + '\n');

// Demo 2: Test rejection of unsupported action
console.log('🚫 TEST 2: Testing rejection of speculative action...');

try {
  const result2 = await enforcer.validateAgentOutput(
    'speculative-agent',
    'Apply fixes based on AI intuition without evidence',
    null // No evidence provided
  );

  console.log('✅ REJECTION RESULT:');
  console.log(`   Action: ${result2.action.toUpperCase()}`);
  console.log(`   Trace ID: ${result2.trace_id}`);
  console.log(`   Evidence Used: ${result2.evidence_used.length} chains`);
  console.log(`   Flags: ${result2.flags.join(', ')}`);
  console.log(`   Reasoning: ${result2.reasoning}`);

} catch (error) {
  console.log('❌ Rejection test failed:', error.message);
}

console.log('\n' + '='.repeat(80) + '\n');

// Demo 3: Show audit trail
console.log('📋 TEST 3: Audit trail summary...');

try {
  const auditReport = await enforcer.getAuditReport();
  console.log(auditReport);
} catch (error) {
  console.log('❌ Audit report failed:', error.message);
}

console.log('\n🎉 Real Data Enforcer Quick Demo Complete!');
console.log('\n🛡️ Key Features Demonstrated:');
console.log('✅ Evidence-based validation with file verification');
console.log('❌ Automatic rejection of unsupported actions');
console.log('📋 Complete audit trail generation');
console.log('🔍 Traceability for all validation decisions');
console.log('\n💪 Your automation is now bulletproof - only reality-based actions get through!');