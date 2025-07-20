// Backend adapter factory
import { BackendAdapter, BackendConfig } from './types'
import { SupabaseAdapter } from './adapters/supabase'
import { StrapiAdapter } from './adapters/strapi'
import { NocoDBAdapter } from './adapters/nocodb'



// Global instance cache
let currentAdapter: BackendAdapter | null = null
let currentConfig: BackendConfig | null = null

/**
 * Create a backend adapter based on configuration
 */
export function createBackendAdapter(config: BackendConfig): BackendAdapter {
  switch (config.type) {
    case 'supabase':
      return new SupabaseAdapter(config)
    
    case 'strapi':
      return new StrapiAdapter(config)
    
    case 'nocodb':
      return new NocoDBAdapter(config)
    
    default:
      throw new Error(`Unsupported backend type: ${config.type}`)
  }
}

/**
 * Get the current backend adapter (singleton pattern)
 */
export function getBackendAdapter(): BackendAdapter {
  if (!currentAdapter) {
    const config = getBackendConfig()
    currentAdapter = createBackendAdapter(config)
  }
  
  return currentAdapter
}

/**
 * Set the current backend adapter
 */
export function setBackendAdapter(adapter: BackendAdapter): void {
  currentAdapter = adapter
}

/**
 * Get backend configuration from environment variables
 */
export function getBackendConfig(): BackendConfig {
  if (currentConfig) {
    return currentConfig
  }

  // Determine backend type from environment
  const backendType = process.env.NEXT_PUBLIC_BACKEND_TYPE || 'supabase'

  switch (backendType) {
    case 'supabase':
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error('Supabase configuration missing')
      }
      
      currentConfig = {
        type: 'supabase',
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        apiKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      }
      break

    case 'strapi':
      if (!process.env.NEXT_PUBLIC_STRAPI_URL) {
        throw new Error('Strapi URL missing')
      }
      
      currentConfig = {
        type: 'strapi',
        url: process.env.NEXT_PUBLIC_STRAPI_URL,
        apiKey: process.env.NEXT_PUBLIC_STRAPI_API_TOKEN
      }
      break

    case 'nocodb':
      if (!process.env.NEXT_PUBLIC_NOCODB_URL || !process.env.NEXT_PUBLIC_NOCODB_API_TOKEN) {
        throw new Error('NocoDB configuration missing')
      }
      
      currentConfig = {
        type: 'nocodb',
        url: process.env.NEXT_PUBLIC_NOCODB_URL,
        apiKey: process.env.NEXT_PUBLIC_NOCODB_API_TOKEN
      }
      break

    default:
      throw new Error(`Unsupported backend type: ${backendType}`)
  }

  return currentConfig
}

/**
 * Set backend configuration
 */
export function setBackendConfig(config: BackendConfig): void {
  currentConfig = config
  // Reset adapter when config changes
  currentAdapter = null
}

/**
 * Hook to get current backend adapter
 */
export function useBackend(): BackendAdapter {
  return getBackendAdapter()
}

/**
 * Get current backend adapter instance
 */
export function getCurrentBackend(): BackendAdapter | null {
  return currentAdapter
}

/**
 * Utility to switch backend at runtime
 */
export async function switchBackend(config: BackendConfig): Promise<void> {
  setBackendConfig(config)
  currentAdapter = createBackendAdapter(config)
  
  // Optionally persist the choice
  if (typeof window !== 'undefined') {
    localStorage.setItem('backend-config', JSON.stringify(config))
  }
}

/**
 * Load backend configuration from local storage
 */
export function loadBackendConfig(): BackendConfig | null {
  if (typeof window === 'undefined') {
    return null
  }

  const stored = localStorage.getItem('backend-config')
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return null
    }
  }

  return null
}

/**
 * Initialize backend from stored config or environment
 */
export function initializeBackend(): BackendAdapter {
  const storedConfig = loadBackendConfig()
  
  if (storedConfig) {
    setBackendConfig(storedConfig)
  }
  
  return getBackendAdapter()
}