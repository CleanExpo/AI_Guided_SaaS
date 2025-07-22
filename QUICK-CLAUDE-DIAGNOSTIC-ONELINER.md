# 🚀 QUICK CLAUDE DIAGNOSTIC - COPY & PASTE THIS ONE COMMAND

## 🎯 **RUN THIS ONE COMMAND IN UBUNTU TO GET ALL INFO:**

```bash
echo "=== CLAUDE DIAGNOSTIC ===" && echo "1. Which claude:" && which claude && echo "2. Type claude:" && type claude && echo "3. Command claude:" && command -v claude && echo "4. Alias check:" && alias | grep claude && echo "5. Function check:" && declare -f claude && echo "6. File check:" && ls -la /home/$USER/.npm-global/bin/claude* && echo "7. Direct path test:" && /home/$USER/.npm-global/bin/claude --version 2>&1 && echo "8. NPX test:" && npx @anthropic-ai/claude-code --version 2>&1 && echo "=== END DIAGNOSTIC ==="
```

## 🔍 **OR RUN THESE SEPARATELY:**

### **Quick Check 1:**
```bash
type claude
```

### **Quick Check 2:**  
```bash
/home/$USER/.npm-global/bin/claude --version
```

### **Quick Check 3:**
```bash
npx @anthropic-ai/claude-code --version
```

**This will tell us exactly what's hijacking the `claude` command and redirecting it to `claude-bypass`!**
