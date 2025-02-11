"use client";
import React, { createContext, useContext, useReducer, ReactNode, useCallback, useEffect, use } from "react";
import { v4 as uuidv4 } from "uuid";
import {
    ReactFlow,
    Background,
    Connection,
    Controls,
    Edge,
    EdgeChange,
    MiniMap,
    NodeChange,
    applyNodeChanges,
    applyEdgeChanges,
    Position,
    Handle,
    useNodesState,
    useEdgesState
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from "@/components/ui/button";

interface HandleInfo {
    id: string;
    type: "source" | "target";
    datatype: "string" | "number" | "boolean" | "ImageObject" | "InferenceResult";
    data?: any;
}

interface CustomNodeData {
    label: string;
    inputHandles?: HandleInfo[];
    outputHandles?: HandleInfo[];
    value?: any;
}

interface EditorState {
    nodes: Node<CustomNodeData>[];
    edges: Edge[];
    selectedNode: Node<CustomNodeData> | null;
}

interface EditorContextProps {
    state: EditorState;
    dispatch: React.Dispatch<any>;
}

const EditorContext = createContext<EditorContextProps | null>(null);

const initialState: EditorState = {
    nodes: [],
    edges: [],
    selectedNode: null,
};

const editorReducer = (state: EditorState, action: any): EditorState => {
    switch (action.type) {
        case "ADD_NODE":
            return { ...state, nodes: [...state.nodes, action.payload] };
        case "UPDATE_NODE":
            return {
                ...state,
                nodes: state.nodes.map((node) =>
                    node.id === action.payload.nodeId
                        ? { ...node, data: { ...node.data, value: action.payload.value } }
                        : node
                ),
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
            return { ...state, edges: [...state.edges, { id: uuidv4(), ...action.payload }] };
        case "DELETE_EDGE":
            return { ...state, edges: state.edges.filter(edge => edge.id !== action.payload.id) };
        case "UPDATE_EDGES":
            return { ...state, edges: applyEdgeChanges(action.payload, state.edges) };
        case "UPDATE_NODES":
            return { ...state, nodes: applyNodeChanges(action.payload, state.nodes) };
        case "PROPAGATE_DATA":
            return {
                ...state,
                nodes: state.nodes.map(node =>
                    node.id === action.payload.targetId
                        ? { ...node, data: { ...node.data, value: action.payload.value } }
                        : node
                ),
            };
        default:
            return state;
    }
};

export const PlaygroundEditorProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(editorReducer, initialState);
    return (
        <EditorContext.Provider value={{ state, dispatch }}>
            {children}
        </EditorContext.Provider>
    );
};

export const usePlaygroundEditor = () => {
    const context = useContext(EditorContext);
    if (!context) throw new Error("useEditor must be used within an EditorProvider");
    return context;
};

const handleColorMap: Record<string, string> = {
    string: "blue",
    number: "red",
    boolean: "green",
    ImageObject: "purple",
    InferenceResult: "orange",
};

const CustomNode = ({ data, id }: { data: CustomNodeData, id: string }) => {
    const { state, dispatch } = usePlaygroundEditor();

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        dispatch({
            type: "UPDATE_NODE",
            payload: { nodeId: id, value: newValue },
        });

        // Propagate data to connected nodes
        state.edges.forEach(edge => {
            if (edge.source === id) {
                const targetNode = state.nodes.find(node => node.id === edge.target);
                if (targetNode) {
                    const sourceHandle = data.outputHandles?.find(handle => handle.id === edge.sourceHandle);
                    const targetHandle = targetNode.data.inputHandles?.find(handle => handle.id === edge.targetHandle);

                    if (sourceHandle && targetHandle && sourceHandle.datatype === targetHandle.datatype) {
                        let transformedValue = newValue;

                        // If it's a transformation node, handle different output types
                        if (data.label === "Transformation") {
                            if (sourceHandle.datatype === "string") {
                                transformedValue = newValue;
                            } else if (sourceHandle.datatype === "number") {
                                transformedValue = newValue.length || 0;
                            }
                        }

                        dispatch({
                            type: "PROPAGATE_DATA",
                            payload: { targetId: targetNode.id, handleId: targetHandle.id, value: transformedValue }
                        });
                    }
                }
            }
        });
    };

    const handleDeleteNode = () => {
        dispatch({
            type: "DELETE_NODE",
            payload: { id },
        });
    };

    return (
        <div className="p-4 border border-gray-400 rounded bg-white shadow-md relative">
            <div className="text-center font-bold mb-2">{data.label}</div>

            {/* Input field for Data Source */}
            {data.label === "Data Source" && (
                <input
                    type="text"
                    className="border p-1 rounded w-full text-sm"
                    value={data.value || ""}
                    onChange={handleInputChange}
                    placeholder="Enter name..."
                />
            )}

            {/* Display value for Display node */}
            {data.label === "Display" && (
                <div className="text-center text-sm text-gray-700">Result: {data.value}</div>
            )}

            {/* Handles */}
            {data.inputHandles?.map((handle, index) => (
                <Handle
                    key={handle.id}
                    type="target"
                    position={Position.Left}
                    style={{
                        background: handleColorMap[handle.datatype] || "gray",
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        border: "2px solid black",
                        top: `${index * 20 + 10}px`,
                    }}
                    id={handle.id}
                />
            ))}
            {data.outputHandles?.map((handle, index) => (
                <Handle
                    key={handle.id}
                    type="source"
                    position={Position.Right}
                    style={{
                        background: handleColorMap[handle.datatype] || "gray",
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        border: "2px solid black",
                        top: `${index * 20 + 10}px`,
                    }}
                    id={handle.id}
                />
            ))}

            <button onClick={handleDeleteNode} className="absolute top-0 right-4 rounded">
                x
            </button>
        </div>
    );
};

