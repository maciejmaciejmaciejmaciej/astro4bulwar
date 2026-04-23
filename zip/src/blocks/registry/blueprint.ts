import { z } from "zod";

import { getBlock, validateBlockData, validateBlockSource } from "./index";
import { parsePageBuilderSchema } from "./pageBuilderSchema";
import type { PageBuilderSchema } from "./pageBuilderSchema";

export const pageBlueprintSchema = z.object({
  page: z.object({
    slug: z.string().min(1),
    title: z.string().min(1),
    status: z.enum(["draft", "published", "archived"]),
    templateKey: z.string().min(1).optional(),
    locale: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
  }),
  sections: z.array(z.object({
    block: z.string().min(1),
    id: z.string().min(1).optional(),
    variant: z.string().optional(),
    enabled: z.boolean().optional(),
    data: z.record(z.string(), z.unknown()).optional(),
    source: z.unknown().optional(),
    meta: z.record(z.string(), z.unknown()).optional(),
  })),
});

export type PageBlueprint = z.infer<typeof pageBlueprintSchema>;

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const deepMerge = <T>(baseValue: T, overrideValue: unknown): T => {
  if (Array.isArray(baseValue)) {
    return (Array.isArray(overrideValue) ? overrideValue : baseValue) as T;
  }

  if (isPlainObject(baseValue) && isPlainObject(overrideValue)) {
    const mergedEntries = new Map<string, unknown>();

    for (const [key, value] of Object.entries(baseValue)) {
      mergedEntries.set(key, value);
    }

    for (const [key, value] of Object.entries(overrideValue)) {
      const currentValue = mergedEntries.get(key);
      mergedEntries.set(key, deepMerge(currentValue, value));
    }

    return Object.fromEntries(mergedEntries) as T;
  }

  if (typeof overrideValue !== "undefined") {
    return overrideValue as T;
  }

  return baseValue;
};

const clone = <T,>(value: T): T => structuredClone(value);

export const createPageBuilderSchemaFromBlueprint = (blueprintValue: unknown): PageBuilderSchema => {
  const blueprint = pageBlueprintSchema.parse(blueprintValue);
  const sectionCounts = new Map<string, number>();

  const sections = blueprint.sections.map((sectionBlueprint) => {
    const block = getBlock(sectionBlueprint.block);

    if (!block) {
      throw new Error(`Unknown block key in blueprint: ${sectionBlueprint.block}`);
    }

    const currentCount = (sectionCounts.get(block.blockKey) ?? 0) + 1;
    sectionCounts.set(block.blockKey, currentCount);
    const fallbackId = `${block.blockKey}-${String(currentCount).padStart(2, "0")}`;
    const mergedData = deepMerge(clone(block.defaultData), sectionBlueprint.data ?? {});

    return {
      id: sectionBlueprint.id ?? fallbackId,
      blockKey: block.blockKey,
      blockVersion: block.version,
      variant: sectionBlueprint.variant ?? null,
      enabled: sectionBlueprint.enabled ?? true,
      data: validateBlockData(block.blockKey, mergedData),
      source: typeof sectionBlueprint.source === "undefined"
        ? null
        : validateBlockSource(block.blockKey, sectionBlueprint.source),
      meta: sectionBlueprint.meta ?? {},
    };
  });

  return parsePageBuilderSchema({
    version: 1,
    page: blueprint.page,
    sections,
  });
};
