<?php
define('WP_USE_THEMES', false);
require_once __DIR__ . '/SCRIPTS/clientWpRoot.php';
require_once requireClientWpLoadPath();

$jsonData = file_get_contents('source_data.json');
$data = json_decode($jsonData, true);
if (!$data) {
    die("Invalid JSON");
}

foreach ($data as &$category) {
    $cat_name = $category['nazwa_kategorii'];
    
    $term = term_exists($cat_name, 'product_cat');
    if ($term !== 0 && $term !== null) {
        $cat_id = is_array($term) ? $term['term_id'] : $term;
    } else {
        $term_info = wp_insert_term($cat_name, 'product_cat', [
            'description' => $category['opis_kategorii']
        ]);
        if (is_wp_error($term_info)) {
            $cat_id = null;
        } else {
            $cat_id = $term_info['term_id'];
        }
    }
    $category['id'] = $cat_id;

    foreach ($category['pozycje'] as &$produkt) {
        $prod_name = $produkt['zespolona_nazwa_z_opisem'];
        $price = $produkt['cena'];
        $gramatura = $produkt['gramatura'];
        
        $product_obj = new WC_Product_Simple();
        $product_obj->set_name($prod_name);
        $product_obj->set_status('publish');
        $product_obj->set_catalog_visibility('visible');
        $product_obj->set_price($price);
        $product_obj->set_regular_price($price);
        if ($cat_id) {
            $product_obj->set_category_ids([$cat_id]);
        }
        
        // Add custom meta "gramatura"
        $product_obj->update_meta_data('gramatura', $gramatura);
        if (isset($produkt['vegan'])) {
             $product_obj->update_meta_data('vegan', $produkt['vegan'] ? 'yes' : 'no');
        }
        if (isset($produkt['vegetarian'])) {
             $product_obj->update_meta_data('vegetarian', $produkt['vegetarian'] ? 'yes' : 'no');
        }
        
        $post_id = $product_obj->save();
        $produkt['id'] = $post_id;
    }
}

echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
