import { z } from "zod";

const CameraScheduledTaskType = z.enum([
  "ExposureCheck",
  "ConnectionCheck",
  "PropertyRandomizer",
  "PropertyModifier"
]);

const PropertyRandomizationStrategyType = z.enum([
  "interval",
  "list",
  "oscillation",
  "cycling"
]);

const Brightness_calculation_method = z.enum([
    "mean",
    "median",
    "min",
    "max"
]);

const ProprtyTypeAlias = z.number();

const SchedulerTriggerModel = z.object({
  trigger_type: z.string(), 
  trigger_details: z.object({}).optional(),
});

const CameraScheduledTaskModel = z.object({
  camera_id: z.string(),
  task_type: CameraScheduledTaskType,
  scheduler_trigger: SchedulerTriggerModel,
});

const CameraConnectionScheduledTaskModel = CameraScheduledTaskModel.extend({
  task_type: z.literal("ConnectionCheck"),
});

const IntervalStrategyModel = z.object({
  strategy_type: z.literal("interval"),
  min_value: z.number(),
  max_value: z.number(),
});

const ListStrategyModel = z.object({
  strategy_type: z.literal("list"),
  value_list: z.array(ProprtyTypeAlias),
});

const OscillationStrategyModel = z.object({
  strategy_type: z.literal("oscillation"),
  min_value: z.number(),
  max_value: z.number(),
  delta: z.number(),
});

const CyclingStrategyModel = z.object({
  strategy_type: z.literal("cycling"),
  value_list: z.array(ProprtyTypeAlias),
});

const RandomizationStrategyModelAlias = z.union([
  IntervalStrategyModel,
  ListStrategyModel,
  OscillationStrategyModel,
  CyclingStrategyModel,
]);

const CameraPropertyRandomizerScheduledTaskModel = CameraScheduledTaskModel.extend({
  task_type: z.literal("PropertyRandomizer"),
  property_name: z.string(),
  property_type: z.string(),
  randomization_strategy: RandomizationStrategyModelAlias,
});

const CameraExposureScheduledTaskModel = CameraScheduledTaskModel.extend({
  task_type: z.literal("ExposureCheck"),
  crop_region: z.array(z.array(z.number())).optional(),
  brightness_calculation_method: Brightness_calculation_method,
  brightness_range: z.tuple([z.number(), z.number()]),
  exposure_delta: z.number(),
  exposure_range: z.tuple([z.number(), z.number()]),
  default_exposure: z.number(),
});

const CameraScheduledTaskModelAlias = z.union([
  CameraConnectionScheduledTaskModel,
  CameraPropertyRandomizerScheduledTaskModel,
  CameraExposureScheduledTaskModel,
]);

export {
  CameraScheduledTaskModelAlias,
  CameraScheduledTaskType,
  PropertyRandomizationStrategyType,
};

export type ScheduledTask = z.infer<typeof CameraScheduledTaskModelAlias>;
