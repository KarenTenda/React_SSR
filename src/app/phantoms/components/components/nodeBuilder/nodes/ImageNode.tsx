"use client";

import React, { useEffect, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Urls from '@/lib/constants/Urls';
import { CameraSettings } from '@/app/cameras/schemas/CameraSettingsSchemas';
import { CameraStructure } from '@/app/cameras/structure/CameraStructure';
import useCameraService from '@/app/cameras/hooks/useCameraService';

const ImageNode = ({ data }: { data: any}) => {
  const [cameras, setCameras] = useCameraService();
  console.log('cameras', cameras);  
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');

  useEffect(() => {
    if (cameras.length > 0) {
      setSelectedCameraId(cameras[0].id);  // Set default to first camera ID
    }
  }, [cameras]);
  const handleCameraChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newCameraId = event.target.value;
    setSelectedCameraId(newCameraId);
  };

  return (
    <div className="image-node card">
      <Handle type="target" position={Position.Left} id="camera_input" style={{ background: '#555' }} />


      <Card style={{ width: '250px', padding: '10px' }}>

        <CardTitle className='text-sm'>ImageNode: Select Camera and output camera image</CardTitle>
        <Separator />

        <CardContent>
          <label htmlFor="cameraSelect" style={{ display: 'block', marginBottom: '8px' }}>Select Camera</label>
          <select
            id="cameraSelect"
            value={selectedCameraId}
            onChange={handleCameraChange}
            style={{
              width: '100%',
              padding: '5px',
              borderRadius: '4px',
              marginBottom: '12px',
            }}
          >
            <option value='' disabled>
              Select Camera
            </option>
            {cameras.map((camera) => (
              <option key={camera.id} value={camera.id}>
                {camera.id}
              </option>
            ))}
          </select>

          {/* Display a placeholder for the image */}
          <img
            src={`${Urls.fetchPhantomCameras}/${selectedCameraId}/image`}
            alt='selected camera image'
          />
        </CardContent>

        {/* Selected camera display */}
        {selectedCameraId && (
          <CardDescription>
            <p>Selected Camera ID: {selectedCameraId}</p>
          </CardDescription>
        )}
      </Card>

      {/* Output Handle for the node */}
      <Handle type="source" position={Position.Right} id="image_output" style={{ background: '#555' }} />
    </div>
  );
};

export default ImageNode;
