# Environment Setup Guide - AI Guided SaaS

## 🔐 Secure Environment Variable Management

This guide explains how to set up environment variables WITHOUT storing sensitive keys in files.

## Required Environment Variables

### For Local Development (.env.local)

```env
# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=[Generate with: openssl rand -base64 32]

# Google OAuth
GOOGLE_CLIENT_ID=[Your Google Client ID]
GOOGLE_CLIENT_SECRET=[Your Google Client Secret]

# Admin Configuration
ENABLE_ADMIN_PANEL=true
ADMIN_EMAIL=zenithfresh25@gmail.com
MASTER_ADMIN_ENABLED=true

# AI Services
ANTHROPIC_API_KEY=[Your Anthropic API Key]
OPENAI_API_KEY=[Your OpenAI API Key]

# MCP Services
JINA_API_KEY=[Your Jina API Key]
BRIGHTDATA_API_KEY=[Your BrightData API Key]
DIGITALOCEAN_TOKEN=[Your DigitalOcean Token]
```

### For Production (Vercel Dashboard)

```env
# Authentication
NEXTAUTH_URL=https://ai-guided-saas-steel.vercel.app
NEXTAUTH_SECRET=[Generate with: openssl rand -base64 32]

# Google OAuth
GOOGLE_CLIENT_ID=[Your Google Client ID]
GOOGLE_CLIENT_SECRET=[Your Google Client Secret]

# Admin Configuration
ENABLE_ADMIN_PANEL=true
ADMIN_EMAIL=zenithfresh25@gmail.com
MASTER_ADMIN_ENABLED=true

# All other API keys as above...
```

## 🚀 Setup Instructions

### 1. Copy the Example File
```bash
cp .env.local.example .env.local
```

### 2. Fill in Your API Keys
- Edit `.env.local` and replace placeholders with your actual keys
- Never commit this file to git (it's in .gitignore)

### 3. For Production
- Add all environment variables in Vercel Dashboard
- Go to Project Settings → Environment Variables
- Add each variable for Production environment

## 🔒 Security Best Practices

1. **Never commit `.env.local` or `.env` files**
2. **Use `.env.local.example` as a template only**
3. **Store production secrets in Vercel Dashboard only**
4. **Rotate API keys regularly**
5. **Use different keys for dev and production**

## 📝 Admin Login

- **URL**: `/admin/login`
- **Email**: `zenithfresh25@gmail.com`
- **Password**: `AdminSecure2024!`

## 🧪 Testing Configuration

```bash
# Test environment variables are loaded
npm run dev
# Check console for any missing variable warnings
```

## ⚠️ Important Notes

- The `.env.local` file is gitignored for security
- Production environment variables must be set in Vercel
- Never expose API keys in client-side code
- Use `NEXT_PUBLIC_` prefix only for public variables