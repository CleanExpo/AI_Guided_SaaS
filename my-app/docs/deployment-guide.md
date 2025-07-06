# Production Deployment Guide

## Overview

This guide covers the complete production deployment process for the AI-Guided SaaS platform, including CI/CD pipeline setup, environment configuration, monitoring, and maintenance procedures.

## 🚀 Deployment Architecture

### Platform Stack
- **Frontend**: Next.js 14 with App Router
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: NextAuth.js with Google OAuth
- **Payments**: Stripe
- **AI Integration**: OpenAI GPT-4
- **Hosting**: Vercel
- **CI/CD**: GitHub Actions

### Infrastructure Components
- **Application Server**: Vercel Edge Functions
- **Database**: Supabase managed PostgreSQL
- **File Storage**: Vercel Blob Storage
- **CDN**: Vercel Edge Network
- **Monitoring**: Built-in health checks and analytics
- **Security**: HTTPS, security headers, CSRF protection

## 📋 Pre-Deployment Checklist

### 1. Environment Setup
- [ ] Vercel account created and configured
- [ ] GitHub repository connected to Vercel
- [ ] Supabase project created
- [ ] Stripe account configured (test and live modes)
- [ ] OpenAI API key obtained
- [ ] Google OAuth app configured
- [ ] Domain name configured (if using custom domain)

### 2. Security Configuration
- [ ] Environment variables secured
- [ ] API keys rotated and stored securely
- [ ] CORS policies configured
- [ ] Rate limiting implemented
- [ ] Security headers configured
- [ ] SSL/TLS certificates configured

### 3. Database Setup
- [ ] Supabase database schema deployed
- [ ] Database migrations tested
- [ ] Backup strategy implemented
- [ ] Connection pooling configured
- [ ] Database monitoring enabled

## 🔧 Environment Configuration

### Required Environment Variables

#### Authentication
```env
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=https://your-domain.com
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

#### Database
```env
DATABASE_URL=your-supabase-database-url
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

#### External Services
```env
OPENAI_API_KEY=your-openai-api-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
```

#### Optional Configuration
```env
NODE_ENV=production
VERCEL_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Vercel Environment Variables Setup

1. **Navigate to Vercel Dashboard**
   - Go to your project settings
   - Click on "Environment Variables"

2. **Add Production Variables**
   - Set environment to "Production"
   - Add all required variables
   - Ensure sensitive keys are properly secured

3. **Configure Preview Variables**
   - Set environment to "Preview"
   - Use test/staging values for external services
   - Maintain separate database for staging

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

The deployment pipeline includes:

1. **Testing Phase**
   - Type checking with TypeScript
   - ESLint code quality checks
   - Unit tests with Jest
   - Coverage reporting

2. **Security Phase**
   - Dependency vulnerability scanning
   - Security audit with npm audit
   - License compliance checking

3. **Build Phase**
   - Next.js application build
   - Static asset optimization
   - Bundle size analysis

4. **Deployment Phase**
   - Staging deployment for PRs
   - Production deployment for main branch
   - Health check validation
   - Rollback capability

### Required GitHub Secrets

```env
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-vercel-org-id
VERCEL_PROJECT_ID=your-vercel-project-id

# All environment variables from above
NEXTAUTH_SECRET=...
DATABASE_URL=...
# ... etc
```

## 🚀 Deployment Process

### 1. Initial Deployment

```bash
# 1. Clone repository
git clone https://github.com/your-username/ai-guided-saas.git
cd ai-guided-saas

# 2. Install Vercel CLI
npm install -g vercel

# 3. Login to Vercel
vercel login

# 4. Link project
vercel link

# 5. Set environment variables
vercel env add NEXTAUTH_SECRET production
vercel env add DATABASE_URL production
# ... add all required variables

# 6. Deploy to production
vercel --prod
```

### 2. Automated Deployment

Once GitHub Actions is configured:

1. **For Staging**: Create a pull request
2. **For Production**: Merge to main branch

The pipeline will automatically:
- Run tests and security checks
- Build the application
- Deploy to appropriate environment
- Run health checks
- Notify on success/failure

### 3. Manual Deployment

```bash
# Build and deploy manually
npm run build
vercel --prod --prebuilt
```

## 📊 Monitoring and Health Checks

### Health Check Endpoint

The application includes a comprehensive health check at `/api/health`:

```json
{
  "timestamp": "2024-01-01T00:00:00.000Z",
  "status": "healthy",
  "version": "1.0.0",
  "environment": "production",
  "checks": {
    "database": { "status": "healthy", "responseTime": 45 },
    "auth": { "status": "healthy" },
    "external_apis": {
      "status": "healthy",
      "openai": "configured",
      "stripe": "configured",
      "supabase": "configured"
    },
    "memory": {
      "status": "healthy",
      "percentage": 65
    },
    "uptime": 86400
  }
}
```

### Monitoring Setup

1. **Vercel Analytics**
   - Enable Vercel Analytics in dashboard
   - Monitor performance metrics
   - Track user engagement

2. **External Monitoring**
   - Set up uptime monitoring (e.g., UptimeRobot)
   - Configure alerting for downtime
   - Monitor API response times

3. **Error Tracking**
   - Implement error tracking (e.g., Sentry)
   - Monitor application errors
   - Set up error alerting

## 🔒 Security Considerations

### Production Security Checklist

- [ ] HTTPS enforced across all endpoints
- [ ] Security headers configured (CSP, HSTS, etc.)
- [ ] API rate limiting implemented
- [ ] Input validation and sanitization
- [ ] SQL injection protection
- [ ] XSS protection enabled
- [ ] CSRF protection configured
- [ ] Secure session management
- [ ] Environment variables secured
- [ ] Database access restricted

### Security Headers Configuration

The Vercel configuration includes:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
      ]
    }
  ]
}
```

