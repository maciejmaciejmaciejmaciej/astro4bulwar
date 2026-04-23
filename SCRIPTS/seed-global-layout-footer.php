<?php

declare(strict_types=1);

const BULWAR_GLOBAL_LAYOUT_DEFAULT_OPTION = 'bulwar_bridge_global_layout';
const BULWAR_SHARED_FOOTER_BLOCK_KEY = 'shared_footer';
const BULWAR_SHARED_FOOTER_BLOCK_VERSION = 1;
const BULWAR_SHARED_FOOTER_DEFAULT_SLUG = 'shared-footer';
const BULWAR_SHARED_FOOTER_DEFAULT_TITLE = 'Shared Footer';
const BULWAR_SHARED_FOOTER_DEFAULT_STATUS = 'private';

if (! defined('BULWAR_SEED_GLOBAL_LAYOUT_FOOTER_SKIP_BOOTSTRAP')) {
    if (PHP_SAPI !== 'cli') {
        fwrite(STDERR, "This script must be run from the CLI.\n");
        exit(1);
    }

    try {
        exit(runSeedGlobalLayoutFooter($argv));
    } catch (Throwable $throwable) {
        fwrite(STDERR, $throwable->getMessage() . "\n");
        exit(1);
    }
}

function runSeedGlobalLayoutFooter(array $argv): int
{
    $options = parseSeedGlobalLayoutFooterOptions();

    if ($options['help'] === true) {
        fwrite(STDOUT, buildSeedGlobalLayoutFooterUsage($argv[0] ?? 'seed-global-layout-footer.php'));

        return 0;
    }

    $payload = readJsonFile($options['payloadPath'], 'shared footer payload');
    validateSharedFooterPageBuilderSchema($payload, $options['payloadPath']);

    $wpLoadPath = rtrim($options['wpRoot'], "/\\") . '/wp-load.php';

    if (! file_exists($wpLoadPath)) {
        throw new RuntimeException("Missing wp-load.php at {$wpLoadPath}");
    }

    require_once $wpLoadPath;

    $optionName = resolveGlobalLayoutOptionName();
    $currentOptionSnapshot = captureGlobalLayoutOptionSnapshot($optionName);
    $currentRawOption = $currentOptionSnapshot['value'];
    $backupOptionName = backupGlobalLayoutOption($optionName, $currentOptionSnapshot);
    $currentSettings = normalizeGlobalLayoutSettings($currentRawOption, $options['forceInvalidOption']);

    $existingPage = resolveTargetFooterPage($options);
    $pageSnapshot = captureTargetFooterPageSnapshot($existingPage);
    $pageSummary = null;
    $verification = [
        'available' => false,
        'message' => 'not_run',
    ];
    $mutatedPageId = 0;
    $writesStarted = false;

    try {
        $pageSummary = upsertTargetFooterPage($existingPage, $options);
        $mutatedPageId = (int) $pageSummary['page_id'];
        $writesStarted = true;

        persistSharedFooterSchema($mutatedPageId, $payload);

        $mergedSettings = $currentSettings;
        $mergedSettings['footerPageId'] = $mutatedPageId;
        persistFooterPageReference($optionName, $mergedSettings, $mutatedPageId);

        $verification = verifyGlobalLayoutResolution($options['skipVerification']);

        if ($verification['available'] !== true && $options['skipVerification'] !== true) {
            throw new RuntimeException(
                'Resolver verification is unavailable after write. Re-run with --skip-verification to accept an unverified change.'
            );
        }

        if ($verification['available'] === true && ($verification['layout_option_status'] !== 'resolved' || $verification['footer_status'] !== 'resolved')) {
            throw new RuntimeException(
                sprintf(
                    'Resolver verification failed after write. layout_option_status=%s footer_status=%s',
                    $verification['layout_option_status'],
                    $verification['footer_status']
                )
            );
        }
    } catch (Throwable $throwable) {
        if ($writesStarted === true) {
            try {
                rollbackSeedGlobalLayoutFooterWrite($optionName, $currentOptionSnapshot, $pageSnapshot, $mutatedPageId);
            } catch (Throwable $rollbackThrowable) {
                throw new RuntimeException(
                    $throwable->getMessage() . ' Rollback also failed: ' . $rollbackThrowable->getMessage(),
                    0,
                    $throwable
                );
            }

            throw new RuntimeException($throwable->getMessage() . ' Restored the previous option and page snapshot.', 0, $throwable);
        }

        throw $throwable;
    }

    fwrite(STDOUT, sprintf("OPTION_NAME:%s\n", $optionName));
    fwrite(STDOUT, sprintf("BACKUP_OPTION:%s\n", $backupOptionName));
    fwrite(STDOUT, sprintf("PAGE_ID:%d\n", $pageSummary['page_id']));
    fwrite(STDOUT, sprintf("PAGE_ACTION:%s\n", $pageSummary['page_action']));
    fwrite(STDOUT, sprintf("PAGE_SLUG:%s\n", $pageSummary['page_slug']));
    fwrite(STDOUT, sprintf("PAGE_TITLE:%s\n", $pageSummary['page_title']));
    fwrite(STDOUT, sprintf("PAGE_STATUS:%s\n", $pageSummary['page_status']));
    fwrite(STDOUT, sprintf("FOOTER_PAGE_ID:%d\n", $pageSummary['page_id']));

    if ($verification['available'] === true) {
        fwrite(STDOUT, sprintf("LAYOUT_OPTION_STATUS:%s\n", $verification['layout_option_status']));
        fwrite(STDOUT, sprintf("FOOTER_STATUS:%s\n", $verification['footer_status']));
    } else {
        fwrite(STDOUT, sprintf("VERIFICATION:%s\n", $verification['message']));
    }

    return 0;
}

