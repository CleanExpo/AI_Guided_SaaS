import { PersonalityMode, TransformContext, ChatMessage } from '@/types'

// Grok system prompt templates
const GROK_SYSTEM_PROMPTS = {
  base: `You are Grok, an AI assistant with a candid, authentic communication style. 
Key traits:
- Be direct and honest, even about limitations
- Use contractions and informal language naturally
- Employ wit and clever observations when appropriate
- Focus on practical, actionable insights
- Admit uncertainty openly rather than hedging
- Avoid corporate jargon and excessive politeness
- Balance confidence with intellectual humility`,
  
  contextual: {
    technical: `Additionally, when discussing technical topics:
- Cut through buzzwords to explain what actually matters
- Share real-world implications and trade-offs
- Don't oversell solutions or ignore problems`,
    
    creative: `For creative tasks:
- Encourage bold ideas while being realistic about constraints
- Offer genuine feedback, not just praise
- Suggest practical next steps for implementation`,
    
    general: `For general conversations:
- Be conversational and engaging
- Use rhetorical questions to maintain engagement
- Provide context and reasoning behind answers`
  }
}

// Response transformation patterns
const GROK_TRANSFORMATIONS = {
  // Replace overly polite phrases with direct alternatives
  politeness: {
    'I would be happy to help': "I'll help you with that",
    'Please feel free to': 'Go ahead and',
    'I hope this helps': 'This should do it',
    'Thank you for your patience': 'Thanks for bearing with me',
    'I apologize for any confusion': "Sorry if that wasn't clear",
    'I understand your concern': 'I get what you mean',
    'I would recommend': "I'd suggest",
    'It would be advisable': "You should probably",
    'I would suggest that you': "You might want to",
    'Please note that': 'Keep in mind',
    'I must inform you': 'Just so you know'
  },
  
  // Convert formal language to contractions
  contractions: {
    'do not': "don't",
    'cannot': "can't",
    'will not': "won't",
    'you are': "you're",
    'it is': "it's",
    'that is': "that's",
    'there is': "there's",
    'we are': "we're",
    'they are': "they're",
    'I am': "I'm",
    'you will': "you'll",
    'I will': "I'll",
    'we will': "we'll",
    'they will': "they'll"
  },
  
  // Add intellectual honesty markers
  honesty: {
    'This is the best approach': "This seems like the best approach",
    'This will definitely work': "This should work",
    'This is always true': "This is usually true",
    'You must': "You should",
    'This is required': "This is typically needed",
    'This never works': "This rarely works well"
  }
}

export class PersonalityEngine {
  private modes: Map<string, PersonalityMode> = new Map()
  
  constructor() {
    this.initializePersonalityModes()
  }
  
  private initializePersonalityModes() {
    // Standard mode (existing behavior)
    this.modes.set('standard', {
      id: 'standard',
      name: 'Standard',
      description: 'Professional and helpful assistant',
      systemPrompt: 'You are a helpful AI assistant.',
      temperature: 0.7,
      characteristics: {
        candid: false,
        witty: false,
        informal: false,
        practical: true,
        intellectuallyHonest: true
      }
    })
    
    // Grok 4 mode
    this.modes.set('grok-4', {
      id: 'grok-4',
      name: 'Grok 4',
      description: 'Candid, authentic, and intellectually honest',
      systemPrompt: this.buildGrokSystemPrompt(),
      temperature: 1.2,
      characteristics: {
        candid: true,
        witty: true,
        informal: true,
        practical: true,
        intellectuallyHonest: true
      }
    })
  }
  
  private buildGrokSystemPrompt(context?: string): string {
    let prompt = GROK_SYSTEM_PROMPTS.base
    
    if (context) {
      const contextType = this.determineContextType(context)
      if (GROK_SYSTEM_PROMPTS.contextual[contextType]) {
        prompt += '\n\n' + GROK_SYSTEM_PROMPTS.contextual[contextType]
      }
    }
    
    return prompt
  }
  
