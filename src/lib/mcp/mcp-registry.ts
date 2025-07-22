/**
 * MCP Server Registry
 * Pre-configured MCP servers for common use cases
 */

export interface MCPServerConfig {
  id: string;
  name: string;
  description: string;
  url: string;
  category: 'development' | 'data' | 'automation' | 'ai' | 'integration' | 'other';
  requiredEnv?: string[];
  setupInstructions?: string;
  documentation?: string;
}

export const MCPServerRegistry: MCPServerConfig[] = [
  // Development Tools
  {
    id: 'github',
    name: 'GitHub',
    description: 'GitHub API integration for repository management',
    url: 'npx -y @modelcontextprotocol/server-github',
    category: 'development',
    requiredEnv: ['GITHUB_TOKEN'],
    documentation: 'https://github.com/modelcontextprotocol/servers/tree/main/src/github'
  },
  {
    id: 'gitlab',
    name: 'GitLab',
    description: 'GitLab API integration for project management',
    url: 'npx -y @modelcontextprotocol/server-gitlab',
    category: 'development',
    requiredEnv: ['GITLAB_TOKEN', 'GITLAB_URL']
  },
  {
    id: 'filesystem',
    name: 'Filesystem',
    description: 'Local filesystem operations',
    url: 'npx -y @modelcontextprotocol/server-filesystem',
    category: 'development',
    documentation: 'https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem'
  },
  
  // Data Tools
  {
    id: 'postgres',
    name: 'PostgreSQL',
    description: 'PostgreSQL database operations',
    url: 'npx -y @modelcontextprotocol/server-postgres',
    category: 'data',
    requiredEnv: ['POSTGRES_URL']
  },
  {
    id: 'sqlite',
    name: 'SQLite',
    description: 'SQLite database operations',
    url: 'npx -y @modelcontextprotocol/server-sqlite',
    category: 'data'
  },
  {
    id: 'mysql',
    name: 'MySQL',
    description: 'MySQL database operations',
    url: 'npx -y @modelcontextprotocol/server-mysql',
    category: 'data',
    requiredEnv: ['MYSQL_URL']
  },
  
  // AI & ML Tools
  {
    id: 'brave-search',
    name: 'Brave Search',
    description: 'Web search using Brave Search API',
    url: 'npx -y @modelcontextprotocol/server-brave-search',
    category: 'ai',
    requiredEnv: ['BRAVE_API_KEY']
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    description: 'Anthropic Claude API integration',
    url: 'npx -y @modelcontextprotocol/server-anthropic',
    category: 'ai',
    requiredEnv: ['ANTHROPIC_API_KEY']
  },
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'OpenAI API integration',
    url: 'npx -y @modelcontextprotocol/server-openai',
    category: 'ai',
    requiredEnv: ['OPENAI_API_KEY']
  },
  
  // Automation Tools
  {
    id: 'puppeteer',
    name: 'Puppeteer',
    description: 'Browser automation with Puppeteer',
    url: 'npx -y @modelcontextprotocol/server-puppeteer',
    category: 'automation'
  },
  {
    id: 'playwright',
    name: 'Playwright',
    description: 'Cross-browser automation',
    url: 'npx -y @modelcontextprotocol/server-playwright',
    category: 'automation'
  },
  {
    id: 'selenium',
    name: 'Selenium',
    description: 'Web browser automation',
    url: 'npx -y @modelcontextprotocol/server-selenium',
    category: 'automation'
  },
  
  // Integration Tools
  {
    id: 'slack',
    name: 'Slack',
    description: 'Slack messaging integration',
    url: 'npx -y @modelcontextprotocol/server-slack',
    category: 'integration',
    requiredEnv: ['SLACK_TOKEN']
  },
  {
    id: 'discord',
    name: 'Discord',
    description: 'Discord bot integration',
    url: 'npx -y @modelcontextprotocol/server-discord',
    category: 'integration',
    requiredEnv: ['DISCORD_TOKEN']
  },
  {
    id: 'email',
    name: 'Email',
    description: 'Email sending and receiving',
    url: 'npx -y @modelcontextprotocol/server-email',
    category: 'integration',
    requiredEnv: ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS']
  },
  {
    id: 'aws',
    name: 'AWS',
    description: 'Amazon Web Services integration',
    url: 'npx -y @modelcontextprotocol/server-aws',
    category: 'integration',
    requiredEnv: ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY']
  },
  {
    id: 'gcp',
    name: 'Google Cloud',
    description: 'Google Cloud Platform integration',
    url: 'npx -y @modelcontextprotocol/server-gcp',
    category: 'integration',
    requiredEnv: ['GOOGLE_APPLICATION_CREDENTIALS']
  }
]

/**
 * Get server configuration by ID
 */
export function getServerConfig(id: string): MCPServerConfig | undefined {
  return MCPServerRegistry.find(server => server.id === id)
}

/**
 * Get servers by category
 */
export function getServersByCategory(category: MCPServerConfig['category']): MCPServerConfig[] {
  return MCPServerRegistry.filter(server => server.category === category)
}

/**
 * Check if server environment is configured
 */
export function checkServerEnvironment(server: MCPServerConfig): {
  configured: boolean,
  missing: string[];
} {
  if (!server.requiredEnv || server.requiredEnv.length === 0) {
    return { configured: true, missing: [] }
  }

  const missing = server.requiredEnv.filter(
    envVar => !process.env[envVar]
  )

  return {
    configured: missing.length === 0,
    missing
  }
}

/**
 * Custom MCP server configurations for the project
 */
export const CustomMCPServers: MCPServerConfig[] = [
  {
    id: 'ai-guided-saas',
    name: 'AI Guided SaaS',
    description: 'Custom MCP server for AI Guided SaaS platform',
    url: 'ws://localhost:3001/mcp',
    category: 'development',
    setupInstructions: `
1. Install dependencies: npm install
2. Start the MCP server: npm run mcp:server
3. The server will be available at, ws://localhost:3001/mcp
    `
  },
  {
    id: 'agent-orchestrator',
    name: 'Agent Orchestrator',
    description: 'MCP server for multi-agent coordination',
    url: 'ws://localhost:3002/mcp',
    category: 'ai',
    requiredEnv: ['OPENAI_API_KEY', 'ANTHROPIC_API_KEY']
  },
  {
    id: 'knowledge-base',
    name: 'Knowledge Base',
    description: 'RAG knowledge system MCP server',
    url: 'ws://localhost:3003/mcp',
    category: 'data',
    requiredEnv: ['VECTOR_DB_URL', 'EMBEDDING_API_KEY']
  }
]

/**
 * Get all available servers (registry + custom)
 */
export function getAllServers(): MCPServerConfig[] {
  return [...MCPServerRegistry, ...CustomMCPServers]
}

/**
 * Server capability mappings
 */
export const ServerCapabilities: Record<string, string[]> = {
  github: ['repository.create', 'repository.read', 'repository.update', 'repository.delete', 'issue.create', 'pr.create'],
  filesystem: ['file.read', 'file.write', 'file.delete', 'directory.list', 'directory.create'],
  postgres: ['query.execute', 'table.list', 'schema.inspect'],
  'brave-search': ['search.web', 'search.image', 'search.news'],
  puppeteer: ['browser.navigate', 'browser.screenshot', 'browser.click', 'browser.type'],
  slack: ['message.send', 'channel.list', 'user.list'],
  aws: ['s3.upload', 's3.download', 'lambda.invoke', 'ec2.list']
}