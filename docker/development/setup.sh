#!/bin/bash

# Docker Development Environment Setup Script

set -e

echo "🚀 Setting up AI-Guided SaaS Docker Development Environment"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create necessary directories
echo "📁 Creating directory structure..."
mkdir -p docker/development/{agents,mcp,tools}

# Copy environment file if it doesn't exist
if [ ! -f "../../.env.local" ]; then
    echo "📄 Creating .env.local from .env.example..."
    if [ -f "../../.env.example" ]; then
        cp ../../.env.example ../../.env.local
    else
        echo "⚠️  No .env.example found. Please create .env.local manually."
    fi
fi

# Build images
echo "🔨 Building Docker images..."
docker-compose build

# Start services
echo "🎯 Starting services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service health
echo "🏥 Checking service health..."
docker-compose ps

# Run database migrations
echo "🗄️  Running database migrations..."
docker-compose exec -T postgres psql -U postgres -d ai_guided_saas < ../../supabase-setup.sql
docker-compose exec -T postgres psql -U postgres -d ai_guided_saas < ../../supabase-analytics-tables.sql

# Create additional databases
echo "📊 Creating additional databases..."
docker-compose exec -T postgres psql -U postgres -c "CREATE DATABASE strapi;"
docker-compose exec -T postgres psql -U postgres -c "CREATE DATABASE nocodb;"
docker-compose exec -T postgres psql -U postgres -c "CREATE DATABASE n8n;"

echo "✅ Development environment setup complete!"
echo ""
echo "🌐 Services available at:"
echo "   - Main App: http://localhost:3000"
echo "   - Strapi CMS: http://localhost:1337"
echo "   - NocoDB: http://localhost:8080"
echo "   - n8n: http://localhost:5678"
echo "   - Adminer: http://localhost:8081"
echo "   - MCP Server: http://localhost:3001"
echo ""
echo "📝 Default credentials:"
echo "   - Postgres: postgres/postgres"
echo "   - n8n: admin/admin"
echo "   - Redis: password is 'redis_password'"
echo ""
echo "🛠️  Useful commands:"
echo "   - View logs: docker-compose logs -f [service]"
echo "   - Enter container: docker-compose exec [service] sh"
echo "   - Stop all: docker-compose down"
echo "   - Clean up: docker-compose down -v"