
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import CameraControlPanel from "./CameraControls"
import { CameraSettings } from "@/app/cameras/schemas/CameraSettingsSchemas"
import { ControlsIcon } from "@/public/assets/Icons"
import ClickableIconButton from "@/components/custom/buttons/ClickableIconButton"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Urls from "@/lib/Urls"
import { useState } from "react"
import axios from "axios"

interface CameraControlsPopoverProps {
    camera: CameraSettings;
    disabled?: boolean;
}

export function CameraControlsPopover({ camera, disabled = false }: CameraControlsPopoverProps) {
    const [settings, setSettings] = useState<CameraSettings>(camera);

    const handleIconClick = () => {
        console.log("Icon clicked");
    };

    const handleSaveChanges = async () => {
        await axios.put(`${Urls.fetchPhantomCameras}/${camera?.id}`, settings);
    }

    return (
        // <Popover>
        //     <PopoverTrigger asChild>
        //         <ClickableIconButton
        //             Icon={ControlsIcon}
        //             onClick={handleIconClick}
        //             tooltipText="Controls"
        //             disabled={disabled}
        //         />
        //     </PopoverTrigger>
        //     <PopoverContent className="w-100">
        //         <div className="grid gap-2">
        //             <CameraControlPanel camera={camera} />
        //         </div>
        //     </PopoverContent>
        // </Popover>
        <Dialog>
            <DialogTrigger asChild>
                <ClickableIconButton
                    Icon={ControlsIcon}
                    onClick={handleIconClick}
                    tooltipText="Controls"
                    disabled={disabled}
                />
            </DialogTrigger>
            <DialogContent className="min-w-[600px] min-h-[400px]">
                <DialogHeader>
                    <DialogTitle>Edit camera controls</DialogTitle>
                    <DialogDescription>
                        Make changes to your camera here. Apply to see changes in realtime.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <CameraControlPanel
                            cameraSettings={settings}
                            setCameraSettings={setSettings}
                        />
                    </div>
                    <div className="flex flex-col items-center">
                        <img
                            src={`${Urls.fetchPhantomCamera}/${camera.id}/stream`}
                            loading="lazy"
                            style={{ height: '200px', objectFit: 'cover' }}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        type="submit"
                        className={`mt-4 bg-[#FA8072] text-white`}
                        onClick={handleSaveChanges}
                    >Submit
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
