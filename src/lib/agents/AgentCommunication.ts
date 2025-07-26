/* BREADCRUMB: library - Shared library code */

import { AgentRegistry } from './AgentRegistry';
import { EventEmitter } from 'events';
import { logger } from '@/lib/logger';

// Import modular components
import {
  AgentMessage,
  CommunicationChannel,
  MessageQueue,
  HandoffProtocol,
  CommunicationStats,
  AgentCommunicationSummary,
  MessageQueueManager,
  ChannelManager,
  HandoffManager,
  StatisticsManager,
  MessageRouter,
  MessageValidator
} from './communication';

// Re-export types for backward compatibility
export * from './communication/types';

export class AgentCommunication extends EventEmitter {
  private static instance: AgentCommunication;
  private registry: AgentRegistry;
  private queueManager: MessageQueueManager;
  private channelManager: ChannelManager;
  private handoffManager: HandoffManager;
  private statisticsManager: StatisticsManager;
  private messageRouter: MessageRouter;

  constructor() {
    super();
    this.registry = AgentRegistry.getInstance();
    this.queueManager = new MessageQueueManager();
    this.channelManager = new ChannelManager();
    this.handoffManager = new HandoffManager();
    this.statisticsManager = new StatisticsManager();
    this.messageRouter = new MessageRouter(this.queueManager, this.channelManager);
  }

  static getInstance(): AgentCommunication {
    if (!AgentCommunication.instance) {
      AgentCommunication.instance = new AgentCommunication();
    }
    return AgentCommunication.instance;
  }

  /**
   * Send message between agents
   */
  async sendMessage(message: Partial<AgentMessage>): Promise<string> {
    const messageId = this.generateMessageId();
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
    };

    // Validate message
    const validation = MessageValidator.validateMessage(fullMessage);
    if (!validation.valid) {
      throw new Error(`Invalid message: ${validation.error}`);
    }

    // Add to statistics
    this.statisticsManager.addMessage(fullMessage);

    // Route message to appropriate queue(s)
    await this.messageRouter.routeMessage(fullMessage);

    // Emit event for listeners
    this.emit('message_sent', fullMessage);
    return messageId;
  }

  /**
   * Send request and wait for response
   */
  async sendRequest(
    fromAgent: string,
    toAgent: string,
    requestData: any,
    timeout: number = 30000
  ): Promise<any> {
    const correlationId = this.generateCorrelationId();
    
    await this.sendMessage({
      from_agent: fromAgent,
      to_agent: toAgent,
      type: 'request',
      priority: 'high',
      payload: requestData,
      correlation_id: correlationId,
      expires_at: new Date(Date.now() + timeout)
    });

    // Wait for response
    return new Promise((resolve, reject) => {
      const timeoutHandle = setTimeout(() => {
        reject(new Error(`Request timeout: No response from ${toAgent} within ${timeout}ms`));
      }, timeout);

      const responseHandler = (message: AgentMessage) => {
        if (message.correlation_id === correlationId && message.type === 'response') {
          clearTimeout(timeoutHandle);
          this.removeListener('message_received', responseHandler);
          resolve(message.payload);
        }
      };

      this.on('message_received', responseHandler);
    });
  }

  /**
   * Send response to a request
   */
  async sendResponse(
    originalRequest: AgentMessage,
    responseData: any,
    success: boolean = true
  ): Promise<string> {
    return this.sendMessage({
      from_agent: originalRequest.to_agent,
      to_agent: originalRequest.from_agent,
      type: 'response',
      priority: originalRequest.priority,
      payload: {
        success,
        data: responseData,
        original_request_id: originalRequest.id
      },
      correlation_id: originalRequest.correlation_id
    });
  }

  /**
   * Perform agent handoff with protocol validation
   */
  async performHandoff(
    fromAgent: string,
    toAgent: string,
    handoffType: HandoffProtocol['handoff_type'],
    data: any
  ): Promise<boolean> {
    const result = await this.handoffManager.performHandoff(fromAgent, toAgent, handoffType, data);
    
    if (result.success) {
      logger.info(`✅ Handoff successful: ${fromAgent} → ${toAgent} (${handoffType})`);
      return true;
    } else {
      logger.error(`❌ Handoff failed: ${fromAgent} → ${toAgent}: ${result.error}`);
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
  ): string {
    return this.channelManager.createChannel(name, participants, type);
  }

  /**
   * Broadcast message to channel
   */
  async broadcastToChannel(
    channelId: string,
    fromAgent: string,
    message: any,
    priority: AgentMessage['priority'] = 'medium'
  ): Promise<string[]> {
    const participants = this.channelManager.getChannelParticipants(channelId, fromAgent);
    
    if (participants.length === 0) {
      throw new Error(`Channel not found: ${channelId}`);
    }

    const messageIds: string[] = [];
    for (const participant of participants) {
      const messageId = await this.sendMessage({
        from_agent: fromAgent,
        to_agent: participant,
        type: 'notification',
        priority,
        payload: message,
        metadata: {
          channel_id: channelId,
          channel_name: this.channelManager.getChannel(channelId)?.name
        }
      });
      messageIds.push(messageId);
    }

    // Update channel activity
    this.channelManager.updateChannelActivity(channelId, messageIds.length);
    return messageIds;
  }

  /**
   * Get messages for agent
   */
  getMessagesForAgent(agentId: string, limit: number = 50): AgentMessage[] {
    return this.queueManager.getMessages(agentId, limit);
  }

  /**
   * Get unread messages for agent
   */
  getUnreadMessages(agentId: string): AgentMessage[] {
    return this.queueManager.getUnreadMessages(agentId);
  }

  /**
   * Mark message as read
   */
  markMessageAsRead(agentId: string, messageId: string): boolean {
    return this.queueManager.markAsRead(agentId, messageId);
  }

  /**
   * Get communication statistics
   */
  getCommunicationStats(): CommunicationStats {
    const stats = this.statisticsManager.getCommunicationStats();
    
    // Add real-time data from managers
    stats.active_channels = this.channelManager.getActiveChannels().length;
    stats.queued_messages = this.queueManager.getAllQueues()
      .reduce((sum, queue) => sum + queue.queue.length, 0);
    
    return stats;
  }

  /**
   * Get agent communication summary
   */
  getAgentCommunicationSummary(agentId: string): AgentCommunicationSummary {
    const summary = this.statisticsManager.getAgentCommunicationSummary(agentId);
    
    // Add real-time data from managers
    const queueStatus = this.queueManager.getQueueStatus(agentId);
    summary.queue_size = queueStatus?.queue.length || 0;
    summary.unread_messages = this.getUnreadMessages(agentId).length;
    summary.active_channels = this.channelManager.getChannelsForAgent(agentId).length;
    
    return summary;
  }

  // Utility methods
  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateCorrelationId(): string {
    return `corr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Cleanup method
  destroy(): void {
    this.queueManager.destroy();
    this.removeAllListeners();
  }
}