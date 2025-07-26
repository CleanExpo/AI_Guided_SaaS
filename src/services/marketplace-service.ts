import { EventEmitter } from 'events';
import {
  MarketplaceTemplate,
  Plugin,
  Integration,
  InstalledItem,
  TemplateManager,
  PluginManager,
  IntegrationManager,
  StorageManager
} from './marketplace';

export class MarketplaceService extends EventEmitter {
  private installedItems: Map<string, InstalledItem>;
  private templateManager: TemplateManager;
  private pluginManager: PluginManager;
  private integrationManager: IntegrationManager;

  constructor() {
    super();
    
    // Load installed items from storage
    this.installedItems = StorageManager.loadInstalledItems();
    
    // Initialize managers
    this.templateManager = new TemplateManager(this.installedItems);
    this.pluginManager = new PluginManager(this.installedItems);
    this.integrationManager = new IntegrationManager(this.installedItems);
    
    // Forward events from managers
    this.setupEventForwarding();
    
    // Auto-save when items change
    this.setupAutoSave();
  }

  // Template Management
  async installTemplate(templateId: string, config?: Record<string, any>): Promise<void> {
    await this.templateManager.installTemplate(templateId, config);
    this.saveInstalledItems();
  }

  async uninstallTemplate(templateId: string): Promise<void> {
    await this.templateManager.uninstallTemplate(templateId);
    this.saveInstalledItems();
  }

  // Plugin Management
  async installPlugin(pluginId: string): Promise<void> {
    await this.pluginManager.installPlugin(pluginId);
    this.saveInstalledItems();
  }

  async activatePlugin(pluginId: string): Promise<void> {
    await this.pluginManager.activatePlugin(pluginId);
    this.saveInstalledItems();
  }

  async deactivatePlugin(pluginId: string): Promise<void> {
    await this.pluginManager.deactivatePlugin(pluginId);
    this.saveInstalledItems();
  }

  async uninstallPlugin(pluginId: string): Promise<void> {
    await this.pluginManager.uninstallPlugin(pluginId);
    this.saveInstalledItems();
  }

  // Integration Management
  async setupIntegration(integrationId: string, credentials: Record<string, string>): Promise<void> {
    await this.integrationManager.setupIntegration(integrationId, credentials);
    this.saveInstalledItems();
  }

  async callIntegration(
    integrationId: string, 
    endpoint: string, 
    params?: Record<string, any>
  ): Promise<any> {
    return this.integrationManager.callIntegration(integrationId, endpoint, params);
  }

  async removeIntegration(integrationId: string): Promise<void> {
    await this.integrationManager.removeIntegration(integrationId);
    this.saveInstalledItems();
  }

  // Public Query Methods
  getInstalledItems(): Array<{ 
    id: string; 
    type: string; 
    installedAt: Date; 
    version: string;
    active?: boolean;
  }> {
    return StorageManager.getInstalledItemsList(this.installedItems);
  }

  getActivePlugins(): string[] {
    return this.pluginManager.getActivePlugins();
  }

  getIntegrations(): string[] {
    return this.integrationManager.getIntegrations();
  }

  isInstalled(itemId: string): boolean {
    return StorageManager.isInstalled(this.installedItems, itemId);
  }

  getInstalledItem(itemId: string): InstalledItem | undefined {
    return StorageManager.getInstalledItem(this.installedItems, itemId);
  }

  getPlugin(pluginId: string): Plugin | undefined {
    return this.pluginManager.getPlugin(pluginId);
  }

  getIntegration(integrationId: string): Integration | undefined {
    return this.integrationManager.getIntegration(integrationId);
  }

  // Statistics
  getStatistics(): {
    totalInstalled: number;
    templates: number;
    plugins: number;
    integrations: number;
    activePlugins: number;
  } {
    let templates = 0;
    let plugins = 0;
    let integrations = 0;
    let activePlugins = 0;

    this.installedItems.forEach((item) => {
      switch (item.type) {
        case 'template':
          templates++;
          break;
        case 'plugin':
          plugins++;
          if (item.active) activePlugins++;
          break;
        case 'integration':
          integrations++;
          break;
      }
    });

    return {
      totalInstalled: this.installedItems.size,
      templates,
      plugins,
      integrations,
      activePlugins
    };
  }

  // Bulk Operations
  async bulkInstall(items: Array<{ id: string; type: 'template' | 'plugin' | 'integration'; config?: Record<string, unknown> }>): Promise<void> {
    const results: Array<{ id: string; success: boolean; error?: Error }> = [];

    for (const item of items) {
      try {
        switch (item.type) {
          case 'template':
            await this.installTemplate(item.id, item.config);
            break;
          case 'plugin':
            await this.installPlugin(item.id);
            break;
          case 'integration':
            if (item.config) {
              await this.setupIntegration(item.id, item.config);
            }
            break;
        }
        results.push({ id: item.id, success: true });
      } catch (error) {
        results.push({ id: item.id, success: false, error });
      }
    }

    this.emit('bulk:install:complete', results);
  }

  async clearAll(): Promise<void> {
    // Deactivate all plugins first
    for (const pluginId of this.pluginManager.getActivePlugins()) {
      try {
        await this.pluginManager.deactivatePlugin(pluginId);
      } catch (error) {
        console.warn(`Failed to deactivate plugin ${pluginId}:`, error);
      }
    }

    // Clear all data
    this.installedItems.clear();
    StorageManager.clearInstalledItems();
    
    this.emit('marketplace:cleared');
  }

  // Private Methods
  private setupEventForwarding(): void {
    // Forward template manager events
    this.templateManager.on('install:start', (data) => this.emit('install:start', data));
    this.templateManager.on('install:complete', (data) => this.emit('install:complete', data));
    this.templateManager.on('install:error', (data) => this.emit('install:error', data));
    this.templateManager.on('uninstall:complete', (data) => this.emit('uninstall:complete', data));

    // Forward plugin manager events
    this.pluginManager.on('install:start', (data) => this.emit('install:start', data));
    this.pluginManager.on('install:complete', (data) => this.emit('install:complete', data));
    this.pluginManager.on('install:error', (data) => this.emit('install:error', data));
    this.pluginManager.on('plugin:activated', (data) => this.emit('plugin:activated', data));
    this.pluginManager.on('plugin:deactivated', (data) => this.emit('plugin:deactivated', data));
    this.pluginManager.on('plugin:uninstalled', (data) => this.emit('plugin:uninstalled', data));

    // Forward integration manager events
    this.integrationManager.on('integration:start', (data) => this.emit('integration:start', data));
    this.integrationManager.on('integration:complete', (data) => this.emit('integration:complete', data));
    this.integrationManager.on('integration:error', (data) => this.emit('integration:error', data));
    this.integrationManager.on('integration:removed', (data) => this.emit('integration:removed', data));
  }

  private setupAutoSave(): void {
    const saveEvents = [
      'install:complete',
      'uninstall:complete',
      'plugin:activated',
      'plugin:deactivated',
      'plugin:uninstalled',
      'integration:complete',
      'integration:removed'
    ];

    saveEvents.forEach(event => {
      this.on(event, () => this.saveInstalledItems());
    });
  }

  private saveInstalledItems(): void {
    StorageManager.saveInstalledItems(this.installedItems);
  }
}

// Singleton instance
let marketplaceInstance: MarketplaceService | null = null;

export function getMarketplace(): MarketplaceService {
  if (!marketplaceInstance) {
    marketplaceInstance = new MarketplaceService();
  }
  return marketplaceInstance;
}

// Re-export types for convenience
export * from './marketplace/types';