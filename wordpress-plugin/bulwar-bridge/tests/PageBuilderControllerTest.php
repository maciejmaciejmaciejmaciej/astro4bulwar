<?php

declare(strict_types=1);

namespace {
    if (! class_exists('WP_REST_Response')) {
        class WP_REST_Response
        {
            /** @var array<string, mixed> */
            private array $data;
            private int $status;

            /** @param array<string, mixed> $data */
            public function __construct(array $data, int $status = 200)
            {
                $this->data = $data;
                $this->status = $status;
            }

            /** @return array<string, mixed> */
            public function get_data(): array
            {
                return $this->data;
            }

            public function get_status(): int
            {
                return $this->status;
            }
        }
    }

    if (! class_exists('WP_REST_Request')) {
        class WP_REST_Request
        {
            /** @var array<string, mixed> */
            private array $params;

            /** @var array<string, mixed>|null */
            private ?array $jsonParams;

            /**
             * @param array<string, mixed> $params
             * @param array<string, mixed>|null $jsonParams
             */
            public function __construct(array $params = [], ?array $jsonParams = null)
            {
                $this->params = $params;
                $this->jsonParams = $jsonParams;
            }

            public function get_param(string $key)
            {
                return $this->params[$key] ?? null;
            }

            /** @return array<string, mixed>|null */
            public function get_json_params(): ?array
            {
                return $this->jsonParams;
            }
        }
    }

    if (! class_exists('WP_Post')) {
        class WP_Post
        {
            public int $ID;
            public string $post_type;
            public string $post_status;
            public string $post_name;
            public string $post_title;

            public function __construct(int $id, string $postType, string $postStatus, string $postName, string $postTitle)
            {
                $this->ID = $id;
                $this->post_type = $postType;
                $this->post_status = $postStatus;
                $this->post_name = $postName;
                $this->post_title = $postTitle;
            }
        }
    }

    if (! defined('OBJECT')) {
        define('OBJECT', 'OBJECT');
    }

    $GLOBALS['bulwar_test_posts'] = [];
    $GLOBALS['bulwar_test_post_meta'] = [];
    $GLOBALS['bulwar_test_options'] = [];
    $GLOBALS['bulwar_test_routes'] = [];
    $GLOBALS['bulwar_test_registered_meta'] = [];

    function wp_generate_uuid4(): string
    {
        return '00000000-0000-4000-8000-000000000000';
    }

    function wp_json_encode($value, int $flags = 0): string
    {
        return (string) json_encode($value, $flags);
    }

    function current_user_can(string $capability, ...$args): bool
    {
        unset($capability, $args);

        return true;
    }

    function get_option(string $name, $default = false)
    {
        return $GLOBALS['bulwar_test_options'][$name] ?? $default;
    }

    function home_url(string $path = ''): string
    {
        return 'https://example.test' . $path;
    }

    function sanitize_title_for_query(string $title): string
    {
        return trim($title);
    }

    function get_page_by_path(string $path, string $output = OBJECT, string $postType = 'page')
    {
        unset($output);

        foreach ($GLOBALS['bulwar_test_posts'] as $post) {
            if ($post instanceof \WP_Post && $post->post_type === $postType && $post->post_name === $path) {
                return $post;
            }
        }

        return null;
    }

    function get_post_meta(int $postId, string $metaKey, bool $single = false)
    {
        $value = $GLOBALS['bulwar_test_post_meta'][$postId][$metaKey] ?? ($single ? '' : []);

        if ($single) {
            return $value;
        }

        return [$value];
    }

    function update_post_meta(int $postId, string $metaKey, $value): void
    {
        $GLOBALS['bulwar_test_post_meta'][$postId][$metaKey] = $value;
    }

    function register_post_meta(string $postType, string $metaKey, array $args): void
    {
        $GLOBALS['bulwar_test_registered_meta'][] = [
            'post_type' => $postType,
            'meta_key' => $metaKey,
            'args' => $args,
        ];
    }

    function register_rest_route(string $namespace, string $route, array $args): void
    {
        $GLOBALS['bulwar_test_routes'][] = [
            'namespace' => $namespace,
            'route' => $route,
            'args' => $args,
        ];
    }

