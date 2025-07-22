#!/bin/bash

# Claude Code CLI Comprehensive Fix Script
echo "🔧 CLAUDE CODE CLI DIAGNOSTIC & FIX SCRIPT"
echo "==========================================="
echo

# Phase 1: Environment Diagnostics
echo "📊 PHASE 1: ENVIRONMENT DIAGNOSTICS"
echo "-----------------------------------"
echo "Node.js version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "Current directory: $(pwd)"
echo

# Phase 2: Check Claude Installation
echo "📦 PHASE 2: CLAUDE INSTALLATION CHECK"
echo "------------------------------------"
echo "Checking for claude command:"
if command -v claude &> /dev/null; then
    echo "✅ 'claude' command found at: $(which claude)"
    echo "File details:"
    file $(which claude)
    echo "File content (first 10 lines):"
    head -10 $(which claude)
else
    echo "❌ 'claude' command NOT found"
fi

echo
echo "Checking global npm packages:"
npm list -g --depth=0 2>/dev/null | grep -i claude || echo "❌ No claude packages found globally"

echo
echo "Checking local npm packages:"
npm list --depth=0 2>/dev/null | grep -i claude || echo "❌ No claude packages found locally"

echo
echo "Checking for any claude-related binaries:"
find /home/$USER/.npm-global /usr/local/bin /home/$USER/.local/bin 2>/dev/null -name "*claude*" -type f || echo "❌ No claude binaries found"

# Phase 3: Check PATH and Aliases
echo
echo "🛣️ PHASE 3: PATH AND ALIAS CHECK"
echo "--------------------------------"
echo "Current PATH:"
echo $PATH | tr ':' '\n' | grep -E "(npm|node|local)" || echo "❌ No npm/node paths found"

echo
echo "Checking for claude aliases:"
alias | grep claude || echo "❌ No claude aliases found"

echo
echo "Checking bash functions:"
declare -f | grep -A 5 claude || echo "❌ No claude functions found"

# Phase 4: Check Shell Configuration
echo
echo "🐚 PHASE 4: SHELL CONFIGURATION"
echo "------------------------------"
echo "Current shell: $SHELL"
echo "Checking .bashrc for claude references:"
grep -n claude ~/.bashrc 2>/dev/null || echo "❌ No claude references in .bashrc"

echo "Checking .bash_profile for claude references:"
grep -n claude ~/.bash_profile 2>/dev/null || echo "❌ No claude references in .bash_profile"

# Phase 5: Installation Status
echo
echo "🔍 PHASE 5: DETAILED INSTALLATION STATUS"
echo "---------------------------------------"
echo "NPM global root: $(npm root -g)"
echo "NPM global bin directory: $(npm root -g)/../bin"
echo "Contents of npm global bin directory:"
ls -la $(npm root -g)/../bin | grep claude || echo "❌ No claude files in npm global bin"

echo
echo "NPM configuration:"
echo "Prefix: $(npm config get prefix)"
echo "Global folder: $(npm config get globalfolder)"

# Phase 6: Fix Attempt
echo
echo "🔧 PHASE 6: ATTEMPTING FIXES"
echo "---------------------------"
echo "Uninstalling any existing claude packages..."
npm uninstall -g @anthropic/claude-code 2>/dev/null || echo "No @anthropic/claude-code to uninstall"
npm uninstall -g @anthropic-ai/claude-code 2>/dev/null || echo "No @anthropic-ai/claude-code to uninstall"

echo "Cleaning npm cache..."
npm cache clean --force

echo "Installing correct Claude Code CLI package..."
npm install -g @anthropic-ai/claude-code

echo "Verifying installation..."
if command -v claude &> /dev/null; then
    echo "✅ Claude installation successful!"
    echo "Claude location: $(which claude)"
    echo "Testing claude command:"
    claude --version 2>/dev/null || echo "⚠️ Claude version command failed"
else
    echo "❌ Claude installation failed"
fi

echo
echo "🎯 PHASE 7: FINAL STATUS"
echo "----------------------"
echo "Run 'claude --help' to see available options"
echo "Run 'claude' to start the interactive session"
echo "Try running without the --dangerously-skip-permissions flag first"
echo
echo "If issues persist, the problem might be:"
echo "1. Shell configuration override"
echo "2. Conflicting package installation" 
echo "3. Permission issues with global npm packages"
echo
echo "Script completed. Check the output above for issues."
