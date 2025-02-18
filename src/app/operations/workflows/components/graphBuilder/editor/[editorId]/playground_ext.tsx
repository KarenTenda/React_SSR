"use client";

import React, { createContext, useContext, useReducer, ReactNode, useCallback, useEffect, useMemo, CSSProperties, useState } from "react";
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
    HandleProps,
    useReactFlow,
    getBezierEdgeCenter,
    getBezierPath,
    EdgeProps,
    BaseEdge,
    EdgeLabelRenderer
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsTrigger, TabsContent, TabsList } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast, useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { t } from "i18next";
import useCameraService from "@/app/cameras/hooks/useCameraService";
import { CameraStructure } from "@/app/cameras/structure/CameraStructure";
import Urls from "@/lib/Urls";
import { RegionStructure } from "@/app/operations/regions/structures/RegionStructure";
import useRegionService from "@/app/operations/regions/hooks/useRegions";
import clsx from "clsx";
import ClickableIconButton from "@/components/custom/buttons/ClickableIconButton";
import { DeleteIcon, SaveIcon } from "@/public/assets/Icons";
import { usePathname } from "next/navigation";

export type EditorGraphType = {
    graph_id: string
    name: string
    description: string
    publish: boolean | null
    nodes: EditorNode[]
    edges: EditorEdge[]
    subgraphs?: EditorGraphType[]
}

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
                type: "target",
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
    | "string"
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

type EditorEdge = Edge & {
    id: string;
    type: string;
    source: string;
    target: string;
    sourceHandleId: string;
    targetHandleId: string;
    data: {
        sourceHandleData: EditorHandle;
        targetHandleData: EditorHandle;
    }
}

