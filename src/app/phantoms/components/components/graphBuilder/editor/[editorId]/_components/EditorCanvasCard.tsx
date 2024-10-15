import React, { useEffect, useMemo, useState } from 'react';
import { useNodeId, Position } from '@xyflow/react';
import CustomNodeHandle from './CustomNodeHandle';
import { EditorCanvasCardType} from '@/app/phantoms/components/types/EditorCanvasTypes';
import { DataTypesColors } from '@/app/phantoms/components/types/PinMetadataTypes';
import { useEditor } from '@/providers/editor-provider';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import clsx from 'clsx';

const DefaultEditorCanvasCard = ({ data }: { data: EditorCanvasCardType }) => {
  const { dispatch, state } = useEditor();
  const nodeId = useNodeId();
  
  const inputHandles = useMemo(
    () => (data.metadata.inputHandles || []).map((handle, idx) => (
      <CustomNodeHandle
        key={`input-${idx}-${nodeId}`}
        id={handle.id}
        type={handle.type}
        position={Position.Left}
        style={{ top: `${(idx + 1) * 20}px`, zIndex: 100 }}
        datatype={handle.datatype}
        dataTypeColor={DataTypesColors[handle.datatype]}
      />
    )),
    [data.metadata.inputs, nodeId]
  );

  const outputHandles = useMemo(
    () => (data.metadata.outputHandles || []).map((handle, idx) => (
      <CustomNodeHandle
        key={`output-${idx}-${nodeId}`}
        type={handle.type}
        position={Position.Right}
        id={handle.id}
        style={{ top: `${(idx + 1) * 20}px` }}
        datatype={handle.datatype}
        dataTypeColor={DataTypesColors[handle.datatype]}
      />
    )),
    [data.metadata.outputs, nodeId]
  );

  useEffect(() => {
    // Get current handles from the selected node in state
    const currentNode = state.editor.selectedNode;

    const inputHandlesData = inputHandles.map((handle) => ({
      id: handle.props.id,
      type: handle.props.type,
      datatype: handle.props.datatype || 'str',
      dataTypeColor: handle.props.dataTypeColor || 'salmon',
    }));

    const outputHandlesData = outputHandles.map((handle) => ({
      id: handle.props.id,
      type: handle.props.type,
      datatype: handle.props.datatype || 'str',
      dataTypeColor: handle.props.dataTypeColor || 'salmon',
    }));

    // Only dispatch if inputHandles or outputHandles have changed
    const handlesChanged =
      JSON.stringify(inputHandlesData) !== JSON.stringify(currentNode.data.metadata.inputHandles) ||
      JSON.stringify(outputHandlesData) !== JSON.stringify(currentNode.data.metadata.outputHandles);

    if (handlesChanged) {
      dispatch({
        type: 'UPDATE_NODE_HANDLES',
        payload: {
          nodeId: currentNode.id,
          inputHandles: inputHandlesData,
          outputHandles: outputHandlesData,
        },
      });
    }
  }, [inputHandles, outputHandles, dispatch, state.editor.selectedNode]);

  return (
    <>
      {inputHandles}

      <Card
        onClick={(e) => {
          e.stopPropagation();
          const val = state.editor.elements.find((n) => n.id === nodeId);
          if (val)
            dispatch({
              type: 'SELECTED_ELEMENT',
              payload: {
                element: val,
              },
            });
        }}
        className="relative max-w-[400px] dark:border-muted-foreground/70"
      >
        <CardHeader className="flex flex-row items-center gap-4">
          <div>
            <CardTitle className="text-md">{data.title}</CardTitle>
            <CardDescription>
              <p className="text-xs text-muted-foreground/50">
                <b className="text-muted-foreground/80">ID: </b>
                {nodeId}
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
      </Card>

      {outputHandles}
    </>
  );
};

export default DefaultEditorCanvasCard;
