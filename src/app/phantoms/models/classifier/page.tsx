"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  type OnConnect,
  type OnNodesChange,
  type OnEdgesChange,
  type Node,
  type Edge,
  addEdge,
  Handle,
  Position,
  MiniMap,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { UploadIcon, VideosIcon, AddIcon } from '../../../../../public/assets/Icons';
import useCameraService from '@/app/cameras/hooks/useCameraService';
import WebCamSettingsActiveComponent from './components/reactFlowCardNodes/collectDataNode/webCamActiveComponent/WebCamSettingsActiveComponent';
import CollectDataUsingWebcam from './components/reactFlowCardNodes/collectDataNode/webCamActiveComponent/CollectDataUsingWebcam';
import CardHeaderComponent from './components/reactFlowCardNodes/collectDataNode/cardHeaderComponent/CardHeaderComponent';
import TrainModelForm from './components/reactFlowCardNodes/adjustTrainSettingsNode/TrainingNodeForm';


function ClassNode({ data }: any) {
  const [cameras, savedCameraIDs] = useCameraService();
  const [selectedCameraId, setSelectedCameraId] = useState(cameras.length > 0 ? cameras[0].id : '');
  
  useEffect(() => {
    if (cameras.length > 0 && !selectedCameraId) {
      setSelectedCameraId(cameras[0].id);
    }
  }, [cameras, selectedCameraId]);

  const [isEditingCardName, setIsEditingCardName] = useState(false);
  const [title, setTitle] = useState(data.label);

  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [isWebcamSettingsActive, setIsWebcamSettingsActive] = useState(false);
  const [isUploadImagesActive, setIsUploadImagesActive] = useState(false);
  
  const handleEditClick = () => {
    setIsEditingCardName(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    setIsEditingCardName(false);
    data.label = title;
  };

  const handleWebcamClick = () => {
    setIsWebcamActive(true);
  };

  const handleUploadClick = () => {
    setIsUploadImagesActive(true);
  };


  return (
    <>
      <Card className="w-[300px] h-auto">
        <CardHeaderComponent
          title={title}
          onEditClick={handleEditClick}
          isEditing={isEditingCardName}
          setIsEditing={setIsEditingCardName}
          onTitleChange={handleTitleChange}
          onTitleBlur={handleTitleBlur}
        />

        <div className="border-t border-gray-300" />

        <CardContent className="px-3 py-0">
          {isWebcamActive ? (
            isWebcamSettingsActive ? (
              <>
                <WebCamSettingsActiveComponent 
                  setIsWebcamSettingsActive={setIsWebcamSettingsActive} 
                /> 
              </>
            ) : (
              <div className='flex flex-row'>
                <CollectDataUsingWebcam
                  selectedCameraId={selectedCameraId}
                  setSelectedCameraId={setSelectedCameraId}
                  cameras={cameras}
                  setIsWebcamActive={setIsWebcamActive}
                  setIsWebcamSettingsActive={setIsWebcamSettingsActive}
                />

              </div>
            )
           ) : (
            <>
              <p className="text-sm mb-2">Add Image Samples:</p>
              <div className="flex space-x-2 pb-2">
                <Button variant="outline" size="sm" onClick={handleWebcamClick}>
                  <VideosIcon className="mr-2" />
                  Webcam
                </Button>
                <Button variant="outline" size="sm">
                  <UploadIcon className="mr-2" />
                  Upload
                </Button>
              </div>
            </>
           )}
        </CardContent>
      </Card> 
      <Handle type="source" position={Position.Right} />
    </>
  );
}

function AddClassNode({ onAddClass }: { onAddClass: () => void }) {
  return (
    <>
      <div className="flex items-center justify-center h-[100px] w-[250px] border-dashed border-2 border-gray-300 rounded-lg bg-gray-100 cursor-pointer">
        <Button onClick={onAddClass} variant="outline" className="text-sm">
          <AddIcon/> Add a class
        </Button>
      </div>
      {/* <Handle type="source" position={Position.Right} /> */}
    </>
  );
}

function TrainingNode({ data }: any) {
  return (
    <>
      <Handle type="target" position={Position.Left} />
      {/* <Card className="w-[200px] h-auto">
        <CardHeader className="flex justify-between px-3 py-2">
          <CardTitle className="text-sm items-left">{data.label}</CardTitle>
          <Button variant="outline" size="sm" className="text-sm items-center">
            Train Model
          </Button>
        </CardHeader>
        <div className="border-t border-gray-300" />
        <CardContent className="flex flex-col px-3 py-2">
          <Accordion type="single" collapsible className="w-full text-sm">
            <AccordionItem value="item-1">
              <AccordionTrigger>Advanced</AccordionTrigger>
              <AccordionContent>
                Training settings
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card> */}
      <TrainModelForm/>

      <Handle type="source" position={Position.Right} />
    </>
  );
}

function PreviewNode({ data }: any) {
  return (
    <>
      <Handle type="target" position={Position.Left} />
      <Card className="w-[200px] h-auto ">
        <CardHeader className="flex flex-row justify-between items-center space-x-2 px-3 py-2">
          <CardTitle className="text-sm">{data.label}</CardTitle>
          <Button variant="outline" size="sm" className="text-sm">
            Export Model
          </Button>
        </CardHeader>
        <div className="border-t border-gray-300" />
        <CardContent className="flex flex-col px-3 py-2">
          <CardDescription className="text-sm">
            You must train the model on the left before you can preview it here.
          </CardDescription>
        </CardContent>

      </Card>
    </>
  );
}

const initialNodes = [
  {
    id: '1',
    type: 'classNode',
    position: { x: 100, y: 100 },
    data: { label: 'Class 1' },
  },
  {
    id: 'training',
    position: { x: 400, y: 100 },
    data: { label: 'Training' },
    type: 'trainingNode',
  },
  {
    id: 'preview',
    position: { x: 650, y: 100 },
    data: { label: 'Preview' },
    type: 'previewNode',
  },
  {
    id: 'addClass',
    type: 'addClassNode',
    position: { x: 100, y: 300 },
    data: { onAddClass: () => { } },
  },
];

const initialEdges = [
  { id: 'e1-training', source: '1', target: 'training' },
  { id: 'e2-preview', source: 'training', target: 'preview' },
];

function Flow() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  // Function to add a new class node
  const addClassNode = useCallback(() => {
    const newId = `${nodes.length + 1}`;
    setNodes((nds) => [
      ...nds,
      {
        id: newId,
        type: 'classNode',
        position: { x: Math.random() * 250, y: Math.random() * 250 },
        data: { label: `Class ${newId}` },
      },
    ]);
    setEdges((eds) => [
      ...eds,
      { id: `e${newId}-training`, source: newId, target: 'training' },
    ]);
  }, [nodes, edges]);

  const nodeTypes = useMemo(
    () => ({
      classNode: ClassNode,
      trainingNode: TrainingNode,
      previewNode: PreviewNode,
      addClassNode: (props: any) => <AddClassNode {...props} onAddClass={addClassNode} />
    }),
    [addClassNode] // Include `addClassNode` in the dependency array
  );

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    []
  );

  return (
    <div className='h-[100%] w-full'>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}

export default Flow;
