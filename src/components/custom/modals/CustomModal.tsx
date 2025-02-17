import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface AddTaskModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    description: string;
    children?: React.ReactNode;
}

const CustomModal: React.FC<AddTaskModalProps> = ({ open, onClose, title, description, children}) => {

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                {children}
                <DialogFooter>
                    
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CustomModal;
