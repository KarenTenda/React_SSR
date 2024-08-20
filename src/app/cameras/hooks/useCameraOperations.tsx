"use client";

import React, {useState, useEffect} from 'react'
import { CameraStructure } from '../structure/CameraStructure'

const useCameraOperations = (initialCameras:CameraStructure[]) => {
    const [displayedCameras, setDisplayedCameras] = useState<CameraStructure[]>(initialCameras);
    const [showModal, setShowModal] = useState(false);
    const [selectedCamera, setSelectedCamera] = useState<CameraStructure | null>(null);

    useEffect(() => {
        setDisplayedCameras(initialCameras);
    }, [initialCameras]);

    const handleEditCameraSettings = (camera:CameraStructure) => {
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