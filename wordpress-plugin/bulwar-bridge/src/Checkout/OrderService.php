<?php

declare(strict_types=1);

namespace BulwarBridge\Checkout;

use BulwarBridge\Support\TokenCodec;
use RuntimeException;
use WC_Order_Item_Fee;

final class OrderService
{
    /**
     * @param array<string, mixed> $body
     * @return array<string, mixed>
     */
    public function create(array $body): array
    {
        $existingOrder = $this->findExistingOrder((string) $body['idempotency_key']);

        if ($existingOrder) {
            return $this->mapOrderResponse($existingOrder);
        }

        $cartLines = is_array($body['cart_lines']) ? $body['cart_lines'] : [];
        $fulfillment = is_array($body['fulfillment'] ?? null) ? $body['fulfillment'] : [];
        $fulfillmentType = (string) ($fulfillment['type'] ?? '');
        $slotPayload = TokenCodec::decode((string) $fulfillment['slot_token'], 'bs_');

        if (TokenCodec::isExpired($slotPayload)) {
            throw new RuntimeException('SLOT_EXPIRED');
        }

        if (($slotPayload['fulfillment_type'] ?? null) !== $fulfillmentType) {
            throw new RuntimeException('SLOT_UNAVAILABLE');
        }

        $deliveryFee = 0.0;
        $quotePayload = null;

        if ($fulfillmentType === 'delivery') {
            $quotePayload = TokenCodec::decode((string) $fulfillment['quote_token'], 'bq_');

            if (TokenCodec::isExpired($quotePayload)) {
                throw new RuntimeException('QUOTE_EXPIRED');
            }

            if (($slotPayload['quote_fingerprint'] ?? null) !== TokenCodec::fingerprint((string) $fulfillment['quote_token'])) {
                throw new RuntimeException('QUOTE_MISMATCH');
            }

            $deliveryFee = ((int) ($quotePayload['delivery_fee_minor'] ?? 0)) / 100;
        }

        $order = wc_create_order();

        if (! $order) {
            throw new RuntimeException('ORDER_CREATE_FAILED');
        }

        $nameParts = preg_split('/\s+/', trim((string) ($body['customer']['first_name'] . ' ' . $body['customer']['last_name'])));
        $firstName = (string) ($body['customer']['first_name'] ?? ($nameParts[0] ?? ''));
        $lastName = (string) ($body['customer']['last_name'] ?? implode(' ', array_slice($nameParts ?: [], 1)));
        $email = (string) ($body['customer']['email'] ?? '');
        $phone = (string) ($body['customer']['phone'] ?? '');

        $order->set_billing_first_name($firstName);
        $order->set_billing_last_name($lastName);
        $order->set_billing_email($email);
        $order->set_billing_phone($phone);
        $order->set_payment_method('manual_cash');
        $order->set_payment_method_title('Płatność przy odbiorze');
        $order->set_customer_note((string) ($fulfillment['customer_note'] ?? ''));

        if ($fulfillmentType === 'delivery' && is_array($fulfillment['address'] ?? null)) {
            $address = $fulfillment['address'];
            $order->set_shipping_first_name($firstName);
            $order->set_shipping_last_name($lastName);
            $order->set_shipping_address_1((string) ($address['address_line_1'] ?? ''));
            $order->set_shipping_city((string) ($address['city'] ?? ''));
            $order->set_shipping_postcode((string) ($address['postcode'] ?? ''));
            $order->set_shipping_country((string) ($address['country_code'] ?? 'PL'));
        }

        foreach ($cartLines as $line) {
            $productId = (int) ($line['product_id'] ?? 0);
            $quantity = (int) ($line['quantity'] ?? 0);
            $lineType = (string) ($line['line_type'] ?? '');
            $product = wc_get_product($productId);

            if (! $product || $quantity < 1) {
                throw new RuntimeException('UNKNOWN_PRODUCT');
            }

            $itemId = $order->add_product($product, $quantity, [
                'subtotal' => (float) $product->get_price() * $quantity,
                'total' => (float) $product->get_price() * $quantity,
            ]);

            if ($itemId && $lineType === 'special_menu_for_2') {
                $item = $order->get_item($itemId);
                $config = $line['configuration'] ?? null;
                $this->addSpecialMenuFor2Meta($item, $config);

                $item->save();
            }
        }

        if ($deliveryFee > 0) {
            $feeItem = new WC_Order_Item_Fee();
            $feeItem->set_name('Dostawa');
            $feeItem->set_amount($deliveryFee);
            $feeItem->set_total($deliveryFee);
            $order->add_item($feeItem);
        }

        $order->update_meta_data('_bulwar_idempotency_key', (string) $body['idempotency_key']);
        $order->update_meta_data('_bulwar_fulfillment_type', $fulfillmentType);
        $order->update_meta_data('_bulwar_slot_start_at', (string) ($slotPayload['start_at'] ?? ''));
        $order->update_meta_data('_bulwar_slot_end_at', (string) ($slotPayload['end_at'] ?? ''));
        if ($quotePayload !== null) {
            $order->update_meta_data('_bulwar_quote_token_hash', TokenCodec::fingerprint((string) $fulfillment['quote_token']));
        }

        $order->calculate_totals(false);
        $order->set_status('pending');
        $order->save();

        (new MakeWebhookNotifier())->send($order);

        return $this->mapOrderResponse($order);
    }

