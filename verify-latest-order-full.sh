#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck disable=SC1091
source "$SCRIPT_DIR/SCRIPTS/load-client-generated-env.sh"
load_client_generated_env
require_client_env_var CLIENT_REMOTE_WP_ROOT

cd "$CLIENT_REMOTE_WP_ROOT"
php83 /usr/local/bin/wp-cli.phar eval '
$order_ids = wc_get_orders([
    "limit" => 1,
    "orderby" => "date",
    "order" => "DESC",
    "return" => "ids",
    "type" => "shop_order",
    "status" => array_keys(wc_get_order_statuses()),
]);
if (empty($order_ids)) {
    echo "NO_ORDERS\n";
    return;
}
$order = wc_get_order($order_ids[0]);
if (!$order) {
    echo "ORDER_LOAD_FAILED\n";
    return;
}
$data = [
    "id" => $order->get_id(),
    "number" => $order->get_order_number(),
    "status" => $order->get_status(),
    "type" => $order->get_type(),
    "created" => $order->get_date_created() ? $order->get_date_created()->date("c") : null,
    "modified" => $order->get_date_modified() ? $order->get_date_modified()->date("c") : null,
    "currency" => $order->get_currency(),
    "payment_method" => $order->get_payment_method(),
    "payment_method_title" => $order->get_payment_method_title(),
    "customer_note" => $order->get_customer_note(),
    "prices_include_tax" => $order->get_prices_include_tax(),
    "totals" => [
        "discount_total" => $order->get_discount_total(),
        "discount_tax" => $order->get_discount_tax(),
        "shipping_total" => $order->get_shipping_total(),
        "shipping_tax" => $order->get_shipping_tax(),
        "cart_tax" => $order->get_cart_tax(),
        "total" => $order->get_total(),
        "total_tax" => $order->get_total_tax(),
    ],
    "billing" => [
        "first_name" => $order->get_billing_first_name(),
        "last_name" => $order->get_billing_last_name(),
        "company" => $order->get_billing_company(),
        "address_1" => $order->get_billing_address_1(),
        "address_2" => $order->get_billing_address_2(),
        "city" => $order->get_billing_city(),
        "state" => $order->get_billing_state(),
        "postcode" => $order->get_billing_postcode(),
        "country" => $order->get_billing_country(),
        "email" => $order->get_billing_email(),
        "phone" => $order->get_billing_phone(),
    ],
    "shipping" => [
        "first_name" => $order->get_shipping_first_name(),
        "last_name" => $order->get_shipping_last_name(),
        "company" => $order->get_shipping_company(),
        "address_1" => $order->get_shipping_address_1(),
        "address_2" => $order->get_shipping_address_2(),
        "city" => $order->get_shipping_city(),
        "state" => $order->get_shipping_state(),
        "postcode" => $order->get_shipping_postcode(),
        "country" => $order->get_shipping_country(),
    ],
    "items" => [],
    "shipping_lines" => [],
    "fees" => [],
    "meta" => [],
];
foreach ($order->get_items() as $item) {
    $product = $item->get_product();
    $data["items"][] = [
        "item_id" => $item->get_id(),
        "product_id" => $item->get_product_id(),
        "variation_id" => $item->get_variation_id(),
        "sku" => $product ? $product->get_sku() : null,
        "name" => $item->get_name(),
        "qty" => $item->get_quantity(),
        "subtotal" => $item->get_subtotal(),
        "subtotal_tax" => $item->get_subtotal_tax(),
        "total" => $item->get_total(),
        "total_tax" => $item->get_total_tax(),
    ];
}
foreach ($order->get_shipping_methods() as $item) {
    $data["shipping_lines"][] = [
        "item_id" => $item->get_id(),
        "method_id" => $item->get_method_id(),
        "instance_id" => $item->get_instance_id(),
        "name" => $item->get_name(),
        "total" => $item->get_total(),
        "total_tax" => $item->get_total_tax(),
    ];
}
foreach ($order->get_fees() as $item) {
    $data["fees"][] = [
        "item_id" => $item->get_id(),
        "name" => $item->get_name(),
        "total" => $item->get_total(),
        "total_tax" => $item->get_total_tax(),
    ];
}
foreach ($order->get_meta_data() as $meta) {
    $key = $meta->key;
    if (strpos($key, "_edit_") === 0) {
        continue;
    }
    $value = $meta->value;
    if (is_object($value) || is_array($value)) {
        $value = wp_json_encode($value, JSON_UNESCAPED_UNICODE);
    }
    $data["meta"][] = [
        "key" => $key,
        "value" => $value,
    ];
}
echo wp_json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) . "\n";
' --allow-root
