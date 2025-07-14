# 🔐 Google OAuth Setup Guide for AI Guided SaaS

## ✅ Current Status
- ✅ NextAuth configured for Google OAuth
- ✅ Redirect URI configured: `https://ai-guided-saas-unite-group.vercel.app/api/auth/callback/google`
- ⏳ **NEED**: Google Client ID and Client Secret from Google Cloud Console

## 🔧 Complete Setup Steps

### Step 1: Access Google Cloud Console
1. Go to [https://console.cloud.google.com](https://console.cloud.google.com)
2. Sign in with your Google account
3. Create a new project or select existing project

### Step 2: Enable Google+ API
1. Navigate to **APIs & Services** → **Library**
2. Search for **"Google+ API"** or **"Google Identity"**
3. Click **Enable** on the Google+ API

### Step 3: Configure OAuth Consent Screen
1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External** user type (unless you have Google Workspace)
3. Fill in required information:
   - **App name**: `AI Guided SaaS`
   - **User support email**: Your email
   - **Developer contact email**: Your email
   - **App domain**: `ai-guided-saas-unite-group.vercel.app`
   - **Authorized domains**: `vercel.app`
4. Click **Save and Continue**

### Step 4: Create OAuth 2.0 Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **OAuth 2.0 Client IDs**
3. Choose **Web application**
4. Configure the following:

#### ✅ Application Details
- **Name**: `AI Guided SaaS Production`

#### ✅ Authorized JavaScript Origins
Add these URLs:
- `https://ai-guided-saas-unite-group.vercel.app`
- `http://localhost:3000` (for development)

#### ✅ Authorized Redirect URIs
Add these exact URLs:
- `https://ai-guided-saas-unite-group.vercel.app/api/auth/callback/google`
- `http://localhost:3000/api/auth/callback/google` (for development)

### Step 5: Get Your Credentials
1. After creating, you'll see a popup with:
   - **Client ID** (starts with numbers, ends with `.apps.googleusercontent.com`)
   - **Client Secret** (random string)
2. Copy both values

## 🎯 Your OAuth Configuration

### **Redirect URI (Already Configured)**
```
https://ai-guided-saas-unite-group.vercel.app/api/auth/callback/google
```

### **Environment Variables Needed**
```bash
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

## 🔒 Security Best Practices

### **Domain Restrictions**
- Only add trusted domains to authorized origins
- Use exact URLs for redirect URIs
- Never share your client secret publicly

### **Scopes**
Your app will request these permissions:
- `openid` - Basic authentication
- `email` - User's email address
- `profile` - Basic profile information

## 📊 Testing Your OAuth Setup

After configuration, you can test by:
1. Going to your app's login page
2. Clicking "Sign in with Google"
3. Completing the OAuth flow
4. Verifying user data is received

## 🚀 Production Deployment

### **Environment Variables**
Make sure these are set in:
- ✅ Local `.env.local` file
- ✅ Vercel environment variables
- ✅ Any other deployment platforms

### **Domain Verification**
- Ensure your production domain is verified in Google Cloud Console
- Add all necessary redirect URIs for different environments

## 💡 Troubleshooting

### **Common Issues**
- **"redirect_uri_mismatch"**: Check exact URL spelling in Google Console
- **"invalid_client"**: Verify Client ID and Secret are correct
- **"access_denied"**: Check OAuth consent screen configuration

### **Debug Steps**
1. Verify all URLs match exactly (including https/http)
2. Check that APIs are enabled
3. Ensure OAuth consent screen is configured
4. Verify environment variables are set correctly

## 🔗 Useful Links

- [Google Cloud Console](https://console.cloud.google.com)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [NextAuth Google Provider Docs](https://next-auth.js.org/providers/google)

## 📋 Checklist

- [ ] Create Google Cloud Project
- [ ] Enable Google+ API
- [ ] Configure OAuth consent screen
- [ ] Create OAuth 2.0 credentials
- [ ] Add authorized domains and redirect URIs
- [ ] Copy Client ID and Client Secret
- [ ] Update environment variables
- [ ] Test OAuth flow
- [ ] Deploy to production
