"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import CodePlayground from './CodePlayground';
import ClickableIconButton from '@/components/custom/buttons/ClickableIconButton';
import { BackIcon } from '@/public/assets/Icons';
import NodePreview from './NodePreview';
import { Node } from '../../../schemas/NodeSchema';
import { v4 as uuidv4 } from 'uuid';
import { ReactFlow, ReactFlowProvider } from '@xyflow/react';
import { Pin } from '../../../schemas/PinSchema';

const WriteCodeConsole = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [inputNames, setInputNames] = useState<string[]>([]);
  const [outputNames, setOutputNames] = useState<string[]>([]);
  const [pins, setPins] = useState<Pin[]>([]);
  const [nodeData, setNodeData] = useState<Node>({
    id: uuidv4(),
    name: 'Node 1',
    position: [0, 0],
    pins: [],
    backgroundColor: '#f0f0f0', 
    content: 'Addition',        
    nodeType: 'default',
  })

  const nodes = [
    {
      id: nodeData.id,
      type: 'customNode',
      position: { x: nodeData.position[0], y: nodeData.position[1] },
      data: nodeData,
    },
  ];

  useEffect(() => {
    const inputs = searchParams.get('inputs');
    const outputs = searchParams.get('outputs');
    const pinsData = searchParams.get('pins');

    setInputNames(inputs ? JSON.parse(inputs) : []);
    setOutputNames(outputs ? JSON.parse(outputs) : []);
    setPins(pinsData ? JSON.parse(pinsData) : []);
  }, [searchParams]);

  useEffect(() => {
    setNodeData((prevNodeData) => ({
      ...prevNodeData,
      pins: pins,  
    }));
  }, [pins]);

  const [pythonCode, setPythonCode] = useState('');

  const handleSubmitCode = () => {
    console.log('Python code submitted:', pythonCode);
  };

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className="write-code-section p-4">
      <div className="flex items-center mb-4">
        <ClickableIconButton
          Icon={BackIcon}
          onClick={handleBackClick}
          tooltipText="Go back"
          disabled={false}
        />
        <h1 className="text-2xl font-bold mb-4">Write Python Code for Your Node</h1>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Inputs:</h2>
        <ul>
          {inputNames.length > 0 ? (
            inputNames.map((input: string, index: number) => (
              <li key={index}>{input}</li>
            ))
          ) : (
            <li>No inputs provided</li>
          )}
        </ul>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Outputs:</h2>
        <ul>
          {outputNames.length > 0 ? (
            outputNames.map((output: string, index: number) => (
              <li key={index}>{output}</li>
            ))
          ) : (
            <li>No outputs provided</li>
          )}
        </ul>
      </div>

      <div className="flex flex-row">
        <div className="flex-1 p-4">
          <h2 className="text-xl font-bold mb-4">Write Custom Python Code</h2>
          <CodePlayground code={pythonCode} setCode={setPythonCode} />
        </div>
        <div className="w-80 p-4 border-l">
          <h2 className="text-xl font-bold mb-4">Node Preview</h2>
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              nodeTypes={{ customNode: NodePreview }} 
              style={{ width: '100%', height: '500px' }}
            />
          </ReactFlowProvider>
        </div>
      </div>

      <Button onClick={handleSubmitCode}>Submit Code</Button>
    </div>
  );
};

export default WriteCodeConsole;
