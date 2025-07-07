'use client';

import React, { useState, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import BuilderCanvas from '../components/BuilderCanvas';
import Sidebar from '../components/Sidebar';
import PreviewPane from '../components/PreviewPane';
import { ComponentConfig, BuilderState } from '../types';
import { generateCode } from '../utils/generateCode';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Eye, Code, Save, Undo, Redo } from 'lucide-react';

const UIBuilderHomepage: React.FC = () => {
  const [builderState, setBuilderState] = useState<BuilderState>({
    components: [],
    selectedComponent: null,
    history: [],
    historyIndex: -1,
    zoom: 100,
    gridEnabled: true,
    previewMode: false
  });

  const [activeTab, setActiveTab] = useState<'design' | 'preview' | 'code'>('design');
  const [generatedCode, setGeneratedCode] = useState<string>('');

  const addComponent = useCallback((componentConfig: ComponentConfig) => {
    setBuilderState(prev => {
      const newComponent = {
        ...componentConfig,
        id: `${componentConfig.type}_${Date.now()}`,
        position: { x: 100, y: 100 },
        size: { width: 200, height: 100 }
      };

      const newState = {
        ...prev,
        components: [...prev.components, newComponent],
        selectedComponent: newComponent.id,
        history: [...prev.history.slice(0, prev.historyIndex + 1), prev.components],
        historyIndex: prev.historyIndex + 1
      };

      return newState;
    });
  }, []);

  const updateComponent = useCallback((id: string, updates: Partial<ComponentConfig>) => {
    setBuilderState(prev => {
      const newState = {
        ...prev,
        components: prev.components.map(comp => 
          comp.id === id ? { ...comp, ...updates } : comp
        ),
        history: [...prev.history.slice(0, prev.historyIndex + 1), prev.components],
        historyIndex: prev.historyIndex + 1
      };

      return newState;
    });
  }, []);

  const deleteComponent = useCallback((id: string) => {
    setBuilderState(prev => {
      const newState = {
        ...prev,
        components: prev.components.filter(comp => comp.id !== id),
        selectedComponent: prev.selectedComponent === id ? null : prev.selectedComponent,
        history: [...prev.history.slice(0, prev.historyIndex + 1), prev.components],
        historyIndex: prev.historyIndex + 1
      };

      return newState;
    });
  }, []);

  const selectComponent = useCallback((id: string | null) => {
    setBuilderState(prev => ({
      ...prev,
      selectedComponent: id
    }));
  }, []);

  const undo = useCallback(() => {
    setBuilderState(prev => {
      if (prev.historyIndex > 0) {
        return {
          ...prev,
          components: prev.history[prev.historyIndex - 1],
          historyIndex: prev.historyIndex - 1,
          selectedComponent: null
        };
      }
      return prev;
    });
  }, []);

  const redo = useCallback(() => {
    setBuilderState(prev => {
      if (prev.historyIndex < prev.history.length - 1) {
        return {
          ...prev,
          components: prev.history[prev.historyIndex + 1],
          historyIndex: prev.historyIndex + 1,
          selectedComponent: null
        };
      }
      return prev;
    });
  }, []);

  const handleGenerateCode = useCallback(() => {
    const code = generateCode(builderState.components);
    setGeneratedCode(code);
    setActiveTab('code');
  }, [builderState.components]);

  const handleExport = useCallback(() => {
    const code = generateCode(builderState.components);
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-component.tsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [builderState.components]);

  const handleSave = useCallback(() => {
    const projectData = {
      components: builderState.components,
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };
    
    localStorage.setItem('ui-builder-project', JSON.stringify(projectData));
    
    // Show success notification (you can implement a toast system)
    console.log('Project saved successfully!');
  }, [builderState.components]);

  const togglePreviewMode = useCallback(() => {
    setBuilderState(prev => ({
      ...prev,
      previewMode: !prev.previewMode
    }));
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">UI Builder</h1>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={undo}
                  disabled={builderState.historyIndex <= 0}
                >
                  <Undo className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={redo}
                  disabled={builderState.historyIndex >= builderState.history.length - 1}
                >
                  <Redo className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={togglePreviewMode}>
                <Eye className="w-4 h-4 mr-2" />
                {builderState.previewMode ? 'Edit' : 'Preview'}
              </Button>
              <Button variant="outline" size="sm" onClick={handleGenerateCode}>
                <Code className="w-4 h-4 mr-2" />
                Generate Code
              </Button>
              <Button size="sm" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          {!builderState.previewMode && (
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
              <Sidebar
                onAddComponent={addComponent}
                selectedComponent={builderState.selectedComponent}
                components={builderState.components}
                onUpdateComponent={updateComponent}
              />
            </div>
          )}

          {/* Main Workspace */}
          <div className="flex-1 flex flex-col">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-3 bg-white border-b">
                <TabsTrigger value="design">Design</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
              </TabsList>

              <TabsContent value="design" className="flex-1 m-0">
                <BuilderCanvas
                  components={builderState.components}
                  selectedComponent={builderState.selectedComponent}
                  onSelectComponent={selectComponent}
                  onUpdateComponent={updateComponent}
                  onDeleteComponent={deleteComponent}
                  zoom={builderState.zoom}
                  gridEnabled={builderState.gridEnabled}
                  previewMode={builderState.previewMode}
                />
              </TabsContent>

              <TabsContent value="preview" className="flex-1 m-0">
                <PreviewPane
                  components={builderState.components}
                  className="h-full"
                />
              </TabsContent>

              <TabsContent value="code" className="flex-1 m-0">
                <div className="h-full bg-gray-900 text-gray-100 p-4 overflow-auto">
                  <pre className="text-sm">
                    <code>{generatedCode || generateCode(builderState.components)}</code>
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Status Bar */}
        <footer className="bg-white border-t border-gray-200 px-4 py-2">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>Components: {builderState.components.length}</span>
              <span>Zoom: {builderState.zoom}%</span>
              {builderState.selectedComponent && (
                <span>Selected: {builderState.selectedComponent}</span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span>Grid: {builderState.gridEnabled ? 'On' : 'Off'}</span>
            </div>
          </div>
        </footer>
      </div>
    </DndProvider>
  );
};

export default UIBuilderHomepage;
