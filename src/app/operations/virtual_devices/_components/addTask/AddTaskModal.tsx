import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import AddTaskForm from "./AddTaskForm";
import CustomModal from "@/components/custom/modals/CustomModal";

interface AddTaskModalProps {
    open: boolean;
    onClose: () => void;
    cameraIds: string[];
    regionIds: string[];
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ open, onClose, cameraIds, regionIds }) => {

    return (
        // <Dialog open={open} onOpenChange={onClose}>
        //     <DialogContent className="sm:max-w-[500px]">
        //         <DialogHeader>
        //             <DialogTitle>Add Task</DialogTitle>
        //             <DialogDescription>
        //                 To add a task, please fill out the form below.
        //             </DialogDescription>
        //         </DialogHeader>
        //         <AddTaskForm
        //             cameraIds={cameraIds}
        //             regionIds={regionIds}
        //         />
        //     </DialogContent>
        // </Dialog>
        <CustomModal
            open={open}
            onClose={onClose}
            title="Add Task"
            description="To add a task, please fill out the form below."
        >
            <AddTaskForm
                cameraIds={cameraIds}
                regionIds={regionIds}
            />
        </CustomModal>

    );
};

export default AddTaskModal;
