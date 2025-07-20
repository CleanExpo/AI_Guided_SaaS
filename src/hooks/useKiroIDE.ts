import { useState, useCallback, useEffect } from 'react'
import { 
  getKiroClient,
  KiroClient, 
  KiroProject, 
  KiroFile, 
  KiroFileTree,
  KiroTerminal,
  KiroAIAssistance,
  KiroCompletion,
  KiroDiagnostic,
  KiroDebugSession
} from '@/lib/ide/kiro-client'
import { useToast } from '@/components/ui/use-toast'

export interface UseKiroIDEReturn {
  // Connection
  connected: boolean
  connect: () => Promise<void>
  disconnect: () => void
  
  // Project management
  createProject: (project: any) => Promise<KiroProject>
  openProject: (projectId: string) => Promise<KiroProject>
  saveProject: (projectId: string) => Promise<void>
  listProjects: () => Promise<KiroProject[]>
  
  // File operations
  readFile: (path: string) => Promise<KiroFile>
  writeFile: (path: string, content: string) => Promise<void>
  createFile: (path: string, content?: string) => Promise<void>
  deleteFile: (path: string) => Promise<void>
  renameFile: (oldPath: string, newPath: string) => Promise<void>
  getFileTree: (projectId: string) => Promise<KiroFileTree>
  
  // Terminal operations
  createTerminal: (config?: Partial<KiroTerminal>) => Promise<KiroTerminal>
  executeCommand: (terminalId: string, command: string) => Promise<void>
  closeTerminal: (terminalId: string) => Promise<void>
  
  // AI assistance
  getAISuggestions: (file: string, position?: any) => Promise<KiroAIAssistance>
  applyAISuggestion: (suggestionId: string) => Promise<void>
  getCompletions: (file: string, position: any) => Promise<KiroCompletion[]>
  runDiagnostics: (projectId: string) => Promise<KiroDiagnostic[]>
  applyQuickFix: (file: string, line: number, fixIndex: number) => Promise<void>
  
  // Debugging
  startDebugSession: (config: any) => Promise<KiroDebugSession>
  setBreakpoint: (file: string, line: number, condition?: string) => Promise<void>
  stepOver: (sessionId: string) => Promise<void>
  stepInto: (sessionId: string) => Promise<void>
  stepOut: (sessionId: string) => Promise<void>
  continue: (sessionId: string) => Promise<void>
  stopDebugSession: (sessionId: string) => Promise<void>
  
  // State
  loading: boolean
  error: string | null
  currentProject: KiroProject | null
  openFiles: KiroFile[]
  terminals: KiroTerminal[]
  debugSessions: KiroDebugSession[]
}

