#!/usr/bin/env node

/*
See docs/plan/sync-catering-category-20260325/usage.md for operator instructions.

Usage:
  node SCRIPTS/sync_catering_category.js --input path/to/category.json
  node SCRIPTS/sync_catering_category.js --input path/to/category.json --dry-run
  node SCRIPTS/sync_catering_category.js --input path/to/category.json --local-validate

What it does:
  - validates one catering category payload against the current frontend raw contract
  - matches that category against zip/src/data/cateringWielkanocny.json by id, name, or slug
  - preserves local category/product Woo ids when possible
  - uploads a temporary payload JSON and temporary PHP worker over SSH to the client WordPress host from .client.generated.env
  - runs php83 in WordPress context, upserts the Woo category and products, then writes returned ids back into the frontend JSON

Notes:
  - --dry-run and --local-validate are local only and do not contact production
  - remote sync config is loaded lazily from .client.generated.env produced by the bootstrap
*/

const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { getClientRemoteConfig } = require('./clientGeneratedEnv');

const PUBLIC_IMAGE_PREFIX = '/react/images/';
const WORKSPACE_ROOT = path.resolve(__dirname, '..');
const FRONTEND_JSON_PATH = path.join(
  WORKSPACE_ROOT,
  'zip',
  'src',
  'data',
  'cateringWielkanocny.json',
);

function getRemoteSyncConfig() {
  return getClientRemoteConfig();
}

function parseArgs(argv) {
  const options = {
    dryRun: false,
    localValidate: false,
    inputPath: null,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === '--input') {
      options.inputPath = argv[index + 1] ? path.resolve(argv[index + 1]) : null;
      index += 1;
      continue;
    }

    if (token === '--dry-run') {
      options.dryRun = true;
      continue;
    }

    if (token === '--local-validate') {
      options.localValidate = true;
      continue;
    }

    if (token === '--help' || token === '-h') {
      printUsage();
      process.exit(0);
    }

    throw new Error(`Unknown argument: ${token}`);
  }

  if (!options.inputPath) {
    throw new Error('Missing required --input <path-to-category.json> argument.');
  }

  return options;
}

function printUsage() {
  process.stdout.write(
    [
      'Usage:',
      '  node SCRIPTS/sync_catering_category.js --input path/to/category.json',
      '  node SCRIPTS/sync_catering_category.js --input path/to/category.json --dry-run',
      '  node SCRIPTS/sync_catering_category.js --input path/to/category.json --local-validate',
      '',
      'Modes:',
      '  --local-validate  validate input and resolve local merge target only',
      '  --dry-run         alias for a local no-write preview',
    ].join('\n'),
  );
}

function readJsonFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function writeJsonFile(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function normalizeString(value, fieldName) {
  if (typeof value !== 'string') {
    throw new Error(`Invalid catering data: ${fieldName} must be a string.`);
  }

  const normalized = value.trim();

  if (!normalized) {
    throw new Error(`Invalid catering data: ${fieldName} cannot be empty.`);
  }

  return normalized;
}

function normalizeOptionalString(value, fieldName) {
  if (typeof value === 'undefined' || value === null) {
    return null;
  }

  return normalizeString(value, fieldName);
}

function normalizeNumber(value, fieldName) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`Invalid catering data: ${fieldName} must be a finite number.`);
  }

  return value;
}

function normalizeOptionalId(value, fieldName) {
  if (typeof value === 'undefined' || value === null || value === '') {
    return null;
  }

  const id = normalizeNumber(value, fieldName);

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error(`Invalid catering data: ${fieldName} must be a positive integer.`);
  }

  return id;
}

function normalizeBoolean(value, fieldName) {
  if (typeof value !== 'boolean') {
    throw new Error(`Invalid catering data: ${fieldName} must be a boolean.`);
  }

  return value;
}

function normalizeImageUrl(value, fieldName) {
  const imageUrl = normalizeString(value, fieldName);

  if (!imageUrl.startsWith(PUBLIC_IMAGE_PREFIX)) {
    throw new Error(
      `Invalid catering data: ${fieldName} must start with ${PUBLIC_IMAGE_PREFIX}.`,
    );
  }

  return imageUrl;
}

