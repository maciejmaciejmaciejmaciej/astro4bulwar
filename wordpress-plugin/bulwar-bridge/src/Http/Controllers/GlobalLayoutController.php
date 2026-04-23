<?php

declare(strict_types=1);

namespace BulwarBridge\Http\Controllers;

use BulwarBridge\Layout\GlobalLayoutResolver;
use BulwarBridge\Support\Response;
use WP_REST_Request;

final class GlobalLayoutController
{
    public static function show(WP_REST_Request $request)
    {
        unset($request);

        $resolved = GlobalLayoutResolver::resolve();

        return Response::success([
            'globalLayout' => $resolved['globalLayout'],
        ], 200, $resolved['meta']);
    }
}