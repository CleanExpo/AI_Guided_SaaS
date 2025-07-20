# MCP (Model Context Protocol) Orchestration

## Overview

AI Guided SaaS includes comprehensive MCP orchestration capabilities, enabling seamless integration with multiple Model Context Protocol servers. This allows the platform to leverage a wide variety of tools and services through a unified interface.

## Architecture

### Core Components

1. **MCP Orchestrator**
   - Manages connections to multiple MCP servers
   - Coordinates tool execution across servers
   - Handles dependency resolution and parallel execution
   - Provides error handling and retry mechanisms

2. **MCP Registry**
   - Pre-configured server definitions
   - Environment validation
   - Capability mappings
   - Custom server support

3. **Tool Execution Engine**
   - Single and parallel tool execution
   - Argument validation
   - Result aggregation
   - Timeout management

## Features

### 1. Server Management

Connect to various MCP servers:

```typescript
import { useMCP } from '@/hooks/useMCP'

const { connectServer, disconnectServer, servers } = useMCP({
  autoConnect: ['github', 'filesystem'],
  debug: true
})

// Connect to a server
await connectServer('github')

// Check server status
const githubServer = servers.find(s => s.id === 'github')
console.log(githubServer.status) // 'connected'
```

### 2. Tool Discovery

List available tools across all connected servers:

```typescript
const { tools } = useMCP()

// Filter tools by server
const githubTools = tools.filter(t => t.server === 'github')

// Filter tools by category
const fileTools = tools.filter(t => 
  t.tags?.includes('file-operations')
)
```

### 3. Tool Execution

Execute tools with proper typing and validation:

```typescript
// Single tool execution
const result = await callTool({
  tool: 'repository.create',
  server: 'github',
  arguments: {
    name: 'my-new-repo',
    description: 'Created via MCP',
    private: false
  }
})

// Parallel execution
const results = await callToolsParallel([
  {
    tool: 'file.read',
    server: 'filesystem',
    arguments: { path: '/src/index.ts' }
  },
  {
    tool: 'search.web',
    server: 'brave-search',
    arguments: { query: 'TypeScript best practices' }
  }
])
```

### 4. Orchestration Plans

Create complex workflows with dependencies:

```typescript
// Create an orchestration plan
const plan = createPlan('Deploy project workflow', [
  {
    id: 'step1',
    type: 'tool',
    server: 'github',
    operation: 'repository.create',
    arguments: { name: 'my-app' }
  },
  {
    id: 'step2',
    type: 'tool',
    server: 'filesystem',
    operation: 'file.write',
    arguments: { 
      path: '/README.md',
      content: '# My App'
    },
    dependsOn: ['step1'] // Wait for repo creation
  },
  {
    id: 'step3',
    type: 'tool',
    server: 'github',
    operation: 'repository.push',
    arguments: { files: ['README.md'] },
    dependsOn: ['step2']
  }
])

// Execute the plan
const results = await executePlan(plan)
```

## Available Servers

### Development Tools

#### GitHub
- **ID**: `github`
- **Tools**: repository management, issues, PRs, actions
- **Required**: `GITHUB_TOKEN`

```typescript
await connectServer('github')

// Create repository
await callTool({
  tool: 'repository.create',
  server: 'github',
  arguments: {
    name: 'my-project',
    description: 'Project description',
    private: false,
    auto_init: true
  }
})
```

#### Filesystem
- **ID**: `filesystem`
- **Tools**: file/directory operations
- **Required**: None

```typescript
// Read file
const content = await callTool({
  tool: 'file.read',
  server: 'filesystem',
  arguments: { path: '/path/to/file.ts' }
})

// List directory
const files = await callTool({
  tool: 'directory.list',
  server: 'filesystem',
  arguments: { path: '/src' }
})
```

### Data Tools

#### PostgreSQL
- **ID**: `postgres`
- **Tools**: database queries, schema management
- **Required**: `POSTGRES_URL`

```typescript
// Execute query
const results = await callTool({
  tool: 'query.execute',
  server: 'postgres',
  arguments: {
    query: 'SELECT * FROM users WHERE active = $1',
    params: [true]
  }
})
```

### AI Tools

#### Brave Search
- **ID**: `brave-search`
- **Tools**: web search, image search, news
- **Required**: `BRAVE_API_KEY`

```typescript
// Web search
const searchResults = await callTool({
  tool: 'search.web',
  server: 'brave-search',
  arguments: {
    query: 'latest AI developments',
    count: 10
  }
})
```

### Automation Tools

#### Puppeteer
- **ID**: `puppeteer`
- **Tools**: browser automation, screenshots
- **Required**: None

```typescript
// Take screenshot
const screenshot = await callTool({
  tool: 'browser.screenshot',
  server: 'puppeteer',
  arguments: {
    url: 'https://example.com',
    fullPage: true
  }
})
```

## Custom MCP Servers

Register custom MCP servers:

