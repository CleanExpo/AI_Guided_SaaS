# 🔄 Restore Previous Claude Setup - `claude --dangerously-skip-permissions`

## 🤔 **Understanding the Issue**
You mentioned that `claude` and `claude --dangerously-skip-permissions` worked before, but now you're getting "command not found".

## 🔍 **Possible Causes**
1. **Claude Code CLI was uninstalled** or removed
2. **PATH environment variable changed**
3. **Node.js version changed** affecting global packages
4. **Package was installed with different method** previously

## 🛠️ **Restore Steps**

### **Step 1: Check What's Currently Installed**
```bash
# Check if any claude commands exist
which claude
which claude-code

# Check global npm packages
npm list -g --depth=0 | grep claude

# Check if claude is in PATH
echo $PATH | grep -o '[^:]*claude[^:]*'
```

### **Step 2: Check Previous Installation Method**
```bash
# Check if installed via different package manager
pip list | grep claude
pip3 list | grep claude

# Check if installed via curl/wget method
ls -la /usr/local/bin/ | grep claude
ls -la ~/.local/bin/ | grep claude
```

### **Step 3: Restore via NPM (Most Likely)**
```bash
# Try the newer package name
npm install -g @anthropic-ai/claude-code

# Then try the command
claude --dangerously-skip-permissions
```

### **Step 4: Alternative Installation Methods**

#### **If it was installed via pip:**
```bash
pip install claude-cli
# or
pip3 install claude-cli
```

#### **If it was a different claude package:**
```bash
# Search for claude packages
npm search claude
```

### **Step 5: Manual PATH Fix**
```bash
# Add npm global bin to PATH if missing
export PATH=$PATH:$(npm root -g)/../bin

# Add to .bashrc to make permanent
echo 'export PATH=$PATH:$(npm root -g)/../bin' >> ~/.bashrc
source ~/.bashrc
```

## 🎯 **Quick Test Commands**
After trying the restoration steps, test with:
```bash
# Navigate to your project
cd "/mnt/d/AI Guided SaaS"

# Try the commands you mentioned
claude
claude --dangerously-skip-permissions
```

## 💡 **If Still Not Working**
Share the output of these diagnostic commands:
```bash
# System info
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "Global NPM packages:"
npm list -g --depth=0
echo "PATH:"
echo $PATH
```

## 🚨 **Last Resort - Fresh Install**
```bash
# Completely clean install
npm uninstall -g @anthropic-ai/claude-code
npm cache clean --force
npm install -g @anthropic-ai/claude-code

# Test
claude --version
claude --dangerously-skip-permissions
