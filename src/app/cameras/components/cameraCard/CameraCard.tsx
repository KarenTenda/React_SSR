import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardTitle, CardDescription, CardImg } from '@/components/ui/card'
import ClickableIconButton from '../../../../components/custom/buttons/ClickableIconButton'
import { SettingsIcon, DeleteIcon, StreamsIcon, JobsIcon, CalibrateIcon, ControlsIcon } from '@/public/assets/Icons'
import Urls from '@/lib/Urls'
// import { CameraStructure } from '@/app/cameras/structure/CameraStructure'
import { CameraSettings } from '@/app/cameras/schemas/CameraSettingsSchemas'
import { CameraControlsPopover } from '@/app/cameras/components/cameraSettings/cameraControls/CameraControlsPopover'
import { useRouter } from 'next/navigation'
import { RefreshCcw, VideoIcon } from 'lucide-react'


const CameraCard = ({ camera, handleEditCameraSettings, deleteCamera }:
    {
        camera: CameraSettings,
        handleEditCameraSettings: (camera: CameraSettings) => void,
        deleteCamera: () => void
    }) => 
{
    const [imageSrc, setImageSrc] = useState(`${Urls.fetchPhantomCamera}/${camera.id}/image`);
    const [isLiveStream, setIsLiveStream] = useState(false);
    const defaultImage = '/images/default-image.jpg';
    const router = useRouter();

    const handleJobsClick = () => {
        const url = `/cameras/${camera.id}/jobs?settings=${encodeURIComponent(JSON.stringify(camera))}`;
        router.push(url);
    };

    const handleStreamsClick = () => {
        const url = `/cameras/${camera.id}/streams?settings=${encodeURIComponent(JSON.stringify(camera))}`;
        router.push(url);
    };

    const handleRefreshClick = () => {
        setImageSrc(`${Urls.fetchPhantomCamera}/${camera.id}/image?timestamp=${new Date().getTime()}`);
        setIsLiveStream(false);
    };

    const handleLiveStreamClick = () => {
        setImageSrc(`${Urls.fetchPhantomCamera}/${camera.id}/stream`);
        setIsLiveStream(true);
    };

    useEffect(() => {
        handleRefreshClick(); 
    }, []);


    return (
        <>
            <Card className='mb-4 space-y-2 w-96'>
                <div className="relative">
                    <CardImg
                        src={imageSrc || defaultImage}
                        loading="lazy"
                        onError={() => setImageSrc(defaultImage)}
                        className="w-full h-[200px] object-cover rounded-t-md"
                    />
                    <div className="absolute top-2 right-2 flex space-x-2">
                        <ClickableIconButton Icon={RefreshCcw} onClick={handleRefreshClick} tooltipText="Refresh" disabled={false} />
                        <ClickableIconButton Icon={VideoIcon} onClick={handleLiveStreamClick} tooltipText="Live Stream" disabled={false} />
                    </div>
                </div>
                <CardContent className='space-y-2'>
                    <CardTitle className='text-lg'>Name: {camera.name}</CardTitle>
                    <CardDescription>ID: {camera.id}</CardDescription>
                    <div>
                        <ClickableIconButton Icon={SettingsIcon} onClick={() => handleEditCameraSettings(camera)} tooltipText="Basic settings" disabled={false} />
                        <ClickableIconButton Icon={StreamsIcon} onClick={handleStreamsClick} tooltipText='Streams' disabled={false} />
                        <ClickableIconButton Icon={JobsIcon} onClick={handleJobsClick} tooltipText='Jobs' disabled={false} />
                        <ClickableIconButton Icon={CalibrateIcon} onClick={deleteCamera} tooltipText='Calibrate' disabled={true} />
                        <CameraControlsPopover camera={camera} />
                        <ClickableIconButton Icon={DeleteIcon} onClick={deleteCamera} tooltipText='Delete' disabled={true} />
                    </div>
                </CardContent>
            </Card>
        </>

    )
}

export default CameraCard