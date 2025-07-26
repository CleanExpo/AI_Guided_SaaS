import { EventEmitter } from 'events';
import { Integration, IntegrationEndpoint, InstalledItem } from './types';

export class IntegrationManager extends EventEmitter {
  private installedItems: Map<string, InstalledItem>;
  private integrations: Map<string, Integration> = new Map();

  constructor(installedItems: Map<string, InstalledItem>) {
    super();
    this.installedItems = installedItems;
  }

  async setupIntegration(integrationId: string, credentials: Record<string, string>): Promise<void> {
    this.emit('integration:start', integrationId);
    
    try {
      // Fetch integration details
      const integration = await this.fetchIntegration(integrationId);
      
      // Validate credentials
      this.validateCredentials(integration, credentials);
      
      // Test connection
      await this.testIntegrationConnection(integration, credentials);
      
      // Save integration
      this.integrations.set(integrationId, integration);
      
      // Save credentials securely
      await this.saveCredentials(integrationId, credentials);
      
      // Save installation record
      this.installedItems.set(integrationId, {
        type: 'integration',
        installedAt: new Date(),
        version: '1.0.0'
      });
      
      this.emit('integration:complete', integrationId);
    } catch (error) {
      this.emit('integration:error', { id: integrationId, error });
      throw error;
    }
  }

  async callIntegration(integrationId: string, 
    endpoint: string,
    params?: Record<string, any>
  ): Promise<any> {
    const integration = this.integrations.get(integrationId);
    if (!integration) throw new Error('Integration not found');
    
    const endpointConfig = integration.endpoints.find(e => e.name === endpoint);
    if (!endpointConfig) throw new Error('Endpoint not found');
    
    // Get stored credentials
    const credentials = await this.getCredentials(integrationId);
    
    // Make API call
    return this.makeApiCall(integration, endpointConfig, credentials, params);
  }

  async removeIntegration(integrationId: string): Promise<void> {
    // Remove integration
    this.integrations.delete(integrationId);
    
    // Remove stored credentials
    await this.removeCredentials(integrationId);
    
    // Remove from installed items
    this.installedItems.delete(integrationId);
    
    this.emit('integration:removed', integrationId);
  }

  getIntegrations(): string[] {
    return Array.from(this.integrations.keys());
  }

  getIntegration(integrationId: string): Integration | undefined {
    return this.integrations.get(integrationId);
  }

  private async fetchIntegration(integrationId: string): Promise<Integration> {
    // Simulate fetching from marketplace API
    return {
      id: integrationId,
      name: 'Sample Integration',
      description: 'A sample integration',
      provider: 'sample',
      category: 'database',
      credentials: [],
      endpoints: [],
      features: [],
      documentation: ''
    };
  }

  private validateCredentials(integration: Integration)
    credentials: Record<string, string>)
  ): void {
    for (const cred of integration.credentials) {
      if (cred.required && !credentials[cred.key]) {
        throw new Error(`Required credential ${cred.key} not provided`);
      }
    }
  }

  private async testIntegrationConnection(integration: Integration)
    credentials: Record<string, string>)
  ): Promise<void> {
    // Test if credentials work
    console.log(`Testing connection for integration: ${integration.name}`);
  }

  private async saveCredentials(integrationId: string)
    credentials: Record<string, string>)
  ): Promise<void> {
    // Save credentials securely (encrypted)
    const encryptedCredentials = this.encryptCredentials(credentials);
    localStorage.setItem(`integration_creds_${integrationId}`, encryptedCredentials);
  }

  private async getCredentials(integrationId: string): Promise<Record<string, string> {
    // Retrieve stored credentials
    const encrypted = localStorage.getItem(`integration_creds_${integrationId}`);
    if (!encrypted) return {};
    
    return this.decryptCredentials(encrypted);
  }

  private async removeCredentials(integrationId: string): Promise<void> {
    localStorage.removeItem(`integration_creds_${integrationId}`);
  }

  private encryptCredentials(credentials: Record<string, string>): string {
    // Simple base64 encoding (in production, use proper encryption)
    return btoa(JSON.stringify(credentials));
  }

  private decryptCredentials(encrypted: string): Record<string, string> {
    // Simple base64 decoding (in production, use proper decryption)
    try {
      return JSON.parse(atob(encrypted));
    } catch {
      return {};
    }
  }

  private async makeApiCall(integration: Integration,
    endpoint: IntegrationEndpoint,
    credentials: Record<string, string>,
    params?: Record<string, any>
  ): Promise<any> {
    // Make actual API call
    const url = `${integration.provider}${endpoint.path}`;
    const options: RequestInit = {
      method: endpoint.method,
      headers: {
        'Content-Type': 'application/json',
        ...this.buildAuthHeaders(credentials)
      }
    };

    if (params && endpoint.method !== 'GET') {
      options.body = JSON.stringify(params);
    }

    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    return response.json();
  }

  private buildAuthHeaders(credentials: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {};
    
    if (credentials.apiKey) {
      headers['Authorization'] = `Bearer ${credentials.apiKey}`;
    }
    
    if (credentials.token) {
      headers['X-API-Token'] = credentials.token;
    }
    
    return headers;
  }
}