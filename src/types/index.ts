// Core project types
export interface ProjectConfig {
  name: string
  description: string
  features: string[]
  techStack: string[]
  framework: string
  styling: string
  database?: string
  authentication?: string
  deployment?: string
  apiIntegration?: boolean
  realTimeFeatures?: boolean
  technology?: {
    frontend: string
    backend: string
    database: string
    hosting: string
  }
  targetAudience?: string
  timeline?: string
  persona?: Persona
}

export interface ProjectFile {
  name: string
  path: string
  content: string
  type: 'component' | 'page' | 'api' | 'config' | 'style' | 'test' | 'documentation'
}

export interface Persona {
  id: string
  name: string
  role: string
  description: string
  expertise: string[]
  avatar: string
  color: string
  tone?: string
  personalityMode?: PersonalityMode
  personalityConfig?: PersonalityConfig
}

export interface ChatMessage {
  id: string
  content: string
  sender: 'user' | 'assistant'
  timestamp: Date
  type?: 'text' | 'code' | 'file'
  role?: 'user' | 'assistant'
}

// Analytics types
export interface RevenueMetrics {
  totalRevenue: number
  monthlyRevenue: number
  yearlyRevenue: number
  growth: number
}

export interface UserMetrics {
  totalUsers: number
  activeUsers: number
  newUsers: number
  retention: number
}

export interface SystemMetrics {
  uptime: number
  responseTime: number
  errorRate: number
  throughput: number
}

// Admin types
export interface SystemCheck {
  name: string
  status: 'pass' | 'warn' | 'fail'
  message: string
  details?: string
}

// Collaboration types
export interface CollaborationRoom {
  id: string
  name: string
  participants: string[]
  createdAt: Date
  updatedAt: Date
}

export interface CollaborationUser {
  id: string
  name: string
  email: string
  avatar?: string
  isOnline: boolean
}

// Personality system types
export interface PersonalityMode {
  id: string
  name: string
  description: string
  systemPrompt: string
  temperature: number
  characteristics: PersonalityCharacteristics
}

export interface PersonalityCharacteristics {
  candid: boolean
  witty: boolean
  informal: boolean
  practical: boolean
  intellectuallyHonest: boolean
}

export interface PersonalityConfig {
  defaultMode: string
  grokSettings: {
    candidnessLevel: number // 1-10 scale
    humorLevel: number // 1-10 scale
    formalityLevel: number // 1-10 scale (inverted for Grok)
    practicalFocus: boolean
  }
  userPreferences: {
    rememberMode: boolean
    autoApplyContext: boolean
  }
}

export interface TransformContext {
  messageHistory: ChatMessage[]
  userContext: string
  taskType: 'technical' | 'creative' | 'general'
}
