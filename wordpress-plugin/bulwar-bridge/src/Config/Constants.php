<?php

declare(strict_types=1);

namespace BulwarBridge\Config;

final class Constants
{
    private const DEFAULTS = [
        'BULWAR_BRIDGE_TIMEZONE' => 'Europe/Warsaw',
        'BULWAR_BRIDGE_DELIVERY_BASE_FEE' => 10,
        'BULWAR_BRIDGE_DELIVERY_PRICE_PER_KM' => 9,
        'BULWAR_BRIDGE_FREE_DELIVERY_THRESHOLD' => 800,
        'BULWAR_BRIDGE_QUOTE_TTL_MINUTES' => 20,
        'BULWAR_BRIDGE_SLOT_TOKEN_TTL_MINUTES' => 15,
        'BULWAR_BRIDGE_SPECIAL_PRODUCT_ID' => 53,
        'BULWAR_BRIDGE_SLOT_CONFIG_VERSION' => 'v2',
        'BULWAR_BRIDGE_PRICING_RULE_VERSION' => 'v1',
        'BULWAR_BRIDGE_MAKE_WEBHOOK_URL' => '',
        'BULWAR_BRIDGE_GLOBAL_LAYOUT_OPTION' => 'bulwar_bridge_global_layout',
        'BULWAR_BRIDGE_SITE_CONTEXT_OPTION' => 'bulwar_bridge_site_context',
    ];

    public static function bootstrap(): void
    {
        foreach (self::DEFAULTS as $name => $value) {
            if (! defined($name)) {
                define($name, $value);
            }
        }
    }

    public static function all(): array
    {
        self::bootstrap();

        return [
            'googleMapsApiKey' => self::value('BULWAR_BRIDGE_GOOGLE_MAPS_API_KEY'),
            'storeOriginLine1' => self::value('BULWAR_BRIDGE_STORE_ORIGIN_LINE1'),
            'storeOriginCity' => self::value('BULWAR_BRIDGE_STORE_ORIGIN_CITY'),
            'storeOriginPostalCode' => self::value('BULWAR_BRIDGE_STORE_ORIGIN_POSTAL_CODE'),
            'storeOriginCountry' => self::value('BULWAR_BRIDGE_STORE_ORIGIN_COUNTRY'),
            'timezone' => (string) self::value('BULWAR_BRIDGE_TIMEZONE'),
            'deliveryBaseFee' => (float) self::value('BULWAR_BRIDGE_DELIVERY_BASE_FEE'),
            'deliveryPricePerKm' => (float) self::value('BULWAR_BRIDGE_DELIVERY_PRICE_PER_KM'),
            'freeDeliveryThreshold' => (float) self::value('BULWAR_BRIDGE_FREE_DELIVERY_THRESHOLD'),
            'quoteTtlMinutes' => (int) self::value('BULWAR_BRIDGE_QUOTE_TTL_MINUTES'),
            'slotTokenTtlMinutes' => (int) self::value('BULWAR_BRIDGE_SLOT_TOKEN_TTL_MINUTES'),
            'specialProductId' => (int) self::value('BULWAR_BRIDGE_SPECIAL_PRODUCT_ID'),
            'slotConfigVersion' => (string) self::value('BULWAR_BRIDGE_SLOT_CONFIG_VERSION'),
            'pricingRuleVersion' => (string) self::value('BULWAR_BRIDGE_PRICING_RULE_VERSION'),
            'makeWebhookUrl' => (string) self::value('BULWAR_BRIDGE_MAKE_WEBHOOK_URL'),
        ];
    }

    public static function requiredConstantNames(): array
    {
        return [
            'BULWAR_BRIDGE_STORE_ORIGIN_LINE1',
            'BULWAR_BRIDGE_STORE_ORIGIN_CITY',
            'BULWAR_BRIDGE_STORE_ORIGIN_POSTAL_CODE',
            'BULWAR_BRIDGE_STORE_ORIGIN_COUNTRY',
        ];
    }

    public static function missingRequiredConstants(): array
    {
        $missing = [];

        foreach (self::requiredConstantNames() as $name) {
            if (self::value($name) === null || self::value($name) === '') {
                $missing[] = $name;
            }
        }

        return $missing;
    }

    public static function globalLayoutOptionName(): string
    {
        self::bootstrap();

        return (string) self::value('BULWAR_BRIDGE_GLOBAL_LAYOUT_OPTION');
    }

    public static function siteContextOptionName(): string
    {
        self::bootstrap();

        return (string) self::value('BULWAR_BRIDGE_SITE_CONTEXT_OPTION');
    }

    private static function value(string $name)
    {
        return defined($name) ? constant($name) : null;
    }
}
