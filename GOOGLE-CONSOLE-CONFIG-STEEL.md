# Google Console Configuration for ai-guided-saas-steel.vercel.app

## 🎯 Your Production URL: `https://ai-guided-saas-steel.vercel.app`

## 📋 Step-by-Step Configuration

### 1. Go to Google Cloud Console
Visit: https://console.cloud.google.com/

### 2. Navigate to OAuth Configuration
- Go to **APIs & Services** → **Credentials**
- Click on your **OAuth 2.0 Client ID** (or create one if needed)

### 3. Add These EXACT URLs

#### ✅ Authorized JavaScript Origins:
```
https://ai-guided-saas-steel.vercel.app
http://localhost:3000
http://localhost:3001
```

#### ✅ Authorized Redirect URIs:
```
https://ai-guided-saas-steel.vercel.app/api/auth/callback/google
http://localhost:3000/api/auth/callback/google
http://localhost:3001/api/auth/callback/google
```

### 4. OAuth Consent Screen Setup
If not already configured:
1. Go to **OAuth consent screen**
2. Fill in:
   - App name: AI Guided SaaS
   - User support email: Your email
   - App domain: ai-guided-saas-steel.vercel.app
   - Authorized domains: ai-guided-saas-steel.vercel.app
3. Add scopes: email, profile, openid
4. Save and continue

### 5. Get Your Credentials
From the OAuth 2.0 Client ID page, copy:
- **Client ID**: Something like `123456789-abcdef.apps.googleusercontent.com`
- **Client Secret**: Keep this secure!

### 6. Update Environment Variables

#### Local Development (.env.local):
```bash
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
NEXTAUTH_URL="https://ai-guided-saas-steel.vercel.app"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
```

#### Vercel Dashboard:
Add these environment variables in your Vercel project settings:
```
GOOGLE_CLIENT_ID=[your-client-id]
GOOGLE_CLIENT_SECRET=[your-client-secret]
NEXTAUTH_URL=https://ai-guided-saas-steel.vercel.app
NEXTAUTH_SECRET=[your-generated-secret]
```

### 7. Generate NEXTAUTH_SECRET
Run this command:
```bash
openssl rand -base64 32
```

### 8. Common Errors & Solutions

| Error | Solution |
|-------|----------|
| redirect_uri_mismatch | Ensure redirect URI matches EXACTLY (no trailing slash) |
| Invalid client | Check Client ID and Secret are correct |
| Access blocked | Publish OAuth consent screen |
| 400: invalid_request | Configure OAuth consent screen |

### 9. Testing Checklist

- [ ] OAuth consent screen is configured
- [ ] Authorized origins include `https://ai-guided-saas-steel.vercel.app`
- [ ] Redirect URI is exactly `https://ai-guided-saas-steel.vercel.app/api/auth/callback/google`
- [ ] Client ID and Secret are in Vercel environment variables
- [ ] NEXTAUTH_URL is set to `https://ai-guided-saas-steel.vercel.app`
- [ ] NEXTAUTH_SECRET is generated and set

### 10. Quick Test URLs

After configuration, test these:
- Production: https://ai-guided-saas-steel.vercel.app/auth/signin
- Local: http://localhost:3000/auth/signin

---
**Important**: Changes in Google Console can take 5-10 minutes to propagate. Clear your browser cache if you still see errors after configuration.