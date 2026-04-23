<?php

declare(strict_types=1);

namespace BulwarBridge\Support;

use DateInterval;
use DateTimeImmutable;
use DateTimeZone;
use RuntimeException;

final class TokenCodec
{
    /**
     * @param array<string, mixed> $payload
     */
    public static function mint(string $prefix, array $payload): string
    {
        $json = function_exists('wp_json_encode')
            ? (string) wp_json_encode($payload)
            : (string) json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        $signature = hash_hmac('sha256', $json, self::signingSecret(), true);

        return $prefix . self::base64UrlEncode($json) . '.' . self::base64UrlEncode($signature);
    }

    /**
     * @return array<string, mixed>
     */
    public static function decode(string $token, string $prefix): array
    {
        if (! str_starts_with($token, $prefix)) {
            throw new RuntimeException('Token prefix is invalid.');
        }

        $encoded = substr($token, strlen($prefix));
        $parts = explode('.', $encoded, 2);

        if (count($parts) !== 2) {
            throw new RuntimeException('Token format is invalid.');
        }

        $json = self::base64UrlDecode($parts[0]);
        $signature = self::base64UrlDecode($parts[1]);
        $expectedSignature = hash_hmac('sha256', $json, self::signingSecret(), true);

        if (! hash_equals($expectedSignature, $signature)) {
            throw new RuntimeException('Token signature is invalid.');
        }

        $payload = json_decode($json, true);

        if (! is_array($payload)) {
            throw new RuntimeException('Token payload is invalid.');
        }

        return $payload;
    }

    public static function isExpired(array $payload): bool
    {
        $expiresAt = $payload['expires_at'] ?? null;

        if (! is_string($expiresAt) || $expiresAt === '') {
            return true;
        }

        $expiresAtDateTime = new DateTimeImmutable($expiresAt, new DateTimeZone('UTC'));

        return $expiresAtDateTime <= new DateTimeImmutable('now', new DateTimeZone('UTC'));
    }

    public static function expiresAtIso(int $ttlMinutes): string
    {
        return (new DateTimeImmutable('now', new DateTimeZone('UTC')))
            ->add(new DateInterval('PT' . $ttlMinutes . 'M'))
            ->format('Y-m-d\TH:i:s\Z');
    }

    public static function fingerprint(string $value): string
    {
        return hash('sha256', $value);
    }

    private static function signingSecret(): string
    {
        if (function_exists('wp_salt')) {
            return (string) wp_salt('auth');
        }

        return 'bulwar-bridge-fallback-signing-secret';
    }

    private static function base64UrlEncode(string $value): string
    {
        return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
    }

    private static function base64UrlDecode(string $value): string
    {
        $padded = str_pad($value, (int) ceil(strlen($value) / 4) * 4, '=', STR_PAD_RIGHT);
        $decoded = base64_decode(strtr($padded, '-_', '+/'), true);

        if (! is_string($decoded)) {
            throw new RuntimeException('Token encoding is invalid.');
        }

        return $decoded;
    }
}