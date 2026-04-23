<?php
/**
 * Plugin Name: Bulwar Bridge
 * Description: WordPress-native checkout bridge for BULWAR APP.
 * Version: 0.1.0
 * Author: GitHub Copilot
 */

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

require_once __DIR__ . '/src/Plugin.php';
require_once __DIR__ . '/src/Config/Constants.php';
require_once __DIR__ . '/src/Support/Response.php';
require_once __DIR__ . '/src/Support/TokenCodec.php';
require_once __DIR__ . '/src/Checkout/QuoteService.php';
require_once __DIR__ . '/src/Checkout/MakeWebhookNotifier.php';
require_once __DIR__ . '/src/Checkout/OrderService.php';
require_once __DIR__ . '/src/Slots/AvailabilityService.php';
require_once __DIR__ . '/src/Layout/GlobalLayoutResolver.php';
require_once __DIR__ . '/src/Http/Controllers/HealthController.php';
require_once __DIR__ . '/src/Http/Controllers/CheckoutController.php';
require_once __DIR__ . '/src/Http/Controllers/GlobalLayoutController.php';
require_once __DIR__ . '/src/Http/Controllers/PageBuilderController.php';
require_once __DIR__ . '/src/Http/Routes.php';

\BulwarBridge\Plugin::bootstrap(__FILE__);
