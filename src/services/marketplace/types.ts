export interface MarketplaceTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  files: TemplateFile[];
  dependencies: Record<string, string>;
  configuration: TemplateConfig;
  preview?: {
    images: string[];
    liveUrl?: string;
  };
  metadata: {
    author: string;
    version: string;
    license: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface TemplateFile {
  path: string;
  content: string;
  type: 'component' | 'page' | 'api' | 'style' | 'config';
}

export interface TemplateConfig {
  name: string;
  description: string;
  variables: TemplateVariable[];
  hooks?: TemplateHook[];
  postInstall?: string[];
}

export interface TemplateVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select';
  label: string;
  defaultValue: string | number | boolean;
  required: boolean;
  options?: string[];
}

export interface TemplateHook {
  type: 'pre-install' | 'post-install' | 'pre-uninstall';
  script: string;
}

export interface Plugin {
  id: string;
  name: string;
  description: string;
  version: string;
  main: string;
  exports: PluginExport[];
  dependencies: Record<string, string>;
  configuration: PluginConfig;
  lifecycle: PluginLifecycle;
}

export interface PluginExport {
  name: string;
  type: 'component' | 'hook' | 'utility' | 'service';
  path: string;
}

export interface PluginConfig {
  settings: PluginSetting[];
  permissions: string[];
  events: string[];
}

export interface PluginSetting {
  key: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'json';
  label: string;
  description?: string;
  defaultValue: string | number | boolean;
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface PluginLifecycle {
  install?: string;
  activate?: string;
  deactivate?: string;
  uninstall?: string;
  update?: string;
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  provider: string;
  category: 'database' | 'auth' | 'payment' | 'analytics' | 'communication' | 'storage' | 'ai';
  credentials: IntegrationCredential[];
  endpoints: IntegrationEndpoint[];
  features: string[];
  documentation: string;
}

export interface IntegrationCredential {
  key: string;
  label: string;
  type: 'string' | 'secret';
  required: boolean;
  description?: string;
}

export interface IntegrationEndpoint {
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  parameters?: EndpointParameter[];
  response?: {
    type: string;
    example: unknown;
  };
}

export interface EndpointParameter {
  name: string;
  type: 'path' | 'query' | 'body' | 'header';
  dataType: string;
  required: boolean;
  description?: string;
}

export interface InstalledItem {
  type: 'template' | 'plugin' | 'integration';
  installedAt: Date;
  config?: Record<string, unknown>;
  version: string;
  active?: boolean;
}