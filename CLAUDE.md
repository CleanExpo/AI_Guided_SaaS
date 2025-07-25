# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🏗️ Project Overview
**AI Guided SaaS** - A hybrid AI-powered platform combining Lovable.dev's intuitive UI/UX with VS Code's power and Claude Code's intelligence.

**Current Status**: ✅ BUILD SUCCESSFUL - All tests passing (3/3 green checkmarks)
**Implementation**: 4/10 major features complete (40%)
**Last Deployment**: July 25, 2025 - Fixed critical syntax errors in UI components and pages

## 🔧 Essential Commands

### Development
```bash
npm run dev                    # Start development server (port 3000)
npm run build                  # Production build (NOW WORKING!)
npm run build:validate         # Build with environment validation
npm run build:dev              # Development build
npm run build-doctor diagnose  # Diagnose build issues
npm run build-doctor fix       # Auto-fix all build errors
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
npm run mcp:start              # Start ALL MCP servers
npm run mcp:status             # Check MCP server status
npm run mcp:context7           # Start Context7 documentation server
npm run mcp:eslint             # Start ESLint code quality server
npm run mcp:sequential         # Start Sequential Thinking server
npm run mcp:master-dev         # Start Master Development Analysis Agent
npm run mcp:master-dev:dev     # Start Master Dev Agent in development mode
npm run mcp:build-doctor       # Start Build Doctor MCP server
npm run mcp:build-doctor:dev   # Start Build Doctor in development mode
npm run build-doctor           # Use Build Doctor CLI directly
npm run mcp:semantic-maestro   # Start Semantic Reasoning Maestro
npm run mcp:semantic-maestro:dev  # Start Semantic Maestro in development mode
```

**Configured MCP Servers**:
1. **Context7** (`@upstash/context7-mcp`) - Provides up-to-date documentation and code examples
   - Requires: `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` environment variables
   
2. **Sequential Thinking** - Enables structured problem-solving through sequential reasoning
   - Local implementation at `./mcp/wsl-sequential-thinking-server.cjs`
   
3. **ESLint MCP** (`@eslint/mcp`) - Provides linting and code quality analysis
   - Automatically uses project ESLint configuration
   
4. **Model Context Memory** (`@modelcontextprotocol/server-memory`) - Maintains conversation context and memory
   
5. **GitHub Integration** (`@modelcontextprotocol/server-github`) - Integrates with GitHub repositories
   - Requires: `GITHUB_TOKEN` environment variable
   
6. **Serena Semantic Search** - Powerful coding agent toolkit with semantic code analysis
   - Custom implementation in `./serena` directory

7. **Master Development Analysis Agent** - Comprehensive project intelligence and multi-agent coordination
   - Analyzes project structure, dependencies, and architecture
   - Generates dynamic todo lists and risk predictions
   - Coordinates multi-agent workflows
   - Commands: `npm run mcp:master-dev` (production) or `npm run mcp:master-dev:dev` (development)

8. **Build Doctor MCP** - Ultimate build and code correctness expert
   - Diagnoses and automatically fixes all build errors
   - Repairs syntax, TypeScript, JSX, and import issues
   - Validates builds and runs comprehensive checks
   - Commands: `npm run mcp:build-doctor` (server) or `npm run build-doctor` (CLI)
   - CLI Usage: `npm run build-doctor diagnose|fix|validate`

9. **Semantic Reasoning Maestro** - The ultimate agent for human-like, autonomous reasoning
   - Performs deep, semantically-anchored reasoning over complex multi-modal information
   - Breaks down complex tasks with intelligent decomposition and orchestration
   - Autonomous research synthesis with cross-source validation
   - Multimodal analysis (text, code, images, diagrams, data)
   - Self-evaluating and iterative refinement capabilities
   - Commands: `npm run mcp:semantic-maestro` (production) or `npm run mcp:semantic-maestro:dev` (development)

**MCP Resources**:
- **ESLint MCP**: https://eslint.org/docs/latest/use/mcp
- **Model Context Protocol**: https://github.com/modelcontextprotocol
- **Awesome MCP Servers**: https://github.com/punkpeye/awesome-mcp-servers
- **Vercel Documentation**: https://vercel.com/docs
- **Context7**: https://github.com/upstash/context7.git
- **TypeScript SDK**: https://github.com/modelcontextprotocol/typescript-sdk.git
- **Tmux MCP**: https://github.com/nickgnd/tmux-mcp.git
- **Tmux Orchestrator**: https://github.com/Jedward23/Tmux-Orchestrator.git
- **Ref Tools MCP**: https://github.com/ref-tools/ref-tools-mcp.git
- **Semgrep MCP**: https://github.com/semgrep/mcp.git
- **Pieces MCP**: https://pieces.app/features/mcp
- **Exa MCP Server**: https://github.com/exa-labs/exa-mcp-server.git
- **Playwright MCP**: https://github.com/microsoft/playwright-mcp.git

