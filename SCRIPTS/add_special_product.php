<?php
define('WP_USE_THEMES', false);
require_once __DIR__ . '/clientWpRoot.php';
require_once requireClientWpLoadPath();

$cat_name = 'Zestawy specjalne';
$term = term_exists($cat_name, 'product_cat');
if ($term !== 0 && $term !== null) {
    $cat_id = is_array($term) ? $term['term_id'] : $term;
} else {
    $term_info = wp_insert_term($cat_name, 'product_cat');
    if (is_wp_error($term_info)) {
        die(json_encode(['error' => 'Category error: ' . $term_info->get_error_message()]));
    }
    $cat_id = $term_info['term_id'];
}

$product_obj = new WC_Product_Simple();
$product_obj->set_name('Obiad Wielkanocny dla 2 osób');
$product_obj->set_slug('obiad-wielkanocny-dla-2-osob');
$product_obj->set_status('publish');
$product_obj->set_catalog_visibility('hidden');
$product_obj->set_price('169');
$product_obj->set_regular_price('169');
$product_obj->set_category_ids([$cat_id]);

$post_id = $product_obj->save();

$result = [
    'category_id' => escapeshellarg($cat_id), // just making sure it's safely returned without shell messing, actually raw is fine
    'category_id' => $cat_id,
    'product_id' => $post_id,
    'product_slug' => $product_obj->get_slug(),
    'product_status' => $product_obj->get_status(),
    'catalog_visibility' => $product_obj->get_catalog_visibility()
];

echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
