#!/bin/bash

# Production Environment Setup Script
# This script helps configure production environment variables

echo "🔧 AI Guided SaaS - Production Environment Setup"
echo "=============================================="

# Function to generate secure secrets
generate_secret() {
    openssl rand -base64 32 2>/dev/null || cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1
}

# Function to generate bcrypt hash
generate_password_hash() {
    local password=$1
    echo -n "$password" | htpasswd -bnBC 10 "" password | grep -v password | tr -d ':\n'
}

# Check if .env.production exists
if [ -f ".env.production" ]; then
    echo "⚠️  .env.production already exists!"
    read -p "Do you want to backup and create a new one? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cp .env.production .env.production.backup.$(date +%Y%m%d_%H%M%S)
        echo "✅ Backup created"
    else
        echo "❌ Aborting..."
        exit 1
    fi
fi

# Create .env.production from template
if [ -f ".env.production.template" ]; then
    cp .env.production.template .env.production
else
    cp .env.example .env.production
fi

echo ""
echo "📝 Configuring production environment variables..."
echo ""

# 1. Application URL
read -p "Enter your production domain (e.g., app.yourdomain.com): " domain
if [ ! -z "$domain" ]; then
    sed -i "s|https://your-domain.com|https://$domain|g" .env.production
    echo "✅ Domain configured: https://$domain"
fi

# 2. Generate secure secrets
echo ""
echo "🔐 Generating secure secrets..."

# NEXTAUTH_SECRET
nextauth_secret=$(generate_secret)
sed -i "s|NEXTAUTH_SECRET=.*|NEXTAUTH_SECRET=$nextauth_secret|" .env.production
echo "✅ NEXTAUTH_SECRET generated"

# Database password
read -p "Enter PostgreSQL password (leave empty to generate): " db_password
if [ -z "$db_password" ]; then
    db_password=$(generate_secret | cut -c1-24)
fi
sed -i "s|POSTGRES_PASSWORD=.*|POSTGRES_PASSWORD=$db_password|" .env.production
sed -i "s|SECURE_PASSWORD|$db_password|g" .env.production
echo "✅ Database password configured"

# Admin password
read -p "Enter admin password (leave empty to generate): " admin_password
if [ -z "$admin_password" ]; then
    admin_password=$(generate_secret | cut -c1-16)
    echo "📌 Generated admin password: $admin_password"
fi
admin_hash=$(generate_password_hash "$admin_password")
sed -i "s|ADMIN_PASSWORD_HASH=.*|ADMIN_PASSWORD_HASH=$admin_hash|" .env.production
echo "✅ Admin password hash generated"

# Admin secrets
admin_secret=$(generate_secret)
admin_session=$(generate_secret)
admin_jwt=$(generate_secret)
sed -i "s|ADMIN_SECRET_KEY=.*|ADMIN_SECRET_KEY=$admin_secret|" .env.production
sed -i "s|ADMIN_SESSION_SECRET=.*|ADMIN_SESSION_SECRET=$admin_session|" .env.production
sed -i "s|ADMIN_JWT_SECRET=.*|ADMIN_JWT_SECRET=$admin_jwt|" .env.production
echo "✅ Admin secrets generated"

# Grafana password
grafana_password=$(generate_secret | cut -c1-16)
sed -i "s|GRAFANA_PASSWORD=.*|GRAFANA_PASSWORD=$grafana_password|" .env.production
echo "✅ Grafana password configured"

# 3. Configure AI services
echo ""
echo "🤖 Configuring AI services..."
read -p "Enter your OpenAI API key (required): " openai_key
if [ ! -z "$openai_key" ]; then
    sed -i "s|OPENAI_API_KEY=.*|OPENAI_API_KEY=$openai_key|" .env.production
    echo "✅ OpenAI API key configured"
fi

read -p "Enter your Anthropic API key (optional): " anthropic_key
if [ ! -z "$anthropic_key" ]; then
    sed -i "s|ANTHROPIC_API_KEY=.*|ANTHROPIC_API_KEY=$anthropic_key|" .env.production
    echo "✅ Anthropic API key configured"
fi

# 4. Configure optional services
echo ""
echo "📧 Configuring optional services..."

read -p "Enter your Resend API key for emails (optional): " resend_key
if [ ! -z "$resend_key" ]; then
    sed -i "s|RESEND_API_KEY=.*|RESEND_API_KEY=$resend_key|" .env.production
    echo "✅ Resend API key configured"
fi

read -p "Enter your Sentry DSN for error tracking (optional): " sentry_dsn
if [ ! -z "$sentry_dsn" ]; then
    sed -i "s|NEXT_PUBLIC_SENTRY_DSN=.*|NEXT_PUBLIC_SENTRY_DSN=$sentry_dsn|" .env.production
    echo "✅ Sentry DSN configured"
fi

# 5. Create additional required files
echo ""
echo "📁 Creating additional configuration files..."

# Create docker override for production
cat > docker-compose.override.yml << EOF
version: '3.8'

services:
  app:
    env_file:
      - .env.production
    environment:
      - NODE_ENV=production
EOF

# Create nginx SSL directory
mkdir -p nginx/ssl

# Summary
echo ""
echo "✅ Production environment configuration complete!"
echo "=============================================="
echo ""
echo "📋 Next steps:"
echo "1. Review .env.production and fill in any remaining values"
echo "2. Set up SSL certificates in nginx/ssl/"
echo "3. Configure your domain DNS to point to your server"
echo "4. Run database migrations"
echo "5. Deploy with: docker-compose up -d"
echo ""
echo "🔐 Important credentials saved:"
echo "- Admin password: ${admin_password:-Check .env.production}"
echo "- Grafana password: $grafana_password"
echo "- Database password: ${db_password:0:8}..."
echo ""
echo "⚠️  Keep these credentials secure!"