    /** @param array<string, mixed> $args */
    function get_posts(array $args): array
    {
        $postType = $args['post_type'] ?? 'post';
        $postStatus = $args['post_status'] ?? 'publish';

        $posts = [];

        foreach ($GLOBALS['bulwar_test_posts'] as $post) {
            if (! $post instanceof \WP_Post) {
                continue;
            }

            if ($post->post_type !== $postType) {
                continue;
            }

            if ($post->post_status !== $postStatus) {
                continue;
            }

            $posts[] = $post;
        }

        return $posts;
    }
}

namespace BulwarBridge\Http\Controllers {
    final class HealthController
    {
    }

    final class CheckoutController
    {
    }

    final class GlobalLayoutController
    {
    }
}

namespace {
    require_once __DIR__ . '/../src/Config/Constants.php';
    require_once __DIR__ . '/../src/Support/Response.php';
    require_once __DIR__ . '/../src/Http/Controllers/PageBuilderController.php';
    require_once __DIR__ . '/../src/Http/Routes.php';

    use BulwarBridge\Config\Constants;
    use BulwarBridge\Http\Controllers\PageBuilderController;
    use BulwarBridge\Http\Routes;

    function assertSameValue($expected, $actual, string $message): void
    {
        if ($expected !== $actual) {
            throw new \RuntimeException($message . '\nExpected: ' . var_export($expected, true) . '\nActual: ' . var_export($actual, true));
        }
    }

    function assertTrueValue(bool $condition, string $message): void
    {
        if (! $condition) {
            throw new \RuntimeException($message);
        }
    }

    function resetWordPressState(): void
    {
        $GLOBALS['bulwar_test_posts'] = [];
        $GLOBALS['bulwar_test_post_meta'] = [];
        $GLOBALS['bulwar_test_options'] = [];
        $GLOBALS['bulwar_test_routes'] = [];
        $GLOBALS['bulwar_test_registered_meta'] = [];
    }

