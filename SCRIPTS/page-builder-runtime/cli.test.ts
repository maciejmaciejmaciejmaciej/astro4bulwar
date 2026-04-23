import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { parseEnvFileContents, runPageBuilderRuntimeCli } from "./cli.ts";

const createBaseDraft = () => ({
  pageSlug: "menu-kolacje",
  pageKind: "restaurant_menu",
  title: "Kolacje",
  templateKey: "restaurant-menu",
  status: "draft",
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
      meta: {},
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

test("CLI dry-run from file stays in node-only orchestration and skips live clients", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "bulwar-page-builder-cli-"));
  const draftPath = path.join(tempDir, "draft.json");
  const sourceMappingsPath = path.join(tempDir, "source-mappings.json");
  const outputPath = path.join(tempDir, "result.json");
  let createDraftStoreCalls = 0;
  let createWordPressClientCalls = 0;
  let workflowInput: Record<string, unknown> | null = null;

  fs.writeFileSync(draftPath, `${JSON.stringify(createBaseDraft(), null, 2)}\n`, "utf8");
  fs.writeFileSync(
    sourceMappingsPath,
    `${JSON.stringify({
      "menu_two_columns_with_with_heading_no_img-01": {
        sourceType: "woo_category",
        sourceValue: "kolacje",
      },
    }, null, 2)}\n`,
    "utf8",
  );

  const output = await runPageBuilderRuntimeCli(
    [
      "--draft-file",
      draftPath,
      "--source-mappings",
      sourceMappingsPath,
      "--dry-run",
      "--output",
      outputPath,
    ],
    {
      env: {},
      async createDraftStore() {
        createDraftStoreCalls += 1;
        throw new Error("should not be called");
      },
      createWordPressClient() {
        createWordPressClientCalls += 1;
        throw new Error("should not be called");
      },
      async runWorkflow(input) {
        workflowInput = input as Record<string, unknown>;
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
    },
  );

  assert.equal(createDraftStoreCalls, 0);
  assert.equal(createWordPressClientCalls, 0);
  assert.equal(output.mode, "dry-run");
  assert.equal(workflowInput?.dryRun, true);
  assert.deepEqual(workflowInput?.approvedSourceMappings, {
    "menu_two_columns_with_with_heading_no_img-01": {
      sourceType: "woo_category",
      sourceValue: "kolacje",
    },
  });
  assert.ok(fs.existsSync(outputPath));
});

test("CLI requires Firestore env when loading a draft document id", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "bulwar-page-builder-cli-empty-env-"));
  const envPath = path.join(tempDir, ".env.page-builder.local");

  fs.writeFileSync(envPath, "", "utf8");

  await assert.rejects(
    () => runPageBuilderRuntimeCli(["--draft-doc-id", "menu-kolacje", "--env-file", envPath], { env: {} }),
    /PAGE_BUILDER_FIREBASE_PROJECT_ID/,
  );
});

test("parseEnvFileContents decodes quoted values and multiline private keys", () => {
  const parsed = parseEnvFileContents([
    'PAGE_BUILDER_WORDPRESS_BASE_URL="https://example-client.pl"',
    'PAGE_BUILDER_FIREBASE_PRIVATE_KEY="line-1\\nline-2"',
    '# comment',
    '',
  ].join("\n"));

  assert.equal(parsed.PAGE_BUILDER_WORDPRESS_BASE_URL, "https://example-client.pl");
  assert.equal(parsed.PAGE_BUILDER_FIREBASE_PRIVATE_KEY, "line-1\nline-2");
});