function parseSeedGlobalLayoutFooterOptions(): array
{
    $rawOptions = getopt('', [
        'wp-root:',
        'payload:',
        'page-id:',
        'slug:',
        'title:',
        'status:',
        'force-invalid-option',
        'confirm-repurpose-page',
        'skip-verification',
        'help',
    ]);

    $wpRoot = is_string($rawOptions['wp-root'] ?? null) ? trim($rawOptions['wp-root']) : '';

    if (($rawOptions['help'] ?? false) !== true && $wpRoot === '') {
        throw new RuntimeException('Missing required --wp-root option.');
    }

    $pageId = 0;

    if (isset($rawOptions['page-id'])) {
        $pageId = (int) $rawOptions['page-id'];

        if ($pageId <= 0) {
            throw new RuntimeException('Option --page-id must be a positive integer when provided.');
        }
    }

    $status = is_string($rawOptions['status'] ?? null) ? trim($rawOptions['status']) : BULWAR_SHARED_FOOTER_DEFAULT_STATUS;
    $allowedStatuses = ['draft', 'future', 'pending', 'private', 'publish'];

    if (! in_array($status, $allowedStatuses, true)) {
        throw new RuntimeException('Option --status must be one of: ' . implode(', ', $allowedStatuses));
    }

    return [
        'help' => ($rawOptions['help'] ?? false) === true,
        'wpRoot' => $wpRoot,
        'payloadPath' => is_string($rawOptions['payload'] ?? null) ? trim($rawOptions['payload']) : __DIR__ . '/shared-footer.page_builder_schema.json',
        'pageId' => $pageId,
        'pageIdProvided' => isset($rawOptions['page-id']),
        'slug' => is_string($rawOptions['slug'] ?? null) ? trim($rawOptions['slug']) : BULWAR_SHARED_FOOTER_DEFAULT_SLUG,
        'slugProvided' => isset($rawOptions['slug']),
        'title' => is_string($rawOptions['title'] ?? null) ? trim($rawOptions['title']) : BULWAR_SHARED_FOOTER_DEFAULT_TITLE,
        'titleProvided' => isset($rawOptions['title']),
        'status' => $status,
        'statusProvided' => isset($rawOptions['status']),
        'forceInvalidOption' => ($rawOptions['force-invalid-option'] ?? false) === true,
        'confirmRepurposePage' => ($rawOptions['confirm-repurpose-page'] ?? false) === true,
        'skipVerification' => ($rawOptions['skip-verification'] ?? false) === true,
    ];
}

