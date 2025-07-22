# 🔧 WSL Claude Code CLI Fix - Command Not Found Issue

## ❌ **The Problem**
You tried: `claude --dangerously-skip-permissions`
Error: `claude-bypass: command not found`

## ✅ **The Solution**
The correct command is `claude-code`, not `claude`!

## 📋 **Step-by-Step Fix Commands for Ubuntu Terminal**

### **1. Navigate to Your Project (in Ubuntu terminal)**
```bash
cd "/mnt/d/AI Guided SaaS"
```

### **2. Check if Claude Code CLI is installed**
```bash
which claude-code
npm list -g @anthropic/claude-code
```

### **3. If NOT installed, install it:**
```bash
# Install Claude Code CLI globally
npm install -g @anthropic/claude-code
```

### **4. Verify Installation**
```bash
# Check if claude-code is now available
which claude-code
claude-code --version
```

### **5. Initialize Claude Code CLI (if needed)**
```bash
# Initialize in your project directory
claude-code init
```

### **6. Run Claude Code CLI - THE CORRECT COMMAND**
```bash
# This is the correct command (not claude)
claude-code
```

## 🚨 **Common Mistakes to Avoid**
- ❌ `claude --dangerously-skip-permissions` (WRONG)
- ❌ `claude-bypass` (WRONG)
- ✅ `claude-code` (CORRECT)

## 🔍 **If Still Having Issues**

### **Check Node.js Version:**
```bash
node --version
# Should be 18.x or 20.x
```

### **Install Node.js 20 if needed:**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### **Reinstall Claude Code CLI:**
```bash
# Uninstall if exists
npm uninstall -g @anthropic/claude-code

# Install fresh
npm install -g @anthropic/claude-code

# Verify
claude-code --version
```

## 🎯 **Quick Test**
```bash
# Navigate to project
cd "/mnt/d/AI Guided SaaS"

# Run correct command
claude-code
```

## 💡 **Remember**
- Use **Ubuntu terminal** (not PowerShell)
- Command is **`claude-code`** (not `claude`)
- Make sure you're in the project directory: `/mnt/d/AI Guided SaaS`
