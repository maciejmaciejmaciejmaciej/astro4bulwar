<?php

declare(strict_types=1);

require_once __DIR__ . '/../src/Config/Constants.php';
require_once __DIR__ . '/../src/Checkout/MakeWebhookNotifier.php';

use BulwarBridge\Config\Constants;
use BulwarBridge\Checkout\MakeWebhookNotifier;

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

final class FakeOrderItem
{
    private string $name;
    private int $quantity;
    private float $total;

    public function __construct(string $name, int $quantity, float $total)
    {
        $this->name = $name;
        $this->quantity = $quantity;
        $this->total = $total;
    }

    public function get_name(): string
    {
        return $this->name;
    }

    public function get_quantity(): int
    {
        return $this->quantity;
    }

    public function get_total(): float
    {
        return $this->total;
    }
}

final class FakeFeeItem
{
    private string $name;
    private float $total;

    public function __construct(string $name, float $total)
    {
        $this->name = $name;
        $this->total = $total;
    }

    public function get_name(): string
    {
        return $this->name;
    }

    public function get_total(): float
    {
        return $this->total;
    }
}

final class FakeOrder
{
    /** @var array<string, mixed> */
    private array $meta;

    /** @var array<int, mixed> */
    private array $items;

    /** @var array<int, mixed> */
    private array $fees;

    private int $id;
    private string $orderNumber;
    private float $total;
    private string $currency;
    private int $saveMetaCalls = 0;

    /**
     * @param array<string, mixed> $meta
     * @param array<int, mixed> $items
     * @param array<int, mixed> $fees
     */
    public function __construct(int $id, string $orderNumber, float $total, string $currency, array $meta, array $items, array $fees = [])
    {
        $this->id = $id;
        $this->orderNumber = $orderNumber;
        $this->total = $total;
        $this->currency = $currency;
        $this->meta = $meta;
        $this->items = $items;
        $this->fees = $fees;
    }

    public function get_id(): int
    {
        return $this->id;
    }

    public function get_order_number(): string
    {
        return $this->orderNumber;
    }

    public function get_currency(): string
    {
        return $this->currency;
    }

    public function get_total(): float
    {
        return $this->total;
    }

    public function get_meta(string $key, bool $single = true)
    {
        unset($single);

        return $this->meta[$key] ?? '';
    }

    /**
     * @return array<int, mixed>
     */
    public function get_items(string $type = 'line_item'): array
    {
        if ($type === 'fee') {
            return $this->fees;
        }

        return $this->items;
    }

    public function update_meta_data(string $key, $value): void
    {
        $this->meta[$key] = $value;
    }

    public function save_meta_data(): void
    {
        $this->saveMetaCalls++;
    }

    /** @return array<string, mixed> */
    public function meta(): array
    {
        return $this->meta;
    }

    public function save_meta_calls(): int
    {
        return $this->saveMetaCalls;
    }
}

function buildFakeOrder(): FakeOrder
{
    return new FakeOrder(
        321,
        '321',
        54.50,
        'PLN',
        [
            '_bulwar_fulfillment_type' => 'delivery',
            '_bulwar_slot_start_at' => '2026-03-25T11:30:00+00:00',
            '_bulwar_slot_end_at' => '2026-03-25T12:00:00+00:00',
            'billing_email' => 'secret@example.com',
            'billing_phone' => '+48123123123',
            'shipping_address_1' => 'ul. Testowa 1',
            'customer_note' => 'domofon 12',
        ],
        [
            new FakeOrderItem('Zestaw <b>Lunch</b>', 2, 39.00),
            new FakeOrderItem('Zupa dnia', 1, 9.50),
        ],
        [
            new FakeFeeItem('Dostawa', 6.00),
        ]
    );
}

