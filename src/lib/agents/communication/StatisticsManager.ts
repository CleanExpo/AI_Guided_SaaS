import { AgentMessage, CommunicationStats, RequestResponsePair, AgentCommunicationSummary } from './types';

export class StatisticsManager {
  private messageHistory: AgentMessage[] = [];

  addMessage(message: AgentMessage): void {
    this.messageHistory.push(message);
    
    // Keep only last 10000 messages to prevent memory issues
    if (this.messageHistory.length > 10000) {
      this.messageHistory = this.messageHistory.slice(-5000);
    }
  }

  getCommunicationStats(): CommunicationStats {
    const stats: CommunicationStats = {
      total_messages: this.messageHistory.length,
      messages_by_type: {},
      messages_by_priority: {},
      average_response_time: 0,
      success_rate: 0,
      error_rate: 0,
      active_channels: 0,
      queued_messages: 0
    };

    // Calculate stats from message history
    for (const message of this.messageHistory) {
      // Count by type
      stats.messages_by_type[message.type] = (stats.messages_by_type[message.type] || 0) + 1;
      
      // Count by priority
      stats.messages_by_priority[message.priority] = (stats.messages_by_priority[message.priority] || 0) + 1;
    }

    // Calculate response times for request-response pairs
    const requestResponsePairs = this.findRequestResponsePairs();
    if (requestResponsePairs.length > 0) {
      const totalResponseTime = requestResponsePairs.reduce((sum, pair) => sum + pair.responseTime, 0);
      stats.average_response_time = totalResponseTime / requestResponsePairs.length;
    }

    // Calculate success/error rates
    const responseMessages = this.messageHistory.filter(m => m.type === 'response');
    if (responseMessages.length > 0) {
      const successfulResponses = responseMessages.filter(m => m.payload?.success !== false).length;
      stats.success_rate = (successfulResponses / responseMessages.length) * 100;
      stats.error_rate = 100 - stats.success_rate;
    }

    return stats;
  }

  getAgentCommunicationSummary(agentId: string): AgentCommunicationSummary {
    const sentMessages = this.messageHistory.filter(m => m.from_agent === agentId);
    const receivedMessages = this.messageHistory.filter(m => m.to_agent === agentId);

    return {
      agent_id: agentId,
      messages_sent: sentMessages.length,
      messages_received: receivedMessages.length,
      queue_size: 0, // This would be set by the queue manager
      unread_messages: 0, // This would be set by the queue manager
      last_activity: this.getLastActivityForAgent(agentId),
      message_types_sent: this.groupMessagesByType(sentMessages),
      message_types_received: this.groupMessagesByType(receivedMessages),
      active_channels: 0 // This would be set by the channel manager
    };
  }

  getMessageHistory(limit?: number): AgentMessage[] {
    return limit ? this.messageHistory.slice(-limit) : [...this.messageHistory];
  }

  getMessagesForAgent(agentId: string, limit?: number): AgentMessage[] {
    const agentMessages = this.messageHistory.filter(m => m.from_agent === agentId || m.to_agent === agentId)
    );
    return limit ? agentMessages.slice(-limit) : agentMessages;
  }

  getMessagesByType(type: AgentMessage['type']): AgentMessage[] {
    return this.messageHistory.filter(m => m.type === type);
  }

  getMessagesByPriority(priority: AgentMessage['priority']): AgentMessage[] {
    return this.messageHistory.filter(m => m.priority === priority);
  }

  clearHistory(): void {
    this.messageHistory = [];
  }

  private findRequestResponsePairs(): RequestResponsePair[] {
    const pairs: RequestResponsePair[] = [];
    const requests = this.messageHistory.filter(m => m.type === 'request');

    for (const request of requests) {
      if (request.correlation_id) {
        const response = this.messageHistory.find(m => 
          m.type === 'response' && 
          m.correlation_id === request.correlation_id &&
          m.timestamp > request.timestamp)
        );

        if (response) {
          pairs.push({
            request)
            response,)
            responseTime: response.timestamp.getTime() - request.timestamp.getTime()
          });
        }
      }
    }

    return pairs;
  }

  private groupMessagesByType(messages: AgentMessage[]): Record<string, number> {
    const grouped: Record<string, number> = {};
    for (const message of messages) {
      grouped[message.type] = (grouped[message.type] || 0) + 1;
    }
    return grouped;
  }

  private getLastActivityForAgent(agentId: string): Date | null {
    const agentMessages = this.messageHistory.filter(m => m.from_agent === agentId || m.to_agent === agentId)
    );

    if (agentMessages.length === 0) return null;

    return agentMessages.reduce((latest, message) => 
      message.timestamp > latest ? message.timestamp : latest, 
      agentMessages[0].timestamp
    );
  }
}