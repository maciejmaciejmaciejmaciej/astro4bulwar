<?php

declare(strict_types=1);

namespace BulwarBridge\Support;

use WP_REST_Response;

final class Response
{
    public static function success(array $data = [], int $status = 200, array $meta = []): WP_REST_Response
    {
        return new WP_REST_Response(
            [
                'success' => true,
                'data' => $data,
                'meta' => array_merge(self::meta(), $meta),
            ],
            $status
        );
    }

    public static function error(
        string $code,
        string $message,
        int $status,
        bool $retryable = false,
        ?string $field = null,
        array $details = []
    ): WP_REST_Response
    {
        $error = [
            'code' => $code,
            'message' => $message,
            'retryable' => $retryable,
            'field' => $field,
            'details' => $details,
        ];

        return new WP_REST_Response(
            [
                'success' => false,
                'error' => $error,
                'meta' => self::meta(),
            ],
            $status
        );
    }

    private static function meta(): array
    {
        $requestId = function_exists('wp_generate_uuid4') ? wp_generate_uuid4() : uniqid('bulwar_', true);

        return [
            'request_id' => $requestId,
            'timestamp' => gmdate('c'),
        ];
    }
}
