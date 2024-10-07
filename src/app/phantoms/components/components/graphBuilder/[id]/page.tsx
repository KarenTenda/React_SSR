"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  ReactFlowProvider,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import ImageNode from '../../nodeBuilder/nodes/ImageNode';
import CalibrationNode from '../../nodeBuilder/nodes/CalibrationNode';
import { Button } from '@/components/ui/button';
import useCameraService from '@/app/cameras/hooks/useCameraService';
import CreateNodeForm from '../../nodeBuilder/nodes/customNode/CreateNodeForm';

const nodeTypes = {
  imageNode: ImageNode,
  calibrationNode: CalibrationNode,
  customNode: CreateNodeForm,
};

const initialPosition = { x: 200, y: 200 };

const GraphPage = () => {
  const initialNodes = [
    {
      id: '1',
      type: 'imageNode',
      position: { x: 100, y: 100 },
      data: { cameras: [], camera_id: 'Camera1' },
    },
    {
      id: '3',
      type: 'calibrationNode',
      position: { x: 700, y: 100 },
      data: {},
    },
  ];
  const initialEdges = [
    {
      id: '1',
      source: '1',
      target: '3'
    },

  ];
  const [nodes, setNodes] = useState<any[]>(initialNodes);
  const [edges, setEdges] = useState<any[]>(initialEdges);
  const [nodeId, setNodeId] = useState(4);

  const onNodesChange: OnNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange: OnEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onConnect: OnConnect = useCallback((connection) => setEdges((eds) => addEdge(connection, eds)), []);

  const addNode = (type: string) => {
    const newNode = {
      id: `${nodeId}`,
      type: type,
      position: { ...initialPosition },
      data: {},
    };
    setNodeId(nodeId + 1);
    setNodes((prevNodes) => [...prevNodes, newNode]);
  };

  return (
    <ReactFlowProvider>
      <div className="flex">
        <div className="p-4 w-[250px] bg-gray-100 border-r border-gray-300">
          <h2 className="font-bold mb-4">Add Node</h2>

          <Button className="mb-2 w-full" onClick={() => addNode('imageNode')}>Add Image Node</Button>
          <Button className="mb-2 w-full" onClick={() => addNode('calibrationNode')}>Add Calibration Node</Button>
          <Button className="mb-2 w-full" onClick={() => addNode('customNode')}>Add Custom Node</Button>
        </div>

        <div className="w-full h-screen">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background color="#aaa" gap={16} />
            <Controls />
          </ReactFlow>
        </div>
      </div>
    </ReactFlowProvider>
  );
};

export default GraphPage;
