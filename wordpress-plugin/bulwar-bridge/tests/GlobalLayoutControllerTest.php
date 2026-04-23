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

    $GLOBALS['bulwar_test_options'] = [];
    $GLOBALS['bulwar_test_posts'] = [];
    $GLOBALS['bulwar_test_post_meta'] = [];
    $GLOBALS['bulwar_test_routes'] = [];

    function wp_generate_uuid4(): string
    {
        return '00000000-0000-4000-8000-000000000000';
    }

    function wp_json_encode($value, int $flags = 0): string
    {
        return (string) json_encode($value, $flags);
    }

    function get_option(string $name, $default = false)
    {
        return $GLOBALS['bulwar_test_options'][$name] ?? $default;
    }

    function get_post(int $postId)
    {
        return $GLOBALS['bulwar_test_posts'][$postId] ?? null;
    }

    function get_post_meta(int $postId, string $metaKey, bool $single = false)
    {
        $value = $GLOBALS['bulwar_test_post_meta'][$postId][$metaKey] ?? ($single ? '' : []);

        if ($single) {
            return $value;
        }

        return [$value];
    }

    function register_rest_route(string $namespace, string $route, array $args): void
    {
        $GLOBALS['bulwar_test_routes'][] = [
            'namespace' => $namespace,
            'route' => $route,
            'args' => $args,
        ];
    }

    function current_user_can(string $capability, ...$args): bool
    {
        unset($capability, $args);

        return true;
    }
}

namespace BulwarBridge\Http\Controllers {
    final class HealthController
    {
    }

    final class CheckoutController
    {
    }

    final class PageBuilderController
    {
    }
}

namespace {
    require_once __DIR__ . '/../src/Config/Constants.php';
    require_once __DIR__ . '/../src/Support/Response.php';
    require_once __DIR__ . '/../src/Layout/GlobalLayoutResolver.php';
    require_once __DIR__ . '/../src/Http/Controllers/GlobalLayoutController.php';
    require_once __DIR__ . '/../src/Http/Routes.php';

    use BulwarBridge\Config\Constants;
    use BulwarBridge\Http\Controllers\GlobalLayoutController;
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

    /** @param array<string, mixed> $value */
    function setGlobalLayoutOption(array $value): void
    {
        $GLOBALS['bulwar_test_options'][Constants::globalLayoutOptionName()] = $value;
    }

    function resetWordPressState(): void
    {
        $GLOBALS['bulwar_test_options'] = [];
        $GLOBALS['bulwar_test_posts'] = [];
        $GLOBALS['bulwar_test_post_meta'] = [];
        $GLOBALS['bulwar_test_routes'] = [];
    }

    /** @return array<string, mixed> */
    function buildNavbarFixture(): array
    {
        return [
            'brand' => [
                'name' => 'Bulwar',
                'href' => '/',
                'logoSrc' => '/react/images/logo.png',
                'logoAlt' => null,
            ],
            'primaryItems' => [
                [
                    'label' => 'Menu',
                    'href' => '/menu',
                    'description' => 'Pelna karta restauracji.',
                    'children' => [],
                ],
            ],
            'companyLinks' => [
                [
                    'label' => '+48 533 181 171',
                    'href' => 'tel:+48533181171',
                ],
            ],
            'legalLinks' => [
                [
                    'label' => 'Regulamin',
                    'href' => '/regulamin',
                ],
            ],
        ];
    }

