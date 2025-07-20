# 🚀 Vercel Environment Variables Setup

## Copy these values to your Vercel Dashboard

### 1. Go to: https://vercel.com/dashboard
### 2. Select your project: ai-guided-saa-s
### 3. Navigate to: Settings → Environment Variables
### 4. Add/Update these variables:

## 🔐 Authentication & Admin
```
ADMIN_PASSWORD=AdminSecure2024!
ADMIN_EMAIL=admin@aiguidedSaaS.com
NEXTAUTH_SECRET=b8f2c4e6d9a1f3e5c7b9d2f4e6a8c0e2f4b6d8a0c2e4f6b8d0a2c4e6f8b0d2a4
NEXTAUTH_URL=https://ai-guided-saa-s.vercel.app
```

## 🗄️ Supabase Configuration
```
NEXT_PUBLIC_SUPABASE_URL=https://rkhsfiuuydxnqxaefbwy.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJraHNmaXV1eWR4bnF4YWVmYnd5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTQ5OTI0OCwiZXhwIjoyMDY3MDc1MjQ4fQ.CJAgIOBuYlLrkFMDX5e15p9_APKRPkvNEiJoq0qGatg
```

## 🌐 App Configuration
```
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://ai-guided-saa-s.vercel.app
APP_URL=https://ai-guided-saa-s.vercel.app
APP_NAME=AI Guided SaaS
```

## ✅ Feature Flags
```
ENABLE_COLLABORATION=true
ENABLE_TEMPLATES=true
ENABLE_ANALYTICS=true
ENABLE_ADMIN_PANEL=true
ANALYTICS_ENABLED=true
```

## 📝 Important Notes:
1. Make sure to set these for ALL environments (Production, Preview, Development)
2. After adding variables, trigger a new deployment
3. The deployment should now use Node.js 20 and work correctly

## 🔍 Verify Deployment:
- Check build logs for "Using Node.js 20"
- Visit https://ai-guided-saa-s.vercel.app
- Test admin login at https://ai-guided-saa-s.vercel.app/admin/login
  - Email: admin@aiguidedSaaS.com
  - Password: AdminSecure2024!