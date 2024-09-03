import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CamerASettingsTab } from '@/app/cameras/components/cameraSettings/CameraSettingsTabs';
import { CameraSettings } from '@/app/cameras/schemas/CameraSettingsSchemas';
import { useLabels } from '@/hooks/useLabels';

interface CameraModalProps {
  open: boolean;
  onClose: () => void;
  camera: CameraSettings;
}

const CameraSettingsModal: React.FC<CameraModalProps> = ({ open, onClose, camera }) => {
  const labels = useLabels();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{labels.EditCamera}</DialogTitle>
          <DialogDescription>
            Make changes to your camera settings here. Click save when youre done.
          </DialogDescription>
        </DialogHeader>
        <CamerASettingsTab camera={camera}/>
        {/* <DialogFooter>
          <Button type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save changes</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
};

export default CameraSettingsModal;
