<?php

declare(strict_types=1);

namespace BulwarBridge\Http\Controllers;

use BulwarBridge\Config\Constants;
use BulwarBridge\Support\Response;
use WP_Post;
use WP_REST_Request;

final class PageBuilderController
{
    public static function registerMeta(): void
    {
        self::registerSchemaMeta('page_builder_schema');
        self::registerSchemaMeta('page_builder_schema_for_ai');
    }

    public static function index(WP_REST_Request $request)
    {
        unset($request);

        $pages = [];

        foreach (get_posts([
            'post_type' => 'page',
            'post_status' => 'publish',
            'posts_per_page' => -1,
            'orderby' => 'ID',
            'order' => 'ASC',
        ]) as $page) {
            if (! $page instanceof WP_Post) {
                continue;
            }

            $summary = self::buildPageSummary($page);

            if ($summary === null) {
                continue;
            }

            $pages[] = $summary;
        }

        return Response::success([
            'pages' => $pages,
        ], 200, [
            'total' => count($pages),
        ]);
    }

    public static function siteContext(WP_REST_Request $request)
    {
        unset($request);

        [$companyName, $companyNameSource] = self::resolveCompanyName();
        [$websiteUrl, $websiteUrlSource] = self::resolveWebsiteUrl();

        return Response::success([
            'CompanyName' => $companyName,
            'websiteUrl' => $websiteUrl,
        ], 200, [
            'company_name_source' => $companyNameSource,
            'website_url_source' => $websiteUrlSource,
        ]);
    }

    public static function show(WP_REST_Request $request)
    {
        $page = self::resolvePage($request);

        if (! $page instanceof WP_Post) {
            return $page;
        }

        $isPublic = $page->post_status === 'publish';

        if (! $isPublic && ! current_user_can('edit_post', $page->ID)) {
            return Response::error('PAGE_NOT_FOUND', 'Page not found.', 404, false, 'slug');
        }

        $rawSchema = get_post_meta($page->ID, 'page_builder_schema', true);

        if (! is_string($rawSchema) || trim($rawSchema) === '') {
            return Response::error('PAGE_BUILDER_SCHEMA_MISSING', 'page_builder_schema meta is missing.', 404, false, 'page_builder_schema');
        }

        $decoded = json_decode($rawSchema, true);

        if (! is_array($decoded)) {
            return Response::error('PAGE_BUILDER_SCHEMA_INVALID', 'page_builder_schema meta must contain valid JSON.', 500, false, 'page_builder_schema');
        }

        $aiSchema = self::getAiSchema($page);

        return Response::success([
            'pageId' => $page->ID,
            'schema' => self::normalizeSchema($decoded, $page),
            'aiSchema' => $aiSchema,
        ], 200, [
            'post_status' => $page->post_status,
        ]);
    }

