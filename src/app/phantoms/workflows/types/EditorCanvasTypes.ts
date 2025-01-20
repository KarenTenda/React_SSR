import { CameraStructure } from "@/app/cameras/structure/CameraStructure";
import { HandleInfo, NodeMetadata } from "./PinMetadataTypes";

export type EditorNodeSpecificTypes =
    | 'Camera'
    | 'Region Provider'
    | 'Inference'
    | 'Model Provider'
    | 'Communications'
    | 'Transform'
    // | 'Condition'
    // | 'AI'
    // | 'Interval'
    // | 'Google Drive'
    // | 'Count'
    // | 'Trigger'
    // | 'Action'
    // | 'Wait'

export type EditorNodeTypes =
    | 'Standard'
    | 'Custom'
    | 'Generated'


export type EditorCanvasCardType = {
    title: string
    description: string
    completed: boolean
    current: boolean
    metadata: NodeMetadata;
    specificType: EditorNodeSpecificTypes
    code?: string
}

export type EditorNodeType = {
    id: string
    type: EditorNodeSpecificTypes
    position: {
        x: number
        y: number
    }
    data: EditorCanvasCardType
}

export type EditorNode = EditorNodeType

export type EditorActions =
    | {
        type: 'LOAD_DATA'
        payload: {
            elements: EditorNode[]
            edges: {
                id: string
                source: string
                target: string
            }[]
        }
    }
    | {
        type: 'UPDATE_NODE'
        payload: {
            elements: EditorNode[]
        }
    }
    | { type: 'REDO' }
    | { type: 'UNDO' }
    | {
        type: 'SELECTED_ELEMENT'
        payload: {
            element: EditorNode
        }
    }
    | {
        type: 'SELECTED_HANDLE';
        payload: {
            element: HandleInfo;
            nodeId: string;
        };
    }
    | {
        type: 'UPDATE_HANDLE_DATATYPE';
        payload: {
            handleId: string;
            datatype: string;
        };
    }
    | {
        type: 'UPDATE_NODE_HANDLES';
        payload: {
            nodeId: string;
            inputHandles: HandleInfo[];
            outputHandles: HandleInfo[];
        };
    };

export type EditorEdgeType = {
    id: string
    source: string
    target: string
}

export type EditorGraphType = {
    graph_id: string
    name: string
    description: string
    publish: boolean | null
    nodes: EditorNode[]
    edges: EditorEdgeType[]
    subgraphs?: EditorGraphType[]
}