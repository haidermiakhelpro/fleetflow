<?php

namespace App\Http\Controllers;

use App\Models\Delivery;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Requests\UpdateDeliveryStatusRequest;

class DeliveryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Dashboard', [
            'deliveries' => Delivery::query()
                ->latest('id')
                ->get([
                    'id',
                    'customer_name',
                    'delivery_address',
                    'status',
                ]),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'customer_name' => ['required', 'string', 'max:100'],
            'delivery_address' => ['required', 'string', 'max:255'],
        ]);

        Delivery::create($validated);

        return to_route('deliveries.index');
    }

    public function updateStatus(UpdateDeliveryStatusRequest $request, Delivery $delivery): RedirectResponse {
    $delivery->status = $request->validated('status');
    $delivery->save();

    return to_route('deliveries.index');
}

}