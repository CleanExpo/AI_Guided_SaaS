# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🏗️ Project Overview
**AI Guided SaaS** - A hybrid AI-powered platform combining Lovable.dev's intuitive UI/UX with VS Code's power and Claude Code's intelligence.

**Current Status**: ⚠️ BUILD FAILING - 9,221 TypeScript errors
**Implementation**: 4/10 major features complete (40%)

## 🔧 Essential Commands

### Development
```bash
npm run dev                    # Start development server (port 3000)
npm run build                  # Production build (currently failing)
npm run build:validate         # Build with environment validation
npm run build:dev              # Development build
```

### Code Quality
```bash
npm run typecheck              # Check TypeScript errors (9,221 errors)
npm run lint                   # Run ESLint
npm run lint:fix               # Auto-fix ESLint issues
npm run fix:typescript         # Fix TypeScript errors (Phase 1)
npm run fix:typescript:systematic  # Systematic TypeScript fix
npm run fix:all                # Loop through all error fixes
```

### Testing
```bash
npm run test                   # Run unit tests
npm run test:watch             # Watch mode
npm run test:coverage          # Coverage report
npm run test:e2e               # Playwright E2E tests
npm run test:integration       # Integration tests only
npm run test:accessibility     # Accessibility tests
npm run validate:full          # Complete validation suite
```

### Production & Deployment
```bash
npm run production:gaps        # Analyze production deployment gaps
npm run production:readiness-full  # Comprehensive readiness check
npm run deploy:check           # Pre-deployment verification
npm run deploy:staging         # Deploy to Vercel staging
npm run deploy:production      # Deploy to Vercel production
```

### Health Monitoring
```bash
npm run health:check           # Comprehensive health check
npm run health:simple          # Quick health check
npm run update:memory          # Update CLAUDE.md memory
```

### Agent System
```bash
npm run agents:init            # Initialize agent system
npm run agents:orchestrate     # Activate enhanced orchestration
npm run agents:status          # Check agent status
npm run agents:monitor         # Monitor running agents
```

### MCP Integration
```bash
npm run mcp:start              # Start MCP servers (serena + sequential-thinking)
npm run serena:start           # Start serena semantic search server
```

## 🏛️ Architecture Overview

### Hybrid Architecture Pattern
The system combines three paradigms:
- **Lovable.dev UI/UX**: Guided wizards for non-technical users
- **VS Code Power**: Monaco editor for professional developers
- **Claude Code Intelligence**: AI-powered assistance

### Dual-Mode Interface
1. **Simple Mode** (Lovable-style):
   - `src/components/project/GuidedProjectBuilder.tsx` - 5-step wizard
   - `src/components/project/LiveProjectPreview.tsx` - Real-time preview
   - `src/components/data/DataSourceManager.tsx` - Mock/real data toggle

2. **Advanced Mode** (VS Code-style):
   - `src/components/editor/AdvancedCodeEditor.tsx` - Full Monaco editor
   - Multi-tab editing, file explorer, terminal emulator

### Agent Orchestration System
**Pulsed Agent Architecture** with controlled execution:
- Docker containerized agents
- Resource limits: CPU (40-85%), Memory (256MB-768MB)
- Pulse intervals: 1-3 seconds
- Adaptive throttling based on system load

**Agent Types**:
- Core Agents: Architect, Frontend, Backend, QA, DevOps
- Orchestration: Conductor, Progress Tracker, Queue Manager
- Specialists: TypeScript, Visual Builder, Self-Healing

### MCP (Model Context Protocol) Integration
- **Memory Server**: Context retention across sessions
- **Sequential Thinking**: Complex reasoning chains
- **GitHub**: Repository management
- **Context7**: Documentation lookup
- **Serena**: Semantic search and code navigation

### Key Integration Points
- **AI Services**: Multi-provider (OpenAI, Anthropic) with fallback
- **State Management**: Zustand (client), React Query (server), Socket.io (real-time)
- **Data Layer**: Supabase (PostgreSQL), Redis (cache), File System

## 🚨 Critical Issues & Solutions

### TypeScript Errors (9,221)
**Top Error Types**:
- TS2339: Property does not exist
- TS2554: Wrong number of arguments
- TS2345: Type mismatch

**Fix Strategy**:
1. Run `npm run fix:typescript:systematic` for automated fixes
2. Use `npm run production:gaps` to identify remaining issues
3. Target <5,000 errors before manual intervention

### Build Blockers
- Missing environment variables (use `npm run env:validate`)
- Dependency conflicts (check Node version >= 20.0.0)
- Memory issues during build (increase Node heap size)

## 📁 Project Structure
```
src/
├── components/          # UI components (Lovable + VS Code style)
├── pages/               # Next.js pages
├── api/                 # API routes
├── services/            # Business logic
├── lib/                 # Utilities and helpers
├── hooks/               # React hooks
├── styles/              # Global styles
└── types/               # TypeScript definitions

mcp/                     # Model Context Protocol servers
serena/                  # Semantic search MCP server
scripts/                 # Build and maintenance scripts
docs/                    # Documentation
```

## 🔄 Development Workflow

### Before Making Changes
1. Check current errors: `npm run typecheck`
2. Review agent rules: `docs/agents/agent-rules.md`
3. Ensure clean working directory: `git status`

### During Development
1. Use existing patterns - check similar components first
2. Follow the unified design system in `src/lib/design-system/`
3. Prefer editing existing files over creating new ones
4. Run `npm run lint:fix` before committing

### Before Committing
1. Run `npm run validate` (must pass)
2. Fix any TypeScript errors in changed files
3. Ensure no console.log statements in production code
4. Follow conventional commit format

## 🎯 Production-Ready Framework
Active: **Complete Production-Ready System v3.0**
Location: `PRODUCTION-READY-FRAMEWORK.md`

**Week 1 Goals** (Current Phase):
- Reduce TypeScript errors from 9,221 to <5,000
- Fix all critical build blockers
- Implement missing environment validations

## 📊 Feature Implementation Status
**Completed (4/10)**:
1. ✅ Guided Project Builder (Lovable.dev-style)
2. ✅ Advanced Code Editor (VS Code-style)
3. ✅ Mock Data System (Faker.js)
4. ✅ Unified Design System

**Pending (6/10)**:
5. ⏳ Sales Funnel & Marketing
6. ⏳ 3-Project Free Tier
7. ⏳ API Key Management
8. ⏳ LLM Fallback System
9. ⏳ Auto-Compact
10. ⏳ Resource-Aware System

## 🔐 Security & Compliance
- Never commit API keys or secrets
- Use environment variables for sensitive data
- Follow JWT best practices for authentication
- Implement rate limiting on all API endpoints
- Sanitize all user inputs

## 🚀 Quick Start for New Features
1. Identify which mode (Simple/Advanced) the feature belongs to
2. Check existing patterns in similar components
3. Use the design system tokens from `src/lib/design-system/theme.ts`
4. Add to appropriate agent orchestration workflow if needed
5. Update tests and documentation

---
*Last Updated: 2025-07-23*
*Auto-compact enabled: Preserves critical issues, progress tracking, and architecture decisions*