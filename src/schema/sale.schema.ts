import { z } from 'zod';

export const saleSchema = z.object({
    productId: z.string().min(1),
    quantity: z.number().int().positive(),
});