function getProductContentMode(product, categoryFieldPrefix) {
  const combinedText = normalizeOptionalString(
    product.zespolona_nazwa_z_opisem,
    `${categoryFieldPrefix}.zespolona_nazwa_z_opisem`,
  );
  const productName = normalizeOptionalString(
    product.nazwa_produktu,
    `${categoryFieldPrefix}.nazwa_produktu`,
  );
  const productDescription = normalizeOptionalString(
    product.opis_produktu ?? product.opis_poduktu,
    `${categoryFieldPrefix}.opis_produktu`,
  );

  if (productName !== null || productDescription !== null) {
    if (productName === null || productDescription === null) {
      throw new Error(
        `Invalid catering data: ${categoryFieldPrefix} must provide both nazwa_produktu and opis_produktu.`,
      );
    }

    return {
      contentMode: 'split',
      productName,
      productDescription,
    };
  }

  if (combinedText === null) {
    throw new Error(
      `Invalid catering data: ${categoryFieldPrefix} must provide zespolona_nazwa_z_opisem or split product fields.`,
    );
  }

  return {
    contentMode: 'combined',
    combinedText,
  };
}

function validateProduct(product, categoryName, productIndex) {
  if (!product || typeof product !== 'object' || Array.isArray(product)) {
    throw new Error(
      `Invalid catering data: ${categoryName}.pozycje[${productIndex}] must be an object.`,
    );
  }

  const productFieldPrefix = `${categoryName}.pozycje[${productIndex}]`;
  const content = getProductContentMode(product, productFieldPrefix);
  const validated = {
    id: normalizeOptionalId(product.id, `${productFieldPrefix}.id`),
    gramatura: normalizeString(product.gramatura, `${productFieldPrefix}.gramatura`),
    cena: normalizeNumber(product.cena, `${productFieldPrefix}.cena`),
    vegan: normalizeBoolean(product.vegan, `${productFieldPrefix}.vegan`),
    vegetarian: normalizeBoolean(product.vegetarian, `${productFieldPrefix}.vegetarian`),
  };

  if (content.contentMode === 'split') {
    return {
      ...validated,
      nazwa_produktu: content.productName,
      opis_produktu: content.productDescription,
    };
  }

  return {
    ...validated,
    zespolona_nazwa_z_opisem: content.combinedText,
  };
}

function validateCategoryPayload(category) {
  if (!category || typeof category !== 'object' || Array.isArray(category)) {
    throw new Error('Invalid catering data: root payload must be one category object.');
  }

  const categoryName = normalizeString(category.nazwa_kategorii, 'category.nazwa_kategorii');

  if (!Array.isArray(category.pozycje)) {
    throw new Error(`Invalid catering data: ${categoryName}.pozycje must be an array.`);
  }

  return {
    id: normalizeOptionalId(category.id, `${categoryName}.id`),
    nazwa_kategorii: categoryName,
    opis_kategorii: normalizeString(category.opis_kategorii, `${categoryName}.opis_kategorii`),
    image_url: normalizeImageUrl(category.image_url, `${categoryName}.image_url`),
    pozycje: category.pozycje.map((product, index) => validateProduct(product, categoryName, index)),
  };
}

function assertCatalogShape(catalog) {
  if (!Array.isArray(catalog)) {
    throw new Error('Invalid frontend data: cateringWielkanocny.json must contain an array.');
  }

  return catalog.map((category, index) => {
    try {
      return validateCategoryPayload(category);
    } catch (error) {
      throw new Error(
        `Invalid frontend data at category index ${index}: ${error.message}`,
      );
    }
  });
}

function slugify(value) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function isSplitProduct(product) {
  return typeof product.nazwa_produktu === 'string' && typeof product.opis_produktu === 'string';
}

function buildProductSignature(product) {
  const payload = isSplitProduct(product)
    ? ['split', product.nazwa_produktu.trim(), product.opis_produktu.trim(), product.gramatura.trim()]
    : ['combined', product.zespolona_nazwa_z_opisem.trim(), product.gramatura.trim()];

  return crypto.createHash('sha1').update(JSON.stringify(payload)).digest('hex');
}

