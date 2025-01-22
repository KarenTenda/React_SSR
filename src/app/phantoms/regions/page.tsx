"use client";
import { Button } from '@/components/ui/button';
import Urls from '@/lib/Urls';
import { CropIcon, Loader2, PauseIcon, PlayIcon, RefreshCcw, SettingsIcon, StopCircleIcon } from 'lucide-react';
import React, { useState, useRef, useEffect, DependencyList } from 'react'

import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
  convertToPixelCrop,
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
import 'react-image-crop/dist/ReactCrop.css'
import { axios, DeleteIcon, uuidv4 } from '../models/classifier/components';
import { Switch } from '@/components/ui/switch';
import { RegionService } from './services/RegionService';
import useRegionService from './hooks/useRegions';
import { RegionStructure, Resolution } from './structures/RegionStructure';

export function useDebounceEffect(
  fn: () => void,
  waitTime: number,
  deps?: DependencyList,
) {
  useEffect(() => {
    const t = setTimeout(() => {
      fn()
      // fn.apply(undefined, deps)
    }, waitTime)

    return () => {
      clearTimeout(t)
    }
  }, deps)
}

const TO_RADIANS = Math.PI / 180

export async function canvasPreview(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  crop: PixelCrop,
  scale = 1,
  rotate = 0,
) {
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('No 2d context')
  }

  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height
  const pixelRatio = window.devicePixelRatio

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio)
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio)

  ctx.scale(pixelRatio, pixelRatio)
  ctx.imageSmoothingQuality = 'high'

  const cropX = crop.x * scaleX
  const cropY = crop.y * scaleY

  const rotateRads = rotate * TO_RADIANS
  const centerX = image.naturalWidth / 2
  const centerY = image.naturalHeight / 2

  ctx.save()

  ctx.translate(-cropX, -cropY)
  ctx.translate(centerX, centerY)
  ctx.rotate(rotateRads)
  ctx.scale(scale, scale)
  ctx.translate(-centerX, -centerY)
  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
  )

  ctx.restore()
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

