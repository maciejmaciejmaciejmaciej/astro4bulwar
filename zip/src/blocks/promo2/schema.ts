import { createElement } from "react";
import { z } from "zod";

import {
  DEFAULT_PROMO2_CONTENT,
  Promo2,
  type Promo2Content,
} from "../../../components/Promo2";

import {
  imageAssetSchema,
  menuColumnSchema,
  wooCategorySourceSchema,
} from "../registry/common";
import type { PageBuilderBlockDefinition } from "../registry/types";
import { storyTeamShowcaseMemberSchema } from "../story-team-showcase/schema";

export const promo2SourceSchema = wooCategorySourceSchema;

export const promo2DataSchema = z.object({
  eyebrow: z.string().min(1, "Section eyebrow is required."),
  title: z.string().min(1, "Section title is required."),
  members: z.array(storyTeamShowcaseMemberSchema).min(1, "At least one member is required."),
  story: z.string().min(1, "Story copy is required."),
  image: imageAssetSchema,
  menuColumns: z.array(menuColumnSchema).default([]),
  emptyStateText: z.string().default("Brak pozycji w tej kategorii."),
});

export type Promo2Data = Promo2Content;

export type Promo2Source = z.infer<typeof promo2SourceSchema>;

export const promo2DefaultData: Promo2Data = promo2DataSchema.parse(
  DEFAULT_PROMO2_CONTENT,
);

export const promo2ExampleData: readonly Promo2Data[] = [
  promo2DataSchema.parse(DEFAULT_PROMO2_CONTENT),
  promo2DataSchema.parse({
    eyebrow: "Chef notes",
    title: "Seasonal menu",
    members: [
      {
        icon: "calendar-days",
        name: "Anna Example",
        role: "Guest Experience Lead",
      },
      {
        icon: "utensils-crossed",
        name: "Piotr Example",
        role: "Executive Chef",
      },
    ],
    story:
      "Use this variation when a story-led promo needs an attached menu panel that can either stay manual in page data or resolve dishes from a WooCommerce category.",
    image: {
      src: "/react/images/about_1.jpg",
      alt: "Story-led promo block image",
    },
    menuColumns: [
      {
        items: [
          {
            title: "Duck ravioli",
            description: "Burnt orange, sage",
            priceLabel: "48 zł",
          },
        ],
      },
    ],
    emptyStateText: "Brak pozycji w tej kategorii.",
  }),
];

export const promo2BlockDefinition: PageBuilderBlockDefinition<
  typeof promo2DataSchema,
  typeof promo2SourceSchema
> = {
  blockKey: "promo2",
  version: 1,
  name: "Promo 2",
  description:
    "Story-led promo section with an attached lower menu panel that can resolve dishes from a WooCommerce category.",
  schema: promo2DataSchema,
  defaultData: promo2DefaultData,
  render: {
    kind: "existing-react-component",
    componentName: "Promo2",
    componentImportPath: "components/Promo2.tsx",
    notes:
      "Keeps the current story/promo geometry and attaches a lower menu panel directly below the image.",
  },
  runtime: {
    renderSection: (section) => {
      const data = section.data as Promo2Data;

      return createElement(Promo2, {
        key: section.id,
        content: data,
      });
    },
  },
  sourceSchema: promo2SourceSchema,
  sourceResolver: {
    kind: "woo-resolver",
    supportedSourceTypes: ["woo_category"],
    notes:
      "The top story content and image remain page-schema driven, while the attached lower menu panel resolves product items from a WooCommerce category.",
  },
  exampleData: promo2ExampleData,
  tags: ["promo", "story", "menu", "woo"],
};