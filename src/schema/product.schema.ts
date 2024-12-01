import { z } from 'zod';

export const productSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    price: z.number().min(0),
    stock: z.number().int().min(0),
});

export const stockUpdateSchema = z.object({
    quantity: z.number().int(),
});
