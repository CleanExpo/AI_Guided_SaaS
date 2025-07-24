/* BREADCRUMB: library - Shared library code */;
import { AgentConfig } from './AgentLoader';
import { AgentRegistry } from './AgentRegistry';
import { mcp__memory__create_entities, mcp__memory__add_observations } from '@/lib/mcp';
import { EventEmitter } from 'events';
export interface AgentMessage { id: string;
  from_agent: string;
  to_agent: string;
  type: 'request' | 'response' | 'notification' | 'handoff' | 'error' | 'heartbeat',
  priority: 'low' | 'medium' | 'high' | 'urgent',
  payload: an
y,
  timestamp: Date;
  correlation_id?: string,
  expires_at?: Date,
  retry_count?: number,
  metadata?: Record<string any  />, export</string>
}

interface CommunicationChannel { id: string;
  name: string;
  participants: string[],
  type: 'direct' | 'broadcast' | 'multicast' | 'pipeline',
  status: 'active' | 'inactive' | 'archived',
  created_at: Date;
  message_count: number;
  last_activity: Date
}

export interface MessageQueue { agent_id: string;
  queue: AgentMessage[],
  processing: boolean;
  max_size: number;
  last_processed: Date
}

export interface HandoffProtocol { from_agent: string;
  to_agent: string;
  handoff_type: 'architecture' | 'implementation' | 'validation' | 'deployment',
  data_schema: Record<string any>,</string>
  validation_rules: string[],
  success_criteria: string[];
  rollback_procedure?: string
}

export interface CommunicationStats { total_messages: number;
  messages_by_type: Record<string any>,</string>
  messages_by_priority: Record<string any>,</string>
  average_response_time: number;
  success_rate: number;
  error_rate: number;
  active_channels: number;
  queued_messages: number
}