function buildSeedGlobalLayoutFooterUsage(string $scriptName): string
{
    return <<<TEXT
Usage:
    php {$scriptName} --wp-root=/path/to/wordpress [--payload=/path/to/shared-footer.page_builder_schema.json] [--page-id=123] [--slug=shared-footer] [--title="Shared Footer"] [--status=private] [--force-invalid-option] [--confirm-repurpose-page] [--skip-verification]

Notes:
  --wp-root is required and must contain wp-load.php.
    --page-id is accepted only when the page already looks like the intended footer page, or when --confirm-repurpose-page is passed explicitly.
  When --page-id is omitted, the script looks up a unique page by slug and aborts on ambiguity.
        A unique slug match is reused automatically only when that page already looks like the intended footer page; otherwise the script aborts unless --confirm-repurpose-page is passed explicitly.
    Malformed existing global-layout option data fails closed unless --force-invalid-option is passed.
    Resolver verification is required by default. Use --skip-verification only when you intentionally accept an unverified write.
  The payload defaults to a checked-in JSON file sitting next to this script.

TEXT;
}

function readJsonFile(string $path, string $label): array
{
    if ($path === '' || ! file_exists($path)) {
        throw new RuntimeException("Missing {$label} file at {$path}");
    }

    $rawJson = file_get_contents($path);

    if ($rawJson === false || trim($rawJson) === '') {
        throw new RuntimeException("Failed to read {$label} JSON from {$path}");
    }

    $decoded = json_decode($rawJson, true);

    if (! is_array($decoded)) {
        throw new RuntimeException("{$label} JSON is invalid at {$path}");
    }

    return $decoded;
}

function validateSharedFooterPageBuilderSchema(array $schema, string $path): void
{
    if ((int) ($schema['version'] ?? 0) !== 1) {
        throw new RuntimeException("Shared footer schema at {$path} must set version=1.");
    }

    $sections = $schema['sections'] ?? null;

    if (! is_array($sections)) {
        throw new RuntimeException("Shared footer schema at {$path} must contain a sections array.");
    }

    $enabledSharedFooterSections = [];

    foreach ($sections as $section) {
        if (! is_array($section)) {
            continue;
        }

        if (($section['blockKey'] ?? null) !== BULWAR_SHARED_FOOTER_BLOCK_KEY) {
            continue;
        }

        if (($section['enabled'] ?? false) === true) {
            $enabledSharedFooterSections[] = $section;
        }
    }

    if (count($enabledSharedFooterSections) !== 1) {
        throw new RuntimeException("Shared footer schema at {$path} must contain exactly one enabled shared_footer block.");
    }

    $section = $enabledSharedFooterSections[0];

    if ((int) ($section['blockVersion'] ?? 0) !== BULWAR_SHARED_FOOTER_BLOCK_VERSION) {
        throw new RuntimeException("Shared footer schema at {$path} must use blockVersion=1 on the enabled shared_footer block.");
    }

    if (($section['source'] ?? null) !== null) {
        throw new RuntimeException("Shared footer schema at {$path} must set source=null on the enabled shared_footer block.");
    }

    if (! isset($section['data']) || ! is_array($section['data'])) {
        throw new RuntimeException("Shared footer schema at {$path} must provide footer data on the enabled shared_footer block.");
    }

    validateFooterData($section['data'], $path);
}

function validateFooterData(array $data, string $path): void
{
    validateBrandData($data['brand'] ?? null, $path, 'brand');
    validateTextGroupData($data['address'] ?? null, $path, 'address');
    validateContactGroupData($data['contact'] ?? null, $path, 'contact');
    validateTextGroupData($data['hours'] ?? null, $path, 'hours');
    validateLinksArray($data['socialLinks'] ?? null, $path, 'socialLinks');
    validateLinksArray($data['legalLinks'] ?? null, $path, 'legalLinks');
    validateNonEmptyString($data['copyright'] ?? null, $path, 'copyright');
}

function validateBrandData($value, string $path, string $field): void
{
    if (! is_array($value)) {
        throw new RuntimeException("Shared footer schema at {$path} must provide {$field} as an object.");
    }

    validateNonEmptyString($value['name'] ?? null, $path, "{$field}.name");
    validateNonEmptyString($value['href'] ?? null, $path, "{$field}.href");
    validateNullableString($value['logoSrc'] ?? null, $path, "{$field}.logoSrc");
    validateNullableString($value['logoAlt'] ?? null, $path, "{$field}.logoAlt");
}

