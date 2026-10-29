import { router } from '@inertiajs/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Dashboard from '../../resources/js/pages/Dashboard';

vi.mock('@inertiajs/react', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@inertiajs/react')>();
    return { ...actual, Head: () => null };
});

const deliveries = [
    { id: 1, customer_name: 'Alex Morgan', delivery_address: 'Market Street', status: 'pending' as const },
    { id: 2, customer_name: 'Jamie Chen', delivery_address: 'Ocean Avenue', status: 'delivered' as const },
];

describe('delivery dashboard', () => {
    it('filters deliveries by customer and status', async () => {
        const user = userEvent.setup();
        render(<Dashboard deliveries={deliveries} />);
        await user.type(screen.getByRole('searchbox'), 'ALEX');
        expect(screen.getByRole('heading', { name: 'Alex Morgan' })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'Jamie Chen' })).not.toBeInTheDocument();
        await user.clear(screen.getByRole('searchbox'));
        await user.click(screen.getByRole('button', { name: 'Delivered' }));
        expect(screen.queryByRole('heading', { name: 'Alex Morgan' })).not.toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Jamie Chen' })).toBeInTheDocument();
    });

    it('shows client validation and does not send invalid data', async () => {
        const post = vi.spyOn(router, 'post').mockImplementation(() => {});
        render(<Dashboard deliveries={[]} />);
        await userEvent.setup().click(screen.getByRole('button', { name: /Create delivery/ }));
        expect(await screen.findByText('Enter the customer name.')).toBeInTheDocument();
        expect(screen.getByText('Enter the delivery address.')).toBeInTheDocument();
        expect(screen.getByLabelText('Customer name')).toHaveFocus();
        expect(post).not.toHaveBeenCalled();
    });

    it('submits trimmed valid data to the delivery endpoint', async () => {
        const post = vi.spyOn(router, 'post').mockImplementation(() => {});
        const user = userEvent.setup();
        render(<Dashboard deliveries={[]} />);
        await user.type(screen.getByLabelText('Customer name'), ' Alex ');
        await user.type(screen.getByLabelText('Delivery address'), ' Market Street ');
        await user.click(screen.getByRole('button', { name: /Create delivery/ }));
        expect(post).toHaveBeenCalledWith('/deliveries', { customer_name: 'Alex', delivery_address: 'Market Street' }, expect.any(Object));
    });
});
