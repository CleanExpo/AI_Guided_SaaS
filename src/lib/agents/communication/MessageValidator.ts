import { AgentMessage, HandoffProtocol, ValidationResult } from './types';

export class MessageValidator {
  static validateMessage(message: AgentMessage): ValidationResult {
    if (!message.from_agent || !message.to_agent) {
      return { valid: false, error: 'Missing from_agent or to_agent' };
    }

    if (!message.type || !['request', 'response', 'notification', 'handoff', 'error', 'heartbeat'].includes(message.type)) {
      return { valid: false, error: 'Invalid message type' };
    }

    if (message.expires_at && message.expires_at <= new Date()) {
      return { valid: false, error: 'Message already expired' };
    }

    if (!message.priority || !['low', 'medium', 'high', 'urgent'].includes(message.priority)) {
      return { valid: false, error: 'Invalid priority level' };
    }

    return { valid: true };
  }

  static validateHandoffData(data: any, protocol: HandoffProtocol): ValidationResult {
    // Validate required fields
    if (!data || typeof data !== 'object') {
      return { valid: false, error: 'Handoff data must be an object' };
    }

    // Validate against schema
    for (const [key, expectedType] of Object.entries(protocol.data_schema)) {
      if (!(key in data)) {
        return { valid: false, error: `Missing required field: ${key}` };
      }

      const actualType = typeof data[key];
      if (actualType !== expectedType) {
        return { valid: false, error: `Field ${key} expected ${expectedType}, got ${actualType}` };
      }
    }

    // Validate against rules
    for (const rule of protocol.validation_rules) {
      try {
        // Simple rule evaluation (in production, use a proper rule engine)
        const result = this.evaluateRule(rule, data);
        if (!result) {
          return { valid: false, error: `Validation rule failed: ${rule}` };
        }
      } catch (error) {
        return { valid: false, error: `Rule evaluation error: ${error}` };
      }
    }

    return { valid: true };
  }

  private static evaluateRule(rule: string, data: any): boolean {
    // Simple rule evaluation - in production, use a proper rule engine
    try {
      // Basic pattern matching for common validation rules
      if (rule.includes('required') && rule.includes('not_empty')) {
        const field = rule.match(/(\w+)/)?.[1];
        return field && data[field] && data[field].toString().trim().length > 0;
      }

      if (rule.includes('min_length')) {
        const match = rule.match(/(\w+)\.min_length\((\d+)\)/);
        if (match) {
          const [, field, minLength] = match;
          return data[field] && data[field].toString().length >= parseInt(minLength);
        }
      }

      if (rule.includes('max_length')) {
        const match = rule.match(/(\w+)\.max_length\((\d+)\)/);
        if (match) {
          const [, field, maxLength] = match;
          return data[field] && data[field].toString().length <= parseInt(maxLength);
        }
      }

      // Default to true for unrecognized rules
      return true;
    } catch (error) {
      return false;
    }
  }
}