test("CLI publish can load envs from an explicit env file instead of manual terminal exports", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "bulwar-page-builder-cli-env-"));
  const draftPath = path.join(tempDir, "draft.json");
  const envPath = path.join(tempDir, ".env.page-builder.local");
  let createDraftStoreCalls = 0;
  let createWordPressClientCalls = 0;

  fs.writeFileSync(draftPath, `${JSON.stringify(createBaseDraft(), null, 2)}\n`, "utf8");
  fs.writeFileSync(
    envPath,
    [
      'PAGE_BUILDER_WORDPRESS_BASE_URL="https://example-client.pl"',
      'PAGE_BUILDER_WORDPRESS_USERNAME="agent"',
      'PAGE_BUILDER_WORDPRESS_APPLICATION_PASSWORD="secret"',
      'PAGE_BUILDER_FIREBASE_PROJECT_ID="bulwar-test"',
      'PAGE_BUILDER_FIREBASE_CLIENT_EMAIL="agent@example.test"',
      'PAGE_BUILDER_FIREBASE_PRIVATE_KEY="line-1\\nline-2"',
    ].join("\n"),
    "utf8",
  );

  const output = await runPageBuilderRuntimeCli(
    [
      "--draft-file",
      draftPath,
      "--env-file",
      envPath,
    ],
    {
      env: {},
      async createDraftStore() {
        createDraftStoreCalls += 1;

        return {
          async loadDraft() {
            return null;
          },
          async saveDraft(draft) {
            return {
              draft,
              collectionName: "pageBuilderDrafts",
              docId: draft.pageSlug,
            };
          },
          async upsertDraft(draft) {
            return {
              draft,
              collectionName: "pageBuilderDrafts",
              docId: draft.pageSlug,
            };
          },
        };
      },
      createWordPressClient() {
        createWordPressClientCalls += 1;

        return {
          async fetchSiteContext() {
            return {
              CompanyName: "Bulwar",
              websiteUrl: "https://bulwarrestauracja.pl",
            };
          },
          async ensurePageExists(input) {
            return {
              id: 321,
              slug: input.slug,
              title: input.title,
              status: input.status,
            };
          },
          async publishPageBuilderPayloads(input) {
            return {
              pageId: 321,
              schema: input.schema,
              aiSchema: input.aiSchema,
            };
          },
          async readPageBuilderPayloads() {
            throw new Error("readback should not be called");
          },
        };
      },
      async runWorkflow(input) {
        return {
          draft: input.draft,
          ensuredPage: null,
          compiled: input.draft.compiled,
          compileMeta: {
            appliedSourceBlockIds: [],
            ignoredSourceBlockIds: [],
            usedCurrentPageBuilderSchema: false,
            usedCurrentPageBuilderSchemaForAi: false,
          },
          published: null,
          readback: null,
          dryRun: false,
        };
      },
    },
  );

  assert.equal(output.mode, "publish");
  assert.equal(createDraftStoreCalls, 1);
  assert.equal(createWordPressClientCalls, 1);
});

test("CLI compose mode passes refinement overrides into Workflow 2 without touching live clients during dry-run", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "bulwar-page-builder-cli-compose-"));
  const draftPath = path.join(tempDir, "draft.json");
  const refinementOverridesPath = path.join(tempDir, "refinement-overrides.json");
  const outputPath = path.join(tempDir, "result.json");
  let createDraftStoreCalls = 0;
  let createWordPressClientCalls = 0;
  let compositionInput: Record<string, unknown> | null = null;

  fs.writeFileSync(draftPath, `${JSON.stringify(createBaseDraft(), null, 2)}\n`, "utf8");
  fs.writeFileSync(
    refinementOverridesPath,
    `${JSON.stringify({
      menu_two_columns_with_with_heading_no_img: {
        sourceComponent: "zip/src/components/sections/MenuTwoColumnsWithWithHeadingNoImg.tsx",
        designReference: "zip/src/pages/TemplatePage.tsx",
        targetStatus: "ready",
      },
    }, null, 2)}\n`,
    "utf8",
  );

  const output = await runPageBuilderRuntimeCli(
    [
      "--draft-file",
      draftPath,
      "--compose",
      "--refinement-overrides",
      refinementOverridesPath,
      "--dry-run",
      "--output",
      outputPath,
    ],
    {
      env: {},
      async createDraftStore() {
        createDraftStoreCalls += 1;
        throw new Error("should not be called");
      },
      createWordPressClient() {
        createWordPressClientCalls += 1;
        throw new Error("should not be called");
      },
      async runCompositionWorkflow(input) {
        compositionInput = input as Record<string, unknown>;

        return {
          status: "blocked",
          draft: input.draft,
          runtimeResult: null,
          blocked: {
            blockId: "menu_two_columns_with_with_heading_no_img-01",
            blockKey: "menu_two_columns_with_with_heading_no_img",
            reason: "not_ready",
            blockers: ["Astro renderer is not ready yet."],
          },
          subflowAttempts: [],
        };
      },
    },
  );

  assert.equal(output.mode, "dry-run");
  assert.equal(output.workflow, "composition");
  assert.equal(createDraftStoreCalls, 0);
  assert.equal(createWordPressClientCalls, 0);
  assert.equal(compositionInput?.dryRun, true);
  assert.deepEqual(compositionInput?.refinementRequestOverrides, {
    menu_two_columns_with_with_heading_no_img: {
      sourceComponent: "zip/src/components/sections/MenuTwoColumnsWithWithHeadingNoImg.tsx",
      designReference: "zip/src/pages/TemplatePage.tsx",
      targetStatus: "ready",
    },
  });
  assert.ok(fs.existsSync(outputPath));
});