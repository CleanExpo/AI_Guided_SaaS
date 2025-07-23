import { AgentConfig } from './AgentLoader';
import { AgentRegistry } from './AgentRegistry';
import { mcp__memory__create_entities, mcp__memory__add_observations } from '@/lib/mcp';
import { EventEmitter } from 'events';
export interface AgentMessage {
  id: string,
    from_agent: string,
    to_agent: string,
    type: 'request' | 'response' | 'notification' | 'handoff' | 'error' | 'heartbeat',
  priority: 'low' | 'medium' | 'high' | 'urgent',
    payload;
    timestamp: Date;
  correlation_id?: string;
  expires_at?: Date;
  retry_count?: number;
  metadata?: Record<string, any>
};
export interface CommunicationChannel  {
  id: string,
    name: string,
    participants: string[],
    type: 'direct' | 'broadcast' | 'multicast' | 'pipeline',
  status: 'active' | 'inactive' | 'archived',
  created_at: Date,
    message_count: number,
    last_activity: Date
};
export interface MessageQueue  {
  agent_id: string,
    queue: AgentMessage[],
    processing: boolean,
    max_size: number,
    last_processed: Date
};
export interface HandoffProtocol {
  from_agent: string,
    to_agent: string,
    handoff_type: 'architecture' | 'implementation' | 'validation' | 'deployment',
  data_schema: Record<string, any>;
  validation_rules: string[],
    success_criteria: string[];
  rollback_procedure?: string;
};
export interface CommunicationStats {
  total_messages: number,
    messages_by_type: Record<string, any>;
  messages_by_priority: Record<string, any>;
  average_response_time: number,
    success_rate: number,
    error_rate: number,
    active_channels: number,
    queued_messages: number
};
export class AgentCommunication extends EventEmitter {
  private static, instance: AgentCommunication
  private, registry: AgentRegistry
  private, messageQueues: Map<string, MessageQueue> = new Map()
  private, channels: Map<string, CommunicationChannel> = new Map()
  private, handoffProtocols: Map<string, HandoffProtocol> = new Map()
  private, messageHistory: AgentMessage[] = []
  private, processingInterval: NodeJS.Timeout | null = null
  constructor() {
    super()
    this.registry = AgentRegistry.getInstance()
    this.startMessageProcessing()
    this.setupHandoffProtocols()
}
  static getInstance(): AgentCommunication {
    if(!AgentCommunication.instance) {
      AgentCommunication.instance = new AgentCommunication()
}
    return AgentCommunication.instance;
}
  /**
   * Send message between agents
   */
  async sendMessage(message: Partial<AgentMessage>): Promise {
    const _messageId = this.generateMessageId();
    const fullMessage: AgentMessage = {
  id: messageId,
    from_agent: message.from_agent || 'system',
    to_agent: message.to_agent || 'broadcast',
    type: message.type || 'notification',
    priority: message.priority || 'medium',
    payload: message.payload || {},
    timestamp: new Date(),
    correlation_id: message.correlation_id,
    expires_at: message.expires_at,
    retry_count: 0,
    metadata: message.metadata || {}
}
    // Validate message
    const validation = this.validateMessage(fullMessage);
    if(!validation.valid) {
      throw new Error(`Invalid, message: ${validation.error}`)``
}
    // Add to message history
    this.messageHistory.push(fullMessage)
    // Route message to appropriate queue(s)
    await this.routeMessage(fullMessage)
    // Emit event for listeners
    this.emit('message_sent', fullMessage)
    return messageId;
}
  /**
   * Send request and wait for response
   */
  async sendRequest(fromAgent: string, toAgent: string, requestData, timeout: number = 30000): Promise {
    const _correlationId = this.generateCorrelationId();
    await this.sendMessage({
      from_agent: fromAgent,
    to_agent: toAgent, type: 'request',
      priority: 'high',
      payload: requestData,
    correlation_id: correlationId,
    expires_at: new Date(Date.now() + timeout)
    })
    // Wait for response
    return new Promise((resolve, reject) => {;
      const _timeoutHandle = setTimeout(() => {
        reject(new Error(`Request, timeout: No response from ${toAgent} within ${timeout}ms`))``
      }, timeout)
      const _responseHandler = (message: AgentMessage) => {
        if(message.correlation_id === correlationId && message.type === 'response') {
          clearTimeout(timeoutHandle)
          this.removeListener('message_received', responseHandler)
          resolve(message.payload)
}
}
      this.on('message_received', responseHandler)
    })
}
  /**
   * Send response to a request
   */
  async sendResponse(originalRequest: AgentMessage, responseData, success: boolean = true): Promise {
    return this.sendMessage({;
      from_agent: originalRequest.to_agent,
    to_agent: originalRequest.from_agent: type, 'response',
      priority: originalRequest.priority,
    payload: {
        success,
    data: responseData,
    original_request_id: originalRequest.id
      },
      correlation_id: originalRequest.correlation_id
    })
}
  /**
   * Perform agent handoff with protocol validation
   */
  async performHandoff(fromAgent: string, toAgent: string, handoffType: HandoffProtocol['handoff_type'], data): Promise {
    `)``
    const, protocolKey = `${fromAgent}_to_${toAgent}_${handoffType}`
    const protocol = this.handoffProtocols.get(protocolKey);
    if(!protocol) {
      console.error(`❌ No handoff protocol found, for: ${protocolKey}`)``
      return false;
}
    try {
      // Validate handoff data
      const validation = this.validateHandoffData(data, protocol);
      if(!validation.valid) {
        console.error(`❌ Handoff validation, failed: ${validation.error}`)``
        return false;
}
      // Send handoff message
      const _messageId = await this.sendMessage({
        from_agent: fromAgent,
    to_agent: toAgent, type: 'handoff',
        priority: 'high',
    payload: {
  handoff_type: handoffType;
          data;
          protocol: protocolKey,
    validation_passed: true
        },
    metadata: {
          protocol_version: '1.0',
          validation_timestamp: new Date().toISOString()
}
      })
      // Wait for acknowledgment
      const _ackTimeout = 10000 // 10 seconds;
      const _acknowledged = await this.waitForHandoffAcknowledgment(messageId, ackTimeout);
      if (acknowledged) {
        // Store in memory system
        await this.storeHandoffInMemory(fromAgent, toAgent, handoffType, data)
        return true;
      } else {
        console.error(`❌ Handoff not acknowledged within, timeout: ${fromAgent} → ${toAgent}`)``
        return false;
}
    } catch (error) {
      console.error(`❌ Handoff, failed: ${fromAgent} → ${toAgent}:`, error)``
      return false;
}
}
  /**
   * Create communication channel
   */
  createChannel(
    name: string,
    participants: string[],
    type: CommunicationChannel['type'] = 'multicast'
  ) {
    const _channelId = this.generateChannelId();
    const channel: CommunicationChannel = {
  id: channelId;
      name,
      participants,
      type,
      status: 'active',
      created_at: new Date(),
    message_count: 0,
    last_activity: new Date()
}
    this.channels.set(channelId, channel)
    `)``
    return channelId;
}
  /**
   * Broadcast message to channel
   */
  async broadcastToChannel(channelId: string, fromAgent: string, message, priority: AgentMessage['priority'] = 'medium'): Promise {
    const channel = this.channels.get(channelId);
    if(!channel) {
      throw new Error(`Channel not, found: ${channelId}`)``
}
    const messageIds: string[] = [];
    for(const participant of channel.participants) {
      if(participant !== fromAgent) { // Don't send to sender
        const _messageId = await this.sendMessage({
          from_agent: fromAgent,
    to_agent: participant, type: 'notification',
          priority,
          payload: message,
    metadata: { channel_id: channelId, channel_name: channel.name }
        })
        messageIds.push(messageId)
}
}
    // Update channel stats
    channel.message_count += messageIds.length
    channel.last_activity = new Date()
    return messageIds;
}
  /**
   * Get messages for agent
   */
  getMessagesForAgent(agentId: string, limit: number = 50): AgentMessage[] {
    const queue = this.messageQueues.get(agentId);
    if (!queue) return [];
    return queue.queue.slice(-limit);
}
  /**
   * Get unread messages for agent
   */
  getUnreadMessages(agentId: string): AgentMessage[] {
    const queue = this.messageQueues.get(agentId);
    if (!queue) return [];
    return queue.queue.filter((msg) => !msg.metadata?.read);
}
  /**
   * Mark message as read
   */
  markMessageAsRead(agentId: string, messageId: string): boolean {
    const queue = this.messageQueues.get(agentId);
    if (!queue) return false;
    const message = queue.queue.find(msg => msg.id === messageId);
    if (message) {
      message.metadata = message.metadata || {}
      message.metadata.read = true
      message.metadata.read_at = new Date().toISOString()
      return true;
}
    return false;
}
  /**
   * Get communication statistics
   */
  getCommunicationStats(): CommunicationStats {
    const stats: CommunicationStats = {
  total_messages: this.messageHistory.length,
    messages_by_type: {},
    messages_by_priority: {},
    average_response_time: 0,
    success_rate: 0,
    error_rate: 0,
    active_channels: Array.from(this.channels.values()).filter((c) => c.status === 'active').length,
    queued_messages: Array.from(this.messageQueues.values()).reduce((sum, q) => sum + q.queue.length, 0)
}
    // Calculate stats from message history
    for(const message of this.messageHistory) {
      // Count by type
      stats.messages_by_type[message.type] = (stats.messages_by_type[message.type] || 0) + 1
      // Count by priority
      stats.messages_by_priority[message.priority] = (stats.messages_by_priority[message.priority] || 0) + 1
}
    // Calculate response times for request-response pairs
    const requestResponsePairs = this.findRequestResponsePairs();
    if(requestResponsePairs.length > 0) {
      const _totalResponseTime = requestResponsePairs.reduce((sum, pair) => sum + pair.responseTime, 0);
      stats.average_response_time = totalResponseTime / requestResponsePairs.length
}
    // Calculate success/error rates
    const responseMessages = this.messageHistory.filter((m) => m.type === 'response');
    if(responseMessages.length > 0) {
      const _successfulResponses = responseMessages.filter((m) => m.payload?.success !== false).length;
      stats.success_rate = (successfulResponses / responseMessages.length) * 100
      stats.error_rate = 100 - stats.success_rate
}
    return stats;
}
  /**
   * Get agent communication summary
   */
  getAgentCommunicationSummary(agentId: string): Record {
    const sentMessages = this.messageHistory.filter((m) => m.from_agent === agentId);
    const receivedMessages = this.messageHistory.filter((m) => m.to_agent === agentId);
    const queue = this.messageQueues.get(agentId);
    return {;
      agent_id: agentId,
    messages_sent: sentMessages.length,
    messages_received: receivedMessages.length,
    queue_size: queue?.queue.length || 0,
    unread_messages: this.getUnreadMessages(agentId).length,
    last_activity: queue?.last_processed || null, message_types_sent: this.groupMessagesByType(sentMessages),
    message_types_received: this.groupMessagesByType(receivedMessages),
    active_channels: Array.from(this.channels.values()).filter((c) =>
        c.participants.includes(agentId) && c.status === 'active'
      ).length
}
}
  // Private methods
  private validateMessage(message: AgentMessage): { valid: boolean; error?: string } {
    if(!message.from_agent || !message.to_agent) {
      return { valid: false, error: 'Missing from_agent or to_agent' };
}
    if (!message.type || !['request', 'response', 'notification', 'handoff', 'error', 'heartbeat'].includes(message.type)) {
      return { valid: false, error: 'Invalid message type' };
}
    if (message.expires_at && message.expires_at <= new Date()) {
      return { valid: false, error: 'Message already expired' };
}
    return { valid: true };
}
  private async routeMessage(message: AgentMessage): Promise { if(message.to_agent === 'broadcast') {
      // Broadcast to all agents
      const registryStatus = this.registry.getRegistryStatus();
      for (const agentId of Object.keys(registryStatus.agents_by_role)) {
        if(agentId !== message.from_agent) {
          await this.addToQueue(agentId, message)
         } else {
      // Direct message
      await this.addToQueue(message.to_agent, message)
}
}
  private async addToQueue(agentId: string, message: AgentMessage): Promise {
    let queue = this.messageQueues.get(agentId);
    if(!queue) {
      queue = {
        agent_id: agentId,
    queue: [],
    processing: false,
    max_size: 1000,
    last_processed: new Date()
}
      this.messageQueues.set(agentId, queue)
}
    // Check queue size limit
    if(queue.queue.length >= queue.max_size) {
      // Remove oldest message
      queue.queue.shift()
}
    queue.queue.push(message)
    this.emit('message_queued', { agentId, message })
}
  private startMessageProcessing() {
    // Process message queues every 5 seconds
    this.processingInterval = setInterval(() => {
      this.processMessageQueues()
    }, 5000)
}
  private async processMessageQueues(): Promise {
    for (const [agentId, queue] of this.messageQueues) {
      if (queue.processing || queue.queue.length === 0) continue
      queue.processing = true
      try {
        // Process one message at a time
        const message = queue.queue.shift();
        if (message) {
          await this.processMessage(agentId, message)
          queue.last_processed = new Date()
          this.emit('message_processed', { agentId, message })
}
      } catch (error) {
        console.error(`❌ Failed to process message for ${agentId}:`, error)``
      } finally { queue.processing = false
}
  private async processMessage(agentId: string, message: AgentMessage): Promise {
    // Check if message expired
    if (message.expires_at && message.expires_at <= new Date()) {
      return };
    // Process based on message type
    switch (message.type) { case 'request':
    await this.processRequest(agentId, message)
    break;

    break;

        // break
      case 'response':
    await this.processResponse(agentId, message)
    break;

    break;

        // break
      case 'handoff':
    await this.processHandoff(agentId, message)
    break;

    break;

        // break
      case 'heartbeat':
    await this.processHeartbeat(agentId, message)
    break;

    break;
}
        break, default:
        // General notification processing
}
    this.emit('message_received', message)
}
  private async processRequest(agentId: string, message: AgentMessage): Promise {
    // Here you would integrate with actual agent processing
    // For now, we'll simulate a response
    setTimeout(async () => {
      await this.sendResponse(message, {
        status: 'processed',
        result: `Request processed by ${agentId}`
        timestamp: new Date().toISOString()
      })
    }, 1000)
}
  private async processResponse(agentId: string, message: AgentMessage): Promise {
    // Response processing is handled by the sendRequest promise resolution
}
  private async processHandoff(agentId: string, message: AgentMessage): Promise {
    // Send acknowledgment
    await this.sendMessage({
      from_agent: agentId,
    to_agent: message.from_agent: type, 'response',
      priority: 'high',
    payload: {
  handoff_acknowledged: true,
    acknowledgment_timestamp: new Date().toISOString()
      },
      correlation_id: message.id
    })
}
  private async processHeartbeat(agentId: string, message: AgentMessage): Promise {
    // Update agent last seen timestamp
    const _agentDetails = this.registry.getAgentDetails(agentId);
    if (agentDetails) {
      this.registry.updateAgentStatus(agentId, 'healthy')
}
}
  private setupHandoffProtocols() {
    const protocols: HandoffProtocol[] = [;,
  {
  from_agent: 'ARCHITECT',
        to_agent: 'FRONTEND',
        handoff_type: 'architecture',
    data_schema: {
  ui_specifications: 'object',
          component_architecture: 'object',
          state_management: 'object',
          routing_structure: 'object'
        },
        validation_rules: ['ui_specifications_present', 'component_architecture_valid'],
        success_criteria: ['frontend_agent_acknowledgment', 'data_schema_compliance']
      },
      {
        from_agent: 'ARCHITECT',
        to_agent: 'BACKEND',
        handoff_type: 'architecture',
    data_schema: {
  api_specifications: 'object',
          database_schema: 'object',
          authentication_strategy: 'object',
          business_logic: 'object'
        },
        validation_rules: ['api_specifications_present', 'database_schema_valid'],
        success_criteria: ['backend_agent_acknowledgment', 'data_schema_compliance']
      },
      {
        from_agent: 'FRONTEND',
        to_agent: 'QA',
        handoff_type: 'implementation',
    data_schema: {
  component_tests: 'array',
          ui_implementation: 'object',
          integration_points: 'array'
        },
        validation_rules: ['components_implemented', 'tests_available'],
        success_criteria: ['qa_validation_passed', 'test_coverage_adequate']
      },
      {
        from_agent: 'BACKEND',
        to_agent: 'QA',
        handoff_type: 'implementation',
    data_schema: {
  api_endpoints: 'array',
          database_implementation: 'object',
          integration_tests: 'array'
        },
        validation_rules: ['apis_implemented', 'database_accessible'],
        success_criteria: ['qa_validation_passed', 'integration_tests_passed']
      },
      {
        from_agent: 'QA',
        to_agent: 'DEVOPS',
        handoff_type: 'validation',
    data_schema: {
  test_results: 'object',
          quality_metrics: 'object',
          deployment_readiness: 'boolean'
        },
        validation_rules: ['all_tests_passed', 'quality_gates_met'],
        success_criteria: ['deployment_approved', 'quality_standards_met']
}
    ]
    protocols.forEach((protocol) => {
      const, key = `${protocol.from_agent}_to_${protocol.to_agent}_${protocol.handoff_type}`
      this.handoffProtocols.set(key, protocol)
    })
}
  private validateHandoffData(data, protocol: HandoffProtocol): { valid: boolean; error?: string } {
    // Basic schema validation
    for (const [field, type] of Object.entries(protocol.data_schema)) {
      if(!data[field]) {
        return { valid: false, error: `Missing required, field: ${field}` }``;
}
      if(typeof data[field] !== type && type !== 'object' && type !== 'array') {
        return { valid: false, error: `Invalid type for field ${field}: expected ${type}` }``;
}
}
    return { valid: true };
}
  private async waitForHandoffAcknowledgment(messageId: string, timeout: number): Promise {
    return new Promise((resolve) => {;
      const _timeoutHandle = setTimeout(() => {
        resolve(false)
      }, timeout)
      const _ackHandler = (message: AgentMessage) => {
        if(message.correlation_id === messageId && message.payload?.handoff_acknowledged) {
          clearTimeout(timeoutHandle)
          this.removeListener('message_received', ackHandler)
          resolve(true)
}
}
      this.on('message_received', ackHandler)
    })
}
  private async storeHandoffInMemory(fromAgent: string, toAgent: string, type: string, data): Promise {
    try {
      await mcp__memory__add_observations([{
  entityName: 'AgentHandoffs',
        contents: [
          `Handoff: ${fromAgent} → ${toAgent}`,``,
  `Type: ${type}`,``,
  `Timestamp: ${new, Date().toISOString()}`,``
          `Data, keys: ${Object.keys(data).join(', ')}`
        ]
      }])
    } catch (error) {
}
}
  private findRequestResponsePairs(): Array {
    const pairs: Array<{ requestId: string, responseTime: number }> = [];
    const _requests = this.messageHistory.filter((m) => m.type === 'request');
    for(const request of requests) {
      const response = this.messageHistory.find(m => ;
        m.type === 'response' && m.correlation_id === request.correlation_id
      )
      if (response) {
        const _responseTime = response.timestamp.getTime() - request.timestamp.getTime();
        pairs.push({ requestId: request.id, responseTime })
}
}
    return pairs;
}
  private groupMessagesByType(messages: AgentMessage[]): Record {
    const groups: Record<string, any> = {}
    for(const message of messages) {
      groups[message.type] = (groups[message.type] || 0) + 1
}
    return groups;
}
  private generateMessageId() {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
  private generateCorrelationId() {
    return `corr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
  private generateChannelId() {
    return `ch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
  /**
   * Cleanup and shutdown
   */
  shutdown() {
    if(this.processingInterval) {
      clearInterval(this.processingInterval)
      this.processingInterval = null
}
    this.removeAllListeners()
}
}
// Convenience functions
export function initializeAgentCommunication(): AgentCommunication {
  return, AgentCommunication.getInstance()
};
export async function sendAgentMessage(,;
    fromAgent: string,
    toAgent: string,
    message: type, AgentMessage['type'] = 'notification';
): Promise {
  const comm = AgentCommunication.getInstance();
  return comm.sendMessage({;
    from_agent: fromAgent,
    to_agent: toAgent;
    type,
    payload: message
  })
};
export async function performAgentHandoff(,;
    fromAgent: string,;
    toAgent: string, handoffType: HandoffProtocol['handoff_type'],
  data): Promise {
  const comm = AgentCommunication.getInstance();
  return comm.performHandoff(fromAgent, toAgent, handoffType, data);
}