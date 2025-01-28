"use client";

import React, { useState, useRef, useCallback, useEffect, DependencyList } from 'react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { CropIcon, DeleteIcon, SettingsIcon } from '../../../../../../../../../../../public/assets/Icons';
import { Loader2, PauseIcon, PlayIcon, RefreshCcw, StopCircleIcon } from 'lucide-react';
import ClickableIconButton from '@/components/custom/buttons/ClickableIconButton';
import Urls from '@/lib/Urls';
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop
} from 'react-image-crop'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Switch } from '@/components/ui/switch';
import 'react-image-crop/dist/ReactCrop.css'
import { v4 as uuidv4 } from 'uuid';
import { CameraStructure } from '@/app/cameras/structure/CameraStructure';
import useRegionService from '@/app/phantoms/regions/hooks/useRegions';
import axios from 'axios';
import { Resolution } from '@/app/phantoms/regions/structures/RegionStructure';

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
      geometry_type: 3,
      center: {
        geometry_type: 8,
        x: 640,
        y: 360,
      },
      side: 100,
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
      fn();
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
  const [imgSrc, setImgSrc] = useState(`${Urls.fetchPhantomCamera}/${selectedCameraId}/stream`)
  const selectedCamera = cameras.find((camera) => camera.id === selectedCameraId)
  const [regions, existingRegionIDs] = useRegionService()
  const [regionIDs, setRegionIDs] = useState<string[]>(existingRegionIDs)
  const [selectedRegion, setSelectedRegion] = useState<RegionStructure | null>(initialRegion);

  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [crop, setCrop] = useState<Crop>()
  const [region, setRegion] = useState<RegionStructure | null>(null)
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [croppedImageSrc, setCroppedImageSrc] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCroppingComplete, setIsCroppingComplete] = useState(false);
  const [isCropping, setIsCropping] = useState(false);

  const [scale, setScale] = useState(1)
  const [rotate, setRotate] = useState(0)
  const aspect = 1;

  const [isCapturing, setIsCapturing] = useState(false);
  const [isContinuousCapture, setIsContinuousCapture] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [fps, setFps] = useState(30);
  const [holdToRecord, setHoldToRecord] = useState(true);
  const [delay, setDelay] = useState(1);
  const [duration, setDuration] = useState(6);


  const handleCameraSelect = async (cameraId: string) => {
    setSelectedCameraId(cameraId);
    setImgSrc(`${Urls.fetchPhantomCamera}/${cameraId}/stream`);

    // setCrop(undefined);
    // setCompletedCrop(undefined);
  };

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget
      setCrop(centerAspectCrop(width, height, aspect))
    }
  }

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
        imgRef.current.crossOrigin = "anonymous";
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

        // Convert the cropped canvas to an image data URL
        const croppedUrl = previewCanvasRef.current.toDataURL('image/jpeg');
        // setCroppedImageSrc(croppedUrl);
      }
    }
  }, [completedCrop, scale, rotate]);

  const handleDoneCropping = async () => {
    if (isCroppingComplete || !completedCrop || !imgRef.current) {
      console.log('No crop completed or image reference missing.');
      return;
    }

    setIsCroppingComplete(true);
    setIsUpdating(true);

    const { x, y, width, height } = completedCrop;

    const cameraSettings = {
      resolution: selectedCamera?.resolution || [1280, 720],
      centre_crop: selectedCamera?.centre_crop || false,
    };

    const [refWidth, refHeight] = cameraSettings.resolution;

    let cropStartX = 0;
    let cropStartY = 0;
    let croppedWidth = refWidth;
    let croppedHeight = refHeight;

    if (cameraSettings.centre_crop) {
      const cropAspectRatio = refWidth / refHeight;
      if (cropAspectRatio > 1) {
        croppedWidth = croppedHeight * cropAspectRatio;
        cropStartX = (refWidth - croppedWidth) / 2;
      } else {
        croppedHeight = croppedWidth / cropAspectRatio;
        cropStartY = (refHeight - croppedHeight) / 2;
      }
    }

    const normalizedX = Math.round((x / imgRef.current.width) * refWidth);
    const normalizedY = Math.round((y / imgRef.current.height) * refHeight);

    const scaleX = refWidth / imgRef.current.width;
    const scaleY = refHeight / imgRef.current.height;

    const normalizedWidth = Math.round(width * scaleX);
    const normalizedHeight = Math.round(height * scaleY);

    const normalizedSide = Math.min(normalizedWidth, normalizedHeight);

    // Note: with these calculations, the normalised values are off by 3-4 pixels

    const referenceResolution: Resolution = [refWidth, refHeight];

    const updatedRegion = {
      id: uuidv4(),
      type: 'imashape',
      enabled: true,
      reference_resolution: referenceResolution,
      shape: {
        shape: {
          geometry_type: 3,
          center: {
            geometry_type: 8,
            x: normalizedX + Math.round(normalizedSide / 2),
            y: normalizedY + Math.round(normalizedSide / 2),
          },
          side: normalizedSide,
        },
      },
    };

    console.log("Crop completed:", completedCrop);
    console.log("Image reference:", imgRef.current.width, imgRef.current.height);
    console.log("Normalized Width:", normalizedWidth, "Normalized Height:", normalizedHeight);
    console.log("Final Normalized Side:", normalizedSide);
    console.log('Updated Region shape:', JSON.stringify(updatedRegion.shape.shape, null, 2));

    try {
      await updateRegion(updatedRegion);

      setRegion(updatedRegion);
      await setCroppedImageSrc(`${Urls.fetchPhantomCamera}/${selectedCameraId}/region/${updatedRegion.id}/stream`);
      console.log("Cropped image source updated.");
    } catch (error) {
      console.error("Error updating region:", error);
    } finally {
      setIsCroppingComplete(false);
      setIsUpdating(false);
    }
  };

  const updateRegion = async (regionToUpdate: RegionStructure) => {
    try {
      if (!regionToUpdate?.id) {
        console.error("Region ID is undefined. Cannot update region.");
        return;
      }

      if (!regionIDs?.includes(regionToUpdate.id)) {
        console.log("Creating new region:", regionToUpdate.id);
        await axios.post(`${Urls.fetchRegions}`, { region: regionToUpdate });
        setRegionIDs((prev) => [...prev, regionToUpdate.id]);
      } else {
        console.log("Updating existing region:", regionToUpdate.id);
        await axios.put(`${Urls.fetchRegions}/${regionToUpdate.id}`, {
          id: regionToUpdate.id,
          region: regionToUpdate,
        });
      }
    } catch (error) {
      console.error("Error updating region:", error);
    }
  };

  function captureCroppedImage() {
    // console.log("Region:", JSON.stringify(region, null, 2));
    // console.log("Image Ref:", imgRef.current);
    // console.log("Completed Crop:", completedCrop);

    if (!completedCrop || (!croppedImageSrc && !imgRef.current)) {
      console.warn("No crop completed, cropped stream, or image reference missing.");
      return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (croppedImageSrc) {
      const tempImage = new Image();
      tempImage.crossOrigin = "anonymous";
      tempImage.onload = () => {
        canvas.width = tempImage.width;
        canvas.height = tempImage.height;
        ctx?.drawImage(tempImage, 0, 0, canvas.width, canvas.height);
        const imageUrl = canvas.toDataURL("image/jpeg");
        setCapturedImages((prevImages) => [...prevImages, imageUrl]);
      };
      tempImage.src = croppedImageSrc;
    } else if (imgRef.current) {
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

      canvas.width = completedCrop.width * scaleX;
      canvas.height = completedCrop.height * scaleY;

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

      const imageUrl = canvas.toDataURL("image/jpeg");
      setCapturedImages((prevImages) => [...prevImages, imageUrl]);
      // console.log("Captured Image URL:", imageUrl);
    }
  }

  const handleStart = async (isHolding = false) => {
    console.log("start capturing", isHolding);
    const interval = 1000 / fps;

    if (holdToRecord) {
      // "Hold to Record" is ON
      if (isHolding) {
        console.log("Hold to Record: Capturing started while holding the button.");

        intervalRef.current = setInterval(async () => {
          try {
            captureCroppedImage();
          } catch (error) {
            console.error("Error capturing image:", error);
          }
        }, interval);
      } else {
        // Stop capturing when button is released
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          console.log("Hold to Record: Capturing stopped after releasing the button.");
        }
      }


    } else {
      // "Hold to Record" is OFF
      if (isCapturing) {
        console.log("Already capturing, ignoring start request.");
        return;
      }

      console.log("Starting capture with settings:", { fps, delay, duration });
      setIsCapturing(true);

      let timeElapsed = 0;

      // await new Promise((resolve) => setTimeout(resolve, delay * 1000));

      // intervalRef.current = setInterval(async () => {
      //   timeElapsed += interval + delay * 1000;

      //   if (timeElapsed >= duration * 1000) {
      //     handleStop();
      //     return;
      //   }
      //   try {
      //     captureCroppedImage();
      //   } catch (error) {
      //     console.error("Error capturing image:", error);
      //   }
      // }, interval + delay * 1000);

      const totalDuration = duration * 1000;
      const adjustedInterval = Math.max(interval, delay * 1000); // Use the longer of `interval` or `delay`

      const capture = async () => {
        if (timeElapsed >= totalDuration) {
          handleStop(); // Automatically stop after the specified duration
          return;
        }

        try {
          captureCroppedImage();
        } catch (error) {
          console.error("Error capturing image:", error);
        }

        timeElapsed += adjustedInterval;
        setTimeout(capture, adjustedInterval); // Recursive timeout for image capture
      };

      // Start the first capture with the delay
      await new Promise((resolve) => setTimeout(resolve, delay * 1000)); // Initial delay
      capture();
    }
  };

  const handlePause = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsPaused(true);
      console.log('Capture paused.');
    }
  };

  const handleResume = () => {
    if (isPaused) {
      console.log('Resuming capture...');
      setIsPaused(false);

      const interval = 1000 / fps;
      intervalRef.current = setInterval(() => {
        captureCroppedImage();
      }, interval);
    }
  };

  const handleStop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsCapturing(false);
    setIsPaused(false);

    console.log('Capture stopped.');
  };

  const handleRestart = () => {
    handleStop();
    setCapturedImages([]);
    handleStart();
    console.log('Capture restarted.');
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleDeleteImage = (index: number) => {
    const newImages = capturedImages.filter((_, i) => i !== index);
    setCapturedImages(newImages);
  };

  const handleSaveSettings = () => {
    console.log('Settings saved:', { fps, holdToRecord, delay, duration });
    setIsSettingsOpen(false);
  };


  return (
    <>
      <div className="flex flex-col w-full pb-3">
        <div className="flex flex-row justify-between items-center w-full">
          <h6 className=" font-medium text-sm">Webcam</h6>
          <Button
            className='text-sm'
            variant="ghost" size="sm"
            onClick={() => setIsWebcamActive(false)}
          >
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
                Camera1
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {isCropping ? (
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => {
              console.log("Crop completed:", c);
              setCompletedCrop(c);
            }}
            aspect={aspect}

          >
            <img
              ref={imgRef}
              alt="Crop me"
              src={imgSrc}
              crossOrigin="anonymous"
              style={{ maxWidth: "100%" }}
              onLoad={(e) => {
                console.log("Image Loaded:", imgRef.current);
                onImageLoad(e);
              }}
            />
          </ReactCrop>

        ) : croppedImageSrc ? (
          <img
            ref={imgRef}
            src={croppedImageSrc}
            alt="Cropped Stream View"
            className="border border-gray-300"
            onError={() => console.error("Error loading cropped stream.")}
          />
        ) : (
          <img
            ref={imgRef}
            alt="Stream"
            src={imgSrc}
            crossOrigin="anonymous"
            style={{ maxWidth: '100%' }}
            onLoad={(e) => {
              console.log("Original Stream Loaded:", imgRef.current);
              onImageLoad(e);
            }}
          />
        )}

        <div className="flex flex-row justify-between items-center space-x-2 mt-2">
          {isCropping ? (
            <Button
              className="text-sm"
              variant="outline"
              size="sm"
              onClick={() => {
                handleDoneCropping();
                setIsCropping(false);
              }}
            >
              Done Cropping
            </Button>
          ) : (
            <div className="flex justify-start space-x-4 mb-4">
              <Button
                className="text-sm"
                variant="outline"
                size="sm"
                onClick={() => setIsCropping(true)}
              >
                <CropIcon className="mr-2" />
                Crop
              </Button>
              <Button
                className="text-sm"
                variant="outline"
                size="sm"
                onClick={() => setIsSettingsOpen(true)}
              >
                <SettingsIcon className="mr-2" />
                Settings
              </Button>
            </div>
          )}
        </div>

        <div className="flex justify-start space-x-2 mb-4">
          <Button
            className="text-sm"
            variant="outline"
            size="sm"
            onPointerDown={() => handleStart(true)}  // Start capturing on press
            onPointerUp={() => handleStart(false)}   // Stop capturing when released
            onPointerLeave={() => handleStart(false)} // Stop capturing if the mouse leaves the button
            disabled={isCapturing && isPaused}
          >
            {holdToRecord ? 'Hold to Record' : 'Start'}
          </Button>
          {isPaused ? (
            <Button
              className="text-sm"
              variant="ghost"
              size="icon"
              onClick={handleResume}
              disabled={!isPaused} // Disabled if not paused
            >
              <PlayIcon className="mr-2" />
            </Button>

          ) : (
            <Button
              className="text-sm"
              variant="ghost"
              size="icon"
              onClick={handlePause}
              disabled={!isCapturing || isPaused}
            >
              <PauseIcon className="mr-2" />
            </Button>
          )}


          <Button
            className="text-sm"
            variant="ghost"
            size="icon"
            onClick={handleStop}
            disabled={!isCapturing}
          >
            <StopCircleIcon className="mr-2" />
          </Button>
          <Button
            className="text-sm"
            variant="ghost"
            size="icon"
            onClick={handleRestart}
            // disable if there're no captured images and not capturing
            disabled={capturedImages.length === 0}
          >
            <RefreshCcw className="mr-2" />
          </Button>
        </div>

        {isSettingsOpen && (
          <Drawer
            open={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
          >
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle className="text-center">Settings</DrawerTitle>
                <DrawerDescription className="text-center flex flex-col items-center ">
                  Capture settings

                </DrawerDescription>
              </DrawerHeader>
              <div className="p-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">FPS:</label>
                  <input
                    type="number"
                    min="1"
                    value={fps}
                    onChange={(e) => setFps(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4 flex items-center">
                  <label className="text-sm font-medium mr-2">Hold to Record:</label>
                  <Switch
                    checked={holdToRecord}
                    onCheckedChange={(checked) => setHoldToRecord(checked)}
                  />
                  <span className="ml-2 text-sm">{holdToRecord ? 'ON' : 'OFF'}</span>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Delay{`(s)`}:</label>
                  <input
                    type="number"
                    min="0"
                    value={delay}
                    onChange={(e) => setDelay(Number(e.target.value))}
                    disabled={holdToRecord}
                    className={`w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${holdToRecord ? 'bg-gray-200 cursor-not-allowed' : ''
                      }`}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Duration{`(s)`}:</label>
                  <input
                    type="number"
                    min="0"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    disabled={holdToRecord}
                    className={`w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${holdToRecord ? 'bg-gray-200 cursor-not-allowed' : ''
                      }`}
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <Button variant="ghost" onClick={() => setIsSettingsOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveSettings}>Save Settings</Button>
                </div>
              </div>
              <DrawerFooter className="flex flex-col gap-4 bg-background border-t-[1px] border-t-muted">
                <DrawerClose>
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => setIsSettingsOpen(false)}
                  >
                    Close
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>

        )}
      </div>

      <canvas ref={previewCanvasRef} style={{ display: 'none' }} />

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
    </>
  )
}

export default CollectDataUsingWebcam