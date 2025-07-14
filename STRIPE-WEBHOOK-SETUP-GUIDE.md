# 🎯 Stripe Webhook Setup Guide

## ✅ Current Status
- ✅ Webhook endpoint created: `/api/webhooks/stripe`
- ✅ Stripe package installed
- ✅ Publishable key updated
- ⏳ **NEED**: Webhook secret from Stripe dashboard

## 🔧 Complete Setup Steps

### Step 1: Access Stripe Dashboard
1. Go to [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Make sure you're in **Live mode** (not Test mode)
3. Navigate to **Developers** → **Webhooks**

### Step 2: Create Webhook Endpoint
1. Click **"Add endpoint"**
2. **Endpoint URL**: `https://ai-guided-saas-unite-group.vercel.app/api/webhooks/stripe`
3. **Description**: `AI Guided SaaS Production Webhook`

### Step 3: Select Events
Select these essential events for your SaaS:

#### ✅ Subscription Events
- `customer.subscription.created`
- `customer.subscription.updated` 
- `customer.subscription.deleted`
- `customer.subscription.trial_will_end`

#### ✅ Payment Events
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

#### ✅ Customer Events
- `customer.created`
- `customer.updated`
- `customer.deleted`

### Step 4: Get Webhook Secret
1. After creating the webhook, click on it
2. Click **"Reveal"** next to **Signing secret**
3. Copy the secret (starts with `whsec_`)

### Step 5: Update Environment Variable
Replace `REPLACE_WITH_NEW_STRIPE_WEBHOOK_SECRET` in your `.env.local` with the actual webhook secret.

## 🎯 Your Webhook Endpoint Details

**URL**: `https://ai-guided-saas-unite-group.vercel.app/api/webhooks/stripe`

**What it handles**:
- ✅ Subscription lifecycle events
- ✅ Payment success/failure events
- ✅ Customer management events
- ✅ Signature verification for security
- ✅ Automatic logging for debugging

## 🔒 Security Features

Your webhook endpoint includes:
- **Signature Verification**: Validates requests are from Stripe
- **Error Handling**: Proper error responses and logging
- **Event Processing**: Structured handling for each event type
- **Database Integration**: Ready for Supabase integration

## 📊 Testing Your Webhook

After setup, you can test by:
1. Creating a test subscription in Stripe
2. Checking your application logs
3. Verifying events are received and processed

## 🚀 Next Steps

1. **Get webhook secret** from Stripe dashboard
2. **Update environment variable** with the secret
3. **Deploy to production** (Vercel will auto-deploy)
4. **Test webhook** with a real transaction
5. **Implement database updates** in the event handlers

## 💡 Important Notes

- The webhook endpoint is already created and ready
- All event handlers are implemented with TODO comments
- You'll need to add Supabase database operations
- The endpoint includes comprehensive error handling
- All events are logged for debugging

## 🔗 Useful Links

- [Stripe Webhooks Documentation](https://stripe.com/docs/webhooks)
- [Stripe Event Types](https://stripe.com/docs/api/events/types)
- [Webhook Security](https://stripe.com/docs/webhooks/signatures)
