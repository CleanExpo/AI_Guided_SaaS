#!/bin/bash

# Database Migration Script for AI Guided SaaS
# Supports both Supabase and local PostgreSQL

echo "🗄️  AI Guided SaaS - Database Migration Runner"
echo "==========================================="

# Load environment variables
if [ -f ".env.production" ]; then
    export $(cat .env.production | grep -v '^#' | xargs)
elif [ -f ".env" ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "❌ No environment file found. Please create .env or .env.production"
    exit 1
fi

# Function to run migrations on Supabase
run_supabase_migrations() {
    echo "🌐 Running migrations on Supabase..."
    
    # Check if Supabase CLI is installed
    if ! command -v supabase &> /dev/null; then
        echo "📥 Installing Supabase CLI..."
        npm install -g supabase
    fi
    
    # Initialize Supabase if not already done
    if [ ! -f "supabase/config.toml" ]; then
        echo "🔧 Initializing Supabase..."
        supabase init
    fi
    
    # Link to remote project
    if [ ! -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
        PROJECT_ID=$(echo $NEXT_PUBLIC_SUPABASE_URL | sed 's/https:\/\/\([^.]*\).*/\1/')
        echo "🔗 Linking to Supabase project: $PROJECT_ID"
        supabase link --project-ref $PROJECT_ID
    fi
    
    # Run migrations
    echo "🚀 Applying migrations..."
    for migration in supabase/migrations/*.sql; do
        if [ -f "$migration" ]; then
            echo "  → Running: $(basename $migration)"
            supabase db push
        fi
    done
    
    echo "✅ Supabase migrations complete!"
}

# Function to run migrations on local PostgreSQL
run_local_migrations() {
    echo "💻 Running migrations on local PostgreSQL..."
    
    # Parse DATABASE_URL
    if [ -z "$DATABASE_URL" ]; then
        echo "❌ DATABASE_URL not set"
        exit 1
    fi
    
    # Extract connection details
    DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
    DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
    DB_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')
    DB_USER=$(echo $DATABASE_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
    DB_PASS=$(echo $DATABASE_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')
    
    # Use docker if database is in container
    if [ "$DB_HOST" == "postgres" ] || [ "$DB_HOST" == "localhost" ]; then
        # Check if we're in Docker environment
        if [ -f /.dockerenv ]; then
            DB_HOST="postgres"
        else
            # Try to use docker exec
            if docker ps | grep -q ai-saas-postgres; then
                echo "🐳 Using Docker container for migrations..."
                
                for migration in supabase/migrations/*.sql; do
                    if [ -f "$migration" ]; then
                        echo "  → Running: $(basename $migration)"
                        docker exec -i ai-saas-postgres psql -U postgres -d "$DB_NAME" < "$migration"
                    fi
                done
                
                echo "✅ Local migrations complete!"
                return 0
            fi
        fi
    fi
    
    # Direct PostgreSQL connection
    export PGPASSWORD=$DB_PASS
    
    for migration in supabase/migrations/*.sql; do
        if [ -f "$migration" ]; then
            echo "  → Running: $(basename $migration)"
            psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$migration"
        fi
    done
    
    echo "✅ Local migrations complete!"
}

# Function to create migration tracking table
create_migration_tracking() {
    echo "📊 Creating migration tracking..."
    
    cat > supabase/migrations/000_migration_tracking.sql << 'EOF'
-- Migration tracking table
CREATE TABLE IF NOT EXISTS public.schema_migrations (
    version TEXT PRIMARY KEY,
    applied_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert initial migration record
INSERT INTO public.schema_migrations (version) 
VALUES ('001_initial_schema') 
ON CONFLICT (version) DO NOTHING;
EOF
}

# Function to seed initial data
seed_database() {
    echo "🌱 Seeding initial data..."
    
    cat > supabase/migrations/999_seed_data.sql << 'EOF'
-- Seed initial admin user (update email and id as needed)
INSERT INTO public.users (id, email, name, role, subscription_tier)
VALUES (
    gen_random_uuid(),
    'admin@your-domain.com',
    'Admin User',
    'admin',
    'enterprise'
) ON CONFLICT (email) DO NOTHING;

-- Seed system health check data
INSERT INTO public.system_health_logs (service_name, health_status, cpu_usage, memory_usage)
VALUES 
    ('api', 'healthy', 10.5, 25.3),
    ('agent-orchestrator', 'healthy', 15.2, 30.1),
    ('database', 'healthy', 5.8, 45.2);
EOF
}

# Main execution
echo ""
echo "Select migration target:"
echo "1) Supabase (remote)"
echo "2) Local PostgreSQL"
echo "3) Both"
echo ""
read -p "Enter option (1-3): " option

# Create migration tracking if it doesn't exist
if [ ! -f "supabase/migrations/000_migration_tracking.sql" ]; then
    create_migration_tracking
fi

# Check if we should seed data
read -p "Include seed data? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    seed_database
fi

case $option in
    1)
        run_supabase_migrations
        ;;
    2)
        run_local_migrations
        ;;
    3)
        run_local_migrations
        echo ""
        run_supabase_migrations
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "🎉 Database migration complete!"
echo ""
echo "📋 Next steps:"
echo "1. Verify tables were created correctly"
echo "2. Test database connections from the application"
echo "3. Run the application and check health endpoints"