export type EditorNode = Node & {
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

// ------------------------------------Editor Reducer------------------------------------

type EditorActions =
    | { type: "LOAD_DATA", payload: { nodes: EditorNode[], edges: EditorEdge[] } }
    | { type: "ADD_NODE", payload: EditorNode }
    | { type: "UPDATE_NODE", payload: { nodeId: string, value: EditorNode } }
    | { type: "DELETE_NODE", payload: { id: string } }
    | { type: "SELECT_NODE", payload: EditorNode | null }
    | { type: "ADD_EDGE", payload: EditorEdge }
    | { type: "DELETE_EDGE", payload: { id: string } }
    | { type: "UPDATE_EDGES", payload: EdgeChange[] }
    | { type: "UPDATE_NODES", payload: NodeChange[] }
    | { type: "PROPAGATE_DATA", payload: { targetNode: EditorNode, targetHandle: EditorHandle, sourceHandle: EditorHandle, value: any } }


const editorReducer = (state: EditorState, action: EditorActions): EditorState => {
    switch (action.type) {
        case "LOAD_DATA":
            return {
                ...state,
                nodes: action.payload.nodes,
                edges: action.payload.edges
            };
        case "ADD_NODE":
            return {
                ...state,
                nodes: [
                    ...state.nodes,
                    {
                        ...action.payload,
                        type: action.payload.type,
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
            // const { id, ...restPayload } = action.payload;
            return { ...state, edges: [...state.edges, action.payload] };
        case "DELETE_EDGE":
            console.log("🗑️ Deleting Edge:", action.payload.id);
            console.log("Before:", state.edges);

            const updatedEdges = state.edges.filter(edge => edge.id !== action.payload.id);

            console.log("After:", updatedEdges);
            return {
                ...state,
                edges: updatedEdges
            };

        case "UPDATE_EDGES":
            console.log("🔄 Updating edges:", action.payload);
            return { ...state, edges: applyEdgeChanges(action.payload, state.edges) as EditorEdge[] };
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
                                            ? { ...handle, data: action.payload.value }
                                            : handle
                                    ),
                                },
                            },
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

// ------------------------------------Node Components------------------------------------

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
                // console.log('State Nodes:', JSON.stringify(state.nodes, null, 2));
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
                const sourceHandle = sourceNode.data.metadata.outputHandles.find(
                    handle => handle.id === connection.sourceHandle
                );
                const targetHandle = targetNode.data.metadata.inputHandles.find(
                    handle => handle.id === connection.targetHandle
                );

                // console.log("🎯 Checking handles...");
                // console.log("handleData", handleData)
                // console.log("🔗 Connection Source Handle ID:", connection.sourceHandle);
                // console.log("✅ Found Source Handle:", sourceHandle);
                // console.log("🔗 Connection Target Handle ID:", connection.targetHandle);
                // console.log("✅ Found Target Handle:", targetHandle);

                // const sourceHandle = sourceNode.data.metadata.outputHandles.find(handle => handle.id === connection.sourceHandle);
                // const targetHandle = targetNode.data.metadata.inputHandles.find(handle => handle.id === connection.targetHandle);

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
            // isValidConnection={(connection) => {
            //     console.log('🎯 Checking handles...');

            //     // ✅ Print latest state before checking
            //     console.log("🔎 Current State Nodes:", JSON.stringify(state.nodes, null, 2));

            //     const sourceNode = state.nodes.find(node => node.id === connection.source);
            //     const targetNode = state.nodes.find(node => node.id === connection.target);

            //     if (!sourceNode || !targetNode) {
            //         console.error('❌ Missing source or target node');
            //         return false;
            //     }

            //     // ✅ Delay checking until nodes are updated
            //     setTimeout(() => {
            //         const updatedSourceNode = state.nodes.find(node => node.id === connection.source);
            //         const updatedTargetNode = state.nodes.find(node => node.id === connection.target);

            //         if (!updatedSourceNode || !updatedTargetNode) return false;

            //         const sourceHandle = updatedSourceNode.data.metadata.outputHandles.find(
            //             handle => handle.id === connection.sourceHandle
            //         );
            //         const targetHandle = updatedTargetNode.data.metadata.inputHandles.find(
            //             handle => handle.id === connection.targetHandle
            //         );

            //         console.log('🔗 Connection Source Handle ID:', connection.sourceHandle);
            //         console.log('✅ Found Source Handle:', sourceHandle);
            //         console.log('🔗 Connection Target Handle ID:', connection.targetHandle);
            //         console.log('✅ Found Target Handle:', targetHandle);

            //         if (!sourceHandle || !targetHandle) {
            //             console.warn("⚠️ Handles not found after delay.");
            //             return false;
            //         }

            //         return sourceHandle.datatype === targetHandle.datatype;
            //     }, 100);

            //     return false; // Default to false until state updates
            // }}
            className="!-bottom-2 !h-4 !w-4 dark:bg-neutral-800"
        />
    );
};

const CustomEdge = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
}: EdgeProps) => {
    // const { setEdges } = useReactFlow();
    const { state, dispatch } = usePlaygroundExtEditor();
    const { toast } = useToast();
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const onEdgeClick = () => {
        // setEdges((edges) => edges.filter((edge) => edge.id !== id));
        dispatch({ type: "DELETE_EDGE", payload: { id } });
        toast({
            title: 'Edge Deleted',
            variant: 'default',
            description: `🗑️ Edge ${id} deleted successfully!`
        });
    };

    return (
        <>
            {/* Render the base edge */}
            <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />

            {/* Delete button inside EdgeLabelRenderer */}
            <EdgeLabelRenderer>
                <div
                    className="absolute pointer-events-auto transform-origin-center nodrag nopan"
                    style={{
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                    }}
                >
                    <button
                        className="w-[30px] h-[30px] border-[5px] border-[#f7f9fb] text-[var(--xy-edge-label-color-default)] bg-[#f3f3f4] cursor-pointer rounded-full text-[12px] pt-0 hover:bg-[var(--xy-theme-hover)] hover:text-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-600"
                        onClick={onEdgeClick}
                    >
                        X
                    </button>
                </div>
            </EdgeLabelRenderer>
        </>
    );
}

