"use client";

import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const CalibrationNode = ({ data }: { data: any }) => {
  const [inputImage, setInputImage] = useState<string | null>(null);  
  const [calibrationId, setCalibrationId] = useState<string | null>(null); 
  const [calibratedImage, setCalibratedImage] = useState<string | null>(null); 

  // Simulate calibration process
  const simulateCalibration = () => {
    if (inputImage) {
      const resultId = `calibration-${Math.floor(Math.random() * 1000)}`;
      setCalibrationId(resultId);

      // Simulate generating a calibrated image (using the same image for demo)
      setCalibratedImage(inputImage);
    }
  };

  return (
    <div className="calibration-node w-[300px] p-2 bg-white border rounded-lg shadow-md">

      <Handle type="target" position={Position.Left} id="image_input" style={{ background: '#555' }} />

      <Card className="p-2">
        <CardHeader>
          <CardTitle className="text-sm">CalibrationNode: When you click the calibrate button, it will get the calibration result and image</CardTitle>
        </CardHeader>
        <Separator />

        <CardContent>
          <div className="flex items-center justify-between">

            <div className="w-[74px] h-[65px] border border-gray-300 flex items-center justify-center">
              {inputImage ? (
                <img src={inputImage} alt="input" className="w-full h-full object-contain" />
              ) : (
                <span className="text-xs text-gray-500">74 x 65</span>
              )}
            </div>

            <Button onClick={simulateCalibration} className="ml-2 bg-gray-200 text-gray-800">
              Calibrate
            </Button>

            <div className="text-center">
              <p className="text-sm">Result</p>
              <div className="w-[74px] h-[65px] border border-gray-300 flex items-center justify-center mt-1">
                {calibratedImage ? (
                  <img src={calibratedImage} alt="calibrated" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-xs text-gray-500">74 x 65</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setInputImage(reader.result as string);  
                  };
                  reader.readAsDataURL(file);  
                }
              }}
              className="text-sm"
            />
          </div>

          {calibrationId && (
            <div className="mt-4">
              <p className="text-sm">Calibration ID: {calibrationId}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Handle type="source" position={Position.Right} id="calibration_output" style={{ background: '#555' }} />
    </div>
  );
};

export default CalibrationNode;
