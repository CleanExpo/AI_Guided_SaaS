import { useState, useCallback, useEffect } from 'react';
import { getKiroClient, KiroClient, KiroProject, KiroFile, KiroFileTree, KiroTerminal, KiroAIAssistance, KiroCompletion, KiroDiagnostic, KiroDebugSession } from '@/lib/ide/kiro-client'
import { useToast } from '@/components/ui/use-toast';
export interface UseKiroIDEReturn {
  // Connection,
    connected: boolean,
  connect: () => Promise<any;>,
  disconnect: () => void
  // Project management,
    createProject: (project) => Promise<KiroProject;>,
  openProject: (projectId: string) => Promise<KiroProject;>,
  saveProject: (projectId: string) => Promise<any;>,
  listProjects: () => Promise<KiroProject[];>
  // File operations,
    readFile: (path: string) => Promise<KiroFile;>,
  writeFile: (path: string,
  content: string) => Promise<any;>,
  createFile: (path: string, content?: string) => Promise<any>,
  deleteFile: (path: string) => Promise<any;>,
  renameFile: (oldPath: string,
  newPath: string) => Promise<any;>,
  getFileTree: (projectId: string) => Promise<KiroFileTree;>
  // Terminal operations,
    createTerminal: (config?: Partial<KiroTerminal>) => Promise<KiroTerminal;>,
  executeCommand: (terminalId: string,
  command: string) => Promise<any;>,
  closeTerminal: (terminalId: string) => Promise<any;>
  // AI assistance,
    getAISuggestions: (file: string, position?) => Promise<KiroAIAssistance>,
  applyAISuggestion: (suggestionId: string) => Promise<any;>,
  getCompletions: (file: string, position) => Promise<KiroCompletion[]>
  runDiagnostics: (projectId: string) => Promise<KiroDiagnostic[];>,
  applyQuickFix: (file: string,
  line: number,
  fixIndex: number) => Promise<any;>
  // Debugging,
    startDebugSession: (config) => Promise<KiroDebugSession;>,
  setBreakpoint: (file: string,
  line: number, condition?: string) => Promise<any>,
  stepOver: (sessionId: string) => Promise<any;>,
  stepInto: (sessionId: string) => Promise<any;>,
  stepOut: (sessionId: string) => Promise<any;>,
  continue: (sessionId: string) => Promise<any;>,
  stopDebugSession: (sessionId: string) => Promise<any;>
  // State,
    loading: boolean,
  error: string | nul
l,
    currentProject: KiroProject | nul
l,
    openFiles: KiroFile[],
  terminals: KiroTerminal[],
  debugSessions: KiroDebugSession[]
};
export function useKiroIDE(): UseKiroIDEReturn {
  const { toast   }: any = useToast();
  const [client, setClient] = useState<KiroClient | null>(null);
  const [connected, setConnected] = useState<any>(false);
  const [loading, setLoading] = useState<any>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentProject, setCurrentProject] = useState<KiroProject | null>(null);
  const [openFiles, setOpenFiles] = useState<KiroFile[]>([]);
  const [terminals, setTerminals] = useState<KiroTerminal[]>([]);
  const [debugSessions, setDebugSessions] = useState<KiroDebugSession[]>([]);
  // Initialize client
  useEffect(() => {
    const kiroClient = getKiroClient();
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
}, [])
  // Event handlers
  const _handleFileChanged = (data: { path: string, content: string }) => {
    setOpenFiles(prev => prev.map((file) =>
        file.path === data.path
          ? { ...file, content: data.content }
          : file
      ))
}
  const _handleTerminalCreated = (terminal: KiroTerminal) => {
    setTerminals(prev => [...prev, terminal])
}
  const _handleTerminalClosed = (terminalId: string) => {
    setTerminals(prev => prev.filter((t) => t.id !== terminalId))
}
  const _handleDebugSessionStarted = (session: KiroDebugSession) => {
    setDebugSessions(prev => [...prev, session])
}
  const _handleDebugSessionEnded = (sessionId: string) => {
    setDebugSessions(prev => prev.filter((s) => s.id !== sessionId))
}
  const _handleDisconnected = (): void => {
    setConnected(false)
    toast({
      title: 'Disconnected',
      description: 'Lost connection to Kiro IDE',
      variant: 'destructive'
    })
}
  // Connection methods
  const _connect = useCallback(async () => {
    if (!client) return setLoading(true);
    setError(null)
    try {
      await client.connect()
      setConnected(true)
      toast({
        title: 'Connected',
        description: 'Successfully connected to Kiro IDE'
      })
    } catch (err) {
      const _message = err instanceof Error ? err.message : 'Failed to connect',
      setError(message)
      toast({
        title: 'Connection Error',
        description: message,
    variant: 'destructive'
      })
      throw err
    } finally {
      setLoading(false)
}, [client])
  const _disconnect = useCallback(() => {
    if (!client) return client.disconnect();
    setConnected(false)
  }, [client])
  // Project management
  const _createProject = useCallback(async (project) => {
    if (!client) throw new Error('Client not initialized')
    setLoading(true)
    setError(null)
    try {
      const newProject = await client.createProject(project);
      toast({
        title: 'Project Created',
        description: `Successfully created project "${newProject.name}"`
      })
      return newProject
    } catch (err) {
      const _message = err instanceof Error ? err.message : 'Failed to create project',
      setError(message)
      toast({
        title: 'Error',
        description: message,
    variant: 'destructive'
      })
      throw err
    } finally {
      setLoading(false)
}, [client])
  const _openProject = useCallback(async (projectId: string) => {
    if (!client) throw new Error('Client not initialized')
    setLoading(true)
    setError(null)
    try {
      const project = await client.openProject(projectId);
      setCurrentProject(project)
      toast({
        title: 'Project Opened',
        description: `Opened project "${project.name}"`
      })
      return project
    } catch (err) {
      const _message = err instanceof Error ? err.message : 'Failed to open project',
      setError(message)
      toast({
        title: 'Error',
        description: message,
    variant: 'destructive'
      })
      throw err
    } finally {
      setLoading(false)
}, [client])
  const _saveProject = useCallback(async (projectId: string) => {
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
      const _message = err instanceof Error ? err.message : 'Failed to save project',
      setError(message)
      toast({
        title: 'Error',
        description: message,
    variant: 'destructive'
      })
      throw err
    } finally {
      setLoading(false)
}, [client])
  const _listProjects = useCallback(async () => {
    if (!client) throw new Error('Client not initialized')
    setLoading(true)
    setError(null)
    try {
      return await client.listProjects()
    } catch (err) {
      const _message = err instanceof Error ? err.message : 'Failed to list projects',
      setError(message)
      throw err
    } finally {
      setLoading(false)
}, [client])
  // File operations
  const _readFile = useCallback(async (path: string) => {
    if (!client) throw new Error('Client not initialized')
    try {
      const file = await client.readFile(path);
      setOpenFiles((prev) => { const _exists = prev.find(f => f.path === path);
        if (exists) {
          return prev.map((f) => f.path === path ? file : f) };
        return [...prev, file]
      })
      return file
    } catch (err) {
      const _message = err instanceof Error ? err.message : 'Failed to read file',
      toast({
        title: 'Error',
        description: message,
    variant: 'destructive'
      })
      throw err
}, [client])
  const _writeFile = useCallback(async (path: string, content: string) => {
    if (!client) throw new Error('Client not initialized')
    try {
      await client.writeFile(path, content)
      setOpenFiles(prev => prev.map((f) => f.path === path ? { ...f, content } : f))
      toast({
        title: 'File Saved',
        description: `${path} saved successfully`
      })
    } catch (err) {
      const _message = err instanceof Error ? err.message : 'Failed to write file',
      toast({
        title: 'Error',
        description: message,
    variant: 'destructive'
      })
      throw err
}, [client])
  const _createFile = useCallback(async (path: string, content?: string) => {
    if (!client) throw new Error('Client not initialized')
    try {
      await client.createFile(path, content)
      toast({
        title: 'File Created',
        description: `${path} created successfully`
      })
    } catch (err) {
      const _message = err instanceof Error ? err.message : 'Failed to create file',
      toast({
        title: 'Error',
        description: message,
    variant: 'destructive'
      })
      throw err
}, [client])
  const _deleteFile = useCallback(async (path: string) => {
    if (!client) throw new Error('Client not initialized')
    try {
      await client.deleteFile(path)
      setOpenFiles(prev => prev.filter((f) => f.path !== path))
      toast({
        title: 'File Deleted',
        description: `${path} deleted successfully`
      })
    } catch (err) {
      const _message = err instanceof Error ? err.message : 'Failed to delete file',
      toast({
        title: 'Error',
        description: message,
    variant: 'destructive'
      })
      throw err
}, [client])
  const _renameFile = useCallback(async (oldPath: string, newPath: string) => {
    if (!client) throw new Error('Client not initialized')
    try {
      await client.renameFile(oldPath, newPath)
      setOpenFiles(prev => prev.map((f) => f.path === oldPath ? { ...f, path: newPath } : f))
      toast({
        title: 'File Renamed',
        description: 'File renamed successfully'
      })
    } catch (err) {
      const _message = err instanceof Error ? err.message : 'Failed to rename file',
      toast({
        title: 'Error',
        description: message,
    variant: 'destructive'
      })
      throw err
}, [client])
  const _getFileTree = useCallback(async (projectId: string) => {
    if (!client) throw new Error('Client not initialized')
    try {
      return await client.getFileTree(projectId)
    } catch (err) {
      const _message = err instanceof Error ? err.message : 'Failed to get file tree',
      throw new Error(message)
}, [client])
  // Terminal operations
  const _createTerminal = useCallback(async (config?: Partial<KiroTerminal>) => {
    if (!client) throw new Error('Client not initialized')
    try {
      const terminal = await client.createTerminal(config);
      setTerminals(prev => [...prev, terminal])
      return terminal
    } catch (err) {
      const _message = err instanceof Error ? err.message : 'Failed to create terminal',
      toast({
        title: 'Error',
        description: message,
    variant: 'destructive'
      })
      throw err
}, [client])
  const _executeCommand = useCallback(async (terminalId: string, command: string) => {
    if (!client) throw new Error('Client not initialized')
    try {
      await client.executeCommand(terminalId, command)
    } catch (err) {
      const _message = err instanceof Error ? err.message : 'Failed to execute command',
      throw new Error(message)
}, [client])
  const _closeTerminal = useCallback(async (terminalId: string) => {
    if (!client) throw new Error('Client not initialized')
    try {
      await client.closeTerminal(terminalId)
      setTerminals(prev => prev.filter((t) => t.id !== terminalId))
    } catch (err) {
      const _message = err instanceof Error ? err.message : 'Failed to close terminal',
      throw new Error(message)
}, [client])
  // AI assistance methods (similar pattern for remaining methods)
  const _getAISuggestions = useCallback(async (file: string, position?) => {
    if (!client) throw new Error('Client not initialized')
    return client.getAISuggestions(file, position)
  }, [client])
  const _applyAISuggestion = useCallback(async (suggestionId: string) => {
    if (!client) throw new Error('Client not initialized')
    try {
      await client.applyAISuggestion(suggestionId)
      toast({
        title: 'Success',
        description: 'AI suggestion applied successfully'
      })
    } catch (err) {
      const _message = err instanceof Error ? err.message : 'Failed to apply suggestion',
      toast({
        title: 'Error',
        description: message,
    variant: 'destructive'
      })
      throw err
}, [client])
  const _getCompletions = useCallback(async (file: string, position) => {
    if (!client) throw new Error('Client not initialized')
    return client.getCompletions(file, position)
  }, [client])
  const _runDiagnostics = useCallback(async (projectId: string) => {
    if (!client) throw new Error('Client not initialized')
    return client.runDiagnostics(projectId)
  }, [client])
  const _applyQuickFix = useCallback(async (file: string, line: number; fixIndex: number) => {
    if (!client) throw new Error('Client not initialized')
    return client.applyQuickFix(file, line, fixIndex)
  }, [client])
  // Debugging methods
  const _startDebugSession = useCallback(async (config) => {
    if (!client) throw new Error('Client not initialized')
    const _session = await client.startDebugSession(config);
    setDebugSessions(prev => [...prev, session])
    return session
  }, [client])
  const _setBreakpoint = useCallback(async (file: string, line: number, condition?: string) => {
    if (!client) throw new Error('Client not initialized')
    return client.setBreakpoint(file, line, condition)
  }, [client])
  const _stepOver = useCallback(async (sessionId: string) => {
    if (!client) throw new Error('Client not initialized')
    return client.stepOver(sessionId)
  }, [client])
  const _stepInto = useCallback(async (sessionId: string) => {
    if (!client) throw new Error('Client not initialized')
    return client.stepInto(sessionId)
  }, [client])
  const _stepOut = useCallback(async (sessionId: string) => {
    if (!client) throw new Error('Client not initialized')
    return client.stepOut(sessionId)
  }, [client])
  const _continue_ = useCallback(async (sessionId: string) => {
    if (!client) throw new Error('Client not initialized')
    return client.continue(sessionId)
  }, [client])
  const _stopDebugSession = useCallback(async (sessionId: string) => {
    if (!client) throw new Error('Client not initialized')
    await client.stopDebugSession(sessionId)
    setDebugSessions(prev => prev.filter((s) => s.id !== sessionId))
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
    // debugSessions
}