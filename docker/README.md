# Docker Development Environment

## Overview
This Docker setup provides a complete development environment for the AI-Guided SaaS platform, including all integrated services and tools.

## Services Included

### Core Services
- **app**: Main Next.js application (port 3000)
- **postgres**: PostgreSQL database with Supabase extensions (port 5432)
- **redis**: Redis cache and queue system (port 6379)

### Agent & AI Services
- **agent-engine**: Autonomous agent execution environment
- **mcp-server**: Model Context Protocol server (port 3001)

### Backend Services
- **strapi**: Headless CMS for instant backend (port 1337)
- **nocodb**: No-code database platform (port 8080)
- **n8n**: Workflow automation platform (port 5678)

### Development Tools
- **adminer**: Database management UI (port 8081)
- **dev-tools**: Container with development utilities

## Quick Start

### Prerequisites
- Docker Desktop installed
- Docker Compose v2.0+
- 8GB+ RAM available
- 20GB+ disk space

### Setup
```bash
# Navigate to docker directory
cd docker/development

# Run setup script
./setup.sh

# Or manually:
docker-compose up -d
```

### Access Services
- Main App: http://localhost:3000
- Strapi CMS: http://localhost:1337
- NocoDB: http://localhost:8080
- n8n Workflows: http://localhost:5678
- Database Admin: http://localhost:8081
- MCP Server: http://localhost:3001

## Development Workflow

### Working with the Main App
```bash
# View logs
docker-compose logs -f app

# Restart after code changes
docker-compose restart app

# Enter container
docker-compose exec app sh
```

### Working with Agents
```bash
# View agent logs
docker-compose logs -f agent-engine

# Execute agent manually
docker-compose exec agent-engine npm run agent:execute

# Access agent workspace
docker-compose exec agent-engine ls /workspace
```

### Database Management
```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U postgres -d ai_guided_saas

# Run migrations
docker-compose exec -T postgres psql -U postgres -d ai_guided_saas < ../../migrations/new-migration.sql

# Backup database
docker-compose exec postgres pg_dump -U postgres ai_guided_saas > backup.sql
```

### Using Development Tools
```bash
# Enter dev tools container
docker-compose exec dev-tools bash

# Run tests
docker-compose exec dev-tools npm test

# Check dependencies
docker-compose exec dev-tools npm-check-updates
```

## Service Configuration

### Environment Variables
Each service can be configured through:
1. `docker-compose.yml` environment section
2. `.env.local` file (for app service)
3. Service-specific config files

### Volumes
- **postgres_data**: Database persistent storage
- **redis_data**: Redis persistent storage
- **agent_workspace**: Agent working directory
- **strapi_data**: Strapi CMS data
- **n8n_data**: Workflow definitions
- **mcp_tools**: MCP server tools

### Networks
All services are connected via `ai-guided-network` bridge network for inter-service communication.

## Troubleshooting

### Common Issues

1. **Port conflicts**
   ```bash
   # Check if ports are in use
   netstat -an | grep -E '3000|5432|6379|1337|8080|5678'
   
   # Change ports in docker-compose.yml if needed
   ```

2. **Database connection errors**
   ```bash
   # Ensure postgres is healthy
   docker-compose ps postgres
   
   # Check logs
   docker-compose logs postgres
   ```

3. **Out of memory**
   ```bash
   # Increase Docker memory allocation
   # Docker Desktop > Settings > Resources > Memory
   ```

4. **Permission issues**
   ```bash
   # Fix volume permissions
   docker-compose exec app chown -R node:node /app
   ```

### Cleanup
```bash
# Stop all services
docker-compose down

# Remove volumes (WARNING: deletes data)
docker-compose down -v

# Remove all images
docker-compose down --rmi all
```

## Advanced Usage

### Custom Agent Development
1. Add agent files to `agents/` directory
2. Restart agent-engine: `docker-compose restart agent-engine`
3. Monitor logs: `docker-compose logs -f agent-engine`

### MCP Server Extensions
1. Add tools to `mcp/tools/` directory
2. Update `mcp/server-config.json`
3. Restart: `docker-compose restart mcp-server`

### Database Seeding
```bash
# Run seed script
docker-compose exec postgres psql -U postgres -d ai_guided_saas < seeds/demo-data.sql
```

### Performance Monitoring
```bash
# View resource usage
docker stats

# Check service health
docker-compose ps
```

## Production Considerations

This setup is for development only. For production:
1. Use separate Dockerfiles with optimizations
2. Implement proper secrets management
3. Set up container orchestration (Kubernetes)
4. Configure monitoring and logging
5. Implement backup strategies

## Support

For issues or questions:
1. Check service logs: `docker-compose logs [service]`
2. Verify environment variables
3. Ensure all prerequisites are met
4. Check GitHub issues for known problems