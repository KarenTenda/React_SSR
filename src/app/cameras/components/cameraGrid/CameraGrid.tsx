import React, {useRef,useState, useEffect} from 'react'
import { CameraSettings } from '../../schemas/CameraSettingsSchemas'
import CameraSettingsModal from '@/app/cameras/components/cameraSettings/CameraSettingsModal'
import CameraCard from '@/app/cameras/components/cameraCard/CameraCard'
import useCameraOperations from '../../hooks/useCameraOperations'

const CameraGrid = ({ cameras }: { cameras: CameraSettings[] }) => {
    const {
        handleEditCameraSettings,
        deleteCamera,
        handleClose,
        showModal,
        setShowModal,
        selectedCamera,
        setSelectedCamera,
        displayedCameras
    } = useCameraOperations(cameras);

    return (
        <>
            {cameras.map((camera, index) => (
                <CameraCard
                    key={index}
                    camera={camera}
                    handleEditCameraSettings={handleEditCameraSettings}
                    deleteCamera={deleteCamera}
                />
            ))}
            <CameraSettingsModal
                open={showModal}
                onClose={handleClose}
                camera={selectedCamera}
                // setSelectedCamera={setSelectedCamera}
            />
        </>
    )
}

export default CameraGrid