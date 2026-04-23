import assert from "node:assert/strict";
import test from "node:test";

import {
  blockRefinementWorkflowRequestFields,
  blockRefinementWorkflowRequiredArtifacts,
  emitMachineRegistryManifest,
  runBlockRefinementWorkflow,
} from "./index";

test("Workflow 1 returns ready when the shared readiness gate is already satisfied", () => {
  const result = runBlockRefinementWorkflow({
    blockKey: "about-1",
    sourceComponent: "zip/src/components/sections/AboutSection.tsx",
    designReference: "zip/src/pages/TemplatePage.tsx",
    targetStatus: "ready",
  });

  assert.equal(result.readinessOutcome, "ready");
  assert.deepEqual(result.artifactSummary.requiredArtifacts, blockRefinementWorkflowRequiredArtifacts);
  assert.deepEqual(result.artifactSummary.missingArtifacts, []);
  assert.deepEqual(result.artifactSummary.availableArtifacts, blockRefinementWorkflowRequiredArtifacts);
  assert.equal(result.sharedReadiness.lifecycle, "ready");
  assert.equal(result.artifactSummary.artifacts.astroRenderer.available, true);
  assert.equal(
    result.artifactSummary.artifacts.astroRenderer.path,
    "astro-site/src/components/AboutSection.astro",
  );
});

test("Workflow 1 stays refining until every ready artifact exists", () => {
  const result = runBlockRefinementWorkflow({
    blockKey: "simple_heading_and_paragraph",
    sourceComponent: "zip/src/components/sections/SimpleHeadingAndParagraph.tsx",
    designReference: "zip/src/pages/TemplatePage.tsx",
    targetStatus: "ready",
  });

  assert.equal(result.readinessOutcome, "refining");
  assert.equal(result.sharedReadiness.lifecycle, "refining");
  assert.ok(result.artifactSummary.missingArtifacts.includes("astroRenderer"));
  assert.equal(result.artifactSummary.artifacts.businessBlock.available, true);
  assert.deepEqual(result.blockers, []);
});

test("Workflow 1 blocks refinement requests that do not declare the minimum contract", () => {
  const result = runBlockRefinementWorkflow({
    blockKey: "promo2",
    sourceComponent: "",
    designReference: "",
    targetStatus: "draft",
  });

  assert.equal(result.readinessOutcome, "blocked");
  assert.ok(result.blockers.some((entry) => entry.includes("sourceComponent")));
  assert.ok(result.blockers.some((entry) => entry.includes("designReference")));
  assert.ok(result.blockers.some((entry) => entry.includes("targetStatus")));
});

test("Workflow 1 machine manifest exposes the shared refinement contract", () => {
  const manifest = emitMachineRegistryManifest();

  assert.deepEqual(manifest.readiness.workflow1.requestFields, blockRefinementWorkflowRequestFields);
  assert.deepEqual(manifest.readiness.workflow1.readinessOutcomes, ["ready", "blocked", "refining"]);
  assert.deepEqual(
    manifest.readiness.workflow1.requiredArtifactsForReady,
    blockRefinementWorkflowRequiredArtifacts,
  );
});