export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  provider: string;
  provider_id?: string;
  subscription_tier: 'free' | 'pro' | 'enterprise';
  subscription_status: 'active' | 'canceled' | 'past_due';
  password_hash?: string;
  stripe_customer_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectConfig {
  framework?: string;
  template?: string;
  features?: string[];
  styling?: {
    theme?: string;
    colors?: Record<string, string>;
  };
  deployment?: {
    platform?: string;
    domain?: string;
  };
  [key: string]: unknown;
}

export interface ProjectFiles {
  [path: string]: {
    content: string;
    type: 'file' | 'directory';
    size?: number;
  };
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  framework: string;
  status: 'draft' | 'generating' | 'completed' | 'error';
  config: ProjectConfig;
  files?: ProjectFiles;
  created_at: string;
  updated_at: string;
}

export interface ActivityMetadata {
  ip_address?: string;
  user_agent?: string;
  duration?: number;
  error_message?: string;
  [key: string]: unknown;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  metadata?: ActivityMetadata;
  created_at: string;
}

export interface UsageMetadata {
  session_id?: string;
  feature_used?: string;
  processing_time?: number;
  [key: string]: unknown;
}

export interface UsageRecord {
  id: string;
  user_id: string;
  resource_type: string;
  quantity: number;
  metadata?: UsageMetadata;
  created_at: string;
}

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  rollout_percentage: number;
  target_users?: string[];
  created_at: string;
  updated_at: string;
}

export interface PaymentMetadata {
  invoice_id?: string;
  subscription_id?: string;
  plan_name?: string;
  billing_cycle?: string;
  [key: string]: unknown;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string;
  stripe_customer_id: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid';
  tier: 'free' | 'pro' | 'enterprise';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseRecord {
  id: string;
  created_at: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface UsageSummary {
  projects: number;
  aiGenerations: number;
  storage: string;
}

export interface PaymentData {
  user_id: string;
  stripe_payment_intent_id: string;
  amount: number;
  currency: string;
  status: string;
  description?: string;
  metadata?: PaymentMetadata;
}

export interface SubscriptionData {
  user_id?: string;
  stripe_subscription_id?: string;
  stripe_customer_id?: string;
  status?: string;
  tier?: string;
  current_period_start?: string;
  current_period_end?: string;
  cancel_at_period_end?: boolean;
}