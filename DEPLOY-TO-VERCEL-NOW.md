# 🚀 Deploy to Vercel Production

## ✅ Changes Successfully Pushed to GitHub

The following changes are now in your GitHub repository:
- Fixed MCP configuration (Windows → WSL paths)
- Added Google OAuth setup guides
- Updated production URL configuration

## 📋 Vercel Deployment Steps

### Option 1: Deploy from Vercel Dashboard (Recommended)
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Find your project: **AI Guided SaaS**
3. Click **"Redeploy"** or **"Deploy"**
4. Vercel will automatically pull the latest changes from GitHub

### Option 2: Deploy from Command Line
1. First, get your Vercel token:
   ```bash
   vercel login
   ```

2. Then deploy:
   ```bash
   cd /mnt/d/AI\ Guided\ SaaS
   vercel --prod
   ```

## 🔧 Environment Variables to Set in Vercel

Before deploying, ensure these are set in your Vercel project settings:

```env
# Google OAuth (REQUIRED)
GOOGLE_CLIENT_ID=[Your Google Client ID]
GOOGLE_CLIENT_SECRET=[Your Google Client Secret]
NEXTAUTH_URL=https://ai-guided-saas-steel.vercel.app
NEXTAUTH_SECRET=[Generate with: openssl rand -base64 32]

# API Keys (from your .env.local)
ANTHROPIC_API_KEY=[Your Anthropic API Key]
OPENAI_API_KEY=[Your OpenAI API Key]
JINA_API_KEY=[Your Jina API Key]

# Admin Configuration
ENABLE_ADMIN_PANEL=true
ADMIN_EMAIL=admin@aiguidedSaaS.com

# Other services as needed...
```

## 🎯 Post-Deployment Testing

After deployment completes:

1. **Test Google Authentication**
   - Visit: https://ai-guided-saas-steel.vercel.app/auth/signin
   - Click "Sign in with Google"
   - Should redirect to Google → then back to your app

2. **Check API Health**
   - https://ai-guided-saas-steel.vercel.app/api/health

3. **Verify MCP Services**
   - Check that AI features are working properly

## ⚠️ Important Notes

- **Secrets are NOT in GitHub** - They're stored locally only
- **Environment variables must be set in Vercel** for production to work
- **Google Console URLs must match** your production URL exactly

## 📱 Quick Links
- Production URL: https://ai-guided-saas-steel.vercel.app
- Vercel Dashboard: https://vercel.com/dashboard
- Google Console: https://console.cloud.google.com/