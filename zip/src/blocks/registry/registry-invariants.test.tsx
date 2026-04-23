import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";

import {
  assertBlockReady,
  blockRefinementWorkflowRequestFields,
  blockRefinementWorkflowRequiredArtifacts,
  blockRegistry,
  createDefaultBlockInstance,
  emitMachineRegistryManifest,
  getBlockReadiness,
  listBlocks,
  listBlocksWithReadiness,
  validateBlockData,
} from "./index";
import {
  listAstroRendererBlockKeys,
  resolveAstroRenderer,
} from "../../../../astro-site/src/lib/astroRegistry.ts";
import { parsePageBuilderSchema } from "./pageBuilderSchema";
import { renderPageBuilderSections } from "./renderPageBuilderSections";

const require = createRequire(import.meta.url);
const registryDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(registryDir, "../../../../");
const aiSchemaScriptPath = path.join(repoRoot, "SCRIPTS", "generate-page-builder-ai-schema.js");

test("every registered block supports the core page-builder workflow invariants", () => {
  const registeredBlockKeys = Object.keys(blockRegistry) as Array<keyof typeof blockRegistry>;

  assert.ok(registeredBlockKeys.length > 0);
  assert.deepEqual(
    listBlocks().map((block) => block.blockKey).sort(),
    [...registeredBlockKeys].sort(),
  );

  for (const [index, blockKey] of registeredBlockKeys.entries()) {
    const block = blockRegistry[blockKey];
    const parsedDefaultData = block.schema.parse(block.defaultData);
    const instance = createDefaultBlockInstance(blockKey, index + 1);
    const validatedData = validateBlockData(block.blockKey, instance.data);
    const parsedPageSchema = parsePageBuilderSchema({
      version: 1,
      page: {
        slug: `registry-invariant-${block.blockKey}`,
        title: `Registry invariant ${block.name}`,
        status: "draft",
      },
      sections: [instance],
    });

    assert.deepEqual(parsedDefaultData, block.defaultData);
    assert.equal(instance.blockKey, block.blockKey);
    assert.equal(instance.blockVersion, block.version);
    assert.deepEqual(validatedData, parsedDefaultData);
    assert.deepEqual(parsedPageSchema.sections[0]?.data, parsedDefaultData);

    if (block.runtime?.renderSection) {
      const renderedSection = renderPageBuilderSections(parsedPageSchema)[0];

      assert.notEqual(renderedSection, null);
      assert.notEqual(renderedSection, undefined);
      assert.equal(
        typeof renderToStaticMarkup(<MemoryRouter>{renderedSection}</MemoryRouter>),
        "string",
      );
    }
  }
});

test("shared registry readiness contract exposes one gate with machine-manifest parity", () => {
  const sortBlockKeys = (values: string[]): string[] => values.sort((left, right) => left.localeCompare(right));
  const machineRegistry = JSON.parse(
    readFileSync(path.join(repoRoot, "docs", "block-registry", "registry.machine.json"), "utf8"),
  ) as {
    readiness: {
      lifecycle: string[];
      requiredCapabilitiesForReady: string[];
      workflow1: {
        requestFields: string[];
        supportedTargetStatuses: string[];
        readinessOutcomes: string[];
        requiredArtifactsForReady: string[];
        designSystemReferences: string[];
      };
      blocks: Record<string, {
        lifecycle: string;
        capabilities: Record<string, {
          available: boolean;
          path?: string;
          notes?: string;
        }>;
      }>;
    };
  };
  const emittedManifest = emitMachineRegistryManifest();
  const readinessList = listBlocksWithReadiness();
  const machineReadinessEntries = Object.entries(machineRegistry.readiness.blocks);

  assert.deepEqual(machineRegistry.readiness.lifecycle, ["draft", "refining", "ready", "blocked"]);
  assert.deepEqual(machineRegistry.readiness.requiredCapabilitiesForReady, [
    "reactRuntime",
    "astroRenderer",
    "aiDescriptor",
    "docs",
    "tests",
  ]);
  assert.deepEqual(machineRegistry.readiness.workflow1.requestFields, blockRefinementWorkflowRequestFields);
  assert.deepEqual(machineRegistry.readiness.workflow1.supportedTargetStatuses, ["ready"]);
  assert.deepEqual(machineRegistry.readiness.workflow1.readinessOutcomes, ["ready", "blocked", "refining"]);
  assert.deepEqual(
    machineRegistry.readiness.workflow1.requiredArtifactsForReady,
    blockRefinementWorkflowRequiredArtifacts,
  );
  assert.deepEqual(machineRegistry.readiness.workflow1, emittedManifest.readiness.workflow1);
  assert.equal(readinessList.length, listBlocks().length);
  assert.deepEqual(
    sortBlockKeys(readinessList.map((block) => block.blockKey)),
    sortBlockKeys(machineReadinessEntries.map(([blockKey]) => blockKey)),
  );

  for (const block of readinessList) {
    const readiness = getBlockReadiness(block.blockKey);
    const machineReadiness = machineRegistry.readiness.blocks[block.blockKey];

    assert.ok(machineReadiness, `Missing machine readiness entry for ${block.blockKey}`);
    assert.equal(readiness.lifecycle, block.readiness.lifecycle);
    assert.deepEqual(readiness, block.readiness);
    assert.deepEqual(readiness, machineReadiness);

    if (readiness.lifecycle === "ready") {
      assert.doesNotThrow(() => assertBlockReady(block.blockKey));

      for (const capability of Object.values(readiness.capabilities)) {
        assert.equal(capability.available, true, `${block.blockKey} is ready but misses a required capability.`);
      }
    } else {
      assert.throws(() => assertBlockReady(block.blockKey), /is not ready/i);
    }
  }
});

