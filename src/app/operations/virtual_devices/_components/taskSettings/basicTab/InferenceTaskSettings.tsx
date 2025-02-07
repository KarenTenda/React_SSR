import React, { useEffect, useState } from 'react';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { HexColorPicker } from "react-colorful";
import { Textarea } from '@/components/ui/textarea';
import { Input } from "@/components/ui/input";
import { TaskStructure } from '../../../structure/TaskStructure';
import { useFormContext, Controller } from 'react-hook-form';
import { InferenceTask } from '../../../structure/inference/InferenceStructure';
import { Checkbox } from '@/components/ui/checkbox';
import { InferenceSpecificTypes } from '../../../types/TaskTypes';
import "react-color-palette/css";
import { DeleteIcon, PencilIcon } from '@/public/assets/Icons';
import { Button } from '@/components/ui/button';
import UpdateRegion from './updateRegion/UpdateRegion';
import { RegionStructure } from '@/app/operations/regions/structures/RegionStructure';

function InferenceTaskSettings({ task, regions, savedRegionIDs }: {
    task: InferenceTask | null, regions: RegionStructure[], savedRegionIDs: string[]
}) {
    const { control, setValue, watch } = useFormContext();
    const clientConfig = watch('client_config');
    const visualize = watch('visualizer.visualize') || false;
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
    const colorMap = watch("visualizer.class_label_to_color_map") || {};

    const handleColorChange = (label: string, newColor: string) => {
        const hexToRgb = (hex: string) => {
            const [r, g, b] = hex.match(/\w\w/g)!.map((x) => parseInt(x, 16));
            return [r, g, b];
        };

        setValue("visualizer.class_label_to_color_map", {
            ...colorMap,
            [label]: hexToRgb(newColor),
        }, { shouldValidate: true });
    };

    useEffect(() => {
        if (task && task.client_config) {
            setValue('client_config', JSON.stringify(task.client_config, null, 2));
        }
        if (task && task.reference_region_ids) {
            console.log("Available Regions", task.reference_region_ids);
            const regions = (task.reference_region_ids || []).filter((id) => id && id.trim() !== "");
            setSelectedRegions(regions);
        }
    }, [task, setValue]);

    return (
        <>
            <FormField
                control={control}
                name="camera_id"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Camera ID</FormLabel>
                        <FormControl>
                            <Input
                                type="text"
                                placeholder="Enter Camera ID"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="client_config"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Client Config</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Enter Client Config as JSON"
                                {...field}
                                value={clientConfig}
                                onChange={(e) => setValue('client_config', e.target.value)}
                                rows={6}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="id_assignment_model.value"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>ID Assignment Model Value</FormLabel>
                        <FormControl>
                            <Input
                                type="text"
                                placeholder="Enter ID Assignment Model Value"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="model_id"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Model ID</FormLabel>
                        <FormControl>
                            <Input
                                type="text"
                                placeholder="Enter Model ID"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormItem>
                <FormLabel>Region IDs</FormLabel>
                <Select
                    value={selectedRegions.length > 0 ? selectedRegions.join(", ") : ''}
                    onValueChange={(value: string) => {
                        if (!value || value.trim() === "") return;

                        const currentRegions = watch("reference_region_ids") || [];
                        if (!currentRegions.includes(value)) {
                            const updatedRegions = [...currentRegions, value].filter((id) => id.trim() !== "");
                            setValue("reference_region_ids", updatedRegions);
                            setSelectedRegions(updatedRegions);
                        }
                    }}
                >
                    <SelectTrigger>
                        <SelectValue>
                            {watch("reference_region_ids")?.length > 0
                                ? watch("reference_region_ids").join(", ")
                                : "Select Region IDs"}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {savedRegionIDs.map((regionId) => (
                            <SelectItem key={regionId} value={regionId}>
                                {regionId}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>


                <div className="flex flex-wrap gap-2 mt-2">
                    {selectedRegions.map((regionId: string, index: number) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 px-3 py-1 rounded-md bg-[#FA8072] text-white"
                        >
                            <span>{regionId}</span>
                            <Button
                                type="button"
                                onClick={() => {
                                    const updatedRegions = watch("reference_region_ids")?.filter((id: string) => id !== regionId);
                                    setValue("reference_region_ids", updatedRegions || []);
                                    setSelectedRegions(updatedRegions);
                                }}
                                variant="ghost" size="icon"
                            >
                                <DeleteIcon />
                            </Button>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            setIsUpdateModalOpen(true);
                                        }}
                                        variant="ghost" size="icon"
                                    >
                                        <PencilIcon />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-[900px] w-full h-auto p-6">
                                    <DialogHeader>
                                        <DialogTitle>Update Region</DialogTitle>
                                        <DialogDescription>
                                            Drag the region to be adjusted on the stream. The settings will auto-adjust.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex flex-row gap-4">
                                        <UpdateRegion 
                                            savedRegions={regions} regionId={regionId} savedRegionIDs={savedRegionIDs} 
                                        />
                                    </div>
                                    {/* <DialogFooter className="mt-4 flex justify-end">
                                        <Button
                                            className={`mt-4 bg-[#FA8072] text-white`}
                                            type="submit"
                                            onClick={() => {
                                                setIsUpdateModalOpen(false);
                                            }}
                                        >
                                            Submit
                                        </Button>
                                    </DialogFooter> */}
                                </DialogContent>
                            </Dialog>

                        </div>
                    ))}
                </div>
            </FormItem>

            <FormField
                control={control}
                name="result_handler_model.handler_type"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Result Handler Model Type</FormLabel>
                        <FormControl>
                            <Input
                                type="text"
                                placeholder="Enter Result Handler Model Type"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {task?.specific_type === InferenceSpecificTypes.KEYPOINT && (
                <>
                    <FormField
                        control={control}
                        name="adjust_keypoints_to_bbox"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Checkbox
                                        checked={field.value ?? false}
                                        onCheckedChange={(checked) => field.onChange(checked)}
                                    />
                                </FormControl>
                                <FormLabel>Adjust Keypoints to Bounding Box</FormLabel>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </>
            )}

            {task?.specific_type === InferenceSpecificTypes.CLASSIFICATION && (
                <>
                    <FormField
                        control={control}
                        name="visualizer.visualize"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Checkbox
                                        checked={field.value ?? false}
                                        onCheckedChange={(checked) => field.onChange(checked)}
                                    />
                                </FormControl>
                                <FormLabel>Visualize</FormLabel>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {visualize && (
                        <>
                            <FormField
                                control={control}
                                name="visualizer.show_confidence"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value ?? false}
                                                onCheckedChange={(checked) => field.onChange(checked)}
                                            />
                                        </FormControl>
                                        <FormLabel>Show Confidence</FormLabel>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="visualizer.show_class_label"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value ?? false}
                                                onCheckedChange={(checked) => field.onChange(checked)}
                                            />
                                        </FormControl>
                                        <FormLabel>Show Class Label</FormLabel>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Controller
                                control={control}
                                name="visualizer.class_label_to_color_map"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Class Label to Color Map</FormLabel>
                                        <FormControl>
                                            <div className="space-y-2">
                                                {Object.entries(colorMap).map(([label, colorArray]) => {
                                                    const currentColor = `rgb(${(colorArray as number[]).join(",")})` || "#ffffff";

                                                    return (
                                                        <div key={label} className="flex items-center space-x-2">
                                                            <Input type="text" value={label} readOnly className="w-1/3" />
                                                            <Popover modal={true}>
                                                                <PopoverTrigger>
                                                                    <div
                                                                        className="w-8 h-8 rounded-full border border-gray-300 cursor-pointer"
                                                                        style={{ backgroundColor: currentColor }}
                                                                    />
                                                                </PopoverTrigger>
                                                                <PopoverContent align="start" className="p-2" onPointerDownCapture={(e) => e.stopPropagation()}>
                                                                    <HexColorPicker
                                                                        color={currentColor}
                                                                        onChange={(newColor) => handleColorChange(label, newColor)}
                                                                    />
                                                                </PopoverContent>
                                                            </Popover>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="visualizer.class_label_to_display_name_map"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Class Label to Display Name Map</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="Enter Class Label to Display Name Map"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </>
                    )}
                </>
            )}
        </>
    );
}

export default InferenceTaskSettings;