```typescript
await registerCustomServer({
  id: 'my-custom-server',
  name: 'My Custom Server',
  url: 'ws://localhost:3001/mcp',
  description: 'Custom MCP server for special operations',
  capabilities: []
})
```

## UI Component

The MCPOrchestrator component provides a complete UI:

```typescript
import { MCPOrchestrator } from '@/components/mcp/MCPOrchestrator'

<MCPOrchestrator
  projectId="my-project"
  onToolResult={(result) => {
    console.log('Tool executed:', result)
  }}
/>
```

Features:
- Server connection management
- Tool browser with categories
- Argument configuration
- Orchestration plan builder
- Execution results viewer

## Best Practices

### 1. Environment Setup
```env
# Required for various servers
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
BRAVE_API_KEY=BSA_xxxxxxxxxxxx
POSTGRES_URL=postgresql://user:pass@localhost/db
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxx
OPENAI_API_KEY=sk-xxxxxxxxxxxx
```

### 2. Error Handling
```typescript
try {
  const result = await callTool({
    tool: 'repository.create',
    server: 'github',
    arguments: { name: 'test' }
  })
  
  if (result.error) {
    console.error('Tool failed:', result.error)
  } else {
    console.log('Success:', result.result)
  }
} catch (error) {
  // Handle connection errors
  console.error('Failed to execute tool:', error)
}
```

### 3. Dependency Management
```typescript
const plan = createPlan('Complex workflow', [
  // Parallel steps (no dependencies)
  { id: 'a', server: 'github', operation: 'user.get' },
  { id: 'b', server: 'filesystem', operation: 'file.list' },
  
  // Sequential step (depends on 'a')
  { 
    id: 'c', 
    server: 'github', 
    operation: 'repository.list',
    dependsOn: ['a']
  }
])
```

### 4. Resource Management
```typescript
// List available resources
const resources = await listResources('github')

// Read specific resource
const content = await readResource(
  'github',
  'repo://owner/repo/README.md'
)
```

## Advanced Features

### Prompts
```typescript
// List available prompts
const prompts = await listPrompts('ai-assistant')

// Get formatted prompt
const prompt = await getPrompt('ai-assistant', 'code-review', {
  language: 'typescript',
  context: 'React component'
})
```

### Streaming
Some MCP servers support streaming responses:

```typescript
const stream = await callTool({
  tool: 'chat.stream',
  server: 'ai-assistant',
  arguments: {
    message: 'Explain quantum computing',
    stream: true
  }
})

for await (const chunk of stream) {
  console.log(chunk)
}
```

### Batch Operations
```typescript
// Batch file operations
const batchPlan = createPlan('Batch file processing', 
  files.map(file => ({
    id: `process-${file}`,
    type: 'tool',
    server: 'filesystem',
    operation: 'file.process',
    arguments: { path: file }
  }))
)

const results = await executePlan(batchPlan)
```

## Security Considerations

1. **API Key Management**
   - Store keys in environment variables
   - Never commit keys to version control
   - Use different keys per environment

2. **Server Validation**
   - Verify server SSL certificates
   - Validate server responses
   - Implement timeout policies

3. **Tool Execution**
   - Validate all tool arguments
   - Sanitize file paths
   - Limit resource consumption

## Troubleshooting

### Connection Issues
```typescript
// Check server status
const server = servers.find(s => s.id === 'github')
if (server?.status === 'error') {
  // Check environment
  const config = getServerConfig('github')
  const envCheck = checkServerEnvironment(config)
  console.log('Missing env:', envCheck.missing)
}
```

### Tool Failures
```typescript
// Enable debug mode
const mcp = useMCP({ debug: true })

// Check tool schema
const tool = tools.find(t => t.name === 'repository.create')
console.log('Input schema:', tool.inputSchema)
```

### Performance
- Use parallel execution for independent operations
- Implement caching for frequently accessed resources
- Set appropriate timeouts for long-running operations

## Examples

### CI/CD Pipeline
```typescript
const deployPlan = createPlan('Deploy to production', [
  {
    id: 'test',
    server: 'github',
    operation: 'actions.run',
    arguments: { workflow: 'test.yml' }
  },
  {
    id: 'build',
    server: 'github',
    operation: 'actions.run',
    arguments: { workflow: 'build.yml' },
    dependsOn: ['test']
  },
  {
    id: 'deploy',
    server: 'aws',
    operation: 'lambda.deploy',
    arguments: { function: 'my-app' },
    dependsOn: ['build']
  }
])
```

### Data Pipeline
```typescript
const dataPlan = createPlan('ETL Pipeline', [
  {
    id: 'extract',
    server: 'postgres',
    operation: 'query.execute',
    arguments: { query: 'SELECT * FROM raw_data' }
  },
  {
    id: 'transform',
    server: 'custom-etl',
    operation: 'data.transform',
    arguments: { format: 'normalized' },
    dependsOn: ['extract']
  },
  {
    id: 'load',
    server: 'postgres',
    operation: 'bulk.insert',
    arguments: { table: 'processed_data' },
    dependsOn: ['transform']
  }
])