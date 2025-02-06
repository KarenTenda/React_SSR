// Form schema
import { z } from 'zod';

const NodeZodSchema = z.object({
    id: z.string(),
    type: z.string().optional(),
    data: z.object({
        label: z.string()
    }),
    position: z.object({
        x: z.number(),
        y: z.number()
    })
});

const EdgeZodSchema = z.object({
    id: z.string(),
    source: z.string(),
    target: z.string(),
    animated: z.boolean().optional()
});

export const GraphZodSchema = z.object({
    graph_id: z.string().min(1, 'Required'),
    name: z.string().min(1, 'Required'),
    description: z.string().min(1, 'Required'),
    nodes: z.array(NodeZodSchema),
    edges: z.array(EdgeZodSchema)
});



