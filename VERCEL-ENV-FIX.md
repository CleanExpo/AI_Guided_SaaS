# 🚨 URGENT: Fix Vercel Environment Variables

## The Problem
Your app is deployed at: `https://ai-guided-saa-s.vercel.app`
But the environment variable points to: `https://ai-guided-saas-steel.vercel.app`

This mismatch is causing authentication issues!

## Fix Instructions

### 1. Go to Vercel Dashboard
https://vercel.com/dashboard

### 2. Select your project: `ai-guided-saa-s`

### 3. Go to Settings → Environment Variables

### 4. Update these variables to the CORRECT URL:

```
NEXTAUTH_URL=https://ai-guided-saa-s.vercel.app
NEXT_PUBLIC_APP_URL=https://ai-guided-saa-s.vercel.app
APP_URL=https://ai-guided-saa-s.vercel.app
```

### 5. Also ensure these are set:
```
NODE_ENV=production
ADMIN_PASSWORD=AdminSecure2024!
ADMIN_EMAIL=admin@aiguidedSaaS.com
NEXTAUTH_SECRET=b8f2c4e6d9a1f3e5c7b9d2f4e6a8c0e2f4b6d8a0c2e4f6b8d0a2c4e6f8b0d2a4
NEXT_PUBLIC_SUPABASE_URL=https://rkhsfiuuydxnqxaefbwy.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJraHNmaXV1eWR4bnF4YWVmYnd5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTQ5OTI0OCwiZXhwIjoyMDY3MDc1MjQ4fQ.CJAgIOBuYlLrkFMDX5e15p9_APKRPkvNEiJoq0qGatg
```

### 6. After updating, redeploy:
- Click "Redeploy" in Vercel Dashboard
- Or push any small change to trigger a new build

## Why This Matters
- NextAuth uses these URLs for callbacks
- Admin authentication checks these URLs
- Mismatched URLs cause redirect loops

## Verify Fix
After redeployment, check:
1. https://ai-guided-saa-s.vercel.app/admin/debug
2. The `urls` section should show the correct URL
3. Then try https://ai-guided-saa-s.vercel.app/admin/login