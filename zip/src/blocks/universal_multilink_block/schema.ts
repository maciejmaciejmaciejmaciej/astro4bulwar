import { createElement } from "react";
import { z } from "zod";

import {
  DEFAULT_FEATURE18_CONTENT,
  Feature18,
  type Feature18Content,
} from "../../components/sections/Feature18";
import { ctaLinkSchema } from "../registry/common";
import type { PageBuilderBlockDefinition } from "../registry/types";

const universalMultilinkCardSchema = z.object({
  meta: z.string().min(1, "Card meta is required."),
  title: z.string().min(1, "Card title is required."),
  description: z.string().min(1, "Card description is required."),
  linkLabel: z.string().min(1, "Card link label is required."),
  linkHref: z.string().min(1, "Card link href is required."),
});

export const universalMultilinkBlockDataSchema = z.object({
  leftColumn: z.object({
    title: z.string().min(1, "Left column title is required."),
    primaryCta: ctaLinkSchema,
  }),
  cards: z.array(universalMultilinkCardSchema).default([]),
});

export type UniversalMultilinkBlockData = Feature18Content;

export const universalMultilinkBlockDefaultData: UniversalMultilinkBlockData =
  universalMultilinkBlockDataSchema.parse(DEFAULT_FEATURE18_CONTENT);

export const universalMultilinkBlockExampleData: readonly UniversalMultilinkBlockData[] = [
  universalMultilinkBlockDefaultData,
  universalMultilinkBlockDataSchema.parse({
    leftColumn: {
      title: "Oferta dnia",
      primaryCta: {
        label: "Poznaj sekcje",
        href: "/oferta",
      },
    },
    cards: [
      {
        meta: "Poniedzialek - piatek",
        title: "Lunch",
        description: "Elastyczny zestaw kart z dynamicznie ustawiana liczba pozycji.",
        linkLabel: "Otworz lunch",
        linkHref: "/menu#lunch",
      },
      {
        meta: "Caly dzien",
        title: "Karta glowna",
        description: "Ten wariant pokazuje, ze cala lewa kolumna i karty sa sterowane trescia.",
        linkLabel: "Zobacz karte",
        linkHref: "/menu",
      },
    ],
  }),
];

export const universalMultilinkBlockDefinition: PageBuilderBlockDefinition<
  typeof universalMultilinkBlockDataSchema
> = {
  blockKey: "universal_multilink_block",
  version: 1,
  name: "Universal Multilink Block",
  description:
    "Editorial two-column feature block with a fully editable left column and a schema-driven collection of linked cards.",
  schema: universalMultilinkBlockDataSchema,
  defaultData: universalMultilinkBlockDefaultData,
  render: {
    kind: "existing-react-component",
    componentName: "Feature18",
    componentImportPath: "src/components/sections/Feature18.tsx",
    notes:
      "Preserves the current Feature18 composition while exposing the left column and card collection through page-builder content.",
  },
  runtime: {
    renderSection: (section) => {
      const data = section.data as UniversalMultilinkBlockData;

      return createElement(Feature18, {
        key: section.id,
        content: data,
      });
    },
  },
  exampleData: universalMultilinkBlockExampleData,
  tags: ["feature", "cards", "links", "content"],
};