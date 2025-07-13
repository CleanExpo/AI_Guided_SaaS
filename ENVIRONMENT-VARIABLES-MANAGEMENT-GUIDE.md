# 🔐 Environment Variables Management Guide for Non-Coders

## 📋 **WHAT ARE ENVIRONMENT VARIABLES?**
Environment variables are like secret passwords and configuration settings that your app needs to work properly. They include:
- API keys (like passwords for external services)
- Database connection strings
- Payment processing credentials
- Authentication secrets

## 🚨 **WHY THIS MATTERS**
- **Security**: Keeps sensitive information out of your code
- **Flexibility**: Easy to change settings without touching code
- **Safety**: Prevents accidental exposure of secrets

---

## 🎯 **STEP-BY-STEP ROTATION WORKFLOW**

### **PHASE 1: PREPARATION (5 minutes)**

#### ✅ **Step 1.1: Create Your Workspace**
1. Open a text editor (Notepad, TextEdit, or any text app)
2. Create a new document called "New Environment Variables"
3. Copy the template from `.env.local.secure` file
4. Keep this document open - you'll fill it in step by step

#### ✅ **Step 1.2: Gather Your Service Accounts**
Make sure you have login access to:
- [ ] Stripe Dashboard
- [ ] Supabase Dashboard  
- [ ] OpenAI Account
- [ ] Anthropic Account
- [ ] Google Cloud Console
- [ ] Vercel Dashboard
- [ ] Any other services you use

---

### **PHASE 2: SERVICE-BY-SERVICE ROTATION**

## 🏦 **2.1 STRIPE (Payment Processing) - PRIORITY 1**

### **What You Need:**
- Stripe Dashboard access
- 5 minutes

### **Steps:**
1. **Login to Stripe Dashboard**: https://dashboard.stripe.com
2. **Go to API Keys**: Click "Developers" → "API keys"
3. **Revoke Old Keys**:
   - Find the old secret key (starts with `sk_live_`)
   - Click "..." → "Delete" or "Revoke"
4. **Create New Keys**:
   - Click "Create secret key"
   - Copy the new key (starts with `sk_live_`)
   - Also get the new publishable key (starts with `pk_live_`)
5. **Update Webhooks**:
   - Go to "Webhooks" section
   - Create new webhook endpoint
   - Copy the new webhook secret (starts with `whsec_`)

### **What to Copy to Your Document:**
```
STRIPE_SECRET_KEY="sk_live_[NEW_KEY_HERE]"
STRIPE_PUBLISHABLE_KEY="pk_live_[NEW_KEY_HERE]"
STRIPE_WEBHOOK_SECRET="whsec_[NEW_WEBHOOK_SECRET]"
```

---

## 🗄️ **2.2 SUPABASE (Database) - PRIORITY 1**

### **What You Need:**
- Supabase Dashboard access
- 3 minutes

### **Steps:**
1. **Login to Supabase**: https://supabase.com/dashboard
2. **Select Your Project**: Click on your project name
3. **Go to Settings**: Click "Settings" → "API"
4. **Reset Service Role Key**:
   - Find "service_role" key
   - Click "Reset" or "Regenerate"
   - Copy the new key
5. **Get Database URL**:
   - Go to "Settings" → "Database"
   - Copy the connection string
   - Replace `[YOUR-PASSWORD]` with your actual database password

### **What to Copy to Your Document:**
```
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-ID].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[NEW_ANON_KEY]"
SUPABASE_SERVICE_ROLE_KEY="[NEW_SERVICE_ROLE_KEY]"
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"
```

---

## 🤖 **2.3 AI SERVICES - PRIORITY 1**

### **OpenAI:**
1. **Login**: https://platform.openai.com/api-keys
2. **Revoke Old Key**: Find old key → "Delete"
3. **Create New**: Click "Create new secret key"
4. **Copy**: Starts with `sk-proj-` or `sk-`

### **Anthropic (Claude):**
1. **Login**: https://console.anthropic.com/
2. **Go to API Keys**: Navigate to API section
3. **Revoke Old**: Delete the old key
4. **Create New**: Generate new key
5. **Copy**: Starts with `sk-ant-`

### **What to Copy to Your Document:**
```
OPENAI_API_KEY="sk-proj-[NEW_OPENAI_KEY]"
ANTHROPIC_API_KEY="sk-ant-[NEW_ANTHROPIC_KEY]"
```

---

## 🔐 **2.4 GOOGLE OAUTH - PRIORITY 2**

### **Steps:**
1. **Login**: https://console.cloud.google.com/
2. **Go to Credentials**: APIs & Services → Credentials
3. **Find OAuth Client**: Look for "Web application"
4. **Reset Secret**: Click "Reset secret" or create new
5. **Copy Both**: Client ID and Client Secret

