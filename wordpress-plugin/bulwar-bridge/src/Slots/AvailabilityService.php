<?php

declare(strict_types=1);

namespace BulwarBridge\Slots;

use BulwarBridge\Support\TokenCodec;
use DateInterval;
use DateTimeImmutable;
use DateTimeZone;
use InvalidArgumentException;
use RuntimeException;

final class AvailabilityService
{
    private string $configPath;

    /** @var array<string, mixed> */
    private array $bridgeConfig;

    /** @var callable|null */
    private $occupancyResolver;

    private DateTimeImmutable $now;

    public function __construct(
        string $configPath,
        array $bridgeConfig = [],
        ?callable $occupancyResolver = null,
        ?DateTimeImmutable $now = null
    ) {
        $this->configPath = $configPath;
        $this->bridgeConfig = $bridgeConfig;
        $this->occupancyResolver = $occupancyResolver;
        $this->now = $now ?? new DateTimeImmutable('now', new DateTimeZone('UTC'));
    }

    /**
     * @return array<string, mixed>
     */
    public function getAvailability(string $fulfillmentType, string $windowStart, int $days, ?string $quoteToken): array
    {
        $config = $this->loadConfig();
        $timezone = new DateTimeZone($this->stringValue($config['timezone'] ?? null, (string) ($this->bridgeConfig['timezone'] ?? 'UTC')));
        $slotConfigVersion = $this->stringValue(
            $config['version'] ?? null,
            (string) ($this->bridgeConfig['slotConfigVersion'] ?? 'v1')
        );
        $defaultInterval = $this->positiveInt(
            $config['defaultIntervalMinutes'] ?? null,
            15
        );
        $modeConfig = $config['modes'][$fulfillmentType] ?? null;

        if (! is_array($modeConfig)) {
            throw new RuntimeException('Slot configuration for the requested fulfillment type is unavailable.');
        }

        $startDate = DateTimeImmutable::createFromFormat('!Y-m-d', $windowStart, $timezone);

        if (! $startDate instanceof DateTimeImmutable) {
            throw new InvalidArgumentException('window_start must use YYYY-MM-DD format.');
        }

        $availableDates = [];

        for ($offset = 0; $offset < $days; $offset++) {
            $date = $startDate->add(new DateInterval('P' . $offset . 'D'));
            $dateKey = $date->format('Y-m-d');
            $resolved = $this->resolveRulesForDate($fulfillmentType, $config, $modeConfig, $date, $defaultInterval);

            if (! $resolved['enabled']) {
                continue;
            }

            $slots = $this->buildSlots(
                $fulfillmentType,
                $dateKey,
                $timezone,
                $resolved['windows'],
                $resolved['blackout_windows'],
                $resolved['interval_minutes'],
                $resolved['default_capacity'],
                $slotConfigVersion,
                $quoteToken
            );

            if ($slots === []) {
                continue;
            }

            $availableDates[] = [
                'date' => $dateKey,
                'slots' => $slots,
            ];
        }

        return [
            'data' => [
                'fulfillment_type' => $fulfillmentType,
                'window_start' => $windowStart,
                'days' => $days,
                'available_dates' => $availableDates,
            ],
            'meta' => [
                'slot_config_version' => $slotConfigVersion,
                'timezone' => $timezone->getName(),
                'occupancy_source' => 'config_only',
                'occupancy_limitations' => [
                    'Persisted Woo order occupancy is not wired in this step; remaining_capacity reflects config capacity and the current resolver only.',
                ],
            ],
        ];
    }

