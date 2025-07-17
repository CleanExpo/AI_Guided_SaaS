---
title: Generate Product Requirements Prompt (PRP)
description: Generate comprehensive PRPs for AI Guided SaaS features with multi-agent coordination
---

# Generate PRP Command

Generate a comprehensive Product Requirements Prompt (PRP) from an INITIAL.md file or feature description, specifically optimized for the AI Guided SaaS multi-agent system.

## Usage

```
/generate-prp <initial_file_path>
```

**Arguments:**
- `initial_file_path`: Path to INITIAL.md file or feature description (default: `initial.md`)

## Process

I'll generate a comprehensive PRP following these steps:

### 1. Read Initial Requirements
- Parse the INITIAL.md file: `$ARGUMENTS`
- Extract feature requirements, examples, and constraints
- Identify complexity level and scope

### 2. Analyze Existing Codebase
- Review current project structure and patterns
- Identify relevant examples in the `examples/` directory
- Check existing agent configurations in `agents/` directory
- Analyze current architecture and technology stack

### 3. Research Documentation
- Review CLAUDE.md for project rules and conventions
- Check existing PRP templates in `PRPs/templates/`
- Identify relevant patterns and best practices
- Review MCP integration requirements

### 4. Agent Assignment Analysis
- Determine which agents are needed based on requirements:
  - **Architect Agent**: System design, technology selection
  - **Frontend Agent**: UI/UX implementation, client-side features
  - **Backend Agent**: API development, data processing, integrations
  - **QA Agent**: Testing, validation, quality assurance
  - **DevOps Agent**: Deployment, infrastructure, monitoring

### 5. Multi-Agent Research (Advanced)
**IMPORTANT**: When reaching this step, pause and prompt the user:
> "Can you spin up multiple research agents and do this all at the same time?"

Then proceed with:
- Spawn 6+ parallel research agents for comprehensive documentation gathering
- Research external APIs and integrations with concurrent processing
- Gather technology-specific documentation (30-100+ pages per technology)
- Organize research in `/research/[technology]/page1.md`, `/research/[technology]/page2.md` format
- Use enhanced Jina scraping with retry logic for 404s and failed requests
- Filter out CSS/design content, focus only on documentation
- Store Jina scraping method in memory:
  ```bash
  curl "https://r.jina.ai/https://platform.openai.com/docs/" \
    -H "Authorization: Bearer jina_033257e7cdf14fd3b948578e2d34986bNtfCCkjHt7_j1Bkp5Kx521rDs2Eb"
  ```
- If a page 404s or does not scrape properly, re-attempt until successful
- Compile comprehensive context for implementation with 9/10 confidence scoring

### 6. Generate Comprehensive PRP
- Use the `PRPs/templates/prp_base.md` template
- Fill in all sections with researched information
- Include agent coordination protocols
- Add validation gates and success criteria
- Integrate MCP health check requirements

### 7. Save and Validate
- Save PRP to `PRPs/generated/{feature-name}.md`
- Validate completeness and accuracy
- Provide confidence score (1-10)
- Include next steps and execution guidance

## Example Output

After generation, you'll receive:

1. **Comprehensive PRP Document** saved to `PRPs/generated/`
2. **Confidence Score** indicating implementation readiness
3. **Agent Assignment Summary** with task breakdown
4. **Next Steps** for PRP execution
5. **Validation Checklist** for quality assurance

## Multi-Agent Research Mode

For complex features, I can spawn multiple research agents simultaneously:

```
/generate-prp initial.md --research-mode advanced
```

This will:
- Create 6+ parallel research agents
- Scrape 30-100+ documentation pages
- Organize research by technology in `research/` directories
- Generate PRPs with 9/10 confidence scores for one-pass implementation

## Integration with AI Guided SaaS

This command is specifically optimized for your project:

- **MCP Integration**: Includes health check protocols
- **Multi-Agent Coordination**: Leverages your existing agent system
- **Type Safety**: Ensures TypeScript compatibility
- **Production Ready**: Follows your deployment patterns
- **Context Engineering**: Uses comprehensive context for better results

## Files Created

1. `PRPs/generated/{feature-name}.md` - Main PRP document
2. `research/{technology}/` - Research documentation (if advanced mode)
3. `ACTION_LOG.md` - Updated with PRP generation activity
4. Agent coordination files updated as needed

## Validation Gates

Each generated PRP includes validation gates that must pass:

- [ ] TypeScript compilation
- [ ] Linting and code quality
- [ ] Unit and integration tests
- [ ] Performance benchmarks
- [ ] Security requirements
- [ ] MCP health checks
- [ ] Agent coordination protocols

Ready to generate your PRP! Provide the initial requirements file or feature description.