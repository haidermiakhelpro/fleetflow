<?php

namespace Database\Factories;

use App\Models\Delivery;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Delivery> */
class DeliveryFactory extends Factory
{
    protected $model = Delivery::class;

    public function definition(): array
    {
        return [
            'customer_name' => fake()->name(),
            'delivery_address' => fake()->streetAddress(),
            'status' => 'pending',
        ];
    }
}
