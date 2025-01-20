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
import { TaskStructure } from '../../structure/TaskStructure';
import { useLabels } from '@/hooks/useLabels';
import { TaskSettingsTab } from './TaskSettingsTab';

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  task: TaskStructure | null;
}

const TaskSettingsModal: React.FC<TaskModalProps> = ({ open, onClose, task }) => {
  const labels = useLabels();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{labels.EditCamera}</DialogTitle>
          <DialogDescription>
            {`Make changes to your task settings here. Click save when you're done.`}
          </DialogDescription>
        </DialogHeader>
        <TaskSettingsTab task={task}/>
      </DialogContent>
    </Dialog>
  );
};

export default TaskSettingsModal;
