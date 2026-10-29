import { router } from '@inertiajs/react';
import { useState } from 'react';

const statuses = [
    { value: 'pending', label: 'Pending' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'in_transit', label: 'In transit' },
    { value: 'delivered', label: 'Delivered' },
] as const;

export type DeliveryStatus =
    (typeof statuses)[number]['value'];

type Props = {
    deliveryId: number;
    status: DeliveryStatus;
};

export default function DeliveryStatusSelect({
    deliveryId,
    status,
}: Props) {
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');

    function updateStatus(nextStatus: string) {
        if (processing || nextStatus === status) return;

        setError('');
        setNotice('');
        setProcessing(true);

        router.patch(
            `/deliveries/${deliveryId}/status`,
            { status: nextStatus },
            {
                preserveScroll: true,

                onSuccess: () => {
                    setNotice('Status updated.');
                },

                onError: (errors) => {
                    setError(
                        errors.status ?? 'Unable to update status.',
                    );
                },

                onFinish: () => {
                    setProcessing(false);
                },
            },
        );
    }

    const fieldId = `delivery-status-${deliveryId}`;
    const errorId = `${fieldId}-error`;

    return (
        <div className="mt-4">
            <label
                htmlFor={fieldId}
                className="block text-sm font-medium text-slate-700"
            >
                Delivery status
            </label>

            <select
                id={fieldId}
                value={status}
                disabled={processing}
                onChange={(event) => updateStatus(event.target.value)}
                aria-invalid={!!error}
                aria-describedby={error ? errorId : undefined}
                className="mt-1 rounded-lg border border-slate-300
                           bg-white p-2 disabled:opacity-50"
            >
                {statuses.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            <p
                role="status"
                className="mt-1 text-sm text-slate-600"
            >
                {processing ? 'Saving status…' : notice}
            </p>

            {error && (
                <p
                    id={errorId}
                    role="alert"
                    className="mt-1 text-sm text-red-600"
                >
                    {error}
                </p>
            )}
        </div>
    );
}