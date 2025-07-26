# Project Waste Eliminator Agent

A world-class MCP server that analyzes, refactors, and optimizes software projects to eliminate all forms of waste and technical debt.

## Features

- **Comprehensive Code Analysis**: Detects dead code, duplicates, complexity, and performance bottlenecks
- **Elite-Level Refactoring**: Applies industry best practices and design patterns automatically
- **Continuous Monitoring**: Watches for waste introduction in real-time
- **Detailed Reporting**: Generates actionable reports in multiple formats
- **Orchestration Ready**: Integrates seamlessly with multi-agent development environments

## Installation

```bash
cd mcp/waste-eliminator-agent
npm install
npm run build
```

## Usage

### Standalone Mode

```bash
npm start
```

### With Orchestration

```bash
ENABLE_ORCHESTRATION=true ORCHESTRATOR_URL=http://localhost:3456 npm start
```

## Available Tools

### analyze_project
Scans entire project for waste and optimization opportunities.

```json
{
  "projectPath": "/path/to/project",
  "depth": "standard" // quick | standard | deep
}
```

### refactor_code
Refactors specific code areas to eliminate waste.

```json
{
  "filePath": "/path/to/file.ts",
  "scope": "file", // file | function | class | module
  "targetName": "functionName" // optional
}
```

### detect_duplicates
Finds duplicate code patterns across the project.

```json
{
  "projectPath": "/path/to/project",
  "threshold": 0.8 // similarity threshold (0-1)
}
```

### optimize_imports
Cleans up and optimizes import statements.

```json
{
  "projectPath": "/path/to/project",
  "removeUnused": true,
  "sortImports": true
}
```

### generate_waste_report
Generates comprehensive waste elimination report.

```json
{
  "projectPath": "/path/to/project",
  "format": "markdown" // json | markdown | html
}
```

### monitor_continuous
Enables real-time waste detection.

```json
{
  "projectPath": "/path/to/project",
  "interval": 300, // seconds
  "webhookUrl": "https://your-webhook.com" // optional
}
```

### check_performance
Analyzes performance bottlenecks.

```json
{
  "filePath": "/path/to/file.ts",
  "includeAsyncPatterns": true
}
```

## Configuration

### Environment Variables

- `LOG_LEVEL`: Logging level (debug | info | warn | error)
- `LOG_DIR`: Directory for log files
- `ENABLE_ORCHESTRATION`: Enable orchestration integration
- `ORCHESTRATOR_URL`: URL of the orchestration server

## Integration with AI Guided SaaS

This agent is designed to work seamlessly with the AI Guided SaaS orchestration system:

1. **Automatic Registration**: The agent registers itself with the orchestrator on startup
2. **Event-Driven**: Responds to orchestrator commands and requests
3. **Heartbeat Monitoring**: Maintains connection health with regular heartbeats
4. **Collaborative Workflow**: Works with other agents to optimize the entire codebase

## Example Workflow

1. **Initial Analysis**
   ```
   analyze_project -> detect_duplicates -> generate_waste_report
   ```

2. **Optimization Phase**
   ```
   refactor_code -> optimize_imports -> check_performance
   ```

3. **Continuous Improvement**
   ```
   monitor_continuous -> automatic refactoring -> report generation
   ```

## Best Practices

1. **Start with Analysis**: Always analyze before refactoring
2. **Incremental Changes**: Make small, verifiable changes
3. **Monitor Impact**: Use continuous monitoring to prevent regression
4. **Review Reports**: Regularly review waste reports for insights

## Development

### Running Tests
```bash
npm test
```

### Development Mode
```bash
npm run dev
```

### Building
```bash
npm run build
```

## License

Part of AI Guided SaaS - Proprietary