const CustomNodeCard = ({ id, data }: { id: string; data: EditorNode['data'] }) => {
    const { state, dispatch } = usePlaygroundExtEditor();
    const pathname = usePathname()
    const LOCAL_STORAGE_KEY = `graph_${pathname.split('/').pop()}`;

    const handleDelete = () => {
        dispatch({ type: "DELETE_NODE", payload: { id } });
        // remove from local storage
        const savedGraph = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedGraph) {
            const parsedGraph = JSON.parse(savedGraph);
            const updatedNodes = parsedGraph.nodes.filter((node: EditorNode) => node.id !== id);
            const updatedEdges = parsedGraph.edges.filter((edge: EditorEdge) => edge.source !== id && edge.target !== id);

            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ nodes: updatedNodes, edges: updatedEdges }));
        }
    };

    const nodedefaultData = EditorNodeCustomHandleData[data.specificType as EditorNodeCustomTypes];
    const nodeHandleData = data.metadata || nodedefaultData;
    // console.log("🔍 Node Type Data:", JSON.stringify(nodeHandleData, null, 2));

    return (
        <Card className="relative max-w-[400px] dark:border-muted-foreground/70">
            <CardHeader className="flex flex-row items-center gap-4">
                <div>
                    <CardTitle className="text-md">
                        {data.title}
                    </CardTitle>
                    <CardDescription>
                        <span className="text-xs text-muted-foreground/50">
                            <b className="text-muted-foreground/80">ID: </b>
                            {id}
                        </span>
                        {/* <span>{data.description}</span> */}
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

            {nodeHandleData.inputHandles.map((handle, index) => (
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

            {nodeHandleData.outputHandles.map((handle, index) => (
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

// ------------------------------------Sidebar Components------------------------------------

const CameraProviderNode = ({ id, data, cameras }: { id: string; data: EditorNode['data'], cameras: CameraStructure[] }) => {
    const { state, dispatch } = usePlaygroundExtEditor();
    const [selectedCamera, setSelectedCamera] = useState<CameraStructure | null>(null);

    // ✅ Sync selected camera when node is selected
    useEffect(() => {
        if (!state.selectedNode) return;

        const cameraId = state.selectedNode.data.metadata.outputHandles[0]?.data.cameraId;
        const foundCamera = cameras.find((camera) => camera.id === cameraId) || null;

        // console.log("🔍 Found Camera:", foundCamera);
        setSelectedCamera(foundCamera);
    }, [state.selectedNode, cameras]);

    const handleCameraSelection = (cameraId: string) => {
        const camera = cameras.find((cam) => cam.id === cameraId);
        if (!camera) return;

        // console.log("📌 Selected Camera ID:", camera.id);
        setSelectedCamera(camera);

        const updatedNode = {
            ...state.selectedNode!,
            data: {
                ...state.selectedNode!.data,
                metadata: {
                    ...state.selectedNode!.data.metadata,
                    outputHandles: state.selectedNode!.data.metadata.outputHandles.map(handle =>
                        handle.type === "source"
                            ? { ...handle, data: { cameraId: camera.id } }  // ✅ Update Data, Keep ID
                            : handle
                    ),
                },
            },
        };

        dispatch({
            type: "UPDATE_NODE",
            payload: { nodeId: state.selectedNode!.id, value: updatedNode },
        });

        // ✅ Reapply edges to ensure they don't break
        reapplyEdges(updatedNode);
    };

    // ✅ Function to update edges when nodes change
    const reapplyEdges = (updatedNode: EditorNode) => {
        const updatedEdges = state.edges.map(edge => {
            if (edge.source === updatedNode.id) {
                const sourceHandle = updatedNode.data.metadata.outputHandles.find(handle => handle.id === edge.sourceHandle);
                if (!sourceHandle) {
                    console.warn(`⚠️ Source handle missing after update: ${edge.sourceHandle}`);
                    return null;
                }
                return { ...edge, sourceHandle: sourceHandle.id };
            }
            return edge;
        }).filter(Boolean);

        dispatch({ type: "UPDATE_EDGES", payload: updatedEdges as EdgeChange[] });
    };


    // useEffect(() => {
    //     const updatedNode = state.nodes.find(node => node.id === id);
    //     if (updatedNode) {
    //         console.log("✅ Camera Provider Updated Data:", JSON.stringify(updatedNode, null, 2));
    //     }
    // }, [state.nodes]);

    // useEffect(() => {
    //     if (state.selectedNode) {
    //         console.log("✅ Updated Selected Node:", JSON.stringify(state.selectedNode, null, 2));
    //     }
    // }, [state.selectedNode]);


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
        <>
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
                <>
                    <Label>Region Data</Label>
                    <Textarea
                        value={JSON.stringify(selectedRegion, null, 2)}
                        readOnly
                        rows={5}
                        className="w-full"
                    />
                </>
            )}
        </>
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
        <>
            <Label>Enter Model Id</Label>
            <Input value={selectedModel ?? ''} onChange={(e) => handleModelSelection(e.target.value)} />
        </>
    );
};

const ImageDeviceNode = ({ id, data, cameras }: {
    id: string;
    data: EditorNode['data'];
    cameras: CameraStructure[];
}) => {
    const { state, dispatch } = usePlaygroundExtEditor();
    const [inputValue, setInputValue] = useState<string | null>(state.nodes.find(node => node.id === id)?.data.metadata.inputHandles[0]?.data.cameraId || "");
    const [cameraObject, setCameraObject] = useState<CameraStructure | null>(null);

    const reapplyEdges = (updatedNode: EditorNode) => {
        const updatedEdges = state.edges.map(edge => {
            if (edge.source === updatedNode.id) {
                const sourceHandle = updatedNode.data.metadata.outputHandles.find(handle => handle.id === edge.sourceHandle);
                if (!sourceHandle) {
                    console.warn(`⚠️ Source handle missing after update: ${edge.sourceHandle}`);
                    return edge;
                }
                return { ...edge, sourceHandle: sourceHandle.id, sourceHandleData: sourceHandle };
            }
            return edge;
        });

        dispatch({ type: "UPDATE_EDGES", payload: updatedEdges as EdgeChange[] });
    };

    useEffect(() => {
        if (!inputValue) return;

        const foundCamera = cameras.find(cam => cam.id === inputValue);
        console.log("📌 New Camera ID Received:", inputValue, "Found Camera:", foundCamera);
        setCameraObject(foundCamera || null);

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

        const updatedNode = {
            ...state.selectedNode!,
            data: {
                ...state.selectedNode!.data,
                metadata: {
                    ...state.selectedNode!.data.metadata,
                    outputHandles: updatedOutputs || [],
                },
            },
        };

        dispatch({
            type: "UPDATE_NODE",
            payload: {
                nodeId: id,
                value: updatedNode
            },
        });

        reapplyEdges(updatedNode);

    }, [inputValue]);

    useEffect(() => {
        const node = state.nodes.find(n => n.id === id);
        if (!node) return;

        const newInputValue = node.data.metadata.inputHandles[0]?.data.cameraId || "";
        console.log("📌 New Input Value:", newInputValue);
        if (newInputValue !== inputValue) {
            setInputValue(newInputValue);
            setCameraObject(cameras.find(cam => cam.id === newInputValue) || null);
            console.log("📌 Updated Camera:", newInputValue);
        }

    }, [state.nodes]); // ✅ Now it runs whenever `state.nodes` updates


    return (
        <>
            <Label>Camera ID</Label>
            <Input value={inputValue ?? ""} readOnly />

            <Label>Camera Object</Label>
            <Textarea
                value={JSON.stringify(cameraObject, null, 2)}
                readOnly
                rows={10}
            />

            <Label>Camera Image</Label>
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
        <>

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
            <Button onClick={handleInference} className="mt-4 w-full bg-[#FA8072] text-white">
                Run Inference
            </Button>

            {/* ✅ Display Inference Result */}
            {nodeData?.data.metadata.outputHandles.some(handle => handle.datatype === "InferenceResult") && (
                <>
                    <Label>Inference Result</Label>
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
                </>
            )}
        </>
    );
};

const EditorSidebar = () => {
    const { state, dispatch } = usePlaygroundExtEditor();
    const pathname = usePathname()
    const LOCAL_STORAGE_KEY = `graph_${pathname.split('/').pop()}`;

    const [cameras] = useCameraService();
    const [regions] = useRegionService();

    const onDragStart = (
        event: any,
        nodeType: EditorNode['type']
    ) => {
        event.dataTransfer.setData('application/reactflow', nodeType)
        event.dataTransfer.effectAllowed = 'move'
    }

    const handleSaveGraph = async () => {
        const graphData = {
            nodes: state.nodes,
            edges: state.edges,
        };

        try {
            const id = pathname.split('/').pop(); // Extract graph ID from URL

            console.log("📦 Saving Graph Data:", graphData);

            const response = await fetch(`/api/graphs/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(graphData),
            });

            const data = await response.json();

            if (data.success) {
                toast({
                    title: "Graph Saved",
                    description: "Your graph has been successfully saved.",
                    variant: "default",
                });

                // ✅ Update local storage after successful save
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(graphData));
            } else {
                toast({
                    title: "Error",
                    description: "Failed to save the graph.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("❌ Error saving graph:", error);
            toast({
                title: "Error",
                description: "An error occurred while saving.",
                variant: "destructive",
            });
        }
    };


    return (
        <>
            <Tabs defaultValue="actions" className=" pb-24">
                <TabsList className="bg-transparent sticky">
                    <ClickableIconButton
                        Icon={SaveIcon}
                        onClick={handleSaveGraph}
                        tooltipText="SaveGraph"
                    />
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
                            <div className="h-full p-4 bg-white shadow-md rounded dark:bg-neutral-800">
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
                            <>Select a node to edit its settings.</>
                        )}
                    </TabsContent>

                    <TabsContent value="Legend" className="-mt-6">
                        <div className="p-4 bg-white shadow-md rounded dark:bg-neutral-800">
                            <h3 className="font-bold">Color Legend</h3>
                            <div className="flex flex-col gap-2">
                                {Object.entries(DataTypesColors).map(([key, value]) => (
                                    <div key={key} className="flex items-center gap-2">
                                        <div
                                            className="h-4 w-4 rounded-full"
                                            style={{ backgroundColor: value }}
                                        ></div>
                                        <>{key}</>
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

// ------------------------------------Main Editor Component------------------------------------

const PlaygroundExtEditor = () => {
    const { state, dispatch } = usePlaygroundExtEditor();
    const [nodes, setNodes, onNodesChange] = useNodesState(state.nodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(state.edges);
    const pathname = usePathname()
    const [isWorkFlowLoading, setIsWorkFlowLoading] = useState<boolean>(false)

    const LOCAL_STORAGE_KEY = `graph_${pathname.split('/').pop()}`;

    const nodeTypes = useMemo(() => ({
        'Camera Provider': CustomNodeCard,
        'Image Device': CustomNodeCard,
        'Region Provider': CustomNodeCard,
        'Inference Device': CustomNodeCard,
        'Model Provider': CustomNodeCard,
        'Communications Device': CustomNodeCard,
        'Transform Device': CustomNodeCard,
    }), []);

    const edgeTypes = useMemo(() => ({
        'deletable': CustomEdge,
    }), []);

    const handleNodesChange = useCallback((changes: NodeChange[]) => {
        const updatedNodes = applyNodeChanges(changes, state.nodes) as EditorNode[];
        setNodes(updatedNodes);
        dispatch({ type: "UPDATE_NODES", payload: changes });
    }, [dispatch, setNodes, state.nodes]);

    const handleEdgesChange = useCallback((changes: EdgeChange[]) => {
        const updatedEdges = applyEdgeChanges(changes, state.edges);
        // console.log("🔄 Updated Edges in handleEdgesChange:", updatedEdges);
        setEdges(updatedEdges as EditorEdge[]);
        dispatch({ type: "UPDATE_EDGES", payload: changes });
    }, [dispatch, setEdges, state.edges]);

    const handleEdgesDelete = useCallback(
        (edgesToDelete: Edge[]) => {
            console.log("🗑️ Deleting edges from local storage:", edgesToDelete.map(e => e.id));

            const savedGraph = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (savedGraph) {
                const parsedGraph = JSON.parse(savedGraph);
                const updatedEdges = parsedGraph.edges.filter((edge: EditorEdge) =>
                    !edgesToDelete.some(e => e.id === edge.id)
                );

                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
                    nodes: parsedGraph.nodes,
                    edges: updatedEdges
                }));
            }

            edgesToDelete.forEach(edge => {
                dispatch({ type: "DELETE_EDGE", payload: { id: edge.id } });
            });
        },
        [dispatch]
    );

    const onConnect = useCallback(
        (params: Connection) => {
            const { source, target, sourceHandle, targetHandle } = params;
            console.log("🔗 Connection Params:", params);

            const sourceNode = state.nodes.find(node => node.id === params.source);
            const targetNode = state.nodes.find(node => node.id === params.target);

            if (!sourceNode || !targetNode) {
                console.error("❌ Missing source or target node:", { source: params.source, target: params.target });
                return;
            }

            const sourceHandleData = sourceNode.data.metadata.outputHandles.find(handle => handle.id === params.sourceHandle);
            const targetHandleData = targetNode.data.metadata.inputHandles.find(handle => handle.id === params.targetHandle);

            console.log("🔗 Source Handle Data:", JSON.stringify(sourceHandleData, null, 2));
            console.log("🔗 Target Handle Data:", JSON.stringify(targetHandleData, null, 2));

            if (!sourceHandleData || !targetHandleData) {
                console.warn(`⚠️ Missing source or target handle.`, { sourceHandleData, targetHandleData });
                return;
            }

            if (sourceHandleData.type !== "source") {
                console.error(`❌ Source handle is not 'source' type. Fixing:`, sourceHandleData);
                sourceHandleData.type = "source"; // 🔥 Fix incorrect handle type
            }

            if (targetHandleData.type !== "target") {
                console.error(`❌ Target handle is not 'target' type. Fixing:`, targetHandleData);
                targetHandleData.type = "target"; // 🔥 Fix incorrect handle type
            }

            // ✅ Update target node to reflect input changes
            const updatedTargetNode = {
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
            };

            dispatch({
                type: "PROPAGATE_DATA",
                payload: {
                    targetNode: targetNode,
                    targetHandle: targetHandleData,
                    sourceHandle: sourceHandleData,
                    value: sourceHandleData.data
                }
            })

            dispatch({ type: "UPDATE_NODE", payload: { nodeId: updatedTargetNode.id, value: updatedTargetNode } });

            const new_edge = {
                id: uuidv4(),
                type: 'deletable',
                source: sourceNode.id,
                target: targetNode.id,
                sourceHandleId: sourceHandleData.id,
                targetHandleId: targetHandleData.id,
                data: {
                    sourceHandleData,
                    targetHandleData,
                }
            };

            console.log("🔗 New Edge created:", JSON.stringify(new_edge, null, 2));

            dispatch({
                type: "ADD_EDGE",
                payload: new_edge,
            });
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
                        inputHandles: nodeHandleData.inputHandles as EditorHandle[] || [],
                        outputHandles: nodeHandleData.outputHandles as EditorHandle[] || [],
                    },
                    specificType: type,
                },
            };


            console.log("📌 New Node created:", JSON.stringify(newNode, null, 2));

            dispatch({ type: "ADD_NODE", payload: newNode });
        },
        [dispatch]
    );

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onNodeClick = useCallback((event: any, node: EditorNode) => {
        console.log("📌 Selected Node:", node);
        console.log("📌 Current Edges:", state.edges);

        dispatch({ type: "SELECT_NODE", payload: node });
    }, [dispatch]);

    const validateEdges = (nodes: EditorNode[], edges: EditorEdge[]) => {
        return edges.filter(edge => {
            const sourceNode = nodes.find(node => node.id === edge.source);
            const targetNode = nodes.find(node => node.id === edge.target);

            if (!sourceNode || !targetNode) {
                console.warn(`⚠️ Skipping invalid edge: Missing source/target node`, edge);
                return false;
            }

            // Ensure that the handle exists in the current nodes
            const sourceHandleExists = sourceNode.data.metadata.outputHandles.some(handle => handle.id === edge.sourceHandle);
            const targetHandleExists = targetNode.data.metadata.inputHandles.some(handle => handle.id === edge.targetHandle);

            if (!sourceHandleExists || !targetHandleExists) {
                console.warn(`⚠️ Skipping invalid edge: Source/Target handle missing`, edge);
                return false;
            }

            return true;
        });
    };

    useEffect(() => {
        const loadGraph = async () => {
            setIsWorkFlowLoading(true);
            const id = pathname.split('/').pop();

            if (!id) {
                console.error("❌ Invalid Graph ID in URL");
                setIsWorkFlowLoading(false);
                return;
            }

            let dbNodes: EditorNode[] = [];
            let dbEdges: EditorEdge[] = [];
            let localNodes: EditorNode[] = [];
            let localEdges: EditorEdge[] = [];

            try {
                // 🔹 Step 1: Fetch from database
                const response = await fetch(`/api/graphs/${id}`);
                const data = await response.json();

                if (data.success && data.graph) {
                    dbNodes = data.graph.nodes;
                    dbEdges = data.graph.edges;
                } else {
                    console.warn("⚠️ No data found in DB.");
                }
            } catch (error) {
                console.error("❌ Error fetching graph data from DB:", error);
            }

            // 🔹 Step 2: Load from local storage if DB is empty
            const savedGraph = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (savedGraph) {
                const parsedGraph = JSON.parse(savedGraph);
                localNodes = parsedGraph.nodes || [];
                localEdges = parsedGraph.edges || [];
                console.log("📌 Loaded from local storage:", { localNodes, localEdges });
            }

            // 🔹 Step 3: Compare and update
            if (dbNodes.length > 0 || dbEdges.length > 0) {
                const isDifferent = JSON.stringify(dbNodes) !== JSON.stringify(localNodes) ||
                    JSON.stringify(dbEdges) !== JSON.stringify(localEdges);

                if (isDifferent) {
                    console.log("🔄 Updating local storage with DB data");
                    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ nodes: dbNodes, edges: dbEdges }));
                }

                // ✅ Set nodes first before setting edges
                setNodes(dbNodes);
                setTimeout(() => {
                    setEdges(dbEdges);
                    dispatch({ type: "LOAD_DATA", payload: { nodes: dbNodes, edges: dbEdges } });
                }, 100); // ⏳ Delay to ensure nodes are registered

            } else if (localNodes.length > 0 || localEdges.length > 0) {
                console.log("📌 Using local storage data");

                setNodes(localNodes);
                setEdges(localEdges);
                console.log("📌 Local Storage Data:", JSON.stringify(localNodes, null, 2));
                dispatch({ type: "LOAD_DATA", payload: { nodes: localNodes, edges: localEdges } });

            } else {
                console.warn("⚠️ No nodes or edges found. Initializing empty state.");
                setNodes([]);
                setEdges([]);
            }

            setIsWorkFlowLoading(false);
        };

        loadGraph();
    }, [pathname]);

    useEffect(() => {
        if (isWorkFlowLoading) return;

        if (state.nodes.length > 0) {
            console.log("💾 Saving to local storage...");

            const serializedState = JSON.stringify({
                nodes: state.nodes.map(node => ({
                    ...node,
                    data: {
                        ...node.data,
                        metadata: {
                            ...node.data.metadata,
                            inputHandles: node.data.metadata.inputHandles || [],
                            outputHandles: node.data.metadata.outputHandles || [],
                        }
                    }
                })),
                edges: state.edges,
            });

            localStorage.setItem(LOCAL_STORAGE_KEY, serializedState);
        }

    }, [state.nodes, state.edges, isWorkFlowLoading]);

    useEffect(() => {
        setNodes(state.nodes);
    }, [state.nodes, setNodes]);

    useEffect(() => {
        setEdges(state.edges);
    }, [state.edges, setEdges]);

    return (
        // <div className="flex h-screen">

        //     <div className="w-full h-full" onDrop={onDrop} onDragOver={onDragOver}>
        //         <ReactFlow
        //             nodes={nodes}
        //             edges={edges}
        //             nodeTypes={nodeTypes}
        //             onNodesChange={handleNodesChange}
        //             onEdgesChange={handleEdgesChange}
        //             onEdgesDelete={handleEdgesDelete}
        //             onConnect={onConnect}
        //             onNodeClick={onNodeClick}
        //             fitView
        //         >
        //             <Background />
        //             <MiniMap />
        //             <Controls />
        //         </ReactFlow>
        //     </div>
        //     <EditorSidebar />
        // </div>
        <div>
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={70}>
                    <div className="flex h-full items-center justify-center">
                        <div
                            style={{ width: '100%', height: '100%', paddingBottom: '70px' }}
                            className="relative"
                        >
                            {isWorkFlowLoading ? (
                                <div className="absolute flex h-full w-full items-center justify-center">
                                    <svg
                                        aria-hidden="true"
                                        className="inline h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
                                        viewBox="0 0 100 101"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                            fill="currentColor"
                                        />
                                        <path
                                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                            fill="currentFill"
                                        />
                                    </svg>
                                </div>
                            ) : (
                                <div onDrop={onDrop} onDragOver={onDragOver} style={{ width: '100%', height: '850px' }}>
                                    <ReactFlow
                                        nodes={nodes}
                                        edges={edges}
                                        nodeTypes={nodeTypes}
                                        edgeTypes={edgeTypes}
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
                            )}
                        </div>
                    </div>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={30}>
                    {isWorkFlowLoading ? (
                        <div className="absolute flex h-full w-full items-center justify-center">
                            <svg
                                aria-hidden="true"
                                className="inline h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
                                viewBox="0 0 100 101"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor"
                                />
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentFill"
                                />
                            </svg>
                        </div>
                    ) : (
                        <EditorSidebar />
                    )}
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
};

export default PlaygroundExtEditor;
