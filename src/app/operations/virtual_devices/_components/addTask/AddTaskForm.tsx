import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { uuidv4 } from "@/app/models/actions/trainModel/classifier/components";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { checkingSpecificTypeMap, inferenceSpecificTypeMap, taskTypeMap, TaskTypes, TrackingSpecificTypes } from "../../types/TaskTypes";
import { useInferenceTaskIDs } from "../../hooks/useTaskService";

interface AddTaskFormProps {
    cameraIds: string[];
    regionIds: string[];
}

const AddTaskForm:React.FC<AddTaskFormProps> = ({cameraIds,regionIds}) => {
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const availableInferenceIds = useInferenceTaskIDs();
    const inferenceTask = {
        id: "",
        type: TaskTypes.INFERENCE,
        specific_type: "keypoint",
        camera_id: "",
        reference_region_ids: [],
        model_id: "default_model",
        client_config: {
            adapter_id: "default_adapter",
            adapter_name: "Default Adapter",
            host: "localhost",
            port: 8000,
            timeout: 30,
        },
        result_processing_pipeline: [],
        id_assignment_model: { value: "default_id" },
        result_handler_model: { handler_type: "default_handler" },
        visualizer: {
            visualize: true,
        },
    };

    const checkingTask = {
        id: "",
        type: TaskTypes.CHECKING,
        specific_type: "label",
        camera_id: "",
        checking_configs: [
            {
                id: uuidv4(),
                reference_component_id: "",
                reference_component_result_id: "",
                target_label: "default_label",
            },
        ],
        result_handler_model: { handler_type: "default_handler" },
    };

    const trackingTask = {
        id: "",
        type: TaskTypes.TRACKING,
        specific_type: TrackingSpecificTypes.REFERENCE,
        tracking_configs: [
            {
                id: uuidv4(),
                reference_component_id: "",
                reference_component_result_id: "",
                reference_component_sub_id: "",
                target_component_id: "",
                target_component_result_id: "",
                target_component_result_sub_ids: [],
            },
        ],
        result_handler_model: { handler_type: "default_handler" },
    };


    const formSchema = z.object({
        id: z.string(),
        type: z.string(),
        specific_type: z.string().optional(),
        camera_id: z.string().optional(),
        reference_region_ids: z.array(z.string()).optional(),
        model_id: z.string().optional(),

        reference_component_id: z.string().optional(),

        target_component_id: z.string().optional(),
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: uuidv4(),
            type: "",
            specific_type: "",
            camera_id: "",
            reference_region_ids: [] as string[],
            model_id: "",

            reference_component_id: "",

            target_component_id: "",
        },
    });

    function handleRegionIdSelection(
        value: string,
        currentRegions: string[],
        setValue: (name: "reference_region_ids", value: string[]) => void
    ) {
        if (!currentRegions.includes(value)) {
            const updatedRegions = [...currentRegions, value];
            setValue("reference_region_ids", updatedRegions);
        }
    }

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        let taskToCreate;

        switch (selectedType) {
            case "inference":
                taskToCreate = {
                    ...inferenceTask,
                    id: data.id,
                    camera_id: data.camera_id,
                    specific_type: data.specific_type || inferenceTask.specific_type,
                    reference_region_ids: data.reference_region_ids || [],
                    model_id: data.model_id || inferenceTask.model_id,
                };

                console.log("Saving Inference Task to Database:", taskToCreate);
                break;

            case "checking":
                taskToCreate = {
                    ...checkingTask,
                    id: data.id,
                    specific_type: data.specific_type || checkingTask.specific_type,
                    camera_id: data.camera_id,
                    checking_configs: [
                        {
                            id: uuidv4(),
                            reference_component_id: data.reference_component_id || "",
                            reference_component_result_id: "",
                            target_label: "default_label",
                        },
                    ],
                };

                console.log("Saving Checking Task to Database:", taskToCreate);
                break;

            case "tracking":
                taskToCreate = {
                    ...trackingTask,
                    id: data.id,
                    specific_type: data.specific_type || trackingTask.specific_type,
                    tracking_configs: [
                        {
                            id: uuidv4(),
                            target_component_id: data.target_component_id || "",
                            target_component_result_id: "",
                            target_component_result_sub_ids: [],
                        },
                    ],
                };
                console.log("Tracking task creation not implemented yet.");
                break;

            default:
                console.error("Invalid task type selected.");
                return;
        }
    };

    // relying on register or automatic schema validation
    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>ID</FormLabel>
                                <FormControl>
                                    <Input placeholder="ID" {...field} disabled />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select
                            onValueChange={(value) => {
                                setSelectedType(value);
                                form.setValue("type", value);
                            }}
                            value={selectedType || ""}
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a task type" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {taskTypeMap.map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormItem>

                    {selectedType === "inference" && (
                        <>
                            <FormItem>
                                <FormLabel>Inference Specific Type</FormLabel>
                                <Select
                                    onValueChange={(value) => form.setValue("specific_type", value)}
                                    value={form.watch("specific_type") || ""}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Specific Type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {inferenceSpecificTypeMap.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                            </FormItem>

                            <FormItem>
                                <FormLabel>Camera ID</FormLabel>
                                <Select
                                    onValueChange={(value) => form.setValue("camera_id", value)}
                                    value={form.getValues("camera_id") || ""}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Camera ID" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {cameraIds.map((cameraId) => (
                                            <SelectItem key={cameraId} value={cameraId}>
                                                {cameraId}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormItem>

                            <FormItem>
                                <FormLabel>Region IDs</FormLabel>
                                <Select
                                    onValueChange={(value: string) => {
                                        const currentRegions = form.watch("reference_region_ids") || [];
                                        handleRegionIdSelection(value, currentRegions, form.setValue);
                                    }}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue>
                                                {form.watch("reference_region_ids")?.length > 0
                                                    ? form.watch("reference_region_ids").join(", ")
                                                    : "Select Region IDs"}
                                            </SelectValue>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {regionIds.map((regionId) => (
                                            <SelectItem key={regionId} value={regionId}>
                                                {regionId}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <div className="flex flex-wrap gap-2 mt-2">
                                    {(form.watch("reference_region_ids") || []).map((regionId: string, index: number) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-md"
                                        >
                                            <span>{regionId}</span>
                                            {/* Remove button */}
                                            <button
                                                type="button"
                                                className="text-red-500"
                                                onClick={() => {
                                                    const updatedRegions = form
                                                        .getValues("reference_region_ids")
                                                        ?.filter((id: string) => id !== regionId);
                                                    form.setValue("reference_region_ids", updatedRegions || []);
                                                }}
                                            >
                                                x
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </FormItem>

                            <FormField
                                control={form.control}
                                name="model_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Model ID</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter Model ID"
                                                value={field.value || "coco_pose"}
                                                onChange={field.onChange}
                                            // {...field} 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </>

                    )}

                    {selectedType === "checking" && (
                        <>
                            <FormItem>
                                <FormLabel>Checking Specific Type</FormLabel>
                                <Select
                                    onValueChange={(value) => form.setValue("specific_type", value)}
                                    value={form.getValues("specific_type") || ""}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Checking Specific Type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {checkingSpecificTypeMap.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormItem>

                            <FormItem>
                                <FormLabel>Reference Inference Task ID</FormLabel>
                                {availableInferenceIds.length > 0 ? (
                                    <Select
                                        onValueChange={(value) =>
                                            form.setValue("reference_component_id", value)
                                        }
                                        value={form.getValues("reference_component_id") || ""}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Reference Task ID" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {availableInferenceIds.map((id) => (
                                                <SelectItem key={id} value={id}>
                                                    {id}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <p className="text-gray-500">
                                        No available inference tasks. Please create an inference task first.
                                    </p>
                                )}
                            </FormItem>
                        </>
                    )}

                    {selectedType === "tracking" && (
                        <>
                            <FormField
                                control={form.control}
                                name="specific_type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tracking Specific Type</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter Tracking Specific Type"
                                                value={TrackingSpecificTypes.REFERENCE || ""}
                                                // {...field} 
                                                disabled
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormItem>
                                <FormLabel>Target Inference Task ID</FormLabel>
                                {availableInferenceIds.length > 0 ? (
                                    <Select
                                        onValueChange={(value) =>
                                            form.setValue("target_component_id", value)
                                        }
                                        value={form.getValues("target_component_id") || ""}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Target Task ID" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {availableInferenceIds.map((id) => (
                                                <SelectItem key={id} value={id}>
                                                    {id}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <p className="text-gray-500">
                                        No available inference tasks. Please create an inference task first.
                                    </p>
                                )}
                            </FormItem>
                        </>
                    )}

                    
                </form>
            </Form>
            <Button type="submit" className={`mt-4 bg-[#FA8072] text-white`}>Submit</Button>
        </div>
    )
}

export default AddTaskForm