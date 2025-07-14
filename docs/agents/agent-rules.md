# Agent Rules & Behavioral Guidelines

## Core Agent Principles

### 1. **MANDATORY PRE-COMMIT VALIDATION**
- **Build-Sync Agent**: MUST run `npm run build` before ANY commit
- **ESLint Agent**: MUST validate TypeScript errors and warnings
- **Type-Safety Agent**: MUST ensure 100% type safety compliance
- **NO COMMITS** allowed without agent approval

### 2. **AGENT HIERARCHY & AUTHORITY**
```
Quality Assurance Agents (HIGHEST PRIORITY)
├── Build-Sync Agent - Build validation
├── ESLint Agent - Code quality
├── Type-Safety Agent - TypeScript compliance
└── Test Agent - Automated testing

Development Support Agents
├── MDFolderAgent - Documentation management
├── ClaudeCodeDashboard - Code integration oversight
└── Self-Check Agents - Runtime validation

Deployment Agents
├── Deployment Agent - Production deployment
├── Monitoring Agent - Health checks
└── Rollback Agent - Emergency recovery
```

### 3. **AGENT FAILURE PROTOCOLS**
- **Agent Failure = IMMEDIATE HALT**: If any agent fails, all operations stop
- **Agent Conflict Resolution**: Quality Assurance Agents override all others
- **Agent Recovery**: Failed agents must be restored before proceeding

### 4. **TESTING & VALIDATION RULES**

#### Pre-Commit Agent Checklist:
1. **Build-Sync Agent**: Verify `npm run build` succeeds
2. **ESLint Agent**: Zero errors, zero warnings
3. **Type-Safety Agent**: No `any` types, no unused variables
4. **Image Optimization Agent**: No `<img>` tags, use `<Image />`
5. **Dependency Agent**: All useEffect dependencies included

#### Agent Enforcement:
- **BLOCKING**: Agents can block commits/deployments
- **REPORTING**: Agents must log all actions and decisions
- **ESCALATION**: Critical failures escalate to human oversight

### 5. **AGENT COMMUNICATION PROTOCOLS**
- **Agent Status Broadcasting**: All agents report status every 30 seconds
- **Agent Coordination**: Agents must coordinate before major actions
- **Agent Logging**: All agent actions logged to `reports/agent-activity.log`

### 6. **DEVELOPMENT AGENT RULES**

#### Code Quality Enforcement:
- **ClaudeCodeDashboard**: Track all code changes and patterns
- **Self-Check Agents**: Validate component integration
- **MDFolderAgent**: Maintain documentation consistency

#### Agent-Assisted Development:
- **Auto-Fix Agents**: Automatically fix common issues
- **Pattern Enforcement Agents**: Ensure coding standards
- **Dependency Management Agents**: Manage package updates

### 7. **DEPLOYMENT AGENT RULES**

#### Production Deployment Protocol:
1. **Pre-Deployment Agent**: Verify all tests pass
2. **Build Verification Agent**: Confirm production build success
3. **Health Check Agent**: Validate all endpoints
4. **Monitoring Agent**: Establish real-time monitoring
5. **Rollback Agent**: Prepare immediate rollback capability

#### Agent Monitoring:
- **Performance Agents**: Monitor system performance
- **Error Detection Agents**: Catch and report errors
- **Security Agents**: Monitor for security issues

### 8. **AGENT MAINTENANCE RULES**
- **Agent Updates**: Agents self-update every 24 hours
- **Agent Health Checks**: Agents self-diagnose every hour
- **Agent Backup**: Agent configurations backed up daily
- **Agent Performance**: Agents report performance metrics

### 9. **EMERGENCY PROTOCOLS**
- **Agent Override**: Human can override agents in emergencies
- **Agent Shutdown**: Emergency shutdown of all agents
- **Agent Recovery**: Restore agents from backup configurations
- **Manual Mode**: Bypass agents for critical fixes

### 10. **AGENT ACCOUNTABILITY**
- **Action Logging**: Every agent action logged with timestamp
- **Decision Tracking**: Agent decisions tracked and reviewable
- **Performance Metrics**: Agent efficiency measured and reported
- **Error Attribution**: Agent errors traced to specific agents

## Implementation Status

### Active Agents:
- ✅ MDFolderAgent - Documentation management
- ✅ ClaudeCodeDashboard - Code oversight
- ✅ Self-Check Packages - Quality assurance
- ✅ Build-Sync Agent - Build coordination

### Required Agents:
- 🔄 ESLint Agent - Code quality enforcement
- 🔄 Type-Safety Agent - TypeScript compliance
- 🔄 Image Optimization Agent - Next.js optimization
- 🔄 Dependency Agent - useEffect validation

### Agent Integration Points:
- **Pre-commit hooks**: `.husky/pre-commit`
- **Build pipeline**: `scripts/build-sync-agent.ts`
- **Quality assurance**: `src/packages/self-check/`
- **Documentation**: `src/components/MDFolderAgent.tsx`

## Agent Command Interface

### Agent Control Commands:
```bash
# Agent Status
npm run agents:status

# Agent Health Check
npm run agents:health

# Agent Force Validation
npm run agents:validate

# Agent Emergency Stop
npm run agents:emergency-stop
```

### Agent Configuration:
- **Agent Rules**: `docs/agents/agent-rules.md`
- **Agent Config**: `agent-config.json`
- **Agent Logs**: `reports/agent-activity.log`
- **Agent Metrics**: `reports/agent-performance.json`

---

**CRITICAL**: These rules are MANDATORY and ENFORCED by the agent system. Violations result in immediate operation halt and human escalation.
