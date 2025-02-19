"use client";

import { useState, useCallback, useMemo, useRef, useEffect, createContext, useContext, ReactNode } from 'react';
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
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"; // Import ShadCN Breadcrumb
import { Button } from "@/components/ui/button"
import { v4 as uuidv4 } from 'uuid';
import { UploadIcon, VideosIcon, AddIcon } from '../../../../../../public/assets/Icons';
import useCameraService from '@/app/cameras/hooks/useCameraService';
import WebCamSettingsActiveComponent from './components/reactFlowCardNodes/collectDataNode/webCamActiveComponent/WebCamSettingsActiveComponent';
import CollectDataUsingWebcam from './components/reactFlowCardNodes/collectDataNode/webCamActiveComponent/CollectDataUsingWebcam';
import CardHeaderComponent from './components/reactFlowCardNodes/collectDataNode/cardHeaderComponent/CardHeaderComponent';
import TrainModelForm from './components/reactFlowCardNodes/adjustTrainSettingsNode/TrainingNodeForm';
import { RegionStructure } from '@/app/operations/regions/structures/RegionStructure';
import { Urls } from './components';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import CollectDataUsingUpload from './components/reactFlowCardNodes/collectDataNode/uploadActiveComponent/CollectDataUsingUpload';
import useRegionService from '@/app/operations/regions/hooks/useRegions';

const capturedImagesList: string[] = [];
const initialRegion: RegionStructure = {
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
      side: 100,
    },
  },
};
export interface LabelAnnotationModel extends Record<string, unknown> {
  annotation_id: string;
  annotation: {
    annotation_type: 'LABEL'
    label: string;
    images: string[];
    camera_id?: string;
    region: RegionStructure;
  };
  creator: string;
  creation_date: string;
  modification_date: string;
  status: {
    active: boolean;
  };
}

const cardClassAnnotations: LabelAnnotationModel[] = [];
let datasetId = "";

// ✅ Create Context
const TrainingContext = createContext<{
  isTrainingDone: boolean;
  setIsTrainingDone: (done: boolean) => void;
} | null>(null);

// ✅ Create Provider Component
export const TrainingProvider = ({ children }: { children: ReactNode }) => {
  const [isTrainingDone, setIsTrainingDone] = useState(false);

  return (
    <TrainingContext.Provider value={{ isTrainingDone, setIsTrainingDone }}>
      {children}
    </TrainingContext.Provider>
  );
};

// ✅ Hook to Use Context
export const useTraining = () => {
  const context = useContext(TrainingContext);
  if (!context) {
    throw new Error("useTraining must be used within a TrainingProvider");
  }
  return context;
};

function ClassNode({ data }: { data: LabelAnnotationModel }) {
  const [cameras, savedCameraIDs] = useCameraService();
  const [regions, savedRegionIDs] = useRegionService();
  const [selectedCameraId, setSelectedCameraId] = useState<string>(cameras.length > 0 ? cameras[0].id : '');
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [cardCapturedImages, setCardCapturedImages] = useState<{ [ClassCardAnnotationId: string]: Array<any> }>({});
  const [classCardAnnotation, setClassCardAnnotation] = useState<LabelAnnotationModel>(data);
  const [selectedRegion, setSelectedRegion] = useState<RegionStructure>();


  useEffect(() => {
    if (cameras.length > 0 && !selectedCameraId) {
      setSelectedCameraId(cameras[0].id);
    }
  }, [cameras, selectedCameraId]);

  const [isEditingCardName, setIsEditingCardName] = useState(false);
  const [title, setTitle] = useState(data?.annotation?.label || 'class??');

  const [isUploadActive, setIsUploadActive] = useState(false);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);

  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [isWebcamSettingsActive, setIsWebcamSettingsActive] = useState(false);

  const handleEditClick = () => {
    setIsEditingCardName(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    setIsEditingCardName(false);
    data.annotation.label = title;
    setClassCardAnnotation(
      {
        ...classCardAnnotation,
        annotation: {
          ...classCardAnnotation.annotation,
          label: title,
        },
      }
    );
  };

  const handleWebcamClick = () => {
    setIsWebcamActive(true);
  };

  const handleUploadClick = () => {
    setIsCropModalOpen(true);
    setIsUploadActive(true);
  };

  useEffect(() => {
    console.log("data", data)
    console.log("capturedImages:", capturedImages);
    capturedImagesList.length = 0;
    capturedImages.forEach((image) => capturedImagesList.push(image));
    console.log("capturedImagesList:", capturedImagesList);
    setCardCapturedImages((prevCardCapturedImages) => ({
      ...prevCardCapturedImages,
      [classCardAnnotation.annotation_id]: capturedImages,
    }));
    setClassCardAnnotation((prevClassCardAnnotation) => ({
      ...prevClassCardAnnotation,
      annotation: {
        ...prevClassCardAnnotation.annotation,
        images: capturedImages,
        camera_id: selectedCameraId,
        region: selectedRegion || initialRegion,

      },
    }));
    console.log("classCardAnnotation:", classCardAnnotation);

  }, [capturedImages]);

  useEffect(() => {
    // check if the classCardAnnotation is already in the cardClassAnnotations, if so updtae otherwise, add it
    const index = cardClassAnnotations.findIndex((card) => card.annotation_id === classCardAnnotation.annotation_id);
    if (index !== -1) {
      cardClassAnnotations[index] = classCardAnnotation
    } else {
      cardClassAnnotations.push(classCardAnnotation);
    }
    console.log("cardClassAnnotations:", cardClassAnnotations);

  }, [classCardAnnotation]);

  return (
    <>
      <Card className="w-full max-w-[450px] h-auto">
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
          {isUploadActive ? (
            <div className="flex flex-row">
              <CollectDataUsingUpload
                capturedImages={capturedImages}
                setCapturedImages={setCapturedImages}
                setIsUploadActive={setIsUploadActive}
                setIsCropModalOpen={setIsCropModalOpen}
                isCropModalOpen={isCropModalOpen}
                savedRegions={regions}
                savedRegionIDs={savedRegionIDs}
              />
            </div>
          ) :
            isWebcamActive ? (
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
                  capturedImages={capturedImages}
                  setCapturedImages={setCapturedImages}
                  setSelectedRegion={setSelectedRegion}
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
                <Button variant="outline" size="sm" onClick={handleUploadClick}>
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

function CreateDatasetNode() {
  const [isCreatingDataset, setIsCreatingDataset] = useState(false);
  const handleCreateDataset = async () => {

    if (cardClassAnnotations.length === 0) {
      alert("No classes to create dataset!");
      toast({
        title: "No Classes",
        variant: "destructive",
        description: "No classes to create dataset",
      });
      return;
    }
    setIsCreatingDataset(true);

    try {
      // console.log(Urls.fetchCreatedDataset)
      const response = await fetch(Urls.fetchCreatedDataset, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ annotations: cardClassAnnotations }), // Send all classes
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Dataset created:", data.datasetId);
        datasetId = data.datasetId;
        toast({
          title: "Dataset Created",
          description: `Dataset created successfully! ID: ${data.datasetId}`,
        });
        setIsCreatingDataset(false);
        // alert(`Dataset created successfully! ID: ${data.datasetId}`);
      } else {
        console.error("Dataset creation failed:", data.message);
        toast({
          title: "Dataset Creation Failed",
          variant: "destructive",
          description: data.message,
        });
        setIsCreatingDataset(false);
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Dataset Creation Failed",
        variant: "destructive",
        description: "Failed to create dataset completely",
      });
      setIsCreatingDataset(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-[100px] w-[250px] border-dashed border-2 border-gray-300 rounded-lg bg-gray-100 cursor-pointer">
      <Button
        onClick={handleCreateDataset}
        variant="outline"
        className="text-sm"
        disabled={cardClassAnnotations.length === 0 || isCreatingDataset}
      >
        {isCreatingDataset ? (
          <>
            <Loader2 className="animate-spin" />
            Creating Dataset...
          </>
        ) : (
          <>
            <AddIcon /> Create Dataset
          </>
        )}
      </Button>
    </div>
  );
}

function AddClassNode({ onAddClass }: { onAddClass: () => void }) {
  return (
    <>
      <div className="flex items-center justify-center h-[100px] w-[250px] border-dashed border-2 border-gray-300 rounded-lg bg-gray-100 cursor-pointer">
        <Button onClick={onAddClass} variant="outline" className="text-sm">
          <AddIcon /> Add a class
        </Button>
      </div>
      {/* <Handle type="source" position={Position.Right} /> */}
    </>
  );
}

function TrainingNode() {
  const { setIsTrainingDone } = useTraining();

  const handleTrainingComplete = () => {
    console.log("Training Completed!");
    setIsTrainingDone(true);
  };

  return (
    <>
      <Handle type="target" position={Position.Left} />
      <TrainModelForm datasetId={datasetId} onTrainingComplete={handleTrainingComplete} />
      <Handle type="source" position={Position.Right} />
    </>
  );
}

function PreviewNode({ data }: any) {
  const [prediction, setPrediction] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { isTrainingDone } = useTraining();

  const runInference = async () => {
    console.log("Started Inference process");
    setIsProcessing(true);

    try {
      // implement a default image or error messgae if the imageUrl throws an error

      const response = await fetch(Urls.fetchInferenceResults, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // id: "0414fdee-e281-404e-bb31-5563239bbf6f",
          // imageUrl: `${Urls.fetchPhantomCamera}/Camera1/region/8699f6b4-128a-40ac-9407-1c35a087190b/stream`
          id: datasetId,
          imageUrl: `${Urls.fetchPhantomCamera}/${cardClassAnnotations[0].annotation.camera_id}/region/${cardClassAnnotations[0].annotation.region.id}/stream`
        }),
      });

      // ✅ Parse JSON once and store the result
      const result = await response.json();
      if (result.predictions && result.predictions.length > 0) {
        // ✅ Extract all predictions from **first frame** (outer array)
        const formattedPrediction = result.predictions[0] // ⬅ Extract first frame
          .map((pred: { label: any; confidence: number }) =>
            `${pred.label} (${(pred.confidence * 100).toFixed(2)}%)`
          )
          .join(", ");

        setPrediction(formattedPrediction); // ✅ Set formatted string
      }
      else {
        setPrediction("No prediction found");
      }

    } catch (error) {
      console.error("🔴 Inference Error:", error);
      setPrediction("Failed to run model");

    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (isTrainingDone) {
      const interval = setInterval(() => {
        runInference();
      }, 500);

      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTrainingDone]);


  return (
    <>
      <Handle type="target" position={Position.Left} />
      <Card className="w-[200px] h-auto">
        <CardHeader className="flex flex-row justify-between items-center space-x-2 px-3 py-2">
          <CardTitle className="text-sm">{data.label}</CardTitle>
          {/* <Button variant="outline" size="sm" className="text-sm" onClick={runInference}
          disabled={!data.isTrained}
          >
            {isProcessing ? "Processing..." : "Run Model"}
          </Button> */}
        </CardHeader>
        <div className="border-t border-gray-300" />
        <CardContent className="flex flex-col px-3 py-2">
          {(!isTrainingDone) ? (
            <CardDescription className="text-sm">
              You must train the model on the left before you can preview it here.
            </CardDescription>
          ) : (
            <>
              <div className="w-full h-[120px] bg-gray-100 flex items-center justify-center">
                <img
                  src={
                    `${Urls.fetchPhantomCamera}/${cardClassAnnotations[0].annotation.camera_id}/region/${cardClassAnnotations[0].annotation.region.id}/stream`
                    // `${Urls.fetchPhantomCamera}/Camera1/region/8699f6b4-128a-40ac-9407-1c35a 087190b/stream`
                  }
                  alt="Cropped Stream"
                  className="max-h-full max-w-full"
                />
              </div>
              <div className="border-t border-gray-300 my-2" />
              <CardDescription className="text-sm text-center">
                {prediction ? `Prediction: ${prediction}` : "Click 'Run Model' to get results"}
              </CardDescription>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}

const initialNodes = [
  {
    id: 'classNode1',
    type: 'classNode',
    position: { x: 100, y: 100 },
    data: {
      annotation_id: '1',
      annotation: {
        annotation_type: 'LABEL',
        label: 'Cat',
        images: [],
        camera_id: 'Camera1',
        region: {
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
              side: 100,
            },
          },
        }
      },
      creator: 'karen',
      creation_date: new Date().toISOString(),
      modification_date: new Date().toISOString(),
      status: { active: true },
    }
  },
  {
    id: 'classNode2',
    type: 'classNode',
    position: { x: 100, y: 300 },
    data: {
      annotation_id: '1',
      annotation: {
        annotation_type: 'LABEL',
        label: 'Dog',
        images: [],
        camera_id: 'Camera1',
        region: {
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
              side: 100,
            },
          },
        }
      },
      creator: 'karen',
      creation_date: new Date().toISOString(),
      modification_date: new Date().toISOString(),
      status: { active: true },
    }
  },
  {
    id: 'classNode3',
    type: 'classNode',
    position: { x: 100, y: 500 },
    data: {
      annotation_id: '1',
      annotation: {
        annotation_type: 'LABEL',
        label: 'Other',
        images: [],
        camera_id: 'Camera1',
        region: {
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
              side: 100,
            },
          },
        }
      },
      creator: 'karen',
      creation_date: new Date().toISOString(),
      modification_date: new Date().toISOString(),
      status: { active: true },
    }
  },
  {
    id: 'training',
    position: { x: 500, y: 300 },
    data: { label: 'Training' },
    type: 'trainingNode',
  },
  {
    id: 'preview',
    position: { x: 800, y: 300 },
    data: {
      label: 'Preview',
      isTrained: false,
      croppedStreamRegion: RegionStructure
    },
    type: 'previewNode',
  },
  {
    id: 'addClass',
    type: 'addClassNode',
    position: { x: 100, y: 700 },
    data: { onAddClass: () => { } },
  },
  {
    id: 'createDataset',
    type: 'createDatasetNode',
    position: { x: 500, y: 700 },
    data: { onCreateDataset: () => { } },
  },
];

const initialEdges = [
  { id: 'e1-training', source: 'classNode1', target: 'training' },
  { id: 'e2-training', source: 'classNode2', target: 'training' },
  { id: 'e3-training', source: 'classNode3', target: 'training' },
  { id: 'e2-preview', source: 'training', target: 'preview' },
];

function Flow() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const addClassNode = useCallback(() => {
    const newId = `${nodes.length + 1}`;

    const annotation_id = newId;
    const creator = 'karen';
    const creation_date = new Date().toISOString(); // Proper date format
    const modification_date = new Date().toISOString();
    const status = { active: true };

    const newCard: LabelAnnotationModel = {
      annotation_id,
      annotation: {
        annotation_type: 'LABEL',
        label: 'New Label',
        images: [],
        camera_id: 'Camera1',
        region: {
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
              side: 100,
            },
          },
        }
      },
      creator,
      creation_date,
      modification_date,
      status
    };

    cardClassAnnotations.push(newCard);

    const newNode: Node<LabelAnnotationModel> = {
      id: newId,
      type: 'classNode',
      position: { x: Math.random() * 250, y: Math.random() * 250 },
      data: newCard,
    };

    setNodes((nds) => [...nds, newNode]);

    setEdges((eds) => [
      ...eds,
      { id: `e${newId}-training`, source: newId, target: 'training' },
    ]);
  }, [nodes, edges]);


  const nodeTypes = useMemo(
    () => ({
      classNode: ClassNode,
      // trainingNode: (props: any) => <TrainingNode {...props} setNodes={setNodes} />,
      trainingNode: TrainingNode,
      previewNode: PreviewNode,
      addClassNode: (props: any) => <AddClassNode {...props} onAddClass={addClassNode} />,
      createDatasetNode: CreateDatasetNode,
    }),
    [addClassNode,
      // setNodes
    ]
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
    <div className="h-screen w-full flex flex-col bg-gray-50 dark:bg-gray-800">
      {/* ✅ Breadcrumb Navigation */}
      <div className="sticky top-0 bg-gray-50 dark:bg-gray-800 z-10 py-4 px-6 shadow-md">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/models">Models</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/models/actions/trainModel">Train Model</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="text-gray-500 dark:text-gray-400">
                Classification Model
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h2 className="text-xl font-bold text-center mt-2 text-gray-900 dark:text-white">
          Classification Model Training
        </h2>
      </div>

      {/* ✅ ReactFlow Diagram */}
      <div className="flex-1 overflow-hidden">
        <TrainingProvider>
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
            {/* <MiniMap /> */}
          </ReactFlow>
        </TrainingProvider>
      </div>
    </div>
  );
}

export default Flow;
