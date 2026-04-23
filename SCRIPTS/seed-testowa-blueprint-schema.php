<?php

declare(strict_types=1);

require_once __DIR__ . '/clientWpRoot.php';

$wpRoot = resolveClientWordPressRoot();
$schemaPath = getenv('HOME') . '/testowa-blueprint.page_builder_schema.json';
$aiSchemaPath = getenv('HOME') . '/testowa-blueprint.page_builder_schema_for_ai.json';

if (! file_exists($wpRoot . '/wp-load.php')) {
    fwrite(STDERR, "Missing wp-load.php at {$wpRoot}\n");
    exit(1);
}

if (! file_exists($schemaPath)) {
    fwrite(STDERR, "Missing schema file at {$schemaPath}\n");
    exit(1);
}

require_once $wpRoot . '/wp-load.php';

$decodeJsonFile = static function (string $path, string $label, bool $required = false): ?array {
    if (! file_exists($path)) {
        if ($required) {
            fwrite(STDERR, "Missing {$label} file at {$path}\n");
            exit(1);
        }

        return null;
    }

    $json = file_get_contents($path);

    if ($json === false || trim($json) === '') {
        fwrite(STDERR, "Failed to read {$label} JSON\n");
        exit(1);
    }

    $decoded = json_decode($json, true);

    if (! is_array($decoded)) {
        fwrite(STDERR, "{$label} JSON is invalid\n");
        exit(1);
    }

    return $decoded;
};

$decoded = $decodeJsonFile($schemaPath, 'Schema', true);
$aiDecoded = $decodeJsonFile($aiSchemaPath, 'AI schema');

$existingPage = get_page_by_path('testowa-blueprint', OBJECT, 'page');

if ($existingPage instanceof WP_Post) {
    $pageId = (int) $existingPage->ID;

    wp_update_post([
        'ID' => $pageId,
        'post_title' => 'Testowa Blueprint',
        'post_name' => 'testowa-blueprint',
        'post_status' => 'publish',
        'post_type' => 'page',
    ]);
} else {
    $pageId = (int) wp_insert_post([
        'post_title' => 'Testowa Blueprint',
        'post_name' => 'testowa-blueprint',
        'post_status' => 'publish',
        'post_type' => 'page',
    ]);
}

if ($pageId <= 0) {
    fwrite(STDERR, "Failed to create or update page\n");
    exit(1);
}

update_post_meta($pageId, 'page_builder_schema', wp_json_encode($decoded, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));

if (is_array($aiDecoded)) {
    update_post_meta($pageId, 'page_builder_schema_for_ai', wp_json_encode($aiDecoded, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    echo "AI_SCHEMA:updated\n";
} else {
    echo "AI_SCHEMA:skipped\n";
}

echo "PAGE_ID:{$pageId}\n";
