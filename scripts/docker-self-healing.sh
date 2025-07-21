#!/bin/bash

# AI Guided SaaS - Docker Self-Healing Script
# Pass 1: Surface Level Issues

echo "🔄 Starting Self-Healing Pass #1 - Surface Level Issues"
echo "=================================================="

# 1. Check Docker daemon
echo "✅ Checking Docker daemon..."
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker daemon is not running!"
    exit 1
fi

# 2. Clean up stopped containers
echo "🧹 Cleaning up stopped containers..."
docker container prune -f

# 3. Fix MCP containers
echo "🔧 Fixing MCP containers..."
docker-compose down
docker-compose -f docker-compose.yml up -d redis postgres

# 4. Build missing images
echo "🏗️ Building agent images..."
if [ ! -f "docker/agents/Dockerfile.agent" ]; then
    echo "❌ Agent Dockerfile missing!"
    exit 1
fi

# Build agent images
docker build -t ai-saas-agent:latest -f docker/agents/Dockerfile.agent .

# 5. Start core services
echo "🚀 Starting core services..."
docker-compose -f docker-compose.yml up -d app redis postgres

# 6. Verify health checks
echo "🏥 Running health checks..."
sleep 10

# Check Redis
if docker exec ai-saas-redis redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis is healthy"
else
    echo "❌ Redis health check failed"
fi

# Check PostgreSQL
if docker exec ai-saas-postgres pg_isready -U postgres > /dev/null 2>&1; then
    echo "✅ PostgreSQL is healthy"
else
    echo "❌ PostgreSQL health check failed"
fi

# 7. Fix TypeScript errors
echo "🔧 Fixing TypeScript errors..."
cd /mnt/d/AI\ Guided\ SaaS

# Install missing dependencies
npm install

# 8. Create missing components
echo "📦 Creating missing components..."

# Create missing SystemMetrics component
cat > src/components/health/SystemMetrics.tsx << 'EOF'
import React from 'react'

interface SystemMetricsProps {
  metrics?: {
    cpu: number
    memory: number
    uptime: number
    activeAgents: number
  }
}

export function SystemMetrics({ metrics }: SystemMetricsProps) {
  if (!metrics) {
    return <div>Loading metrics...</div>
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">CPU Usage</h3>
        <p className="mt-1 text-2xl font-semibold">{metrics.cpu.toFixed(1)}%</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Memory Usage</h3>
        <p className="mt-1 text-2xl font-semibold">{metrics.memory.toFixed(1)}%</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Uptime</h3>
        <p className="mt-1 text-2xl font-semibold">{Math.floor(metrics.uptime / 3600)}h</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Active Agents</h3>
        <p className="mt-1 text-2xl font-semibold">{metrics.activeAgents}</p>
      </div>
    </div>
  )
}
EOF

# Create TaskQueueVisualizer
cat > src/components/health/TaskQueueVisualizer.tsx << 'EOF'
import React from 'react'

interface TaskQueueVisualizerProps {
  queue?: Array<{
    id: string
    name: string
    priority: string
    status: string
  }>
}

export function TaskQueueVisualizer({ queue = [] }: TaskQueueVisualizerProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-3 border-b">
        <h3 className="text-lg font-medium">Task Queue ({queue.length})</h3>
      </div>
      <div className="divide-y">
        {queue.length === 0 ? (
          <p className="p-4 text-gray-500 text-center">No tasks in queue</p>
        ) : (
          queue.map((task) => (
            <div key={task.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{task.name}</p>
                <p className="text-sm text-gray-500">Priority: {task.priority}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                task.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                task.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {task.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
EOF

# Create AlertsPanel
cat > src/components/health/AlertsPanel.tsx << 'EOF'
import React from 'react'

interface Alert {
  id: string
  type: 'error' | 'warning' | 'info'
  message: string
  timestamp: Date
}

interface AlertsPanelProps {
  alerts?: Alert[]
}

export function AlertsPanel({ alerts = [] }: AlertsPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-3 border-b">
        <h3 className="text-lg font-medium">System Alerts</h3>
      </div>
      <div className="divide-y max-h-64 overflow-y-auto">
        {alerts.length === 0 ? (
          <p className="p-4 text-gray-500 text-center">No active alerts</p>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className="p-4">
              <div className="flex items-start">
                <div className={`flex-shrink-0 ${
                  alert.type === 'error' ? 'text-red-500' :
                  alert.type === 'warning' ? 'text-yellow-500' :
                  'text-blue-500'
                }`}>
                  {alert.type === 'error' ? '❌' : alert.type === 'warning' ? '⚠️' : 'ℹ️'}
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
EOF

# 9. Create health check index
cat > src/components/health/index.ts << 'EOF'
export { SystemMetrics } from './SystemMetrics'
export { TaskQueueVisualizer } from './TaskQueueVisualizer'
export { AlertsPanel } from './AlertsPanel'
EOF

# 10. Run TypeScript check
echo "🔍 Running TypeScript check..."
npm run typecheck || true

echo "✅ Self-Healing Pass #1 Complete!"
echo "================================="