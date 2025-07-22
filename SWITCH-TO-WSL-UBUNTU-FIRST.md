# 🔄 YOU NEED TO SWITCH TO WSL UBUNTU FIRST!

## ⚠️ **YOU'RE IN POWERSHELL - NEED TO SWITCH TO UBUNTU**

You're currently in PowerShell (`PS D:\AI Guided SaaS>`), but you need to be in WSL Ubuntu to fix Claude Code CLI.

## 🎯 **CORRECT STEPS - Copy & Paste These**

### **Step 1: Enter WSL Ubuntu from PowerShell**
```powershell
Ubuntu
```
OR
```powershell
wsl
```

### **Step 2: Once in Ubuntu (you'll see `phill_mcgurk@PhillDesktop:`), navigate to project**
```bash
cd "/mnt/d/AI Guided SaaS"
```

### **Step 3: Now run the fix commands**
```bash
# Check current status
which claude
npm list -g @anthropic-ai/claude-code

# Clean install
npm uninstall -g @anthropic/claude-code @anthropic-ai/claude-code
npm cache clean --force
npm install -g @anthropic-ai/claude-code

# Test
claude --version
claude
```

## 📺 **What Your Terminal Should Look Like**

**WRONG (PowerShell):**
```
PS D:\AI Guided SaaS>
```

**CORRECT (Ubuntu):**
```
phill_mcgurk@PhillDesktop:/mnt/d/AI Guided SaaS$
```

## 🚨 **QUICK FIX - Copy & Paste This Sequence:**

1. **Type this in PowerShell to enter Ubuntu:**
   ```
   Ubuntu
   ```

2. **Once you see the Ubuntu prompt, type:**
   ```
   cd "/mnt/d/AI Guided SaaS" && npm uninstall -g @anthropic/claude-code @anthropic-ai/claude-code && npm install -g @anthropic-ai/claude-code && claude --version
   ```

3. **Then test:**
   ```
   claude
   ```

**You must be in Ubuntu/WSL for Claude Code CLI to work!**
