import { z } from 'zod';

export const deliverySchema = z.object({
    customer_name: z
        .string()
        .trim()
        .min(1, 'Enter the customer name.')
        .max(100, 'Customer name must be 100 characters or fewer.'),

    delivery_address: z
        .string()
        .trim()
        .min(1, 'Enter the delivery address.')
        .max(255, 'Address must be 255 characters or fewer.'),
});

export type DeliveryInput = z.infer<typeof deliverySchema>;