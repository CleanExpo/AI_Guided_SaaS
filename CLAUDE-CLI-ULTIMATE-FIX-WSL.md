# 🚨 ULTIMATE Claude CLI Fix for WSL Ubuntu

## ❌ **Current Error**
```bash
phill_mcgurk@PhillDesktop:/mnt/d/AI Guided SaaS$ claude --dangerously-skip-permissions
claude-bypass: command not found
```

## 🔍 **Root Cause Analysis**
1. **Wrong command:** You're using `claude-bypass` but it should be just `claude`
2. **Installation issue:** Claude CLI might not be properly installed
3. **PATH issue:** Global npm packages not accessible in WSL
4. **Package confusion:** Previous attempts used wrong package names

## ✅ **COMPLETE SOLUTION - Copy & Paste These Commands**

### **🧹 STEP 1: Clean Slate (Remove Any Broken Installations)**
```bash
# Remove any existing broken installations
npm uninstall -g @anthropic/claude-code 2>/dev/null
npm uninstall -g @anthropic-ai/claude-code 2>/dev/null
npm uninstall -g claude-code 2>/dev/null
npm uninstall -g claude 2>/dev/null

# Clear npm cache
npm cache clean --force
```

### **🔧 STEP 2: Configure WSL Environment for npm**
```bash
# Configure npm for WSL Ubuntu
npm config set os linux
npm config set platform linux

# Check npm global path
npm config get prefix

# If npm prefix is not set correctly, fix it
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
```

### **📦 STEP 3: Install Claude CLI with Correct Package**
```bash
# Install the CORRECT package name
npm install -g @anthropic-ai/claude-code --force

# Alternative if the above fails
npm install -g @anthropic-ai/claude-code --force --no-optional --no-fund --no-audit
```

### **🛤️ STEP 4: Fix PATH for Global npm Packages**
```bash
# Add npm global to PATH (if not already there)
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.profile

# Reload shell configuration
source ~/.bashrc
source ~/.profile

# Alternative: add to current session
export PATH=~/.npm-global/bin:$PATH
```

### **✅ STEP 5: Verify Installation**
```bash
# Check if claude command exists
which claude

# Check version
claude --version

# Check npm global packages
npm list -g --depth=0 | grep claude
```

### **🚀 STEP 6: Navigate and Use Claude CLI**
```bash
# Navigate to your project
cd "/mnt/d/AI Guided SaaS"

# Start Claude CLI (CORRECT command - not claude-bypass!)
claude --dangerously-skip-permissions

# Alternative commands to try
claude
claude --help
```

## 🔥 **EMERGENCY BACKUP METHOD (If Above Fails)**

### **Method A: Direct Installation Path**
```bash
# Find where npm installs global packages
npm root -g

# Install directly to that path
sudo npm install -g @anthropic-ai/claude-code --unsafe-perm

# Create symlink if needed
sudo ln -sf $(npm root -g)/@anthropic-ai/claude-code/bin/claude /usr/local/bin/claude
```

### **Method B: Manual PATH Fix**
```bash
# Find the installed claude binary
find / -name "claude" -type f 2>/dev/null | grep -v proc

# Add the directory containing claude to PATH
export PATH="/path/to/claude/directory:$PATH"

# Replace /path/to/claude/directory with actual path found above
```

### **Method C: WSL-Specific Node.js Setup**
```bash
# Install Node Version Manager for WSL
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload terminal
source ~/.bashrc

# Install and use Node 20
nvm install 20
nvm use 20

# Now try installing claude again
npm install -g @anthropic-ai/claude-code
```

## 🎯 **KEY POINTS TO REMEMBER**

### ✅ **Correct Commands:**
- **CORRECT:** `claude --dangerously-skip-permissions`
- **WRONG:** `claude-bypass --dangerously-skip-permissions`

### ✅ **Correct Package:**
- **CORRECT:** `@anthropic-ai/claude-code`
- **WRONG:** `@anthropic/claude-code`

### ✅ **Correct Binary Name:**
- **CORRECT:** `claude`
- **WRONG:** `claude-code` or `claude-bypass`

## 🧪 **Test Commands After Installation**
```bash
# Basic test
claude --version

# Help command
claude --help

# Navigate to project and start
cd "/mnt/d/AI Guided SaaS"
claude --dangerously-skip-permissions
```

## 🚨 **If You Still Get "command not found"**

### **Quick Diagnostic:**
```bash
# Check if package is installed
npm list -g @anthropic-ai/claude-code

# Check PATH
echo $PATH

# Check if binary exists
ls -la ~/.npm-global/bin/claude
ls -la /usr/local/bin/claude

# Check npm config
npm config list
```

### **Manual Binary Location:**
```bash
# Find where claude was installed
find /home/$USER -name "claude" 2>/dev/null
find /usr -name "claude" 2>/dev/null

# Run directly with full path if found
/full/path/to/claude --dangerously-skip-permissions
```

## 🎉 **Success Indicators**
You'll know it's working when:
1. ✅ `which claude` returns a path
2. ✅ `claude --version` shows version info
3. ✅ `claude --dangerously-skip-permissions` starts the CLI instead of "command not found"

---

## 📞 **Quick Copy-Paste Solution**
```bash
# Run all these commands in sequence:
npm uninstall -g @anthropic/claude-code @anthropic-ai/claude-code 2>/dev/null
npm cache clean --force
npm config set os linux
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
npm install -g @anthropic-ai/claude-code --force
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
export PATH=~/.npm-global/bin:$PATH
cd "/mnt/d/AI Guided SaaS"
claude --dangerously-skip-permissions
```

This should resolve the `claude-bypass: command not found` error once and for all! 🚀
