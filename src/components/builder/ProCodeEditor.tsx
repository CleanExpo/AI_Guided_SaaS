'use client';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code2, FileText, Folder, FolderOpen, GitBranch, Terminal, Search, Settings, Package, FileCode2, FileJson, Play, Bug, GitCommit, GitPullRequest, ChevronRight, ChevronDown, X, Plus, Save, RefreshCw, Sparkles, Zap, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import Editor from '@monaco-editor/react';
interface FileNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
  content?: string;
};
interface OpenFile {
  path: string;
  name: string;
  content: string;
  language: string;
  isDirty: boolean;
}
export default function ProCodeEditor(): void {
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [fileTree, setFileTree] = useState<FileNode[]>([;
    {
      name: 'src';
      type: 'folder';
      path: '/src';
      children: [
        {
          name: 'App.tsx';
          type: 'file';
          path: '/src/App.tsx';
          content: `import React from 'react';`
import './App.css';
function App(): void {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to AI Guided SaaS</h1>
        <p>Start editing to see AI-powered suggestions!</p>
      </header>
    </div>
  );
}
export default App;``
        },
        {
          name: 'components';
          type: 'folder';
          path: '/src/components';
          children: [
            {
              name: 'Button.tsx';
              type: 'file';
              path: '/src/components/Button.tsx';
              content: `interface ButtonProps {`
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}
export const Button: React.FC<ButtonProps> = ({ ;
  children,
  onClick,
  variant = 'primary'
}) => (
    <button
      className={\`btn btn-\${variant}\`}`
      onClick={onClick}
    >
      {children}
    </button>
  );
};``
            }
          ]
        }
      ]
    },
    {
      name: 'package.json';
      type: 'file';
      path: '/package.json';
      content: `{`
  "name": "ai-guided-app",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0"
  }
}``
    }
  ]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['/src']));
  const [terminalOutput, setTerminalOutput] = useState<string[]>([;
    '$ npm install',
    '✓ Dependencies installed successfully',
    '$ npm run dev',
    '> ai-guided-app@1.0.0 dev',
    '> vite',
    '',
    '  VITE v5.0.0  ready in 523 ms',
    '',
    '  ➜  Local: http://localhost:5173/',
    '  ➜  Network: use --host to expose',
    '  ➜  press h to show help'
  ]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [sidebarTab, setSidebarTab] = useState('explorer');
  const getFileLanguage = (filename: string): string => {
    const ext = filename.split('.').pop();
    switch (ext) {
      case 'ts':
      case 'tsx':
        return 'typescript';
      case 'js':
      case 'jsx':
        return 'javascript';
      case 'json':
        return 'json';
      case 'css':
        return 'css';
      case 'html':
        return 'html';
      default: return 'plaintext';
    }
  };
  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop();
    switch (ext) {
      case 'ts':
      case 'tsx':
      case 'js':
      case 'jsx':
        return <FileCode2 className="w-4 h-4 text-blue-500" />;
      case 'json':
        return <FileJson className="w-4 h-4 text-yellow-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };
  const handleFileClick = (file: FileNode) => {
    if (file.type === 'file') {
      const existingFile = openFiles.find(f => f.path === file.path);
      if (!existingFile) {
        const newFile: OpenFile = {
          path: file.path;
          name: file.name;
          content: file.content || '';
          language: getFileLanguage(file.name);
          isDirty: false
        };
        setOpenFiles([...openFiles, newFile]);
      }
      setActiveFile(file.path);
    }
  };
  const handleFolderToggle = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };
  const handleEditorChange = (value: string | undefined) => {
    if (!activeFile || value === undefined) return;
    setOpenFiles(openFiles.map(file =>
      file.path === activeFile
        ? { ...file, content: value; isDirty: true }
        : file
    ));
    // Simulate AI suggestions
    if (value.includes('//')) {
      setAiSuggestions([
        'Add error handling for this function',
        'Consider using async/await here',
        'This could be optimized with useMemo'
      ]);
    }
  };
  const renderFileTree = (nodes: FileNode[]) => {
    return nodes.map((node) => (
      <div key={node.path}>
        <div
          className={`cn(`
            "flex items-center gap-2 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" activeFile === node.path && "bg-blue-100 dark:bg-blue-900"
          )`}`
          onClick={() => {
            if (node.type === 'folder') {
              handleFolderToggle(node.path);
            } else {
              handleFileClick(node);
            }
          }}
        >
          {node.type === 'folder' ? (
            <>
              {expandedFolders.has(node.path) ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              {expandedFolders.has(node.path) ? (
                <FolderOpen className="w-4 h-4 text-yellow-600" />
              ) : (
                <Folder className="w-4 h-4 text-yellow-600" />
              )}
            </>
          ) : (
            <>
              <div className="w-4" />
              {getFileIcon(node.name)}
            </>
          )}
          <span className="text-sm">{node.name}</span>
        </div>
        {node.type === 'folder' && expandedFolders.has(node.path) && node.children && (
          <div className="ml-4">
            {renderFileTree(node.children)}
          </div>
        )}
      </div>
    ));
  };
  return (
    <div className="h-screen flex bg-gray-900 text-gray-100">
      {/* Activity Bar */}
      <div className="w-12 bg-gray-950 flex flex-col items-center py-2 gap-4">
        <Button
          variant="ghost"
          size="sm"
          className={`cn("w-10 h-10 p-0" sidebarTab === 'explorer' && "bg-gray-800")`}`
          onClick={() => setSidebarTab('explorer')}
        >
          <FileText className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`cn("w-10 h-10 p-0" sidebarTab === 'search' && "bg-gray-800")`}`
          onClick={() => setSidebarTab('search')}
        >
          <Search className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`cn("w-10 h-10 p-0" sidebarTab === 'git' && "bg-gray-800")`}`
          onClick={() => setSidebarTab('git')}
        >
          <GitBranch className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`cn("w-10 h-10 p-0" sidebarTab === 'debug' && "bg-gray-800")`}`
          onClick={() => setSidebarTab('debug')}
        >
          <Bug className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`cn("w-10 h-10 p-0" sidebarTab === 'extensions' && "bg-gray-800")`}`
          onClick={() => setSidebarTab('extensions')}
        >
          <Package className="w-5 h-5" />
        </Button>
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="sm"
          className="w-10 h-10 p-0"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>
      {/* Sidebar */}
      <div className="w-64 bg-gray-850 border-r border-gray-800">
        {sidebarTab === 'explorer' && (
          <div className="h-full flex flex-col">
            <div className="p-2 border-b border-gray-800">
              <h3 className="text-xs font-semibold uppercase text-gray-400">Explorer</h3>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2">
                {renderFileTree(fileTree)}
              </div>
            </ScrollArea>
          </div>
        )}
        {sidebarTab === 'search' && (
          <div className="p-4">
            <h3 className="text-xs font-semibold uppercase text-gray-400 mb-4">Search</h3>
            <Input
              placeholder="Search files..."
              className="bg-gray-800 border-gray-700"
            />
          </div>
        )}
        {sidebarTab === 'git' && (
          <div className="p-4">
            <h3 className="text-xs font-semibold uppercase text-gray-400 mb-4">Source Control</h3>
            <div className="space-y-2">
              <Button variant="outline" size="sm", className="w-full">
                <GitCommit className="w-4 h-4 mr-2" />
                Commit
              </Button>
              <Button variant="outline" size="sm", className="w-full">
                <GitPullRequest className="w-4 h-4 mr-2" />
                Pull Request
              </Button>
            </div>
          </div>
        )}
      </div>
      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Tabs */}
        <div className="bg-gray-850 border-b border-gray-800">
          <div className="flex items-center">
            {openFiles.map((file) => (
              <div
                key={file.path}
                className={`cn(`
                  "flex items-center gap-2 px-4 py-2 border-r border-gray-800 cursor-pointer hover:bg-gray-800" activeFile === file.path && "bg-gray-800"
                )`}`
                onClick={() => setActiveFile(file.path)}
              >
                {getFileIcon(file.name)}
                <span className="text-sm">{file.name}</span>
                {file.isDirty && <span className="text-xs">●</span>}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-4 h-4 p-0 ml-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenFiles(openFiles.filter(f => f.path !== file.path));
                    if (activeFile === file.path) {
                      setActiveFile(openFiles[0]?.path || null);
                    }
                  }}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="h-full px-3"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {/* Editor */}
        <div className="flex-1 flex">
          <div className="flex-1">
            {activeFile && openFiles.find(f => f.path === activeFile) ? (
              <Editor
                height="100%"
                theme="vs-dark"
                language={openFiles.find(f => f.path === activeFile)?.language}
                value={openFiles.find(f => f.path === activeFile)?.content}
                onChange={handleEditorChange}
                options={{
                  minimap: { enabled: true };
                  fontSize: 14;
                  lineNumbers: 'on';
                  rulers: [80];
                  wordWrap: 'on';
                  automaticLayout: true;
                  scrollBeyondLastLine: false;
                  smoothScrolling: true;
                  cursorBlinking: 'smooth';
                  cursorSmoothCaretAnimation: 'on';
                  suggestOnTriggerCharacters: true;
                  quickSuggestions: {
                    other: true;
                    comments: true;
                    strings: true
                  }
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Code2 className="w-16 h-16 mx-auto mb-4" />
                  <p>Select a file to start coding</p>
                </div>
              </div>
            )}
          </div>
          {/* AI Assistant Panel */}
          <div className="w-80 bg-gray-850 border-l border-gray-800">
            <div className="p-4 border-b border-gray-800">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                AI Assistant
              </h3>
            </div>
            <div className="p-4 space-y-4">
              {/* AI Suggestions */}
              {aiSuggestions.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 mb-2">Suggestions</h4>
                  <div className="space-y-2">
                    {aiSuggestions.map((suggestion, i) => (
                      <Card key={i} className="p-3 bg-gray-800 border-gray-700 hover:bg-gray-750 cursor-pointer">
                        <div className="flex items-start gap-2">
                          <Zap className="w-4 h-4 text-yellow-500 mt-0.5" />
                          <p className="text-sm">{suggestion}</p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              {/* Quick Actions */}
              <div>
                <h4 className="text-xs font-semibold text-gray-400 mb-2">Quick Actions</h4>
                <div className="space-y-2">
                  <Button variant="outline" size="sm", className="w-full justify-start">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refactor Code
                  </Button>
                  <Button variant="outline" size="sm", className="w-full justify-start">
                    <Bug className="w-4 h-4 mr-2" />
                    Fix Issues
                  </Button>
                  <Button variant="outline" size="sm", className="w-full justify-start">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Tests
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom Panel - Terminal */}
        <div className="h-64 bg-gray-950 border-t border-gray-800">
          <Tabs defaultValue="terminal", className="h-full">
            <TabsList className="bg-gray-850 border-b border-gray-800 rounded-none">
              <TabsTrigger value="terminal">
                <Terminal className="w-4 h-4 mr-2" />
                Terminal
              </TabsTrigger>
              <TabsTrigger value="problems">
                <Bug className="w-4 h-4 mr-2" />
                Problems
              </TabsTrigger>
              <TabsTrigger value="output">
                <FileText className="w-4 h-4 mr-2" />
                Output
              </TabsTrigger>
              <TabsTrigger value="debug-console">
                <Code2 className="w-4 h-4 mr-2" />
                Debug Console
              </TabsTrigger>
            </TabsList>
            <TabsContent value="terminal", className="h-full p-4">
              <div className="font-mono text-sm">
                {terminalOutput.map((line, i) => (
                  <div key={i} className="text-green-400">{line}</div>
                ))}
                <div className="flex items-center mt-2">
                  <span className="text-green-400">$</span>
                  <input
                    className="flex-1 bg-transparent outline-none ml-2"
                    placeholder="Enter command..."
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="problems", className="h-full p-4">
              <p className="text-sm text-gray-400">No problems detected</p>
            </TabsContent>
            <TabsContent value="output", className="h-full p-4">
              <p className="text-sm text-gray-400">No output</p>
            </TabsContent>
            <TabsContent value="debug-console", className="h-full p-4">
              <p className="text-sm text-gray-400">Debug console inactive</p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      {/* Status Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-blue-600 flex items-center justify-between px-4 text-xs">
        <div className="flex items-center gap-4">
          <span>main</span>
          <span>TypeScript React</span>
          <span>UTF-8</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Ln 1, Col 1</span>
          <span>Spaces: 2</span>
          <Button variant="ghost" size="sm", className="h-4 px-2 text-xs">
            <Eye className="w-3 h-3 mr-1" />
            Live Preview
          </Button>
        </div>
      </div>
    </div>
  );
}
