<?php

declare(strict_types=1);

namespace BulwarBridge\Http;

use BulwarBridge\Http\Controllers\CheckoutController;
use BulwarBridge\Http\Controllers\GlobalLayoutController;
use BulwarBridge\Http\Controllers\HealthController;
use BulwarBridge\Http\Controllers\PageBuilderController;

final class Routes
{
    public static function register(): void
    {
        register_rest_route('bulwar/v1', '/health', [
            'methods' => 'GET',
            'callback' => [HealthController::class, 'show'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route('bulwar/v1', '/checkout/delivery-quote', [
            'methods' => 'POST',
            'callback' => [CheckoutController::class, 'deliveryQuote'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route('bulwar/v1', '/checkout/slots', [
            'methods' => 'POST',
            'callback' => [CheckoutController::class, 'slots'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route('bulwar/v1', '/checkout/orders', [
            'methods' => 'POST',
            'callback' => [CheckoutController::class, 'orders'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route('bulwar/v1', '/layout/global', [
            'methods' => 'GET',
            'callback' => [GlobalLayoutController::class, 'show'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route('bulwar/v1', '/page-builder/pages', [
            'methods' => 'GET',
            'callback' => [PageBuilderController::class, 'index'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route('bulwar/v1', '/page-builder/site-context', [
            'methods' => 'GET',
            'callback' => [PageBuilderController::class, 'siteContext'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route('bulwar/v1', '/page-builder/pages/(?P<slug>[a-zA-Z0-9\-_]+)', [
            'methods' => 'GET',
            'callback' => [PageBuilderController::class, 'show'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route('bulwar/v1', '/page-builder/pages/(?P<slug>[a-zA-Z0-9\-_]+)', [
            'methods' => 'POST',
            'callback' => [PageBuilderController::class, 'update'],
            'permission_callback' => static function () : bool {
                return current_user_can('edit_pages');
            },
        ]);
    }
}
