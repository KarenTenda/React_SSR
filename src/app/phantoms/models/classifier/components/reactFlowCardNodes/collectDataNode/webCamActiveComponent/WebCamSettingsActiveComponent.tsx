import React from 'react';
import { Button } from '@/components/ui/button';
import ClickableIconButton from '@/components/custom/buttons/ClickableIconButton';
import { InfoIcon } from '../../../../../../../../../public/assets/Icons';

const WebCamSettingsActiveComponent = ({ setIsWebcamSettingsActive }: { setIsWebcamSettingsActive: React.Dispatch<React.SetStateAction<boolean>> }) => {

    return (
        <div className="flex flex-row justify-between items-center space-y-2">
            <h6 className=" font-medium text-sm">Settings{
                <ClickableIconButton
                    Icon={InfoIcon}
                    onClick={() => setIsWebcamSettingsActive(false)}
                    tooltipText={`Here, you can set the way you want to collect your images. 
                      Either by setting the number of Images or clicking the Capture Image button to capture images manually.`}
                />
            }</h6>
            <Button variant="ghost" size="sm" className="text-sm mb-2" onClick={() => setIsWebcamSettingsActive(false)}>
                x
            </Button>
        </div>
    );
}

export default WebCamSettingsActiveComponent;