function resolveCategoryMatch(catalog, categoryPayload) {
  if (categoryPayload.id !== null) {
    const idIndex = catalog.findIndex((entry) => entry.id === categoryPayload.id);
    if (idIndex >= 0) {
      return { index: idIndex, matchType: 'id' };
    }
  }

  const normalizedName = categoryPayload.nazwa_kategorii.trim().toLowerCase();
  const exactNameIndex = catalog.findIndex(
    (entry) => entry.nazwa_kategorii.trim().toLowerCase() === normalizedName,
  );
  if (exactNameIndex >= 0) {
    return { index: exactNameIndex, matchType: 'name' };
  }

  const targetSlug = slugify(categoryPayload.nazwa_kategorii);
  const slugIndex = catalog.findIndex((entry) => slugify(entry.nazwa_kategorii) === targetSlug);
  if (slugIndex >= 0) {
    return { index: slugIndex, matchType: 'slug' };
  }

  return { index: -1, matchType: 'insert' };
}

function applyLocalIdsFromExistingCategory(categoryPayload, existingCategory) {
  const preparedCategory = JSON.parse(JSON.stringify(categoryPayload));

  if (preparedCategory.id === null && existingCategory && typeof existingCategory.id === 'number') {
    preparedCategory.id = existingCategory.id;
  }

  if (!existingCategory) {
    return preparedCategory;
  }

  const existingBySignature = new Map();

  for (const product of existingCategory.pozycje) {
    if (typeof product.id !== 'number') {
      continue;
    }

    const signature = buildProductSignature(product);

    if (!existingBySignature.has(signature)) {
      existingBySignature.set(signature, []);
    }

    existingBySignature.get(signature).push(product.id);
  }

  preparedCategory.pozycje = preparedCategory.pozycje.map((product) => {
    if (typeof product.id === 'number') {
      return product;
    }

    const signature = buildProductSignature(product);
    const matchingIds = existingBySignature.get(signature);
    if (!matchingIds || matchingIds.length === 0) {
      return product;
    }

    return {
      ...product,
      id: matchingIds.shift(),
    };
  });

  return preparedCategory;
}

function mergeCategoryIntoCatalog(catalog, canonicalCategory, resolvedMatch) {
  const nextCatalog = catalog.slice();

  if (resolvedMatch.index >= 0) {
    nextCatalog[resolvedMatch.index] = canonicalCategory;
    return nextCatalog;
  }

  nextCatalog.push(canonicalCategory);
  return nextCatalog;
}

