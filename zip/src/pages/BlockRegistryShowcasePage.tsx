import type { ReactNode } from "react";

import {
  createDefaultBlockInstance,
  getBlock,
  listBlocks,
  type RegisteredBlockKey,
} from "../blocks/registry";
import { parsePageBuilderSchema } from "../blocks/registry/pageBuilderSchema";
import { renderPageBuilderSections } from "../blocks/registry/renderPageBuilderSections";

export const BLOCK_REGISTRY_SHOWCASE_PATH = "/blocks";

interface BlockRegistryShowcaseEntry {
  blockKey: string;
  blockName: string;
  renderedPreview: ReactNode | null | undefined;
  notes: string[];
}

const buildBlockRegistryShowcaseEntries = (): BlockRegistryShowcaseEntry[] => {
  const schema = parsePageBuilderSchema({
    version: 1,
    page: {
      slug: "block-registry-showcase",
      title: "Block Registry Showcase",
      status: "draft",
    },
    sections: listBlocks().map((block, index) =>
      createDefaultBlockInstance(block.blockKey as RegisteredBlockKey, index + 1),
    ),
  });
  const renderedSections = renderPageBuilderSections(schema);

  return schema.sections.map((section, index) => {
    const block = getBlock(section.blockKey);
    const notes: string[] = [];
    const renderedPreview = renderedSections[index] ?? null;

    if (!block) {
      return {
        blockKey: section.blockKey,
        blockName: section.blockKey,
        renderedPreview: null,
        notes: ["Registry metadata could not be resolved for this block entry."],
      };
    }

    if (block.sourceSchema != null || block.sourceResolver != null) {
      notes.push(
        "Source-backed block. This preview uses registry defaultData with source=null, so resolver-fed content is not exercised here.",
      );
    }

    if (!block.runtime?.renderSection) {
      notes.push(
        "No runtime renderSection is registered for this block, so the current React page-builder pipeline cannot preview it here.",
      );
    } else if (renderedPreview == null) {
      notes.push(
        "The runtime returned no visible preview for the default block instance. This usually means the block needs page-specific content or resolved source data to show a representative result.",
      );
    }

    return {
      blockKey: block.blockKey,
      blockName: block.name,
      renderedPreview,
      notes,
    };
  });
};

const blockRegistryShowcaseEntries = buildBlockRegistryShowcaseEntries();

export default function BlockRegistryShowcasePage() {
  return (
    <main className="overflow-hidden bg-white">
      <section className="page-margin py-10 md:py-14">
        <div className="mx-auto max-w-5xl border border-zinc-200 bg-zinc-50 p-6 md:p-8">
          <p className="font-label text-[10px] uppercase tracking-[0.18em] text-zinc-500">
            Local Diagnostic Only
          </p>
          <h1 className="mt-3 font-headline text-3xl text-on-surface md:text-5xl">
            Block Registry Showcase
          </h1>
          <p className="mt-4 max-w-3xl font-body text-sm leading-6 text-zinc-600 md:text-base">
            This page renders every registered page-builder block through the existing registry schema and React runtime using default block instances. Labels stay visible above each preview so you can inspect the block key and registry name without adding anything to production navigation.
          </p>
          <p className="mt-3 max-w-3xl font-body text-sm leading-6 text-zinc-600 md:text-base">
            Coverage is intentionally honest: source-backed blocks only show their default fallback payload here, and any block that does not produce a useful preview through the current runtime is called out inline instead of being treated as fully represented.
          </p>
        </div>
      </section>

      <div className="space-y-10 pb-16 md:space-y-14 md:pb-20">
        {blockRegistryShowcaseEntries.map((entry) => (
          <section key={entry.blockKey} className="space-y-4">
            <div className="page-margin">
              <div
                className="border border-zinc-200 bg-zinc-50 p-4 md:p-5"
                data-block-showcase-label="true"
                data-block-key={entry.blockKey}
              >
                <p className="font-label text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                  Registry Block
                </p>
                <div className="mt-2 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
                  <h2 className="font-headline text-2xl text-on-surface md:text-3xl">{entry.blockName}</h2>
                  <p className="font-body text-sm text-zinc-600">{entry.blockKey}</p>
                </div>
                <div className="mt-3 space-y-2">
                  {entry.notes.length > 0 ? entry.notes.map((note) => (
                    <p key={note} className="font-body text-sm leading-6 text-zinc-600">
                      {note}
                    </p>
                  )) : (
                    <p className="font-body text-sm leading-6 text-zinc-600">
                      Rendered from registry defaultData without any external source resolution.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {entry.renderedPreview != null ? entry.renderedPreview : (
              <div className="page-margin">
                <div className="border border-dashed border-zinc-300 bg-zinc-50 p-6 font-body text-sm leading-6 text-zinc-600">
                  No preview was produced for this block in the current local runtime.
                </div>
              </div>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}