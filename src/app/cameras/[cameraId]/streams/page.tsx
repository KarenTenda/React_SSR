"use client";

import { useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { BackIcon, SaveIcon } from "@/public/assets/Icons";
import { Card, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import ClickableIconButton from "@/components/custom/buttons/ClickableIconButton";
import { Separator } from "@/components/ui/separator"
import { Stream } from "../../schemas/StreamsSchema";
// import Urls from "@/constants/Urls";
// import axios from "axios";

const StreamsPage = () => {
    const { cameraId } = useParams();
    const searchParams = useSearchParams();
    const settingsString = searchParams.get("settings");
    const cameraSettings = settingsString ? JSON.parse(settingsString) : null;
    console.log(cameraSettings);
    const [streams, setStreams] = useState<Stream[]>(cameraSettings?.streams || []);
    console.log(streams);

    const router = useRouter();

    const handleBackClick = () => {
        router.push(`/cameras`);
    };

    const handleSave = async (streamId: string) => {
        const streamToUpdate = streams.find(stream => stream.id === streamId);
        if (streamToUpdate) {
            try {
                // await axios.put(`${Urls.fetchPhantomCameras}/${cameraId}/scheduled-tasks/${taskId}`, {
                //     ...taskToUpdate,
                //     settings: taskEdits[taskId]
                // });
                alert("Task updated successfully!");
            } catch (error) {
                console.error("Error updating task:", error);
                alert("Failed to update task. Please try again.");
            }
        }
    };

    return (
        <div className="p-4">
            <div className="flex items-center mb-4">
                <ClickableIconButton
                    Icon={BackIcon}
                    onClick={handleBackClick}
                    tooltipText="Go back"
                    disabled={false}
                />
                <h1 className="text-2xl font-bold">Streams for {cameraId}</h1>
            </div>

            <Separator className="mb-4" />

            {streams.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {streams.map((stream:any) => (
                        <Card key={stream.camera_id} className="mb-4">
                            <CardContent className="space-y-2 p-2 ">
                                <CardTitle className="truncate text-md" title={stream.camera_id}>ID: {stream.camera_id}</CardTitle>
                                <CardDescription className="truncate" title={stream.task_type}>Type: {stream.task_type}</CardDescription>
                        
                            </CardContent>
                            <CardFooter className="p-0">
                                <ClickableIconButton
                                    Icon={SaveIcon}
                                    onClick={() => handleSave(stream.camera_id)}
                                    tooltipText="Save Changes"
                                    disabled={false}
                                />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center">
                    <div className="text-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="t-20"
                        >
                            <path d="M16 7h.01" /><path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20" />
                            <path d="m20 7 2 .5-2 .5" /><path d="M10 18v3" /><path d="M14 17.75V21" />
                            <path d="M7 18a6 6 0 0 0 3.84-10.61" />

                        </svg>
                        <p className="text-lg text-gray-500">No streams found for this camera.</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default StreamsPage;