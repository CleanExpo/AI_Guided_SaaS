# Unified Environment Variables - AI Guided SaaS

## 🚨 ACTION REQUIRED: Clean up conflicting variables across platforms

### The Issue:
You have different environment variables in Vercel, Railway, and GitHub which may be causing conflicts.

## 📋 Complete Variable List (Copy these exactly):

### 🔴 CRITICAL Variables (App won't work without these):

```env
# Authentication
NEXTAUTH_URL=https://ai-guided-saas-steel.vercel.app
NEXTAUTH_SECRET=[Use the one you already have or generate new: openssl rand -base64 32]

# Admin Configuration (MUST HAVE for admin login)
ENABLE_ADMIN_PANEL=true
ADMIN_EMAIL=zenithfresh25@gmail.com
MASTER_ADMIN_ENABLED=true

# App Configuration
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://ai-guided-saas-steel.vercel.app
APP_URL=https://ai-guided-saas-steel.vercel.app
APP_NAME=AI Guided SaaS Builder
```

### 🟡 REQUIRED for Features:

```env
# Google OAuth (for Google login)
GOOGLE_CLIENT_ID=[Your Google Client ID from earlier]
GOOGLE_CLIENT_SECRET=[Your Google Client Secret from earlier]

# AI Services (for AI features)
ANTHROPIC_API_KEY=[Your Anthropic key]
OPENAI_API_KEY=[Your OpenAI key]

# Database - Use Railway PostgreSQL
DATABASE_URL=[Your Railway PostgreSQL connection string]
DIRECT_URL=[Same as DATABASE_URL]
POSTGRES_PRISMA_URL=[DATABASE_URL with ?pgbouncer=true&connect_timeout=15]

# Supabase (if using Supabase features)
NEXT_PUBLIC_SUPABASE_URL=[Your Supabase project URL]
NEXT_PUBLIC_SUPABASE_ANON_KEY=[Your Supabase anon key]
SUPABASE_SERVICE_ROLE_KEY=[Your Supabase service role key]
```

### 🟢 OPTIONAL Variables:

```env
# MCP Services
JINA_API_KEY=[Your Jina key]
BRIGHTDATA_API_KEY=[Your BrightData key]
DIGITALOCEAN_TOKEN=[Your DigitalOcean token]

# Redis (only if using rate limiting)
REDIS_URL=[Your Redis URL from Railway/Upstash]
REDIS_HOST=[Redis host]
REDIS_PORT=6379
REDIS_PASSWORD=[Redis password]

# Stripe (only if using payments)
STRIPE_SECRET_KEY=[Your Stripe secret]
STRIPE_PUBLISHABLE_KEY=[Your Stripe publishable]
STRIPE_WEBHOOK_SECRET=[Your webhook secret]

# Email
RESEND_API_KEY=[Your Resend key]

# Features
ENABLE_COLLABORATION=true
ENABLE_TEMPLATES=true
ENABLE_ANALYTICS=true
```

## 🔧 Platform Configuration:

### 1. Vercel (Primary):
- **Remove ALL existing variables**
- **Add ALL variables from CRITICAL + REQUIRED sections**
- **Add OPTIONAL only if you use those features**
- **Apply to**: Production, Preview, Development

### 2. Railway:
- **Keep**: Database connection strings (auto-generated)
- **Keep**: Redis connection (if using)
- **Remove**: Everything else

### 3. GitHub Secrets:
- **Keep only if you have CI/CD**:
  - VERCEL_TOKEN
  - DATABASE_URL (for migrations)
- **Remove**: Everything else

## ⚠️ Why Admin Login Is Failing:

Your admin login fails because `ENABLE_ADMIN_PANEL=true` is NOT set in Vercel production environment.

## 🚀 Steps to Fix:

1. **Open Vercel Dashboard**
2. **Go to Environment Variables**
3. **Delete ALL variables**
4. **Add variables from this list**
5. **Redeploy**

## ✅ Test URLs After Fix:

1. **Admin Login**: https://ai-guided-saas-steel.vercel.app/admin/login
   - Email: zenithfresh25@gmail.com
   - Password: AdminSecure2024!

2. **Regular Login**: https://ai-guided-saas-steel.vercel.app/auth/signin

3. **API Health**: https://ai-guided-saas-steel.vercel.app/api/health

---
**Remember**: The email change to zenithfresh25@gmail.com is already in the code. You just need the environment variables set correctly!