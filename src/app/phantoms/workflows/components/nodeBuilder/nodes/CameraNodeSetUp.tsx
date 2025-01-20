"use client";

import React, { use, useEffect, useState } from 'react';
import useCameraService from '@/app/cameras/hooks/useCameraService';
import { EditorNodeType } from '../../../types/EditorCanvasTypes';
import { CameraStructure } from '@/app/cameras/structure/CameraStructure';
import Urls from '@/lib/Urls';
import { useEditor } from '@/providers/editor-provider';

const CameraNodeSettings = ({
  selectedNode,
  // onUpdate,
}: {
  selectedNode: EditorNodeType;
  // onUpdate: (updatedNode: EditorNodeType) => void;
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

  const handleCameraChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = event.target.value;
    const selectedCamObj = cameras.find((camera) => camera.id === selected);
    setSelectedCamera(selectedCamObj || null);

    if (selectedCamObj) {
      const imageUrl = `${Urls.fetchPhantomCamera}/${selected}/image`;

      const updatedElements = (state.editor.elements || []).map((node) => 
        node.id === selectedNode.id
          ? {
            ...node,
            data: {
              ...node.data,
              metadata: {
                ...node.data.metadata,
                outputHandles: node.data.metadata.outputHandles?.map((handle) => {
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
          }
          : node
      );

      

      dispatch({
        type: 'UPDATE_NODE',
        payload: { elements: updatedElements },
      });

      console.log('Dispatched updated elements to state:', updatedElements);

    }
  };

  // check editor state only node updated
  useEffect(() => {
    console.log('Selected Camera editor state:', state.editor);
  }, [state.editor]);


  // useEffect(() => {
  //   const updatedNode = state.editor.elements.find((node) => node.id === selectedNode.id);
  //   if (updatedNode) {
  //     const imageObjectHandle = updatedNode.data.metadata.outputHandles?.find(
  //       (handle) => handle.datatype === 'ImageObject'
  //     );
  //     // console.log('Updated Image Object Handle:', imageObjectHandle?.data);
  //   }
  // }, [state.editor.elements, selectedNode.id]);

  return (
    <div className="camera-settings">
      <label htmlFor="camera-select">Select Camera:</label>
      <select
        id="camera-select"
        value={selectedCamera?.id ?? ''}
        onChange={handleCameraChange}
      >
        <option value="">-- Select a Camera --</option>
        {cameras.map((camera) => (
          <option key={camera.id} value={camera.id}>
            {camera.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CameraNodeSettings;