### **What to Copy to Your Document:**
```
GOOGLE_CLIENT_ID="[NEW_CLIENT_ID].apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-[NEW_CLIENT_SECRET]"
```

---

## ☁️ **2.5 DEPLOYMENT PLATFORMS - PRIORITY 2**

### **Vercel:**
1. **Login**: https://vercel.com/dashboard
2. **Go to Settings**: Account → Tokens
3. **Revoke Old**: Delete old tokens
4. **Create New**: Generate new token
5. **Copy**: Starts with random characters

### **What to Copy to Your Document:**
```
VERCEL_TOKEN="[NEW_VERCEL_TOKEN]"
```

---

### **PHASE 3: GENERATE NEW SECRETS**

## 🔑 **3.1 AUTHENTICATION SECRETS**

### **NextAuth Secret:**
1. **Go to**: https://generate-secret.vercel.app/32
2. **Click Generate**: Copy the generated string
3. **Use This**: For NEXTAUTH_SECRET

### **Admin Secrets:**
1. **Generate Strong Passwords**: Use a password generator
2. **Create 3 Different Secrets**: For admin key, session, and JWT

### **What to Copy to Your Document:**
```
NEXTAUTH_SECRET="[GENERATED_SECRET_32_CHARS]"
ADMIN_SECRET_KEY="[STRONG_PASSWORD_1]"
ADMIN_SESSION_SECRET="[STRONG_PASSWORD_2]"
ADMIN_JWT_SECRET="[STRONG_PASSWORD_3]"
```

---

### **PHASE 4: UPDATE YOUR APPLICATION**

## 📝 **4.1 CREATE NEW .env.local FILE**

### **Steps:**
1. **Copy Template**: Use your filled-out document
2. **Create File**: In your project root, create `.env.local`
3. **Paste Content**: Copy all your new variables
4. **Save File**: Make sure it's saved as `.env.local`

## ☁️ **4.2 UPDATE DEPLOYMENT PLATFORMS**

### **Vercel Environment Variables:**
1. **Go to Project**: https://vercel.com/dashboard
2. **Select Project**: Click your project name
3. **Go to Settings**: Click "Settings" tab
4. **Environment Variables**: Click "Environment Variables"
5. **Update Each Variable**: 
   - Click "Edit" on each variable
   - Paste new value
   - Click "Save"
6. **Redeploy**: Go to "Deployments" → "Redeploy"

---

## ✅ **VERIFICATION CHECKLIST**

### **After Updating Everything:**
- [ ] Website loads without errors
- [ ] Login/authentication works
- [ ] Payment processing works (test mode)
- [ ] Database connections work
- [ ] AI features work
- [ ] No console errors in browser

### **Security Monitoring:**
- [ ] Check Stripe dashboard for unusual activity
- [ ] Monitor OpenAI usage dashboard
- [ ] Check Supabase logs for unauthorized access
- [ ] Review Vercel deployment logs

---

## 🚨 **EMERGENCY CONTACTS & RESOURCES**

### **If Something Breaks:**
1. **Check Logs**: Look at Vercel deployment logs
2. **Verify Variables**: Make sure all variables are set correctly
3. **Test One Service**: Isolate which service isn't working
4. **Rollback**: Use previous working deployment if needed

### **Quick Reference Links:**
- **Stripe Dashboard**: https://dashboard.stripe.com
- **Supabase Dashboard**: https://supabase.com/dashboard
- **OpenAI API Keys**: https://platform.openai.com/api-keys
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Google Cloud Console**: https://console.cloud.google.com

---

## 📋 **TEMPLATE FOR FUTURE USE**

### **Monthly Security Review Checklist:**
- [ ] Rotate API keys (monthly)
- [ ] Review access logs
- [ ] Update passwords
- [ ] Check for unused services
- [ ] Verify backup systems

### **When Adding New Services:**
1. **Add to .env.local**: Include new variables
2. **Update Vercel**: Add to deployment environment
3. **Document**: Add to this guide
4. **Test**: Verify everything works
5. **Backup**: Save configuration

---

## 🎯 **SUCCESS METRICS**

### **You'll Know It's Working When:**
- ✅ All services connect successfully
- ✅ No authentication errors
- ✅ Payments process correctly
- ✅ Database queries work
- ✅ AI features respond
- ✅ Deployment succeeds

### **Red Flags to Watch For:**
- ❌ 401/403 authentication errors
- ❌ Database connection failures
- ❌ Payment processing errors
- ❌ API rate limit exceeded
- ❌ Deployment failures

---

**🔒 Remember: Never share these credentials or commit them to version control!**

**📞 Need Help?** Keep this guide handy and follow it step-by-step. Each service has its own dashboard where you can manage keys safely.
