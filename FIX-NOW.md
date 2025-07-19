# 🚨 FIX THESE ISSUES NOW

## 1. Generate NEXTAUTH_SECRET (1 minute)

Run this command to generate a secret:
```bash
openssl rand -base64 32
```

Example output: `Thbz5TXLzPH8v9/Joo9A8I2w5kLmJl7F8SrmJNVhkSY=`

## 2. Set Environment Variables in Vercel (5 minutes)

Go to: https://vercel.com/dashboard → Your Project → Settings → Environment Variables

Add these EXACTLY:

```env
NEXTAUTH_URL=https://ai-guided-saas-fkqvot40t-unite-group.vercel.app
NEXTAUTH_SECRET=[paste your generated secret here]
GOOGLE_CLIENT_ID=[your actual Google client ID]
GOOGLE_CLIENT_SECRET=[your actual Google client secret]
NEXT_PUBLIC_APP_URL=https://ai-guided-saas-fkqvot40t-unite-group.vercel.app
APP_URL=https://ai-guided-saas-fkqvot40t-unite-group.vercel.app
```

## 3. Fix Missing Features Page (2 minutes)

Create the features page: