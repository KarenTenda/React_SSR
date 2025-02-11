"use client";

import React, { createContext, useContext, useReducer, ReactNode, useCallback, useEffect, use, useMemo, CSSProperties, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
    ReactFlow,
    Background,
    Connection,
    Controls,
    Edge,
    EdgeChange,
    MiniMap,
    XYPosition,
    NodeChange,
    applyNodeChanges,
    applyEdgeChanges,
    Position,
    Handle,
    useNodesState,
    useEdgesState,
    HandleProps
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsTrigger, TabsContent, TabsList } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useCameraService from "@/app/cameras/hooks/useCameraService";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { t } from "i18next";
import { Separator } from "@/components/ui/separator";
import { CameraStructure } from "@/app/cameras/structure/CameraStructure";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Urls from "@/lib/Urls";
import { RegionStructure } from "@/app/operations/regions/structures/RegionStructure";
import useRegionService from "@/app/operations/regions/hooks/useRegions";
import clsx from "clsx";
import ClickableIconButton from "@/components/custom/buttons/ClickableIconButton";
import { DeleteIcon } from "@/public/assets/Icons";

type EditorNodeCustomTypes =
    | 'Camera Provider'
    | 'Image Device'
    | 'Region Provider'
    | 'Inference Device'
    | 'Model Provider'
    | 'Communications Device'
    | 'Transform Device'

const EditorNodeCustomCardData = {
    "Camera Provider": {
        description:
            'Allows you to select the camera of interest.',
        type: 'Action',
    },
    "Image Device": {
        description: 'Returns image data in different formats from a camera.',
        type: 'Action'
    },
    "Region Provider": {
        description:
            'Shows the region of interest in the image or video.',
        type: 'Action',
    },
    "Inference Device": {
        description: 'Returns inference data from a model.',
        type: 'Action',
    },
    'Model Provider': {
        description: 'Returns a Model ID for the model of interest',
        type: 'Action',
    },
    "Communications Device": {
        description: 'This converts data to kto, vios, or any other format.',
        type: 'Action',
    },
    "Transform Device": {
        description: 'Convert or return original data.',
        type: 'Action',
    }
}

const EditorNodeCustomHandleData = {
    "Camera Provider": {
        inputs: 0,
        outputs: 1,
        inputHandles: [],
        outputHandles: [
            {
                id: uuidv4(),
                type: "source",
                datatype: "string",
                dataTypeColor: "string",
                data: { cameraId: "" },
                settings: { immutable: true },
            },
        ],
    },
    "Image Device": {
        inputs: 0,
        outputs: 3,
        inputHandles: [
            {
                id: uuidv4(),
                type: "source",
                datatype: "string",
                dataTypeColor: "string",
                data: { cameraId: "" },
                settings: { immutable: true },
            },
        ],
        outputHandles: [
            {
                id: uuidv4(),
                type: "source",
                datatype: "string",
                dataTypeColor: "string",
                data: { cameraId: "" },
                settings: { immutable: true },
            },
            {
                id: uuidv4(),
                type: "source",
                datatype: "ImageObject",
                dataTypeColor: "ImageObject",
                data: { cameraObject: null },
                settings: { immutable: true },
            },
            {
                id: uuidv4(),
                type: "source",
                datatype: "bytes",
                dataTypeColor: "bytes",
                data: { cameraImage: "" },
                settings: { immutable: true },
            },
        ],
    },
    "Region Provider": {
        inputs: 0,
        outputs: 1,
        inputHandles: [],
        outputHandles: [
            {
                id: uuidv4(),
                type: "source",
                datatype: "RegionData",
                dataTypeColor: "RegionData",
                data: { regionId: "", regionObject: null },
                settings: { immutable: true },
            },
        ],
    },
    "Model Provider": {
        inputs: 0,
        outputs: 1,
        inputHandles: [],
        outputHandles: [
            {
                id: uuidv4(),
                type: "source",
                datatype: "ModelData",
                dataTypeColor: "ModelData",
                data: { modelId: "", modelObject: null },
                settings: { immutable: true },
            },
        ],
    },
    "Inference Device": {
        inputs: 3,
        outputs: 1,
        inputHandles: [
            {
                id: uuidv4(),
                type: 'target',
                datatype: 'ImageObject',
                dataTypeColor: 'ImageObject',
                data: { cameraObject: null },
            },
            {
                id: uuidv4(),
                type: 'target',
                datatype: 'ModelData',
                dataTypeColor: 'ModelData',
                data: { modelId: '', modelObject: null },
            },
            {
                id: uuidv4(),
                type: 'target',
                datatype: 'RegionData',
                dataTypeColor: 'RegionData',
                data: { regionId: '', regionObject: null },
            },
        ],
        outputHandles: [
            {
                id: uuidv4(),
                type: "source",
                datatype: "InferenceResult",
                dataTypeColor: "InferenceResult",
                data: { inferenceResult: null },
                settings: { immutable: true },
            },
        ],
    },
    "Communications Device": {
        inputs: 2,
        outputs: 1,
        inputHandles: [
            {
                id: uuidv4(),
                type: 'target',
                datatype: 'InferenceResult',
                dataTypeColor: 'InferenceResult',
                data: {
                    type: '',
                    results: [],
                    regionID: '',
                    cameraID: '',
                    modelID: '',
                },
            },
            {
                id: uuidv4(),
                type: 'target',
                datatype: 'boolean',
                dataTypeColor: 'boolean',
                data: false,
            }
        ],
        outputHandles: [
            {
                id: uuidv4(),
                type: "source",
                datatype: "any",
                dataTypeColor: "any",
                data: { data: null },
                settings: { immutable: true },
            },
        ],
    },
    "Transform Device": {
        inputs: 1,
        outputs: 1,
        inputHandles: [
            {
                id: uuidv4(),
                type: 'target',
                datatype: 'InferenceResult',
                dataTypeColor: 'InferenceResult',
            },
        ],
        outputHandles: [
            {
                id: uuidv4(),
                type: "source",
                datatype: "any",
                dataTypeColor: "any",
                data: { data: null },
                settings: { immutable: true },
            },
        ],
    },
}

