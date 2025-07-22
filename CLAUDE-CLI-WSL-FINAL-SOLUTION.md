# 🎯 CLAUDE CLI WSL - FINAL SOLUTION

## ❌ **Your Current Error**
```bash
phill_mcgurk@PhillDesktop:/mnt/d/AI Guided SaaS$ claude --dangerously-skip-permissions
claude-bypass: command not found
```

## 🔍 **Root Cause**
- You're using the wrong command (`claude-bypass` instead of `claude`)
- Claude CLI is not properly installed in your WSL Ubuntu environment
- PATH issues preventing global npm packages from being accessible

## ✅ **IMMEDIATE COPY-PASTE SOLUTION**

**Open your WSL Ubuntu terminal and run these commands in order:**

### **Step 1: One-Line Fix (Copy & Paste This)**
```bash
npm uninstall -g @anthropic/claude-code @anthropic-ai/claude-code 2>/dev/null && npm cache clean --force && npm config set os linux && mkdir -p ~/.npm-global && npm config set prefix '~/.npm-global' && npm install -g @anthropic-ai/claude-code --force && echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc && source ~/.bashrc && export PATH=~/.npm-global/bin:$PATH
```

### **Step 2: Verify Installation**
```bash
which claude
claude --version
```

### **Step 3: Use Claude CLI (CORRECT Command)**
```bash
cd "/mnt/d/AI Guided SaaS"
claude --dangerously-skip-permissions
```

## 🚨 **KEY CORRECTIONS**

### ❌ **WRONG Command (What you were using):**
```bash
claude --dangerously-skip-permissions
# This shows "claude-bypass: command not found"
```

### ✅ **CORRECT Command (What you should use):**
```bash
claude --dangerously-skip-permissions
```

**NOTE:** The command name is just `claude`, not `claude-bypass`. The error message is misleading.

## 🔧 **Alternative Method (If Above Fails)**

### **Manual Step-by-Step:**
```bash
# 1. Clean up
npm uninstall -g @anthropic/claude-code 2>/dev/null
npm uninstall -g @anthropic-ai/claude-code 2>/dev/null
npm cache clean --force

# 2. Configure for WSL
npm config set os linux
npm config set platform linux

# 3. Set up npm global directory
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'

# 4. Install Claude CLI
npm install -g @anthropic-ai/claude-code --force

# 5. Fix PATH
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
export PATH=~/.npm-global/bin:$PATH

# 6. Test
which claude
claude --version

# 7. Navigate and use
cd "/mnt/d/AI Guided SaaS"
claude --dangerously-skip-permissions
```

## 🚨 **Emergency Backup (If Still Failing)**

### **Method A: Direct Installation**
```bash
sudo npm install -g @anthropic-ai/claude-code --unsafe-perm
sudo ln -sf $(npm root -g)/@anthropic-ai/claude-code/bin/claude /usr/local/bin/claude
```

### **Method B: Find and Use Direct Path**
```bash
# Find where claude was installed
find /home -name "claude" 2>/dev/null | head -1

# Run with full path (replace with actual path found above)
/full/path/to/claude --dangerously-skip-permissions
```

### **Method C: Node Version Manager**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
npm install -g @anthropic-ai/claude-code
```

## 📋 **Quick Reference**

### **Package Name:**
- ✅ CORRECT: `@anthropic-ai/claude-code`
- ❌ WRONG: `@anthropic/claude-code`

### **Command Name:**
- ✅ CORRECT: `claude`
- ❌ WRONG: `claude-code` or `claude-bypass`

### **Full Command:**
- ✅ CORRECT: `claude --dangerously-skip-permissions`
- ❌ WRONG: `claude-bypass --dangerously-skip-permissions`

## 🎉 **Success Test**

After installation, these should work:
```bash
which claude
# Should show: /home/phill_mcgurk/.npm-global/bin/claude

claude --version
# Should show version info

cd "/mnt/d/AI Guided SaaS"
claude --dangerously-skip-permissions
# Should start Claude CLI, not show "command not found"
```

## 📞 **If Still Failing**

1. **Restart your WSL terminal completely**
2. **Try the one-line fix again**
3. **Check if PATH was added:** `echo $PATH | grep npm-global`
4. **Manual PATH export:** `export PATH=~/.npm-global/bin:$PATH`

---

**🎯 The main issue was using `claude-bypass` instead of just `claude`. Try the one-line fix first!**