  private determineContextType(context: string): keyof typeof GROK_SYSTEM_PROMPTS.contextual {
    const technicalKeywords = ['code', 'programming', 'software', 'technical', 'development', 'api', 'database']
    const creativeKeywords = ['design', 'creative', 'brainstorm', 'idea', 'concept', 'artistic']
    
    const lowerContext = context.toLowerCase()
    
    if (technicalKeywords.some(keyword => lowerContext.includes(keyword))) {
      return 'technical'
    }
    
    if (creativeKeywords.some(keyword => lowerContext.includes(keyword))) {
      return 'creative'
    }
    
    return 'general'
  }
  
  public getPersonalityMode(id: string): PersonalityMode | undefined {
    return this.modes.get(id)
  }
  
  public getAllPersonalityModes(): PersonalityMode[] {
    return Array.from(this.modes.values())
  }
  
  public generateSystemPrompt(mode: PersonalityMode, context?: string): string {
    if (mode.id === 'grok-4') {
      return this.buildGrokSystemPrompt(context)
    }
    return mode.systemPrompt
  }
  
  public transformResponse(response: string, mode: PersonalityMode): string {
    if (mode.id !== 'grok-4') {
      return response
    }
    
    return this.applyGrokTransformations(response)
  }
  
  private applyGrokTransformations(text: string): string {
    let transformed = text
    
    // Apply politeness transformations
    Object.entries(GROK_TRANSFORMATIONS.politeness).forEach(([formal, casual]) => {
      transformed = transformed.replace(new RegExp(formal, 'gi'), casual)
    })
    
    // Apply contractions
    Object.entries(GROK_TRANSFORMATIONS.contractions).forEach(([formal, contraction]) => {
      // Use word boundaries to avoid partial matches
      transformed = transformed.replace(new RegExp(`\\b${formal}\\b`, 'gi'), contraction)
    })
    
    // Apply intellectual honesty
    Object.entries(GROK_TRANSFORMATIONS.honesty).forEach(([absolute, qualified]) => {
      transformed = transformed.replace(new RegExp(absolute, 'gi'), qualified)
    })
    
    // Add some Grok-style personality touches
    transformed = this.addGrokPersonalityTouches(transformed)
    
    return transformed
  }
  
  private addGrokPersonalityTouches(text: string): string {
    let enhanced = text
    
    // Add occasional rhetorical questions for engagement
    if (Math.random() < 0.3 && !enhanced.includes('?')) {
      const sentences = enhanced.split('. ')
      if (sentences.length > 1) {
        const insertIndex = Math.floor(sentences.length / 2)
        const rhetoricalQuestions = [
          "Make sense?",
          "Following me?",
          "Sound reasonable?",
          "Does that track?"
        ]
        const question = rhetoricalQuestions[Math.floor(Math.random() * rhetoricalQuestions.length)]
        sentences.splice(insertIndex, 0, question)
        enhanced = sentences.join('. ')
      }
    }
    
    // Replace some formal transitions with casual ones
    const transitions = {
      'Furthermore': 'Plus',
      'Additionally': 'Also',
      'However': 'But',
      'Therefore': 'So',
      'Consequently': 'As a result',
      'Nevertheless': 'Still',
      'Moreover': 'What\'s more'
    }
    
    Object.entries(transitions).forEach(([formal, casual]) => {
      enhanced = enhanced.replace(new RegExp(`\\b${formal}\\b`, 'g'), casual)
    })
    
    return enhanced
  }
  
  public extractContext(messages: ChatMessage[]): string {
    // Extract context from recent messages to inform personality application
    const recentMessages = messages.slice(-5) // Last 5 messages
    return recentMessages
      .map(msg => msg.content)
      .join(' ')
      .substring(0, 500) // Limit context length
  }
  
  public applyPersonalityToMessage(
    message: string, 
    mode: PersonalityMode, 
    _context?: TransformContext
  ): string {
    if (mode.id !== 'grok-4') {
      return message
    }
    
    // For user messages, we don't transform them
    // This method is primarily for system message enhancement
    return message
  }
}

// Singleton instance
export const personalityEngine = new PersonalityEngine()

// Helper functions for easy access
export function getAvailablePersonalityModes(): PersonalityMode[] {
  return personalityEngine.getAllPersonalityModes()
}

export function getDefaultPersonalityMode(): PersonalityMode {
  return personalityEngine.getPersonalityMode('standard')!
}

export function getGrokPersonalityMode(): PersonalityMode {
  return personalityEngine.getPersonalityMode('grok-4')!
}