    /** @param array<string, mixed> $schema */
    function setPageSchema(int $postId, array $schema): void
    {
        $GLOBALS['bulwar_test_post_meta'][$postId]['page_builder_schema'] = json_encode($schema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }

    function testPageBuilderControllerIndexListsOnlyBuildablePublishedPages(): void
    {
        resetWordPressState();

        $GLOBALS['bulwar_test_posts'][101] = new \WP_Post(101, 'page', 'publish', 'wedding-catering', 'Wedding Catering');
        setPageSchema(101, [
            'version' => 1,
            'page' => [
                'status' => 'published',
            ],
            'seo' => [
                'noindex' => false,
            ],
            'sections' => [],
        ]);

        $GLOBALS['bulwar_test_posts'][102] = new \WP_Post(102, 'page', 'publish', 'seasonal-menu', 'Seasonal Menu');
        setPageSchema(102, [
            'version' => 1,
            'page' => [],
            'sections' => [],
        ]);

        $GLOBALS['bulwar_test_posts'][103] = new \WP_Post(103, 'page', 'publish', 'private-offer', 'Private Offer');
        setPageSchema(103, [
            'version' => 1,
            'page' => [
                'status' => 'draft',
            ],
            'sections' => [],
        ]);

        $GLOBALS['bulwar_test_posts'][104] = new \WP_Post(104, 'page', 'publish', 'hidden-page', 'Hidden Page');
        setPageSchema(104, [
            'version' => 1,
            'page' => [
                'status' => 'published',
            ],
            'seo' => [
                'noindex' => true,
            ],
            'sections' => [],
        ]);

        $GLOBALS['bulwar_test_posts'][105] = new \WP_Post(105, 'page', 'draft', 'draft-page', 'Draft Page');
        setPageSchema(105, [
            'version' => 1,
            'page' => [
                'status' => 'published',
            ],
            'sections' => [],
        ]);

        $GLOBALS['bulwar_test_posts'][106] = new \WP_Post(106, 'page', 'publish', 'missing-schema', 'Missing Schema');
        $GLOBALS['bulwar_test_post_meta'][106]['page_builder_schema'] = '';

        $GLOBALS['bulwar_test_posts'][107] = new \WP_Post(107, 'page', 'publish', 'invalid-schema', 'Invalid Schema');
        $GLOBALS['bulwar_test_post_meta'][107]['page_builder_schema'] = '{invalid';

        $GLOBALS['bulwar_test_posts'][108] = new \WP_Post(108, 'page', 'publish', 'empty-schema', 'Empty Schema');
        $GLOBALS['bulwar_test_post_meta'][108]['page_builder_schema'] = '{}';

        $response = PageBuilderController::index(new \WP_REST_Request());
        $data = $response->get_data();

        assertSameValue(200, $response->get_status(), 'Listing endpoint should return HTTP 200.');
        assertTrueValue($data['success'] === true, 'Listing endpoint should return a success envelope.');
        assertSameValue(2, $data['meta']['total'], 'Listing endpoint should return only buildable published pages.');
        assertSameValue([
            [
                'pageId' => 101,
                'slug' => 'wedding-catering',
                'title' => 'Wedding Catering',
                'status' => 'published',
            ],
            [
                'pageId' => 102,
                'slug' => 'seasonal-menu',
                'title' => 'Seasonal Menu',
                'status' => 'published',
            ],
        ], $data['data']['pages'], 'Listing endpoint should expose lightweight page summaries for buildable pages only.');
    }

    function testPageBuilderControllerShowNormalizesSeoForFallbackSafeBuilds(): void
    {
        resetWordPressState();

        $GLOBALS['bulwar_test_posts'][109] = new \WP_Post(109, 'page', 'publish', 'seo-fallback-page', 'SEO Fallback Page');
        setPageSchema(109, [
            'version' => 1,
            'page' => [],
            'seo' => [
                'title' => 'Komunie w Bulwarze',
                'canonical' => '/oferta/komunie',
                'robots' => 'invalid',
                'og' => 'invalid',
            ],
            'sections' => [],
        ]);

        $response = PageBuilderController::show(new \WP_REST_Request(['slug' => 'seo-fallback-page']));
        $data = $response->get_data();

        assertSameValue(200, $response->get_status(), 'Show endpoint should return HTTP 200 for a published page with page_builder_schema.');
        assertTrueValue($data['success'] === true, 'Show endpoint should return a success envelope.');
        assertSameValue([
            'title' => 'Komunie w Bulwarze',
            'canonical' => '/oferta/komunie',
            'noindex' => false,
        ], $data['data']['schema']['seo'], 'Show endpoint should normalize SEO so Astro can fall back when fields are missing or malformed.');

        $GLOBALS['bulwar_test_posts'][110] = new \WP_Post(110, 'page', 'publish', 'missing-seo-page', 'Missing SEO Page');
        setPageSchema(110, [
            'version' => 1,
            'page' => [],
            'sections' => [],
        ]);

        $missingSeoResponse = PageBuilderController::show(new \WP_REST_Request(['slug' => 'missing-seo-page']));
        $missingSeoData = $missingSeoResponse->get_data();

        assertSameValue([
            'noindex' => false,
        ], $missingSeoData['data']['schema']['seo'], 'Show endpoint should always return an SEO object even when the stored schema omits it.');
    }

    function testPageBuilderControllerUpdatePersistsNormalizedSeoContract(): void
    {
        resetWordPressState();

        $GLOBALS['bulwar_test_posts'][111] = new \WP_Post(111, 'page', 'publish', 'seo-contract-page', 'SEO Contract Page');

        $response = PageBuilderController::update(new \WP_REST_Request(
            ['slug' => 'seo-contract-page'],
            [
                'schema' => [
                    'version' => 1,
                    'page' => [],
                    'seo' => [
                        'title' => 'Menu sezonowe Bulwar',
                        'canonical' => '/oferta/menu-sezonowe',
                        'robots' => 'invalid',
                        'og' => [
                            'image' => '/uploads/seo/menu-sezonowe.webp',
                            'type' => 'website',
                        ],
                    ],
                    'sections' => [],
                ],
                'aiSchema' => [
                    'version' => 1,
                    'page' => [],
                    'blocks' => [],
                ],
            ],
        ));
        $data = $response->get_data();
        $storedSchema = json_decode((string) $GLOBALS['bulwar_test_post_meta'][111]['page_builder_schema'], true);

        assertSameValue(200, $response->get_status(), 'Update endpoint should return HTTP 200 for a valid schema payload.');
        assertTrueValue($data['success'] === true, 'Update endpoint should return a success envelope.');
        assertSameValue([
            'title' => 'Menu sezonowe Bulwar',
            'canonical' => '/oferta/menu-sezonowe',
            'noindex' => false,
            'og' => [
                'image' => '/uploads/seo/menu-sezonowe.webp',
                'type' => 'website',
            ],
        ], $storedSchema['seo'], 'Update endpoint should persist a normalized SEO object instead of raw invalid payload fragments.');
        assertSameValue('seo-contract-page', $storedSchema['page']['slug'], 'Update endpoint should persist normalized page metadata in page_builder_schema.');
        assertSameValue('SEO Contract Page', $storedSchema['page']['title'], 'Update endpoint should persist the current WordPress page title in page_builder_schema.');
        assertSameValue('published', $storedSchema['page']['status'], 'Update endpoint should persist the mapped WordPress page status in page_builder_schema.');
    }

    function testRoutesRegisterPublicPageBuilderListingEndpoint(): void
    {
        resetWordPressState();

        Routes::register();

        $matchedRoute = null;

        foreach ($GLOBALS['bulwar_test_routes'] as $route) {
            if ($route['namespace'] === 'bulwar/v1' && $route['route'] === '/page-builder/pages' && $route['args']['methods'] === 'GET') {
                $matchedRoute = $route;
                break;
            }
        }

        assertTrueValue(is_array($matchedRoute), 'Routes::register should expose GET /page-builder/pages.');
        assertSameValue([PageBuilderController::class, 'index'], $matchedRoute['args']['callback'], 'The public page-builder listing route should target PageBuilderController::index.');
        assertSameValue('__return_true', $matchedRoute['args']['permission_callback'], 'The public page-builder listing route should stay public.');
    }

    function testPageBuilderControllerSiteContextUsesBridgeOptionsWithFallbacks(): void
    {
        resetWordPressState();

        $GLOBALS['bulwar_test_options'][Constants::siteContextOptionName()] = [
            'companyName' => 'Bulwar Restauracja',
            'websiteUrl' => 'https://bulwarrestauracja.pl/',
        ];

        $response = PageBuilderController::siteContext(new \WP_REST_Request());
        $data = $response->get_data();

        assertSameValue(200, $response->get_status(), 'Site context endpoint should return HTTP 200.');
        assertTrueValue($data['success'] === true, 'Site context endpoint should return a success envelope.');
        assertSameValue('Bulwar Restauracja', $data['data']['CompanyName'], 'Site context should expose CompanyName from the bridge option when present.');
        assertSameValue('https://bulwarrestauracja.pl/', $data['data']['websiteUrl'], 'Site context should expose websiteUrl from the bridge option when present.');
        assertSameValue('bridge_option', $data['meta']['company_name_source'], 'Site context should report the company source.');
        assertSameValue('bridge_option', $data['meta']['website_url_source'], 'Site context should report the website source.');

        resetWordPressState();
        $GLOBALS['bulwar_test_options']['blogname'] = 'Fallback Blog';

        $fallbackResponse = PageBuilderController::siteContext(new \WP_REST_Request());
        $fallbackData = $fallbackResponse->get_data();

        assertSameValue('Fallback Blog', $fallbackData['data']['CompanyName'], 'Site context should fall back to blogname when the bridge option is absent.');
        assertSameValue('https://example.test/', $fallbackData['data']['websiteUrl'], 'Site context should fall back to home_url when the bridge option is absent.');
        assertSameValue('blogname', $fallbackData['meta']['company_name_source'], 'Fallback company source should be blogname.');
        assertSameValue('home_url', $fallbackData['meta']['website_url_source'], 'Fallback website source should be home_url.');
    }

    function testRoutesRegisterPublicPageBuilderSiteContextEndpoint(): void
    {
        resetWordPressState();

        Routes::register();

        $matchedRoute = null;

        foreach ($GLOBALS['bulwar_test_routes'] as $route) {
            if ($route['namespace'] === 'bulwar/v1' && $route['route'] === '/page-builder/site-context' && $route['args']['methods'] === 'GET') {
                $matchedRoute = $route;
                break;
            }
        }

        assertTrueValue(is_array($matchedRoute), 'Routes::register should expose GET /page-builder/site-context.');
        assertSameValue([PageBuilderController::class, 'siteContext'], $matchedRoute['args']['callback'], 'The public site-context route should target PageBuilderController::siteContext.');
        assertSameValue('__return_true', $matchedRoute['args']['permission_callback'], 'The public site-context route should stay public.');
    }

    testPageBuilderControllerIndexListsOnlyBuildablePublishedPages();
    testPageBuilderControllerShowNormalizesSeoForFallbackSafeBuilds();
    testPageBuilderControllerUpdatePersistsNormalizedSeoContract();
    testRoutesRegisterPublicPageBuilderListingEndpoint();
    testPageBuilderControllerSiteContextUsesBridgeOptionsWithFallbacks();
    testRoutesRegisterPublicPageBuilderSiteContextEndpoint();

    echo "PageBuilderController tests passed\n";
}