test("Astro projection parity stays aligned with the shared registry readiness contract", () => {
  const astroReadyBlockKeys = listBlocksWithReadiness()
    .filter((block) => block.readiness.capabilities.astroRenderer.available)
    .map((block) => block.blockKey)
    .sort((left, right) => left.localeCompare(right));

  assert.deepEqual(listAstroRendererBlockKeys(), astroReadyBlockKeys);

  for (const block of listBlocksWithReadiness()) {
    if (block.readiness.capabilities.astroRenderer.available) {
      const renderer = resolveAstroRenderer(block.blockKey);

      assert.equal(renderer.blockKey, block.blockKey);
      assert.equal(renderer.componentPath, block.readiness.capabilities.astroRenderer.path);
      continue;
    }

    assert.throws(
      () => resolveAstroRenderer(block.blockKey),
      /not Astro-ready/i,
    );
  }
});

test("shared AI descriptors live near the registry and preserve source-aware menu guidance", () => {
  const { createAiBlockRegistry } = require("./ai/descriptors.cjs") as {
    createAiBlockRegistry: (helpers: {
      assertObject: (value: unknown, label: string) => Record<string, unknown>;
      getArray: (value: unknown, label: string) => unknown[];
      clone: <T>(value: T) => T;
      getStructuredSource: (section: { source: unknown }) => Record<string, unknown> | null;
    }) => Record<string, {
      contentSource: string | ((section: { source: unknown }) => string);
      editableFields: string[] | ((section: { source: unknown }) => string[]);
      build: (section: { data: unknown; source: unknown; variant: string | null }) => {
        content: Record<string, unknown>;
      };
    }>;
  };
  const sharedRegistry = createAiBlockRegistry({
    assertObject(value, label) {
      assert.equal(typeof label, "string");
      assert.notEqual(label.length, 0);

      if (!value || typeof value !== "object" || Array.isArray(value)) {
        throw new Error(`${label} must be an object.`);
      }

      return value as Record<string, unknown>;
    },
    getArray(value, label) {
      assert.equal(typeof label, "string");
      assert.notEqual(label.length, 0);

      if (!Array.isArray(value)) {
        throw new Error(`${label} must be an array.`);
      }

      return value;
    },
    clone(value) {
      return structuredClone(value);
    },
    getStructuredSource(section) {
      const source = section.source;

      if (!source || typeof source !== "object" || Array.isArray(source)) {
        return null;
      }

      return source as Record<string, unknown>;
    },
  });
  const registeredBlockKeys = new Set(Object.keys(blockRegistry));
  const descriptorKeys = Object.keys(sharedRegistry);

  assert.ok(descriptorKeys.length > 0);

  for (const blockKey of descriptorKeys) {
    assert.ok(registeredBlockKeys.has(blockKey), `Missing registry block for shared descriptor ${blockKey}`);
  }

  const aboutDescriptor = sharedRegistry["about-1"];
  const aboutInstance = createDefaultBlockInstance("about-1", 1) as {
    data: {
      leftText: {
        title: string;
      };
    };
    source: unknown;
    variant: string | null;
  };
  const aboutContent = aboutDescriptor.build(aboutInstance);
  const aboutContentData = aboutContent.content as {
    leftText: {
      title: string;
    };
  };

  assert.equal(Object.prototype.hasOwnProperty.call(aboutDescriptor, "description"), false);
  assert.equal(aboutContentData.leftText.title, aboutInstance.data.leftText.title);

  const menuDescriptor = sharedRegistry["menu_two_columns_with_with_heading_no_img"];
  const menuInstance = createDefaultBlockInstance("menu_two_columns_with_with_heading_no_img", 1) as {
    data: {
      title: string;
      menuColumns: unknown[];
    };
    source: unknown;
    variant: string | null;
  };

  menuInstance.variant = "surface";
  menuInstance.source = {
    sourceType: "woo_category",
    sourceValue: "kolacje",
    options: {
      splitIntoColumns: 2,
    },
  };

  const sourceAwareMenuContent = menuDescriptor.build(menuInstance);
  const sourceAwareMenuDescriptorContentSource = menuDescriptor.contentSource;
  const sourceAwareMenuDescriptorEditableFields = menuDescriptor.editableFields;
  const sourceAwareMenuContentData = sourceAwareMenuContent.content as {
    title: string;
  };

  assert.equal(Object.prototype.hasOwnProperty.call(menuDescriptor, "description"), false);
  if (typeof sourceAwareMenuDescriptorContentSource !== "function") {
    assert.fail("Expected menu descriptor contentSource to be function-based for source-aware blocks.");
  }
  assert.equal(sourceAwareMenuDescriptorContentSource(menuInstance), "woo_category");
  if (typeof sourceAwareMenuDescriptorEditableFields !== "function") {
    assert.fail("Expected menu descriptor editableFields to be function-based for source-aware blocks.");
  }
  assert.ok(sourceAwareMenuDescriptorEditableFields(menuInstance).includes("content.source.sourceValue"));
  assert.equal(sourceAwareMenuContentData.title, menuInstance.data.title);
  assert.equal(Object.prototype.hasOwnProperty.call(sourceAwareMenuContent.content, "menuColumns"), false);

  menuInstance.source = null;
  const contentOnlyMenuContent = menuDescriptor.build(menuInstance);
  const contentOnlyMenuContentData = contentOnlyMenuContent.content as {
    menuColumns: unknown[];
  };

  assert.equal(sourceAwareMenuDescriptorContentSource(menuInstance), "page_schema");
  assert.deepEqual(contentOnlyMenuContentData.menuColumns, menuInstance.data.menuColumns);
});

