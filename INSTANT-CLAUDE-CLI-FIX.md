# 🚨 INSTANT Claude CLI Fix - Run These Commands NOW

## ❌ **Current Error**
```bash
phill_mcgurk@PhillDesktop:/mnt/d/AI Guided SaaS$ claude --dangerously-skip-permissions
claude-bypass: command not found
```

## ✅ **SOLUTION: Copy & Paste These Commands in WSL Ubuntu**

**You need to INSTALL Claude CLI first. Copy and paste each command below:**

### **Step 1: Clean up any broken installations**
```bash
npm uninstall -g @anthropic/claude-code @anthropic-ai/claude-code 2>/dev/null
```

### **Step 2: Clear npm cache**
```bash
npm cache clean --force
```

### **Step 3: Configure WSL environment**
```bash
npm config set os linux
npm config set platform linux
```

### **Step 4: Set up npm global directory**
```bash
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
```

### **Step 5: Install Claude CLI (CORRECT package)**
```bash
npm install -g @anthropic-ai/claude-code --force
```

### **Step 6: Fix PATH so you can use 'claude' command**
```bash
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
export PATH=~/.npm-global/bin:$PATH
```

### **Step 7: Test if Claude CLI is installed**
```bash
which claude
claude --version
```

### **Step 8: Now use Claude CLI in your project**
```bash
cd "/mnt/d/AI Guided SaaS"
claude --dangerously-skip-permissions
```

## 🔄 **ONE-LINE VERSION (Copy & Paste This)**
```bash
npm uninstall -g @anthropic/claude-code @anthropic-ai/claude-code 2>/dev/null && npm cache clean --force && npm config set os linux && npm config set platform linux && mkdir -p ~/.npm-global && npm config set prefix '~/.npm-global' && npm install -g @anthropic-ai/claude-code --force && echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc && source ~/.bashrc && export PATH=~/.npm-global/bin:$PATH
```

## 🧪 **After Running Commands Above**
Test with:
```bash
which claude
# Should show: /home/phill_mcgurk/.npm-global/bin/claude

claude --version  
# Should show version info (not "command not found")

cd "/mnt/d/AI Guided SaaS"
claude --dangerously-skip-permissions
# Should start Claude CLI interface
```

## 🚨 **If Still Getting "command not found"**

1. **Close and reopen your WSL terminal completely**
2. **Run this command to reload PATH:**
   ```bash
   source ~/.bashrc && export PATH=~/.npm-global/bin:$PATH
   ```
3. **Try again:**
   ```bash
   cd "/mnt/d/AI Guided SaaS"
   claude --dangerously-skip-permissions
   ```

---

**🎯 The issue is that Claude CLI is not installed yet. Run the installation commands above first!**
