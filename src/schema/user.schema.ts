import { z } from 'zod';

export const createUserSchema = z.object({
    email: z.string().email({ message: "Invalid email format" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
    role: z.enum(['admin', 'cashier']).optional(),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;