function validateTextGroupData($value, string $path, string $field): void
{
    if (! is_array($value)) {
        throw new RuntimeException("Shared footer schema at {$path} must provide {$field} as an object.");
    }

    validateNonEmptyString($value['heading'] ?? null, $path, "{$field}.heading");

    if (! is_array($value['lines'] ?? null)) {
        throw new RuntimeException("Shared footer schema at {$path} must provide {$field}.lines as an array.");
    }

    foreach ($value['lines'] as $index => $line) {
        validateNonEmptyString($line, $path, "{$field}.lines[{$index}]");
    }
}

function validateContactGroupData($value, string $path, string $field): void
{
    if (! is_array($value)) {
        throw new RuntimeException("Shared footer schema at {$path} must provide {$field} as an object.");
    }

    validateNonEmptyString($value['heading'] ?? null, $path, "{$field}.heading");
    validateLinksArray($value['items'] ?? null, $path, "{$field}.items");
}

function validateLinksArray($value, string $path, string $field): void
{
    if (! is_array($value)) {
        throw new RuntimeException("Shared footer schema at {$path} must provide {$field} as an array.");
    }

    foreach ($value as $index => $link) {
        if (! is_array($link)) {
            throw new RuntimeException("Shared footer schema at {$path} must provide {$field}[{$index}] as an object.");
        }

        validateNonEmptyString($link['label'] ?? null, $path, "{$field}[{$index}].label");
        validateNonEmptyString($link['href'] ?? null, $path, "{$field}[{$index}].href");
    }
}

function validateNonEmptyString($value, string $path, string $field): void
{
    if (! is_string($value) || trim($value) === '') {
        throw new RuntimeException("Shared footer schema at {$path} must provide {$field} as a non-empty string.");
    }
}

function validateNullableString($value, string $path, string $field): void
{
    if ($value !== null && ! is_string($value)) {
        throw new RuntimeException("Shared footer schema at {$path} must provide {$field} as a string or null.");
    }
}

function resolveGlobalLayoutOptionName(): string
{
    if (class_exists('BulwarBridge\\Config\\Constants') && method_exists('BulwarBridge\\Config\\Constants', 'globalLayoutOptionName')) {
        return (string) BulwarBridge\Config\Constants::globalLayoutOptionName();
    }

    if (defined('BULWAR_BRIDGE_GLOBAL_LAYOUT_OPTION')) {
        return (string) constant('BULWAR_BRIDGE_GLOBAL_LAYOUT_OPTION');
    }

    return BULWAR_GLOBAL_LAYOUT_DEFAULT_OPTION;
}

function captureGlobalLayoutOptionSnapshot(string $optionName): array
{
    $missingSentinel = new stdClass();
    $rawOption = get_option($optionName, $missingSentinel);
    $exists = $rawOption !== $missingSentinel;

    return [
        'exists' => $exists,
        'value' => $exists ? $rawOption : null,
        'comparisonToken' => $exists ? buildGlobalLayoutOptionComparisonToken($rawOption) : null,
    ];
}

function buildGlobalLayoutOptionComparisonToken($value): string
{
    if (is_resource($value)) {
        throw new RuntimeException('Cannot compare a global layout option snapshot containing a resource.');
    }

    return serialize($value);
}

function backupGlobalLayoutOption(string $optionName, array $optionSnapshot): string
{
    $backupOptionName = sprintf('%s_backup_%s_%s', $optionName, gmdate('Ymd_His'), uniqid());
    $snapshot = [
        'capturedAt' => gmdate('c'),
        'sourceOption' => $optionName,
        'exists' => (bool) ($optionSnapshot['exists'] ?? false),
        'value' => $optionSnapshot['value'] ?? null,
        'comparisonToken' => $optionSnapshot['comparisonToken'] ?? null,
    ];

    $created = add_option($backupOptionName, $snapshot, '', false);

    if ($created !== true) {
        update_option($backupOptionName, $snapshot, false);
    }

    return $backupOptionName;
}

