import type { ReactNode } from "react";

import registryMachine from "../../../docs/block-registry/registry.machine.json";
import {
  createDefaultBlockInstance,
  getBlock,
  type RegisteredBlockKey,
} from "../blocks/registry";
import { parsePageBuilderSchema } from "../blocks/registry/pageBuilderSchema";
import { renderPageBuilderSections } from "../blocks/registry/renderPageBuilderSections";

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

const template3BlockKeys = Object.entries((registryMachine as MachineRegistryManifest).readiness.blocks).flatMap(
  ([blockKey, readiness]) => {
    if (readiness.lifecycle !== "ready" || readiness.capabilities.astroRenderer?.available !== true) {
      return [];
    }

    return getBlock(blockKey) == null ? [] : [blockKey as RegisteredBlockKey];
  },
);

interface Template3Entry {
  blockKey: RegisteredBlockKey;
  label: string;
  renderedPreview: ReactNode | null | undefined;
}

const buildTemplate3Entries = (): Template3Entry[] => {
  const schema = parsePageBuilderSchema({
    version: 1,
    page: {
      slug: "template3",
      title: "Template 3",
      status: "draft",
    },
    sections: template3BlockKeys.map((blockKey, index) =>
      createDefaultBlockInstance(blockKey, index + 1),
    ),
  });

  const renderedSections = renderPageBuilderSections(schema);

  return schema.sections.map((section, index) => {
    const block = getBlock(section.blockKey);

    return {
      blockKey: section.blockKey as RegisteredBlockKey,
      label: block?.name ?? section.blockKey,
      renderedPreview: renderedSections[index] ?? null,
    };
  });
};

const template3Entries = buildTemplate3Entries();

export default function TemplatePage3() {
  return (
    <main className="overflow-hidden bg-white pb-16 md:pb-20">
      <div className="space-y-8 pt-6 md:space-y-10 md:pt-8">
        <section className="page-margin" data-template3-block-count={template3Entries.length}>
          <div className="flex items-center justify-between gap-4 border border-zinc-200 bg-zinc-50 px-4 py-3">
            <p className="font-label text-[10px] uppercase tracking-[0.14em] text-zinc-500">
              Astro-ready blocks
            </p>
            <p className="font-headline text-sm uppercase tracking-[0.12em] text-zinc-900 md:text-base">
              {template3Entries.length}
            </p>
          </div>
        </section>

        {template3Entries.map((entry) => (
          <section key={entry.blockKey} className="space-y-0" data-template3-block-key={entry.blockKey}>
            <div className="page-margin">
              <div className="flex h-[25px] items-center bg-zinc-100 px-3">
                <p className="truncate font-label text-[10px] uppercase tracking-[0.14em] text-zinc-600">
                  {entry.label}
                </p>
              </div>
            </div>

            {entry.renderedPreview != null ? (
              entry.renderedPreview
            ) : (
              <div className="page-margin">
                <div className="border border-dashed border-zinc-300 bg-white p-6 font-body text-sm text-zinc-600">
                  This block did not produce a local preview in the current runtime.
                </div>
              </div>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}