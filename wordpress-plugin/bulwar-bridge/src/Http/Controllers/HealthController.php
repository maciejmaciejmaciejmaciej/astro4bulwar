<?php

declare(strict_types=1);

namespace BulwarBridge\Http\Controllers;

use BulwarBridge\Config\Constants;
use BulwarBridge\Support\Response;

final class HealthController
{
    public static function show()
    {
        $config = Constants::all();

        return Response::success([
            'plugin' => 'bulwar-bridge',
            'namespace' => 'bulwar/v1',
            'stage' => 'stage-1-skeleton',
            'specialProductId' => $config['specialProductId'],
            'missingRequiredConstants' => Constants::missingRequiredConstants(),
        ]);
    }
}
