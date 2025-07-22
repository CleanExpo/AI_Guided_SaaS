#!/bin/bash

# 🚀 Ultimate Claude CLI Fix for WSL Ubuntu
# Run this script to fix all Claude CLI installation issues

echo "🚨 STARTING Claude CLI Ultimate Fix for WSL..."
echo "================================================"

# Step 1: Clean up any broken installations
echo "🧹 Step 1: Cleaning up broken installations..."
npm uninstall -g @anthropic/claude-code 2>/dev/null
npm uninstall -g @anthropic-ai/claude-code 2>/dev/null
npm uninstall -g claude-code 2>/dev/null
npm uninstall -g claude 2>/dev/null
npm cache clean --force

# Step 2: Configure WSL environment
echo "🔧 Step 2: Configuring WSL environment..."
npm config set os linux
npm config set platform linux
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'

# Step 3: Install Claude CLI
echo "📦 Step 3: Installing Claude CLI with correct package..."
npm install -g @anthropic-ai/claude-code --force

# Step 4: Fix PATH
echo "🛤️ Step 4: Fixing PATH for global npm packages..."
if ! grep -q "~/.npm-global/bin" ~/.bashrc; then
    echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
fi
if ! grep -q "~/.npm-global/bin" ~/.profile; then
    echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.profile
fi
source ~/.bashrc 2>/dev/null || true
export PATH=~/.npm-global/bin:$PATH

# Step 5: Verify installation
echo "✅ Step 5: Verifying installation..."
echo "Checking claude command location:"
which claude
echo "Checking claude version:"
claude --version 2>/dev/null || echo "⚠️ Claude version check failed - may need to restart terminal"

# Step 6: Test in project directory
echo "🚀 Step 6: Testing in project directory..."
cd "/mnt/d/AI Guided SaaS" 2>/dev/null || echo "⚠️ Could not navigate to project directory"

echo ""
echo "🎉 INSTALLATION COMPLETE!"
echo "========================="
echo ""
echo "✅ To use Claude CLI, run these commands:"
echo "   cd \"/mnt/d/AI Guided SaaS\""
echo "   claude --dangerously-skip-permissions"
echo ""
echo "📝 Note: If 'claude' command still not found, restart your terminal and try again."
echo "   The PATH changes require a fresh shell session to take effect."
echo ""
echo "🔧 Quick test: Run 'which claude' to verify installation"
echo "🔧 If still failing, run: source ~/.bashrc && export PATH=~/.npm-global/bin:$PATH"