function normalizeGlobalLayoutSettings($rawOption, bool $forceInvalidOption = false): array
{
    if ($rawOption === null || $rawOption === false) {
        return [];
    }

    if (is_array($rawOption)) {
        return $rawOption;
    }

    if (is_string($rawOption)) {
        $trimmed = trim($rawOption);

        if ($trimmed === '') {
            return handleInvalidGlobalLayoutOption('stored option is an empty string', $forceInvalidOption);
        }

        $decoded = json_decode($trimmed, true);

        if (is_array($decoded)) {
            return $decoded;
        }

        return handleInvalidGlobalLayoutOption('stored option JSON is malformed', $forceInvalidOption);
    }

    if (is_object($rawOption)) {
        $decoded = json_decode(encodeJson($rawOption), true);

        if (is_array($decoded)) {
            return $decoded;
        }

        return handleInvalidGlobalLayoutOption('stored option object cannot be converted into an array payload', $forceInvalidOption);
    }

    return handleInvalidGlobalLayoutOption(
        sprintf('stored option has unsupported type %s', gettype($rawOption)),
        $forceInvalidOption
    );
}

function handleInvalidGlobalLayoutOption(string $reason, bool $forceInvalidOption): array
{
    if ($forceInvalidOption === true) {
        return [];
    }

    throw new RuntimeException(
        sprintf(
            'Existing global layout option is malformed: %s. Re-run with --force-invalid-option to continue anyway.',
            $reason
        )
    );
}

function resolveTargetFooterPage(array $options)
{
    if ($options['pageIdProvided'] === true) {
        $page = get_post($options['pageId']);

        if (! $page instanceof WP_Post || $page->post_type !== 'page') {
            throw new RuntimeException(sprintf('No page exists for --page-id=%d.', $options['pageId']));
        }

        assertExistingTargetFooterPageIsSafe($page, $options, sprintf('--page-id=%d', $options['pageId']));

        return $page;
    }

    $matchingPages = get_posts([
        'post_type' => 'page',
        'name' => $options['slug'],
        'post_status' => 'any',
        'posts_per_page' => -1,
        'orderby' => 'ID',
        'order' => 'ASC',
    ]);

    if (! is_array($matchingPages)) {
        return null;
    }

    $pageMatches = array_values(array_filter($matchingPages, static function ($candidate): bool {
        return $candidate instanceof WP_Post;
    }));

    if (count($pageMatches) > 1) {
        $details = array_map(static function (WP_Post $page): string {
            return sprintf('%d:%s:%s', $page->ID, $page->post_name, $page->post_status);
        }, $pageMatches);

        throw new RuntimeException(
            sprintf(
                'Slug lookup for "%s" is ambiguous. Matching page ids/statuses: %s. Re-run with --page-id=<id>.',
                $options['slug'],
                implode(', ', $details)
            )
        );
    }

    $page = $pageMatches[0] ?? null;

    if ($page instanceof WP_Post) {
        assertExistingTargetFooterPageIsSafe($page, $options, sprintf('Slug lookup for "%s"', $options['slug']));
    }

    return $page;
}

