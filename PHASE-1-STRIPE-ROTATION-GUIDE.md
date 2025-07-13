# 🔐 PHASE 1: STRIPE CREDENTIAL ROTATION GUIDE

## **CRITICAL PRIORITY: PAYMENT PROCESSING SECURITY**
**Service:** Stripe Payment Processing
**Risk Level:** CRITICAL
**Estimated Time:** 15-20 minutes

---

## **🚨 EXPOSED CREDENTIALS TO ROTATE:**
- **Secret Key:** `sk_live_51Gx5IrHjjUzwIJDNp7q5uPs4q...` (CRITICAL)
- **Webhook Secret:** `whsec_dM8MBZSxQJuT10W37uan1SzmoA4JixFS` (HIGH)
- **Publishable Key:** May need verification/rotation

---

## **📋 STEP-BY-STEP ROTATION PROCESS:**

### **STEP 1: ACCESS STRIPE DASHBOARD**
1. **Open browser** and navigate to: https://dashboard.stripe.com/apikeys
2. **Login** with your Stripe account credentials
3. **Verify** you're in the correct account/organization
4. **Navigate** to "Developers" → "API keys" (if not already there)

### **STEP 2: AUDIT CURRENT KEYS**
1. **Locate** the exposed secret key (starts with `sk_live_51Gx5IrHjjUzwIJDNp7q5uPs4q`)
2. **Check** when it was created and last used
3. **Note** any applications currently using this key
4. **Screenshot** current key list for reference

### **STEP 3: CREATE NEW SECRET KEY**
1. **Click** "Create secret key" button
2. **Add description:** "Emergency rotation - 2025-01-14"
3. **Copy** the new secret key immediately (starts with `sk_live_`)
4. **Store temporarily** in secure note (NOT in any file that might be committed)

### **STEP 4: REVOKE OLD SECRET KEY**
1. **Find** the old exposed secret key
2. **Click** the "..." menu next to the key
3. **Select** "Delete" or "Revoke"
4. **Confirm** the deletion
5. **Verify** the key is no longer listed

### **STEP 5: UPDATE WEBHOOK CONFIGURATION**
1. **Navigate** to "Developers" → "Webhooks"
2. **Review** existing webhook endpoints
3. **For each webhook:**
   - Click on the webhook
   - Go to "Signing secret"
   - **Regenerate** the signing secret
   - **Copy** the new secret (starts with `whsec_`)

### **STEP 6: VERIFY PUBLISHABLE KEY**
1. **Check** publishable key (starts with `pk_live_`)
2. **Verify** it's not compromised
3. **Regenerate** if necessary (usually not required)

---

## **🔧 UPDATE LOCAL ENVIRONMENT:**

### **STEP 7: UPDATE .env.local FILE**
1. **Open** your `.env.local` file
2. **Replace** the following variables:
   ```
   STRIPE_SECRET_KEY="[NEW_SECRET_KEY_HERE]"
   STRIPE_WEBHOOK_SECRET="[NEW_WEBHOOK_SECRET_HERE]"
   STRIPE_PUBLISHABLE_KEY="[VERIFY_OR_UPDATE]"
   ```
3. **Save** the file
4. **DO NOT** commit this file to Git

### **STEP 8: UPDATE DEPLOYMENT PLATFORMS**
1. **Vercel Dashboard:**
   - Go to your project settings
   - Update environment variables
   - Redeploy if necessary

2. **Other Platforms:**
   - Update environment variables on all deployment platforms
   - Trigger redeployment

---

## **✅ TESTING & VERIFICATION:**

### **STEP 9: TEST PAYMENT PROCESSING**
1. **Start** your local development server
2. **Test** a payment flow (use Stripe test mode if available)
3. **Verify** webhooks are receiving events
4. **Check** Stripe dashboard for successful API calls

### **STEP 10: MONITOR FOR ISSUES**
1. **Check** application logs for errors
2. **Monitor** Stripe dashboard for failed requests
3. **Verify** all payment features are working
4. **Test** webhook endpoints

---

## **📊 COMPLETION CHECKLIST:**

### **Security Actions:**
- [ ] Old secret key revoked
- [ ] New secret key generated and tested
- [ ] Webhook secrets regenerated
- [ ] Local environment updated
- [ ] Deployment platforms updated

### **Verification Actions:**
- [ ] Payment processing tested
- [ ] Webhooks receiving events
- [ ] No API errors in logs
- [ ] Stripe dashboard shows successful calls
- [ ] All payment features functional

### **Monitoring Actions:**
- [ ] Check for unauthorized transactions
- [ ] Monitor API usage patterns
- [ ] Verify no failed authentication attempts
- [ ] Review Stripe logs for anomalies

---

## **🚨 IF ISSUES OCCUR:**

### **Payment Failures:**
1. **Check** API key format and validity
2. **Verify** environment variables are loaded
3. **Test** with Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

### **Webhook Issues:**
1. **Verify** webhook URL is accessible
2. **Check** webhook secret is correct
3. **Test** webhook endpoint manually

### **Emergency Rollback:**
1. **Create** new temporary key in Stripe
2. **Update** environment immediately
3. **Investigate** issues with new permanent key

---

## **📞 EMERGENCY CONTACTS:**
- **Stripe Support:** https://support.stripe.com/
- **Stripe Status:** https://status.stripe.com/
- **Emergency Phone:** Available in Stripe dashboard

---

## **✅ SUCCESS CRITERIA:**
- ✅ Old credentials completely revoked
- ✅ New credentials generated and active
- ✅ Payment processing fully functional
- ✅ Webhooks receiving events correctly
- ✅ No security alerts or unauthorized access
- ✅ All deployment platforms updated

**NEXT:** Once Stripe rotation is complete, proceed to Supabase (Database) rotation.

---

**⚠️ IMPORTANT:** Keep this guide open during the rotation process and check off each step as you complete it.