type datatype = 
    |"string" 
    | "number" 
    | "boolean" 
    | "ImageObject" 
    | "InferenceResult" 
    | "bytes" 
    | "RegionData"
    | "ModelData"

const DataTypesColors = {
    'string': '#4287f5',       // Gold
    'number': '#8E44AD',       // Deep Purple
    'boolean': '#27AE60',      // Emerald Green
    'object': '#E74C3C',       // Soft Red
    'array': '#2980B9',        // Bright Blue
    'bytes': '#D35400',        // Dark Orange
    'any': '#95A5A6',          // Neutral Gray
    'RegionData': '#48C9B0',   // Turquoise
    'ModelData': '#E56E56',    // Coral
    'ImageObject': '#F1C40F',  // Bright Yellow
    'InferenceResult': '#F39C12', // Golden Orange
};

type EditorHandle = {
    id: string;
    type: "source" | "target";
    datatype: datatype;
    dataTypeColor: keyof typeof DataTypesColors;
    data: any;
    settings: {
        immutable: boolean;
    };
}

type EditorNode = Node & {
    id: string;
    type: EditorNodeCustomTypes;
    position: XYPosition;
    data: {
        title: string;
        description: string;
        completed: boolean;
        current: boolean;
        metadata: {
            inputs: number;
            outputs: number;
            selectedHandle?: EditorHandle;
            inputHandles: EditorHandle[];
            outputHandles: EditorHandle[];
        };
        specificType: string;
    };
};

type EditorEdge = {
    id: string;
    source: string;
    target: string;
}

type EditorState = {
    nodes: EditorNode[];
    edges: EditorEdge[];
    selectedNode: EditorNode | null;
}

const initialState: EditorState = {
    nodes: [],
    edges: [],
    selectedNode: null,
};

type EditorActions =
    | { type: "LOAD_DATA", payload: { elements: EditorNode[], edges: EditorEdge[] } }
    | { type: "ADD_NODE", payload: EditorNode }
    | { type: "UPDATE_NODE", payload: { nodeId: string, value: EditorNode } }
    | { type: "DELETE_NODE", payload: { id: string } }
    | { type: "SELECT_NODE", payload: EditorNode | null }
    | { type: "ADD_EDGE", payload: { id: string, source: string, target: string, sourceHandle: string | null, targetHandle: string | null } }
    | { type: "DELETE_EDGE", payload: { id: string } }
    | { type: "UPDATE_EDGES", payload: EdgeChange[] }
    | { type: "UPDATE_NODES", payload: NodeChange[] }
    | { type: "PROPAGATE_DATA", payload: { targetNode: EditorNode, targetHandle: EditorHandle, sourceHandle: EditorHandle, value: any } }


const editorReducer = (state: EditorState, action: EditorActions): EditorState => {
    switch (action.type) {
        case "LOAD_DATA":
            return {
                ...state,
                nodes: action.payload.elements.map(node => ({
                    ...node,
                    type: node.type || "default",
                })),
                edges: action.payload.edges
            };
        case "ADD_NODE":
            return {
                ...state,
                nodes: [
                    ...state.nodes,
                    {
                        ...action.payload,
                        type: action.payload.type || "default",
                        data: {
                            ...action.payload.data,
                            metadata: {
                                ...action.payload.data.metadata,
                                inputHandles: action.payload.data.metadata.inputHandles || [],
                                outputHandles: action.payload.data.metadata.outputHandles || [],
                            },
                        },
                    },
                ],
            };
        case "UPDATE_NODE":
            const updatedNodes = state.nodes.map((node) =>
                node.id === action.payload.nodeId
                    ? {
                        ...node,
                        data: {
                            ...node.data,
                            metadata: {
                                ...node.data.metadata,
                                outputHandles: action.payload.value.data.metadata.outputHandles, // 🔥 Update outputHandles properly
                            },
                        },
                    }
                    : node
            );

            return {
                ...state,
                nodes: updatedNodes,
                selectedNode: updatedNodes.find(node => node.id === action.payload.nodeId) || null, // 🔥 Ensure selectedNode is up-to-date
            };
        case "DELETE_NODE":
            return {
                ...state,
                nodes: state.nodes.filter(node => node.id !== action.payload.id),
                edges: state.edges.filter(edge => edge.source !== action.payload.id && edge.target !== action.payload.id)
            };
        case "SELECT_NODE":
            return { ...state, selectedNode: action.payload };
        case "ADD_EDGE":
            const { id, ...restPayload } = action.payload;
            return { ...state, edges: [...state.edges, { id: uuidv4(), ...restPayload }] };
        case "DELETE_EDGE":
            return { ...state, edges: state.edges.filter(edge => edge.id !== action.payload.id) };
        case "UPDATE_EDGES":
            return { ...state, edges: applyEdgeChanges(action.payload, state.edges) };
        case "UPDATE_NODES":
            return { ...state, nodes: applyNodeChanges(action.payload, state.nodes) as EditorNode[] };
        case "PROPAGATE_DATA":
            return {
                ...state,
                nodes: state.nodes.map(node =>
                    node.id === action.payload.targetNode.id
                        ? {
                            ...node,
                            data: {
                                ...node.data,
                                metadata: {
                                    ...node.data.metadata,
                                    inputHandles: node.data.metadata.inputHandles.map(handle =>
                                        handle.id === action.payload.targetHandle.id
                                            ? { ...handle, data: action.payload.sourceHandle.data }
                                            : handle
                                    ),
                                }
                            }
                        }
                        : node
                ),
            };

        default:
            return state;
    }
};

interface EditorContextProps {
    state: EditorState;
    dispatch: React.Dispatch<EditorActions>;
}

const EditorContext = createContext<EditorContextProps>({
    state: initialState,
    dispatch: () => undefined,
})

type EditorProviderProps = {
    children: React.ReactNode
}

export const PlaygroundExtEditorProvider = (props: EditorProviderProps) => {
    const [state, dispatch] = React.useReducer(editorReducer, initialState)

    return (
        <EditorContext.Provider value={{ state, dispatch }}>
            {props.children}
        </EditorContext.Provider>
    )
}

export const usePlaygroundExtEditor = () => {
    const context = useContext(EditorContext)
    if (!context) {
        throw new Error('useEditor must be used within an EditorProvider')
    }
    return context

}

type CustomNodeHandleProps = HandleProps & {
    style?: CSSProperties;
    handleData: EditorHandle;
};

const CustomNodeHandle = ({ handleData, ...props }: CustomNodeHandleProps) => {
    const { state } = usePlaygroundExtEditor();
    const { toast } = useToast();

    const isSelected = state.selectedNode?.data.metadata.selectedHandle?.id === props.id;

    return (
        <Handle
            {...props}
            style={{
                ...props.style,
                backgroundColor: isSelected ? 'salmon' : `${DataTypesColors[handleData.datatype]}`,
                border: isSelected ? '2px solid salmon' : `${DataTypesColors[handleData.datatype]}`,
                boxShadow: isSelected ? '0 0 10px 2px salmon' : 'none',
                transition: 'box-shadow 0.3s ease'
            }}
            isValidConnection={(connection) => {

                // Find the source and target nodes
                const sourceNode = state.nodes.find(node => node.id === connection.source);
                const targetNode = state.nodes.find(node => node.id === connection.target);
                // console.log('Source Node:', JSON.stringify(sourceNode, null, 2));
                // console.log('Target Node:', JSON.stringify(targetNode, null, 2));

                if (!sourceNode || !targetNode) {
                    console.error('Missing source or target node');
                    toast({
                        title: t('Missing Nodes'),
                        variant: 'destructive',
                        description: t('Missing source or target nodes.'),
                        duration: 5000,
                        action: <ToastAction altText="Try again">Try again</ToastAction>,

                    });
                    return false;
                }

                // Find the correct handles
                const sourceHandle = sourceNode.data.metadata.outputHandles.find(handle => handle.id === connection.sourceHandle);
                const targetHandle = targetNode.data.metadata.inputHandles.find(handle => handle.id === connection.targetHandle);

                if (!sourceHandle || !targetHandle) {
                    console.error('Missing source or target handle:', { sourceHandle, targetHandle });
                    toast({
                        title: t('Missing Handles'),
                        variant: 'destructive',
                        description: t('Missing source or target handle. Check if Node was updated correctly'),
                        duration: 5000,
                        action: <ToastAction altText="Try again">Try again</ToastAction>,

                    });
                    return false;
                }

                // console.log('Checking connection between:', sourceHandle, 'and', targetHandle);

                // Ensure datatype matches
                if (sourceHandle.datatype !== targetHandle.datatype) {
                    console.error(`Datatype mismatch: ${sourceHandle.datatype} vs ${targetHandle.datatype}`);
                    toast({
                        title: t('Datatype Mismatch'),
                        variant: 'destructive',
                        description: t('The datatypes of the source and target handles do not match.'),
                        duration: 5000,
                        action: <ToastAction altText="Try again">Try again</ToastAction>,

                    });
                    return false;
                }

                return true; // Allow connection
            }}
            className="!-bottom-2 !h-4 !w-4 dark:bg-neutral-800"
        />
    );
};

const CustomNodeCard = ({ id, data }: { id: string; data: EditorNode['data'] }) => {
    const { state, dispatch } = usePlaygroundExtEditor();

    const handleDelete = () => {
        dispatch({ type: "DELETE_NODE", payload: { id } });
    };

    const nodeTypeData = EditorNodeCustomHandleData[data.specificType as EditorNodeCustomTypes];

    return (
        <Card className="relative max-w-[400px] dark:border-muted-foreground/70">
            <CardHeader className="flex flex-row items-center gap-4">
                <div>
                    <CardTitle className="text-md">
                        {data.title}
                    </CardTitle>
                    <CardDescription>
                        <p className="text-xs text-muted-foreground/50">
                            <b className="text-muted-foreground/80">ID: </b>
                            {id}
                        </p>
                        <p>{data.description}</p>
                    </CardDescription>
                </div>
            </CardHeader>
            <div
                className={clsx('absolute left-3 top-4 h-2 w-2 rounded-full', {
                    'bg-green-500': Math.random() < 0.6,
                    'bg-orange-500': Math.random() >= 0.6 && Math.random() < 0.8,
                    'bg-red-500': Math.random() >= 0.8,
                })}
            ></div>

            {nodeTypeData.inputHandles.map((handle, index) => (
                <CustomNodeHandle
                    key={(handle as EditorHandle).id}
                    handleData={handle as EditorHandle}
                    type="target"
                    position={Position.Left}
                    style={{
                        top: `${index * 20 + 10}px`,
                    }}
                    id={(handle as EditorHandle).id}
                />
            ))}

            {nodeTypeData.outputHandles.map((handle, index) => (
                <CustomNodeHandle
                    key={(handle as EditorHandle).id}
                    handleData={handle as EditorHandle}
                    type="source"
                    position={Position.Right}
                    style={{
                        top: `${index * 20 + 10}px`,
                    }}
                    id={(handle as EditorHandle).id}
                />
            ))}

            {/* <Button onClick={handleDelete} className="absolute top-0 right-4 bg-red-500 text-white p-1 rounded">
                Delete
            </Button> */}
            <ClickableIconButton
                Icon={DeleteIcon}
                onClick={handleDelete}
                tooltipText="Delete Node"
                style={{ position: 'absolute', top: '0', right: '4px' }}
            />
        </Card>
    );
};

