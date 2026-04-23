<?php

declare(strict_types=1);

namespace BulwarBridge\Layout;

use BulwarBridge\Config\Constants;
use WP_Post;

final class GlobalLayoutResolver
{
    private const SHARED_FOOTER_BLOCK_KEY = 'shared_footer';
    private const SHARED_FOOTER_BLOCK_VERSION = 1;

    /**
     * @return array{globalLayout: array<string, mixed>, meta: array<string, string>}
     */
    public static function resolve(): array
    {
        [$settings, $optionStatus] = self::readSettings();

        $navbar = self::normalizeNavbar(is_array($settings['navbar'] ?? null) ? $settings['navbar'] : []);
        [$footer, $footerStatus] = self::resolveFooter($settings);

        return [
            'globalLayout' => [
                'navbar' => $navbar,
                'footer' => $footer,
            ],
            'meta' => [
                'layout_option_status' => $optionStatus,
                'footer_status' => $footerStatus,
            ],
        ];
    }

    /**
     * @return array{0: array<string, mixed>, 1: string}
     */
    private static function readSettings(): array
    {
        $raw = get_option(Constants::globalLayoutOptionName(), []);

        if (is_array($raw)) {
            return [$raw, 'resolved'];
        }

        if (is_string($raw)) {
            if (trim($raw) === '') {
                return [[], 'fallback_missing_option'];
            }

            $decoded = json_decode($raw, true);

            if (is_array($decoded)) {
                return [$decoded, 'resolved'];
            }

            return [[], 'fallback_invalid_option'];
        }

        if ($raw === false || $raw === null) {
            return [[], 'fallback_missing_option'];
        }

        return [[], 'fallback_invalid_option'];
    }

    /**
     * @param array<string, mixed> $settings
     * @return array{0: array<string, mixed>, 1: string}
     */
    private static function resolveFooter(array $settings): array
    {
        $footerPageId = isset($settings['footerPageId']) ? (int) $settings['footerPageId'] : 0;

        if ($footerPageId <= 0) {
            return [self::defaultFooter(), 'fallback_missing_footer_page_id'];
        }

        $footerPage = get_post($footerPageId);

        if (! $footerPage instanceof WP_Post || $footerPage->post_type !== 'page') {
            return [self::defaultFooter(), 'fallback_footer_page_not_found'];
        }

        $rawSchema = get_post_meta($footerPage->ID, 'page_builder_schema', true);

        if (! is_string($rawSchema) || trim($rawSchema) === '') {
            return [self::defaultFooter(), 'fallback_footer_schema_missing'];
        }

        $decoded = json_decode($rawSchema, true);

        if (! is_array($decoded)) {
            return [self::defaultFooter(), 'fallback_footer_schema_invalid'];
        }

        $sections = isset($decoded['sections']) && is_array($decoded['sections']) ? $decoded['sections'] : [];
        $foundSharedFooter = false;

        foreach ($sections as $section) {
            if (! is_array($section)) {
                continue;
            }

            if (($section['blockKey'] ?? null) !== self::SHARED_FOOTER_BLOCK_KEY) {
                continue;
            }

            $foundSharedFooter = true;

            if (($section['enabled'] ?? false) !== true) {
                continue;
            }

            if ((int) ($section['blockVersion'] ?? 0) !== self::SHARED_FOOTER_BLOCK_VERSION) {
                return [self::defaultFooter(), 'fallback_footer_block_invalid'];
            }

            if (($section['source'] ?? null) !== null) {
                return [self::defaultFooter(), 'fallback_footer_block_invalid'];
            }

            if (! isset($section['data']) || ! is_array($section['data'])) {
                return [self::defaultFooter(), 'fallback_footer_block_invalid'];
            }

            return [self::normalizeFooter($section['data']), 'resolved'];
        }

        if ($foundSharedFooter) {
            return [self::defaultFooter(), 'fallback_footer_block_disabled'];
        }

        return [self::defaultFooter(), 'fallback_footer_block_missing'];
    }

    /**
     * @param array<string, mixed> $navbar
     * @return array<string, mixed>
     */
    private static function normalizeNavbar(array $navbar): array
    {
        $default = self::defaultNavbar();

        return [
            'brand' => self::normalizeBrand(is_array($navbar['brand'] ?? null) ? $navbar['brand'] : $default['brand'], $default['brand']),
            'primaryItems' => self::normalizeNavigationItems($navbar['primaryItems'] ?? []),
            'companyLinks' => self::normalizeLinks($navbar['companyLinks'] ?? []),
            'legalLinks' => self::normalizeLinks($navbar['legalLinks'] ?? []),
        ];
    }

    /**
     * @param array<string, mixed> $footer
     * @return array<string, mixed>
     */
    private static function normalizeFooter(array $footer): array
    {
        $default = self::defaultFooter();

        return [
            'brand' => self::normalizeBrand(is_array($footer['brand'] ?? null) ? $footer['brand'] : $default['brand'], $default['brand']),
            'address' => self::normalizeTextGroup($footer['address'] ?? [], $default['address']['heading']),
            'contact' => self::normalizeContactGroup($footer['contact'] ?? [], $default['contact']['heading']),
            'hours' => self::normalizeTextGroup($footer['hours'] ?? [], $default['hours']['heading']),
            'socialLinks' => self::normalizeLinks($footer['socialLinks'] ?? []),
            'legalLinks' => self::normalizeLinks($footer['legalLinks'] ?? []),
            'copyright' => self::normalizeString($footer['copyright'] ?? null, $default['copyright']),
        ];
    }

