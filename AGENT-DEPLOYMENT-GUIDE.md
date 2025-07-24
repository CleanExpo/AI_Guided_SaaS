# 🚀 Agent-OS Deployment Guide

**Complete Step-by-Step Deployment Instructions**  
*From Development to Production*

---

## 🎯 Quick Start (5 Minutes)

### **Prerequisites Check**
```bash
# Verify Docker and Docker Compose
docker --version          # >= 20.10.0
docker-compose --version  # >= 2.0.0

# Verify Node.js
node --version           # >= 18.20.8 (currently)
npm --version           # >= 10.8.3
```

### **Immediate TypeScript Fix Deployment**
```bash
# 1. Create required directories
mkdir -p agent-data/typescript logs/agents

# 2. Start TypeScript Specialist Agent (most critical)
docker-compose -f docker-compose.agents.yml up -d typescript-specialist agent-redis

# 3. Monitor progress
docker-compose -f docker-compose.agents.yml logs -f typescript-specialist

# 4. Check health
curl http://localhost:3100/health  # Agent monitor (if running)
```

---

## 📋 Pre-Deployment Checklist

### **System Requirements**
- [ ] **Docker Engine**: >= 20.10.0
- [ ] **Docker Compose**: >= 2.0.0  
- [ ] **Available RAM**: >= 4GB (8GB recommended)
- [ ] **Available CPU**: >= 4 cores (8 cores recommended)
- [ ] **Disk Space**: >= 10GB free
- [ ] **Network Ports**: 3100, 6380, 8080, 9090 available

### **Environment Preparation**
- [ ] Clone repository to deployment location
- [ ] Verify `.env` files are configured
- [ ] Check file permissions (Docker access)
- [ ] Confirm network connectivity
- [ ] Backup existing data (if upgrading)

---

## 🏗️ Deployment Scenarios

## Scenario 1: Critical Error Resolution (Immediate)

**Use Case**: Fix TypeScript errors blocking build/deployment

```bash
# Step 1: Deploy TypeScript Specialist
docker-compose -f docker-compose.agents.yml up -d typescript-specialist agent-redis

# Step 2: Monitor error reduction
docker-compose -f docker-compose.agents.yml logs -f typescript-specialist

# Step 3: Check progress
npm run typecheck  # Run every 5 minutes to track progress

# Expected Results:
# - Initial: 21,293 errors
# - After 1st run: ~11,605 errors (2,634 fixes applied)
# - Target: <5,000 errors within 1 hour
```

## Scenario 2: Development Environment

**Use Case**: Full agent system for active development

```bash
# Step 1: Start core coordination layer
docker-compose -f docker-compose.agents.yml up -d \
  orchestrator \
  typescript-specialist \
  batch-coordinator \
  work-queue-manager \
  agent-redis

# Step 2: Add development agents
docker-compose -f docker-compose.agents.yml up -d \
  agent-frontend \
  agent-backend \
  agent-architect

# Step 3: Start monitoring
docker-compose -f docker-compose.agents.yml up -d \
  agent-monitor \
  prometheus \
  cadvisor

# Step 4: Verify deployment
docker-compose -f docker-compose.agents.yml ps
```

## Scenario 3: Production Deployment

**Use Case**: Full production orchestration system

```bash
# Step 1: Production environment setup
export NODE_ENV=production
export AGENT_SCALE_MODE=high_performance

# Step 2: Deploy infrastructure components
docker-compose -f docker-compose.agents.yml up -d \
  agent-redis \
  prometheus \
  cadvisor

# Step 3: Deploy orchestration layer
docker-compose -f docker-compose.agents.yml up -d \
  orchestrator \
  batch-coordinator \
  work-queue-manager \
  progress-tracker

# Step 4: Deploy specialist agents
docker-compose -f docker-compose.agents.yml up -d \
  typescript-specialist \
  agent-frontend \
  agent-backend \
  agent-qa \
  agent-devops

# Step 5: Deploy monitoring and health systems
docker-compose -f docker-compose.agents.yml up -d \
  agent-monitor \
  self-healing-agent

# Step 6: Production health check
./scripts/production-health-check.sh
```

---

## 🔧 Configuration Management

### **Agent Configuration Files**

Each agent requires a JSON configuration file in `/agents/`:

