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
$data = [
    "order_id" => $order->get_id(),
    "items" => [],
];
foreach ($order->get_items() as $item) {
    $row = [
        "item_id" => $item->get_id(),
        "product_id" => $item->get_product_id(),
        "name" => $item->get_name(),
        "meta" => [],
    ];
    foreach ($item->get_meta_data() as $meta) {
        $value = $meta->value;
        if (is_object($value) || is_array($value)) {
            $value = wp_json_encode($value, JSON_UNESCAPED_UNICODE);
        }
        $row["meta"][] = [
            "key" => $meta->key,
            "value" => $value,
        ];
    }
    $data["items"][] = $row;
}
echo wp_json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) . "\n";
' --allow-root
