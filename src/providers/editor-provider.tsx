'use client';

import React, { Dispatch, createContext, useContext } from 'react'
import { EditorNodeType, EditorActions, EditorEdgeType } from '@/app/phantoms/components/types/EditorCanvasTypes';

export type EditorNode = EditorNodeType
export type EditorNodeEdge = EditorEdgeType

export type Editor = {
    elements: EditorNode[];
    edges: EditorNodeEdge[];
    selectedNode: EditorNodeType;
}

export type HistoryState = {
    history: Editor[];
    currentIndex: number;
}

export type EditorState = {
    editor: Editor;
    history: HistoryState;
}

const initialEditorState: EditorState['editor'] = {
    elements: [],
    edges: [],
    selectedNode: {
        id: '',
        type: 'Trigger',
        position: {
            x: 0,
            y: 0,
        },
        data: {
            title: '',
            description: '',
            completed: false,
            current: false,
            metadata: {
                inputs: 1,
                outputs: 1,
                inputHandles: [],
                outputHandles: [],
            },
            specificType: 'Trigger',
        },
    },
}

const initialHistoryState: HistoryState = {
    history: [initialEditorState],
    currentIndex: 0,
}

const initialState: EditorState = {
    editor: initialEditorState,
    history: initialHistoryState,
}

const editorReducer = (state: EditorState = initialState, action: EditorActions): EditorState => {
    switch (action.type) {
        case 'LOAD_DATA':
            return {
                ...state,
                editor: {
                    ...state.editor,
                    elements: action.payload.elements || initialEditorState.elements,
                    edges: action.payload.edges || state.editor.edges,
                },
            }
        case 'SELECTED_ELEMENT':
            return {
                ...state,
                editor: {
                    ...state.editor,
                    selectedNode: action.payload.element,
                },
            }
        case 'UPDATE_NODE':
            return {
                ...state,
                editor: {
                    ...state.editor,
                    elements: action.payload.elements,
                },
            }
        case 'SELECTED_HANDLE': {
            const { nodeId, element } = action.payload;

            const selectedNode = state.editor.elements.find(node => node.id === nodeId);

            if (selectedNode) {
                return {
                    ...state,
                    editor: {
                        ...state.editor,
                        selectedNode: {
                            ...selectedNode,
                            data: {
                                ...selectedNode.data,
                                metadata: {
                                    ...selectedNode.data.metadata,
                                    selectedHandle: element,
                                },
                            },
                        },
                    },
                };
            }

            return state;
        }
        // case 'UPDATE_HANDLE_DATATYPE': {
        //     const { handleId, datatype } = action.payload;

        //     const updatedInputHandles = state.editor.selectedNode.data.metadata.inputHandles?.map((handle) =>
        //         handle.id === handleId
        //             ? { ...handle, datatype }
        //             : handle
        //     ) || [];

        //     const updatedOutputHandles = state.editor.selectedNode.data.metadata.outputHandles?.map((handle) =>
        //         handle.id === handleId
        //             ? { ...handle, datatype }
        //             : handle
        //     ) || [];

        //     return {
        //         ...state,
        //         editor: {
        //             ...state.editor,
        //             selectedNode: {
        //                 ...state.editor.selectedNode,
        //                 data: {
        //                     ...state.editor.selectedNode.data,
        //                     metadata: {
        //                         ...state.editor.selectedNode.data.metadata,
        //                         inputHandles: updatedInputHandles,
        //                         outputHandles: updatedOutputHandles,
        //                     },
        //                 },
        //             },
        //         },
        //     };
        // }
        case 'UPDATE_NODE_HANDLES': {
            const { nodeId, inputHandles, outputHandles } = action.payload;
            const updatedElements = state.editor.elements.map((node) => {
                if (node.id === nodeId) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            metadata: {
                                ...node.data.metadata,
                                inputHandles,
                                outputHandles,
                            },
                        },
                    };
                }
                return node;
            });

            return {
                ...state,
                editor: {
                    ...state.editor,
                    elements: updatedElements,
                },
            };
        }
        case 'REDO':
            if (state.history.currentIndex === state.history.history.length - 1) {
                const nextIndex = state.history.currentIndex + 1
                const nextEditorState = { ...state.history.history[nextIndex] }
                const redoState = {
                    ...state,
                    editor: nextEditorState,
                    history: {
                        ...state.history,
                        currentIndex: nextIndex,
                    },
                }
                return redoState
            }
            return state
        case 'UNDO':
            if (state.history.currentIndex > 0) {
                const prevIndex = state.history.currentIndex - 1
                const prevEditorState = { ...state.history.history[prevIndex] }
                const undoState = {
                    ...state,
                    editor: prevEditorState,
                    history: {
                        ...state.history,
                        currentIndex: prevIndex,
                    },
                }
                return undoState
            }
            return state
        default:
            return state
    }
}

export type EditorContextData = {
    previewMode: boolean;
    setPreviewMode: (value: boolean) => void;
}

export const EditorContext = createContext<{
    state: EditorState;
    dispatch: Dispatch<EditorActions>;
}>({
    state: initialState,
    dispatch: () => undefined,
})

type EditorProviderProps = {
    children: React.ReactNode
}

const EditorProvider = (props: EditorProviderProps) => {
    const [state, dispatch] = React.useReducer(editorReducer, initialState)
    
    return (
        <EditorContext.Provider value={{ state, dispatch }}>
            {props.children}
        </EditorContext.Provider>
    )
}

export const useEditor = () => {
    const context = useContext(EditorContext)
    if (!context) {
        throw new Error('useEditor must be used within an EditorProvider')
    }
    return context

}

export default EditorProvider