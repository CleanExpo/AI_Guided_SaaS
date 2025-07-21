#!/bin/bash

# AI Guided SaaS - Production Deployment Script
# Complete deployment automation with all checks

set -e  # Exit on any error

echo "🚀 AI Guided SaaS - Production Deployment"
echo "========================================"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    case $status in
        "success") echo -e "${GREEN}✅ $message${NC}" ;;
        "error") echo -e "${RED}❌ $message${NC}" ;;
        "warning") echo -e "${YELLOW}⚠️  $message${NC}" ;;
        *) echo "$message" ;;
    esac
}

# Pre-deployment checks
echo ""
echo "1️⃣ Running pre-deployment checks..."
echo "------------------------------------"

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    print_status "error" "Missing .env.production file"
    echo "Run: ./scripts/setup-production-env.sh"
    exit 1
else
    print_status "success" "Environment configuration found"
fi

# Check if SSL certificates exist
if [ ! -f "nginx/ssl/fullchain.pem" ] || [ ! -f "nginx/ssl/privkey.pem" ]; then
    print_status "warning" "SSL certificates not found"
    echo "Run: ./scripts/setup-ssl.sh"
else
    print_status "success" "SSL certificates found"
fi

# Run tests
echo ""
echo "2️⃣ Running tests..."
echo "-------------------"

npm run typecheck
if [ $? -eq 0 ]; then
    print_status "success" "TypeScript check passed"
else
    print_status "error" "TypeScript check failed"
    exit 1
fi

npm run lint
if [ $? -eq 0 ]; then
    print_status "success" "Linting passed"
else
    print_status "error" "Linting failed"
    exit 1
fi

# Build application
echo ""
echo "3️⃣ Building application..."
echo "--------------------------"

npm run build
if [ $? -eq 0 ]; then
    print_status "success" "Build completed successfully"
else
    print_status "error" "Build failed"
    exit 1
fi

# Build Docker images
echo ""
echo "4️⃣ Building Docker images..."
echo "-----------------------------"

docker build -t ai-saas-app:latest -f Dockerfile --target production .
if [ $? -eq 0 ]; then
    print_status "success" "App image built"
else
    print_status "error" "App image build failed"
    exit 1
fi

docker build -t ai-saas-agent:latest -f docker/agents/Dockerfile.agent .
if [ $? -eq 0 ]; then
    print_status "success" "Agent image built"
else
    print_status "error" "Agent image build failed"
    exit 1
fi

# Stop existing containers
echo ""
echo "5️⃣ Stopping existing services..."
echo "--------------------------------"

docker-compose down || true
docker-compose -f docker-compose.agents.yml down || true
docker-compose -f docker-compose.monitoring.yml down || true

# Start infrastructure services
echo ""
echo "6️⃣ Starting infrastructure services..."
echo "--------------------------------------"

# Start database and cache first
docker-compose -f docker/orchestration/docker-compose.production.yml up -d postgres redis

# Wait for database
echo "Waiting for database..."
sleep 10

# Run migrations
echo ""
echo "7️⃣ Running database migrations..."
echo "----------------------------------"

./scripts/run-migrations.sh
if [ $? -eq 0 ]; then
    print_status "success" "Database migrations completed"
else
    print_status "error" "Database migrations failed"
    exit 1
fi

# Start all services
echo ""
echo "8️⃣ Starting all services..."
echo "----------------------------"

docker-compose -f docker/orchestration/docker-compose.production.yml up -d

# Start monitoring
echo ""
echo "9️⃣ Starting monitoring stack..."
echo "--------------------------------"

docker-compose -f docker-compose.monitoring.yml up -d

# Start agents
echo ""
echo "🔟 Starting agent orchestration..."
echo "----------------------------------"

docker-compose -f docker-compose.agents.yml up -d

# Wait for services to be healthy
echo ""
echo "⏳ Waiting for services to be healthy..."
sleep 30

# Health checks
echo ""
echo "🏥 Running health checks..."
echo "---------------------------"

# Check main app
if curl -f -s http://localhost:3000/api/health > /dev/null; then
    print_status "success" "Main application is healthy"
else
    print_status "error" "Main application health check failed"
fi

# Check nginx
if curl -f -s http://localhost/nginx-health > /dev/null; then
    print_status "success" "Nginx is healthy"
else
    print_status "warning" "Nginx health check failed"
fi

# Check database
if docker exec ai-saas-postgres pg_isready -U postgres > /dev/null; then
    print_status "success" "PostgreSQL is healthy"
else
    print_status "error" "PostgreSQL health check failed"
fi

# Check Redis
if docker exec ai-saas-redis redis-cli ping > /dev/null; then
    print_status "success" "Redis is healthy"
else
    print_status "error" "Redis health check failed"
fi

# Check monitoring
if curl -f -s http://localhost:9090/-/healthy > /dev/null; then
    print_status "success" "Prometheus is healthy"
else
    print_status "warning" "Prometheus health check failed"
fi

# Show running containers
echo ""
echo "📊 Running containers:"
echo "---------------------"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Final summary
echo ""
echo "✅ Deployment Complete!"
echo "======================"
echo ""
echo "🌐 Access your application:"
echo "   - Main App: https://your-domain.com"
echo "   - API Health: https://your-domain.com/api/health"
echo ""
echo "📊 Monitoring:"
echo "   - Prometheus: http://localhost:9090"
echo "   - Grafana: http://localhost:3001"
echo "   - Alertmanager: http://localhost:9093"
echo ""
echo "📝 Next steps:"
echo "   1. Update DNS to point to this server"
echo "   2. Test all critical user flows"
echo "   3. Monitor logs: docker-compose logs -f"
echo "   4. Set up backups: ./scripts/setup-backups.sh"
echo ""
echo "🆘 If something goes wrong:"
echo "   - Check logs: docker-compose logs [service-name]"
echo "   - Rollback: ./scripts/rollback.sh"
echo "   - Support: Check TROUBLESHOOTING.md"
echo ""
echo "🎉 Congratulations on your deployment!"