# 🚀 AI Guided SaaS - Production Fix Checklist

## 🔴 CRITICAL: Google OAuth Fix

Your production URL is: `https://ai-guided-saas-fkqvot40t-unite-group.vercel.app`

### Step 1: Update Google Cloud Console
1. Go to https://console.cloud.google.com
2. Select your project
3. Navigate to **APIs & Services > Credentials**
4. Click on your OAuth 2.0 Client ID
5. In **Authorized redirect URIs**, add:
   ```
   https://ai-guided-saas-fkqvot40t-unite-group.vercel.app/api/auth/callback/google
   ```
6. Remove any localhost or incorrect URLs
7. Save changes (may take 5-10 minutes to propagate)

### Step 2: Update Environment Variables

#### In `.env.local` (for local development):
```env
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-actual-google-client-id
GOOGLE_CLIENT_SECRET=your-actual-google-client-secret
```

#### In Vercel Dashboard (for production):
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings > Environment Variables**
4. Add/Update these variables:

```env
# Authentication (REQUIRED)
NEXTAUTH_URL=https://ai-guided-saas-fkqvot40t-unite-group.vercel.app
NEXTAUTH_SECRET=[generate with: openssl rand -base64 32]

# Google OAuth (REQUIRED)
GOOGLE_CLIENT_ID=[your-google-client-id]
GOOGLE_CLIENT_SECRET=[your-google-client-secret]

# OpenAI (REQUIRED for AI features)
OPENAI_API_KEY=[your-openai-api-key]

# Supabase (REQUIRED for database)
NEXT_PUBLIC_SUPABASE_URL=[your-supabase-url]
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-supabase-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-supabase-service-role-key]
DATABASE_URL=[your-postgres-connection-string]

# Application URLs (REQUIRED)
NEXT_PUBLIC_APP_URL=https://ai-guided-saas-fkqvot40t-unite-group.vercel.app
APP_URL=https://ai-guided-saas-fkqvot40t-unite-group.vercel.app
```

## 🔍 Common Issues & Fixes

### 1. 404 Errors on Pages
**Problem**: Pages return 404 in production but work locally
**Fix**: 
- Check `pages/` or `app/` directory structure
- Ensure all imports are correct (case-sensitive on Linux)
- Redeploy after fixes

### 2. API Routes Not Working
**Problem**: API endpoints return 404 or 500 errors
**Fix**:
- Check `/pages/api/` or `/app/api/` routes exist
- Verify environment variables are set in Vercel
- Check server-side logs in Vercel dashboard

### 3. Database Connection Errors
**Problem**: Can't connect to Supabase/database
**Fix**:
- Verify DATABASE_URL is correct
- Check Supabase project is active
- Ensure connection pooling is configured

### 4. OAuth Redirect Mismatch
**Problem**: Error 400: redirect_uri_mismatch
**Fix**:
- Exact match required in Google Console
- Include trailing slashes if needed
- Wait 5-10 minutes after changes

## 📋 Deployment Commands

```bash
# 1. Make script executable
chmod +x fix-production-deployment.sh

# 2. Run the fix script
./fix-production-deployment.sh

# 3. Install dependencies for testing
npm install -D playwright
npx playwright install chromium

# 4. Run comprehensive tests
node comprehensive-production-test.js

# 5. Deploy to production
vercel --prod
```

## ✅ Verification Checklist

- [ ] Google OAuth redirect URI updated in Google Console
- [ ] All environment variables set in Vercel dashboard
- [ ] No placeholder values (like "your_api_key_here")
- [ ] NEXTAUTH_SECRET is a proper 32+ character string
- [ ] Database connection string is valid
- [ ] All API keys are real and active
- [ ] Production URL matches everywhere
- [ ] No 404 errors on main pages
- [ ] OAuth flow initiates without errors
- [ ] API health check returns 200
- [ ] No console errors in browser
- [ ] All tests pass 3 times consecutively

## 🚨 Emergency Rollback

If something goes wrong:
```bash
# Rollback to previous deployment
vercel rollback

# Check deployment history
vercel ls

# View logs
vercel logs
```

## 📞 Support Resources

- NextAuth.js Docs: https://next-auth.js.org/errors
- Vercel Support: https://vercel.com/support
- Google OAuth: https://developers.google.com/identity/protocols/oauth2
- Supabase Docs: https://supabase.com/docs

---

**Remember**: After making any changes to Google Console or environment variables, wait 5-10 minutes and clear your browser cache before testing!