const GraphBuilderPlaygroundEditor = () => {
  const { state, dispatch } = usePlaygroundEditor();
  const [nodes, setNodes, onNodesChange] = useNodesState(state.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(state.edges);

  const onConnect = useCallback(
    (params: Connection) => {
      const sourceNode = state.nodes.find(node => node.id === params.source);
      const targetNode = state.nodes.find(node => node.id === params.target);

      if (sourceNode && targetNode) {
        const sourceHandle = sourceNode.data.outputHandles?.find(handle => handle.id === params.sourceHandle);
        const targetHandle = targetNode.data.inputHandles?.find(handle => handle.id === params.targetHandle);

        if (sourceHandle && targetHandle && sourceHandle.datatype === targetHandle.datatype) {
          let transformedValue = sourceNode.data.value;

          // If it's a transformation node, handle different output types
          if (sourceNode.data.label === "Transformation") {
            if (sourceHandle.datatype === "string") {
              transformedValue = sourceNode.data.value;
            } else if (sourceHandle.datatype === "number") {
              transformedValue = sourceNode.data.value?.length || 0;
            }
          }

          dispatch({
            type: "PROPAGATE_DATA",
            payload: { targetId: targetNode.id, handleId: targetHandle.id, value: transformedValue }
          });
        }
      }

      dispatch({ type: "ADD_EDGE", payload: { id: uuidv4(), ...params } });
    },
    [dispatch, state.nodes]
  );

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
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

  useEffect(() => {
    setNodes(state.nodes);
  }, [state.nodes, setNodes]);

  useEffect(() => {
    setEdges(state.edges);
  }, [state.edges, setEdges]);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={{ custom: CustomNode }}
          onConnect={onConnect}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onEdgesDelete={handleEdgesDelete}
          fitView
        >
          <Background />
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

export default GraphBuilderPlaygroundEditor;

const Sidebar = () => {
    const { dispatch } = usePlaygroundEditor();

    const switchNodeData = (type: string) => {
        switch (type) {
            case "Data Source":
                return {
                    label: "Data Source",
                    value: "",
                    outputHandles: [{ id: "output-1", type: "source", datatype: "string" }],
                };
            case "Transformation":
                return {
                    label: "Transformation",
                    inputHandles: [{ id: "input-1", type: "target", datatype: "string" }],
                    outputHandles: [
                        { id: "output-1", type: "source", datatype: "number" },
                        { id: "output-2", type: "source", datatype: "string" },
                    ],
                };
            case "Display":
                return {
                    label: "Display",
                    inputHandles: [
                        { id: "input-1", type: "target", datatype: "number" },
                        { id: "input-2", type: "target", datatype: "string" },
                    ],
                    value: "",
                };
            default:
                return { label: type };
        }
    };

    const addNode = (type: string) => {
        const newId = uuidv4();
        const newNode: Node = {
            id: newId,
            type: "custom",
            position: { x: Math.random() * 100, y: Math.random() * 100 },
            data: switchNodeData(type),
        };
        dispatch({ type: "ADD_NODE", payload: newNode });
    };

    return (
        <div className="flex flex-col space-y-2 w-1/4 p-4 bg-gray-500">
            <h2 className="text-lg font-bold">Drag Nodes</h2>
            <Button onClick={() => addNode("Data Source")}>Data Source</Button>
            <Button onClick={() => addNode("Transformation")}>Transformation</Button>
            <Button onClick={() => addNode("Display")}>Display</Button>
        </div>
    );
};