const CameraProviderNode = ({ id, data, cameras }: { id: string; data: EditorNode['data'], cameras: CameraStructure[] }) => {
    const { state, dispatch } = usePlaygroundExtEditor();
    const [selectedCamera, setSelectedCamera] = useState<CameraStructure | null>(null);

    // ✅ Sync selected camera when node is selected
    useEffect(() => {
        if (!state.selectedNode) return;

        const cameraId = state.selectedNode.data.metadata.outputHandles[0]?.data.cameraId;
        const foundCamera = cameras.find((camera) => camera.id === cameraId) || null;

        console.log("🔍 Found Camera:", foundCamera);
        setSelectedCamera(foundCamera);
    }, [state.selectedNode, cameras]);

    const handleCameraSelection = (cameraId: string) => {
        const camera = cameras.find((cam) => cam.id === cameraId);
        if (!camera) return;

        console.log("📌 Selected Camera ID:", camera.id);
        setSelectedCamera(camera);

        const updatedNode = {
            ...state.selectedNode!,
            data: {
                ...state.selectedNode!.data,
                metadata: {
                    ...state.selectedNode!.data.metadata,
                    outputHandles: state.selectedNode!.data.metadata.outputHandles.map(handle =>
                        handle.type === "source"
                            ? { ...handle, data: { cameraId: camera.id } }
                            : handle
                    ),
                },
            },
        };

        dispatch({
            type: "UPDATE_NODE",
            payload: { nodeId: state.selectedNode!.id, value: updatedNode },
        });
    };

    useEffect(() => {
        const updatedNode = state.nodes.find(node => node.id === id);
        if (updatedNode) {
            console.log("✅ Camera Provider Updated Data:", JSON.stringify(updatedNode, null, 2));
        }
    }, [state.nodes]);

    useEffect(() => {
        if (state.selectedNode) {
            console.log("✅ Updated Selected Node:", JSON.stringify(state.selectedNode, null, 2));
        }
    }, [state.selectedNode]);


    return (
        <>
            <Select value={selectedCamera?.id ?? ''} onValueChange={handleCameraSelection}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Camera" />
                </SelectTrigger>
                <SelectContent>
                    {cameras.map((camera) => (
                        <SelectItem key={camera.id} value={camera.id}>
                            {camera.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </>
    );
};

const RegionProviderNode = ({ id, data, regions }: { id: string; data: EditorNode['data']; regions: RegionStructure[] }) => {
    const { state, dispatch } = usePlaygroundExtEditor();
    const [selectedRegion, setSelectedRegion] = useState<RegionStructure | null>(null);

    // ✅ Sync selected Region when node is selected
    useEffect(() => {
        if (!state.selectedNode) return;

        const regionId = state.selectedNode.data.metadata.outputHandles[0]?.data.regionId;
        const foundRegion = regions.find((region) => region.id === regionId) || null;

        console.log("🔍 Found Region:", foundRegion);
        setSelectedRegion(foundRegion);
    }, [state.selectedNode, regions]);

    const handleRegionSelection = (regionId: string) => {
        const region = regions.find((r) => r.id === regionId);
        if (!region) return;

        console.log("📌 Selected Region ID:", region.id);
        setSelectedRegion(region);

        // ✅ Update the output handle with regionId & regionObject
        const updatedOutputs = state.selectedNode!.data.metadata.outputHandles.map(handle =>
            handle.type === "source"
                ? { ...handle, data: { regionId: region.id, regionObject: region } }
                : handle
        );

        const updatedNode = {
            ...state.selectedNode!,
            data: {
                ...state.selectedNode!.data,
                metadata: {
                    ...state.selectedNode!.data.metadata,
                    outputHandles: updatedOutputs,
                },
            },
        };

        dispatch({
            type: "UPDATE_NODE",
            payload: { nodeId: state.selectedNode!.id, value: updatedNode },
        });
    };

    useEffect(() => {
        const updatedNode = state.nodes.find(node => node.id === id);
        if (updatedNode) {
            console.log("✅ Region Provider Updated Data:", JSON.stringify(updatedNode, null, 2));
        }
    }, [state.nodes]);

    return (
        <div className="p-4 bg-white shadow-md rounded">
            <h3 className="font-bold">Region Provider</h3>

            <Label>Select Region</Label>
            <Select value={selectedRegion?.id ?? ''} onValueChange={handleRegionSelection}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Region" />
                </SelectTrigger>
                <SelectContent>
                    {regions.map((region) => (
                        <SelectItem key={region.id} value={region.id}>
                            {region.id}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* ✅ Show Selected Region Data */}
            {selectedRegion && (
                <div className="mt-4 p-2 bg-gray-100 rounded">
                    <h4 className="font-bold">Region Data</h4>
                    <Textarea
                        value={JSON.stringify(selectedRegion, null, 2)}
                        readOnly
                        rows={5}
                        className="w-full"
                    />
                </div>
            )}
        </div>
    );
};

const ModelProviderNode = ({ id, data }: { id: string; data: EditorNode['data'] }) => {
    const { state, dispatch } = usePlaygroundExtEditor();
    const [selectedModel, setSelectedModel] = useState<string | null>(null);

    // ✅ Sync selected model when node is selected
    useEffect(() => {
        const node = state.nodes.find(node => node.id === id);
        if (node) {
            const modelId = node.data.metadata.outputHandles[0]?.data.modelId;
            setSelectedModel(modelId || null);
            console.log("🔍 Found Model:", modelId);
        }
    }, [state.nodes, id]);

    const handleModelSelection = (modelId: string) => {
        setSelectedModel(modelId);

        // ✅ Update the output handle with modelId & modelObject
        const updatedOutputs = state.nodes.find(node => node.id === id)?.data.metadata.outputHandles.map(handle =>
            handle.type === "source"
                ? { ...handle, data: { modelId, modelObject: {} } }
                : handle
        );

        const updatedNode = {
            ...state.nodes.find(node => node.id === id)!,
            data: {
                ...state.nodes.find(node => node.id === id)!.data,
                metadata: {
                    ...state.nodes.find(node => node.id === id)!.data.metadata,
                    outputHandles: updatedOutputs || [],
                },
            },
        };

        dispatch({
            type: "UPDATE_NODE",
            payload: { nodeId: id, value: updatedNode },
        });
    };

    useEffect(() => {
        const updatedNode = state.nodes.find(node => node.id === id);
        if (updatedNode) {
            console.log("✅ Model Provider Updated Data:", JSON.stringify(updatedNode, null, 2));
        }
    }, [state.nodes, id]);

    return (
        <div className="p-4 bg-white shadow-md rounded">
            <h3 className="font-bold">Model Provider</h3>

            <Label>Enter Model Id</Label>
            <Input value={selectedModel ?? ''} onChange={(e) => handleModelSelection(e.target.value)} />
        </div>
    );
};

const ImageDeviceNode = ({ id, data, cameras }: {
    id: string;
    data: EditorNode['data'];
    cameras: CameraStructure[];
}) => {
    const { state, dispatch } = usePlaygroundExtEditor();

    // ✅ Get the latest input from inputHandles
    const inputValue = state.nodes.find(node => node.id === id)?.data.metadata.inputHandles[0]?.data.cameraId || "";

    // ✅ Get Camera Object when inputValue updates
    const [cameraObject, setCameraObject] = useState<CameraStructure | null>(null);

    useEffect(() => {
        if (!inputValue) return;
        const foundCamera = cameras.find(cam => cam.id === inputValue);
        console.log("📌 New Camera ID Received:", inputValue, "Found Camera:", foundCamera);
        setCameraObject(foundCamera || null);

        // ✅ Update OutputHandles based on input
        const updatedOutputs = state.nodes.find(node => node.id === id)?.data.metadata.outputHandles?.map((handle) => {
            switch (handle.datatype) {
                case 'string':
                    return { ...handle, data: { cameraId: inputValue } };
                case 'ImageObject':
                    return { ...handle, data: { cameraObject: foundCamera } };
                case 'bytes':
                    return { ...handle, data: { cameraImage: `${Urls.fetchPhantomCamera}/${inputValue}/image` } };
                default:
                    return handle;
            }
        });

        dispatch({
            type: "UPDATE_NODE",
            payload: {
                nodeId: id,
                value: {
                    ...state.nodes.find(node => node.id === id),
                    data: {
                        ...state.nodes.find(node => node.id === id)?.data,
                        metadata: {
                            ...state.nodes.find(node => node.id === id)?.data.metadata,
                            outputHandles: updatedOutputs || [],
                        },
                    },
                } as EditorNode,
            },
        });

    }, [inputValue]); // 🔥 Runs when input changes

    return (
        <>
            <Label>Camera ID</Label>
            <Input value={inputValue} readOnly />

            <Label>Camera Object</Label>
            <Textarea
                value={JSON.stringify(cameraObject, null, 2)}
                readOnly
                rows={10}
            />

            <img src={`${Urls.fetchPhantomCamera}/${inputValue}/image`} alt="Camera Image" />
        </>
    );
};

const InferenceDeviceNode = ({ id, data, cameras }: { id: string; data: EditorNode['data']; cameras: CameraStructure[] }) => {
    const { state, dispatch } = usePlaygroundExtEditor();

    // ✅ Get the latest input values from input handles
    const nodeData = state.nodes.find(node => node.id === id);
    const inputHandles = nodeData?.data.metadata.inputHandles || [];

    // ✅ Extract input values
    const imageObject = inputHandles.find(handle => handle.datatype === "ImageObject")?.data.cameraObject || null;
    const modelId = inputHandles.find(handle => handle.datatype === "ModelData")?.data.modelId || "";
    const regionId = inputHandles.find(handle => handle.datatype === "RegionData")?.data.regionId || "";

    // ✅ Perform inference when required inputs are available
    const handleInference = () => {
        if (!imageObject || !modelId || !regionId) {
            console.error("❌ Missing required input data:", { imageObject, modelId, regionId });
            return;
        }

        console.log("🔍 Found required input data:", { imageObject, modelId, regionId });

        // ✅ Simulated Inference Processing
        const inferenceResult = {
            modelId: modelId,
            regionId: regionId,
            cameraObject: imageObject,
            inference: `Processed inference for Model ${modelId} in Region ${regionId}`,
        };

        console.log("✅ Inference Result:", inferenceResult);

        // ✅ Update the output handle with inference result
        const updatedOutputs = nodeData?.data.metadata.outputHandles.map((handle) =>
            handle.datatype === "InferenceResult"
                ? { ...handle, data: { inferenceResult } }
                : handle
        );

        dispatch({
            type: "UPDATE_NODE",
            payload: {
                nodeId: id,
                value: {
                    ...nodeData!,
                    data: {
                        ...nodeData!.data,
                        metadata: {
                            ...nodeData!.data.metadata,
                            outputHandles: updatedOutputs || [],
                        },
                    },
                },
            },
        });
    };

    return (
        <div className="p-4 bg-white shadow-md rounded">
            <h3 className="font-bold">Inference Device</h3>

            {/* ✅ Display Input Handles */}
            {inputHandles.map((handle, index) => (
                <div key={handle.id} className="mb-2">
                    <Label>{handle.datatype} Input</Label>
                    {handle.datatype === "ImageObject" ? (
                        <Textarea
                            value={JSON.stringify(handle.data, null, 2)}
                            readOnly
                            rows={5}
                            className="w-full"
                        />
                    ) : (
                        <Input value={handle.data?.modelId || handle.data?.regionId || ""} readOnly className="w-full" />
                    )}
                </div>
            ))}

            {/* ✅ Trigger Inference Processing */}
            <Button onClick={handleInference} className="mt-4 w-full">
                Run Inference
            </Button>

            {/* ✅ Display Inference Result */}
            {nodeData?.data.metadata.outputHandles.some(handle => handle.datatype === "InferenceResult") && (
                <div className="mt-4 p-2 bg-gray-100 rounded">
                    <h4 className="font-bold">Inference Result</h4>
                    <Textarea
                        value={JSON.stringify(
                            nodeData.data.metadata.outputHandles.find(handle => handle.datatype === "InferenceResult")?.data?.inferenceResult || {},
                            null,
                            2
                        )}
                        readOnly
                        rows={5}
                        className="w-full"
                    />
                </div>
            )}
        </div>
    );
};

const EditorSidebar = () => {
    const { state, dispatch } = usePlaygroundExtEditor();

    const [cameras] = useCameraService();
    const [regions] = useRegionService();

    const onDragStart = (
        event: any,
        nodeType: EditorNode['type']
    ) => {
        event.dataTransfer.setData('application/reactflow', nodeType)
        event.dataTransfer.effectAllowed = 'move'
    }

    return (
        <>
            <Tabs defaultValue="actions" className="w-96 pb-24">
                <TabsList className="bg-transparent sticky">
                    <TabsTrigger value="actions">Virtual Devices</TabsTrigger>
                    <TabsTrigger value="settings">Device Settings</TabsTrigger>
                    <TabsTrigger value="Legend">Color Legend</TabsTrigger>
                </TabsList>
                <Separator />
                <div className="h-screen overflow-scroll">
                    <TabsContent value="actions" className="flex flex-col gap-4 p-4">
                        {/* <h2>Available Devices</h2> */}
                        {Object.entries(EditorNodeCustomCardData).map(([cardKey, cardValue]) => (
                            <Card
                                key={cardKey}
                                draggable
                                className="w-full cursor-grab border-black bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900"
                                onDragStart={(event) => onDragStart(event, cardKey as EditorNodeCustomTypes)}
                            >
                                <CardHeader className="flex flex-col">
                                    <CardTitle className="text-md">{cardKey}</CardTitle>
                                    <CardDescription>{cardValue.description}</CardDescription>
                                </CardHeader>
                            </Card>
                        ))}
                    </TabsContent>

                    <TabsContent value="settings" className="-mt-6">
                        {state.selectedNode ? (
                            <div className="p-4 bg-white shadow-md rounded">
                                <h3 className="font-bold">{state.selectedNode.data.title} Settings</h3>

                                {state.selectedNode.type === "Camera Provider" && (
                                    <CameraProviderNode
                                        id={state.selectedNode.id}
                                        data={state.selectedNode.data}
                                        cameras={cameras}
                                    />
                                )}

                                {state.selectedNode.type === "Image Device" && (
                                    <ImageDeviceNode
                                        id={state.selectedNode.id}
                                        data={state.selectedNode.data}
                                        cameras={cameras}
                                    />
                                )}

                                {state.selectedNode.type === "Region Provider" && (
                                    <RegionProviderNode
                                        id={state.selectedNode.id}
                                        data={state.selectedNode.data}
                                        regions={regions}
                                    />
                                )}

                                {state.selectedNode.type === "Model Provider" && (
                                    <ModelProviderNode
                                        id={state.selectedNode.id}
                                        data={state.selectedNode.data}
                                    />
                                )}

                                {state.selectedNode.type === "Inference Device" && (
                                    <InferenceDeviceNode
                                        id={state.selectedNode.id}
                                        data={state.selectedNode.data}
                                        cameras={cameras}
                                    />
                                )}

                            </div>
                        ) : (
                            <p>Select a node to edit its settings.</p>
                        )}
                    </TabsContent>

                    <TabsContent value="Legend" className="-mt-6">
                        <div className="p-4 bg-white shadow-md rounded">
                            <h3 className="font-bold">Color Legend</h3>
                            <div className="flex flex-col gap-2">
                                {Object.entries(DataTypesColors).map(([key, value]) => (
                                    <div key={key} className="flex items-center gap-2">
                                        <div
                                            className="h-4 w-4 rounded-full"
                                            style={{ backgroundColor: value }}
                                        ></div>
                                        <p>{key}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TabsContent>
                </div>
            </Tabs>
        </>
    );
};


const PlaygroundExtEditor = () => {
    const { state, dispatch } = usePlaygroundExtEditor();
    const [nodes, setNodes, onNodesChange] = useNodesState(state.nodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(state.edges);

    const nodeTypes = useMemo(() => ({
        'Camera Provider': CustomNodeCard,
        'Image Device': CustomNodeCard,
        'Region Provider': CustomNodeCard,
        'Inference Device': CustomNodeCard,
        'Model Provider': CustomNodeCard,
        'Communications Device': CustomNodeCard,
        'Transform Device': CustomNodeCard,
    }), []);

    const handleNodesChange = useCallback(
        (changes: NodeChange[]) => {
            setNodes((nds) => applyNodeChanges(changes, nds) as EditorNode[]);
            dispatch({ type: "UPDATE_NODES", payload: changes });
        },
        [dispatch, setNodes]
    );

    const handleEdgesChange = useCallback(
        (changes: EdgeChange[]) => {
            setEdges((eds) => applyEdgeChanges(changes, eds));
            dispatch({ type: "UPDATE_EDGES", payload: changes });
        },
        [dispatch, setEdges]
    );

    const handleEdgesDelete = useCallback(
        (edgesToDelete: Edge[]) => {
            edgesToDelete.forEach(edge => {
                dispatch({ type: "DELETE_EDGE", payload: { id: edge.id } });
            });
        },
        [dispatch]
    );

    const onConnect = useCallback(
        (params: Connection) => {
            const { source, target, sourceHandle, targetHandle } = params;

            const sourceNode = state.nodes.find(node => node.id === source);
            const targetNode = state.nodes.find(node => node.id === target);

            if (!sourceNode || !targetNode) {
                console.error("❌ Missing source or target node:", { source, target });
                return;
            }

            // Retrieve the correct handles
            const sourceHandleData = sourceNode.data.metadata.outputHandles.find(handle => handle.id === sourceHandle);
            const targetHandleData = targetNode.data.metadata.inputHandles.find(handle => handle.id === targetHandle);

            if (!sourceHandleData || !targetHandleData) {
                console.error("❌ Missing handle:", { sourceHandle, targetHandle });
                return;
            }

            console.log("✅ Source Handle Found:", sourceHandleData);
            console.log("✅ Target Handle Found:", targetHandleData);

            // Ensure compatible datatypes before connecting
            if (sourceHandleData.datatype !== targetHandleData.datatype) {
                console.error(`❌ Datatype mismatch: ${sourceHandleData.datatype} vs ${targetHandleData.datatype}`);
                return;
            }

            console.log("✅ Data types match. Transferring data...");

            // Dispatch PROPAGATE_DATA to update the target node
            dispatch({
                type: "PROPAGATE_DATA",
                payload: {
                    targetNode,
                    targetHandle: targetHandleData,
                    sourceHandle: sourceHandleData,
                    value: sourceHandleData.data, // Transfer the data
                },
            });

            // Update the target node with new input data
            dispatch({
                type: "UPDATE_NODE",
                payload: {
                    nodeId: targetNode.id,
                    value: {
                        ...targetNode,
                        data: {
                            ...targetNode.data,
                            metadata: {
                                ...targetNode.data.metadata,
                                inputHandles: targetNode.data.metadata.inputHandles.map(handle =>
                                    handle.id === targetHandleData.id
                                        ? { ...handle, data: sourceHandleData.data }
                                        : handle
                                ),
                            },
                        },
                    } as EditorNode,
                },
            });

            // Add edge to state
            dispatch({ type: "ADD_EDGE", payload: { id: uuidv4(), ...params } });
        },
        [dispatch, state.nodes]
    );


    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const reactFlowBounds = event.currentTarget.getBoundingClientRect();
            const type = event.dataTransfer.getData('application/reactflow');
            const position = {
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            };

            // Get the correct metadata for the node type
            const nodeHandleData = EditorNodeCustomHandleData[type as EditorNodeCustomTypes];

            const newNode: EditorNode = {
                id: uuidv4(),
                type: type as EditorNodeCustomTypes,
                position,
                data: {
                    title: type,
                    description: EditorNodeCustomCardData[type as EditorNodeCustomTypes].description,
                    completed: false,
                    current: false,
                    metadata: {
                        inputs: nodeHandleData.inputs || 0,
                        outputs: nodeHandleData.outputs || 0,
                        inputHandles: nodeHandleData.inputHandles || [],
                        outputHandles: nodeHandleData.outputHandles || [],
                    },
                    specificType: type,
                },
            };

            console.log("New Node Created:", newNode);

            dispatch({ type: "ADD_NODE", payload: newNode });
        },
        [dispatch]
    );

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onNodeClick = useCallback((event: any, node: EditorNode) => {
        dispatch({ type: "SELECT_NODE", payload: node });
    }, [dispatch]);

    useEffect(() => {
        setNodes(state.nodes);
    }, [state.nodes, setNodes]);

    useEffect(() => {
        setEdges(state.edges);
    }, [state.edges, setEdges]);

    return (
        <div className="flex h-screen">

            <div className="w-full h-full" onDrop={onDrop} onDragOver={onDragOver}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    onNodesChange={handleNodesChange}
                    onEdgesChange={handleEdgesChange}
                    onEdgesDelete={handleEdgesDelete}
                    onConnect={onConnect}
                    onNodeClick={onNodeClick}
                    fitView
                >
                    <Background />
                    <MiniMap />
                    <Controls />
                </ReactFlow>
            </div>
            <EditorSidebar />
        </div>
    );
};

export default PlaygroundExtEditor;