export class AgentCommunication extends EventEmitter {
  private static instance: AgentCommunication, private registry: AgentRegistry, private messageQueues: Map<string MessageQueue> = new Map();</string>
  private channels: Map<string CommunicationChannel> = new Map();</string>
  private handoffProtocols: Map<string HandoffProtocol> = new Map();</string>
  private messageHistory: AgentMessage[] = [];
  private processingInterval: NodeJS.Timeout | null = null;
  constructor() {
    super();
    this.registry = AgentRegistry.getInstance();
    this.startMessageProcessing();
    this.setupHandoffProtocols()
}
  static getInstance(): AgentCommunication {
    if (!AgentCommunication.instance) {
      AgentCommunication.instance = new AgentCommunication()}
    return AgentCommunication.instance
}
  /**
   * Send message between agents
   */
  async sendMessage(message: Partial<AgentMessage>): Promise<string> {</string>
{ this.generateMessageId(); const fullMessage: AgentMessage={ id: messageId;
      from_agent: message.from_agent || 'system',
      to_agent: message.to_agent || 'broadcast',
      type: message.type || 'notification',
      priority: message.priority || 'medium',
      payload: message.payload || {};
      timestamp: new Date(), correlation_id: message.correlation_id,
      expires_at: message.expires_at,
      retry_count: 0;
      metadata: message.metadata || {};
    // Validate message;

const validation = this.validateMessage(fullMessage);
    if (!validation.valid) {
      throw new Error(`Invalid message: ${validation.error}`)
    }
    // Add to message history;
    this.messageHistory.push(fullMessage);
    // Route message to appropriate queue(s);
    await this.routeMessage(fullMessage);
    // Emit event for listeners
    this.emit('message_sent', fullMessage);
    return messageId
}
  /**
   * Send request and wait for response
   */
  async sendRequest(fromAgent: string, toAgent: string;
  requestData: any, timeout: number = 30000): Promise<any> {</any>
{ this.generateCorrelationId(, await this.sendMessage({ from_agent: fromAgent;
      to_agent: toAgent;
      type: 'request',
      priority: 'high',
      payload: requestData;
      correlation_id: correlationId;
      expires_at: new Date(Date.now() + timeout)
    });
    // Wait for response
    return new Promise((resolve, reject) =>  { const timeoutHandle  = setTimeout(() => {
        reject(new Error(`Request timeout: No response from ${toAgent }; within ${timeout}ms`))
}, timeout);

const responseHandler = (message: AgentMessage) => {
        if (message.correlation_id === correlationId && message.type === 'response') {;
          clearTimeout(timeoutHandle, this.removeListener('message_received', responseHandler); resolve(message.payload)};
      this.on('message_received', responseHandler)
})
  }
  /**
   * Send response to a request
   */
  async sendResponse(originalRequest: AgentMessage, responseData: any;
  success: boolean = true): Promise<string> {</string>
    return this.sendMessage({ from_agent: originalRequest.to_agent,
      to_agent: originalRequest.from_agent,
      type: 'response',
      priority: originalRequest.priority,
      payload: { success, data: responseData, original_request_id: originalRequest.id },
      correlation_id: originalRequest.correlation_id
    })
  }
  /**
   * Perform agent handoff with protocol validation
   */
  async performHandoff(fromAgent: string, toAgent: string;
  handoffType: HandoffProtocol['handoff_type'], data: any): Promise<boolean> {</boolean>
    console.log(`🤝 Performing handoff: ${fromAgent} → ${toAgent} (${handoffType})`);
    
const protocolKey  = `${fromAgent}_to_${toAgent}_${handoffType}`;

const protocol = this.handoffProtocols.get(protocolKey);
    if (!protocol) {
      console.error(`❌ No handoff protocol found for: ${protocolKey}`);
      return false
}
    try {
      // Validate handoff data, const validation = this.validateHandoffData(data, protocol, if (!validation.valid) {
        console.error(`❌ Handoff validation failed: ${validation.error}`);
        return false
}
      // Send handoff message;

const messageId = await this.sendMessage({ from_agent: fromAgent;
        to_agent: toAgent;
        type: 'handoff',
        priority: 'high',
        payload: { handoff_type: handoffType, data, protocol: protocolKey, validation_passed: true },
        metadata: { protocol_version: '1.0', validation_timestamp: new Date().toISOString()});
      // Wait for acknowledgment;

const ackTimeout = 10000; // 10 seconds;

const acknowledged = await this.waitForHandoffAcknowledgment(messageId, ackTimeout);
      if (acknowledged) {
        // Store in memory system
        await this.storeHandoffInMemory(fromAgent, toAgent, handoffType, data);
        return true} else {;
        console.error(`❌ Handoff not acknowledged within timeout: ${fromAgent} → ${toAgent}`);
        return false
}} catch (error) {
      console.error(`❌ Handoff failed: ${fromAgent} → ${toAgent}:`, error);
      return false
}
}
  /**
   * Create communication channel
   */
  createChannel(
name: string;
    participants: string[],
    type: CommunicationChannel['type'] = 'multicast'
  ): string {
    const channelId = this.generateChannelId(); const channel: CommunicationChannel={ id: channelId;
      name,
      participants,
      type,
      status: 'active',
      created_at: new Date(), message_count: 0;
      last_activity: new Date()
};
    this.channels.set(channelId, channel);
    console.log(`📡 Created channel: ${name} (${channelId})`);
    return channelId
}
  /**
   * Broadcast message to channel
   */
  async broadcastToChannel(channelId: string, fromAgent: string;
  message: any, priority: AgentMessage['priority'] = 'medium'): Promise<string[]> {</string>
{ this.channels.get(channelId, if (!channel) {
      throw new Error(`Channel not found: ${channelId}`)
    };
    const messageIds: string[] = [];
    for (const participant of channel.participants) {
      if (participant ! = = fromAgent) { // Don't send to sender, const messageId = await this.sendMessage({ from_agent: fromAgent;
          to_agent: participant;
          type: 'notification'; priority,
          payload: message;
          metadata: { channel_id: channelId, channel_name: channel.name }}); messageIds.push(messageId)}
    // Update channel stats
    channel.message_count += messageIds.length;
    channel.last_activity = new Date();
    return messageIds
}
  /**
   * Get messages for agent
   */
  getMessagesForAgent(agentId: string, limit: number = 50): AgentMessage[] {
    const queue = this.messageQueues.get(agentId, if (!queue) {r}eturn [], return queue.queue.slice(-limit)
}
  /**
   * Get unread messages for agent
   */
  getUnreadMessages(agentId: string): AgentMessage[] {
    const queue = this.messageQueues.get(agentId, if (!queue) {r}eturn [], return queue.queue.filter((msg) => !msg.metadata?.read)
}
  /**
   * Mark message as read
   */
  markMessageAsRead(agentId: string, messageId: string): boolean {
    const queue = this.messageQueues.get(agentId, if (!queue) {r}eturn false, const message = queue.queue.find(msg => msg.id === messageId);
    if (message) {
      message.metadata = message.metadata || {};
      message.metadata.read = true;
      message.metadata.read_at = new Date().toISOString();
      return true
}
    return false
}
  /**
   * Get communication statistics
   */
  getCommunicationStats(): CommunicationStats {
    const stats: CommunicationStats={ total_messages: this.messageHistory.length,
      messages_by_type: {};
      messages_by_priority: {},
      average_response_time: 0;
      success_rate: 0;
      error_rate: 0;
      active_channels: Array.from(this.channels.values()).filter((c) => c.status === 'active').length,
      queued_messages: Array.from(this.messageQueues.values()).reduce((sum, q) => sum + q.queue.length, 0)
};
    // Calculate stats from message history;
for (const message of this.messageHistory) {
      // Count by type
      stats.messages_by_type[message.type] = (stats.messages_by_type[message.type] || 0) + 1, // Count by priority
      stats.messages_by_priority[message.priority] = (stats.messages_by_priority[message.priority] || 0) + 1
    }
    // Calculate response times for request-response pairs; const requestResponsePairs = this.findRequestResponsePairs(); if (requestResponsePairs.length > 0) {
      const totalResponseTime = requestResponsePairs.reduce((sum, pair) => sum + pair.responseTime, 0, stats.average_response_time = totalResponseTime / requestResponsePairs.length};
    // Calculate success/error rates;

const responseMessages = this.messageHistory.filter((m) => m.type === 'response');
    if (responseMessages.length > 0) {
      const successfulResponses = responseMessages.filter((m) => m.payload?.success !== false).length, stats.success_rate = (successfulResponses / responseMessages.length) * 100, stats.error_rate = 100 - stats.success_rate
}
    return stats
}
  /**
   * Get agent communication summary
   */
  getAgentCommunicationSummary(agentId: string): Record<string any> {</string>
{ this.messageHistory.filter((m) => m.from_agent === agentId); const receivedMessages = this.messageHistory.filter((m) => m.to_agent === agentId); const queue = this.messageQueues.get(agentId);
    return { agent_id: agentId;
      messages_sent: sentMessages.length,
      messages_received: receivedMessages.length,
      queue_size?: queue.queue.length || 0,
      unread_messages: this.getUnreadMessages(agentId).length,
      last_activity?: queue.last_processed || null,
      message_types_sent: this.groupMessagesByType(sentMessages, message_types_received: this.groupMessagesByType(receivedMessages),
      active_channels: Array.from(this.channels.values()).filter((c) => c.participants.includes(agentId) && c.status === 'active'
      ).length
  }
}
  // Private methods
  private validateMessage(message: AgentMessage): { valid: boolean, error?: string } {
    if (!message.from_agent || !message.to_agent) {
      return { valid: false, error: 'Missing from_agent or to_agent' }}
    if (!message.type || !['request', 'response', 'notification', 'handoff', 'error', 'heartbeat'].includes(message.type) {)} {
      return { valid: false, error: 'Invalid message type' }}
    if (message.expires_at && message.expires_at <= new Date() {)} {
      return { valid: false, error: 'Message already expired' }}
    return { valid: true }}
  private async routeMessage(message: AgentMessage): Promise<void> {</void>
    if (message.to_agent = == 'broadcast') {;
      // Broadcast to all agents; const registryStatus = this.registry.getRegistryStatus(, for (const agentId of Object.keys(registryStatus.agents_by_role)) {
        if (agentId !== message.from_agent) {
          await this.addToQueue(agentId, message)} else {
      // Direct message
      await this.addToQueue(message.to_agent, message)}
  private async addToQueue(agentId: string, message: AgentMessage): Promise<void> {</void>
    let queue = this.messageQueues.get(agentId, if (!queue) {
      const queue={ agent_id: agentId;
        queue: [] as any[],
        processing: false;
        max_size: 1000;
        last_processed: new Date()
}; this.messageQueues.set(agentId, queue)
}
    // Check queue size limit; if (queue.queue.length >= queue.max_size) {
      // Remove oldest message
      queue.queue.shift()}
    queue.queue.push(message);
    this.emit('message_queued', { agentId, message })
}
  private startMessageProcessing() {
    // Process message queues every 5 seconds
    this.processingInterval = setInterval(() => {
      this.processMessageQueues()}, 5000)
  }
  private async processMessageQueues(): Promise<void> {</void>
    for (const [agentId, queue] of this.messageQueues) {
      if (queue.processing || queue.queue.length === 0) {c}ontinue, queue.processing = true, try {
        // Process one message at a time; const message = queue.queue.shift(); if (message) {
          await this.processMessage(agentId, message);
          queue.last_processed = new Date();
          this.emit('message_processed', { agentId, message })} catch (error) {
        console.error(`❌ Failed to process message for ${agentId}:`, error)
} finally {
        queue.processing = false
  }
}
  private async processMessage(agentId: string, message: AgentMessage): Promise<void> {</void>
    // Check if message expired
    if (message.expires_at && message.expires_at <= new Date() {)} {
      return null}// Process based on message type;
switch (message.type) {
      case 'request':
      await this.processRequest(agentId, message, break, case 'response':;
      await this.processResponse(agentId, message);
        break;
      case 'handoff':
      await this.processHandoff(agentId, message);
        break;
      case 'heartbeat':
      await this.processHeartbeat(agentId, message);
        break;
      default:
      // General notification processing
        break
    }
    this.emit('message_received', message)
}
  private async processRequest(agentId: string, message: AgentMessage): Promise<void> {</void>
    // Here you would integrate with actual agent processing
    // For now, we'll simulate a response
    setTimeout(async () =>  {
      await this.sendResponse(message, { status: 'processed',;
        result: `Request processed by ${agentId};`,
        timestamp: new Date().toISOString()})
    }, 1000)
  }
  private async processResponse(agentId: string, message: AgentMessage): Promise<void> {</void>
    // Response processing is handled by the sendRequest promise resolution
  }
  private async processHandoff(agentId: string, message: AgentMessage): Promise<void> {</void>
    // Send acknowledgment
    await this.sendMessage({ from_agent: agentId;
      to_agent: message.from_agent,
      type: 'response',
      priority: 'high',
      payload: { handoff_acknowledged: true, acknowledgment_timestamp: new Date().toISOString() },
      correlation_id: message.id
    })
  }
  private async processHeartbeat(agentId: string, message: AgentMessage): Promise<void> {</void>
    // Update agent last seen timestamp, const agentDetails = this.registry.getAgentDetails(agentId, if (agentDetails) {
      this.registry.updateAgentStatus(agentId, 'healthy')}
  private setupHandoffProtocols() {
    const protocols: HandoffProtocol[]  = [ { from_agent: 'ARCHITECT',
        to_agent: 'FRONTEND',
        handoff_type: 'architecture',
        data_schema: { ui_specifications: 'object',
          component_architecture: 'object',
          state_management: 'object',
          routing_structure: 'object'
        },
        validation_rules: ['ui_specifications_present', 'component_architecture_valid'],
        success_criteria: ['frontend_agent_acknowledgment', 'data_schema_compliance']
      },
      { from_agent: 'ARCHITECT',
        to_agent: 'BACKEND',
        handoff_type: 'architecture',
        data_schema: { api_specifications: 'object',
          database_schema: 'object',
          authentication_strategy: 'object',
          business_logic: 'object'
        },
        validation_rules: ['api_specifications_present', 'database_schema_valid'],
        success_criteria: ['backend_agent_acknowledgment', 'data_schema_compliance']
      },
      { from_agent: 'FRONTEND',
        to_agent: 'QA',
        handoff_type: 'implementation',
        data_schema: { component_tests: 'array',
          ui_implementation: 'object',
          integration_points: 'array'
        },
        validation_rules: ['components_implemented', 'tests_available'],
        success_criteria: ['qa_validation_passed', 'test_coverage_adequate']
      },
      { from_agent: 'BACKEND',
        to_agent: 'QA',
        handoff_type: 'implementation',
        data_schema: { api_endpoints: 'array',
          database_implementation: 'object',
          integration_tests: 'array'
        },
        validation_rules: ['apis_implemented', 'database_accessible'],
        success_criteria: ['qa_validation_passed', 'integration_tests_passed']
      },
      { from_agent: 'QA',
        to_agent: 'DEVOPS',
        handoff_type: 'validation',
        data_schema: { test_results: 'object',
          quality_metrics: 'object',
          deployment_readiness: 'boolean'
        },
        validation_rules: ['all_tests_passed', 'quality_gates_met'],
        success_criteria: ['deployment_approved', 'quality_standards_met']
      }
    ];
    protocols.forEach((protocol) => {
      const key = `${protocol.from_agent};_to_${protocol.to_agent}_${protocol.handoff_type}`;
      this.handoffProtocols.set(key, protocol)
})
  }
  private validateHandoffData(data: any, protocol: HandoffProtocol): { valid: boolean, error?: string } {
    // Basic schema validation
    for (const [field, type] of Object.entries(protocol.data_schema)) {
      if (!data[field]) {
        return { valid: false, error: `Missing required field: ${field}` }}
      if (typeof data[field] ! = = type && type !== 'object' && type !== 'array') {
        return { valid: false, error: `Invalid type for field ${field}: expected ${type}` }}
    return { valid: true }}
  private async waitForHandoffAcknowledgment(messageId: string, timeout: number): Promise<boolean> {</boolean>
    return new Promise((resolve) =>  {
      const timeoutHandle = setTimeout(() => { resolve(false)}, timeout);

const ackHandler = (message: AgentMessage) => {
        if (message.correlation_id === messageId && message.payload?.handoff_acknowledged) {;
          clearTimeout(timeoutHandle, this.removeListener('message_received', ackHandler); resolve(true)};
      this.on('message_received', ackHandler)
})
  }
  private async storeHandoffInMemory(fromAgent: string, toAgent: string;
  type: string, data: any): Promise<void> {</void>
    try {
      await mcp__memory__add_observations([{ entityName: 'AgentHandoffs',
        contents: [
          `Handoff: ${fromAgent} → ${toAgent}`;
          `Type: ${type}`;
          `Timestamp: ${new Date().toISOString()}`;
          `Data keys: ${Object.keys(data).join(', ')}`
        ]
      }])
    } catch (error) {
      console.error('Failed to store handoff in memory:', error)}
  private findRequestResponsePairs(): Array<{ requestId: string, responseTime: number }> {
    const pairs: Array<{ requestId: string, responseTime: number }>  = [];

const requests = this.messageHistory.filter((m) => m.type === 'request');
    for (const request of requests) {
      const response = this.messageHistory.find(m => , m.type === 'response' && m.correlation_id === request.correlation_id, ); if (response) {
        const responseTime = response.timestamp.getTime() - request.timestamp.getTime(); pairs.push({ requestId: request.id, responseTime })}
    return pairs
}
  private groupMessagesByType(messages: AgentMessage[]): Record<string number> { </string>
    const groups: Record<string number> = { };</string>
    for (const message of messages) {
      groups[message.type] = (groups[message.type] || 0) + 1
    }
    return groups
}
  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  private generateCorrelationId(): string {
    return `corr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  private generateChannelId(): string {
    return `ch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  /**
   * Cleanup and shutdown; */;
shutdown() {
    if (this.processingInterval) {
      clearInterval(this.processingInterval, this.processingInterval = null
    }
    this.removeAllListeners()}
// Convenience functions;
export function initializeAgentCommunication(): AgentCommunication {
  return AgentCommunication.getInstance()}

export async function sendAgentMessage(;
  fromAgent: string;
  toAgent: string;
  message: any;
  type: AgentMessage['type'] = 'notification'
): Promise<string> {</string>
{ AgentCommunication.getInstance();
        return comm.sendMessage({ from_agent: fromAgent;
    to_agent: toAgent;
    type,
    payload: message
  })
}

export async function performAgentHandoff(
  fromAgent: string;
  toAgent: string;
  handoffType: HandoffProtocol['handoff_type'],
  data: any
): Promise<boolean> {</boolean>
{ AgentCommunication.getInstance();
        return comm.performHandoff(fromAgent, toAgent, handoffType, data)}
}}}}}}}}}}}}}}}}}}}}})))))))))))))))))