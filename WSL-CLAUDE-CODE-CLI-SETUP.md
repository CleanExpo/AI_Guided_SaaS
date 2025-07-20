# 🚀 Claude Code CLI Setup for WSL Ubuntu

## 📋 **Copy & Paste Commands for WSL Ubuntu Terminal**

### **1. Navigate to Your Project Directory**
```bash
cd /mnt/d/AI\ Guided\ SaaS
```

### **2. Verify Git Status**
```bash
git status
git log --oneline -5
```

### **3. Install Claude Code CLI (if not already installed)**
```bash
# Install Node.js 20 if needed
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Claude Code CLI globally
npm install -g @anthropic/claude-code
```

### **4. Initialize Claude Code CLI in Project**
```bash
# Initialize Claude Code CLI
claude-code init

# Or if already initialized, just start
claude-code
```

### **5. Environment Setup Commands**
```bash
# Check Node version (should be 20.x)
node --version

# Check npm version
npm --version

# Install project dependencies
npm install

# Create .nvmrc for Node 20
echo "20" > .nvmrc
```

### **6. Vercel Environment Variables (Copy to Vercel Dashboard)**
```bash
ADMIN_PASSWORD=AdminSecure2024!
NEXTAUTH_SECRET=b8f2c4e6d9a1f3e5c7b9d2f4e6a8c0e2f4b6d8a0c2e4f6b8d0a2c4e6f8b0d2a4
NEXTAUTH_URL=https://ai-guided-saa-s.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://rkhsfiuuydxnqxaefbwy.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJraHNmaXV1eWR4bnF4YWVmYnd5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTQ5OTI0OCwiZXhwIjoyMDY3MDc1MjQ4fQ.CJAgIOBuYlLrkFMDX5e15p9_APKRPkvNEiJoq0qGatg
```

### **7. Force Node 20 Configuration**
```bash
# Update package.json engines (copy this to package.json)
npm pkg set engines.node=">=20.0.0"

# Create .nvmrc
echo "20" > .nvmrc

# Verify Node version
node --version
```

### **8. Development Commands**
```bash
# Run development server
npm run dev

# Build project
npm run build

# Test admin login locally
open http://localhost:3000/admin/login
```

### **9. Git Commands for Final Push**
```bash
# Add all changes
git add .

# Commit Node 20 configuration
git commit -m "🔧 FORCE NODE 20: Add .nvmrc and engines configuration for Vercel compatibility"

# Push to trigger Vercel rebuild
git push origin main
```

## 🎯 **Current Status**
- ✅ **Admin Login**: Working at https://ai-guided-saa-s.vercel.app/admin/login
- ✅ **Code**: All fixes committed to GitHub
- ✅ **Credentials**: admin@aiguidedSaaS.com / AdminSecure2024!

## 🚨 **If Issues Persist**
The admin login is actually working now, but if you need to ensure Node 20 compatibility:

1. **Copy the environment variables** to Vercel Dashboard
2. **Run the Node 20 force configuration** commands above
3. **Push to trigger fresh build** with Node 20

The deployment loop issue appears to be resolved! 🎉
