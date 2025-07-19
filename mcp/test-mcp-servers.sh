#!/bin/bash

echo "Testing MCP Server Configurations..."
echo "====================================="

# Test WSL Sequential Thinking Server
echo -e "\n1. Testing WSL Sequential Thinking Server..."
timeout 2s node /mnt/d/AI\ Guided\ SaaS/mcp/dist/wsl-sequential-thinking-server.js 2>&1 | head -n 1

# Test Memory Server
echo -e "\n2. Testing Memory Server..."
timeout 2s npx -y @modelcontextprotocol/server-memory 2>&1 | head -n 5

# Test Sequential Thinking Server
echo -e "\n3. Testing Sequential Thinking Server..."
timeout 2s npx -y @modelcontextprotocol/server-sequential-thinking 2>&1 | head -n 5

# Test Filesystem Server
echo -e "\n4. Testing Filesystem Server..."
timeout 2s npx -y @modelcontextprotocol/server-filesystem 2>&1 | head -n 5

# Test Fetch Server
echo -e "\n5. Testing Fetch Server..."
timeout 2s npx -y @modelcontextprotocol/server-fetch 2>&1 | head -n 5

echo -e "\n\nNote: Servers requiring API keys (GitHub, Context7, Brave Search, Stripe) need valid keys to function properly."
echo "Please add your API keys to the env variables in ~/.config/claude/mcp.json"

echo -e "\n\nSummary of MCP Configuration:"
echo "- Configuration file: ~/.config/claude/mcp.json"
echo "- WSL Sequential Thinking Server: Ready at /mnt/d/AI Guided SaaS/mcp/dist/"
echo "- Other servers: Will be installed via npx on first use"
echo -e "\nTo use these servers in Claude, restart the Claude application."