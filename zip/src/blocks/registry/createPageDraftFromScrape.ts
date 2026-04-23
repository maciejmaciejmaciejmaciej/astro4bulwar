import { z } from "zod";

import { validateBlockData } from "./index";
import { createDefaultBlockInstance } from "./index";
import { parseFirebasePageDraft, type FirebaseDraftBlock, type FirebasePageDraft } from "./firebasePageDraft";

const DEFAULT_HEADING_HTML = "<p>This section requires manual editorial copy.</p>";
const DEFAULT_HEADING_EYEBROW = "Draft page";
const DEFAULT_MENU_SECTION_TITLE = "Menu section";

export const normalizedScrapeStructureHintsSchema = z.object({
  templateKey: z.string().min(1).optional(),
  requiresWooMenu: z.boolean().optional(),
  headingTextHints: z.array(z.string().min(1)).default([]),
  menuSectionTitles: z.array(z.string().min(1)).default([]),
  sectionHeadingHints: z.array(z.string().min(1)).default([]),
}).default({
  headingTextHints: [],
  menuSectionTitles: [],
  sectionHeadingHints: [],
});

export const normalizedScrapeDocumentSchema = z.object({
  pageSlug: z.string().min(1),
  pageKind: z.string().min(1),
  title: z.string().min(1),
  sourcePath: z.string().min(1).optional(),
  sourceUrl: z.string().min(1).optional(),
  seo: z.record(z.string(), z.unknown()).optional(),
  structureHints: normalizedScrapeStructureHintsSchema,
});

export type NormalizedScrapeStructureHints = z.infer<typeof normalizedScrapeStructureHintsSchema>;
export type NormalizedScrapeDocument = z.infer<typeof normalizedScrapeDocumentSchema>;

const normalizeHintTitles = (document: NormalizedScrapeDocument): string[] => {
  const titles = [
    ...document.structureHints.menuSectionTitles,
    ...document.structureHints.sectionHeadingHints,
    ...document.structureHints.headingTextHints,
  ].map((value) => value.trim()).filter((value) => value.length > 0);

  return [...new Set(titles)];
};

const createHeadingBlock = (title: string): FirebaseDraftBlock => {
  const heading = createDefaultBlockInstance("simple_heading_and_paragraph", 1);

  return {
    ...heading,
    data: validateBlockData("simple_heading_and_paragraph", {
      eyebrow: DEFAULT_HEADING_EYEBROW,
      title,
      richTextHtml: DEFAULT_HEADING_HTML,
    }),
  };
};

const createWooMenuBlock = (title: string, sequenceNumber: number): FirebaseDraftBlock => {
  const menuBlock = createDefaultBlockInstance("menu_two_columns_with_with_heading_no_img", sequenceNumber);
  const placeholderSuffix = sequenceNumber === 1 ? "" : `_${sequenceNumber}`;

  return {
    ...menuBlock,
    variant: "surface",
    data: validateBlockData("menu_two_columns_with_with_heading_no_img", {
      title,
      menuColumns: [],
      emptyStateText: "Brak pozycji w tej kategorii.",
    }),
    source: {
      sourceType: "woo_category",
      sourceValue: `TODO_WOO_CATEGORY_SLUG${placeholderSuffix}`,
      options: {
        splitIntoColumns: 2,
      },
    },
  };
};

const buildRestaurantMenuDraft = (document: NormalizedScrapeDocument): FirebasePageDraft => {
  const menuTitles = normalizeHintTitles(document);
  const resolvedMenuTitles = menuTitles.length > 0 ? menuTitles : [DEFAULT_MENU_SECTION_TITLE];
  const headingBlock = createHeadingBlock(document.title);
  const menuBlocks = resolvedMenuTitles.map((title, index) => createWooMenuBlock(title, index + 1));
  const orderedBlocks = [headingBlock, ...menuBlocks];

  return parseFirebasePageDraft({
    pageSlug: document.pageSlug,
    pageKind: document.pageKind,
    title: document.title,
    templateKey: document.structureHints.templateKey ?? "restaurant-menu",
    status: "draft",
    sourcePath: document.sourcePath,
    sourceUrl: document.sourceUrl,
    seo: document.seo,
    blocksOrder: orderedBlocks.map((block) => block.id),
    blocks: Object.fromEntries(orderedBlocks.map((block) => [block.id, block])),
    compiled: {
      page_builder_schema: null,
      page_builder_schema_for_ai: null,
    },
    needsCompile: true,
    needsPublish: false,
    needsDeploy: false,
  });
};

const buildFallbackDraft = (document: NormalizedScrapeDocument): FirebasePageDraft => {
  const headingBlock = createHeadingBlock(document.title);

  return parseFirebasePageDraft({
    pageSlug: document.pageSlug,
    pageKind: document.pageKind,
    title: document.title,
    templateKey: document.structureHints.templateKey ?? "generic-page",
    status: "draft",
    sourcePath: document.sourcePath,
    sourceUrl: document.sourceUrl,
    seo: document.seo,
    blocksOrder: [headingBlock.id],
    blocks: {
      [headingBlock.id]: headingBlock,
    },
    compiled: {
      page_builder_schema: null,
      page_builder_schema_for_ai: null,
    },
    needsCompile: true,
    needsPublish: false,
    needsDeploy: false,
  });
};

export const createPageDraftFromScrape = (value: unknown): FirebasePageDraft => {
  const document = normalizedScrapeDocumentSchema.parse(value);

  if (document.pageKind === "restaurant_menu") {
    return buildRestaurantMenuDraft(document);
  }

  return buildFallbackDraft(document);
};