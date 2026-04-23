import assert from "node:assert/strict";
import test from "node:test";

import { createInMemoryFirebasePageDraftStore } from "../../zip/src/blocks/registry/firebasePageDraftStore.ts";
import { parseFirebasePageDraft } from "../../zip/src/blocks/registry/firebasePageDraft.ts";
import { runPageBuilderRuntimeWorkflow, runPageCompositionWorkflow } from "./runtimeWorkflow.ts";

type CompiledRenderSchema = {
  sections?: Array<{
    source?: {
      sourceValue?: string;
    } | null;
  }>;
};

type CompiledAiSchema = {
  postId?: number;
};

const createBaseDraft = () => ({
  pageSlug: "menu-kolacje",
  pageKind: "restaurant_menu",
  CompanyName: null,
  websiteUrl: null,
  title: "Kolacje",
  templateKey: "restaurant-menu",
  status: "draft" as const,
  blocksOrder: [
    "simple_heading_and_paragraph-01",
    "menu_two_columns_with_with_heading_no_img-01",
  ],
  blocks: {
    "simple_heading_and_paragraph-01": {
      id: "simple_heading_and_paragraph-01",
      blockKey: "simple_heading_and_paragraph",
      blockVersion: 1,
      variant: null,
      enabled: true,
      data: {
        eyebrow: "Draft page",
        title: "Kolacje",
        richTextHtml: "<p>Editorial copy</p>",
      },
      source: null,
      meta: {
        ai: {
          description: "Sekcja otwiera strone menu.",
        },
      },
    },
    "menu_two_columns_with_with_heading_no_img-01": {
      id: "menu_two_columns_with_with_heading_no_img-01",
      blockKey: "menu_two_columns_with_with_heading_no_img",
      blockVersion: 1,
      variant: "surface",
      enabled: true,
      data: {
        title: "Kolacje",
        menuColumns: [],
        emptyStateText: "Brak pozycji w tej kategorii.",
      },
      source: {
        sourceType: "woo_category",
        sourceValue: "TODO_WOO_CATEGORY_SLUG",
        options: {
          splitIntoColumns: 2,
        },
      },
      meta: {
        ai: {
          description: "Sekcja pokazuje kolacje z WooCommerce.",
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

test("node-only runtime workflow persists, compiles, publishes and verifies readback", async () => {
  const callOrder: string[] = [];
  const baseStore = createInMemoryFirebasePageDraftStore();
  const draftStore = {
    async saveDraft(...args: Parameters<typeof baseStore.saveDraft>) {
      callOrder.push("save");
      return baseStore.saveDraft(...args);
    },
    async loadDraft(...args: Parameters<typeof baseStore.loadDraft>) {
      return baseStore.loadDraft(...args);
    },
    async upsertDraft(...args: Parameters<typeof baseStore.upsertDraft>) {
      callOrder.push("upsert");
      return baseStore.upsertDraft(...args);
    },
  };

  let lastPublished:
    | {
        slug: string;
        schema: unknown;
        aiSchema: unknown;
      }
    | null = null;

  const wordpressClient = {
    async fetchSiteContext() {
      callOrder.push("siteContext");

      return {
        CompanyName: "Bulwar Restauracja",
        websiteUrl: "https://bulwarrestauracja.pl/",
      };
    },
    async ensurePageExists(input: { slug: string; title: string; status: string }) {
      callOrder.push("ensure");
      assert.equal(input.slug, "menu-kolacje");

      return {
        id: 987,
        slug: input.slug,
        title: input.title,
        status: input.status as "draft",
      };
    },
    async publishPageBuilderPayloads(input: { slug: string; schema: unknown; aiSchema: unknown }) {
      callOrder.push("publish");
      lastPublished = input;

      return {
        pageId: 987,
        schema: input.schema,
        aiSchema: input.aiSchema,
      };
    },
    async readPageBuilderPayloads(slug: string) {
      callOrder.push("readback");
      assert.equal(slug, "menu-kolacje");

      return {
        pageId: 987,
        schema: lastPublished?.schema,
        aiSchema: lastPublished?.aiSchema,
      };
    },
  };

  const result = await runPageBuilderRuntimeWorkflow({
    draft: createBaseDraft(),
    approvedSourceMappings: {
      "menu_two_columns_with_with_heading_no_img-01": {
        sourceType: "woo_category",
        sourceValue: "kolacje",
        options: {
          splitIntoColumns: 2,
        },
      },
    },
    draftStore,
    wordpressClient,
    verifyReadback: true,
  });

  const storedDraft = await baseStore.loadDraft("menu-kolacje");
  const compiledRenderSchema = storedDraft?.compiled.page_builder_schema as CompiledRenderSchema | null;

  assert.ok(callOrder.indexOf("upsert") !== -1);
  assert.ok(callOrder.indexOf("siteContext") > callOrder.indexOf("upsert"));
  assert.ok(callOrder.indexOf("ensure") > callOrder.indexOf("upsert"));
  assert.ok(callOrder.indexOf("publish") > callOrder.indexOf("ensure"));
  assert.ok(callOrder.indexOf("readback") > callOrder.indexOf("publish"));
  assert.equal(result.ensuredPage?.id, 987);
  assert.equal(storedDraft?.wordpressPostId, 987);
  assert.equal(storedDraft?.CompanyName, "Bulwar Restauracja");
  assert.equal(storedDraft?.websiteUrl, "https://bulwarrestauracja.pl/");
  assert.equal(result.draft.CompanyName, "Bulwar Restauracja");
  assert.equal(result.draft.websiteUrl, "https://bulwarrestauracja.pl/");
  assert.equal(storedDraft?.needsPublish, false);
  assert.equal(compiledRenderSchema?.sections?.[1]?.source?.sourceValue, "kolacje");
  assert.equal(result.readback?.verified, true);
});

test("node-only runtime workflow dry-run compiles without touching Firestore or WordPress", async () => {
  const result = await runPageBuilderRuntimeWorkflow({
    draft: parseFirebasePageDraft({
      ...createBaseDraft(),
      workflow: {
        checkpointId: "composition:menu-kolacje",
        resumeStage: "awaiting_block_refinement",
        retryBudget: {
          maxAttempts: 2,
          remainingAttempts: 1,
        },
        pendingBlockRefinementRequest: {
          blockKey: "menu_two_columns_with_with_heading_no_img",
          sourceBlockId: "menu_two_columns_with_with_heading_no_img-01",
          reason: "missing",
        },
      },
    }),
    approvedSourceMappings: {
      "menu_two_columns_with_with_heading_no_img-01": {
        sourceType: "woo_category",
        sourceValue: "kolacje",
        options: {
          splitIntoColumns: 2,
        },
      },
    },
    dryRun: true,
  });
  const compiledAiSchema = result.compiled.page_builder_schema_for_ai as CompiledAiSchema | null;
  const compiledRenderSchema = result.compiled.page_builder_schema as CompiledRenderSchema | null;

  assert.equal(result.dryRun, true);
  assert.equal(result.ensuredPage, null);
  assert.equal(result.published, null);
  assert.equal(result.draft.CompanyName, null);
  assert.equal(result.draft.websiteUrl, null);
  assert.equal(result.draft.workflow?.checkpointId, "composition:menu-kolacje");
  assert.equal(result.draft.workflow?.resumeStage, "awaiting_block_refinement");
  assert.deepEqual(result.draft.workflow?.retryBudget, {
    maxAttempts: 2,
    remainingAttempts: 1,
  });
  assert.deepEqual(result.draft.workflow?.pendingBlockRefinementRequest, {
    blockKey: "menu_two_columns_with_with_heading_no_img",
    sourceBlockId: "menu_two_columns_with_with_heading_no_img-01",
    reason: "missing",
  });
  assert.equal(compiledAiSchema?.postId, null);
  assert.equal(compiledRenderSchema?.sections?.[1]?.source?.sourceValue, "kolacje");
});

test("Workflow 2 auto-runs refinement, refreshes readiness, resumes composition, and reuses runtime publish path", async () => {
  const persistedStages: string[] = [];
  const baseStore = createInMemoryFirebasePageDraftStore();
  const draftStore = {
    async saveDraft(...args: Parameters<typeof baseStore.saveDraft>) {
      return baseStore.saveDraft(...args);
    },
    async loadDraft(...args: Parameters<typeof baseStore.loadDraft>) {
      return baseStore.loadDraft(...args);
    },
    async upsertDraft(...args: Parameters<typeof baseStore.upsertDraft>) {
      persistedStages.push(args[0].workflow?.resumeStage ?? "idle");
      return baseStore.upsertDraft(...args);
    },
  };

  let currentLifecycle: "refining" | "ready" = "refining";
  let runtimeCalls = 0;

  const result = await runPageCompositionWorkflow({
    draft: createBaseDraft(),
    approvedSourceMappings: {
      "menu_two_columns_with_with_heading_no_img-01": {
        sourceType: "woo_category",
        sourceValue: "kolacje",
        options: {
          splitIntoColumns: 2,
        },
      },
    },
    draftStore,
    dryRun: true,
    getBlockReadiness(blockKey) {
      if (blockKey !== "menu_two_columns_with_with_heading_no_img") {
        return {
          lifecycle: "ready",
          capabilities: {
            reactRuntime: { available: true, path: "zip/src/components/sections/Fallback.tsx" },
            astroRenderer: { available: true, path: "astro-site/src/components/Fallback.astro" },
            aiDescriptor: { available: true, path: "zip/src/blocks/registry/ai/descriptors.cjs" },
            docs: { available: true, path: "docs/block-registry/fallback.md" },
            tests: { available: true, path: "zip/src/blocks/registry/registry-invariants.test.tsx" },
          },
        };
      }

      return {
        lifecycle: currentLifecycle,
        capabilities: {
          reactRuntime: {
            available: true,
            path: "zip/src/components/sections/MenuTwoColumnsWithWithHeadingNoImg.tsx",
          },
          astroRenderer: currentLifecycle === "ready"
            ? {
                available: true,
                path: "astro-site/src/components/MenuTwoColumnsWithWithHeadingNoImg.astro",
              }
            : {
                available: false,
              },
          aiDescriptor: { available: true, path: "zip/src/blocks/registry/ai/descriptors.cjs" },
          docs: { available: true, path: "docs/block-registry/menu_two_columns_with_with_heading_no_img.md" },
          tests: { available: true, path: "zip/src/blocks/registry/registry-invariants.test.tsx" },
        },
      };
    },
    runBlockRefinementWorkflow(request) {
      assert.equal(request.blockKey, "menu_two_columns_with_with_heading_no_img");
      assert.equal(request.targetStatus, "ready");

      return {
        ...request,
        readinessOutcome: "ready",
        blockers: [],
        sharedReadiness: {
          lifecycle: "ready",
          capabilities: {
            reactRuntime: { available: true, path: request.sourceComponent },
            astroRenderer: { available: true, path: "astro-site/src/components/MenuTwoColumnsWithWithHeadingNoImg.astro" },
            aiDescriptor: { available: true, path: "zip/src/blocks/registry/ai/descriptors.cjs" },
            docs: { available: true, path: "docs/block-registry/menu_two_columns_with_with_heading_no_img.md" },
            tests: { available: true, path: "zip/src/blocks/registry/registry-invariants.test.tsx" },
          },
        },
        artifactSummary: {
          requiredArtifacts: [
            "businessBlock",
            "designReference",
            "reactRuntime",
            "astroRenderer",
            "aiDescriptor",
            "docs",
            "tests",
          ],
          availableArtifacts: [
            "businessBlock",
            "designReference",
            "reactRuntime",
            "astroRenderer",
            "aiDescriptor",
            "docs",
            "tests",
          ],
          missingArtifacts: [],
          artifacts: {
            businessBlock: {
              label: "Reusable business block",
              available: true,
              path: request.sourceComponent,
            },
            designReference: {
              label: "Design reference",
              available: true,
              path: request.designReference,
            },
            reactRuntime: {
              label: "React runtime",
              available: true,
              path: request.sourceComponent,
            },
            astroRenderer: {
              label: "Astro renderer",
              available: true,
              path: "astro-site/src/components/MenuTwoColumnsWithWithHeadingNoImg.astro",
            },
            aiDescriptor: {
              label: "AI descriptor",
              available: true,
              path: "zip/src/blocks/registry/ai/descriptors.cjs",
            },
            docs: {
              label: "Docs",
              available: true,
              path: "docs/block-registry/menu_two_columns_with_with_heading_no_img.md",
            },
            tests: {
              label: "Tests",
              available: true,
              path: "zip/src/blocks/registry/registry-invariants.test.tsx",
            },
          },
        },
      };
    },
    async refreshRegistry() {
      currentLifecycle = "ready";
    },
    async runRuntimeWorkflow(input) {
      runtimeCalls += 1;
      assert.equal(input.draft.workflow?.checkpointId, null);
      assert.equal(input.draft.workflow?.resumeStage, "idle");
      assert.equal(input.draft.workflow?.pendingBlockRefinementRequest, null);

      return {
        draft: input.draft,
        ensuredPage: null,
        compiled: input.draft.compiled,
        compileMeta: {
          appliedSourceBlockIds: ["menu_two_columns_with_with_heading_no_img-01"],
          ignoredSourceBlockIds: [],
          usedCurrentPageBuilderSchema: false,
          usedCurrentPageBuilderSchemaForAi: false,
        },
        published: null,
        readback: null,
        dryRun: true,
      };
    },
  });

  assert.equal(result.status, "completed");
  assert.equal(runtimeCalls, 1);
  assert.equal(result.subflowAttempts.length, 1);
  assert.equal(result.subflowAttempts[0]?.result.readinessOutcome, "ready");
  assert.equal(result.subflowAttempts[0]?.refreshedReadiness?.lifecycle, "ready");
  assert.ok(persistedStages.includes("awaiting_block_refinement"));
  assert.ok(persistedStages.includes("resume_page_composition"));
  assert.ok(persistedStages.includes("idle"));
});

test("Workflow 2 fails closed and stores blocked checkpoint state when refinement cannot make a block ready", async () => {
  const persistedStages: string[] = [];
  const baseStore = createInMemoryFirebasePageDraftStore();
  const draftStore = {
    async saveDraft(...args: Parameters<typeof baseStore.saveDraft>) {
      return baseStore.saveDraft(...args);
    },
    async loadDraft(...args: Parameters<typeof baseStore.loadDraft>) {
      return baseStore.loadDraft(...args);
    },
    async upsertDraft(...args: Parameters<typeof baseStore.upsertDraft>) {
      persistedStages.push(args[0].workflow?.resumeStage ?? "idle");
      return baseStore.upsertDraft(...args);
    },
  };

  let runtimeCalls = 0;

  const result = await runPageCompositionWorkflow({
    draft: parseFirebasePageDraft({
      ...createBaseDraft(),
      blocks: {
        ...createBaseDraft().blocks,
        "menu_two_columns_with_with_heading_no_img-01": {
          ...createBaseDraft().blocks["menu_two_columns_with_with_heading_no_img-01"],
          blockKey: "missing_business_block",
        },
      },
    }),
    draftStore,
    dryRun: true,
    getBlockReadiness(blockKey) {
      if (blockKey === "missing_business_block") {
        return null;
      }

      return {
        lifecycle: "ready",
        capabilities: {
          reactRuntime: { available: true, path: "zip/src/components/sections/Fallback.tsx" },
          astroRenderer: { available: true, path: "astro-site/src/components/Fallback.astro" },
          aiDescriptor: { available: true, path: "zip/src/blocks/registry/ai/descriptors.cjs" },
          docs: { available: true, path: "docs/block-registry/fallback.md" },
          tests: { available: true, path: "zip/src/blocks/registry/registry-invariants.test.tsx" },
        },
      };
    },
    runBlockRefinementWorkflow(request) {
      return {
        ...request,
        readinessOutcome: "blocked",
        blockers: ["Workflow 1 requires sourceComponent before refinement can start."],
        sharedReadiness: {
          lifecycle: "draft",
          capabilities: {
            reactRuntime: { available: false },
            astroRenderer: { available: false },
            aiDescriptor: { available: false },
            docs: { available: false },
            tests: { available: false },
          },
        },
        artifactSummary: {
          requiredArtifacts: [
            "businessBlock",
            "designReference",
            "reactRuntime",
            "astroRenderer",
            "aiDescriptor",
            "docs",
            "tests",
          ],
          availableArtifacts: [],
          missingArtifacts: [
            "businessBlock",
            "designReference",
            "reactRuntime",
            "astroRenderer",
            "aiDescriptor",
            "docs",
            "tests",
          ],
          artifacts: {
            businessBlock: { label: "Reusable business block", available: false },
            designReference: { label: "Design reference", available: false },
            reactRuntime: { label: "React runtime", available: false },
            astroRenderer: { label: "Astro renderer", available: false },
            aiDescriptor: { label: "AI descriptor", available: false },
            docs: { label: "Docs", available: false },
            tests: { label: "Tests", available: false },
          },
        },
      };
    },
    async runRuntimeWorkflow() {
      runtimeCalls += 1;
      throw new Error("runtime should not be called after blocked refinement");
    },
  });

  assert.equal(result.status, "blocked");
  assert.equal(runtimeCalls, 0);
  assert.equal(result.blocked?.blockKey, "missing_business_block");
  assert.equal(result.blocked?.reason, "missing");
  assert.equal(result.draft.workflow?.checkpointId, "composition:menu-kolacje:menu_two_columns_with_with_heading_no_img-01");
  assert.equal(result.draft.workflow?.resumeStage, "blocked");
  assert.deepEqual(result.draft.workflow?.retryBudget, {
    maxAttempts: 1,
    remainingAttempts: 0,
  });
  assert.deepEqual(result.draft.workflow?.pendingBlockRefinementRequest, {
    blockKey: "missing_business_block",
    sourceBlockId: "menu_two_columns_with_with_heading_no_img-01",
    reason: "missing",
  });
  assert.ok(persistedStages.includes("awaiting_block_refinement"));
  assert.ok(persistedStages.includes("blocked"));
});