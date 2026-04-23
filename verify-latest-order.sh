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
    "status" => $order->get_status(),
    "type" => $order->get_type(),
    "total" => $order->get_total(),
    "currency" => $order->get_currency(),
    "billing_email" => $order->get_billing_email(),
    "billing_phone" => $order->get_billing_phone(),
    "payment_method" => $order->get_payment_method(),
    "payment_method_title" => $order->get_payment_method_title(),
    "created" => $order->get_date_created() ? $order->get_date_created()->date("c") : null,
    "items" => [],
];
foreach ($order->get_items() as $item) {
    $data["items"][] = [
        "name" => $item->get_name(),
        "qty" => $item->get_quantity(),
        "total" => $item->get_total(),
    ];
}
echo wp_json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) . "\n";
' --allow-root
