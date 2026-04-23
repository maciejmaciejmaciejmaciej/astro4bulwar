<?php

declare(strict_types=1);

namespace BulwarBridge\Checkout;

use BulwarBridge\Config\Constants;
use BulwarBridge\Support\TokenCodec;
use RuntimeException;

final class QuoteService
{
    /**
     * @param array<string, mixed> $destination
     * @param array<int, array<string, mixed>> $cartLines
     * @return array<string, mixed>
     */
    public function quote(array $destination, array $cartLines): array
    {
        $canonicalDestination = $this->canonicalDestination($destination);
        $cartSubtotal = $this->cartSubtotal($cartLines);
        $coordinates = $this->resolveCoordinates($canonicalDestination);
        $distanceKm = $this->routeDistanceKm($coordinates['origin'], $coordinates['destination']);
        $deliveryFee = $cartSubtotal >= (float) Constants::all()['freeDeliveryThreshold']
            ? 0.0
            : round(((float) Constants::all()['deliveryBaseFee']) + ($distanceKm * (float) Constants::all()['deliveryPricePerKm']), 2);
        $expiresAt = TokenCodec::expiresAtIso((int) Constants::all()['quoteTtlMinutes']);
        $payload = [
            'iss' => 'bulwar-bridge',
            'kind' => 'delivery_quote',
            'version' => 1,
            'destination_fingerprint' => TokenCodec::fingerprint($this->destinationFingerprintSource($canonicalDestination)),
            'cart_fingerprint' => TokenCodec::fingerprint($this->cartFingerprintSource($cartLines)),
            'cart_subtotal_minor' => $this->toMinor($cartSubtotal),
            'delivery_fee_minor' => $this->toMinor($deliveryFee),
            'currency' => 'PLN',
            'distance_km' => round($distanceKm, 1),
            'is_free_delivery' => $deliveryFee <= 0.0,
            'expires_at' => $expiresAt,
            'diagnostics' => [
                'pricing_rule' => 'distance_plus_base_fee',
                'provider' => $coordinates['provider'],
            ],
        ];

        return [
            'data' => [
                'destination' => $canonicalDestination,
                'cart_subtotal_minor' => $payload['cart_subtotal_minor'],
                'delivery_fee_minor' => $payload['delivery_fee_minor'],
                'currency' => 'PLN',
                'distance_km' => $payload['distance_km'],
                'is_free_delivery' => $payload['is_free_delivery'],
                'quote_token' => TokenCodec::mint('bq_', $payload),
                'expires_at' => $expiresAt,
                'diagnostics' => $payload['diagnostics'],
            ],
            'meta' => [
                'pricing_rule_version' => Constants::all()['pricingRuleVersion'],
            ],
        ];
    }

    /**
     * @param array<string, mixed> $destination
     * @return array<string, string>
     */
    private function canonicalDestination(array $destination): array
    {
        $addressLine1 = trim((string) ($destination['address_line_1'] ?? ''));
        $city = trim((string) ($destination['city'] ?? ''));
        $postcode = trim((string) ($destination['postcode'] ?? ''));
        $countryCode = strtoupper(trim((string) ($destination['country_code'] ?? 'PL')));

        if ($addressLine1 === '' || $city === '' || $postcode === '' || $countryCode === '') {
            throw new RuntimeException('Destination address is incomplete.');
        }

        return [
            'address_line_1' => $addressLine1,
            'city' => $city,
            'postcode' => $postcode,
            'country_code' => $countryCode,
            'formatted_address' => sprintf('%s, %s %s, %s', $addressLine1, $postcode, $city, $countryCode),
        ];
    }

    /**
     * @param array<int, array<string, mixed>> $cartLines
     */
    private function cartSubtotal(array $cartLines): float
    {
        $subtotal = 0.0;

        foreach ($cartLines as $line) {
            $productId = isset($line['product_id']) ? (int) $line['product_id'] : 0;
            $quantity = isset($line['quantity']) ? (int) $line['quantity'] : 0;
            $product = function_exists('wc_get_product') ? wc_get_product($productId) : null;

            if (! $product || $quantity < 1) {
                throw new RuntimeException('Cart line contains an unknown product or invalid quantity.');
            }

            $price = (float) $product->get_price();
            $subtotal += ($price * $quantity);
        }

        return round($subtotal, 2);
    }

    /**
     * @param array<string, string> $destination
     * @return array<string, mixed>
     */
    private function resolveCoordinates(array $destination): array
    {
        $originAddress = $this->storeOriginAddress();
        $googleApiKey = (string) (Constants::all()['googleMapsApiKey'] ?? '');

        if ($googleApiKey !== '') {
            return [
                'provider' => 'google_maps',
                'origin' => $this->googleGeocode($originAddress, $googleApiKey),
                'destination' => $this->googleGeocode($destination['formatted_address'], $googleApiKey),
            ];
        }

        return [
            'provider' => 'nominatim_osrm',
            'origin' => $this->nominatimGeocode($originAddress),
            'destination' => $this->nominatimGeocode($destination['formatted_address']),
        ];
    }