function testFormatterBuildsMinimalSanitizedPayload(): void
{
    $order = buildFakeOrder();
    $notifier = new MakeWebhookNotifier('https://hook.example.test/webhook', 'Europe/Warsaw');

    $payload = $notifier->formatPayload($order);

    assertSameValue(['order_id', 'text_long_string'], array_keys($payload), 'Payload must keep the exact required shape.');
    assertSameValue(321, $payload['order_id'], 'Payload order_id should match the saved order ID.');
    assertTrueValue(str_contains($payload['text_long_string'], 'Zamowienie #321'), 'Summary should include the order number.');
    assertTrueValue(str_contains($payload['text_long_string'], 'Realizacja: Dostawa'), 'Summary should include fulfillment type.');
    assertTrueValue(str_contains($payload['text_long_string'], 'Termin: 2026-03-25 12:30-13:00'), 'Summary should include localized slot date and time.');
    assertTrueValue(str_contains($payload['text_long_string'], 'Zestaw Lunch'), 'Summary should sanitize product HTML tags.');
    assertTrueValue(str_contains($payload['text_long_string'], '2 x 19.50 PLN = 39.00 PLN'), 'Summary should include quantities and prices.');
    assertTrueValue(str_contains($payload['text_long_string'], 'Dodatkowe oplaty'), 'Summary should include saved fee lines when present.');
    assertTrueValue(str_contains($payload['text_long_string'], 'Suma: 54.50 PLN'), 'Summary should include order total.');
    assertTrueValue(! str_contains($payload['text_long_string'], 'secret@example.com'), 'Summary must exclude email.');
    assertTrueValue(! str_contains($payload['text_long_string'], '+48123123123'), 'Summary must exclude phone.');
    assertTrueValue(! str_contains($payload['text_long_string'], 'Testowa'), 'Summary must exclude address.');
    assertTrueValue(! str_contains($payload['text_long_string'], 'domofon'), 'Summary must exclude customer note.');
}

function testDefaultWebhookConfigurationIsEmptyAndDisabled(): void
{
    $config = Constants::all();
    assertSameValue('', $config['makeWebhookUrl'], 'Repository defaults must not contain a live Make webhook URL.');

    $order = buildFakeOrder();
    $calls = 0;
    $notifier = new MakeWebhookNotifier(
        null,
        'Europe/Warsaw',
        static function (string $url, array $args) use (&$calls): array {
            unset($url, $args);
            $calls++;

            return ['response' => ['code' => 200]];
        }
    );

    $notifier->send($order);

    assertSameValue(0, $calls, 'Notifier must stay disabled until the webhook URL is provided server-side.');
}

function testNotifierSkipsDuplicateSendWhenMarkerExists(): void
{
    $order = buildFakeOrder();
    $order->update_meta_data(MakeWebhookNotifier::SENT_AT_META_KEY, '2026-03-25T10:00:00Z');
    $calls = 0;

    $notifier = new MakeWebhookNotifier(
        'https://hook.example.test/webhook',
        'Europe/Warsaw',
        static function (string $url, array $args) use (&$calls): array {
            unset($url, $args);
            $calls++;

            return ['response' => ['code' => 200]];
        }
    );

    $notifier->send($order);

    assertSameValue(0, $calls, 'Notifier should not re-send when the sent marker already exists.');
}

function testNotifierRecordsFailureWithoutThrowing(): void
{
    $order = buildFakeOrder();
    $logs = [];

    $notifier = new MakeWebhookNotifier(
        'https://hook.example.test/webhook',
        'Europe/Warsaw',
        static function (string $url, array $args): array {
            unset($url, $args);

            return ['response' => ['code' => 502]];
        },
        static function (string $message) use (&$logs): void {
            $logs[] = $message;
        }
    );

    $notifier->send($order);
    $meta = $order->meta();

    assertTrueValue(isset($meta[MakeWebhookNotifier::LAST_ERROR_META_KEY]), 'Notifier should persist the last webhook failure.');
    assertTrueValue(! isset($meta[MakeWebhookNotifier::SENT_AT_META_KEY]), 'Notifier should not set the sent marker on failure.');
    assertSameValue(1, $order->save_meta_calls(), 'Notifier should persist failure meta without touching checkout response flow.');
    assertTrueValue(count($logs) === 1, 'Notifier should emit one failure log entry.');
}

testFormatterBuildsMinimalSanitizedPayload();
testDefaultWebhookConfigurationIsEmptyAndDisabled();
testNotifierSkipsDuplicateSendWhenMarkerExists();
testNotifierRecordsFailureWithoutThrowing();

echo "MakeWebhookNotifier tests passed\n";