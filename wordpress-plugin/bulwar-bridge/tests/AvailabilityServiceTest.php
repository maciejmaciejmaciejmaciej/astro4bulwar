<?php

declare(strict_types=1);

if (! function_exists('wp_json_encode')) {
    function wp_json_encode($value)
    {
        return json_encode($value, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    }
}

if (! function_exists('wp_salt')) {
    function wp_salt($scheme = 'auth')
    {
        return 'bulwar-bridge-test-salt';
    }
}

require_once __DIR__ . '/../src/Slots/AvailabilityService.php';

use BulwarBridge\Slots\AvailabilityService;

function assertSameValue($expected, $actual, string $message): void
{
    if ($expected !== $actual) {
        throw new RuntimeException($message . '\nExpected: ' . var_export($expected, true) . '\nActual: ' . var_export($actual, true));
    }
}

function assertTrueValue(bool $condition, string $message): void
{
    if (! $condition) {
        throw new RuntimeException($message);
    }
}

function buildScheduleConfig(): array
{
    return [
        'version' => 'test-v2',
        'timezone' => 'Europe/Warsaw',
        'defaultIntervalMinutes' => 15,
        'modes' => [
            'delivery' => [
                'defaultCapacity' => 1,
                'dates' => [
                    [
                        'date' => '2026-03-24',
                        'windows' => [
                            ['start' => '10:00', 'end' => '10:45'],
                        ],
                    ],
                    [
                        'date' => '2026-03-25',
                        'enabled' => true,
                        'intervalMinutes' => 30,
                        'defaultCapacity' => 2,
                        'windows' => [
                            ['start' => '12:00', 'end' => '13:00'],
                        ],
                    ],
                ],
                'blackouts' => [
                    [
                        'date' => '2026-03-24',
                        'windows' => [
                            ['start' => '10:15', 'end' => '10:30'],
                        ],
                    ],
                ],
                'overrides' => [],
            ],
            'pickup' => [
                'defaultCapacity' => 3,
                'dates' => [
                    [
                        'date' => '2026-03-24',
                        'windows' => [
                            ['start' => '10:00', 'end' => '10:30'],
                        ],
                    ],
                ],
                'blackouts' => [],
                'overrides' => [],
            ],
        ],
    ];
}

function createConfigFile(): string
{
    $path = sys_get_temp_dir() . '/bulwar-bridge-slots-test-' . uniqid('', true) . '.json';
    file_put_contents($path, json_encode(buildScheduleConfig(), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

    return $path;
}

function testDeliveryAvailabilityFiltersBlackoutsAndExhaustedSlots(): void
{
    $configPath = createConfigFile();

    $occupancyResolver = static function (string $fulfillmentType, string $date, string $slotLabel): int {
        $occupancy = [
            'delivery|2026-03-24|10:00-10:15' => 0,
            'delivery|2026-03-24|10:30-10:45' => 1,
        ];

        return $occupancy[$fulfillmentType . '|' . $date . '|' . $slotLabel] ?? 0;
    };

    $service = new AvailabilityService(
        $configPath,
        [
            'slotConfigVersion' => 'test-v2',
            'slotTokenTtlMinutes' => 10,
            'timezone' => 'Europe/Warsaw',
        ],
        $occupancyResolver,
        new DateTimeImmutable('2026-03-24T08:00:00+00:00')
    );

    $result = $service->getAvailability('delivery', '2026-03-24', 1, 'quote-token-123');
    $dates = $result['data']['available_dates'];

    assertSameValue(1, count($dates), 'Delivery should return one available date.');
    assertSameValue('2026-03-24', $dates[0]['date'], 'Delivery date should match request window.');
    assertSameValue(1, count($dates[0]['slots']), 'Only one delivery slot should remain after blackout and occupancy filtering.');
    assertSameValue('10:00-10:15', $dates[0]['slots'][0]['label'], 'The remaining delivery slot should be the first slot.');
    assertSameValue(1, $dates[0]['slots'][0]['remaining_capacity'], 'Delivery remaining capacity should reflect default capacity minus occupancy.');
    assertTrueValue(str_starts_with($dates[0]['slots'][0]['slot_token'], 'bs_'), 'Delivery slot token should use bridge-owned prefix.');
    assertSameValue('config_only', $result['meta']['occupancy_source'], 'Current test wiring should expose config-only occupancy source.');
}

function testPickupAndExplicitDatesUseSeparatePoolsAndDefaults(): void
{
    $configPath = createConfigFile();

    $occupancyResolver = static function (string $fulfillmentType, string $date, string $slotLabel): int {
        $occupancy = [
            'pickup|2026-03-24|10:00-10:15' => 2,
        ];

        return $occupancy[$fulfillmentType . '|' . $date . '|' . $slotLabel] ?? 0;
    };

    $service = new AvailabilityService(
        $configPath,
        [
            'slotConfigVersion' => 'test-v2',
            'slotTokenTtlMinutes' => 10,
            'timezone' => 'Europe/Warsaw',
        ],
        $occupancyResolver,
        new DateTimeImmutable('2026-03-24T08:00:00+00:00')
    );

    $pickupResult = $service->getAvailability('pickup', '2026-03-24', 2, null);
    $pickupDates = $pickupResult['data']['available_dates'];

    assertSameValue(1, count($pickupDates), 'Pickup should return only explicitly configured dates.');
    assertSameValue('2026-03-24', $pickupDates[0]['date'], 'Pickup should keep the explicitly configured date.');
    assertSameValue(2, count($pickupDates[0]['slots']), 'Pickup should generate two 15-minute slots from the configured window.');
    assertSameValue(1, $pickupDates[0]['slots'][0]['remaining_capacity'], 'Pickup should use the default capacity of three orders per slot.');

    $deliveryDateResult = $service->getAvailability('delivery', '2026-03-25', 1, 'quote-token-123');
    $overrideSlots = $deliveryDateResult['data']['available_dates'][0]['slots'];

    assertSameValue(2, count($overrideSlots), 'Delivery should generate two 30-minute slots from the explicit date config.');
    assertSameValue('12:00-12:30', $overrideSlots[0]['label'], 'Delivery should use the explicit date windows.');
    assertSameValue(2, $overrideSlots[0]['remaining_capacity'], 'Delivery should use the explicit date capacity.');
}

testDeliveryAvailabilityFiltersBlackoutsAndExhaustedSlots();
testPickupAndExplicitDatesUseSeparatePoolsAndDefaults();

echo "AvailabilityService tests passed\n";