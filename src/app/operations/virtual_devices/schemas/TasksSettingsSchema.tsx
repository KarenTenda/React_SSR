import { z } from "zod";
import { InferenceSpecificTypes, TaskTypes, TrackingSpecificTypes } from "../types/TaskTypes";
import { CheckingSpecificTypes } from "../types/TaskTypes";
import { spec } from "node:test/reporters";

const ClientConfigSchema = z.object({
  adapter_id: z.string(),
  adapter_name: z.string(),
  host: z.string(),
  port: z.number(),
  timeout: z.number(),
});

const PipelineElementSchema = z.object({
  name: z.string(),
  parameters: z.record(z.any()),
});

const VisualizerConfigSchema = z.object({
  visualize: z.boolean(),
  show_confidence: z.boolean().optional(),
  show_class_label: z.boolean().optional(),
  class_label_to_color_map: z.record(z.array(z.number())).optional(),
  class_label_to_display_name_map: z.record(z.array(z.number())).optional(),
});

export const InferenceTaskSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(TaskTypes),
  specific_type: z.nativeEnum(InferenceSpecificTypes),
  camera_id: z.string(),
  client_config: ClientConfigSchema,
  result_processing_pipeline: z.array(PipelineElementSchema),
  id_assignment_model: z.object({
    value: z.string(),
  }),
  model_id: z.string(),
  reference_region_ids: z.array(z.string()),
  result_handler_model: z.object({
    handler_type: z.string(),
  }),
  adjust_keypoints_to_bbox: z.boolean().optional(),
  visualizer: VisualizerConfigSchema,
});

const CheckingConfigSchema = z.object({
  id: z.string(),
  reference_component_id: z.string(),
  reference_component_result_id: z.string(),
  target_label: z.string(),
  timeout: z.number().optional(),
});

export const CheckingTaskSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(TaskTypes),
  specific_type: z.nativeEnum(CheckingSpecificTypes),
  camera_id: z.string(),
  checking_configs: z.array(CheckingConfigSchema),
  result_handler_model: z.object({
    handler_type: z.string(),
  }),
});

const TrackingConfigSchema = z.object({
  id: z.string(),
  reference_component_id: z.string(),
  reference_component_result_id: z.string(),
  reference_component_sub_id: z.string(),
  target_component_id: z.string(),
  target_component_result_id: z.string(),
  target_component_result_sub_ids: z.array(z.string()),
});

export const TrackingTaskSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(TaskTypes),
  specific_type: z.nativeEnum(TrackingSpecificTypes),
  tracking_configs: z.array(TrackingConfigSchema),
  result_handler_model: z.object({
    handler_type: z.string(),
  }),
});



export type TaskSettings = z.infer<typeof InferenceTaskSchema | typeof CheckingTaskSchema | typeof TrackingTaskSchema>;
