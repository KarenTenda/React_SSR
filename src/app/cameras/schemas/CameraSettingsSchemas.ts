import { z } from "zod";
import { CameraScheduledTaskModelAlias } from "./ScheduledTasksModel";
import { Stream, StreamSchema } from "./StreamsSchema";


export const CameraSettingsSchema = z.object({
  id: z.string(),
  type: z.string().min(2, {
    message: "Type must be at least 2 characters.",
  }),
  source_type: z.string(), 
  source: z.union([z.string(), z.number()]), 
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  enabled: z.boolean(),
  resolution: z.array(z.number()).length(2, {
    message: "Resolution must be an array of 2 numbers.",
  }),
  horizontal_flip: z.boolean().nullable().optional(),
  vertical_flip: z.boolean().nullable().optional(),
  centre_crop: z.boolean().nullable().optional(),
  rotation_angle: z.number().nullable().optional(),
  backend: z.number(),
  focus_mode: z.string().nullable().optional(),
  manual_focus_value: z.number().nullable().optional(),
  exposure_mode: z.number().nullable().optional(),
  exposure_time: z.number().nullable().optional(),
  white_balance_mode: z.number().nullable().optional(),
  white_balance_temperature: z.number().nullable().optional(),
  power_line_frequency: z.number().nullable().optional(),
  encoding: z.string().nullable().optional(),
  rotation_mode: z.string().nullable().optional(),
  zoom: z.number().nullable().optional(),
  calibration_id: z.string().nullable().optional(),
  scheduled_tasks: z
  .array(CameraScheduledTaskModelAlias)
  .nullable()
  .optional(),
  streams: z
  .array(StreamSchema)
  .nullable()
  .optional(),
});

export type CameraSettings = z.infer<typeof CameraSettingsSchema>;
