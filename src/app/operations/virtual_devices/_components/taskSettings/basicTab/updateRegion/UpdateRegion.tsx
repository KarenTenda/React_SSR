"use client";

import React, { useState, useEffect } from "react";
import ReactCrop, { Crop } from "react-image-crop";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import "react-image-crop/dist/ReactCrop.css";
import { RegionStructure, GeometryType } from "@/app/operations/regions/structures/RegionStructure";
import Urls from "@/lib/Urls";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const cameraResolution = { width: 1280, height: 720 }; // Backend resolution
const containerSize = { width: 640, height: 360 }; // UI container size

function UpdateRegion({ savedRegions, regionId, savedRegionIDs }: { savedRegions: RegionStructure[]; regionId: string, savedRegionIDs: string[] }) {
    const [regions, setRegions] = useState<RegionStructure[]>(savedRegions);
    const [regionIDs, setRegionIDs] = useState<string[]>(savedRegionIDs);
    const [selectedRegion, setSelectedRegion] = useState(regionId);
    const [crop, setCrop] = useState<Crop | null>(null);
    const imageSrc = `${Urls.fetchPhantomCameras}/Camera1/stream`;
    const [shape, setShape] = useState<any>(null);
    const [updatedSettings, setUpdatedSettings] = useState<any>(null);

    // **1️⃣ Fetch the latest regions every 5 seconds (Real-time Updates)**
    useEffect(() => {
        const fetchRegions = async () => {
            try {
                const response = await axios.get(`${Urls.fetchRegions}/`);
                const newRegions = response.data?.regions || response.data; // Ensure we get the correct field
                console.log("Fetched Regions:", newRegions);

                // Ensure it's an array before updating
                if (Array.isArray(newRegions) && JSON.stringify(newRegions) !== JSON.stringify(regions)) {
                    setRegions(newRegions);
                    setRegionIDs(newRegions.map((r: RegionStructure) => r.id));
                }
            } catch (error) {
                console.error("Error fetching regions:", error);
            }
        };

        // Poll every 10 seconds
        const interval = setInterval(fetchRegions, 10000);
        return () => clearInterval(interval);
    }, [regions]);

    // **2️⃣ Get the selected region from the backend**
    useEffect(() => {
        if (!regions.length) return;
        const region = regions.find((r) => r.id === selectedRegion);
        if (region && region.shape && region.shape.shape.center) {
            setShape(region.shape.shape);
        } else {
            console.warn("Region not found or shape missing:", region);
            setShape(null);
        }
    }, [selectedRegion, regions]);

    // **3️⃣ Properly scale and position the region**
    useEffect(() => {
        if (!shape || !shape.center) return;

        const isSquare = shape.geometry_type === GeometryType.SQUARE;
        const width = isSquare ? shape.side ?? 100 : shape.width ?? 100;
        const height = isSquare ? shape.side ?? 100 : shape.height ?? 100;

        // **Scaling Factors**
        const scaleX = containerSize.width / cameraResolution.width;
        const scaleY = containerSize.height / cameraResolution.height;

        // **Convert from center-based to top-left positioning**
        const adjustedX = shape.center.x * scaleX - (width * scaleX) / 2;
        const adjustedY = shape.center.y * scaleY - (height * scaleY) / 2;

        if (!isNaN(adjustedX) && !isNaN(adjustedY) && !isNaN(width) && !isNaN(height)) {
            setCrop({
                unit: "px",
                x: adjustedX,
                y: adjustedY,
                width: width * scaleX,
                height: height * scaleY,
            });

            setUpdatedSettings({
                x: shape.center.x,
                y: shape.center.y,
                width,
                height,
            });
        } else {
            console.error("Invalid region values:", { adjustedX, adjustedY, width, height });
        }

        // console.log("Backend Region (Original):", shape);
        // console.log("UI Region (Scaled & Adjusted):", {
        //     x: adjustedX,
        //     y: adjustedY,
        //     width: width * scaleX,
        //     height: height * scaleY,
        // });
    }, [shape]);

    // **4️⃣ Handle Crop Adjustments**
    const onCropChange = (newCrop: Crop) => {
        setCrop(newCrop);
    };

    const onCropComplete = (pixelCrop: Crop) => {
        if (!pixelCrop) return;

        // Reverse scaling back to backend values
        const scaleX = cameraResolution.width / containerSize.width;
        const scaleY = cameraResolution.height / containerSize.height;

        const updatedX = (pixelCrop.x + pixelCrop.width / 2) * scaleX;
        const updatedY = (pixelCrop.y + pixelCrop.height / 2) * scaleY;
        const updatedWidth = pixelCrop.width * scaleX;
        const updatedHeight = pixelCrop.height * scaleY;

        setUpdatedSettings({
            x: updatedX,
            y: updatedY,
            width: updatedWidth,
            height: updatedHeight,
        });

        console.log("Updated Region Settings:", {
            x: updatedX,
            y: updatedY,
            width: updatedWidth,
            height: updatedHeight,
        });
    };

    const handleSubmit = async () => {
        if (!updatedSettings) return;

        await axios.post(`${Urls.fetchRegions}/`, {
            region: {
                id: uuidv4(),
                type: "imashape",
                enabled: true,
                reference_resolution: [1280, 720],
                shape: {
                    shape: {
                        geometry_type: GeometryType.SQUARE,
                        side: updatedSettings.width,
                        center: { x: updatedSettings.x, y: updatedSettings.y },
                    },
                },
            },
        });

        console.log("Region submitted successfully!");
    };

    return (
        <div className="flex gap-5">
            <div className="relative border rounded-lg overflow-hidden" style={{ width: containerSize.width, height: containerSize.height }}>
                <ReactCrop crop={crop ?? undefined} onChange={onCropChange} onComplete={onCropComplete} keepSelection>
                    <img src={imageSrc} alt="Camera Stream" width={containerSize.width} height={containerSize.height} />
                </ReactCrop>

                <div
                    className="absolute top-1/2 left-1/2 w-[15px] h-[15px] border border-red-500"
                    style={{
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "red",
                        borderRadius: "50%",
                        zIndex: 10,
                    }}
                />
                 </div>

            <div className="flex flex-col gap-3 w-48">
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a region" />
                    </SelectTrigger>
                    <SelectContent>
                        {regionIDs.map((region) => (
                            <SelectItem key={region} value={region}>
                                {region}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <textarea
                    className="w-full h-48 p-2 border border-gray-300 rounded"
                    value={updatedSettings ? JSON.stringify(updatedSettings, null, 2) : "No region settings found"}
                    rows={11}
                    readOnly
                />

                <Button type="submit" className="w-full bg-[#FA8072] text-white" onClick={handleSubmit}>
                    Submit
                </Button>
            </div>
        </div>
    );
}

export default UpdateRegion;
