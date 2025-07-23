#!/bin/bash

# Start Semantic Search Services
# This script launches the Docker containers for semantic search

set -e

echo "🚀 Starting Semantic Search Services..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Navigate to project root
cd "$(dirname "$0")/.."

# Stop any existing containers
echo "📦 Stopping existing containers..."
docker-compose -f docker-compose.semantic.yml down

# Build and start the services
echo "🏗️ Building and starting semantic search services..."
docker-compose -f docker-compose.semantic.yml up -d --build

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check health status
echo "🔍 Checking service health..."

# Check Elasticsearch
if curl -s http://localhost:9200/_cluster/health | grep -q '"status":"green\|yellow"'; then
    echo "✅ Elasticsearch is healthy"
else
    echo "❌ Elasticsearch is not healthy"
fi

# Check Embeddings service
if curl -s http://localhost:8000/health | grep -q '"status":"healthy"'; then
    echo "✅ Embeddings service is healthy"
else
    echo "❌ Embeddings service is not healthy"
fi

# Check Semantic API
if curl -s http://localhost:8080/health | grep -q '"status":"healthy"'; then
    echo "✅ Semantic API is healthy"
else
    echo "❌ Semantic API is not healthy"
fi

echo ""
echo "📊 Semantic Search Services Status:"
docker-compose -f docker-compose.semantic.yml ps

echo ""
echo "🎯 Services are available at:"
echo "  - Embeddings Service: http://localhost:8000"
echo "  - Elasticsearch: http://localhost:9200"
echo "  - Semantic API: http://localhost:8080"
echo "  - Serena MCP Server: http://localhost:9121"

echo ""
echo "📝 To view logs:"
echo "  docker-compose -f docker-compose.semantic.yml logs -f"

echo ""
echo "🛑 To stop services:"
echo "  docker-compose -f docker-compose.semantic.yml down"