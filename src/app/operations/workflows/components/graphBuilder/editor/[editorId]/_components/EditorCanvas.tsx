"use client";
import { useParams, usePathname } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
    ReactFlow,
    Background,
    Connection,
    Controls,
    Edge,
    EdgeChange,
    MiniMap,
    NodeChange,
    ReactFlowInstance,
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    ConnectionMode,
    Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable'
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { EditorCanvasCardType, EditorNodeType } from '@/app/operations/workflows/types/EditorCanvasTypes';
import { HandleInfo, NodeMetadata } from '@/app/operations/workflows/types/PinMetadataTypes';
import { useEditor } from '@/providers/editor-provider';
import { EditorCanvasDefaultCardTypes } from '@/app/operations/workflows/constants/EditorCanvasDefaultCardTypes';
import DefaultEditorCanvasCard from './EditorCanvasCard';
import EditorCanvasSidebar from './EditorCanvasSidebar';
import FlowInstance from './FlowInstance';
import { EditorCanvasDefaultHandleData } from '@/app/operations/workflows/constants/EditorCanvasDefaultPinData';
import { ToastAction } from '@/components/ui/toast';

const initialNodes: EditorNodeType[] = []

const initialEdges: { id: string; source: string; target: string }[] = []

const GraphBuilderEditor = () => {
    // const params = useParams();
    // const editorId = params.editorId;
    const [isWorkFlowLoading, setIsWorkFlowLoading] = useState<boolean>(false)
    const { dispatch, state } = useEditor()
    const [nodes, setNodes] = useState(initialNodes)
    const [edges, setEdges] = useState(initialEdges)
    const [handleInfo, setHandleInfo] = useState<{ nodeId: string; handleId: string; position: Position } | null>(null);
    const toast = useToast();
    const pathname = usePathname()
    const [reactFlowInstance, setReactFlowInstance] =
        useState<ReactFlowInstance>()

    const onDragOver = useCallback((event: any) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = 'move'
    }, [])

    const onNodesChange = useCallback(
        console.log('nodes change'),
        (changes: NodeChange[]) => {
            setNodes((nds) => {
                const updatedNodes = applyNodeChanges(changes, nds);
                dispatch({
                    type: 'UPDATE_NODE',
                    payload: { elements: updatedNodes },
                });
                return updatedNodes;
            });
        },
        [dispatch]
    )

    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) =>
            //@ts-ignore
            setEdges((eds) => applyEdgeChanges(changes, eds)),
        [setEdges]
    )

    // const onConnectStart = useCallback((event, { nodeId, handleId, handleType }) => {
    //     setHandleInfo({ nodeId, handleId, position: handleType });
    // }, []);

    const propagateSourceDataToTarget = (
        targetNode: EditorNodeType,
        targetHandle: string,
        sourceHandleData: HandleInfo
    ) => {
        const updatedTargetNode = {
            ...targetNode,
            data: {
                ...targetNode.data,
                metadata: {
                    ...targetNode.data.metadata,
                    inputHandles: targetNode.data.metadata.inputHandles?.map(handle =>
                        handle.id === targetHandle
                            ? { ...handle, data: sourceHandleData.data } // Assign the data
                            : handle
                    ),
                },
            },
        };

        console.log('Updated target node:', updatedTargetNode);

        dispatch({
            type: 'UPDATE_NODE',
            payload: {
                elements: nodes.map(node => node.id === targetNode.id ? updatedTargetNode : node),
            },
        });
    };

    const onConnect = useCallback((params: Edge | Connection) => {
        const { source, target, sourceHandle, targetHandle } = params;

        console.log('Connection Params:', params);

        const sourceNode = nodes.find(node => node.id === source);
        const targetNode = nodes.find(node => node.id === target);

        if (!sourceNode || !targetNode) return;

        const sourceHandleData = sourceNode.data.metadata.outputHandles?.find(
            handle => handle.id === sourceHandle
        );

        if (sourceHandleData) {
            propagateSourceDataToTarget(targetNode, targetHandle, sourceHandleData);
        }

        setEdges((eds) => [...eds, { id: uuidv4(), source, target, sourceHandle, targetHandle }]);
        setHandleInfo(null);
    }, [nodes]);


    const onConnectEnd = useCallback(() => {
        setHandleInfo(null);
    }, []);

    const onDrop = useCallback(
        (event: any) => {
            event.preventDefault();

            const specificType: EditorCanvasCardType['specificType'] = event.dataTransfer.getData(
                'application/reactflow'
            );
            // console.log(specificType, EditorCanvasDefaultCardTypes[specificType])

            if (typeof specificType === 'undefined' || !specificType) {
                return;
            }

            // const triggerAlreadyExists = state.editor.elements.find(
            //     (node) => node.data.specificType === 'Trigger'
            // );

            // if (specificType === 'Trigger' && triggerAlreadyExists) {
            //     // toast({
            //     //     variant: "destructive",
            //     //     title: "Uh oh! Something went wrong.",
            //     //     description: "There was a problem with your request.",
            //     //     action: <ToastAction altText="Try again">Try again</ToastAction>,
            //     //   })
            //     return;
            // }

            if (!reactFlowInstance) return;

            const position = reactFlowInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const defaultHandleData = EditorCanvasDefaultHandleData[specificType];
            console.log('defaultHandleData', defaultHandleData);

            const metadata: NodeMetadata = {
                ...state.editor.selectedNode.data.metadata,
                inputs: defaultHandleData.inputs,
                outputs: defaultHandleData.outputs,
                inputHandles: defaultHandleData.inputHandles,
                outputHandles: defaultHandleData.outputHandles,
            };

            const newNode: EditorNodeType = {
                id: uuidv4(),
                type: specificType,
                position,
                data: {
                    title: specificType,
                    description: EditorCanvasDefaultCardTypes[specificType].description,
                    completed: false,
                    current: false,
                    metadata,
                    specificType: specificType,
                },
            };
            // console.log("newNode", newNode)

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance, state]
    );

    // const onClickNode = (event: React.MouseEvent, node: EditorNodeType) => {
    //     console.log('Clicked node:', node);
    // };

    // useEffect(() => {
    //     onClickNode(state.editor.selectedNode)
    // }, [state.editor.selectedNode])

    const handleClickCanvas = () => {
        console.log("current selected node", state.editor.selectedNode.data.metadata.outputHandles)
        console.log("existing editor elements", state.editor.elements)
        if (!state.editor.selectedNode.id) {
            dispatch({
                type: 'SELECTED_ELEMENT',
                payload: {
                    element: {
                        data: {
                            completed: false,
                            current: false,
                            description: '',
                            metadata: {
                                inputs: 0,
                                outputs: 0,
                                inputHandles: [],
                                outputHandles: [],
                            },
                            title: '',
                            specificType: 'Trigger',
                        },
                        id: '',
                        position: { x: 0, y: 0 },
                        type: 'Trigger',
                    },
                },
            });
        }

    }

    useEffect(() => {
        dispatch({
            type: 'LOAD_DATA',
            payload: {
                edges,
                elements: nodes
            }
        })
    }, [nodes, edges])

    const nodeTypes = useMemo(
        () => ({
            // Action: DefaultEditorCanvasCard,
            // Trigger: DefaultEditorCanvasCard,
            'Camera Provider': DefaultEditorCanvasCard,
            "Image Device": DefaultEditorCanvasCard,
            // Condition: DefaultEditorCanvasCard,
            // AI: DefaultEditorCanvasCard,
            'Region Provider': DefaultEditorCanvasCard,
            "Inference Device": DefaultEditorCanvasCard,
            "Transform Device": DefaultEditorCanvasCard,
            'Model Provider': DefaultEditorCanvasCard,
            // Discord: DefaultEditorCanvasCard,
            "Communications Device": DefaultEditorCanvasCard,
            // 'Google Drive': DefaultEditorCanvasCard,
            // Wait: DefaultEditorCanvasCard,
            // Interval: DefaultEditorCanvasCard,
            // Count: DefaultEditorCanvasCard
        }),
        []
    )

    const onGetNodesEdges = async (id: string) => {
        try {
            const response = await fetch(`/api/graphs/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch graph data');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching graph data:', error);
            return null;
        }
    };

    const onGetWorkFlow = async () => {
        setIsWorkFlowLoading(true);

        const id = pathname.split('/').pop();
        if (!id) {
            console.error('Invalid ID in pathname');
            setIsWorkFlowLoading(false);
            return;
        }

        const response = await onGetNodesEdges(id);

        if (response.graph && response.graph.edges && response.graph.nodes) {
            setEdges(response.graph.edges);
            setNodes(response.graph.nodes);
        } else {
            console.error('Invalid response data from API');
        }

        setIsWorkFlowLoading(false);
    };

    useEffect(() => {
        onGetWorkFlow();
    }, [pathname]);

    return (
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


                                <div style={{ width: '100%', height: '850px' }}>
                                    <ReactFlow
                                        className="w-[300px]"
                                        onDrop={onDrop}
                                        onDragOver={onDragOver}
                                        nodes={state.editor.elements}
                                        onNodesChange={onNodesChange}
                                        edges={edges}
                                        onEdgesChange={onEdgesChange}
                                        // onConnectStart={onConnectStart}  
                                        onConnect={onConnect}
                                        // onConnectEnd={onConnectEnd}
                                        onInit={setReactFlowInstance}
                                        fitView
                                        onClick={handleClickCanvas}
                                        nodeTypes={nodeTypes}
                                        connectionMode={ConnectionMode.Loose}
                                        isValidConnection={() => true}
                                    >
                                        <Controls position="top-left" />
                                        {/* <MiniMap
                                            position="bottom-left"
                                            className="!bg-background"
                                            zoomable
                                            pannable
                                        /> */}
                                        <Background
                                            // @ts-ignore
                                            variant="dots"
                                            gap={12}
                                            size={1}
                                        />
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
                        <FlowInstance
                            edges={edges}
                            nodes={nodes}
                        >
                            <EditorCanvasSidebar nodes={nodes} />
                        </FlowInstance>
                    )}
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
};

export default GraphBuilderEditor;
