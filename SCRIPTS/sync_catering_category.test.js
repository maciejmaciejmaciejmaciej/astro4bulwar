const test = require('node:test');
const assert = require('node:assert/strict');

const {
  applyLocalIdsFromExistingCategory,
  buildLocalPreview,
  buildProductSignature,
  mergeCategoryIntoCatalog,
  resolveCategoryMatch,
  validateCategoryPayload,
} = require('./sync_catering_category');

function createCombinedProduct(overrides = {}) {
  return {
    id: 1001,
    zespolona_nazwa_z_opisem: 'Barszcz czerwony z majerankiem',
    gramatura: '0,9 l',
    cena: 78,
    vegan: true,
    vegetarian: true,
    ...overrides,
  };
}

function createSplitProduct(overrides = {}) {
  return {
    id: 1002,
    nazwa_produktu: 'Rosół domowy',
    opis_produktu: 'gotowany 12 godzin na wolnym ogniu',
    gramatura: '0,9 l',
    cena: 68,
    vegan: false,
    vegetarian: false,
    ...overrides,
  };
}

function createCategory(overrides = {}) {
  return {
    id: 77,
    nazwa_kategorii: 'Zupy',
    opis_kategorii:
      'Wszystkie nasze potrawy są przygotowywane z najlepszej jakości produktów.',
    image_url: '/react/images/zupy.webp',
    pozycje: [createCombinedProduct(), createSplitProduct()],
    ...overrides,
  };
}

test('validateCategoryPayload keeps combined and split raw contracts intact', () => {
  const category = validateCategoryPayload(createCategory());

  assert.equal(category.nazwa_kategorii, 'Zupy');
  assert.equal(category.pozycje[0].zespolona_nazwa_z_opisem, 'Barszcz czerwony z majerankiem');
  assert.equal(category.pozycje[1].nazwa_produktu, 'Rosół domowy');
  assert.equal(category.pozycje[1].opis_produktu, 'gotowany 12 godzin na wolnym ogniu');
});

test('validateCategoryPayload rejects invalid image_url prefix', () => {
  assert.throws(
    () => validateCategoryPayload(createCategory({ image_url: '/images/zupy.webp' })),
    /must start with \/react\/images\//,
  );
});

test('validateCategoryPayload rejects partial split product payloads', () => {
  assert.throws(
    () =>
      validateCategoryPayload(
        createCategory({
          pozycje: [
            createSplitProduct({
              nazwa_produktu: 'Rosół domowy',
              opis_produktu: undefined,
            }),
          ],
        }),
      ),
    /must provide both nazwa_produktu and opis_produktu/,
  );
});

test('resolveCategoryMatch prefers id then name then slug', () => {
  const catalog = [
    createCategory({ id: 77, nazwa_kategorii: 'Zupy' }),
    createCategory({ id: 88, nazwa_kategorii: 'Świąteczny Obiad' }),
  ];

  assert.deepEqual(resolveCategoryMatch(catalog, createCategory({ id: 77 })), {
    index: 0,
    matchType: 'id',
  });
  assert.deepEqual(resolveCategoryMatch(catalog, createCategory({ id: null, nazwa_kategorii: 'Zupy' })), {
    index: 0,
    matchType: 'name',
  });
  assert.deepEqual(
    resolveCategoryMatch(
      catalog,
      createCategory({ id: null, nazwa_kategorii: 'Swiateczny obiad', pozycje: [] }),
    ),
    {
      index: 1,
      matchType: 'slug',
    },
  );
});

test('applyLocalIdsFromExistingCategory fills missing product ids from signature matches', () => {
  const existingCategory = createCategory();
  const incomingCategory = createCategory({
    id: null,
    pozycje: [
      createCombinedProduct({ id: null }),
      createSplitProduct({ id: null }),
    ],
  });

  const prepared = applyLocalIdsFromExistingCategory(incomingCategory, existingCategory);

  assert.equal(prepared.id, 77);
  assert.deepEqual(
    prepared.pozycje.map((product) => product.id),
    existingCategory.pozycje.map((product) => product.id),
  );
  assert.notEqual(buildProductSignature(prepared.pozycje[0]), buildProductSignature(prepared.pozycje[1]));
});

test('mergeCategoryIntoCatalog replaces matched category and appends new categories', () => {
  const originalCatalog = [createCategory({ id: 77 }), createCategory({ id: 88, nazwa_kategorii: 'Dodatki' })];
  const replacement = createCategory({ id: 77, opis_kategorii: 'Nowy opis kategorii' });
  const inserted = createCategory({ id: 99, nazwa_kategorii: 'Desery' });

  const replacedCatalog = mergeCategoryIntoCatalog(originalCatalog, replacement, {
    index: 0,
    matchType: 'id',
  });
  assert.equal(replacedCatalog.length, 2);
  assert.equal(replacedCatalog[0].opis_kategorii, 'Nowy opis kategorii');

  const insertedCatalog = mergeCategoryIntoCatalog(originalCatalog, inserted, {
    index: -1,
    matchType: 'insert',
  });
  assert.equal(insertedCatalog.length, 3);
  assert.equal(insertedCatalog[2].nazwa_kategorii, 'Desery');
});

test('buildLocalPreview returns stable local merge information', () => {
  const catalog = [createCategory({ id: 77 })];
  const preview = buildLocalPreview(
    createCategory({
      id: null,
      pozycje: [createCombinedProduct({ id: null }), createSplitProduct({ id: null })],
    }),
    catalog,
  );

  assert.equal(preview.resolvedMatch.index, 0);
  assert.equal(preview.preparedCategory.id, 77);
  assert.deepEqual(preview.preparedCategory.pozycje.map((product) => product.id), [1001, 1002]);
});