import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';

createInertiaApp({
    pages: {
        path: './pages',
        extension: '.tsx',
    },
});