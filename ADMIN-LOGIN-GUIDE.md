# Admin Login Guide - AI Guided SaaS

## 🔐 Two Different Login Systems

This application has **TWO separate authentication systems**:

### 1. Regular User Login (`/auth/signin`)
- For regular users and customers
- Supports:
  - ✅ Google OAuth (Sign in with Google)
  - ✅ Email/Password (via Supabase database)
- URL: `https://ai-guided-saas-steel.vercel.app/auth/signin`

### 2. Admin Panel Login (`/admin/login`)
- For administrative access only
- Uses hardcoded master credentials
- URL: `https://ai-guided-saas-steel.vercel.app/admin/login`

## 🎯 Admin Login Instructions

### Step 1: Go to the Admin Login Page
Navigate to: **`https://ai-guided-saas-steel.vercel.app/admin/login`**

### Step 2: Use the Master Admin Credentials
```
Email: admin@aiguidedSaaS.com
Password: AdminSecure2024!
```

### Step 3: Access Admin Features
After successful login, you'll have access to:
- User management
- Analytics dashboard
- System configuration
- MCP server status
- Performance monitoring

## ⚠️ Important Notes

1. **Different URLs**:
   - Regular users: `/auth/signin`
   - Admin access: `/admin/login`

2. **Security Warning**: The admin credentials are currently hardcoded. In production, consider:
   - Moving credentials to environment variables
   - Using a secure database for admin accounts
   - Implementing 2FA for admin access

3. **Cannot Use Admin Credentials on Regular Sign-in**:
   - The admin email/password won't work on `/auth/signin`
   - Admin login is completely separate from user authentication

## 🚀 Quick Links

- **Admin Login**: https://ai-guided-saas-steel.vercel.app/admin/login
- **Regular User Login**: https://ai-guided-saas-steel.vercel.app/auth/signin
- **Admin Dashboard**: https://ai-guided-saas-steel.vercel.app/admin/dashboard (after login)

## 🔧 Troubleshooting

If admin login fails:
1. Ensure you're on `/admin/login` (NOT `/auth/signin`)
2. Check credentials are exactly as shown (case-sensitive)
3. Clear browser cache/cookies
4. Check browser console for errors

---
*Note: The admin system is independent of NextAuth/Google OAuth configuration*