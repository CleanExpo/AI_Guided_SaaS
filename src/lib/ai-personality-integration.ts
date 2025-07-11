import { PersonalityMode } from '@/types'
import { PersonalityEngine } from './personality-engine'

export interface AICallOptions {
  provider: 'openai' | 'anthropic' | 'google' | 'local'
  model: string
  personalityMode?: PersonalityMode
  temperature?: number
  maxTokens?: number
}

export interface AIResponse {
  content: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  model: string
  personalityMode?: string
}

export class AIPersonalityIntegration {
  private personalityEngine: PersonalityEngine

  constructor() {
    this.personalityEngine = new PersonalityEngine()
  }

  /**
   * Enhance a prompt with personality-specific instructions
   */
  enhancePrompt(originalPrompt: string, personalityMode?: PersonalityMode): string {
    if (!personalityMode || personalityMode.id === 'default') {
      return originalPrompt
    }

    const personalityPrompt = this.personalityEngine.generateSystemPrompt(personalityMode)
    
    return `${personalityPrompt}

Original Request:
${originalPrompt}

Remember to maintain the ${personalityMode.name} personality throughout your response while addressing the user's request.`
  }

  /**
   * Process AI response through personality filter
   */
  processResponse(response: string, personalityMode?: PersonalityMode): string {
    if (!personalityMode || personalityMode.id === 'default') {
      return response
    }

    // Use the personality engine's transform method for Grok mode
    if (personalityMode.id === 'grok-4') {
      return this.personalityEngine.transformResponse(response, personalityMode)
    }

    // Apply post-processing based on personality characteristics
    let processedResponse = response

    if (personalityMode.characteristics.candid) {
      // Ensure response maintains candid tone
      processedResponse = this.ensureCandidTone(processedResponse)
    }

    if (personalityMode.characteristics.witty) {
      // Preserve wit while ensuring appropriateness
      processedResponse = this.preserveHumor(processedResponse)
    }

    if (personalityMode.characteristics.informal) {
      // Maintain informal tone
      processedResponse = this.maintainDirectness(processedResponse)
    }

    return processedResponse
  }

  /**
   * Make an AI call with personality integration
   */
  async makeAICall(prompt: string, options: AICallOptions): Promise<AIResponse> {
    const enhancedPrompt = this.enhancePrompt(prompt, options.personalityMode)
    
    // This would integrate with your existing AI providers
    const response = await this.callAIProvider(enhancedPrompt, options)
    
    const processedContent = this.processResponse(response.content, options.personalityMode)
    
    return {
      ...response,
      content: processedContent,
      personalityMode: options.personalityMode?.id
    }
  }

  /**
   * Get available personality modes
   */
  getAvailablePersonalities(): PersonalityMode[] {
    return this.personalityEngine.getAllPersonalityModes()
  }

  /**
   * Get personality mode by ID
   */
  getPersonalityById(id: string): PersonalityMode | undefined {
    return this.personalityEngine.getPersonalityMode(id)
  }

  private async callAIProvider(prompt: string, options: AICallOptions): Promise<AIResponse> {
    // This is a placeholder - integrate with your actual AI providers
    // You would implement calls to OpenAI, Anthropic, Google, etc. here
    
    switch (options.provider) {
      case 'openai':
        return this.callOpenAI(prompt, options)
      case 'anthropic':
        return this.callAnthropic(prompt, options)
      case 'google':
        return this.callGoogle(prompt, options)
      case 'local':
        return this.callLocalModel(prompt, options)
      default:
        throw new Error(`Unsupported AI provider: ${options.provider}`)
    }
  }

  private async callOpenAI(prompt: string, options: AICallOptions): Promise<AIResponse> {
    // Placeholder for OpenAI integration
    // You would use the OpenAI SDK here
    return {
      content: "OpenAI response placeholder",
      model: options.model,
      usage: {
        promptTokens: 100,
        completionTokens: 200,
        totalTokens: 300
      }
    }
  }

  private async callAnthropic(prompt: string, options: AICallOptions): Promise<AIResponse> {
    // Placeholder for Anthropic integration
    return {
      content: "Anthropic response placeholder",
      model: options.model
    }
  }

  private async callGoogle(prompt: string, options: AICallOptions): Promise<AIResponse> {
    // Placeholder for Google integration
    return {
      content: "Google response placeholder",
      model: options.model
    }
  }

  private async callLocalModel(prompt: string, options: AICallOptions): Promise<AIResponse> {
    // Placeholder for local model integration
    return {
      content: "Local model response placeholder",
      model: options.model
    }
  }

  private ensureCandidTone(response: string): string {
    // Post-process to ensure candid tone is maintained
    // This could involve checking for overly formal language and adjusting
    return response
  }

  private preserveHumor(response: string): string {
    // Ensure humor is appropriate and well-placed
    return response
  }

  private maintainDirectness(response: string): string {
    // Ensure response is direct without being harsh
    return response
  }
}

// Export singleton instance
export const aiPersonalityIntegration = new AIPersonalityIntegration()

// Utility function for quick AI calls with personality
export async function callAIWithPersonality(
  prompt: string,
  personalityId: string = 'default',
  provider: AICallOptions['provider'] = 'openai',
  model: string = 'gpt-4'
): Promise<AIResponse> {
  const personalityMode = aiPersonalityIntegration.getPersonalityById(personalityId)
  
  return aiPersonalityIntegration.makeAICall(prompt, {
    provider,
    model,
    personalityMode,
    temperature: personalityMode?.characteristics.witty ? 0.8 : 0.7,
    maxTokens: 2000
  })
}
