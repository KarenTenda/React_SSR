import React from 'react'
import { Card, CardContent, CardTitle, CardDescription, CardImg } from '@/components/ui/card'
import ClickableIconButton from '../../../../components/custom/buttons/ClickableIconButton'
import { SettingsIcon, DeleteIcon, StreamsIcon, JobsIcon, CalibrateIcon, ControlsIcon } from '@/public/assets/Icons'
import Urls from '@/lib/constants/Urls'
// import { CameraStructure } from '@/app/cameras/structure/CameraStructure'
import { CameraSettings } from '@/app/cameras/schemas/CameraSettingsSchemas'
import { CameraControlsPopover } from '@/app/cameras/components/cameraSettings/cameraControls/CameraControlsPopover'
import { useRouter } from 'next/navigation'


const CameraCard = ({ camera, handleEditCameraSettings, deleteCamera }: 
    { 
        camera: CameraSettings, 
        handleEditCameraSettings: (camera: CameraSettings) => void,
        deleteCamera: () => void
    }) => {
        const router = useRouter();

        const handleJobsClick = () => {
            const url = `/cameras/${camera.id}/jobs?settings=${encodeURIComponent(JSON.stringify(camera))}`;
            router.push(url);
        };

        const handleStreamsClick = () => {
            const url = `/cameras/${camera.id}/streams?settings=${encodeURIComponent(JSON.stringify(camera))}`;
            router.push(url);
        };
        

    return (
        <>
            <Card className='mb-4 space-y-2'>
                <CardImg
                    src={`${Urls.fetchPhantomCamera}/${camera.id}/stream`}
                    loading="lazy"
                    style={{ height: '200px', objectFit: 'cover' }}
                />
                <CardContent className='space-y-2'>
                    <CardTitle>Name: {camera.name}</CardTitle>
                    <CardDescription>ID: {camera.id}</CardDescription>
                    <div>
                        <ClickableIconButton Icon={SettingsIcon} onClick={() => handleEditCameraSettings(camera)} tooltipText="Basic settings" disabled={false}/>
                        <ClickableIconButton Icon={StreamsIcon} onClick={handleStreamsClick} tooltipText='Streams' disabled={false} />
                        <ClickableIconButton Icon={JobsIcon} onClick={handleJobsClick} tooltipText='Jobs' disabled={false} />
                        <ClickableIconButton Icon={CalibrateIcon} onClick={deleteCamera} tooltipText='Calibrate' disabled={true} />
                        <CameraControlsPopover camera={camera}/>
                        <ClickableIconButton Icon={DeleteIcon} onClick={deleteCamera} tooltipText='Delete' disabled={true} />
                    </div>
                </CardContent>
            </Card>
        </>

    )
}

export default CameraCard