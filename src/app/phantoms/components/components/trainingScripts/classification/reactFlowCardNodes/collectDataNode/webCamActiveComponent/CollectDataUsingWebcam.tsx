"use client";

import React, { useState, useRef, useCallback, useEffect, DependencyList } from 'react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuCheckboxItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { CropIcon, DeleteIcon, SettingsIcon } from '../../../../../../../../../../public/assets/Icons';
import ClickableIconButton from '@/components/custom/buttons/ClickableIconButton';
import Urls from '@/constants/Urls';
import { Loader2 } from 'lucide-react';
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop
} from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { v4 as uuidv4 } from 'uuid';
import { CameraStructure } from '@/app/cameras/structure/CameraStructure';
import { set } from 'react-hook-form';

interface RegionStructure {
  id: string;
  type: string;
  enabled: boolean;
  reference_resolution: number[];
  shape: {
    shape: {
      geometry_type: number;
      center: {
        geometry_type: number;
        x: number;
        y: number;
      };
      side: number;
    };
  };
}

const initialRegion: RegionStructure = {
  id: uuidv4(),
  type: 'imashape',
  enabled: true,
  reference_resolution: [1280, 720],
  shape: {
    shape: {
      geometry_type: 3, // Assuming 3 is the geometry type for a rectangle or square
      center: {
        geometry_type: 8, // Assuming 8 is for the center point
        x: 640, // Center of 1280 width
        y: 360, // Center of 720 height
      },
      side: 720, // Initial side size, can be adjusted
    },
  },
};

