
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import CameraControlPanel from "./CameraControls"
import { CameraSettings } from "@/app/cameras/schemas/CameraSettingsSchemas"
import { ControlsIcon } from "@/public/assets/Icons"
import ClickableIconButton from "@/components/custom/buttons/ClickableIconButton"

interface CameraControlsPopoverProps {
    camera: CameraSettings;
    disabled?: boolean;
}

export function CameraControlsPopover({ camera, disabled = false }: CameraControlsPopoverProps) {
    const handleIconClick = () => {
        console.log("Icon clicked");
    };
    return (
        <Popover>
            <PopoverTrigger asChild>
                <ClickableIconButton
                    Icon={ControlsIcon}
                    onClick={handleIconClick}
                    tooltipText="Controls"
                    disabled={disabled}
                />
            </PopoverTrigger>
            <PopoverContent className="w-100">
                <div className="grid gap-2">
                    <CameraControlPanel camera={camera} />
                </div>
            </PopoverContent>
        </Popover>
    )
}
