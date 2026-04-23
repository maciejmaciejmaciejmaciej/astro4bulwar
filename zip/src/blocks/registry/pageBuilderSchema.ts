import { z } from "zod";

import { getBlock, validateBlockData, validateBlockSource } from "./index";
import type { PageBuilderSectionInstance } from "./types";

export const pageBuilderSectionSchema = z.object({
  id: z.string().min(1),
  blockKey: z.string().min(1),
  blockVersion: z.number().int().positive(),
  variant: z.string().nullable().default(null),
  enabled: z.boolean(),
  data: z.unknown(),
  source: z.unknown().nullable().default(null),
  meta: z.record(z.string(), z.unknown()).default({}),
});

export const pageBuilderSchemaBaseSchema = z.object({
  version: z.number().int().positive(),
  page: z.object({
    slug: z.string().min(1),
    title: z.string().min(1),
    status: z.enum(["draft", "published", "archived"]),
    templateKey: z.string().min(1).optional(),
    locale: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
  }),
  sections: z.array(pageBuilderSectionSchema),
  seo: z.record(z.string(), z.unknown()).optional(),
  build: z.record(z.string(), z.unknown()).optional(),
  meta: z.record(z.string(), z.unknown()).optional(),
});

type PageBuilderSchemaBase = z.infer<typeof pageBuilderSchemaBaseSchema>;

export interface PageBuilderSchema extends Omit<PageBuilderSchemaBase, "sections"> {
  sections: PageBuilderSectionInstance[];
}

const ensureUniqueSectionIds = (sections: readonly PageBuilderSectionInstance[]): void => {
  const seenIds = new Set<string>();

  for (const section of sections) {
    if (seenIds.has(section.id)) {
      throw new Error(`Duplicate section id: ${section.id}`);
    }

    seenIds.add(section.id);
  }
};

const validateSectionVariant = (
  blockKey: string,
  variant: string | null,
): string | null => {
  if (variant == null) {
    return null;
  }

  const block = getBlock(blockKey);

  if (!block) {
    throw new Error(`Unknown block key: ${blockKey}`);
  }

  if (!block.variants || block.variants.length === 0) {
    return variant;
  }

  if (!block.variants.includes(variant)) {
    throw new Error(
      `Unsupported variant \"${variant}\" for block ${blockKey}. Expected one of: ${block.variants.join(", ")}.`,
    );
  }

  return variant;
};

export const parsePageBuilderSchema = (value: unknown): PageBuilderSchema => {
  const parsed = pageBuilderSchemaBaseSchema.parse(value);
  const parsedSections: PageBuilderSectionInstance[] = parsed.sections.map((section) => ({
    ...section,
    variant: section.variant ?? null,
    source: section.source ?? null,
    meta: section.meta ?? {},
  }));

  ensureUniqueSectionIds(parsedSections);

  const validatedSections: PageBuilderSectionInstance[] = parsedSections.map((section) => {
    const block = getBlock(section.blockKey);

    if (!block) {
      throw new Error(`Unknown block key: ${section.blockKey}`);
    }

    if (block.version !== section.blockVersion) {
      throw new Error(
        `Block version mismatch for ${section.blockKey}. Expected ${block.version}, received ${section.blockVersion}.`,
      );
    }

    return {
      ...section,
      variant: validateSectionVariant(section.blockKey, section.variant),
      data: validateBlockData(section.blockKey, section.data),
      source: section.source == null ? null : validateBlockSource(section.blockKey, section.source),
    };
  });

  return {
    ...parsed,
    sections: validatedSections,
  };
};
