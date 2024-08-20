"use client";
import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import Urls from "@/constants/Urls";

const CROP_AREA_ASPECT = 3 / 2;

function getCroppedImage(crop, image, croppedAreaPixels) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = croppedAreaPixels.width;
  canvas.height = croppedAreaPixels.height;

  const imageElement = new Image();
  imageElement.src = image;

  return new Promise((resolve) => {
    imageElement.setAttribute('crossorigin', 'anonymous');
    imageElement.onload = () => {
      ctx?.drawImage(
        imageElement,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );
      resolve(canvas.toDataURL("image/jpeg"));
    };
  });
}

export default function App() {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropImage = useCallback(async () => {
    const croppedImg = await getCroppedImage(
      crop,
      `${Urls.fetchPhantomCamera}/Camera1/stream`,
      croppedAreaPixels
    );
    setCroppedImage(croppedImg);
  }, [crop, croppedAreaPixels]);

  return (
    <div className="App">
      <div className="cropper" style={{ position: "relative", width: "100%", height: "400px" }}>
        <Cropper
          image={`${Urls.fetchPhantomCamera}/Camera1/stream`}
          aspect={CROP_AREA_ASPECT}
          crop={crop}
          zoom={zoom}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>
      <div className="viewer">
        <button onClick={handleCropImage}>Done Cropping</button>
        {croppedImage && (
          <div>
            <h3>Cropped Image:</h3>
            <img src={croppedImage} alt="Cropped Area" crossOrigin="anonymous"/>
          </div>
        )}
      </div>
    </div>
  );
}
