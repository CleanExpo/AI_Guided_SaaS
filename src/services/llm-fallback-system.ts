import { OpenAI } from 'openai';
import Anthropic from '@anthropic-ai/sdk';

interface LLMProvider {
  name: string;
  priority: number;
  isAvailable: () => Promise<boolean>;
  complete: (prompt: string, options?: CompletionOptions) => Promise<string>;
  estimateCost: (tokens: number) => number;
}

interface CompletionOptions {
  maxTokens?: number;
  temperature?: number;
  model?: string;
  stream?: boolean;
}

interface FallbackConfig {
  maxRetries: number;
  retryDelay: number;
  timeout: number;
  costThreshold?: number;
  providers: LLMProvider[];
}

interface LLMResponse {
  provider: string;
  response: string;
  tokens: number;
  cost: number;
  latency: number;
  fallbackAttempts: number;
}

class LLMFallbackSystem {
  private config: FallbackConfig;
  private providers: Map<string, LLMProvider> = new Map();
  private healthStatus: Map<string, boolean> = new Map();
  private lastHealthCheck: Map<string, Date> = new Map();
  private metrics: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    fallbacksUsed: number;
    averageLatency: number;
    totalCost: number;
  };

  constructor(config: FallbackConfig) {
    this.config = config;
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      fallbacksUsed: 0,
      averageLatency: 0,
      totalCost: 0
    };

    this.initializeProviders();
  }

  private initializeProviders() {
    // OpenAI Provider
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    this.providers.set('openai', {
      name: 'OpenAI',
      priority: 1,
      isAvailable: async () => {
        try {
          const response = await fetch('https://api.openai.com/v1/models', {
            headers: {
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            }
          });
          return response.ok;
        } catch {
          return false;
        }
      },
      complete: async (prompt, options) => {
        const completion = await openai.chat.completions.create({
          model: options?.model || 'gpt-4',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: options?.maxTokens || 1000,
          temperature: options?.temperature || 0.7,
          stream: options?.stream || false
        });
        return completion.choices[0].message.content || '';
      },
      estimateCost: (tokens) => tokens * 0.00003 // GPT-4 pricing estimate
    });

    // Anthropic Provider
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    this.providers.set('anthropic', {
      name: 'Anthropic',
      priority: 2,
      isAvailable: async () => {
        try {
          // Check Anthropic API health
          const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'HEAD',
            headers: {
              'x-api-key': process.env.ANTHROPIC_API_KEY || '',
              'anthropic-version': '2023-06-01'
            }
          });
          return response.status !== 503;
        } catch {
          return false;
        }
      },
      complete: async (prompt, options) => {
        const message = await anthropic.messages.create({
          model: options?.model || 'claude-3-opus-20240229',
          max_tokens: options?.maxTokens || 1000,
          temperature: options?.temperature || 0.7,
          messages: [{ role: 'user', content: prompt }]
        });
        return message.content[0].type === 'text' ? message.content[0].text : '';
      },
      estimateCost: (tokens) => tokens * 0.000024 // Claude pricing estimate
    });

    // Local/Fallback Provider (using a simple echo for demo)
    this.providers.set('local', {
      name: 'Local Fallback',
      priority: 99,
      isAvailable: async () => true,
      complete: async (prompt) => {
        // In production, this could be a local model or cached responses
        return `[Fallback Response] Your request: "${prompt.substring(0, 100)}..." has been processed locally.`;
      },
      estimateCost: () => 0
    });

    // Sort providers by priority
    this.config.providers = Array.from(this.providers.values()).sort((a, b) => a.priority - b.priority);
  }

  async complete(prompt: string, options?: CompletionOptions): Promise<LLMResponse> {
    this.metrics.totalRequests++;
    const startTime = Date.now();
    let fallbackAttempts = 0;
    let lastError: Error | null = null;

    for (const provider of this.config.providers) {
      try {
        // Check provider health with caching
        const isHealthy = await this.checkProviderHealth(provider.name);
        if (!isHealthy) {
          console.log(`Provider ${provider.name} is unhealthy, skipping...`);
          fallbackAttempts++;
          continue;
        }

        // Estimate cost before making request
        const estimatedTokens = Math.ceil(prompt.length / 4) + (options?.maxTokens || 1000);
        const estimatedCost = provider.estimateCost(estimatedTokens);

        if (this.config.costThreshold && estimatedCost > this.config.costThreshold) {
          console.log(`Provider ${provider.name} exceeds cost threshold, skipping...`);
          fallbackAttempts++;
          continue;
        }

        // Make the request with timeout
        const response = await this.makeRequestWithTimeout(
          provider.complete(prompt, options),
          this.config.timeout
        );

        const latency = Date.now() - startTime;
        const actualCost = provider.estimateCost(estimatedTokens);

        // Update metrics
        this.metrics.successfulRequests++;
        this.metrics.totalCost += actualCost;
        this.metrics.averageLatency = 
          (this.metrics.averageLatency * (this.metrics.successfulRequests - 1) + latency) / 
          this.metrics.successfulRequests;

        if (fallbackAttempts > 0) {
          this.metrics.fallbacksUsed++;
        }

        return {
          provider: provider.name,
          response,
          tokens: estimatedTokens,
          cost: actualCost,
          latency,
          fallbackAttempts
        };

      } catch (error) {
        console.error(`Provider ${provider.name} failed:`, error);
        lastError = error as Error;
        fallbackAttempts++;
        
        // Mark provider as unhealthy
        this.healthStatus.set(provider.name, false);
        
        // Wait before trying next provider
        if (fallbackAttempts < this.config.providers.length) {
          await this.delay(this.config.retryDelay * fallbackAttempts);
        }
      }
    }

    // All providers failed
    this.metrics.failedRequests++;
    throw new Error(`All LLM providers failed. Last error: ${lastError?.message}`);
  }

  private async checkProviderHealth(providerName: string): Promise<boolean> {
    const lastCheck = this.lastHealthCheck.get(providerName);
    const now = new Date();
    
    // Cache health status for 5 minutes
    if (lastCheck && (now.getTime() - lastCheck.getTime()) < 5 * 60 * 1000) {
      return this.healthStatus.get(providerName) ?? false;
    }

    const provider = this.providers.get(providerName);
    if (!provider) return false;

    try {
      const isHealthy = await provider.isAvailable();
      this.healthStatus.set(providerName, isHealthy);
      this.lastHealthCheck.set(providerName, now);
      return isHealthy;
    } catch {
      this.healthStatus.set(providerName, false);
      this.lastHealthCheck.set(providerName, now);
      return false;
    }
  }

  private async makeRequestWithTimeout<T>(promise: Promise<T>, timeout: number): Promise<T> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), timeout);
    });
    return Promise.race([promise, timeoutPromise]);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getMetrics() {
    return {
      ...this.metrics,
      providerHealth: Object.fromEntries(this.healthStatus),
      successRate: this.metrics.totalRequests > 0 
        ? (this.metrics.successfulRequests / this.metrics.totalRequests) * 100 
        : 0,
      fallbackRate: this.metrics.successfulRequests > 0
        ? (this.metrics.fallbacksUsed / this.metrics.successfulRequests) * 100
        : 0
    };
  }

  async testAllProviders(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};
    
    for (const [name, provider] of this.providers) {
      try {
        const startTime = Date.now();
        const response = await this.makeRequestWithTimeout(
          provider.complete('Hello, please respond with "OK"', { maxTokens: 10 }),
          5000
        );
        const latency = Date.now() - startTime;
        
        results[name] = response.toLowerCase().includes('ok');
        console.log(`✓ ${name}: OK (${latency}ms)`);
      } catch (error) {
        results[name] = false;
        console.log(`✗ ${name}: Failed - ${error}`);
      }
    }
    
    return results;
  }
}

// Singleton instance
let llmFallbackInstance: LLMFallbackSystem | null = null;

export function initializeLLMFallback(config?: Partial<FallbackConfig>): LLMFallbackSystem {
  if (!llmFallbackInstance) {
    llmFallbackInstance = new LLMFallbackSystem({
      maxRetries: 3,
      retryDelay: 1000,
      timeout: 30000,
      costThreshold: 0.5,
      providers: [],
      ...config
    });
  }
  return llmFallbackInstance;
}

export function getLLMFallback(): LLMFallbackSystem {
  if (!llmFallbackInstance) {
    throw new Error('LLM Fallback System not initialized');
  }
  return llmFallbackInstance;
}

// Helper function for easy usage
export async function completeLLM(prompt: string, options?: CompletionOptions): Promise<string> {
  const llm = getLLMFallback();
  const response = await llm.complete(prompt, options);
  return response.response;
}

export { LLMFallbackSystem, type LLMResponse, type CompletionOptions };