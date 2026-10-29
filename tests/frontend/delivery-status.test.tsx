import { router } from '@inertiajs/react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import DeliveryStatusSelect from '../../resources/js/components/DeliveryStatusSelect';

describe('delivery status control', () => {
    it('sends a status update and prevents duplicate submissions while saving', async () => {
        const patch = vi.spyOn(router, 'patch').mockImplementation(() => {});
        const user = userEvent.setup();
        render(<DeliveryStatusSelect deliveryId={12} status="pending" />);

        await user.selectOptions(screen.getByRole('combobox'), 'in_transit');

        expect(patch).toHaveBeenCalledWith('/deliveries/12/status', { status: 'in_transit' }, expect.any(Object));
        expect(screen.getByRole('combobox')).toBeDisabled();
        expect(screen.getByRole('status')).toHaveTextContent('Saving status');

        const options = patch.mock.calls[0][2]!;
        act(() => {
            options.onSuccess?.({} as never);
            options.onFinish?.({} as never);
        });
        expect(screen.getByRole('combobox')).toBeEnabled();
        expect(screen.getByRole('status')).toHaveTextContent('Status updated.');
    });

    it('shows server validation feedback and allows retrying', async () => {
        const patch = vi.spyOn(router, 'patch').mockImplementation(() => {});
        render(<DeliveryStatusSelect deliveryId={12} status="pending" />);
        await userEvent.setup().selectOptions(screen.getByRole('combobox'), 'assigned');

        const options = patch.mock.calls[0][2]!;
        act(() => {
            options.onError?.({ status: 'This status is unavailable.' });
            options.onFinish?.({} as never);
        });
        expect(screen.getByRole('alert')).toHaveTextContent('This status is unavailable.');
        expect(screen.getByRole('combobox')).toBeEnabled();
        expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
    });
});
