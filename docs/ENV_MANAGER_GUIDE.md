# Dynamic Environment Variable Manager Guide

## Overview

The Dynamic Environment Variable Manager is a comprehensive solution for managing environment variables across multiple services in the AI SaaS platform. It provides validation, tracking, and synchronization capabilities to prevent common configuration issues.

## Features

- **🔍 Automatic Detection**: Detects mismatches and missing variables
- **✅ Schema Validation**: Validates variables against JSON Schema
- **📜 Change History**: Tracks all environment variable changes
- **🎯 Service Organization**: Groups variables by service (Supabase, Redis, etc.)
- **🚀 CI/CD Integration**: Pre-deployment checks and GitHub Actions
- **💻 CLI Interface**: Full command-line control
- **📊 Visual Dashboard**: React component for status visualization

## Directory Structure

```
.docs/
├── env.config.json         # Master configuration
├── env.defaults.json       # Default values and setup instructions
├── env.validation.schema   # JSON Schema for validation
└── env.history.log        # Change history log
```

## CLI Commands

### Basic Commands

```bash
# Check environment status
npm run env:check

# Validate all variables
npm run env:validate

# Sync configuration with current environment
npm run env:sync

# View change history
npm run env:history

# Remove unused variables
npm run env:compact

# Interactive setup for missing variables
npm run env:setup

# Pre-deployment check
npm run env:pre-deploy
```

### Advanced Usage

```bash
# Validate specific environment
npm run env:validate -- --env production

# Show last 20 history entries
npm run env:history -- -n 20

# Export status as JSON
npx ts-node scripts/env-cli.ts export -o status.json
```

## Supported Services

### 1. **Supabase** (Database)
- `SUPABASE_URL`: Project URL
- `SUPABASE_ANON_KEY`: Public anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key (optional)

### 2. **Redis** (Cache)
- `REDIS_HOST`: Redis server hostname
- `REDIS_PORT`: Port number (default: 6379)
- `REDIS_PASSWORD`: Authentication password
- `REDIS_TLS`: Enable TLS (default: false)

### 3. **OpenAI** (AI)
- `OPENAI_API_KEY`: API key
- `OPENAI_ORGANIZATION`: Organization ID (optional)
- `OPENAI_MODEL`: Default model (default: gpt-4-turbo)

### 4. **Anthropic Claude** (AI)
- `CLAUDE_API_KEY`: API key
- `CLAUDE_MODEL`: Default model (default: claude-3-sonnet)

### 5. **Google Console** (Auth)
- `GOOGLE_CLIENT_ID`: OAuth 2.0 Client ID
- `GOOGLE_CLIENT_SECRET`: OAuth 2.0 Client Secret

### 6. **Vercel** (Deployment)
- `VERCEL_API_TOKEN`: API token
- `VERCEL_PROJECT_ID`: Project ID
- `VERCEL_TEAM_ID`: Team ID (optional)

### 7. **Stripe** (Payments)
- `STRIPE_SECRET_KEY`: Secret API key
- `STRIPE_PUBLISHABLE_KEY`: Publishable key
- `STRIPE_WEBHOOK_SECRET`: Webhook secret (optional)

### 8. **GitHub OAuth** (Auth)
- `GITHUB_CLIENT_ID`: OAuth App Client ID
- `GITHUB_CLIENT_SECRET`: OAuth App Client Secret

### 9. **NextAuth** (Auth)
- `NEXTAUTH_URL`: Canonical URL
- `NEXTAUTH_SECRET`: JWT encryption secret

### 10. **OpenRouter** (AI - Optional)
- `OPENROUTER_API_KEY`: API key for multi-model access

## Environment-Specific Overrides

The system supports different configurations per environment:

```json
{
  "environments": {
    "development": {
      "overrides": {
        "NEXTAUTH_URL": "http://localhost:3000",
        "STRIPE_SECRET_KEY": "sk_test_*"
      }
    },
    "production": {
      "overrides": {
        "STRIPE_SECRET_KEY": "sk_live_*",
        "REDIS_TLS": "true"
      }
    }
  }
}
```

## CI/CD Integration

### GitHub Actions Workflow

The system includes a GitHub Actions workflow (`.github/workflows/env-check.yml`) that:

1. Validates environment variables on every PR
2. Runs pre-deployment checks for main branch
3. Comments PR with status report
4. Uploads status artifacts

### Pre-deployment Checks

Critical services are validated before deployment:
- Supabase credentials
- Redis connection
- NextAuth configuration
- Stripe API keys

## API Integration

### REST API Endpoint

```typescript
// GET /api/env/status
// Returns current environment status

// POST /api/env/status
// Actions: validate, sync, compact
```

### React Dashboard Component

```tsx
import { EnvStatusDashboard } from '@/components/EnvStatusDashboard';

// Use in your admin panel
<EnvStatusDashboard />
```

## Best Practices

1. **Regular Validation**: Run `npm run env:check` before deployments
2. **Use env.local**: Keep sensitive variables in `.env.local` (gitignored)
3. **Document Changes**: The system auto-logs changes to `env.history.log`
4. **Clean Configuration**: Run `npm run env:compact` periodically
5. **Environment Parity**: Ensure staging matches production configuration

## Troubleshooting

### Common Issues

1. **Missing Required Variables**
   ```bash
   npm run env:setup  # Interactive setup
   ```

2. **Pattern Validation Failures**
   - Check the pattern in `env.config.json`
   - Ensure values match expected format

3. **Sync Not Detecting Variables**
   - Variables starting with `NODE_` or `npm_` are ignored
   - Check if variable is in `.env.local` or `.env`

### Debug Mode

```bash
# View detailed validation output
NODE_ENV=development npm run env:validate
```

## Security Considerations

1. **Sensitive Variables**: Marked with `"sensitive": true` in config
2. **Password Masking**: CLI masks sensitive values during input
3. **History Privacy**: Change logs don't store actual values
4. **Git Ignore**: Ensure `.env.local` is in `.gitignore`

## Extension Points

### Adding New Services

1. Update `.docs/env.config.json`:
```json
{
  "services": {
    "newservice": {
      "name": "New Service",
      "category": "category",
      "status": "active",
      "variables": {
        "NEWSERVICE_API_KEY": {
          "required": true,
          "type": "string",
          "pattern": "^[A-Za-z0-9]+$",
          "description": "API key for New Service",
          "sensitive": true
        }
      }
    }
  }
}
```

2. Update defaults in `.docs/env.defaults.json`
3. Run `npm run env:sync` to update configuration

### Custom Validation Rules

Add custom validation in `EnvManager.ts`:

```typescript
// Custom validation logic
if (varName === 'CUSTOM_VAR' && value) {
  // Custom validation
}
```

## Summary

The Dynamic Environment Variable Manager eliminates common DevOps frustrations by:
- Providing clear visibility into configuration status
- Automating validation and checks
- Tracking changes over time
- Integrating seamlessly with CI/CD pipelines
- Offering both CLI and UI interfaces

Use it to save hours of debugging and ensure reliable deployments!