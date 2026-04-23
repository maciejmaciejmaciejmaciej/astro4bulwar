<?php

declare(strict_types=1);

$options = getopt('', ['wp-load:', 'apply']);
$wpLoadPath = $options['wp-load'] ?? null;
$apply = array_key_exists('apply', $options);

if (!is_string($wpLoadPath) || $wpLoadPath === '') {
    fwrite(STDERR, "Missing required --wp-load=/absolute/path/to/wp-load.php option.\n");
    exit(1);
}

if (!file_exists($wpLoadPath)) {
    fwrite(STDERR, "wp-load.php not found at: {$wpLoadPath}\n");
    exit(1);
}

require_once $wpLoadPath;

if (!function_exists('wc_get_product')) {
    fwrite(STDERR, "WooCommerce is not loaded.\n");
    exit(1);
}

function normalize_spacing(string $value): string
{
    return trim((string) preg_replace('/\s+/u', ' ', $value));
}

function normalize_numeric_string(float $value): string
{
    if ((float) (int) $value === $value) {
        return (string) (int) $value;
    }

    $normalized = rtrim(rtrim(number_format($value, 6, '.', ''), '0'), '.');

    return $normalized === '' ? '0' : $normalized;
}

function format_numeric_for_storage(string $value): string
{
    return str_contains($value, '.') ? str_replace('.', ',', $value) : $value;
}

function normalize_portion_unit(string $unit): string
{
    $normalized = mb_strtolower(normalize_spacing($unit));

    return match ($normalized) {
        'połówki', 'połowki' => 'połówki jajka',
        default => $unit,
    };
}

function normalize_unit_of_measure(string $unit): string
{
    $normalized = mb_strtolower(normalize_spacing($unit));

    if (str_starts_with($normalized, 'szt')) {
        return 'szt.';
    }

    if (str_starts_with($normalized, 'porcj')) {
        return 'porcja';
    }

    throw new RuntimeException("Unsupported sprzedaż unit: {$unit}");
}

function parse_fraction_value(string $value): ?string
{
    if (!preg_match('/^(\d+)\s*\/\s*(\d+)$/', $value, $matches)) {
        return null;
    }

    $numerator = (float) $matches[1];
    $denominator = (float) $matches[2];

    if ($denominator === 0.0) {
        return null;
    }

    return normalize_numeric_string($numerator / $denominator);
}

function parse_measurement_segment(string $segment): array
{
    $normalized = normalize_spacing($segment);
    $normalized = preg_replace('/^ok\.\s*/iu', '', $normalized) ?? $normalized;
    $normalized = normalize_spacing($normalized);

    if (preg_match('/^(?<value>\d+(?:[.,]\d+)?)\s+(?<unit>.+)$/u', $normalized, $matches)) {
        return [
            'value' => str_replace(',', '.', $matches['value']),
            'unit' => normalize_portion_unit(normalize_spacing($matches['unit'])),
        ];
    }

    if (preg_match('/^(?<value>\d+\s*\/\s*\d+)\s+(?<unit>.+)$/u', $normalized, $matches)) {
        $value = parse_fraction_value($matches['value']);

        if ($value !== null) {
            return [
                'value' => $value,
                'unit' => normalize_portion_unit(normalize_spacing($matches['unit'])),
            ];
        }
    }

    if (preg_match('/^(?<prefix>cała|cały|całe|cala|caly|cale)\s+(?<unit>.+)$/iu', $normalized, $matches)) {
        return [
            'value' => '1',
            'unit' => normalize_portion_unit(normalize_spacing($matches['unit'])),
        ];
    }

    throw new RuntimeException("Unsupported gramatura segment: {$segment}");
}

function parse_gramatura(string $gramatura): array
{
    $normalized = normalize_spacing($gramatura);
    $parts = preg_split('/\s*-\s*/u', $normalized, 2);

    if ($parts === false || $parts === []) {
        throw new RuntimeException("Unable to split gramatura: {$gramatura}");
    }

    $portion = parse_measurement_segment($parts[0]);
    $unitOfMeasure = 'porcja';

    if (isset($parts[1]) && $parts[1] !== '') {
        $purchaseUnit = parse_measurement_segment($parts[1]);
        $unitOfMeasure = normalize_unit_of_measure($purchaseUnit['unit']);
    }

    return [
        'unitOfMeasure' => $unitOfMeasure,
        'portionPerUnitValue' => format_numeric_for_storage($portion['value']),
        'portionPerUnitUnit' => $portion['unit'],
    ];
}

$productIds = get_posts([
    'post_type' => 'product',
    'post_status' => ['publish', 'draft', 'private', 'pending'],
    'posts_per_page' => -1,
    'fields' => 'ids',
    'orderby' => 'ID',
    'order' => 'ASC',
    'meta_query' => [
        [
            'key' => 'gramatura',
            'compare' => 'EXISTS',
        ],
    ],
]);

$processed = [];
$skipped = [];

foreach ($productIds as $productId) {
    $gramatura = normalize_spacing((string) get_post_meta($productId, 'gramatura', true));

    if ($gramatura === '') {
        continue;
    }

    try {
        $parsed = parse_gramatura($gramatura);
    } catch (RuntimeException $exception) {
        $skipped[] = [
            'id' => (int) $productId,
            'title' => get_the_title($productId),
            'gramatura' => $gramatura,
            'reason' => $exception->getMessage(),
        ];
        continue;
    }

    $current = [
        'unitOfMeasure' => (string) get_post_meta($productId, 'unitOfMeasure', true),
        'portionPerUnitValue' => (string) get_post_meta($productId, 'portionPerUnitValue', true),
        'portionPerUnitUnit' => (string) get_post_meta($productId, 'portionPerUnitUnit', true),
    ];

    if ($apply) {
        update_post_meta($productId, 'unitOfMeasure', $parsed['unitOfMeasure']);
        update_post_meta($productId, 'portionPerUnitValue', $parsed['portionPerUnitValue']);
        update_post_meta($productId, 'portionPerUnitUnit', $parsed['portionPerUnitUnit']);
    }

    $processed[] = [
        'id' => (int) $productId,
        'title' => get_the_title($productId),
        'gramatura' => $gramatura,
        'current' => $current,
        'derived' => $parsed,
        'changed' => $current !== $parsed,
    ];
}

$summary = [
    'mode' => $apply ? 'apply' : 'dry-run',
    'processedCount' => count($processed),
    'changedCount' => count(array_filter($processed, static fn (array $item): bool => $item['changed'])),
    'skippedCount' => count($skipped),
    'processed' => $processed,
    'skipped' => $skipped,
];

echo wp_json_encode($summary, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . PHP_EOL;

exit($summary['skippedCount'] > 0 ? 2 : 0);