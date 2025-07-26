import { InstalledItem } from './types';

export class StorageManager {
  private static readonly STORAGE_KEY = 'marketplace_installed';

  static loadInstalledItems(): Map<string, InstalledItem> {
    const installedItems = new Map<string, InstalledItem>();
    
    try {
      const stored = localStorage.getItem(StorageManager.STORAGE_KEY);
      if (stored) {
        const items = JSON.parse(stored);
        for (const [id, data] of Object.entries(items)) {
          // Ensure dates are properly parsed
          const item = data as any;
          if (item.installedAt) {
            item.installedAt = new Date(item.installedAt);
          }
          installedItems.set(id, item as InstalledItem);
        }
      }
    } catch (error) {
      console.error('Failed to load installed items from storage:', error);
    }
    
    return installedItems;
  }

  static saveInstalledItems(installedItems: Map<string, InstalledItem>): void {
    try {
      const items: Record<string, InstalledItem> = {};
      installedItems.forEach((data, id) => {
        items[id] = data;
      });
      
      localStorage.setItem(StorageManager.STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save installed items to storage:', error);
    }
  }

  static clearInstalledItems(): void {
    try {
      localStorage.removeItem(StorageManager.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear installed items from storage:', error);
    }
  }

  static getInstalledItemsList(installedItems: Map<string, InstalledItem>): Array<{ 
    id: string; 
    type: string; 
    installedAt: Date; 
    version: string;
    active?: boolean;
  }> {
    const items: Array<{ 
      id: string; 
      type: string; 
      installedAt: Date; 
      version: string;
      active?: boolean;
    }> = [];
    
    installedItems.forEach((data, id) => {
      items.push({
        id,
        type: data.type,
        installedAt: data.installedAt,
        version: data.version,
        active: data.active
      });
    });
    
    // Sort by installation date (most recent first)
    items.sort((a, b) => b.installedAt.getTime() - a.installedAt.getTime());
    
    return items;
  }

  static isInstalled(installedItems: Map<string, InstalledItem>, itemId: string): boolean {
    return installedItems.has(itemId);
  }

  static getInstalledItem(installedItems: Map<string, InstalledItem>, itemId: string): InstalledItem | undefined {
    return installedItems.get(itemId);
  }

  static updateInstalledItem(
    installedItems: Map<string, InstalledItem>, 
    itemId: string, 
    updates: Partial<InstalledItem>
  ): void {
    const existing = installedItems.get(itemId);
    if (existing) {
      installedItems.set(itemId, { ...existing, ...updates });
      StorageManager.saveInstalledItems(installedItems);
    }
  }

  static removeInstalledItem(installedItems: Map<string, InstalledItem>, itemId: string): void {
    installedItems.delete(itemId);
    StorageManager.saveInstalledItems(installedItems);
  }
}