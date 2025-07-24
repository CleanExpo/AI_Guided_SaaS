// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { File, Folder, Settings, Play } from 'lucide-react';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
}

export default function ProCodeEditor() {
  const [fileTree] = useState<FileNode[]>([
    {
      name: 'src',
      type: 'folder',
      path: '/src',
      children: [
        { name: 'App.tsx', type: 'file', path: '/src/App.tsx' },
        { name: 'index.tsx', type: 'file', path: '/src/index.tsx' }
      ]
    },
    { name: 'package.json', type: 'file', path: '/package.json' }
  ]);
  
  const renderFileTree = (nodes: FileNode[]) => {
    return nodes.map((node) => (
      <div key={node.path} className="py-1">
        <div className="flex items-center px-2 hover:bg-gray-700 cursor-pointer text-sm">
          {node.type === 'folder' ? (
            <Folder className="h-4 w-4 mr-2 text-blue-600" />
          ) : (
            <File className="h-4 w-4 mr-2 text-gray-600" />
          )}
          <span>{node.name}</span>
        </div>
        {node.children && (
          <div className="ml-4">
            {renderFileTree(node.children)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      <div className="h-12 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
        <span className="font-semibold">Pro Code Editor</span>
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-700 rounded">
            <Settings className="h-4 w-4" />
          </button>
          <button className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm flex items-center">
            <Play className="h-4 w-4 mr-1" />
            Run
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex">
        <div className="w-64 bg-gray-800 border-r border-gray-700">
          <div className="p-3">
            <span className="text-sm font-medium">Explorer</span>
          </div>
          <div className="p-2">
            {renderFileTree(fileTree)}
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <File className="h-16 w-16 mx-auto mb-4 text-gray-600" />
            <p>Select a file to start editing</p>
          </div>
        </div>
      </div>
    </div>
  );
}
