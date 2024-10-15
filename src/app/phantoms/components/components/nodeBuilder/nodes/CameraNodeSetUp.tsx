"use client";

import React, { useEffect, useState } from 'react';
import useCameraService from '@/app/cameras/hooks/useCameraService';
import { EditorNodeType } from '../../../types/EditorCanvasTypes';
import { CameraStructure } from '@/app/cameras/structure/CameraStructure';
import Urls from '@/lib/Urls';

const CameraNodeSettings = ({
  selectedNode,
  onUpdate,
}: {
  selectedNode: EditorNodeType;
  onUpdate: (updatedNode: EditorNodeType) => void;
}) => {
  const [cameras] = useCameraService();
  const [selectedCamera, setSelectedCamera] = useState<CameraStructure | null>(null);

  useEffect(() => {
    const existingCameraId = selectedNode.data.metadata.outputHandles?.find(
      (handle) => handle.datatype === 'ImageObject'
    )?.data?.cameraObject?.id;

    console.log('existingCameraId', existingCameraId);

    const existingCamera = cameras.find((camera) => camera.id === existingCameraId);

    if (existingCamera) {
      setSelectedCamera(existingCamera);
    }
  }, [selectedNode, cameras]);

  const handleCameraChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = event.target.value;
    const selectedCamObj = cameras.find((camera) => camera.id === selected);
    
    setSelectedCamera(selectedCamObj || null);

    if (selectedCamObj) {
      const imageUrl = `${Urls.fetchPhantomCamera}/${selected}/image`;
      
      onUpdate({
        ...selectedNode,
        data: {
          ...selectedNode.data,
          metadata: {
            ...selectedNode.data.metadata,
            outputHandles: selectedNode.data.metadata.outputHandles?.map((handle) => {
              switch (handle.datatype) {
                case 'string':
                  return {
                    ...handle,
                    data: { cameraId: selected }  // Camera ID output
                  };
                case 'ImageObject':
                  return {
                    ...handle,
                    data: { cameraObject: selectedCamObj }  // Camera object output
                  };
                case 'bytes':
                  return {
                    ...handle,
                    data: { cameraImage: imageUrl }  // Image (bytes) output
                  };
                default:
                  return handle;
              }
            }),
          },
        },
      });
    }
  };

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
