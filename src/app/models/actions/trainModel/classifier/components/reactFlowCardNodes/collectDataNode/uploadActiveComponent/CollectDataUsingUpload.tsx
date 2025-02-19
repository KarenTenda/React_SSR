"use client";

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DeleteIcon } from '@/public/assets/Icons'
import Dropzone from 'react-dropzone';
import React, { useEffect, useRef, useState } from 'react'
import CustomModal from '@/components/custom/modals/CustomModal';
import { RegionStructure } from '@/app/operations/regions/structures/RegionStructure';
import 'react-image-crop/dist/ReactCrop.css';

const CollectDataUsingUpload = ({
  setIsUploadActive,
  capturedImages,
  setCapturedImages,
  savedRegions,
  savedRegionIDs,
  isCropModalOpen,
  setIsCropModalOpen
}: {
  setIsUploadActive: React.Dispatch<React.SetStateAction<boolean>>,
  capturedImages: string[],
  setCapturedImages: React.Dispatch<React.SetStateAction<string[]>>,
  savedRegions: RegionStructure[],
  savedRegionIDs: string[],
  isCropModalOpen: boolean,
  setIsCropModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {

  const [isCropped, setIsCropped] = useState<boolean | null>(true);
  const [selectedRegion, setSelectedRegion] = useState<string>('');

  useEffect(() => {
    console.log(isCropped)
  }, [isCropModalOpen])

  const handleDroppedImages = async (acceptedFiles: File[]) => {
    if (isCropped === null) {
      setIsCropModalOpen(true);
      return;
    }

    for (const file of acceptedFiles) {
      const imageData = await readImageFile(file);

      if (isCropped === false && selectedRegion) {
        const region = savedRegions.find((region) => region.id === selectedRegion);
        if (region) {
          const croppedImage = await cropImageToRegion(imageData, region);
          setCapturedImages((prev) => [...prev, croppedImage]);
        }
      } else {
        setCapturedImages((prev) => [...prev, imageData]);
      }
    }
  };

  const readImageFile = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target?.result as string);
      reader.readAsDataURL(file);
    });
  };

  const cropImageToRegion = async (imageData: string, region: RegionStructure): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = imageData;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(imageData);

        const { shape } = region;
        if (shape.shape.geometry_type !== 3) {
          console.error("Only square cropping is supported.");
          return resolve(imageData);
        }

        const actualWidth = img.width;
        const actualHeight = img.height;

        let side = shape.shape.side; 
        let cropX = shape.shape.center.x - side / 2;
        let cropY = shape.shape.center.y - side / 2;

        cropX = Math.max(0, Math.min(cropX, actualWidth - side));
        cropY = Math.max(0, Math.min(cropY, actualHeight - side));

        canvas.width = side;
        canvas.height = side;

        ctx.drawImage(img, cropX, cropY, side, side, 0, 0, side, side);

        resolve(canvas.toDataURL()); 
      };
    });
  };

  const handleDeleteImage = (index: number) => {
    const newImages = capturedImages.filter((_, i) => i !== index);
    setCapturedImages(newImages);
  };

  return (
    <>
      <div className="flex flex-col w-full pb-3">
        <div className="flex flex-row justify-between items-center w-full">
          <h6 className=" font-medium text-sm">Upload</h6>
          <Button
            className='text-sm'
            variant="ghost" size="sm"
            onClick={() => setIsUploadActive(false)}
          >
            x
          </Button>
        </div>

        <Dropzone onDrop={(acceptedFiles) => handleDroppedImages(acceptedFiles)} multiple>
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()} className="border-2 border-dotted border-gray-400 rounded-lg p-5 text-center w-72">
              <input {...getInputProps()} />
              <p>Choose images from your files or drag & drop here</p>
            </div>
          )}
        </Dropzone>

      </div>

      <div className="border-l border-gray-300 mx-1"></div>

      <div className="flex flex-col w-full pb-3">
        <h3>Captured Images: {capturedImages.length}</h3>
        <div className="grid grid-cols-4 gap-1 mt-2 max-h-[350px] overflow-y-auto">
          {capturedImages.map((image, index) => (
            <div key={index} className="relative ">
              <img
                key={index}
                src={image}
                alt={`Captured ${index}`}
                className="border border-gray-300 w-full h-full object-cover"
              // style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
              <Button
                onClick={() => handleDeleteImage(index)}
                variant="ghost"
                size="sm"
                className="absolute top-0 left-0 bg-transparent text-[#FA8072] rounded-full p-1 w-6 h-6 flex items-center justify-center"
              >
                <DeleteIcon />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <CustomModal
        open={isCropModalOpen}
        onClose={() => setIsCropModalOpen(false)}
        title="Crop Images"
        description="Are the images cropped? If not, select a region to crop the images."
      >
        <div className='flex justify-center'>
        <Button
          onClick={() => {
            // setIsCropped(true);
            setIsCropModalOpen(false);
          }}
          className="mr-2"
        >
          Yes
        </Button>
        <Button
          onClick={() => { setIsCropped(false) }}
          className="mr-2"
        >
          No
        </Button>
        </div>

        {!isCropped && (
          <>
            <p>Select a region to crop the images:</p>
            <Select value={selectedRegion} onValueChange={(value) => {
              setSelectedRegion(value);
              setIsCropModalOpen(false);
            }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a region" />
              </SelectTrigger>
              <SelectContent>
                {savedRegionIDs?.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}
      </CustomModal>

    </>
  )
}

export default CollectDataUsingUpload