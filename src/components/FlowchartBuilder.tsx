'use client'

import { useState, useCallback } from 'react'
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  BackgroundVariant
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Save, Download, Upload } from 'lucide-react'

interface FlowchartBuilderProps {
  projectName: string;
  onSaveFlow: (nodes: Node[];
  edges: Edge[]) => void
}

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    position: { x: 250, y: 25 },
    data: { label: 'Start' }},
  {
    id: '2',
    position: { x: 100, y: 125 },
    data: { label: 'User Input' }},
  {
    id: '3',
    position: { x: 400, y: 125 },
    data: { label: 'Process Data' }},
  {
    id: '4',
    type: 'output',
    position: { x: 250, y: 250 },
    data: { label: 'End' }}]

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
  { id: 'e2-4', source: '2', target: '4' },
  { id: 'e3-4', source: '3', target: '4' }]

export default function FlowchartBuilder({ projectName, onSaveFlow }: FlowchartBuilderProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [nodeId, setNodeId] = useState(5)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const addNode = useCallback(() => {
    const newNode: Node = {
      id: nodeId.toString(),
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: `Node ${nodeId}` }}
    setNodes((nds) => nds.concat(newNode))
    setNodeId((id) => id + 1)
  }, [nodeId, setNodes])

  const saveFlow = useCallback(() => {
    onSaveFlow(nodes, edges)
    alert('Flow saved successfully!')
  }, [nodes, edges, onSaveFlow])

  const exportFlow = useCallback(() => {
    const flowData = {
      nodes,
      edges,
      projectName,
      timestamp: new Date().toISOString()}
    const dataStr = JSON.stringify(flowData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `${projectName}-flowchart.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }, [nodes, edges, projectName])

  const importFlow = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
          </HTMLInputElement>
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const flowData = JSON.parse(e.target?.result as string)
          if (flowData.nodes && flowData.edges) {
            setNodes(flowData.nodes)
            setEdges(flowData.edges)
            alert('Flow imported successfully!')
          }
        } catch {
          alert('Error importing, flow: Invalid file format')
        }
      }
      reader.readAsText(file)
    }
  }, [setNodes, setEdges])

  return (
    <div className="h-full flex flex-col"></div>
      <Card className="mb-4"></Card>
        <CardHeader></CardHeader>
          <CardTitle className="flex items-center justify-between"></CardTitle>
            <span>Flowchart Builder - {projectName}</span>
            <div className="flex gap-2"></div>
              <Button onClick={addNode} size="sm" variant="outline"></Button>
                <Plus className="w-4 h-4 mr-1" />
                Add Node</Plus>
              <Button onClick={saveFlow} size="sm" variant="outline"></Button>
                <Save className="w-4 h-4 mr-1" />
                Save</Save>
              <Button onClick={exportFlow} size="sm" variant="outline"></Button>
                <Download className="w-4 h-4 mr-1" />
                Export</Download>
              <label className="cursor-pointer"></label>
                <Button size="sm" variant="outline" asChild></Button>
                  <span></span>
                    <Upload className="w-4 h-4 mr-1" />
                    Import</Upload>
                <input
                  type="file"
                  accept=".json"
                  onChange={importFlow}
                  className="hidden"
                /></input>
        <CardContent></CardContent>
          <p className="text-sm text-gray-600">
            Create and visualize your project workflow. Drag nodes to reposition them, 
            connect nodes by dragging from one node to another, and use the controls to navigate.</p>

      <div className="flex-1 border border-gray-200 rounded-lg overflow-hidden"></div>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          attributionPosition="bottom-left"
        ></ReactFlow>
          <Controls /></Controls>
          <MiniMap /></MiniMap>
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} /></Background>

      <Card className="mt-4"></Card>
        <CardContent className="pt-4"></CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm"></div>
            <div></div>
              <h4 className="font-medium text-gray-900 mb-1">Navigation</h4>
              <p className="text-gray-600">Use mouse wheel to zoom, drag to pan</p>
            <div></div>
              <h4 className="font-medium text-gray-900 mb-1">Connections</h4>
              <p className="text-gray-600">Drag from node edge to create connections</p>
            <div></div>
              <h4 className="font-medium text-gray-900 mb-1">Editing</h4>
              <p className="text-gray-600">Double-click nodes to edit labels</p>
    );
}
