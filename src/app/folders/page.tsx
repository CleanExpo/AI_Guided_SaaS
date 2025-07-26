'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Folder, FolderPlus, File } from 'lucide-react';

export default function FoldersPage() {
  const [folders, setFolders] = useState([
    { id: 1, name: 'Projects', items: 5 },
    { id: 2, name: 'Templates', items: 12 },
    { id: 3, name: 'Archives', items: 28 },
  ]);

  return (
    <div className="glass container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Folders</h1>
        <Button data-testid="create-folder-button">
          <FolderPlus className="mr-2 h-4 w-4" />
          Create Folder
        </Button>
      </div>

      <div className="glass grid gap-4">
        {folders.map((folder) => (
          <Card
            key={folder.id}
            data-testid="folder-item"
            className="glass p-4 hover:shadow-md-lg transition-shadow-md cursor-pointer"
          >
            <div 
              data-testid="folder-drop-zone"
              className="flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <Folder className="h-6 w-6 text-blue-500" />
                <div>
                  <h3 className="font-semibold">{folder.name}</h3>
                  <p className="text-sm text-gray-500">{folder.items} items</p>
                </div>
              </div>
              <div className="text-gray-400">
                <File className="h-4 w-4" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}