// apps/ui-builder/pages/index.tsx
import React from 'react';
import Sidebar from '../components/Sidebar';
import BuilderCanvas from '../components/BuilderCanvas';
import PreviewPane from '../components/PreviewPane';
import ComponentPropsEditor from '../components/ComponentPropsEditor';
import CodeViewer from '../components/CodeViewer';

export default function UIBuilderHome() {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-grow">
        <BuilderCanvas />
        <PreviewPane />
        <ComponentPropsEditor />
        <CodeViewer />
      </div>
    </div>
  );
}
