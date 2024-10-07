import { z } from 'zod';
import { NodeSchema } from './NodeSchema';
import { EdgeSchema } from './EdgeSchema';

export const GraphSchema = z.object({
    nodes: z.array(NodeSchema), 
    links: z.array(EdgeSchema), 
});

export type NodeEditor = z.infer<typeof GraphSchema>;
  