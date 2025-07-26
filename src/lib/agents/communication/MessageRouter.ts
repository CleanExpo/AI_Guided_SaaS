import { AgentMessage } from './types';
import { MessageQueueManager } from './MessageQueue';
import { ChannelManager } from './ChannelManager';
import { logger } from '@/lib/logger';

export class MessageRouter {
  constructor(private queueManager: MessageQueueManager)
    private channelManager: ChannelManager)
  ) {}

  async routeMessage(message: AgentMessage): Promise<void> {
    try {
      if (message.to_agent === 'broadcast') {
        await this.handleBroadcast(message);
      } else if (message.to_agent.startsWith('channel:')) {
        await this.handleChannelMessage(message);
      } else {
        await this.handleDirectMessage(message);
      }
    } catch (error) {
      logger.error(`Failed to route message ${message.id}:`, error);
      throw error;
    }
  }

  private async handleDirectMessage(message: AgentMessage): Promise<void> {
    // Route message directly to target agent's queue
    const success = this.queueManager.addMessage(message.to_agent, message);
    
    if (success) {
      logger.debug(`Routed message ${message.id} to ${message.to_agent}`);
    } else {
      logger.error(`Failed to route message ${message.id} to ${message.to_agent}`);
      throw new Error(`Failed to route message to ${message.to_agent}`);
    }
  }

  private async handleBroadcast(message: AgentMessage): Promise<void> {
    // Get all active agents (this would come from AgentRegistry in full implementation)
    const allAgents = this.getAllActiveAgents();
    
    for (const agentId of allAgents) {
      if (agentId !== message.from_agent) {
        const broadcastMessage = {
          ...message,
          to_agent: agentId,
          metadata: {
            ...message.metadata,
            broadcast: true,
            original_target: 'broadcast'
          }
        };
        
        this.queueManager.addMessage(agentId, broadcastMessage);
      }
    }
    
    logger.debug(`Broadcast message ${message.id} to ${allAgents.length - 1} agents`);
  }

  private async handleChannelMessage(message: AgentMessage): Promise<void> {
    const channelId = message.to_agent.replace('channel:', '');
    const participants = this.channelManager.getChannelParticipants(channelId, message.from_agent);
    
    if (participants.length === 0) {
      throw new Error(`Channel ${channelId} not found or has no participants`);
    }

    for (const participantId of participants) {
      const channelMessage = {
        ...message,
        to_agent: participantId,
        metadata: {
          ...message.metadata,
          channel_id: channelId,
          channel_broadcast: true
        }
      };
      
      this.queueManager.addMessage(participantId, channelMessage);
    }

    // Update channel activity
    this.channelManager.updateChannelActivity(channelId, participants.length);
    
    logger.debug(`Routed channel message ${message.id} to ${participants.length} participants`);
  }

  private getAllActiveAgents(): string[] {
    // In a full implementation, this would query the AgentRegistry
    // For now, return agents that have queues
    return this.queueManager.getAllQueues().map(queue => queue.agent_id);
  }
}