function upsertTargetFooterPage($existingPage, array $options): array
{
    if ($existingPage instanceof WP_Post) {
        $updateArgs = [
            'ID' => (int) $existingPage->ID,
        ];

        if ($options['slugProvided'] === true) {
            $updateArgs['post_name'] = $options['slug'];
        }

        if ($options['titleProvided'] === true) {
            $updateArgs['post_title'] = $options['title'];
        }

        if ($options['statusProvided'] === true) {
            $updateArgs['post_status'] = $options['status'];
        }

        if (count($updateArgs) > 1) {
            $updatedId = wp_update_post($updateArgs, true);

            if (is_wp_error($updatedId)) {
                throw new RuntimeException('Failed to update the shared footer page: ' . $updatedId->get_error_message());
            }
        }

        $refreshedPage = get_post((int) $existingPage->ID);

        if (! $refreshedPage instanceof WP_Post || $refreshedPage->post_type !== 'page') {
            $refreshedPage = clone $existingPage;

            if ($options['slugProvided'] === true) {
                $refreshedPage->post_name = $options['slug'];
            }

            if ($options['titleProvided'] === true) {
                $refreshedPage->post_title = $options['title'];
            }

            if ($options['statusProvided'] === true) {
                $refreshedPage->post_status = $options['status'];
            }
        }

        return [
            'page_id' => (int) $refreshedPage->ID,
            'page_action' => count($updateArgs) > 1 ? 'updated' : 'reused',
            'page_slug' => $refreshedPage->post_name,
            'page_title' => $refreshedPage->post_title,
            'page_status' => $refreshedPage->post_status,
        ];
    }

    $pageId = wp_insert_post([
        'post_type' => 'page',
        'post_status' => $options['status'],
        'post_name' => $options['slug'],
        'post_title' => $options['title'],
    ], true);

    if (is_wp_error($pageId)) {
        throw new RuntimeException('Failed to create the shared footer page: ' . $pageId->get_error_message());
    }

    $createdPage = get_post((int) $pageId);

    if (! $createdPage instanceof WP_Post || $createdPage->post_type !== 'page') {
        $createdPage = new stdClass();
        $createdPage->ID = (int) $pageId;
        $createdPage->post_name = $options['slug'];
        $createdPage->post_title = $options['title'];
        $createdPage->post_status = $options['status'];
    }

    return [
        'page_id' => (int) $createdPage->ID,
        'page_action' => 'created',
        'page_slug' => $createdPage->post_name,
        'page_title' => $createdPage->post_title,
        'page_status' => $createdPage->post_status,
    ];
}

function persistSharedFooterSchema(int $pageId, array $schema): void
{
    $encodedSchema = encodeJson($schema);

    update_post_meta($pageId, 'page_builder_schema', $encodedSchema);

    $storedSchema = get_post_meta($pageId, 'page_builder_schema', true);

    if ($storedSchema !== $encodedSchema) {
        throw new RuntimeException(sprintf('Failed to persist page_builder_schema for page %d.', $pageId));
    }
}

function persistFooterPageReference(string $optionName, array $settings, int $pageId): void
{
    $settings['footerPageId'] = $pageId;

    update_option($optionName, $settings, false);

    $storedSettings = normalizeGlobalLayoutSettings(get_option($optionName, null));

    if ((int) ($storedSettings['footerPageId'] ?? 0) !== $pageId) {
        throw new RuntimeException(sprintf('Failed to persist %s.footerPageId=%d.', $optionName, $pageId));
    }
}

function restoreGlobalLayoutOption(string $optionName, array $optionSnapshot): void
{
    if (($optionSnapshot['exists'] ?? false) !== true) {
        delete_option($optionName);

        return;
    }

    update_option($optionName, $optionSnapshot['value'], false);
}

function snapshotGlobalLayoutOptionMatches(array $expectedSnapshot, array $actualSnapshot): bool
{
    $expectedExists = ($expectedSnapshot['exists'] ?? false) === true;
    $actualExists = ($actualSnapshot['exists'] ?? false) === true;

    if ($expectedExists !== $actualExists) {
        return false;
    }

    if ($expectedExists !== true) {
        return true;
    }

    return ($expectedSnapshot['comparisonToken'] ?? null) === ($actualSnapshot['comparisonToken'] ?? null);
}

function assertGlobalLayoutOptionMatchesSnapshot(string $optionName, array $expectedSnapshot): void
{
    $actualSnapshot = captureGlobalLayoutOptionSnapshot($optionName);

    if (snapshotGlobalLayoutOptionMatches($expectedSnapshot, $actualSnapshot)) {
        return;
    }

    throw new RuntimeException(
        sprintf(
            'Global layout option rollback verification failed for %s. Expected %s, got %s.',
            $optionName,
            describeGlobalLayoutOptionSnapshot($expectedSnapshot),
            describeGlobalLayoutOptionSnapshot($actualSnapshot)
        )
    );
}

function describeGlobalLayoutOptionSnapshot(array $snapshot): string
{
    if (($snapshot['exists'] ?? false) !== true) {
        return 'missing option';
    }

    $value = $snapshot['value'] ?? null;

    return sprintf(
        'existing option (%s, comparison=%s)',
        get_debug_type($value),
        (string) ($snapshot['comparisonToken'] ?? '')
    );
}

