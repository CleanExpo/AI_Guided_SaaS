#!/bin/bash

# Database Migration Runner
# This script runs all pending database migrations

set -e

echo "🚀 AI Guided SaaS - Database Migration Runner"
echo "============================================"

# Load environment variables
if [ -f .env.local ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
fi

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g supabase
fi

# Function to run migrations
run_migrations() {
    local env=$1
    local db_url=$2
    
    echo ""
    echo "📦 Running migrations for: $env"
    echo "================================"
    
    if [ -z "$db_url" ]; then
        echo "❌ Database URL not found for $env"
        return 1
    fi
    
    # Run migrations
    echo "🔄 Applying migrations..."
    supabase db push --db-url "$db_url"
    
    # Verify migrations
    echo "✅ Verifying migrations..."
    psql "$db_url" -c "SELECT version, name, executed_at FROM supabase_migrations.schema_migrations ORDER BY version DESC LIMIT 5;"
    
    echo "✅ Migrations completed for $env"
}

# Main execution
case "${1:-local}" in
    "local")
        echo "🏠 Running LOCAL migrations"
        supabase start
        supabase db push
        ;;
    
    "staging")
        echo "🔧 Running STAGING migrations"
        run_migrations "staging" "$STAGING_DATABASE_URL"
        ;;
    
    "production")
        echo "🚀 Running PRODUCTION migrations"
        
        # Safety check
        echo ""
        echo "⚠️  WARNING: You are about to run migrations on PRODUCTION!"
        echo "This action cannot be undone without a backup."
        read -p "Are you sure? (type 'yes' to continue): " confirm
        
        if [ "$confirm" != "yes" ]; then
            echo "❌ Migration cancelled"
            exit 1
        fi
        
        # Create backup first
        echo "📸 Creating database backup..."
        timestamp=$(date +%Y%m%d_%H%M%S)
        pg_dump "$DATABASE_URL" > "backups/prod_backup_$timestamp.sql"
        echo "✅ Backup created: backups/prod_backup_$timestamp.sql"
        
        # Run migrations
        run_migrations "production" "$DATABASE_URL"
        ;;
    
    "rollback")
        echo "⏪ Rolling back last migration"
        
        if [ -z "$2" ]; then
            echo "❌ Please specify migration version to rollback to"
            echo "Usage: $0 rollback <version>"
            exit 1
        fi
        
        # Implement rollback logic
        echo "🔄 Rolling back to version: $2"
        # Add rollback implementation
        ;;
    
    *)
        echo "Usage: $0 [local|staging|production|rollback]"
        exit 1
        ;;
esac

echo ""
echo "✅ Migration process completed!"
echo ""

# Show current schema status
echo "📊 Current Schema Status:"
echo "========================"
if [ "${1:-local}" == "local" ]; then
    supabase db dump --schema-only | grep -E "CREATE TABLE|CREATE INDEX" | head -20
else
    psql "${!db_url}" -c "\dt public.*" 2>/dev/null || echo "Could not fetch schema info"
fi