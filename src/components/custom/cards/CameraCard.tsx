import React from 'react'
import { Card, CardContent, CardTitle, CardDescription, CardImg } from '@/components/ui/card'
import ClickableIconButton from '../buttons/ClickableIconButton'
import { SettingsIcon, DeleteIcon } from '../../../../public/assets/Icons'
import { useLabels } from '@/hooks/useLabels'
import Urls from '@/constants/Urls'
import { CameraStructure } from '@/app/cameras/structure/CameraStructure'
import useCameraOperations from '@/app/cameras/hooks/useCameraOperations'


const CameraCard = ({ camera, handleEditCameraSettings, deleteCamera }: 
    { 
        camera: CameraStructure, 
        handleEditCameraSettings: (camera: CameraStructure) => void,
        deleteCamera: () => void
    }) => {

    return (
        <>
            <Card className='mb-4'>
                <CardImg
                    src={`${Urls.fetchPhantomCamera}/${camera.id}/stream`}
                    loading="lazy"
                    style={{ height: '200px', objectFit: 'cover' }}
                />
                <CardContent>
                    <CardTitle>Name: {camera.name}</CardTitle>
                    <CardDescription>ID: {camera.id}</CardDescription>
                    <div>
                        <ClickableIconButton Icon={SettingsIcon} onClick={() => handleEditCameraSettings(camera)} tooltipText="edit" />
                        <ClickableIconButton Icon={DeleteIcon} onClick={deleteCamera} tooltipText='delete' disabled={true} />
                    </div>
                </CardContent>
            </Card>
        </>

    )
}

export default CameraCard