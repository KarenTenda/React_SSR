import { z } from 'zod';
import { PinSchema } from './PinSchema';

export const NodeSchema = z.object({
    id: z.string(),               
    name: z.string(),             
    position: z.tuple([z.number(), z.number()]),
    width: z.number().optional(),  
    pins: z.array(PinSchema),  
    backgroundColor: z.string().optional(),  
    content: z.string().optional(), 
    nodeType: z.enum(['default', 'operation', 'dataProcessing']).optional(),     
});
  
export type Node = z.infer<typeof NodeSchema>;
  