import { useEditor } from '@/providers/editor-provider'
import React, { CSSProperties } from 'react'
import { Handle, HandleProps } from '@xyflow/react'
import { DataTypesColors } from '@/app/phantoms/workflows/types/PinMetadataTypes';
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';

type CustomNodeHandleProps = HandleProps & {
  style?: CSSProperties;
  datatype: keyof typeof DataTypesColors;
  dataTypeColor?: string;
};

const CustomHandle = ({ datatype, dataTypeColor, ...props }: CustomNodeHandleProps) => {
  const { state, dispatch } = useEditor();
  const { toast } = useToast()

  const isSelected = state.editor.selectedNode.data.metadata.selectedHandle?.id === props.id;

  return (
    <Handle
      {...props}
      style={{
        ...props.style,
        
        backgroundColor: isSelected ? 'salmon' : `${dataTypeColor || DataTypesColors[datatype]}`, 
        border: isSelected ? '2px solid salmon' : `${dataTypeColor || DataTypesColors[datatype]}`,
        boxShadow: isSelected ? '0 0 10px 2px salmon' : 'none', 
        transition: 'box-shadow 0.3s ease' 
      }}
      isValidConnection={(connection) => {
        // Find the source and target handles
        const sourceNode = state.editor.elements.find((node) => node.id === connection.source);
        const targetNode = state.editor.elements.find((node) => node.id === connection.target);
      
        const sourceHandle = sourceNode?.data.metadata?.outputHandles?.find(
          (handle) => handle.id === connection.sourceHandle
        );
      
        const targetHandle = targetNode?.data.metadata?.inputHandles?.find(
          (handle) => handle.id === connection.targetHandle
        );
      
        // console.log('Connection Details:', connection);
        // console.log('Source Node:', sourceNode);
        // console.log('Target Node:', targetNode);
        // console.log('Source Handle:', sourceHandle);
        // console.log('Target Handle:', targetHandle);
      
        if (!sourceHandle || !targetHandle) {
          console.log('Missing handle');
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request.",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          })
          return false; // If either handle is missing, disallow connection
        }
      
        // Compare the datatypes of the source and target handles
        if (sourceHandle.datatype !== targetHandle.datatype) {
          console.log('Datatypes do not match');
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "Datatypes do not match.",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          })
          return false; // Disallow connection if datatypes don't match
        }
      
        // Allow connection only if target doesn't already have a connection
        const targetFromHandleInState = state.editor.edges.filter(
          (edge) => edge.target === connection.target && edge.target === connection.targetHandle
        ).length;
      
        return targetFromHandleInState < 1; // Allow only one connection to the target handle
      }}
      className="!-bottom-2 !h-4 !w-4 dark:bg-neutral-800"
    />
  );
};


export default CustomHandle
