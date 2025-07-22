# Tech Stack Identification Workflow

## Purpose
Analyze existing repositories to detect current technology stack with confidence scoring and risk assessment.

## Prerequisites
- Python 3.7+ available
- Project directory accessible
- Agent OS detect_stack.py script available

## Workflow Steps

### 1. Initial Assessment
Before running automated detection:

```bash
# Quick manual scan for obvious indicators
ls -la                    # Check root files
cat package.json 2>/dev/null | head -20
cat requirements.txt 2>/dev/null
cat composer.json 2>/dev/null
ls -la .env* 2>/dev/null
```

**Look for immediate red flags:**
- Multiple framework config files (conflicting stacks)
- Missing fundamental files (no package.json in JS project)
- Obvious security issues (API keys in plain sight)

### 2. Run Automated Detection
Execute the stack detection script:

```bash
# Basic detection
python3 .agent-os/scripts/detect_stack.py

# With verbose output
python3 .agent-os/scripts/detect_stack.py --verbose

# Custom output location
python3 .agent-os/scripts/detect_stack.py --output custom-stack-report.json

# Dry run to see what would be detected
python3 .agent-os/scripts/detect_stack.py --dry-run --verbose
```

### 3. Analyze Results
Review the generated `reports/stack.json`:

```bash
# Pretty print the results
cat reports/stack.json | jq '.'

# Check confidence scores
cat reports/stack.json | jq '.confidence'

# List detected components
cat reports/stack.json | jq '.detectedComponents'

# Review red flags
cat reports/stack.json | jq '.redFlags'

# Check recommendations
cat reports/stack.json | jq '.recommendations'
```

### 4. Manual Verification
For components with confidence < 85%, perform manual verification:

#### Runtime Environment
```bash
# Check Node.js version and package manager
node --version
npm --version
yarn --version 2>/dev/null

# Check for other runtimes
python3 --version 2>/dev/null
go version 2>/dev/null
rustc --version 2>/dev/null
php --version 2>/dev/null
```

#### Framework Detection
```bash
# Check for framework-specific files
find . -name "next.config.*" -type f
find . -name "vue.config.*" -type f
find . -name "angular.json" -type f
find . -name "svelte.config.*" -type f
```

#### Database Connections
```bash
# Look for database configuration
grep -r "DATABASE_URL" . 2>/dev/null
grep -r "MONGODB_URI" . 2>/dev/null
grep -r "REDIS_URL" . 2>/dev/null
find . -name "schema.prisma" -type f
find . -name "*.sql" -type f
```

### 5. Gap Analysis
Identify missing components for complete stack:

#### Essential Missing Components
- **No Authentication**: If no auth system detected
- **No Database**: If no data persistence layer found
- **No Testing**: If no testing framework present
- **No Deployment**: If no deployment configuration found

#### Create Gap/Risk Matrix
```
Component    | Present | Confidence | Risk Level | Action Required
-------------|---------|------------|------------|----------------
Runtime      | ✓       | 95%        | Low        | None
Framework    | ✓       | 90%        | Low        | Verify version compatibility
Database     | ✗       | N/A        | High       | Implement data layer
Auth         | ✗       | N/A        | High       | Add authentication
Testing      | ✓       | 75%        | Medium     | Expand test coverage
Deployment   | ✓       | 98%        | Low        | None
```

### 6. Create Stack Report
Generate human-readable stack report:

```bash
# Use template to create formatted report
python3 -c "
import json
with open('reports/stack.json', 'r') as f:
    data = json.load(f)
    
print(f'''# Tech Stack Analysis Report
Generated: $(date)

## Summary
- **Overall Confidence**: {data.get('confidence', 0)}%
- **Components Detected**: {len(data.get('detectedComponents', []))}
- **Red Flags**: {len(data.get('redFlags', []))}
- **Recommendations**: {len(data.get('recommendations', []))}

## Stack Overview''')

if data.get('runtime'):
    runtime = data['runtime']
    print(f'**Runtime**: {runtime.get('language', 'unknown')} ({runtime.get('environment', 'unknown')})')

if data.get('webFramework'):
    framework = data['webFramework']
    print(f'**Framework**: {framework.get('name')} v{framework.get('version', 'unknown')}')

if data.get('database'):
    db = data['database']
    print(f'**Database**: {db.get('primary', 'none')} + {db.get('orm', 'none')}')
''' > reports/stack-report.md
```

### 7. Address Critical Issues
Prioritize red flags by severity:

#### Critical (Fix Immediately)
- Security vulnerabilities
- Version incompatibilities
- Build-breaking configurations

#### High (Fix This Sprint)  
- Missing essential components
- Performance issues
- Deprecated dependencies

#### Medium (Plan for Next Sprint)
- Code quality improvements
- Testing gaps
- Documentation needs

### 8. Save Stack Context
Store results for future reference:

```bash
# Copy to Agent OS context
cp reports/stack.json .agent-os/context/current-stack.json

# Create backup with timestamp
cp reports/stack.json "reports/stack-$(date +%Y%m%d-%H%M%S).json"

# Update project documentation
echo "Stack last analyzed: $(date)" >> README.md
```

## Decision Points

### High Confidence (95%+)
- ✅ **Proceed**: Use detected stack for further planning
- ✅ **Trust**: Confidence level sufficient for automated decisions

### Medium Confidence (80-94%)
- ⚠️ **Verify**: Manual verification recommended
- ⚠️ **Cautious**: Use detected stack but validate key assumptions

### Low Confidence (< 80%)
- ❌ **Manual Review**: Require human verification
- ❌ **Investigate**: Deeper analysis needed before proceeding

## Output Artifacts

### Required Files
- `reports/stack.json` - Machine-readable stack data
- `reports/stack-report.md` - Human-readable analysis
- `.agent-os/context/current-stack.json` - Agent context

### Optional Files
- `docs/architecture/stack-analysis.md` - Detailed technical analysis
- `docs/migration-plan.md` - If stack changes needed
- `reports/dependency-audit.json` - Security and version analysis

## Integration Points

### Next Steps After Stack Identification
1. **If New Project**: Use `recommend-tech-stack.md` workflow
2. **If Architecture Needed**: Use `generate-project-structure.md` workflow
3. **If Planning Required**: Use `create-development-roadmap.md` workflow

### AI Assistant Integration
This workflow should be triggered by:
- `/identify-tech-stack` command
- New project analysis requests
- Architecture review requests
- Pre-migration assessments

## Error Handling

### Common Issues
- **Python not available**: Install Python 3.7+ or use alternative detection methods
- **Permission denied**: Ensure read access to project files
- **Large repositories**: May take time to scan, consider excluding build directories
- **Network dependencies**: Some detection may require internet access

### Fallback Procedures
1. **Manual Detection**: Use checklist-based analysis if automated fails
2. **Partial Results**: Proceed with high-confidence components, manual verify others
3. **External Tools**: Use `npm ls`, `pip list`, etc. for additional verification

This workflow ensures comprehensive, confident tech stack identification with appropriate human oversight for critical decisions.
