import { createElement } from "react";
import { z } from "zod";

import {
  DEFAULT_FEATURE18_SIMPLE_CONTENT,
  Feature18Simple,
  type Feature18SimpleContent,
} from "../../components/sections/Feature18";
import type { PageBuilderBlockDefinition } from "../registry/types";

const universalMultilinkSimpleCardSchema = z.object({
  title: z.string().min(1, "Card title is required."),
  linkLabel: z.string().min(1, "Card link label is required."),
  linkHref: z.string().min(1, "Card link href is required."),
});

const universalMultilinkSimplePrimaryCtaSchema = z.object({
  label: z.string().min(1, "Primary CTA label is required."),
  href: z.string().min(1, "Primary CTA href is required.").optional(),
});

export const universalMultilinkBlockSimpleDataSchema = z.object({
  leftColumn: z.object({
    title: z.string().min(1, "Left column title is required."),
    primaryCta: universalMultilinkSimplePrimaryCtaSchema,
  }),
  cards: z.array(universalMultilinkSimpleCardSchema).default([]),
});

export type UniversalMultilinkBlockSimpleData = Feature18SimpleContent;

export const universalMultilinkBlockSimpleDefaultData: UniversalMultilinkBlockSimpleData =
  universalMultilinkBlockSimpleDataSchema.parse(DEFAULT_FEATURE18_SIMPLE_CONTENT);

export const universalMultilinkBlockSimpleExampleData: readonly UniversalMultilinkBlockSimpleData[] = [
  universalMultilinkBlockSimpleDefaultData,
  universalMultilinkBlockSimpleDataSchema.parse({
    leftColumn: {
      title: "Szybkie linki",
      primaryCta: {
        label: "Dowiedz sie wiecej",
      },
    },
    cards: [
      {
        title: "Lunch dnia",
        linkLabel: "Learn more",
        linkHref: "/menu#lunch-dnia",
      },
      {
        title: "Desery",
        linkLabel: "Learn more",
        linkHref: "/menu#desery",
      },
    ],
  }),
];

export const universalMultilinkBlockSimpleDefinition: PageBuilderBlockDefinition<
  typeof universalMultilinkBlockSimpleDataSchema
> = {
  blockKey: "universal_multilink_block_simple",
  version: 1,
  name: "Universal Multilink Block Simple Version",
  description:
    "Sibling editorial two-column feature block with optional top CTA and reduced cards that only expose the heading and learn-more link.",
  schema: universalMultilinkBlockSimpleDataSchema,
  defaultData: universalMultilinkBlockSimpleDefaultData,
  render: {
    kind: "existing-react-component",
    componentName: "Feature18Simple",
    componentImportPath: "src/components/sections/Feature18.tsx",
    notes:
      "Uses a sibling-specific Feature18Simple renderer so the original universal_multilink_block contract stays unchanged.",
  },
  runtime: {
    renderSection: (section) => {
      const data = section.data as UniversalMultilinkBlockSimpleData;

      return createElement(Feature18Simple, {
        key: section.id,
        content: data,
      });
    },
  },
  exampleData: universalMultilinkBlockSimpleExampleData,
  tags: ["feature", "cards", "links", "content"],
};