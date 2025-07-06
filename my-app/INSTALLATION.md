# AI Guided SaaS - Complete Installation Guide

## 🚀 Quick Installation (5 Minutes)

### **Step 1: Clone and Setup**
```bash
# Clone the repository
git clone https://github.com/your-username/ai-guided-saas.git
cd ai-guided-saas

# Install dependencies
npm install

# Copy environment template
cp .env.local.example .env.local
```

### **Step 2: Configure Environment Variables**

Edit `.env.local` with your API keys:

```bash
# REQUIRED - Supabase (Free tier available)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# REQUIRED - OpenAI (Primary AI provider)
OPENAI_API_KEY=sk-your-openai-key

# OPTIONAL - Additional AI providers
ANTHROPIC_API_KEY=your-claude-key
GOOGLE_AI_API_KEY=your-google-ai-key
```

### **Step 3: Initialize and Run**
```bash
# Build the project (verify zero TypeScript errors)
npm run build

# Start development server
npm run dev

# Run error prevention pipeline (optional)
node scripts/error-prevention-pipeline.js
```

**✅ Installation Complete! Open http://localhost:3000**

---

## 🔧 Detailed Setup Instructions

### **Prerequisites Verification**
```bash
# Check Node.js version (18+ required)
node --version  # Should be v18.0.0 or higher

# Check npm version
npm --version   # Should be 8.0.0 or higher

# Verify Git installation
git --version
```

### **API Key Setup Guide**

#### **1. Supabase Setup (Required)**
1. Visit https://supabase.com and create account
2. Create new project
3. Go to Settings → API
4. Copy "Project URL" and "anon public" key
5. Add to `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

#### **2. OpenAI Setup (Required)**
1. Visit https://platform.openai.com
2. Create account and add billing method
3. Go to API Keys section
4. Create new secret key
5. Add to `.env.local`:
```bash
OPENAI_API_KEY=sk-proj-your-secret-key-here
```

#### **3. Claude/Anthropic Setup (Optional)**
1. Visit https://console.anthropic.com
2. Create account and get API key
3. Add to `.env.local`:
```bash
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

#### **4. Google AI Setup (Optional)**
1. Visit https://makersuite.google.com
2. Create API key
3. Add to `.env.local`:
```bash
GOOGLE_AI_API_KEY=your-google-ai-key
```

### **Database Setup (Supabase)**
The application will automatically create required tables on first run. No manual database setup needed.

### **Verification Steps**
```bash
# 1. Verify TypeScript compilation
npm run typecheck
# Expected: No errors

# 2. Verify build process
npm run build
# Expected: Build successful

# 3. Run tests
npm test
# Expected: All tests passing

# 4. Run error prevention pipeline
node scripts/error-prevention-pipeline.js
# Expected: All validations pass

# 5. Start development server
npm run dev
# Expected: Server starts on http://localhost:3000
```

---

## 🎯 Feature Configuration

### **Enable Claude Code Integration**
```bash
# In .env.local, add:
NEXT_PUBLIC_ENABLE_CLAUDE_CODE=true

# Optional: MongoDB for advanced features
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai_guided_saas
```

### **Enable Error Prevention System**
```bash
# In .env.local, add:
NEXT_PUBLIC_ENABLE_ERROR_PREVENTION=true

# Run error prevention pipeline
node scripts/error-prevention-pipeline.js
```

### **Enable Advanced Analytics (Optional)**
```bash
# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Sentry Error Tracking
SENTRY_DSN=your-sentry-dsn

# Enable in .env.local:
NEXT_PUBLIC_ENABLE_ADVANCED_ANALYTICS=true
```

---

## 🚀 Production Deployment

### **Vercel Deployment (Recommended)**
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Add all variables from .env.local
```

### **Railway Database (Staging)**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and setup database
railway login
railway add postgresql

# Get connection string and add to .env.local:
DATABASE_URL=postgresql://postgres:password@host:port/database
```

### **Environment-Specific Configuration**
```bash
# Development
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Staging
NODE_ENV=staging
NEXT_PUBLIC_APP_URL=https://your-app-staging.vercel.app

# Production
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

---

## 🛡️ Security Configuration

### **Environment Security**
```bash
# Generate secure secrets
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=https://your-domain.com

# JWT secret for sessions
JWT_SECRET=$(openssl rand -base64 32)
```

### **CORS Configuration**
Update `next.config.js` for production domains:
```javascript
async headers() {
  return [
    {
      source: '/api/(.*)',
      headers: [
        {
          key: 'Access-Control-Allow-Origin',
          value: 'https://your-domain.com',
        },
      ],
    },
  ]
}
```

---

## 🧪 Testing Setup

### **Jest Configuration**
```bash
# Run unit tests
npm run test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### **Playwright E2E Tests**
```bash
# Install Playwright
npx playwright install

# Run E2E tests
npm run test:e2e

# Run in headed mode
npm run test:e2e:headed
```

### **Performance Testing**
```bash
# Lighthouse CI
npm run test:lighthouse

# Load testing (optional)
npm install -g artillery
npm run test:load
```

---

## 🔍 Troubleshooting

### **Common Issues**

#### **Build Errors**
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Run error prevention pipeline
node scripts/error-prevention-pipeline.js
```

#### **Environment Variable Issues**
```bash
# Verify .env.local exists and has correct format
cat .env.local

# Check for missing required variables
node -e "
  require('dotenv').config({ path: '.env.local' });
  const required = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'OPENAI_API_KEY'];
  required.forEach(key => {
    if (!process.env[key]) console.log('Missing:', key);
  });
"
```

#### **API Connection Issues**
```bash
# Test OpenAI connection
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
  https://api.openai.com/v1/models

# Test Supabase connection
curl -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/"
```

#### **TypeScript Errors**
```bash
# Check TypeScript compilation
npm run typecheck

# Regenerate types (if using Supabase)
npx supabase gen types typescript --project-id your-project-id

# Clear TypeScript cache
rm -rf .next/types
```

### **Getting Help**
1. Check the `docs/error-patterns.md`
2. Run the error prevention pipeline: `node scripts/error-prevention-pipeline.js`
3. Review deployment checks: `docs/deployment-checks.md`
4. Open an issue on GitHub with error details

---

## 📈 Performance Optimization

### **Build Optimization**
```bash
# Analyze bundle size
npm run build
npm run analyze

# Enable compression in production
# (Automatically handled by Vercel)
```

### **Runtime Optimization**
```bash
# Enable Redis caching (optional)
REDIS_URL=redis://localhost:6379

# Configure CDN (handled by Vercel)
NEXT_PUBLIC_CDN_URL=https://cdn.your-domain.com
```

---

## ✅ Installation Verification Checklist

- [ ] Node.js 18+ installed
- [ ] Repository cloned successfully
- [ ] Dependencies installed (`npm install`)
- [ ] Environment variables configured (`.env.local`)
- [ ] TypeScript compilation successful (`npm run typecheck`)
- [ ] Build process successful (`npm run build`)
- [ ] Tests passing (`npm test`)
- [ ] Error prevention pipeline passes (`node scripts/error-prevention-pipeline.js`)
- [ ] Development server starts (`npm run dev`)
- [ ] Application loads at http://localhost:3000
- [ ] AI chat interface functional
- [ ] Project generation works
- [ ] Claude Code dashboard accessible

## 🎉 Installation Complete!

Your AI Guided SaaS platform is ready for development.

- For production deployment, see `DEPLOYMENT.md`
- For development workflow, see `CONTRIBUTING.md`
