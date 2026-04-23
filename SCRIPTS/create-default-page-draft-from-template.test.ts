import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  createDefaultPageDraftFromTemplate,
  runCreateDefaultPageDraftFromTemplateCli,
} from "./create-default-page-draft-from-template.ts";
import { parseFirebasePageDraft } from "../zip/src/blocks/registry/firebasePageDraft.ts";

const createTemplateDraft = () =>
  parseFirebasePageDraft({
    pageSlug: "testowa-blueprint",
    pageKind: "generic_page",
    wordpressPostId: 118,
    CompanyName: "Bulwar Restauracja",
    websiteUrl: "https://bulwarrestauracja.pl/",
    title: "Testowa Blueprint",
    templateKey: "blueprint-test-page",
    status: "published",
    sourcePath: "docs/source.md",
    sourceUrl: "https://example.com/source",
    seo: {
      title: "Old title",
    },
    blocksOrder: ["about-1-01", "menu-category-photo-parallax-full-width-01"],
    blocks: {
      "about-1-01": {
        id: "about-1-01",
        blockKey: "about-1",
        blockVersion: 1,
        variant: null,
        enabled: true,
        data: {
          title: "O restauracji",
        },
        source: null,
        meta: {},
      },
      "menu-category-photo-parallax-full-width-01": {
        id: "menu-category-photo-parallax-full-width-01",
        blockKey: "menu-category-photo-parallax-full-width",
        blockVersion: 1,
        variant: null,
        enabled: true,
        data: {
          heroTitle: "Zestawy specjalne",
        },
        source: {
          sourceType: "woo_category",
          sourceValue: "zestawy-specjalne",
          options: {
            splitIntoColumns: 2,
          },
        },
        meta: {},
      },
    },
    compiled: {
      page_builder_schema: { version: 1 },
      page_builder_schema_for_ai: { version: 1 },
    },
    workflow: {
      checkpointId: "composition:stale-template-state",
      resumeStage: "refinement_failed",
      retryBudget: {
        maxAttempts: 3,
        remainingAttempts: 0,
      },
      pendingBlockRefinementRequest: {
        blockKey: "about-1",
        sourceBlockId: "about-1-01",
        reason: "missing",
      },
    },
    needsCompile: false,
    needsPublish: true,
    needsDeploy: true,
  });

test("createDefaultPageDraftFromTemplate resets runtime state and keeps default blocks", () => {
  const result = createDefaultPageDraftFromTemplate({
    templateDraft: createTemplateDraft(),
    slug: "kolacje-firmowe",
    title: null,
  });

  assert.equal(result.draft.pageSlug, "kolacje-firmowe");
  assert.equal(result.draft.title, "Kolacje Firmowe");
  assert.equal(result.draft.status, "draft");
  assert.equal(result.draft.wordpressPostId, null);
  assert.equal(result.draft.CompanyName, null);
  assert.equal(result.draft.websiteUrl, null);
  assert.equal(result.draft.needsCompile, true);
  assert.equal(result.draft.needsPublish, false);
  assert.equal(result.draft.needsDeploy, false);
  assert.equal(result.draft.compiled.page_builder_schema, null);
  assert.equal(result.draft.compiled.page_builder_schema_for_ai, null);
  assert.equal(result.draft.sourcePath, undefined);
  assert.equal(result.draft.sourceUrl, undefined);
  assert.equal(result.draft.seo, undefined);
  assert.equal(result.draft.workflow?.checkpointId, null);
  assert.equal(result.draft.workflow?.resumeStage, "idle");
  assert.deepEqual(result.draft.workflow?.retryBudget, {
    maxAttempts: 0,
    remainingAttempts: 0,
  });
  assert.equal(result.draft.workflow?.pendingBlockRefinementRequest, null);
  assert.deepEqual(result.draft.blocksOrder, ["about-1-01", "menu-category-photo-parallax-full-width-01"]);
  assert.deepEqual(result.sourceMappings, {
    "menu-category-photo-parallax-full-width-01": {
      sourceType: "woo_category",
      sourceValue: "zestawy-specjalne",
      options: {
        splitIntoColumns: 2,
      },
    },
  });
});

test("runCreateDefaultPageDraftFromTemplateCli writes draft and source mapping files", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "bulwar-default-draft-"));
  const templatePath = path.join(tempDir, "template.firebase-draft.json");
  const outputDraftPath = path.join(tempDir, "kolacje-firmowe.firebase-draft.json");
  const outputMappingsPath = path.join(tempDir, "kolacje-firmowe-source-mappings.json");

  fs.writeFileSync(templatePath, `${JSON.stringify(createTemplateDraft(), null, 2)}\n`, "utf8");

  const result = runCreateDefaultPageDraftFromTemplateCli([
    "--slug",
    "kolacje-firmowe",
    "--template-draft",
    templatePath,
    "--output-draft",
    outputDraftPath,
    "--output-source-mappings",
    outputMappingsPath,
  ]);

  assert.equal(result.draft.pageSlug, "kolacje-firmowe");
  assert.ok(fs.existsSync(outputDraftPath));
  assert.ok(fs.existsSync(outputMappingsPath));

  const writtenDraft = JSON.parse(fs.readFileSync(outputDraftPath, "utf8")) as { pageSlug: string };
  const writtenMappings = JSON.parse(fs.readFileSync(outputMappingsPath, "utf8")) as Record<string, unknown>;

  assert.equal(writtenDraft.pageSlug, "kolacje-firmowe");
  assert.equal((writtenDraft as { CompanyName?: unknown }).CompanyName, null);
  assert.equal((writtenDraft as { websiteUrl?: unknown }).websiteUrl, null);
  assert.ok("menu-category-photo-parallax-full-width-01" in writtenMappings);
});