import React, {useRef,useState, useEffect} from 'react'
// import { CameraStructure } from '../../structure/CameraStructure'
import { CameraSettings } from '../../schemas/CameraSettingsSchemas'
import CameraSettingsModal from '@/components/custom/modals/CameraSettingsModal'
import CameraCard from '@/components/custom/cards/CameraCard'
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