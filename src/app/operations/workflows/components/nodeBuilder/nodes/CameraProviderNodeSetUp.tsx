import React, { useEffect, useState } from 'react'
import { EditorNodeType } from '../../../types/EditorCanvasTypes'
import { useEditor } from '@/providers/editor-provider';
import useCameraService from '@/app/cameras/hooks/useCameraService';
import { CameraStructure } from '@/app/cameras/structure/CameraStructure';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Urls from '@/lib/Urls';

const CameraProviderNodeSetUp = ({
    selectedNode
}: {
    selectedNode: EditorNodeType
}) => {
    const { state, dispatch } = useEditor();
    const [cameras] = useCameraService();
    const [selectedCamera, setSelectedCamera] = useState<CameraStructure | null>(null);

    useEffect(() => {
        const imageObjectHandle = selectedNode.data.metadata.outputHandles?.find(
            (handle) => handle.datatype === 'ImageObject'
        );

        if (imageObjectHandle?.data && 'cameraObject' in imageObjectHandle.data) {
            const existingCameraId = imageObjectHandle.data.cameraObject?.id;
            const existingCamera = cameras.find((camera) => camera.id === existingCameraId);
            setSelectedCamera(existingCamera || null);
        }
    }, [selectedNode, cameras]);

    const handleCameraChange = async (selected: string) => {
        const selectedCamObj = cameras.find((camera) => camera.id === selected);
        setSelectedCamera(selectedCamObj || null);
    
        if (selectedCamObj) {
            const imageUrl = `${Urls.fetchPhantomCamera}/${selected}/image`;
    
            const updatedNode = {
                ...selectedNode,
                data: {
                    ...selectedNode.data,
                    metadata: {
                        ...selectedNode.data.metadata,
                        outputHandles: selectedNode.data.metadata.outputHandles?.map((handle) => {
                            switch (handle.datatype) {
                                case 'string':
                                    return { ...handle, data: { cameraId: selected } };
                                case 'ImageObject':
                                    return { ...handle, data: { cameraObject: selectedCamObj } };
                                case 'bytes':
                                    return { ...handle, data: { cameraImage: imageUrl } };
                                default:
                                    return handle;
                            }
                        }),
                    },
                },
            };
    
            dispatch({
                type: 'UPDATE_NODE',
                payload: { elements: state.editor.elements.map(node => node.id === selectedNode.id ? updatedNode : node) },
            });
        }
    };
    

    // check editor state only node updated
    useEffect(() => {
        console.log('Selected Camera editor state outputs:', state.editor.selectedNode.data.metadata.outputHandles);
    }, [state.editor]);

    return (
        <Select value={selectedCamera?.id ?? ''} onValueChange={handleCameraChange}>

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
    )
}

export default CameraProviderNodeSetUp