    /**
     * @param array<string, mixed> $config
     * @param array<string, mixed> $modeConfig
     * @return array<string, mixed>
     */
    private function resolveRulesForDate(
        string $fulfillmentType,
        array $config,
        array $modeConfig,
        DateTimeImmutable $date,
        int $defaultInterval
    ): array {
        $dateKey = $date->format('Y-m-d');
        $dateRules = isset($modeConfig['dates']) && is_array($modeConfig['dates'])
            ? $modeConfig['dates']
            : [];

        if ($dateRules !== []) {
            $dateConfig = $this->matchingOverride($dateRules, $dateKey);

            if ($dateConfig === null) {
                return [
                    'enabled' => false,
                    'windows' => [],
                    'blackout_windows' => [],
                    'interval_minutes' => $defaultInterval,
                    'default_capacity' => $this->defaultCapacityFor($fulfillmentType),
                ];
            }

            $enabled = array_key_exists('enabled', $dateConfig) ? (bool) $dateConfig['enabled'] : true;
            $windows = $this->normalizeWindows($dateConfig['windows'] ?? []);
            $intervalMinutes = $this->positiveInt(
                $dateConfig['intervalMinutes'] ?? ($modeConfig['intervalMinutes'] ?? null),
                $defaultInterval
            );
            $defaultCapacity = $this->capacityInt(
                $dateConfig['defaultCapacity'] ?? ($modeConfig['defaultCapacity'] ?? null),
                $this->defaultCapacityFor($fulfillmentType)
            );
        } else {
            $dayKey = strtolower($date->format('l'));
            $dayConfig = $modeConfig['days'][$dayKey] ?? [];
            $enabled = (bool) ($dayConfig['enabled'] ?? false);
            $windows = $this->normalizeWindows($dayConfig['windows'] ?? []);
            $intervalMinutes = $this->positiveInt(
                $dayConfig['intervalMinutes'] ?? ($modeConfig['intervalMinutes'] ?? null),
                $defaultInterval
            );
            $defaultCapacity = $this->capacityInt(
                $dayConfig['defaultCapacity'] ?? ($modeConfig['defaultCapacity'] ?? null),
                $this->defaultCapacityFor($fulfillmentType)
            );
        }

        foreach ($modeConfig['blackouts'] ?? [] as $blackout) {
            if (! is_array($blackout) || ! $this->ruleMatchesDate($blackout, $dateKey)) {
                continue;
            }

            if ($this->normalizeWindows($blackout['windows'] ?? []) === []) {
                return [
                    'enabled' => false,
                    'windows' => [],
                    'blackout_windows' => [],
                    'interval_minutes' => $intervalMinutes,
                    'default_capacity' => $defaultCapacity,
                ];
            }
        }

        $override = $this->matchingOverride($modeConfig['overrides'] ?? [], $dateKey);

        if ($override !== null) {
            if (array_key_exists('enabled', $override)) {
                $enabled = (bool) $override['enabled'];
            }

            if (array_key_exists('windows', $override)) {
                $windows = $this->normalizeWindows($override['windows']);
            }

            if (array_key_exists('intervalMinutes', $override)) {
                $intervalMinutes = $this->positiveInt($override['intervalMinutes'], $intervalMinutes);
            }

            if (array_key_exists('defaultCapacity', $override)) {
                $defaultCapacity = $this->capacityInt($override['defaultCapacity'], $defaultCapacity);
            }
        }

        return [
            'enabled' => $enabled,
            'windows' => $windows,
            'blackout_windows' => $this->blackoutWindowsForDate($modeConfig['blackouts'] ?? [], $dateKey),
            'interval_minutes' => $intervalMinutes,
            'default_capacity' => $defaultCapacity,
        ];
    }

