# 🎯 CLAUDE ALIAS FIX - PROBLEM IDENTIFIED!

## ✅ **PROBLEM FOUND:**
```
claude is aliased to `claude-bypass'
alias claude='claude-bypass'
```

**The `claude` command is being redirected to `claude-bypass` by an alias!**

## 🔧 **IMMEDIATE FIX - Copy & Paste These Commands:**

### **Step 1: Remove the alias temporarily**
```bash
unalias claude
```

### **Step 2: Test claude now works**
```bash
claude --version
```

### **Step 3: Make the fix permanent - remove from shell config**
```bash
# Find and remove the alias from config files
grep -n "claude-bypass" ~/.bashrc ~/.bash_profile ~/.profile ~/.bash_aliases 2>/dev/null
sed -i '/claude.*claude-bypass/d' ~/.bashrc ~/.bash_profile ~/.profile ~/.bash_aliases 2>/dev/null
```

### **Step 4: Test again**
```bash
claude --version
claude
```

## 🚨 **QUICK ONE-LINER FIX:**
```bash
unalias claude && claude --version && sed -i '/claude.*claude-bypass/d' ~/.bashrc ~/.bash_profile ~/.profile ~/.bash_aliases 2>/dev/null && echo "✅ Claude alias fixed!"
```

## 🎉 **EXPECTED RESULT:**
After running `unalias claude`, you should see:
```bash
claude --version
# Should show actual Claude version, not "claude-bypass: command not found"

claude
# Should start Claude Code CLI interactive session
```

**The alias was the culprit! Remove it and Claude will work perfectly.**
