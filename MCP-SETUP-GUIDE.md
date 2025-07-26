# MCP (Model Context Protocol) Setup Guide

## Overview
This project is configured with multiple MCP servers to enhance Claude Code's capabilities:

1. **Context7** - Documentation and code examples
2. **Sequential Thinking** - Structured problem-solving
3. **ESLint** - Code quality analysis
4. **Model Context Memory** - Conversation context retention
5. **GitHub** - Repository integration
6. **Serena** - Semantic code search

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Environment Variables
Create or update `.env.local` with:
```env
# Context7 (Required for documentation lookup)
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token

# GitHub Integration (Required for repo operations)
GITHUB_TOKEN=your_github_personal_access_token
```

### 3. Start MCP Servers
```bash
# Start all servers at once
npm run mcp:start

# Or start individual servers
npm run mcp:context7      # Documentation server
npm run mcp:eslint        # Code quality server  
npm run mcp:sequential    # Sequential thinking server
```

### 4. Check Status
```bash
npm run mcp:status
```

## Server Details

### Context7 MCP
- **Purpose**: Provides up-to-date documentation and code examples
- **Setup**: 
  1. Sign up at https://upstash.com
  2. Create a Redis database
  3. Copy REST URL and token to `.env.local`
- **Usage**: Automatically provides documentation context to Claude

### Sequential Thinking Server
- **Purpose**: Enables complex reasoning chains
- **Location**: `./mcp/wsl-sequential-thinking-server.cjs`
- **Usage**: Helps Claude break down complex tasks

### ESLint MCP
- **Purpose**: Real-time code quality analysis
- **Config**: Uses project's `.eslintrc` configuration
- **Usage**: Provides linting feedback during code generation

### Model Context Memory
- **Purpose**: Maintains conversation context
- **Usage**: Helps Claude remember previous interactions

### GitHub Integration
- **Purpose**: Direct repository operations
- **Setup**: Generate token at https://github.com/settings/tokens
- **Permissions**: repo, read:org

## Troubleshooting

### Server Won't Start
1. Check Node version: `node --version` (should be v20+)
2. Verify environment variables are set
3. Check logs: `npm run mcp:status`

### Context7 Connection Issues
1. Verify Upstash credentials
2. Check Redis database is active
3. Test connection: `npx @upstash/context7-mcp test`

### GitHub Integration Issues
1. Verify token has correct permissions
2. Check token hasn't expired
3. Test: `gh auth status`

## Advanced Configuration

Edit `mcp-servers.json` to customize server behavior:
```json
{
  "servers": {
    "your-server": {
      "command": "npx",
      "args": ["@your/mcp-server"],
      "env": {
        "CUSTOM_VAR": "${CUSTOM_VAR}"
      }
    }
  }
}
```

## Resources
- [Model Context Protocol Docs](https://github.com/modelcontextprotocol)
- [Awesome MCP Servers](https://github.com/punkpeye/awesome-mcp-servers)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)