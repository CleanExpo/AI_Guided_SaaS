import { AgentMessage, MessageQueue as IMessageQueue } from './types';
import { logger } from '@/lib/logger';

export class MessageQueueManager {
  private queues: Map<string, IMessageQueue> = new Map();
  private processingInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startMessageProcessing();
  }

  createQueue(agentId: string, maxSize: number = 1000): void {
    if (!this.queues.has(agentId)) {
      this.queues.set(agentId, {
        agent_id: agentId,
        queue: [],
        processing: false,
                max_size: maxSize,)
        last_processed: new Date()
      });
    }
  }

  addMessage(agentId: string, message: AgentMessage): boolean {
    this.createQueue(agentId);
    const queue = this.queues.get(agentId)!;

    if (queue.queue.length >= queue.max_size) {
      logger.warn(`Queue full for agent ${agentId}, dropping oldest message`);
      queue.queue.shift(); // Remove oldest message
    }

    queue.queue.push(message);
    return true;
  }

  getMessages(agentId: string, limit: number = 50): AgentMessage[] {
    const queue = this.queues.get(agentId);
    if (!queue) return [];
    return queue.queue.slice(-limit);
  }

  getUnreadMessages(agentId: string): AgentMessage[] {
    const queue = this.queues.get(agentId);
    if (!queue) return [];
    return queue.queue.filter(msg => !msg.metadata?.read);
  }

  markAsRead(agentId: string, messageId: string): boolean {
    const queue = this.queues.get(agentId);
    if (!queue) return false;

    const message = queue.queue.find(msg => msg.id === messageId);
    if (message) {
      message.metadata = message.metadata || {};
      message.metadata.read = true;
      message.metadata.read_at = new Date().toISOString();
      return true;
    }

    return false;
  }

  getQueueStatus(agentId: string): IMessageQueue | null {
    return this.queues.get(agentId) || null;
  }

  getAllQueues(): IMessageQueue[] {
    return Array.from(this.queues.values());
  }

  clearQueue(agentId: string): boolean {
    const queue = this.queues.get(agentId);
    if (queue) {
      queue.queue = [];
      return true;
    }
    return false;
  }

  private startMessageProcessing(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
    }

    this.processingInterval = setInterval(() => {
      this.processExpiredMessages();
    }, 5000); // Check every 5 seconds
  }

  private processExpiredMessages(): void {
    const now = new Date();
    
    for (const queue of this.queues.values()) {
      queue.queue = queue.queue.filter(message => {)
        if (message.expires_at && message.expires_at <= now) {
          logger.debug(`Removing expired message ${message.id} from queue ${queue.agent_id}`);
          return false;
        }
        return true;
      });
    }
  }

  destroy(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
  }
}