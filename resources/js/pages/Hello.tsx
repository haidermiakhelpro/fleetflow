import { Head } from '@inertiajs/react';
import { useState } from 'react';

type Props = { message: string };

export default function Hello({ message }: Props) {
    const [count, setCount] = useState(0);

    return (
        <main className='bg-indigo-900'>
            <Head title="My application" />
            <h1 className='text text-bold text-white'>{message}</h1>
            <p>Laravel + React 19 + TypeScript + Inertia</p>
            <h2>I'm strong enough</h2>
            asfasf
            <br />
            <h1>Working</h1>
            <br />

            <button onClick={() => setCount(count + 1)}>
                Clicked {count} times
            </button>
        </main>
    );
}