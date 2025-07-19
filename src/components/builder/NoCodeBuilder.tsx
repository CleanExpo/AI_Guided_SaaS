'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Layers,
  Layout,
  Type,
  Image,
  Square,
  Circle,
  Triangle,
  Palette,
  Settings,
  Code,
  Eye,
  EyeOff,
  Plus,
  Minus,
  Move,
  Copy,
  Trash2,
  Undo,
  Redo,
  Download,
  Upload,
  Play,
  Save,
  MousePointer2,
  Grid3X3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Component {
  id: string;
  type: string;
  props: Record<string, any>;
  children?: Component[];
}

export default function NoCodeBuilder() {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [components, setComponents] = useState<Component[]>([]);
  const [showGrid, setShowGrid] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [currentView, setCurrentView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const componentLibrary = [
    { icon: Layout, label: 'Container', type: 'container' },
    { icon: Type, label: 'Text', type: 'text' },
    { icon: Square, label: 'Button', type: 'button' },
    { icon: Image, label: 'Image', type: 'image' },
    { icon: Square, label: 'Card', type: 'card' },
    { icon: Grid3X3, label: 'Grid', type: 'grid' },
  ];

  const viewportSizes = {
    desktop: 'w-full',
    tablet: 'max-w-3xl',
    mobile: 'max-w-sm'
  };

  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('componentType', type);
    setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('componentType');
    
    const newComponent: Component = {
      id: `component-${Date.now()}`,
      type,
      props: getDefaultProps(type)
    };
    
    setComponents([...components, newComponent]);
    setIsDragging(false);
  };

  const getDefaultProps = (type: string) => {
    switch (type) {
      case 'text':
        return { text: 'Edit this text', fontSize: '16px', color: '#000000' };
      case 'button':
        return { text: 'Click Me', variant: 'primary', size: 'medium' };
      case 'container':
        return { padding: '20px', background: '#ffffff' };
      default:
        return {};
    }
  };

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-950">
      {/* Left Sidebar - Component Library */}
      <div className="w-64 bg-white dark:bg-gray-900 border-r p-4">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4" />
          Components
        </h3>
        
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="grid grid-cols-2 gap-2">
            {componentLibrary.map((comp) => (
              <Card
                key={comp.type}
                draggable
                onDragStart={(e) => handleDragStart(e, comp.type)}
                className="p-4 cursor-move hover:shadow-lg transition-all hover:scale-105 hover:border-purple-500"
              >
                <div className="flex flex-col items-center gap-2">
                  <comp.icon className="w-6 h-6 text-purple-500" />
                  <span className="text-xs">{comp.label}</span>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>

        <Separator className="my-4" />
        
        {/* Quick Actions */}
        <div className="space-y-2">
          <Button variant="outline" size="sm" className="w-full">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm" className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Center - Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-white dark:bg-gray-900 border-b px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Undo className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Redo className="w-4 h-4" />
              </Button>
              <Separator orientation="vertical" className="h-6" />
              
              {/* Viewport Switcher */}
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-md p-1">
                <Button
                  variant={currentView === 'desktop' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentView('desktop')}
                  className="h-7 px-2"
                >
                  <Square className="w-4 h-4" />
                </Button>
                <Button
                  variant={currentView === 'tablet' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentView('tablet')}
                  className="h-7 px-2"
                >
                  <Square className="w-3 h-4" />
                </Button>
                <Button
                  variant={currentView === 'mobile' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentView('mobile')}
                  className="h-7 px-2"
                >
                  <Square className="w-2 h-4" />
                </Button>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowGrid(!showGrid)}
              >
                <Grid3X3 className={cn("w-4 h-4", showGrid && "text-purple-500")} />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button size="sm" className="bg-purple-500 hover:bg-purple-600">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button size="sm" className="bg-green-500 hover:bg-green-600">
                <Play className="w-4 h-4 mr-2" />
                Publish
              </Button>
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-auto p-8 bg-gray-100 dark:bg-gray-950">
          <div className={cn("mx-auto transition-all", viewportSizes[currentView])}>
            <div
              className={cn(
                "min-h-[600px] bg-white dark:bg-gray-900 rounded-lg shadow-xl border-2 transition-all",
                isDragging && "border-purple-500 border-dashed",
                showGrid && "bg-grid-pattern"
              )}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              {components.length === 0 && (
                <div className="h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <MousePointer2 className="w-12 h-12 mx-auto mb-4" />
                    <p>Drag components here to start building</p>
                  </div>
                </div>
              )}
              
              {/* Render Components */}
              <div className="p-8">
                {components.map((component) => (
                  <div
                    key={component.id}
                    className={cn(
                      "relative group cursor-pointer border-2 border-transparent hover:border-purple-500 p-4 rounded",
                      selectedComponent === component.id && "border-purple-500"
                    )}
                    onClick={() => setSelectedComponent(component.id)}
                  >
                    {/* Component Actions */}
                    <div className="absolute -top-8 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    {/* Render Component */}
                    {component.type === 'text' && (
                      <p style={{ fontSize: component.props.fontSize, color: component.props.color }}>
                        {component.props.text}
                      </p>
                    )}
                    {component.type === 'button' && (
                      <Button variant={component.props.variant} size={component.props.size}>
                        {component.props.text}
                      </Button>
                    )}
                    {component.type === 'container' && (
                      <div
                        className="min-h-[100px] rounded"
                        style={{ padding: component.props.padding, backgroundColor: component.props.background }}
                      >
                        Container
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Properties Panel */}
      <div className="w-80 bg-white dark:bg-gray-900 border-l p-4">
        <Tabs defaultValue="properties">
          <TabsList className="w-full">
            <TabsTrigger value="properties" className="flex-1">Properties</TabsTrigger>
            <TabsTrigger value="style" className="flex-1">Style</TabsTrigger>
            <TabsTrigger value="advanced" className="flex-1">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="properties" className="mt-4">
            {selectedComponent ? (
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Component Properties
                </h4>
                
                {/* Dynamic property inputs based on component type */}
                <div className="space-y-3">
                  <div>
                    <Label>Text Content</Label>
                    <Input placeholder="Enter text..." />
                  </div>
                  <div>
                    <Label>Font Size</Label>
                    <Input type="number" placeholder="16" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 mt-8">
                <Settings className="w-12 h-12 mx-auto mb-4" />
                <p>Select a component to edit properties</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="style" className="mt-4">
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Style Editor
              </h4>
              
              {/* Style controls */}
              <div className="space-y-3">
                <div>
                  <Label>Background Color</Label>
                  <div className="flex gap-2">
                    <Input type="color" className="w-12 h-10" />
                    <Input placeholder="#ffffff" />
                  </div>
                </div>
                <div>
                  <Label>Text Color</Label>
                  <div className="flex gap-2">
                    <Input type="color" className="w-12 h-10" />
                    <Input placeholder="#000000" />
                  </div>
                </div>
                <div>
                  <Label>Border Radius</Label>
                  <Input type="range" min="0" max="50" />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="mt-4">
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <Code className="w-4 h-4" />
                Advanced Settings
              </h4>
              
              <div className="space-y-3">
                <div>
                  <Label>Custom CSS Class</Label>
                  <Input placeholder="custom-class" />
                </div>
                <div>
                  <Label>Component ID</Label>
                  <Input placeholder="component-id" />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}