export function useDebounceEffect(
  fn: () => void,
  waitTime: number,
  deps?: DependencyList,
) {
  useEffect(() => {
    const t = setTimeout(() => {
      fn();  // Call fn directly
    }, waitTime);

    return () => {
      clearTimeout(t);
    };
  }, deps ?? []);
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

const CollectDataUsingWebcam = ({
  setIsWebcamActive,
  setIsWebcamSettingsActive,
  cameras,
  selectedCameraId,
  setSelectedCameraId
}: {
  setIsWebcamActive: React.Dispatch<React.SetStateAction<boolean>>,
  setIsWebcamSettingsActive: React.Dispatch<React.SetStateAction<boolean>>,
  cameras: CameraStructure[],
  selectedCameraId: string,
  setSelectedCameraId: React.Dispatch<React.SetStateAction<string>>
}) => {
  // const src = `${Urls.fetchPhantomCamera}/${selectedCameraId}/stream`
  const [imgSrc, setImgSrc] = useState(`${Urls.fetchPhantomCamera}/${selectedCameraId}/stream`)
  const [selectedRegion, setSelectedRegion] = useState<RegionStructure | null>(initialRegion);

  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [scale, setScale] = useState(1)
  const [rotate, setRotate] = useState(0)
  const [isCropping, setIsCropping] = useState(false);
  const [isContinuousCapture, setIsContinuousCapture] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const aspect = 1;

  // useEffect(() => {
  //   if (cameras.length > 0 && !selectedCameraId) {
  //     setSelectedCameraId(cameras[0].id);
  //   }

  //   // If the selected camera has center crop enabled or if the resolution isn't square
  //   if (selectedCameraId) {
  //     const cameraSettings = cameras.find((camera) => camera.id === selectedCameraId);

  //     if (cameraSettings) {
  //       const [width, height] = cameraSettings.resolution;

  //       if (cameraSettings.centre_crop || width !== height) {
  //         console.log('Cropping image for camera:');
  //         const src = `${Urls.fetchPhantomCamera}/${selectedCameraId}/stream`;
  //         cropImage(src, width, height);
  //       } else {
  //         console.log('No cropping needed:');
  //         setImgSrc(`${Urls.fetchPhantomCamera}/${selectedCameraId}/stream`);
  //       }
  //     }
  //   }
  // }, [cameras, selectedCameraId]);

  // const cropImage = (src, width, height) => {
  //   const img = new Image();
  //   img.crossOrigin = 'anonymous';
  //   img.src = src;

  //   img.onload = () => {
  //     const canvas = document.createElement('canvas');
  //     const ctx = canvas.getContext('2d');

  //     const cropSide = Math.min(width, height);
  //     const startX = (width - cropSide) / 2;
  //     const startY = (height - cropSide) / 2;

  //     canvas.width = cropSide;
  //     canvas.height = cropSide;

  //     ctx.drawImage(img, startX, startY, cropSide, cropSide, 0, 0, cropSide, cropSide);

  //     const croppedSrc = canvas.toDataURL('image/jpeg');
  //     setImgSrc(croppedSrc);
  //   };

  //   img.onerror = (error) => {
  //     console.error('Error loading image for cropping:', error);
  //   };
  // };


  // const handleCameraSelect = async (cameraId: string) => {
  //   setSelectedCameraId(cameraId);
  //   setImgSrc(`${Urls.fetchPhantomCamera}/${cameraId}/stream`);
  // };


  // const handleDeleteImage = (index: number) => {
  //   const newImages = images.filter((_, i) => i !== index);
  //   setImages(newImages);
  // };

  // function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
  //   if (aspect) {
  //     const { width, height } = e.currentTarget
  //     setCrop(centerAspectCrop(width, height, aspect))
  //   }
  // }

  // // useDebounceEffect(
  // //   async () => {
  // //     if (
  // //       completedCrop?.width &&
  // //       completedCrop?.height &&
  // //       imgRef.current &&
  // //       previewCanvasRef.current
  // //     ) {
  // //       canvasPreview(
  // //         imgRef.current,
  // //         previewCanvasRef.current,
  // //         completedCrop,
  // //         scale,
  // //         rotate,
  // //       )
  // //     }
  // //   },
  // //   100,
  // //   [completedCrop, scale, rotate],
  // // )

  // useDebounceEffect(
  //   async () => {
  //     if (
  //       completedCrop?.width &&
  //       completedCrop?.height &&
  //       imgRef.current &&
  //       previewCanvasRef.current
  //     ) {
  //       console.log('completedCrop', completedCrop)
  //       console.log("imgRef.current", imgRef.current)
  //       console.log("previewCanvasRef.current", previewCanvasRef.current)
  //       const scaleX = imgRef.current.naturalWidth / imgRef.current.width; // Use the displayed width
  //       const scaleY = imgRef.current.naturalHeight / imgRef.current.height; // Use the displayed height

  //       previewCanvasRef.current.width = completedCrop.width * scaleX;
  //       previewCanvasRef.current.height = completedCrop.height * scaleY;

  //       const ctx = previewCanvasRef.current.getContext('2d');

  //       if (ctx) {
  //         ctx.clearRect(0, 0, previewCanvasRef.current.width, previewCanvasRef.current.height);

  //         // Adjust the crop area by the scaling factors
  //         ctx.drawImage(
  //           imgRef.current,
  //           completedCrop.x * scaleX,
  //           completedCrop.y * scaleY,
  //           completedCrop.width * scaleX,
  //           completedCrop.height * scaleY,
  //           0,
  //           0,
  //           previewCanvasRef.current.width,
  //           previewCanvasRef.current.height
  //         );
  //       }
  //     }
  //   },
  //   100,
  //   [completedCrop, scale, rotate],
  // )

  // function startContinuousCapture() {
  //   setIsContinuousCapture(true);
  //   setTimeout(() => {
  //     intervalRef.current = setInterval(() => {
  //       captureCroppedImage();
  //     }, 300);
  //   }, 500);
  // }

  // function stopContinuousCapture() {
  //   setIsContinuousCapture(false);
  //   if (intervalRef.current) {
  //     clearInterval(intervalRef.current);
  //     intervalRef.current = null;
  //   }
  // }

  // // function captureCroppedImage() {
  // //   if (!completedCrop || !imgRef.current) {
  // //     return;
  // //   }

  // //   const canvas = document.createElement('canvas');
  // //   const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
  // //   const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

  // //   canvas.width = completedCrop.width * scaleX;
  // //   canvas.height = completedCrop.height * scaleY;
  // //   const ctx = canvas.getContext('2d');



  // //   if (ctx) {
  // //     imgRef.current.crossOrigin = "anonymous";
  // //     ctx.drawImage(
  // //       imgRef.current,
  // //       completedCrop.x * scaleX,
  // //       completedCrop.y * scaleY,
  // //       completedCrop.width * scaleX,
  // //       completedCrop.height * scaleY,
  // //       0,
  // //       0,
  // //       canvas.width,
  // //       canvas.height
  // //     );

  // //     // Convert canvas to image URL
  // //     const imageUrl = canvas.toDataURL('image/jpeg');
  // //     console.log('Captured image URL:', imageUrl);

  // //     // Add the captured image to the state
  // //     setImages((prevImages) => [...prevImages, imageUrl]);
  // //   }
  // // }

  // function captureCroppedImage() {
  //   if (!imgRef.current) {
  //     return;
  //   }

  //   const canvas = document.createElement('canvas');
  //   const ctx = canvas.getContext('2d');
  //   const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
  //   const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

  //   if (completedCrop) {
  //     canvas.width = completedCrop.width * scaleX;
  //     canvas.height = completedCrop.height * scaleY;
  //     imgRef.current.crossOrigin = "anonymous",
  //       ctx?.drawImage(

  //         imgRef.current,
  //         completedCrop.x * scaleX,
  //         completedCrop.y * scaleY,
  //         completedCrop.width * scaleX,
  //         completedCrop.height * scaleY,
  //         0,
  //         0,
  //         canvas.width,
  //         canvas.height
  //       );
  //   } else {
  //     canvas.width = imgRef.current.naturalWidth;
  //     canvas.height = imgRef.current.naturalHeight;
  //     imgRef.current.crossOrigin = "anonymous",
  //       ctx?.drawImage(
  //         imgRef.current,
  //         0,
  //         0,
  //         imgRef.current.naturalWidth,
  //         imgRef.current.naturalHeight,
  //         0,
  //         0,
  //         canvas.width,
  //         canvas.height
  //       );
  //   }

  //   const imageUrl = canvas.toDataURL('image/jpeg');
  //   setImages((prevImages) => [...prevImages, imageUrl]);
  // }

  const handleCameraSelect = async (cameraId: string) => {
    setSelectedCameraId(cameraId);
    setImgSrc(`${Urls.fetchPhantomCamera}/${cameraId}/stream`);
  };

  const handleDeleteImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, aspect));
  }

  // useDebounceEffect(
  //   async () => {
  //     if (
  //       completedCrop?.width && 
  //       completedCrop?.height && 
  //       imgRef.current && 
  //       previewCanvasRef.current
  //     ) {
  //       const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
  //       const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

  //       previewCanvasRef.current.width = completedCrop.width * scaleX;
  //       previewCanvasRef.current.height = completedCrop.height * scaleY;

  //       const ctx = previewCanvasRef.current.getContext('2d');

  //       if (ctx) {
  //         ctx.clearRect(0, 0, previewCanvasRef.current.width, previewCanvasRef.current.height);
  //         ctx.drawImage(
  //           imgRef.current,
  //           completedCrop.x * scaleX,
  //           completedCrop.y * scaleY,
  //           completedCrop.width * scaleX,
  //           completedCrop.height * scaleY,
  //           0,
  //           0,
  //           previewCanvasRef.current.width,
  //           previewCanvasRef.current.height
  //         );
  //       }
  //     }
  //   },
  //   100,
  //   [completedCrop],
  // );

  useEffect(() => {
    if (
      completedCrop?.width &&
      completedCrop?.height &&
      imgRef.current &&
      previewCanvasRef.current
    ) {
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width; 
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height; 
  
      previewCanvasRef.current.width = completedCrop.width * scaleX;
      previewCanvasRef.current.height = completedCrop.height * scaleY;
  
      const ctx = previewCanvasRef.current.getContext('2d');
  
      if (ctx) {
        ctx.clearRect(0, 0, previewCanvasRef.current.width, previewCanvasRef.current.height);
  
        ctx.drawImage(
          imgRef.current,
          completedCrop.x * scaleX,
          completedCrop.y * scaleY,
          completedCrop.width * scaleX,
          completedCrop.height * scaleY,
          0,
          0,
          previewCanvasRef.current.width,
          previewCanvasRef.current.height
        );
      }
    }
  }, [completedCrop, scale, rotate]);
  

  function startContinuousCapture() {
    setIsContinuousCapture(true);
    setTimeout(() => {
      intervalRef.current = setInterval(() => {
        captureCroppedImage();
      }, 300);
    }, 500);
  }

  function stopContinuousCapture() {
    setIsContinuousCapture(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  function captureCroppedImage() {
    if (!imgRef.current) {
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

    if (completedCrop) {
      canvas.width = completedCrop.width * scaleX;
      canvas.height = completedCrop.height * scaleY;

      imgRef.current.crossOrigin = "anonymous";
      
      ctx?.drawImage(
        imgRef.current,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
      );
    } else {
      canvas.width = imgRef.current.naturalWidth;
      canvas.height = imgRef.current.naturalHeight;

      imgRef.current.crossOrigin = "anonymous";

      ctx?.drawImage(
        imgRef.current,
        0,
        0,
        imgRef.current.naturalWidth,
        imgRef.current.naturalHeight,
        0,
        0,
        canvas.width,
        canvas.height
      );
    }

    const imageUrl = canvas.toDataURL('image/jpeg');
    setImages((prevImages) => [...prevImages, imageUrl]);
  }

  return (
    <>
      <div className="flex flex-col w-full pb-3">
        <div className="flex flex-row justify-between items-center w-full">
          <h6 className=" font-medium text-sm">Webcam</h6>
          <Button className='text-sm' variant="ghost" size="sm" onClick={() => setIsWebcamActive(false)}>
            x
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className='text-sm' variant="outline" size="sm">Switch Camera</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Available Cameras</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {cameras.map((camera) => (
              <DropdownMenuCheckboxItem
                key={camera.id}
                checked={selectedCameraId === camera.id}
                onCheckedChange={() => handleCameraSelect(camera.id)}
              >
                {camera.name}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {isCropping ? (
          <>
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
            >
              <img
                ref={imgRef}
                alt="Crop me"
                src={imgSrc}
                onLoad={onImageLoad}
                // style={{ width: '720px', height: '720px', objectFit: 'cover' }}
              />
            </ReactCrop>

            <Button
              className='text-sm'
              variant="outline"
              size="sm"
              onClick={() => setIsCropping(false)}
            >
              Done Cropping
            </Button>
          </>
        ) : (
          <>
            <div className="relative mt-1">
              <img
                ref={imgRef}
                alt="View"
                src={imgSrc}
                onLoad={onImageLoad}
                // style={{ width: '720px', height: '720px', objectFit: 'cover' }}
              />
              <Button
                onClick={() => setIsCropping(true)}
                variant="ghost"
                size="sm"
                className="absolute top-2 left-0 bg-transparent text-[#FA8072] rounded-full p-1 w-6 h-6 flex items-center justify-center"
              >
                <CropIcon />
              </Button>

            </div>

            <div className="flex flex-row justify-between items-center space-x-2 mt-1">
              <Button
                className='text-sm'
                variant="outline"
                size="sm"
                onClick={isContinuousCapture ? stopContinuousCapture : startContinuousCapture}
              >
                {isContinuousCapture ? "Stop " : "Start "}
              </Button>

              <ClickableIconButton
                Icon={SettingsIcon}
                onClick={() => setIsWebcamSettingsActive(true)}
                tooltipText='Edit'

              />
            </div>
          </>
        )}
      </div>

      <div className="border-l border-gray-300 mx-1"></div>

      <div className="flex flex-col w-full pb-3">
        <h6 className="font-medium text-sm mt-2">Image Samples</h6>
        {isCropping ? (
          <>
            {!!completedCrop && (
              <div>
                <canvas
                  ref={previewCanvasRef}
                  style={{
                    border: '1px solid black',
                    objectFit: 'contain',
                    width: completedCrop.width,
                    height: completedCrop.height,
                  }}
                />
              </div>
            )}
          </>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-1 mt-2 max-h-[220px] overflow-y-auto">
              {images.map((image, index) => (
                <div key={index} className="relative ">
                  <img
                    key={index}
                    src={image}
                    alt={`Captured ${index}`}
                    className="border border-gray-300"
                  />
                  <Button
                    onClick={() => handleDeleteImage(index)}
                    variant="ghost"
                    size="sm"
                    className="absolute top-0 left-0 bg-transparent text-[#FA8072] rounded-full p-1 w-4 h-4 flex items-center justify-center"
                  >
                    <DeleteIcon />
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}



      </div>
    </>
  )
}

export default CollectDataUsingWebcam