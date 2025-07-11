import { PersonalityMode } from '@/types'
import { personalityEngine } from './personality-engine'

export interface PersonalityConfig {
  defaultPersonality: string
  enabledPersonalities: string[]
  contextualSwitching: boolean
  autoDetectContext: boolean
  preserveUserPreference: boolean
}

export interface PersonalityPreferences {
  userId?: string
  preferredPersonality: string
  contextOverrides: Record<string, string>
  lastUsed: string
  createdAt: Date
  updatedAt: Date
}

export class PersonalityConfigManager {
  private config: PersonalityConfig
  private userPreferences: Map<string, PersonalityPreferences> = new Map()

  constructor() {
    this.config = this.getDefaultConfig()
    this.loadUserPreferences()
  }

  private getDefaultConfig(): PersonalityConfig {
    return {
      defaultPersonality: 'standard',
      enabledPersonalities: ['standard', 'grok-4'],
      contextualSwitching: true,
      autoDetectContext: true,
      preserveUserPreference: true
    }
  }

  /**
   * Get current personality configuration
   */
  getConfig(): PersonalityConfig {
    return { ...this.config }
  }

  /**
   * Update personality configuration
   */
  updateConfig(updates: Partial<PersonalityConfig>): void {
    this.config = { ...this.config, ...updates }
    this.saveConfig()
  }

  /**
   * Get user's personality preferences
   */
  getUserPreferences(userId: string): PersonalityPreferences | undefined {
    return this.userPreferences.get(userId)
  }

  /**
   * Set user's personality preferences
   */
  setUserPreferences(userId: string, preferences: Partial<PersonalityPreferences>): void {
    const existing = this.userPreferences.get(userId)
    const updated: PersonalityPreferences = {
      userId,
      preferredPersonality: preferences.preferredPersonality || this.config.defaultPersonality,
      contextOverrides: preferences.contextOverrides || {},
      lastUsed: preferences.lastUsed || this.config.defaultPersonality,
      createdAt: existing?.createdAt || new Date(),
      updatedAt: new Date(),
      ...preferences
    }
    
    this.userPreferences.set(userId, updated)
    this.saveUserPreferences()
  }

  /**
   * Get recommended personality for context
   */
  getRecommendedPersonality(context: string, userId?: string): PersonalityMode {
    // Check user preferences first
    if (userId && this.config.preserveUserPreference) {
      const userPrefs = this.getUserPreferences(userId)
      if (userPrefs?.contextOverrides[context]) {
        const personalityMode = personalityEngine.getPersonalityMode(userPrefs.contextOverrides[context])
        if (personalityMode) return personalityMode
      }
      if (userPrefs?.preferredPersonality) {
        const personalityMode = personalityEngine.getPersonalityMode(userPrefs.preferredPersonality)
        if (personalityMode) return personalityMode
      }
    }

    // Auto-detect context if enabled
    if (this.config.autoDetectContext) {
      const contextPersonality = this.detectContextualPersonality(context)
      if (contextPersonality) {
        const personalityMode = personalityEngine.getPersonalityMode(contextPersonality)
        if (personalityMode) return personalityMode
      }
    }

    // Fall back to default
    return personalityEngine.getPersonalityMode(this.config.defaultPersonality) || 
           personalityEngine.getPersonalityMode('standard')!
  }

  /**
   * Detect appropriate personality based on context
   */
  private detectContextualPersonality(context: string): string | null {
    const lowerContext = context.toLowerCase()
    
    // Technical contexts might benefit from Grok's directness
    const technicalKeywords = [
      'code', 'programming', 'debug', 'error', 'api', 'database',
      'technical', 'development', 'software', 'algorithm', 'architecture'
    ]
    
    // Creative contexts might benefit from Grok's wit
    const creativeKeywords = [
      'creative', 'design', 'brainstorm', 'idea', 'concept', 'artistic',
      'writing', 'content', 'marketing', 'story', 'narrative'
    ]
    
    // Problem-solving contexts benefit from Grok's candid approach
    const problemSolvingKeywords = [
      'problem', 'issue', 'challenge', 'solution', 'fix', 'troubleshoot',
      'analyze', 'investigate', 'diagnose', 'resolve'
    ]

    if (technicalKeywords.some(keyword => lowerContext.includes(keyword))) {
      return 'grok-4' // Direct, honest technical advice
    }
    
    if (creativeKeywords.some(keyword => lowerContext.includes(keyword))) {
      return 'grok-4' // Witty, engaging creative input
    }
    
    if (problemSolvingKeywords.some(keyword => lowerContext.includes(keyword))) {
      return 'grok-4' // Candid problem-solving approach
    }

    return null // Use default
  }

  /**
   * Get available personalities based on configuration
   */
  getAvailablePersonalities(): PersonalityMode[] {
    const allPersonalities = personalityEngine.getAllPersonalityModes()
    return allPersonalities.filter(p => this.config.enabledPersonalities.includes(p.id))
  }

  /**
   * Check if personality switching is enabled
   */
  isPersonalitySwitchingEnabled(): boolean {
    return this.config.contextualSwitching
  }

  /**
   * Record personality usage for analytics
   */
  recordPersonalityUsage(personalityId: string, context: string, userId?: string): void {
    if (userId) {
      const prefs = this.getUserPreferences(userId) || {
        userId,
        preferredPersonality: personalityId,
        contextOverrides: {},
        lastUsed: personalityId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      prefs.lastUsed = personalityId
      prefs.updatedAt = new Date()
      
      this.setUserPreferences(userId, prefs)
    }
    
    // Could also send to analytics service here
    console.log(`Personality usage: ${personalityId} for context: ${context}`)
  }

  private loadUserPreferences(): void {
    // In a real app, this would load from database or localStorage
    try {
      const stored = localStorage.getItem('personality-preferences')
      if (stored) {
        const preferences = JSON.parse(stored)
        Object.entries(preferences).forEach(([userId, prefs]) => {
          this.userPreferences.set(userId, prefs as PersonalityPreferences)
        })
      }
    } catch (error) {
      console.warn('Failed to load personality preferences:', error)
    }
  }

  private saveUserPreferences(): void {
    // In a real app, this would save to database
    try {
      const preferences = Object.fromEntries(this.userPreferences)
      localStorage.setItem('personality-preferences', JSON.stringify(preferences))
    } catch (error) {
      console.warn('Failed to save personality preferences:', error)
    }
  }

  private saveConfig(): void {
    // In a real app, this would save to database or config service
    try {
      localStorage.setItem('personality-config', JSON.stringify(this.config))
    } catch (error) {
      console.warn('Failed to save personality config:', error)
    }
  }
}

// Singleton instance
export const personalityConfigManager = new PersonalityConfigManager()

// Utility functions
export function getPersonalityForContext(context: string, userId?: string): PersonalityMode {
  return personalityConfigManager.getRecommendedPersonality(context, userId)
}

export function recordPersonalityUsage(personalityId: string, context: string, userId?: string): void {
  personalityConfigManager.recordPersonalityUsage(personalityId, context, userId)
}

export function getAvailablePersonalities(): PersonalityMode[] {
  return personalityConfigManager.getAvailablePersonalities()
}
