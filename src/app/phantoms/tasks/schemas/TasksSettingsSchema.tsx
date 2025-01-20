import { z } from "zod";
import { TaskTypes } from "../types/TaskTypes";

// Base Strategy Schema
const BaseStrategySchema = z.object({
  strategy_type: z.string(),
  filters: z.array(
    z.object({
      filter: z.object({
        filter_type: z.string(),
        indices: z.array(z.number()),
      }),
    })
  ),
  condition: z.object({
    condition: z.object({
      condition_type: z.string(),
    }),
  }),
});

// Presence Strategy Schema
const PresenceStrategySchema = BaseStrategySchema.extend({});

// Inside Region Strategy Schema
const InsideRegionStrategySchema = BaseStrategySchema.extend({
  region_id: z.string(),
});

// Outside Region Strategy Schema
const OutsideRegionStrategySchema = BaseStrategySchema.extend({
  region_id: z.string(),
});

// Keypoint Task Schema
const KeypointTaskSchema = z.object({
  component_type: z.literal("KEYPOINT"),
  reference_component_id: z.string(),
  strategy: z.union([PresenceStrategySchema, InsideRegionStrategySchema]),
});

// Label Checking Strategy Model Schema
const LabelCheckingStrategyModelSchema = z.object({
  strategy_type: z.string(),
  label: z.string(),
});

// IO Mapping Checking Strategy Model Schema
const IOMappingCheckingStrategyModelSchema = z.object({
  strategy_type: z.string(),
  io_mapping: z.record(z.string(), z.array(z.boolean())),
});

// Classification Task Schema
const ClassificationTaskSchema = z.object({
  component_type: z.literal("CLASSIFICATION"),
  reference_component_id: z.string(),
  strategy: z.union([LabelCheckingStrategyModelSchema, IOMappingCheckingStrategyModelSchema]),
});

// Inference Checking Task Schema
const InferenceCheckingTaskSchema = z.object({
  component_type: z.literal("INFERENCE"),
  component: z.union([KeypointTaskSchema, ClassificationTaskSchema]),
});

// Checking Task Schema
const CheckingTaskSchema = z.object({
  component_type: z.literal("CHECKING"),
  component: InferenceCheckingTaskSchema,
});

// Task Structure Schema
const TaskStructureSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(TaskTypes),
  specific_type: z.string(),
});

export const TasksSchema = z.union([
  TaskStructureSchema,
  CheckingTaskSchema,
  KeypointTaskSchema,
  ClassificationTaskSchema,
]);
