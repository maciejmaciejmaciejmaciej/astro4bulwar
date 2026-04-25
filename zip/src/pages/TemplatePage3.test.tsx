import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";

import { getBlock, type RegisteredBlockKey } from "../blocks/registry";
import TemplatePage3 from "./TemplatePage3";

interface MachineRegistryManifest {
  readiness: {
    blocks: Record<string, {
      lifecycle: string;
      capabilities: {
        astroRenderer?: {
          available?: boolean;
        };
      };
    }>;
  };
}

test("TemplatePage3 renders every Astro-ready shared block in manifest order", () => {
  const machineRegistry = JSON.parse(
    readFileSync(new URL("../../../docs/block-registry/registry.machine.json", import.meta.url), "utf8"),
  ) as MachineRegistryManifest;
  const expectedBlockKeys = Object.entries(machineRegistry.readiness.blocks).flatMap(([blockKey, readiness]) => {
    if (readiness.lifecycle !== "ready" || readiness.capabilities.astroRenderer?.available !== true) {
      return [];
    }

    return getBlock(blockKey) == null ? [] : [blockKey as RegisteredBlockKey];
  });
  const markup = renderToStaticMarkup(
    <MemoryRouter>
      <TemplatePage3 />
    </MemoryRouter>,
  );

  assert.equal((markup.match(/data-template3-block-key=/g) ?? []).length, expectedBlockKeys.length);
  assert.equal(markup.includes(`data-template3-block-count="${expectedBlockKeys.length}"`), true);

  for (const blockKey of expectedBlockKeys) {
    assert.equal(markup.includes(`data-template3-block-key="${blockKey}"`), true);
  }

  const manifestOrderPattern = new RegExp(
    expectedBlockKeys
      .map((blockKey) => `data-template3-block-key=\"${blockKey.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\"`)
      .join("[\\s\\S]*"),
  );

  assert.match(markup, manifestOrderPattern);
});