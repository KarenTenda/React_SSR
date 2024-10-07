import { z } from 'zod';

export const zodUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.enum(['operator', 'supervisor', 'manager'], {
    required_error: 'Role is required',
  }),
});

export type UserFormSchema = z.infer<typeof zodUserSchema>;