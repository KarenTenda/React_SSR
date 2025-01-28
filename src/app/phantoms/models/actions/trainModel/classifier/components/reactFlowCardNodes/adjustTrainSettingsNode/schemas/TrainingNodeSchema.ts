import { z } from "zod";

// Define the Zod schema for the training model settings
export const trainModelSchema = z.object({
  epochs: z
    .number()
    .min(1, { message: "Epochs must be at least 1" })
    .max(1000, { message: "Epochs cannot exceed 1000" }),
  learningRate: z
    .number()
    .min(0.0001, { message: "Learning rate must be at least 0.0001" })
    .max(1, { message: "Learning rate cannot exceed 1" }),
  batchSize: z
    .number()
    .min(1, { message: "Batch size must be at least 1" })
    .max(512, { message: "Batch size cannot exceed 512" }),
});

// Define the TypeScript type from the Zod schema
export type TrainModelSettings = z.infer<typeof trainModelSchema>;
