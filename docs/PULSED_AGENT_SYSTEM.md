# Pulsed Agent System Documentation

## Overview

The Pulsed Agent System is a sophisticated orchestration framework designed to manage AI agents efficiently while preventing system overload. It implements pulse-based execution, Docker containerization, and intelligent resource management.

## Key Features

### 1. Pulse-Based Execution
- **Controlled Execution**: Agents execute tasks in pulses rather than continuously
- **Configurable Intervals**: Adjustable pulse timing (default: 1-3 seconds)
- **Cooldown Periods**: Mandatory rest periods between executions (default: 5 seconds)
- **Queue Management**: Tasks are queued and executed based on priority

### 2. Resource Management
- **CPU Throttling**: Limits CPU usage per agent (40-85% configurable)
- **Memory Limits**: Enforced memory constraints (256MB-768MB per agent)
- **Concurrent Agent Limits**: Maximum 2-5 agents running simultaneously
- **Adaptive Throttling**: Automatic adjustment based on system load

### 3. Docker Containerization
- **Isolated Execution**: Each agent runs in its own container
- **Resource Isolation**: CPU and memory limits enforced at container level
- **Health Monitoring**: Built-in health checks for each container
- **Auto-scaling**: Dynamic scaling based on workload

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Pulsed Orchestrator                       │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │ Pulse Engine│  │Task Queue    │  │Resource Monitor │   │
│  └─────────────┘  └──────────────┘  └─────────────────┘   │
└─────────────────────────┬───────────────────────────────────┘
                          │
         ┌────────────────┴────────────────┐
         │                                 │
    ┌────▼─────┐                    ┌─────▼────┐
    │ Agent    │                    │ Agent    │
    │ Pool     │                    │ Registry │
    └────┬─────┘                    └─────┬────┘
         │                                 │
    ┌────▼───────────────────────────────▼────┐
    │         Docker Container Manager         │
    └────┬─────────────┬─────────────┬────────┘
         │             │             │
    ┌────▼────┐   ┌───▼────┐   ┌───▼────┐
    │Frontend │   │Backend │   │Architect│
    │Container│   │Container│   │Container│
    └─────────┘   └────────┘   └─────────┘
```

## Configuration

### Pulse Configuration

```typescript
// src/config/pulse.config.ts
export const PULSE_CONFIG = {
  development: {
    maxConcurrentAgents: 2,
    pulseInterval: 2000,      // 2 seconds
    cooldownPeriod: 5000,     // 5 seconds
    maxMemoryUsage: 70,       // 70%
    maxCpuUsage: 60,          // 60%
    enableAdaptiveThrottling: true
  },
  production: {
    maxConcurrentAgents: 3,
    pulseInterval: 1000,      // 1 second
    cooldownPeriod: 3000,     // 3 seconds
    maxMemoryUsage: 80,       // 80%
    maxCpuUsage: 70,          // 70%
    enableAdaptiveThrottling: true
  }
}
```

### Docker Resource Limits

```yaml
# docker-compose.agents.yml
deploy:
  resources:
    limits:
      cpus: '0.5'      # 50% of one CPU
      memory: 512M     # 512MB RAM
    reservations:
      cpus: '0.25'     # Minimum 25% CPU
      memory: 256M     # Minimum 256MB RAM
```

## Usage

### Starting the System

```bash
# Development mode (conservative resources)
make dev-mode

# Production mode (optimized performance)
make prod-mode

# Custom pulse mode
PULSE_MODE=constrained make up
```

### Managing Agents

```bash
# View agent status
make status

# Scale specific agent type
make scale TYPE=frontend COUNT=3

# Check agent health
make health

# View logs
make logs AGENT=frontend
```

### Monitoring

```bash
# Open monitoring dashboards
make monitor

# Export metrics
make metrics