function verifyGlobalLayoutResolution(bool $skipVerification): array
{
    if ($skipVerification === true) {
        return [
            'available' => false,
            'message' => 'skipped_by_flag',
        ];
    }

    if (! ensureGlobalLayoutResolverLoaded()) {
        return [
            'available' => false,
            'message' => 'resolver_unavailable',
        ];
    }

    $resolved = BulwarBridge\Layout\GlobalLayoutResolver::resolve();
    $meta = is_array($resolved['meta'] ?? null) ? $resolved['meta'] : [];

    return [
        'available' => true,
        'layout_option_status' => (string) ($meta['layout_option_status'] ?? 'missing'),
        'footer_status' => (string) ($meta['footer_status'] ?? 'missing'),
    ];
}

function ensureGlobalLayoutResolverLoaded(): bool
{
    if (class_exists('BulwarBridge\\Layout\\GlobalLayoutResolver')) {
        return true;
    }

    $repoRoot = dirname(__DIR__);
    $constantsPath = $repoRoot . '/wordpress-plugin/bulwar-bridge/src/Config/Constants.php';
    $resolverPath = $repoRoot . '/wordpress-plugin/bulwar-bridge/src/Layout/GlobalLayoutResolver.php';

    if (file_exists($constantsPath)) {
        require_once $constantsPath;
    }

    if (file_exists($resolverPath)) {
        require_once $resolverPath;
    }

    return class_exists('BulwarBridge\\Layout\\GlobalLayoutResolver');
}

