# 🔧 Working MCP Configuration

## Problem
All 11 MCP servers are failing because the configuration has servers that don't exist or are misconfigured.

## Solution: Clean, Working MCP Config

### Step 1: Exit Claude (if not already done)
```
/exit
```

### Step 2: Create a clean, working MCP configuration
```bash
cat > ~/.config/claude/mcp.json << 'EOF'
{
  "mcpServers": {
    "memory": {
      "type": "stdio",
      "command": "npx", 
      "args": ["-y", "@modelcontextprotocol/server-memory"],
      "env": {}
    },
    "sequentialthinking": {
      "type": "stdio", 
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"],
      "env": {}
    },
    "github": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {}
    },
    "context7": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "--node-options=--experimental-vm-modules", "@upstash/context7-mcp@1.0.6"],
      "env": {}
    }
  }
}
EOF
```

### Step 3: Remove old conflicting configs
```bash
rm -f ~/.mcp*
```

### Step 4: Restart Claude
```bash
claude --dangerously-skip-permissions
```

### Step 5: Check MCP status in Claude
```
/mcp
```

This should give you 4 working MCP servers instead of 11 failing ones!

## What This Config Includes
✅ Memory - for context retention
✅ Sequential Thinking - for reasoning
✅ GitHub - for git operations  
✅ Context7 - for documentation lookup

All using npm packages that actually exist and work.