test("AI schema generator coverage stays aligned with the registered blocks", () => {
  const registeredBlockKeys = Object.keys(blockRegistry) as Array<keyof typeof blockRegistry>;
  const tempDirectory = mkdtempSync(path.join(tmpdir(), "bulwar-page-builder-"));
  const inputPath = path.join(tempDirectory, "page_builder_schema.json");
  const outputPath = path.join(tempDirectory, "page_builder_schema_for_ai.json");

  try {
    writeFileSync(
      inputPath,
      `${JSON.stringify(
        {
          version: 1,
          page: {
            slug: "registry-coverage",
            title: "Registry Coverage",
            status: "draft",
          },
          sections: registeredBlockKeys.map((blockKey, index) =>
            createDefaultBlockInstance(blockKey, index + 1),
          ),
        },
        null,
        2,
      )}\n`,
      "utf8",
    );

    const execution = spawnSync(process.execPath, [aiSchemaScriptPath, "--input", inputPath, "--output", outputPath], {
      cwd: repoRoot,
      encoding: "utf8",
    });

    assert.equal(execution.status, 0, execution.stderr || execution.stdout);

    const aiSchema = JSON.parse(readFileSync(outputPath, "utf8")) as {
      blocks: Array<{
        blockKey: string;
        description: string;
        contentSource: string;
        editableFields: string[];
        editRoute: string;
        doNotEditDirectly: string[];
      }>;
    };

    assert.deepEqual(
      aiSchema.blocks.map((block) => block.blockKey).sort(),
      registeredBlockKeys.map((blockKey) => String(blockKey)).sort(),
    );

    for (const block of aiSchema.blocks) {
      assert.equal(typeof block.description, "string");
      assert.ok(block.description.trim().length > 0);
      assert.equal(typeof block.contentSource, "string");
      assert.ok(block.contentSource.trim().length > 0);
      assert.ok(Array.isArray(block.editableFields));
      assert.ok(block.editableFields.length > 0);
      assert.equal(typeof block.editRoute, "string");
      assert.ok(block.editRoute.trim().length > 0);
      assert.ok(Array.isArray(block.doNotEditDirectly));
    }
  } finally {
    rmSync(tempDirectory, { force: true, recursive: true });
  }
});