function createRemoteWorkerPhp(remoteWordPressRoot) {
  return String.raw`<?php
declare(strict_types=1);

define('WP_USE_THEMES', false);

const BULWAR_SYNC_WP_LOAD = '${remoteWordPressRoot}/wp-load.php';

function bulwar_sync_fail(string $message, array $context = []): void {
    $payload = [
        'success' => false,
        'error' => $message,
        'context' => $context,
    ];

    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit(1);
}

function bulwar_sync_string(array $source, string $key): string {
    if (!array_key_exists($key, $source) || !is_string($source[$key])) {
        bulwar_sync_fail('Invalid payload string field.', ['field' => $key]);
    }

    $value = trim($source[$key]);

    if ($value == '') {
        bulwar_sync_fail('Payload string field cannot be empty.', ['field' => $key]);
    }

    return $value;
}

function bulwar_sync_bool(array $source, string $key): bool {
    if (!array_key_exists($key, $source) || !is_bool($source[$key])) {
        bulwar_sync_fail('Invalid payload boolean field.', ['field' => $key]);
    }

    return (bool) $source[$key];
}

function bulwar_sync_number(array $source, string $key): float {
    if (!array_key_exists($key, $source) || !is_numeric($source[$key])) {
        bulwar_sync_fail('Invalid payload numeric field.', ['field' => $key]);
    }

    return (float) $source[$key];
}

function bulwar_sync_optional_id(array $source, string $key): int {
    if (!array_key_exists($key, $source) || $source[$key] === null || $source[$key] === '') {
        return 0;
    }

    if (!is_numeric($source[$key])) {
        bulwar_sync_fail('Invalid payload id field.', ['field' => $key]);
    }

    $value = (int) $source[$key];

    if ($value <= 0) {
        bulwar_sync_fail('Payload id field must be a positive integer.', ['field' => $key]);
    }

    return $value;
}

function bulwar_sync_slugify(string $value): string {
    $value = remove_accents($value);
    $value = strtolower($value);
    $value = preg_replace('/[^a-z0-9]+/', '-', $value);
    $value = trim((string) $value, '-');

    return $value;
}

function bulwar_sync_product_signature(array $product): string {
    $weight = trim((string) ($product['gramatura'] ?? ''));

    if (array_key_exists('nazwa_produktu', $product) || array_key_exists('opis_produktu', $product)) {
        $name = trim((string) ($product['nazwa_produktu'] ?? ''));
        $description = trim((string) ($product['opis_produktu'] ?? $product['opis_poduktu'] ?? ''));

        return sha1(wp_json_encode(['split', $name, $description, $weight], JSON_UNESCAPED_UNICODE));
    }

    $combined = trim((string) ($product['zespolona_nazwa_z_opisem'] ?? ''));

    return sha1(wp_json_encode(['combined', $combined, $weight], JSON_UNESCAPED_UNICODE));
}

function bulwar_sync_normalize_product(array $product): array {
    $normalized = [
        'id' => bulwar_sync_optional_id($product, 'id'),
        'gramatura' => bulwar_sync_string($product, 'gramatura'),
        'cena' => bulwar_sync_number($product, 'cena'),
        'vegan' => bulwar_sync_bool($product, 'vegan'),
        'vegetarian' => bulwar_sync_bool($product, 'vegetarian'),
    ];

    if (array_key_exists('nazwa_produktu', $product) || array_key_exists('opis_produktu', $product) || array_key_exists('opis_poduktu', $product)) {
        $normalized['nazwa_produktu'] = bulwar_sync_string($product, 'nazwa_produktu');
        $normalized['opis_produktu'] = bulwar_sync_string(
            ['opis_produktu' => $product['opis_produktu'] ?? $product['opis_poduktu'] ?? null],
            'opis_produktu'
        );

        return $normalized;
    }

    $normalized['zespolona_nazwa_z_opisem'] = bulwar_sync_string($product, 'zespolona_nazwa_z_opisem');

    return $normalized;
}

function bulwar_sync_resolve_category(array $category): int {
    $name = bulwar_sync_string($category, 'nazwa_kategorii');
    $description = bulwar_sync_string($category, 'opis_kategorii');
    $slug = bulwar_sync_slugify($name);
    $categoryId = bulwar_sync_optional_id($category, 'id');
    $termId = 0;

    if ($categoryId > 0) {
        $term = get_term($categoryId, 'product_cat');
        if ($term instanceof WP_Term && !is_wp_error($term)) {
            $termId = (int) $term->term_id;
        }
    }

    if ($termId === 0) {
        $term = get_term_by('slug', $slug, 'product_cat');
        if ($term instanceof WP_Term) {
            $termId = (int) $term->term_id;
        }
    }

    if ($termId === 0) {
        $term = term_exists($name, 'product_cat');
        if ($term !== 0 && $term !== null) {
            $termId = (int) (is_array($term) ? $term['term_id'] : $term);
        }
    }

    if ($termId > 0) {
        $updated = wp_update_term($termId, 'product_cat', [
            'name' => $name,
            'description' => $description,
            'slug' => $slug,
        ]);

        if (is_wp_error($updated)) {
            bulwar_sync_fail('Failed to update product_cat term.', [
                'term_id' => $termId,
                'message' => $updated->get_error_message(),
            ]);
        }

        return $termId;
    }

    $created = wp_insert_term($name, 'product_cat', [
        'description' => $description,
        'slug' => $slug,
    ]);

    if (is_wp_error($created)) {
        bulwar_sync_fail('Failed to create product_cat term.', [
            'message' => $created->get_error_message(),
        ]);
    }

    return (int) $created['term_id'];
}

function bulwar_sync_existing_products_by_signature(int $termId): array {
    $postIds = get_posts([
        'post_type' => 'product',
        'post_status' => ['publish', 'private', 'draft', 'pending'],
        'posts_per_page' => -1,
        'fields' => 'ids',
        'tax_query' => [[
            'taxonomy' => 'product_cat',
            'field' => 'term_id',
            'terms' => [$termId],
        ]],
    ]);

    $bySignature = [];

    foreach ($postIds as $postId) {
        $product = wc_get_product((int) $postId);
        if (!$product) {
            continue;
        }

        $signature = (string) $product->get_meta('bulwar_catering_signature', true);
        if ($signature === '') {
            $derived = [
                'id' => (int) $product->get_id(),
                'gramatura' => trim((string) $product->get_meta('gramatura', true)),
            ];

            $contentMode = (string) $product->get_meta('bulwar_catering_content_mode', true);
            if ($contentMode === 'split') {
                $derived['nazwa_produktu'] = (string) ($product->get_meta('bulwar_catering_nazwa_produktu', true) ?: $product->get_name());
                $derived['opis_produktu'] = (string) ($product->get_meta('bulwar_catering_opis_produktu', true) ?: $product->get_description());
            } else {
                $derived['zespolona_nazwa_z_opisem'] = (string) ($product->get_meta('bulwar_catering_combined_text', true) ?: $product->get_name());
            }

            $signature = bulwar_sync_product_signature($derived);
        }

        if (!array_key_exists($signature, $bySignature)) {
            $bySignature[$signature] = [];
        }

        $bySignature[$signature][] = (int) $product->get_id();
    }

    return $bySignature;
}

function bulwar_sync_resolve_product_id(array $product, int $termId, array &$existingBySignature): int {
    $productId = bulwar_sync_optional_id($product, 'id');

    if ($productId > 0) {
        $existing = wc_get_product($productId);
        if ($existing) {
            return (int) $existing->get_id();
        }
    }

    $signature = bulwar_sync_product_signature($product);

    if (!empty($existingBySignature[$signature])) {
        $matched = array_shift($existingBySignature[$signature]);
        if (is_numeric($matched) && (int) $matched > 0) {
            return (int) $matched;
        }
    }

    return 0;
}

function bulwar_sync_upsert_product(array $product, int $termId, array &$existingBySignature): array {
    $normalized = bulwar_sync_normalize_product($product);
    $resolvedId = bulwar_sync_resolve_product_id($normalized, $termId, $existingBySignature);
    $wooProduct = $resolvedId > 0 ? wc_get_product($resolvedId) : new WC_Product_Simple();

    if (!$wooProduct) {
        bulwar_sync_fail('Failed to resolve Woo product for sync.', ['id' => $resolvedId]);
    }

    $signature = bulwar_sync_product_signature($normalized);

    if (array_key_exists('nazwa_produktu', $normalized)) {
        $wooProduct->set_name($normalized['nazwa_produktu']);
        $wooProduct->set_description($normalized['opis_produktu']);
        $wooProduct->update_meta_data('bulwar_catering_content_mode', 'split');
        $wooProduct->update_meta_data('bulwar_catering_nazwa_produktu', $normalized['nazwa_produktu']);
        $wooProduct->update_meta_data('bulwar_catering_opis_produktu', $normalized['opis_produktu']);
        $wooProduct->delete_meta_data('bulwar_catering_combined_text');
    } else {
        $wooProduct->set_name($normalized['zespolona_nazwa_z_opisem']);
        $wooProduct->set_description('');
        $wooProduct->update_meta_data('bulwar_catering_content_mode', 'combined');
        $wooProduct->update_meta_data('bulwar_catering_combined_text', $normalized['zespolona_nazwa_z_opisem']);
        $wooProduct->delete_meta_data('bulwar_catering_nazwa_produktu');
        $wooProduct->delete_meta_data('bulwar_catering_opis_produktu');
    }

    $price = (string) $normalized['cena'];

    $wooProduct->set_status('publish');
    $wooProduct->set_catalog_visibility('visible');
    $wooProduct->set_category_ids([$termId]);
    $wooProduct->set_regular_price($price);
    $wooProduct->set_price($price);
    $wooProduct->update_meta_data('gramatura', $normalized['gramatura']);
    $wooProduct->update_meta_data('vegan', $normalized['vegan'] ? 'yes' : 'no');
    $wooProduct->update_meta_data('vegetarian', $normalized['vegetarian'] ? 'yes' : 'no');
    $wooProduct->update_meta_data('bulwar_catering_signature', $signature);

    $savedId = (int) $wooProduct->save();

    if ($savedId <= 0) {
        bulwar_sync_fail('Failed to save Woo product.', ['signature' => $signature]);
    }

    $normalized['id'] = $savedId;
    return $normalized;
}

if (!file_exists(BULWAR_SYNC_WP_LOAD)) {
    bulwar_sync_fail('wp-load.php not found.', ['path' => BULWAR_SYNC_WP_LOAD]);
}

require_once BULWAR_SYNC_WP_LOAD;

if (!function_exists('wc_get_product')) {
    bulwar_sync_fail('WooCommerce is not available in the loaded WordPress context.');
}

$inputPath = $argv[1] ?? null;
if (!$inputPath || !file_exists($inputPath)) {
    bulwar_sync_fail('Input payload file is missing.', ['input_path' => $inputPath]);
}

$decoded = json_decode((string) file_get_contents($inputPath), true);
if (!is_array($decoded)) {
    bulwar_sync_fail('Input payload is not valid JSON.');
}

$category = [
    'id' => bulwar_sync_optional_id($decoded, 'id'),
    'nazwa_kategorii' => bulwar_sync_string($decoded, 'nazwa_kategorii'),
    'opis_kategorii' => bulwar_sync_string($decoded, 'opis_kategorii'),
    'image_url' => bulwar_sync_string($decoded, 'image_url'),
    'pozycje' => [],
];

if (!array_key_exists('pozycje', $decoded) || !is_array($decoded['pozycje'])) {
    bulwar_sync_fail('Category payload must contain pozycje array.');
}

$termId = bulwar_sync_resolve_category($category);
$existingBySignature = bulwar_sync_existing_products_by_signature($termId);

foreach ($decoded['pozycje'] as $product) {
    if (!is_array($product)) {
        bulwar_sync_fail('Product entry must be an object-like array.');
    }

    $category['pozycje'][] = bulwar_sync_upsert_product($product, $termId, $existingBySignature);
}

$category['id'] = $termId;

echo json_encode([
    'success' => true,
    'category' => $category,
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
`;
}