    /**
     * @param mixed $item
     * @param mixed $config
     */
    private function addSpecialMenuFor2Meta($item, $config): void
    {
        $json = function_exists('wp_json_encode')
            ? (string) wp_json_encode($config, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)
            : (string) json_encode($config, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

        $item->add_meta_data('_bulwar_special_type', 'menu_for_2', true);
        $item->add_meta_data('_bulwar_special_schema_version', 2, true);
        $item->add_meta_data('_bulwar_special_config_json', $json, true);

        $previewParts = [];

        if (is_array($config['persons'] ?? null)) {
            foreach ($config['persons'] as $person) {
                if (! is_array($person)) {
                    continue;
                }

                $personIndex = (int) ($person['personIndex'] ?? 0);

                if ($personIndex < 1) {
                    continue;
                }

                $soupOptionId = (string) ($person['soupOptionId'] ?? '');
                $soupLabel = trim((string) ($person['soupLabel'] ?? ''));
                $mainOptionId = (string) ($person['mainOptionId'] ?? '');
                $mainLabel = trim((string) ($person['mainLabel'] ?? ''));
                $summary = trim(sprintf('%s / %s', $soupLabel, $mainLabel), ' /');

                $item->add_meta_data('bulwar_person_' . $personIndex, $summary, true);
                $item->add_meta_data('bulwar_person_' . $personIndex . '_soup', $soupLabel, true);
                $item->add_meta_data('bulwar_person_' . $personIndex . '_main', $mainLabel, true);
                $item->add_meta_data('_bulwar_person_' . $personIndex . '_soup_id', $soupOptionId, true);
                $item->add_meta_data('_bulwar_person_' . $personIndex . '_main_id', $mainOptionId, true);

                if ($summary !== '') {
                    $previewParts[] = 'Osoba ' . $personIndex . ': ' . $summary;
                }
            }
        }

        if ($previewParts !== []) {
            $item->add_meta_data('bulwar_special_preview', implode(' | ', $previewParts), true);
        }
    }

    private function findExistingOrder(string $idempotencyKey)
    {
        if ($idempotencyKey === '') {
            return null;
        }

        $orders = wc_get_orders([
            'limit' => 1,
            'meta_key' => '_bulwar_idempotency_key',
            'meta_value' => $idempotencyKey,
            'orderby' => 'date',
            'order' => 'DESC',
        ]);

        return $orders[0] ?? null;
    }

    /**
     * @return array<string, mixed>
     */
    private function mapOrderResponse($order): array
    {
        $itemsSubtotalMinor = (int) round(((float) $order->get_subtotal()) * 100);
        $deliveryFeeMinor = (int) round(((float) $order->get_total_fees()) * 100);
        $grandTotalMinor = (int) round(((float) $order->get_total()) * 100);

        return [
            'order_id' => $order->get_id(),
            'order_number' => $order->get_order_number(),
            'status' => $order->get_status(),
            'payment_method' => 'manual_cash',
            'currency' => $order->get_currency(),
            'totals' => [
                'items_subtotal_minor' => $itemsSubtotalMinor,
                'delivery_fee_minor' => $deliveryFeeMinor,
                'grand_total_minor' => $grandTotalMinor,
            ],
            'fulfillment' => [
                'type' => (string) $order->get_meta('_bulwar_fulfillment_type', true),
                'slot_start_at' => (string) $order->get_meta('_bulwar_slot_start_at', true),
                'slot_end_at' => (string) $order->get_meta('_bulwar_slot_end_at', true),
            ],
        ];
    }
}