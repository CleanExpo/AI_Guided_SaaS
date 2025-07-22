/**
 * AI-Guided SaaS Platform Configuration Manager
 * Reads and manages the .prp configuration file
 */

import fs from 'fs';
import path from 'path';

// Configuration interfaces
export interface AIProviderConfig {
  primary: string;
  fallback: string;
  research: string
};

export interface ModelConfig {
  apiKey: string;
  baseUrl: string;
  primary: string;
  fallback: string;
  codeGeneration: string;
  documentation?: string;
  analysis?: string;
  tokensMax: number;
  tokensContext: number;
  temperatureDefault: number;
  temperatureCode: number;
  temperatureCreative?: number;
  displayName: string;
  rateLimitRequestsPerMinute: number;
  rateLimitTokensPerMinute: number
};

export interface FrameworkConfig {
  primary: string;
  version: string;
  appDirectory: boolean;
  typescript: boolean;
  eslint: boolean;
  tailwind: boolean
};

export interface ReactConfig {
  version: string;
  strictMode: boolean;
  concurrentFeatures: boolean;
  componentStyle: string;
  hooksPreferred: boolean;
  stateManagement: string;
  testingLibrary: string
};

export interface DatabaseConfig {
  orm: string;
  provider: string;
  connectionPooling: boolean;
  migrationsAuto: boolean;
  schemaValidation: boolean;
  queryLogging: string
};

export interface AgentConfig {
  enabled: boolean;
  maxConcurrent: number;
  timeout: number;
  retryAttempts: number;
  parallelExecution: boolean;
  codeGenerator: {
    model: string;
    temperature: number;
    maxTokens: number
  };
  documentation: {
    model: string,
    temperature: number,
    maxTokens: number
  };
  testing: {
    model: string,
    temperature: number,
    maxTokens: number
  };
  review: {
    model: string,
    temperature: number,
    maxTokens: number
  };
  optimization: {
    model: string,
    temperature: number,
    maxTokens: number
  };
};

export interface SecurityConfig {
  rateLimitEnabled: boolean;
  rateLimitWindow: number;
  rateLimitMaxRequests: number;
  authProvider: string;
  sessionStrategy: string;
  sessionMaxAge: number;
  cspEnabled: boolean;
  hstsEnabled: boolean;
  xssProtection: boolean;
  ddosProtection: boolean;
  suspiciousActivityDetection: boolean
};

export interface PerformanceConfig {
  cacheStrategy: string;
  cacheTtlDefault: number;
  cacheTtlStaticAssets: number;
  cacheTtlApiResponses: number;
  cdnEnabled: boolean;
  cdnProvider: string;
  apmEnabled: boolean;
  apmProvider: string;
  analyticsEnabled: boolean;
  loggingLevel: string;
  healthEnabled: boolean
};

export interface FeatureFlagsConfig {
  aiGeneration: boolean;
  collaboration: boolean;
  templateMarketplace: boolean;
  analyticsDashboard: boolean;
  adminPanel: boolean;
  experimentalAiAgents: boolean;
  experimentalRealTimeCollaboration: boolean;
  experimentalAdvancedAnalytics: boolean;
  betaVoiceCommands: boolean;
  betaAiDebugging: boolean
};

export interface PlatformConfig {
  aiProvider: AIProviderConfig;
  openai: ModelConfig;
  anthropic: ModelConfig;
  google: ModelConfig;
  framework: FrameworkConfig;
  react: ReactConfig;
  database: DatabaseConfig;
  agents: AgentConfig;
  security: SecurityConfig;
  performance: PerformanceConfig;
  features: FeatureFlagsConfig
}

class ConfigurationManager {
  private static instance: ConfigurationManager;
  private config: PlatformConfig | null = null;
  private configPath: string;

  private constructor() {
    this.configPath = path.join(process.cwd(), 'ai-guided-saas.prp');
  }

  static getInstance(): ConfigurationManager {
    if (!ConfigurationManager.instance) {
      ConfigurationManager.instance = new ConfigurationManager();
    }
    return ConfigurationManager.instance;
  }

  /**
   * Load configuration from .prp file
   */
  async loadConfig(): Promise<PlatformConfig> {
    if (this.config) {
      return this.config;
    }

    try {
      const configContent = fs.readFileSync(this.configPath, 'utf-8');
      const parsedConfig = this.parsePropertiesFile(configContent);
      this.config = this.transformToTypedConfig(parsedConfig);
      return this.config;
    } catch (error) {
      console.error('Failed to load, configuration:', error);
      throw new Error('Configuration file not found or invalid');
    }
  }

