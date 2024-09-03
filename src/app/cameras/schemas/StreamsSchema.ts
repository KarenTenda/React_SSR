import { z } from "zod";
import { v4 as uuidv4 } from 'uuid';

// Define Zod schemas for operation settings based on backend operation settings
const ImageFlipOperationSettings = z.object({
  // Define your fields here based on ImageFlipOperationSettings in backend
});

const ImageRotateOperationSettings = z.object({
  // Define your fields here based on ImageRotateOperationSettings in backend
});

const ImageResizeOperationSettings = z.object({
  // Define your fields here based on ImageResizeOperationSettings in backend
});

const ImageCircleCropOperationSettings = z.object({
  // Define your fields here based on ImageCircleCropOperationSettings in backend
});

const ImageSquareCropOperationSettings = z.object({
  // Define your fields here based on ImageSquareCropOperationSettings in backend
});

const ImagePolygonCropOperationSettings = z.object({
  // Define your fields here based on ImagePolygonCropOperationSettings in backend
});

const ImageRectangleCropOperationSettings = z.object({
  // Define your fields here based on ImageRectangleCropOperationSettings in backend
});

const ImageCenterCropOperationSettings = z.object({
  // Define your fields here based on ImageCenterCropOperationSettings in backend
});

const OpencvImageDedistortionOperationSettings = z.object({
  // Define your fields here based on OpencvImageDedistortionOperationSettings in backend
});

// Create a union type for OperationSettingsUnion
const OperationSettingsUnion = z.union([
  ImageFlipOperationSettings,
  ImageRotateOperationSettings,
  ImageResizeOperationSettings,
  ImageCircleCropOperationSettings,
  ImageSquareCropOperationSettings,
  ImagePolygonCropOperationSettings,
  ImageRectangleCropOperationSettings,
  ImageCenterCropOperationSettings,
  OpencvImageDedistortionOperationSettings,
]);

// Define StreamProperties schema
const StreamPropertiesSchema = z.object({
  frame_rate: z.number().nullable().optional(),
});

const ImageProcessingSettingsSchema = z.object({
  operations: z.array(OperationSettingsUnion).default([]).describe("List of operations to apply to the image"),
  track_history: z.boolean().default(false).describe("Flag to track the processing history"),
  enabled: z.boolean().default(true).describe("Flag to enable or disable image processing"),
});

const StreamSettingsSchema = z.object({
  stream_id: z.string().uuid().default(() => String(uuidv4())),
  properties: StreamPropertiesSchema,
  processing: ImageProcessingSettingsSchema,
});

const StreamSchema = z.object({
  id: z.string(),
  camera: z.string(),
  publisher: z.string(),
  name: z.string(),
  enabled: z.boolean(),
  settings: StreamSettingsSchema,
});

export type StreamProperties = z.infer<typeof StreamPropertiesSchema>;
export type ImageProcessingSettings = z.infer<typeof ImageProcessingSettingsSchema>;
export type StreamSettings = z.infer<typeof StreamSettingsSchema>;

export type Stream = z.infer<typeof StreamSchema>;

export {
  StreamSchema,
  StreamPropertiesSchema,
  ImageProcessingSettingsSchema,
  StreamSettingsSchema,
};
