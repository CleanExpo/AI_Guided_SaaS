'use client';

import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { ComponentConfig, MotiaComponent } from '../types';
import { getComponentsByCategory, motiaComponents } from '../lib/componentList';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Settings, Layers } from 'lucide-react';

interface SidebarProps {
  onAddComponent: (component: ComponentConfig) => void;
  selectedComponent: string | null;
  components: ComponentConfig[];
  onUpdateComponent: (id: string, updates: Partial<ComponentConfig>) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  onAddComponent,
  selectedComponent,
  components,
  onUpdateComponent
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'components' | 'layers' | 'properties'>('components');
  
  const componentsByCategory = getComponentsByCategory();
  const filteredComponents = motiaComponents.filter(component =>
    component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    component.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedComponentData = selectedComponent 
    ? components.find(c => c.id === selectedComponent)
    : null;

  return (
    <div className="h-full flex flex-col bg-white">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 bg-gray-50 m-2">
          <TabsTrigger value="components" className="text-xs">
            <Search className="w-4 h-4 mr-1" />
            Components
          </TabsTrigger>
          <TabsTrigger value="layers" className="text-xs">
            <Layers className="w-4 h-4 mr-1" />
            Layers
          </TabsTrigger>
          <TabsTrigger value="properties" className="text-xs">
            <Settings className="w-4 h-4 mr-1" />
            Properties
          </TabsTrigger>
        </TabsList>

        <TabsContent value="components" className="flex-1 m-0 p-4 overflow-auto">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search components..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {searchTerm ? (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700">Search Results</h3>
                <div className="grid grid-cols-1 gap-2">
                  {filteredComponents.map(component => (
                    <DraggableComponent
                      key={component.type}
                      component={component}
                      onAddComponent={onAddComponent}
                    />
                  ))}
                </div>
              </div>
            ) : (
              Object.entries(componentsByCategory).map(([category, categoryComponents]) => (
                <div key={category} className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-1">
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {categoryComponents.map(component => (
                      <DraggableComponent
                        key={component.type}
                        component={component}
                        onAddComponent={onAddComponent}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="layers" className="flex-1 m-0 p-4 overflow-auto">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Component Layers</h3>
            {components.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                No components added yet
              </p>
            ) : (
              <div className="space-y-1">
                {components.map((component, index) => (
                  <div
                    key={component.id}
                    className={`p-2 rounded text-sm cursor-pointer transition-colors ${
                      selectedComponent === component.id
                        ? 'bg-blue-100 text-blue-900 border border-blue-200'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                    onClick={() => {/* Handle layer selection */}}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{component.name}</span>
                      <span className="text-xs text-gray-500">#{index + 1}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {component.type} • {Math.round(component.position.x)}, {Math.round(component.position.y)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="properties" className="flex-1 m-0 p-4 overflow-auto">
          {selectedComponentData ? (
            <ComponentProperties
              component={selectedComponentData}
              onUpdateComponent={onUpdateComponent}
            />
          ) : (
            <div className="text-center py-8">
              <Settings className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">
                Select a component to edit its properties
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface DraggableComponentProps {
  component: MotiaComponent;
  onAddComponent: (component: ComponentConfig) => void;
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({ component, onAddComponent }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'component',
    item: { componentType: component.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const handleAddComponent = () => {
    const newComponent: ComponentConfig = {
      id: `${component.type}_${Date.now()}`,
      type: component.type,
      name: component.name,
      position: { x: 100, y: 100 },
      size: { width: 200, height: 100 },
      props: { ...component.defaultProps },
      style: {},
      className: ''
    };
    onAddComponent(newComponent);
  };

  return (
    <Card
      ref={drag}
      className={`p-3 cursor-move transition-all hover:shadow-md border ${
        isDragging ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
      }`}
      onClick={handleAddComponent}
    >
      <div className="flex items-center space-x-3">
        <div className="text-lg">{component.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate">
            {component.name}
          </div>
          <div className="text-xs text-gray-500 truncate">
            {component.description}
          </div>
        </div>
      </div>
    </Card>
  );
};

interface ComponentPropertiesProps {
  component: ComponentConfig;
  onUpdateComponent: (id: string, updates: Partial<ComponentConfig>) => void;
}

const ComponentProperties: React.FC<ComponentPropertiesProps> = ({ component, onUpdateComponent }) => {
  const motiaComponent = motiaComponents.find(c => c.type === component.type);

  const handlePropChange = (propName: string, value: unknown) => {
    onUpdateComponent(component.id, {
      props: {
        ...component.props,
        [propName]: value
      }
    });
  };

  const handlePositionChange = (axis: 'x' | 'y', value: number) => {
    onUpdateComponent(component.id, {
      position: {
        ...component.position,
        [axis]: value
      }
    });
  };

  const handleSizeChange = (dimension: 'width' | 'height', value: number) => {
    onUpdateComponent(component.id, {
      size: {
        ...component.size,
        [dimension]: value
      }
    });
  };

  if (!motiaComponent) {
    return <div className="text-sm text-gray-500">Component type not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">
          {component.name} Properties
        </h3>
      </div>

      {/* Position & Size */}
      <div className="space-y-3">
        <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide">Layout</h4>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-600 mb-1">X Position</label>
            <Input
              type="number"
              value={Math.round(component.position.x)}
              onChange={(e) => handlePositionChange('x', parseInt(e.target.value) || 0)}
              className="text-xs"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Y Position</label>
            <Input
              type="number"
              value={Math.round(component.position.y)}
              onChange={(e) => handlePositionChange('y', parseInt(e.target.value) || 0)}
              className="text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Width</label>
            <Input
              type="number"
              value={Math.round(component.size.width)}
              onChange={(e) => handleSizeChange('width', parseInt(e.target.value) || 0)}
              className="text-xs"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Height</label>
            <Input
              type="number"
              value={Math.round(component.size.height)}
              onChange={(e) => handleSizeChange('height', parseInt(e.target.value) || 0)}
              className="text-xs"
            />
          </div>
        </div>
      </div>

      {/* Component Props */}
      <div className="space-y-3">
        <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide">Properties</h4>
        
        {Object.entries(motiaComponent.propTypes).map(([propName, propType]) => (
          <div key={propName}>
            <label className="block text-xs text-gray-600 mb-1 capitalize">
              {propName.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            
            {propType.type === 'string' && (
              <Input
                value={component.props[propName] || ''}
                onChange={(e) => handlePropChange(propName, e.target.value)}
                placeholder={propType.description}
                className="text-xs"
              />
            )}
            
            {propType.type === 'number' && (
              <Input
                type="number"
                value={component.props[propName] || 0}
                onChange={(e) => handlePropChange(propName, parseInt(e.target.value) || 0)}
                className="text-xs"
              />
            )}
            
            {propType.type === 'boolean' && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={component.props[propName] || false}
                  onChange={(e) => handlePropChange(propName, e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-xs text-gray-600">{propType.description}</span>
              </div>
            )}
            
            {propType.type === 'select' && propType.options && (
              <select
                value={component.props[propName] || propType.default}
                onChange={(e) => handlePropChange(propName, e.target.value)}
                className="w-full text-xs border border-gray-300 rounded-md px-2 py-1"
              >
                {propType.options.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            )}
            
            {propType.type === 'color' && (
              <Input
                type="color"
                value={component.props[propName] || '#000000'}
                onChange={(e) => handlePropChange(propName, e.target.value)}
                className="text-xs h-8"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