    public static function update(WP_REST_Request $request)
    {
        $page = self::resolvePage($request);

        if (! $page instanceof WP_Post) {
            return $page;
        }

        if (! current_user_can('edit_post', $page->ID)) {
            return Response::error('PAGE_UPDATE_FORBIDDEN', 'You are not allowed to update this page.', 403, false);
        }

        $body = $request->get_json_params();

        if (! is_array($body)) {
            return Response::error('INVALID_JSON', 'Request body must be valid JSON.', 400, false);
        }

        $schema = self::coerceSchemaPayload($body['schema'] ?? null, 'schema');

        if (! is_array($schema)) {
            return $schema;
        }

        $aiSchema = self::coerceSchemaPayload($body['aiSchema'] ?? null, 'aiSchema');

        if (! is_array($aiSchema)) {
            return $aiSchema;
        }

        $normalizedSchema = self::normalizeSchema($schema, $page);
        $normalizedAiSchema = self::normalizeAiSchema($aiSchema, $page);

        update_post_meta($page->ID, 'page_builder_schema', wp_json_encode($normalizedSchema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
        update_post_meta($page->ID, 'page_builder_schema_for_ai', wp_json_encode($normalizedAiSchema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));

        return Response::success([
            'pageId' => $page->ID,
            'schema' => $normalizedSchema,
            'aiSchema' => $normalizedAiSchema,
        ], 200, [
            'post_status' => $page->post_status,
            'updated_meta_keys' => [
                'page_builder_schema',
                'page_builder_schema_for_ai',
            ],
        ]);
    }

    private static function registerSchemaMeta(string $metaKey): void
    {
        register_post_meta('page', $metaKey, [
            'single' => true,
            'type' => 'string',
            'show_in_rest' => true,
            'sanitize_callback' => [self::class, 'sanitizeSchemaMeta'],
            'auth_callback' => static function () : bool {
                return current_user_can('edit_pages');
            },
        ]);
    }

    public static function sanitizeSchemaMeta($value): string
    {
        if (! is_string($value)) {
            return '';
        }

        $decoded = json_decode($value, true);

        if (! is_array($decoded)) {
            return trim($value);
        }

        return (string) wp_json_encode($decoded, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }

    private static function resolvePage(WP_REST_Request $request)
    {
        $slug = trim((string) $request->get_param('slug'));

        if ($slug === '') {
            return Response::error('PAGE_SLUG_REQUIRED', 'Page slug is required.', 400, false, 'slug');
        }

        $page = get_page_by_path(sanitize_title_for_query($slug), OBJECT, 'page');

        if (! $page instanceof WP_Post) {
            return Response::error('PAGE_NOT_FOUND', 'Page not found.', 404, false, 'slug');
        }

        return $page;
    }

    private static function coerceSchemaPayload($value, string $field)
    {
        if (is_array($value)) {
            return $value;
        }

        if (! is_string($value) || trim($value) === '') {
            return Response::error('VALIDATION_ERROR', sprintf('%s must be a non-empty object or JSON string.', $field), 400, false, $field);
        }

        $decoded = json_decode($value, true);

        if (! is_array($decoded)) {
            return Response::error('VALIDATION_ERROR', sprintf('%s must contain valid JSON.', $field), 400, false, $field);
        }

        return $decoded;
    }

    /**
     * @return array{0: string|null, 1: string}
     */
    private static function resolveCompanyName(): array
    {
        $optionValue = self::getSiteContextOptionValue('companyName');

        if ($optionValue !== null) {
            return [$optionValue, 'bridge_option'];
        }

        $blogName = self::normalizeString(get_option('blogname', ''));

        return [$blogName, 'blogname'];
    }

    /**
     * @return array{0: string|null, 1: string}
     */
    private static function resolveWebsiteUrl(): array
    {
        $optionValue = self::getSiteContextOptionValue('websiteUrl');

        if ($optionValue !== null) {
            return [$optionValue, 'bridge_option'];
        }

        return [self::normalizeString(home_url('/')), 'home_url'];
    }

    private static function getSiteContextOptionValue(string $key): ?string
    {
        $raw = get_option(Constants::siteContextOptionName(), []);

        if (! is_array($raw)) {
            return null;
        }

        return self::normalizeString($raw[$key] ?? null);
    }

    private static function normalizeString($value): ?string
    {
        if (! is_string($value)) {
            return null;
        }

        $trimmedValue = trim($value);

        return $trimmedValue === '' ? null : $trimmedValue;
    }

    /**
     * @return array<string, mixed>|null
     */
    private static function buildPageSummary(WP_Post $page): ?array
    {
        $schema = self::getListingSchema($page);

        if ($schema === null) {
            return null;
        }

        $normalized = self::normalizeListingSchema($schema, $page);
        $pageData = isset($normalized['page']) && is_array($normalized['page']) ? $normalized['page'] : [];
        $seoData = isset($normalized['seo']) && is_array($normalized['seo']) ? $normalized['seo'] : [];
        $status = isset($pageData['status']) && is_string($pageData['status']) ? $pageData['status'] : self::mapPostStatus($page->post_status);

        if ($status !== 'published') {
            return null;
        }

        if (($seoData['noindex'] ?? false) === true) {
            return null;
        }

        return [
            'pageId' => $page->ID,
            'slug' => $page->post_name,
            'title' => $page->post_title,
            'status' => $status,
        ];
    }

    /**
     * @return array<string, mixed>|null
     */
    private static function getListingSchema(WP_Post $page): ?array
    {
        $rawSchema = get_post_meta($page->ID, 'page_builder_schema', true);

        if (! is_string($rawSchema) || trim($rawSchema) === '') {
            return null;
        }

        $decoded = json_decode($rawSchema, true);

        if (! is_array($decoded) || $decoded === []) {
            return null;
        }

        return $decoded;
    }

    /**
     * @param array<string, mixed> $schema
     * @return array<string, mixed>
     */
    private static function normalizeListingSchema(array $schema, WP_Post $page): array
    {
        $pageData = isset($schema['page']) && is_array($schema['page']) ? $schema['page'] : [];
        $seoData = isset($schema['seo']) && is_array($schema['seo']) ? $schema['seo'] : [];

        $schema['page'] = array_merge($pageData, [
            'slug' => $page->post_name,
            'title' => $page->post_title,
            'status' => self::resolveSchemaStatus($pageData['status'] ?? null, $page->post_status),
        ]);
        $schema['seo'] = array_merge($seoData, [
            'noindex' => ($seoData['noindex'] ?? false) === true,
        ]);

        return $schema;
    }

    /**
     * @param array<string, mixed> $schema
     * @return array<string, mixed>
     */
    private static function normalizeSchema(array $schema, WP_Post $page): array
    {
        $pageData = isset($schema['page']) && is_array($schema['page']) ? $schema['page'] : [];

        $schema['version'] = isset($schema['version']) ? (int) $schema['version'] : 1;
        $schema['sections'] = isset($schema['sections']) && is_array($schema['sections']) ? array_values($schema['sections']) : [];
        $schema['page'] = array_merge($pageData, [
            'slug' => $page->post_name,
            'title' => $page->post_title,
            'status' => self::mapPostStatus($page->post_status),
        ]);
        $schema['seo'] = self::normalizeSeoSchema($schema['seo'] ?? null);

        return $schema;
    }

    /**
     * @param mixed $rawSeoData
     * @return array<string, mixed>
     */
    private static function normalizeSeoSchema($rawSeoData): array
    {
        $seoData = is_array($rawSeoData) ? $rawSeoData : [];
        $normalizedSeo = [
            'noindex' => ($seoData['noindex'] ?? false) === true,
        ];

        foreach (['title', 'description', 'canonical'] as $field) {
            if (isset($seoData[$field]) && is_string($seoData[$field])) {
                $normalizedSeo[$field] = $seoData[$field];
            }
        }

        $robotsData = $seoData['robots'] ?? null;

        if (is_array($robotsData)) {
            $normalizedRobots = [];

            foreach (['index', 'follow'] as $field) {
                if (isset($robotsData[$field]) && is_bool($robotsData[$field])) {
                    $normalizedRobots[$field] = $robotsData[$field];
                }
            }

            if ($normalizedRobots !== []) {
                $normalizedSeo['robots'] = $normalizedRobots;
            }
        }

        $ogData = $seoData['og'] ?? null;

        if (is_array($ogData)) {
            $normalizedOg = [];

            foreach (['title', 'description', 'image', 'type'] as $field) {
                if (isset($ogData[$field]) && is_string($ogData[$field])) {
                    $normalizedOg[$field] = $ogData[$field];
                }
            }

            if ($normalizedOg !== []) {
                $normalizedSeo['og'] = $normalizedOg;
            }
        }

        return $normalizedSeo;
    }

    /**
     * @return array<string, mixed>|null
     */
    private static function getAiSchema(WP_Post $page): ?array
    {
        $rawAiSchema = get_post_meta($page->ID, 'page_builder_schema_for_ai', true);

        if (! is_string($rawAiSchema) || trim($rawAiSchema) === '') {
            return null;
        }

        $decoded = json_decode($rawAiSchema, true);

        if (! is_array($decoded)) {
            return null;
        }

        return self::normalizeAiSchema($decoded, $page);
    }

    /**
     * @param array<string, mixed> $schema
     * @return array<string, mixed>
     */
    private static function normalizeAiSchema(array $schema, WP_Post $page): array
    {
        $schema['version'] = isset($schema['version']) ? (int) $schema['version'] : 1;
        $schema['postId'] = $page->ID;
        $schema['slug'] = $page->post_name;
        $schema['title'] = $page->post_title;
        $schema['blocks'] = isset($schema['blocks']) && is_array($schema['blocks']) ? array_values($schema['blocks']) : [];

        return $schema;
    }

    private static function resolveSchemaStatus($value, string $postStatus): string
    {
        if (is_string($value)) {
            $normalized = strtolower(trim($value));

            if (in_array($normalized, ['draft', 'published', 'archived'], true)) {
                return $normalized;
            }
        }

        return self::mapPostStatus($postStatus);
    }

    private static function mapPostStatus(string $postStatus): string
    {
        if ($postStatus === 'publish') {
            return 'published';
        }

        if (in_array($postStatus, ['trash', 'private'], true)) {
            return 'archived';
        }

        return 'draft';
    }
}