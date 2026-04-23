<?php

declare(strict_types=1);

namespace BulwarBridge\Http\Controllers;

use BulwarBridge\Checkout\OrderService;
use BulwarBridge\Checkout\QuoteService;
use BulwarBridge\Config\Constants;
use BulwarBridge\Slots\AvailabilityService;
use BulwarBridge\Support\Response;
use BulwarBridge\Support\TokenCodec;
use Throwable;
use WP_REST_Request;

final class CheckoutController
{
    public static function deliveryQuote(WP_REST_Request $request)
    {
        $body = $request->get_json_params();

        if (! is_array($body)) {
            return Response::error('INVALID_JSON', 'Request body must be valid JSON.', 400, false);
        }

        if (empty($body['destination']['address_line_1']) || empty($body['destination']['city']) || empty($body['destination']['postcode']) || empty($body['destination']['country_code'])) {
            return Response::error('VALIDATION_ERROR', 'Destination address is incomplete.', 400, false, 'destination');
        }

        if (empty($body['cart_lines']) || ! is_array($body['cart_lines'])) {
            return Response::error('VALIDATION_ERROR', 'cart_lines must be a non-empty array.', 400, false, 'cart_lines');
        }

        try {
            $service = new QuoteService();
            $result = $service->quote($body['destination'], $body['cart_lines']);

            return Response::success($result['data'], 200, $result['meta']);
        } catch (Throwable $throwable) {
            return Response::error('DELIVERY_QUOTE_UNAVAILABLE', $throwable->getMessage(), 409, true, null, [
                'pricing_rule_version' => Constants::all()['pricingRuleVersion'],
            ]);
        }
    }

    public static function slots(WP_REST_Request $request)
    {
        $body = $request->get_json_params();

        if (! is_array($body)) {
            return Response::error('INVALID_JSON', 'Request body must be valid JSON.', 400, false);
        }

        $fulfillmentType = $body['fulfillment_type'] ?? null;
        $windowStart = $body['window_start'] ?? null;
        $days = $body['days'] ?? null;

        if (! in_array($fulfillmentType, ['delivery', 'pickup'], true)) {
            return Response::error('VALIDATION_ERROR', 'fulfillment_type must be delivery or pickup.', 400, false, 'fulfillment_type');
        }

        if (! is_string($windowStart) || preg_match('/^\d{4}-\d{2}-\d{2}$/', $windowStart) !== 1) {
            return Response::error('VALIDATION_ERROR', 'window_start must use YYYY-MM-DD format.', 400, false, 'window_start');
        }

        if (! is_int($days) || $days < 1) {
            return Response::error('VALIDATION_ERROR', 'days must be a positive integer.', 400, false, 'days');
        }

        if ($fulfillmentType === 'delivery' && empty($body['quote_token'])) {
            return Response::error('QUOTE_REQUIRED', 'Delivery slot lookup requires quote_token.', 400, false, 'quote_token');
        }

        if ($fulfillmentType === 'delivery') {
            try {
                $quotePayload = TokenCodec::decode((string) $body['quote_token'], 'bq_');

                if (TokenCodec::isExpired($quotePayload)) {
                    return Response::error('QUOTE_EXPIRED', 'Delivery quote expired. Recalculate delivery cost.', 409, true, 'quote_token');
                }
            } catch (Throwable $throwable) {
                return Response::error('TOKEN_INVALID', $throwable->getMessage(), 401, false, 'quote_token');
            }
        }

        try {
            $service = new AvailabilityService(
                dirname(__DIR__, 3) . '/config/slots.json',
                Constants::all()
            );
            $result = $service->getAvailability(
                $fulfillmentType,
                $windowStart,
                $days,
                isset($body['quote_token']) && is_string($body['quote_token']) ? $body['quote_token'] : null
            );

            return Response::success($result['data'], 200, $result['meta']);
        } catch (Throwable $throwable) {
            return Response::error('DEPENDENCY_UNAVAILABLE', 'Slot availability configuration is unavailable.', 503, true, null, [
                'slot_config_version' => Constants::all()['slotConfigVersion'],
                'reason' => $throwable->getMessage(),
            ]);
        }
    }

    public static function orders(WP_REST_Request $request)
    {
        $body = $request->get_json_params();
        $paymentMethod = $body['payment_method'] ?? null;

        if (! is_array($body)) {
            return Response::error('INVALID_JSON', 'Request body must be valid JSON.', 400, false);
        }

        if (empty($body['idempotency_key'])) {
            return Response::error('VALIDATION_ERROR', 'idempotency_key is required.', 400, false, 'idempotency_key');
        }

        if ($paymentMethod !== 'manual_cash') {
            return Response::error('UNSUPPORTED_PAYMENT_METHOD', 'Only payment_method=manual_cash is accepted in MVP.', 400, false, 'payment_method');
        }

        if (empty($body['customer']['first_name']) || empty($body['customer']['last_name']) || empty($body['customer']['phone']) || empty($body['customer']['email'])) {
            return Response::error('VALIDATION_ERROR', 'Customer payload is incomplete.', 400, false, 'customer');
        }

        if (empty($body['fulfillment']['type'])) {
            return Response::error('VALIDATION_ERROR', 'fulfillment.type is required.', 400, false, 'fulfillment.type');
        }

        if (empty($body['fulfillment']['slot_token'])) {
            return Response::error('SLOT_REQUIRED', 'Order submission requires slot_token.', 400, false, 'fulfillment.slot_token');
        }

        if (($body['fulfillment']['type'] ?? null) === 'delivery' && empty($body['fulfillment']['quote_token'])) {
            return Response::error('QUOTE_REQUIRED', 'Delivery order requires quote_token.', 400, false, 'fulfillment.quote_token');
        }

        if (empty($body['cart_lines']) || ! is_array($body['cart_lines'])) {
            return Response::error('VALIDATION_ERROR', 'cart_lines must be a non-empty array.', 400, false, 'cart_lines');
        }

        try {
            $service = new OrderService();
            $result = $service->create($body);

            return Response::success($result);
        } catch (Throwable $throwable) {
            $code = $throwable->getMessage();
            $knownCodes = [
                'QUOTE_EXPIRED',
                'QUOTE_MISMATCH',
                'SLOT_EXPIRED',
                'SLOT_UNAVAILABLE',
                'UNKNOWN_PRODUCT',
                'ORDER_CREATE_FAILED',
            ];

            if (in_array($code, $knownCodes, true)) {
                $status = in_array($code, ['UNKNOWN_PRODUCT'], true) ? 400 : 409;
                if ($code === 'ORDER_CREATE_FAILED') {
                    $status = 500;
                }

                return Response::error($code, $code, $status, $status >= 500);
            }

            return Response::error('ORDER_CREATE_FAILED', $throwable->getMessage(), 500, true);
        }
    }
}
