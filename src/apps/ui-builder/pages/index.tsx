/* BREADCRUMB: unknown - Purpose to be determined */
// @ts-nocheck
// apps/ui-builder/pages/index.tsx
'use client';

import React from 'react';
import Sidebar from '../components/Sidebar';
import BuilderCanvas from '../components/BuilderCanvas';
import PreviewPane from '../components/PreviewPane';
import ComponentPropsEditor from '../components/ComponentPropsEditor';
import CodeViewer from '../components/CodeViewer';
import Toolbar from '../components/Toolbar';
import DeploymentPanel from '../components/DeploymentPanel';
import AssistantPrompt from '../components/AssistantPrompt';
export default function UIBuilderHome() {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
          <div className="w-64 flex flex-col"></div>
        <AssistantPrompt     />
        <Sidebar     />
      <div className="flex flex-col flex-grow">
          </div>
        <Toolbar     />
        <BuilderCanvas     />
        <PreviewPane     />
        <ComponentPropsEditor     />
        <CodeViewer     />
        <DeploymentPanel     />    }