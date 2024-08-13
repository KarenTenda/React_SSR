import React from 'react'
import { CameraStructure } from '../structure/CameraStructure'
import CameraModal from '@/components/custom/modals/CameraModal'
import CameraCard from '@/components/custom/cards/CameraCard'
import useCameraOperations from '../hooks/useCameraOperations'

const CameraGrid = ({ cameras }: { cameras: CameraStructure[] }) => {
    const { 
        handleEditCameraSettings,
        deleteCamera,
        handleClose,
        showModal,
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
        <CameraModal 
            show={showModal} 
            onHide={handleClose} 
            camera={selectedCamera} 
            setSelectedCamera={setSelectedCamera}
        />
    </>
  )
}

export default CameraGrid