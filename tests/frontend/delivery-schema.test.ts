import { describe, expect, it } from 'vitest';
import { deliverySchema } from '../../resources/js/schemas/delivery';

const valid = { customer_name: 'Alex', delivery_address: '120 Market Street' };

describe('delivery validation', () => {
    it('trims valid input before submission', () => {
        expect(deliverySchema.parse({ customer_name: ' Alex ', delivery_address: ' Market Street ' }))
            .toEqual({ customer_name: 'Alex', delivery_address: 'Market Street' });
    });

    it.each([
        { ...valid, customer_name: '' },
        { ...valid, customer_name: '   ' },
        { ...valid, customer_name: 'A'.repeat(101) },
        { ...valid, delivery_address: '' },
        { ...valid, delivery_address: '   ' },
        { ...valid, delivery_address: 'A'.repeat(256) },
    ])('rejects invalid input %#', (input) => {
        expect(deliverySchema.safeParse(input).success).toBe(false);
    });

    it('accepts the maximum field lengths', () => {
        expect(deliverySchema.safeParse({ customer_name: 'A'.repeat(100), delivery_address: 'B'.repeat(255) }).success).toBe(true);
    });
});
