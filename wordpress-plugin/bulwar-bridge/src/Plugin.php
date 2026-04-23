<?php

declare(strict_types=1);

namespace BulwarBridge;

use BulwarBridge\Config\Constants;
use BulwarBridge\Http\Controllers\PageBuilderController;
use BulwarBridge\Http\Routes;

final class Plugin
{
    public static function bootstrap(string $pluginFile): void
    {
        add_action('init', [Constants::class, 'bootstrap']);
        add_action('init', [PageBuilderController::class, 'registerMeta']);
        add_action('rest_api_init', [Routes::class, 'register']);
        add_filter('woocommerce_hidden_order_itemmeta', [self::class, 'filterHiddenOrderItemMeta']);
        add_filter('woocommerce_order_item_display_meta_key', [self::class, 'filterOrderItemDisplayMetaKey'], 10, 3);

        if (function_exists('register_activation_hook')) {
            register_activation_hook($pluginFile, [self::class, 'activate']);
        }
    }

    public static function activate(): void
    {
        Constants::bootstrap();
    }

    /**
     * @param array<int, string> $hiddenMeta
     * @return array<int, string>
     */
    public static function filterHiddenOrderItemMeta(array $hiddenMeta): array
    {
        return array_values(array_unique(array_merge($hiddenMeta, [
            'bulwar_special_type',
            'bulwar_special_schema_version',
            'bulwar_special_config_json',
            '_bulwar_special_type',
            '_bulwar_special_schema_version',
            '_bulwar_special_config_json',
            '_bulwar_person_1_soup_id',
            '_bulwar_person_1_main_id',
            '_bulwar_person_2_soup_id',
            '_bulwar_person_2_main_id',
        ])));
    }

    /**
     * @param string $displayKey
     * @param mixed $meta
     * @param mixed $item
     */
    public static function filterOrderItemDisplayMetaKey(string $displayKey, $meta, $item): string
    {
        unset($item);

        $key = is_object($meta) && isset($meta->key) ? (string) $meta->key : '';

        $labels = [
            'bulwar_special_preview' => 'Konfiguracja zestawu',
            'bulwar_person_1' => 'Osoba 1',
            'bulwar_person_1_soup' => 'Osoba 1: zupa',
            'bulwar_person_1_main' => 'Osoba 1: danie główne',
            'bulwar_person_2' => 'Osoba 2',
            'bulwar_person_2_soup' => 'Osoba 2: zupa',
            'bulwar_person_2_main' => 'Osoba 2: danie główne',
        ];

        return $labels[$key] ?? $displayKey;
    }
}
