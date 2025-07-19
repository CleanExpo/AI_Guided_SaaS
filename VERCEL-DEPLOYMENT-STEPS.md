# Vercel Deployment Steps - AI Guided SaaS

## ⚠️ IMPORTANT: Environment Variables
You have provided all necessary environment variables. These should be added directly to Vercel Dashboard and NEVER committed to the repository.

## Step 1: Prepare Supabase Database

1. Go to your Supabase SQL Editor: https://supabase.com/dashboard/project/rkhsfiuuydxnqxaefbwy/sql

2. Run this SQL to create all necessary tables:

```sql
-- Create tables for NextAuth
CREATE TABLE IF NOT EXISTS accounts (
  id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT NOT NULL,
  session_token TEXT NOT NULL UNIQUE,
  user_id TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT NOT NULL,
  email TEXT UNIQUE,
  email_verified TIMESTAMPTZ,
  name TEXT,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);

-- Create custom tables for the app
CREATE TABLE IF NOT EXISTS projects (
  id TEXT NOT NULL DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT NOT NULL DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  status TEXT,
  price_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payments (
  id TEXT NOT NULL DEFAULT gen_random_uuid(),
  stripe_invoice_id TEXT,
  stripe_subscription_id TEXT,
  stripe_payment_intent_id TEXT,
  amount BIGINT,
  currency TEXT,
  status TEXT,
  paid_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,
  failure_message TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT NOT NULL DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid()::text = id);

CREATE POLICY "Users can view own projects" ON projects
  FOR ALL USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view own notifications" ON notifications
  FOR ALL USING (auth.uid()::text = user_id);
```

## Step 2: Update Google OAuth Redirect URI

1. Go to https://console.cloud.google.com
2. Select your project
3. Go to APIs & Services → Credentials
4. Click on your OAuth 2.0 Client ID
5. Add these Authorized redirect URIs:
   - `https://ai-guided-saas-production.vercel.app/api/auth/callback/google`
   - `https://ai-guided-saas-unite-group.vercel.app/api/auth/callback/google`
   - `https://ai-guided-saas-bh9d1q3p5-unite-group.vercel.app/api/auth/callback/google`

## Step 3: Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure Environment Variables:
   - Click "Environment Variables"
   - Add ALL the environment variables you provided
   - Make sure to set them for "Production", "Preview", and "Development"
5. Click "Deploy"

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI if not already installed
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (from project directory)
cd "/mnt/d/AI Guided SaaS"
vercel --prod
```

When using CLI, you'll need to add environment variables through the dashboard after deployment.

## Step 4: Configure Stripe Webhook

1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://ai-guided-saas-production.vercel.app/api/webhooks/stripe`
4. Select events to listen to:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the webhook signing secret and update STRIPE_WEBHOOK_SECRET in Vercel

## Step 5: Post-Deployment Verification

Test these endpoints after deployment:

1. **Health Check**: 
   - https://ai-guided-saas-production.vercel.app/api/health

2. **Auth Providers**: 
   - https://ai-guided-saas-production.vercel.app/api/auth/providers

3. **Main Application**: 
   - https://ai-guided-saas-production.vercel.app

4. **Sign In Flow**: 
   - https://ai-guided-saas-production.vercel.app/auth/signin
   - Test Google OAuth login

## Step 6: Domain Configuration (Optional)

If you want to use a custom domain:

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update NEXTAUTH_URL to your custom domain
5. Update Google OAuth redirect URIs

## Troubleshooting

### Common Issues:

1. **OAuth Error "redirect_uri_mismatch"**
   - Ensure the redirect URI in Google Console matches your deployment URL exactly
   - Check that NEXTAUTH_URL is set correctly

2. **Database Connection Issues**
   - Verify DATABASE_URL is correctly formatted
   - Check Supabase project is active and not paused

3. **Build Failures**
   - Check Vercel function logs
   - Ensure all environment variables are set
   - Verify no sensitive data is hardcoded

4. **Stripe Webhook Failures**
   - Ensure webhook endpoint URL is correct
   - Verify STRIPE_WEBHOOK_SECRET matches the webhook signing secret

## Security Notes

- Never commit `.env` files with real credentials
- Rotate API keys regularly
- Use Vercel's environment variable system for all secrets
- Enable 2FA on all service accounts (GitHub, Vercel, Google, etc.)

## Monitoring

After deployment:
- Set up Vercel Analytics
- Configure Sentry for error tracking (already have NEXT_PUBLIC_SENTRY_DSN)
- Monitor Supabase usage and limits
- Set up alerts for API rate limits

Your application is now ready for production use!