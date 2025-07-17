---
title: Execute Product Requirements Prompt (PRP)
description: Execute a generated PRP to implement features using the AI Guided SaaS multi-agent system
---

# Execute PRP Command

Execute a comprehensive Product Requirements Prompt (PRP) to implement features using the AI Guided SaaS multi-agent coordination system.

## Usage

```
/execute-prp <prp_file_path>
```

**Arguments:**
- `prp_file_path`: Path to the PRP file to execute (e.g., `PRPs/generated/feature-name.md`)

**IMPORTANT TIMING**: 
- Wait 20 minutes after running `/generate-prp` before executing this command
- After execution, return in 3 hours to review build results and logs

## Execution Process

I'll execute the PRP following this systematic approach:

### 1. Load PRP Context
- Read the complete PRP document: `$ARGUMENTS`
- Parse all requirements, specifications, and constraints
- Load agent assignments and coordination protocols
- Review validation gates and success criteria

### 2. Initialize Multi-Agent System
- Update `ACTION_LOG.md` with execution start
- Initialize agent coordination protocols
- Set up dependency tracking
- Configure error escalation procedures

### 3. Pre-Execution Health Checks
```bash
# System health validation
npm run mcp:health:system
npm run mcp:health:api  
npm run mcp:health:db
npm run mcp:health:ui
```

### 4. Agent Coordination & Execution

#### Phase 1: Architecture Agent
- [ ] System design and architecture planning
- [ ] Technology stack validation
- [ ] Integration point identification
- [ ] Scalability and security planning
- [ ] Agent briefing for other agents

#### Phase 2: Parallel Development
- [ ] **Frontend Agent**: UI/UX implementation
- [ ] **Backend Agent**: API and data layer development
- [ ] Real-time coordination via `ACTION_LOG.md`
- [ ] Dependency resolution and handoff management

#### Phase 3: Quality Assurance
- [ ] **QA Agent**: Comprehensive testing
- [ ] Integration testing and validation
- [ ] Performance and security testing
- [ ] Quality gate validation

#### Phase 4: Deployment
- [ ] **DevOps Agent**: Production deployment
- [ ] Infrastructure setup and monitoring
- [ ] Health check integration
- [ ] Post-deployment validation

### 5. Continuous Validation

Throughout execution, validate each step:

```bash
# Code quality checks
npm run typecheck
npm run lint
npm run test

# Build validation
npm run build

# Performance validation
npm run test:lighthouse
npm run test:accessibility

# Security validation
npm run error-prevention
```

### 6. Error Handling & Recovery

- **Automatic Resolution**: Use MCP self-healing for known issues
- **Agent Escalation**: Route complex errors to appropriate specialist agents
- **Cross-Agent Coordination**: Coordinate error resolution across agents
- **Learning Integration**: Feed error patterns back into prevention system

```bash
# Error recovery protocols
npm run mcp:heal:auto
npm run mcp:heal:critical
npm run mcp:emergency:recover
```

### 7. Success Validation

Ensure all success criteria are met:

#### Functional Validation
- [ ] All functional requirements implemented
- [ ] User acceptance criteria satisfied
- [ ] Performance benchmarks achieved
- [ ] Business requirements fulfilled

#### Technical Validation
- [ ] All validation gates passed
- [ ] Zero critical bugs
- [ ] Documentation complete
- [ ] Type safety maintained

#### System Health Validation
- [ ] MCP health checks green
- [ ] Performance within thresholds
- [ ] Security requirements met
- [ ] Monitoring and alerting active

### 8. Post-Execution

- Update `ACTION_LOG.md` with completion status
- Generate implementation summary
- Update agent performance metrics
- Store successful patterns for future use

## Advanced Features

### Multi-Agent Parallel Execution
```
/execute-prp feature.md --parallel
```
- Coordinate multiple agents simultaneously
- Optimize for maximum development speed
- Real-time dependency resolution

### Safe Mode Execution
```
/execute-prp feature.md --safe-mode
```
- Execute with additional validation gates
- Require confirmation for critical changes
- Enhanced error recovery protocols

### Continuous Monitoring
```
/execute-prp feature.md --monitor
```
- Continuous health monitoring during execution
- Real-time performance tracking
- Automated issue detection and resolution

## Integration with AI Guided SaaS

This command leverages your existing infrastructure:

- **Agent System**: Uses your 5 specialized agents
- **MCP Integration**: Full health check and self-healing
- **Action Logging**: Real-time coordination tracking
- **Error Handling**: Comprehensive error escalation
- **Type Safety**: Maintains 100% TypeScript compliance

## Validation Gates

Each execution phase includes mandatory validation:

### Code Quality Gates
- [ ] TypeScript compilation: `npm run typecheck`
- [ ] ESLint validation: `npm run lint`
- [ ] Unit test coverage: `npm run test:coverage`
- [ ] Integration testing: `npm run test:integration`

### Performance Gates
- [ ] Build success: `npm run build`
- [ ] Lighthouse score > 90: `npm run test:lighthouse`
- [ ] Core Web Vitals: Performance optimization
- [ ] Load testing: Stress test validation

### Security Gates
- [ ] Security audit: Vulnerability assessment
- [ ] Authentication testing: Access control validation
- [ ] Data protection: Privacy and security compliance
- [ ] Error prevention: `npm run error-prevention`

### MCP Health Gates
- [ ] System health: `npm run mcp:health:system`
- [ ] API health: `npm run mcp:health:api`
- [ ] Database health: `npm run mcp:health:db`
- [ ] UI health: `npm run mcp:health:ui`
- [ ] Deployment health: `npm run mcp:health:deploy`

## Emergency Procedures

If execution encounters critical issues:

```bash
# Emergency stop
npm run mcp:emergency:stop

# Emergency recovery
npm run mcp:emergency:recover

# Rollback changes
npm run mcp:emergency:rollback
```

## Success Metrics

After execution, you'll receive:

1. **Implementation Summary**: Complete feature overview
2. **Quality Report**: All validation results
3. **Performance Metrics**: Speed and efficiency data
4. **Agent Coordination Report**: Multi-agent performance
5. **Health Status**: System health after implementation
6. **Next Steps**: Recommendations for optimization

## Files Updated

- Source code files for the implemented feature
- `ACTION_LOG.md` with complete execution history
- `ERROR_LOG.md` with any issues and resolutions
- Agent configuration files (if needed)
- Documentation and README updates
- Test files and validation reports

Ready to execute your PRP! Provide the path to the PRP file you want to implement.