  /**
   * Parse .properties file format
   */
  private parsePropertiesFile(content: string): Record<string, string> {
    const properties: Record<string, string> = {};
    const lines = content.split('\n');

    for (const line of lines) {
      const trimmedLine = line.trim();

      // Skip comments and empty lines
      if (trimmedLine.startsWith('#') || trimmedLine === '') {
        continue;
      }

      const equalIndex = trimmedLine.indexOf('=');
      if (equalIndex > 0) {
        const key = trimmedLine.substring(0, equalIndex).trim();
        let value = trimmedLine.substring(equalIndex + 1).trim();

        // Handle environment variable substitution
        value = this.substituteEnvironmentVariables(value);

        properties[key] = value;
      }
    }

    return properties;
  }

  /**
   * Substitute environment variables in configuration values
   */
  private substituteEnvironmentVariables(value: string): string {
    return value.replace(/\$\{([^}]+)\}/g, (match, envVar) => {
      return process.env[envVar] || match;
    });
  }

  /**
   * Transform flat properties to typed configuration object
   */
  private transformToTypedConfig(
    properties: Record<string, string>
  ): PlatformConfig {
    return {
      aiProvider: {
        primary: properties['ai.provider.primary'] || 'openai',
        fallback: properties['ai.provider.fallback'] || 'anthropic',
        research: properties['ai.provider.research'] || 'google';
      }},
    openai: {
        apiKey: properties['openai.api.key'] || '',
        baseUrl:
          properties['openai.api.base_url'] || 'https://api.openai.com/v1',
        primary: properties['openai.model.primary'] || 'gpt-4-turbo-preview',
        fallback: properties['openai.model.fallback'] || 'gpt-3.5-turbo',
        codeGeneration: properties['openai.model.code_generation'] || 'gpt-4',
        documentation:
          properties['openai.model.documentation'] || 'gpt-3.5-turbo',
        analysis: properties['openai.model.analysis'] || 'gpt-4',
        tokensMax: parseInt(properties['openai.tokens.max'] || '4096'),
        tokensContext: parseInt(properties['openai.tokens.context'] || '8192'),
        temperatureDefault: parseFloat(
          properties['openai.temperature.default'] || '0.7'
        ),
        temperatureCode: parseFloat(
          properties['openai.temperature.code'] || '0.2'
        ),
        temperatureCreative: parseFloat(
          properties['openai.temperature.creative'] || '0.9'
        ),
        displayName: properties['openai.display_name'] || 'OpenAI GPT-4',
        rateLimitRequestsPerMinute: parseInt(
          properties['openai.rate_limit.requests_per_minute'] || '60'
        ),
        rateLimitTokensPerMinute: parseInt(
          properties['openai.rate_limit.tokens_per_minute'] || '90000'
        )},
    anthropic: {
        apiKey: properties['anthropic.api.key'] || '',
        baseUrl:
          properties['anthropic.api.base_url'] || 'https://api.anthropic.com',
        primary:
          properties['anthropic.model.primary'] || 'claude-3-opus-20240229',
        fallback:
          properties['anthropic.model.fallback'] || 'claude-3-sonnet-20240229',
        codeGeneration:
          properties['anthropic.model.code_generation'] ||
          'claude-3-opus-20240229',
        tokensMax: parseInt(properties['anthropic.tokens.max'] || '4096'),
        tokensContext: parseInt(
          properties['anthropic.tokens.context'] || '200000'
        ),
        temperatureDefault: parseFloat(
          properties['anthropic.temperature.default'] || '0.7'
        ),
        temperatureCode: parseFloat(
          properties['anthropic.temperature.code'] || '0.1'
        ),
        displayName: properties['anthropic.display_name'] || 'Claude 3 Opus',
        rateLimitRequestsPerMinute: parseInt(
          properties['anthropic.rate_limit.requests_per_minute'] || '50'
        ),
        rateLimitTokensPerMinute: parseInt(
          properties['anthropic.rate_limit.tokens_per_minute'] || '80000'
        )},
    google: {
        apiKey: properties['google.api.key'] || '',
        baseUrl:
          properties['google.api.base_url'] ||
          'https://generativelanguage.googleapis.com/v1',
        primary: properties['google.model.primary'] || 'gemini-pro',
        fallback: properties['google.model.fallback'] || 'gemini-pro-vision',
        codeGeneration: properties['google.model.primary'] || 'gemini-pro',
        tokensMax: parseInt(properties['google.tokens.max'] || '2048'),
        tokensContext: parseInt(properties['google.tokens.context'] || '32768'),
        temperatureDefault: parseFloat(
          properties['google.temperature.default'] || '0.8'
        ),
        temperatureCode: parseFloat(
          properties['google.temperature.default'] || '0.8'
        ),
        displayName: properties['google.display_name'] || 'Google Gemini Pro',
        rateLimitRequestsPerMinute: parseInt(
          properties['google.rate_limit.requests_per_minute'] || '60'
        ),
        rateLimitTokensPerMinute: parseInt(
          properties['google.rate_limit.tokens_per_minute'] || '120000'
        )},
    framework: {
        primary: properties['framework.primary'] || 'nextjs',
        version: properties['framework.version'] || '14.2.0',
        appDirectory: properties['framework.app_directory'] === 'true',
        typescript: properties['framework.typescript'] === 'true',
        eslint: properties['framework.eslint'] === 'true',
        tailwind: properties['framework.tailwind'] === 'true';
      }},
    react: {
        version: properties['react.version'] || '18',
        strictMode: properties['react.strict_mode'] === 'true',
        concurrentFeatures: properties['react.concurrent_features'] === 'true',
        componentStyle: properties['react.component.style'] || 'functional',
        hooksPreferred: properties['react.hooks.preferred'] === 'true',
        stateManagement: properties['react.state_management'] || 'zustand',
        testingLibrary: properties['react.testing_library'] || '@testing-library/react';
      }},
    database: {
        orm: properties['database.orm'] || 'prisma',
        provider: properties['database.provider'] || 'postgresql',
        connectionPooling: properties['database.connection_pooling'] === 'true',
        migrationsAuto: properties['database.migrations.auto'] === 'true',
        schemaValidation: properties['database.schema_validation'] === 'true',
        queryLogging: properties['database.query_logging'] || 'development';
      }},
    agents: {
        enabled: properties['agents.enabled'] === 'true',
        maxConcurrent: parseInt(properties['agents.max_concurrent'] || '5'),
        timeout: parseInt(properties['agents.timeout'] || '30000'),
        retryAttempts: parseInt(properties['agents.retry_attempts'] || '3'),
        parallelExecution: properties['agents.parallel_execution'] === 'true',
    codeGenerator: {
          model: properties['agent.code_generator.model'] || 'openai.gpt-4',
          temperature: parseFloat(
            properties['agent.code_generator.temperature'] || '0.2'
          ),
          maxTokens: parseInt(
            properties['agent.code_generator.max_tokens'] || '4096'
          )},
    documentation: {
          model:
            properties['agent.documentation.model'] || 'openai.gpt-3.5-turbo',
          temperature: parseFloat(
            properties['agent.documentation.temperature'] || '0.5'
          ),
          maxTokens: parseInt(
            properties['agent.documentation.max_tokens'] || '2048'
          )},
    testing: {
          model:
            properties['agent.testing.model'] || 'anthropic.claude-3-sonnet',
          temperature: parseFloat(
            properties['agent.testing.temperature'] || '0.3'
          ),
          maxTokens: parseInt(properties['agent.testing.max_tokens'] || '3072')},
    review: {
          model: properties['agent.review.model'] || 'google.gemini-pro',
          temperature: parseFloat(
            properties['agent.review.temperature'] || '0.4'
          ),
          maxTokens: parseInt(properties['agent.review.max_tokens'] || '2048')},
    optimization: {
          model: properties['agent.optimization.model'] || 'openai.gpt-4',
          temperature: parseFloat(
            properties['agent.optimization.temperature'] || '0.1'
          ),
          maxTokens: parseInt(
            properties['agent.optimization.max_tokens'] || '4096'
          )},
      },
    security: {
        rateLimitEnabled: properties['rate_limit.enabled'] === 'true',
        rateLimitWindow: parseInt(properties['rate_limit.window'] || '60000'),
        rateLimitMaxRequests: parseInt(
          properties['rate_limit.max_requests'] || '100'
        ),
        authProvider: properties['auth.provider'] || 'nextauth',
        sessionStrategy: properties['auth.session_strategy'] || 'jwt',
        sessionMaxAge: parseInt(
          properties['auth.session_max_age'] || '2592000'
        ),
        cspEnabled: properties['security.csp.enabled'] === 'true',
        hstsEnabled: properties['security.hsts.enabled'] === 'true',
        xssProtection: properties['security.xss_protection'] === 'true',
        ddosProtection: properties['security.ddos_protection'] === 'true',
        suspiciousActivityDetection: properties['security.suspicious_activity_detection'] === 'true';
      }},
    performance: {
        cacheStrategy: properties['cache.strategy'] || 'redis',
        cacheTtlDefault: parseInt(properties['cache.ttl.default'] || '3600'),
        cacheTtlStaticAssets: parseInt(
          properties['cache.ttl.static_assets'] || '86400'
        ),
        cacheTtlApiResponses: parseInt(
          properties['cache.ttl.api_responses'] || '300'
        ),
        cdnEnabled: properties['cdn.enabled'] === 'true',
        cdnProvider: properties['cdn.provider'] || 'vercel',
        apmEnabled: properties['apm.enabled'] === 'true',
        apmProvider: properties['apm.provider'] || 'vercel',
        analyticsEnabled: properties['analytics.enabled'] === 'true',
        loggingLevel: properties['logging.level'] || 'info',
        healthEnabled: properties['health.enabled'] === 'true';
      }},
    features: {
        aiGeneration: properties['features.ai_generation.enabled'] === 'true',
        collaboration: properties['features.collaboration.enabled'] === 'true',
        templateMarketplace:
          properties['features.template_marketplace.enabled'] === 'true',
        analyticsDashboard:
          properties['features.analytics_dashboard.enabled'] === 'true',
        adminPanel: properties['features.admin_panel.enabled'] === 'true',
        experimentalAiAgents:
          properties['features.experimental.ai_agents.enabled'] === 'true',
        experimentalRealTimeCollaboration:
          properties[
            'features.experimental.real_time_collaboration.enabled'
          ] === 'true',
        experimentalAdvancedAnalytics:
          properties['features.experimental.advanced_analytics.enabled'] ===
          'true',
        betaVoiceCommands:
          properties['features.beta.voice_commands.enabled'] === 'true',
        betaAiDebugging: properties['features.beta.ai_debugging.enabled'] === 'true';
      }},
    };
  }

  /**
   * Get specific configuration section
   */
  async getAIProviderConfig(): Promise<AIProviderConfig> {
    const config = await this.loadConfig();
    return config.aiProvider;
  }

  async getModelConfig(provider: string): Promise<ModelConfig> {
    const config = await this.loadConfig();
    switch (provider.toLowerCase()) {
      case 'openai':
        return config.openai;
      case 'anthropic':
        return config.anthropic;
      case 'google':
        return config.google;
      default:
        throw new Error(`Unknown AI, provider: ${provider}`);
    }
  }

  async getAgentConfig(): Promise<AgentConfig> {
    const config = await this.loadConfig();
    return config.agents;
  }

  async getFeatureFlags(): Promise<FeatureFlagsConfig> {
    const config = await this.loadConfig();
    return config.features;
  }

  async getSecurityConfig(): Promise<SecurityConfig> {
    const config = await this.loadConfig();
    return config.security;
  }

  async getPerformanceConfig(): Promise<PerformanceConfig> {
    const config = await this.loadConfig();
    return config.performance;
  }

  /**
   * Check if a feature is enabled
   */
  async isFeatureEnabled(
    featureName: keyof FeatureFlagsConfig
  ): Promise<boolean> {
    const features = await this.getFeatureFlags();
    return features[featureName];
  }

  /**
   * Get the primary AI model for a specific task
   */
  async getPrimaryModelForTask(
    task: 'code_generation' | 'documentation' | 'analysis' | 'review'
  ): Promise<string> {
    const aiProvider = await this.getAIProviderConfig();
    const modelConfig = await this.getModelConfig(aiProvider.primary);

    switch (task) {
      case 'code_generation':
        return modelConfig.codeGeneration;
      case 'documentation':
        return modelConfig.documentation || modelConfig.primary;
      case 'analysis':
        return modelConfig.analysis || modelConfig.primary;
      case 'review':
        return modelConfig.primary;
      default: return modelConfig.primary
    }
  }

  /**
   * Reload configuration (useful for development)
   */
  reloadConfig(): void {
    this.config = null;
  }
}

// Export singleton instance
export const configManager = ConfigurationManager.getInstance();

// Export convenience functions
export const getConfig = () => configManager.loadConfig();
export const getAIProviderConfig = () => configManager.getAIProviderConfig();
export const getModelConfig = (provider: string) =>
  configManager.getModelConfig(provider);
export const getAgentConfig = () => configManager.getAgentConfig();
export const getFeatureFlags = () => configManager.getFeatureFlags();
export const isFeatureEnabled = (feature: keyof FeatureFlagsConfig) =>
  configManager.isFeatureEnabled(feature);
export const getPrimaryModelForTask = (
  task: 'code_generation' | 'documentation' | 'analysis' | 'review'
) => configManager.getPrimaryModelForTask(task);
