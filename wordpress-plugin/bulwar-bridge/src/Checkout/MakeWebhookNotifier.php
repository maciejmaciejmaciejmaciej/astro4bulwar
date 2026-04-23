<?php

declare(strict_types=1);

namespace BulwarBridge\Checkout;

use BulwarBridge\Config\Constants;
use DateTimeImmutable;
use DateTimeZone;
use Throwable;

final class MakeWebhookNotifier
{
    public const SENT_AT_META_KEY = '_bulwar_make_webhook_sent_at';
    public const LAST_ERROR_META_KEY = '_bulwar_make_webhook_last_error';

    /** @var callable */
    private $httpPost;

    /** @var callable */
    private $logger;

    private string $webhookUrl;
    private string $timezone;

    public function __construct(?string $webhookUrl = null, ?string $timezone = null, ?callable $httpPost = null, ?callable $logger = null)
    {
        $config = Constants::all();

        $this->webhookUrl = trim((string) ($webhookUrl ?? ($config['makeWebhookUrl'] ?? '')));
        $this->timezone = (string) ($timezone ?? ($config['timezone'] ?? 'UTC'));
        $this->httpPost = $httpPost ?? static function (string $url, array $args) {
            return wp_remote_post($url, $args);
        };
        $this->logger = $logger ?? static function (string $message): void {
            error_log($message);
        };
    }

    /**
     * @return array{order_id:int,text_long_string:string}
     */
    public function formatPayload($order): array
    {
        return [
            'order_id' => (int) $order->get_id(),
            'text_long_string' => $this->buildHtmlSummary($order),
        ];
    }

    public function send($order): void
    {
        if (! $this->isEnabled() || $this->wasSent($order)) {
            return;
        }

        $payload = $this->formatPayload($order);

        try {
            $response = ($this->httpPost)($this->webhookUrl, [
                'timeout' => 3,
                'headers' => [
                    'Content-Type' => 'application/json; charset=utf-8',
                ],
                'body' => $this->encodeJson($payload),
                'data_format' => 'body',
            ]);

            if (function_exists('is_wp_error') && is_wp_error($response)) {
                $this->markFailure($order, (string) $response->get_error_message());

                return;
            }

            $status = $this->extractStatusCode($response);

            if ($status < 200 || $status >= 300) {
                $this->markFailure($order, 'HTTP_' . $status);

                return;
            }

            $this->markSent($order);
        } catch (Throwable $throwable) {
            $this->markFailure($order, $throwable->getMessage());
        }
    }

    private function isEnabled(): bool
    {
        return str_starts_with($this->webhookUrl, 'https://');
    }

    private function wasSent($order): bool
    {
        return trim((string) $order->get_meta(self::SENT_AT_META_KEY, true)) !== '';
    }

    private function markSent($order): void
    {
        $order->update_meta_data(self::SENT_AT_META_KEY, gmdate('c'));
        $order->update_meta_data(self::LAST_ERROR_META_KEY, '');
        $this->persistMeta($order);
    }

    private function markFailure($order, string $reason): void
    {
        $message = substr(trim($reason), 0, 190);

        $order->update_meta_data(self::LAST_ERROR_META_KEY, $message);
        $this->persistMeta($order);
        ($this->logger)(sprintf('Bulwar Bridge Make webhook failed for order %d: %s', (int) $order->get_id(), $message));
    }

    private function persistMeta($order): void
    {
        if (method_exists($order, 'save_meta_data')) {
            $order->save_meta_data();

            return;
        }

        if (method_exists($order, 'save')) {
            $order->save();
        }
    }

    private function extractStatusCode($response): int
    {
        if (function_exists('wp_remote_retrieve_response_code')) {
            return (int) wp_remote_retrieve_response_code($response);
        }

        return (int) (($response['response']['code'] ?? 0));
    }

    private function buildHtmlSummary($order): string
    {
        $currency = (string) $order->get_currency();
        $itemLines = [];

        foreach ($order->get_items('line_item') as $item) {
            $name = $this->escape($this->plainText((string) $item->get_name()));
            $quantity = max(1, (int) $item->get_quantity());
            $lineTotal = (float) $item->get_total();
            $unitPrice = $lineTotal / $quantity;

            $itemLines[] = sprintf(
                '<li>%s - %d x %s = %s</li>',
                $name,
                $quantity,
                $this->formatMoney($unitPrice, $currency),
                $this->formatMoney($lineTotal, $currency)
            );
        }

        $feeLines = [];

        foreach ($order->get_items('fee') as $feeItem) {
            $feeLines[] = sprintf(
                '<li>%s - %s</li>',
                $this->escape($this->plainText((string) $feeItem->get_name())),
                $this->formatMoney((float) $feeItem->get_total(), $currency)
            );
        }

        $parts = [
            '<p><strong>Zamowienie #' . $this->escape((string) $order->get_order_number()) . '</strong></p>',
            '<p>Realizacja: ' . $this->escape($this->formatFulfillment((string) $order->get_meta('_bulwar_fulfillment_type', true))) . '</p>',
            '<p>Termin: ' . $this->escape($this->formatSlotWindow(
                (string) $order->get_meta('_bulwar_slot_start_at', true),
                (string) $order->get_meta('_bulwar_slot_end_at', true)
            )) . '</p>',
            '<p>Pozycje:</p>',
            '<ul>' . implode('', $itemLines) . '</ul>',
        ];

        if ($feeLines !== []) {
            $parts[] = '<p>Dodatkowe oplaty:</p>';
            $parts[] = '<ul>' . implode('', $feeLines) . '</ul>';
        }

        $parts[] = '<p>Suma: ' . $this->escape($this->formatMoney((float) $order->get_total(), $currency)) . '</p>';

        return implode('', $parts);
    }

    private function formatFulfillment(string $value): string
    {
        if ($value === 'delivery') {
            return 'Dostawa';
        }

        if ($value === 'pickup') {
            return 'Odbior';
        }

        return $value !== '' ? $value : 'Nieznany';
    }

    private function formatSlotWindow(string $startAt, string $endAt): string
    {
        if ($startAt === '' || $endAt === '') {
            return 'Brak terminu';
        }

        try {
            $timezone = new DateTimeZone($this->timezone);
            $start = (new DateTimeImmutable($startAt))->setTimezone($timezone);
            $end = (new DateTimeImmutable($endAt))->setTimezone($timezone);

            if ($start->format('Y-m-d') === $end->format('Y-m-d')) {
                return $start->format('Y-m-d H:i') . '-' . $end->format('H:i');
            }

            return $start->format('Y-m-d H:i') . ' - ' . $end->format('Y-m-d H:i');
        } catch (Throwable $throwable) {
            unset($throwable);

            return trim($startAt . ' ' . $endAt);
        }
    }

    private function formatMoney(float $amount, string $currency): string
    {
        return number_format($amount, 2, '.', '') . ' ' . $currency;
    }

    private function plainText(string $value): string
    {
        if (function_exists('wp_strip_all_tags')) {
            return trim((string) wp_strip_all_tags($value));
        }

        return trim(strip_tags($value));
    }

    private function escape(string $value): string
    {
        return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
    }

    private function encodeJson(array $payload): string
    {
        if (function_exists('wp_json_encode')) {
            return (string) wp_json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        }

        return (string) json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    }
}