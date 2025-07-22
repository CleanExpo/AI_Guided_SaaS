# 🚀 INSTALL Claude Code CLI - Step by Step

## 🔧 **Current Issue**
`claude-code: command not found` - This means Claude Code CLI is NOT installed.

## 📋 **COPY & PASTE These Commands in Ubuntu Terminal**

### **Step 1: Check Node.js Version**
```bash
node --version
npm --version
```

### **Step 2: Install Node.js 20 (if needed)**
```bash
# Update package lists
sudo apt update

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### **Step 3: Install Claude Code CLI**
```bash
# Install Claude Code CLI globally
npm install -g @anthropic/claude-code

# Verify it's installed
which claude-code
claude-code --version
```

### **Step 4: Navigate to Project and Initialize**
```bash
# Go to your project directory
cd "/mnt/d/AI Guided SaaS"

# Initialize Claude Code CLI
claude-code init
```

### **Step 5: Run Claude Code CLI**
```bash
# Run the CLI
claude-code
```

## 🚨 **If Step 3 Fails (Permission Issues)**

### **Option A: Fix npm permissions**
```bash
# Create npm global directory
mkdir ~/.npm-global

# Configure npm to use new directory
npm config set prefix '~/.npm-global'

# Add to PATH in ~/.bashrc
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc

# Reload bash profile
source ~/.bashrc

# Now try installing again
npm install -g @anthropic/claude-code
```

### **Option B: Use sudo (if Option A doesn't work)**
```bash
sudo npm install -g @anthropic/claude-code
```

## 🔍 **Test Installation**
```bash
# Check if command exists
which claude-code

# Check version
claude-code --version

# If both work, you're ready to use it!
claude-code
```

## 💡 **Quick Summary**
1. **Install Node.js 20** (if not already installed)
2. **Install Claude Code CLI**: `npm install -g @anthropic/claude-code`
3. **Navigate to project**: `cd "/mnt/d/AI Guided SaaS"`
4. **Run CLI**: `claude-code`
