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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuCheckboxItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

import { Button } from "@/components/ui/button"
import { UploadIcon, VideosIcon, DotsVerticalIcon, PencilIcon, SettingsIcon, InfoIcon, DeleteIcon } from '../../../../public/assets/Icons';
import { DropdownMenuCheckboxItemProps } from '@radix-ui/react-dropdown-menu';
import axios from 'axios';
import Urls from '@/constants/Urls';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';
import ClickableIconButton from '@/components/custom/buttons/ClickableIconButton';
import useCameraService from '@/app/cameras/hooks/useCameraService';
import { CropIcon } from 'lucide-react';
import Cropper from 'react-easy-crop';

interface RegionStructure {
  id: string;
  type: string;
  enabled: boolean;
  reference_resolution: number[];
  shape: {
    shape: {
      geometry_type: number;
      center: {
        geometry_type: number;
        x: number;
        y: number;
      };
      side: number;
    };
  };
}

function ClassNode({ data }: any) {
  const [cameras, savedCameraIDs] = useCameraService();
  const [selectedCameraId, setSelectedCameraId] = useState(cameras.length > 0 ? cameras[0].id : '');
  const [selectedRegion, setSelectedRegion] = useState<RegionStructure | null>({
    id: uuidv4(),
    type: 'imashape',
    enabled: true,
    reference_resolution: [1280, 720],
    shape: {
      shape: {
        geometry_type: 3,
        center: {
          geometry_type: 8,
          x: 640,
          y: 360,
        },
        side: 720,
      },
    },
  });

  useEffect(() => {
    if (cameras.length > 0 && !selectedCameraId) {
      setSelectedCameraId(cameras[0].id);
    }
  }, [cameras, selectedCameraId]);

  const CROP_AREA_ASPECT = 3 / 2;
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState({
    x: selectedRegion?.shape.shape.center.x, 
    y: selectedRegion?.shape.shape.center.y,
    width: selectedRegion?.shape.shape.side, 
    height: selectedRegion?.shape.shape.side
  });
  const [isCropping, setIsCropping] = useState(false);
  const [isContinuousCapture, setIsContinuousCapture] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [isEditingCardName, setIsEditingCardName] = useState(false);
  const [title, setTitle] = useState(data.label);

  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [isWebcamSettingsActive, setIsWebcamSettingsActive] = useState(false);
  const [isUploadImagesActive, setIsUploadImagesActive] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const webcamRef = useRef(null);



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

  const handleCameraSelect = (cameraId: string) => {
    setSelectedCameraId(cameraId);
  };

  const handleCaptureImages = async () => {
    try {
      const response = await axios.get(`${Urls.fetchPhantomCamera}/${selectedCameraId}/image`, {
        responseType: 'arraybuffer'
      });
      const base64Image = Buffer.from(response.data, 'binary').toString('base64');
      const imageSrc = `data:image/jpeg;base64,${base64Image}`;
      setImages([...images, imageSrc]);

    } catch (error) {
      console.error("Error capturing image: ", error);
    }
  };

  const handleDeleteImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  function getCroppedImage(crop, image, croppedAreaPixels) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    const imageElement = new window.Image();
    imageElement.crossOrigin = "anonymous"; 
    imageElement.src = image;

    return new Promise((resolve, reject) => {
      imageElement.onload = () => {
        ctx?.drawImage(
          imageElement,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height
        );
        resolve(canvas.toDataURL("image/jpeg"));
      };
      imageElement.onerror = () => {
        reject(new Error("Failed to load the image"));
      };
    });
  }

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {

    setCroppedAreaPixels(croppedAreaPixels);
    console.log(croppedAreaPixels);
    setSelectedRegion({
      ...selectedRegion,
      shape: {
        ...selectedRegion.shape,
        shape: {
          ...selectedRegion.shape.shape,
          center: {
            ...selectedRegion.shape.shape.center,
            x: croppedAreaPixels.x,
            y: croppedAreaPixels.y
          },
          side: croppedAreaPixels.width
        }
      }
    });
  }, []);

  const handleCaptureImage = useCallback(async () => {
    try {
      const response = await axios.get(`${Urls.fetchPhantomCamera}/${selectedCameraId}/image`, {
        responseType: 'arraybuffer'
      });
      const base64Image = Buffer.from(response.data, 'binary').toString('base64');
      const imageSrc = `data:image/jpeg;base64,${base64Image}`;
      const croppedImage = await getCroppedImage(crop, imageSrc, croppedAreaPixels);
      setImages(prevImages => [...prevImages, croppedImage]);
    } catch (error) {
      console.error("Error capturing image: ", error);
    }
  }, [crop, croppedAreaPixels, selectedCameraId]);

  const startContinuousCapture = () => {
    setIsContinuousCapture(true);
    intervalRef.current = setInterval(handleCaptureImage, 500); // Capture every 1/2 second
  };

  const stopContinuousCapture = () => {
    setIsContinuousCapture(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <>
      <Card className="w-[300px] h-auto">
        <CardHeader className="flex flex-row justify-between items-center px-3 py-2">
          <div className="flex items-center space-x-2">
            {isEditingCardName ? (
              <input
                value={title}
                onChange={handleTitleChange}
                onBlur={handleTitleBlur}
                className="text-sm border-b border-gray-300 focus:outline-none"
                autoFocus
              />
            ) : (
              <CardTitle className="flex flex-row text-sm">
                {title}
                <PencilIcon
                  className="w-4 h-4 ml-2 cursor-pointer text-gray-400"
                  onClick={handleEditClick}
                />
              </CardTitle>
            )}
          </div>
          <Button variant="ghost" size="sm" className="text-sm p-1">
            <DotsVerticalIcon className="w-5 h-5 text-gray-400" />
          </Button>
        </CardHeader>
        <div className="border-t border-gray-300 my-2" />
        <CardContent className="px-3 py-2">
          {isWebcamActive ? (
            isWebcamSettingsActive ? (
              <>
                <div className="flex flex-row justify-between items-center space-y-2">
                  <h6 className=" font-medium text-sm">Settings{
                    <ClickableIconButton
                      Icon={InfoIcon}
                      onClick={() => setIsWebcamSettingsActive(false)}
                      tooltipText={`Here, you can set the way you want to collect your images. 
                      Either by setting the number of Images or clicking the Capture Image button to capture images manually.`}
                    />
                  }</h6>
                  <Button variant="ghost" size="sm" className="text-sm mb-2" onClick={() => setIsWebcamSettingsActive(false)}>
                    x
                  </Button>
                </div>
              </>
            ) : (
              <div className='flex flex-row'>
                <div className="flex flex-col justify-between w-full">
                  <div className="flex flex-row justify-between items-center w-full">
                    <h6 className=" font-medium text-sm">Webcam</h6>
                    <Button className='text-sm' variant="ghost" size="sm" onClick={() => setIsWebcamActive(false)}>
                      x
                    </Button>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className='text-sm' variant="outline" size="sm">Switch Camera</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>Available Cameras</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {cameras.map((camera) => (
                        <DropdownMenuCheckboxItem
                          key={camera.id}
                          checked={selectedCameraId === camera.id}
                          onCheckedChange={() => handleCameraSelect(camera.id)}
                        >
                          {camera.name}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {isCropping ? (
                    <>
                      <div className="relative h-40" style={{ userSelect: 'none', pointerEvents: 'auto' }}>
                        <Cropper
                          image={`${Urls.fetchPhantomCamera}/Camera1/stream`}
                          aspect={CROP_AREA_ASPECT}
                          crop={crop}
                          zoom={zoom}
                          onCropChange={setCrop}
                          onZoomChange={setZoom}
                          onCropComplete={onCropComplete}
                          objectFit="contain" 
                          
                          style={{
                            containerStyle: {
                              width: '100%',
                              height: '100%',
                              position: 'relative'
                            },
                            cropAreaStyle: {
                              width: '100%',
                              height: '100%',
                            },
                          }}
                        />
                      </div>

                      <div className="flex flex-row justify-between items-center space-x-2 ">
                        <Button className='text-sm' variant="outline" size="sm" onClick={() => setIsCropping(false)}>
                          Done Cropping
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="relative ">
                        <img
                          ref={webcamRef}
                          src={`${Urls.fetchPhantomCamera}/Camera1/stream`}
                          className="w-full h-40 mb-2 pt-2"
                          loading='lazy'
                          // width={selectedRegion?.shape.shape.side}
                          // height={selectedRegion?.shape.shape.side}
                          // style={{
                          //   objectFit: 'contain',
                          //   objectPosition: 'center',
                          //   top:`${selectedRegion?.shape.shape.center.y}px`,
                          // left:`${selectedRegion?.shape.shape.center.x}px`,
                          // }}
                          

                        />
                        <Button
                          onClick={() => setIsCropping(true)}
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 left-0 bg-transparent text-[#FA8072] rounded-full p-1 w-6 h-6 flex items-center justify-center"
                        >
                          <CropIcon />
                        </Button>

                      </div>

                      <div className="flex flex-row justify-between items-center space-x-2 ">
                        <Button className='text-sm' 
                          variant="outline" 
                          size="sm" 
                          onClick={isContinuousCapture ? stopContinuousCapture : startContinuousCapture}
                        >
                          {isContinuousCapture ? "Stop " : "Start "}
                        </Button>
                        <ClickableIconButton
                          Icon={SettingsIcon}
                          onClick={() => setIsWebcamSettingsActive(true)}
                          tooltipText='Edit'

                        />
                      </div>
                    </>
                  )}

                </div>

                <div className="border-l border-gray-300 mx-1"></div>

                <div className="flex flex-col w-full">
                  <h6 className="font-medium text-sm">Image Samples</h6>
                  <div className="grid grid-cols-4 gap-2 mt-2 max-h-[200px] overflow-y-auto">
                    {images.map((image, index) => (
                      <div key={index} className="relative ">
                        <img
                          src={image}
                          alt={`capture-${index}`}
                          // className="object-contain rounded-md w-full h-full"
                          // width={50}
                          // height={50}
                          loading='lazy'
                        />
                        <Button
                          onClick={() => handleDeleteImage(index)}
                          variant="ghost"
                          size="sm"
                          className="absolute top-0 left-0 bg-transparent text-[#FA8072] rounded-full p-1 w-4 h-4 flex items-center justify-center"
                        >
                          <DeleteIcon />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )
          ) : (
            <>
              <p className="text-sm mb-2">Add Image Samples:</p>
              <div className="flex space-x-2">
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
          + Add a class
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
      <Card className="w-[200px] h-auto">
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
      </Card>
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

  const nodeTypes = useMemo(() => ({
    classNode: ClassNode,
    trainingNode: TrainingNode,
    previewNode: PreviewNode,
    addClassNode: (props: any) => <AddClassNode {...props} onAddClass={addClassNode} />
  }), []);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes],
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  );
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  const addClassNode = () => {
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
  };

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
