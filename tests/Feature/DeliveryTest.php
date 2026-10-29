<?php

namespace Tests\Feature;

use Database\Factories\DeliveryFactory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\DataProvider;
use RuntimeException;
use Tests\TestCase;

class DeliveryTest extends TestCase
{
    use RefreshDatabase {
        refreshDatabase as protected refreshIsolatedDatabase;
    }

    public function refreshDatabase(): void
    {
        if (! app()->environment('testing')
            || config('database.default') !== 'sqlite'
            || config('database.connections.sqlite.database') !== ':memory:'
            || ! empty(config('database.connections.sqlite.url'))) {
            throw new RuntimeException('Delivery tests require isolated SQLite :memory: storage.');
        }

        $this->refreshIsolatedDatabase();
    }

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    public function test_dashboard_exposes_deliveries_newest_first(): void
    {
        $older = DeliveryFactory::new()->create(['customer_name' => 'Older customer']);
        $newer = DeliveryFactory::new()->create(['customer_name' => 'Newer customer']);

        $this->get(route('deliveries.index'))->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard')
                ->has('deliveries', 2)
                ->where('deliveries.0.id', $newer->id)
                ->where('deliveries.0.customer_name', 'Newer customer')
                ->where('deliveries.1.id', $older->id));
    }

    public function test_valid_delivery_is_saved_with_pending_status(): void
    {
        $this->post(route('deliveries.store'), [
            'customer_name' => 'Alex Morgan',
            'delivery_address' => '120 Market Street',
            'status' => 'delivered',
        ])->assertSessionHasNoErrors()->assertRedirect(route('deliveries.index'));

        $this->assertDatabaseCount('deliveries', 1);
        $this->assertDatabaseHas('deliveries', [
            'customer_name' => 'Alex Morgan',
            'delivery_address' => '120 Market Street',
            'status' => 'pending',
        ]);
    }

    #[DataProvider('invalidDeliveries')]
    public function test_invalid_delivery_is_not_saved(array $input, array $errors): void
    {
        $this->from(route('deliveries.index'))->post(route('deliveries.store'), $input)
            ->assertRedirect(route('deliveries.index'))->assertSessionHasErrors($errors);

        $this->assertDatabaseCount('deliveries', 0);
    }

    public static function invalidDeliveries(): array
    {
        return [
            'missing fields' => [[], ['customer_name', 'delivery_address']],
            'whitespace' => [['customer_name' => '   ', 'delivery_address' => '   '], ['customer_name', 'delivery_address']],
            'long name' => [['customer_name' => str_repeat('A', 101), 'delivery_address' => 'Market Street'], ['customer_name']],
            'long address' => [['customer_name' => 'Alex', 'delivery_address' => str_repeat('A', 256)], ['delivery_address']],
        ];
    }

    #[DataProvider('supportedStatuses')]
    public function test_supported_status_is_saved(string $status): void
    {
        $delivery = DeliveryFactory::new()->create();
        $other = DeliveryFactory::new()->create();

        $this->patch(route('deliveries.status', $delivery), ['status' => $status])
            ->assertSessionHasNoErrors()->assertRedirect(route('deliveries.index'));

        $this->assertDatabaseHas('deliveries', ['id' => $delivery->id, 'status' => $status]);
        $this->assertDatabaseHas('deliveries', ['id' => $other->id, 'status' => 'pending']);
    }

    public static function supportedStatuses(): array
    {
        return [['pending'], ['assigned'], ['in_transit'], ['delivered']];
    }

    public function test_unknown_status_does_not_change_delivery(): void
    {
        $delivery = DeliveryFactory::new()->create();

        $this->from(route('deliveries.index'))
            ->patch(route('deliveries.status', $delivery), ['status' => 'teleported'])
            ->assertSessionHasErrors('status');

        $this->assertDatabaseHas('deliveries', ['id' => $delivery->id, 'status' => 'pending']);
    }

    public function test_missing_delivery_returns_not_found(): void
    {
        $this->patch(route('deliveries.status', 999999), ['status' => 'delivered'])->assertNotFound();
    }
}
