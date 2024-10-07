import { z } from 'zod';

export const PinSchema = z.object({
  id: z.string(),             
  label: z.string(),                
  type: z.enum(['input', 'output']), 
  position:z.enum(['top','bottom','left','right'])
});

export type Pin = z.infer<typeof PinSchema>;
