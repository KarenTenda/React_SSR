"use client";
import { Button } from '@/components/ui/button';
import Urls from '@/lib/Urls';
import { CropIcon, Loader2 } from 'lucide-react';
import React, { useState, useRef, useEffect, DependencyList } from 'react'

import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
  convertToPixelCrop,
} from 'react-image-crop'

import 'react-image-crop/dist/ReactCrop.css'
import { DeleteIcon } from '../models/classifier/components';

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
  const [imgSrc, setImgSrc] = useState(`${Urls.fetchPhantomCamera}/tray_4_camera/stream`)
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [scale, setScale] = useState(1)
  const [rotate, setRotate] = useState(0)
  // const [aspect, setAspect] = useState<number | undefined>(16 / 9)
  const aspect = 1;
  const [isCropping, setIsCropping] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);

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
      console.log('completedCrop', completedCrop)
      console.log("imgRef.current", imgRef.current)
      console.log("previewCanvasRef.current", previewCanvasRef.current)
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
  
      // Adjust the canvas size directly based on the scaled crop size
      previewCanvasRef.current.width = completedCrop.width * scaleX;
      previewCanvasRef.current.height = completedCrop.height * scaleY;
  
      const ctx = previewCanvasRef.current.getContext('2d');
  
      if (ctx) {
        ctx.clearRect(0, 0, previewCanvasRef.current.width, previewCanvasRef.current.height);
  
        // Draw the image based on the computed crop coordinates and scaling
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

  function handleToggleCroppingClick() {
    setIsCropping((prev) => !prev)
  }

  function startContinuousCapture() {
    setIsCapturing(true);
    intervalRef.current = setInterval(() => {
      captureCroppedImage();
    }, 200); // Capture every second
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

  const handleDeleteImage = (index: number) => {
    const newImages = capturedImages.filter((_, i) => i !== index);
    setCapturedImages(newImages);
  };

  return (
    <div className="w-[300px] h-auto">
      {/* <div className="Crop-Controls">
        <div>
          <label htmlFor="scale-input">Scale: </label>
          <input
            id="scale-input"
            type="number"
            step="0.1"
            value={scale}
            disabled={!imgSrc}
            onChange={(e) => setScale(Number(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="rotate-input">Rotate: </label>
          <input
            id="rotate-input"
            type="number"
            value={rotate}
            disabled={!imgSrc}
            onChange={(e) =>
              setRotate(Math.min(180, Math.max(-180, Number(e.target.value))))
            }
          />
        </div>
        <div>
          <button onClick={handleToggleAspectClick}>
            Toggle aspect {aspect ? 'off' : 'on'}
          </button>
        </div>
        <div>
          <Button onClick={handleToggleCroppingClick}>
            {isCropping ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cropping...
              </>
            ) : (
              'Crop Image?'
            )}
          </Button>
        </div>
        <div>
          <Button onClick={isCapturing ? stopContinuousCapture : startContinuousCapture}>
            {isCapturing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Stop Capturing
              </>
            ) : (
              'Start Continuous Capture'
            )}
          </Button>
        </div>
      </div> */}

      <div className="flex flex-row">
        <div className="flex flex-col w-full pb-3">
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
                style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                onLoad={onImageLoad}
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
             <div className="relative ">
            <img
              ref={imgRef}
              alt="View"
              src={imgSrc}
              onLoad={onImageLoad}
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

          <div className="flex flex-row justify-between items-center space-x-2 ">
            <Button
              className='text-sm'
              variant="outline"
              size="sm"
              onClick={isCapturing ? stopContinuousCapture : startContinuousCapture}
            >
              {isCapturing ? "Stop " : "Start "}
            </Button>

            {/* <ClickableIconButton
              Icon={SettingsIcon}
              onClick={() => setIsWebcamSettingsActive(true)}
              tooltipText='Edit'

            /> */}
          </div>
           </>
          )}
        </div>

        <div className="border-l border-gray-300 mx-1"></div>

        <div className="flex flex-col w-full pb-3">
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
