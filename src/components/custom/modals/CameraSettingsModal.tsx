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
import CameraSettingsForm from '../forms/CameraSettingsForm';
import { CameraStructure } from '@/app/cameras/structure/CameraStructure';
import { useLabels } from '@/hooks/useLabels';

interface CameraModalProps {
  open: boolean;
  onClose: () => void;
  camera: CameraStructure | null;
}

const CameraSettingsModal: React.FC<CameraModalProps> = ({ open, onClose, camera }) => {
  const labels = useLabels();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{labels.EditCamera}</DialogTitle>
          <DialogDescription>
            Make changes to your camera settings here. Click save when youre done.
          </DialogDescription>
        </DialogHeader>
        <CameraSettingsForm />
        <DialogFooter>
          <Button type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CameraSettingsModal;