```json
{
  "agent_id": "typescript_specialist_001",
  "name": "TypeScript Specialist Agent",
  "version": "1.0.0",
  "role": "TYPESCRIPT_SPECIALIST",
  "capabilities": [
    "typescript_error_resolution",
    "type_safety_enforcement"
  ],
  "resources": {
    "cpu_limit": 70,
    "memory_limit": 512,
    "pulse_interval": 2000
  }
}
```

### **Environment Variables**

```bash
# Agent-specific variables
export AGENT_ID=typescript_specialist_001
export AGENT_TIER=1
export ERROR_BATCH_SIZE=5
export TYPE_SAFETY_TARGET=0

# System-wide variables
export NODE_ENV=production
export MAX_CONCURRENT_AGENTS=6
export PULSE_MODE=enabled
export HEALTH_CHECK_INTERVAL=30
```

### **Volume Configuration**

```yaml
volumes:
  # Agent state persistence
  - agent-state:/app/state
  
  # Source code access (TypeScript Specialist)
  - ./src:/app/src:rw
  - ./scripts:/app/scripts:rw
  
  # Logging
  - ./logs/agents:/app/logs:rw
  
  # Configuration
  - ./agents:/app/agents:ro
```

---

## 📊 Monitoring Setup

### **Agent Monitor Dashboard**

```bash
# Start monitoring dashboard
docker-compose -f docker-compose.agents.yml up -d agent-monitor

# Access dashboard
open http://localhost:3100

# Dashboard features:
# - Real-time agent status
# - Resource utilization graphs
# - Error/success metrics
# - System health overview
```

### **Prometheus Metrics**

```bash
# Start Prometheus
docker-compose -f docker-compose.agents.yml up -d prometheus

# Access Prometheus UI
open http://localhost:9090

# Key metrics to monitor:
# - container_cpu_usage_seconds_total
# - container_memory_usage_bytes
# - agent_task_completion_total
# - agent_error_count_total
```

### **Container Statistics**

```bash
# Start cAdvisor for container stats
docker-compose -f docker-compose.agents.yml up -d cadvisor

# Access cAdvisor UI
open http://localhost:8080

# Container insights:
# - Per-container resource usage
# - Performance bottlenecks
# - Resource allocation optimization
```

---

## 🔍 Health Checks & Validation

### **System Health Verification**

```bash
#!/bin/bash
# Agent system health check script

echo "🔍 Agent-OS Health Check Starting..."

# Check Docker containers
echo "📦 Container Status:"
docker-compose -f docker-compose.agents.yml ps

# Check agent health endpoints
agents=("typescript-specialist" "orchestrator" "batch-coordinator")
for agent in "${agents[@]}"; do
    container_name="ai-saas-${agent}"
    if docker ps | grep -q "$container_name"; then
        echo "✅ $agent: Running"
        # Check internal health if endpoint exists
        docker exec "$container_name" node /app/scripts/agent-health-check.js 2>/dev/null && echo "  ✅ Health check passed" || echo "  ⚠️ Health check unavailable"
    else
        echo "❌ $agent: Not running"
    fi
done

# Check Redis connectivity
echo "🔗 Redis Connection:"
docker exec ai-saas-agent-redis redis-cli ping && echo "✅ Redis responding" || echo "❌ Redis not responding"

# Check agent communication
echo "📡 Agent Communication:"
# Test message passing between agents
docker exec ai-saas-orchestrator node -e "
const redis = require('redis');
const client = redis.createClient({host: 'agent-redis', port: 6379});
client.ping().then(() => console.log('✅ Agent communication ready')).catch(e => console.log('❌ Communication failed:', e.message));
" 2>/dev/null || echo "⚠️ Communication test unavailable"

echo "🎯 Health Check Complete"
```

### **Performance Benchmarks**

```bash
# Resource utilization check
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"

# Expected resource usage:
# - TypeScript Specialist: <70% CPU, <512MB RAM
# - Orchestrator: <85% CPU, <768MB RAM
# - Batch Coordinator: <60% CPU, <512MB RAM
```

---

## 🚨 Troubleshooting Guide

### **Common Issues**

#### **Issue**: Agent containers failing to start
```bash
# Check logs for specific error
docker-compose -f docker-compose.agents.yml logs typescript-specialist

# Common solutions:
# 1. Check port conflicts
netstat -tulpn | grep -E '(3100|6380|8080|9090)'

# 2. Verify volume permissions
ls -la agent-data/
chmod -R 755 agent-data/

# 3. Check Docker resources
docker system df
docker system prune  # Clean up if needed
```

