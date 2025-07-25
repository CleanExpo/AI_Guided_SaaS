'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FolderPlus, Folder, File, ChevronRight, ChevronDown } from 'lucide-react';
import { PageErrorBoundary } from '@/components/error/ErrorBoundary';

interface FolderItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  parent: string | null;
  children?: FolderItem[];
}

function FoldersPageContent() {
  const [folders, setFolders] = useState<FolderItem[]>([
    { 
      id: '1', 
      name: 'Documents', 
      type: 'folder', 
      parent: null,
      children: [
        { id: '2', name: 'Reports', type: 'folder', parent: '1' },
        { id: '3', name: 'readme.txt', type: 'file', parent: '1' }
      ]
    },
    { 
      id: '4', 
      name: 'Projects', 
      type: 'folder', 
      parent: null,
      children: [
        { id: '5', name: 'Website', type: 'folder', parent: '4' },
        { id: '6', name: 'Mobile App', type: 'folder', parent: '4' }
      ]
    }
  ]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['1', '4']));
  const [draggedItem, setDraggedItem] = useState<FolderItem | null>(null);
  const [dragOverFolder, setDragOverFolder] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const handleCreateFolder = () => {
    if (newFolderName) {
      const newFolder: FolderItem = {
        id: Date.now().toString(),
        name: newFolderName,
        type: 'folder',
        parent: null,
        children: []
      };
      setFolders([...folders, newFolder]);
      setNewFolderName('');
      setShowCreateForm(false);
    }
  };

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleDragStart = (e: React.DragEvent, item: FolderItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverFolder(folderId);
  };

  const handleDragLeave = () => {
    setDragOverFolder(null);
  };

  const handleDrop = (e: React.DragEvent, targetFolder: FolderItem) => {
    e.preventDefault();
    if (draggedItem && targetFolder.type === 'folder' && draggedItem.id !== targetFolder.id) {
      setMessage(`Moved ${draggedItem.name} to ${targetFolder.name}`);
      setTimeout(() => setMessage(''), 3000);
      // Implementation would update the folder structure here
    }
    setDraggedItem(null);
    setDragOverFolder(null);
  };

  const renderFolderItem = (item: FolderItem, depth: number = 0) => {
    const isExpanded = expandedFolders.has(item.id);

    return (
      <div key={item.id} className="select-none">
        <div
          data-testid={item.type === 'folder' ? 'folder-item' : 'draggable-item'}
          draggable
          onDragStart={(e) => handleDragStart(e, item)}
          onDragOver={(e) => handleDragOver(e, item.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, item)}
          className={`flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer ${
            item.type === 'folder' ? 'font-medium' : ''
          } ${
            dragOverFolder === item.id ? 'bg-blue-100 border-2 border-blue-400' : ''
          }`}
          style={{ paddingLeft: `${depth * 20 + 8}px` }}
          onClick={() => item.type === 'folder' && toggleFolder(item.id)}
        >
          {item.type === 'folder' && (
            isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
          )}
          {item.type === 'folder' ? (
            <Folder className="h-4 w-4 text-blue-600" />
          ) : (
            <File className="h-4 w-4 text-gray-600" />
          )}
          <span>{item.name}</span>
        </div>
        {item.type === 'folder' && isExpanded && (
          <div data-testid="folder-drop-zone" className="min-h-[20px] border-l-2 border-gray-200 ml-4">
            {item.children?.map(child => renderFolderItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Folders</h1>
          <p className="text-gray-600">Organize your files and documents</p>
        </div>

        {/* Actions Bar */}
        <div className="flex justify-between items-center mb-6">
          <Button 
            data-testid="create-folder-button"
            onClick={() => setShowCreateForm(true)}
          >
            <FolderPlus className="h-4 w-4 mr-2" />
            Create Folder
          </Button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Create New Folder</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Folder name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
                />
                <Button onClick={handleCreateFolder}>Create</Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Folder Tree */}
        <Card>
          <CardHeader>
            <CardTitle>File Explorer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {folders.map(folder => renderFolderItem(folder))}
            </div>
          </CardContent>
        </Card>

        {/* Messages */}
        {message && (
          <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {message}
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 text-sm text-gray-600">
          <p>Drag and drop files and folders to organize them. Click on folders to expand/collapse.</p>
        </div>
      </div>
    </div>
  );
}

export default function FoldersPage() {
  return (
    <PageErrorBoundary>
      <FoldersPageContent />
    </PageErrorBoundary>
  );
}