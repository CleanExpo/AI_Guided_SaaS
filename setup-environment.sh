#!/bin/bash

# Setup script for AI Guided SaaS MCP environment
echo "🔧 Setting up MCP environment for AI Guided SaaS"
echo "================================================"

# Create backup of current config
if [ -f "$HOME/.config/claude-code/claude_code_settings.json" ]; then
    echo "📋 Backing up current configuration..."
    cp "$HOME/.config/claude-code/claude_code_settings.json" "$HOME/.config/claude-code/claude_code_settings.json.backup"
fi

# Copy the fixed configuration
echo "✅ Installing cleaned MCP configuration..."
cp "claude_code_settings_fixed.json" "$HOME/.config/claude-code/claude_code_settings.json"

echo ""
echo "🔑 REQUIRED ENVIRONMENT VARIABLES"
echo "================================="
echo "To enable all MCPs, add these to your ~/.bashrc or ~/.zshrc:"
echo ""
echo "# GitHub API access"
echo "export GITHUB_TOKEN=\"your_github_personal_access_token\""
echo ""
echo "# Brave Search API (get from: https://api.search.brave.com/app/keys)"
echo "export BRAVE_API_KEY=\"your_brave_api_key\""
echo ""
echo "# Optional: AWS, Slack, Gmail, etc. (see original config for full list)"
echo ""

echo "🧪 TESTING CORE MCPS"
echo "===================="
echo "The following MCPs should work without API keys:"
echo "✅ Sequential Thinking"
echo "✅ Filesystem"
echo "✅ Memory"
echo "✅ Everything"
echo "✅ Context7"
echo "✅ Playwright"
echo "✅ Puppeteer"
echo ""
echo "With API keys configured:"
echo "🔑 GitHub"
echo "🔑 Brave Search"
echo ""

echo "🚀 NEXT STEPS"
echo "============="
echo "1. Set up your environment variables in ~/.bashrc or ~/.zshrc"
echo "2. Run: source ~/.bashrc (or restart terminal)"
echo "3. Test with: node scripts/test-mcps.js"
echo "4. If you want API-enabled MCPs, use: claude_code_settings_with_api_keys.json"
echo ""
echo "✨ Setup complete!"