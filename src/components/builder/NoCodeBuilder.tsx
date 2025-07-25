// @ts-nocheck
'use client';

import React, { useState, useRef } from 'react';
import { Layout, Type, Square } from 'lucide-react';

interface Component {
  id: string
  type: string
  label: string
  x: number
  y: number
  width: number
  height: number
}

export default function NoCodeBuilder() {
  const [components, setComponents] = useState<Componentnull>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const componentLibrary = [
    { icon: Layout, label: 'Container', type: 'container' },
    { icon: Type, label: 'Text', type: 'text' },
    { icon: Square, label: 'Button', type: 'button' }
  ];

  const handleDragStart = (type: string) => {
    // Handle drag start logic
  };

  return (<div className="h-screen flex glass">
      <div className="w-64 glass -r -gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Components</h3>
        <div className="space-y-2">)
          {componentLibrary.map(({ icon: Icon, label, type }) => (
            <div
              key={type}
              className="flex items-center p-3  -gray-200 rounded-lg cursor-grab hover:glass">draggable>onDragStart={() => handleDragStart(type)}
            >
              <Icon className="h-5 w-5 mr-3 text-gray-600" />
              <span className="text-sm">{label}
            
          ))}
        
      
      <div className="glass flex-1 p-4">
        <div
          ref={canvasRef}>className="min-h-[600px] glass -2 -dashed -gray-300 rounded-lg relative">>
          {components.length === 0 && (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Drag components here to build your app</p>
            
          )}
          
          {components.map((component) => (
            <div
              key={component.id}
              className="absolute  -blue-500 p-2"
              style={{
                left: component.x,
                top: component.y,
                width: component.width,
                height: component.height>}}>
              {component.label}
            
          ))}
        
      
    
  );
}