# View real-time stats
docker stats $(docker-compose -f docker-compose.agents.yml ps -q)
```

## Pulse Modes

### 1. Constrained Mode
- **Use Case**: Resource-limited environments
- **Settings**: 1 concurrent agent, 3s pulse, 10s cooldown
- **Resource Usage**: <50% CPU, <50% Memory

### 2. Development Mode
- **Use Case**: Local development
- **Settings**: 2 concurrent agents, 2s pulse, 5s cooldown
- **Resource Usage**: <70% CPU, <70% Memory

### 3. Production Mode
- **Use Case**: Production workloads
- **Settings**: 3 concurrent agents, 1s pulse, 3s cooldown
- **Resource Usage**: <80% CPU, <80% Memory

### 4. Performance Mode
- **Use Case**: High-performance requirements
- **Settings**: 5 concurrent agents, 0.5s pulse, 1s cooldown
- **Resource Usage**: <90% CPU, <90% Memory

## Health Monitoring

### Health Check Endpoints

Each agent exposes health endpoints:
- `/health` - JSON health status
- `/metrics` - Prometheus metrics

### Health Criteria

```javascript
const healthChecks = {
  memory: usedMemory / totalMemory < 0.85,
  cpu: cpuUsage < 0.80,
  eventLoop: delay < 100, // ms
  agent: uptime > 5 // seconds
}
```

### Automated Recovery

- Unhealthy containers are automatically restarted
- Failed tasks are retried with exponential backoff
- Persistent failures trigger alerts

## Graceful Shutdown

The system implements a multi-stage shutdown process:

1. **Signal Reception**: Handles SIGTERM/SIGINT
2. **Task Completion**: Allows current tasks to complete
3. **Agent Shutdown**: Stops agents in priority order
4. **Container Cleanup**: Gracefully stops containers
5. **Resource Release**: Closes all connections

```typescript
// Shutdown priority (lower = higher priority)
const shutdownOrder = {
  database: 10,
  redis: 20,
  httpServer: 30,
  agents: 40,
  containers: 50
}
```

## Performance Optimization

### 1. Task Batching
- Groups similar tasks for efficient processing
- Reduces context switching overhead

### 2. Memory Management
- Automatic garbage collection triggers
- Memory leak detection and prevention

### 3. CPU Optimization
- Affinity settings for multi-core systems
- Load balancing across available cores

### 4. Network Efficiency
- Connection pooling for external services
- Request batching for API calls

## Troubleshooting

### Common Issues

1. **High CPU Usage**
   ```bash
   # Reduce concurrent agents
   make pulse-config MAX_AGENTS=1
   ```

2. **Memory Exhaustion**
   ```bash
   # Check container memory usage
   docker stats --no-stream
   ```

3. **Task Queue Backup**
   ```bash
   # View queue status
   curl http://localhost:3000/api/agents/pulse-status
   ```

### Debug Commands

```bash
# Debug specific agent
make debug-agent AGENT=frontend

# View container logs
docker logs -f ai-saas-agent-frontend

# Check system resources
htop
docker system df
```

## Best Practices

1. **Resource Planning**
   - Monitor baseline resource usage
   - Set limits 20% below maximum capacity
   - Use constrained mode for initial testing

2. **Task Design**
   - Keep tasks atomic and idempotent
   - Implement proper error handling
   - Use appropriate priority levels

3. **Monitoring**
   - Set up alerts for resource thresholds
   - Monitor task completion rates
   - Track agent performance metrics

4. **Scaling**
   - Start with minimum agents
   - Scale based on queue length
   - Monitor impact before adding agents

## Integration

### API Endpoints

```typescript
// Pulse status
GET /api/agents/pulse-status

// Update configuration
POST /api/agents/pulse-config
{
  "maxConcurrentAgents": 3,
  "pulseInterval": 1500
}

// Container management
GET /api/agents/containers
POST /api/agents/containers/:id/:action
```

### Event System

```typescript
orchestrator.on('pulse:start', (metrics) => {})
orchestrator.on('pulse:complete', (results) => {})
orchestrator.on('agent:throttled', (agentId) => {})
orchestrator.on('system:overload', (metrics) => {})
```

## Security

- Containers run as non-root users
- Network isolation between agents
- Resource limits prevent DoS
- Health checks prevent zombie containers
- Encrypted communication between services

## Future Enhancements

1. **Kubernetes Integration**: Native K8s deployment
2. **ML-based Optimization**: Predictive resource allocation
3. **Distributed Mode**: Multi-node agent clusters
4. **Advanced Metrics**: AI-powered anomaly detection
5. **Plugin System**: Custom agent types