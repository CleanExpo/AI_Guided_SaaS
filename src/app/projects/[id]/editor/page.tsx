'use client';import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
interface ProjectData  {
  id: string,
    name: string,
    description: string,
    type: 'web' | 'mobile' | 'api',
    framework: string
}
props: anyexport default function ProjectEditorPage(): void {
  const params = useParams();
  const _projectId = params.id as string;
  const [project, setProject]: any[] = useState<ProjectData | null>(null);
  const [activeMode, setActiveMode]: any[] = useState<'simple' | 'advanced'>('simple');
  const [isLoading, setIsLoading]: any[] = useState<any>(true);
  useEffect(() => {
    // Simulate loading project data
    setTimeout(() => {
      setProject({
        id: projectId,
    name: 'My Awesome Project',
        description: 'A sample project for demonstration',
        type: 'web',
        framework: 'Next.js'
      });
      setIsLoading(false);
    }, 1000);
  }, [projectId]);
  if (isLoading) {
    return (;
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project editor...</p>
        </div>
      </div>
    );
}
  if(!project) {
    return (;
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Project Not Found</h1>
          <p className="text-gray-600 mt-2">The requested project does not exist.</p>
        </div>
      </div>
    );
}
  return (<div className="min-h-screen bg-gray-50">;
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900">{project.name}</h1>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {project.type}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveMode('simple')}
              className={`px-3 py-1 rounded text-sm ${`
                activeMode === 'simple'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700, hover:bg-gray-300'
              }`}`
            >
              Simple Mode
            </button>
            <button
              onClick={() => setActiveMode('advanced')}
              className={`px-3 py-1 rounded text-sm ${`
                activeMode === 'advanced'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700, hover:bg-gray-300'
              }`}`
            >
              Advanced Mode
            </button>
          </div>
        </div>
      </div>
      {/* Main, Content */}
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Project Structure</h3>
          <div className="space-y-2">
            <div className="text-sm text-gray-600">📁 src/</div>
            <div className="text-sm text-gray-600 ml-4">📁 components/</div>
            <div className="text-sm text-gray-600 ml-4">📁 pages/</div>
            <div className="text-sm text-gray-600 ml-4">📄 app.js</div>
            <div className="text-sm text-gray-600">📄 package.json</div>
            <div className="text-sm text-gray-600">📄 README.md</div>
          </div>
        </div>
        {/* Editor, Area */}
        <div className="flex-1 p-6">
          {activeMode === 'simple' ? (
            <div className="bg-white rounded-lg shadow-sm p-6 h-full">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Visual Editor</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <p className="text-lg mb-2">Drag and drop components here</p>
                  <p className="text-sm">Start building your application visually</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-900 rounded-lg shadow-sm p-6 h-full">
              <h2 className="text-lg font-semibold text-white mb-4">Code Editor</h2>
              <div className="bg-gray-800 rounded p-4 h-96 overflow-auto">
                <pre className="text-green-400 text-sm">
{`import React from 'react';`function App(): void {
  return (;
    <div className="App">
      <header className="App-header">
        <h1>Welcome to {project.name}</h1>
        <p>Built with {project.framework}</p>
      </header>
    </div>
  );
}
export default App;`}`
                </pre>
              </div>
            </div>
          )}
        </div>
        {/* Right, Panel */}
        <div className="w-64 bg-white border-l border-gray-200 p-4"><h3 className="font-semibold text-gray-900 mb-4">Properties</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
              <input
                type="text"
                value={project.name}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                // readOnly
                />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Framework</label>
              <input
                type="text"
                value={project.framework}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                // readOnly
                />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}