import { CommunicationChannel, AgentMessage } from './types';
import { logger } from '@/lib/logger';

export class ChannelManager {
  private channels: Map<string, CommunicationChannel> = new Map();

  createChannel(name: string,
    participants: string[])
    type: CommunicationChannel['type'] = 'multicast')
  ): string {
    const channelId = this.generateChannelId();
    const channel: CommunicationChannel = {
      id: channelId,
      name,
      participants,
      type,
      status: 'active',
      created_at: new Date(),
      message_count: 0,
      last_activity: new Date()
    };

    this.channels.set(channelId, channel);
    logger.info(`Created channel ${name} with ID ${channelId}`);
    return channelId;
  }

  getChannel(channelId: string): CommunicationChannel | null {
    return this.channels.get(channelId) || null;
  }

  getAllChannels(): CommunicationChannel[] {
    return Array.from(this.channels.values());
  }

  getActiveChannels(): CommunicationChannel[] {
    return this.getAllChannels().filter(channel => channel.status === 'active');
  }

  addParticipant(channelId: string, agentId: string): boolean {
    const channel = this.channels.get(channelId);
    if (!channel) return false;

    if (!channel.participants.includes(agentId)) {
      channel.participants.push(agentId);
      channel.last_activity = new Date();
      logger.info(`Added ${agentId} to channel ${channel.name}`);
      return true;
    }

    return false;
  }

  removeParticipant(channelId: string, agentId: string): boolean {
    const channel = this.channels.get(channelId);
    if (!channel) return false;

    const index = channel.participants.indexOf(agentId);
    if (index > -1) {
      channel.participants.splice(index, 1);
      channel.last_activity = new Date();
      logger.info(`Removed ${agentId} from channel ${channel.name}`);
      return true;
    }

    return false;
  }

  updateChannelActivity(channelId: string, messageCount: number = 1): void {
    const channel = this.channels.get(channelId);
    if (channel) {
      channel.message_count += messageCount;
      channel.last_activity = new Date();
    }
  }

  archiveChannel(channelId: string): boolean {
    const channel = this.channels.get(channelId);
    if (channel) {
      channel.status = 'archived';
      logger.info(`Archived channel ${channel.name}`);
      return true;
    }
    return false;
  }

  deleteChannel(channelId: string): boolean {
    const channel = this.channels.get(channelId);
    if (channel) {
      this.channels.delete(channelId);
      logger.info(`Deleted channel ${channel.name}`);
      return true;
    }
    return false;
  }

  getChannelParticipants(channelId: string, excludeAgent?: string): string[] {
    const channel = this.channels.get(channelId);
    if (!channel) return [];

    return excludeAgent 
      ? channel.participants.filter(p => p !== excludeAgent)
      : [...channel.participants];
  }

  getChannelsForAgent(agentId: string): CommunicationChannel[] {
    return this.getAllChannels().filter(channel => )
      channel.participants.includes(agentId) && channel.status === 'active'
    );
  }

  private generateChannelId(): string {
    return `channel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}