    /**
     * @param array<int, array<string, mixed>> $windows
     * @param array<int, array<string, string>> $blackoutWindows
     * @return array<int, array<string, mixed>>
     */
    private function buildSlots(
        string $fulfillmentType,
        string $dateKey,
        DateTimeZone $timezone,
        array $windows,
        array $blackoutWindows,
        int $intervalMinutes,
        int $defaultCapacity,
        string $slotConfigVersion,
        ?string $quoteToken
    ): array {
        $slots = [];
        $utc = new DateTimeZone('UTC');

        foreach ($windows as $window) {
            $windowCapacity = $this->capacityInt($window['capacity'] ?? null, $defaultCapacity);
            $cursor = $this->buildLocalDateTime($dateKey, $window['start'], $timezone);
            $windowEnd = $this->buildLocalDateTime($dateKey, $window['end'], $timezone);

            while ($cursor < $windowEnd) {
                $slotEnd = $cursor->add(new DateInterval('PT' . $intervalMinutes . 'M'));

                if ($slotEnd > $windowEnd) {
                    break;
                }

                if ($this->overlapsBlackout($cursor, $slotEnd, $dateKey, $timezone, $blackoutWindows)) {
                    $cursor = $slotEnd;
                    continue;
                }

                $label = $cursor->format('H:i') . '-' . $slotEnd->format('H:i');
                $usedCapacity = $this->resolveOccupancy($fulfillmentType, $dateKey, $label);
                $remainingCapacity = $windowCapacity - $usedCapacity;

                if ($remainingCapacity > 0) {
                    $startAt = $cursor->setTimezone($utc)->format('Y-m-d\TH:i:s\Z');
                    $endAt = $slotEnd->setTimezone($utc)->format('Y-m-d\TH:i:s\Z');
                    $expiresAt = $this->slotExpiry()->format('Y-m-d\TH:i:s\Z');

                    $slots[] = [
                        'label' => $label,
                        'start_at' => $startAt,
                        'end_at' => $endAt,
                        'remaining_capacity' => $remainingCapacity,
                        'slot_token' => $this->mintSlotToken(
                            $fulfillmentType,
                            $startAt,
                            $endAt,
                            $slotConfigVersion,
                            $expiresAt,
                            $quoteToken
                        ),
                        'expires_at' => $expiresAt,
                    ];
                }

                $cursor = $slotEnd;
            }
        }

        return $slots;
    }

    /**
     * @param array<int, mixed> $rules
     * @return array<string, mixed>|null
     */
    private function matchingOverride(array $rules, string $dateKey): ?array
    {
        foreach ($rules as $rule) {
            if (is_array($rule) && $this->ruleMatchesDate($rule, $dateKey)) {
                return $rule;
            }
        }

        return null;
    }

    /**
     * @param array<int, mixed> $rules
     * @return array<int, array<string, string>>
     */
    private function blackoutWindowsForDate(array $rules, string $dateKey): array
    {
        $windows = [];

        foreach ($rules as $rule) {
            if (! is_array($rule) || ! $this->ruleMatchesDate($rule, $dateKey)) {
                continue;
            }

            foreach ($this->normalizeWindows($rule['windows'] ?? []) as $window) {
                $windows[] = $window;
            }
        }

        return $windows;
    }

    /**
     * @param array<string, mixed> $rule
     */
    private function ruleMatchesDate(array $rule, string $dateKey): bool
    {
        if (($rule['date'] ?? null) === $dateKey) {
            return true;
        }

        if (isset($rule['dates']) && is_array($rule['dates']) && in_array($dateKey, $rule['dates'], true)) {
            return true;
        }

        $startDate = is_string($rule['start_date'] ?? null) ? $rule['start_date'] : null;
        $endDate = is_string($rule['end_date'] ?? null) ? $rule['end_date'] : null;

        if ($startDate !== null && $endDate !== null) {
            return $dateKey >= $startDate && $dateKey <= $endDate;
        }

        return false;
    }

    /**
     * @param array<int, mixed> $windows
     * @return array<int, array<string, string>>
     */
    private function normalizeWindows(array $windows): array
    {
        $normalized = [];

        foreach ($windows as $window) {
            if (! is_array($window)) {
                continue;
            }

            $start = $window['start'] ?? null;
            $end = $window['end'] ?? null;

            if (! is_string($start) || ! is_string($end)) {
                continue;
            }

            $normalized[] = [
                'start' => $start,
                'end' => $end,
                'capacity' => $window['capacity'] ?? null,
            ];
        }

        return $normalized;
    }

