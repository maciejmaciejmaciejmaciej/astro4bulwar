<?php

declare(strict_types=1);

function parseClientEnvFile(string $envFilePath): array
{
    if (! file_exists($envFilePath)) {
        return [];
    }

    $values = [];
    $lines = file($envFilePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    if ($lines === false) {
        return [];
    }

    foreach ($lines as $line) {
        $trimmed = trim($line);

        if ($trimmed === '' || str_starts_with($trimmed, '#')) {
            continue;
        }

        $separatorPosition = strpos($trimmed, '=');

        if ($separatorPosition === false) {
            continue;
        }

        $key = trim(substr($trimmed, 0, $separatorPosition));
        $value = trim(substr($trimmed, $separatorPosition + 1));

        if (str_starts_with($value, '"') && str_ends_with($value, '"')) {
            $value = substr($value, 1, -1);
        }

        $values[$key] = str_replace(['\n', '\r'], ["\n", "\r"], $value);
    }

    return $values;
}

function resolveClientWordPressRoot(): string
{
    foreach (['BULWAR_WP_ROOT', 'CLIENT_REMOTE_WP_ROOT'] as $envKey) {
        $value = getenv($envKey);

        if (is_string($value) && trim($value) !== '') {
            return rtrim(trim($value), DIRECTORY_SEPARATOR);
        }
    }

    $values = parseClientEnvFile(dirname(__DIR__) . DIRECTORY_SEPARATOR . '.client.generated.env');
    $configuredRoot = $values['CLIENT_REMOTE_WP_ROOT'] ?? null;

    if (is_string($configuredRoot) && trim($configuredRoot) !== '') {
        return rtrim(trim($configuredRoot), DIRECTORY_SEPARATOR);
    }

    throw new RuntimeException('Missing WordPress root. Export BULWAR_WP_ROOT or generate .client.generated.env first.');
}

function requireClientWpLoadPath(): string
{
    $wpRoot = resolveClientWordPressRoot();
    $wpLoadPath = $wpRoot . DIRECTORY_SEPARATOR . 'wp-load.php';

    if (! file_exists($wpLoadPath)) {
        throw new RuntimeException("Missing wp-load.php at {$wpLoadPath}");
    }

    return $wpLoadPath;
}