"use client";
import { Button } from '@/components/ui/button';
import Urls from '@/lib/Urls';
import { CropIcon, Loader2, PauseIcon, PencilIcon, PlayIcon, RefreshCcw, SettingsIcon, StopCircleIcon } from 'lucide-react';
import React, { useState, useRef, useEffect, DependencyList } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import 'react-image-crop/dist/ReactCrop.css'
import { axios, DeleteIcon, DotsVerticalIcon, uuidv4 } from '../models/actions/trainModel/classifier/components';
import { Switch } from '@/components/ui/switch';
import { RegionService } from './services/RegionService';
import useRegionService from './hooks/useRegions';
import { RegionStructure, Resolution } from './structures/RegionStructure';
import Navbar from '@/components/navbar/Navbar';
import useNavbarComponents from '@/components/navbar/useNavbarComponents';

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

export default function RegionsPage() {
  const [imgSrc, setImgSrc] = useState(`${Urls.fetchPhantomCamera}/Camera1/stream`)
  const [regions, existingRegionIDs] = useRegionService()
  const [regionIDs, setRegionIDs] = useState<string[]>(existingRegionIDs)

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
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [fps, setFps] = useState(30);
  const [holdToRecord, setHoldToRecord] = useState(true);
  const [delay, setDelay] = useState(1);
  const [duration, setDuration] = useState(6);

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
      // when the update region is fixed on backend make sure to replace this id == region?.id
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

    console.log('Updated Region:', updatedRegion);
    // setRegion(updatedRegion);

    //  // Create cropped image locally
    //  const canvas = document.createElement("canvas");
    //  const ctx = canvas.getContext("2d");

    //  if (ctx) {
    //      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    //      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

    //      canvas.width = width * scaleX;
    //      canvas.height = height * scaleY;

    //      ctx.drawImage(
    //          imgRef.current,
    //          x * scaleX,
    //          y * scaleY,
    //          width * scaleX,
    //          height * scaleY,
    //          0,
    //          0,
    //          canvas.width,
    //          canvas.height
    //      );

    //      const croppedUrl = canvas.toDataURL("image/jpeg");
    //      setCroppedImageSrc(croppedUrl); // Set the local cropped image
    // }

    try {
      await updateRegion(updatedRegion);

      setRegion(updatedRegion);
      await setCroppedImageSrc(`${Urls.fetchPhantomCamera}/Camera1/region/${updatedRegion.id}/stream`);
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
    console.log("Region:", JSON.stringify(region, null, 2));
    console.log("Image Ref:", imgRef.current);
    console.log("Completed Crop:", completedCrop);

    if (!completedCrop || (!croppedImageSrc && !imgRef.current)) {
      console.warn("No crop completed, cropped stream, or image reference missing.");
      return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (croppedImageSrc) {
      // Use the cropped image source
      const tempImage = new Image();
      tempImage.crossOrigin = "anonymous";
      tempImage.onload = () => {
        canvas.width = tempImage.width;
        canvas.height = tempImage.height;
        ctx?.drawImage(tempImage, 0, 0, canvas.width, canvas.height);
        const imageUrl = canvas.toDataURL("image/jpeg");
        setCapturedImages((prevImages) => [...prevImages, imageUrl]);
        // console.log("Captured Cropped Image URL:", imageUrl);
      };
      tempImage.src = croppedImageSrc;
    } else if (imgRef.current) {
      // Fallback: Use the original stream (if croppedImageSrc is missing)
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

  const {
    filteredAndSortedItems: filteredRegions,
    handleSearch,
    handleSortChange,
    toggleSortOrder,
    sortKey,
    sortOrder,
  } = useNavbarComponents({
    items: regions,
    searchKeys: ["id", "type"],
    initialSortKey: "id",
    sortOptions: [
      { key: "id", label: "ID" },
      { key: "type", label: "Type" },
    ],
  });

  return (
    <div className='flex-1 inline-flex flex-col max-h-full px-1 pt-3 md:pt-3 h-full gap-4 w-full overflow-y-auto'>
      <Navbar
        pageName="Regions"
        searchPlaceholder="Search regions..."
        sortOption={sortKey}
        sortOptions={[
          { key: "id", label: "ID" },
          { key: "type", label: "Type" },
        ]}
        onSearch={handleSearch}
        onSortChange={handleSortChange}
        sortOrder={sortOrder}
        onSortOrderChange={toggleSortOrder}
        addButtonText='Add Region'
      />
      <Card className="w-full max-w-[450px] h-auto">
        <CardHeader className="flex flex-row justify-between items-center px-3 py-2">
          <div className="flex items-center space-x-2">
            <CardTitle className="flex flex-row text-sm">
              Test Cropping
              <PencilIcon
                className="w-4 h-4 ml-2 cursor-pointer text-gray-400"
              />
            </CardTitle>
          </div>
          <Button variant="ghost" size="sm" className="text-sm p-1">
            <DotsVerticalIcon className="w-5 h-5 text-gray-400" />
          </Button>
        </CardHeader>

        <div className="border-t border-gray-300" />

        <CardContent className="px-3 py-0">

          <div className='flex flex-row'>
            <div className="flex flex-col w-full pb-3">
              <div className="flex flex-row justify-between items-center w-full">
                <h6 className=" font-medium text-sm">Webcam</h6>
                <Button className='text-sm' variant="ghost" size="sm"
                  // onClick={() => setIsWebcamActive(false)}
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
                  {/* {cameras.map((camera) => ( */}
                  <DropdownMenuCheckboxItem
                  // key={camera.id}
                  // checked={selectedCameraId === camera.id}
                  // onCheckedChange={() => handleCameraSelect(camera.id)}
                  >
                    {/* {camera.name} */}
                    Camera1
                  </DropdownMenuCheckboxItem>
                  {/* ))} */}
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
              <div className="grid grid-cols-4 gap-1 mt-2 max-h-[400px] overflow-y-auto">
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

          </div>
        </CardContent>
      </Card>

    </div>
  )
}
