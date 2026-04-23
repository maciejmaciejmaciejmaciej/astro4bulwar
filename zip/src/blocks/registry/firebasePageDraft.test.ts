import assert from "node:assert/strict";
import test from "node:test";

import { createPageDraftFromScrape } from "./createPageDraftFromScrape";
import { hasSourcePlaceholder, parseFirebasePageDraft } from "./firebasePageDraft";

type MenuDraftBlockData = {
  title?: string;
  menuColumns?: unknown[];
};

type MenuDraftBlockSource = {
  sourceType?: string;
  sourceValue?: string;
};

test("restaurant_menu drafts bootstrap Woo placeholders and empty menu columns", () => {
  const draft = createPageDraftFromScrape({
    pageSlug: "menu-kolacje",
    pageKind: "restaurant_menu",
    title: "Kolacje",
    structureHints: {
      menuSectionTitles: ["Przystawki", "Dania glowne"],
    },
  });

  assert.deepEqual(draft.blocksOrder, [
    "simple_heading_and_paragraph-01",
    "menu_two_columns_with_with_heading_no_img-01",
    "menu_two_columns_with_with_heading_no_img-02",
  ]);

  const firstMenuBlock = draft.blocks["menu_two_columns_with_with_heading_no_img-01"];
  const secondMenuBlock = draft.blocks["menu_two_columns_with_with_heading_no_img-02"];
  const firstMenuBlockData = firstMenuBlock?.data as MenuDraftBlockData | undefined;
  const firstMenuBlockSource = firstMenuBlock?.source as MenuDraftBlockSource | undefined;
  const secondMenuBlockData = secondMenuBlock?.data as MenuDraftBlockData | undefined;
  const secondMenuBlockSource = secondMenuBlock?.source as MenuDraftBlockSource | undefined;

  assert.equal(firstMenuBlockData?.title, "Przystawki");
  assert.deepEqual(firstMenuBlockData?.menuColumns, []);
  assert.equal(firstMenuBlockSource?.sourceType, "woo_category");
  assert.equal(firstMenuBlockSource?.sourceValue, "TODO_WOO_CATEGORY_SLUG");
  assert.equal(secondMenuBlockData?.title, "Dania glowne");
  assert.equal(secondMenuBlockSource?.sourceValue, "TODO_WOO_CATEGORY_SLUG_2");
});

test("workflow flags unresolved Woo source mappings from placeholder sources", () => {
  const draft = createPageDraftFromScrape({
    pageSlug: "menu-desery",
    pageKind: "restaurant_menu",
    title: "Desery",
    structureHints: {
      menuSectionTitles: ["Desery"],
    },
  });

  const menuBlockId = "menu_two_columns_with_with_heading_no_img-01";

  assert.equal(hasSourcePlaceholder(draft.blocks[menuBlockId]?.source), true);
  assert.equal(draft.workflow?.requiresSourceMapping, true);
  assert.deepEqual(draft.workflow?.unresolvedSourceBlockIds, [menuBlockId]);
  assert.match(draft.workflow?.sourceMappingNotes[menuBlockId] ?? "", /WooCommerce category/i);
});

test("parseFirebasePageDraft keeps legacy drafts compatible and defaults site context root fields", () => {
  const draft = parseFirebasePageDraft({
    pageSlug: "landing-page",
    pageKind: "generic_page",
    title: "Landing Page",
    status: "draft",
    blocksOrder: ["simple_heading_and_paragraph-01"],
    blocks: {
      "simple_heading_and_paragraph-01": {
        id: "simple_heading_and_paragraph-01",
        blockKey: "simple_heading_and_paragraph",
        blockVersion: 1,
        variant: null,
        enabled: true,
        data: {
          title: "Landing Page",
        },
        source: null,
        meta: {},
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

  assert.equal(draft.CompanyName, null);
  assert.equal(draft.websiteUrl, null);
  assert.equal(draft.workflow?.checkpointId, null);
  assert.equal(draft.workflow?.resumeStage, "idle");
  assert.deepEqual(draft.workflow?.retryBudget, {
    maxAttempts: 0,
    remainingAttempts: 0,
  });
  assert.equal(draft.workflow?.pendingBlockRefinementRequest, null);
});

test("parseFirebasePageDraft preserves page composition checkpoint and pending refinement request", () => {
  const draft = parseFirebasePageDraft({
    pageSlug: "landing-page",
    pageKind: "generic_page",
    title: "Landing Page",
    status: "draft",
    blocksOrder: ["simple_heading_and_paragraph-01"],
    blocks: {
      "simple_heading_and_paragraph-01": {
        id: "simple_heading_and_paragraph-01",
        blockKey: "simple_heading_and_paragraph",
        blockVersion: 1,
        variant: null,
        enabled: true,
        data: {
          title: "Landing Page",
        },
        source: null,
        meta: {},
      },
    },
    compiled: {
      page_builder_schema: null,
      page_builder_schema_for_ai: null,
    },
    workflow: {
      checkpointId: "composition:hero-grid",
      resumeStage: "awaiting_block_refinement",
      retryBudget: {
        maxAttempts: 3,
        remainingAttempts: 2,
      },
      pendingBlockRefinementRequest: {
        blockKey: "hero_grid_split",
        sourceBlockId: "simple_heading_and_paragraph-01",
        reason: "not_ready",
      },
    },
    needsCompile: true,
    needsPublish: false,
    needsDeploy: false,
  });

  assert.equal(draft.workflow?.checkpointId, "composition:hero-grid");
  assert.equal(draft.workflow?.resumeStage, "awaiting_block_refinement");
  assert.deepEqual(draft.workflow?.retryBudget, {
    maxAttempts: 3,
    remainingAttempts: 2,
  });
  assert.deepEqual(draft.workflow?.pendingBlockRefinementRequest, {
    blockKey: "hero_grid_split",
    sourceBlockId: "simple_heading_and_paragraph-01",
    reason: "not_ready",
  });
  assert.equal(draft.workflow?.requiresSourceMapping, false);
});

test("parseFirebasePageDraft rejects broken blocksOrder and block id mismatches", () => {
  const draft = createPageDraftFromScrape({
    pageSlug: "menu-lunch",
    pageKind: "restaurant_menu",
    title: "Lunch",
    structureHints: {
      menuSectionTitles: ["Lunch"],
    },
  });

  assert.throws(
    () => parseFirebasePageDraft({
      ...draft,
      blocksOrder: ["missing-block-id"],
    }),
    /blocksOrder/i,
  );

  assert.throws(
    () => parseFirebasePageDraft({
      ...draft,
      blocks: {
        ...draft.blocks,
        "menu_two_columns_with_with_heading_no_img-01": {
          ...draft.blocks["menu_two_columns_with_with_heading_no_img-01"],
          id: "menu_two_columns_with_with_heading_no_img-99",
        },
      },
    }),
    /must match its record key/i,
  );
});