    /**
     * @param array<int, array<string, string>> $blackoutWindows
     */
    private function overlapsBlackout(
        DateTimeImmutable $slotStart,
        DateTimeImmutable $slotEnd,
        string $dateKey,
        DateTimeZone $timezone,
        array $blackoutWindows
    ): bool {
        foreach ($blackoutWindows as $window) {
            $blackoutStart = $this->buildLocalDateTime($dateKey, $window['start'], $timezone);
            $blackoutEnd = $this->buildLocalDateTime($dateKey, $window['end'], $timezone);

            if ($slotStart < $blackoutEnd && $slotEnd > $blackoutStart) {
                return true;
            }
        }

        return false;
    }

    private function buildLocalDateTime(string $dateKey, string $time, DateTimeZone $timezone): DateTimeImmutable
    {
        $dateTime = DateTimeImmutable::createFromFormat('Y-m-d H:i', $dateKey . ' ' . $time, $timezone);

        if (! $dateTime instanceof DateTimeImmutable) {
            throw new RuntimeException('Slot configuration contains an invalid date or time window.');
        }

        return $dateTime;
    }

    private function resolveOccupancy(string $fulfillmentType, string $dateKey, string $slotLabel): int
    {
        if ($this->occupancyResolver === null) {
            return 0;
        }

        $value = ($this->occupancyResolver)($fulfillmentType, $dateKey, $slotLabel);

        return max(0, (int) $value);
    }

    private function slotExpiry(): DateTimeImmutable
    {
        $ttlMinutes = $this->positiveInt($this->bridgeConfig['slotTokenTtlMinutes'] ?? null, 15);

        return $this->now
            ->setTimezone(new DateTimeZone('UTC'))
            ->add(new DateInterval('PT' . $ttlMinutes . 'M'));
    }

    private function mintSlotToken(
        string $fulfillmentType,
        string $startAt,
        string $endAt,
        string $slotConfigVersion,
        string $expiresAt,
        ?string $quoteToken
    ): string {
        $payload = [
            'iss' => 'bulwar-bridge',
            'kind' => 'slot',
            'version' => 1,
            'fulfillment_type' => $fulfillmentType,
            'start_at' => $startAt,
            'end_at' => $endAt,
            'slot_config_version' => $slotConfigVersion,
            'expires_at' => $expiresAt,
            'quote_fingerprint' => $quoteToken === null ? null : hash('sha256', $quoteToken),
        ];
        return TokenCodec::mint('bs_', $payload);
    }

    /**
     * @return array<string, mixed>
     */
    private function loadConfig(): array
    {
        if (! is_file($this->configPath) || ! is_readable($this->configPath)) {
            throw new RuntimeException('Slot configuration file is missing or unreadable.');
        }

        $contents = file_get_contents($this->configPath);

        if (! is_string($contents) || $contents === '') {
            throw new RuntimeException('Slot configuration file is empty.');
        }

        $decoded = json_decode($contents, true);

        if (! is_array($decoded)) {
            throw new RuntimeException('Slot configuration file is not valid JSON.');
        }

        return $decoded;
    }

    private function defaultCapacityFor(string $fulfillmentType): int
    {
        return $fulfillmentType === 'pickup' ? 3 : 1;
    }

    /**
     * @param mixed $value
     */
    private function capacityInt($value, int $fallback): int
    {
        if (is_int($value) && $value >= 0) {
            return $value;
        }

        if (is_numeric($value) && (int) $value >= 0) {
            return (int) $value;
        }

        return $fallback;
    }

    /**
     * @param mixed $value
     */
    private function positiveInt($value, int $fallback): int
    {
        if (is_int($value) && $value > 0) {
            return $value;
        }

        if (is_numeric($value) && (int) $value > 0) {
            return (int) $value;
        }

        return $fallback;
    }

    /**
     * @param mixed $value
     */
    private function stringValue($value, string $fallback): string
    {
        return is_string($value) && $value !== '' ? $value : $fallback;
    }
}