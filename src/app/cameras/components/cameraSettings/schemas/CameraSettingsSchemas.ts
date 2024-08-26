
import { z } from "zod";

// Define the Zod schema for the training model settings
export const CameraSettingsSchema = z.object({
    id: z
        .string(),
    camera_type: z
        .string()
        .min(2, {
            message: "Type must be at least 2 characters.",
        }),
    source_type: z.string(),
    source: z.string(),
    name: z
        .string()
        .min(2, {
            message: "Name must be at least 2 characters.",
        }),
    enabled: z.boolean(),
    resolution: z.array(z.number())
        .length(2, {
            message: "Resolution must be an array of 2 numbers.",
        }),
    horizontal_flip: z.boolean(),
    vertical_flip: z.boolean(),
    centre_crop: z.boolean(),
    rotation_angle: z.number(),
    backend: z.number(),
    focus_mode: z.string().nullable(),
    focus_value: z.number().nullable(),
    exposure_mode: z.number().nullable(),
    exposure_time: z.number().nullable(),
    white_balance_mode: z.number().nullable(),
    white_balance_temperature: z.number().nullable(),
    power_line_frequency: z.number().nullable(),
    encoding: z.string().nullable(),
    rotation_mode: z.string().nullable(),
    zoom: z.number().nullable(),
    calibration_id: z.string().nullable(),
    scheduled_tasks: z.array(z.object({ id: z.string() })).nullable(),
    streams: z.array(z.string()).nullable(),
    
});

export type CameraSettings = z.infer<typeof CameraSettingsSchema>;
