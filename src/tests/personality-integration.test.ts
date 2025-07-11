import { PersonalityEngine } from '@/lib/personality-engine'
import { AIPersonalityIntegration } from '@/lib/ai-personality-integration'
import { PersonalityConfigManager } from '@/lib/personality-config'

describe('Personality Integration Tests', () => {
  let personalityEngine: PersonalityEngine
  let aiIntegration: AIPersonalityIntegration
  let configManager: PersonalityConfigManager

  beforeEach(() => {
    personalityEngine = new PersonalityEngine()
    aiIntegration = new AIPersonalityIntegration()
    configManager = new PersonalityConfigManager()
  })

  describe('PersonalityEngine', () => {
    test('should initialize with default personality modes', () => {
      const modes = personalityEngine.getAllPersonalityModes()
      expect(modes).toHaveLength(2)
      expect(modes.map(m => m.id)).toContain('standard')
      expect(modes.map(m => m.id)).toContain('grok-4')
    })

    test('should get personality mode by ID', () => {
      const grokMode = personalityEngine.getPersonalityMode('grok-4')
      expect(grokMode).toBeDefined()
      expect(grokMode?.name).toBe('Grok 4')
      expect(grokMode?.characteristics.candid).toBe(true)
    })

    test('should generate system prompt for Grok mode', () => {
      const grokMode = personalityEngine.getPersonalityMode('grok-4')!
      const prompt = personalityEngine.generateSystemPrompt(grokMode)
      expect(prompt).toContain('candid, authentic communication style')
      expect(prompt).toContain('Be direct and honest')
    })

    test('should transform response for Grok mode', () => {
      const grokMode = personalityEngine.getPersonalityMode('grok-4')!
      const originalResponse = "I would be happy to help you with this. You are going to need to do not worry about it."
      const transformed = personalityEngine.transformResponse(originalResponse, grokMode)
      
      expect(transformed).toContain("I'll help you with that")
      expect(transformed).toContain("you're")
      expect(transformed).toContain("don't")
    })

    test('should extract context from messages', () => {
      const messages = [
        { role: 'user', content: 'I need help with programming' },
        { role: 'assistant', content: 'Sure, what programming language?' },
        { role: 'user', content: 'JavaScript debugging issue' }
      ]
      const context = personalityEngine.extractContext(messages as any)
      expect(context).toContain('programming')
      expect(context).toContain('debugging')
    })
  })

  describe('AIPersonalityIntegration', () => {
    test('should enhance prompt with personality', () => {
      const grokMode = personalityEngine.getPersonalityMode('grok-4')!
      const originalPrompt = "Help me with coding"
      const enhanced = aiIntegration.enhancePrompt(originalPrompt, grokMode)
      
      expect(enhanced).toContain('candid, authentic communication style')
      expect(enhanced).toContain('Help me with coding')
      expect(enhanced).toContain('Grok 4 personality')
    })

    test('should process response through personality filter', () => {
      const grokMode = personalityEngine.getPersonalityMode('grok-4')!
      const response = "I would be happy to help you. You are correct."
      const processed = aiIntegration.processResponse(response, grokMode)
      
      expect(processed).toContain("I'll help you")
      expect(processed).toContain("you're")
    })

    test('should get available personalities', () => {
      const personalities = aiIntegration.getAvailablePersonalities()
      expect(personalities).toHaveLength(2)
      expect(personalities.map(p => p.id)).toContain('standard')
      expect(personalities.map(p => p.id)).toContain('grok-4')
    })

    test('should get personality by ID', () => {
      const grokMode = aiIntegration.getPersonalityById('grok-4')
      expect(grokMode).toBeDefined()
      expect(grokMode?.name).toBe('Grok 4')
    })
  })

  describe('PersonalityConfigManager', () => {
    test('should initialize with default config', () => {
      const config = configManager.getConfig()
      expect(config.defaultPersonality).toBe('standard')
      expect(config.enabledPersonalities).toContain('standard')
      expect(config.enabledPersonalities).toContain('grok-4')
      expect(config.contextualSwitching).toBe(true)
    })

    test('should update configuration', () => {
      configManager.updateConfig({
        defaultPersonality: 'grok-4',
        autoDetectContext: false
      })
      
      const config = configManager.getConfig()
      expect(config.defaultPersonality).toBe('grok-4')
      expect(config.autoDetectContext).toBe(false)
    })

    test('should manage user preferences', () => {
      const userId = 'test-user'
      configManager.setUserPreferences(userId, {
        preferredPersonality: 'grok-4',
        contextOverrides: { 'technical': 'grok-4' }
      })
      
      const prefs = configManager.getUserPreferences(userId)
      expect(prefs?.preferredPersonality).toBe('grok-4')
      expect(prefs?.contextOverrides.technical).toBe('grok-4')
    })

    test('should detect contextual personality', () => {
      const technicalContext = "I need help debugging this code issue"
      const personality = configManager.getRecommendedPersonality(technicalContext)
      expect(personality.id).toBe('grok-4')
      
      const creativeContext = "Help me brainstorm creative ideas"
      const creativePersonality = configManager.getRecommendedPersonality(creativeContext)
      expect(creativePersonality.id).toBe('grok-4')
    })

    test('should get available personalities based on config', () => {
      const personalities = configManager.getAvailablePersonalities()
      expect(personalities).toHaveLength(2)
      
      // Disable grok-4
      configManager.updateConfig({
        enabledPersonalities: ['standard']
      })
      
      const filteredPersonalities = configManager.getAvailablePersonalities()
      expect(filteredPersonalities).toHaveLength(1)
      expect(filteredPersonalities[0].id).toBe('standard')
    })

    test('should record personality usage', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
      
      configManager.recordPersonalityUsage('grok-4', 'technical', 'test-user')
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'Personality usage: grok-4 for context: technical'
      )
      
      const prefs = configManager.getUserPreferences('test-user')
      expect(prefs?.lastUsed).toBe('grok-4')
      
      consoleSpy.mockRestore()
    })
  })

  describe('Integration Tests', () => {
    test('should work end-to-end with context detection', () => {
      const context = "I'm having trouble with my JavaScript code"
      const userId = 'test-user'
      
      // Should auto-detect Grok personality for technical context
      const personality = configManager.getRecommendedPersonality(context, userId)
      expect(personality.id).toBe('grok-4')
      
      // Should enhance prompt appropriately
      const prompt = "Help me debug this function"
      const enhanced = aiIntegration.enhancePrompt(prompt, personality)
      expect(enhanced).toContain('candid, authentic communication style')
      
      // Should transform response
      const response = "I would be happy to help you with this issue. You are going to need to check your code."
      const transformed = aiIntegration.processResponse(response, personality)
      expect(transformed).toContain("I'll help you")
      expect(transformed).toContain("you're")
    })

    test('should respect user preferences over context detection', () => {
      const userId = 'test-user'
      const context = "Help me with programming"
      
      // Set user preference to standard
      configManager.setUserPreferences(userId, {
        preferredPersonality: 'standard'
      })
      
      const personality = configManager.getRecommendedPersonality(context, userId)
      expect(personality.id).toBe('standard')
    })

    test('should handle context overrides', () => {
      const userId = 'test-user'
      const context = "creative brainstorming session"
      
      // Set context override
      configManager.setUserPreferences(userId, {
        preferredPersonality: 'standard',
        contextOverrides: { 'creative': 'grok-4' }
      })
      
      const personality = configManager.getRecommendedPersonality(context, userId)
      expect(personality.id).toBe('grok-4')
    })
  })

  describe('Error Handling', () => {
    test('should handle invalid personality ID gracefully', () => {
      const invalidPersonality = aiIntegration.getPersonalityById('invalid-id')
      expect(invalidPersonality).toBeUndefined()
    })

    test('should fallback to default personality when needed', () => {
      const personality = configManager.getRecommendedPersonality('random context')
      expect(personality.id).toBe('standard') // Should fallback to default
    })

    test('should handle empty context gracefully', () => {
      const personality = configManager.getRecommendedPersonality('')
      expect(personality).toBeDefined()
      expect(personality.id).toBe('standard')
    })
  })

  describe('Performance Tests', () => {
    test('should transform responses efficiently', () => {
      const grokMode = personalityEngine.getPersonalityMode('grok-4')!
      const longResponse = "I would be happy to help you. ".repeat(100)
      
      const startTime = performance.now()
      const transformed = personalityEngine.transformResponse(longResponse, grokMode)
      const endTime = performance.now()
      
      expect(endTime - startTime).toBeLessThan(100) // Should complete in under 100ms
      expect(transformed).toContain("I'll help you")
    })

    test('should handle multiple personality switches efficiently', () => {
      const startTime = performance.now()
      
      for (let i = 0; i < 100; i++) {
        const personality = configManager.getRecommendedPersonality(`test context ${i}`)
        expect(personality).toBeDefined()
      }
      
      const endTime = performance.now()
      expect(endTime - startTime).toBeLessThan(50) // Should complete in under 50ms
    })
  })
})

// Mock localStorage for testing
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock performance for Node.js environment
if (typeof performance === 'undefined') {
  global.performance = {
    now: () => Date.now()
  } as any
}
