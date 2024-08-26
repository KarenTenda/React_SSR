import React from 'react'
import { Card, CardContent, CardTitle, CardDescription, CardImg } from '@/components/ui/card'
import ClickableIconButton from '../buttons/ClickableIconButton'
import { SettingsIcon, DeleteIcon, StreamsIcon, JobsIcon, CalibrateIcon, ControlsIcon } from '@/public/assets/Icons'
import Urls from '@/constants/Urls'
import { CameraStructure } from '@/app/cameras/structure/CameraStructure'


const CameraCard = ({ camera, handleEditCameraSettings, deleteCamera }: 
    { 
        camera: CameraStructure, 
        handleEditCameraSettings: (camera: CameraStructure) => void,
        deleteCamera: () => void
    }) => {

    return (
        <>
            <Card className='mb-4 space-y-2'>
                <CardImg
                    src={`${Urls.fetchPhantomCamera}/${camera.id}/stream`}
                    loading="lazy"
                    style={{ height: '200px', objectFit: 'cover' }}
                />
                <CardContent>
                    <CardTitle>Name: {camera.name}</CardTitle>
                    <CardDescription>ID: {camera.id}</CardDescription>
                    <div className='space-x-4'>
                        <ClickableIconButton Icon={SettingsIcon} onClick={() => handleEditCameraSettings(camera)} tooltipText="Edit" />
                        <ClickableIconButton Icon={StreamsIcon} onClick={deleteCamera} tooltipText='Streams' disabled={true} />
                        <ClickableIconButton Icon={JobsIcon} onClick={deleteCamera} tooltipText='Jobs' disabled={true} />
                        <ClickableIconButton Icon={CalibrateIcon} onClick={deleteCamera} tooltipText='Calibrate' disabled={true} />
                        <ClickableIconButton Icon={ControlsIcon} onClick={deleteCamera} tooltipText='Controls' disabled={true} />
                        <ClickableIconButton Icon={DeleteIcon} onClick={deleteCamera} tooltipText='Delete' disabled={true} />
                    </div>
                </CardContent>
            </Card>
        </>

    )
}

export default CameraCard