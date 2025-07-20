# Kiro IDE Integration

## Overview

AI Guided SaaS integrates with Kiro IDE to provide a complete visual development environment with AI-powered assistance. This integration enables:

- Visual code editing with syntax highlighting
- Real-time collaboration
- AI-powered code suggestions and completions
- Integrated terminal and debugging
- Project scaffolding and templates
- Live preview and hot reload

## Features

### 1. Visual IDE Interface

The Kiro IDE component provides a full-featured development environment:

```typescript
import { KiroIDE } from '@/components/ide/KiroIDE'

// Use in your component
<KiroIDE 
  projectId="your-project-id"
  onClose={() => console.log('IDE closed')}
/>
```

**Components:**
- File Explorer with tree view
- Multi-tab code editor
- Integrated terminal
- AI assistant panel
- Debugging tools

### 2. Project Setup Wizard

Create new projects with the Kiro project setup component:

```typescript
import { KiroProjectSetup } from '@/components/ide/KiroProjectSetup'

<KiroProjectSetup
  onProjectCreated={(projectId) => {
    // Open the project in IDE
  }}
  initialData={{
    name: 'My Project',
    type: 'web',
    framework: 'nextjs'
  }}
/>
```

**Supported Project Types:**
- Web Applications (Next.js, React, Vue, Angular, Svelte)
- Mobile Apps (React Native, Flutter, Ionic)
- Desktop Applications (Electron, Tauri)
- API Services (Express, FastAPI, Django)
- Libraries/Packages

### 3. AI-Powered Features

#### Code Suggestions
```typescript
const { getAISuggestions, applyAISuggestion } = useKiroIDE()

// Get suggestions for current file
const suggestions = await getAISuggestions('src/app/page.tsx')

// Apply a suggestion
await applyAISuggestion(suggestions.suggestions[0].id)
```

#### Auto-completions
```typescript
const completions = await getCompletions('src/app/page.tsx', {
  line: 10,
  character: 15
})
```

#### Diagnostics and Quick Fixes
```typescript
// Run diagnostics
const diagnostics = await runDiagnostics(projectId)

// Apply quick fix
await applyQuickFix('src/app/page.tsx', 10, 0)
```

### 4. File Operations

```typescript
const { 
  readFile, 
  writeFile, 
  createFile, 
  deleteFile, 
  renameFile,
  getFileTree 
} = useKiroIDE()

// Read a file
const file = await readFile('/src/app/page.tsx')

// Write content
await writeFile('/src/app/page.tsx', updatedContent)

// Create new file
await createFile('/src/components/Button.tsx', componentCode)

// Get project structure
const tree = await getFileTree(projectId)
```

### 5. Terminal Integration

```typescript
const { createTerminal, executeCommand, closeTerminal } = useKiroIDE()

// Create new terminal
const terminal = await createTerminal({
  name: 'Build Terminal',
  cwd: '/project/root'
})

// Execute commands
await executeCommand(terminal.id, 'npm install')
await executeCommand(terminal.id, 'npm run dev')

// Close when done
await closeTerminal(terminal.id)
```

### 6. Debugging Support

```typescript
const { 
  startDebugSession, 
  setBreakpoint, 
  stepOver, 
  stepInto, 
  continue 
} = useKiroIDE()

// Start debug session
const session = await startDebugSession({
  name: 'Debug App',
  type: 'node',
  request: 'launch',
  configuration: {
    program: '${workspaceFolder}/src/index.ts'
  }
})

// Set breakpoints
await setBreakpoint('/src/app/page.tsx', 25)

// Control execution
await stepOver(session.id)
await continue(session.id)
```

## Configuration

### Environment Variables

```env
# Kiro IDE Configuration
NEXT_PUBLIC_KIRO_API_URL=http://localhost:8080
KIRO_API_KEY=your-api-key
```

### Client Configuration

```typescript
import { getKiroClient } from '@/lib/ide/kiro-client'

const client = getKiroClient({
  apiUrl: process.env.NEXT_PUBLIC_KIRO_API_URL,
  apiKey: process.env.KIRO_API_KEY,
  theme: 'dark',
  language: 'en'
})
```

## Project Templates

Kiro includes templates for common project types:

### Next.js Application
- TypeScript setup
- App Router structure
- Tailwind CSS
- ESLint & Prettier
- Testing setup

### Express API
- TypeScript configuration
- Route structure
- Middleware setup
- Database models
- Authentication

### React Native App
- Expo or bare workflow
- Navigation setup
- Component library
- State management

## WebSocket Events

Kiro uses WebSocket for real-time features:

```typescript
// Listen for file changes
client.on('fileChanged', ({ path, content }) => {
  console.log(`File ${path} was modified`)
})

// Terminal output
client.on('terminal.output', ({ terminalId, output }) => {
  console.log(`Terminal ${terminalId}: ${output}`)
})

// AI suggestions
client.on('ai.suggestion', (suggestions) => {
  console.log('New AI suggestions available')
})

// Connection status
client.on('disconnected', () => {
  console.log('Lost connection to Kiro')
})
```

## Mock Server

For development without a Kiro server:

```typescript
import { KiroServerMock } from '@/lib/ide/kiro-server-mock'

// Mock server provides same API as real server
const project = await KiroServerMock.createProject({
  name: 'Test Project',
  type: 'web',
  framework: 'nextjs',
  language: 'typescript'
})

const file = await KiroServerMock.readFile(project.id, '/src/app/page.tsx')
```

## UI Components

### IDE Layout
- Resizable panels
- Tabbed interface
- Dark/light theme support
- Customizable layout

### File Explorer
- Tree view navigation
- Context menus
- Drag & drop support
- File search

### Code Editor
- Syntax highlighting
- Code folding
- Multi-cursor editing
- Find & replace
- Code formatting

### Terminal
- Multiple terminals
- Command history
- ANSI color support
- Shell integration

## Best Practices

1. **Connection Management**
   - Always check connection status
   - Handle disconnections gracefully
   - Implement reconnection logic

2. **File Operations**
   - Save frequently
   - Use atomic operations
   - Handle conflicts

3. **Performance**
   - Lazy load large files
   - Debounce file saves
   - Cache file contents

4. **Error Handling**
   - Show user-friendly messages
   - Log errors for debugging
   - Provide recovery options

## Troubleshooting

### Connection Issues
```typescript
// Check connection status
if (!connected) {
  await connect()
}

// Handle connection errors
try {
  await connect()
} catch (error) {
  console.error('Failed to connect:', error)
  // Show fallback UI
}
```

### File Sync Issues
- Check file permissions
- Verify project structure
- Clear local cache

### Performance Problems
- Reduce file watchers
- Optimize large files
- Use virtual scrolling

## Security Considerations

1. **API Key Management**
   - Store securely in environment variables
   - Rotate keys regularly
   - Use different keys per environment

2. **File Access**
   - Validate file paths
   - Implement access controls
   - Sanitize file contents

3. **Code Execution**
   - Run in sandboxed environment
   - Limit resource usage
   - Monitor for malicious code