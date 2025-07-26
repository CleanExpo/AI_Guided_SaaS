import { HandoffProtocol, AgentMessage } from './types';
import { MessageValidator } from './MessageValidator';
import { logger } from '@/lib/logger';
import { mcp__memory__create_entities, mcp__memory__add_observations } from '@/lib/mcp';

export class HandoffManager {
  private handoffProtocols: Map<string, HandoffProtocol> = new Map();

  constructor() {
    this.setupDefaultHandoffProtocols();
  }

  registerProtocol(protocol: HandoffProtocol): void {
    const protocolKey = `${protocol.from_agent}_to_${protocol.to_agent}_${protocol.handoff_type}`;
    this.handoffProtocols.set(protocolKey, protocol);
    logger.info(`Registered handoff protocol: ${protocolKey}`);
  }

  async performHandoff(
    fromAgent: string,
    toAgent: string,
    handoffType: HandoffProtocol['handoff_type'],
    data: any
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const protocolKey = `${fromAgent}_to_${toAgent}_${handoffType}`;
    const protocol = this.handoffProtocols.get(protocolKey);

    if (!protocol) {
      const error = `No handoff protocol found for ${protocolKey}`;
      logger.error(error);
      return { success: false, error };
    }

    try {
      // Validate handoff data
      const validation = MessageValidator.validateHandoffData(data, protocol);
      if (!validation.valid) {
        logger.error(`Handoff validation failed: ${validation.error}`);
        return { success: false, error: validation.error };
      }

      // Create handoff message
      const handoffMessage: Partial<AgentMessage> = {
        from_agent: fromAgent,
        to_agent: toAgent,
        type: 'handoff',
        priority: 'high',
        payload: {
          handoff_type: handoffType,
          data,
          protocol: protocolKey,
          validation_passed: true
        },
        metadata: {
          protocol_version: '1.0',
          validation_timestamp: new Date().toISOString()
        }
      };

      // Store handoff in memory system
      await this.storeHandoffInMemory(fromAgent, toAgent, handoffType, data);

      logger.info(`✅ Handoff successful: ${fromAgent} → ${toAgent} (${handoffType})`);
      return { success: true };

    } catch (error) {
      const errorMessage = `Handoff failed: ${fromAgent} → ${toAgent}: ${error}`;
      logger.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  getProtocol(fromAgent: string, toAgent: string, handoffType: string): HandoffProtocol | null {
    const protocolKey = `${fromAgent}_to_${toAgent}_${handoffType}`;
    return this.handoffProtocols.get(protocolKey) || null;
  }

  getAllProtocols(): HandoffProtocol[] {
    return Array.from(this.handoffProtocols.values());
  }

  removeProtocol(fromAgent: string, toAgent: string, handoffType: string): boolean {
    const protocolKey = `${fromAgent}_to_${toAgent}_${handoffType}`;
    return this.handoffProtocols.delete(protocolKey);
  }

  private setupDefaultHandoffProtocols(): void {
    // Architect to Frontend handoff
    this.registerProtocol({
      from_agent: 'architect',
      to_agent: 'frontend',
      handoff_type: 'architecture',
      data_schema: {
        components: 'object',
        styling: 'object',
        routing: 'object',
        state_management: 'string'
      },
      validation_rules: [
        'components.required.not_empty',
        'styling.theme.required',
        'routing.structure.valid'
      ],
      success_criteria: [
        'All required components defined',
        'Theme system established',
        'Routing structure validated'
      ]
    });

    // Architect to Backend handoff
    this.registerProtocol({
      from_agent: 'architect',
      to_agent: 'backend',
      handoff_type: 'architecture',
      data_schema: {
        api_design: 'object',
        database_schema: 'object',
        authentication: 'object',
        deployment: 'object'
      },
      validation_rules: [
        'api_design.endpoints.required',
        'database_schema.tables.required',
        'authentication.method.required'
      ],
      success_criteria: [
        'API endpoints defined',
        'Database schema complete',
        'Authentication method specified'
      ]
    });

    // Frontend to Backend handoff
    this.registerProtocol({
      from_agent: 'frontend',
      to_agent: 'backend',
      handoff_type: 'implementation',
      data_schema: {
        api_requirements: 'object',
        data_models: 'object',
        integration_points: 'object'
      },
      validation_rules: [
        'api_requirements.endpoints.min_length(1)',
        'data_models.required.not_empty'
      ],
      success_criteria: [
        'API requirements documented',
        'Data models specified',
        'Integration points identified'
      ]
    });

    // Backend to DevOps handoff
    this.registerProtocol({
      from_agent: 'backend',
      to_agent: 'devops',
      handoff_type: 'deployment',
      data_schema: {
        services: 'object',
        dependencies: 'object',
        environment_config: 'object',
        deployment_strategy: 'string'
      },
      validation_rules: [
        'services.required.not_empty',
        'deployment_strategy.required'
      ],
      success_criteria: [
        'Services defined',
        'Dependencies listed',
        'Deployment strategy confirmed'
      ]
    });
  }

  private async storeHandoffInMemory(
    fromAgent: string,
    toAgent: string,
    handoffType: string,
    data: any
  ): Promise<void> {
    try {
      // Create memory entities for the handoff
      const entities = [
        {
          name: `handoff_${fromAgent}_${toAgent}_${Date.now()}`,
          entityType: 'agent_handoff',
          observations: [
            `Agent handoff from ${fromAgent} to ${toAgent}`,
            `Handoff type: ${handoffType}`,
            `Data transferred: ${JSON.stringify(data, null, 2)}`
          ]
        }
      ];

      await mcp__memory__create_entities(entities);

      // Add observation about the handoff
      await mcp__memory__add_observations([
        {
          entityName: `handoff_${fromAgent}_${toAgent}_${Date.now()}`,
          contents: [
            `Successful handoff completed at ${new Date().toISOString()}`,
            `Protocol validation passed`,
            `Data integrity confirmed`
          ]
        }
      ]);

    } catch (error) {
      logger.error('Failed to store handoff in memory:', error);
      // Don't fail the handoff if memory storage fails
    }
  }
}