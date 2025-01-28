import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface ModelsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (type: string) => void;
}

const ModelsDialog = ({ isOpen, onClose, onSelect }: ModelsDialogProps) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSelect = (type: string) => {
        setLoading(true);
        onSelect(type);
        router.push(`/phantoms/models/actions/trainModel/${type}`);
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <div className="space-y-4">
                    {loading ? (
                        <div className="flex justify-center items-center">
                            <div className="loader">Loading...</div>
                        </div>
                    ) : (
                        <>
                            <Button
                                className="w-full bg-red-300 text-white py-2 px-4 rounded hover:bg-[#FA8072]"
                                onClick={() => handleSelect('pose')}
                                disabled
                            >
                                Train Pose Model
                            </Button>
                            <Button
                                className="w-full bg-red-300 text-white py-2 px-4 rounded hover:bg-[#FA8072]"
                                onClick={() => handleSelect('classifier')}
                            >
                                Train Classification Model
                            </Button>
                            <Button
                                className="w-full bg-red-300 text-white py-2 px-4 rounded hover:bg-[#FA8072]"
                                onClick={() => handleSelect('object')}
                                disabled
                            >
                                Train Object Detection Model
                            </Button>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ModelsDialog;