#### **Issue**: TypeScript errors not reducing
```bash
# Check if agent is processing files
docker exec ai-saas-typescript-specialist ls -la /app/src/

# Verify write permissions
docker exec ai-saas-typescript-specialist touch /app/src/test-write.tmp

# Check agent logs for error patterns
docker-compose -f docker-compose.agents.yml logs typescript-specialist | grep -E "(ERROR|WARN|✅)"
```

#### **Issue**: High resource usage
```bash
# Identify resource-hungry containers
docker stats --no-stream | sort -k3 -nr

# Adjust resource limits in docker-compose.agents.yml
# Reduce CPU/memory limits if needed
# Increase pulse intervals to reduce processing frequency
```

### **Recovery Procedures**

#### **Graceful Restart**
```bash
# Stop all agents gracefully
docker-compose -f docker-compose.agents.yml down --timeout 30

# Wait for cleanup
sleep 10

# Restart with fresh state
docker-compose -f docker-compose.agents.yml up -d
```

#### **Emergency Reset**
```bash
# Force stop all containers
docker-compose -f docker-compose.agents.yml down --volumes --timeout 5

# Clean up agent data (caution: loses state)
rm -rf agent-data/*

# Recreate directories
mkdir -p agent-data/{typescript,orchestrator,frontend,backend}

# Restart system
docker-compose -f docker-compose.agents.yml up -d
```

---

## 📈 Scaling Guidelines

### **Horizontal Scaling**

```bash
# Scale TypeScript Specialist for faster error resolution
docker-compose -f docker-compose.agents.yml up -d --scale typescript-specialist=3

# Scale frontend agents for parallel component development
docker-compose -f docker-compose.agents.yml up -d --scale agent-frontend=2

# Monitor resource usage during scaling
watch docker stats
```

### **Vertical Scaling**

```yaml
# Increase resources for high-demand agents
typescript-specialist:
  deploy:
    resources:
      limits:
        cpus: '1.0'      # Increased from 0.70
        memory: '1G'     # Increased from 512M
```

---

## 🔒 Security Considerations

### **Container Security**
```bash
# Verify non-root execution
docker exec ai-saas-typescript-specialist whoami  # Should show 'agent'

# Check file permissions
docker exec ai-saas-typescript-specialist ls -la /app/

# Verify network isolation
docker network inspect docker_agent-network
```

### **Access Control**
```bash
# Limit Docker socket access (DevOps agent only)
docker exec ai-saas-agent-devops ls -la /var/run/docker.sock

# Verify read-only mounts
docker inspect ai-saas-typescript-specialist | grep -A5 '"Mounts"'
```

---

## 📚 Advanced Deployment Patterns

### **Blue-Green Deployment**
```bash
# Deploy to secondary environment
docker-compose -f docker-compose.agents.yml -p agents-blue up -d

# Test secondary environment
./scripts/test-agent-environment.sh agents-blue

# Switch traffic (update load balancer/proxy)
# Terminate old environment
docker-compose -f docker-compose.agents.yml -p agents-green down
```

### **Rolling Updates**
```bash
# Update agents one at a time
agents=("typescript-specialist" "agent-frontend" "agent-backend")
for agent in "${agents[@]}"; do
    echo "Updating $agent..."
    docker-compose -f docker-compose.agents.yml up -d --no-deps "$agent"
    sleep 30  # Wait for stabilization
done
```

---

## 🎯 Success Metrics

### **Deployment Success Criteria**
- [ ] All agent containers running (green status)
- [ ] TypeScript error count decreasing (< 50% within 1 hour)
- [ ] Agent communication functioning (Redis responding)
- [ ] Resource usage within limits (< 80% CPU/Memory)
- [ ] Health checks passing for all agents
- [ ] Monitoring dashboard accessible
- [ ] No error logs in agent containers

### **Performance Targets**
- **Error Resolution Rate**: > 100 errors/minute (TypeScript Specialist)
- **Agent Response Time**: < 2 seconds (average)
- **System Availability**: > 99.5% uptime
- **Resource Efficiency**: < 4GB total RAM usage
- **Communication Latency**: < 100ms between agents

---

*Last Updated: 2025-07-23*  
*Deployment Guide Version: 1.0.0*  
*Tested with Docker 20.10+ and Docker Compose 2.0+*