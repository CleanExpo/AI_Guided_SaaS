# Database Migration Strategy

## Overview

This document outlines the database migration strategy for the AI Guided SaaS platform, using Supabase as our PostgreSQL database provider.

## Migration Tools

### 1. Supabase CLI
We use Supabase CLI for managing database migrations in development and production.

```bash
# Install Supabase CLI
npm install -g supabase

# Initialize Supabase project
supabase init

# Create new migration
supabase migration new <migration_name>

# Run migrations locally
supabase db push

# Run migrations on remote
supabase db push --db-url <DATABASE_URL>
```

### 2. Prisma (Schema Management)
Prisma is used for type-safe database access and schema visualization.

```bash
# Generate Prisma client
npx prisma generate

# Sync Prisma schema with database
npx prisma db pull

# Format schema file
npx prisma format
```

## Migration Structure

```
supabase/
├── migrations/
│   ├── 001_initial_schema.sql          # Core tables
│   ├── 002_auth_extensions.sql         # Auth enhancements
│   ├── 003_analytics_tables.sql        # Analytics tracking
│   ├── 004_collaboration.sql           # Collaboration features
│   ├── 005_marketplace.sql             # Template marketplace
│   ├── 006_documentation_system.sql    # Documentation
│   ├── 007_agent_system.sql            # Agent orchestration
│   └── 008_monitoring.sql              # System monitoring
├── seed.sql                            # Seed data
└── functions/                          # Database functions
    ├── analytics.sql
    └── cleanup.sql
```

## Migration Workflow

### Development

1. **Create Migration**
   ```bash
   supabase migration new feature_name
   ```

2. **Write Migration**
   - Use idempotent SQL (CREATE IF NOT EXISTS)
   - Include rollback comments
   - Add proper indexes

3. **Test Locally**
   ```bash
   supabase start
   supabase db push
   ```

4. **Verify Schema**
   ```bash
   npx prisma db pull
   npx prisma generate
   ```

### Staging/Production

1. **Review Migration**
   - Check for breaking changes
   - Verify RLS policies
   - Test performance impact

2. **Deploy to Staging**
   ```bash
   supabase db push --db-url $STAGING_DATABASE_URL
   ```

3. **Run Tests**
   - Integration tests
   - Performance tests
   - Security tests

4. **Deploy to Production**
   ```bash
   supabase db push --db-url $PRODUCTION_DATABASE_URL
   ```

## Best Practices

### 1. Migration Naming
- Use sequential numbers: `001_`, `002_`, etc.
- Descriptive names: `001_initial_schema.sql`
- Date prefix for hotfixes: `20250726_hotfix_user_index.sql`

### 2. SQL Guidelines
```sql
-- Always use IF NOT EXISTS
CREATE TABLE IF NOT EXISTS public.table_name (...);

-- Include migration metadata
-- Migration: 007_agent_system
-- Description: Adds agent orchestration tables
-- Author: AI Guided SaaS Team
-- Date: 2025-07-26

-- Use transactions for complex migrations
BEGIN;
  -- Multiple operations
COMMIT;

-- Add rollback instructions
-- Rollback: DROP TABLE public.table_name CASCADE;
```

### 3. Index Strategy
```sql
-- Create indexes for foreign keys
CREATE INDEX idx_table_foreign_key ON table(foreign_key_id);

-- Create composite indexes for common queries
CREATE INDEX idx_table_user_status ON table(user_id, status);

-- Use partial indexes when appropriate
CREATE INDEX idx_active_projects ON projects(user_id) 
WHERE status = 'active';
```

### 4. RLS Policies
```sql
-- Enable RLS on all tables
ALTER TABLE public.table_name ENABLE ROW LEVEL SECURITY;

-- Create granular policies
CREATE POLICY "Users can view own data" ON public.table_name
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all" ON public.table_name
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'master')
    )
  );
```

## Migration Checklist

- [ ] Migration is idempotent (can run multiple times)
- [ ] Includes proper indexes
- [ ] Has RLS policies
- [ ] Includes rollback instructions
- [ ] Tested locally
- [ ] Performance impact assessed
- [ ] Breaking changes documented
- [ ] Prisma schema updated
- [ ] TypeScript types regenerated

## Rollback Strategy

### 1. Immediate Rollback
```sql
-- In migration file comments
-- Rollback: 
-- DROP TABLE public.new_table CASCADE;
-- ALTER TABLE public.existing_table DROP COLUMN new_column;
```

### 2. Data-Safe Rollback
```sql
-- Rename instead of drop
ALTER TABLE public.table_name RENAME TO table_name_backup;

-- Add deprecated flag
ALTER TABLE public.table_name ADD COLUMN deprecated BOOLEAN DEFAULT true;
```

### 3. Emergency Procedures
```bash
# Restore from backup
supabase db restore --backup-id <backup_id>

# Connect directly
psql $DATABASE_URL -f rollback/emergency_rollback.sql
```

## Monitoring

### 1. Migration Status
```sql
-- Check migration history
SELECT * FROM supabase_migrations.schema_migrations
ORDER BY version DESC;

-- Monitor table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### 2. Performance Monitoring
```sql
-- Check slow queries
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  max_time
FROM pg_stat_user_functions
ORDER BY mean_time DESC
LIMIT 10;
```

## Security Considerations

1. **Never commit sensitive data**
   - Use environment variables
   - Exclude seed files with real data

2. **Audit all migrations**
   - Review SQL injection risks
   - Verify RLS policies
   - Check permission grants

3. **Test RLS thoroughly**
   ```sql
   -- Test as different users
   SET LOCAL role authenticated;
   SET LOCAL request.jwt.claim.sub = 'user-uuid';
   SELECT * FROM sensitive_table; -- Should only show user's data
   ```

## Automation

### GitHub Actions Workflow
```yaml
name: Database Migrations
on:
  push:
    paths:
      - 'supabase/migrations/**'
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Test migrations
        run: |
          supabase start
          supabase db push
          npm run test:integration
```

## Troubleshooting

### Common Issues

1. **Migration Conflicts**
   ```bash
   # Reset local database
   supabase db reset
   
   # Force specific migration
   supabase db push --include-all
   ```

2. **Schema Drift**
   ```bash
   # Compare schemas
   supabase db diff
   
   # Generate migration from diff
   supabase db diff --file fix_schema_drift.sql
   ```

3. **Performance Issues**
   ```sql
   -- Analyze query plans
   EXPLAIN ANALYZE SELECT ...;
   
   -- Update statistics
   ANALYZE table_name;
   ```

## Resources

- [Supabase CLI Docs](https://supabase.com/docs/reference/cli)
- [PostgreSQL Best Practices](https://wiki.postgresql.org/wiki/Don't_Do_This)
- [RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Migration Examples](./migrations/)