function createRemoteTempNames() {
  const stamp = `${Date.now()}-${process.pid}`;
  return {
    remoteJsonName: `bulwar_sync_payload_${stamp}.json`,
    remotePhpName: `bulwar_sync_worker_${stamp}.php`,
  };
}

function runCommand(command, args, options = {}) {
  return execFileSync(command, args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 1024 * 1024 * 10,
    ...options,
  });
}

function parseRemoteResponse(output) {
  let parsed;

  try {
    parsed = JSON.parse(output);
  } catch (error) {
    throw new Error(`Remote worker did not return valid JSON. ${error.message}`);
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Remote worker returned an invalid response object.');
  }

  if (!parsed.success) {
    throw new Error(parsed.error || 'Remote worker reported failure.');
  }

  return validateCategoryPayload(parsed.category);
}

function syncCategoryRemotely(categoryPayload) {
  const remoteConfig = getRemoteSyncConfig();
  const remoteNames = createRemoteTempNames();
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bulwar-sync-'));
  const localPayloadPath = path.join(tempDir, remoteNames.remoteJsonName);
  const localWorkerPath = path.join(tempDir, remoteNames.remotePhpName);
  const remotePayloadPath = remoteNames.remoteJsonName;
  const remoteWorkerPath = remoteNames.remotePhpName;

  writeJsonFile(localPayloadPath, categoryPayload);
  fs.writeFileSync(localWorkerPath, createRemoteWorkerPhp(remoteConfig.remoteWordPressRoot), 'utf8');

  try {
    runCommand('scp', ['-i', remoteConfig.sshKeyPath, localPayloadPath, localWorkerPath, `${remoteConfig.sshTarget}:~/`]);

    const stdout = runCommand('ssh', [
      '-i',
      remoteConfig.sshKeyPath,
      remoteConfig.sshTarget,
      'php83',
      remoteWorkerPath,
      remotePayloadPath,
    ]);

    return parseRemoteResponse(stdout);
  } catch (error) {
    const stdout = typeof error.stdout === 'string' ? error.stdout.trim() : '';
    const stderr = typeof error.stderr === 'string' ? error.stderr.trim() : '';

    if (stdout) {
      try {
        const parsed = JSON.parse(stdout);
        if (parsed && parsed.error) {
          throw new Error(`Remote sync failed: ${parsed.error}`);
        }
      } catch (parseError) {
        if (parseError.message.startsWith('Remote sync failed:')) {
          throw parseError;
        }
      }
    }

    throw new Error(
      ['Remote sync command failed.', stdout && `stdout: ${stdout}`, stderr && `stderr: ${stderr}`]
        .filter(Boolean)
        .join(' '),
    );
  } finally {
    try {
      runCommand('ssh', [
        '-i',
        remoteConfig.sshKeyPath,
        remoteConfig.sshTarget,
        'rm',
        '-f',
        remotePayloadPath,
        remoteWorkerPath,
      ]);
    } catch (cleanupError) {
      process.stderr.write(`Remote cleanup warning: ${cleanupError.message}\n`);
    }

    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

function buildLocalPreview(categoryPayload, catalog) {
  const resolvedMatch = resolveCategoryMatch(catalog, categoryPayload);
  const existingCategory = resolvedMatch.index >= 0 ? catalog[resolvedMatch.index] : null;
  const preparedCategory = applyLocalIdsFromExistingCategory(categoryPayload, existingCategory);

  return {
    preparedCategory,
    resolvedMatch,
    existingCategory,
  };
}

function formatSummary(summary) {
  return JSON.stringify(summary, null, 2);
}

function main() {
  const options = parseArgs(process.argv.slice(2));

  if (!fs.existsSync(options.inputPath)) {
    throw new Error(`Input file does not exist: ${options.inputPath}`);
  }

  if (!fs.existsSync(FRONTEND_JSON_PATH)) {
    throw new Error(`Frontend data file does not exist: ${FRONTEND_JSON_PATH}`);
  }

  const inputCategory = validateCategoryPayload(readJsonFile(options.inputPath));
  const catalog = assertCatalogShape(readJsonFile(FRONTEND_JSON_PATH));
  const preview = buildLocalPreview(inputCategory, catalog);

  if (options.dryRun || options.localValidate) {
    process.stdout.write(
      `${formatSummary({
        mode: options.localValidate ? 'local-validate' : 'dry-run',
        input: options.inputPath,
        frontendJson: FRONTEND_JSON_PATH,
        categoryMatch: preview.resolvedMatch.matchType,
        categoryIndex: preview.resolvedMatch.index,
        categoryId: preview.preparedCategory.id,
        productIds: preview.preparedCategory.pozycje.map((product) => product.id ?? null),
      })}\n`,
    );
    return;
  }

  const remoteConfig = getRemoteSyncConfig();

  if (!fs.existsSync(remoteConfig.sshKeyPath)) {
    throw new Error(`SSH key does not exist: ${remoteConfig.sshKeyPath}`);
  }

  const canonicalCategory = syncCategoryRemotely(preview.preparedCategory);
  const nextCatalog = mergeCategoryIntoCatalog(catalog, canonicalCategory, preview.resolvedMatch);

  writeJsonFile(FRONTEND_JSON_PATH, nextCatalog);

  process.stdout.write(
    `${formatSummary({
      mode: 'sync',
      input: options.inputPath,
      frontendJson: FRONTEND_JSON_PATH,
      categoryMatch: preview.resolvedMatch.matchType,
      categoryId: canonicalCategory.id,
      productIds: canonicalCategory.pozycje.map((product) => product.id),
      productsSynced: canonicalCategory.pozycje.length,
    })}\n`,
  );
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exit(1);
  }
}

module.exports = {
  FRONTEND_JSON_PATH,
  PUBLIC_IMAGE_PREFIX,
  applyLocalIdsFromExistingCategory,
  assertCatalogShape,
  buildLocalPreview,
  buildProductSignature,
  createRemoteWorkerPhp,
  getRemoteSyncConfig,
  mergeCategoryIntoCatalog,
  resolveCategoryMatch,
  slugify,
  validateCategoryPayload,
};