export function useKiroIDE(): UseKiroIDEReturn {
  const { toast } = useToast()
  const [client, setClient] = useState<KiroClient | null>(null)
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentProject, setCurrentProject] = useState<KiroProject | null>(null)
  const [openFiles, setOpenFiles] = useState<KiroFile[]>([])
  const [terminals, setTerminals] = useState<KiroTerminal[]>([])
  const [debugSessions, setDebugSessions] = useState<KiroDebugSession[]>([])

  // Initialize client
  useEffect(() => {
    const kiroClient = getKiroClient()
    setClient(kiroClient)
    
    // Set up event listeners
    kiroClient.on('fileChanged', handleFileChanged)
    kiroClient.on('terminal.created', handleTerminalCreated)
    kiroClient.on('terminal.closed', handleTerminalClosed)
    kiroClient.on('debug.sessionStarted', handleDebugSessionStarted)
    kiroClient.on('debug.sessionEnded', handleDebugSessionEnded)
    kiroClient.on('disconnected', handleDisconnected)
    
    return () => {
      // Clean up event listeners
      kiroClient.off('fileChanged', handleFileChanged)
      kiroClient.off('terminal.created', handleTerminalCreated)
      kiroClient.off('terminal.closed', handleTerminalClosed)
      kiroClient.off('debug.sessionStarted', handleDebugSessionStarted)
      kiroClient.off('debug.sessionEnded', handleDebugSessionEnded)
      kiroClient.off('disconnected', handleDisconnected)
    }
  }, [])

  // Event handlers
  const handleFileChanged = (data: { path: string; content: string }) => {
    setOpenFiles(prev => 
      prev.map(file => 
        file.path === data.path 
          ? { ...file, content: data.content }
          : file
      )
    )
  }

  const handleTerminalCreated = (terminal: KiroTerminal) => {
    setTerminals(prev => [...prev, terminal])
  }

  const handleTerminalClosed = (terminalId: string) => {
    setTerminals(prev => prev.filter(t => t.id !== terminalId))
  }

  const handleDebugSessionStarted = (session: KiroDebugSession) => {
    setDebugSessions(prev => [...prev, session])
  }

  const handleDebugSessionEnded = (sessionId: string) => {
    setDebugSessions(prev => prev.filter(s => s.id !== sessionId))
  }

  const handleDisconnected = () => {
    setConnected(false)
    toast({
      title: 'Disconnected',
      description: 'Lost connection to Kiro IDE',
      variant: 'destructive'
    })
  }

  // Connection methods
  const connect = useCallback(async () => {
    if (!client) return
    
    setLoading(true)
    setError(null)
    
    try {
      await client.connect()
      setConnected(true)
      toast({
        title: 'Connected',
        description: 'Successfully connected to Kiro IDE'
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to connect'
      setError(message)
      toast({
        title: 'Connection Error',
        description: message,
        variant: 'destructive'
      })
      throw err
    } finally {
      setLoading(false)
    }
  }, [client])

  const disconnect = useCallback(() => {
    if (!client) return
    client.disconnect()
    setConnected(false)
  }, [client])

  // Project management
  const createProject = useCallback(async (project: any) => {
    if (!client) throw new Error('Client not initialized')
    
    setLoading(true)
    setError(null)
    
    try {
      const newProject = await client.createProject(project)
      toast({
        title: 'Project Created',
        description: `Successfully created project "${newProject.name}"`
      })
      return newProject
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create project'
      setError(message)
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive'
      })
      throw err
    } finally {
      setLoading(false)
    }
  }, [client])

  const openProject = useCallback(async (projectId: string) => {
    if (!client) throw new Error('Client not initialized')
    
    setLoading(true)
    setError(null)
    
    try {
      const project = await client.openProject(projectId)
      setCurrentProject(project)
      toast({
        title: 'Project Opened',
        description: `Opened project "${project.name}"`
      })
      return project
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to open project'
      setError(message)
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive'
      })
      throw err
    } finally {
      setLoading(false)
    }
  }, [client])

  const saveProject = useCallback(async (projectId: string) => {
    if (!client) throw new Error('Client not initialized')
    
    setLoading(true)
    setError(null)
    
    try {
      await client.saveProject(projectId)
      toast({
        title: 'Project Saved',
        description: 'Project saved successfully'
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save project'
      setError(message)
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive'
      })
      throw err
    } finally {
      setLoading(false)
    }
  }, [client])

  const listProjects = useCallback(async () => {
    if (!client) throw new Error('Client not initialized')
    
    setLoading(true)
    setError(null)
    
    try {
      return await client.listProjects()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to list projects'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [client])

  // File operations
  const readFile = useCallback(async (path: string) => {
    if (!client) throw new Error('Client not initialized')
    
    try {
      const file = await client.readFile(path)
      setOpenFiles(prev => {
        const exists = prev.find(f => f.path === path)
        if (exists) {
          return prev.map(f => f.path === path ? file : f)
        }
        return [...prev, file]
      })
      return file
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to read file'
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive'
      })
      throw err
    }
  }, [client])

  const writeFile = useCallback(async (path: string, content: string) => {
    if (!client) throw new Error('Client not initialized')
    
    try {
      await client.writeFile(path, content)
      setOpenFiles(prev => 
        prev.map(f => f.path === path ? { ...f, content } : f)
      )
      toast({
        title: 'File Saved',
        description: `${path} saved successfully`
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to write file'
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive'
      })
      throw err
    }
  }, [client])

  const createFile = useCallback(async (path: string, content?: string) => {
    if (!client) throw new Error('Client not initialized')
    
    try {
      await client.createFile(path, content)
      toast({
        title: 'File Created',
        description: `${path} created successfully`
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create file'
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive'
      })
      throw err
    }
  }, [client])

  const deleteFile = useCallback(async (path: string) => {
    if (!client) throw new Error('Client not initialized')
    
    try {
      await client.deleteFile(path)
      setOpenFiles(prev => prev.filter(f => f.path !== path))
      toast({
        title: 'File Deleted',
        description: `${path} deleted successfully`
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete file'
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive'
      })
      throw err
    }
  }, [client])

  const renameFile = useCallback(async (oldPath: string, newPath: string) => {
    if (!client) throw new Error('Client not initialized')
    
    try {
      await client.renameFile(oldPath, newPath)
      setOpenFiles(prev => 
        prev.map(f => f.path === oldPath ? { ...f, path: newPath } : f)
      )
      toast({
        title: 'File Renamed',
        description: 'File renamed successfully'
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to rename file'
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive'
      })
      throw err
    }
  }, [client])

  const getFileTree = useCallback(async (projectId: string) => {
    if (!client) throw new Error('Client not initialized')
    
    try {
      return await client.getFileTree(projectId)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get file tree'
      throw new Error(message)
    }
  }, [client])

  // Terminal operations
  const createTerminal = useCallback(async (config?: Partial<KiroTerminal>) => {
    if (!client) throw new Error('Client not initialized')
    
    try {
      const terminal = await client.createTerminal(config)
      setTerminals(prev => [...prev, terminal])
      return terminal
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create terminal'
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive'
      })
      throw err
    }
  }, [client])

  const executeCommand = useCallback(async (terminalId: string, command: string) => {
    if (!client) throw new Error('Client not initialized')
    
    try {
      await client.executeCommand(terminalId, command)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to execute command'
      throw new Error(message)
    }
  }, [client])

  const closeTerminal = useCallback(async (terminalId: string) => {
    if (!client) throw new Error('Client not initialized')
    
    try {
      await client.closeTerminal(terminalId)
      setTerminals(prev => prev.filter(t => t.id !== terminalId))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to close terminal'
      throw new Error(message)
    }
  }, [client])

  // AI assistance methods (similar pattern for remaining methods)
  const getAISuggestions = useCallback(async (file: string, position?: any) => {
    if (!client) throw new Error('Client not initialized')
    return client.getAISuggestions(file, position)
  }, [client])

  const applyAISuggestion = useCallback(async (suggestionId: string) => {
    if (!client) throw new Error('Client not initialized')
    
    try {
      await client.applyAISuggestion(suggestionId)
      toast({
        title: 'Success',
        description: 'AI suggestion applied successfully'
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to apply suggestion'
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive'
      })
      throw err
    }
  }, [client])

  const getCompletions = useCallback(async (file: string, position: any) => {
    if (!client) throw new Error('Client not initialized')
    return client.getCompletions(file, position)
  }, [client])

  const runDiagnostics = useCallback(async (projectId: string) => {
    if (!client) throw new Error('Client not initialized')
    return client.runDiagnostics(projectId)
  }, [client])

  const applyQuickFix = useCallback(async (file: string, line: number, fixIndex: number) => {
    if (!client) throw new Error('Client not initialized')
    return client.applyQuickFix(file, line, fixIndex)
  }, [client])

  // Debugging methods
  const startDebugSession = useCallback(async (config: any) => {
    if (!client) throw new Error('Client not initialized')
    const session = await client.startDebugSession(config)
    setDebugSessions(prev => [...prev, session])
    return session
  }, [client])

  const setBreakpoint = useCallback(async (file: string, line: number, condition?: string) => {
    if (!client) throw new Error('Client not initialized')
    return client.setBreakpoint(file, line, condition)
  }, [client])

  const stepOver = useCallback(async (sessionId: string) => {
    if (!client) throw new Error('Client not initialized')
    return client.stepOver(sessionId)
  }, [client])

  const stepInto = useCallback(async (sessionId: string) => {
    if (!client) throw new Error('Client not initialized')
    return client.stepInto(sessionId)
  }, [client])

  const stepOut = useCallback(async (sessionId: string) => {
    if (!client) throw new Error('Client not initialized')
    return client.stepOut(sessionId)
  }, [client])

  const continue_ = useCallback(async (sessionId: string) => {
    if (!client) throw new Error('Client not initialized')
    return client.continue(sessionId)
  }, [client])

  const stopDebugSession = useCallback(async (sessionId: string) => {
    if (!client) throw new Error('Client not initialized')
    await client.stopDebugSession(sessionId)
    setDebugSessions(prev => prev.filter(s => s.id !== sessionId))
  }, [client])

  return {
    // Connection
    connected,
    connect,
    disconnect,
    
    // Project management
    createProject,
    openProject,
    saveProject,
    listProjects,
    
    // File operations
    readFile,
    writeFile,
    createFile,
    deleteFile,
    renameFile,
    getFileTree,
    
    // Terminal operations
    createTerminal,
    executeCommand,
    closeTerminal,
    
    // AI assistance
    getAISuggestions,
    applyAISuggestion,
    getCompletions,
    runDiagnostics,
    applyQuickFix,
    
    // Debugging
    startDebugSession,
    setBreakpoint,
    stepOver,
    stepInto,
    stepOut,
    continue: continue_,
    stopDebugSession,
    
    // State
    loading,
    error,
    currentProject,
    openFiles,
    terminals,
    debugSessions
  }
}