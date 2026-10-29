import { Head, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { z } from 'zod';
import DeliveryStatusSelect, { type DeliveryStatus,
} from '../components/DeliveryStatusSelect';

import {
    deliverySchema,
    type DeliveryInput,
} from '../schemas/delivery';

type Delivery = DeliveryInput & {
    id: number;
    status: string;
};

type Props = {
    deliveries: Delivery[];
};

export default function Dashboard({ deliveries }: Props) {
    const customerRef = useRef<HTMLInputElement>(null);
    const addressRef = useRef<HTMLTextAreaElement>(null);
    const [notice, setNotice] = useState('');

    const form = useForm<DeliveryInput>({
        customer_name: '',
        delivery_address: '',
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (form.processing) return;

        setNotice('');
        form.clearErrors();

        const result = deliverySchema.safeParse(form.data);

        if (!result.success) {
            const errors = z.flattenError(result.error).fieldErrors;

            if (errors.customer_name?.[0]) {
                form.setError('customer_name', errors.customer_name[0]);
            }

            if (errors.delivery_address?.[0]) {
                form.setError(
                    'delivery_address',
                    errors.delivery_address[0],
                );
            }

            if (errors.customer_name) {
                customerRef.current?.focus();
            } else {
                addressRef.current?.focus();
            }

            return;
        }

        // Submit the trimmed values produced by Zod.
        form.transform(() => result.data);

        form.post('/deliveries', {
            preserveScroll: true,

            onSuccess: () => {
                form.reset();
                setNotice('Delivery saved successfully.');
                customerRef.current?.focus();
            },

            onError: () => {
                setNotice('The server rejected the form. Check the fields.');
            },
        });
    }

    return (
        <>
            <Head title="FleetFlow Deliveries" />

            <main className="min-h-screen bg-slate-100 p-6">
                <div className="mx-auto max-w-3xl space-y-8">
                    <header>
                        <h1 className="text-3xl font-bold">FleetFlow</h1>
                        <p className="mt-2 text-slate-600">
                            Create and manage deliveries.
                        </p>
                    </header>

                    <section className="rounded-xl bg-white p-6 shadow">
                        <h2 className="text-xl font-semibold">
                            New delivery
                        </h2>

                        {notice && (
                            <p
                                role="status"
                                className="mt-4 rounded-lg bg-slate-100 p-3"
                            >
                                {notice}
                            </p>
                        )}

                        <form
                            onSubmit={submit}
                            noValidate
                            className="mt-6 space-y-5"
                        >
                            <div>
                                <label
                                    htmlFor="customer_name"
                                    className="block font-medium"
                                >
                                    Customer name
                                </label>

                                <input
                                    ref={customerRef}
                                    id="customer_name"
                                    name="customer_name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    value={form.data.customer_name}
                                    onChange={(event) => {
                                        form.setData(
                                            'customer_name',
                                            event.target.value,
                                        );
                                        form.clearErrors('customer_name');
                                        setNotice('');
                                    }}
                                    aria-invalid={
                                        !!form.errors.customer_name
                                    }
                                    aria-describedby={
                                        form.errors.customer_name
                                            ? 'customer-error'
                                            : undefined
                                    }
                                    className="mt-1 w-full rounded-lg
                                               border border-slate-300 p-3
                                               focus:outline-blue-600"
                                />

                                {form.errors.customer_name && (
                                    <p
                                        id="customer-error"
                                        role="alert"
                                        className="mt-1 text-sm text-red-600"
                                    >
                                        {form.errors.customer_name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="delivery_address"
                                    className="block font-medium"
                                >
                                    Delivery address
                                </label>

                                <textarea
                                    ref={addressRef}
                                    id="delivery_address"
                                    name="delivery_address"
                                    autoComplete="street-address"
                                    required
                                    rows={3}
                                    value={form.data.delivery_address}
                                    onChange={(event) => {
                                        form.setData(
                                            'delivery_address',
                                            event.target.value,
                                        );
                                        form.clearErrors('delivery_address');
                                        setNotice('');
                                    }}
                                    aria-invalid={
                                        !!form.errors.delivery_address
                                    }
                                    aria-describedby={
                                        form.errors.delivery_address
                                            ? 'address-error'
                                            : undefined
                                    }
                                    className="mt-1 w-full rounded-lg
                                               border border-slate-300 p-3
                                               focus:outline-blue-600"
                                />

                                {form.errors.delivery_address && (
                                    <p
                                        id="address-error"
                                        role="alert"
                                        className="mt-1 text-sm text-red-600"
                                    >
                                        {form.errors.delivery_address}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={form.processing}
                                className="rounded-lg bg-blue-600
                                           px-5 py-3 font-medium text-white
                                           hover:bg-blue-700
                                           disabled:cursor-wait
                                           disabled:opacity-50"
                            >
                                {form.processing
                                    ? 'Saving…'
                                    : 'Save delivery'}
                            </button>
                        </form>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">
                            Deliveries ({deliveries.length})
                        </h2>

                        {deliveries.length === 0 ? (
                            <p className="mt-4 text-slate-600">
                                No deliveries yet.
                            </p>
                        ) : (
                            <ul className="mt-4 space-y-3">
                                {deliveries.map((delivery) => (
                                    <li
                                        key={delivery.id}
                                        className="rounded-xl bg-white p-5 shadow"
                                    >
                                        <h3 className="font-semibold">
                                            #{delivery.id} —{' '}
                                            {delivery.customer_name}
                                        </h3>

                                        <p className="mt-2 whitespace-pre-line">
                                            {delivery.delivery_address}
                                        </p>

                                        <p className="mt-2 text-sm text-slate-600">
                                            Status: {delivery.status}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </div>
            </main>
        </>
    );
}