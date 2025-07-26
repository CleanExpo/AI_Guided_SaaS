#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
  CallToolRequestSchema, 
  ListToolsRequestSchema,
  Tool 
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import * as fs from 'fs-extra';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as crypto from 'crypto';

const execAsync = promisify(exec);

interface EvidenceChain {
  id: string;
  timestamp: string;
  source_type: 'error_log' | 'code_snippet' | 'build_output' | 'test_result' | 'documentation' | 'file_content';
  source_data: string;
  verification_status: 'verified' | 'failed' | 'pending';
  trace_reference: string;
}

interface ValidationResult {
  action: 'accepted' | 'rejected' | 'deferred';
  evidence_used: EvidenceChain[];
  verification_status: string;
  trace_id: string;
  flags: string[];
  reasoning: string;
}

interface AuditEntry {
  trace_id: string;
  timestamp: string;
  agent_source: string;
  proposed_action: string;
  validation_result: ValidationResult;
  evidence_chains: EvidenceChain[];
}

export class RealDataEnforcer {
  private auditLog: AuditEntry[] = [];
  private projectRoot: string;
  private evidenceCache: Map<string, EvidenceChain> = new Map();

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
    this.loadAuditLog();
  }

  private generateTraceId(): string {
    return `RDE-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  }

  private async loadAuditLog(): Promise<void> {
    const auditPath = path.join(this.projectRoot, '.rde-audit.json');
    try {
      if (await fs.pathExists(auditPath)) {
        this.auditLog = await fs.readJson(auditPath);
      }
    } catch (error) {
      console.error('Error loading audit log:', error);
    }
  }

  private async saveAuditLog(): Promise<void> {
    const auditPath = path.join(this.projectRoot, '.rde-audit.json');
    try {
      await fs.writeJson(auditPath, this.auditLog, { spaces: 2 });
    } catch (error) {
      console.error('Error saving audit log:', error);
    }
  }

  async validateAgentOutput(
    agentSource: string,
    proposedAction: string,
    providedEvidence: any
  ): Promise<ValidationResult> {
    const traceId = this.generateTraceId();
    const evidenceChains: EvidenceChain[] = [];
    const flags: string[] = [];

    // Step 1: Validate evidence chains
    if (!providedEvidence || typeof providedEvidence !== 'object') {
      flags.push('NO_EVIDENCE_PROVIDED');
      return {
        action: 'rejected',
        evidence_used: [],
        verification_status: 'FAILED - No verifiable evidence provided',
        trace_id: traceId,
        flags,
        reasoning: 'Agent output rejected: No concrete evidence or data sources provided'
      };
    }

    // Step 2: Verify each piece of evidence
    for (const evidence of providedEvidence.sources || []) {
      const evidenceChain = await this.verifyEvidence(evidence);
      evidenceChains.push(evidenceChain);
      
      if (evidenceChain.verification_status === 'failed') {
        flags.push(`EVIDENCE_VERIFICATION_FAILED_${evidenceChain.id}`);
      }
    }

    // Step 3: Cross-reference with build/test outputs
    const buildVerification = await this.verifyBuildState();
    if (buildVerification.verification_status === 'failed') {
      flags.push('BUILD_VERIFICATION_FAILED');
    }
    evidenceChains.push(buildVerification);

    // Step 4: Make validation decision (Best Practice: No silent auto-fixes)
    const failedEvidence = evidenceChains.filter(e => e.verification_status === 'failed');
    const verifiedEvidence = evidenceChains.filter(e => e.verification_status === 'verified');
    
    // Require explicit evidence for ALL changes - no "best guess" logic
    let action: 'accepted' | 'rejected' | 'deferred';
    
    if (verifiedEvidence.length === 0) {
      flags.push('NO_VERIFIED_EVIDENCE');
      action = 'rejected';
    } else if (failedEvidence.length === 0 && verifiedEvidence.length > 0) {
      action = 'accepted';
    } else {
      flags.push('MIXED_EVIDENCE_QUALITY');
      action = 'deferred'; // Require human review for mixed evidence
    }

    const result: ValidationResult = {
      action,
      evidence_used: evidenceChains,
      verification_status: this.getVerificationStatusSummary(evidenceChains),
      trace_id: traceId,
      flags,
      reasoning: this.generateReasoning(action, evidenceChains, flags)
    };

    // Step 5: Log to audit trail
    const auditEntry: AuditEntry = {
      trace_id: traceId,
      timestamp: new Date().toISOString(),
      agent_source: agentSource,
      proposed_action: proposedAction,
      validation_result: result,
      evidence_chains: evidenceChains
    };

    this.auditLog.push(auditEntry);
    await this.saveAuditLog();

    return result;
  }

  private async verifyEvidence(evidenceData: any): Promise<EvidenceChain> {
    const evidenceId = this.generateTraceId();
    
    try {
      switch (evidenceData.type) {
        case 'file_content':
          return await this.verifyFileContent(evidenceId, evidenceData);
        case 'build_output':
          return await this.verifyBuildOutput(evidenceId, evidenceData);
        case 'error_log':
          return await this.verifyErrorLog(evidenceId, evidenceData);
        case 'test_result':
          return await this.verifyTestResult(evidenceId, evidenceData);
        default:
          return {
            id: evidenceId,
            timestamp: new Date().toISOString(),
            source_type: 'documentation',
            source_data: JSON.stringify(evidenceData),
            verification_status: 'failed',
            trace_reference: 'UNKNOWN_EVIDENCE_TYPE'
          };
      }
    } catch (error) {
      return {
        id: evidenceId,
        timestamp: new Date().toISOString(),
        source_type: 'documentation',
        source_data: `Error: ${error}`,
        verification_status: 'failed',
        trace_reference: 'VERIFICATION_ERROR'
      };
    }
  }

  private async verifyFileContent(evidenceId: string, evidenceData: any): Promise<EvidenceChain> {
    const filePath = path.resolve(this.projectRoot, evidenceData.file_path);
    
    try {
      if (!await fs.pathExists(filePath)) {
        return {
          id: evidenceId,
          timestamp: new Date().toISOString(),
          source_type: 'file_content',
          source_data: `File not found: ${filePath}`,
          verification_status: 'failed',
          trace_reference: filePath
        };
      }

      const content = await fs.readFile(filePath, 'utf8');
      const expectedContent = evidenceData.expected_content;
      
      if (expectedContent && !content.includes(expectedContent)) {
        return {
          id: evidenceId,
          timestamp: new Date().toISOString(),
          source_type: 'file_content',
          source_data: `Content mismatch in ${filePath}`,
          verification_status: 'failed',
          trace_reference: filePath
        };
      }

      return {
        id: evidenceId,
        timestamp: new Date().toISOString(),
        source_type: 'file_content',
        source_data: `Verified: ${filePath} (${content.length} chars)`,
        verification_status: 'verified',
        trace_reference: filePath
      };
    } catch (error) {
      return {
        id: evidenceId,
        timestamp: new Date().toISOString(),
        source_type: 'file_content',
        source_data: `Error reading ${filePath}: ${error}`,
        verification_status: 'failed',
        trace_reference: filePath
      };
    }
  }

  private async verifyBuildOutput(evidenceId: string, evidenceData: any): Promise<EvidenceChain> {
    try {
      const { stdout, stderr } = await execAsync('npm run build', { 
        cwd: this.projectRoot,
        timeout: 120000 
      });
      
      return {
        id: evidenceId,
        timestamp: new Date().toISOString(),
        source_type: 'build_output',
        source_data: `Build successful: ${stdout}`,
        verification_status: 'verified',
        trace_reference: 'BUILD_SUCCESS'
      };
    } catch (error: any) {
      return {
        id: evidenceId,
        timestamp: new Date().toISOString(),
        source_type: 'build_output',
        source_data: `Build failed: ${error.message}`,
        verification_status: 'failed',
        trace_reference: 'BUILD_FAILURE'
      };
    }
  }

  private async verifyErrorLog(evidenceId: string, evidenceData: any): Promise<EvidenceChain> {
    try {
      const { stdout, stderr } = await execAsync('npm run typecheck', { 
        cwd: this.projectRoot,
        timeout: 60000 
      });
      
      const hasErrors = stderr.includes('error') || stdout.includes('error');
      
      return {
        id: evidenceId,
        timestamp: new Date().toISOString(),
        source_type: 'error_log',
        source_data: hasErrors ? stderr || stdout : 'No errors found',
        verification_status: hasErrors ? 'verified' : 'failed',
        trace_reference: 'TYPECHECK_OUTPUT'
      };
    } catch (error: any) {
      return {
        id: evidenceId,
        timestamp: new Date().toISOString(),
        source_type: 'error_log',
        source_data: `Typecheck output: ${error.message}`,
        verification_status: 'verified',
        trace_reference: 'TYPECHECK_ERRORS'
      };
    }
  }

  private async verifyTestResult(evidenceId: string, evidenceData: any): Promise<EvidenceChain> {
    try {
      const { stdout, stderr } = await execAsync('npm test', { 
        cwd: this.projectRoot,
        timeout: 60000 
      });
      
      return {
        id: evidenceId,
        timestamp: new Date().toISOString(),
        source_type: 'test_result',
        source_data: `Tests: ${stdout}`,
        verification_status: 'verified',
        trace_reference: 'TEST_OUTPUT'
      };
    } catch (error: any) {
      return {
        id: evidenceId,
        timestamp: new Date().toISOString(),
        source_type: 'test_result',
        source_data: `Test failed: ${error.message}`,
        verification_status: 'failed',
        trace_reference: 'TEST_FAILURE'
      };
    }
  }

  private async verifyBuildState(): Promise<EvidenceChain> {
    const evidenceId = this.generateTraceId();
    
    try {
      // Quick lint check
      const { stdout, stderr } = await execAsync('npm run lint --silent', { 
        cwd: this.projectRoot,
        timeout: 30000 
      });
      
      return {
        id: evidenceId,
        timestamp: new Date().toISOString(),
        source_type: 'build_output',
        source_data: `Lint check: ${stdout || 'No output'}`,
        verification_status: 'verified',
        trace_reference: 'LINT_CHECK'
      };
    } catch (error: any) {
      return {
        id: evidenceId,
        timestamp: new Date().toISOString(),
        source_type: 'build_output',
        source_data: `Lint issues found: ${error.message}`,
        verification_status: 'failed',
        trace_reference: 'LINT_FAILURE'
      };
    }
  }

  private getVerificationStatusSummary(evidenceChains: EvidenceChain[]): string {
    const verified = evidenceChains.filter(e => e.verification_status === 'verified').length;
    const failed = evidenceChains.filter(e => e.verification_status === 'failed').length;
    const pending = evidenceChains.filter(e => e.verification_status === 'pending').length;
    
    return `Verified: ${verified}, Failed: ${failed}, Pending: ${pending}`;
  }

  private generateReasoning(action: string, evidenceChains: EvidenceChain[], flags: string[]): string {
    // Best Practice: Always prefer "no action" over speculative action
    if (action === 'accepted') {
      const sourceReferences = evidenceChains
        .filter(e => e.verification_status === 'verified')
        .map(e => e.trace_reference)
        .join(', ');
      return `All evidence chains verified successfully. Sources: ${sourceReferences}. Action approved with full traceability.`;
    } else if (action === 'rejected') {
      const failedSources = evidenceChains
        .filter(e => e.verification_status === 'failed')
        .map(e => `${e.source_type}:${e.trace_reference}`)
        .join(', ');
      return `REJECTED - Evidence verification failures: ${failedSources}. No speculative actions allowed. Flags: ${flags.join(', ')}`;
    } else {
      const pendingSources = evidenceChains
        .filter(e => e.verification_status !== 'verified')
        .map(e => e.trace_reference)
        .join(', ');
      return `DEFERRED - Insufficient evidence for automated approval. Pending verification: ${pendingSources}. Human review required. Flags: ${flags.join(', ')}`;
    }
  }

  async getAuditReport(): Promise<string> {
    const recent = this.auditLog.slice(-10);
    const accepted = this.auditLog.filter(e => e.validation_result.action === 'accepted').length;
    const rejected = this.auditLog.filter(e => e.validation_result.action === 'rejected').length;
    const deferred = this.auditLog.filter(e => e.validation_result.action === 'deferred').length;

    return `
Real Data Enforcer - Audit Report
=================================
Total Validations: ${this.auditLog.length}
Accepted: ${accepted}
Rejected: ${rejected}
Deferred: ${deferred}

Recent Activity:
${recent.map(entry => `
${entry.timestamp} - ${entry.agent_source}
Action: ${entry.validation_result.action.toUpperCase()}
Trace ID: ${entry.trace_id}
Evidence Chains: ${entry.evidence_chains.length}
Flags: ${entry.validation_result.flags.join(', ') || 'None'}
`).join('')}`;
  }
}

const server = new Server(
  {
    name: 'real-data-enforcer-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const enforcer = new RealDataEnforcer();

// Define tools
const tools: Tool[] = [
  {
    name: 'validate_agent_output',
    description: 'Validate agent output with evidence-based verification',
    inputSchema: {
      type: 'object',
      properties: {
        agent_source: {
          type: 'string',
          description: 'Source agent or MCP name'
        },
        proposed_action: {
          type: 'string',
          description: 'Description of the proposed action'
        },
        evidence: {
          type: 'object',
          description: 'Evidence supporting the proposed action',
          properties: {
            sources: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: {
                    type: 'string',
                    enum: ['file_content', 'build_output', 'error_log', 'test_result']
                  },
                  file_path: { type: 'string' },
                  expected_content: { type: 'string' }
                }
              }
            }
          }
        }
      },
      required: ['agent_source', 'proposed_action']
    }
  },
  {
    name: 'get_audit_report',
    description: 'Get comprehensive audit report of all validations',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false
    }
  },
  {
    name: 'verify_build_state',
    description: 'Verify current build state with evidence',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false
    }
  }
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    switch (name) {
      case 'validate_agent_output': {
        if (!args) throw new Error('Arguments required');
        const result = await enforcer.validateAgentOutput(
          args.agent_source as string,
          args.proposed_action as string,
          args.evidence
        );
        
        return {
          content: [
            {
              type: 'text',
              text: `
🔍 REAL DATA ENFORCER VALIDATION RESULT

Action: ${result.action.toUpperCase()}
Trace ID: ${result.trace_id}
Verification: ${result.verification_status}

Evidence Used:
${result.evidence_used.map(e => `
- ${e.source_type}: ${e.verification_status}
  Data: ${e.source_data}
  Reference: ${e.trace_reference}
`).join('')}

Flags: ${result.flags.join(', ') || 'None'}

Reasoning: ${result.reasoning}
              `
            }
          ]
        };
      }

      case 'get_audit_report': {
        const report = await enforcer.getAuditReport();
        return {
          content: [
            {
              type: 'text',
              text: report
            }
          ]
        };
      }

      case 'verify_build_state': {
        const buildEvidence = await enforcer['verifyBuildState']();
        return {
          content: [
            {
              type: 'text',
              text: `
🏗️ BUILD STATE VERIFICATION

Status: ${buildEvidence.verification_status}
Evidence: ${buildEvidence.source_data}
Reference: ${buildEvidence.trace_reference}
Timestamp: ${buildEvidence.timestamp}
              `
            }
          ]
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : String(error)}`
        }
      ],
      isError: true
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Real Data Enforcer MCP server running on stdio');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('Server error:', error);
    process.exit(1);
  });
}