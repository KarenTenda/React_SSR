import { z } from "zod";

const LensSchema = z.object({
  lens_type: z.string(),
  mount_type: z.string(),
  interchangeable: z.boolean(),
  aperture: z.string(),
  manufacturer: z.string(),
  model: z.string(),
  serial_number: z.string(),
  part_number: z.string(),
});

const SourceSchema = z.object({
  source_type: z.string(),
  source_string: z.string(),
  exclusive: z.boolean(),
  usb_source_type: z.string().nullable(),
});

const RuntimePropertiesSchema = z.object({
  brightness: z.number().nullable(),
  contrast: z.number().nullable(),
  exposure: z.number(),
  frame_rate: z.number(),
  gain: z.number().nullable(),
  height: z.number(),
  hue: z.number().nullable(),
  saturation: z.number().nullable(),
  width: z.number(),
  encoding: z.string(),
});

const DriverSchema = z.object({
  driver_type: z.string(),
  image_format: z.string(),
  initialize: z.object({
    backend: z.number(),
    source: SourceSchema,
    runtime: z.object({
      properties: RuntimePropertiesSchema,
    }),
  }),
});

const CameraSchema = z.object({
  manufacturer: z.string(),
  model: z.string(),
  serial_number: z.string(),
  part_number: z.string(),
  image_format: z.string(),
  lens: LensSchema,
  camera_type: z.string(),
  mode: z.string(),
  driver: DriverSchema,
});

const CameraSettingsSchema = z.object({
  camera: CameraSchema,
});

const BackendSettingsSchema = z.object({
  id: z.string(),
  name: z.string(),
  enabled: z.boolean(),
  settings: CameraSettingsSchema,
  streams: z.array(z.any()), 
});

export const BackendSettingsMapSchema = z.record(BackendSettingsSchema);
