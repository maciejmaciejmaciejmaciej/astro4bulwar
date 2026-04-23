#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck disable=SC1091
source "$SCRIPT_DIR/SCRIPTS/load-client-generated-env.sh"
load_client_generated_env
require_client_env_var CLIENT_REMOTE_WP_ROOT

ORDER_ID="${1:-55}"

cd "$CLIENT_REMOTE_WP_ROOT"
php83 /usr/local/bin/wp-cli.phar eval '
$order = wc_get_order((int) ($args[0] ?? 0));
if (!$order) {
    echo "ORDER_NOT_FOUND\n";
    return;
}
$data = [];
foreach ($order->get_items() as $item) {
    $row = [
        "item_id" => $item->get_id(),
        "product_id" => $item->get_product_id(),
        "variation_id" => $item->get_variation_id(),
        "name" => $item->get_name(),
        "meta" => [],
    ];
    foreach ($item->get_meta_data() as $meta) {
        $value = $meta->value;
        if (is_object($value) || is_array($value)) {
            $value = wp_json_encode($value, JSON_UNESCAPED_UNICODE);
        }
        $row["meta"][] = [
            "id" => $meta->id,
            "key" => $meta->key,
            "value" => $value,
        ];
    }
    $data[] = $row;
}
echo wp_json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) . "\n";
' -- "$ORDER_ID" --allow-root
