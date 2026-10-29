<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DeliveryController;

Route::get('/', [DeliveryController::class, 'index'])
    ->name('deliveries.index');

Route::post('/deliveries', [DeliveryController::class, 'store'])
    ->name('deliveries.store');

    Route::patch('/deliveries/{delivery}/status', [DeliveryController::class, 'updateStatus'])->name('deliveries.status');


