# 🎯 CORRECT Claude Code CLI Installation

## ❌ **The Issue - Wrong Package Name**
You used: `npm install -g @anthropic/claude-code` 
Error: `404 Not Found - '@anthropic/claude-code@*' is not in this registry`

## ✅ **CORRECT Package Name**
The package is: `@anthropic-ai/claude-code` (note the `-ai`)

## 📋 **CORRECT Installation Commands for WSL Ubuntu**

### **Step 1: Install with Correct Package Name**
```bash
npm install -g @anthropic-ai/claude-code
```

### **Step 2: If WSL Issues, Try These Commands**
```bash
# Fix OS detection for WSL
npm config set os linux

# Force install with no OS check
npm install -g @anthropic-ai/claude-code --force --no-os-check
```

### **Step 3: Verify Installation**
```bash
# Check if installed
which claude
claude --version
```

### **Step 4: Navigate and Start**
```bash
# Go to project directory
cd "/mnt/d/AI Guided SaaS"

# Start Claude Code
claude
```

## 🚨 **Key Differences**
- ❌ WRONG: `@anthropic/claude-code`
- ✅ CORRECT: `@anthropic-ai/claude-code`
- ❌ Command: `claude-code` (doesn't exist)
- ✅ Command: `claude` (after installation)

## 🔧 **Complete Installation Sequence**
```bash
# 1. Install correct package
npm install -g @anthropic-ai/claude-code

# 2. Navigate to project
cd "/mnt/d/AI Guided SaaS"

# 3. Start Claude Code
claude

# 4. Initialize project (once started)
/init
```

## 💡 **WSL-Specific Fixes (if needed)**
If you get permission or OS detection issues:
```bash
# Set OS to Linux for npm
npm config set os linux

# Force install bypassing OS checks
npm install -g @anthropic-ai/claude-code --force --no-os-check

# Then try running
claude
