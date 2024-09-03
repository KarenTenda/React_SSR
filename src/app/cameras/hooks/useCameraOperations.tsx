"use client";

import React, {useState, useEffect} from 'react'
import { CameraStructure } from '../structure/CameraStructure'
import { CameraSettings } from '../schemas/CameraSettingsSchemas';

const useCameraOperations = (initialCameras:CameraSettings[]) => {
    const [displayedCameras, setDisplayedCameras] = useState<CameraSettings[]>(initialCameras);
    const [showModal, setShowModal] = useState(false);
    const [selectedCamera, setSelectedCamera] = useState<CameraSettings | null>(null);

    useEffect(() => {
        setDisplayedCameras(initialCameras);
    }, [initialCameras]);

    const handleEditCameraSettings = (camera:CameraSettings) => {
        setSelectedCamera(camera);
        setShowModal(true);
    };

    const handleClose = () => setShowModal(false);

    const deleteCamera = () => {
            
    };

    return {
        handleEditCameraSettings,
        deleteCamera,
        handleClose,
        showModal,
        setShowModal,
        selectedCamera,
        setSelectedCamera,
        displayedCameras
    }
}

export default useCameraOperations