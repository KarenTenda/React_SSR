"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import ReactCrop, { Crop, centerCrop, makeAspectCrop, PixelCrop, convertToPixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Urls from "@/lib/Urls";
import { RegionStructure, GeometryType, Shape } from "@/app/operations/regions/structures/RegionStructure";
import { CameraSourceType, CameraStructure } from "@/app/cameras/structure/CameraStructure";
import { Textarea } from "@/components/ui/textarea";

const camera: CameraStructure = {
    id: "Camera1",
    type: "opencv",
    source_type: CameraSourceType.INDEX,
    source: "0",
    name: "Camera1",
    enabled: true,
    resolution: [1280, 720], 
    horizontal_flip: false,
    vertical_flip: false,
    centre_crop: false,
    rotation_angle: 0,
    backend: 0,
    manual_focus_value: null,
    exposure_mode: 1,
    exposure_time: -1,
    white_balance_mode: 3,
    white_balance_temperature: null,
    power_line_frequency: null,
    encoding: "MJPG",
    zoom: null,
    rotation_mode: null,
    calibration_id: null,
    scheduled_tasks: [],
    streams: []
};

function UpdateRegion({ regions, regionId, savedRegionIDs }: { regions: RegionStructure[]; regionId: string; savedRegionIDs: string[] }) {
    const [selectedRegion, setSelectedRegion] = useState(regionId);
    const [regionSettings, setRegionSettings] = useState<Shape | null>(null);
    const [crop, setCrop] = useState<Crop | null>(null);
    const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [containerSize, setContainerSize] = useState({ width: 400, height: 300 });

    useEffect(() => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setContainerSize({ width: rect.width, height: rect.height });
        }
    }, []);

    useEffect(() => {
        if (regions?.length > 0) {
            const region = regions.find((region) => region.id === selectedRegion);
            if (region) {
                setRegionSettings(region.shape);

                // Convert region settings into a crop object
                setCrop({
                    unit: "px",
                    x: region.shape.shape.center.x,
                    y: region.shape.shape.center.y,
                    width: region.shape.shape.geometry_type === GeometryType.SQUARE ? region.shape.shape.side : region.shape.shape.width,
                    height: region.shape.shape.geometry_type === GeometryType.SQUARE ? region.shape.shape.side : region.shape.shape.height,
                });
            }
        }
    }, [selectedRegion, regions]);

    const onCropChange = (newCrop: Crop) => {
        setCrop(newCrop);
    };

    const onCropComplete = (pixelCrop: PixelCrop) => {
        setRegionSettings((prev) => ({
            ...prev,
            shape: {
                ...prev?.shape,
                center: { x: pixelCrop.x, y: pixelCrop.y },
                ...(prev?.shape.geometry_type === GeometryType.SQUARE ? { side: pixelCrop.width } : { width: pixelCrop.width, height: pixelCrop.height }),
            },
        }));
    };

    return (
        <>
            {/* Stream Section */}
            <div ref={containerRef} className="relative flex-grow w-[400px] h-[300px] border rounded-lg overflow-hidden">
                <ReactCrop
                    crop={crop || {}}
                    onChange={onCropChange}
                    onComplete={onCropComplete}
                    aspect={1} // Adjust for freeform cropping
                    keepSelection
                >
                    <img
                        ref={setImageRef}
                        src={`${Urls.fetchPhantomCameras}/${camera.id}/stream`}
                        alt="Camera Stream"
                        className="w-full h-full object-cover"
                    />
                </ReactCrop>
            </div>

            <div className="flex flex-col gap-3 w-[280px]">
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a region" />
                    </SelectTrigger>
                    <SelectContent>
                        {savedRegionIDs.map((region) => (
                            <SelectItem key={region} value={region}>
                                {region}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Input type="text" value={camera.id} readOnly className="w-full" />

                <Textarea
                    className="w-full p-2 border border-gray-300 rounded resize-none"
                    value={regionSettings ? JSON.stringify(regionSettings, null, 2) : "No region settings found"}
                    rows={11}
                    readOnly
                />
            </div>
        </>
    );
}

export default UpdateRegion;




// ------------------------when using react-konva-----------------------------
// import React, { useState, useEffect, useRef } from "react";
// import { Stage, Layer, Rect, Image as KonvaImage } from "react-konva";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import Urls from "@/lib/Urls";
// import useImage from "use-image";
// import { RegionStructure, GeometryType, Shape } from "@/app/phantoms/regions/structures/RegionStructure";
// import { CameraSourceType, CameraStructure } from "@/app/cameras/structure/CameraStructure";

// const camera: CameraStructure = {
//     id: "Camera1",
//     type: "opencv",
//     source_type: CameraSourceType.INDEX,
//     source: "0",
//     name: "Camera1",
//     enabled: true,
//     resolution: [1280, 720], // Camera's intrinsic resolution
//     horizontal_flip: false,
//     vertical_flip: false,
//     centre_crop: false,
//     rotation_angle: 0,
//     backend: 0,
//     manual_focus_value: null,
//     exposure_mode: 1,
//     exposure_time: -1,
//     white_balance_mode: 3,
//     white_balance_temperature: null,
//     power_line_frequency: null,
//     encoding: "MJPG",
//     zoom: null,
//     rotation_mode: null,
//     calibration_id: null,
//     scheduled_tasks: [],
//     streams: []
// };

// function UpdateRegion({ regions, regionId, savedRegionIDs }: { regions: RegionStructure[]; regionId: string; savedRegionIDs: string[] }) {
//     const [selectedRegion, setSelectedRegion] = useState(regionId);
//     const [regionSettings, setRegionSettings] = useState<Shape | null>(null);
//     const [image, status] = useImage(`${Urls.fetchPhantomCameras}/${camera.id}/stream`);
//     const [containerSize, setContainerSize] = useState({ width: 800, height: 450 });

//     const containerRef = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         if (containerRef.current) {
//             const rect = containerRef.current.getBoundingClientRect();
//             setContainerSize({ width: rect.width, height: rect.height });
//         }
//     }, []);

//     useEffect(() => {
//         if (regions?.length > 0) {
//             const region = regions.find((region) => region.id === selectedRegion);
//             if (region) {
//                 setRegionSettings(region.shape);
//             }
//         }
//     }, [selectedRegion, regions]);

//     const scaleX = containerSize.width / camera.resolution[0];
//     const scaleY = containerSize.height / camera.resolution[1];

//     return (
//         <div className="flex flex-row gap-4">
//             <div ref={containerRef} className="relative border w-[600px] h-[400px]">
//                 <Stage width={containerSize.width} height={containerSize.height}>
//                     <Layer>
//                         {status === "loaded" && <KonvaImage image={image} width={containerSize.width} height={containerSize.height} />}

//                         {regionSettings && (
//                             <Rect
//                                 x={regionSettings.shape.center.x * scaleX}
//                                 y={regionSettings.shape.center.y * scaleY}
//                                 width={(regionSettings.shape.geometry_type === GeometryType.SQUARE ? regionSettings.shape.side : regionSettings.shape.width) * scaleX}
//                                 height={(regionSettings.shape.geometry_type === GeometryType.SQUARE ? regionSettings.shape.side : regionSettings.shape.height) * scaleY}
//                                 fill="rgba(0, 0, 255, 0.3)"
//                                 stroke="blue"
//                                 strokeWidth={2}
//                                 draggable
//                                 onDragMove={(e) => {
//                                     setRegionSettings((prev) => ({
//                                         ...prev,
//                                         shape: {
//                                             ...prev.shape,
//                                             center: {
//                                                 ...prev.shape.center,
//                                                 x: e.target.x() / scaleX,
//                                                 y: e.target.y() / scaleY,
//                                             },
//                                         },
//                                     }));
//                                 }}
//                                 onTransformEnd={(e) => {
//                                     const node = e.target;
//                                     setRegionSettings((prev) => ({
//                                         ...prev,
//                                         shape: {
//                                             ...prev.shape,
//                                             width: node.width() / scaleX,
//                                             height: node.height() / scaleY,
//                                         },
//                                     }));
//                                 }}
//                             />
//                         )}
//                     </Layer>
//                 </Stage>
//             </div>

//             <div className="flex flex-col gap-3 w-72">
//                 <Select value={selectedRegion} onValueChange={setSelectedRegion}>
//                     <SelectTrigger className="w-full">
//                         <SelectValue placeholder="Select a region" />
//                     </SelectTrigger>
//                     <SelectContent>
//                         {savedRegionIDs.map((region) => (
//                             <SelectItem key={region} value={region}>
//                                 {region}
//                             </SelectItem>
//                         ))}
//                     </SelectContent>
//                 </Select>

//                 <Input type="text" value={camera.id} readOnly className="w-full" />

//                 <textarea
//                     className="w-full h-32 p-2 border border-gray-300 rounded"
//                     value={regionSettings ? JSON.stringify(regionSettings, null, 2) : "No region settings found"}
//                     rows={11}
//                     readOnly
//                 />
//             </div>
//         </div>
//     );
// }

// export default UpdateRegion;
