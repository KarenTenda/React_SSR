import React from 'react'
import {
    Dialog,
    DialogContent
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';

interface ModelsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (type: string) => void;
}

const ModelsDialog = ({ isOpen, onClose, onSelect }: ModelsDialogProps) => {
    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <div className="space-y-4">
                    <Button
                        className="w-full bg-red-300 text-white py-2 px-4 rounded hover:bg-[#FA8072]"
                        onClick={() => onSelect('pose')}
                        disabled
                    >
                        Train Pose Model
                    </Button>
                    <Button
                        className="w-full bg-red-300 text-white py-2 px-4 rounded hover:bg-[#FA8072]"
                        onClick={() => onSelect('classifier')}
                    >
                        Train Classification Model
                    </Button>
                    <Button
                        className="w-full bg-red-300 text-white py-2 px-4 rounded hover:bg-[#FA8072]"
                        onClick={() => onSelect('object')}
                        disabled
                    >
                        Train Object Detection Model
                    </Button>
                </div>
            </DialogContent>
        </Dialog >

    )
}

export default ModelsDialog