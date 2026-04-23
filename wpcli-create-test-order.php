<?php

use BulwarBridge\Checkout\OrderService;
use BulwarBridge\Checkout\QuoteService;
use BulwarBridge\Config\Constants;
use BulwarBridge\Slots\AvailabilityService;

$line = [
    'client_line_id' => 'special-menu-wpcli-test',
    'line_type' => 'special_menu_for_2',
    'product_id' => 53,
    'quantity' => 1,
    'configuration' => [
        'kind' => 'menu_for_2',
        'schemaVersion' => 1,
        'persons' => [
            [
                'personIndex' => 1,
                'soupOptionId' => 'soups:rosol-z-kury-domowej',
                'soupLabel' => 'Rosół z kury domowej gotowany 12 godzin na wolnym ogniu, z ekologiczną marchewką, świeżo ciętym lubczykiem i natką młodej pietruszki',
                'mainOptionId' => 'mains:konfitowana-noga-z-kaczki',
                'mainLabel' => 'Konfitowana noga z kaczki leniwie pieczona w gęsim tłuszczu, z ręcznie robionymi pulchnymi pyzami drożdżowymi i sosem z suszonych jagód żurawiny, gruszek i wędzonych śliwek perfumowanym świeżym tymiankiem',
            ],
            [
                'personIndex' => 2,
                'soupOptionId' => 'soups:rosol-z-kury-domowej',
                'soupLabel' => 'Rosół z kury domowej gotowany 12 godzin na wolnym ogniu, z ekologiczną marchewką, świeżo ciętym lubczykiem i natką młodej pietruszki',
                'mainOptionId' => 'mains:zraz-wolowy',
                'mainLabel' => 'Zraz wołowy z czosnkowym ogórkiem kiszonym, razowym chlebem wiejskim, wędzonym boczkiem, z młodymi ziemniakami pieczonymi w świeżych ziołach prowansalskich, głębokim własnym sosem pieczeniowym i buraczkami zasmażanymi na wiejskim klarowanym maśle',
            ],
        ],
    ],
];

$destination = [
    'address_line_1' => 'ulica Mostowa 4A/10',
    'city' => 'Poznań',
    'postcode' => '61-001',
    'country_code' => 'PL',
];

$quote = (new QuoteService())->quote($destination, [$line]);
$quoteToken = $quote['data']['quote_token'];
$slotsPath = defined('WP_CONTENT_DIR')
    ? WP_CONTENT_DIR . '/plugins/bulwar-bridge/config/slots.json'
    : getenv('BULWAR_SLOTS_PATH');

if (!$slotsPath || !is_string($slotsPath)) {
    throw new RuntimeException('BULWAR slots path is not available. Run this through wp-cli or set BULWAR_SLOTS_PATH.');
}

$days = (new AvailabilityService(
    $slotsPath,
    Constants::all()
))->getAvailability('delivery', '2026-03-27', 3, $quoteToken);
$slotToken = null;
foreach ($days['data']['available_dates'] as $day) {
    if (!empty($day['slots'])) {
        $slotToken = $day['slots'][0]['slot_token'];
        break;
    }
}
if (!$slotToken) {
    throw new RuntimeException('NO_SLOT_FOUND');
}

$body = [
    'idempotency_key' => wp_generate_uuid4(),
    'payment_method' => 'manual_cash',
    'customer' => [
        'first_name' => 'Maciej',
        'last_name' => 'Lustyk',
        'phone' => '+48509803507',
        'email' => 'kill.blinton.aka.maciej@gmail.com',
    ],
    'fulfillment' => [
        'type' => 'delivery',
        'quote_token' => $quoteToken,
        'slot_token' => $slotToken,
        'address' => $destination,
    ],
    'cart_lines' => [$line],
];

$result = (new OrderService())->create($body);
echo wp_json_encode($result, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) . PHP_EOL;
