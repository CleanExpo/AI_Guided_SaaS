# Google Console Configuration Fix

## 🔧 Quick Fix Steps

### 1. Get Your Production URL
Check your Vercel dashboard for the exact URL. It should look like:
- `https://ai-guided-saas.vercel.app` OR
- `https://ai-guided-saas-production.vercel.app` OR  
- `https://ai-guided-saas-[hash]-unite-group.vercel.app`

### 2. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID

#### Authorized JavaScript Origins (add ALL of these):
```
https://[YOUR-PRODUCTION-URL]
http://localhost:3000
http://localhost:3001
http://localhost:8000
```

#### Authorized Redirect URIs (add ALL of these):
```
https://[YOUR-PRODUCTION-URL]/api/auth/callback/google
http://localhost:3000/api/auth/callback/google
http://localhost:3001/api/auth/callback/google
http://localhost:8000/api/auth/callback/google
```

### 3. Update Local Environment Variables

Run this command to update your .env.local:
```bash
# Replace with your actual values
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

### 4. Update Vercel Environment Variables

In your Vercel dashboard, set:
```
GOOGLE_CLIENT_ID=[your-client-id]
GOOGLE_CLIENT_SECRET=[your-client-secret]
NEXTAUTH_URL=https://[YOUR-EXACT-PRODUCTION-URL]
NEXTAUTH_SECRET=[generate-with-openssl-rand-base64-32]
```

### 5. Common Issues & Solutions

#### Error: redirect_uri_mismatch
- **Cause**: URL mismatch between Google Console and your app
- **Fix**: Ensure URLs match EXACTLY (no trailing slashes)

#### Error: 400: invalid_request
- **Cause**: Missing or incorrect OAuth consent screen
- **Fix**: Configure OAuth consent screen in Google Console

#### Error: Access blocked
- **Cause**: App in testing mode
- **Fix**: Publish your app in OAuth consent screen settings

### 6. Testing Checklist

- [ ] Local development works at http://localhost:3000
- [ ] Production URL is correctly set in Google Console
- [ ] Environment variables are set in Vercel
- [ ] OAuth consent screen is configured
- [ ] Clear browser cache and test again

### 7. Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

---
*Need your actual Google Client ID and Secret? Check Google Cloud Console → APIs & Services → Credentials*