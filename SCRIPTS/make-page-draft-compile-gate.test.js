const test = require('node:test');
const assert = require('node:assert/strict');

const { compilePageDraft } = require('./make-page-draft-compile-gate.js');

const createBaseDraft = () => ({
  pageSlug: 'menu-kolacje',
  pageKind: 'restaurant_menu',
  title: 'Kolacje',
  templateKey: 'restaurant-menu',
  status: 'draft',
  blocksOrder: [
    'simple_heading_and_paragraph-01',
    'menu_two_columns_with_with_heading_no_img-01',
  ],
  blocks: {
    'simple_heading_and_paragraph-01': {
      id: 'simple_heading_and_paragraph-01',
      blockKey: 'simple_heading_and_paragraph',
      blockVersion: 1,
      variant: null,
      enabled: true,
      data: {
        eyebrow: 'Draft page',
        title: 'Kolacje',
        richTextHtml: '<p>This section requires manual editorial copy.</p>',
      },
      source: null,
      meta: {
        ai: {
          description: 'Sekcja otwiera strone menu i wprowadza redakcyjny kontekst dla tej podstrony.',
        },
      },
    },
    'menu_two_columns_with_with_heading_no_img-01': {
      id: 'menu_two_columns_with_with_heading_no_img-01',
      blockKey: 'menu_two_columns_with_with_heading_no_img',
      blockVersion: 1,
      variant: 'surface',
      enabled: true,
      data: {
        title: 'Kolacje',
        menuColumns: [],
        emptyStateText: 'Brak pozycji w tej kategorii.',
      },
      source: {
        sourceType: 'woo_category',
        sourceValue: 'TODO_WOO_CATEGORY_SLUG',
        options: {
          splitIntoColumns: 2,
        },
      },
      meta: {
        ai: {
          description: 'Sekcja pokazuje kolacje na podstawie powiazanej kategorii WooCommerce.',
        },
      },
    },
  },
  compiled: {
    page_builder_schema: null,
    page_builder_schema_for_ai: null,
  },
  needsCompile: true,
  needsPublish: false,
  needsDeploy: false,
});

test('compile gate blocks compilation when Woo source placeholders remain', () => {
  assert.throws(
    () => compilePageDraft({ firebaseDraft: createBaseDraft() }),
    /Compile blocked: unresolved source mappings remain/i,
  );
});

test('compile gate emits both schemas together after approved source mappings are applied', () => {
  const result = compilePageDraft({
    firebaseDraft: createBaseDraft(),
    approvedSourceMappings: {
      'menu_two_columns_with_with_heading_no_img-01': {
        sourceType: 'woo_category',
        sourceValue: 'kolacje',
        options: {
          splitIntoColumns: 2,
        },
      },
      'missing-block-id': {
        sourceType: 'woo_category',
        sourceValue: 'ignored',
        options: {},
      },
    },
  });

  assert.equal(result.firebaseDraft.compiled.page_builder_schema.sections.length, 2);
  assert.equal(
    result.firebaseDraft.compiled.page_builder_schema.sections[1].source.sourceValue,
    'kolacje',
  );
  assert.equal(result.firebaseDraft.compiled.page_builder_schema_for_ai.blocks[1].contentSource, 'woo_category');
  assert.equal(
    result.firebaseDraft.compiled.page_builder_schema_for_ai.blocks[0].description,
    'Sekcja otwiera strone menu i wprowadza redakcyjny kontekst dla tej podstrony.',
  );
  assert.equal(
    result.firebaseDraft.compiled.page_builder_schema_for_ai.blocks[1].description,
    'Sekcja pokazuje kolacje na podstawie powiazanej kategorii WooCommerce.',
  );
  assert.equal(
    result.firebaseDraft.compiled.page_builder_schema_for_ai.blocks[1].content.source.sourceValue,
    'kolacje',
  );
  assert.equal(
    Object.prototype.hasOwnProperty.call(
      result.firebaseDraft.compiled.page_builder_schema_for_ai.blocks[1].content,
      'menuColumns',
    ),
    false,
  );
  assert.deepEqual(result.meta.appliedSourceBlockIds, ['menu_two_columns_with_with_heading_no_img-01']);
  assert.deepEqual(result.meta.ignoredSourceBlockIds, ['missing-block-id']);
});