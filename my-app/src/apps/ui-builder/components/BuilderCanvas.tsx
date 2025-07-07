'use client';

import React, { useCallback, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { ComponentConfig, DragItem } from '../types';
import { getComponentByType } from '../lib/componentList';
import { Trash2, Move, Copy } from 'lucide-react';

interface BuilderCanvasProps {
  components: ComponentConfig[];
  selectedComponent: string | null;
  onSelectComponent: (id: string | null) => void;
  onUpdateComponent: (id: string, updates: Partial<ComponentConfig>) => void;
  onDeleteComponent: (id: string) => void;
  zoom: number;
  gridEnabled: boolean;
  previewMode: boolean;
}

const BuilderCanvas: React.FC<BuilderCanvasProps> = ({
  components,
  selectedComponent,
  onSelectComponent,
  onUpdateComponent,
  onDeleteComponent,
  zoom,
  gridEnabled,
  previewMode
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'component',
    drop: (item: DragItem, monitor) => {
      if (!monitor.didDrop()) {
        const offset = monitor.getClientOffset();
        const canvasRect = canvasRef.current?.getBoundingClientRect();
        
        if (offset && canvasRect) {
          const x = (offset.x - canvasRect.left) / (zoom / 100);
          const y = (offset.y - canvasRect.top) / (zoom / 100);
          
          // Create new component at drop position
          const motiaComponent = getComponentByType(item.componentType);
          if (motiaComponent) {
            const newComponent: ComponentConfig = {
              id: `${item.componentType}_${Date.now()}`,
              type: item.componentType,
              name: motiaComponent.name,
              position: { x: Math.max(0, x - 100), y: Math.max(0, y - 50) },
              size: { width: 200, height: 100 },
              props: { ...motiaComponent.defaultProps },
              style: {},
              className: ''
            };
            
            // This would need to be passed down as a prop
            console.log('Would add component:', newComponent);
          }
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onSelectComponent(null);
    }
  }, [onSelectComponent]);

  const gridStyle = gridEnabled ? {
    backgroundImage: `
      linear-gradient(to right, #f0f0f0 1px, transparent 1px),
      linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)
    `,
    backgroundSize: '20px 20px'
  } : {};

  return (
    <div className="flex-1 overflow-auto bg-gray-100">
      <div
        ref={(node) => {
          canvasRef.current = node;
          drop(node);
        }}
        className={`relative min-h-full transition-all duration-200 ${
          isOver ? 'bg-blue-50' : 'bg-white'
        }`}
        style={{
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'top left',
          minWidth: '100%',
          minHeight: '100%',
          ...gridStyle
        }}
        onClick={handleCanvasClick}
      >
        {/* Drop zone indicator */}
        {isOver && (
          <div className="absolute inset-0 border-2 border-dashed border-blue-400 bg-blue-50 bg-opacity-50 flex items-center justify-center">
            <div className="text-blue-600 text-lg font-medium">
              Drop component here
            </div>
          </div>
        )}

        {/* Render components */}
        {components.map((component) => (
          <CanvasComponent
            key={component.id}
            component={component}
            isSelected={selectedComponent === component.id}
            onSelect={onSelectComponent}
            onUpdate={onUpdateComponent}
            onDelete={onDeleteComponent}
            previewMode={previewMode}
          />
        ))}

        {/* Canvas info */}
        {components.length === 0 && !isOver && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-xl font-medium mb-2">Start Building</h3>
              <p className="text-sm">
                Drag components from the sidebar to start building your UI
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface CanvasComponentProps {
  component: ComponentConfig;
  isSelected: boolean;
  onSelect: (id: string | null) => void;
  onUpdate: (id: string, updates: Partial<ComponentConfig>) => void;
  onDelete: (id: string) => void;
  previewMode: boolean;
}

const CanvasComponent: React.FC<CanvasComponentProps> = ({
  component,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  previewMode
}) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState<{ x: number; y: number } | null>(null);
  const [isResizing, setIsResizing] = React.useState(false);
  const [resizeStart, setResizeStart] = React.useState<{ x: number; y: number; width: number; height: number } | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (previewMode) return;
    
    e.stopPropagation();
    onSelect(component.id);
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - component.position.x,
      y: e.clientY - component.position.y
    });
  }, [component.id, component.position, onSelect, previewMode]);

  const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
    if (previewMode) return;
    
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: component.size.width,
      height: component.size.height
    });
  }, [component.size, previewMode]);

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && dragStart) {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        
        onUpdate(component.id, {
          position: {
            x: Math.max(0, newX),
            y: Math.max(0, newY)
          }
        });
      }
      
      if (isResizing && resizeStart) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        
        onUpdate(component.id, {
          size: {
            width: Math.max(50, resizeStart.width + deltaX),
            height: Math.max(30, resizeStart.height + deltaY)
          }
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setDragStart(null);
      setIsResizing(false);
      setResizeStart(null);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart, resizeStart, component.id, onUpdate]);

  const renderComponent = () => {
    const motiaComponent = getComponentByType(component.type);
    if (!motiaComponent) {
      return (
        <div className="w-full h-full bg-red-100 border border-red-300 rounded flex items-center justify-center text-red-600 text-sm">
          Unknown: {component.type}
        </div>
      );
    }

    // Render actual component based on type
    switch (component.type) {
      case 'Button':
        return (
          <button
            className={`px-4 py-2 rounded font-medium transition-colors ${
              component.props.variant === 'primary' ? 'bg-blue-500 text-white hover:bg-blue-600' :
              component.props.variant === 'secondary' ? 'bg-gray-500 text-white hover:bg-gray-600' :
              component.props.variant === 'outline' ? 'border border-blue-500 text-blue-500 hover:bg-blue-50' :
              'text-blue-500 hover:bg-blue-50'
            } ${component.props.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={component.props.disabled}
          >
            {component.props.text || 'Button'}
          </button>
        );
      
      case 'Input':
        return (
          <div className="w-full">
            {component.props.label && (
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {component.props.label}
              </label>
            )}
            <input
              type={component.props.type || 'text'}
              placeholder={component.props.placeholder || 'Enter text...'}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              readOnly
            />
          </div>
        );
      
      case 'Card':
        return (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 w-full h-full">
            {component.props.showHeader !== false && (
              <div className="border-b border-gray-200 pb-2 mb-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {component.props.title || 'Card Title'}
                </h3>
              </div>
            )}
            <div className="text-gray-600">
              {component.props.content || 'Card content goes here...'}
            </div>
          </div>
        );
      
      case 'Heading':
        const HeadingTag = `h${component.props.level || 1}` as keyof JSX.IntrinsicElements;
        return (
          <HeadingTag className={`font-bold ${
            component.props.level === '1' ? 'text-4xl' :
            component.props.level === '2' ? 'text-3xl' :
            component.props.level === '3' ? 'text-2xl' :
            component.props.level === '4' ? 'text-xl' :
            component.props.level === '5' ? 'text-lg' :
            'text-base'
          } ${
            component.props.color === 'primary' ? 'text-blue-600' :
            component.props.color === 'secondary' ? 'text-gray-600' :
            component.props.color === 'muted' ? 'text-gray-500' :
            'text-gray-900'
          }`}>
            {component.props.text || 'Heading'}
          </HeadingTag>
        );
      
      case 'Text':
        return (
          <p className={`${
            component.props.size === 'xs' ? 'text-xs' :
            component.props.size === 'sm' ? 'text-sm' :
            component.props.size === 'lg' ? 'text-lg' :
            component.props.size === 'xl' ? 'text-xl' :
            component.props.size === '2xl' ? 'text-2xl' :
            'text-base'
          } ${
            component.props.weight === 'light' ? 'font-light' :
            component.props.weight === 'medium' ? 'font-medium' :
            component.props.weight === 'semibold' ? 'font-semibold' :
            component.props.weight === 'bold' ? 'font-bold' :
            'font-normal'
          } ${
            component.props.color === 'primary' ? 'text-blue-600' :
            component.props.color === 'secondary' ? 'text-gray-600' :
            component.props.color === 'muted' ? 'text-gray-500' :
            component.props.color === 'destructive' ? 'text-red-600' :
            'text-gray-700'
          }`}>
            {component.props.text || 'Text content'}
          </p>
        );
      
      case 'Image':
        return (
          <img
            src={component.props.src || 'https://via.placeholder.com/300x200'}
            alt={component.props.alt || 'Image'}
            className={`object-cover ${
              component.props.rounded === 'none' ? '' :
              component.props.rounded === 'sm' ? 'rounded-sm' :
              component.props.rounded === 'lg' ? 'rounded-lg' :
              component.props.rounded === 'xl' ? 'rounded-xl' :
              component.props.rounded === 'full' ? 'rounded-full' :
              'rounded-md'
            }`}
            style={{
              width: '100%',
              height: '100%'
            }}
          />
        );
      
      default:
        return (
          <div className="w-full h-full bg-gray-100 border border-gray-300 rounded flex items-center justify-center text-gray-600">
            {component.type}
          </div>
        );
    }
  };

  return (
    <div
      className={`absolute cursor-move transition-all ${
        isSelected && !previewMode ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
      } ${isDragging ? 'z-50' : 'z-10'}`}
      style={{
        left: component.position.x,
        top: component.position.y,
        width: component.size.width,
        height: component.size.height,
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Component content */}
      <div className="w-full h-full overflow-hidden">
        {renderComponent()}
      </div>

      {/* Selection controls */}
      {isSelected && !previewMode && (
        <>
          {/* Selection outline */}
          <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none" />
          
          {/* Control buttons */}
          <div className="absolute -top-8 left-0 flex space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(component.id);
              }}
              className="p-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
              title="Delete"
            >
              <Trash2 className="w-3 h-3" />
            </button>
            <button
              className="p-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
              title="Move"
            >
              <Move className="w-3 h-3" />
            </button>
            <button
              className="p-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
              title="Copy"
            >
              <Copy className="w-3 h-3" />
            </button>
          </div>

          {/* Resize handle */}
          <div
            className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 cursor-se-resize"
            onMouseDown={handleResizeMouseDown}
          />
          
          {/* Component info */}
          <div className="absolute -bottom-6 left-0 text-xs text-gray-500 bg-white px-1 rounded">
            {component.type} ({Math.round(component.size.width)}×{Math.round(component.size.height)})
          </div>
        </>
      )}
    </div>
  );
};

export default BuilderCanvas;
