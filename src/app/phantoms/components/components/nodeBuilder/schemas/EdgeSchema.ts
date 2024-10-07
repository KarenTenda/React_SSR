import { z } from 'zod';

export const EdgeSchema = z.object({
    id: z.string(),               
    sourceNodeId: z.string(),      
    sourcePinId: z.string(),      
    targetNodeId: z.string(),      
    targetPinId: z.string(),       
});
  
export type Link = z.infer<typeof EdgeSchema>;
  