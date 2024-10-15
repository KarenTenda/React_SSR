import { Dispatch } from "react";
import { EditorActions, EditorNodeType } from "../../types/EditorCanvasTypes";
import { EditorState } from "@/providers/editor-provider";

export class NodeManager {
    private node: EditorNodeType;
    private dispatch: Dispatch<EditorActions>;
    private elements: EditorNodeType[];
  
    constructor(node: EditorNodeType, dispatch: Dispatch<EditorActions>, elements: EditorNodeType[]) {
      this.node = node;
      this.dispatch = dispatch;
      this.elements = elements;
    }
    
    updateMetadata(metadata: Partial<EditorNodeType['data']['metadata']>) {
      const updatedNode = {
        ...this.node,
        data: {
          ...this.node.data,
          metadata: {
            ...this.node.data.metadata,
            ...metadata,
          },
        },
      };

      console.log('updatedNode', updatedNode);
  
      this.dispatch({
        type: 'UPDATE_NODE',
        payload: {
          elements: this.getUpdatedElements(updatedNode),
        },
      });
    }
  
    // Directly return updated elements without wrapping in a function
    private getUpdatedElements(updatedNode: EditorNodeType): EditorNodeType[] {
      return this.elements.map((node) =>
        node.id === this.node.id ? updatedNode : node
      );
    }
  }
  