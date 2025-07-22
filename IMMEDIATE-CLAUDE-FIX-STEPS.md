# 🚨 IMMEDIATE CLAUDE CODE CLI FIX STEPS

## ⚠️ **CRITICAL ISSUE IDENTIFIED**
The problem is that you're running commands in **WSL Ubuntu**, but I've been executing commands in **PowerShell**. This explains the `claude-bypass: command not found` error.

## 🎯 **IMMEDIATE SOLUTION - Run These Commands in Ubuntu Terminal**

### **Step 1: Open Ubuntu Terminal & Navigate**
```bash
cd "/mnt/d/AI Guided SaaS"
```

### **Step 2: Run the Diagnostic Script**
```bash
# Make script executable
chmod +x CLAUDE-CLI-COMPREHENSIVE-FIX.sh

# Run the comprehensive diagnostic and fix script
bash CLAUDE-CLI-COMPREHENSIVE-FIX.sh
```

### **Step 3: If Script Doesn't Work, Manual Fix**
```bash
# Check what's actually installed
which claude
npm list -g @anthropic-ai/claude-code

# Clean install
npm uninstall -g @anthropic/claude-code 2>/dev/null
npm uninstall -g @anthropic-ai/claude-code 2>/dev/null
npm cache clean --force

# Install correct package
npm install -g @anthropic-ai/claude-code

# Test it
claude --version
claude --help
```

### **Step 4: Test Claude Without Flags**
```bash
# Try just running claude
claude

# If that doesn't work, check if the command exists
which claude
ls -la /home/$USER/.npm-global/bin/claude
```

## 🔍 **Key Points to Check**

1. **Make sure you're in Ubuntu terminal** (not PowerShell)
2. **The correct package is** `@anthropic-ai/claude-code` (note the `-ai`)
3. **The command is just** `claude` (no `--dangerously-skip-permissions` needed)
4. **Your PATH includes** `/home/phill_mcgurk/.npm-global/bin`

## 🚨 **If Still Having Issues**

Run this quick diagnostic in Ubuntu:
```bash
echo "Node: $(node --version)"
echo "NPM: $(npm --version)"  
echo "Claude location: $(which claude)"
echo "PATH check:"
echo $PATH | grep npm-global
```

Then share the output so I can see what's happening in your actual WSL environment.

## 💡 **Most Likely Solutions**

1. **Package name was wrong**: You need `@anthropic-ai/claude-code` not `@anthropic/claude-code`
2. **No special flags needed**: Just run `claude` - the `--dangerously-skip-permissions` flag might not exist
3. **PATH issue**: The npm global bin directory needs to be in your PATH

**Run the diagnostic script first - it will identify and fix the exact issue!**
