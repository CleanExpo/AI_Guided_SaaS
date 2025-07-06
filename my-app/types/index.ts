export interface Persona {
  id: string
  name: string
  description: string
  expertise: string[]
  tone: string
  avatar: string
}

export interface ProjectConfig {
  name: string
  description: string
  persona: Persona
  features: string[]
  technology: {
    frontend: string
    backend: string
    database: string
    hosting: string
  }
  targetAudience: string
  timeline: string
}

export interface ProjectFile {
  name: string
  path: string
  content: string
  type: 'component' | 'page' | 'config' | 'style' | 'api' | 'documentation'
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface AIResponse {
  message: string
  suggestions: string[]
  projectUpdate?: Partial<ProjectConfig>
}
