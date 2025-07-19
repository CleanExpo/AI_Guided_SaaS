# Production Environment Setup Guide

## 🚨 Critical Environment Variables

### 1. Authentication (NextAuth)
```
NEXTAUTH_URL=https://ai-guided-saas.vercel.app
NEXTAUTH_SECRET=[Generate with: openssl rand -base64 32]
```

### 2. Database (Supabase)
```
DATABASE_URL=[Your Supabase PostgreSQL connection string]
NEXT_PUBLIC_SUPABASE_URL=[Your Supabase project URL]
NEXT_PUBLIC_SUPABASE_ANON_KEY=[Your Supabase anon key]
SUPABASE_SERVICE_ROLE_KEY=[Your Supabase service role key]
```

### 3. OAuth (Google)
```
GOOGLE_CLIENT_ID=[From Google Cloud Console]
GOOGLE_CLIENT_SECRET=[From Google Cloud Console]
```

## 🤖 AI Services (At least one required)
```
OPENAI_API_KEY=[Your OpenAI API key]
ANTHROPIC_API_KEY=[Your Anthropic API key]
PERPLEXITY_API_KEY=[Your Perplexity API key]
```

## 💳 Payment Processing (Stripe)
```
STRIPE_SECRET_KEY=[Your Stripe secret key]
STRIPE_PUBLISHABLE_KEY=[Your Stripe publishable key]
STRIPE_WEBHOOK_SECRET=[From Stripe webhook endpoint]
```

## 📦 Optional Services
```
REDIS_URL=[Redis connection URL if using Redis]
RESEND_API_KEY=[For email sending]
NEXT_PUBLIC_SENTRY_DSN=[For error monitoring]
GITHUB_TOKEN=[For GitHub integration]
```

## 🔧 Setup Steps

### 1. Generate NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```

### 2. Create Supabase Project
1. Go to https://supabase.com
2. Create new project
3. Copy connection strings from Settings > Database
4. Copy API keys from Settings > API

### 3. Setup Google OAuth
1. Go to https://console.cloud.google.com
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `https://ai-guided-saas.vercel.app/api/auth/callback/google`

### 4. Get AI API Keys
- OpenAI: https://platform.openai.com/api-keys
- Anthropic: https://console.anthropic.com
- Perplexity: https://perplexity.ai/api

### 5. Setup Stripe (Optional)
1. Go to https://dashboard.stripe.com
2. Get API keys from Developers > API keys
3. Create webhook endpoint for: `https://ai-guided-saas.vercel.app/api/webhooks/stripe`

## 🚀 Deploy to Vercel

### 1. Add Environment Variables
```bash
# Option 1: Vercel Dashboard
# Go to: https://vercel.com/dashboard/[your-project]/settings/environment-variables

# Option 2: Vercel CLI (if logged in)
vercel env add NEXTAUTH_URL production
vercel env add NEXTAUTH_SECRET production
# ... repeat for each variable
```

### 2. Redeploy
```bash
vercel --prod
```

## ✅ Verification
Visit these endpoints to verify setup:
- https://ai-guided-saas.vercel.app/api/health
- https://ai-guided-saas.vercel.app/api/auth/providers
- https://ai-guided-saas.vercel.app

## 🔍 Troubleshooting
1. Check Vercel function logs for errors
2. Verify all critical environment variables are set
3. Ensure OAuth redirect URIs match exactly
4. Check database connection strings are correct