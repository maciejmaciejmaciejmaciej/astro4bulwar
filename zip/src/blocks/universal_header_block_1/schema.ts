import { createElement } from "react";
import { z } from "zod";

import {
  DEFAULT_PROJECT5C_CONTENT,
  Project5c,
  type Project5cContent,
} from "../../components/sections/Project5c";
import { ctaLinkSchema, imageAssetSchema } from "../registry/common";
import type { PageBuilderBlockDefinition } from "../registry/types";

export const universalHeaderBlock1DataSchema = z.object({
  eyebrow: z.string().min(1, "Eyebrow is required."),
  title: z.string().min(1, "Title is required."),
  description: z.string().min(1, "Description is required."),
  links: z.array(ctaLinkSchema).default([]),
  gallery: z.object({
    primaryImage: imageAssetSchema,
    secondaryImage: imageAssetSchema,
  }),
  detailSection: z.object({
    title: z.string().min(1, "Detail title is required."),
    body: z.string().min(1, "Detail body is required."),
  }),
});

export type UniversalHeaderBlock1Data = Project5cContent;

export const universalHeaderBlock1DefaultData: UniversalHeaderBlock1Data =
  universalHeaderBlock1DataSchema.parse(DEFAULT_PROJECT5C_CONTENT);

export const universalHeaderBlock1ExampleData: readonly UniversalHeaderBlock1Data[] = [
  universalHeaderBlock1DefaultData,
  universalHeaderBlock1DataSchema.parse({
    eyebrow: "Kolekcja menu",
    title: "Bulwar Degustation",
    description:
      "Content-only header zachowujacy aktualny uklad redakcyjny, liste linkow i dwie fotografie sterowane bezposrednio z danych.",
    links: [
      {
        label: "Menu glowne",
        href: "/menu",
      },
      {
        label: "Wina",
        href: "/winiarnia",
      },
    ],
    gallery: {
      primaryImage: {
        src: "/react/images/home_hero.jpg",
        alt: "Sala restauracji Bulwar",
      },
      secondaryImage: {
        src: "/react/images/about_1.jpg",
        alt: "Detal stolikow i swiatla",
      },
    },
    detailSection: {
      title: "Nastroj",
      body: "Dolna sekcja pozostaje bezposrednio edytowalna i nie zalezy od zadnego zrodla WooCommerce.",
    },
  }),
];

export const universalHeaderBlock1Definition: PageBuilderBlockDefinition<
  typeof universalHeaderBlock1DataSchema
> = {
  blockKey: "universal_header_block_1",
  version: 1,
  name: "Universal Header Block 1",
  description:
    "Editorial header/gallery block with a direct-edit intro column, linked list panel, and a two-image composition.",
  schema: universalHeaderBlock1DataSchema,
  defaultData: universalHeaderBlock1DefaultData,
  render: {
    kind: "existing-react-component",
    componentName: "Project5c",
    componentImportPath: "src/components/sections/Project5c.tsx",
    notes:
      "Preserves the current Project5c layout and motion while making all visible content explicit in the block payload.",
  },
  runtime: {
    renderSection: (section) => {
      const data = section.data as UniversalHeaderBlock1Data;

      return createElement(Project5c, {
        key: section.id,
        content: data,
      });
    },
  },
  exampleData: universalHeaderBlock1ExampleData,
  tags: ["header", "editorial", "gallery", "content"],
};