### Tmux Session Management
```bash
# IMPORTANT: Enable permissions for MCP servers in Tmux
# Add --dangerously-skip-permissions flag when starting MCP servers

# Frontend Team Session
tmux new-session -d -s Task-frontend
tmux rename-window -t Task-frontend:0 'Frontend-PM'
tmux new-window -t Task-frontend:1 -n 'Frontend-Dev'
tmux new-window -t Task-frontend:2 -n 'Frontend-Server'

# Backend Team Session  
tmux new-session -d -s Task-backend
tmux rename-window -t Task-backend:0 'Backend-PM'
tmux new-window -t Task-backend:1 'Backend-Dev'
tmux new-window -t Task-backend:2 'Backend-Server'

# MCP Server Sessions with permissions
tmux new-session -d -s mcp-servers
tmux send-keys -t mcp-servers:0 'npm run mcp:start -- --dangerously-skip-permissions' C-m
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
- **Master Development Analysis Agent**: Comprehensive project intelligence
  - Tools: analyze_project, generate_todo_list, assess_production_readiness
  - Tools: identify_missing_components, predict_risks, coordinate_agents
  - Location: `mcp/master-dev-analysis-agent/`
- **Build Doctor MCP**: Ultimate build and code correctness expert
  - Tools: diagnose_build, fix_all_errors, fix_syntax_errors, fix_typescript_errors
  - Tools: fix_jsx_errors, validate_build, generate_fix_report
  - Location: `mcp/build-doctor-mcp/`
  - CLI: `npm run build-doctor diagnose|fix|validate`

### MCP (Model Context Protocol) Integration
- **Memory Server**: Context retention across sessions
- **Sequential Thinking**: Complex reasoning chains
- **GitHub**: Repository management
- **Context7**: Documentation lookup

### Key Integration Points
- **AI Services**: Multi-provider (OpenAI, Anthropic) with fallback
- **State Management**: Zustand (client), React Query (server), Socket.io (real-time)
- **Data Layer**: Supabase (PostgreSQL), Redis (cache), File System

## 🚨 Critical Issues & Solutions

### Vercel Deployment Issues (IN PROGRESS)
**Common Build Failures**:
1. **Module Resolution Errors**: UI components exist but fail to resolve
   - Solution: Created UI component index file (`src/components/ui/index.ts`)
   - Fixed syntax errors in `toast.tsx`, `SemanticSearchService.ts`, `logger.ts`, `middleware.ts`
   - CURRENT ISSUE: "@/components/ui/button" modules not found despite index.ts existing
   - Moved tailwindcss from devDependencies to dependencies

2. **Missing Dependencies**:
   - Added `@babel/runtime` for next-auth compatibility
   - Added `@supabase/supabase-js` for Supabase adapter
   - Moved `tailwindcss` to runtime dependencies

3. **Node Version Mismatch**:
   - Vercel requires Node 20+ (local may be using v18)
   - Solution: Vercel automatically uses correct version from `engines` in package.json

4. **LightningCSS Native Module**:
   - Windows-specific build issue with Tailwind CSS v4
   - Solution: Added webpack fallback configuration in `next.config.mjs`

### TypeScript Errors (9,221)
**Top Error Types**:
- TS2339: Property does not exist
- TS2554: Wrong number of arguments
- TS2345: Type mismatch

**Fix Strategy**:
1. TypeScript errors are ignored during build (`typescript.ignoreBuildErrors: true`)
2. Run `npm run typecheck` locally to view errors
3. Use `npm run fix:typescript:systematic` for automated fixes (has syntax errors)

### Build Verification
```bash
# Test build locally before deploying
npm run build

# If lightningcss error on Windows, ensure Node 20+:
nvm use 20.19.4
npm cache clean --force
npm install --legacy-peer-deps
```

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
*Last Updated: 2025-07-24*
*Auto-compact enabled: Preserves critical issues, progress tracking, and architecture decisions*