    /**
     * @param mixed $group
     * @return array{heading: string, lines: array<int, string>}
     */
    private static function normalizeTextGroup($group, string $defaultHeading): array
    {
        $value = is_array($group) ? $group : [];

        return [
            'heading' => self::normalizeString($value['heading'] ?? null, $defaultHeading),
            'lines' => self::normalizeStringList($value['lines'] ?? []),
        ];
    }

    /**
     * @param mixed $group
     * @return array{heading: string, items: array<int, array{label: string, href: string}>}
     */
    private static function normalizeContactGroup($group, string $defaultHeading): array
    {
        $value = is_array($group) ? $group : [];

        return [
            'heading' => self::normalizeString($value['heading'] ?? null, $defaultHeading),
            'items' => self::normalizeLinks($value['items'] ?? []),
        ];
    }

    /**
     * @param mixed $items
     * @return array<int, array<string, mixed>>
     */
    private static function normalizeNavigationItems($items): array
    {
        if (! is_array($items)) {
            return [];
        }

        $normalized = [];

        foreach ($items as $item) {
            if (! is_array($item)) {
                continue;
            }

            $label = self::normalizeString($item['label'] ?? null, '');
            $href = self::normalizeString($item['href'] ?? null, '');

            if ($label === '' || $href === '') {
                continue;
            }

            $normalized[] = [
                'label' => $label,
                'href' => $href,
                'description' => self::normalizeNullableString($item['description'] ?? null),
                'children' => self::normalizeNavigationItems($item['children'] ?? []),
            ];
        }

        return array_values($normalized);
    }

    /**
     * @param mixed $links
     * @return array<int, array{label: string, href: string}>
     */
    private static function normalizeLinks($links): array
    {
        if (! is_array($links)) {
            return [];
        }

        $normalized = [];

        foreach ($links as $link) {
            if (! is_array($link)) {
                continue;
            }

            $label = self::normalizeString($link['label'] ?? null, '');
            $href = self::normalizeString($link['href'] ?? null, '');

            if ($label === '' || $href === '') {
                continue;
            }

            $normalized[] = [
                'label' => $label,
                'href' => $href,
            ];
        }

        return array_values($normalized);
    }

    /**
     * @param mixed $brand
     * @param array<string, mixed> $defaultBrand
     * @return array{name: string, href: string, logoSrc: ?string, logoAlt: ?string}
     */
    private static function normalizeBrand($brand, array $defaultBrand): array
    {
        $value = is_array($brand) ? $brand : [];

        return [
            'name' => self::normalizeString($value['name'] ?? null, (string) $defaultBrand['name']),
            'href' => self::normalizeString($value['href'] ?? null, (string) $defaultBrand['href']),
            'logoSrc' => self::normalizeNullableString($value['logoSrc'] ?? null),
            'logoAlt' => self::normalizeNullableString($value['logoAlt'] ?? null),
        ];
    }

    /**
     * @param mixed $value
     * @return array<int, string>
     */
    private static function normalizeStringList($value): array
    {
        if (! is_array($value)) {
            return [];
        }

        $normalized = [];

        foreach ($value as $item) {
            $line = self::normalizeString($item, '');

            if ($line === '') {
                continue;
            }

            $normalized[] = $line;
        }

        return array_values($normalized);
    }

    /**
     * @param mixed $value
     */
    private static function normalizeString($value, string $default): string
    {
        if (! is_scalar($value)) {
            return $default;
        }

        $normalized = trim((string) $value);

        return $normalized !== '' ? $normalized : $default;
    }

    /**
     * @param mixed $value
     */
    private static function normalizeNullableString($value): ?string
    {
        if ($value === null) {
            return null;
        }

        if (! is_scalar($value)) {
            return null;
        }

        $normalized = trim((string) $value);

        return $normalized !== '' ? $normalized : null;
    }

    /**
     * @return array<string, mixed>
     */
    private static function defaultNavbar(): array
    {
        return [
            'brand' => [
                'name' => 'Bulwar',
                'href' => '/',
                'logoSrc' => null,
                'logoAlt' => null,
            ],
            'primaryItems' => [],
            'companyLinks' => [],
            'legalLinks' => [],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private static function defaultFooter(): array
    {
        return [
            'brand' => [
                'name' => 'Bulwar',
                'href' => '/',
                'logoSrc' => null,
                'logoAlt' => null,
            ],
            'address' => [
                'heading' => 'Adres',
                'lines' => [],
            ],
            'contact' => [
                'heading' => 'Kontakt',
                'items' => [],
            ],
            'hours' => [
                'heading' => 'Godziny',
                'lines' => [],
            ],
            'socialLinks' => [],
            'legalLinks' => [],
            'copyright' => '(c) Bulwar',
        ];
    }
}