    /** @return array<string, mixed> */
    function buildFooterFixture(): array
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
                'lines' => ['Restauracja "BulwaR"', 'Stary Rynek 37', 'Poznan'],
            ],
            'contact' => [
                'heading' => 'Kontakt',
                'items' => [
                    [
                        'label' => '+48 533 181 171',
                        'href' => 'tel:+48533181171',
                    ],
                ],
            ],
            'hours' => [
                'heading' => 'Godziny',
                'lines' => ['Codziennie od 09.00 do 23.00'],
            ],
            'socialLinks' => [
                [
                    'label' => 'Instagram',
                    'href' => 'https://www.instagram.com/bulwar/',
                ],
            ],
            'legalLinks' => [
                [
                    'label' => 'Polityka prywatnosci',
                    'href' => 'https://bulwarrestauracja.pl/polityka-prywatnosci/',
                ],
            ],
            'copyright' => '(c) 2026 Restauracja BulwaR. All rights reserved.',
        ];
    }

    function testGlobalLayoutControllerResolvesSharedFooterBlock(): void
    {
        resetWordPressState();

        setGlobalLayoutOption([
            'navbar' => buildNavbarFixture(),
            'footerPageId' => 37,
        ]);

        $GLOBALS['bulwar_test_posts'][37] = new \WP_Post(37, 'page', 'publish', 'shared-footer', 'Shared Footer');
        $GLOBALS['bulwar_test_post_meta'][37]['page_builder_schema'] = json_encode([
            'version' => 1,
            'sections' => [
                [
                    'id' => 'shared-footer-main',
                    'blockKey' => 'shared_footer',
                    'blockVersion' => 1,
                    'variant' => null,
                    'enabled' => true,
                    'data' => buildFooterFixture(),
                    'source' => null,
                    'meta' => [],
                ],
            ],
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        $response = GlobalLayoutController::show(new \WP_REST_Request());
        $data = $response->get_data();

        assertSameValue(200, $response->get_status(), 'Global layout endpoint should return HTTP 200.');
        assertTrueValue($data['success'] === true, 'Global layout endpoint should return a success envelope.');
        assertSameValue('Bulwar', $data['data']['globalLayout']['navbar']['brand']['name'], 'Navbar data should come from the global settings option.');
        assertSameValue('Adres', $data['data']['globalLayout']['footer']['address']['heading'], 'Footer data should be resolved from the shared footer block.');
        assertTrueValue(! array_key_exists('footerPageId', $data['data']['globalLayout']), 'Public payload must not expose footerPageId.');
        assertSameValue('resolved', $data['meta']['footer_status'], 'Resolved footer should mark the footer status in response meta.');
    }

    function testGlobalLayoutControllerFallsBackWhenFooterReferenceIsMissing(): void
    {
        resetWordPressState();

        setGlobalLayoutOption([
            'navbar' => buildNavbarFixture(),
        ]);

        $response = GlobalLayoutController::show(new \WP_REST_Request());
        $data = $response->get_data();

        assertSameValue(200, $response->get_status(), 'Fallback global layout response should still succeed.');
        assertSameValue([], $data['data']['globalLayout']['footer']['address']['lines'], 'Missing footer reference should return the stable empty footer lines fallback.');
        assertSameValue([], $data['data']['globalLayout']['footer']['contact']['items'], 'Missing footer reference should return the stable empty footer contact fallback.');
        assertSameValue('fallback_missing_footer_page_id', $data['meta']['footer_status'], 'Missing footer reference should be explicit in response meta.');
    }

    function testRoutesRegisterPublicGlobalLayoutEndpoint(): void
    {
        resetWordPressState();

        Routes::register();

        $matchedRoute = null;

        foreach ($GLOBALS['bulwar_test_routes'] as $route) {
            if ($route['namespace'] === 'bulwar/v1' && $route['route'] === '/layout/global' && $route['args']['methods'] === 'GET') {
                $matchedRoute = $route;
                break;
            }
        }

        assertTrueValue(is_array($matchedRoute), 'Routes::register should expose GET /layout/global.');
        assertSameValue([GlobalLayoutController::class, 'show'], $matchedRoute['args']['callback'], 'The public global layout route should target GlobalLayoutController::show.');
        assertSameValue('__return_true', $matchedRoute['args']['permission_callback'], 'The public global layout route should stay public.');
    }

    testGlobalLayoutControllerResolvesSharedFooterBlock();
    testGlobalLayoutControllerFallsBackWhenFooterReferenceIsMissing();
    testRoutesRegisterPublicGlobalLayoutEndpoint();

    echo "GlobalLayoutController tests passed\n";
}