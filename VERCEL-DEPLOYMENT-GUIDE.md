# Vercel Deployment Guide - AI Guided SaaS

## Your Supabase Credentials

```env
NEXT_PUBLIC_SUPABASE_URL=https://rkhsfiuuydxnqxaefbwy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJraHNmaXV1eWR4bnF4YWVmYnd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0OTkyNDgsImV4cCI6MjA2NzA3NTI0OH0.XTv7mEJMG_XWkUXgeWO1hjzFrFaHs2bMepWNIT6UC7s
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJraHNmaXV1eWR4bnF4YWVmYnd5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTQ5OTI0OCwiZXhwIjoyMDY3MDc1MjQ4fQ.CJAgIOBuYlLrkFMDX5e15p9_APKRPkvNEiJoq0qGatg
DATABASE_URL=postgresql://postgres:[YOUR-DATABASE-PASSWORD]@db.rkhsfiuuydxnqxaefbwy.supabase.co:5432/postgres
```

## Step 1: Set Up Supabase Database

1. Go to your Supabase project: https://supabase.com/dashboard/project/rkhsfiuuydxnqxaefbwy

2. Run the NextAuth migration in SQL Editor:
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

3. Get your database password from Supabase Dashboard → Settings → Database

## Step 2: Generate NextAuth Secret

Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```

## Step 3: Complete Environment Variables for Vercel

Here's your complete `.env` file with your Supabase credentials:

```env
# Authentication
NEXTAUTH_URL=https://ai-guided-saas.vercel.app
NEXTAUTH_SECRET=[YOUR-GENERATED-SECRET-FROM-STEP-2]

# Supabase (Your credentials)
DATABASE_URL=postgresql://postgres:[YOUR-DATABASE-PASSWORD]@db.rkhsfiuuydxnqxaefbwy.supabase.co:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://rkhsfiuuydxnqxaefbwy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJraHNmaXV1eWR4bnF4YWVmYnd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0OTkyNDgsImV4cCI6MjA2NzA3NTI0OH0.XTv7mEJMG_XWkUXgeWO1hjzFrFaHs2bMepWNIT6UC7s
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJraHNmaXV1eWR4bnF4YWVmYnd5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTQ5OTI0OCwiZXhwIjoyMDY3MDc1MjQ4fQ.CJAgIOBuYlLrkFMDX5e15p9_APKRPkvNEiJoq0qGatg

# Google OAuth (You need to set these up)
GOOGLE_CLIENT_ID=[FROM-GOOGLE-CLOUD-CONSOLE]
GOOGLE_CLIENT_SECRET=[FROM-GOOGLE-CLOUD-CONSOLE]

# AI Services (At least one required)
OPENAI_API_KEY=[YOUR-OPENAI-KEY]
# OR
ANTHROPIC_API_KEY=[YOUR-ANTHROPIC-KEY]
# OR
PERPLEXITY_API_KEY=[YOUR-PERPLEXITY-KEY]

# Stripe (Optional for payments)
STRIPE_SECRET_KEY=[YOUR-STRIPE-SECRET-KEY]
STRIPE_PUBLISHABLE_KEY=[YOUR-STRIPE-PUBLISHABLE-KEY]
STRIPE_WEBHOOK_SECRET=[YOUR-STRIPE-WEBHOOK-SECRET]

# Optional Services
REDIS_URL=[IF-YOU-HAVE-REDIS]
RESEND_API_KEY=[FOR-EMAIL-SENDING]
NEXT_PUBLIC_SENTRY_DSN=[FOR-ERROR-MONITORING]
GITHUB_TOKEN=[FOR-GITHUB-INTEGRATION]
```

## Step 4: Set Up Google OAuth

1. Go to https://console.cloud.google.com
2. Create a new project or select existing
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Choose "Web application"
6. Add Authorized redirect URI: `https://ai-guided-saas.vercel.app/api/auth/callback/google`
7. Copy the Client ID and Client Secret

## Step 5: Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure environment variables:
   - Click "Environment Variables"
   - Add each variable from Step 3
   - Make sure to set them for "Production", "Preview", and "Development"
4. Click "Deploy"

### Option B: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
cd "/mnt/d/AI Guided SaaS"
vercel

# Follow prompts, then add env vars:
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production
# ... repeat for all variables

# Deploy to production
vercel --prod
```

## Step 6: Post-Deployment Verification

After deployment, test these endpoints:

1. **Health Check**: https://ai-guided-saas.vercel.app/api/health
   - Should return system status

2. **Auth Providers**: https://ai-guided-saas.vercel.app/api/auth/providers
   - Should show Google provider

3. **Main Site**: https://ai-guided-saas.vercel.app
   - Should load the landing page

4. **Sign In**: https://ai-guided-saas.vercel.app/auth/signin
   - Test Google OAuth login

## Troubleshooting

### Common Issues:

1. **"Invalid redirect_uri" error**
   - Make sure the redirect URI in Google Cloud Console matches EXACTLY: `https://ai-guided-saas.vercel.app/api/auth/callback/google`

2. **Database connection error**
   - Check that you added the database password to the DATABASE_URL
   - Ensure Supabase project is active

3. **"Missing API key" errors**
   - Add at least one AI service API key (OpenAI, Anthropic, or Perplexity)

4. **Build failures**
   - Check Vercel function logs for specific errors
   - Ensure all environment variables are set correctly

## Next Steps

1. Set up Stripe for payments (optional)
2. Configure custom domain
3. Set up monitoring (Sentry)
4. Enable Redis for better performance

Your app is now ready for production deployment!