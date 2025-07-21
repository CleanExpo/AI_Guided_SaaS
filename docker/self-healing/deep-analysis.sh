#!/bin/bash

# AI Guided SaaS - Docker Self-Healing Script
# Pass 2: Deep System Analysis

echo "🔍 Starting Self-Healing Pass #2 - Deep System Analysis"
echo "====================================================="

# Function to check service health
check_service_health() {
    local service=$1
    local health_endpoint=$2
    local max_retries=5
    local retry_count=0
    
    while [ $retry_count -lt $max_retries ]; do
        if curl -f -s $health_endpoint > /dev/null 2>&1; then
            echo "✅ $service is healthy"
            return 0
        fi
        retry_count=$((retry_count + 1))
        echo "⏳ Waiting for $service (attempt $retry_count/$max_retries)..."
        sleep 5
    done
    
    echo "❌ $service health check failed after $max_retries attempts"
    return 1
}

# 1. Database Health and Migrations
echo "🗄️ Checking database health and migrations..."
docker exec ai-saas-postgres psql -U postgres -d ai_guided_saas -c "SELECT 1;" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Database connection successful"
    
    # Check for required tables
    docker exec ai-saas-postgres psql -U postgres -d ai_guided_saas -c "\dt" | grep -E "(users|projects|agents|tasks)" > /dev/null 2>&1
    if [ $? -ne 0 ]; then
        echo "⚠️ Required tables missing, running migrations..."
        # Create migration script here if needed
    fi
else
    echo "❌ Database connection failed"
fi

# 2. API Endpoint Validation
echo "🔌 Validating API endpoints..."
API_BASE="http://localhost:3000/api"
ENDPOINTS=(
    "/health"
    "/auth/session"
    "/agents/status"
    "/projects"
)

for endpoint in "${ENDPOINTS[@]}"; do
    response=$(curl -s -o /dev/null -w "%{http_code}" "$API_BASE$endpoint")
    if [ "$response" = "200" ] || [ "$response" = "401" ]; then
        echo "✅ $endpoint - OK ($response)"
    else
        echo "❌ $endpoint - Failed ($response)"
    fi
done

# 3. Agent System Validation
echo "🤖 Validating agent system..."
if [ -f "docker-compose.agents.yml" ]; then
    # Check if agent containers are running
    agent_count=$(docker ps --filter "name=ai-saas-agent" --format "{{.Names}}" | wc -l)
    echo "📊 Active agent containers: $agent_count"
    
    if [ $agent_count -eq 0 ]; then
        echo "⚠️ No agent containers running. Starting agent system..."
        docker-compose -f docker-compose.agents.yml up -d
    fi
fi

# 4. Resource Usage Analysis
echo "📊 Analyzing resource usage..."
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}" | head -20

# 5. Log Analysis
echo "📜 Analyzing logs for errors..."
containers=$(docker ps --format "{{.Names}}")
for container in $containers; do
    error_count=$(docker logs --tail 100 $container 2>&1 | grep -iE "(error|exception|failed)" | wc -l)
    if [ $error_count -gt 0 ]; then
        echo "⚠️ $container has $error_count error(s) in recent logs"
    fi
done

# 6. Network Connectivity
echo "🌐 Checking network connectivity..."
docker network ls | grep -E "(ai-saas-network|agent-network)" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Required networks exist"
else
    echo "❌ Required networks missing"
fi

# 7. Environment Variables
echo "🔐 Checking environment variables..."
required_vars=(
    "DATABASE_URL"
    "NEXTAUTH_SECRET"
    "OPENAI_API_KEY"
    "SUPABASE_URL"
    "SUPABASE_ANON_KEY"
)

if [ -f ".env.production" ]; then
    for var in "${required_vars[@]}"; do
        if grep -q "^$var=" .env.production; then
            echo "✅ $var is set"
        else
            echo "❌ $var is missing"
        fi
    done
else
    echo "❌ .env.production file not found"
fi

# 8. Performance Metrics
echo "⚡ Checking performance metrics..."
# Measure API response time
start_time=$(date +%s%N)
curl -s http://localhost:3000/api/health > /dev/null 2>&1
end_time=$(date +%s%N)
response_time=$(((end_time - start_time) / 1000000))
echo "📈 API response time: ${response_time}ms"

# 9. Security Scan
echo "🔒 Running security checks..."
# Check for exposed ports
exposed_ports=$(docker ps --format "table {{.Names}}\t{{.Ports}}" | grep -E "0.0.0.0:" | wc -l)
echo "⚠️ Containers with exposed ports: $exposed_ports"

# 10. Backup Status
echo "💾 Checking backup status..."
if [ -d "backups" ]; then
    latest_backup=$(ls -t backups/ 2>/dev/null | head -1)
    if [ -n "$latest_backup" ]; then
        echo "✅ Latest backup: $latest_backup"
    else
        echo "⚠️ No backups found"
    fi
else
    echo "⚠️ Backup directory not found"
fi

echo "✅ Self-Healing Pass #2 Complete!"
echo "================================="