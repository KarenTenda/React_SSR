import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardTitle, CardDescription, CardImg } from '@/components/ui/card'
import ClickableIconButton from '@/components/custom/buttons/ClickableIconButton'
import { SettingsIcon, DeleteIcon } from '@/public/assets/Icons'
import Urls from '@/lib/Urls'
import { TaskStructure } from '../../structure/TaskStructure'
import { RefreshCcw, VideoIcon } from 'lucide-react'
import { resolveCameraId } from '../../utils/ProcessingUtils'


const TaskCard = ({ task, tasks, handleEditTasksSettings, deleteTask }:
    {
        task: TaskStructure,
        tasks: TaskStructure[],
        handleEditTasksSettings: (task: TaskStructure) => void,
        deleteTask: () => void
    }) => 
{
    const defaultImage = '/images/default-image.jpg';
    const cameraId = resolveCameraId(task, tasks);
    const [imageSrc, setImageSrc] = useState(`${Urls.fetchPhantomCamera}/${cameraId}/image`);
    const [isLiveStream, setIsLiveStream] = useState(false);

    const handleRefreshClick = () => {
        setImageSrc(`${Urls.fetchPhantomCamera}/${cameraId}/image?timestamp=${new Date().getTime()}`);
        setIsLiveStream(false);
    };

    const handleLiveStreamClick = () => {
        setImageSrc(`${Urls.fetchPhantomCamera}/${cameraId}/stream`);
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
                    <CardTitle className='text-lg'>ID: {task.id}</CardTitle>
                    <CardDescription>Type: {task.type}</CardDescription>
                    <div>
                        <ClickableIconButton Icon={SettingsIcon} onClick={() => handleEditTasksSettings(task)} tooltipText="Task settings" disabled={false} />
                        <ClickableIconButton Icon={DeleteIcon} onClick={deleteTask} tooltipText='Delete' disabled={true} />
                    </div>
                </CardContent>
            </Card>
        </>

    )
}

export default TaskCard