export default function ModelPage() {
  const [imgSrc, setImgSrc] = useState(`${Urls.fetchPhantomCamera}/Camera1/stream`)
  const [regions, regionIDs] = useRegionService()

  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  const [crop, setCrop] = useState<Crop>()
  const [region, setRegion] = useState<RegionStructure | null>(null)
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [croppedImageSrc, setCroppedImageSrc] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [scale, setScale] = useState(1)
  const [rotate, setRotate] = useState(0)
  const aspect = 1;

  const [isCapturing, setIsCapturing] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [fps, setFps] = useState(20);
  const [holdToRecord, setHoldToRecord] = useState(true);
  const [delay, setDelay] = useState(2);
  const [duration, setDuration] = useState(6);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget
      setCrop(centerAspectCrop(width, height, aspect))
    }
  }

  // useDebounceEffect(
  //   async () => {
  //     if (
  //       completedCrop?.width &&
  //       completedCrop?.height &&
  //       imgRef.current &&
  //       previewCanvasRef.current
  //     ) {
  //       canvasPreview(
  //         imgRef.current,
  //         previewCanvasRef.current,
  //         completedCrop,
  //         scale,
  //         rotate,
  //       )
  //     }
  //   },
  //   100,
  //   [completedCrop, scale, rotate],
  // )

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

  function handleToggleCroppingClick() {
    setIsCropping((prev) => !prev)
  }

  function startContinuousCapture() {
    setIsCapturing(true);
    intervalRef.current = setInterval(() => {
      captureCroppedImage();
    }, 1000); // Capture every second
  }

  function stopContinuousCapture() {
    setIsCapturing(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  function captureCroppedImage() {
    if (!completedCrop || !imgRef.current) {
      return;
    }

    const canvas = document.createElement('canvas');
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      imgRef.current.crossOrigin = "anonymous";
      ctx.drawImage(
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

      // Convert canvas to image URL
      const imageUrl = canvas.toDataURL('image/jpeg');

      // Add the captured image to the state
      setCapturedImages((prevImages) => [...prevImages, imageUrl]);
    }
  }

  // const handleDoneCropping = () => {
  //   if (!completedCrop || !imgRef.current) {
  //     console.log('No crop completed or image reference missing.');
  //     return;
  //   }

  //   const { x, y, width, height } = completedCrop;

  //   // Camera settings
  //   const cameraSettings = {
  //     resolution: [1280, 720],
  //     centre_crop: true, // Replace with the actual camera setting
  //   };

  //   const [refWidth, refHeight] = cameraSettings.resolution;

  //   let cropStartX = 0;
  //   let cropStartY = 0;
  //   let croppedWidth = refWidth;
  //   let croppedHeight = refHeight;

  //   // Adjust for centre_crop
  //   if (cameraSettings.centre_crop) {
  //     const cropAspectRatio = refWidth / refHeight;
  //     if (cropAspectRatio > 1) {
  //       // Landscape: cropped height stays the same
  //       croppedWidth = croppedHeight * cropAspectRatio;
  //       cropStartX = (refWidth - croppedWidth) / 2;
  //     } else {
  //       // Portrait: cropped width stays the same
  //       croppedHeight = croppedWidth / cropAspectRatio;
  //       cropStartY = (refHeight - croppedHeight) / 2;
  //     }
  //   }

  //   // Normalize dimensions to the reference resolution
  //   const normalizedX = Math.round(((x + cropStartX) / imgRef.current.width) * refWidth);
  //   const normalizedY = Math.round(((y + cropStartY) / imgRef.current.height) * refHeight);
  //   const normalizedSide = Math.round(
  //     (Math.min(width, height) / imgRef.current.width) * croppedWidth
  //   );

  //   const referenceResolution: Resolution = [refWidth, refHeight];

  //   const updatedRegion = {
  //     id: region?.id || uuidv4(),
  //     type: 'imashape',
  //     enabled: true,
  //     reference_resolution: referenceResolution,
  //     shape: {
  //       shape: {
  //         geometry_type: 3, // Square
  //         center: {
  //           geometry_type: 8, // Center point
  //           x: normalizedX + Math.round(normalizedSide / 2), // Center X
  //           y: normalizedY + Math.round(normalizedSide / 2), // Center Y
  //         },
  //         side: normalizedSide,
  //       },
  //     },
  //   };

  //   console.log('Updated Region:', updatedRegion);
  //   setRegion(updatedRegion);
  //   updateRegion(updatedRegion); 
  //   setCroppedImageSrc(`${Urls.fetchPhantomCamera}/Camera1/region/${updatedRegion.id}/stream`);
  // };

  const handleDoneCropping = async () => {
    if (!completedCrop || !imgRef.current) {
        console.log('No crop completed or image reference missing.');
        return;
    }

    const { x, y, width, height } = completedCrop;

    const cameraSettings = {
        resolution: [1280, 720],
        centre_crop: false,
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

    const normalizedX = Math.round(((x + cropStartX) / imgRef.current.width) * refWidth);
    const normalizedY = Math.round(((y + cropStartY) / imgRef.current.height) * refHeight);
    const normalizedSide = Math.round(
        (Math.min(width, height) / imgRef.current.width) * croppedWidth
    );

    const referenceResolution: Resolution = [refWidth, refHeight];

    const updatedRegion = {
        id: region?.id || uuidv4(),
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

    console.log('Updated Region:', updatedRegion);
    setRegion(updatedRegion);

    // Update the backend and fetch the stream URL
    await updateRegion(updatedRegion);

    // Update croppedImageSrc to the backend stream
    setCroppedImageSrc(`${Urls.fetchPhantomCamera}/Camera1/region/${updatedRegion.id}/stream`);
};

  const updateRegion = async (regionToUpdate: RegionStructure) => {
    try {
      if (!regionToUpdate?.id) {
        console.error("Region ID is undefined. Cannot update region.");
        return;
      }

      if (!regionIDs.includes(regionToUpdate.id)) {
        await axios.post(`${Urls.fetchRegions}`, { region: regionToUpdate });
      } else {
        await axios.put(`${Urls.fetchRegions}/${regionToUpdate.id}`, {
          id: regionToUpdate.id,
          region: regionToUpdate,
        });
      }
    } catch (error) {
      console.error("Error updating region:", error);
    }
  };

  const handleStart = (isHolding = false) => {
    if (holdToRecord) {
      // "Hold to Record" is ON
      if (isHolding) {
        console.log('Hold to Record: Capturing started while holding the button.');
        const interval = 1000 / fps; // Calculate interval based on FPS

        intervalRef.current = setInterval(() => {
          // Simulate capturing an image
          const fakeImage = `Captured Image at ${new Date().toISOString()}`;
          setCapturedImages((prev) => [...prev, fakeImage]);

          console.log(`Captured Image: ${fakeImage}`);
        }, interval);
      } else {
        // Stop capturing when button is released
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          console.log('Hold to Record: Capturing stopped after releasing the button.');
        }
      }
    } else {
      // "Hold to Record" is OFF
      if (isCapturing) {
        console.log('Already capturing, ignoring start request.');
        return; // Avoid starting multiple intervals
      }

      console.log('Starting capture with settings:', { fps, delay, duration });
      setIsCapturing(true); // Set capturing to true
      setCapturedImages([]); // Clear captured images

      const interval = 1000 / fps; // Calculate interval based on FPS
      let timeElapsed = 0;

      intervalRef.current = setInterval(() => {
        if (timeElapsed >= duration * 1000) {
          handleStop(); // Automatically stop after duration
          return;
        }

        // Simulate capturing an image
        const fakeImage = `Captured Image at ${new Date().toISOString()}`;
        setCapturedImages((prev) => [...prev, fakeImage]);

        console.log(`Captured Image: ${fakeImage}`);
        timeElapsed += interval;
      }, interval);
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

      const interval = 1000 / fps; // Calculate interval based on FPS
      intervalRef.current = setInterval(() => {
        // Resume capturing images
        const fakeImage = `Captured Image at ${new Date().toISOString()}`;
        setCapturedImages((prev) => [...prev, fakeImage]);

        console.log(`Captured Image: ${fakeImage}`);
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
    // Clean up interval on component unmount
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
    <div className="w-[300px] h-auto">
      <div className="flex flex-row">

        <div className="flex flex-col w-full pb-3">
          {isCropping ? (
            // Display cropping tool
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
                crossOrigin="anonymous"
                style={{ maxWidth: '100%' }}
                onLoad={onImageLoad}
              />
            </ReactCrop>
          ) : croppedImageSrc ? (
            // Display cropped image
            <img
            src={croppedImageSrc}
            alt="Cropped Stream View"
            onError={() => console.error('Error loading the stream.')}
            className="border border-gray-300"
            />
          ) : (
            // Display original stream
            <img
              ref={imgRef}
              alt="Stream"
              src={imgSrc}
              crossOrigin="anonymous"
              style={{ maxWidth: '100%' }}
              onLoad={onImageLoad}
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

          <div className="flex justify-start space-x-4 mb-4">
            <Button
              className="text-sm"
              variant="outline"
              size="sm"
              onMouseDown={() => handleStart(true)} // Start capturing when the button is pressed
              onMouseUp={() => handleStart(false)} // Stop capturing when the button is released
              onMouseLeave={() => handleStart(false)} // Stop capturing if the mouse leaves the button
              disabled={isCapturing && isPaused}
            >
              {holdToRecord ? 'Hold to Record' : 'Start'}
            </Button>
            {isPaused ? (
              <Button
                className="text-sm"
                variant="outline"
                size="sm"
                onClick={handleResume}
                disabled={!isPaused} // Disabled if not paused
              >
                <PlayIcon className="mr-2" />
              </Button>

            ) : (
              <Button
                className="text-sm"
                variant="outline"
                size="sm"
                onClick={handlePause}
                disabled={!isCapturing || isPaused}
              >
                <PauseIcon className="mr-2" />
              </Button>
            )}


            <Button
              className="text-sm"
              variant="outline"
              size="sm"
              onClick={handleStop}
              disabled={!isCapturing}
            >
              <StopCircleIcon className="mr-2" />
            </Button>
            <Button
              className="text-sm"
              variant="outline"
              size="sm"
              onClick={handleRestart}
              disabled={!isCapturing}
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
                    <label className="block text-sm font-medium mb-1">Delay:</label>
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
                    <label className="block text-sm font-medium mb-1">Duration:</label>
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

        {/* Hidden canvas for processing the cropped image */}
        <canvas ref={previewCanvasRef} style={{ display: 'none' }} />

        <div className="border-l border-gray-300 mx-1"></div>

        <div className="flex flex-col w-full pb-3">
          {/* {!!completedCrop && (
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
          )} */}

          <div className="ml-4">
            <h3>Captured Images:</h3>
            <div className="grid grid-cols-4 gap-1 mt-2 max-h-[200px] overflow-y-auto">
              {capturedImages.map((image, index) => (
                <div key={index} className="relative ">
                  <img
                    key={index}
                    src={image}
                    alt={`Captured ${index}`}
                    className="border border-gray-300"
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
        </div>

      </div>

    </div>
  )
}
