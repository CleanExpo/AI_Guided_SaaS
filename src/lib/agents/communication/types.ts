export interface AgentMessage {
  id: string;
  from_agent: string;
  to_agent: string;
  type: 'request' | 'response' | 'notification' | 'handoff' | 'error' | 'heartbeat';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  payload: any;
  timestamp: Date;
  correlation_id?: string;
  expires_at?: Date;
  retry_count?: number;
  metadata?: Record<string, any>;
}

export interface CommunicationChannel {
  id: string;
  name: string;
  participants: string[];
  type: 'direct' | 'broadcast' | 'multicast' | 'pipeline';
  status: 'active' | 'inactive' | 'archived';
  created_at: Date;
  message_count: number;
  last_activity: Date;
}

export interface MessageQueue {
  agent_id: string;
  queue: AgentMessage[];
  processing: boolean;
  max_size: number;
  last_processed: Date;
}

export interface HandoffProtocol {
  from_agent: string;
  to_agent: string;
  handoff_type: 'architecture' | 'implementation' | 'validation' | 'deployment';
  data_schema: Record<string, any>;
  validation_rules: string[];
  success_criteria: string[];
  rollback_procedure?: string;
}

export interface CommunicationStats {
  total_messages: number;
  messages_by_type: Record<string, number>;
  messages_by_priority: Record<string, number>;
  average_response_time: number;
  success_rate: number;
  error_rate: number;
  active_channels: number;
  queued_messages: number;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export interface RequestResponsePair {
  request: AgentMessage;
  response: AgentMessage;
  responseTime: number;
}

export interface AgentCommunicationSummary {
  agent_id: string;
  messages_sent: number;
  messages_received: number;
  queue_size: number;
  unread_messages: number;
  last_activity: Date | null;
  message_types_sent: Record<string, number>;
  message_types_received: Record<string, number>;
  active_channels: number;
}