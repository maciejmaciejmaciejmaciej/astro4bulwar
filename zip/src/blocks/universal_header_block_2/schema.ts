import { createElement } from "react";
import { z } from "zod";

import {
  DEFAULT_PROJECT10_CONTENT,
  Project10,
  type Project10Content,
} from "../../components/sections/Project10";
import { imageAssetSchema } from "../registry/common";
import type { PageBuilderBlockDefinition } from "../registry/types";

const universalHeaderBlock2MetadataItemSchema = z.object({
  label: z.string().min(1, "Metadata label is required."),
  value: z.string().min(1, "Metadata value is required."),
});

const universalHeaderBlock2ContactCtaSchema = z.object({
  label: z.string().min(1, "CTA label is required."),
  buttonLabel: z.string().min(1, "CTA button label is required."),
  href: z.string().min(1, "CTA href is required."),
});

const universalHeaderBlock2StorySectionSchema = z.object({
  number: z.string().min(1, "Story number is required."),
  title: z.string().min(1, "Story title is required."),
  content: z.string().min(1, "Story content is required."),
});

export const universalHeaderBlock2DataSchema = z.object({
  eyebrow: z.string().min(1, "Eyebrow is required."),
  title: z.string().min(1, "Title is required."),
  description: z.string().min(1, "Description is required."),
  metadataItems: z.array(universalHeaderBlock2MetadataItemSchema).default([]),
  contactCta: universalHeaderBlock2ContactCtaSchema.optional(),
  heroImage: imageAssetSchema,
  storySections: z.array(universalHeaderBlock2StorySectionSchema).default([]),
});

export type UniversalHeaderBlock2Data = Project10Content;

export const universalHeaderBlock2DefaultData: UniversalHeaderBlock2Data =
  universalHeaderBlock2DataSchema.parse(DEFAULT_PROJECT10_CONTENT);

export const universalHeaderBlock2ExampleData: readonly UniversalHeaderBlock2Data[] = [
  universalHeaderBlock2DefaultData,
  universalHeaderBlock2DataSchema.parse({
    eyebrow: "Sesja marki",
    title: "Bulwar Photo Story",
    description:
      "Drugi wariant naglowka zachowuje obecny hero, liste metadanych, CTA i kolejne story rows, ale wszystko pochodzi bezposrednio z content props.",
    metadataItems: [
      {
        label: "Kategoria:",
        value: "Przyjecia okolicznosciowe",
      },
      {
        label: "Kontakt:",
        value: "+48 123 456 789",
      },
    ],
    contactCta: {
      label: "Dostepne terminy:",
      buttonLabel: "wyslij zapytanie",
      href: "/kontakt",
    },
    heroImage: {
      src: "/react/images/home_hero.jpg",
      alt: "Restauracja Bulwar od frontu",
    },
    storySections: [
      {
        number: "01.",
        title: "Inspiration.",
        content: "Pierwsza sekcja opowieci pozostaje w pelni sterowana przez page schema.",
      },
      {
        number: "02.",
        title: "Execution.",
        content: "Kolejne wiersze sa kolekcja danych, wiec ich liczba moze byc zmieniana bez refaktoru komponentu.",
      },
    ],
  }),
];

export const universalHeaderBlock2Definition: PageBuilderBlockDefinition<
  typeof universalHeaderBlock2DataSchema
> = {
  blockKey: "universal_header_block_2",
  version: 1,
  name: "Universal Header Block 2",
  description:
    "Editorial hero/story block with direct-edit metadata, CTA, hero image, and repeatable story rows.",
  schema: universalHeaderBlock2DataSchema,
  defaultData: universalHeaderBlock2DefaultData,
  render: {
    kind: "existing-react-component",
    componentName: "Project10",
    componentImportPath: "src/components/sections/Project10.tsx",
    notes:
      "Preserves the current Project10 motion and geometry while moving all visible content into the block schema.",
  },
  runtime: {
    renderSection: (section) => {
      const data = section.data as UniversalHeaderBlock2Data;

      return createElement(Project10, {
        key: section.id,
        content: data,
      });
    },
  },
  exampleData: universalHeaderBlock2ExampleData,
  tags: ["header", "hero", "story", "content"],
};