## 🔄 Database Management

### Migration Strategy

1. **Development to Staging**
   ```bash
   # Export schema from development
   supabase db dump --schema-only > schema.sql
   
   # Apply to staging
   psql $STAGING_DATABASE_URL < schema.sql
   ```

2. **Staging to Production**
   ```bash
   # Create migration script
   supabase migration new production_update
   
   # Apply migration
   supabase db push
   ```

### Backup Strategy

1. **Automated Backups**
   - Supabase provides automated daily backups
   - Configure backup retention policy
   - Test backup restoration process

2. **Manual Backups**
   ```bash
   # Create manual backup
   pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
   
   # Restore from backup
   psql $DATABASE_URL < backup_20240101.sql
   ```

## 📈 Performance Optimization

### Build Optimization

1. **Bundle Analysis**
   ```bash
   npm run analyze
   ```

2. **Image Optimization**
   - Use Next.js Image component
   - Configure image domains in next.config.js
   - Implement lazy loading

3. **Code Splitting**
   - Implement dynamic imports
   - Use React.lazy for components
   - Optimize bundle sizes

### Runtime Optimization

1. **Caching Strategy**
   - Implement Redis caching for API responses
   - Use Vercel Edge Caching
   - Configure browser caching headers

2. **Database Optimization**
   - Implement connection pooling
   - Optimize database queries
   - Use database indexes effectively

## 🚨 Troubleshooting

### Common Deployment Issues

1. **Build Failures**
   ```bash
   # Check build logs
   vercel logs
   
   # Local build test
   npm run build
   ```

2. **Environment Variable Issues**
   ```bash
   # List environment variables
   vercel env ls
   
   # Pull environment variables
   vercel env pull .env.local
   ```

3. **Database Connection Issues**
   - Verify DATABASE_URL format
   - Check Supabase project status
   - Validate connection pooling settings

4. **Authentication Issues**
   - Verify NEXTAUTH_URL matches deployment URL
   - Check Google OAuth redirect URIs
   - Validate NEXTAUTH_SECRET configuration

### Health Check Debugging

```bash
# Test health endpoint
curl https://your-domain.com/api/health

# Check specific health components
curl https://your-domain.com/api/health | jq '.checks'
```

## 🔄 Rollback Procedures

### Automatic Rollback

Vercel provides automatic rollback capabilities:

1. **Via Dashboard**
   - Navigate to Vercel dashboard
   - Select previous deployment
   - Click "Promote to Production"

2. **Via CLI**
   ```bash
   # List deployments
   vercel ls
   
   # Promote previous deployment
   vercel promote <deployment-url>
   ```

### Manual Rollback

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard <commit-hash>
git push --force origin main
```

## 📋 Maintenance Procedures

### Regular Maintenance Tasks

1. **Weekly**
   - Review application logs
   - Check health check status
   - Monitor performance metrics
   - Review security alerts

2. **Monthly**
   - Update dependencies
   - Review and rotate API keys
   - Analyze usage patterns
   - Update documentation

3. **Quarterly**
   - Security audit
   - Performance optimization review
   - Backup restoration testing
   - Disaster recovery testing

### Dependency Updates

```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Update major versions carefully
npm install package@latest

# Test after updates
npm test
npm run build
```

## 📞 Support and Escalation

### Support Contacts

- **Technical Issues**: development team
- **Infrastructure Issues**: DevOps team
- **Security Issues**: security team
- **Business Issues**: product team

### Escalation Procedures

1. **Level 1**: Application errors, minor performance issues
2. **Level 2**: Service outages, security incidents
3. **Level 3**: Data loss, major security breaches

### Emergency Procedures

1. **Service Outage**
   - Check health endpoints
   - Review Vercel status page
   - Implement emergency rollback if needed
   - Communicate with stakeholders

2. **Security Incident**
   - Isolate affected systems
   - Rotate compromised credentials
   - Document incident details
   - Notify security team

---

*This deployment guide covers the complete production deployment process. For specific technical details, refer to the individual component documentation.*