    /**
     * @param array<string, float> $origin
     * @param array<string, float> $destination
     */
    private function routeDistanceKm(array $origin, array $destination): float
    {
        $googleApiKey = (string) (Constants::all()['googleMapsApiKey'] ?? '');

        if ($googleApiKey !== '') {
            $url = sprintf(
                'https://maps.googleapis.com/maps/api/distancematrix/json?origins=%s,%s&destinations=%s,%s&mode=driving&language=pl&key=%s',
                rawurlencode((string) $origin['lat']),
                rawurlencode((string) $origin['lng']),
                rawurlencode((string) $destination['lat']),
                rawurlencode((string) $destination['lng']),
                rawurlencode($googleApiKey)
            );
            $data = $this->getJson($url);
            $meters = $data['rows'][0]['elements'][0]['distance']['value'] ?? null;

            if (! is_numeric($meters)) {
                throw new RuntimeException('Google distance lookup failed.');
            }

            return ((float) $meters) / 1000.0;
        }

        $url = sprintf(
            'https://router.project-osrm.org/route/v1/driving/%s,%s;%s,%s?overview=false',
            rawurlencode((string) $origin['lng']),
            rawurlencode((string) $origin['lat']),
            rawurlencode((string) $destination['lng']),
            rawurlencode((string) $destination['lat'])
        );
        $data = $this->getJson($url, [
            'headers' => [
                'User-Agent' => 'BulwarBridge/0.1',
            ],
        ]);
        $meters = $data['routes'][0]['distance'] ?? null;

        if (! is_numeric($meters)) {
            throw new RuntimeException('OSRM distance lookup failed.');
        }

        return ((float) $meters) / 1000.0;
    }

    /**
     * @return array{lat: float, lng: float}
     */
    private function googleGeocode(string $address, string $apiKey): array
    {
        $url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' . rawurlencode($address) . '&key=' . rawurlencode($apiKey);
        $data = $this->getJson($url);
        $location = $data['results'][0]['geometry']['location'] ?? null;

        if (! is_array($location) || ! isset($location['lat'], $location['lng'])) {
            throw new RuntimeException('Google geocoding failed.');
        }

        return [
            'lat' => (float) $location['lat'],
            'lng' => (float) $location['lng'],
        ];
    }

    /**
     * @return array{lat: float, lng: float}
     */
    private function nominatimGeocode(string $address): array
    {
        $url = 'https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=pl&q=' . rawurlencode($address);
        $data = $this->getJson($url, [
            'headers' => [
                'User-Agent' => 'BulwarBridge/0.1',
            ],
        ]);
        $first = $data[0] ?? null;

        if (! is_array($first) || ! isset($first['lat'], $first['lon'])) {
            throw new RuntimeException('Address geocoding failed.');
        }

        return [
            'lat' => (float) $first['lat'],
            'lng' => (float) $first['lon'],
        ];
    }

    private function storeOriginAddress(): string
    {
        $config = Constants::all();
        $line1 = trim((string) ($config['storeOriginLine1'] ?: get_option('woocommerce_store_address', '')));
        $city = trim((string) ($config['storeOriginCity'] ?: get_option('woocommerce_store_city', '')));
        $postcode = trim((string) ($config['storeOriginPostalCode'] ?: get_option('woocommerce_store_postcode', '')));
        $country = trim((string) ($config['storeOriginCountry'] ?: explode(':', (string) get_option('woocommerce_default_country', 'PL'))[0]));

        if ($line1 === '' || $city === '' || $postcode === '') {
            throw new RuntimeException('Store origin is not configured.');
        }

        return sprintf('%s, %s %s, %s', $line1, $postcode, $city, $country !== '' ? $country : 'PL');
    }

    private function destinationFingerprintSource(array $destination): string
    {
        return mb_strtolower(implode('|', [
            $destination['address_line_1'],
            $destination['city'],
            $destination['postcode'],
            $destination['country_code'],
        ]));
    }

    /**
     * @param array<int, array<string, mixed>> $cartLines
     */
    private function cartFingerprintSource(array $cartLines): string
    {
        $normalized = [];

        foreach ($cartLines as $line) {
            $normalized[] = [
                'client_line_id' => (string) ($line['client_line_id'] ?? ''),
                'line_type' => (string) ($line['line_type'] ?? ''),
                'product_id' => (int) ($line['product_id'] ?? 0),
                'quantity' => (int) ($line['quantity'] ?? 0),
                'configuration' => $line['configuration'] ?? null,
            ];
        }

        usort($normalized, static fn (array $left, array $right): int => strcmp($left['client_line_id'], $right['client_line_id']));

        return function_exists('wp_json_encode')
            ? (string) wp_json_encode($normalized)
            : (string) json_encode($normalized, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    }

    /**
     * @param array<string, mixed> $args
     * @return mixed
     */
    private function getJson(string $url, array $args = [])
    {
        $response = wp_remote_get($url, $args);

        if (is_wp_error($response)) {
            throw new RuntimeException($response->get_error_message());
        }

        $status = (int) wp_remote_retrieve_response_code($response);
        $body = wp_remote_retrieve_body($response);
        $data = json_decode((string) $body, true);

        if ($status < 200 || $status >= 300 || (! is_array($data) && ! is_array($data[0] ?? null))) {
            throw new RuntimeException('Remote JSON request failed.');
        }

        return $data;
    }

    private function toMinor(float $amount): int
    {
        return (int) round($amount * 100);
    }
}