function encodeJson($value): string
{
    $encoded = function_exists('wp_json_encode')
        ? wp_json_encode($value, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)
        : json_encode($value, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    if (! is_string($encoded) || $encoded === '') {
        throw new RuntimeException('Failed to encode JSON payload.');
    }

    return $encoded;
}

function approvedFooterPageSlugs(): array
{
    return [BULWAR_SHARED_FOOTER_DEFAULT_SLUG];
}

function assertExistingTargetFooterPageIsSafe(WP_Post $page, array $options, string $targetDescription): void
{
    if ($options['confirmRepurposePage'] === true) {
        return;
    }

    $approvedSlugs = approvedFooterPageSlugs();

    if (in_array($page->post_name, $approvedSlugs, true)) {
        return;
    }

    if (pageHasCompatibleSharedFooterBlock((int) $page->ID)) {
        return;
    }

    throw new RuntimeException(
        sprintf(
            '%s resolved to page "%s" (slug "%s"). Reuse is blocked because the page does not match an approved footer slug (%s) and does not already contain a compatible shared_footer block. Re-run with --confirm-repurpose-page to overwrite this page intentionally.',
            $targetDescription,
            $page->post_title,
            $page->post_name,
            implode(', ', $approvedSlugs)
        )
    );
}

function pageHasCompatibleSharedFooterBlock(int $pageId): bool
{
    $rawSchema = get_post_meta($pageId, 'page_builder_schema', true);
    $decodedSchema = decodeStoredPageBuilderSchema($rawSchema);

    if (! is_array($decodedSchema)) {
        return false;
    }

    $sections = $decodedSchema['sections'] ?? null;

    if (! is_array($sections)) {
        return false;
    }

    foreach ($sections as $section) {
        if (! is_array($section)) {
            continue;
        }

        if (isCompatibleSharedFooterSection($section)) {
            return true;
        }
    }

    return false;
}

function isCompatibleSharedFooterSection(array $section): bool
{
    return ($section['blockKey'] ?? null) === BULWAR_SHARED_FOOTER_BLOCK_KEY
        && ($section['enabled'] ?? false) === true
        && (int) ($section['blockVersion'] ?? 0) === BULWAR_SHARED_FOOTER_BLOCK_VERSION
        && ($section['source'] ?? null) === null
        && is_array($section['data'] ?? null);
}

function decodeStoredPageBuilderSchema($rawSchema)
{
    if (is_array($rawSchema)) {
        return $rawSchema;
    }

    if (is_object($rawSchema)) {
        $decoded = json_decode(encodeJson($rawSchema), true);

        return is_array($decoded) ? $decoded : null;
    }

    if (! is_string($rawSchema)) {
        return null;
    }

    $trimmed = trim($rawSchema);

    if ($trimmed === '') {
        return null;
    }

    $decoded = json_decode($trimmed, true);

    return is_array($decoded) ? $decoded : null;
}

function captureTargetFooterPageSnapshot($page): array
{
    if (! $page instanceof WP_Post) {
        return [
            'exists' => false,
            'page_id' => 0,
            'title' => null,
            'slug' => null,
            'status' => null,
            'page_builder_schema_exists' => false,
            'page_builder_schema' => null,
        ];
    }

    return [
        'exists' => true,
        'page_id' => (int) $page->ID,
        'title' => (string) $page->post_title,
        'slug' => (string) $page->post_name,
        'status' => (string) $page->post_status,
        'page_builder_schema_exists' => metadata_exists('post', (int) $page->ID, 'page_builder_schema'),
        'page_builder_schema' => get_post_meta((int) $page->ID, 'page_builder_schema', true),
    ];
}

function rollbackSeedGlobalLayoutFooterWrite(string $optionName, array $optionSnapshot, array $pageSnapshot, int $pageId): void
{
    restoreGlobalLayoutOption($optionName, $optionSnapshot);
    restoreTargetFooterPageSnapshot($pageSnapshot, $pageId);
    assertGlobalLayoutOptionMatchesSnapshot($optionName, $optionSnapshot);
}

function restoreTargetFooterPageSnapshot(array $snapshot, int $pageId): void
{
    if (($snapshot['exists'] ?? false) !== true) {
        if ($pageId <= 0) {
            return;
        }

        $deleted = wp_delete_post($pageId, true);

        if ($deleted === false) {
            throw new RuntimeException(sprintf('Failed to delete newly created footer page %d during rollback.', $pageId));
        }

        return;
    }

    $snapshotPageId = (int) ($snapshot['page_id'] ?? 0);

    if ($snapshotPageId <= 0) {
        throw new RuntimeException('Rollback snapshot is missing the original page id.');
    }

    $page = get_post($snapshotPageId);

    if (! $page instanceof WP_Post || $page->post_type !== 'page') {
        throw new RuntimeException(sprintf('Failed to reload footer page %d during rollback.', $snapshotPageId));
    }

    $restoredId = wp_update_post([
        'ID' => $snapshotPageId,
        'post_title' => (string) ($snapshot['title'] ?? ''),
        'post_name' => (string) ($snapshot['slug'] ?? ''),
        'post_status' => (string) ($snapshot['status'] ?? BULWAR_SHARED_FOOTER_DEFAULT_STATUS),
    ], true);

    if (is_wp_error($restoredId)) {
        throw new RuntimeException('Failed to restore the footer page fields during rollback: ' . $restoredId->get_error_message());
    }

    if (($snapshot['page_builder_schema_exists'] ?? false) === true) {
        update_post_meta($snapshotPageId, 'page_builder_schema', $snapshot['page_builder_schema']);
    } else {
        delete_post_meta($snapshotPageId, 'page_builder_schema');
    }

    $restoredPage = get_post($snapshotPageId);

    if (! $restoredPage instanceof WP_Post || $restoredPage->post_type !== 'page') {
        throw new RuntimeException(sprintf('Failed to verify footer page %d after rollback.', $snapshotPageId));
    }

    if ($restoredPage->post_title !== (string) ($snapshot['title'] ?? '')
        || $restoredPage->post_name !== (string) ($snapshot['slug'] ?? '')
        || $restoredPage->post_status !== (string) ($snapshot['status'] ?? BULWAR_SHARED_FOOTER_DEFAULT_STATUS)) {
        throw new RuntimeException(sprintf('Footer page %d fields did not restore cleanly during rollback.', $snapshotPageId));
    }

    $schemaExistsNow = metadata_exists('post', $snapshotPageId, 'page_builder_schema');

    if ($schemaExistsNow !== (bool) ($snapshot['page_builder_schema_exists'] ?? false)) {
        throw new RuntimeException(sprintf('Footer page %d schema presence did not restore cleanly during rollback.', $snapshotPageId));
    }

    if ($schemaExistsNow === true) {
        $restoredSchema = get_post_meta($snapshotPageId, 'page_builder_schema', true);

        if ($restoredSchema !== $snapshot['page_builder_schema']) {
            throw new RuntimeException(sprintf('Footer page %d schema content did not restore cleanly during rollback.', $snapshotPageId));
        }
    }
}